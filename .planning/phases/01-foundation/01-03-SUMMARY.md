---
phase: 01-foundation
plan: "03"
subsystem: design-system
tags: [primitives, components, styleguide, css-modules, design-tokens]
dependency_graph:
  requires: [01-02]
  provides: [eyebrow-primitive, display-heading-primitive, italic-primitive, underline-accent-primitive, pulse-dot-primitive, tag-chip-primitive, primitives-barrel, styleguide-living-doc]
  affects: [phase-02-home, phase-03-case-study, phase-04-about]
tech_stack:
  added: []
  patterns:
    - Six colocated TSX + CSS Module pairs under src/components/primitives/
    - CSS Module underscore naming for dynamic class lookups (size_hero, size_work, etc.)
    - Server components throughout — no use client in any primitive
    - Descendant CSS cascade for Italic accent color (DisplayHeading .display em rule)
    - Named barrel export pattern at primitives/index.ts
key_files:
  created:
    - src/components/primitives/PulseDot.tsx
    - src/components/primitives/PulseDot.module.css
    - src/components/primitives/UnderlineAccent.tsx
    - src/components/primitives/UnderlineAccent.module.css
    - src/components/primitives/TagChip.tsx
    - src/components/primitives/TagChip.module.css
    - src/components/primitives/Italic.tsx
    - src/components/primitives/Italic.module.css
    - src/components/primitives/Eyebrow.tsx
    - src/components/primitives/Eyebrow.module.css
    - src/components/primitives/DisplayHeading.tsx
    - src/components/primitives/DisplayHeading.module.css
    - src/components/primitives/index.ts
  modified:
    - src/components/index.ts
    - src/app/styleguide/page.tsx
    - src/app/styleguide/page.module.css
decisions:
  - "CSS Module class names use underscores for dynamic lookup: size_hero not size-hero (styles[`size_${size}`] resolves correctly)"
  - "Italic primitive renders bare <em> with font-serif/italic only; accent color cascades via DisplayHeading .display em descendant rule — no tone prop needed"
  - "PulseDot not imported directly in styleguide page — composed via Eyebrow withPulseDot prop as designed"
  - "TagChip adds display: inline-block not in sketch (sketch wraps in flex container) for standalone use compatibility"
metrics:
  duration: "~20 minutes"
  completed: "2026-05-17"
  tasks_completed: 4
  files_modified: 3
  files_created: 13
---

# Phase 01 Plan 03: Six Locked Primitives Summary

**One-liner:** Six sketch-faithful primitive components (Eyebrow, DisplayHeading, Italic, UnderlineAccent, PulseDot, TagChip) built with colocated CSS Modules and wired into /styleguide living documentation with all variants demonstrated.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Build PulseDot, UnderlineAccent, TagChip, Italic | 8916e2d | 8 files in src/components/primitives/ |
| 2 | Build Eyebrow and DisplayHeading | 97f84cb | 4 files in src/components/primitives/ |
| 3 | Create primitives barrel and update components barrel | be20fc7 | src/components/primitives/index.ts, src/components/index.ts |
| 4 | Wire primitives into /styleguide page sections | 685712b | src/app/styleguide/page.tsx, src/app/styleguide/page.module.css |
| 5 | Visual verification of all primitive variants | — | CHECKPOINT: awaiting human verification |

## Task 5 Status: Awaiting Human Verification

Task 5 is a `checkpoint:human-verify` gate. The dev server must be started and visual/behavioral points verified by a human before this plan can be marked complete.

## Primitives Built

### PulseDot
- Renders: `<span aria-hidden="true" />` with `.dot` CSS class
- CSS: `width: 8px; height: 8px; border-radius: 50%; background: var(--accent); display: inline-block; animation: pulse 2s infinite;` plus `@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`
- Sketch source: lines 97–101

### UnderlineAccent
- Renders: `<span className={styles.underline}>{children}</span>`
- CSS: `text-decoration: underline; text-decoration-thickness: 3px; text-underline-offset: 8px; text-decoration-color: var(--accent);`
- Sketch source: lines 110–115

### TagChip
- Renders: `<span className={styles.tag}>{children}</span>`
- CSS: `padding: 5px 12px; border: 1px solid var(--line); border-radius: 100px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); display: inline-block;`
- Sketch source: lines 206–210 (added `display: inline-block` for standalone use)

### Italic
- Renders: `<em className={styles.em}>{children}</em>`
- CSS: `font-family: var(--font-serif); font-style: italic;`
- Accent color cascades via parent's `.display em { color: var(--accent); }` rule in DisplayHeading.module.css
- Sketch source: line 109 (em in heading context), line 205/252 (em in body context)

### Eyebrow
- Renders: `<div className={variant === "italic" ? styles.italic : styles.sans}>{withPulseDot ? <PulseDot /> : null}{children}</div>`
- `.sans` CSS: `display: flex; align-items: center; gap: 12px; font-size: 13px; color: var(--muted); font-family: var(--font-sans); text-transform: uppercase; letter-spacing: 0.08em;`
- `.italic` CSS: `font-family: var(--font-serif); font-style: italic; color: var(--accent); font-size: 22px; display: flex; align-items: center; gap: 12px;`
- Sketch source: lines 93–96 (sans), 233–236 + 293–296 (italic)

