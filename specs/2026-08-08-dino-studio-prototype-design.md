# Dino Studio Interactive Prototype — Design

## Context

The portfolio already has a written case study for Dino Studio
(`dino_studio_case_study/`), built from the legacy `legacy/dino_studio.html`
page. This is a separate, new deliverable: an actual **clickable prototype**
of the Dino Studio app itself — not a write-up describing it.

Source material:

- `legacy/dino_studio.html` and `legacy/images/dino_studio/*` — original
  case-study assets (taxonomy tree gif, map gif, high-fidelity mockups).
- The original Chingu brief:
  https://github.com/chingu-voyages/voyage-project-tier2-dinosaurs — defines
  the MVP requirements (dinosaur display, search, diet/type charts, location
  map, detail view) and the real dataset,
  `assets/dinosaurs.json` (75 dinosaurs from the National History Museum,
  fields: `id`, `name`, `imageSrc`, `typeOfDinosaur`, `length`, `weight`,
  `diet`, `whenLived`, `foundIn`, `taxonomy`, `namedBy`, `typeSpecies`,
  `description`).

## Goal

A clickable static prototype covering: home/search, taxonomy tree, world map
+ carousel, and dinosaur detail view + diet/type charts — driven by the real
75-dinosaur dataset, in a warm pastel ("natural history museum") visual
style. Single scrolling page, no navigation between separate pages.

## Architecture

- New standalone folder at repo root: `dino_studio_prototype/`
  ```
  dino_studio_prototype/
  ├── README.md          — source, scope, status (not wired into site nav)
  ├── index.html
  ├── css/style.css
  ├── js/app.js
  └── data/dinosaurs.json   — copied verbatim from the Chingu repo (75 entries, all fields)
  ```
- Plain HTML/CSS/vanilla JS. No build step, no framework, no external chart
  or map library — consistent with the other static case-study folders in
  this repo (`splitsmart-case-study/`, `homelon_case_study/`,
  `dino_studio_case_study/`).
- Not wired into the main site nav/portfolio index. That's a separate future
  step (same status as `dino_studio_case_study/`'s own deferred "portfolio
  wiring" item).
- No backend, no live API calls — matches the brief's "purely frontend
  application" requirement. All data is the local static JSON file.

## Data pipeline

**Taxonomy tree.** The dataset has no tree structure, only a flat lineage
string per dinosaur, e.g.
`"Dinosauria, Saurischia, Sauropodomorpha, Prosauropoda, Anchisauria"`. At
page load, `app.js` splits every dinosaur's `taxonomy` string on `,` and
inserts it into a shared in-memory tree (trie keyed by lineage segment),
attaching the dinosaur's name as a leaf under its full path. On selection,
the ancestor path from root to the selected dinosaur's leaf is highlighted;
sibling branches are dimmed/collapsed. This reproduces the case study's
"simplify the tree to the relevant branch" idea, using the real 75-dinosaur
data instead of a mock.

**Map.** The dataset only has country-level `foundIn` strings (~20 unique
countries across the 75 entries; some entries list multiple countries, e.g.
`"Canada, USA"`). There is no GIS/map asset in this repo. The map will be a
**stylized, illustrative** world map (simplified continent shapes, not
survey-accurate), with a small hand-built lookup table mapping each country
name appearing in the dataset to an approximate x/y position. Multi-country
entries render one dot per listed country. This is a deliberate
simplification, not a real cartographic projection.

**Images.** `imageSrc` URLs from the dataset (hosted on nhm.ac.uk) are used
directly (hotlinked) rather than downloading and re-hosting 75 images.
`<img>` tags get an `onerror` handler that swaps in a local placeholder
silhouette so a dead/blocked external URL doesn't break card layout.

**Charts.** Diet distribution (herbivorous/carnivorous/omnivorous) and
`typeOfDinosaur` distribution (9 categories) are computed once from the full
75-record dataset at load time and rendered as a hand-built SVG/CSS pie
chart and doughnut chart — no charting library.

## Screens / interaction flow

Single scrolling page, no separate routes:

1. **Header** — "Dino Studio" wordmark + search input. Search filters the
   grid live, case-insensitive substring match across `name`, `foundIn`,
   `diet`, `typeOfDinosaur` (matches the brief's search acceptance
   criteria).
2. **Overview charts** — the diet pie chart and type doughnut chart,
   computed from the full dataset (not per-selection).
3. **Dinosaur grid** — cards with image, name, weight, length, country,
   diet; respects the current search filter; empty-search state when no
   matches. Clicking a card sets it as the "selected" dinosaur.
4. **Selected-dinosaur panel** — updates in place and scrolls into view on
   selection (no page navigation). Before any selection, shows a "pick a
   dinosaur" placeholder. Contains:
   - **Detail block** — all brief-required fields: image, typeOfDinosaur,
     length, diet, whenLived, typeSpecies, description, foundIn, taxonomy,
     namedBy.
   - **Taxonomy tree** — highlights the selected dinosaur's lineage per the
     data pipeline above.
   - **Map + carousel** — stylized world map with the selected dinosaur's
     country marker emphasized, plus a horizontal scrollable carousel of
     thumbnails (all 75) for quickly switching selection — mirrors the
     legacy carousel pattern.
5. **Footer** — link to the Dino Studio case study page and GitHub.

## Styling

Warm pastel / "natural history museum" direction (user-selected over legacy
high-fidelity blue and portfolio-orange options):

- Background: sand (`#fdf6ec`)
- Primary: moss green (`#2e4d3e`)
- Accent (selection/highlight state): terracotta (`#c96f4a`)
- Serif display headings (echoes the "serious illustration" tone from the
  original user research), sans-serif body text.

Responsive: grid reflows to 1–2 columns on narrow viewports; map and
carousel remain usable via horizontal scroll at small widths (brief
requires responsiveness across devices).

## Explicit non-goals

- No portfolio/nav wiring (future step).
- No backend or live API integration.
- No pixel-accurate/GIS map.
- No locally re-hosted dinosaur images (hotlinked with fallback instead).

## Verification plan

No build step or test suite for a static HTML/CSS/JS folder. Verification
is manual, via the Browser tool against `index.html`:

- Search filters the grid correctly (including empty-results state).
- Clicking a card updates the detail panel, taxonomy highlight, map marker,
  and carousel position together.
- Carousel selection also updates the detail panel (round-trip).
- Broken image URL falls back to the placeholder without breaking layout.
- Responsive check at mobile viewport width.
