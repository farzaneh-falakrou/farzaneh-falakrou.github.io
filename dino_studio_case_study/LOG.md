# Dino Studio case study — working log

Running log of decisions, work, and open threads. Newest entries at the top of each section.
For current status/structure see `README.md`; this file is the *why* and the *history*.

---

## Decisions

- **2026-07-07 — Trimmed transparent padding baked into the cover image.** The user-provided
  cover asset (laptop + phone on a transparent background, seen as black in previews) had ~716px
  of fully transparent padding above the devices and ~250px on the left — invisible in a raw
  file preview but rendering as a large empty gap between the hero text and the image on the
  live page. Scanned the alpha channel with `sharp` to find the actual content bounding box
  (top 716, bottom 4277, left 252, right 2609 of the 2880×4362 source) and cropped to that
  bounding box plus a small 24px margin, replacing `visuals/dino-cover.png` (now 2405×3609).
- **2026-07-07 — Fixed cover image overflow and double-framing; swapped in user-provided cover
  asset.** After the crop/quality fixes below, the cover image was overflowing the viewport at
  native pixel width (2880px) because the `<img>` had no sizing style — the original SplitSmart
  template relies on an inline `style="width:100%; height:auto"` on that specific tag, which had
  been dropped when the section was rebuilt. Added it back. Separately, user pointed out the
  `.b-cover-frame` browser-chrome wrapper (dots + white bar) was wrong for this image since it
  already depicts a laptop and phone device mockup — removed the wrapper so the image displays
  directly. User then supplied a replacement cover image directly (laptop + phone on a plain
  black background, no baked-in headline text) — saved as `visuals/dino-cover.png` (2880×4362),
  replacing the cropped `banner.png` version.
- **2026-07-07 — Replaced the data-viz gif with the original Vimeo embed.** User reported the
  data-viz figure still looked low quality after being sized down — checked the source file
  and `data_vis.gif` is genuinely only 361×253px, so no amount of resizing could improve it.
  The legacy page never actually displayed that gif to visitors: its Data Visualisation
  section embedded a live Vimeo video (`player.vimeo.com/video/959470985`) instead. Replaced
  the compact gif figure with a responsive 16:9 Vimeo iframe embed (new `.b-figure-video` CSS)
  and deleted `dino-data-vis.gif` from `visuals/` since it's no longer used.
- **2026-07-07 — Swapped substitute screenshots for the real legacy demo assets.** User
  pointed out the taxonomy, map, and data-viz figures were still wrong — I'd been using full-
  page static screenshots (`Dino*.png` from `screens/`) as stand-ins instead of the actual
  legacy GIFs that demonstrate those specific interactions. Copied `taxonomy_gif.gif`,
  `map_gif.gif`, and `data_vis.gif` from `legacy/images/dino_studio/` into `visuals/` as
  `dino-taxonomy.gif`, `dino-map.gif`, `dino-data-vis.gif`, and swapped them into both
  `case-study.md` and `website_page/index.html`. Deleted the now-unused static substitutes
  (`dino-charts.png`, `dino-map.png`, `dino-taxonomy.png`, `dino-detail.png`) from `visuals/`.
- **2026-07-07 — Restored content dropped from the legacy page.** User flagged that Technical
  Problems (taxonomy tree, map) had gone missing and asked for a full comparison against
  `legacy/dino_studio.html`. Found and restored: the real MoSCoW board content (read from
  `legacy/images/dino_studio/moscow.png` — Must/Should/Could/Won't, not the simplified MVP/
  Extras list I'd written from the HTML text alone), the six-sprint project plan, a dedicated
  "Technical problems" section (renamed from "Design decisions" to match the legacy heading
  and numbered 1/2 subsections), and the Retrospective's Challenges + Learnings content folded
  into the Conclusion (previously only Future Steps had been kept, as the two Gaps cards).
  Section order also now follows the legacy's chronological flow: strategy → IA (low-fi +
  Looker Studio data viz) → usability testing → technical problems → high-fidelity/result.
- **2026-07-07 — Accent reverted to match SplitSmart exactly.** Initially used a sage-green
  accent (`#6a9a3c`) to visually differentiate this case study. User corrected this — the
  color palette should follow SplitSmart's exactly (orange `#ff5a36` / `--accent-soft:
  #ffd8c8`), not a per-project palette. Reverted; the `#vb`/`#db` template's color tokens are
  now identical to SplitSmart's.
- **2026-07-07 — Content and page built.** Used the legacy `dino_studio.html` page as the
  source of truth for content, rewritten into the SplitSmart/Homelon voice and section
  structure (Problem → Competitive audit → Strategy → IA → Design decisions → Usability
  testing → Result → Gaps → Conclusion). Confirmed with user that SplitSmart's browser-frame
  `#vb` template (not Homelon's phone-mockup template) is the primary visual reference, since
  Dino Studio is a desktop web app.
- **2026-06-05 — Skeleton created.** Folder scaffolded to match the SplitSmart case-study
  structure (`README.md` + `case-study.md` + `LOG.md`). No content written yet; not being
  worked on at the moment.

## Done

- **2026-07-07** — Restored the MoSCoW board, sprint plan, and Technical Problems section;
  folded Challenges/Learnings into the Conclusion. Copied `moscow.png` from the legacy assets
  into `visuals/` as `dino-moscow.png`.
- **2026-07-07** — Wrote full `case-study.md` content. Built `website_page/index.html`. Copied
  7 screenshots from `screens/` into `visuals/` (cover, map, charts, taxonomy, detail, result,
  low-fi) for use as figures.
- **2026-06-05** — Created the hub skeleton. Screens already present in `screens/`.

## Not done / deferred

- **Portfolio wiring** — not yet linked into the main site nav/index; footer "next case study"
  currently points to Homelon as a placeholder.
- **Real screenshot cropping** — visuals are full-page captures copied as-is (no python/
  ImageMagick available in this environment to crop); acceptable since SplitSmart's own figures
  are also full, uncropped app screens.

## Open questions

- None currently open.
