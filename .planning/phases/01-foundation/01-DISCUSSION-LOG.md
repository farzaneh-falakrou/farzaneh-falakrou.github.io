# Phase 1: Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-16
**Phase:** 1-Foundation
**Areas discussed:** Bootstrap strategy, Styling architecture, Phase 1 demo location

---

## Meta — Framing of the Discussion

Initial gray-area presentation was framed around the existing Next.js codebase (Once UI Magic Portfolio template). User redirected:

> *"current project setup is irrelevant, it is more imporatnt to take a look at what you did in the sketches."*

All subsequent options were re-grounded in `.planning/sketches/006-full-home/index.html` as the binding spec. The existing scaffold is treated as a starter to be stripped, not a constraint on the design.

---

## Bootstrap Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Strip in place | Keep repo + package.json + Next.js config; delete unused routes/components; rip out @once-ui-system/*. Fast, preserves git history. | ✓ |
| Nuke src/, rebuild empty | rm -rf src/ then rebuild with fresh App Router skeleton. Cleanest mental model; slower. | |
| Fresh create-next-app, move files | Start new project in temp dir, move config across. Maximum clean slate; most disruptive. | |

**User's choice:** Strip in place.
**Notes:** Combined with user's earlier framing ("sketches are truth"), this means we keep configuration files (next.config, tsconfig, eslint/biome, package manager scripts) but treat almost all `src/` contents as deletable. The exhaustive deletion list is in CONTEXT.md §Decisions D-03..D-06.

---

## Styling Architecture

| Option | Description | Selected |
|--------|-------------|----------|
| Global tokens.css + CSS Modules | One src/styles/tokens.css with :root vars, per-component Foo.module.css. Mirrors sketch verbatim. | ✓ |
| Global tokens.scss + SCSS Modules | Same but with sass for nesting. Matches existing .module.scss pattern. | |
| Tailwind utility classes | Tokens become theme config. Maps awkwardly from editorial CSS in sketch (clamp(), ::after, keyframes). | |

**User's choice:** Global tokens.css + CSS Modules.
**Notes:** This drops the `sass` dependency entirely, since the sketch CSS is flat and doesn't need SCSS features. The `:root` block from sketch lines 11–27 is lifted verbatim into `src/styles/tokens.css`.

---

## Phase 1 Demo Location

| Option | Description | Selected |
|--------|-------------|----------|
| /styleguide route | Living docs showing every primitive + dock + brand mark. Survives into v1. Not linked from main nav. | ✓ |
| Replace / with stitched home | Build full home now with placeholder content. Pulls Phase 2 forward. | |
| Temp /_dev route | Throwaway, deleted at end of Phase 1. Loses the artifact. | |
| Sketch HTML as the demo | Verify in browser via the HTML sketch; React versions just need to compile. | |

**User's choice:** /styleguide route.
**Notes:** /styleguide is a permanent v1 route (URL-only, not in main nav) that future phases can reference when verifying primitives. Includes stub `#hero`/`#work`/`#about`/`#contact` sections so the dock's scroll-tracking is exercisable.

---

## Gray Areas Not Selected (and why)

### Brand mark: JS toggle vs mix-blend-difference (NOT selected)
The sketch implements brand-mark color flipping via a JS scroll listener that toggles `body.dark-section`. The roadmap success criterion #5 specifies CSS `mix-blend-difference` over `[data-darken]`. These are two valid mechanisms with the same visual result.

User did not pick a side — captured in CONTEXT.md as Claude's discretion (D-14). Recommendation: try `mix-blend-difference` first (no JS, survives slow scroll), fall back to the sketch's JS approach if it doesn't render well over the cream + dark-section combo in practice.

---

## Claude's Discretion (deferred to planner)

- Brand mark mechanism (D-14): mix-blend-difference vs JS class toggle — pick during planning.
- MDX library choice (D-16): `@next/mdx` (recommended for v1's single MDX file) vs `next-mdx-remote`.
- Whether `api/og/`, `api/rss/` survive Phase 1 cleanup (D-04) — investigate during planning; default = delete unless useful for SEO.
- Whether `ScrollToHash.tsx` is reused or replaced by the dock's own smooth-scroll (D-03).

## Deferred Ideas

Captured in CONTEXT.md `<deferred>` — all responsive behavior to Phase 5, real content to Phases 2/3/4, case-study and About-specific primitives to their respective phases, dock cross-page behavior to Phase 2, MDX component map to Phase 3.

Open questions from STATE.md (custom domain, mobile TOC pattern, work-card placeholder targets) remain open and route to their phases.
