# Homelon Case Study — Webpage Sketch (Phase 2 of 3)

## Scope

Phase 2 of the three-phase Homelon case-study project (see
`docs/superpowers/specs/2026-07-02-homelon-case-study-content-design.md` for the
full phase breakdown). Phase 1 (content rewrite of `case-study.md`) is complete.
This phase builds the case-study **webpage sketch** — a static HTML page, not a
Next.js integration. Phase 3 (live HTML/Tailwind prototype screens) is separate
and out of scope here.

## Precedent: SplitSmart's own Phase 2 is unfinished

SplitSmart's case-study webpage exists only as `splitsmart-case-study/website_page/index.html`
— three visual-register variants (A/B/C) built inside a shared locked template
(`.planning/sketches/005-case-study-template`, winner "E — Editorial + Structured"),
with `winner: null` in its own README. It was never picked or ported into the real
Next.js site (`src/app/` has no case-study route at all — the live site is still
`legacy/*.html`). Per user decision, Homelon mirrors this same unfinished-sketch
posture: **one variant, not ported to Next.js, same open-ended status as SplitSmart.**

## Variant

**Single variant only** — SplitSmart's "B · Balanced" register (per the user's
prior evaluation, called "the most defensible default for the portfolio" in
`splitsmart-case-study/website_page/README.md:63`). No A/C exploration, no
variant-switcher JS (SplitSmart's `index.html` has a 1/2/3 keypress switcher across
three `<section id="va/vb/vc">` blocks — this build has only one section, no switcher
needed).

Variant B's locked characteristics (from the SplitSmart README, adapted to Homelon):
- Typographic hero + restrained cover image inside a white browser-chrome frame
- Two-column body with **sticky TOC** on the left
- Horizontal metadata strip below the cover
- Screenshots framed in subtle white cards with three chrome dots (design-doc neat)
- Editorial pullquote between sections for tonal lift

## Template (locked, from Sketch 005 winner E)

- Editorial centered hero: display title "Homelon" + byline
- Full-width cover image
- Horizontal metadata strip (Role · Team · Duration · Stack · Industry · Year · Visit
  link — adapted to what Homelon's header actually has: **Role · Team · Timeline ·
  Type**, per `case-study.md`'s header line)
- Two-column body below the strip:
  - Left: sticky TOC tracking active section (numbered)
  - Center: ~720px editorial article column with drop cap, pull quotes, figures with
    italic captions
- Section marks combine an editorial label with a structural number (e.g. "Section 01")
- Footer with next-case-study card

## Sections (7, matching `case-study.md` — not SplitSmart's 5 or 9)

Mapped 1:1 from the Phase 1 content, in this order:

1. The Problem
2. Competitive Audit
3. User Stories & Flows
4. Design Decisions
5. The Screens
6. Gaps and Limitations
7. Conclusion

TOC entries match these 7 headings exactly.

## Visual identity — resolving the palette clash

The portfolio shell is cream + Instrument Serif + orange (per SplitSmart's variants).
Homelon's own palette is watermelon (Sea Turtle Green / Coral Red / Charcoal). Per
variant B's established resolution pattern (SplitSmart used "violet-soft" — a muted,
portfolio-compatible hint at the app's real palette, not full saturation): Homelon's
screenshots sit in clean white cards with subtle chrome, and any accent color pulled
from the palette (section rules, pull-quote marks) uses a muted "watermelon-soft"
tint rather than the app's saturated green/red. No dark device frames (that's
variant C's move, out of scope).

## Screenshots: curated set

Per user decision, curate rather than gallery-dump all 28 files in `screens/`. The
following ~12 are selected because the Phase 1 `case-study.md` text explicitly
references what they show (Section 5, "The Screens", plus one hero and one for
Design Decisions context):

| File | Used for |
|---|---|
| `Landing page_01.png` | Hero / cover image |
| `Onboarding_01.png` | Onboarding to search |
| `Search_01.png` | Onboarding to search |
| `Hamberger menu.png` | Onboarding to search |
| `Filter.png` | Onboarding to search |
| `Fvourites.png` | Favourite & Compare |
| `Compare_01.png` | Favourite & Compare |
| `Compare_02.png` | Favourite & Compare |
| `Info page.png` | Property Info & Contacts |
| `Send message.png` | Property Info & Contacts |
| `Confirmation.png` | Property Info & Contacts |
| `Dashboard.png` | Design Decisions (style-guide-in-context reference) |

This list is a starting point set at design time — the implementer may substitute a
visually cleaner file for the same purpose if inspection during the build reveals a
better fit (e.g. `Search_02.png` instead of `Search_01.png`), but must not add
screens outside what the text references.

## File structure

```
homelon_case_study/
├── visuals/                    ← NEW — curated screenshot copies (12 files above),
│                                  copied from screens/, renamed if needed for clarity
│                                  (matches splitsmart-case-study/visuals/ convention)
└── website_page/                ← NEW
    ├── index.html                ← the single-variant sketch page
    └── README.md                 ← sketch metadata (mirrors splitsmart's website_page/README.md
                                     frontmatter: sketch id, name, question, winner: null, tags)
```

Images are referenced from `website_page/index.html` as `../visuals/<file>.png`,
matching `splitsmart-case-study/website_page/index.html`'s exact path convention.

## Metadata strip caveat

`case-study.md`'s header currently has `**Role** _TBD_ · **Team** _TBD_ · **Timeline**
2023 · short design phase · **Type** _TBD_`. Three of four fields are unresolved. The
webpage sketch will render literal "TBD" text in the metadata strip until the user
fills these in — this is called out as a known gap, not blocking the sketch build
itself (SplitSmart's own sketch was built and iterated on before every field was final).

## Out of scope for Phase 2

- No Next.js integration (`src/app/` untouched).
- No A/C variant exploration.
- No new screenshots or design work beyond copying/curating existing `screens/` files.
- No changes to `case-study.md`, `legacy/homelon.html`, or Phase 1 deliverables.
- No resolution of the Role/Team/Type `_TBD_` fields (user's to fill in).

## Deliverable

`homelon_case_study/website_page/index.html` (single-variant sketch, locked template,
7 sections, curated screenshots) + `website_page/README.md` (sketch metadata, `winner: null`)
+ `homelon_case_study/visuals/` (12 curated screenshot copies) + updated
`homelon_case_study/README.md` / `LOG.md` reflecting Phase 2 status.
