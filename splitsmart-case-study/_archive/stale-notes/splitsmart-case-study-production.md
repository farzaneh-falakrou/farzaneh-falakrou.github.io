---
title: SplitSmart case study — production checklist
trigger_condition: Phase 01 (Next.js foundations) is complete and a case study page route exists; OR /gsd-sketch for SplitSmart has produced an HTML sketch ready to port
planted_date: 2026-05-17
type: seed
status: planted
related:
  - .planning/notes/splitsmart-case-study-framing.md
  - .planning/notes/case-study-skeleton-v1.md
  - .planning/notes/splitsmart-artifact-gaps.md
---

# SplitSmart case study — production checklist

A forward-looking seed: everything that needs to happen to ship the SplitSmart case study page on the live portfolio, once the Next.js foundations from Phase 01 (and likely subsequent foundation phases) are in place.

**This seed activates** when both of these are true:
1. Phase 01 (and any other prerequisite foundation phases) is complete — i.e., there is a Next.js scaffold that can host a case study page.
2. The SplitSmart case study has been sketched in HTML via `/gsd-sketch` and the design is locked at the page-level.

If only one is true, the seed remains planted — don't start producing the case study without both inputs.

## Phase A · Pre-production (before the page exists)

- [ ] Confirm the framing in `.planning/notes/splitsmart-case-study-framing.md` is still current. If 3+ months have passed, re-verify the competitive landscape claims (Splitwise, Tricount, etc. — do they still lead with a ledger?).
- [ ] Decide on currency framing — £ (matches prototype), $ (US portfolio audience), or both. Update prototype screenshots accordingly if changed.
- [ ] Decide whether to address the **reminder copy gap** (Gap 1 in `splitsmart-artifact-gaps.md`) before publishing or name it as forward-look. Recommendation: design the reminder modal — it's the highest-leverage addition.
- [ ] Confirm research citations are still valid and accessible:
  - Angulo, Goldstein & Norton (2024/2025), *Journal of Consumer Psychology*
  - Flynn & Bohns (2008), *JPSP*
  - Prelec & Loewenstein (1998), *Marketing Science*

## Phase B · Content

- [ ] Hero copy — final Instrument Serif sentence + opening editorial paragraph (~50 words). Italicized accent word identified.
- [ ] Metadata strip — Project · Role · Year · Timeline · Type.
- [ ] Section 02 (Context & framing) — competitive critique with 2–3 named products and a defensible structural claim about UI hierarchy.
- [ ] Section 03 (Research & insight) — one anchored claim, with citation. Pull-quote from research if available.
- [ ] Section 04 (Strategy / IA) — single structural decision named, explained.
- [ ] Section 05 (Design execution) — 4–6 subsections, each titled with what it argues:
  - Dashboard → "Am I up or down? Three seconds."
  - Action-needed list → "The reminder is a primary action."
  - Settle Up → "Two transfers and you're clear." (debt simplification)
  - Add Expense → "Even data-entry is settlement-shaped."
  - Group detail → "The Debts tab is its own first-class view."
  - (Optional) Friends → "Relationships, not records."
- [ ] Section 06 (Decisions & tradeoffs) — 2–4 named tradeoffs with rejected alternatives.
- [ ] Section 07 (Iteration) — at least one before/after if iteration material exists; otherwise skip.
- [ ] Section 08 (Honest forward-look) — three gaps from `splitsmart-artifact-gaps.md`, written as forward-looking design questions.
- [ ] Section 09 (Reflection) — optional, 100–150 words max.
- [ ] Section 10 (Footer) — link to the next case study (TBD).

## Phase C · Visual assets

- [ ] Screenshots from the prototype — high-DPI, consistent crop, consistent device frame (or no frame).
  - Dashboard (hero screen)
  - Dashboard close-up: Needs-your-attention card
  - Friends page list
  - Settle Up "two transfers and you're clear"
  - Group detail with Debts tab open
  - Add Expense with right rail visible
- [ ] Cover image for hero (decide: full dashboard? close-up of the action card? abstract typographic treatment?)
- [ ] Any custom illustrations or diagrams (e.g., "ledger vs queue" comparison diagram — high-leverage candidate)
- [ ] OG / social card image (for shares)

## Phase D · Code / wiring

- [ ] Route in Next.js: `/work/splitsmart` (or per portfolio convention)
- [ ] MDX or component-based content per portfolio convention
- [ ] Editorial + Structured template applied (per sketch 005):
  - Centered editorial hero
  - Horizontal metadata strip that scrolls away
  - 2-column body with sticky TOC left, wider article column right
  - Section marks combining editorial label with structural number
- [ ] Typography: Instrument Serif for hero + section labels; Inter for body
- [ ] Colors: cream background, ink text, orange accent — *not* the prototype's violet palette
- [ ] Image gallery / lightbox if used
- [ ] Reading progress indicator (if portfolio convention)
- [ ] "Next case study" footer link working

## Phase E · Pre-publish QA

- [ ] No invented metrics. Check every percentage and number against a real source.
- [ ] Research citations linkable and accessible (open-access where possible).
- [ ] All screenshots crisp at retina; alt text written for accessibility.
- [ ] Reading test — read top to bottom; check that every section ladders to the thesis.
- [ ] Hostile test — read it from the perspective of a hiring manager who skims; does the hero earn the scroll? Does the forward-look section signal seniority?
- [ ] Voice test — read aloud; does it sound like the rest of the portfolio?
- [ ] Mobile breakpoint — works at 375px? 414px?
- [ ] OG image renders correctly on Twitter / LinkedIn previews.

## Phase F · Publish

- [ ] Add to portfolio index / work grid.
- [ ] Verify routing.
- [ ] Notify relevant channels (LinkedIn post, design Twitter, Read.cv).
- [ ] Add to live case study list in `ROADMAP.md` or equivalent.

## After publishing — revise the skeleton

- [ ] Update `.planning/notes/case-study-skeleton-v1.md` based on what worked / didn't work in this first case study. The skeleton is a hypothesis; this is the first confirmation.

## Risk / caveat

If the framing in `splitsmart-case-study-framing.md` no longer feels right when production begins, **stop and re-explore via `/gsd-explore`**. Do not produce the case study against a framing that has gone stale. The cost of pausing is small; the cost of publishing a case study you don't believe in is large and slow to undo.
