---
phase: 01-foundation
plan: "01"
subsystem: scaffold
tags: [cleanup, dependencies, once-ui-removal, scaffold-strip]
dependency_graph:
  requires: []
  provides: [clean-scaffold, stripped-package-json, minimal-layout]
  affects: [all-subsequent-plans]
tech_stack:
  added: []
  patterns: [Next.js App Router, minimal layout.tsx, placeholder page.tsx]
key_files:
  created: []
  modified:
    - package.json
    - package-lock.json
    - next.config.mjs
    - src/app/layout.tsx
    - src/app/page.tsx
    - src/app/not-found.tsx
    - src/app/robots.ts
    - src/app/sitemap.ts
    - src/components/index.ts
decisions:
  - "Reduced robots.ts and sitemap.ts to remove @/resources and @/utils imports (dead imports after strip)"
  - "Reduced not-found.tsx to <div>404</div> stub (contained Once UI imports)"
metrics:
  duration: "~15 minutes"
  completed: "2026-05-16T18:44:35Z"
  tasks_completed: 4
  files_modified: 9
  files_deleted: 71
---

# Phase 01 Plan 01: Scaffold Strip Summary

**One-liner:** Stripped Once UI, legacy routes, and dead dependencies from the Next.js scaffold; project builds and lints cleanly on the minimal foundation.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Delete legacy components, routes, resources, types, utils | d75ee16 | 71 files deleted |
| 2 | Reduce layout.tsx and page.tsx to minimal valid placeholders | 886fdaf | layout.tsx, page.tsx, not-found.tsx, robots.ts, sitemap.ts |
| 3 | Reset barrel, clean next.config.mjs + package.json | 017cac5 | index.ts, next.config.mjs, package.json, package-lock.json |
| 4 | Verify clean build and lint pass | (no files changed) | Build: pass, Lint: pass |

## Deletions Performed

### Component files removed (src/components/)
Mailchimp.tsx, RouteGuard.tsx, ThemeToggle.tsx + .module.scss, Header.tsx + .module.scss, Footer.tsx + .module.scss, FooterCTA.tsx, HeroHeadline.tsx, HomeIntro.tsx, HowIWork.tsx, MarqueeTicker.tsx, ProcessAndTools.tsx, ProjectCard.tsx + .module.scss, Providers.tsx, StatsStrip.tsx, HeadingLink.tsx + .module.scss, mdx.tsx, ScrollToHash.tsx, breakpoints.scss

### Component subdirectories removed (src/components/)
about/, blog/, gallery/, work/

### API routes removed (src/app/api/)
authenticate/, check-auth/, og/ (fetch, generate, proxy), rss/

### App routes removed (src/app/)
blog/ (+ 10 posts), gallery/, about/page.tsx, work/page.tsx, work/[slug]/, work/projects/ (5 MDX files)

### Source directories wiped
src/resources/ (5 files), src/types/ (3 files), src/utils/ (2 files)

**Total: 71 files deleted across 3 commits**

## Dependencies Removed

From `dependencies`:
- `@once-ui-system/core` — Once UI, entire design system deleted
- `cookie` — auth cookie utility (API routes deleted)
- `next-mdx-remote` — replaced by `@next/mdx` per D-16
- `react-icons` — icon library, not used in v1
- `react-rough-notation` — annotation library, not used in v1
- `sass` — SCSS preprocessor, dropping for plain CSS Modules per D-11
- `transliteration` — text processing, not used in v1

From `devDependencies`:
- `@types/cookie` — paired with removed `cookie` dep
- `tzdata` — timezone data, not needed without Once UI

## Config Changes

### package.json
- Renamed from `@once-ui-system/magic-portfolio` to `farzaneh-portfolio`
- Removed `export` script (next export not supported in Next 16)
- All 7 runtime deps + 2 dev deps removed

### next.config.mjs
- Removed `sassOptions` block (D-11 — no SCSS)
- Removed `transpilePackages: ["next-mdx-remote"]` (D-05 — dropped next-mdx-remote)
- Removed `images.remotePatterns` for `www.google.com` (legacy leftover)
- Kept: `withMDX` wrapper + `pageExtensions: ["ts", "tsx", "md", "mdx"]`

## Build / Lint Result

```
npm run build → exit 0
npm run lint  → exit 0

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /robots.txt
└ ○ /sitemap.xml
```

No routes for deleted paths (/blog, /gallery, /work, /api/*) appear in the build output.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed robots.ts and sitemap.ts dead imports**
- **Found during:** Task 2 (pre-build review)
- **Issue:** `robots.ts` imported from `@/resources` (deleted); `sitemap.ts` imported from both `@/resources` and `@/utils` (deleted). Both would cause build failure.
- **Fix:** Rewrote both files to self-contained implementations with no external imports. `robots.ts` hardcodes the base URL; `sitemap.ts` returns a single root entry. Phase 5 (SEO) will revisit these.
- **Files modified:** src/app/robots.ts, src/app/sitemap.ts
- **Commit:** 886fdaf

**2. [Rule 3 - Blocking] Reduced not-found.tsx to no-import stub**
- **Found during:** Task 2 — task spec anticipated this
- **Issue:** `not-found.tsx` contained Once UI imports (`@once-ui-system/core`). Not deleted per plan (Phase 5 RT-04 rebuilds it), but stripped of all imports.
- **Fix:** Replaced with `<div>404</div>` stub per task spec
- **Files modified:** src/app/not-found.tsx
- **Commit:** 886fdaf

## Known Stubs

- `src/app/robots.ts`: `sitemap` URL hardcoded as `https://farzaneh-falakrou.github.io/sitemap.xml`. Phase 5 (SEO-01) will update this with a proper `baseURL` constant.
- `src/app/sitemap.ts`: Returns only the root URL. Phase 5 (SEO-01) will expand to include all routes.
- `src/app/not-found.tsx`: Renders `<div>404</div>`. Phase 5 (RT-04) rebuilds with proper design.
- `src/app/page.tsx`: Placeholder text "Foundation in place." Phase 2 (HOME-01) rewrites with real home page.
- `src/app/layout.tsx`: Bare `<html><body>` with no styles, fonts, or chrome. PLAN 02 adds fonts, globals, BrandMark, FloatingDock.

These stubs are intentional per the plan (D-20, RT-04, SEO-01) and do not block PLAN 02's goal.

## Self-Check: PASSED

- [x] src/app/layout.tsx exists — no @once-ui-system imports
- [x] src/app/page.tsx exists — contains /styleguide link
- [x] src/app/not-found.tsx exists — no @once-ui-system imports
- [x] src/components/index.ts exists — no deleted component exports
- [x] next.config.mjs exists — no sassOptions, no next-mdx-remote
- [x] package.json exists — name=farzaneh-portfolio, no @once-ui-system/core
- [x] package-lock.json regenerated
- [x] Commit d75ee16 exists (Task 1 deletions)
- [x] Commit 886fdaf exists (Task 2 placeholder rewrites)
- [x] Commit 017cac5 exists (Task 3 barrel + config + deps)
- [x] npm run build exits 0
- [x] npm run lint exits 0
- [x] INFRA-01 satisfied: scaffold compiles cleanly with no Once UI
