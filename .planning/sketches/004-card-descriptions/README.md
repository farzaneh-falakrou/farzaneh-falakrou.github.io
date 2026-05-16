---
sketch: "004"
name: card-descriptions
question: "How should short descriptions appear on selected-work cards?"
winner: "D"
tags: [cards, work-grid, descriptions, hover]
---

# Sketch 004: Card Description Treatments

## Design Question
The floating-dock home (sketch 003 B) was approved, but the project cards need short descriptions. Four treatments — same content, very different visual character.

## How to View
Open `.planning/sketches/004-card-descriptions/index.html` in a browser.

## Variants

### A · Inline (always visible)
Classic stack: preview → tag → name → description → meta row with arrow.
- **Pros:** Easy to scan, no hidden info, descriptions can be longer
- **Cons:** Cards get taller; more visual noise; less elegant at rest

### B · Hover Reveal
Clean at rest: just tag + name + year. Hover shrinks the preview and slides in the description below the title. Floating arrow button top-right.
- **Pros:** Less noise at rest; rewards engagement; feels crafted
- **Cons:** Mobile needs a different pattern (long-press? tap-to-flip?); first-scroll viewers miss the descriptions

### C · Editorial Caption
Description treated as a pull-quote — italic Instrument Serif with vertical orange rule on the left. Reads like a magazine teaser. "Read the case study →" link instead of an arrow icon.
- **Pros:** Strong voice; distinctive; pairs beautifully with the Signature visual language
- **Cons:** Description must be tight & well-written (writing tax); harder to draft 12 of these

### D · Asymmetric Split
Full-width row per project. Preview and body alternate left/right (zig-zag). More room for description, tags (chips), and a stat highlight ("−23% abandonment"). Body uses emphasized italic phrases inside the description.
- **Pros:** Cinematic; scales to many projects; room for nuance & metrics
- **Cons:** Slower to scan; only ~3 projects above the fold; more vertical scroll

## What to Look For
- Which voice/tone of description fits you?
- How much info do you want visible at rest vs. on engagement?
- Will you have stats/metrics for every project? (D leans on them)
- Can you write 12 italic-serif pull-quotes? (C demands it)
- Mobile behavior — A & C translate easily, B & D need extra design work
