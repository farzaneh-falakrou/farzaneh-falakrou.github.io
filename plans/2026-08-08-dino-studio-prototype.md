# Dino Studio Interactive Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a clickable, data-driven static prototype of the Dino Studio app (home/search, taxonomy tree, world map + carousel, dinosaur detail + diet/type charts) in `dino_studio_prototype/`, driven by the real 75-dinosaur Chingu dataset.

**Architecture:** Plain HTML/CSS/vanilla JS, no build step. Pure data-transform functions (search filter, chart aggregation, taxonomy tree, country-position lookup) live in `js/data.js` and are unit-tested with Node's built-in `assert` (dual-purpose: browser global via plain `<script>`, and `module.exports` for Node tests). DOM rendering and event wiring live in `js/app.js` and are verified manually in the Browser tool, since there's no DOM test runner in this repo.

**Tech Stack:** HTML5, CSS3, vanilla JS (ES2020), Node.js `assert/strict` for logic unit tests. No frameworks, no bundler, no external libraries.

---

## Spec

See `specs/2026-08-08-dino-studio-prototype-design.md` for full design context (palette, screen breakdown, non-goals).

## File Structure

```
dino_studio_prototype/
├── README.md                — source/scope/status note
├── index.html                — full page markup (header/search, charts, grid, detail panel, footer)
├── css/style.css             — warm pastel palette, layout, responsive rules
├── js/data.js                — pure data-transform functions (unit tested)
├── js/app.js                 — DOM rendering + event wiring (uses window.DinoData from data.js)
├── data/dinosaurs.json       — 75-entry dataset, copied verbatim from the Chingu repo
├── images/placeholder.svg    — fallback silhouette for broken imageSrc links
└── tests/data.test.js        — Node assert tests for js/data.js
```

`data.js` is loaded via `<script src="js/data.js">` before `app.js` in `index.html`, so its top-level `function` declarations become globals `app.js` calls directly (e.g. `filterDinosaurs(...)`). At the bottom of `data.js`, a Node-only shim exports the same functions via `module.exports` so `tests/data.test.js` can `require()` them without any build step or bundler.

---

### Task 1: Scaffold folder, copy dataset, placeholder image

**Files:**
- Create: `dino_studio_prototype/data/dinosaurs.json`
- Create: `dino_studio_prototype/images/placeholder.svg`
- Create: `dino_studio_prototype/README.md`

- [ ] **Step 1: Create the folder and copy the dataset**

```bash
mkdir -p dino_studio_prototype/data dino_studio_prototype/images dino_studio_prototype/js dino_studio_prototype/css dino_studio_prototype/tests
cp /private/tmp/claude-501/-Users-farzanehfalakrou-Desktop-workspace-linkedin/b1fd3262-25fd-4fa7-b418-95bad7148fba/scratchpad/voyage-project-tier2-dinosaurs/assets/dinosaurs.json dino_studio_prototype/data/dinosaurs.json
```

If that scratchpad path is gone (session cleaned up), re-clone first:
```bash
git clone https://github.com/chingu-voyages/voyage-project-tier2-dinosaurs.git /tmp/voyage-dino-src
cp /tmp/voyage-dino-src/assets/dinosaurs.json dino_studio_prototype/data/dinosaurs.json
```

- [ ] **Step 2: Verify the dataset copied correctly**

```bash
python3 -c "import json; d=json.load(open('dino_studio_prototype/data/dinosaurs.json')); print(len(d), d[0]['name'])"
```

Expected: `75 Aardonyx`

- [ ] **Step 3: Create the placeholder fallback image**

```html
<!-- dino_studio_prototype/images/placeholder.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150" role="img" aria-label="Dinosaur image unavailable">
  <rect width="200" height="150" fill="#e8ddc7"/>
  <path d="M60 110 Q60 80 90 75 Q85 55 105 50 Q120 46 130 58 Q145 60 150 78 Q160 82 158 98 Q158 112 145 114 L145 122 L135 122 L135 116 L90 116 L90 122 L80 122 L80 114 Q62 112 60 110 Z" fill="#2e4d3e" opacity="0.35"/>
  <text x="100" y="138" font-family="sans-serif" font-size="10" fill="#7a6f5a" text-anchor="middle">image unavailable</text>
</svg>
```

