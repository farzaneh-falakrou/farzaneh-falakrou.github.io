# REQUIREMENTS — Portfolio Vol. III (MVP)

Scope: **Home + SplitSmart case study + About page**, on Next.js, deployed to Vercel.

## v1 Requirements

### Design System (DS)
- [ ] **DS-01** — Establish typography system (Instrument Serif display, Inter body) loaded via `next/font`
- [ ] **DS-02** — Establish color tokens (cream `#ebe8e2`, ink `#1a1a1a`, accent `#ff5a36`, muted, line, dark surface) as CSS custom properties
- [ ] **DS-03** — Establish spacing scale and radius scale matching the sketches
- [ ] **DS-04** — Build shared primitive components: `Eyebrow`, `DisplayHeading`, `Italic`, `UnderlineAccent`, `PulseDot`, `TagChip`
- [ ] **DS-05** — Brand mark component with mix-blend-difference behavior over `[data-darken]` sections
- [ ] **DS-06** — Floating Dock component: pill nav, hide on scroll-down, active-section tracking, smooth-scroll anchor navigation

### Home Page (HOME)
- [ ] **HOME-01** — Hero section: pulse-dot eyebrow with availability status, oversized italic display headline, two-column sub (bio + meta)
- [ ] **HOME-02** — Marquee strip: dark band with skill keywords, infinite horizontal scroll, orange-accented separator dots
- [ ] **HOME-03** — Selected Work section: 4 asymmetric zig-zag project rows (preview alternating left/right, italic name, italic description with `<em>` emphasis, tag chips, stat highlight, CTA)
- [ ] **HOME-04** — About teaser: italic display headline + bio + "More about me →" link, with right-column career/tools sidebar
- [ ] **HOME-05** — Contact CTA: dark section with big italic question + email button + alt social links
- [ ] **HOME-06** — Footer: 4-column dark grid (brand, index links, social links, contact) + meta bar with "last updated" + copyright
- [ ] **HOME-07** — Smooth in-page scroll between Hero, Work, About, Contact sections via dock clicks

### SplitSmart Case Study (CS)
- [ ] **CS-01** — Editorial hero: centered eyebrow, italic display title ("On … *SplitSmart*"), serif subhead, byline row (designer, year, reading time)
- [ ] **CS-02** — Full-width cover image (placeholder gradient acceptable for v1; replace with real screen when content is finalized)
- [ ] **CS-03** — Horizontal metadata strip — Role · Team · Duration · Stack · Industry · Year · "Visit" link. Scrolls away with content (NOT sticky)
- [ ] **CS-04** — Two-column body: left sticky TOC (numbered sections, active highlighting, progress counter); right editorial article column (~720px max-width)
- [ ] **CS-05** — Editorial article: section marks combining label + section number, drop cap on opener, h2/p typographic scale matching sketches, italic `<em>` emphasis, pull quote, inline figures with italic captions, stats block (3-up, italic numbers)
- [ ] **CS-06** — Footer "next case study" block (for v1 with one case study, link back to home with same visual treatment)
- [ ] **CS-07** — SplitSmart case study content written from artifacts at `C:\Users\farza\Desktop\workspace\expense_splitter` — must cover Context, The Problem, Research, Approach, Solution, Outcome
- [ ] **CS-08** — At least 4 visual artifacts from the SplitSmart prototype embedded (dashboard, group detail, add expense, settle up) — placeholder OK for v1, real screens in a follow-up

### About Page (ABOUT)
- [ ] **ABOUT-01** — Greeting hero with portrait — "Hi, I'm Farzaneh —" italic eyebrow, italic display headline, portrait image right
- [ ] **ABOUT-02** — Chapter sections (Chapter 01: Where it started · 02: The pivot · 03: Today) with chapter-label rule, italic display section title, two-column body (text + side photo)
- [ ] **ABOUT-03** — Dark "Currently" block — italic eyebrow, italic display title, 4-up grid (Reading, Listening to, Studying, Looking for)
- [ ] **ABOUT-04** — Compressed timeline — italic display section header, 4-column table rows (year, italic project title, where, category), hover state

### Pages & Routing (RT)
- [ ] **RT-01** — `/` home page route
- [ ] **RT-02** — `/work/splitsmart` case study route
- [ ] **RT-03** — `/about` about page route
- [ ] **RT-04** — Default 404 with brand mark + back link

### Responsive (RESP)
- [ ] **RESP-01** — All pages readable and usable at 375px (iPhone SE width) — no horizontal scroll, type stays in hierarchy
- [ ] **RESP-02** — Asymmetric zig-zag rows collapse to single column on mobile
- [ ] **RESP-03** — Sticky TOC collapses to top-of-page accordion or sheet on mobile (decide in plan phase)
- [ ] **RESP-04** — Floating dock remains usable on mobile (pill width adapts; "Get in touch" CTA may collapse to icon)

### Infrastructure (INFRA)
- [ ] **INFRA-01** — Next.js project cleaned up — remove unused legacy components (`Mailchimp`, `RouteGuard`, `ThemeToggle`, etc. that don't fit v1)
- [ ] **INFRA-02** — MDX support working for case study content
- [ ] **INFRA-03** — Vercel deployment configured, deploys from `main` branch on push
- [ ] **INFRA-04** — Custom domain (or vercel.app subdomain) live — final domain TBD
- [ ] **INFRA-05** — Build passes type check + lint on every commit
- [ ] **INFRA-06** — Lighthouse score ≥ 95 across Performance, Accessibility, Best Practices, SEO on the home page

### SEO & Metadata (SEO)
- [ ] **SEO-01** — Title, description, OG image, Twitter card on every page
- [ ] **SEO-02** — `sitemap.xml` and `robots.txt` correctly served
- [ ] **SEO-03** — Favicon set (current `favicon.ico` is acceptable)

## v2 (Deferred)

- Work index page (`/work`) — archive of all projects with filtering
- Additional case studies (Dino Studio, Homelon, Top Notch, Co-Sign, Beacon)
- Blog / writing / notes section
- Gallery section
- Dark mode toggle
- CMS migration
- Internationalization

## Out of Scope (explicit exclusions)

- Contact form (email link only)
- Newsletter signup (`Mailchimp.tsx` component will be removed)
- Dashboard / authenticated area (current `RouteGuard.tsx` will be removed)
- Theme toggle (single light theme; `ThemeToggle.tsx` will be removed)
- Stat tracking beyond Vercel Analytics
- Comments / reactions on case studies

## Definition of Done

A requirement is done when:
1. The code is merged to `main`
2. It deploys cleanly on Vercel
3. The behavior matches the corresponding sketch
4. It works at 1920px, 1280px, and 375px
5. It passes the build (type check + lint)
6. The corresponding sketch decision in `PROJECT.md`'s Decision table is verified

## Traceability

(Filled by roadmap phase mapping — see `.planning/ROADMAP.md`.)
