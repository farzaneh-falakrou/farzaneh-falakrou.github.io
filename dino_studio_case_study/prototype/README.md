# Dino Studio — Interactive Prototype

A clickable, data-driven prototype of the Dino Studio app: search, a
diet/type overview, a dinosaur grid, and a detail view with a taxonomy tree
and world map, built from the real 75-dinosaur dataset used in the original
Chingu voyage project (https://github.com/chingu-voyages/voyage-project-tier2-dinosaurs).

This is a prototype, not the case-study write-up — see `../`
for that. Plain HTML/CSS/JS, no build step (except Leaflet, loaded via CDN
for the map): open `index.html` via a local static server (fetches need
`http://`, not `file://`), e.g. `python3 -m http.server 8000`.

## Status

Not yet wired into the main portfolio site nav — standalone for now.

## Design notes

- Layout, palette, filter bar, and detail-panel structure are modeled on the
  original high-fidelity screens in `../screens/`
  (Dino1–8.png), not just the legacy `dino_studio.html` case-study text.
- Taxonomy tree renders only the selected dinosaur's ancestor chain (built
  client-side from its flat `taxonomy` string) as a left-to-right lineage
  diagram, not the full 75-dinosaur tree.
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
