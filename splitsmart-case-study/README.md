# SplitSmart Case Study — working hub

**This folder is the single home for the SplitSmart case study.** Everything needed to
discuss, decide on, and eventually build the case-study page lives here. If material is
ever scattered again, pull it back into this folder.

_Consolidated 2026-05-28 from `.planning/sketches/008-splitsmart-case-study/` and the
external prototype repo._

> **`LOG.md`** is the running record of decisions, what's done, what's deferred, and open
> questions. This README is the stable status/index; the log is the history and the *why*.

---

## Status at a glance

| | |
|---|---|
| **Thesis** | Two-layer (pivoted 2026-05-22 from the old "asking is expensive" framing) |
| **Canonical voice** | `splitsmarter_2.pdf` → mirrored as `case-study.md` (9 sections) |
| **Sketch** | `website_page/index.html` — 3 variants A / B / C, **winner not picked** (`winner: null`) |
| **Open decisions** | (1) pick variant A/B/C · (2) before/after for Settle Up · (3) mobile TOC fallback |
| **Next build step** | Phase 3 in `.planning/ROADMAP.md` — port the chosen variant to a Next.js page (gated on Phase 1 landing) |

### The thesis

> Every expense app tracks the group's money — SplitSmart tracks yours too.

- **Layer 1** — shared expense management, with the next action surfaced next to the balance.
- **Layer 2** — personal budget intelligence: a dedicated Budget screen measuring your
  share of every group against a monthly cap, forecasting the month, and identifying the
  group driving your spend.

---

## What's in here

```
splitsmart-case-study/
├── README.md              ← you are here (status + index)
├── case-study.md          ← CANONICAL writeup, mirrors splitsmarter_2.pdf (9 sections)
├── splitsmarter_2.pdf     ← CANONICAL source PDF (user's voice — do not rewrite)
├── prototype/             ← TRUE design reference — live prototype pages (dated snapshot)
│   ├── index.html         ← entry; links to all the pages below
│   ├── dashboard.html · groups.html · group-detail.html · friends.html
│   ├── add-expense.html · add-friend.html · create-group.html
│   ├── settle-up.html (+ -luigi / -mina variants)
│   ├── assets/tailwind-config.js
│   └── mockups/budget-pivot/   ← Layer 2 budget mockups (budget.html, -v2, -v3, dashboard.html)
├── website_page/
│   ├── index.html         ← the 3-variant case-study sketch (press 1 / 2 / 3 to switch)
│   ├── README.md          ← variant rationale + evaluation criteria
│   └── backups/           ← prior sketch versions (incl. pre-budget-pivot)
├── visuals/               ← the 3 hand sketches that are still current
│   ├── splitsmart-ia.png             ← information architecture
│   ├── splitsmart-home-sketch.png    ← Layer 1 home sketch
│   └── splitsmart-budget-sketch.png  ← Layer 2 budget sketch
└── _archive/
    └── stale-notes/       ← pre-pivot (May 17) notes + seed — kept for history, NOT current
```

> **`prototype/` is a dated snapshot (2026-05-28).** The live, editable prototype is its own
> repo (path below) and the user actively edits it — this copy **will drift**. It's here so the
> hub is self-contained for discussion; re-sync by re-copying when needed. The HTML pages
> linked from `prototype/index.html` are the true design reference (not screenshots).
>
> **`visuals/` holds only the 3 hand sketches that are still current.** The prototype page
> screenshots and usability-test PNGs were outdated and removed — they remain archived in the
> external prototype's `Screenshot/` folder if ever needed.

### Canonical vs. superseded

- **Use:** `case-study.md` / `splitsmarter_2.pdf`. The PDF is the user's own voice — edit
  only when necessary, never rewrite or "refine" (see memory `feedback_preserve_user_voice`).
- **Superseded** (left in the external prototype, *not* copied here): `splitsmarter.pdf`,
  `Splitsmart Case Study Rewritten.pdf`, `Case Study.docx`, `edit case study.docx`.
- **Stale** notes in `_archive/stale-notes/` predate both the budget pivot and the May 27
  PDF rewrite. The `website_page/README.md` still says "five sections" — that predates the 9-section
  PDF; trust `case-study.md` for structure.

---

## The live prototype (not copied — linked)

The interactive SplitSmart prototype is its **own git repo**, actively edited, and lives at:

```
C:\Users\farza\Desktop\workspace\expense_splitter\
```

It holds the working HTML pages, `mockups/budget-pivot/`, and the full `Screenshot/` folder.
The `prototype/` folder here is a **2026-05-28 snapshot** of those pages — for the
authoritative, current state, open that external repo. **Re-read it fresh when working on the
case study; it changes between sessions.**
