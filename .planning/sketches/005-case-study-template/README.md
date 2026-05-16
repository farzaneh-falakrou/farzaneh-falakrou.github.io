---
sketch: "005"
name: case-study-template
question: "What template should case study (project detail) pages use?"
winner: "E"
winner_note: "Synthesis of A (editorial voice) + B (TOC + metadata sidebars)"
tags: [case-study, project-page, template, content]
---

## Winner: Variant E — Editorial + Structured (synthesis)

**Locked structure (revised):**
- Editorial centered hero with display title + byline (from A)
- Full-width cover image
- **Horizontal metadata strip** below the cover — Role · Team · Duration · Stack · Industry · Year · Visit link. Scrolls away naturally; not sticky.
- Two-column body after the meta strip:
  - Left: sticky TOC tracking active section (from B)
  - Center: editorial article column (~720px) with drop cap, pull quotes, italic accents, figures with italic captions, stat table (from A)
- Section marks combine editorial label ("Context") with structural number ("Section 01")
- Footer with next case study card

**Explicit decisions:**
- No right sidebar
- Project metadata is visible at top, hidden once reading begins
- Only the TOC stays sticky (it's nav, not info)

This gives the magazine voice with the design-doc rigor — hiring managers get a TOC and metadata for fast scanning while readers get an essay to actually read.

---


# Sketch 005: Case Study Template

## Design Question
Case studies are the page that wins hires. The home is a trailer; this is the film. Four template approaches, each shown with a real-ish Moodle Redesign case study end-to-end.

## How to View
Open `.planning/sketches/005-case-study-template/index.html` in a browser.

## Variants

### A · Editorial Long-form
**Reference:** NYT Magazine, Frank Chimero, The Atlantic
- Narrow centered column (~720px)
- Drop cap, pull quotes (full-width breaks)
- Inline figures with italic captions
- Stats presented as typographic table with rules
- Hero feels like an article headline; reads like a feature

**Pros:** Strongest voice. Most distinctive. Signals deep thinking. Pairs beautifully with the Signature lineage.
**Cons:** Writing is the bottleneck — every case study needs to be written, not just designed. Not everyone reads long-form.
**Best when:** You want to be remembered for your thinking, not just your screens.

### B · Structured / Indexed
**Reference:** Karri Saarinen project pages, research papers, design docs
- Sticky left TOC tracks the section you're in (numbered 01–06)
- Right sidebar shows project metadata (Role, Team, Duration, Stack, Year, Visit link)
- Center column has numbered section headings (01. Context, 02. The Problem, etc.)
- Callout blocks for stakes/quotes

**Pros:** Easy to scan. Looks rigorous. Hiring managers can jump straight to outcome. Sells you as "thorough."
**Cons:** Reads as "design doc" — less personality than A. Two sidebars take real estate.
**Best when:** You're targeting strict, technical, design-systems-flavored teams.

### C · Visual-First Cinematic
**Reference:** Apple project pages, Stripe Press, design monographs, agency hero pages
- Full-bleed dark hero with the project name as big italic display
- Full-bleed images between section blocks
- Short text blocks with generous spacing
- Dark "Outcome" block with hero-sized stat numbers
- Almost no chrome — image-led

**Pros:** Most impressive at first scroll. Photographs/screens do the storytelling. Shows visual craft. Most "wow."
**Cons:** Demands real high-fidelity visual work for every case study. Weak for projects with abstract outcomes (research-led work).
**Best when:** Your work is highly visual and you have great screenshots/mockups for everything.

### D · Asymmetric Scroll-Driven
**Reference:** Modern product launch pages (Linear, Notion, Vercel), refined SaaS marketing
- Sticky compact header with prev/next nav
- Section labels float in the side margin (sticky as you scroll the section)
- Sections alternate left/right between label and content
- Dark "Outcome" callout block at the end
- Matches the home page voice from sketches 003B + 004D

**Pros:** Modern, scannable, structurally clear, consistent with the home asymmetric pattern. Matches Signature voice. Easy to mix text & visuals.
**Cons:** More moving parts to get right. Sticky labels need careful threshold tuning.
**Best when:** You want continuity with the home page's voice and pace.

## What to Look For
- **Voice match** — does this read like the same person who wrote the home page?
- **Maintainability** — can you produce 12 of these without burning out? (A demands writing; C demands visuals; B & D are more "template-able")
- **Hiring scan** — can a manager open this, spend 60 seconds, and walk away knowing your value?
- **Failure mode** — what does a *weak* case study look like in each template? (Pretty fonts but no thinking in A; impressive layout but thin content in B; bad screenshots in C; pacing issues in D)

## Open Questions for After This Sketch
1. Image-handling — when do we have hero images vs. inline screens?
2. Process artifacts — sketches, journey maps, research synthesis. Where do these go?
3. Process notes — separate "Notes" section/page for behind-the-scenes thinking?
4. Mobile case study reading — sidebar approaches need fallbacks
