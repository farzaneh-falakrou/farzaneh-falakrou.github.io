---
title: SplitSmart case study — framing locked
date: 2026-05-17
type: note
status: locked
related:
  - .planning/notes/case-study-skeleton-v1.md
  - .planning/notes/splitsmart-artifact-gaps.md
  - .planning/seeds/splitsmart-case-study-production.md
  - C:/Users/farza/Desktop/workspace/expense_splitter/
---

# SplitSmart case study — framing locked

The binding framing document for writing the SplitSmart case study. Synthesized from four parallel research lenses (competitive, artifact, portfolio strategy, behavioral research) and validated against the prototype itself.

## The thesis (locked)

> **The product problem isn't the math. It's the ask.**

Every expense-splitter on the market — Splitwise, Tricount, Settle Up, Venmo Groups — opens to the same screen: a running ledger of who owes whom. They surface the math and defer the resolution to the user, who must then translate "Sarah owes you £47.50" into a socially-loaded request. SplitSmart inverts the hierarchy: the home view is the queue of decisions to make, and the ledger is the proof underneath. The system absorbs the ask so the friendship doesn't have to.

## The hero hook (draft)

For the editorial centered hero (per sketch 005), Instrument Serif, italic on "asking":

> *Splitting the bill is the easy part. The expensive part is **asking**.*

Followed by a single editorial paragraph (the thesis above, condensed) before any screen appears. Screens enter as evidence of the argument, never as the lede. This is the Stripe Press / Linear-changelog move — the writing earns the right to show the design.

## Why this framing is defensible

Three independent lenses converged on the same insight:

### A · Competitive evidence (the structural claim)

Every legacy expense-splitter treats the running ledger as the home view. Settlement is a *button* you press on a ledger, not a *task* the app surfaces.

- **Splitwise** — Dashboard = running balance + expense list. Reminders exist but are user-initiated, one-friend-at-a-time, buried. Active feedback-forum requests for automated reminders remain unimplemented for years.
- **Tricount** — Hero: "Simplify Group Expenses." Home view = expense list + bar-chart balances. Settlement is a calculation suggestion at trip end.
- **Settle Up** — Despite the name, dashboard leads with a bubble chart of balances and a transaction history feed. Settlement is an algorithm output, not a workflow.
- **Venmo Groups** — Framed as "track, manage, and settle." Anyone can settle "at any time" — entirely user-pulled, no queue.
- **Cino** — Notably skips the ledger entirely by splitting at point-of-sale. Validates that the ledger is the problem, not the solution.

This is a claim about UI hierarchy, not feature presence — verifiable by anyone who opens five competitor apps and screenshots the first screen.

### D · Research anchor (the behavioral claim)

Two recent, citable findings:

- **Angulo, Goldstein & Norton (2024/2025), *Journal of Consumer Psychology*, "Friendship Fallout and Bailout Backlash."** Six studies showing that lending blurs communal (friendship) and exchange (transactional) norms; lenders retain a sense of "deserved oversight" over borrowed money; negative judgments persist even after full repayment. **The strongest single anchor for an expense-splitter case study published in the last 18 months.**
- **Flynn & Bohns (2008), *JPSP*, on the underestimation-of-compliance effect.** People underestimate by ~50% how likely others are to agree to direct requests — they overweight the cost of saying yes and underweight the cost of saying no. Applied: the *asker* anticipates more friction than the *payer* actually feels, so debts go unrequested.
- Supporting: Prelec & Loewenstein (1998), "The Red and the Black" — by the time a friend asks you to settle a week-old dinner, the consumption pleasure has decayed but the pain of paying is fresh and decoupled. Uniquely aversive configuration.

**Honest caveat:** none of these papers studied expense-splitting apps. Applying them to SplitSmart is analogical inference, not tested finding. No quantitative effect sizes for app-mediated reminders. That's a design hypothesis, not a result.

### C · Portfolio voice (the strategic claim)

A "fintech for friends" framing competes with Splitwise, Venmo, and every neobank concept post. The "what does this app refuse to feel like?" framing signals product thinking (you defined a non-obvious problem) and taste (you have an opinion). It's defensible without metrics — the artifact is the *argument*, not adoption numbers, which is the right move for a concept project read by senior PMs.

**Avoid:** "Meet SplitSmart — a modern way to split expenses with friends." (Product Hunt voice.) "The Problem: Splitting bills is hard." (Generic bootcamp opener.) Skip the problem/solution/process scaffold entirely.

## How the prototype proves the thesis (verified)

Read against the actual HTML at `C:/Users/farza/Desktop/workspace/expense_splitter/`:

| Design move | What it argues |
|---|---|
| Dashboard top-left = "+£25 You're ahead across active groups" gradient card | Lead with the *position*, not the ledger |
| "Needs your attention (2)" card with inline coral **Settle up** + outlined mint **Send reminder** | Settlement as primary CTA, not buried action |
| "Settled" card explicitly says *"Active balances appear in 'Needs your attention'."* | Cleared relationships move out of the way; home view is the queue |
| Friends page = unresolved relationships, one action button each | Entity model is action-shaped, not record-shaped |
| Group-detail has dedicated **Debts** tab; Settle Up leads with *"Two transfers and you're clear"* | Debt simplification is foregrounded — competitors have it but bury it |
| Add Expense right rail computes *"You'll get back £80.00"* live | Even data-entry is framed in settlement terms |

## The three honest gaps (forward-look material)

These are the case study's "where this design wants to go next" section — see `.planning/notes/splitsmart-artifact-gaps.md` for details.

1. **The reminder copy is not designed.** The strongest part of the thesis — "make the ask feel like a neutral system event, not a personal request" — has no visual evidence yet. The button exists; the message doesn't.
2. **Personal-finance widgets dilute the settlement focus.** Monthly spend trend, By category donut, Spending over time bars — defensible but slightly off-thesis.
3. **No edge or dispute states.** Missing: "I paid Luigi in cash, just mark it cleared." "Mina disputed the dinner split." The social contract's edge cases aren't visualized.

## Visual identity dissonance (acknowledge, don't resolve)

The prototype is violet `#5A2DF0` / cyan / mint / coral on a navy sidebar with Inter — modern fintech dashboard energy. The portfolio shell is cream `#ebe8e2` + Instrument Serif + orange accent. The case study page will frame the work, not match it. This is normal — designers routinely show work with its own identity inside a portfolio with its own identity. The editorial template (sketch 005) handles this by treating screenshots as cited evidence inside an editorial article.

## Source material (extant)

- `C:/Users/farza/Desktop/workspace/expense_splitter/Case Study.docx` — initial draft. Body sections are conventional; the "Challenges" and "Research Methods" appendices contain the highest-quality opinionated material. Fold appendix material into the main spine; don't keep it as appendix.
- `C:/Users/farza/Desktop/workspace/expense_splitter/*.html` — 8 prototype screens
- `C:/Users/farza/Desktop/workspace/expense_splitter/snap-*.md` + `dashboard-snapshot.md` — screen annotations
- `C:/Users/farza/Desktop/workspace/expense_splitter/Screenshot/` — raw screenshots

## Decisions not yet made

- Exact section-by-section copy and order — to be worked out in `/gsd-sketch` once the framing is locked.
- Which screens appear at what size, and which get callouts.
- Whether to keep £ (UK) or convert to $ (US) or show both — depends on portfolio audience.
- Whether the "honest gaps" section is its own chapter or folded into Reflections.
