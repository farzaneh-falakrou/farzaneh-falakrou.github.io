---
phase: 01-foundation
type: walking-skeleton
created: 2026-05-16
---

# Walking Skeleton — Phase 01 Foundation

The thinnest end-to-end slice that proves the architecture chosen in CONTEXT.md (sketches-as-truth, CSS Modules + tokens, `next/font`, `@next/mdx`, mix-blend-difference brand mark, IntersectionObserver dock) actually renders.

The Walking Skeleton is delivered by **PLAN 02** (the lowest-wave plan after the strip in PLAN 01). After PLAN 02 ships:

- Project scaffold survives strip — `next build` produces a passing build with no Once UI imports.
- `src/styles/tokens.css` and `src/styles/base.css` load once via `src/app/layout.tsx`.
- `next/font/google` loads Instrument Serif + Inter and exposes `--font-instrument-serif` / `--font-inter` CSS variables consumed by `tokens.css`.
- `/styleguide` renders a real page with four stub sections (`#hero`, `#work`, `#about`, `#contact`) using cream background + ink text + locked fonts.
- A stub `BrandMark` (italic "Farzaneh" text, fixed `top: 60px; left: 40px`) is mounted in `layout.tsx` and visible on `/styleguide`. No inversion behavior yet.
- A stub `FloatingDock` (centered pill, four anchor links + "Get in touch ↗" CTA) is mounted in `layout.tsx` and visible on `/styleguide`. No scroll behaviors yet.
- An MDX document at `src/app/styleguide/mdx-test/page.mdx` renders end-to-end (proves `@next/mdx` wiring) and is reachable at `/styleguide/mdx-test`.

After this skeleton lands, PLAN 03 swaps stub markup inside `/styleguide` sections for the six real primitives, and PLAN 04 replaces the stub `BrandMark` and `FloatingDock` with their full behaviors.

## Architectural Decisions Recorded

| Topic | Decision | Source |
|---|---|---|
| Framework | Next.js 16 + React 19 (App Router) | existing scaffold, kept per D-01 |
| Language | TypeScript (strict, `@/*` → `src/*`) | existing `tsconfig.json`, kept per D-01 |
| Package manager | **npm** (committed `package-lock.json`) | repo state |
| Styling | Global `tokens.css` + `base.css` + colocated `Foo.module.css` per component. No SCSS, no Tailwind, no CSS-in-JS. | D-07, D-08, D-09, D-10 |
| Typography loader | `next/font/google` in `layout.tsx`. `Instrument_Serif` + `Inter` exposed as CSS variables. | D-12 |
| Brand mark mechanism | **CSS `mix-blend-difference`** over `[data-darken]` (Path A). Server component, no client JS. | D-14 (planner-locked) |
| Dock active-section tracking | **IntersectionObserver** in a `"use client"` component. Section IDs locked: `hero`, `work`, `about`, `contact`. | D-15 |
| MDX library | **`@next/mdx`** (file-based, `.mdx` routes). Drop `next-mdx-remote`. | D-16 (planner-locked) |
| MDX proof location | `src/app/styleguide/mdx-test/page.mdx` (kept under `/styleguide` per D-17). | D-17 |
| Demo route | `/styleguide` with stub `#hero`/`#work`/`#about`/`#contact` sections. Not linked from main nav (D-19). | D-18 |
| Home placeholder | One-line placeholder page at `/` per D-20 (real home is Phase 2). | D-20 |
| Lint/format | Biome + ESLint (existing configs preserved per code_context). | INFRA-01 / INFRA-05 |

## Directory Layout (post-Phase 1)

```
src/
  app/
    layout.tsx                 (rewritten — next/font + globals + BrandMark + FloatingDock)
    page.tsx                   (rewritten — one-line placeholder per D-20)
    favicon.ico                (kept)
    robots.ts                  (kept, untouched)
    sitemap.ts                 (kept, untouched)
    styleguide/
      page.tsx                 (NEW — primitive showcase + stub anchor sections)
      page.module.css          (NEW — section padding, data-darken backgrounds)
      mdx-test/
        page.mdx               (NEW — proves @next/mdx renders end-to-end)
  components/
    chrome/
      BrandMark.tsx            (NEW — server component, mix-blend-difference)
      BrandMark.module.css     (NEW)
      FloatingDock.tsx         (NEW — "use client", IntersectionObserver + scroll-hide)
      FloatingDock.module.css  (NEW)
    primitives/
      Eyebrow.tsx + .module.css
      DisplayHeading.tsx + .module.css
      Italic.tsx + .module.css
      UnderlineAccent.tsx + .module.css
      PulseDot.tsx + .module.css
      TagChip.tsx + .module.css
      index.ts                 (barrel)
    index.ts                   (rewritten barrel — re-export chrome + primitives)
  styles/
    tokens.css                 (NEW — verbatim from sketch lines 11–27)
    base.css                   (NEW — verbatim from sketch lines 28–38)
```

Phase 2 will add `src/app/page.tsx` (real home) and home-page section components. Phase 3 will add `src/app/work/splitsmart/page.mdx` and case-study primitives. Phase 4 will add `src/app/about/page.tsx`. None of those phases will renegotiate the decisions above.

## Survival Test

A subsequent phase asking "should we use Tailwind?" or "should we add framer-motion?" must be answered: **no — Phase 1 locked CSS Modules + tokens.css; if you need motion, lift the sketch's CSS animation primitives the same way Phase 1 lifted `@keyframes pulse`.** This document is the source for those refusals.