- [ ] **Step 4: Write the README**

```markdown
<!-- dino_studio_prototype/README.md -->
# Dino Studio — Interactive Prototype

A clickable, data-driven prototype of the Dino Studio app: search, a
diet/type overview, a dinosaur grid, and a detail view with a taxonomy tree
and world map, built from the real 75-dinosaur dataset used in the original
Chingu voyage project (https://github.com/chingu-voyages/voyage-project-tier2-dinosaurs).

This is a prototype, not the case-study write-up — see `../dino_studio_case_study/`
for that. Plain HTML/CSS/JS, no build step: open `index.html` directly in a
browser.

## Status

Not yet wired into the main portfolio site nav — standalone for now.

## Design notes

- Taxonomy tree is built client-side from each dinosaur's `taxonomy` string
  (a flat lineage, not a pre-built tree).
- The world map is stylized/illustrative, not a survey-accurate projection —
  country positions are a small hand-built lookup table.
- Dinosaur images are hotlinked from the original NHM `imageSrc` URLs, with
  a local placeholder fallback on load failure.

See `../specs/2026-08-08-dino-studio-prototype-design.md` for the full design.
```

- [ ] **Step 5: Commit**

```bash
git add dino_studio_prototype/data/dinosaurs.json dino_studio_prototype/images/placeholder.svg dino_studio_prototype/README.md
git commit -m "feat(dino-prototype): scaffold folder, dataset, README"
```

---

### Task 2: Search filter (`filterDinosaurs`)

**Files:**
- Create: `dino_studio_prototype/js/data.js`
- Create: `dino_studio_prototype/tests/data.test.js`

- [ ] **Step 1: Write the failing test**

```javascript
// dino_studio_prototype/tests/data.test.js
const assert = require('node:assert/strict');
const { filterDinosaurs } = require('../js/data.js');

const sample = [
  { name: 'Aardonyx', foundIn: 'South Africa', diet: 'herbivorous', typeOfDinosaur: 'prosauropod' },
  { name: 'Tyrannosaurus', foundIn: 'USA, Canada', diet: 'carnivorous', typeOfDinosaur: 'large theropod' },
  { name: 'Triceratops', foundIn: 'USA', diet: 'herbivorous', typeOfDinosaur: 'ceratopsian' },
];

function testFilterByNameCaseInsensitivePartial() {
  const result = filterDinosaurs(sample, 'tri');
  assert.deepEqual(result.map(d => d.name), ['Triceratops']);
}

function testFilterByCountry() {
  const result = filterDinosaurs(sample, 'usa');
  assert.deepEqual(result.map(d => d.name).sort(), ['Triceratops', 'Tyrannosaurus']);
}

function testFilterByDiet() {
  const result = filterDinosaurs(sample, 'carnivorous');
  assert.deepEqual(result.map(d => d.name), ['Tyrannosaurus']);
}

function testEmptyQueryReturnsAll() {
  const result = filterDinosaurs(sample, '');
  assert.equal(result.length, 3);
}

function testNoMatchesReturnsEmptyArray() {
  const result = filterDinosaurs(sample, 'xyz-no-match');
  assert.deepEqual(result, []);
}

testFilterByNameCaseInsensitivePartial();
testFilterByCountry();
testFilterByDiet();
testEmptyQueryReturnsAll();
testNoMatchesReturnsEmptyArray();
console.log('filterDinosaurs: all tests passed');
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
node dino_studio_prototype/tests/data.test.js
```

