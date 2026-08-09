(function () {
  let allDinosaurs = [];
  let selectedDinosaur = null;
  let mapCountryFilter = null; // geo name (properties.name) clicked on the choropleth, or null

  const listEl = document.getElementById('dino-list');
  const listEmptyState = document.getElementById('list-empty-state');
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const searchClear = document.getElementById('search-clear');
  const suggestionsEl = document.getElementById('search-suggestions');
  const resultCount = document.getElementById('result-count');
  const activeFiltersEl = document.getElementById('active-filters');
  const didYouMean = document.getElementById('did-you-mean');
  const countryFilter = document.getElementById('country-filter');
  const dietFilter = document.getElementById('diet-filter');
  // The type <select> IS the type-filter state — the pie chart writes to it rather
  // than holding a parallel variable, so the two can never disagree.
  const typeFilter = document.getElementById('type-filter');
  const weightFilter = document.getElementById('weight-filter');
  const lengthFilter = document.getElementById('length-filter');
  const weightValue = document.getElementById('weight-value');
  const lengthValue = document.getElementById('length-value');
  const clearFiltersButton = document.getElementById('clear-filters');
  const selectFilters = [countryFilter, typeFilter, dietFilter];

  function truncate(text, max) {
    if (!text) return '';
    return text.length > max ? `${text.slice(0, max).trim()}…` : text;
  }

  function listItemHTML(dinosaur) {
    const isSelected = selectedDinosaur && dinosaur.name === selectedDinosaur.name;
    return `
      <li class="${isSelected ? 'selected' : ''}" data-name="${dinosaur.name}">
        <img src="${dinosaur.imageSrc}" alt="${dinosaur.name}"
             onerror="this.onerror=null;this.src='images/placeholder.svg'" />
        <div class="list-item-text">
          <h3>${dinosaur.name}</h3>
          <p>${truncate(dinosaur.description, 70)}</p>
        </div>
      </li>
    `;
  }

  function renderList(dinosaurs) {
    listEmptyState.hidden = dinosaurs.length > 0;
    listEl.innerHTML = dinosaurs.map(listItemHTML).join('');
    listEl.querySelectorAll('li').forEach((li) => {
      li.addEventListener('click', () => selectDinosaur(li.dataset.name));
    });
  }

  function populateFilterOptions(dinosaurs) {
    const countries = new Set();
    dinosaurs.forEach((d) => d.foundIn.split(',').forEach((c) => countries.add(c.trim())));
    countryFilter.innerHTML = '<option value="">All</option>' +
      [...countries].sort().map((c) => `<option value="${c}">${c}</option>`).join('');

    const diets = [...new Set(dinosaurs.map((d) => d.diet))].sort();
    dietFilter.innerHTML = '<option value="">All</option>' +
      diets.map((d) => `<option value="${d}">${d}</option>`).join('');

    const types = [...new Set(dinosaurs.map((d) => d.typeOfDinosaur))].filter(Boolean).sort();
    typeFilter.innerHTML = '<option value="">All</option>' +
      types.map((t) => `<option value="${t}">${t}</option>`).join('');

    const weights = dinosaurs.map((d) => d.weight).filter((w) => typeof w === 'number');
    const lengths = dinosaurs.map((d) => d.length).filter((l) => typeof l === 'number');
    weightFilter.max = String(Math.max(...weights));
    lengthFilter.max = String(Math.max(...lengths));
  }

  // Keeps the range readouts and the "this select is filtering" styling in step
  // with whatever changed the controls — user input, a chart click, or a chip ×.
  function syncFilterControls() {
    weightValue.textContent = Number(weightFilter.value) > 0 ? `${weightFilter.value} kg` : 'Any';
    lengthValue.textContent = Number(lengthFilter.value) > 0 ? `${lengthFilter.value} m` : 'Any';
    selectFilters.forEach((el) => el.classList.toggle('is-active', Boolean(el.value)));
  }

  // Applies every filter, optionally skipping one dimension. Each cross-filtered
  // view is fed "everything but me": otherwise clicking a country would recolour
  // the map down to that single country, and clicking a pie slice would collapse
  // its own chart to a single wedge with nothing left to click.
  function filterDinosaurs({ skipMap = false, skipDiet = false, skipType = false } = {}) {
    let result = searchDinosaurs(allDinosaurs, searchInput.value);

    const country = countryFilter.value;
    if (country) {
      result = result.filter((d) => d.foundIn.split(',').map((c) => c.trim()).includes(country));
    }

    if (!skipDiet && dietFilter.value) {
      result = result.filter((d) => d.diet === dietFilter.value);
    }

    if (!skipType && typeFilter.value) {
      result = result.filter((d) => d.typeOfDinosaur === typeFilter.value);
    }

    const minWeight = Number(weightFilter.value);
    if (minWeight > 0) {
      result = result.filter((d) => typeof d.weight === 'number' && d.weight >= minWeight);
    }

    const minLength = Number(lengthFilter.value);
    if (minLength > 0) {
      result = result.filter((d) => typeof d.length === 'number' && d.length >= minLength);
    }

    if (!skipMap && mapCountryFilter) {
      result = result.filter((d) => resolveCountryGeoNames(d.foundIn).includes(mapCountryFilter));
    }

    return result;
  }

  function applyFilters() {
    if (typeof updateMapDensity === 'function') updateMapDensity(filterDinosaurs({ skipMap: true }));

    const result = filterDinosaurs();

    renderList(result);
    if (typeof renderCharts === 'function') {
      renderCharts(filterDinosaurs({ skipDiet: true }), filterDinosaurs({ skipType: true }));
    }
    renderResultBar(result);
    syncSearchClearButton();
    syncFilterControls();
  }

  // --- Result count, active filter chips, and empty-state recovery ---

  function activeFilters() {
    const chips = [];
    if (searchInput.value.trim()) {
      chips.push({ label: `“${searchInput.value.trim()}”`, clear: () => { searchInput.value = ''; } });
    }
    if (countryFilter.value) {
      chips.push({ label: countryFilter.value, clear: () => { countryFilter.value = ''; } });
    }
    if (dietFilter.value) {
      chips.push({ label: dietFilter.value, clear: () => { dietFilter.value = ''; } });
    }
    if (Number(weightFilter.value) > 0) {
      chips.push({ label: `≥ ${weightFilter.value} kg`, clear: () => { weightFilter.value = '0'; } });
    }
    if (Number(lengthFilter.value) > 0) {
      chips.push({ label: `≥ ${lengthFilter.value} m`, clear: () => { lengthFilter.value = '0'; } });
    }
    if (mapCountryFilter) {
      chips.push({ label: `Map: ${mapCountryFilter}`, clear: () => { mapCountryFilter = null; } });
    }
    if (typeFilter.value) {
      chips.push({ label: `Type: ${typeFilter.value}`, clear: () => { typeFilter.value = ''; } });
    }
    return chips;
  }

  function renderResultBar(result) {
    const total = allDinosaurs.length;
    resultCount.innerHTML = result.length === total
      ? `Showing all <strong>${total}</strong> dinosaurs`
      : `Showing <strong>${result.length}</strong> of ${total} dinosaurs`;

    const chips = activeFilters();
    activeFiltersEl.innerHTML = chips
      .map((chip, i) => `
        <span class="active-filter">${chip.label}
          <button type="button" data-chip="${i}" aria-label="Remove filter ${chip.label}">×</button>
        </span>`)
      .join('');
    activeFiltersEl.querySelectorAll('button[data-chip]').forEach((button) => {
      button.addEventListener('click', () => {
        chips[Number(button.dataset.chip)].clear();
        applyFilters();
      });
    });

    renderEmptyState(result);
  }

  function renderEmptyState(result) {
    if (result.length > 0) return;
    const query = searchInput.value.trim();
    const correction = query ? suggestCorrection(allDinosaurs, query) : null;

    if (correction) {
      didYouMean.hidden = false;
      didYouMean.innerHTML =
        `Did you mean <button type="button">${correction}</button>?`;
      didYouMean.querySelector('button').addEventListener('click', () => {
        searchInput.value = correction;
        hideSuggestions();
        applyFilters();
      });
    } else {
      didYouMean.hidden = true;
      didYouMean.textContent = '';
    }
  }

  function clearAllFilters() {
    searchInput.value = '';
    countryFilter.value = '';
    dietFilter.value = '';
    weightFilter.value = '0';
    lengthFilter.value = '0';
    mapCountryFilter = null;
    typeFilter.value = '';
    hideSuggestions();
    applyFilters();
  }

  // --- Autocomplete ---

  let suggestions = [];
  let activeSuggestion = -1;

  function hideSuggestions() {
    suggestions = [];
    activeSuggestion = -1;
    suggestionsEl.hidden = true;
    suggestionsEl.innerHTML = '';
    searchInput.setAttribute('aria-expanded', 'false');
  }

  function highlightMatch(value, query) {
    const haystack = normalizeText(value);
    const needle = normalizeText(query);
    const at = haystack.indexOf(needle);
    if (at < 0 || !needle) return value;
    return `${value.slice(0, at)}<mark>${value.slice(at, at + needle.length)}</mark>${value.slice(at + needle.length)}`;
  }

  function renderSuggestions() {
    if (suggestions.length === 0) { hideSuggestions(); return; }
    const query = searchInput.value.trim();
    suggestionsEl.innerHTML = suggestions.map((s, i) => `
      <li role="option" data-index="${i}" aria-selected="${i === activeSuggestion}">
        <span>${highlightMatch(s.value, query)}</span>
        <span class="suggestion-kind">${s.kind}</span>
      </li>`).join('');
    suggestionsEl.hidden = false;
    searchInput.setAttribute('aria-expanded', 'true');

    suggestionsEl.querySelectorAll('li').forEach((li) => {
      li.addEventListener('mousedown', (event) => {
        event.preventDefault(); // keep focus in the input
        chooseSuggestion(Number(li.dataset.index));
      });
    });
  }

  // Picking a facet suggestion drives the matching dropdown rather than the
  // free-text box: choosing the country "Mongolia" should behave exactly like
  // selecting it from the Country filter.
  function chooseSuggestion(index) {
    const suggestion = suggestions[index];
    if (!suggestion) return;

    if (suggestion.kind === 'country') {
      searchInput.value = '';
      countryFilter.value = suggestion.value;
    } else if (suggestion.kind === 'diet') {
      searchInput.value = '';
      dietFilter.value = suggestion.value;
    } else {
      searchInput.value = suggestion.value;
    }

    hideSuggestions();
    applyFilters();

    if (suggestion.kind === 'name') selectDinosaur(suggestion.value);
  }

  function updateSuggestions() {
    const query = searchInput.value.trim();
    if (!query) { hideSuggestions(); return; }
    suggestions = suggestCompletions(allDinosaurs, query, 8);
    activeSuggestion = -1;
    renderSuggestions();
  }

  function moveActiveSuggestion(step) {
    if (suggestions.length === 0) return;
    activeSuggestion = (activeSuggestion + step + suggestions.length) % suggestions.length;
    renderSuggestions();
    const el = suggestionsEl.querySelector(`li[data-index="${activeSuggestion}"]`);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }

  function syncSearchClearButton() {
    searchClear.hidden = searchInput.value.length === 0;
  }

  searchInput.addEventListener('input', () => {
    updateSuggestions();
    applyFilters();
  });

  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); moveActiveSuggestion(1); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); moveActiveSuggestion(-1); }
    else if (event.key === 'Enter') {
      if (activeSuggestion >= 0) { event.preventDefault(); chooseSuggestion(activeSuggestion); }
      else hideSuggestions();
    } else if (event.key === 'Escape') {
      if (!suggestionsEl.hidden) hideSuggestions();
      else { searchInput.value = ''; applyFilters(); }
    }
  });

  searchInput.addEventListener('focus', updateSuggestions);
  searchInput.addEventListener('blur', () => setTimeout(hideSuggestions, 120));

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    hideSuggestions();
    applyFilters();
    searchInput.focus();
  });

  searchButton.addEventListener('click', () => { hideSuggestions(); applyFilters(); });
  countryFilter.addEventListener('change', applyFilters);
  dietFilter.addEventListener('change', applyFilters);
  typeFilter.addEventListener('change', applyFilters);
  weightFilter.addEventListener('input', applyFilters);
  lengthFilter.addEventListener('input', applyFilters);
  clearFiltersButton.addEventListener('click', clearAllFilters);
  document.querySelector('[data-clear-all]').addEventListener('click', clearAllFilters);

  function selectDinosaur(name) {
    selectedDinosaur = allDinosaurs.find((d) => d.name === name) || null;
    listEl.querySelectorAll('li').forEach((li) => {
      li.classList.toggle('selected', selectedDinosaur && li.dataset.name === selectedDinosaur.name);
    });
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
    document.getElementById('detail-when-lived').textContent = dinosaur.whenLived;

    document.getElementById('detail-fields').innerHTML = DETAIL_FIELDS.map(([label, accessor]) => {
      const value = typeof accessor === 'function' ? accessor(dinosaur) : dinosaur[accessor];
      return `<div class="fact-pill"><dt>${label}</dt><dd>${value}</dd></div>`;
    }).join('');

    if (typeof renderTaxonomyTree === 'function') renderTaxonomyTree(dinosaur);
    if (typeof focusMapOnDinosaur === 'function') focusMapOnDinosaur(dinosaur);
  }

  window.selectDinosaur = selectDinosaur;

  // Multi-hue pastel palette, matching the shipped design's chart legends.
  // Chart colours are CSS custom properties, so switching theme restyles the
  // SVGs without re-rendering them.
  const DIET_COLORS = {
    herbivorous: 'var(--chart-herb)',
    carnivorous: 'var(--chart-carn)',
    omnivorous: 'var(--chart-omni)',
    unknown: 'var(--chart-unknown)',
  };
  const TYPE_COLORS = [
    'var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)',
    'var(--chart-4)', 'var(--chart-5)', 'var(--chart-6)',
    'var(--chart-7)', 'var(--chart-8)', 'var(--chart-9)',
  ];

  // A type's colour must not shift as filters change, so the mapping is keyed off
  // the full dataset's type ordering rather than whatever subset is on screen.
  let stableTypeKeys = null;
  function typeColorFor(key) {
    if (!stableTypeKeys) stableTypeKeys = Object.keys(computeTypeCounts(allDinosaurs)).sort();
    const index = stableTypeKeys.indexOf(key);
    return TYPE_COLORS[(index < 0 ? 0 : index) % TYPE_COLORS.length];
  }

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
      svg += `<path data-key="${key}" d="${describeArc(cx, cy, r, angle, angle + sweep)}" fill="${colorFor(key)}" style="cursor:pointer;transition:opacity 0.15s" />`;
      angle += sweep;
    }
    if (innerHole) svg += `<circle cx="${cx}" cy="${cy}" r="22" fill="var(--surface)" />`;
    svgEl.innerHTML = svg;
  }

  function renderLegend(listEl, counts, colorFor) {
    listEl.innerHTML = Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([key, count]) => `
        <li data-key="${key}" style="cursor:pointer;transition:opacity 0.15s"><span class="swatch" style="background:${colorFor(key)}"></span>${key} (${count})</li>
      `).join('');
  }

  function applyChartOpacity(svgEl, legendEl, activeKey) {
    const hasFilter = Boolean(activeKey);
    svgEl.querySelectorAll('[data-key]').forEach((el) => {
      el.style.opacity = hasFilter && el.dataset.key !== activeKey ? '0.3' : '1';
    });
    legendEl.querySelectorAll('[data-key]').forEach((el) => {
      el.style.opacity = hasFilter && el.dataset.key !== activeKey ? '0.3' : '1';
    });
  }

  function renderCharts(dietBase, typeBase) {
    const dietCounts = computeDietCounts(dietBase);
    const dietColorFor = (key) => DIET_COLORS[key];
    const dietSvg = document.getElementById('diet-chart');
    const dietLegend = document.getElementById('diet-legend');
    renderPie(dietSvg, dietCounts, dietColorFor, true);
    renderLegend(dietLegend, dietCounts, dietColorFor);
    applyChartOpacity(dietSvg, dietLegend, dietFilter.value);
    dietSvg.querySelectorAll('[data-key]').forEach((el) => {
      el.addEventListener('click', () => {
        dietFilter.value = dietFilter.value === el.dataset.key ? '' : el.dataset.key;
        applyFilters();
      });
    });
    dietLegend.querySelectorAll('[data-key]').forEach((el) => {
      el.addEventListener('click', () => {
        dietFilter.value = dietFilter.value === el.dataset.key ? '' : el.dataset.key;
        applyFilters();
      });
    });

    const typeCounts = computeTypeCounts(typeBase);
    const typeSvg = document.getElementById('type-chart');
    const typeLegend = document.getElementById('type-legend');
    renderPie(typeSvg, typeCounts, typeColorFor, false);
    renderLegend(typeLegend, typeCounts, typeColorFor);
    applyChartOpacity(typeSvg, typeLegend, typeFilter.value);
    typeSvg.querySelectorAll('[data-key]').forEach((el) => {
      el.addEventListener('click', () => {
        typeFilter.value = typeFilter.value === el.dataset.key ? '' : el.dataset.key;
        applyFilters();
      });
    });
    typeLegend.querySelectorAll('[data-key]').forEach((el) => {
      el.addEventListener('click', () => {
        typeFilter.value = typeFilter.value === el.dataset.key ? '' : el.dataset.key;
        applyFilters();
      });
    });
  }

  // --- Taxonomy tree: a pruned lineage diagram for the selected dinosaur —
  // the selected dinosaur's ancestor chain in teal, sibling clades shown
  // collapsed (not expanded) beside each step, ported from the design's
  // dino_studio_case_study/visuals/dino-taxonomy.html reference build.
  let cachedTaxonomyRoot = null; // the "Dinosauria" node (skips the synthetic root)

  function findOnPath(root, dinosaurName) {
    const onPath = new Set();
    let leaf = null;
    (function dfs(node) {
      if (node.isLeaf && Object.keys(node.children).length === 0) {
        if (node.name === dinosaurName) { onPath.add(node); leaf = node; return true; }
        return false;
      }
      for (const child of Object.values(node.children)) {
        if (dfs(child)) { onPath.add(node); return true; }
      }
      return false;
    })(root);
    return { onPath, leaf };
  }

  function sortedChildren(node) {
    return Object.values(node.children).sort((a, b) => {
      const aLeaf = Object.keys(a.children).length === 0;
      const bLeaf = Object.keys(b.children).length === 0;
      if (aLeaf !== bLeaf) return aLeaf ? 1 : -1;
      return a.name.localeCompare(b.name);
    });
  }

  function buildPrunedView(node, onPath, leaf) {
    const isLeafNode = Object.keys(node.children).length === 0;
    const on = onPath.has(node);
    const sel = node === leaf;
    const view = { name: node.name, isLeafNode, on, sel, children: [] };
    for (const child of sortedChildren(node)) {
      if (onPath.has(child)) {
        view.children.push(buildPrunedView(child, onPath, leaf));
      } else {
        const childIsLeaf = Object.keys(child.children).length === 0;
        view.children.push({ name: child.name, isLeafNode: childIsLeaf, on: false, sel: false, children: [] });
      }
    }
    return view;
  }

  function nodeClass(v) {
    if (v.sel) return 'sel';
    if (v.on) return 'path';
    if (v.isLeafNode) return 'dino';
    return 'sib';
  }

  function boxWidth(name, fontSize) {
    return Math.max(56, name.length * (fontSize * 0.6) + 22);
  }

  function renderTaxonomyTree(dinosaur) {
    if (!cachedTaxonomyRoot) {
      const fullTree = buildTaxonomyTree(allDinosaurs);
      cachedTaxonomyRoot = fullTree.children['Dinosauria'];
    }

    const { onPath, leaf } = findOnPath(cachedTaxonomyRoot, dinosaur.name);
    const view = buildPrunedView(cachedTaxonomyRoot, onPath, leaf);

    const fontSize = 12, yGap = 92, boxHeight = 26, marginX = 30, marginY = 22, slot = 182;
    let maxDepth = 0;

    (function place(v, depth, xAnchor) {
      v.depth = depth;
      v.cx = xAnchor;
      v.width = boxWidth(v.name, fontSize);
      maxDepth = Math.max(maxDepth, depth);
      if (v.children.length) {
        let pivotIndex = v.children.findIndex((c) => c.on);
        if (pivotIndex < 0) pivotIndex = (v.children.length - 1) / 2;
        v.children.forEach((c, i) => place(c, depth + 1, xAnchor + (i - pivotIndex) * slot));
      }
    })(view, 0, 0);

    let minX = Infinity, maxX = -Infinity;
    (function bounds(v) {
      minX = Math.min(minX, v.cx - v.width / 2);
      maxX = Math.max(maxX, v.cx + v.width / 2);
      v.children.forEach(bounds);
    })(view);

    const offsetX = marginX - minX;
    const width = (maxX - minX) + marginX * 2;
    const height = marginY * 2 + maxDepth * yGap + boxHeight;
    const X = (v) => v.cx + offsetX;
    const Y = (v) => marginY + v.depth * yGap + boxHeight / 2;

    let edgesSvg = '';
    (function drawEdges(v) {
      const parentY = Y(v) + boxHeight / 2;
      for (const c of v.children) {
        const childY = Y(c) - boxHeight / 2;
        const onEdge = c.on;
        edgesSvg += `<line x1="${X(v)}" y1="${parentY}" x2="${X(c)}" y2="${childY}" stroke="${onEdge ? 'var(--path-line)' : 'var(--sib-line)'}" stroke-width="${onEdge ? 2 : 1.2}" />`;
        drawEdges(c);
      }
    })(view);

    let boxesSvg = '';
    (function drawBoxes(v) {
      const cx = X(v), cy = Y(v), cls = nodeClass(v);
      const stroke = cls === 'path' || cls === 'sel' ? 'var(--path-line)' : cls === 'dino' ? 'var(--dino-stroke)' : 'var(--sib-line)';
      const fill = cls === 'path' || cls === 'sel' ? 'var(--path-fill)' : cls === 'dino' ? 'var(--dino-fill)' : 'var(--sib-fill)';
      boxesSvg += `<rect x="${cx - v.width / 2}" y="${cy - boxHeight / 2}" width="${v.width}" height="${boxHeight}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="${cls === 'sel' ? 2.4 : 1.5}" />`;
      boxesSvg += `<text class="tx-box-label ${cls}" x="${cx}" y="${cy + fontSize * 0.35}" text-anchor="middle">${v.name}</text>`;
      v.children.forEach(drawBoxes);
    })(view);

    const container = document.getElementById('taxonomy-tree');
    container.innerHTML = `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${edgesSvg}${boxesSvg}</svg>`;
  }

  // --- Choropleth map (Leaflet + real country GeoJSON, colored by density —
  // no basemap tiles, matching the shipped design's flat map style) ---
  let leafletMap = null;
  let countryLayer = null;
  let countryCounts = {};
  let selectedCountryLayer = null;

  const MAP_SCALE_STEPS = [10, 20, 40, 60, 80, 100];

  // Leaflet paints to canvas, so it can't consume var() the way the SVG charts
  // do — the ramp endpoints are read back from the active theme instead.
  function themeToken(name, fallback) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }
  function mapRamp() {
    const parse = (n, fb) => themeToken(n, fb).split(',').map((v) => Number(v.trim()));
    return { from: parse('--map-from', '20,55,35'), to: parse('--map-to', '86,160,107') };
  }

  function choroplethColor(count, maxCount) {
    if (count === 0) return themeToken('--map-void', '#0a1a10');
    const { from, to } = mapRamp();
    const t = maxCount > 0 ? Math.min(1, count / maxCount) : 0;
    const rgb = from.map((c, i) => Math.round(c + (to[i] - c) * t));
    return `rgb(${rgb.join(',')})`;
  }

  function renderMapLegend(maxCount) {
    const legend = document.getElementById('map-legend');
    legend.innerHTML = MAP_SCALE_STEPS
      .filter((step) => step <= Math.max(maxCount, 10))
      .map((step) => `<span class="swatch" style="background:${choroplethColor(step, maxCount)}"></span>${step}`)
      .join('');
  }

  function styleForFeature(feature) {
    const count = countryCounts[feature.properties.name] || 0;
    const maxCount = Math.max(1, ...Object.values(countryCounts));
    return {
      fillColor: choroplethColor(count, maxCount),
      fillOpacity: 1,
      color: themeToken('--map-border', 'rgba(255,255,255,0.10)'),
      weight: 1,
    };
  }

  function setMapCountryFilter(geoName) {
    mapCountryFilter = mapCountryFilter === geoName ? null : geoName;
    applyFilters();
  }

  function onEachCountryFeature(feature, layer) {
    layer.bindTooltip('', { className: 'country-tooltip' });
    layer.on('click', () => setMapCountryFilter(feature.properties.name));
  }

  // Recolors the choropleth (and its tooltips/legend) to reflect a filtered
  // subset of dinosaurs, keeping the map, charts, and list cross-filtered
  // together. Only touches fillColor/fillOpacity, so it never disturbs the
  // selected-dinosaur border highlight set by focusMapOnDinosaur.
  function updateMapDensity(dinosaurs) {
    countryCounts = computeCountryCounts(dinosaurs);
    const maxCount = Math.max(1, ...Object.values(countryCounts));
    renderMapLegend(maxCount);

    if (!countryLayer) return;
    countryLayer.eachLayer((layer) => {
      const name = layer.feature.properties.name;
      const count = countryCounts[name] || 0;
      layer.setStyle({ fillColor: choroplethColor(count, maxCount), fillOpacity: 1 });
      layer.setTooltipContent(`${name}: ${count} dinosaur${count === 1 ? '' : 's'}`);
    });
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
        layer.setStyle({ color: themeToken('--accent', '#d4a048'), weight: 2 });
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
    leafletMap = L.map('world-map', {
      scrollWheelZoom: true,
      zoomControl: true,
      attributionControl: false,
      worldCopyJump: false,
      maxBounds: [[-90, -180], [90, 180]],
      maxBoundsViscosity: 1,
      preferCanvas: true,
      zoomAnimation: false,
      markerZoomAnimation: false,
      fadeAnimation: false,
    }).setView([15, 10], 2);

    fetch('data/world-countries.geo.json')
      .then((res) => res.json())
      .then((geo) => {
        countryCounts = computeCountryCounts(allDinosaurs);
        countryLayer = L.geoJSON(geo, { style: styleForFeature, onEachFeature: onEachCountryFeature }).addTo(leafletMap);
        renderMapLegend(Math.max(1, ...Object.values(countryCounts)));
        // Leaflet can measure the container before the surrounding flex/grid
        // layout has settled, leaving a stale partial paint. Forcing a
        // remeasure+redraw on the next frame clears it.
        requestAnimationFrame(() => leafletMap.invalidateSize());
        // Exposed for manual/automated visual checks in the browser console.
        window.dinoStudio = { map: leafletMap, countryLayer };
      });
  }

  // --- Theme toggle. The initial theme is set by an inline script in <head>
  // so it lands before first paint; this only handles user switches. ---
  function syncThemeToggle() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    toggle.setAttribute('aria-pressed', String(isLight));
    toggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    document.getElementById('theme-toggle-label').textContent = isLight ? 'Dark' : 'Light';
  }

  function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    syncThemeToggle();
    toggle.addEventListener('click', () => {
      const nowLight = document.documentElement.getAttribute('data-theme') !== 'light';
      if (nowLight) document.documentElement.setAttribute('data-theme', 'light');
      else document.documentElement.removeAttribute('data-theme');
      try { localStorage.setItem('dino-theme', nowLight ? 'light' : 'dark'); } catch (e) { /* private mode */ }
      syncThemeToggle();
      // Charts/tree follow var() automatically; the Leaflet canvas does not.
      if (countryLayer) {
        countryLayer.setStyle(styleForFeature);
        if (selectedDinosaur) focusMapOnDinosaur(selectedDinosaur);
      }
      applyFilters();
    });
  }

  fetch('data/dinosaurs.json')
    .then((res) => res.json())
    .then((dinosaurs) => {
      allDinosaurs = dinosaurs;
      populateFilterOptions(allDinosaurs);
      renderList(allDinosaurs);
      if (typeof renderCharts === 'function') renderCharts(allDinosaurs, allDinosaurs);
      renderResultBar(allDinosaurs);
      syncSearchClearButton();
      syncFilterControls();
      initMap();
      initThemeToggle();
    });
})();
