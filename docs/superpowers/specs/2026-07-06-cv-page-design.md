## CASE · CV PAGE · 2026-07-06

# CV page

A single self-contained HTML page presenting Farzaneh's CV, built with the same
design system already established in the case-study pages (Instrument Serif +
Inter, shared CSS custom properties, `--accent: #ff5a36`), rather than copying
the bold/graphic reference style directly.

---

## Source content

Extracted from `Farzaneh_Falakrou_CV_April 2026.docx`, trimmed for density (see
"Content trims" below). This is the copy the page will render — no placeholders.

**Header**
- Name: Farzaneh Falakrou
- Title: UX/UI Designer
- Contact: Berlin, Germany · +49 1627140752 · farzaneh.falakrou@gmail.com · linkedin.com/in/farzaneh-falakrou · farzaneh-falakrou.github.io
- Photo: `C:\Users\farza\Desktop\Data\job_apply\picture profile\pic profile edit3.jpg`

**Summary**
> UX/UI Designer with a background in architecture, specializing in user research, prototyping, and usability testing to build intuitive web and mobile products.

**Skills**
UX Design · UI Design · User Research · Design Systems · Wireframing & Prototyping · Usability Testing & A/B Testing · Agile & SCRUM

**Tools**
Figma · Adobe Creative Suite · HTML5 & CSS · AI/Generative Design · Miro

**Languages**
English (C2) · German (B2) · Italian (B1)

**Work experience**

1. **Freelance Product Designer** — Berlin · Dec 2023–Present
   - Designed a data-rich dashboard for an expense-tracking app, grounded in user research and usability testing.
   - Redesigned the Yachtitude website, improving navigation and visual hierarchy and increasing customer engagement by 20%.
   - Built an interactive encyclopedia web app for the National History Museum, prioritizing usability and accessibility.

2. **UX/UI Designer**, CareerFoundry Program — Berlin · Dec 2022–Nov 2023
   - Designed high-fidelity prototypes for a real estate responsive web app, focusing on color, typography, and UI components.
   - Led end-to-end UX/UI for the "Top-Notch Beauty" app — research, concept, final design, and usability testing.

3. **Designer**, Jahannama Architects & Labsimurb — Isfahan & Milan · Jan 2015–Oct 2022
   - Led multiple residential architecture projects, consistently delivering 10% under budget and ahead of schedule.
   - Analyzed environmental and infrastructural vulnerabilities in Milan, leading to the design of a 100km sustainable bike path.

**Education**
- UX/UI Design Specialization, CareerFoundry — Berlin · Dec 2022–Nov 2023
- MSc Urban Planning, Politecnico di Milano — Milan · 2017–2020
- B.Eng. Architecture, Azad University — Isfahan · 2009–2014

### Content trims (approved)

- Skills cut from 12 → 7: removed *Growth Mindset, Problem-Solving, Collaboration & Communication, Data-Driven Decision Making, User-Centered Design* (generic/redundant with UX Design).
- Education merged CareerFoundry's "UI Specialization" + "UX Design" (two phases of one continuous Dec 2022–Nov 2023 program) into a single line.
- Dropped the freelance portfolio-website bullet (weakest/most self-referential of four) — kept the three with concrete client/product outcomes.
- Removed literal "Link to Project" / "Link to GitHub Repository" text (Word hyperlink labels, not meant to render as visible text).
- Summary tightened from two sentences to one.

---

## Layout

Single HTML file: `cv/index.html` (new top-level folder), self-contained like
the case-study pages (inline `<style>`, Google Fonts link, no build step).

**Header band**
- Name in large serif display type (echoes case-study `h1` treatment, smaller scale — this is one page of dense content, not a hero).
- "UX/UI Designer" as a small-caps italic-serif eyebrow above the name (matches `.b-hero-eyebrow` styling).
- Photo: rounded-square portrait, top-right of the header band.
- Contact row beneath the name: email · phone · location · LinkedIn · site, styled like the existing `.b-meta` strip (small caps labels, thin dividers), full width under the name/photo row.

**Two-column body** (below a thin rule, like `.b-body`'s top border)
- Left column (~62%): Work Experience, then Education. Each entry uses the site's existing numeral/date idiom (italic serif accent-colored date range) with a bold role/company line and compact bullets.
- Right column (~38%): Summary, then Skills, Tools, Languages as labeled groups (small-caps label + comma-separated or wrapped-pill text, no progress bars).

**No footer needed** — the page is the whole document.

## Print handling

`@media print` block:
- `@page { size: A4; margin: 12mm; }`
- Remove page background color (print white), remove any shadows.
- Force the two-column grid to hold (don't let print reflow to single column).
- Slightly tighter line-height/margins than screen if needed to hold one page — verified empirically once real content is laid in, not guessed up front.

Screen view keeps the site's usual `--bg` cream background outside an A4-proportioned white "sheet" (similar visual idea to a document preview), so it's clear this is a printable artifact, not just another web page.

## Out of scope

- No PDF export tooling beyond the browser's native Print → Save as PDF.
- Not linked from the main site nav in this pass — delivered as a standalone page; wiring it into navigation is a separate, later decision.
- No dark-mode variant (case-study pages don't have one either).
