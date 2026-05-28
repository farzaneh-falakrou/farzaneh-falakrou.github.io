# SplitSmart case study — working log

Running log of decisions, work, and open threads. Newest entries at the top of each section.
For current status/structure see `README.md`; this file is the *why* and the *history*.

---

## Decisions

- **2026-05-28 — Prototype HTML pages are the true design reference, not screenshots.**
  The pages linked from `prototype/index.html` are canonical; the PNG screenshots were mostly
  outdated. Kept only the 3 still-current hand sketches in `visuals/`.
- **2026-05-28 — One home: `splitsmart-case-study/` at repo root.** Consolidated everything
  scattered across `.planning/` and the external prototype into a single top-level folder so
  the case study can be discussed in one place.
- **2026-05-28 — `prototype/` is a dated snapshot, not a link.** Copied in so the hub is
  self-contained; accepted that it will drift from the live external repo (re-copy to re-sync).
- **2026-05-27 — `splitsmarter_2.pdf` is the canonical voice.** `case-study.md` mirrors it;
  the sketch HTML was rebuilt from it. Edit the writing only when necessary; don't rewrite.
- **2026-05-22 — Two-layer thesis** (shared expense management + personal budget intelligence),
  pivoted from the earlier "asking is expensive" framing.

## Done

- **2026-05-28** — Created the hub; moved the 3-variant sketch out of `.planning/sketches/008-…`
  (folder removed; MANIFEST row 008 notes the relocation); copied PDF + `case-study.md`;
  copied prototype pages + `assets/` + budget mockups into `prototype/`; pruned outdated PNGs;
  archived stale May-17 notes under `_archive/stale-notes/`.
- **2026-05-28** — Verified content sync: **PDF and `case-study.md` are identical** (9 sections,
  verbatim). The **sketch HTML carries the same 9 sections + all key facts** (£233, £700,
  usability numbers, both gaps) across all 3 variants, **plus a "Reflection" section and a
  next-case footer that the PDF/`.md` do not have**.

## Not done / deferred

- **Variant not picked** — sketch has A / B / C, `winner: null`. Needs a choice before Phase 3.
- **Settle Up before/after** — redesign would land harder with a paired before/after visual; not built.
- **Mobile TOC fallback** — sticky TOC in variants B/C has no mobile treatment decided yet.
- **Phase 3 (Next.js port)** — pending in `.planning/ROADMAP.md`, gated on Phase 1 landing + variant pick.

## Open questions

- Should the HTML's extra **"Reflection" section** be folded back into the canonical PDF/`.md`,
  or is it HTML-only scaffolding? (Currently a divergence between the writeup and the sketch.)
- Keep `prototype/` as a drifting snapshot, or switch to linking the external repo only?
- Which variant — **A (quiet editorial) / B (balanced) / C (bold cinematic)**?
