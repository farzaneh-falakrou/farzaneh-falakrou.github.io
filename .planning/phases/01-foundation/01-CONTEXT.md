# Phase 1: Foundation - Context

**Gathered:** 2026-05-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the design system (CSS tokens + shared primitive components), brand chrome (brand mark + floating dock), and MDX rendering pipeline that every subsequent phase will sit on top of. Strip the existing Next.js scaffold down so only what serves v1 remains.

**The sketch in `.planning/sketches/006-full-home/index.html` is the binding visual + behavioral spec.** Phase 1 lifts its tokens, primitive styles, dock JS, and brand-mark mechanism into React/Next components — it does not reinterpret them.

</domain>

<decisions>
## Implementation Decisions

### Bootstrap Strategy
- **D-01:** Strip the existing `src/` tree **in place**. Keep the repo, `package.json`, `next.config`, `tsconfig`, eslint/biome config. Do not start a fresh `create-next-app`.
- **D-02:** Treat the current project setup as **irrelevant context** for design decisions. Sketches are the source of truth; existing components, routes, and the `@once-ui-system/*` dependency are all candidates for removal unless they materially serve v1.
- **D-03:** Remove from `src/components/`: `Mailchimp.tsx`, `RouteGuard.tsx`, `ThemeToggle.tsx` (+ its `.module.scss`), `Header.tsx` (+ `.module.scss`), `Footer.tsx`, `FooterCTA.tsx`, `HeroHeadline.tsx`, `HomeIntro.tsx`, `HowIWork.tsx`, `MarqueeTicker.tsx`, `ProcessAndTools.tsx`, `ProjectCard.tsx` (+ `.module.scss`), `Providers.tsx`, `StatsStrip.tsx`, `HeadingLink.tsx` (+ `.module.scss`), `mdx.tsx` (rewritten in Phase 3 against our own design system), `index.ts` (rewritten). Keep `ScrollToHash.tsx` only if it survives review; otherwise replace with the dock's own smooth-scroll.
- **D-04:** Remove from `src/app/`: `api/authenticate/`, `api/check-auth/`, `blog/`, `gallery/`, existing `about/page.tsx` (rebuilt fresh in Phase 4), existing `work/` content (Phase 3 rebuilds). Keep `api/og/` and `api/rss/` only if they're useful for SEO (Phase 5 will revisit); if uncertain, delete in this phase. Keep `layout.tsx`, `page.tsx` (rewritten), `not-found.tsx` (rewritten in Phase 5), `robots.ts`, `sitemap.ts`, `favicon.ico`.
- **D-05:** Remove dependencies that don't serve v1: `@once-ui-system/core`, `react-rough-notation`, `cookie`, `transliteration`, `react-icons` (replace icon usage with inline SVG or `lucide-react` only if needed). Keep: `next`, `react`, `react-dom`, `@mdx-js/loader`, `@next/mdx` (or `next-mdx-remote` — see D-15), `gray-matter`, `classnames`, `sass` (remove if D-08 stays CSS-only).
- **D-06:** Wipe `src/resources/` and `src/types/` of Once UI–specific content; keep the folder shape if useful, but start empty.

### Styling Architecture
- **D-07:** Use **global `tokens.css` + per-component CSS Modules (`.module.css`)**. No SCSS, no Tailwind, no CSS-in-JS.
- **D-08:** Lift the entire `:root` block from `.planning/sketches/006-full-home/index.html` (lines 11–27) verbatim into `src/styles/tokens.css`. Variable names locked: `--bg`, `--bg-2`, `--bg-3`, `--ink`, `--ink-2`, `--muted`, `--muted-2`, `--line`, `--accent`, `--accent-soft`, `--surface`, `--dark`, `--font-serif`, `--font-sans`.
- **D-09:** Add `src/styles/base.css` for the global reset + body defaults (box-sizing, font smoothing, link/button resets) — mirror sketch lines 28–38.
- **D-10:** Both globals get imported once from `src/app/layout.tsx`. Component-scoped CSS lives next to the component in `Foo.module.css`.
- **D-11:** Drop `sass` from dependencies. Convert any retained `.module.scss` files to `.module.css` (most are being deleted per D-03 anyway).

