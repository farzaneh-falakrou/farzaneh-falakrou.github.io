# Portfolio · Farzaneh Falakrou (Vol. III)

## What This Is

A complete revamp of `farzaneh-falakrou.github.io` — Farzaneh's UI/UX portfolio. The current site (Next.js, in `src/`) and the legacy HTML site (in `legacy/`) both exist as references; the new build replaces them with a from-scratch design system and content architecture.

**The site is itself a UI/UX portfolio piece** — its design is part of the argument for hire.

## Core Value

When a senior in-house product team opens the site, they should think two things at once:
1. *"This person thinks deeply."*
2. *"This person has strong taste."*

Everything in the project is in service of those two beliefs reinforcing each other. The visual language IS the argument.

## Audience

Primary: **In-house product teams at tech companies.** Hiring managers and senior designers evaluating Farzaneh for senior product design roles.

Not the audience: agency creative directors, freelance clients, design-Twitter virality.

## Context

- **Current state:** Two existing portfolios coexist. A Next.js site in `src/` (recent, partly built) and a static HTML site in `legacy/` (older, simpler). Neither lands the positioning above.
- **Designer:** Farzaneh Falakrou. Trained as an architect at University of Tehran. Pivoted to product design in 2021. Based in Tehran. Currently independent, actively looking for senior in-house roles.
- **The featured project:** **SplitSmart** — a high-fidelity expense-splitting app prototype (8 views, dark sidebar + purple-primary design system, mock data set, UX-research-style open questions documented). Located at `C:\Users\farza\Desktop\workspace\expense_splitter`. HTML prototype is built; the case-study writeup does not yet exist.

## Design Decisions (locked from sketches 001–007)

| Decision | Choice | Sketch |
|---|---|---|
| Visual language | **Signature lineage** — cream `#ebe8e2`, Instrument Serif display + Inter body, orange accent `#ff5a36`. Lineage: Tobias van Schneider · Jason Yuan. | 002 · D |
| Home navigation | **Floating Dock** — pill nav centered bottom, hides on scroll-down, brand mark top-left, dock highlights active section. | 003 · B |
| Selected work cards | **Asymmetric Split** — full-width zig-zag rows, preview alternating left/right, italic project name, italic descriptions with `<em>` emphasis, tag chips, stat highlight, "Read the case study →" CTA. | 004 · D |
| Case study template | **Editorial + Structured** — editorial centered hero + cover, then horizontal metadata strip (scrolls away), then 2-column body: sticky TOC on left + editorial article column (~720px) on right. Drop cap, pull quotes, italic accents, figures with italic captions, stat table, next-case-study footer. | 005 · E |
| About page | **Conversational Journey** — letter-style greeting hero + portrait, narrative chapters telling the architect→designer story, dark "Currently" block mid-page, compressed timeline at the end. | 007 · C |
| Page navigation chrome | Brand mark top-left (mix-blend-difference over dark sections), floating dock bottom, hide-on-scroll-down, smooth-scroll on anchor click, section highlighting. | 006 |
| Tech stack | **Next.js** (continuing existing setup). React + TypeScript + App Router. | Intake |
| Deployment | **Vercel.** Auto-deploy from GitHub. | Intake |

Reference: see `.planning/sketches/MANIFEST.md` for the full sketch trail; all HTML mockups live in `.planning/sketches/00N-*/`.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Home page with hero, marquee, selected work (asymmetric zig-zag rows), about teaser, contact CTA, footer
- [ ] One full case study page for **SplitSmart** (Editorial + Structured template — editorial hero, metadata strip, sticky TOC + article column, stat block)
- [ ] About page (Conversational Journey — chapters, "Currently" block, timeline)
- [ ] Floating-dock navigation working across all pages (hide-on-scroll, active-section tracking, smooth scroll)
- [ ] Brand mark with mix-blend-difference behavior over dark sections
- [ ] Responsive behavior — site must be readable and usable on mobile (target: 375px wide)
- [ ] SEO basics — title, description, OG image, sitemap, robots.txt
- [ ] Deployable to Vercel from `main` branch

### Out of Scope (v1)

- **Work index / archive page** (`/work`) — deferred to v2. v1 only shows 4 featured projects on the home page.
- **Additional case studies** (Dino Studio, Homelon, Top Notch, Co-Sign, Beacon) — frame for future, do not write.
- **Blog / writing / notes section** — deferred.
- **Gallery section** — deferred.
- **Dark mode toggle** — single light theme only.
- **CMS** — content stays in code (MDX) for v1.
- **Internationalization** — English only.
- **Contact form** — email link only, no form.
- **Analytics dashboard** — Vercel Analytics is enough; no Posthog/Plausible yet.

## SplitSmart — Featured Case Study Source

Located at `C:\Users\farza\Desktop\workspace\expense_splitter`. Includes:
- `PROJECT_CONTEXT.md` — product overview, design direction, mock data, open UX questions
- 10 HTML prototype files (dashboard, groups, friends, create-group, add-expense, group-detail, settle-up, add-friend, index, standalone)
- 9 snapshot `.md` files per screen
- Audit screenshots and reference designs

Writing the case study is a phase, not just a copy-paste. The artifacts give us the design; we have to write the *thinking* — what was the problem, what did research say, what alternatives existed, what shipped, what would change.

## Key Decisions

| Decision | Rationale | Outcome |
|---|---|---|
| Signature visual language (cream + Instrument Serif + orange) over Editorial / Swiss / Engineer | Strongest personal voice; matches Farzaneh's positioning of "deep thinker AND strong taste"; distinct from generic portfolios | Pending — validated when shipped |
| Floating Dock over Vertical Rail / Inline Masthead | Maximum content area; thumb-friendly mobile; contemporary studio feel | Pending |
| Asymmetric zig-zag rows for selected work over card grid | Cinematic; gives each project room to breathe; matches the editorial voice | Pending |
| Case study = Editorial + Structured (synthesis) | Magazine voice for distinction + TOC for hiring-manager scan | Pending |
| MVP = home + SplitSmart + About | Smallest shippable; lets us validate the design system before scaling content | Pending |
| Featured project = SplitSmart | Real prototype already exists; tool-like utility positions her well for product roles; design decisions documented | Pending |
| Keep Next.js | Existing setup; rich interaction support; MDX makes case-study writing pleasant | Pending |
| Deploy to Vercel | Native Next.js; free; auto-deploys from GitHub | Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-16 after initialization*
