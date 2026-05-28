---
sketch: "008"
name: splitsmart-case-study
question: "How should the SplitSmart case study read end-to-end inside the locked Editorial + Structured template?"
winner: null
tags: [case-study, splitsmart, full-page, integration, content]
related:
  - .planning/notes/case-study-skeleton-v1.md
  - .planning/sketches/005-case-study-template
---

# Sketch 008: SplitSmart Case Study

The first real case study built into the locked **Editorial + Structured** template from sketch 005. The output is intended to be ported into Next.js (after Phase 01 lands) as the SplitSmart case study page.

> **Content pivot — 2026-05-22.** This sketch originally argued an "asking is the expensive part" thesis — the social cost of chasing friends to settle up. The SplitSmart prototype has since pivoted toward personal budgeting, so all three variants were rebuilt around the current **two-layer thesis** below. Source content: the rewritten case study in the prototype folder (`expense_splitter/splitsmart-case-study-revised.md`). The earlier asking-thesis build is preserved as `index.backup-2026-05-22-before-budget-pivot.html`.

## The thesis (current)

**Every expense app tracks the group's money — SplitSmart tracks yours too.** Legacy splitters answer one question — *who owes whom* — and stop. SplitSmart is built as two layers over the same data: **Layer 1**, shared expense management, with the next action brought up next to the balance; **Layer 2**, personal budget intelligence — a dedicated Budget screen that measures your share of every group against your monthly cap and forecasts the month. One financial reality, seen from two angles: the group's and yours.

## Design Question

Within the locked template and the current two-layer thesis — what visual register does this case study live in? How loud is it? How does it handle the violet-palette screenshots of a fintech prototype sitting inside a cream + Instrument Serif + orange editorial page?

## How to View

Open `index.html` (in this folder) in a browser. Press `1`, `2`, `3` to switch variants.

## Structure

> **Note (2026-05-28):** the section list below describes the older five-section build. The
> canonical `splitsmarter_2.pdf` / `../case-study.md` now runs **nine** sections (Problem ·
> Competitive audit · Strategy · Information architecture · Design decisions · Usability
> testing · Settle Up redesign · Gaps and tradeoffs · Conclusion). Trust `case-study.md` for
> structure; the variant *visual* notes below are still accurate.

All three variants run the same five sections — **01 The problem · 02 The strategy · 03 Design execution · 04 Usability testing · 05 Gaps** — followed by a short closing reflection and a next-case footer.

## Variants

### A · Quiet editorial *(NYT Magazine / Frank Chimero)*

- Pure typographic hero — **no cover image**. The display headline carries the entire opening.
- Single-column 720px article, drop cap, full-width pullquote, hairline-ruled stat table.
- Screenshots are bare gradient placeholders with italic captions, no chrome.
- Gaps are inline blocks with a left-edge accent rule, set in body type.
- Footer is a typographic next-case teaser with hairline rules.

**Pros:** Strongest writerly voice. Lowest visual cost — produces well with imperfect screenshots. Hardest to imitate.
**Cons:** No cover image means weaker scroll-stop appeal on first impression. Reading-heavy; less rewarding for skimmers.
**Best when:** The thesis can carry the page on language alone.

### B · Balanced *(Karri Saarinen × editorial accent)*

- Typographic hero + restrained cover image inside a white browser-chrome frame.
- Two-column body with **sticky TOC** on the left.
- Horizontal metadata strip below the cover that scrolls naturally away.
- Screenshots framed in subtle white cards with three chrome dots — clean, design-doc neat.
- Gaps as a **two-column card row** of framed cards.
- Editorial pullquote between sections for tonal lift.

**Pros:** Reads as both readable and scannable. TOC + metadata strip give hiring managers cheap legibility without sacrificing voice. Most defensible default for the portfolio.
**Cons:** Less distinctive at first glance. The middle path always pays a small "I've seen this" tax.
**Best when:** You're targeting strict, design-systems-flavored teams alongside editorial readers.

### C · Bold cinematic *(Stripe Press × Linear changelog)*

- Hero is **typographic display on a dark full-bleed cover** — orange + violet radial glows hint at the prototype palette.
- Cover image floats half out of the dark hero, in a dark device frame.
- Sticky two-column TOC + article.
- Screenshots are in **dark device frames** with floating callout cards pointing at specific UI elements ("Layer 2 — shared spending, translated into a personal financial picture").
- Gaps are a **dark cinematic callout block** — black surface, white display type, orange accents — full-width within the article column.
- Footer is dark with radial glow, big italic next-case title.

**Pros:** Highest scroll-stop appeal. Visually distinctive. Cinematic transitions between light and dark are the case study's spine.
**Cons:** Most ambitious to maintain — every screenshot needs to look good in a dark frame. Risks looking like Stripe Press without earning the Stripe content. Demands tight craft on every visual asset.
**Best when:** You want the case study to be the loudest thing in the portfolio and your screenshots are strong.

## What to Look For

When comparing the three variants:

1. **Voice match** — Which one sounds most like the home page from sketch 006? The whole portfolio is one piece.
2. **Hero earn-the-scroll** — Open each and look only at the top fold. Which one makes you want to read the second screen?
3. **Screenshot dissonance** — The SplitSmart prototype is violet. The portfolio is cream + orange. Which variant resolves this collision best?
4. **Gaps section reading** — Section 05 (the two gaps). Which treatment reads as confident self-critique, not apology?
5. **Maintainability** — Imagine producing case studies 02, 03, 04 in this template. Which one scales without burning out the designer?
6. **Failure mode** — What does a weak case study look like in each? (A: weak prose; B: thin content; C: bad screenshots.)

## Open Questions for After This Sketch

1. **Mobile reading** — The TOC is sticky in B and C. What's the mobile fallback? (Listed as open question in sketch 005; still open.)
2. **Process artifacts** — When real Miro boards / journey maps / interview snippets exist, where do they go? Side margins? Dedicated "Process" section? Separate notes page?
3. **Iteration before/after visualization** — Section 04's "The redesign — Settle Up" would land harder with a real before/after pair of the Settle Up screen. Need to decide on visual treatment.
4. **Footer next-case behavior** — Static next-up? Random? Sequence based on canonical case-study order?

## Notes on Content

All three variants share **identical body content** so they are directly comparable. The differences are purely visual register:
- Hero treatment (typographic only vs + cover vs + dark cover)
- Cover image presence and framing
- Screenshot treatment (bare vs subtle frame vs dark frame)
- Gaps treatment (inline accent vs cream cards vs dark block)
- Pullquote scale (44px vs 36px vs 64px)
- Reflection treatment
- Footer treatment (rules vs split vs dark hero)

The content comes from the rewritten case study in the SplitSmart prototype folder (`expense_splitter/splitsmart-case-study-revised.md`). It rests on the competitive audit and the designer's own five-participant usability test — there are no external academic citations. The numbers describe what the design argues; each variant carries a closing disclaimer saying so.

## Visual Identity Dissonance — How Each Variant Handles It

The SplitSmart prototype is violet `#5A2DF0` with cyan/mint/coral on navy. The portfolio is cream + Instrument Serif + orange. The screenshots will visually clash with the page no matter what.

- **A** ignores the clash entirely — soft cream placeholders, italic captions. The screenshots are evidence, not décor.
- **B** uses muted "violet-soft" placeholders (lavender-tinted cream) — a polite hint at the prototype's palette without committing.
- **C** uses the actual violet gradient — the clash is the point. The dark frames and orange glows act as a chromatic bridge.

This is a real decision; pick deliberately.
