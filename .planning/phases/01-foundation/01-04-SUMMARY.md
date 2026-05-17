---
phase: 01-foundation
plan: "04"
subsystem: ui
tags: [css-modules, mix-blend-mode, intersection-observer, scroll, react-hooks, next-js]

# Dependency graph
requires:
  - phase: 01-02
    provides: stub BrandMark and FloatingDock components with base CSS already in place
  - phase: 01-03
    provides: six primitives wired; styleguide page with #hero/#work/#about/#contact sections and data-darken attributes

provides:
  - BrandMark Path A — pure CSS color inversion via mix-blend-mode difference (DS-05)
  - FloatingDock with hide-on-scroll-down, active-section tracking via IntersectionObserver, smooth-scroll on click (DS-06)
  - INFRA-05 chrome side — build + lint green with client component properly bounded

affects:
  - phase-02-home (BrandMark and FloatingDock will appear on the real home page sections)
  - phase-05-polish (responsive dock behavior deferred to here)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "mix-blend-mode: difference on fixed positioned element with color: var(--bg) inverts over any background without JS"
    - "IntersectionObserver with rootMargin -33% 0px -33% 0px and threshold array for reliable active-section detection"
    - "useRef for lastY scroll direction tracking without re-renders"
    - "Effect cleanup pattern for React 19 strict mode — removeEventListener + observer.disconnect in every useEffect return"

key-files:
  created: []
  modified:
    - src/components/chrome/BrandMark.module.css
    - src/components/chrome/FloatingDock.tsx

key-decisions:
  - "D-14 Path A confirmed: mix-blend-mode difference with color: var(--bg) — BrandMark stays a pure server component, no useEffect, no scroll listeners"
  - "D-15 confirmed: IntersectionObserver replaces sketch's scroll-math for active-section tracking — rootMargin -33% 0px -33% 0px, threshold [0, 0.25, 0.5, 0.75, 1]"
  - "transition: color 0.3s removed from BrandMark — compositing effect has no color animation, transition was dead code from the stub"

patterns-established:
  - "mix-blend-mode difference pattern: set color to the lighter value (--bg cream), element blends to dark ink over light background, cream over dark background — zero JS"
  - "FloatingDock useRef(0) for scroll direction without useState to avoid render on every scroll event"

requirements-completed: [DS-05, DS-06, INFRA-05]

# Metrics
duration: 15min
completed: 2026-05-17
---

# Phase 1 Plan 04: Chrome Behaviors Summary

**BrandMark Path A (mix-blend-difference, server component) and FloatingDock three behaviors (scroll-hide, IntersectionObserver active-section, smooth-scroll) — DS-05 and DS-06 closed**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-05-17T00:00:00Z
- **Completed:** 2026-05-17
- **Tasks:** 2/3 complete (Task 3 is a human-verify checkpoint)
- **Files modified:** 2

## Accomplishments

- BrandMark CSS upgraded from stub (ink color) to Path A: `color: var(--bg)` + `mix-blend-mode: difference` — inverts automatically over any dark section, zero JavaScript
- FloatingDock upgraded from static markup to full behavior: scroll-hide past 200px, IntersectionObserver active-section tracking, smooth-scroll on anchor click
- Build and lint both exit 0 — INFRA-05 chrome side satisfied
- All effect cleanups present for React 19 strict mode double-invocation

## Task Commits

Each task was committed atomically:

1. **Task 1: Implement BrandMark Path A (mix-blend-difference)** - `253f017` (feat)
2. **Task 2: Implement FloatingDock three behaviors** - `437121b` (feat)
3. **Task 3: End-of-phase visual verification** - awaiting human checkpoint

## Files Created/Modified

- `src/components/chrome/BrandMark.module.css` — replaced `color: var(--ink)` + `transition: color 0.3s` stub with `color: var(--bg)` + `mix-blend-mode: difference`
- `src/components/chrome/FloatingDock.tsx` — replaced static nav stub with full three-behavior implementation (hidden state, active state, lastY ref, two useEffects, onClick handler)

## Decisions Made

- Confirmed D-14 Path A. The `mix-blend-mode: difference` approach requires no DOM observation, no scroll listeners, and no `"use client"` boundary on BrandMark — simpler and more reliable.
- Removed `transition: color 0.3s` from BrandMark — under Path A the color does not transition, it is a compositing effect. The transition was dead code from the PLAN 02 stub.
- Kept the existing FloatingDock CSS unchanged — `.dock a.active` compound selector works correctly with CSS Modules (`styles.active` resolves to the scoped class, the compound rule targets it within `.dock`).

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None — build and lint passed on first attempt.

## Known Stubs

None — BrandMark and FloatingDock are fully wired. Visual verification (Task 3 checkpoint) is the remaining step to confirm browser behavior.

## Threat Flags

None — no new network endpoints, auth paths, or trust boundary changes in this plan.

## Next Phase Readiness

Phase 1 automation complete. All seven ROADMAP Phase 1 success criteria are coded and verifiable on `/styleguide`:
- SC #1 Typography no FOUT — fonts loaded via next/font (PLAN 02)
- SC #2 Color/spacing/radius tokens — tokens.css in place (PLAN 02)
- SC #3 Primitive visual parity — six primitives wired (PLAN 03)
- SC #4 Floating Dock behaviors — this plan
- SC #5 Brand mark inversion — this plan
- SC #6 Unused legacy removed — done in PLAN 01
- SC #7 MDX renders end-to-end — /styleguide/mdx-test (PLAN 02/03)

**Awaiting human visual verification on `/styleguide` before Phase 1 is marked complete.**

---
*Phase: 01-foundation*
*Completed: 2026-05-17*
