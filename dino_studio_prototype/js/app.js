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
  window.selectDinosaur = selectDinosaur;
  function renderDetail() {}

  fetch('data/dinosaurs.json')
    .then((res) => res.json())
    .then((dinosaurs) => {
      allDinosaurs = dinosaurs;
      renderGrid(allDinosaurs);
      if (typeof renderCharts === 'function') renderCharts(allDinosaurs);
    });
})();
