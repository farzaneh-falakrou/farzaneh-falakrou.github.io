# Homelon case study — working log

Running log of decisions, work, and open threads. Newest entries at the top of each section.
For current status/structure see `README.md`; this file is the *why* and the *history*.

---

## Decisions

- **2026-06-05 — Skeleton created.** Folder scaffolded to match the SplitSmart case-study
  structure (`README.md` + `case-study.md` + `LOG.md`). No content written yet; not being
  worked on at the moment.

- **2026-07-02 — Phase 1 content rewrite complete.** `case-study.md` rewritten from
  `legacy/homelon.html` (sole text source) plus the fuller `screens/` set, in SplitSmart's
  prose style but with a Homelon-native 7-section structure (not forced into SplitSmart's
  9 sections — see design doc `docs/superpowers/specs/2026-07-02-homelon-case-study-content-design.md`).
  Role/Team/Type metadata left as `_TBD_` — no source evidence for these fields.

- **2026-07-02 — Phase 2 webpage sketch complete.** `website_page/index.html` built —
  single variant (Balanced/B register) inside the locked Editorial + Structured
  template (sketch 005 winner E), same pattern as
  `splitsmart-case-study/website_page/index.html`. 7 sections ported from
  `case-study.md`, 12 curated screenshots copied to `visuals/`. `winner: null` —
  not ported to Next.js, mirroring SplitSmart's own unresolved Phase 2 status. See
  design doc `docs/superpowers/specs/2026-07-02-homelon-case-study-webpage-design.md`.

## Done

- **2026-06-05** — Created the hub skeleton. Screens already present in `screens/`.
- **2026-07-02** — Phase 1 content rewrite complete. `case-study.md` fully written (7
  sections: The Problem, Competitive Audit, User Stories & Flows, Design Decisions,
  The Screens, Gaps and Limitations, Conclusion).

## Not done / deferred

- **Next.js integration** — sketch is static HTML only, not ported into `src/app/`.
- **Role/Team/Type metadata** — still `_TBD_` in both `case-study.md` and the sketch's metadata strip; needs user input.
- **Live HTML prototype screens** — Phase 3, not started.
- **visuals/ + prototype/** — not created.

## Open questions

- _TBD_