Expected: `Error: Cannot find module '../js/data.js'` (file doesn't exist yet).

- [ ] **Step 3: Write the minimal implementation**

```javascript
// dino_studio_prototype/js/data.js
function filterDinosaurs(dinosaurs, query) {
  const q = query.trim().toLowerCase();
  if (!q) return dinosaurs.slice();
  return dinosaurs.filter((d) => {
    const haystack = [d.name, d.foundIn, d.diet, d.typeOfDinosaur]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

if (typeof module !== 'undefined') {
  module.exports = { filterDinosaurs };
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
node dino_studio_prototype/tests/data.test.js
```

Expected: `filterDinosaurs: all tests passed`

- [ ] **Step 5: Commit**

```bash
git add dino_studio_prototype/js/data.js dino_studio_prototype/tests/data.test.js
git commit -m "feat(dino-prototype): add filterDinosaurs with tests"
```

---

### Task 3: Chart aggregation (`computeDietCounts`, `computeTypeCounts`)

**Files:**
- Modify: `dino_studio_prototype/js/data.js`
- Modify: `dino_studio_prototype/tests/data.test.js`

- [ ] **Step 1: Add the failing tests**

Append to `dino_studio_prototype/tests/data.test.js` (above the existing test-runner calls at the bottom — move the `require` line to include the new functions):

```javascript
// change the require line at the top to:
const { filterDinosaurs, computeDietCounts, computeTypeCounts } = require('../js/data.js');
```

```javascript
// add before the existing test-runner calls
function testComputeDietCounts() {
  const result = computeDietCounts(sample);
  assert.deepEqual(result, { herbivorous: 2, carnivorous: 1, omnivorous: 0 });
}

function testComputeTypeCounts() {
  const result = computeTypeCounts(sample);
  assert.deepEqual(result, {
    prosauropod: 1,
    'large theropod': 1,
    ceratopsian: 1,
  });
}
```

```javascript
// add to the test-runner calls at the bottom, before the console.log
testComputeDietCounts();
testComputeTypeCounts();
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
node dino_studio_prototype/tests/data.test.js
```

Expected: `TypeError: computeDietCounts is not a function`

- [ ] **Step 3: Implement**

Append to `dino_studio_prototype/js/data.js` (above the `module.exports` block):

```javascript
function computeDietCounts(dinosaurs) {
  const counts = { herbivorous: 0, carnivorous: 0, omnivorous: 0 };
  for (const d of dinosaurs) {
    if (d.diet in counts) counts[d.diet] += 1;
  }
  return counts;
}

function computeTypeCounts(dinosaurs) {
  const counts = {};
  for (const d of dinosaurs) {
    counts[d.typeOfDinosaur] = (counts[d.typeOfDinosaur] || 0) + 1;
  }
  return counts;
}
```

Update the exports block:

```javascript
if (typeof module !== 'undefined') {
  module.exports = { filterDinosaurs, computeDietCounts, computeTypeCounts };
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
node dino_studio_prototype/tests/data.test.js
```

Expected: `filterDinosaurs: all tests passed`

- [ ] **Step 5: Commit**

```bash
git add dino_studio_prototype/js/data.js dino_studio_prototype/tests/data.test.js
git commit -m "feat(dino-prototype): add diet/type count aggregation with tests"
```

---

### Task 4: Taxonomy path + tree (`resolveTaxonomyPath`, `buildTaxonomyTree`)

**Files:**
- Modify: `dino_studio_prototype/js/data.js`
- Modify: `dino_studio_prototype/tests/data.test.js`

- [ ] **Step 1: Add the failing tests**

Update the require line:

```javascript
const { filterDinosaurs, computeDietCounts, computeTypeCounts, resolveTaxonomyPath, buildTaxonomyTree } = require('../js/data.js');
```

Add a taxonomy-specific sample and tests:

```javascript
const taxonomySample = [
  { name: 'Aardonyx', taxonomy: 'Dinosauria, Saurischia, Sauropodomorpha, Prosauropoda, Anchisauria' },
  { name: 'Massospondylus', taxonomy: 'Dinosauria, Saurischia, Sauropodomorpha, Prosauropoda' },
  { name: 'Tyrannosaurus', taxonomy: 'Dinosauria, Saurischia, Theropoda, Tyrannosauroidea' },
];

function testResolveTaxonomyPathAppendsName() {
  const path = resolveTaxonomyPath(taxonomySample[0]);
  assert.deepEqual(path, [
    'Dinosauria', 'Saurischia', 'Sauropodomorpha', 'Prosauropoda', 'Anchisauria', 'Aardonyx',
  ]);
}

function testResolveTaxonomyPathTrimsWhitespace() {
  const path = resolveTaxonomyPath({ name: 'X', taxonomy: 'A,  B ,C' });
  assert.deepEqual(path, ['A', 'B', 'C', 'X']);
}

function testBuildTaxonomyTreeSharesCommonAncestors() {
  const tree = buildTaxonomyTree(taxonomySample);
  // root -> Dinosauria -> Saurischia -> Sauropodomorpha -> Prosauropoda -> { Anchisauria -> Aardonyx (leaf) }
  //                                                                      -> Massospondylus (leaf)
  const dinosauria = tree.children['Dinosauria'];
  const saurischia = dinosauria.children['Saurischia'];
  assert.equal(Object.keys(saurischia.children).sort().join(','), 'Sauropodomorpha,Theropoda');

  const prosauropoda = saurischia.children['Sauropodomorpha'].children['Prosauropoda'];
  assert.ok(prosauropoda.children['Massospondylus'].isLeaf);
  assert.ok(prosauropoda.children['Anchisauria'].children['Aardonyx'].isLeaf);
}
```

Add to the runner calls:

```javascript
testResolveTaxonomyPathAppendsName();
testResolveTaxonomyPathTrimsWhitespace();
testBuildTaxonomyTreeSharesCommonAncestors();
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
node dino_studio_prototype/tests/data.test.js
```

Expected: `TypeError: resolveTaxonomyPath is not a function`

- [ ] **Step 3: Implement**

Append to `dino_studio_prototype/js/data.js` (above `module.exports`):

```javascript
function resolveTaxonomyPath(dinosaur) {
  const segments = dinosaur.taxonomy
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  segments.push(dinosaur.name);
  return segments;
}

function buildTaxonomyTree(dinosaurs) {
  const root = { name: 'root', children: {}, isLeaf: false };
  for (const dinosaur of dinosaurs) {
    const path = resolveTaxonomyPath(dinosaur);
    let node = root;
    path.forEach((segment, i) => {
      if (!node.children[segment]) {
        node.children[segment] = { name: segment, children: {}, isLeaf: false };
      }
      node = node.children[segment];
      if (i === path.length - 1) node.isLeaf = true;
    });
  }
  return root;
}
```

Update exports:

```javascript
if (typeof module !== 'undefined') {
  module.exports = {
    filterDinosaurs,
    computeDietCounts,
    computeTypeCounts,
    resolveTaxonomyPath,
    buildTaxonomyTree,
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
node dino_studio_prototype/tests/data.test.js
```

Expected: `filterDinosaurs: all tests passed`

- [ ] **Step 5: Commit**

```bash
git add dino_studio_prototype/js/data.js dino_studio_prototype/tests/data.test.js
git commit -m "feat(dino-prototype): add taxonomy path/tree builder with tests"
```

---

### Task 5: Country position lookup (`COUNTRY_POSITIONS`, `resolveCountryPositions`)

**Files:**
- Modify: `dino_studio_prototype/js/data.js`
- Modify: `dino_studio_prototype/tests/data.test.js`

- [ ] **Step 1: Add the failing tests**

Update the require line:

```javascript
const {
  filterDinosaurs, computeDietCounts, computeTypeCounts,
  resolveTaxonomyPath, buildTaxonomyTree, resolveCountryPositions,
} = require('../js/data.js');
```

```javascript
function testResolveCountryPositionsSingleCountry() {
  const positions = resolveCountryPositions('USA');
  assert.deepEqual(positions, [{ country: 'USA', x: 22, y: 28 }]);
}

function testResolveCountryPositionsMultiCountry() {
  const positions = resolveCountryPositions('Canada, USA');
  assert.deepEqual(positions.map((p) => p.country), ['Canada', 'USA']);
}

function testResolveCountryPositionsUnknownCountrySkipped() {
  const positions = resolveCountryPositions('Atlantis');
  assert.deepEqual(positions, []);
}
```

```javascript
testResolveCountryPositionsSingleCountry();
testResolveCountryPositionsMultiCountry();
testResolveCountryPositionsUnknownCountrySkipped();
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
node dino_studio_prototype/tests/data.test.js
```

Expected: `TypeError: resolveCountryPositions is not a function`

- [ ] **Step 3: Implement**

Append to `dino_studio_prototype/js/data.js` (above `module.exports`). Positions are approximate percentages (x = longitude, y = latitude) on a stylized equirectangular map, covering every country string found in `data/dinosaurs.json`:

```javascript
const COUNTRY_POSITIONS = {
  Algeria: { x: 51, y: 34 },
  Antarctica: { x: 50, y: 94 },
  Argentina: { x: 32, y: 69 },
  Australia: { x: 88, y: 64 },
  Canada: { x: 21, y: 19 },
  Chile: { x: 30, y: 68 },
  China: { x: 79, y: 31 },
  Egypt: { x: 58, y: 35 },
  England: { x: 50, y: 21 },
  France: { x: 51, y: 24 },
  Germany: { x: 53, y: 22 },
  India: { x: 72, y: 38 },
  Kazakhstan: { x: 69, y: 23 },
  Mongolia: { x: 79, y: 24 },
  Morocco: { x: 48, y: 32 },
  Niger: { x: 52, y: 41 },
  'North Africa': { x: 54, y: 36 },
  Portugal: { x: 48, y: 28 },
  'South Africa': { x: 57, y: 67 },
  Tanzania: { x: 60, y: 53 },
  USA: { x: 22, y: 28 },
  'United Kingdom': { x: 50, y: 21 },
  Uruguay: { x: 34, y: 68 },
  Uzbekistan: { x: 68, y: 27 },
  Zimbabwe: { x: 58, y: 61 },
};

function resolveCountryPositions(foundIn) {
  return foundIn
    .split(',')
    .map((c) => c.trim())
    .filter((c) => COUNTRY_POSITIONS[c])
    .map((c) => ({ country: c, ...COUNTRY_POSITIONS[c] }));
}
```

Update exports:

```javascript
if (typeof module !== 'undefined') {
  module.exports = {
    filterDinosaurs,
    computeDietCounts,
    computeTypeCounts,
    resolveTaxonomyPath,
    buildTaxonomyTree,
    resolveCountryPositions,
    COUNTRY_POSITIONS,
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
node dino_studio_prototype/tests/data.test.js
```

Expected: `filterDinosaurs: all tests passed`

- [ ] **Step 5: Verify every country in the dataset has a lookup entry**

```bash
node -e "
const { COUNTRY_POSITIONS } = require('./dino_studio_prototype/js/data.js');
const dinosaurs = require('./dino_studio_prototype/data/dinosaurs.json');
const missing = new Set();
for (const d of dinosaurs) {
  for (const c of d.foundIn.split(',').map(s => s.trim())) {
    if (!COUNTRY_POSITIONS[c]) missing.add(c);
  }
}
console.log('missing countries:', [...missing]);
"
```

Expected: `missing countries: []`

- [ ] **Step 6: Commit**

```bash
git add dino_studio_prototype/js/data.js dino_studio_prototype/tests/data.test.js
git commit -m "feat(dino-prototype): add country position lookup with tests"
```

---

### Task 6: Page skeleton and palette (`index.html`, `css/style.css`)

**Files:**
- Create: `dino_studio_prototype/index.html`
- Create: `dino_studio_prototype/css/style.css`

- [ ] **Step 1: Write the HTML skeleton**

```html
<!-- dino_studio_prototype/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Dino Studio — Prototype</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <header class="site-header">
    <div class="wordmark">Dino Studio</div>
    <input id="search-input" class="search-input" type="search" placeholder="Search by name, country, diet, type…" />
  </header>

  <main>
    <section class="overview" aria-label="Dataset overview">
      <div class="chart-block">
        <h2>Diet</h2>
        <svg id="diet-chart" viewBox="0 0 100 100" role="img" aria-label="Diet distribution pie chart"></svg>
        <ul id="diet-legend" class="chart-legend"></ul>
      </div>
      <div class="chart-block">
        <h2>Type</h2>
        <svg id="type-chart" viewBox="0 0 100 100" role="img" aria-label="Dinosaur type distribution doughnut chart"></svg>
        <ul id="type-legend" class="chart-legend"></ul>
      </div>
    </section>

    <section class="grid-section" aria-label="Dinosaur list">
      <p id="grid-empty-state" class="empty-state" hidden>No dinosaurs match your search.</p>
      <div id="dino-grid" class="dino-grid"></div>
    </section>

    <section id="detail-panel" class="detail-panel" aria-label="Selected dinosaur detail">
      <p id="detail-placeholder" class="empty-state">Select a dinosaur to see its details, taxonomy, and location.</p>
      <div id="detail-content" class="detail-content" hidden>
        <div class="detail-info">
          <img id="detail-image" src="" alt="" />
          <div>
            <h2 id="detail-name"></h2>
            <dl id="detail-fields"></dl>
            <p id="detail-description"></p>
          </div>
        </div>

        <div class="taxonomy-block">
          <h3>Taxonomy</h3>
          <div id="taxonomy-tree" class="taxonomy-tree"></div>
        </div>

        <div class="map-block">
          <h3>Found in</h3>
          <svg id="world-map" viewBox="0 0 100 60" role="img" aria-label="Stylized world map"></svg>
          <div id="carousel" class="carousel"></div>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <a href="../dino_studio_case_study/website_page/index.html">Case study</a>
    <a href="https://github.com/farzaneh-falakrou">GitHub</a>
  </footer>

  <script src="js/data.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write the palette and layout CSS**

```css
/* dino_studio_prototype/css/style.css */
:root {
  --sand: #fdf6ec;
  --moss: #2e4d3e;
  --terracotta: #c96f4a;
  --ink: #2b2620;
  --card-bg: #ffffff;
  --border: #e8ddc7;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--sand);
  color: var(--ink);
  font-family: -apple-system, "Segoe UI", sans-serif;
}

h1, h2, h3, .wordmark {
  font-family: Georgia, "Times New Roman", serif;
}

.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--moss);
  color: var(--sand);
  flex-wrap: wrap;
}

