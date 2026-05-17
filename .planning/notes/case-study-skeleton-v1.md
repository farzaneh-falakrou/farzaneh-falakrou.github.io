---
title: Case study skeleton v1 — reusable structure
date: 2026-05-17
type: note
status: draft
related:
  - .planning/notes/splitsmart-case-study-framing.md
  - .planning/sketches/005-case-study-template
---

# Case study skeleton v1 — reusable structure

A section-by-section structure extracted from the SplitSmart exploration. Intended to be reusable across future case studies. Pairs with the locked **Editorial + Structured** template from sketch 005 (centered hero + cover → horizontal metadata strip → 2-column body with sticky TOC).

## Design principles

1. **Conventional scaffolding, opinionated content.** Each section has a familiar label, but inside it leads with a point of view, not a recitation.
2. **Hero is a thesis, not a tagline.** Open with the strongest claim the project makes. Italicize the load-bearing word.
3. **Screens enter as evidence, not as lede.** Writing earns the right to show the design (Stripe Press / Linear move).
4. **Every section ladders to the thesis.** If a section can't, it doesn't belong.
5. **Honest forward-look is a feature, not a flaw.** End with what the design hasn't solved yet. Self-critique signals seniority.
6. **No invented metrics.** "40% friction reduction in user testing" with 8 participants is not defensible. Either cite real research or describe what the design argues without numbers.

## Section-by-section skeleton

Each section has: **purpose** (what it does for the reader) · **opens with** (the move) · **avoid** (the tired version).

### 00 · Hero (centered editorial, before metadata strip)

- **Purpose:** Plant the thesis in one sentence. Make the reader want to scroll.
- **Opens with:** A provocative, opinionated sentence in Instrument Serif. One italicized accent word. Then a single editorial paragraph (~50 words) expanding it. Then a cover image / screen.
- **Avoid:** "Meet [Product] — a modern way to..." Tagline-style openers. Generic "the problem with X is Y" framings.

### 01 · Metadata strip (scrolls away after hero)

- **Purpose:** Cheap legibility — what, when, role, scope, team.
- **Format:** Single horizontal row of: Project · Role · Year · Timeline · Type (concept / shipped / brief). No prose.
- **Avoid:** Padding this with deliverables, tools, or any narrative. It's a fact strip.

### 02 · Context & framing

- **Purpose:** Establish the world this design is responding to. Why this project, why now, what's the gap.
- **Opens with:** The competitive or domain landscape, sharply observed. *Not* "today, people are busy and need help with X." Show a verifiable observation: "Every [category] app on the market opens to the same screen — a [conventional choice]. This is the choice we refused to make."
- **Contains:** Competitive critique with evidence (screenshots, named products, specific UI choices). Domain context. Why the conventional answer is wrong.
- **Avoid:** Stat-dump openers. Persona archetypes ("Meet Sarah, 28, a product manager..."). Anything that could appear in any other case study.

### 03 · Research & insight

- **Purpose:** Show how the framing was earned. What did you observe, read, or test that justifies the thesis?
- **Opens with:** The single most useful insight you found, named. If you have a research anchor (e.g., a citable finding), this is where it lives.
- **Contains:** Methods (interviews, audits, lit review) only inasmuch as they support the insight — never as a checklist. Pull-quotes from user research are gold; meaningless quotes ("I wish it was easier") are not.
- **Avoid:** Listing every method you used. "We did interviews, surveys, card sorts, and empathy maps" tells the reader you're competent but not interesting.

### 04 · Strategy / IA / structural moves

- **Purpose:** Translate the insight into a design *position*. What's the structural bet?
- **Opens with:** The single structural decision that everything else flows from. (For SplitSmart: "We made the home view an action queue, not a ledger.")
- **Contains:** Hub-and-spoke / hierarchy decisions, what gets prominence, what gets hidden, why.
- **Avoid:** Long sitemap diagrams. IA documented as bureaucracy.

### 05 · Design execution (the screens)

- **Purpose:** Show the work. Each screen earns its space by proving a specific argument from the framing.
- **Opens with:** A subsection per screen or moment, each titled with what it argues — not what it is. ("The dashboard answers 'am I up or down?' in three seconds" — *not* "Dashboard.")
- **Contains:** Screenshots with callouts, copy excerpts, micro-interaction notes. Each callout should reference the thesis.
- **Avoid:** A gallery of screens with generic captions. "Here is the dashboard. Here is the groups page." Pure tour.

### 06 · Decisions & tradeoffs

- **Purpose:** Prove you can make choices. Show the road not taken.
- **Opens with:** The single most contested tradeoff. ("We could have shown every transaction on the home view. We chose three.")
- **Contains:** 2–4 concrete tradeoffs, each with: the choice, the rejected alternative, the reason.
- **Avoid:** Empty pseudo-tradeoffs ("we balanced usability with aesthetics"). Anything that wouldn't survive a hiring manager asking "why?"

### 07 · Iteration / what changed

- **Purpose:** Show that the design moved. Static perfection is suspicious; visible iteration is credible.
- **Opens with:** A specific change with a before/after — visual if possible.
- **Contains:** 1–3 named iterations. What you saw, what you changed, what improved.
- **Avoid:** Generic "we iterated based on feedback." Iterations that don't visibly change the artifact.

### 08 · Honest forward-look (this is the gift)

- **Purpose:** Self-critique. What hasn't this design solved? Where does it want to go?
- **Opens with:** "Where this design doesn't yet go far enough." (Or similar.) Direct, unapologetic.
- **Contains:** 2–4 gaps. Each: what's missing, why it matters, what the next version would do.
- **Why this works:** Hiring managers can spot a designer who can't critique their own work. This section is differentiating, not damaging.
- **Avoid:** Performative humility ("I've grown so much..."). Naming gaps as roadmap features ("next we'll add...").

### 09 · Reflection / what I learned (optional, short)

- **Purpose:** Voice. Personality. The case study has a designer behind it.
- **Opens with:** A single sentence, italicized, in Instrument Serif.
- **Contains:** 100–150 words max. What this project changed about how you think.
- **Avoid:** Generic life lessons. Anything that could appear in any other case study.

### 10 · Footer / next case study

- **Purpose:** Keep the reader in the portfolio. Surface the next piece of work.
- **Contains:** Single link to next case study, formatted like a hero teaser.

## Which sections are required vs optional

| # | Section | Required | Notes |
|---|---|---|---|
| 00 | Hero | Yes | Always |
| 01 | Metadata strip | Yes | Always |
| 02 | Context & framing | Yes | The thesis lives here |
| 03 | Research & insight | If applicable | Skip for craft-led projects without research |
| 04 | Strategy / IA | Yes | Even small projects have structural decisions |
| 05 | Design execution | Yes | The work itself |
| 06 | Decisions & tradeoffs | Yes | The differentiator |
| 07 | Iteration | If meaningful | Skip if no real iteration happened |
| 08 | Honest forward-look | Yes | The signature move |
| 09 | Reflection | Optional | Use sparingly — not every case study needs it |
| 10 | Footer | Yes | Always |

## Notes on voice

The portfolio's visual language is locked (sketch 002 — Signature direction, cream + Instrument Serif + orange). The case study writing should match: point-of-view-forward, italic emphasis as accent, conversational but precise. Avoid corporate-speak ("stakeholders," "synergies," "leverage"). Avoid bootcamp-speak ("user-centered design," "design thinking process"). Write like you're explaining the project to a smart friend who could go either way on it.

## When to revise this skeleton

Update this file after each case study is shipped. The skeleton is a hypothesis — confirm what worked, drop what didn't, add what was missing.
