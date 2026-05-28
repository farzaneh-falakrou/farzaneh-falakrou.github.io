## CASE STUDY · SPLITSMART · 2026

# SplitSmart

**Role** Lead UX/UI Designer · **Timeline** 4-week design sprint — May 2026 · **Type** Concept · Self-directed

---

## THE PROBLEM

When you are managing a Paris Trip group, a Home Bills group, and a Work Lunch group simultaneously, you are not just tracking debts. You are managing your own money. Every expense logged by a friend is a cost that lands on your personal budget — but expense apps only show the group's side of that equation.

---

## COMPETITIVE AUDIT

I audited four apps — Splitwise, Tricount, Settle Up, and Venmo Groups — mapping tap depth to key actions and examining what financial information each surfaces at the home view.

**Shared findings across all four apps:**

— **Home screen shows groups or friends, not actions.** Balances were visible, but to settle or send a reminder you had to navigate into a group first. No app combined a balance with its primary action in the same view.

— **No personal budget layer.** Every app stopped at the group ledger. Your share of costs across all active groups was never aggregated or tracked against a personal cap.

Splitwise's own support forums surfaced this last gap repeatedly, with users requesting personal budget tracking — a feature the team acknowledged but deprioritised.

---

## STRATEGY

### Two layers. One app.

Shared expenses are still your expenses. A Paris Trip costs the group £700. But it costs *you* £233. That number belongs in your personal budget, not only in the group ledger.

**Layer 1 — Shared expense management.**
Split costs, track group balances, settle debts, send reminders.

**Layer 2 — Personal budget intelligence.**
A dedicated Budget screen that:

— Isolates your share of costs across all active groups
— Tracks your total spend against a monthly cap you set
— Forecasts where you will end the month at your current daily spend rate

These two layers are not separate features — they are the same financial reality seen from two angles: the group's ledger and your personal budget.

---

## INFORMATION ARCHITECTURE

Before moving to high fidelity, I mapped the full app hierarchy: every screen, how they connect, and where key actions live. This made it possible to validate the two-layer structure — shared and personal — before committing to interface work, and to confirm that the Budget screen could sit as a peer to the Dashboard rather than buried inside it.

---

## DESIGN DECISIONS

### Dashboard — action next to position

The core decision was to place a balance and its settle action in the same view. When the next step is already visible, the user does not need to decide where to go — they simply act.

### Budget screen — personal, not group

Rather than showing group totals, the Budget screen translates shared expenses into a personal financial picture: your share, your cap, your forecast.

### Friends page — unresolved first

Relationships are ordered by what needs attention, not by recency. Unresolved balances surface at the top.

### Groups page — remaining, not spent

The decision was to surface how much budget each group has remaining, not just how much it has spent. Remaining is actionable. Spent is history.

---

## USABILITY TESTING

*5 participants · 10 minutes each · unmoderated*

| Task | Result |
|---|---|
| Average time to identify balance | ~4 seconds |
| Average taps to settle a balance | 1–2 taps |
| Task completion rate | 100% |
| Participants needing assistance | 0 of 5 |
| Understood budget status immediately | 4 of 5 |
| Expected to settle across all groups at once | 3 of 5 |

All five participants completed primary tasks with no major navigation issues. Balance, settlement, and budget status were understood quickly across the board.

**Key finding:** Three participants expected to settle with a person across all groups at once, rather than group by group. This showed the settle flow conflicted with users' natural mental model — they think in terms of *who* they owe, not *which group* the debt belongs to. This finding directly drove the redesign of the Settle Up screen.

**Open question:** One participant expected the settle action directly on the balance card, one tap earlier than the current flow allows. This wasn't addressed in the redesign and remains a potential improvement.

> "I expected to settle with one person across all groups at once."
> "I can immediately tell what I actually spent."
> "The budget makes shared expenses easier to understand."
> "Feels simpler than other expense-splitting apps."

---

## REDESIGN: SETTLE UP FLOW

Based on the testing findings, I redesigned the Settle Up screen to reflect how users naturally expected the feature to behave. Rather than settling one group at a time, the redesigned flow shows the minimum number of transfers required to clear all outstanding debts across all groups — consolidating by person, not by group.

---

## GAPS AND TRADEOFFS

### Gap 1 — No percentage-based or weighted splits

Every expense currently divides equally between members. Real groups rarely work that way: one person earns more, one person missed part of a trip, one person ordered less. Without support for custom splits by percentage, share count, or exact amount, SplitSmart forces a fairness assumption that doesn't hold in practice. This is the most functionally limiting constraint in the current design.

### Gap 2 — No multi-currency support

The app assumes a single currency throughout. For international group trips — the core use case the Paris Trip example was designed around — this is a significant constraint that would need to be addressed before the app could serve its intended audience fully.

---

## CONCLUSION

SplitSmart is built on the idea that users don't want to hold two mental models at once — the group's ledger and their own budget. The app brings those together in a single view, so shared expenses land where they actually belong: in your personal financial picture.
