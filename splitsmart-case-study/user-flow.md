# SplitSmart — App Map & Task Flows

> Working document. Logic is defined here in markdown first; once it reads correctly it gets turned into diagrams for the case study.
>
> The prototype is a Figma-style sketch: main screens and functions are present, but not every screen is wired to every other. Where the real app *would* link but the prototype doesn't, it's noted as `(implied)`.

Two diagrams do two different jobs:

- **App map** — answers *"what is this app and how is it structured?"* (a sitemap / screen inventory, not a flow).
- **Task flows** — answer *"how does a person complete a specific job?"* (sequence + decision points).

---

## 1. App map (structure)

Four peer destinations in the primary nav, each with its detail/action screens hanging off it. The **Overview** is the hub — most jobs can also be started from there.

```
SplitSmart
│
├── Overview (Dashboard) ............ hub / snapshot
│     ├─ Overall balance (owe / owed)
│     ├─ Monthly spend
│     ├─ Spending over time
│     ├─ Debts  ──────────────► Settle up (per person)
│     ├─ By category
│     ├─ Groups (preview) ────► Group detail
│     └─ [+ Add expense] ─────► Add expense
│
├── Groups ......................... all groups
│     ├─ [+ Create group] ───► Create group
│     └─ Group card ─────────► Group detail
│                                 ├─ Expenses in this group
│                                 ├─ Members
│                                 ├─ Charts tab (by-category, spent-by-day)
│                                 ├─ [+ Add expense] ─► Add expense
│                                 └─ Settle up ──────► Settle up
│
├── Settle up ...................... balances across all friends
│     ├─ Net balance banner
│     ├─ You'll receive  → per-person → [Remind] / [Log received]
│     ├─ You owe         → per-person → [Pay] / [Log paid]
│     ├─ [Remind all] / [Pay all]   (batch actions)
│     └─ All clear (settled people)
│
└── Budget .......................... personal monthly cap
      ├─ This month vs. cap (+ daily pacing)
      ├─ By group ──────────► Group detail
      ├─ By category
      ├─ This month, line by line (expense table)
      └─ 12-month history

Supporting / setup screens:
   • Add expense    → reached via [+ Add expense] (Overview, Group detail)
   • Create group   → reached via [+ New group] (Groups)
   • Friends ⇄ Add friend  → ORPHAN: these two link to each other only;
       nothing in the prototype navigates into Friends. In prod this would
       hang off nav or an "invite" action, but that link isn't wired here.
```

**Notes on the sketch vs. a production build**
- `Add expense` submits and returns to **Overview** in the prototype; in production it would return to the context it was opened from (group detail, etc.).
- `Add friend` / **Friends** exist as screens but are **not reachable** in the prototype — they link only to each other, with no entry point from nav or any other screen. In production they'd hang off the nav or an invite action; that link simply isn't sketched yet.
- Per-person settle screens (`Settle up with Mina`, `…with Luigi`) are instances of one template, not separate destinations.

---

## 2. Task flows

Three flows carry the case-study story: **log → settle → track**. Each captures the main functions and decision points, not every button.

### Flow A — Log a shared expense
*Goal: record something one person paid and split it with the group.*

```
Entry: [+ Add expense]  (from Overview header  OR  Group detail)
   │
   ▼
Add expense screen
   • Group (pre-filled if entered from a group)
   • Title, Amount, Date
   • Category
   • Paid by (defaults to you)
   • Split — equally across group members (live "each person pays")
   │
   ├─ Cancel / back ──────► Overview  (in prod: back to entry point)
   │
   ▼ [Add expense]
Saved
   • Balances recalculated for everyone in the group
   ▼
End: Overview  (in prod: return to the group you came from)
```
**Main functions:** choose group, enter amount + details, assign payer, split equally, see your resulting position ("you'll get back £X") before saving.

---

### Flow B — Settle up  *(the redesign hero)*
*Goal: clear what you owe / collect what you're owed — ideally in one pass.*

The key finding: people think in terms of **who** they owe and want to clear everyone at once, not one debt at a time. The flow supports **both** a batch path and a per-person path.

```
Entry: Settle up (nav)   OR   Debts card on Overview   OR   Group detail → Settle up
   │
   ▼
Settle up screen
   • Net balance banner ("two transfers and you're clear")
   • Two columns: You'll receive  |  You owe
   • All-clear list (already settled)
   │
   ├──► BATCH path (clear everyone at once)
   │       • [Pay all]     → pays everyone you owe in min. transfers
   │       • [Remind all]  → nudges everyone who owes you
   │            ▼
   │        Those people move to "All clear"
   │
   └──► PER-PERSON path (handle one relationship)
           Tap a person row
              ▼
           Settle up with <person>
              • Net balance with that person
              • "How it adds up" — per-group breakdown
              • Decision:
                  ┌─ You're owed →  [Send reminder]  or  [Log received manually]
                  └─ You owe     →  [Pay]            or  [Log paid manually]
              ▼
           Person marked settled → back to Settle up
   │
   ▼
End: fewer/zero open balances; settled people in "All clear"
```
**Main functions:** see net position, settle everyone in one action (Pay all / Remind all), or drill into one person to pay/remind/log manually with a per-group explanation of the number.

---

### Flow C — Track my budget  *(the pivot / differentiator)*
*Goal: understand personal spending against a monthly cap, then dig into what drove it.*

```
Entry: Budget (nav)
   │
   ▼
Budget screen
   • This month's spend vs. monthly cap (+ daily pacing: on/over track)
   • By group   |   By category
   • 12-month history
   │
   ▼ (drill down) tap a group row
Group detail
   • The expenses inside that group that fed the number
   • From here: [+ Add expense] or Settle up  → (leads into Flow A / Flow B)
   │
   ▼
End: user understands where the money went and can act on it
```
**Main functions:** see spend vs. cap with pacing, break spending down by group and category, review history, and drill into a group to see the underlying expenses.

---

## 3. How the flows connect

The three flows aren't isolated — they form a loop, which is the point of the product:

```
Log expense (A)  ──raises──►  balances & spend
        ▲                          │
        │                          ▼
   drill from Budget         Settle up (B)  ──clears──► balances
        │                          
        ▼                          
   Track budget (C)  ◄──feeds── every logged expense
```

Every logged expense (A) feeds both **Settle up** (B, the balances) and **Budget** (C, the spend). Settling (B) resets balances; tracking (C) sends you back to log or review. Overview is the dashboard that surfaces all three at a glance.
