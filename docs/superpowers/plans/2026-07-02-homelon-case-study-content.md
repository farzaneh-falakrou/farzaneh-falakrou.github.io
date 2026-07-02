# Homelon Case Study — Content Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `_TBD_` skeleton in `homelon_case_study/case-study.md` with a rewritten, concise, redundancy-free case study, following the design in `docs/superpowers/specs/2026-07-02-homelon-case-study-content-design.md`.

**Architecture:** This is a content-writing task, not code — there are no automated tests. Each task drafts one section of `case-study.md` directly from `legacy/homelon.html` (sole text source) and `homelon_case_study/screens/` (visual source), in SplitSmart's prose style (concise, bolded key phrases, thesis-driven, `##`/`###` heading structure, `---` section dividers). "Testing" for each task is a fact-check against the source material plus a redundancy/concision read-through, done by the task's implementer before committing.

**Tech Stack:** Markdown only.

## Global Constraints

- **Sole text source:** `legacy/homelon.html`. No other doc/PDF exists — do not invent facts, numbers, or quotes not present there.
- **Visual source:** `homelon_case_study/screens/*.png` — use file names as evidence of what screens exist; do not describe screen content not inferable from the file name / existing legacy copy.
- **Voice:** preserve the user's own word choices and tone where possible; edit only for clarity, concision, and removing redundancy. Do not rewrite wholesale or invent new claims.
- **Format:** mirror `splitsmart-case-study/case-study.md` exactly — `## CASE STUDY · HOMELON · 2026` title block, `**Role** · **Team** · **Timeline** · **Type**` metadata line, `##` section headings, `---` dividers between sections, `###` subheadings only where a section has multiple named parts.
- **No placeholders:** every section must contain final prose, not `_TBD_`, when the task is done.
- **Out of scope:** no HTML/webpage changes, no new screenshots, no changes to `legacy/homelon.html`. Only `homelon_case_study/case-study.md`, `README.md`, `LOG.md` are touched.

---

## Task 1: Metadata line + Problem section

**Files:**
- Modify: `homelon_case_study/case-study.md` (replace lines 1–15, the title block through `## THE PROBLEM`)

**Interfaces:**
- Produces: the title block and metadata line format that every later task's section sits below. Format: `## CASE STUDY · HOMELON · 2026` / `# Homelon` / `**Role** _X_ · **Team** _X_ · **Timeline** _X_ · **Type** _X_`.

**Source material (from `legacy/homelon.html`):**
- Problem Statement card (lines 66–74): "Navigating today's real estate apps can be a challenge, due to a complex user experience, information overload, and navigational hurdles. This struggle is especially felt by new buyers who find it difficult to sift through numerous listings efficiently. The lack of clarity in the app interface, combined with the overwhelming volume of information, creates a suboptimal user experience. This limits users' ability to quickly and seamlessly identify listings that match their preferences."
- Solution card (lines 101–108): "Assisting new property buyers in making informed decisions to enhance their financial stability. My core objective is to tackle the inherent complexities found in traditional real estate apps. I strive to simplify the user experience by refining information presentation and improving overall navigational ease. My emphasis is on delivering a user-friendly interface, carefully crafted to cater to the specific needs of new buyers."
- Retrospective "Challenges" card (lines 573–581) for role/timeline context: "The duration of the project was short, requiring me to focus primarily on the UI aspect of the real estate app. Despite being given the user research, I conducted additional research for competitor info and user flow..."

- [ ] **Step 1: Write the title block and metadata line**

Role/Team/Type are not stated anywhere in the legacy page. Use `_TBD_` ONLY for fields with no source evidence, and flag them to the user in the task's commit message body — do not guess. Timeline: legacy page footer says "© Farzaneh Falakrou 2023" and the retrospective calls it a short project — write **Timeline** as `2023 · short design phase` (both facts are sourced: copyright year + "duration... was short").

