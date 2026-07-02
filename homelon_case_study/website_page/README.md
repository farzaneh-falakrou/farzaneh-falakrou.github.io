---
sketch: homelon-01
name: homelon-case-study
question: "How should the Homelon case study read inside the locked Editorial + Structured template, in the Balanced (variant B) register?"
winner: null
tags: [case-study, homelon, full-page, integration, content]
related:
  - .planning/sketches/005-case-study-template
  - splitsmart-case-study/website_page
---

# Homelon Case Study — Webpage Sketch

A single-variant build (Balanced / variant B only — see
`splitsmart-case-study/website_page/README.md` for the full A/B/C comparison this
register comes from) inside the locked **Editorial + Structured** template from
sketch 005. Mirrors SplitSmart's own unfinished Phase 2: this sketch has not been
ported into the Next.js site (`src/app/` has no case-study route), and `winner: null`
reflects that no decision has been made about whether/how to ship it.

## The thesis

**Real estate listings drown new buyers in information — Homelon cuts through it
with a comparison-first search flow.** Homelon leads with side-by-side comparison
instead of burying it behind separate listing pages, helping first-time buyers move
from overwhelmed to confident.

## How to View

Open `index.html` (in this folder) in a browser. There is only one variant — no
keypress switcher (SplitSmart's page has a 1/2/3 switcher across three variants;
this page has a single `#hb` section).

## Structure

7 sections, matching `../case-study.md`: The Problem · Competitive Audit · User
Stories & Flows · Design Decisions · The Screens · Gaps and Limitations ·
Conclusion.

## Notes on Content

Body content is a direct port of `../case-study.md` (Phase 1, complete), with two
deliberate compressions for the hero: the H1 and subhead condense the Problem
section's prose into a punchier headline, matching the rhetorical pattern
SplitSmart's variant B uses (short H1 + explanatory italic subhead) — no new claims,
only rephrasing of already-approved Phase 1 sentences.

## Known Gaps

- **Role, Team, Type** metadata fields render literal "TBD" — `case-study.md`'s
  header has no source for these (see Phase 1 design doc). Update both files
  together once the user provides them.
- **Screenshots** are the curated 12-file set from `../visuals/` (see
  `docs/superpowers/plans/2026-07-02-homelon-case-study-webpage.md` Task 1 for the
  full source-to-copy mapping) — not the complete 28-file `../screens/` set.
