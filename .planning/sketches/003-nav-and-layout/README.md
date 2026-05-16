---
sketch: "003"
name: nav-and-layout
question: "What navigation pattern and home layout fits the locked Signature visual language?"
winner: null
tags: [navigation, layout, ia, home]
---

# Sketch 003: Navigation & Layout

## Design Question
Visual language is locked (see sketch 002 winner). Now: what structural pattern carries it?
Four nav/layout patterns, each evaluated for craft, scalability, and signal.

## How to View
Open `.planning/sketches/003-nav-and-layout/index.html` in a browser.

## Variants

### A · Vertical Rail
Persistent left column (280px) with brand name, primary nav with counts, status indicator, social links. Content scrolls on the right.

- **References:** Rauno Freiberg, Karri Saarinen, Tobi Lutke's blog
- **Strengths:** Identity always visible. Gallery-like browsing. Scales well as work grows.
- **Weaknesses:** Loses ~20% screen real estate. Mobile requires a different pattern (drawer/sheet). Can feel "design system-y."

### B · Floating Dock
Pill-shaped nav floats centered at bottom. Hides on scroll-down, reveals on scroll-up. Brand mark stays at top-left. Card-grid home with project previews.

- **References:** Vercel, Linear marketing, contemporary studios
- **Strengths:** Maximum content area. Thumb-friendly on mobile. Feels modern.
- **Weaknesses:** Less hierarchical. Slightly "trendy" — could date quickly. Discovery affordance weaker than persistent nav.

### C · Inline Masthead
Big magazine-style name banner sticky on top. Compacts to a thin bar when you scroll. Secondary nav inline beneath the name. Featured project layout below — preview + writing.

- **References:** NYT Magazine, Pentagram, A24, editorial sites
- **Strengths:** Name IS the brand mark — confident move. Editorial pacing reads as serious/considered. Hierarchical clarity.
- **Weaknesses:** Compact-state transition is a craft tax to get right. Can feel formal/distant.

### D · Scroll-Anchored
Almost no nav chrome. Tiny brand mark (top-left, mix-blend) + a right-side rail that tracks scroll position. Single long-scroll page: hero → work → about → contact, each as a full section.

- **References:** Award-winning portfolios on Awwwards, Mathieu Comoy, Bruno Simon
- **Strengths:** Content is everything. Feels like a long-form piece. Signature & confident.
- **Weaknesses:** Single-page only — hard to share deep links to specific projects. Less scannable. Forces a "guided tour" experience.

## What to Look For
- **Scalability:** Will this still work when you have 12 projects? When you add a writing/notes section? When you have a 200-word case study _and_ a 5,000-word one?
- **Mobile reality:** Which pattern actually translates? (Rail collapses, dock natively works, masthead compacts, scroll-anchored works as-is.)
- **Signal:** What does this nav say about you before anyone reads a word? A is "considered/IC craft." B is "modern studio." C is "editorial thinker." D is "I have a point of view."
- **Case study entry:** Which pattern best gets people INTO a case study? (Cards in B vs. featured rows in C vs. row-list in A & D)

## Open Questions for After This Sketch
1. Multi-page vs single-page (D forces single-page; A/B/C can be either)
2. Case study template — separate sketch
3. About page treatment — separate sketch
4. Mobile navigation pattern — separate sketch once we know the desktop pattern