```markdown
## CASE STUDY · HOMELON · 2026

# Homelon

**Role** _TBD_ · **Team** _TBD_ · **Timeline** 2023 · short design phase · **Type** _TBD_

---
```

- [ ] **Step 2: Draft the thesis + Problem section**

Open with the thesis line from the design doc, then compress the Problem Statement + Solution cards into one concise section — remove the repetition between the two cards (both restate "complexity" and "information overload"; the Solution card only adds "informed decisions" and "financial stability" as new information).

```markdown
## THE PROBLEM

Real estate listings drown new buyers in information — Homelon cuts through it with a comparison-first search flow.

Today's real estate apps overwhelm new buyers with dense listings and unclear navigation, making it hard to sift through options efficiently. Homelon's goal is to help first-time buyers make informed, financially confident decisions by simplifying how listings are presented and compared.

---
```

- [ ] **Step 3: Fact-check against source**

Re-read `legacy/homelon.html` lines 60–114 and confirm every claim in Step 2's output traces back to those lines. Confirm no new facts were introduced (e.g. don't claim a specific number of users or a testing result — none exists in the source).

- [ ] **Step 4: Commit**

```bash
git add homelon_case_study/case-study.md
git commit -m "docs(homelon-case-study): title block + Problem section"
```

---

## Task 2: Competitive Audit section

**Files:**
- Modify: `homelon_case_study/case-study.md` (replace the `## COMPETITIVE AUDIT` section)

**Interfaces:**
- Consumes: section divider format (`---`) established in Task 1.
- Produces: none consumed by later tasks — sections are independent prose blocks.

**Source material (from `legacy/homelon.html` lines 134–140):**
"The project brief (user research) had been given, but I observed a gap regarding competitive analysis. To gain a deeper insight into market needs and inform the design of the user flow, I conducted a competitive analysis. I examined three apps—Trulia, ImmoScout, and Zoopla. Through this analysis, I identified the essential functions required for the real estate app."

- [ ] **Step 1: Draft the section**