### Typography Loading
- **D-12:** Load Instrument Serif (regular + italic, weight 400) and Inter (300, 400, 500, 600) via `next/font/google` in `src/app/layout.tsx`. Expose them as CSS variables that override `--font-serif` / `--font-sans` in `tokens.css`. Use `display: swap` and `preload: true` to avoid FOUT (matches SC #1).

### Primitives (locked list — implement as React components)
- **D-13:** Build these in `src/components/primitives/`, each with its own `.module.css`:
  - `Eyebrow` — small uppercase-tracked label or italic-orange variant (`.hero-eyebrow`, `.about-head`, `.contact-eyebrow` in sketch). Variants: with/without pulse dot, sans vs italic-serif style.
  - `DisplayHeading` — h1/h2/h3 with serif font, `clamp()` responsive sizing, supports `<em>` children rendered italic-orange (sketch `.hero h1`, `.work-title`, `.about-title`, `.contact-title`).
  - `Italic` — convenience wrapper for inline italic-serif emphasis (renders as `<em>` styled per sketch `em` rules).
  - `UnderlineAccent` — span with 3px orange underline, 8px offset (sketch `.underline-accent`).
  - `PulseDot` — 8px orange dot with 2s pulse keyframe (sketch `.pulse-dot`).
  - `TagChip` — outlined pill, uppercase tracked label (sketch `.work-tag`).

### Brand Chrome
- **D-14:** **Brand mark mechanism — Claude's discretion (see below).** The sketch uses a JS scroll listener toggling `body.dark-section` (sketch lines 656–668). Roadmap SC #5 specifies CSS `mix-blend-difference` over `[data-darken]`. Both produce the same visual result. Planner picks whichever is simpler to implement correctly across all pages — lean toward `mix-blend-difference` since it survives slow/janky scroll, but accept JS-class-toggle if mix-blend-difference doesn't behave well with the cream background + dark sections in practice.
- **D-15:** Floating Dock component (`src/components/chrome/FloatingDock.tsx`) implements the three behaviors from sketch JS (lines 619–653): hide on scroll-down (reveal on scroll-up), active-section tracking, smooth-scroll on anchor click. Active-section tracking can use `IntersectionObserver` instead of the sketch's scroll-math — it's cleaner — but the visual behavior must match (active link gets `--accent` background + `--ink` text). Section IDs the dock tracks on the home page: `#hero`, `#work`, `#about`, `#contact`. The dock also includes a "Get in touch" CTA pill on the right of the separator.

### MDX Setup
- **D-16:** **MDX wiring — planner's discretion.** Either `@next/mdx` (file-based, `.mdx` becomes a route) or `next-mdx-remote` (programmatic, content lives in `src/content/`). Recommendation: `@next/mdx` for the case-study at `src/app/work/splitsmart/page.mdx`, since there's only one case study in v1 and file-based routing is simpler. Re-evaluate if Phase 3 needs frontmatter that's awkward to express in MDX exports.
- **D-17:** Phase 1 only needs to **prove MDX renders end-to-end** with a sample document. Suggest a throwaway `src/app/_mdx-test/page.mdx` or similar that's deleted at the end of Phase 1 (or kept under `/styleguide`).

### Demo / Verification Location
- **D-18:** Build a **`/styleguide` route** that demonstrates every primitive (with all variants), the floating dock (with stub `#hero`/`#work`/`#about`/`#contact` sections so scroll-tracking is verifiable), and the brand mark over both light and `[data-darken]` regions. This route survives into v1 as living documentation — useful for Phase 2/3 when checking primitives.
- **D-19:** `/styleguide` is **not linked from main navigation**. It's reachable only by typing the URL. No need to hide it behind an env var.

### Out of Scope for Phase 1
- **D-20:** The home page (`/`) itself is Phase 2. Phase 1's `src/app/page.tsx` can be a placeholder ("Foundation in place. See `/styleguide`.") or a simple redirect — planner picks.
- **D-21:** No content writing in Phase 1 — the SplitSmart case study, About chapters, and home-page copy are all later phases. Lorem-style fillers in the styleguide are fine for showing primitives.
- **D-22:** No responsive work in Phase 1. Tokens must be sensible at desktop. Mobile is Phase 5.

### Claude's Discretion
- Brand mark mechanism (D-14) — pick during planning based on cross-browser behavior.
- MDX library choice (D-16) — pick during planning; recommendation noted.
- Whether to keep `api/og/` and `api/rss/` (D-04) — investigate during planning; default = delete unless they're useful for SEO.
- Whether `ScrollToHash.tsx` survives (D-03) — investigate during planning; default = delete and let the dock handle smooth-scroll.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Visual + Behavioral Spec (PRIMARY — sketches are the binding contract)
- `.planning/sketches/006-full-home/index.html` — **The canonical Phase 1 spec.** Contains: complete token set (lines 11–27), global reset (lines 28–38), brand-mark CSS + JS (lines 55–61, 656–668), floating dock CSS + JS (lines 66–87, 619–653), every primitive's CSS (eyebrow, pulse-dot, display headings, underline-accent, tag chips). Phase 1 lifts these into React/CSS Modules verbatim.
- `.planning/sketches/006-full-home/README.md` — Annotates which sketch each section pulls from and what was confirmed in 006.
- `.planning/sketches/006-full-home/case-study.html` — Reference for case-study primitives that will appear in Phase 3 (drop cap, TOC, stats block, metadata strip). Not directly built in Phase 1 but informs what primitives must scale.
- `.planning/sketches/007-about-page/index.html` — Reference for About page primitives (chapter labels, dark "Currently" block, timeline). Informs primitive variants Phase 4 will need.
- `.planning/sketches/MANIFEST.md` — Catalog of all sketches and which decisions they lock.

### Project-level Context
- `.planning/PROJECT.md` — Audience, positioning ("thinks deeply AND strong taste"), locked design decisions, key decisions table, v1 scope.
- `.planning/REQUIREMENTS.md` — Full DS-01..DS-06, INFRA-01..INFRA-02 requirement statements with their definition of done.
- `.planning/ROADMAP.md` § Phase 1 — Goal statement + 7 success criteria that this phase must satisfy.

### Out-of-scope but referenced
- SplitSmart artifacts at `C:\Users\farza\Desktop\workspace\expense_splitter` — source material for Phase 3, not used in Phase 1. Phase 1 only needs to confirm MDX can render *some* doc.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`src/app/layout.tsx`** — keep as the file, but rewrite contents. Strip all `@once-ui-system/core` imports, strip `RouteGuard`, replace with `next/font` typography + global CSS imports + brand mark + floating dock + `{children}`.
- **`src/app/sitemap.ts`, `robots.ts`** — preserve; Phase 5 will validate them, no reason to touch in Phase 1.
- **`src/app/favicon.ico`** — keep (SEO-03 says current favicon is acceptable).
- **`next.config`, `tsconfig.json`, `eslint.config`, `biome.json`** — preserve. Type check + lint must pass (INFRA-05).

### Established Patterns
- **File-colocated CSS Modules** — the existing project pairs `Foo.tsx` with `Foo.module.scss`. We continue that pattern with `.module.css` instead.
- **App Router conventions** — Next 16, React 19, App Router. `page.tsx` per route, `layout.tsx` for root chrome. Phase 1 respects this.
- **Path alias `@/`** — the existing `tsconfig` already maps `@/` to `src/`. Continue using it.

### Integration Points
- `src/app/layout.tsx` is the single mount point for: typography (next/font), global CSS (tokens + base), brand mark, floating dock. Everything else is a child page that gets these for free.
- `/styleguide` lives at `src/app/styleguide/page.tsx` (or `.module.css` colocated). It imports primitives from `@/components/primitives` and demonstrates each.

</code_context>

<specifics>
## Specific Ideas

- **"Sketches are the source of truth, not the existing code."** User stated this explicitly during discussion. Every implementation decision in Phase 1 (and downstream phases) should be checked against the sketch HTML/CSS before checking against the existing Next.js scaffold. The scaffold is a starter that's getting stripped, not a constraint.
- The "Farzaneh" brand mark text is the literal string used in the sketch (line 369). Use the same wording — italic Instrument Serif, 22px, top-left fixed at `top: 60px; left: 40px`.
- Dock CTA copy: "Get in touch ↗" (sketch line 378). Reuse verbatim.
- Pulse animation: 2s infinite, opacity 1 → 0.4 → 1 (sketch lines 99–101). Use these exact values.

</specifics>

<deferred>
## Deferred Ideas

- **Responsive behavior** — sketch is desktop-only at 1500px max-width. Mobile dock, mobile brand-mark, responsive token adjustments are all Phase 5 (RESP-01..RESP-04).
- **Real home page content** — Phase 2 (HOME-01..HOME-07).
- **Case study primitives** (drop cap, TOC, stats block, metadata strip) — Phase 3 will build them when CS-01..CS-08 are implemented. Phase 1's primitives are deliberately the home-page subset.
- **About page primitives** (chapter labels, dark "Currently" block, timeline) — Phase 4.
- **404 page** (RT-04) — Phase 5.
- **SEO metadata, Lighthouse tuning, Vercel deploy** — Phase 5.
- **MDX component map** (custom replacements for `<h1>`, `<p>`, `<em>` inside MDX) — Phase 3 will define this when the SplitSmart case study is written. Phase 1 only proves MDX renders.
- **Dock cross-page behavior** — if dock anchors are clicked from `/about` or `/work/splitsmart`, should they navigate to `/#hero` etc.? Defer to Phase 2 when the dock is wired into real navigation.
- **`api/og/` and `api/rss/`** — keep or delete decision deferred to planner; Phase 5 may revisit for SEO.

### Open Questions from STATE.md (not blocking Phase 1)
- Final custom domain — Phase 5 / INFRA-04.
- Mobile TOC pattern (accordion vs sheet) — Phase 5 / RESP-03.
- What the 3 placeholder work cards on the home page point to — Phase 2 / HOME-03.

</deferred>

---

*Phase: 1-Foundation*
*Context gathered: 2026-05-16*
