(function () {
  let allDinosaurs = [];
  let selectedDinosaur = null;
  let mapCountryFilter = null; // geo name (properties.name) clicked on the choropleth, or null

  const grid = document.getElementById('dino-grid');
  const emptyState = document.getElementById('grid-empty-state');
  const searchInput = document.getElementById('search-input');
  const countryFilter = document.getElementById('country-filter');
  const dietFilter = document.getElementById('diet-filter');
  const weightFilter = document.getElementById('weight-filter');
  const lengthFilter = document.getElementById('length-filter');
  const weightFilterValue = document.getElementById('weight-filter-value');
  const lengthFilterValue = document.getElementById('length-filter-value');
  const clearFiltersButton = document.getElementById('clear-filters');

  function dinoCardHTML(dinosaur) {
    return `
      <button class="dino-card" data-name="${dinosaur.name}">
        <img src="${dinosaur.imageSrc}" alt="${dinosaur.name}"
             onerror="this.onerror=null;this.src='images/placeholder.svg'" />
        <h3>${dinosaur.name}</h3>
        <p>${dinosaur.foundIn} · ${dinosaur.diet}</p>
        <p>${dinosaur.length}m · ${dinosaur.weight}</p>
      </button>
    `;
  }

  function renderGrid(dinosaurs) {
    emptyState.hidden = dinosaurs.length > 0;
    grid.innerHTML = dinosaurs.map(dinoCardHTML).join('');
    grid.querySelectorAll('.dino-card').forEach((card) => {
      card.addEventListener('click', () => selectDinosaur(card.dataset.name));
    });
    highlightSelectedCard();
  }

  function highlightSelectedCard() {
    grid.querySelectorAll('.dino-card').forEach((card) => {
      card.classList.toggle('selected', selectedDinosaur && card.dataset.name === selectedDinosaur.name);
    });
  }

  function populateFilterOptions(dinosaurs) {
    const countries = new Set();
    dinosaurs.forEach((d) => d.foundIn.split(',').forEach((c) => countries.add(c.trim())));
    countryFilter.innerHTML = '<option value="">Country</option>' +
      [...countries].sort().map((c) => `<option value="${c}">${c}</option>`).join('');

    const diets = [...new Set(dinosaurs.map((d) => d.diet))].sort();
    dietFilter.innerHTML = '<option value="">Diet</option>' +
      diets.map((d) => `<option value="${d}">${d}</option>`).join('');

    const weights = dinosaurs.map((d) => d.weight).filter((w) => typeof w === 'number');
    const lengths = dinosaurs.map((d) => d.length).filter((l) => typeof l === 'number');
    weightFilter.max = String(Math.max(...weights));
    lengthFilter.max = String(Math.max(...lengths));
  }

  function applyFilters() {
    let result = filterDinosaurs(allDinosaurs, searchInput.value);

    const country = countryFilter.value;
    if (country) {
      result = result.filter((d) => d.foundIn.split(',').map((c) => c.trim()).includes(country));
    }

    const diet = dietFilter.value;
    if (diet) {
      result = result.filter((d) => d.diet === diet);
    }

    const minWeight = Number(weightFilter.value);
    if (minWeight > 0) {
      result = result.filter((d) => typeof d.weight === 'number' && d.weight >= minWeight);
    }

    const minLength = Number(lengthFilter.value);
    if (minLength > 0) {
      result = result.filter((d) => typeof d.length === 'number' && d.length >= minLength);
    }

    if (mapCountryFilter) {
      result = result.filter((d) => resolveCountryGeoNames(d.foundIn).includes(mapCountryFilter));
    }

    renderGrid(result);
  }

  searchInput.addEventListener('input', applyFilters);
  countryFilter.addEventListener('change', applyFilters);
  dietFilter.addEventListener('change', applyFilters);
  weightFilter.addEventListener('input', () => {
    weightFilterValue.textContent = weightFilter.value;
    applyFilters();
  });
  lengthFilter.addEventListener('input', () => {
    lengthFilterValue.textContent = lengthFilter.value;
    applyFilters();
  });
  clearFiltersButton.addEventListener('click', () => {
    searchInput.value = '';
    countryFilter.value = '';
    dietFilter.value = '';
    weightFilter.value = '0';
    lengthFilter.value = '0';
    weightFilterValue.textContent = '0';
    lengthFilterValue.textContent = '0';
    setMapCountryFilter(null);
  });

  function selectDinosaur(name) {
    selectedDinosaur = allDinosaurs.find((d) => d.name === name) || null;
    highlightSelectedCard();
    renderDetail(selectedDinosaur);
    document.getElementById('detail-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const DETAIL_FIELDS = [
    ['Type', 'typeOfDinosaur'],
    ['Length', (d) => `${d.length}m`],
    ['Weight', 'weight'],
    ['Diet', 'diet'],
    ['Type species', 'typeSpecies'],
    ['Found in', 'foundIn'],
    ['Named by', 'namedBy'],
  ];

  function renderDetail(dinosaur) {
    const placeholder = document.getElementById('detail-placeholder');
    const content = document.getElementById('detail-content');

    if (!dinosaur) {
      placeholder.hidden = false;
      content.hidden = true;
      return;
    }

    placeholder.hidden = true;
    content.hidden = false;

    const detailImage = document.getElementById('detail-image');
    detailImage.src = dinosaur.imageSrc;
    detailImage.alt = dinosaur.name;
    detailImage.onerror = function () {
      this.onerror = null;
      this.src = 'images/placeholder.svg';
    };
    document.getElementById('detail-name').textContent = dinosaur.name;
    document.getElementById('detail-description').textContent = dinosaur.description;
    document.getElementById('detail-when-lived').textContent = `When lived: ${dinosaur.whenLived}`;

    document.getElementById('detail-fields').innerHTML = DETAIL_FIELDS.map(([label, accessor]) => {
      const value = typeof accessor === 'function' ? accessor(dinosaur) : dinosaur[accessor];
      return `<div class="fact-pill"><dt>${label}</dt><dd>${value}</dd></div>`;
    }).join('');

    if (typeof renderTaxonomyTree === 'function') renderTaxonomyTree(dinosaur);
    if (typeof focusMapOnDinosaur === 'function') focusMapOnDinosaur(dinosaur);
  }

  window.selectDinosaur = selectDinosaur;

  const DIET_COLORS = { herbivorous: '#ff5a5a', carnivorous: '#111111', omnivorous: '#e0a72e' };
  const TYPE_COLORS = [
    '#ff5a5a', '#111111', '#e0a72e', '#6b6b6b', '#e14545',
    '#f2a5a5', '#3d3d3d', '#c9c9c9', '#9c1f1f',
  ];

  function describeArc(cx, cy, r, startAngle, endAngle) {
    const toXY = (angle) => [
      cx + r * Math.cos((Math.PI / 180) * angle),
      cy + r * Math.sin((Math.PI / 180) * angle),
    ];
    const [x1, y1] = toXY(startAngle);
    const [x2, y2] = toXY(endAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  }

  function renderPie(svgEl, counts, colorFor, innerHole) {
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const cx = 50, cy = 50, r = 45;
    let angle = 0;
    let svg = '';
    for (const [key, value] of Object.entries(counts)) {
      if (value === 0) continue;
      const sweep = (value / total) * 360;
      svg += `<path d="${describeArc(cx, cy, r, angle, angle + sweep)}" fill="${colorFor(key)}" />`;
      angle += sweep;
    }
    if (innerHole) svg += `<circle cx="${cx}" cy="${cy}" r="22" fill="var(--card-bg)" />`;
    svgEl.innerHTML = svg;
  }

  function renderLegend(listEl, counts, colorFor) {
    listEl.innerHTML = Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([key, count]) => `
        <li><span class="swatch" style="background:${colorFor(key)}"></span>${key} (${count})</li>
      `).join('');
  }

  function renderCharts(dinosaurs) {
    const dietCounts = computeDietCounts(dinosaurs);
    const dietColorFor = (key) => DIET_COLORS[key];
    renderPie(document.getElementById('diet-chart'), dietCounts, dietColorFor, false);
    renderLegend(document.getElementById('diet-legend'), dietCounts, dietColorFor);

    const typeCounts = computeTypeCounts(dinosaurs);
    const typeKeys = Object.keys(typeCounts);
    const typeColorFor = (key) => TYPE_COLORS[typeKeys.indexOf(key) % TYPE_COLORS.length];
    renderPie(document.getElementById('type-chart'), typeCounts, typeColorFor, true);
    renderLegend(document.getElementById('type-legend'), typeCounts, typeColorFor);
  }

  // --- Taxonomy tree: renders only the selected dinosaur's ancestor chain
  // (not the full 75-dinosaur tree) as a left-to-right lineage diagram.
  function renderTaxonomyTree(dinosaur) {
    const path = resolveTaxonomyPath(dinosaur);
    const stepX = 150;
    const cx0 = 60;
    const cy = 50;
    const width = cx0 * 2 + (path.length - 1) * stepX;
    const svg = document.getElementById('taxonomy-tree');
    svg.setAttribute('viewBox', `0 0 ${width} 110`);
    svg.setAttribute('width', width);
    svg.setAttribute('height', 110);

    let markup = '';
    path.forEach((name, i) => {
      const x = cx0 + i * stepX;
      const isLast = i === path.length - 1;
      if (i > 0) {
        markup += `<line class="taxonomy-edge" x1="${x - stepX}" y1="${cy}" x2="${x}" y2="${cy}" />`;
      }
      markup += `<circle class="taxonomy-node-circle${isLast ? ' active' : ''}" cx="${x}" cy="${cy}" r="7" />`;
      markup += `<text class="taxonomy-node-label${isLast ? ' active' : ''}" x="${x}" y="${cy + 28}" text-anchor="middle">${name}</text>`;
    });
    svg.innerHTML = markup;
  }

  // --- Choropleth map (Leaflet + real country GeoJSON) ---
  let leafletMap = null;
  let countryLayer = null;
  let countryCounts = {};
  let selectedCountryLayer = null;

  function choroplethColor(count, maxCount) {
    if (count === 0) return '#f0f0f0';
    const t = maxCount > 0 ? count / maxCount : 0;
    // Interpolate from light coral (#ffd6d6) to deep red (#c81e1e).
    const from = [255, 214, 214];
    const to = [200, 30, 30];
    const rgb = from.map((c, i) => Math.round(c + (to[i] - c) * t));
    return `rgb(${rgb.join(',')})`;
  }

  function styleForFeature(feature) {
    const count = countryCounts[feature.properties.name] || 0;
    const maxCount = Math.max(1, ...Object.values(countryCounts));
    return {
      fillColor: choroplethColor(count, maxCount),
      fillOpacity: count > 0 ? 0.9 : 0.5,
      color: '#ffffff',
      weight: 1,
    };
  }

  function setMapCountryFilter(geoName) {
    mapCountryFilter = mapCountryFilter === geoName ? null : geoName;
    applyFilters();
  }

  function onEachCountryFeature(feature, layer) {
    const count = countryCounts[feature.properties.name] || 0;
    layer.bindTooltip(`${feature.properties.name}: ${count} dinosaur${count === 1 ? '' : 's'}`, {
      className: 'country-tooltip',
    });
    layer.on('click', () => setMapCountryFilter(feature.properties.name));
  }

  function focusMapOnDinosaur(dinosaur) {
    if (!leafletMap || !countryLayer) return;

    if (selectedCountryLayer) {
      countryLayer.resetStyle(selectedCountryLayer);
      selectedCountryLayer = null;
    }

    const geoNames = resolveCountryGeoNames(dinosaur.foundIn);
    if (geoNames.length === 0) return;

    const bounds = [];
    countryLayer.eachLayer((layer) => {
      if (geoNames.includes(layer.feature.properties.name)) {
        layer.setStyle({ color: '#111111', weight: 3 });
        layer.bringToFront();
        bounds.push(layer.getBounds());
        if (!selectedCountryLayer) selectedCountryLayer = layer;
      }
    });

    if (bounds.length > 0) {
      let combined = bounds[0];
      bounds.slice(1).forEach((b) => { combined = combined.extend(b); });
      leafletMap.flyToBounds(combined, { maxZoom: 5, duration: 0.6 });
    }
  }

  function initMap() {
    leafletMap = L.map('world-map', { scrollWheelZoom: true }).setView([15, 10], 1.4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 8,
    }).addTo(leafletMap);

    fetch('data/world-countries.geo.json')
      .then((res) => res.json())
      .then((geo) => {
        countryCounts = computeCountryCounts(allDinosaurs);
        countryLayer = L.geoJSON(geo, { style: styleForFeature, onEachFeature: onEachCountryFeature }).addTo(leafletMap);
      });
  }

  fetch('data/dinosaurs.json')
    .then((res) => res.json())
    .then((dinosaurs) => {
      allDinosaurs = dinosaurs;
      populateFilterOptions(allDinosaurs);
      renderGrid(allDinosaurs);
      if (typeof renderCharts === 'function') renderCharts(allDinosaurs);
      initMap();
    });
})();
