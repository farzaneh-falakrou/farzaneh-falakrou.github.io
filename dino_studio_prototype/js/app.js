// dino_studio_prototype/js/app.js
(function () {
  let allDinosaurs = [];
  let selectedDinosaur = null;

  const grid = document.getElementById('dino-grid');
  const emptyState = document.getElementById('grid-empty-state');
  const searchInput = document.getElementById('search-input');

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

  function handleSearch() {
    const filtered = filterDinosaurs(allDinosaurs, searchInput.value);
    renderGrid(filtered);
  }

  searchInput.addEventListener('input', handleSearch);

  function selectDinosaur(name) {
    selectedDinosaur = allDinosaurs.find((d) => d.name === name) || null;
    highlightSelectedCard();
    renderDetail(selectedDinosaur);
    document.getElementById('detail-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // renderDetail, renderCharts, renderTaxonomyTree, renderMap are added in later tasks.
  // Declared here as no-ops so this task is independently testable in a browser.
  const DETAIL_FIELDS = [
    ['Type', 'typeOfDinosaur'],
    ['Length', (d) => `${d.length}m`],
    ['Weight', 'weight'],
    ['Diet', 'diet'],
    ['When lived', 'whenLived'],
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

    document.getElementById('detail-image').src = dinosaur.imageSrc;
    document.getElementById('detail-image').alt = dinosaur.name;
    document.getElementById('detail-image').onerror = function () {
      this.onerror = null;
      this.src = 'images/placeholder.svg';
    };
    document.getElementById('detail-name').textContent = dinosaur.name;
    document.getElementById('detail-description').textContent = dinosaur.description;

    document.getElementById('detail-fields').innerHTML = DETAIL_FIELDS.map(([label, accessor]) => {
      const value = typeof accessor === 'function' ? accessor(dinosaur) : dinosaur[accessor];
      return `<dt>${label}</dt><dd>${value}</dd>`;
    }).join('');

    if (typeof renderTaxonomyTree === 'function') renderTaxonomyTree(dinosaur);
    if (typeof renderMap === 'function') renderMap(dinosaur);
  }

  window.selectDinosaur = selectDinosaur;

  const DIET_COLORS = { herbivorous: '#2e4d3e', carnivorous: '#c96f4a', omnivorous: '#d8b04a' };
  const TYPE_COLORS = [
    '#2e4d3e', '#c96f4a', '#d8b04a', '#6b8f71', '#a85c3b',
    '#e0c987', '#4c6b57', '#b98a5e', '#8a7b4f',
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
    if (innerHole) svg += `<circle cx="${cx}" cy="${cy}" r="22" fill="var(--sand)" />`;
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

  fetch('data/dinosaurs.json')
    .then((res) => res.json())
    .then((dinosaurs) => {
      allDinosaurs = dinosaurs;
      renderGrid(allDinosaurs);
      if (typeof renderCharts === 'function') renderCharts(allDinosaurs);
    });
  let cachedTaxonomyTree = null;

  function renderTaxonomyTree(selectedDino) {
    if (!cachedTaxonomyTree) cachedTaxonomyTree = buildTaxonomyTree(allDinosaurs);
    const activePath = resolveTaxonomyPath(selectedDino);

    function renderNode(node, depth) {
      const pathIndex = depth - 1;
      const isActive = pathIndex >= 0 && pathIndex < activePath.length && node.name === activePath[pathIndex];
      const childrenEntries = Object.values(node.children);
      const childrenHTML = childrenEntries
        .map((child) => renderNode(child, depth + 1))
        .join('');
      const cssClass = depth === 0 ? '' : `branch ${isActive ? 'active' : 'dim'}`;
      const label = depth === 0 ? '' : `<div>${node.name}</div>`;
      return `<div class="${cssClass}">${label}${childrenHTML}</div>`;
    }

    document.getElementById('taxonomy-tree').innerHTML = renderNode(cachedTaxonomyTree, 0);
  }

  function renderWorldMapBase() {
    // Simplified continent silhouettes (rough blobs, not survey-accurate),
    // drawn once against the 100x60 viewBox used by #world-map in index.html.
    return `
      <path d="M8,20 Q20,10 32,18 Q30,28 18,30 Q10,28 8,20 Z" fill="#cfe0d1" />
      <path d="M22,32 Q30,30 34,40 Q30,50 24,48 Q20,40 22,32 Z" fill="#cfe0d1" />
      <path d="M45,15 Q60,8 65,18 Q62,28 50,26 Q44,22 45,15 Z" fill="#cfe0d1" />
      <path d="M46,28 Q54,26 56,38 Q52,48 48,44 Q44,36 46,28 Z" fill="#cfe0d1" />
      <path d="M62,15 Q80,10 88,20 Q84,30 68,28 Q62,22 62,15 Z" fill="#cfe0d1" />
      <path d="M78,42 Q90,38 94,46 Q88,52 80,50 Q76,46 78,42 Z" fill="#cfe0d1" />
    `;
  }

  function renderMap(selectedDino) {
    const svg = document.getElementById('world-map');
    const positions = resolveCountryPositions(selectedDino.foundIn);
    const dots = positions.map(({ x, y }) =>
      `<circle cx="${x}" cy="${y * 0.6}" r="1.6" fill="#c96f4a" stroke="#fff" stroke-width="0.4" />`
    ).join('');
    svg.innerHTML = renderWorldMapBase() + dots;

    const carousel = document.getElementById('carousel');
    carousel.innerHTML = allDinosaurs.map((d) => `
      <img src="${d.imageSrc}" alt="${d.name}" data-name="${d.name}"
           class="${d.name === selectedDino.name ? 'selected' : ''}"
           onerror="this.onerror=null;this.src='images/placeholder.svg'" />
    `).join('');
    carousel.querySelectorAll('img').forEach((img) => {
      img.addEventListener('click', () => selectDinosaur(img.dataset.name));
    });
  }

})();
