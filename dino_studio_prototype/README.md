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
