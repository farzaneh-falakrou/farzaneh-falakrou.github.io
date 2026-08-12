(function () {
  let allDinosaurs = [];
  let selectedDinosaur = null;
  let mapCountryFilter = null; // geo name (properties.name) clicked on the choropleth, or null
  let cladeFilter = null; // clade name clicked in the taxonomy ladder, or null
  let weightSteps = []; // sorted distinct known weights; the slider indexes into this
  let lengthSteps = []; // sorted distinct known lengths, same idea
  let timeWindow = null; // {from, to} in Ma brushed on the timeline, or null
  // ONE length filter with two inputs — the slider writes its min edge, the size
  // chart brushes both. Keeping them as separate filters would repeat the
  // dropdown-vs-map-click contradiction fixed earlier.
  let lengthWindow = null; // {min, max} in metres, or null
  let occurrences = {}; // genus -> [[lng, lat, formation?], ...] from PBDB
  let digSiteLayer = null;
  // The two blockers noted here previously are both resolved: PBDB
  // occurrences that disagree with the museum's own foundIn field are
  // filtered out at build time (see tools/fetch-occurrences.py) rather than
  // shown or silently dropped at random, and the detail panel now surfaces
  // formation names as its own fact list (renderDigSitesSummary) instead of
  // relying on the map alone — selecting a dinosaur still auto-scrolls the
  // map off-screen, but the sites themselves are visible without scrolling
  // back up to find them.
  const DIG_SITES_ENABLED = true;

  // Data loading. The .json files are the source of truth, but fetch() is
  // blocked by CORS over file://, so data/*.data.js — the same payloads wrapped
  // in a global assignment and loaded as <script> — stand in when it fails.
  // Regenerate them with tools/bundle-data.py after editing the JSON.
  function loadJson(path, globalName) {
    return fetch(path)
      .then((res) => {
        if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
        return res.json();
      })
      .catch((error) => {
        if (window[globalName]) return window[globalName];
        throw error;
      });
  }

  function showLoadError(error) {
    const main = document.querySelector('main');
    if (!main) return;
    main.innerHTML = `<div class="panel load-error">
      <h2 class="section-label">Couldn't load the dataset</h2>
      <p>${escapeHtml(error && error.message ? error.message : String(error))}</p>
      <p class="load-error__hint">If you opened this file directly from disk, serve the
      folder over HTTP instead — <code>python3 -m http.server 8000</code> — then visit
      <code>http://localhost:8000</code>.</p>
    </div>`;
  }

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
  const quizQuestionEl = document.getElementById('quiz-question');
  const quizOptionsEl = document.getElementById('quiz-options');
  const quizFeedbackEl = document.getElementById('quiz-feedback');
  const quizScoreEl = document.getElementById('quiz-score');
  const quizScoreTextEl = document.getElementById('quiz-score-text');
  const quizStreakEl = document.getElementById('quiz-streak');
  const quizStreakCountEl = document.getElementById('quiz-streak-count');
  const quizNextButton = document.getElementById('quiz-next');
  const quizTimerEl = document.getElementById('quiz-timer');
  const quizTimerRing = document.getElementById('quiz-timer-ring');
  const quizTimerNum = document.getElementById('quiz-timer-num');
  const selectFilters = [countryFilter, typeFilter, dietFilter];

  // "Late Cretaceous, 75-71 million years ago" -> "Late Cretaceous".
  function periodOf(dinosaur) {
    return String(dinosaur.whenLived || '').split(',')[0].trim();
  }

  // Rows used to show a truncated description. 35 of the 75 dinosaurs have none,
  // so half the list read as a column of "N/A" — and a prose fragment is not
  // what anyone scans a list like this by. Diet, type and period always exist
  // and are exactly the axes the filters work on.
  function listItemHTML(dinosaur) {
    const isSelected = selectedDinosaur && dinosaur.name === selectedDinosaur.name;
    const meta = [dinosaur.diet, dinosaur.typeOfDinosaur, periodOf(dinosaur)]
      .filter((value) => value && value !== 'N/A')
      .map((value) => `<span>${escapeHtml(value)}</span>`)
      .join('<i aria-hidden="true">·</i>');
    return `
      <li class="${isSelected ? 'selected' : ''}" data-name="${escapeHtml(dinosaur.name)}"
          role="option" tabindex="0" aria-selected="${isSelected ? 'true' : 'false'}">
        <img src="${escapeHtml(dinosaur.imageSrc)}" alt="" loading="lazy" decoding="async"
             onerror="this.onerror=null;this.src='images/placeholder.svg'" />
        <div class="list-item-text">
          <h3>${escapeHtml(dinosaur.name)}</h3>
          <p class="list-item-meta">${meta}</p>
        </div>
      </li>
    `;
  }

  function renderList(dinosaurs) {
    listEmptyState.hidden = dinosaurs.length > 0;
    listEl.innerHTML = dinosaurs.map(listItemHTML).join('');
    listEl.querySelectorAll('li').forEach((li) => {
      li.addEventListener('click', () => selectDinosaur(li.dataset.name));
      // Selecting a dinosaur is the primary interaction on the page and was
      // mouse-only: the rows were bare <li> with a click handler.
      li.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectDinosaur(li.dataset.name);
        } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          const sibling = event.key === 'ArrowDown' ? li.nextElementSibling : li.previousElementSibling;
          if (sibling) sibling.focus();
        }
      });
    });
  }

  function populateFilterOptions(dinosaurs) {
    const countries = new Set();
    dinosaurs.forEach((d) => countryLabels(d.foundIn).forEach((c) => countries.add(c)));
    countryFilter.innerHTML = '<option value="">All</option>' +
      [...countries].sort().map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');

    const diets = [...new Set(dinosaurs.map((d) => d.diet))].sort();
    dietFilter.innerHTML = '<option value="">All</option>' +
      diets.map((d) => `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join('');

    const types = [...new Set(dinosaurs.map((d) => d.typeOfDinosaur))].filter(Boolean).sort();
    typeFilter.innerHTML = '<option value="">All</option>' +
      types.map((t) => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join('');

    // The sliders index into the sorted list of values that actually occur,
    // not into a linear kg/m range. Weight spans 1 to 70000kg, so on a linear
    // track the entire useful range lived in the first few pixels and one nudge
    // jumped from "all" to "almost none". One notch now means one dinosaur.
    weightSteps = [...new Set(dinosaurs.map((d) => d.weight).filter((w) => typeof w === 'number'))].sort((a, b) => a - b);
    lengthSteps = [...new Set(dinosaurs.map((d) => d.length).filter((l) => typeof l === 'number'))].sort((a, b) => a - b);
    weightFilter.max = String(weightSteps.length);
    lengthFilter.max = String(lengthSteps.length);
  }

  // Slider position -> threshold. Position 0 means "Any".
  function stepValue(steps, position) {
    const index = Number(position);
    return index > 0 ? steps[Math.min(index, steps.length) - 1] : 0;
  }
  function minWeightValue() { return stepValue(weightSteps, weightFilter.value); }

  // Slider position for a threshold that may have come from the chart brush and
  // so need not be one of the recorded lengths.
  function nearestStepIndex(steps, value) {
    if (!(value > 0)) return 0;
    const index = steps.findIndex((step) => step >= value);
    return index < 0 ? steps.length : index + 1;
  }

  function maxRecordedLength() {
    return lengthSteps.length ? lengthSteps[lengthSteps.length - 1] : 0;
  }

  function describeLengthWindow() {
    if (!lengthWindow) return 'Any';
    const min = Math.round(lengthWindow.min * 10) / 10;
    const max = Math.round(lengthWindow.max * 10) / 10;
    return max >= maxRecordedLength() ? `${min}+ m` : `${min}–${max} m`;
  }

  // Keeps the range readouts and the "this select is filtering" styling in step
  // with whatever changed the controls — user input, a chart click, or a chip ×.
  function syncFilterControls() {
    weightValue.textContent = minWeightValue() > 0 ? `${minWeightValue().toLocaleString()} kg` : 'Any';
    lengthValue.textContent = describeLengthWindow();
    // Keep the slider's thumb where the chart brush put it, so the two inputs
    // to the same filter never show different answers.
    lengthFilter.value = String(lengthWindow ? nearestStepIndex(lengthSteps, lengthWindow.min) : 0);
    weightFilter.setAttribute('aria-valuetext', weightValue.textContent);
    lengthFilter.setAttribute('aria-valuetext', lengthValue.textContent);
    selectFilters.forEach((el) => el.classList.toggle('is-active', Boolean(el.value)));
  }

  // Applies every filter, optionally skipping one dimension. Each cross-filtered
  // view is fed "everything but me": otherwise clicking a country would recolour
  // the map down to that single country, and clicking a pie slice would collapse
  // its own chart to a single wedge with nothing left to click.
  function filterDinosaurs({ skipMap = false, skipCountry = false, skipDiet = false, skipType = false, skipSizes = false, skipTime = false } = {}) {
    let result = searchDinosaurs(allDinosaurs, searchInput.value);

    const country = countryFilter.value;
    if (!skipCountry && country) {
      result = result.filter((d) => countryLabels(d.foundIn).includes(country));
    }

    if (!skipDiet && dietFilter.value) {
      result = result.filter((d) => d.diet === dietFilter.value);
    }

    if (!skipType && typeFilter.value) {
      result = result.filter((d) => d.typeOfDinosaur === typeFilter.value);
    }

    // 55 of the 75 dinosaurs have no recorded weight, so any threshold above
    // zero necessarily hides most of the dataset. That is the right filter
    // semantics, but it has to be *said* — renderResultBar reports the count.
    const minWeight = skipSizes ? 0 : minWeightValue();
    if (minWeight > 0) {
      result = result.filter((d) => typeof d.weight === 'number' && d.weight >= minWeight);
    }

    if (!skipSizes && lengthWindow) {
      result = result.filter((d) => typeof d.length === 'number'
        && d.length >= lengthWindow.min && d.length <= lengthWindow.max);
    }

    if (!skipTime && timeWindow) {
      result = result.filter((d) => {
        const span = parseWhenLived(d);
        return span && span.from >= timeWindow.to && span.to <= timeWindow.from;
      });
    }

    if (cladeFilter) {
      result = result.filter((d) => resolveTaxonomyPath(d).includes(cladeFilter));
    }

    if (!skipMap && mapCountryFilter) {
      result = result.filter((d) => resolveCountryGeoNames(d.foundIn).includes(mapCountryFilter));
    }

    return result;
  }

  function applyFilters({ writeUrl = true } = {}) {
    if (typeof updateMapDensity === 'function') updateMapDensity(filterDinosaurs({ skipMap: true, skipCountry: true }));
    if (typeof syncCountryHighlight === 'function') syncCountryHighlight();

    const result = filterDinosaurs();

    renderList(result);
    if (typeof renderCharts === 'function') {
      renderCharts(filterDinosaurs({ skipDiet: true }), filterDinosaurs({ skipType: true }));
    }
    if (typeof renderTimeline === 'function') renderTimeline(result);
    if (typeof renderSizeChart === 'function') renderSizeChart(result);
    renderResultBar(result);
    syncOutOfResults(result);
    syncSearchClearButton();
    syncFilterControls();
    if (writeUrl) syncUrl();
  }

  // The detail panel is not cleared when filters exclude its dinosaur — losing
  // the user's place would be worse — but it must say so, or the page shows a
  // complete dinosaur directly beneath "No dinosaurs match your filters".
  function syncOutOfResults(result) {
    const panel = document.getElementById('detail-panel');
    const notice = document.getElementById('detail-out-of-results');
    if (!panel || !notice) return;
    const stale = Boolean(selectedDinosaur) && !result.some((d) => d.name === selectedDinosaur.name);
    notice.hidden = !stale;
    panel.classList.toggle('is-stale', stale);
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
    if (minWeightValue() > 0) {
      chips.push({ label: `≥ ${minWeightValue().toLocaleString()} kg`, clear: () => { weightFilter.value = '0'; } });
    }
    if (lengthWindow) {
      chips.push({ label: `Length: ${describeLengthWindow()}`, clear: () => { lengthWindow = null; } });
    }
    if (mapCountryFilter) {
      chips.push({ label: `Map: ${mapCountryFilter}`, clear: () => { mapCountryFilter = null; } });
    }
    if (cladeFilter) {
      chips.push({ label: `Clade: ${cladeFilter}`, clear: () => { cladeFilter = null; } });
    }
    if (timeWindow) {
      chips.push({
        label: `Time: ${Math.round(timeWindow.from)}–${Math.round(timeWindow.to)} Ma`,
        clear: () => { timeWindow = null; },
      });
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

    // A size threshold can only be applied to dinosaurs whose size is recorded,
    // and most weights are not. Reported as the actual delta against the other
    // active filters — counting unknowns across the whole dataset claimed
    // "55 hidden" even when only a handful had been dropped.
    const notes = [];
    if (minWeightValue() > 0 || lengthWindow) {
      const withoutSizes = filterDinosaurs({ skipSizes: true });
      if (minWeightValue() > 0) {
        const n = withoutSizes.filter((d) => typeof d.weight !== 'number').length;
        if (n > 0) notes.push(`${n} hidden — weight not recorded`);
      }
      if (lengthWindow) {
        const n = withoutSizes.filter((d) => typeof d.length !== 'number').length;
        if (n > 0) notes.push(`${n} hidden — length not recorded`);
      }
    }
    if (notes.length) {
      resultCount.innerHTML += ` <span class="result-note">${escapeHtml(notes.join(' · '))}</span>`;
    }

    const chips = activeFilters();
    activeFiltersEl.innerHTML = chips
      .map((chip, i) => `
        <span class="active-filter">${escapeHtml(chip.label)}
          <button type="button" data-chip="${i}" aria-label="Remove filter ${escapeHtml(chip.label)}">×</button>
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
    // Cleared unconditionally: leaving the previous run's suggestion in place
    // meant a later empty search could surface a correction for a query the
    // user had already moved on from.
    if (result.length > 0) {
      didYouMean.hidden = true;
      didYouMean.textContent = '';
      return;
    }
    const query = searchInput.value.trim();
    const correction = query ? suggestCorrection(allDinosaurs, query) : null;

    if (correction) {
      didYouMean.hidden = false;
      didYouMean.innerHTML =
        `Did you mean <button type="button">${escapeHtml(correction)}</button>?`;
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

  function clearSelection() {
    selectedDinosaur = null;
    renderDetail(null);
    if (typeof resetMapView === 'function') resetMapView();
    listEl.querySelectorAll('li').forEach((li) => {
      li.classList.remove('selected');
      li.setAttribute('aria-selected', 'false');
    });
    applyFilters();
  }

  function clearAllFilters() {
    searchInput.value = '';
    countryFilter.value = '';
    dietFilter.value = '';
    weightFilter.value = '0';
    lengthFilter.value = '0';
    lengthWindow = null;
    mapCountryFilter = null;
    cladeFilter = null;
    timeWindow = null;
    typeFilter.value = '';
    selectedDinosaur = null;
    renderDetail(null);
    if (typeof resetMapView === 'function') resetMapView();
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
    searchInput.removeAttribute('aria-activedescendant');
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
      <li role="option" id="suggestion-${i}" data-index="${i}" aria-selected="${i === activeSuggestion}">
        <span>${highlightMatch(s.value, query)}</span>
        <span class="suggestion-kind">${s.kind}</span>
      </li>`).join('');
    suggestionsEl.hidden = false;
    searchInput.setAttribute('aria-expanded', 'true');
    if (activeSuggestion >= 0) searchInput.setAttribute('aria-activedescendant', `suggestion-${activeSuggestion}`);
    else searchInput.removeAttribute('aria-activedescendant');

    suggestionsEl.querySelectorAll('li').forEach((li) => {
      li.addEventListener('pointerdown', (event) => {
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
    } else if (suggestion.kind === 'type') {
      searchInput.value = '';
      typeFilter.value = suggestion.value;
    } else {
      searchInput.value = suggestion.value;
    }

    hideSuggestions();
    applyFilters();

    if (suggestion.kind === 'name') selectDinosaur(suggestion.value, { fromSearch: true });
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
  lengthFilter.addEventListener('input', () => {
    const min = stepValue(lengthSteps, lengthFilter.value);
    lengthWindow = min > 0 ? { min, max: maxRecordedLength() } : null;
    applyFilters();
  });
  clearFiltersButton.addEventListener('click', clearAllFilters);
  document.querySelector('[data-clear-all]').addEventListener('click', clearAllFilters);
  document.getElementById('detail-clear').addEventListener('click', clearSelection);

  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function scrollToElement(el) {
    if (!el) return;
    el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }

  // --- Hero showcase ---------------------------------------------------
  //
  // Two elements per slide, as in the Harvard Museum of Natural History
  // reference: an engraved habitat dome, and the animal isolated on
  // transparent background standing in front of it, breaking the dome's top
  // edge so it reads as standing *on* the mound rather than pasted into a
  // frame.
  //
  // This needs cut-outs, which the NHM dataset images are not — they're flat
  // JPEGs with their own baked-in backdrop. So the four featured animals use
  // CC-licensed transparent PNGs from Wikimedia Commons instead
  // (images/specimens/CREDITS.md). Both are by Emily Willoughby — painterly,
  // naturalistic hand-painted reconstructions, not the 3D renders these
  // started as, which read as plastic against an 1863 engraving, and not the
  // flat-ink style tried in between either. The set is chosen by which genera
  // actually have this artist's work on a transparent background, not the
  // other way round; every other dinosaur is still reachable through search,
  // the list and the charts.
  const SHOWCASE_SPECIMENS = [
    { name: 'Camptosaurus', file: 'camptosaurus.png' },
    { name: 'Anchiceratops', file: 'anchiceratops.png' },
    { name: 'Albertosaurus', file: 'albertosaurus.png' },
  ];
  const SHOWCASE_HOLD_MS = 3000;
  const SHOWCASE_FLIP_MS = 900;
  // A single smooth ease across the whole 180° — no overshoot, no pause at
  // the midpoint — so the motion never abruptly cuts or reverses.
  const SHOWCASE_FLIP_EASE = 'cubic-bezier(0.65, 0, 0.35, 1)';

  let showcaseSet = [];
  let showcaseIndex = 0;
  let showcaseAngle = 0; // running total; never reset, so the rotation is one continuous motion
  let showcaseFlipCount = 0;
  let showcaseAnimating = false;
  let showcaseTimer = null;

  function capitalize(value) {
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
  }

  function showcaseCaptionFor(entry) {
    const d = entry.dinosaur;
    return d
      ? [capitalize(d.typeOfDinosaur), capitalize(d.diet), periodOf(d)]
          .filter((value) => value && value !== 'N/A')
          .join(' · ')
      : '';
  }

  // Trivia quiz. Every question is generated on the fly from the same 75-row
  // dataset the rest of the page already uses — no separate question bank to
  // write or keep in sync. Two shapes: a "which of these four had property X"
  // question built from one categorical field (diet/type/period/country), and
  // a "which of these four was the longest" comparison built from the numeric
  // length field. A field only produces a question if it can also produce 3
  // honest distractors (dinosaurs whose value for that field actually
  // differs), so sparse fields quietly drop out rather than surface a
  // 4-option question where two options are secretly both correct.
  let quizScore = { correct: 0, total: 0 };
  let quizCurrent = null; // { correctName, options, answered }

  function shuffled(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  const QUIZ_FIELD_QUESTIONS = [
    { field: 'diet', prompt: (value) => `Which of these dinosaurs was ${value}?` },
    { field: 'typeOfDinosaur', prompt: (value) => `Which of these dinosaurs was a ${value}?` },
    { field: 'foundIn', prompt: (value) => `Which of these dinosaurs was found in ${value}?` },
    {
      field: '__period',
      prompt: (value) => `Which of these dinosaurs lived during the ${value}?`,
      get: periodOf,
    },
  ];

  function buildFieldQuestion(spec) {
    const getValue = spec.get || ((d) => d[spec.field]);
    const candidates = allDinosaurs.filter((d) => {
      const value = getValue(d);
      return value && value !== 'N/A';
    });
    if (candidates.length < 4) return null;
    const correct = candidates[Math.floor(Math.random() * candidates.length)];
    const value = getValue(correct);
    const distractors = shuffled(
      candidates.filter((d) => d.name !== correct.name && getValue(d) !== value),
    ).slice(0, 3);
    if (distractors.length < 3) return null;
    return {
      prompt: spec.prompt(value),
      correctName: correct.name,
      options: shuffled([correct.name, ...distractors.map((d) => d.name)]),
    };
  }

  function buildLengthQuestion() {
    const candidates = allDinosaurs.filter((d) => typeof d.length === 'number' && d.length > 0);
    if (candidates.length < 4) return null;
    const four = shuffled(candidates).slice(0, 4);
    const correct = four.reduce((longest, d) => (d.length > longest.length ? d : longest));
    return {
      prompt: 'Which of these dinosaurs was the longest?',
      correctName: correct.name,
      options: shuffled(four.map((d) => d.name)),
    };
  }

  function buildQuizQuestion() {
    const attempts = shuffled([...QUIZ_FIELD_QUESTIONS, { field: '__length' }]);
    for (const spec of attempts) {
      const question = spec.field === '__length' ? buildLengthQuestion() : buildFieldQuestion(spec);
      if (question) return question;
    }
    return null;
  }

  // Kahoot-style shape+colour tiles instead of A/B/C/D text — the shape and
  // colour are what let you register "which one" a half-second before you've
  // actually read the label, which is the whole point under a countdown.
  const QUIZ_OPTION_ICONS = [
    '<svg viewBox="0 0 24 24"><path d="M12 3 21 20 3 20Z"/></svg>', // triangle
    '<svg viewBox="0 0 24 24"><path d="M12 2 22 12 12 22 2 12Z"/></svg>', // diamond
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>', // circle
    '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>', // square
  ];
  const QUIZ_TIME_MS = 10000;
  const QUIZ_TIMER_CIRCUMFERENCE = 119.4; // 2 * pi * r(19), matches the SVG in index.html
  let quizStreak = 0;
  let quizTimerDeadline = 0;
  let quizTimerTickHandle = null;

  function renderQuizScore() {
    quizScoreTextEl.textContent = `Score: ${quizScore.correct} / ${quizScore.total}`;
    quizStreakEl.hidden = quizStreak < 2;
    quizStreakCountEl.textContent = quizStreak;
    quizScoreEl.classList.toggle('on-fire', quizStreak >= 2);
  }

  function stopQuizTimer() {
    if (quizTimerTickHandle) clearInterval(quizTimerTickHandle);
    quizTimerTickHandle = null;
    quizTimerEl.classList.add('stopped');
  }

  function startQuizTimer() {
    quizTimerEl.classList.remove('danger', 'stopped');
    quizTimerNum.textContent = String(Math.ceil(QUIZ_TIME_MS / 1000));
    // Snap the ring back to "full" with no transition, force a reflow so the
    // browser commits that state, then re-enable the transition and set the
    // target — that's what makes the sweep animate from full to empty on
    // every question instead of jumping straight there once and never
    // resetting (a bare style change on an already-transitioning property
    // doesn't restart the transition).
    quizTimerRing.style.transition = 'none';
    quizTimerRing.style.strokeDashoffset = '0';
    quizTimerRing.getBoundingClientRect(); // forces the reflow the reset above needs
    quizTimerRing.style.transition = `stroke-dashoffset ${QUIZ_TIME_MS}ms linear, stroke var(--dur)`;
    quizTimerRing.style.strokeDashoffset = String(QUIZ_TIMER_CIRCUMFERENCE);
    quizTimerDeadline = Date.now() + QUIZ_TIME_MS;
    quizTimerTickHandle = setInterval(() => {
      const remainingMs = quizTimerDeadline - Date.now();
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
      quizTimerNum.textContent = String(remainingSec);
      quizTimerEl.classList.toggle('danger', remainingSec <= 3);
      if (remainingMs <= 0) {
        stopQuizTimer();
        answerQuiz(null, { timedOut: true });
      }
    }, 200);
  }

  function renderQuizQuestion() {
    stopQuizTimer();
    quizCurrent = buildQuizQuestion();
    quizFeedbackEl.textContent = '';
    quizFeedbackEl.className = 'quiz-feedback';
    quizNextButton.hidden = true;
    if (!quizCurrent) {
      quizQuestionEl.textContent = 'Not enough data to build a question right now.';
      quizOptionsEl.innerHTML = '';
      return;
    }
    quizQuestionEl.textContent = quizCurrent.prompt;
    quizOptionsEl.innerHTML = quizCurrent.options
      .map((name, index) => `
        <button type="button" class="quiz-option" data-name="${escapeHtml(name)}">
          <span class="quiz-option-icon">${QUIZ_OPTION_ICONS[index]}</span>
          <span class="quiz-option-text">${escapeHtml(name)}</span>
        </button>
      `)
      .join('');
    startQuizTimer();
  }

  function answerQuiz(chosenName, { timedOut = false } = {}) {
    if (!quizCurrent || quizCurrent.answered) return;
    quizCurrent.answered = true;
    stopQuizTimer();
    quizScore.total += 1;
    const isCorrect = !timedOut && chosenName === quizCurrent.correctName;
    if (isCorrect) {
      quizScore.correct += 1;
      quizStreak += 1;
    } else {
      quizStreak = 0;
    }
    renderQuizScore();
    quizOptionsEl.querySelectorAll('.quiz-option').forEach((button) => {
      button.disabled = true;
      if (button.dataset.name === quizCurrent.correctName) button.classList.add('correct');
      else if (button.dataset.name === chosenName) button.classList.add('wrong');
    });
    if (isCorrect) {
      quizFeedbackEl.textContent = quizStreak >= 3 ? `Correct! ${quizStreak} in a row.` : 'Correct!';
    } else if (timedOut) {
      quizFeedbackEl.textContent = `Time's up! It was ${quizCurrent.correctName}.`;
    } else {
      quizFeedbackEl.textContent = `Not quite — it was ${quizCurrent.correctName}.`;
    }
    quizFeedbackEl.classList.add(isCorrect ? 'is-correct' : 'is-wrong');
    quizNextButton.hidden = false;
  }

  function initQuiz() {
    if (!quizQuestionEl) return;
    quizOptionsEl.addEventListener('click', (event) => {
      const button = event.target.closest('.quiz-option');
      if (button) answerQuiz(button.dataset.name);
    });
    quizNextButton.addEventListener('click', renderQuizQuestion);
    renderQuizScore();
    renderQuizQuestion();
  }

  // Dino news. Items come from data/news.json — real ScienceDaily/Phys.org
  // RSS headlines pulled at build time by tools/fetch-news.py, each with its
  // own short summary and a link back to the original. Nothing here is
  // generated; the panel just formats and lists what the feeds themselves
  // published.
  const NEWS_DATE_FORMAT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // One card per story, only a handful shown until "View all" is clicked —
  // dumping all ~40 at once read as overwhelming. Each source gets a stable
  // colour (reusing the chart palette) as a top border on its cards, so the
  // two outlets are visually distinguishable without another badge.
  const NEWS_CARDS_VISIBLE = 3;
  const NEWS_SOURCE_COLORS = { ScienceDaily: 'var(--chart-1)', 'Phys.org': 'var(--chart-3)' };

  function newsCardHtml(item, hidden) {
    const color = NEWS_SOURCE_COLORS[item.source] || 'var(--accent)';
    return `
      <a class="news-card" style="--news-source-color:${color}" href="${escapeHtml(item.link)}"
         target="_blank" rel="noopener noreferrer" ${hidden ? 'hidden' : ''}>
        <span class="news-card__meta">
          <span class="news-card__source">${escapeHtml(item.source)}</span>
          <span class="news-card__date">· ${NEWS_DATE_FORMAT.format(new Date(item.date))}</span>
        </span>
        <p class="news-card__title">${escapeHtml(item.title)}</p>
        <p class="news-card__summary">${escapeHtml(item.summary)}</p>
        <span class="news-card__link">Read more →</span>
      </a>
    `;
  }

  function renderNews(items) {
    const listEl = document.getElementById('news-list');
    const updatedEl = document.getElementById('news-updated');
    if (!listEl) return;

    if (!items || items.length === 0) {
      listEl.innerHTML = '<p class="news-empty">No news available right now — check back later.</p>';
      return;
    }

    if (updatedEl) {
      updatedEl.textContent = `Latest: ${NEWS_DATE_FORMAT.format(new Date(items[0].date))}`;
    }

    const visible = items.slice(0, NEWS_CARDS_VISIBLE);
    const extra = items.slice(NEWS_CARDS_VISIBLE);

    listEl.innerHTML =
      visible.map((item) => newsCardHtml(item, false)).join('') +
      extra.map((item) => newsCardHtml(item, true)).join('');

    const panel = document.getElementById('news-panel');
    const existingToggleRow = document.getElementById('news-toggle-row');
    if (existingToggleRow) existingToggleRow.remove();
    if (extra.length > 0 && panel) {
      const row = document.createElement('div');
      row.id = 'news-toggle-row';
      row.className = 'news-toggle-row';
      row.innerHTML = `<button type="button" id="news-toggle" class="news-toggle">View all ${items.length} articles</button>`;
      panel.appendChild(row);
      document.getElementById('news-toggle').addEventListener('click', () => {
        listEl.querySelectorAll('.news-card[hidden]').forEach((card) => { card.hidden = false; });
        row.remove();
      });
    }
  }

  function initNews() {
    loadJson('data/news.json', 'DINO_NEWS')
      .then((items) => renderNews(items))
      .catch(() => renderNews([]));
  }

  function applyShowcaseDino(img, entry) {
    img.src = `images/specimens/${entry.file}`;
    img.alt = `Reconstruction of ${entry.name}`;
  }

  function renderShowcaseCaption(entry) {
    document.getElementById('showcase-name').textContent = entry.name;
    document.getElementById('showcase-meta').textContent = showcaseCaptionFor(entry);
    document.getElementById('showcase-view').onclick = () => selectDinosaur(entry.name);
  }

  // The backdrop and both dinosaurs are one flat disc (see .showcase-wheel-*
  // in style.css), spun purely in the screen plane with CSS rotate() — no
  // rotateY, no perspective, no third axis. Dino A sits at the top pole,
  // dino B at the bottom (already rotated 180° in CSS, so it's upside-down
  // relative to A). A half turn of the disc swaps their poles: the one above
  // the stage's horizon arcs down under it exactly as the other arcs up from
  // underneath — one rigid object, one motion, no crossfade or cut. The angle
  // keeps accumulating (0 -> 180 -> 360 -> ...) rather than ever resetting,
  // so consecutive turns chain into one continuous, seamless, looping spin.
  function showcaseFlip(direction) {
    if (showcaseSet.length === 0 || showcaseAnimating) return;

    const nextIndex = (showcaseIndex + direction + showcaseSet.length) % showcaseSet.length;
    const entry = showcaseSet[nextIndex];
    const spin = document.getElementById('showcase-wheel-spin');

    if (!spin || reducedMotion || !spin.animate) {
      showcaseIndex = nextIndex;
      applyShowcaseDino(document.getElementById('showcase-dino-a'), entry);
      renderShowcaseCaption(entry);
      return;
    }

    // Whichever pole is about to rise above the horizon this spin is the one
    // that needs the upcoming animal loaded into it before rotation starts —
    // the other pole already holds what's currently showing.
    const incomingDino = document.getElementById(
      showcaseFlipCount % 2 === 0 ? 'showcase-dino-b' : 'showcase-dino-a',
    );
    applyShowcaseDino(incomingDino, entry);

    const fromAngle = showcaseAngle;
    const toAngle = showcaseAngle + 180 * direction;
    showcaseAnimating = true;

    spin.animate(
      [{ transform: `rotate(${fromAngle}deg)` }, { transform: `rotate(${toAngle}deg)` }],
      { duration: SHOWCASE_FLIP_MS, easing: SHOWCASE_FLIP_EASE, fill: 'forwards' },
    ).onfinish = () => {
      showcaseAngle = toAngle;
      showcaseFlipCount += 1;
      showcaseIndex = nextIndex;
      showcaseAnimating = false;
      renderShowcaseCaption(entry);
    };
  }

  function startShowcaseTimer() {
    if (reducedMotion) return;
    clearInterval(showcaseTimer);
    showcaseTimer = setInterval(() => showcaseFlip(1), SHOWCASE_HOLD_MS);
  }

  function initShowcase(dinosaurs) {
    const root = document.getElementById('showcase');
    if (!root) return;

    // Only feature specimens we have both a cut-out AND a dataset record for,
    // so "View details" can never lead somewhere that doesn't exist.
    showcaseSet = SHOWCASE_SPECIMENS
      .map((s) => ({ ...s, dinosaur: dinosaurs.find((d) => d.name === s.name) }))
      .filter((s) => s.dinosaur);
    if (showcaseSet.length === 0) { root.hidden = true; return; }


    showcaseIndex = Math.floor(Math.random() * showcaseSet.length);
    applyShowcaseDino(document.getElementById('showcase-dino-a'), showcaseSet[showcaseIndex]);
    // Preload the next animal onto the far pole so the very first spin has
    // nothing left to fetch mid-rotation.
    applyShowcaseDino(
      document.getElementById('showcase-dino-b'),
      showcaseSet[(showcaseIndex + 1) % showcaseSet.length],
    );
    renderShowcaseCaption(showcaseSet[showcaseIndex]);

    document.getElementById('showcase-prev').addEventListener('click', () => {
      showcaseFlip(-1);
      startShowcaseTimer(); // manual nav resets the clock rather than fighting it
    });
    document.getElementById('showcase-next').addEventListener('click', () => {
      showcaseFlip(1);
      startShowcaseTimer();
    });

    // Auto-advance pauses on hover/focus — a carousel that changes under a
    // pointer the user hasn't moved yet is the classic complaint.
    root.addEventListener('mouseenter', () => clearInterval(showcaseTimer));
    root.addEventListener('mouseleave', startShowcaseTimer);
    root.addEventListener('focusin', () => clearInterval(showcaseTimer));
    root.addEventListener('focusout', startShowcaseTimer);

    startShowcaseTimer();
  }

  // `fromSearch` suppresses the jump: selecting from the suggestion popup used
  // to fling the viewport two screens down while focus stayed in the search
  // box, so the user carried on typing into an off-screen field.
  function selectDinosaur(name, { fromSearch = false } = {}) {
    selectedDinosaur = allDinosaurs.find((d) => d.name === name) || null;
    listEl.querySelectorAll('li').forEach((li) => {
      const isSelected = Boolean(selectedDinosaur) && li.dataset.name === selectedDinosaur.name;
      li.classList.toggle('selected', isSelected);
      li.setAttribute('aria-selected', String(isSelected));
    });
    renderDetail(selectedDinosaur);
    // The timeline and size charts mark the selection at render time, but
    // selecting never re-rendered them — so a dinosaur picked from the list or
    // the search box was highlighted everywhere except the two charts that show
    // it in context, which is exactly where the highlight is worth having.
    const inView = filterDinosaurs();
    if (typeof renderTimeline === 'function') renderTimeline(inView);
    if (typeof renderSizeChart === 'function') renderSizeChart(inView);
    if (!fromSearch) {
      scrollToElement(document.getElementById('detail-panel'));
      // Focus, not just scroll — otherwise a screen reader is never told that
      // anything happened.
      const heading = document.getElementById('detail-name');
      if (heading) heading.focus({ preventScroll: true });
    }
    syncUrl();
  }

  const DETAIL_FIELDS = [
    ['Type', 'typeOfDinosaur'],
    // Units are appended only to real measurements: the dataset stores missing
    // values as the string "N/A", which used to render as "N/Am".
    ['Length', (d) => (typeof d.length === 'number' ? `${d.length} m` : '—')],
    ['Weight', (d) => (typeof d.weight === 'number' ? `${d.weight.toLocaleString()} kg` : '—')],
    ['Diet', 'diet'],
    ['Type species', 'typeSpecies'],
    ['Found in', 'foundIn'],
    ['Named by', 'namedBy'],
  ];

  // Formation names, not raw coordinates — a reader wants "Djadokhta
  // Formation ×2", not two lat/lng pairs. Sites sharing a formation collapse
  // into one pill with a count; sites with no recorded formation collapse
  // into their own "Formation not recorded" pill rather than one pill per
  // site, which would just be a wall of identical-looking chips.
  function renderDigSitesSummary(dinosaur) {
    const label = document.getElementById('detail-dig-sites-label');
    const container = document.getElementById('detail-dig-sites');
    if (!label || !container) return;
    if (!DIG_SITES_ENABLED) {
      label.hidden = true;
      container.hidden = true;
      return;
    }
    label.hidden = false;
    container.hidden = false;

    const sites = occurrences[dinosaur.name] || [];
    if (sites.length === 0) {
      container.innerHTML = '<p class="dig-sites-empty">No excavation sites recorded in the Paleobiology Database for this genus.</p>';
      return;
    }

    const counts = new Map();
    sites.forEach(([, , formation]) => {
      const key = formation || 'Formation not recorded';
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    const items = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([formation, count]) => `
        <li class="dig-site-item">
          <span>${escapeHtml(formation)}</span>
          <span class="dig-site-count">×${count}</span>
        </li>
      `)
      .join('');

    container.innerHTML = `
      <ul class="dig-site-list">${items}</ul>
      <button type="button" id="detail-dig-sites-jump" class="dig-sites-jump">↑ View on map</button>
    `;
    document.getElementById('detail-dig-sites-jump').addEventListener('click', () => {
      scrollToElement(document.getElementById('excavation-panel'));
      if (typeof highlightGenusOnAtlas === 'function') highlightGenusOnAtlas(dinosaur.name);
    });
  }

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
    const description = document.getElementById('detail-description');
    const hasDescription = dinosaur.description && dinosaur.description !== 'N/A';
    description.textContent = hasDescription ? dinosaur.description : 'No description recorded for this dinosaur.';
    description.classList.toggle('empty-state', !hasDescription);
    document.getElementById('detail-when-lived').textContent = dinosaur.whenLived;

    document.getElementById('detail-fields').innerHTML = DETAIL_FIELDS.map(([label, accessor]) => {
      const raw = typeof accessor === 'function' ? accessor(dinosaur) : dinosaur[accessor];
      const value = raw && raw !== 'N/A' ? raw : '—';
      return `<div class="fact-pill"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`;
    }).join('');

    if (typeof renderTaxonomyTree === 'function') renderTaxonomyTree(dinosaur);
    renderDigSitesSummary(dinosaur);
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
      svg += `<path data-key="${escapeHtml(key)}" d="${describeArc(cx, cy, r, angle, angle + sweep)}" fill="${colorFor(key)}" stroke="var(--panel-solid)" stroke-width="0.8" />`;
      angle += sweep;
    }
    if (innerHole) svg += `<circle cx="${cx}" cy="${cy}" r="22" fill="var(--panel-solid)" />`;
    svgEl.innerHTML = svg;
  }

  function renderLegend(listEl, counts, colorFor) {
    const entries = Object.entries(counts).filter(([, count]) => count > 0);
    listEl.classList.toggle('chart-legend--split', entries.length > 6);
    listEl.innerHTML = entries
      .map(([key, count]) => `
        <li><button type="button" data-key="${escapeHtml(key)}" aria-pressed="false"><span class="swatch" style="background:${colorFor(key)}"></span>${escapeHtml(key)} (${count})</button></li>
      `).join('');
  }

  // Active category is marked on the control (aria-pressed + a visible ring)
  // rather than signalled only by dimming everything else — dimming removes the
  // colour cue and pushes already-muted legend text below contrast minimums.
  function applyChartState(svgEl, legendEl, activeKey) {
    const hasFilter = Boolean(activeKey);
    svgEl.querySelectorAll('[data-key]').forEach((el) => {
      el.classList.toggle('is-dimmed', hasFilter && el.dataset.key !== activeKey);
    });
    legendEl.querySelectorAll('[data-key]').forEach((el) => {
      const isActive = el.dataset.key === activeKey;
      el.setAttribute('aria-pressed', String(isActive));
      el.classList.toggle('is-active', isActive);
    });
  }

  function wireChart({ svgEl, legendEl, counts, colorFor, innerHole, filterEl }) {
    renderPie(svgEl, counts, colorFor, innerHole);
    renderLegend(legendEl, counts, colorFor);
    applyChartState(svgEl, legendEl, filterEl.value);
    const toggle = (key) => {
      filterEl.value = filterEl.value === key ? '' : key;
      applyFilters();
    };
    // The legend buttons are the accessible control; the pie is the same data
    // as a shortcut for pointer users.
    legendEl.querySelectorAll('[data-key]').forEach((el) => {
      el.addEventListener('click', () => toggle(el.dataset.key));
    });
    svgEl.querySelectorAll('[data-key]').forEach((el) => {
      el.addEventListener('click', () => toggle(el.dataset.key));
    });
  }

  function renderCharts(dietBase, typeBase) {
    wireChart({
      svgEl: document.getElementById('diet-chart'),
      legendEl: document.getElementById('diet-legend'),
      counts: computeDietCounts(dietBase),
      colorFor: (key) => DIET_COLORS[key],
      innerHole: true,
      filterEl: dietFilter,
    });
    wireChart({
      svgEl: document.getElementById('type-chart'),
      legendEl: document.getElementById('type-legend'),
      counts: computeTypeCounts(typeBase),
      colorFor: typeColorFor,
      innerHole: false,
      filterEl: typeFilter,
    });
  }

  // --- URL state -----------------------------------------------------------
  //
  // Every filter lives in location.hash, so a configured view is a citable
  // object: it can be shared, bookmarked, and reached with Back. Param names
  // are versioned by `v` so old links can be migrated rather than silently
  // misread if the encoding ever changes.
  const STATE_VERSION = '1';
  let suppressHashRead = false;
  let hashWriteTimer = null;

  function currentState() {
    const params = new URLSearchParams();
    params.set('v', STATE_VERSION);
    if (searchInput.value.trim()) params.set('q', searchInput.value.trim());
    if (countryFilter.value) params.set('country', countryFilter.value);
    if (typeFilter.value) params.set('type', typeFilter.value);
    if (dietFilter.value) params.set('diet', dietFilter.value);
    if (minWeightValue() > 0) params.set('kg', String(minWeightValue()));
    if (lengthWindow) params.set('m', `${round1(lengthWindow.min)}-${round1(lengthWindow.max)}`);
    if (timeWindow) params.set('ma', `${round1(timeWindow.from)}-${round1(timeWindow.to)}`);
    if (cladeFilter) params.set('clade', cladeFilter);
    if (mapCountryFilter) params.set('geo', mapCountryFilter);
    if (selectedDinosaur) params.set('sel', selectedDinosaur.name);
    return params;
  }

  function round1(value) { return Math.round(value * 10) / 10; }

  // Debounced and pushed: a slider drag or a burst of typing collapses into one
  // history entry instead of one per event, so Back steps through decisions
  // rather than keystrokes.
  function syncUrl() {
    clearTimeout(hashWriteTimer);
    hashWriteTimer = setTimeout(() => {
      const params = currentState();
      const next = params.toString() === `v=${STATE_VERSION}` ? ' ' : `#${params}`;
      if (next.trim() === window.location.hash.trim()) return;
      suppressHashRead = true;
      if (next === ' ') history.pushState(null, '', window.location.pathname);
      else history.pushState(null, '', next);
      suppressHashRead = false;
    }, 350);
  }

  function pairFrom(raw) {
    if (!raw) return null;
    const [a, b] = raw.split('-').map(Number);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
    return [a, b];
  }

  // Always applies, including when a param is absent — returning early on an
  // empty hash meant navigating Back to the bare URL left the previous entry's
  // filters in place while the address bar claimed there were none.
  function readStateFromUrl() {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));

    const setIfPresent = (el, key) => {
      const value = params.get(key) || '';
      // Only accept values the control actually offers, so a stale or hand-edited
      // link degrades to "no filter" rather than to an impossible state.
      el.value = [...el.options].some((o) => o.value === value) ? value : '';
    };
    searchInput.value = params.get('q') || '';
    setIfPresent(countryFilter, 'country');
    setIfPresent(typeFilter, 'type');
    setIfPresent(dietFilter, 'diet');

    const kg = Number(params.get('kg'));
    weightFilter.value = Number.isFinite(kg) && kg > 0 ? String(nearestStepIndex(weightSteps, kg)) : '0';

    const metres = pairFrom(params.get('m'));
    lengthWindow = metres ? { min: metres[0], max: metres[1] } : null;

    const ma = pairFrom(params.get('ma'));
    timeWindow = ma ? { from: ma[0], to: ma[1] } : null;

    cladeFilter = params.get('clade') || null;
    mapCountryFilter = params.get('geo') || null;

    const selected = params.get('sel');
    selectedDinosaur = selected ? allDinosaurs.find((d) => d.name === selected) || null : null;
    return params.has('v');
  }

  function initUrlState() {
    if (readStateFromUrl()) {
      renderDetail(selectedDinosaur);
      // Applied explicitly rather than relying on the map's async boot to run a
      // pass for us — that ordering was accidental.
      applyFilters({ writeUrl: false });
      if (selectedDinosaur && typeof focusMapOnDinosaur === 'function') focusMapOnDinosaur(selectedDinosaur);
    }
    window.addEventListener('popstate', () => {
      if (suppressHashRead) return;
      readStateFromUrl();
      renderDetail(selectedDinosaur);
      applyFilters({ writeUrl: false });
    });

    const copy = document.getElementById('copy-link');
    if (!copy) return;
    copy.addEventListener('click', () => {
      const url = window.location.href;
      const done = () => {
        copy.textContent = 'Link copied';
        setTimeout(() => { copy.textContent = 'Copy link to this view'; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, done);
      } else {
        done();
      }
    });
  }

  // --- Deep-time chart -----------------------------------------------------
  //
  // The dataset's dates were the one fully-populated dimension the UI never
  // touched: it could answer "where" and "what kind" but not "when", which is
  // the question the subject matter is actually about. Each dinosaur is a bar
  // across its recorded range, greedily packed into lanes; brushing a window
  // filters everything else on the page.
  const TIME_PAD = 4;             // Ma of breathing room at each end
  const LANE_H = 15;
  const BAR_H = 9;
  const AXIS_H = 34;
  const BAND_LABEL_H = 18;

  function timelineEntries(dinosaurs) {
    return dinosaurs
      .map((d) => ({ dinosaur: d, span: parseWhenLived(d) }))
      .filter((e) => e.span);
  }

  function timeBounds() {
    const spans = timelineEntries(allDinosaurs).map((e) => e.span);
    return {
      oldest: Math.max(...spans.map((s) => s.from)) + TIME_PAD,
      youngest: Math.min(...spans.map((s) => s.to)) - TIME_PAD,
    };
  }

  function renderTimeline(visible) {
    const host = document.getElementById('timeline');
    if (!host || allDinosaurs.length === 0) return;

    const { oldest, youngest } = timeBounds();
    // Measured, never clamped upward: forcing a minimum wider than the
    // container pushed the SVG past the page edge on small screens.
    const width = host.clientWidth || 320;
    const padX = 14;
    const plotW = width - padX * 2;
    // Time runs oldest-left, which is how every geologic column is drawn.
    const x = (ma) => ((oldest - ma) / (oldest - youngest)) * plotW + padX;

    const lanes = packLanes(timelineEntries(allDinosaurs));
    const height = BAND_LABEL_H + lanes.length * LANE_H + AXIS_H;
    const top = BAND_LABEL_H;
    const visibleNames = new Set(visible.map((d) => d.name));

    // Six epoch names across a 300px panel collide into an unreadable smear, so
    // each label steps down to an abbreviation and then drops out entirely
    // rather than overlapping its neighbours.
    const CHAR_W = 5.4; // 9px JetBrains Mono, uppercase, with letterspacing
    let bands = '';
    let bandLabels = '';
    EPOCH_BOUNDS.forEach((epoch, i) => {
      const from = Math.min(epoch.from, oldest);
      const to = Math.max(epoch.to, youngest);
      if (from <= to) return;
      const left = x(from);
      const w = x(to) - left;
      bands += `<rect class="tl-band ${i % 2 ? 'tl-band--alt' : ''}" data-epoch="${escapeHtml(epoch.name)}"
        x="${left}" y="${top}" width="${w}" height="${lanes.length * LANE_H}" />`;
      bands += `<line class="tl-band-edge" x1="${left}" y1="${top}" x2="${left}" y2="${top + lanes.length * LANE_H}" />`;

      const [era, period] = epoch.name.split(' ');
      const short = `${era[0]}. ${period.slice(0, 3)}.`;
      const label = w > (epoch.name.length + 1) * CHAR_W ? epoch.name
        : w > (short.length + 1) * CHAR_W ? short
          : null;
      if (label) {
        bandLabels += `<text class="tl-band-label" x="${left + w / 2}" y="${BAND_LABEL_H - 6}"
          text-anchor="middle">${escapeHtml(label)}<title>${escapeHtml(epoch.name)}</title></text>`;
      }
    });

    let bars = '';
    lanes.forEach((lane, laneIndex) => {
      const y = top + laneIndex * LANE_H + (LANE_H - BAR_H) / 2;
      lane.forEach(({ dinosaur, span }) => {
        const isVisible = visibleNames.has(dinosaur.name);
        const isSelected = selectedDinosaur && selectedDinosaur.name === dinosaur.name;
        const cls = `tl-bar${isVisible ? '' : ' tl-bar--out'}${isSelected ? ' tl-bar--sel' : ''}`;
        const fill = DIET_COLORS[dinosaur.diet] || 'var(--chart-unknown)';
        const label = `${dinosaur.name} — ${escapeHtml(dinosaur.whenLived)}`;
        if (span.isPoint) {
          // A single date is an absence of range. Drawing it as a bar would
          // invent a duration, so it gets a diamond with no width meaning.
          const cx = x(span.from);
          const r = BAR_H / 2;
          bars += `<polygon class="${cls} tl-point" data-name="${escapeHtml(dinosaur.name)}" fill="${fill}"
            points="${cx},${y} ${cx + r},${y + r} ${cx},${y + BAR_H} ${cx - r},${y + r}"><title>${label}</title></polygon>`;
        } else {
          const left = x(span.from);
          const w = Math.max(2, x(span.to) - left);
          bars += `<rect class="${cls}" data-name="${escapeHtml(dinosaur.name)}" fill="${fill}"
            x="${left}" y="${y}" width="${w}" height="${BAR_H}" rx="1"><title>${label}</title></rect>`;
        }
      });
    });

    const axisY = top + lanes.length * LANE_H;
    let ticks = '';
    // floor, not ceil: rounding up put the first tick older than the axis start,
    // i.e. at a negative x, off the left edge of the SVG.
    for (let ma = Math.floor(oldest / 20) * 20; ma >= youngest; ma -= 20) {
      ticks += `<line class="tl-tick" x1="${x(ma)}" y1="${axisY}" x2="${x(ma)}" y2="${axisY + 5}" />`;
      ticks += `<text class="tl-tick-label" x="${x(ma)}" y="${axisY + 17}" text-anchor="middle">${ma}</text>`;
    }
    ticks += `<text class="tl-axis-label" x="${plotW + padX}" y="${axisY + 30}" text-anchor="end">million years ago</text>`;

    const brush = timeWindow
      ? `<rect class="tl-brush" x="${x(timeWindow.from)}" y="${top}"
           width="${Math.max(1, x(timeWindow.to) - x(timeWindow.from))}" height="${lanes.length * LANE_H}" />`
      : '';

    host.innerHTML =
      `<svg class="tl-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
            role="img" aria-label="Timeline of when each dinosaur lived, ${Math.round(oldest)} to ${Math.round(youngest)} million years ago">
        ${bands}${bandLabels}${brush}${bars}
        <line class="tl-axis" x1="${padX}" y1="${axisY}" x2="${plotW + padX}" y2="${axisY}" />
        ${ticks}
      </svg>`;

    wireTimeline(host, oldest, youngest, padX);
  }

  function wireTimeline(host, oldest, youngest, padX) {
    const svg = host.querySelector('svg');
    if (!svg) return;
    const toMa = (clientX) => {
      const rect = svg.getBoundingClientRect();
      const span = Math.max(1, rect.width - padX * 2);
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left - padX) / span));
      return oldest - ratio * (oldest - youngest);
    };

    svg.querySelectorAll('[data-name]').forEach((el) => {
      el.addEventListener('click', (event) => {
        event.stopPropagation();
        selectDinosaur(el.dataset.name);
      });
    });

    // Clicking a band is a shortcut for brushing exactly that epoch — one
    // mechanism, two ways in, rather than two competing time filters.
    svg.querySelectorAll('[data-epoch]').forEach((el) => {
      el.addEventListener('click', () => {
        const epoch = EPOCH_BOUNDS.find((e) => e.name === el.dataset.epoch);
        if (!epoch) return;
        const same = timeWindow && timeWindow.from === epoch.from && timeWindow.to === epoch.to;
        timeWindow = same ? null : { from: epoch.from, to: epoch.to };
        applyFilters();
      });
    });

    let dragStart = null;
    let dragMoved = false;
    svg.addEventListener('pointerdown', (event) => {
      if (event.target.closest('[data-name]')) return;
      dragStart = toMa(event.clientX);
      dragMoved = false;
      // Throws if the pointer is already gone (fast taps, synthetic events);
      // capture is an optimisation here, not a requirement for the drag.
      try { svg.setPointerCapture(event.pointerId); } catch (e) { /* not capturable */ }
    });
    svg.addEventListener('pointermove', (event) => {
      if (dragStart === null) return;
      const now = toMa(event.clientX);
      if (Math.abs(now - dragStart) < 1) return; // ignore jitter on a plain click
      dragMoved = true;
      timeWindow = { from: Math.max(dragStart, now), to: Math.min(dragStart, now) };
      applyFilters();
    });
    const endDrag = () => {
      // A click with no drag clears the brush. Keyed off whether the pointer
      // actually moved — inspecting the resulting window instead meant a click
      // after an earlier drag left that earlier window in place.
      if (dragStart !== null && !dragMoved && timeWindow) {
        timeWindow = null;
        applyFilters();
      }
      dragStart = null;
      dragMoved = false;
    };
    svg.addEventListener('pointerup', endDrag);
    svg.addEventListener('pointercancel', endDrag);
  }

  // --- Size chart ----------------------------------------------------------
  //
  // `length` is recorded for 74 of 75 and was previously reduced to a one-way
  // "minimum" slider, which says nothing about the distribution. A strip plot
  // shows the shape — a dense cluster of mid-sized theropods with a long
  // sauropod tail — and the human reference is what makes 35 m mean anything.
  const HUMAN_M = 1.8;
  const DOT_R = 4;
  const DOT_LANE_H = 11;
  const SIZE_AXIS_H = 34;
  const SIZE_TOP = 26; // headroom for the human marker's label

  function renderSizeChart(visible) {
    const host = document.getElementById('size-chart');
    if (!host || allDinosaurs.length === 0) return;

    const withLength = allDinosaurs.filter((d) => typeof d.length === 'number');
    const withoutLength = allDinosaurs.filter((d) => typeof d.length !== 'number');
    const maxLength = Math.ceil(Math.max(...withLength.map((d) => d.length)) / 5) * 5;

    const width = host.clientWidth || 320;
    // Inset by half a tick label plus the dot radius: without it the "0" and
    // "35" labels and the dot at the maximum were clipped by the SVG edge.
    const padX = 14;
    const plotW = width - padX * 2;
    const x = (metres) => (metres / maxLength) * plotW + padX;
    // Lanes are packed in metres, so the gap is expressed in metres too.
    const gapM = ((DOT_R * 2) + 1) / plotW * maxLength;

    const lanes = packDots(
      withLength.map((d) => ({ dinosaur: d, position: d.length })),
      gapM,
    );
    const height = SIZE_TOP + lanes.length * DOT_LANE_H + SIZE_AXIS_H;
    const axisY = SIZE_TOP + lanes.length * DOT_LANE_H;
    const visibleNames = new Set(visible.map((d) => d.name));

    let dots = '';
    lanes.forEach((lane, laneIndex) => {
      const cy = SIZE_TOP + laneIndex * DOT_LANE_H + DOT_LANE_H / 2;
      lane.forEach(({ dinosaur }) => {
        const isVisible = visibleNames.has(dinosaur.name);
        const isSelected = selectedDinosaur && selectedDinosaur.name === dinosaur.name;
        const cls = `sz-dot${isVisible ? '' : ' sz-dot--out'}${isSelected ? ' sz-dot--sel' : ''}`;
        dots += `<circle class="${cls}" data-name="${escapeHtml(dinosaur.name)}"
          cx="${x(dinosaur.length)}" cy="${cy}" r="${DOT_R}"
          fill="${DIET_COLORS[dinosaur.diet] || 'var(--chart-unknown)'}"
          ><title>${escapeHtml(dinosaur.name)} — ${dinosaur.length} m</title></circle>`;
      });
    });

    // The human reference is the whole reason this chart reads viscerally, so
    // it is drawn over the dots rather than behind them.
    const humanX = x(HUMAN_M);
    const human = `<g class="sz-human">
      <line x1="${humanX}" y1="${SIZE_TOP - 8}" x2="${humanX}" y2="${axisY}" />
      <text x="${humanX + 5}" y="${SIZE_TOP - 12}">1.8 m — average adult human</text>
    </g>`;

    let ticks = '';
    const step = maxLength > 20 ? 5 : 2;
    for (let m = 0; m <= maxLength; m += step) {
      ticks += `<line class="tl-tick" x1="${x(m)}" y1="${axisY}" x2="${x(m)}" y2="${axisY + 5}" />`;
      ticks += `<text class="tl-tick-label" x="${x(m)}" y="${axisY + 17}" text-anchor="middle">${m}</text>`;
    }
    ticks += `<text class="tl-axis-label" x="${plotW + padX}" y="${axisY + 30}" text-anchor="end">metres long</text>`;

    const brush = lengthWindow
      ? `<rect class="tl-brush" x="${x(lengthWindow.min)}" y="${SIZE_TOP}"
           width="${Math.max(1, x(lengthWindow.max) - x(lengthWindow.min))}" height="${lanes.length * DOT_LANE_H}" />`
      : '';

    const missingNote = withoutLength.length
      ? `<p class="sz-missing">Length not recorded: ${withoutLength.map((d) => escapeHtml(d.name)).join(', ')}</p>`
      : '';

    host.innerHTML =
      `<svg class="sz-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
            role="img" aria-label="Every dinosaur plotted by length, from 0 to ${maxLength} metres, against a 1.8 metre human reference">
        ${brush}${dots}${human}
        <line class="tl-axis" x1="${padX}" y1="${axisY}" x2="${plotW + padX}" y2="${axisY}" />
        ${ticks}
      </svg>${missingNote}`;

    wireSizeChart(host, maxLength, padX);
  }

  function wireSizeChart(host, maxLength, padX) {
    const svg = host.querySelector('svg');
    if (!svg) return;
    // The plot is inset by padX, so the pointer must be mapped against the plot
    // area rather than the full element or the brush lands off by ~14px.
    const toMetres = (clientX) => {
      const rect = svg.getBoundingClientRect();
      const span = Math.max(1, rect.width - padX * 2);
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left - padX) / span));
      return ratio * maxLength;
    };

    svg.querySelectorAll('[data-name]').forEach((el) => {
      el.addEventListener('click', (event) => {
        event.stopPropagation();
        selectDinosaur(el.dataset.name);
      });
    });

    let dragStart = null;
    let dragMoved = false;
    svg.addEventListener('pointerdown', (event) => {
      if (event.target.closest('[data-name]')) return;
      dragStart = toMetres(event.clientX);
      dragMoved = false;
      // Throws if the pointer is already gone (fast taps, synthetic events);
      // capture is an optimisation here, not a requirement for the drag.
      try { svg.setPointerCapture(event.pointerId); } catch (e) { /* not capturable */ }
    });
    svg.addEventListener('pointermove', (event) => {
      if (dragStart === null) return;
      const now = toMetres(event.clientX);
      if (Math.abs(now - dragStart) < 0.2) return;
      dragMoved = true;
      lengthWindow = { min: Math.min(dragStart, now), max: Math.max(dragStart, now) };
      applyFilters();
    });
    const endDrag = () => {
      if (dragStart !== null && !dragMoved && lengthWindow) {
        lengthWindow = null;
        applyFilters();
      }
      dragStart = null;
      dragMoved = false;
    };
    svg.addEventListener('pointerup', endDrag);
    svg.addEventListener('pointercancel', endDrag);
  }

  // --- Taxonomy ladder: one row per rank, top to bottom.
  //
  // Replaces an earlier node-link SVG tree. That tree paid full 2D layout cost
  // for data that is really a *path*: only one node per row ever has children,
  // so every other box was a collapsed dead end drawn purely for context. With
  // a fixed horizontal slot per sibling it reached 1642x1358px for Citipati
  // (14 ranks deep, under a Theropoda node with 10 children) and needed
  // horizontal scrolling to read.
  //
  // The ladder is bounded in both axes by construction: rank count sets the
  // height, and siblings *wrap* inside their row instead of spreading, so
  // branching factor costs nothing horizontally. It is also plain DOM, which
  // makes it keyboard-navigable and screen-readable for free — the SVG was
  // neither.
  let cachedTaxonomyRoot = null; // the "Dinosauria" node (skips the synthetic root)
  const leafCountCache = new Map();

  // How many dinosaurs sit under a clade. Shown on every chip so the ladder
  // answers "how big is this group?" as well as "what is it?" — the old tree
  // carried no quantities at all.
  function countLeaves(node) {
    if (leafCountCache.has(node)) return leafCountCache.get(node);
    const children = Object.values(node.children);
    const total = children.length === 0
      ? 1
      : children.reduce((sum, child) => sum + countLeaves(child), 0);
    leafCountCache.set(node, total);
    return total;
  }

  // Walks the chain of nodes from Dinosauria down to the dinosaur itself,
  // recording each step's siblings as we go.
  function lineageRungs(root, dinosaurName) {
    const path = [];
    (function dfs(node, trail) {
      if (Object.keys(node.children).length === 0) {
        if (node.name === dinosaurName) { path.push(...trail, node); return true; }
        return false;
      }
      for (const child of Object.values(node.children)) {
        if (dfs(child, [...trail, node])) return true;
      }
      return false;
    })(root, []);

    return path.map((node, i) => {
      const parent = i === 0 ? null : path[i - 1];
      const siblings = parent
        ? Object.values(parent.children)
            .filter((c) => c !== node)
            .map((c) => ({ name: c.name, count: countLeaves(c), isDino: Object.keys(c.children).length === 0 }))
            .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
        : [];
      return {
        name: node.name,
        count: countLeaves(node),
        siblings,
        isSelf: i === path.length - 1,
      };
    });
  }

  // A rank where the lineage had no alternative is a pass-through: no
  // classification decision happened there. Runs of them collapse behind one
  // expander so the ranks that *did* branch carry the eye.
  const MIN_FOLD_RUN = 3;
  function foldPassThroughRuns(rungs) {
    const rows = [];
    let run = [];
    const flush = () => {
      if (run.length === 0) return;
      if (run.length >= MIN_FOLD_RUN) rows.push({ fold: run });
      else rows.push(...run.map((r) => ({ rung: r })));
      run = [];
    };
    rungs.forEach((rung, i) => {
      const foldable = rung.siblings.length === 0 && i !== 0 && !rung.isSelf;
      if (foldable) run.push(rung);
      else { flush(); rows.push({ rung }); }
    });
    flush();
    return rows;
  }

  const SIBLINGS_SHOWN = 5;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function rungHtml(rung) {
    const cls = rung.isSelf ? 'tx-rung tx-rung--self' : 'tx-rung';
    const name = escapeHtml(rung.name);
    const clade = rung.isSelf
      ? `<span class="tx-clade tx-clade--self">${name}</span>`
      : `<button type="button" class="tx-clade" data-clade="${name}">${name}
           <span class="tx-count">${rung.count}</span></button>`;

    let sibs = '';
    if (rung.siblings.length) {
      const shown = rung.siblings.slice(0, SIBLINGS_SHOWN);
      const rest = rung.siblings.length - shown.length;
      sibs = shown
        .map((s) => `<button type="button" class="tx-sib${s.isDino ? ' tx-sib--dino' : ''}" data-clade="${escapeHtml(s.name)}">${escapeHtml(s.name)}<span class="tx-count">${s.count}</span></button>`)
        .join('');
      if (rest > 0) {
        sibs += `<button type="button" class="tx-more" data-expand>+${rest} more</button>`;
        sibs += rung.siblings.slice(SIBLINGS_SHOWN)
          .map((s) => `<button type="button" class="tx-sib tx-sib--hidden${s.isDino ? ' tx-sib--dino' : ''}" data-clade="${escapeHtml(s.name)}" hidden>${escapeHtml(s.name)}<span class="tx-count">${s.count}</span></button>`)
          .join('');
      }
    }

    return `<li class="${cls}">
      <div class="tx-rung__main">${clade}</div>
      <div class="tx-sibs">${sibs}</div>
    </li>`;
  }

  function renderTaxonomyTree(dinosaur) {
    if (!cachedTaxonomyRoot) {
      const fullTree = buildTaxonomyTree(allDinosaurs);
      cachedTaxonomyRoot = fullTree.children['Dinosauria'];
    }

    const rungs = lineageRungs(cachedTaxonomyRoot, dinosaur.name);
    const container = document.getElementById('taxonomy-tree');
    if (rungs.length === 0) { container.innerHTML = ''; return; }

    const crumb = rungs
      .map((r) => `<span class="${r.isSelf ? 'tx-crumb__self' : ''}">${escapeHtml(r.name)}</span>`)
      .join('<i aria-hidden="true">›</i>');

    const rows = foldPassThroughRuns(rungs).map((row) => {
      if (row.fold) {
        return `<li class="tx-fold">
          <button type="button" class="tx-fold__toggle" aria-expanded="false" data-fold>
            ${row.fold.length} intermediate clades
          </button>
          <ol class="tx-fold__body" hidden>${row.fold.map(rungHtml).join('')}</ol>
        </li>`;
      }
      return rungHtml(row.rung);
    }).join('');

    container.innerHTML =
      `<p class="tx-crumb">${crumb}</p>
       <ol class="tx-ladder">${rows}</ol>`;

    container.querySelectorAll('[data-fold]').forEach((button) => {
      button.addEventListener('click', () => {
        const open = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!open));
        button.parentElement.querySelector('.tx-fold__body').hidden = open;
      });
    });
    container.querySelectorAll('[data-expand]').forEach((button) => {
      button.addEventListener('click', () => {
        button.parentElement.querySelectorAll('.tx-sib--hidden').forEach((el) => { el.hidden = false; });
        button.remove();
      });
    });
    // Clicking any clade filters the whole app to that group — the old tree's
    // sibling boxes were inert, which made most of the diagram cost with no payoff.
    container.querySelectorAll('[data-clade]').forEach((button) => {
      button.addEventListener('click', () => {
        cladeFilter = cladeFilter === button.dataset.clade ? null : button.dataset.clade;
        applyFilters();
        // .result-bar, not .overview-grid: the latter pushed the count and the
        // filter chips — the only explanation of what just changed — off-screen.
        scrollToElement(document.querySelector('.result-bar'));
      });
    });
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
    const ramp = `linear-gradient(to right, ${choroplethColor(1, maxCount)}, ${choroplethColor(maxCount, maxCount)})`;
    legend.innerHTML =
      `<span class="map-legend__title">Dinosaurs found</span>
       <span class="map-legend__min">1</span>
       <span class="map-legend__ramp" style="background:${ramp}"></span>
       <span class="map-legend__max">${maxCount}</span>`;
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

  // Clicking a country has always filtered, but never marked the country. That
  // went unnoticed while the Country dropdown was collapsing the choropleth to
  // a single lit country — an accident that looked like feedback. Fixing that
  // collapse left the map with no response to a click at all, so the selection
  // is now drawn explicitly.
  //
  // Driven from applyFilters rather than the click handler, so removing the
  // chip, restoring from a URL, and "Clear all" all keep the map in step.
  let clickedCountryLayer = null;
  function syncCountryHighlight() {
    if (!countryLayer) return;
    if (clickedCountryLayer) {
      countryLayer.resetStyle(clickedCountryLayer);
      clickedCountryLayer = null;
    }
    if (!mapCountryFilter) return;
    countryLayer.eachLayer((layer) => {
      if (layer.feature.properties.name !== mapCountryFilter) return;
      layer.setStyle({ color: themeToken('--ink', '#f0e8c8'), weight: 2.5 });
      layer.bringToFront();
      clickedCountryLayer = layer;
    });
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

  // "Clear all" used to leave the map flown in on whichever country the last
  // selection highlighted, so a full reset still showed (say) Mongolia with all
  // 75 results listed beside it.
  function resetMapView() {
    if (!leafletMap) return;
    if (selectedCountryLayer && countryLayer) {
      countryLayer.resetStyle(selectedCountryLayer);
      selectedCountryLayer = null;
    }
    clearDigSites();
    clickedCountryLayer = null;
    leafletMap.setView([15, 10], 2);
  }

  // --- Dig sites --------------------------------------------------------
  //
  // The museum dataset locates a dinosaur only as a list of modern country
  // names, which is why the choropleth can shade whole countries and nothing
  // finer — and why "North Africa", a region with no polygon, gets dropped.
  // PBDB gives the actual excavation coordinates, so selecting a dinosaur can
  // show where it was really dug up: Citipati stops being "Mongolia" and
  // becomes two points in the Djadokhta Formation.
  function clearDigSites() {
    if (digSiteLayer && leafletMap) {
      leafletMap.removeLayer(digSiteLayer);
      digSiteLayer = null;
    }
  }

  function showDigSites(dinosaur) {
    clearDigSites();
    if (!leafletMap || !dinosaur) return null;
    const sites = occurrences[dinosaur.name];
    if (!sites || sites.length === 0) return null;

    const markers = sites.map(([lng, lat, formation]) => {
      // Cream ring, amber core: the choropleth fill is mid-green at every
      // density step, so a marker in accent alone had too little separation
      // from the country it sits on.
      const marker = L.circleMarker([lat, lng], {
        radius: 5,
        weight: 2,
        color: themeToken('--ink', '#f0e8c8'),
        fillColor: themeToken('--accent', '#d4a048'),
        fillOpacity: 1,
      });
      const place = formation ? `${formation} Formation` : 'Formation not recorded';
      marker.bindTooltip(`${dinosaur.name} — ${place}`, { direction: 'top' });
      return marker;
    });

    digSiteLayer = L.layerGroup(markers).addTo(leafletMap);
    return L.latLngBounds(sites.map(([lng, lat]) => [lat, lng]));
  }

  function focusMapOnDinosaur(dinosaur) {
    if (!leafletMap || !countryLayer) return;

    if (selectedCountryLayer) {
      countryLayer.resetStyle(selectedCountryLayer);
      selectedCountryLayer = null;
    }

    // Country highlight runs first: it calls bringToFront() on the matched
    // polygon, and with preferCanvas:true the polygon and the dig-site markers
    // share one canvas — bringToFront() redraws whichever ran last on top. Dig
    // sites are added after for exactly that reason, or the opaque country
    // fill painted over them and they were invisible despite being on the map.
    const geoNames = resolveCountryGeoNames(dinosaur.foundIn);
    const bounds = [];
    countryLayer.eachLayer((layer) => {
      if (geoNames.includes(layer.feature.properties.name)) {
        layer.setStyle({ color: themeToken('--accent', '#d4a048'), weight: 2 });
        layer.bringToFront();
        bounds.push(layer.getBounds());
        if (!selectedCountryLayer) selectedCountryLayer = layer;
      }
    });

    // Dig sites are strictly better than a country outline, so they win when
    // present; the country highlight still runs underneath for orientation.
    const siteBounds = DIG_SITES_ENABLED ? showDigSites(dinosaur) : null;

    if (geoNames.length === 0) {
      if (siteBounds) leafletMap.flyToBounds(siteBounds.pad(0.8), { maxZoom: 4, duration: 0.6 });
      return;
    }

    if (siteBounds) {
      leafletMap.flyToBounds(siteBounds.pad(0.8), { maxZoom: 4, duration: 0.6 });
    } else if (bounds.length > 0) {
      let combined = bounds[0];
      bounds.slice(1).forEach((b) => { combined = combined.extend(b); });
      leafletMap.flyToBounds(combined, { maxZoom: 5, duration: 0.6 });
    }
  }

  // --- Excavation atlas ---------------------------------------------------
  //
  // The choropleth above and the per-dinosaur pill in the detail panel both
  // show this same PBDB data one dinosaur at a time, which is why it read as
  // a footnote. This plots every recorded site for all 75 genera on one map
  // at once — the same underlying occurrences object, just never flattened
  // and shown together before.
  let excavationMap = null;
  let excavationCountryLayer = null;
  let excavationMarkerRefs = []; // [{marker, name, type, formation}]
  let excavationActiveFormation = null;

  // typeColorFor() returns a literal 'var(--chart-N)' string for the SVG
  // charts, which resolve it themselves via CSS. Leaflet's SVG renderer sets
  // colours as plain attributes rather than through the CSS cascade, so — same
  // as the choropleth's own themeToken() calls above — it needs the actual
  // computed value, not the var() reference itself.
  function resolveThemeColor(value) {
    const match = /^var\((--[\w-]+)\)$/.exec(value || '');
    return match ? themeToken(match[1], value) : value;
  }

  function flattenExcavationSites() {
    const sites = [];
    allDinosaurs.forEach((d) => {
      (occurrences[d.name] || []).forEach(([lng, lat, formation]) => {
        sites.push({ name: d.name, type: d.typeOfDinosaur, lng, lat, formation: formation || null });
      });
    });
    return sites;
  }

  function computeFormationStats(sites) {
    const byFormation = new Map();
    sites.forEach((site) => {
      if (!site.formation) return;
      if (!byFormation.has(site.formation)) byFormation.set(site.formation, { count: 0, genera: new Set() });
      const entry = byFormation.get(site.formation);
      entry.count += 1;
      entry.genera.add(site.name);
    });
    return byFormation;
  }

  function renderExcavationStats(sites, formationStats) {
    const el = document.getElementById('excavation-stats');
    if (!el) return;
    const genera = new Set(sites.map((s) => s.name)).size;
    el.textContent = `${sites.length} sites · ${formationStats.size} formations · ${genera} genera`;
  }

  function renderExcavationLegend(sites) {
    const el = document.getElementById('excavation-legend');
    if (!el) return;
    const types = [...new Set(sites.map((s) => s.type).filter((t) => t && t !== 'N/A'))].sort();
    el.innerHTML = types
      .map((type) => `
        <li>
          <span class="swatch" style="background:${typeColorFor(type)}"></span>
          ${escapeHtml(capitalize(type))}
        </li>
      `)
      .join('');
  }

  function highlightFormation(formationName) {
    excavationActiveFormation = excavationActiveFormation === formationName ? null : formationName;
    document.querySelectorAll('.formation-card').forEach((card) => {
      card.classList.toggle('is-active', card.dataset.formation === excavationActiveFormation);
    });
    const matching = [];
    excavationMarkerRefs.forEach(({ marker, formation }) => {
      const el = marker.getElement ? marker.getElement() : null;
      const isMatch = excavationActiveFormation && formation === excavationActiveFormation;
      if (el) el.classList.toggle('dig-dot-highlight', isMatch);
      if (isMatch) matching.push(marker.getLatLng());
    });
    if (matching.length > 0 && excavationMap) {
      excavationMap.flyToBounds(L.latLngBounds(matching).pad(0.6), { maxZoom: 5, duration: 0.6 });
    }
  }

  // Called from the detail panel's own "↑ View on map" link — flies the
  // atlas to just this genus's dots and pulses them, the same highlight
  // mechanism a formation card uses, so both entry points into the atlas
  // behave identically once you're looking at it.
  function highlightGenusOnAtlas(name) {
    excavationActiveFormation = null;
    document.querySelectorAll('.formation-card').forEach((card) => card.classList.remove('is-active'));
    const matching = [];
    excavationMarkerRefs.forEach(({ marker, name: markerName }) => {
      const el = marker.getElement ? marker.getElement() : null;
      const isMatch = markerName === name;
      if (el) el.classList.toggle('dig-dot-highlight', isMatch);
      if (isMatch) matching.push(marker.getLatLng());
    });
    if (matching.length > 0 && excavationMap) {
      excavationMap.flyToBounds(L.latLngBounds(matching).pad(0.8), { maxZoom: 5, duration: 0.6 });
    }
  }

  function renderFormationList(formationStats) {
    const el = document.getElementById('excavation-formations');
    if (!el) return;
    const top = [...formationStats.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 14);
    el.innerHTML = top
      .map(([formation, { count, genera }]) => `
        <li>
          <button type="button" class="formation-card" data-formation="${escapeHtml(formation)}">
            <span class="formation-card__top">
              <span class="formation-card__name">${escapeHtml(formation)}</span>
              <span class="formation-card__count">×${count}</span>
            </span>
            <p class="formation-card__genera">${escapeHtml([...genera].sort().join(', '))}</p>
          </button>
        </li>
      `)
      .join('');
    el.querySelectorAll('.formation-card').forEach((card) => {
      card.addEventListener('click', () => highlightFormation(card.dataset.formation));
    });
  }

  function initExcavationAtlas() {
    const mapEl = document.getElementById('excavation-map');
    if (!mapEl) return;
    const sites = flattenExcavationSites();
    const formationStats = computeFormationStats(sites);
    renderExcavationStats(sites, formationStats);
    renderExcavationLegend(sites);
    renderFormationList(formationStats);

    if (sites.length === 0) {
      mapEl.innerHTML = '<p class="dig-sites-empty" style="padding:1rem;">No excavation sites available.</p>';
      return;
    }

    // No preferCanvas here (unlike the choropleth): a few hundred SVG circles
    // is cheap, and only the SVG renderer gives each marker a real DOM node —
    // which is what lets the formation-card hover/click reach onto the map
    // and pulse the matching dots via a plain CSS class.
    excavationMap = L.map('excavation-map', {
      scrollWheelZoom: true,
      zoomControl: true,
      attributionControl: false,
      worldCopyJump: false,
      maxBounds: [[-90, -180], [90, 180]],
      maxBoundsViscosity: 1,
      zoomAnimation: false,
      markerZoomAnimation: false,
      fadeAnimation: false,
    }).setView([15, 10], 2);

    loadJson('data/world-countries.geo.json', 'DINO_WORLD').then((geo) => {
      excavationCountryLayer = L.geoJSON(geo, {
        style: () => ({
          fillColor: themeToken('--surface-hover', '#e6e0cd'),
          fillOpacity: 1,
          color: themeToken('--map-border', 'rgba(22,40,29,0.18)'),
          weight: 1,
        }),
      }).addTo(excavationMap);

      excavationMarkerRefs = sites.map((site) => {
        const marker = L.circleMarker([site.lat, site.lng], {
          radius: 4,
          weight: 1.5,
          color: themeToken('--ink', '#f0e8c8'),
          fillColor: resolveThemeColor(typeColorFor(site.type)),
          fillOpacity: 0.9,
        });
        const place = site.formation ? `${site.formation} Formation` : 'Formation not recorded';
        marker.bindTooltip(`${site.name} — ${place}`, { direction: 'top' });
        marker.on('click', () => selectDinosaur(site.name));
        marker.addTo(excavationMap);
        return { marker, name: site.name, type: site.type, formation: site.formation };
      });

      requestAnimationFrame(() => excavationMap.invalidateSize());
    });
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

    loadJson('data/world-countries.geo.json', 'DINO_WORLD')
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
        // The init path never ran a filter pass, so country tooltips stayed
        // empty until the user happened to touch a control.
        applyFilters();
      })
      .catch(() => {
        const panel = document.querySelector('.map-panel');
        if (!panel) return;
        panel.querySelector('#world-map').remove();
        panel.querySelector('#map-legend').innerHTML =
          '<span class="map-legend__title">Map unavailable — country data could not be loaded.</span>';
      });
  }

  // --- Theme toggle. The initial theme is set by an inline script in <head>
  // so it lands before first paint; this only handles user switches. ---
  function syncThemeToggle() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    // The visible string must be part of the accessible name, and the label
    // already flips — carrying aria-pressed as well double-signals in opposite
    // directions, so it is removed.
    toggle.removeAttribute('aria-pressed');
    document.getElementById('theme-toggle-label').textContent = isLight ? 'Dark theme' : 'Light theme';
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
      // Charts/tree follow var() automatically; Leaflet's canvas/SVG output
      // does not, so every themeToken()-derived colour needs a manual redraw.
      if (countryLayer) {
        countryLayer.setStyle(styleForFeature);
        if (selectedDinosaur) focusMapOnDinosaur(selectedDinosaur);
      }
      if (excavationCountryLayer) {
        excavationCountryLayer.setStyle({
          fillColor: themeToken('--surface-hover', '#e6e0cd'),
          color: themeToken('--map-border', 'rgba(22,40,29,0.18)'),
        });
      }
      excavationMarkerRefs.forEach(({ marker, type }) => {
        marker.setStyle({
          color: themeToken('--ink', '#f0e8c8'),
          fillColor: resolveThemeColor(typeColorFor(type)),
        });
      });
      applyFilters();
    });
  }

  loadJson('data/dinosaurs.json', 'DINO_DATA')
    .then((dinosaurs) => {
      allDinosaurs = dinosaurs;
      initShowcase(allDinosaurs);
      initQuiz();
      initNews();
      populateFilterOptions(allDinosaurs);
      renderList(allDinosaurs);
      if (typeof renderCharts === 'function') renderCharts(allDinosaurs, allDinosaurs);
      renderResultBar(allDinosaurs);
      syncSearchClearButton();
      syncFilterControls();
      // initUrlState() below can select a dinosaur immediately (a shared link
      // with a dinosaur in the hash), which renders the detail panel and its
      // dig-site list on the spot — so occurrences must already be loaded by
      // then, not still in flight. Without this await, a fast page load would
      // race it and the very first render would show "no sites recorded" for
      // a genus that does have them.
      const occurrencesPromise = DIG_SITES_ENABLED
        ? loadJson('data/occurrences.json', 'DINO_OCCURRENCES')
          .then((sites) => { occurrences = sites; })
          // Dig sites are an enhancement: without them the map still shades
          // countries exactly as before.
          .catch(() => { occurrences = {}; })
        : Promise.resolve();

      occurrencesPromise.then(() => {
        initMap();
        initExcavationAtlas();
        initThemeToggle();
        initUrlState();
      });
      renderTimeline(allDinosaurs);
      renderSizeChart(allDinosaurs);
      let resizeTimer = null;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          const current = filterDinosaurs();
          renderTimeline(current);
          renderSizeChart(current);
        }, 150);
      });
    })
    .catch((error) => {
      // Previously this rejected silently and left an empty shell — the most
      // common way to hit it being to open index.html straight off disk.
      showLoadError(error);
    });
})();