.wordmark { font-size: 1.4rem; font-weight: 700; }

.search-input {
  flex: 1 1 260px;
  max-width: 420px;
  padding: 0.5rem 0.75rem;
  border-radius: 999px;
  border: none;
  font-size: 1rem;
}

main { max-width: 1100px; margin: 0 auto; padding: 1.5rem; }

.overview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-block {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
}

.chart-block svg { width: 140px; height: 140px; }

.chart-legend { list-style: none; padding: 0; margin: 0.5rem 0 0; text-align: left; font-size: 0.85rem; }
.chart-legend li { display: flex; align-items: center; gap: 0.4rem; padding: 0.15rem 0; }
.chart-legend .swatch { width: 10px; height: 10px; border-radius: 2px; display: inline-block; }

.dino-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.dino-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 0.75rem;
  cursor: pointer;
  text-align: left;
}

.dino-card:hover, .dino-card.selected {
  border-color: var(--terracotta);
  box-shadow: 0 0 0 2px var(--terracotta);
}

.dino-card img { width: 100%; height: 100px; object-fit: cover; border-radius: 8px; }
.dino-card h3 { margin: 0.5rem 0 0.25rem; font-size: 1rem; }
.dino-card p { margin: 0; font-size: 0.8rem; color: #6b6153; }

.empty-state { color: #6b6153; font-style: italic; }

.detail-panel {
  margin-top: 2rem;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
}

.detail-info { display: flex; gap: 1.5rem; flex-wrap: wrap; }
.detail-info img { width: 220px; height: 160px; object-fit: cover; border-radius: 8px; }
.detail-info dl { display: grid; grid-template-columns: auto 1fr; gap: 0.25rem 0.75rem; font-size: 0.9rem; }
.detail-info dt { font-weight: 700; color: var(--moss); }
.detail-info dd { margin: 0; }

.taxonomy-tree { font-size: 0.85rem; line-height: 1.6; }
.taxonomy-tree .branch { padding-left: 1rem; border-left: 2px solid var(--border); }
.taxonomy-tree .branch.active { border-left-color: var(--terracotta); font-weight: 700; color: var(--terracotta); }
.taxonomy-tree .branch.dim { opacity: 0.4; }

.map-block svg { width: 100%; max-width: 500px; background: #eaf1ea; border-radius: 8px; }

.carousel { display: flex; gap: 0.5rem; overflow-x: auto; padding: 0.75rem 0; }
.carousel img { width: 64px; height: 64px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 2px solid transparent; }
.carousel img.selected { border-color: var(--terracotta); }

.site-footer {
  text-align: center;
  padding: 1.5rem;
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}
.site-footer a { color: var(--moss); }

@media (max-width: 640px) {
  .overview { grid-template-columns: 1fr; }
  .detail-info { flex-direction: column; }
  .detail-info img { width: 100%; height: 180px; }
}
```

- [ ] **Step 3: Commit**

```bash
git add dino_studio_prototype/index.html dino_studio_prototype/css/style.css
git commit -m "feat(dino-prototype): add page skeleton and warm pastel styles"
```

---

### Task 7: Grid rendering + search wiring (`js/app.js`)

**Files:**
- Create: `dino_studio_prototype/js/app.js`

- [ ] **Step 1: Implement data loading, grid rendering, and search**

```javascript
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
```

- [ ] **Step 2: Manually verify in the browser**

Open `dino_studio_prototype/index.html` (via a local static server, since `fetch()` of a local JSON file needs `http://`, not `file://`):

```bash
python3 -m http.server 8000 --directory dino_studio_prototype
```

Then open `http://localhost:8000/` in the Browser tool. Expected: a grid of 75 dinosaur cards renders. Typing "usa" in the search box filters the grid down to only dinosaurs found in the USA; clearing it restores all 75.

- [ ] **Step 3: Commit**

```bash
git add dino_studio_prototype/js/app.js
git commit -m "feat(dino-prototype): render dinosaur grid with live search"
```

---

### Task 8: Overview charts (`renderCharts`)

**Files:**
- Modify: `dino_studio_prototype/js/app.js`

- [ ] **Step 1: Implement SVG pie/doughnut rendering**

Add to `dino_studio_prototype/js/app.js`, above the closing `})();`:

```javascript
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
```

`renderCharts` is already called from the `fetch(...).then(...)` chain added in Task 7 (`if (typeof renderCharts === 'function') renderCharts(allDinosaurs);`), so no change needed there.

- [ ] **Step 2: Manually verify in the browser**

Reload `http://localhost:8000/`. Expected: a pie chart under "Diet" with 3 colored slices (herbivorous largest at 41/75) and a doughnut chart under "Type" with 9 slices, each with a matching legend listing counts.

- [ ] **Step 3: Commit**

```bash
git add dino_studio_prototype/js/app.js
git commit -m "feat(dino-prototype): render diet/type overview charts"
```

---

### Task 9: Detail panel rendering (`renderDetail`)

**Files:**
- Modify: `dino_studio_prototype/js/app.js`

- [ ] **Step 1: Replace the no-op `renderDetail` with the real implementation**

Replace this block from Task 7:

```javascript
  window.selectDinosaur = selectDinosaur;
  function renderDetail() {}
```

with:

```javascript
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
```

- [ ] **Step 2: Manually verify in the browser**

Reload `http://localhost:8000/` and click any dinosaur card. Expected: the page scrolls to the detail panel, showing that dinosaur's image, name, and all 8 fields (type, length, weight, diet, when lived, type species, found in, named by) plus its description. Clicking a different card updates the panel in place.

- [ ] **Step 3: Commit**

```bash
git add dino_studio_prototype/js/app.js
git commit -m "feat(dino-prototype): render selected-dinosaur detail panel"
```

---

### Task 10: Taxonomy tree rendering with highlight (`renderTaxonomyTree`)

**Files:**
- Modify: `dino_studio_prototype/js/app.js`

- [ ] **Step 1: Implement**

Add to `dino_studio_prototype/js/app.js`, above the closing `})();`:

```javascript
  let cachedTaxonomyTree = null;

  function renderTaxonomyTree(selectedDino) {
    if (!cachedTaxonomyTree) cachedTaxonomyTree = buildTaxonomyTree(allDinosaurs);
    const activePath = resolveTaxonomyPath(selectedDino);

    function renderNode(node, depth) {
      const isActive = depth < activePath.length && node.name === activePath[depth];
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
```

- [ ] **Step 2: Manually verify in the browser**

Reload and click a dinosaur card. Expected: the taxonomy tree panel shows the full lineage hierarchy with the selected dinosaur's ancestor chain (e.g. `Dinosauria → Saurischia → Sauropodomorpha → ...`) highlighted in terracotta and bold, while unrelated branches appear dimmed.

- [ ] **Step 3: Commit**

```bash
git add dino_studio_prototype/js/app.js
git commit -m "feat(dino-prototype): render taxonomy tree with lineage highlight"
```

---

### Task 11: Map + carousel rendering (`renderMap`)

**Files:**
- Modify: `dino_studio_prototype/js/app.js`

- [ ] **Step 1: Implement**

Add to `dino_studio_prototype/js/app.js`, above the closing `})();`:

```javascript
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
```

Note: the map's y-coordinates from `COUNTRY_POSITIONS` are on a 0–100 scale; the `#world-map` viewBox is `0 0 100 60`, so `y * 0.6` rescales latitude percentage to the shorter viewBox height.

- [ ] **Step 2: Manually verify in the browser**

Reload and click a dinosaur card. Expected: a stylized world map appears with a terracotta dot over the selected dinosaur's country (or one dot per country for multi-country entries like `"Canada, USA"`), and a horizontal scrollable carousel of all 75 dinosaur thumbnails appears below it, with the current selection outlined. Clicking a different thumbnail in the carousel updates the whole detail panel (grid highlight, taxonomy tree, map, and carousel selection all move together).

- [ ] **Step 3: Commit**

```bash
git add dino_studio_prototype/js/app.js
git commit -m "feat(dino-prototype): render stylized map and selection carousel"
```

---

### Task 12: Full manual verification pass

**Files:** none (verification only)

- [ ] **Step 1: Start the static server if not already running**

```bash
python3 -m http.server 8000 --directory dino_studio_prototype
```

- [ ] **Step 2: Verify the full flow in the Browser tool**

Navigate to `http://localhost:8000/` and check, in order:
1. Grid loads with 75 cards on initial page load.
2. Typing `raptor` in search narrows the grid to matching names; clearing the box restores all 75.
3. Typing a string with no matches (e.g. `zzzzz`) shows the "No dinosaurs match your search" empty state and an empty grid.
4. Clicking a grid card scrolls to the detail panel and populates image, name, all 8 fields, and description.
5. The taxonomy tree shows the clicked dinosaur's lineage highlighted, other branches dimmed.
6. The map shows a dot for the dinosaur's country/countries.
7. The carousel shows all 75 thumbnails with the current one outlined; clicking a different thumbnail updates the grid highlight, detail fields, taxonomy highlight, and map together.
8. A dinosaur whose `imageSrc` fails to load (simulate by editing the URL in dev tools, or just confirm the `onerror` handler is wired) falls back to `images/placeholder.svg` without breaking card layout.

- [ ] **Step 3: Verify responsiveness**

Resize the Browser pane to the `mobile` preset (375×812) and reload. Expected: the overview charts stack to a single column, the grid reflows to fewer columns, and the detail image stacks above the fields instead of sitting beside them.

- [ ] **Step 4: Fix any issues found, then commit**

If step 2 or 3 surfaces a bug, fix it in the relevant file from Tasks 6–11, re-run this task's checklist, then:

```bash
git add dino_studio_prototype/
git commit -m "fix(dino-prototype): address issues found in manual verification pass"
```

If nothing needed fixing, skip the commit — there's nothing to commit.

---

## Self-Review Notes

- **Spec coverage:** header/search (Task 7), overview charts (Task 8), dinosaur grid (Task 7), detail panel with all brief-required fields (Task 9), taxonomy tree with lineage highlight (Task 4 + 10), stylized map + carousel (Task 5 + 11), warm pastel styling and responsiveness (Task 6, verified in Task 12), dataset copy and attribution (Task 1). All spec sections have a task.
- **Non-goals respected:** no portfolio nav wiring, no backend calls, no chart/map library, no locally re-hosted images — none of the tasks above introduce any of these.