### DisplayHeading
- Renders: `<Tag className={styles.display + ' ' + styles[size_${size}]}>{children}</Tag>` with `as` prop controlling semantic element
- Base `.display` CSS: `font-family: var(--font-serif); font-weight: 400; letter-spacing: -0.04em; line-height: 0.92;`
- `.display em { font-style: italic; color: var(--accent); }` — accent cascade for Italic children
- Four size variants: `size_hero` (clamp 72px–168px), `size_work` (clamp 48px–80px), `size_about` (clamp 48px–84px), `size_contact` (clamp 56px–120px)
- Sketch sources: lines 103–109, 193–199, 243–248, 300–305

## /styleguide Coverage

| Primitive | Variant | Section | Notes |
|-----------|---------|---------|-------|
| Eyebrow | sans + withPulseDot | #hero | Orange pulse dot + uppercase label |
| Eyebrow | sans | #work | No pulse dot |
| Eyebrow | italic | #about | Serif italic orange, dark section |
| Eyebrow | italic | #contact | Serif italic orange, dark section |
| DisplayHeading | size="hero" | #hero | h1, largest clamp size |
| DisplayHeading | size="work" | #work | h2 |
| DisplayHeading | size="about" | #about | h2 |
| DisplayHeading | size="contact" | #contact | h2, second-largest clamp |
| Italic | in heading | #hero, #work, #about, #contact | Accent color via cascade |
| Italic | standalone body | #hero | No accent, serif italic only |
| UnderlineAccent | — | #hero | In headline inline |
| PulseDot | via Eyebrow | #hero | Composed, not imported directly |
| TagChip | — | #work | Three instances: EDTECH, STRATEGY, UI/UX |

## Build + Lint Status

`npm run build` exits 0:
```
Route (app)
├ ○ /
├ ○ /_not-found
├ ○ /robots.txt
├ ○ /sitemap.xml
├ ○ /styleguide
└ ○ /styleguide/mdx-test
```

`npm run lint` exits 0 (no errors).

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written.

### Minor Adjustments (not deviations)

**1. TagChip adds `display: inline-block`**
- **Found during:** Task 1
- **Issue:** Plan noted this explicitly as a standalone-use fix since the sketch wraps tags in a flex container. Added as specified.
- **Files modified:** src/components/primitives/TagChip.module.css

**2. Eyebrow `.sans` adds `font-family`, `text-transform`, `letter-spacing`**
- **Found during:** Task 2 — sketch `.hero-eyebrow` (line 94) shows the text is uppercase, tracked, Inter. These are essential to match the sketch visual but were documented in the plan action as additions to verify.
- **Fix:** Added to `.sans` class as the plan action specified.

## Known Stubs

None — all six primitives are fully implemented with sketch-faithful CSS. The visual verification in Task 5 will confirm accent colors, animation timing, and clamp behavior.

## Threat Flags

None. This plan creates no network endpoints, no auth paths, no file access patterns, no schema changes. All output is static server-rendered HTML.

## Self-Check: PASSED

- [x] src/components/primitives/PulseDot.tsx — exports PulseDot, renders span aria-hidden, no use client
- [x] src/components/primitives/PulseDot.module.css — width: 8px, animation: pulse 2s infinite, @keyframes opacity: 0.4
- [x] src/components/primitives/UnderlineAccent.tsx — exports UnderlineAccent, renders span
- [x] src/components/primitives/UnderlineAccent.module.css — text-decoration-thickness: 3px, text-underline-offset: 8px, var(--accent)
- [x] src/components/primitives/TagChip.tsx — exports TagChip, renders span
- [x] src/components/primitives/TagChip.module.css — border: 1px solid var(--line), border-radius: 100px, text-transform: uppercase, color: var(--muted)
- [x] src/components/primitives/Italic.tsx — exports Italic, renders em
- [x] src/components/primitives/Italic.module.css — font-family: var(--font-serif), font-style: italic
- [x] src/components/primitives/Eyebrow.tsx — variant + withPulseDot props, imports PulseDot, no use client
- [x] src/components/primitives/Eyebrow.module.css — .sans (13px, var(--muted)) + .italic (22px, var(--accent), var(--font-serif))
- [x] src/components/primitives/DisplayHeading.tsx — as + size props, h1/h2/h3 dynamic tag, no use client
- [x] src/components/primitives/DisplayHeading.module.css — all four clamp sizes + letter-spacing: -0.04em + color: var(--accent) on em
- [x] src/components/primitives/index.ts — named exports for all six primitives
- [x] src/components/index.ts — BrandMark + FloatingDock + export * from ./primitives
- [x] src/app/styleguide/page.tsx — imports from @/components/primitives, all six primitives, both Eyebrow variants, all four DisplayHeading sizes, data-darken on about/contact
- [x] src/app/styleguide/page.module.css — min-height: 100vh retained, heroBody + tagRow added
- [x] Commit 8916e2d exists (Task 1)
- [x] Commit 97f84cb exists (Task 2)
- [x] Commit be20fc7 exists (Task 3)
- [x] Commit 685712b exists (Task 4)
- [x] npm run build exits 0
- [x] npm run lint exits 0
