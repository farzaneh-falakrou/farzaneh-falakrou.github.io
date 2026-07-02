# Homelon Case Study — working hub

**This folder is the single home for the Homelon case study.** Everything needed to
discuss, decide on, and eventually build the case-study page lives here. If material is ever
scattered, pull it back into this folder.

_Skeleton created 2026-06-05, mirroring the SplitSmart case-study structure._

> **`LOG.md`** is the running record of decisions, what's done, what's deferred, and open
> questions. This README is the stable status/index; the log is the history and the *why*.

---

## Status at a glance

| | |
|---|---|
| **Thesis** | Real estate listings drown new buyers in information — Homelon cuts through it with a comparison-first search flow. |
| **Canonical voice** | `case-study.md` — rewritten 2026-07-02 from `legacy/homelon.html` (sole text source) |
| **Sketch** | none yet — no `website_page/index.html` (Phase 2, not started) |
| **Open decisions** | Role/Team/Type metadata fields unconfirmed (see `case-study.md` header) |
| **Next build step** | Phase 2 — design and build the case-study webpage (own brainstorm/spec cycle) |

### The thesis

> Real estate listings drown new buyers in information — Homelon cuts through it with a comparison-first search flow.

- **Phase 1 (done)** — content rewrite, this file's sibling `case-study.md`.
- **Phase 2 (next)** — case-study webpage build.
- **Phase 3 (after)** — rebuild key screens (search, favourites/compare, property info, onboarding, etc.) as live HTML/Tailwind prototype pages, replacing static screenshots as the design reference.

---

## What's in here

```
homelon_case_study/
├── README.md              ← you are here (status + index)
├── case-study.md          ← CANONICAL writeup (skeleton — fill from source)
├── LOG.md                 ← running record of decisions / done / deferred / open questions
└── screens/               ← design reference screenshots (Landing, Onboarding, Search,
                              Compare, Dashboard, Filter, Favourites, Info, Confirmation, …)
```

> **Not built yet** (add when work starts): `website_page/` (the case-study page sketch),
> `visuals/` (hand sketches / IA), `prototype/` (live reference pages), canonical source PDF.

---

## Notes

- Content sourced entirely from `legacy/homelon.html` (only text source; no separate PDF/deck exists). Extra screens in `screens/` beyond what the legacy page displayed (onboarding, hamburger menu, filter, send message, confirmation) are referenced narratively in `case-study.md`.
- When writing, preserve the user's own voice (see memory `feedback_preserve_user_voice`); edit only when necessary.
