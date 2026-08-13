# Dino Studio — Interactive Prototype

A clickable, data-driven prototype of the Dino Studio app: search, a
diet/type overview, a dinosaur grid, and a detail view with a taxonomy tree
and world map, built from the real 75-dinosaur dataset used in the original
Chingu voyage project (https://github.com/chingu-voyages/voyage-project-tier2-dinosaurs).

This is a prototype, not the case-study write-up — see `../`
for that. Plain HTML/CSS/JS, no build step (except Leaflet, loaded via CDN
for the map).

Serving the folder over HTTP is still the best way to run it —
`python3 -m http.server 8000` — but opening `index.html` straight off disk now
works too: `fetch()` is blocked by CORS over `file://`, so `data/*.data.js`
(the same payloads wrapped in a global assignment, loaded as plain `<script>`
tags) stand in when it fails. Regenerate them with `python3 tools/bundle-data.py`
after editing either JSON file.

## Status

Not yet wired into the main portfolio site nav — standalone for now.

## Design system

The stylesheet is token-driven: six type steps (`--t-micro` … `--t-h1`), a 4px
spacing scale (`--s1` … `--s7`), one `--radius`, one `--dur`. Nothing should
introduce a new font size or spacing value — the file previously carried 18 of
the former and ~25 of the latter, which read as jitter rather than hierarchy.

Specimen images are never cropped. The sources are all 400px wide with heights
from 166 to 714 (aspect ratios 0.56–2.41), so they are `object-fit: contain`
inside a 3:2 plate coloured `--plate` — a warm off-white in *both* themes,
matching the artwork's own background so the letterboxing disappears.

The categorical chart ramp spans five hues. An earlier version was three tints
of green, three of amber, and one colour at three alpha values, which made
legend swatches unmappable to pie wedges.

## Deep time

`whenLived` is free text but rigidly shaped, and all 75 records parse
(`parseWhenLived` in `js/data.js`, with tests). It is rendered as a Gantt-style
chart: one bar per dinosaur across its recorded range, greedily packed into 19
lanes, coloured by diet, with epoch bands behind.

- The 8 single-point dates are drawn as **diamonds**, not bars — a point date is
  an absence of range, and a bar's width would invent a duration.
- Carnotaurus is recorded `"69-71"`, i.e. reversed; the parser normalises the
  pair rather than trusting its order.
- Epoch boundaries are ICS v2023/09 constants held in `EPOCH_BOUNDS`, not data
  from the museum dataset. The note under the chart says so.
- Dragging brushes a time window; clicking an epoch band brushes exactly that
  epoch; clicking with no drag clears. Bars outside the current filters dim
  rather than disappear, so the brush always has the full dataset to drag
  against.

## Size

`length` is recorded for 74 of 75 and used to be a one-way "minimum" slider,
which says nothing about the distribution. It is now a beeswarm strip plot —
one dot per dinosaur at its true length, packed into lanes by `packDots` so no
point is ever displaced along the encoded axis (unlike jitter) — with an
average adult human at 1.8 m drawn over the top as the reference that makes
35 m mean anything. Eolambia, the one record without a length, is listed under
the chart rather than silently dropped.

The Min length slider and the chart brush are **one filter with two inputs**
(`lengthWindow`): the slider writes the min edge, the brush writes both, and
each reflects the other. Two independent controls over the same dimension is
the bug that was fixed for country filtering, and it is not reintroduced here.

Deliberately **not** built: any weight-based chart. Only 20 of 75 have a
weight, so it would be a chart of a quarter of the dataset presented as the
whole.

## Shareable views

Every filter — query, country, type, diet, weight threshold, length window,
time window, clade, map country, and the selected dinosaur — is serialised into
`location.hash`, versioned by `v` so the encoding can be migrated rather than
silently misread. Restoring validates each value against the control that owns
it, so a stale or hand-edited link degrades to "no filter" rather than an
impossible state. URL writes are debounced and pushed, so a slider drag or a
burst of typing is one history entry and Back steps through decisions rather
than keystrokes.

## Dig sites

Selecting a dinosaur drops its actual excavation coordinates on the map, from
the Paleobiology Database: 1063 distinct sites across all 75 genera, 1027 of
them naming a geological formation. Citipati stops being "Mongolia" and becomes
two points in the Djadokhta Formation.

This is **prebaked, not fetched at runtime** — `tools/fetch-occurrences.py`
writes `data/occurrences.json`, `tools/bundle-data.py` wraps it for the
`file://` path, and the result is ~31 KB. A runtime call would add a network
dependency, a rate limit, and a failure mode to a page whose whole posture is
that it works offline. Regenerate with:

    python3 tools/fetch-occurrences.py && python3 tools/bundle-data.py

The layer is strictly additive: if `occurrences.json` is missing or fails to
load, the map shades countries exactly as it did before.

Occurrence data is CC BY 4.0 and credited in the footer. It is *not* part of
the museum dataset, which locates a dinosaur only as a list of modern country
names — which is why the choropleth can shade whole countries and nothing
finer, and why "North Africa" (a region with no polygon) is dropped from it.

## Design notes

- Layout, palette, filter bar, and detail-panel structure are modeled on the
  original high-fidelity screens in `../screens/`
  (Dino1–8.png), not just the legacy `dino_studio.html` case-study text.
- Taxonomy is a **vertical rank ladder**, not a node-link tree. One row per
  rank: the lineage clade on the left rail with the number of dinosaurs it
  contains, its sibling clades as chips that *wrap* to the right. Height scales
  with depth, width never scales with branching factor — the previous SVG tree
  used a fixed horizontal slot per sibling and reached 1642x1358px for Citipati
  (14 ranks, under a Theropoda node with 10 children), which needed horizontal
  scrolling to read. Runs of ranks where the lineage had no alternative collapse
  behind one expander. Clicking any clade filters the whole app to that group.
  Being plain DOM rather than SVG, it is keyboard-navigable for free.
- The map is a real interactive Leaflet choropleth: an OpenStreetMap tile
  layer plus `data/world-countries.geo.json` (Natural Earth 110m country
  polygons, extracted from the `world-atlas` npm package, ISC-licensed)
  colored by how many dinosaurs were found in each country. Clicking a
  country filters the grid to dinosaurs found there; selecting a dinosaur
  flies/zooms the map to its country.
- Dinosaur images are hotlinked from the original NHM `imageSrc` URLs, with
  a local placeholder fallback on load failure.

See `../../specs/2026-08-08-dino-studio-prototype-design.md` for the original
design (superseded on the map/layout front by the redesign described above).
