# Homelon Case Study — Style Guide Expansion + Screenshot Sizing Fix (amends Phase 1 + Phase 2)

## Scope

This amends two already-complete, already-approved deliverables:
- `homelon_case_study/case-study.md` (Phase 1 — content rewrite)
- `homelon_case_study/website_page/index.html` (Phase 2 — webpage sketch)

It is not a new numbered phase. Two independent fixes, bundled into one spec/plan
since both touch the same section of the same file:

1. **Content expansion** — Design Decisions currently describes the moodboard,
   palette, iconography, UI elements, imagery, logo, and typography in prose only
   (mostly folded into 3 dense subsections), with no images anywhere. Real source
   material for all of this already exists and was scoped out of Phase 1 for
   concision — this adds it back using only source material that already exists (no
   new design work, no invented content).
2. **Screenshot sizing fix** — `website_page/index.html`'s `.b-figure-frame` /
   `.b-figure-grid` CSS was inherited from SplitSmart's template, sized for
   SplitSmart's wide desktop-app screenshots. Homelon's screenshots are narrow
   portrait phone images (~390×844px). The frame/grid currently stretches each
   figure to fill a wide column (`.b-figure-grid` is a fixed 2-column `1fr 1fr`
   grid, `max-width` on figure containers up to 600px), leaving dead space around
   the narrower images. This fix changes only sizing/layout mechanics — frame width
   becomes intrinsic to the screenshot instead of stretched, and the grid becomes a
   wrapping row instead of a fixed 2-up grid. The existing chrome-dots frame styling
   (border, shadow, 3-dot bar) is kept as-is for visual consistency with the
   SplitSmart sibling page — only width/layout changes, not the frame's look.

## Source material

- **Text (Logo — new prose, sourced):** `legacy/homelon.html` lines 298-303: "The
  logo style features rounded and filled shapes. The first logo is exclusively used
  within the app, whereas the second and third options are designed for the website
  and tablet."
- **Text (Typography — no prose exists):** `legacy/homelon.html` lines 338-352
  (confirmed in Phase 1: heading + image only, no descriptive text). Include the
  image with a plain factual caption (e.g. "Typography reference.") — do not invent
  descriptive prose where the source has none.
- **Images (all already exist, currently unused in this project):**
  `legacy/images/homelon/wireframes.png`, `logo.png`, `typography_pic.png`,
  `moodboard.png`, `colors.png`, `icons.png`, `ui_elements.png`, `imagery_pic.png`.
- All other prose in Design Decisions (Watermelon palette; Rounded, consistent, real)
  is UNCHANGED from Phase 1's approved text — this expansion adds two new
  subsections and images, it does not rewrite existing wording.

## Structure change

**Nested inside the existing `## DESIGN DECISIONS` section — no new top-level
section, no TOC/navigation renumbering.** The section grows from 3 to 5
subsections, in this order:

1. **Wireframes to high-fidelity** (existing prose, unchanged) — add `wireframes.png`
   as a reference figure.
2. **Moodboard** (NEW) — tightened version of the legacy moodboard copy already
   partially present in "Watermelon palette" (do not duplicate the palette
   rationale — this subsection is the moodboard's role/composition, not a second
   description of the colors). Image: `moodboard.png`.
3. **Style guide** (NEW) — covers Logo (sourced prose above) and Typography
   (image + plain caption, no invented prose). Images: `logo.png`,
   `typography_pic.png`.
4. **Watermelon palette** (existing prose, unchanged) — add `colors.png` as a
   figure.
5. **Rounded, consistent, real** (existing prose, unchanged) — add `icons.png`,
   `ui_elements.png`, and `imagery_pic.png` as figures.

## File changes

- **`case-study.md`**: neither this file nor `splitsmart-case-study/case-study.md`
  contains any markdown image syntax anywhere (confirmed: zero `![` matches in
  both) — these files are text-only prose by established convention; images live
  only in the webpage sketch. So `case-study.md`'s edit is TEXT ONLY: insert
  "Moodboard" and "Style guide" subsections (no image links) between "Wireframes to
  high-fidelity" and "Watermelon palette". The existing subsections' prose does not
  change at all in `case-study.md` — only `website_page/index.html` gets images.
- **`website_page/index.html` — content additions**: within the existing
  `hb-decisions` section (no new `<section>`, no new TOC `<li>`), add `<h3>Moodboard</h3>`
  and `<h3>Style guide</h3>` (with two images: logo, typography) between the
  existing "Wireframes to high-fidelity" and "Watermelon palette" `<h3>`s, and add
  figures to "Watermelon palette" (`colors.png`) and "Rounded, consistent, real"
  (`icons.png`, `ui_elements.png`, `imagery_pic.png`).
- **`website_page/index.html` — screenshot sizing fix**: modify `#hb .b-figure-frame`
  and `#hb .b-figure-grid` CSS so frame width is intrinsic to the image (not
  stretched to fill a fixed-width column) and the grid wraps naturally (flex-wrap
  or `auto-fit` grid) instead of a rigid 2-column layout. Keep the chrome-dots bar,
  border, shadow, and border-radius exactly as they are today — only width/layout
  mechanics change. This CSS change applies uniformly to ALL figures already using
  `.b-figure-frame`/`.b-figure-grid` (the 12 existing screenshots in The Screens
  section, the Design Decisions dashboard figure, and the new Moodboard/Style
  guide/palette/icon figures) — one shared component change, not per-section
  overrides.
- **New visuals**: copy 8 source images from `legacy/images/homelon/` into
  `homelon_case_study/visuals/`, renamed for consistency with the existing 12 files
  there: `homelon-wireframes.png`, `homelon-moodboard.png`, `homelon-logo.png`,
  `homelon-typography.png`, `homelon-colors.png`, `homelon-icons.png`,
  `homelon-ui-elements.png`, `homelon-imagery.png`.

## Out of scope

- No new illustration assets (no phone-bezel SVGs, no device-mockup graphics) — the
  sizing fix is CSS-only, reusing the existing chrome-dots frame visual.
- No changes to The Screens, Gaps and Limitations, or Conclusion sections' content.
- No changes to the hero, metadata strip, footer, or any other part of the webpage
  sketch outside `hb-decisions` (content) and the shared `.b-figure-frame`/
  `.b-figure-grid` CSS (sizing fix, which mechanically affects other sections'
  rendering but not their content/markup).
- No Next.js port.
- No fix to the `homelon_case_study/README.md` "What's in here"/"Not built yet"
  staleness — that was already resolved in Phase 2's Task 6 fix round; not
  reopened here.

## Deliverable

Updated `case-study.md` (5-subsection Design Decisions), updated
`website_page/index.html` (same section expanded with 2 new subsections + images
on existing ones, plus the shared figure-frame/grid CSS resized for portrait
screenshots), 8 new files in `homelon_case_study/visuals/`.
