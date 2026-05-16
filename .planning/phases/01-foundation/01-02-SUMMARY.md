---
phase: 01-foundation
plan: "02"
subsystem: design-system
tags: [tokens, typography, chrome, styleguide, mdx]
dependency_graph:
  requires: [01-01]
  provides: [tokens-css, base-css, root-layout, brand-mark-stub, floating-dock-stub, styleguide-route, mdx-wired]
  affects: [all-subsequent-plans]
tech_stack:
  added:
    - next/font/google (Instrument_Serif + Inter with CSS variable injection)
    - @next/mdx (MDX file-based routing, proven end-to-end)
  patterns:
    - Global CSS tokens in :root via tokens.css, consumed by base.css and component modules
    - next/font CSS variable override pattern (--font-instrument-serif, --font-inter on html element)
    - CSS Modules colocated with components (.module.css sibling)
    - src/mdx-components.ts required by @next/mdx to bypass @mdx-js/react ESM SSR issue
key_files:
  created:
    - src/styles/tokens.css
    - src/styles/base.css
    - src/components/chrome/BrandMark.tsx
    - src/components/chrome/BrandMark.module.css
    - src/components/chrome/FloatingDock.tsx
    - src/components/chrome/FloatingDock.module.css
    - src/app/styleguide/page.tsx
    - src/app/styleguide/page.module.css
    - src/app/styleguide/mdx-test/page.mdx
    - src/mdx-components.ts
  modified:
    - src/app/layout.tsx
    - src/components/index.ts
decisions:
  - "D-14 Path A deferred: BrandMark stub uses color:var(--ink); mix-blend-difference ships in PLAN 04"
  - "D-15 dock stub: no IntersectionObserver, no scroll listener yet; full behaviors in PLAN 04"
  - "DS-03 spacing/radius: no --space-* or --radius-* tokens; literals live in component CSS"
  - "src/mdx-components.ts at src/ bypasses @mdx-js/react ESM SSR incompatibility with Turbopack"
  - "CSS Modules :global(section[data-darken]) required for attribute selectors in pure-CSS-Modules"
metrics:
  duration: "~30 minutes"
  completed: "2026-05-16T19:30:00Z"
  tasks_completed: 4
  files_modified: 2
  files_created: 10
---

# Phase 01 Plan 02: Walking Skeleton Summary

