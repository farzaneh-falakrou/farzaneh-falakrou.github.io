# Homelon Case Study — Content Rewrite (Phase 1 of 3)

## Scope

This is Phase 1 of a three-phase project mirroring the SplitSmart case study's build order:

1. **Phase 1 (this doc)** — rewrite `homelon_case_study/case-study.md` content only.
2. **Phase 2** (future, own brainstorm) — build the actual case-study webpage.
3. **Phase 3** (future, own brainstorm) — rebuild ~15 key screens as live HTML/Tailwind
   prototype pages (search, favourites/compare, property info, onboarding, dashboard,
   filter, hamburger menu, send message, confirmation, etc.), replacing the static
   Figma screenshots as the design reference — same pattern as SplitSmart's `prototype/`.

Each phase gets its own design + plan cycle. This document covers Phase 1 only.

## Source material

- **Text**: `legacy/homelon.html` — the only text source. No separate PDF/deck exists
  (confirmed with user).
- **Visuals**: `homelon_case_study/screens/` — a richer screenshot set than what the
  legacy page currently embeds (includes onboarding steps, hamburger menu, filter,
  send message, confirmation — not shown on the live page). Phase 1 references these
  screens narratively where they strengthen the story; Phase 3 will decide which become
  live HTML builds.

## Voice

Preserve the user's own voice per [[feedback_preserve_user_voice]] — edit for clarity,
concision, and de-duplication, not to replace her word choices wholesale. This is a
**rewrite for clarity**, not a ground-up reinvention: keep facts, project scope, and
tone (a solo UI-focused project, short timeline, real research gaps she filled herself).

## Thesis

Working one-line thesis, to open the case study:

> Real estate listings drown new buyers in information — Homelon cuts through it with
> a comparison-first search flow.

(Rationale: the legacy Problem Statement names "information overload" and "navigational
hurdles" as the core issue; the Favourite & Compare section is the one place the legacy
copy explicitly names its differentiator — "simplify decision-making" via side-by-side
comparison. This mirrors SplitSmart's thesis pattern: name the shared problem, then the
one thing this app does differently.)

## Section structure

Not a forced fit to SplitSmart's 9 sections — structured around what Homelon's source
material actually supports, in SplitSmart's *style* (concise, bolded key phrases,
thesis-driven, no filler).

1. **The Problem** — real estate app complexity/information overload for new buyers.
   Source: Problem Statement + Solution cards.
2. **Competitive Audit** — Trulia, ImmoScout, Zoopla; gap she identified (given research
   didn't include competitive analysis, so she ran her own).
3. **User Stories & Flows** — the prioritized user stories and the user-flow diagram
   (key features highlighted in the flow).
4. **Design Decisions** — wireframes (low → mid → high fidelity) and style guide
   (watermelon palette, typography, icons, UI elements, imagery) reframed as *reasoned
   choices tied to the brand/user goal*, not a features list.
5. **The Screens** — walkthrough of Search, Favourites & Compare, Property Info &
   Contacts, plus onboarding and other flows pulled from the fuller `screens/` set that
   aren't in the legacy page today.
6. **Gaps & Limitations** — honest scope caveats: short timeline meant UI-only focus,
   no usability testing was done, research handed to her lacked competitive context.
7. **Conclusion** — folds in the existing three retrospective cards (Challenges,
   Learnings, Future Steps) as forward-looking prose, not three separate boxes.

## Out of scope for Phase 1

- No webpage/HTML build (Phase 2).
- No live prototype screens (Phase 3).
- No new screenshots or design work — only using what exists in `screens/`.
- No changes to `legacy/homelon.html` (stays as historical record until Phase 2 replaces
  the live page).

## Deliverable

Filled-in `homelon_case_study/case-study.md` (replacing the current `_TBD_` skeleton),
plus updated `README.md` / `LOG.md` status entries in that folder reflecting Phase 1
completion and Phase 2/3 as next steps.
