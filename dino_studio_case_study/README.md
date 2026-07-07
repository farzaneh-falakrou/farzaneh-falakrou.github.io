# Dino Studio Case Study — working hub

**This folder is the single home for the Dino Studio case study.** Everything needed to
discuss, decide on, and eventually build the case-study page lives here. If material is ever
scattered, pull it back into this folder.

> **`LOG.md`** is the running record of decisions, what's done, what's deferred, and open
> questions. This README is the stable status/index; the log is the history and the *why*.

---

## Status at a glance

| | |
|---|---|
| **Thesis** | A museum-scale dataset can stay serious and still be approachable — simplify the taxonomy tree, map, and charts to show only what matters in the moment. |
| **Canonical voice** | `case-study.md` — content written, adapted from the legacy `dino_studio.html` page into the SplitSmart/Homelon voice and structure. |
| **Page** | `website_page/index.html` — built on the same locked `#vb`-style template as SplitSmart/Homelon (`#db` prefix), same orange accent palette as SplitSmart, browser-chrome figure frames (desktop web app, not phone mockups). |
| **Open decisions** | None outstanding — design approved by user 2026-07-07. |
| **Next build step** | Wire into the portfolio index / nav once the other case studies are finalized. |

### The thesis

> A genuinely large, serious dataset doesn't have to be traded off against being approachable.

---

## What's in here

```
dino_studio_case_study/
├── README.md              ← you are here (status + index)
├── case-study.md          ← CANONICAL writeup
├── LOG.md                 ← running record of decisions / done / deferred / open questions
├── screens/               ← original design reference screenshots (Dino1–8, Low-fi)
├── visuals/                ← cropped/selected screens used in website_page/index.html
└── website_page/
    └── index.html          ← the built case-study page
```

---

## Notes

- Legacy source of truth: `legacy/dino_studio.html` (the old portfolio's Dino Studio page) — its
  content was adapted, not copied verbatim, to match the SplitSmart/Homelon tone and structure.
- Reference template: `splitsmart-case-study/website_page/index.html`'s `#vb` block — reused
  wholesale, including its orange accent palette (`--accent: #ff5a36`), with browser-chrome
  figure frames instead of phone mockups, since Dino Studio is a desktop web app, not a mobile
  app.
- Usability testing section is intentionally short — the legacy source only described two
  rounds with five users and no tracked metrics, so no metrics table was invented for it (unlike
  SplitSmart's testing section, which had real numbers).
