# Homelon Case Study — Style Guide Expansion (amends Phase 1 + Phase 2)

## Scope

This amends two already-complete, already-approved deliverables:
- `homelon_case_study/case-study.md` (Phase 1 — content rewrite)
- `homelon_case_study/website_page/index.html` (Phase 2 — webpage sketch)

It is not a new numbered phase. It's a targeted content expansion: the Design Decisions
section currently describes the moodboard, palette, iconography, UI elements, and
imagery in prose only, with no images and no mention of the logo. Real source material
for all of this already exists and was scoped out of Phase 1 for concision — this
expansion adds it back in, using only source material that already exists (no new
design work, no invented content).

## Source material

- **Text (Logo only — the one genuinely new piece of prose):**
  `legacy/homelon.html` lines 298-303: "The logo style features rounded and filled
  shapes. The first logo is exclusively used within the app, whereas the second and
  third options are designed for the website and tablet."
- **Images (all already exist, currently unused in this project):**
  `legacy/images/homelon/wireframes.png`, `logo.png`, `moodboard.png`, `colors.png`,
  `icons.png`, `ui_elements.png`, `imagery_pic.png`.
- All other prose in Design Decisions is UNCHANGED from Phase 1's approved text — this
  expansion adds images and one new subsection (Logo), it does not rewrite existing
  wording.

## Structure change

**Nested inside the existing `## DESIGN DECISIONS` section — no new top-level section,
no TOC/navigation renumbering** (per user decision). The section grows from 3 to 4
subsections, in this order:

1. **Wireframes to high-fidelity** (existing prose, unchanged) — add `wireframes.png`
   as a reference figure.
2. **Logo** (NEW) — the sourced prose above, paired with `logo.png`.
3. **Watermelon palette** (existing prose, unchanged) — add `moodboard.png` and
   `colors.png` as two figures (or one figure-grid of both, implementer's call for
   the webpage sketch — `case-study.md` has no figure concept, it's markdown prose
   with image links).
4. **Rounded, consistent, real** (existing prose, unchanged) — add `icons.png`,
   `ui_elements.png`, and `imagery_pic.png` as three figures.

## File changes

- **`case-study.md`**: neither this file nor `splitsmart-case-study/case-study.md`
  contains any markdown image syntax anywhere (confirmed: zero `![` matches in both) —
  these files are text-only prose by established convention; images live only in the
  webpage sketch. So `case-study.md`'s edit is TEXT ONLY: insert the Logo subsection
  (new `###` heading + the sourced prose, no image link) between "Wireframes to
  high-fidelity" and "Watermelon palette". The 3 existing subsections' prose does not
  change at all in `case-study.md` — only `website_page/index.html` gets images.
- **`website_page/index.html`**: within the existing `hb-decisions` section (no new
  `<section>`, no new TOC `<li>`), add an `<h3>Logo</h3>` + paragraph + figure between
  the existing "Wireframes to high-fidelity" `<h3>` and "Watermelon palette" `<h3>`,
  and add figures to the other two existing `<h3>` subsections, using the same
  `.b-figure` / `.b-figure-frame` / `.b-figure-grid` CSS classes already defined in the
  page (no new CSS needed — these classes exist and are reused, not redefined).
- **New visuals**: copy the 7 source images from `legacy/images/homelon/` into
  `homelon_case_study/visuals/`, renamed for consistency with the existing 12 files
  there (e.g. `homelon-wireframes.png`, `homelon-logo.png`, `homelon-moodboard.png`,
  `homelon-colors.png`, `homelon-icons.png`, `homelon-ui-elements.png`,
  `homelon-imagery.png`).

## Out of scope

- Typography remains excluded (per Phase 1's established constraint — the source has
  no descriptive prose for it, only an image with no text; this expansion doesn't
  change that judgment call, only adds material that already had prose backing it).
- No changes to The Screens, Gaps and Limitations, or Conclusion sections.
- No changes to the hero, metadata strip, footer, or any other part of the webpage
  sketch outside the `hb-decisions` section.
- No new CSS classes — reuse `.b-figure`, `.b-figure-frame`, `.b-figure-grid` as they
  already exist in `website_page/index.html`.

## Deliverable

Updated `case-study.md` (4-subsection Design Decisions), updated
`website_page/index.html` (same section expanded, same TOC), 7 new files in
`homelon_case_study/visuals/`.
