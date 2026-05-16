# ROADMAP — Portfolio Vol. III (MVP)

5 phases. Each delivers a vertical slice toward the shippable v1.

---

### Phase 1: Foundation
**Goal:** Establish the design system, brand chrome, and navigation primitives the rest of the site sits on. Strip the existing Next.js project of components and routes that don't serve v1.
**Mode:** mvp
**Requirements:** DS-01, DS-02, DS-03, DS-04, DS-05, DS-06, INFRA-01, INFRA-02
**Success Criteria**:
1. Typography (Instrument Serif + Inter) loads via `next/font` on a test page with no FOUT
2. Color, spacing, and radius tokens exist as CSS variables and are consumed by primitives
3. Primitive components (`Eyebrow`, `DisplayHeading`, `Italic`, `UnderlineAccent`, `PulseDot`, `TagChip`) render with the same visual output as the sketches
4. Floating Dock component hides on scroll-down, reveals on scroll-up, tracks the active anchor section, and smooth-scrolls on click
5. Brand mark inverts color over any element with `data-darken`
6. Unused legacy components (Mailchimp, RouteGuard, ThemeToggle, etc.) removed from `src/components/`
7. MDX content rendering works end-to-end with a sample doc

**Plans:** 1/4 plans executed
- [x] 01-01-PLAN.md — Strip legacy components, routes, deps; reduce layout/page to placeholders; build/lint clean
- [ ] 01-02-PLAN.md — Walking skeleton: tokens.css + base.css + next/font in layout.tsx + stub chrome + /styleguide with stub sections + MDX proof
- [ ] 01-03-PLAN.md — Six primitives (Eyebrow, DisplayHeading, Italic, UnderlineAccent, PulseDot, TagChip) + wire into /styleguide
- [ ] 01-04-PLAN.md — Replace stub chrome with BrandMark mix-blend-difference + FloatingDock IntersectionObserver/scroll-hide/smooth-scroll

---

### Phase 2: Home Page
**Goal:** Ship the home page — hero, marquee, asymmetric work grid (with placeholder project entries), about teaser, contact CTA, footer — at `/` with the floating dock active.
**Mode:** mvp
**Requirements:** HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07, RT-01
**Success Criteria**:
1. Home page renders at `/` with all six sections (Hero · Marquee · Selected Work · About teaser · Contact · Footer) matching sketch 006
2. Asymmetric zig-zag rows alternate left/right and display 4 projects (SplitSmart as #01, plus 3 placeholder cards)
3. Floating dock smooth-scrolls between Hero / Work / About / Contact anchors and highlights the active section
4. Brand mark inverts color when scrolling over Contact and Footer sections
5. Marquee animates continuously without jank
6. All `<em>` italic accents render in Instrument Serif at the larger size

---

### Phase 3: SplitSmart Case Study
**Goal:** Ship the SplitSmart case study at `/work/splitsmart` using the Editorial + Structured template, with real content written from the prototype artifacts.
**Mode:** mvp
**Requirements:** CS-01, CS-02, CS-03, CS-04, CS-05, CS-06, CS-07, CS-08, RT-02
**Success Criteria**:
1. Case study page renders at `/work/splitsmart` matching sketch 005 Variant E (revised — metadata strip at top, no sticky right sidebar)
2. The sticky left TOC tracks scroll position, highlights the active section, and updates the "Section N of 06" progress counter
3. Drop cap renders correctly on the opening paragraph; pull quote renders centered with the leading `"` accent
4. Stats block renders 3-up with italic numbers and uppercase labels
5. Content covers all six sections (Context, The Problem, Research, Approach, Solution, Outcome) — written prose, not placeholder lorem ipsum
6. At least 4 visual artifacts from the SplitSmart prototype are embedded as figures with italic captions (placeholder gradients acceptable in this phase; real screens in a later polish pass)
7. Clicking the SplitSmart card on the home page navigates to this page

---

### Phase 4: About Page
**Goal:** Ship the About page at `/about` using the Conversational Journey template — greeting hero, three chapter sections, dark "Currently" block, compressed timeline.
**Mode:** mvp
**Requirements:** ABOUT-01, ABOUT-02, ABOUT-03, ABOUT-04, RT-03
**Success Criteria**:
1. About page renders at `/about` matching sketch 007 Variant C
2. Greeting hero displays italic "Hi, I'm Farzaneh —" + italic display headline + portrait image side-by-side
3. Three chapter sections (Where it started · The pivot · Today) display with chapter labels and side photos
4. Dark "Currently" block displays a 4-up grid (Reading · Listening · Studying · Looking for)
5. Compressed timeline displays 5 career entries with hover state
6. "More about me →" link on the home page about teaser navigates to this route

---

### Phase 5: Ship Ready
**Goal:** Make the site responsive, SEO-correct, performant, and live on Vercel.
**Mode:** mvp
**Requirements:** RT-04, RESP-01, RESP-02, RESP-03, RESP-04, INFRA-03, INFRA-04, INFRA-05, INFRA-06, SEO-01, SEO-02, SEO-03
**Success Criteria**:
1. All three pages (Home, SplitSmart, About) render correctly at 375px (iPhone SE), 768px (iPad), and 1920px (desktop) with no horizontal scroll
2. Sticky case study TOC has a working mobile pattern (accordion at top of page, or sheet — final pattern decided in plan phase)
3. Asymmetric zig-zag rows stack into single-column on mobile with the preview above the body
4. 404 page renders at `/anything-else` with brand mark and a back link
5. SEO metadata (title, description, OG image, Twitter card) is present on every page
6. `sitemap.xml` and `robots.txt` are correctly served
7. Lighthouse home-page score ≥ 95 across Performance, Accessibility, Best Practices, SEO
8. Site is live on Vercel via auto-deploy from `main` branch, accessible at a Vercel-hosted URL (custom domain TBD)
9. Build passes type check + lint on every commit

---

## Coverage Audit

All v1 requirements from `REQUIREMENTS.md` are mapped to exactly one phase above.

| Requirement | Phase |
|---|---|
| DS-01 to DS-06 | Phase 1 |
| INFRA-01, INFRA-02 | Phase 1 |
| HOME-01 to HOME-07 | Phase 2 |
| RT-01 | Phase 2 |
| CS-01 to CS-08 | Phase 3 |
| RT-02 | Phase 3 |
| ABOUT-01 to ABOUT-04 | Phase 4 |
| RT-03 | Phase 4 |
| RT-04, RESP-01 to RESP-04 | Phase 5 |
| INFRA-03 to INFRA-06 | Phase 5 |
| SEO-01 to SEO-03 | Phase 5 |