Tighten to remove the redundant "conducted a competitive analysis... I examined three apps" restatement, and lead with the gap she identified (matches SplitSmart's audit framing: gap-first, then what she did about it).

```markdown
## COMPETITIVE AUDIT

The user research brief covered user needs but skipped competitive analysis. I audited three apps — Trulia, ImmoScout, and Zoopla — to understand market conventions and identify the essential functions a real estate app needs before designing the user flow.

---
```

- [ ] **Step 2: Fact-check against source**

Confirm the three app names and the "gap in the brief" framing match lines 134–140 exactly. Do not add findings the legacy page doesn't state (it doesn't list what the audit found beyond "essential functions" — don't invent specifics).

- [ ] **Step 3: Commit**

```bash
git add homelon_case_study/case-study.md
git commit -m "docs(homelon-case-study): Competitive Audit section"
```

---

## Task 3: User Stories & Flows section

**Files:**
- Modify: `homelon_case_study/case-study.md` (replace the `## USER STORIES & FLOWS` section, new section not in the SplitSmart template)

**Interfaces:**
- Consumes: `---` divider format from Task 1.

**Source material:**
- User Stories intro (lines 160–163): "I received various user stories, but I chose to focus on the ones that I deemed more crucial for the real estate app, drawing insights from competitors in the process."
- User Flows intro (lines 204–209): "After learning about what users need and studying the competition, the main features for the app became clear. Using this understanding, I created user flows to map out the steps users need to take to reach their goals. To make it easier to spot the key features of the app, I've used a light green color to highlight them."

- [ ] **Step 1: Draft the section**

Merge the two intros — both describe the same "competitive audit → prioritization → mapping" chain, so keep it as one flow instead of two restatements.

```markdown
## USER STORIES & FLOWS

From the user stories I was given, I prioritized the ones most critical to the real estate use case, using the competitive audit to judge relevance. I then mapped those stories into user flows — the steps a buyer takes to reach each goal — highlighting the key features in light green to make them easy to spot.

---
```

- [ ] **Step 2: Fact-check against source**

Confirm "prioritized based on competitive audit" and "light green highlight for key features" both trace to lines 160–209. Don't name which specific stories were prioritized — the source doesn't list them.

- [ ] **Step 3: Commit**

```bash
git add homelon_case_study/case-study.md
git commit -m "docs(homelon-case-study): User Stories & Flows section"
```

---

## Task 4: Design Decisions section (wireframes + style guide)

**Files:**
- Modify: `homelon_case_study/case-study.md` (replace the `## DESIGN DECISIONS` section, with `###` subsections)

**Interfaces:**
- Consumes: `###` subheading pattern established by SplitSmart's Design Decisions section (see `splitsmart-case-study/case-study.md:57-71` for the exact heading style to match — short subheading, one short paragraph, no bullet lists).

**Source material:**
- Wireframes (lines 236–241): "Based on the user flow, I created low-fidelity wireframes to illustrate the fundamental functionality of the app. Then, I progressed to mid-fidelity wireframes to assess the effectiveness of layout, visual hierarchy, and spacing. Following this, I dedicated time to defining the style guide and completing the high-fidelity wireframes."
- Mood board (lines 262–269): watermelon palette — Watermelon Red (energy, ambition, financial growth), Sea Turtle Green (nature, growth, stability), Charcoal (professionalism, sophistication).
- Colors (lines 321–327): Sea Turtle Green + Coral Red balance "stability and excitement" for a real estate app.
- Typography (lines 338–352): no descriptive text in source beyond section heading — skip prose, image-only in original.
- Iconography (lines 362–365): "The icon style features rounded corners to align perfectly with the overall style of the app. The location icon is inspired by the chosen color palette of the watermelon theme."
- UI Elements (lines 385–387): "The UI elements have rounded corners to align perfectly with the overall style of the app."
- Imagery (lines 406–413): watermelon-palette photography, natural daylight, avoiding overly polished studio shots, for "trust and comfort."

- [ ] **Step 1: Draft "Wireframes to high-fidelity" subsection**

```markdown
## DESIGN DECISIONS

### Wireframes to high-fidelity

Low-fidelity wireframes established core functionality first. Mid-fidelity passes tested layout, visual hierarchy, and spacing before I locked the style guide and moved to high-fidelity screens.
```

- [ ] **Step 2: Draft "Watermelon palette" subsection**

Merge the Mood Board and Colors sections — both describe the same three colors and their meaning; the Colors section only adds the "why these two together" reasoning, so fold it in rather than repeating the color list twice.

```markdown

### Watermelon palette

The palette pairs Sea Turtle Green — nature, stability — with Coral/Watermelon Red — energy, ambition — balanced by Charcoal for professionalism. Together, green and red strike a deliberate balance between **stability and excitement**: reassuring enough for a financial decision, energetic enough to feel like progress toward a goal.
```

- [ ] **Step 3: Draft "Rounded, consistent, real" subsection**

Merge Iconography, UI Elements, and Imagery — all three make the same underlying point (rounded corners for consistency; realistic, natural-light photography for trust) so state it once instead of three times.

```markdown

### Rounded, consistent, real

Icons and UI elements share one rounded-corner language across the app, with the location icon pulling directly from the watermelon palette. Photography avoids polished studio shots in favor of natural daylight and real settings — landscapes, plants — to keep the app feeling **trustworthy and approachable** rather than staged.

---
```

- [ ] **Step 4: Fact-check against source**

Confirm every trait (rounded corners, natural daylight, watermelon palette, "stability and excitement") traces to the cited line ranges. Confirm Typography is intentionally omitted (source has no descriptive text for it, only an image).

- [ ] **Step 5: Commit**

```bash
git add homelon_case_study/case-study.md
git commit -m "docs(homelon-case-study): Design Decisions section"
```

---

## Task 5: The Screens section

**Files:**
- Modify: `homelon_case_study/case-study.md` (replace the `## THE SCREENS` section, with `###` subsections)

**Interfaces:**
- Consumes: `###` subheading pattern from Task 4.

**Source material (legacy text):**
- Search (lines 442–447): "On the initial screen, users can view both listings and a map. Subsequently, they have the option to search either by scrolling through listings using a swipe-up gesture or by choosing to search on the map by tapping the map button."
- Favourite & Compare (lines 477–484): "On the favorite listing screen, users can not only view their saved properties but also compare them. By selecting two desired properties, users can view the comparison on the next screen. The primary objective is to simplify decision-making for the user. By comparing two favorite properties, users can assess factors such as size, price, facilities, energy usage, and more."
- Property Info & Contacts (lines 503–507): "The property details screen provides all essential information, both visually and in writing, that users need to make an informed decision and take action by contacting an agent."

**Source material (screens/ folder — not in legacy page, per design doc scope):**
- `screens/Onboarding_01.png` through `Onboarding_04.png`, `ONBoarding_Animation.png` — onboarding flow, filenames only, no legacy copy describing steps.
- `screens/Hamberger menu.png` — nav menu.
- `screens/Filter.png` — listing filter.
- `screens/Send message.png`, `Send message-1.png` — contact/messaging.
- `screens/Confirmation.png` — a confirmation step (likely post-message or post-save, filename only).

Per the design doc, these extra screens are referenced narratively — but the plan's Global Constraint says not to describe screen content beyond what's inferable from the file name or existing legacy copy. So: name these screens as part of the flow, tied to the legacy copy they support (onboarding leads into search; hamburger menu and filter support search; send message and confirmation extend Property Info & Contacts) — do not invent UI details for them.

- [ ] **Step 1: Draft "Onboarding to search" subsection**

```markdown
## THE SCREENS

### Onboarding to search

A short onboarding flow introduces the app before dropping the buyer into search. From there, users see both listings and a map on the same screen — scrolling listings with a swipe-up gesture, or tapping into the map to search visually. A hamburger menu and filter controls sit alongside search so buyers can narrow results without leaving the flow.
```

- [ ] **Step 2: Draft "Favourite & Compare" subsection**

```markdown

### Favourite & Compare

Saved listings aren't just a bookmark list — selecting two properties opens a side-by-side comparison across size, price, facilities, and energy usage. This is the app's core decision-making tool: instead of holding two listings in memory while scrolling back and forth, the buyer sees them side by side.
```

- [ ] **Step 3: Draft "Property Info & Contacts" subsection**

```markdown

### Property Info & Contacts

The property detail screen surfaces everything — visual and written — a buyer needs to decide and act, with a direct path to contacting an agent and a confirmation once that message is sent.

---
```

- [ ] **Step 4: Fact-check against source**

Confirm Search, Favourite & Compare, and Property Info claims trace to their cited legacy line ranges. Confirm onboarding/hamburger/filter/send-message/confirmation mentions stay at the level of "this screen exists and supports this flow" — no invented interaction details beyond file names.

- [ ] **Step 5: Commit**

```bash
git add homelon_case_study/case-study.md
git commit -m "docs(homelon-case-study): The Screens section"
```

---

## Task 6: Gaps & Limitations section

**Files:**
- Modify: `homelon_case_study/case-study.md` (replace the `## GAPS AND LIMITATIONS` section, with `###` subsections matching SplitSmart's `### Gap 1 — ...` / `### Gap 2 — ...` pattern)

**Interfaces:**
- Consumes: `### Gap N — Title` heading pattern from `splitsmart-case-study/case-study.md:108,112`.

**Source material:**
- Challenges card (lines 573–581): "The duration of the project was short, requiring me to focus primarily on the UI aspect of the real estate app. Despite being given the user research, I conducted additional research for competitor info and user flow, vital for a thorough understanding of requirements and refining the UI to meet project needs."
- Future Steps card (lines 606–611): "I will conduct usability testing with individuals who have varying abilities and disabilities... Additionally, I plan to design icons that align with the watermelon theme, similar to what I implemented for the location icon, to emphasize the branding of the app."

- [ ] **Step 1: Draft the section**

Frame the short timeline and missing usability testing as honest gaps (matches design doc Section 6), sourced from the Challenges and Future Steps cards rather than inventing new caveats.

```markdown
## GAPS AND LIMITATIONS

### Gap 1 — No usability testing

The short project timeline meant focus stayed on UI design; no usability testing was conducted. Testing with users of varying abilities and disabilities — including accessibility-focused testing — remains the clearest next step before this design could be validated with real buyers.

### Gap 2 — Research handed off without competitive context

The user research brief covered user needs but not the competitive landscape, so the competitive audit and user-flow prioritization were self-directed rather than part of the original research scope. This filled the gap for this project, but a fuller research phase would strengthen future iterations.

---
```

- [ ] **Step 2: Fact-check against source**

Confirm both gaps trace to the Challenges/Future Steps cards (lines 573–611) and don't overstate — e.g. don't claim testing is scheduled, only that it's identified as a next step (matches "I will conduct" as future intent, not completed work).

- [ ] **Step 3: Commit**

```bash
git add homelon_case_study/case-study.md
git commit -m "docs(homelon-case-study): Gaps and Limitations section"
```

---

## Task 7: Conclusion section

**Files:**
- Modify: `homelon_case_study/case-study.md` (replace the `## CONCLUSION` section — this is the final section, no trailing `---`)

**Interfaces:**
- Consumes: thesis line from Task 1, to close the loop the way SplitSmart's conclusion echoes its own thesis (`splitsmart-case-study/case-study.md:118-121`).

**Source material:**
- Learnings card (lines 590–595): "Given the tight deadline, I prioritized crucial aspects of the app development process, placing particular emphasis on efficient task management. I created a cohesive moodboard, consolidating ideas for a unified project foundation. This holistic approach facilitated strategic planning, ensuring a consistent design language across all UI elements."
- Future Steps card (lines 606–611): usability testing with varying abilities; icon designs extending the watermelon theme.

- [ ] **Step 1: Draft the section**

Close by echoing the thesis (comparison-first search cutting through information overload), fold in the Learnings card's point about strategic planning under a tight deadline, and end forward-looking with the Future Steps priorities — without repeating Gap 1/Gap 2 verbatim.

```markdown
## CONCLUSION

Homelon simplifies real estate search by putting comparison at the center of the decision, not buried behind separate listing pages. Working under a tight deadline meant prioritizing ruthlessly — a single cohesive moodboard early on kept the design language consistent across every screen without requiring extra iteration later.

The clearest next steps are usability testing across a range of abilities, and extending the watermelon-themed iconography started with the location pin across the rest of the icon set.
```

- [ ] **Step 2: Fact-check against source**

Confirm no new claims beyond Learnings + Future Steps cards, and confirm the thesis echo doesn't restate Task 1's Problem section verbatim (should reference it, not repeat it).

- [ ] **Step 3: Read the full file top to bottom for redundancy**

Read the complete `homelon_case_study/case-study.md` after all 7 tasks. Check specifically for: repeated phrases across sections (e.g. "information overload" or "rounded corners" appearing more than the two intentional call-backs — Problem section + Conclusion echo), and any leftover `_TBD_` markers other than the ones intentionally flagged in Task 1 Step 1.

- [ ] **Step 4: Commit**

```bash
git add homelon_case_study/case-study.md
git commit -m "docs(homelon-case-study): Conclusion section, complete rewrite"
```

---

## Task 8: Update README.md and LOG.md status

**Files:**
- Modify: `homelon_case_study/README.md`
- Modify: `homelon_case_study/LOG.md`

**Interfaces:**
- Consumes: final thesis line and section list from Tasks 1–7, to fill the "Status at a glance" table the same way `splitsmart-case-study/README.md:15-23` does.

- [ ] **Step 1: Update README.md status table**

Replace the current skeleton-status content (`homelon_case_study/README.md` lines 14–27) with completed-Phase-1 status, matching SplitSmart's README format.

```markdown
## Status at a glance

| | |
|---|---|
| **Thesis** | Real estate listings drown new buyers in information — Homelon cuts through it with a comparison-first search flow. |
| **Canonical voice** | `case-study.md` — rewritten 2026-07-02 from `legacy/homelon.html` (sole text source) |
| **Sketch** | none yet — no `website_page/index.html` (Phase 2, not started) |
| **Open decisions** | Role/Team/Type metadata fields unconfirmed (see `case-study.md` header) |
| **Next build step** | Phase 2 — design and build the case-study webpage (own brainstorm/spec cycle) |

### The thesis

> Real estate listings drown new buyers in information — Homelon cuts through it with a comparison-first search flow.

- **Phase 1 (done)** — content rewrite, this file's sibling `case-study.md`.
- **Phase 2 (next)** — case-study webpage build.
- **Phase 3 (after)** — rebuild key screens (search, favourites/compare, property info, onboarding, etc.) as live HTML/Tailwind prototype pages, replacing static screenshots as the design reference.
```

- [ ] **Step 2: Update the "Notes" section of README.md**

Replace `homelon_case_study/README.md` lines 46–50 (the "skeleton only" note) since content is no longer a skeleton.

```markdown
## Notes

- Content sourced entirely from `legacy/homelon.html` (only text source; no separate PDF/deck exists). Extra screens in `screens/` beyond what the legacy page displayed (onboarding, hamburger menu, filter, send message, confirmation) are referenced narratively in `case-study.md`.
- When writing, preserve the user's own voice (see memory `feedback_preserve_user_voice`); edit only when necessary.
```

- [ ] **Step 3: Add a LOG.md entry**

Append to `homelon_case_study/LOG.md` under each existing subsection (Decisions, Done, Not done / deferred), don't replace prior entries — this file is a running history.

```markdown

- **2026-07-02 — Phase 1 content rewrite complete.** `case-study.md` rewritten from
  `legacy/homelon.html` (sole text source) plus the fuller `screens/` set, in SplitSmart's
  prose style but with a Homelon-native 7-section structure (not forced into SplitSmart's
  9 sections — see design doc `docs/superpowers/specs/2026-07-02-homelon-case-study-content-design.md`).
  Role/Team/Type metadata left as `_TBD_` — no source evidence for these fields.
```

Add this line under **Done**, and add a matching line under **Not done / deferred**:

```markdown
- **Role/Team/Type metadata** — no source states these; needs user input before Phase 2.
- **website_page/** — Phase 2, not started.
- **Live HTML prototype screens** — Phase 3, not started.
```

Remove the now-stale "All content" and "website_page/" bullets under **Not done / deferred** that predate this rewrite (the ones added 2026-06-05), replacing them with the updated bullets above.

- [ ] **Step 4: Commit**

```bash
git add homelon_case_study/README.md homelon_case_study/LOG.md
git commit -m "docs(homelon-case-study): update README/LOG for Phase 1 completion"
```

---

## Final Verification

- [ ] **Step 1: Confirm no `_TBD_` remains except the flagged metadata fields**

Read `homelon_case_study/case-study.md` in full. The only `_TBD_` markers should be `**Role** _TBD_` and `**Type** _TBD_` in the header (per Task 1 Step 1) — every section body must be complete prose.

- [ ] **Step 2: Confirm structure matches the design doc's 7 sections**

Check headings present, in order: `THE PROBLEM`, `COMPETITIVE AUDIT`, `USER STORIES & FLOWS`, `DESIGN DECISIONS`, `THE SCREENS`, `GAPS AND LIMITATIONS`, `CONCLUSION`.

- [ ] **Step 3: Report the two unresolved metadata fields to the user**

At the end of this plan's execution, tell the user: Role and Type in the case-study header are marked `_TBD_` because the legacy page never stated them — ask the user to fill these in directly, since no source material answers them.