**One-liner:** Tokens lifted from sketch 006, layout.tsx rebuilt with next/font + globals, stub BrandMark + FloatingDock mounted, /styleguide renders four scrollable sections, /styleguide/mdx-test proves @next/mdx wired end-to-end.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create global tokens.css and base.css lifted from sketch | f286fe6 | src/styles/tokens.css, src/styles/base.css |
| 2 | Rewrite layout.tsx with next/font + globals + chrome mounts | 9a446a3 | src/app/layout.tsx |
| 3 | Create stub BrandMark and stub FloatingDock chrome components | eb15d8f | src/components/chrome/* (4 files), src/components/index.ts |
| 4 | Create /styleguide route with stub anchor sections + MDX proof page | 5d071a6 | src/app/styleguide/* (3 files), src/mdx-components.ts |
| 5 | Visual verification of walking skeleton | — | CHECKPOINT: awaiting human verification |

## Task 5 Status: Awaiting Human Verification

Task 5 is a `checkpoint:human-verify` gate. The dev server must be started and six visual/behavioral points verified by a human before this plan can be marked complete. See checkpoint message returned to orchestrator for instructions.

## Tokens Lifted from Sketch

`tokens.css` lifts the `:root` block verbatim from `sketch/006-full-home/index.html` lines 11–27:
- Color vars: `--bg: #ebe8e2`, `--bg-2`, `--bg-3`, `--ink: #1a1a1a`, `--ink-2`, `--muted`, `--muted-2`, `--line`, `--accent: #ff5a36`, `--accent-soft`, `--surface`, `--dark`
- Font vars: `--font-serif: var(--font-instrument-serif), 'Instrument Serif', serif` and `--font-sans: var(--font-inter), 'Inter', system-ui, sans-serif` (next/font override pattern per PATTERNS.md)

`base.css` lifts the global reset verbatim from sketch lines 28–38: box-sizing reset, overflow-x hidden, body font/bg/color, a/button resets.

## Layout.tsx Rebuild

The root layout now:
- Loads Instrument Serif (weight 400, normal+italic, display:swap, preload:true) and Inter (300/400/500/600, display:swap, preload:true) via next/font/google
- Applies `${instrumentSerif.variable} ${inter.variable}` as className on `<html>`, injecting `--font-instrument-serif` and `--font-inter` CSS vars that tokens.css resolves
- Imports `@/styles/tokens.css` and `@/styles/base.css` globally
- Mounts `<BrandMark />` and `<FloatingDock />` inside `<body>`
- No Once UI, no Providers, no RouteGuard, no theme-init script

## Chrome Stubs Delivered

**BrandMark** — server component (no "use client"), renders `<div className={styles.brand}>Farzaneh</div>`. CSS: `position: fixed; top: 60px; left: 40px; z-index: 60; font-family: var(--font-serif); font-style: italic; font-size: 22px; color: var(--ink)`. No `mix-blend-mode` — PLAN 04 adds Path A.

**FloatingDock** — client component boundary ("use client" declared), renders static `<nav>` with anchor links `#hero`, `#work`, `#about`, `#contact` plus `Get in touch ↗` CTA. CSS lifted verbatim from sketch lines 66–87 including `.dock.hidden { transform: translate(-50%, 120px); }` class so PLAN 04 can toggle it without touching CSS. No scroll listener, no IntersectionObserver — PLAN 04 adds those.

## /styleguide and MDX Routes Live

`/styleguide` — four `<section>` elements with ids `hero`, `work`, `about`, `contact`. About and Contact carry `data-darken` attribute, which triggers `background: var(--ink); color: var(--bg)` (dark sections for brand-mark inversion test in PLAN 04). Each section has `min-height: 100vh` and `max-width: 1500px; margin: 0 auto`.

`/styleguide/mdx-test` — MDX file at `src/app/styleguide/mdx-test/page.mdx` renders h1, paragraph, and *italic em* via @next/mdx. Build output confirms route is present and static.

Build result (`npm run build` exits 0):
```
Route (app)
├ ○ /
├ ○ /_not-found
├ ○ /robots.txt
├ ○ /sitemap.xml
├ ○ /styleguide
└ ○ /styleguide/mdx-test
```

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] CSS Modules rejects bare attribute selector `section[data-darken]`**
- **Found during:** Task 4 — first `npm run build` attempt
- **Issue:** CSS Modules with Turbopack requires "pure" selectors (at least one local class or id). `section[data-darken]` and `section[data-darken] h2` are global-element selectors and fail the purity check.
- **Fix:** Wrapped both selectors in `:global()`: `:global(section[data-darken]) { ... }` and `:global(section[data-darken]) h2 { ... }`. The acceptance criteria `page.module.css contains data-darken` still passes (the string is present).
- **Files modified:** src/app/styleguide/page.module.css
- **Commit:** 5d071a6

**2. [Rule 3 - Blocking] @mdx-js/react ESM incompatibility causes `c.default.createContext is not a function` in Turbopack SSR**
- **Found during:** Task 4 — second `npm run build` attempt (CSS fixed, MDX still failing)
- **Issue:** `@next/mdx` v16 resolves `next-mdx-import-source-file` to `@mdx-js/react` as a fallback when no `mdx-components` file is found in the project. `@mdx-js/react` v3 is ESM-only; Turbopack's SSR bundler emits it as a CJS module with `c.default.createContext`, which fails because the ESM module namespace object is not a React-like object.
- **Fix:** Created `src/mdx-components.ts` that exports `useMDXComponents`. `@next/mdx` checks `private-next-root-dir/src/mdx-components` first in its resolve alias chain, so this file takes precedence over `@mdx-js/react`. The hook returns passthrough components; Phase 3 (CS-01) will extend it.
- **Files modified:** src/mdx-components.ts (new file)
- **Commit:** 5d071a6

## Known Stubs

- `src/components/chrome/BrandMark.tsx`: `color: var(--ink)` only. PLAN 04 adds `mix-blend-mode: difference` (D-14 Path A).
- `src/components/chrome/FloatingDock.tsx`: Static anchor links only. PLAN 04 adds hide-on-scroll, active-section tracking, smooth-scroll.
- `src/app/styleguide/page.tsx`: Placeholder text. PLAN 03 swaps stub markup for real primitives (Eyebrow, DisplayHeading, etc.).
- `src/mdx-components.ts`: Returns passthrough components. Phase 3 (CS-01) wires styled MDX component map.

## Threat Flags

None. This plan creates no network endpoints, no auth paths, no file access patterns, no schema changes. The `/styleguide` route is intentionally not linked from main navigation (D-19).

## Self-Check: PASSED

- [x] src/styles/tokens.css exists — contains --bg: #ebe8e2, --ink: #1a1a1a, --accent: #ff5a36
- [x] src/styles/base.css exists — contains box-sizing: border-box, overflow-x: hidden
- [x] src/app/layout.tsx — contains Instrument_Serif, Inter, instrumentSerif.variable, inter.variable
- [x] src/components/chrome/BrandMark.tsx — contains Farzaneh, no mix-blend, no "use client"
- [x] src/components/chrome/BrandMark.module.css — position: fixed, top: 60px, left: 40px, 22px
- [x] src/components/chrome/FloatingDock.tsx — "use client", #hero/#work/#about/#contact, Get in touch
- [x] src/components/chrome/FloatingDock.module.css — position: fixed, bottom: 24px, border-radius: 100px, backdrop-filter
- [x] src/app/styleguide/page.tsx — four sections with data-darken on about/contact
- [x] src/app/styleguide/page.module.css — min-height: 100vh, max-width: 1500px, data-darken dark styles
- [x] src/app/styleguide/mdx-test/page.mdx — heading + italic
- [x] src/mdx-components.ts — useMDXComponents hook
- [x] npm run build exits 0 — /styleguide and /styleguide/mdx-test in route list
- [x] Commit f286fe6 exists (Task 1)
- [x] Commit 9a446a3 exists (Task 2)
- [x] Commit eb15d8f exists (Task 3)
- [x] Commit 5d071a6 exists (Task 4)
