# Homelon Case Study — Webpage Sketch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `homelon_case_study/website_page/index.html` — a single static HTML page (variant B, "Balanced" register) inside the locked Editorial + Structured template (Sketch 005 winner E), populated with Homelon's 7-section case-study content and a curated set of real screenshots.

**Architecture:** This is a content/markup task, not application code — no build step, no framework, a single self-contained HTML file with inlined `<style>` and one small vanilla-JS scrollspy script, mirroring `splitsmart-case-study/website_page/index.html`'s variant B section exactly (same CSS class names, same structural pattern), retargeted with Homelon's own content, palette, and images. There are no automated tests; each task's "test" is opening the file in a browser and a set of grep-based structural checks (every TOC anchor has a matching section id, every referenced image file exists).

**Tech Stack:** Plain HTML5 + CSS (custom properties) + vanilla JS. Google Fonts: Instrument Serif + Inter (same as SplitSmart's page, loaded via the same `<link>` tags).

## Global Constraints

- **Reference implementation:** `splitsmart-case-study/website_page/index.html` lines 1-272 (shared `<head>`/CSS reset) and lines 66-272 (variant B's `#vb` CSS block) — copy this CSS near-verbatim, renaming the `#vb` selector prefix to `#hb` (Homelon Balanced) and adjusting only the values called out in this plan. Do not redesign the layout — the template is locked (Sketch 005 winner E).
- **Content source:** `homelon_case_study/case-study.md` (Phase 1, complete) is the sole source of section prose. Do not invent new claims — only the hero H1/subhead may compress/rephrase existing case-study.md sentences (see Task 2), and that exact copy is provided verbatim in this plan, not left to the implementer to draft.
- **Palette:** single muted accent color `--accent: #b8533f` (muted watermelon coral — NOT SplitSmart's `#ff5a36` orange, and NOT the app's fully-saturated coral red) used everywhere the reference CSS uses `--accent`. No second accent color, no dark device frames (that's variant C, out of scope), no gradient image placeholders (`.img-cream-1` etc. are unused here — Homelon has real screenshots).
- **Section id prefix:** `hb-` (e.g. `#hb-problem`), not SplitSmart's `vb-`.
- **7 sections, this exact order and these exact ids:** `hb-problem` (The Problem), `hb-audit` (Competitive Audit), `hb-stories` (User Stories & Flows), `hb-decisions` (Design Decisions), `hb-screens` (The Screens), `hb-gaps` (Gaps and Limitations), `hb-conclusion` (Conclusion). Not SplitSmart's 5 or 9 sections.
- **Images:** referenced as `../visuals/<file>.png` from `website_page/index.html`, matching `splitsmart-case-study/website_page/index.html`'s exact path convention (e.g. `src="../visuals/app-dashboard.png"`).
- **Metadata strip fields:** Role · Team · Timeline · Type (4 fields, matching `case-study.md`'s header — NOT SplitSmart's 5-field Role/Team/Date/Timeline/Type). Role, Team, and Type render literal `TBD` text (per `case-study.md:5`); Timeline renders `2023 · short design phase`.
- **Out of scope:** no Next.js integration, no A/C variants, no new screenshots beyond the 12 curated files, no changes to `case-study.md` or `legacy/homelon.html`.

---

## Task 1: Curate and copy screenshot assets

**Files:**
- Create: `homelon_case_study/visuals/homelon-landing.png`
- Create: `homelon_case_study/visuals/homelon-onboarding.png`
- Create: `homelon_case_study/visuals/homelon-search.png`
- Create: `homelon_case_study/visuals/homelon-menu.png`
- Create: `homelon_case_study/visuals/homelon-filter.png`
- Create: `homelon_case_study/visuals/homelon-favourites.png`
- Create: `homelon_case_study/visuals/homelon-compare-01.png`
- Create: `homelon_case_study/visuals/homelon-compare-02.png`
- Create: `homelon_case_study/visuals/homelon-property-info.png`
- Create: `homelon_case_study/visuals/homelon-send-message.png`
- Create: `homelon_case_study/visuals/homelon-confirmation.png`
- Create: `homelon_case_study/visuals/homelon-dashboard.png`

**Interfaces:**
- Produces: 12 PNG files at the paths above. Later tasks (Task 2-4) reference these exact filenames via `../visuals/<file>.png` from `website_page/index.html`. The filenames must match exactly — no spaces (the source files in `screens/` have spaces and inconsistent capitalization; these copies are renamed to be URL-safe and consistent).

- [ ] **Step 1: Create the visuals directory and copy the 12 curated files with new names**

The source files live in `homelon_case_study/screens/` with the exact names below (verified to exist via `ls`). Copy each to `homelon_case_study/visuals/` under its new name:

```bash
mkdir -p homelon_case_study/visuals
cp "homelon_case_study/screens/Landing page_01.png" "homelon_case_study/visuals/homelon-landing.png"
cp "homelon_case_study/screens/Onboarding_01.png" "homelon_case_study/visuals/homelon-onboarding.png"
cp "homelon_case_study/screens/Search_01.png" "homelon_case_study/visuals/homelon-search.png"
cp "homelon_case_study/screens/Hamberger menu.png" "homelon_case_study/visuals/homelon-menu.png"
cp "homelon_case_study/screens/Filter.png" "homelon_case_study/visuals/homelon-filter.png"
cp "homelon_case_study/screens/Fvourites.png" "homelon_case_study/visuals/homelon-favourites.png"
cp "homelon_case_study/screens/Compare_01.png" "homelon_case_study/visuals/homelon-compare-01.png"
cp "homelon_case_study/screens/Compare_02.png" "homelon_case_study/visuals/homelon-compare-02.png"
cp "homelon_case_study/screens/Info page.png" "homelon_case_study/visuals/homelon-property-info.png"
cp "homelon_case_study/screens/Send message.png" "homelon_case_study/visuals/homelon-send-message.png"
cp "homelon_case_study/screens/Confirmation.png" "homelon_case_study/visuals/homelon-confirmation.png"
cp "homelon_case_study/screens/Dashboard.png" "homelon_case_study/visuals/homelon-dashboard.png"
```

- [ ] **Step 2: Verify all 12 files exist and are non-empty**

```bash
ls -la homelon_case_study/visuals/
```

Expected: 12 files listed, each with a nonzero byte size (matching the source files' sizes from `homelon_case_study/screens/`).

- [ ] **Step 3: Commit**

```bash
git add homelon_case_study/visuals/
git commit -m "docs(homelon-case-study): curate and copy webpage sketch screenshot assets"
```

---

## Task 2: Page shell — head, CSS, hero, cover, metadata strip

**Files:**
- Create: `homelon_case_study/website_page/index.html`

**Interfaces:**
- Consumes: `homelon_case_study/visuals/homelon-landing.png` (from Task 1) as the cover image.
- Produces: the file's `<head>` (fonts, CSS custom properties, reset, `#hb` CSS block for hero/cover/meta) and opening `<body>` markup through the metadata strip. Task 3 and Task 4 append the two-column body (`.hb-body`) and footer/script inside the same `<section id="hb">...</section>` — this task leaves that section open (do not close `</section>` or `</body></html>` yet; Task 4 closes them).

- [ ] **Step 1: Create the file with head, CSS, and opening body through the metadata strip**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Homelon — Case Study</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg:        #ebe8e2;
      --bg-2:      #e3dfd6;
      --bg-3:      #dcd6c9;
      --ink:       #1a1a1a;
      --ink-2:     #2a2a2a;
      --muted:     #5a5a5a;
      --muted-2:   #8a8a85;
      --line:      #d5d0c5;
      --line-2:    #c6c0b3;
      --accent:    #b8533f;
      --accent-soft: #f0d9c9;
      --surface:   #ffffff;

      --font-serif: 'Instrument Serif', serif;
      --font-sans:  'Inter', system-ui, sans-serif;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100%; }
    body {
      font-family: var(--font-sans);
      background: var(--bg);
      color: var(--ink);
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }
    a { text-decoration: none; color: inherit; }
    button { font-family: inherit; cursor: pointer; border: none; background: none; }

    .img-cream-2 { background: linear-gradient(135deg, #f5efe6 0%, #d9d2c2 100%); color: #8a8175; border-radius: 12px; display: grid; place-items: center; font-family: var(--font-serif); font-style: italic; font-size: 13px; text-align: center; padding: 24px; }

    /* ═══════════════════════════════════════════════════════════
       VARIANT B — BALANCED (Homelon)
       Same locked template as splitsmart-case-study/website_page/index.html's
       #vb block, retargeted: #hb prefix, watermelon-muted accent, real screenshots.
       ─────────────────────────────────────────────────────────── */
    #hb { background: var(--bg); }

    #hb .b-top {
      padding: 24px 56px;
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 1px solid var(--line);
    }
    #hb .b-top-name { font-family: var(--font-serif); font-style: italic; font-size: 20px; }
    #hb .b-top-back { font-size: 12px; color: var(--muted); display: inline-flex; align-items: center; gap: 8px; text-transform: uppercase; letter-spacing: 0.08em; }
    #hb .b-top-back:hover { color: var(--accent); }
    #hb .b-top-nav { display: flex; gap: 28px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }

    #hb .b-hero {
      padding: 96px 56px 56px;
      max-width: 1320px; margin: 0 auto;
      text-align: center;
    }
    #hb .b-hero-eyebrow { font-family: var(--font-serif); font-style: italic; color: var(--accent); font-size: 20px; margin-bottom: 24px; }
    #hb .b-hero h1 {
      font-family: var(--font-serif);
      font-size: clamp(52px, 7.2vw, 112px); line-height: 0.96;
      letter-spacing: -0.03em; font-weight: 400;
      margin-bottom: 40px;
      max-width: 1000px; margin-left: auto; margin-right: auto;
    }
    #hb .b-hero h1 em { font-style: italic; color: var(--accent); }
    #hb .b-hero-sub {
      font-family: var(--font-serif); font-size: 24px; line-height: 1.45;
      color: var(--ink-2); max-width: 680px; margin: 0 auto;
      font-style: italic;
    }

    #hb .b-cover {
      max-width: 1320px; margin: 56px auto 0;
      padding: 0 56px;
    }
    #hb .b-cover-frame {
      background: var(--surface); border-radius: 16px;
      padding: 16px; box-shadow: 0 30px 80px rgba(26,22,18,0.12), 0 4px 12px rgba(26,22,18,0.05);
      border: 1px solid var(--line);
    }
    #hb .b-cover-chrome { display: flex; gap: 6px; margin-bottom: 12px; padding: 4px 4px 8px; border-bottom: 1px solid var(--line); }
    #hb .b-cover-chrome span { width: 10px; height: 10px; border-radius: 50%; background: var(--line-2); }
    #hb .b-cover-img { width: 100%; height: auto; display: block; border-radius: 8px; }

    /* Metadata strip — 4 fields (Role, Team, Timeline, Type) */
    #hb .b-meta {
      max-width: 1320px; margin: 64px auto 0;
      padding: 32px 56px;
      border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px;
    }
    #hb .b-meta-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); margin-bottom: 6px; }
    #hb .b-meta-value { font-family: var(--font-serif); font-size: 18px; line-height: 1.3; font-style: italic; }
  </style>
</head>
<body>

<!-- ══════════════════════════════════════════════════════════════
     VARIANT B — BALANCED (Homelon)
     ══════════════════════════════════════════════════════════════ -->
<section id="hb">

  <header class="b-top">
    <a class="b-top-back" href="#">← Index</a>
    <a class="b-top-name" href="#"><em>Farzaneh Falakrou</em></a>
    <nav class="b-top-nav">
      <a href="#">Work</a><a href="#">About</a><a href="#">Notes</a>
    </nav>
  </header>

  <section class="b-hero">
    <div class="b-hero-eyebrow">Case study · Homelon · 2026</div>
    <h1>Real estate listings bury buyers in information. Homelon leads with <em>comparison</em>.</h1>
    <p class="b-hero-sub">Today's real estate apps overwhelm new buyers with dense listings and unclear navigation. Homelon puts side-by-side comparison at the center of the decision, helping first-time buyers move from overwhelmed to confident.</p>
  </section>

  <div class="b-cover">
    <div class="b-cover-frame">
      <div class="b-cover-chrome"><span></span><span></span><span></span></div>
      <img class="b-cover-img" src="../visuals/homelon-landing.png" alt="Homelon landing screen — listings and map view">
    </div>
  </div>

  <section class="b-meta">
    <div><div class="b-meta-label">Role</div><div class="b-meta-value">TBD</div></div>
    <div><div class="b-meta-label">Team</div><div class="b-meta-value">TBD</div></div>
    <div><div class="b-meta-label">Timeline</div><div class="b-meta-value">2023 · short design phase</div></div>
    <div><div class="b-meta-label">Type</div><div class="b-meta-value">TBD</div></div>
  </section>

```

Leave the file here — do not close `<section id="hb">`, `<body>`, or `<html>` yet. Task 3 appends immediately after the metadata strip's closing `</section>`.

- [ ] **Step 2: Verify the file opens cleanly in a browser**

Open `homelon_case_study/website_page/index.html` directly in a browser (file:// URL). Expected: hero renders with the headline and italic subhead, the cover image (`homelon-landing.png`) displays inside a white rounded frame, and the 4-column metadata strip shows Role/Team/Timeline/Type. The page will look visually incomplete below the metadata strip (that's expected — Task 3/4 aren't written yet) and the HTML is technically unclosed (browsers auto-close unclosed tags, so this renders fine as a preview even mid-plan).

- [ ] **Step 3: Commit**

```bash
git add homelon_case_study/website_page/index.html
git commit -m "docs(homelon-case-study): webpage sketch shell (head, hero, cover, meta strip)"
```

---

## Task 3: Body — TOC + Sections 1-4 (Problem, Audit, Stories & Flows, Design Decisions)

**Files:**
- Modify: `homelon_case_study/website_page/index.html` (append after Task 2's metadata strip)

**Interfaces:**
- Consumes: `.b-meta` closing point from Task 2 (append immediately after). `homelon_case_study/visuals/homelon-dashboard.png` (from Task 1) for the Design Decisions figure.
- Produces: the `.b-body` two-column grid opening (TOC + `<article class="b-article">`), with sections `hb-problem` through `hb-decisions` inside the article. Leaves the article and `.b-body` div open — Task 4 appends sections 5-7 and closes both.

- [ ] **Step 1: Add the CSS for the two-column body, TOC, article typography, and figures**

Append to the `<style>` block from Task 2, immediately before the closing `</style>` tag:

```css
    /* Two-column body — TOC + article */
    #hb .b-body {
      max-width: 1320px; margin: 0 auto;
      padding: 64px 56px 100px;
      display: grid; grid-template-columns: 220px 1fr; gap: 80px;
    }
    #hb .b-toc {
      position: sticky; top: 88px; align-self: start;
      font-size: 13px; line-height: 1.8;
    }
    #hb .b-toc-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); margin-bottom: 12px; }
    #hb .b-toc-list { list-style: none; }
    #hb .b-toc-list li { padding: 4px 0; color: var(--muted); }
    #hb .b-toc-list li.active { color: var(--ink); }
    #hb .b-toc-list a {
      display: grid; grid-template-columns: 24px 1fr; gap: 12px;
      align-items: baseline; color: inherit;
      transition: color 0.15s;
    }
    #hb .b-toc-list a:hover { color: var(--ink); }
    #hb .b-toc-list .num { font-family: var(--font-serif); font-style: italic; color: var(--accent); font-size: 14px; }
    #hb .b-section-mark, #hb .b-reflection { scroll-margin-top: 80px; }

    #hb .b-article { font-size: 17px; line-height: 1.7; color: var(--ink-2); max-width: 720px; }
    #hb .b-section-mark { display: flex; align-items: baseline; gap: 16px; margin-bottom: 24px; }
    #hb .b-section-mark .num { font-family: var(--font-serif); font-style: italic; color: var(--accent); font-size: 18px; }
    #hb .b-section-mark .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--muted); border-top: 1px solid var(--ink); padding-top: 6px; }
    #hb .b-article section + section { margin-top: 88px; }
    #hb .b-article h2 {
      font-family: var(--font-serif); font-size: 44px; font-weight: 400;
      line-height: 1.05; color: var(--ink); margin-bottom: 28px;
      letter-spacing: -0.02em;
    }
    #hb .b-article h2 em { font-style: italic; color: var(--accent); }
    #hb .b-article p + p { margin-top: 20px; }
    #hb .b-article strong { font-weight: 500; color: var(--ink); }
    #hb .b-article h3 {
      font-family: var(--font-serif); font-style: italic;
      font-size: 24px; color: var(--accent);
      line-height: 1.2; letter-spacing: -0.01em;
      margin: 36px 0 14px;
    }

    /* Figures — contained in subtle frames */
    #hb .b-figure { margin: 36px 0 32px; }
    #hb .b-figure-frame {
      background: var(--surface); border: 1px solid var(--line); border-radius: 10px;
      padding: 12px; box-shadow: 0 8px 24px rgba(26,22,18,0.06);
    }
    #hb .b-figure-chrome { display: flex; gap: 6px; padding: 4px 4px 8px; border-bottom: 1px solid var(--line); margin-bottom: 8px; }
    #hb .b-figure-chrome span { width: 8px; height: 8px; border-radius: 50%; background: var(--line-2); }
    #hb .b-figure-frame img { width: 100%; height: auto; display: block; border-radius: 6px; }
    #hb .b-figure figcaption { font-size: 13px; font-style: italic; font-family: var(--font-serif); color: var(--muted); margin-top: 10px; padding: 0 6px; }

    #hb .b-figure-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 36px 0 32px; }
```

- [ ] **Step 2: Append the TOC and Sections 1-4 to the body**

Append immediately after the `.b-meta` section's closing `</section>` tag from Task 2:

```html
  <div class="b-body">
    <aside class="b-toc">
      <div class="b-toc-label">Contents</div>
      <ol class="b-toc-list">
        <li class="active"><a href="#hb-problem"><span class="num">01</span> The problem</a></li>
        <li><a href="#hb-audit"><span class="num">02</span> Competitive audit</a></li>
        <li><a href="#hb-stories"><span class="num">03</span> User stories &amp; flows</a></li>
        <li><a href="#hb-decisions"><span class="num">04</span> Design decisions</a></li>
        <li><a href="#hb-screens"><span class="num">05</span> The screens</a></li>
        <li><a href="#hb-gaps"><span class="num">06</span> Gaps and limitations</a></li>
        <li><a href="#hb-conclusion"><span class="num">07</span> Conclusion</a></li>
      </ol>
    </aside>

    <article class="b-article">

      <section>
        <div class="b-section-mark" id="hb-problem"><span class="num">01</span><span class="label">The problem</span></div>
        <h2>Real estate listings drown new buyers in <em>information</em>.</h2>
        <p>Today's real estate apps overwhelm new buyers with dense listings and unclear navigation, making it hard to sift through options efficiently. Homelon's goal is to help first-time buyers make informed, financially confident decisions by simplifying how listings are presented and compared.</p>
      </section>

      <section>
        <div class="b-section-mark" id="hb-audit"><span class="num">02</span><span class="label">Competitive audit</span></div>
        <p>The user research brief covered user needs but skipped competitive analysis. I audited three apps — Trulia, ImmoScout, and Zoopla — to understand market conventions and identify the essential functions a real estate app needs before designing the user flow.</p>
      </section>

      <section>
        <div class="b-section-mark" id="hb-stories"><span class="num">03</span><span class="label">User stories &amp; flows</span></div>
        <p>From the user stories I was given, I prioritized the ones most critical to the real estate use case, using the competitive audit to judge relevance. I then mapped those stories into user flows — the steps a buyer takes to reach each goal — highlighting the key features in light green to make them easy to spot.</p>
      </section>

      <section>
        <div class="b-section-mark" id="hb-decisions"><span class="num">04</span><span class="label">Design decisions</span></div>
        <h2>What each screen had to <em>prove</em>.</h2>

        <h3>Wireframes to high-fidelity</h3>
        <p>Low-fidelity wireframes established core functionality first. Mid-fidelity passes tested layout, visual hierarchy, and spacing before I locked the style guide and moved to high-fidelity screens.</p>

        <h3>Watermelon palette</h3>
        <p>The palette pairs Sea Turtle Green — nature, stability — with Coral/Watermelon Red — energy, ambition — balanced by Charcoal for professionalism. Together, green and red strike a deliberate balance between <strong>stability and excitement</strong>: reassuring enough for a financial decision, energetic enough to feel like progress toward a goal.</p>

        <h3>Rounded, consistent, real</h3>
        <p>Icons and UI elements share one rounded-corner language across the app, with the location icon pulling directly from the watermelon palette. Photography avoids polished studio shots in favor of natural daylight and real settings — landscapes, plants — to keep the app feeling <strong>trustworthy and approachable</strong> rather than staged.</p>

        <figure class="b-figure">
          <div class="b-figure-frame">
            <div class="b-figure-chrome"><span></span><span></span><span></span></div>
            <img src="../visuals/homelon-dashboard.png" alt="Homelon dashboard screen showing the watermelon palette and rounded UI language in context">
          </div>
          <figcaption>The style guide in context — watermelon palette and rounded corners carried through the dashboard.</figcaption>
        </figure>
      </section>

```

Leave `</article>` and `</div>` (closing `.b-body`) unclosed — Task 4 appends sections 5-7 next, then closes both.

- [ ] **Step 3: Verify TOC anchors match section ids**

```bash
grep -o 'href="#hb-[a-z]*"' homelon_case_study/website_page/index.html | sort -u
grep -o 'id="hb-[a-z]*"' homelon_case_study/website_page/index.html | sort -u
```

Expected: both commands list `hb-audit`, `hb-decisions`, `hb-problem`, `hb-stories` at this point (4 of the eventual 7 — `hb-screens`, `hb-gaps`, `hb-conclusion` don't exist yet, that's expected since Task 4 adds them; the TOC already links to all 7 since it was written in full, so those 3 links will 404-scroll until Task 4 lands — not a problem mid-task, just note it).

- [ ] **Step 4: Verify the referenced image exists**

```bash
ls homelon_case_study/visuals/homelon-dashboard.png
```

Expected: file listed (created in Task 1).

- [ ] **Step 5: Commit**

```bash
git add homelon_case_study/website_page/index.html
git commit -m "docs(homelon-case-study): webpage sketch body — TOC + sections 1-4"
```

---

## Task 4: Body — Sections 5-7, footer, scrollspy script

**Files:**
- Modify: `homelon_case_study/website_page/index.html` (append after Task 3's Section 4, close remaining open tags)

**Interfaces:**
- Consumes: the open `<article class="b-article">` and `.b-body` div from Task 3. `homelon_case_study/visuals/homelon-onboarding.png`, `homelon-search.png`, `homelon-menu.png`, `homelon-filter.png`, `homelon-favourites.png`, `homelon-compare-01.png`, `homelon-compare-02.png`, `homelon-property-info.png`, `homelon-send-message.png`, `homelon-confirmation.png` (all from Task 1).
- Produces: the complete, valid HTML document — closes `</article>`, `</div>`, adds `<footer>`, closes `</section>`, adds the scrollspy `<script>`, closes `</body></html>`.

- [ ] **Step 1: Add the CSS for gap cards, reflection, and footer**

Append to the `<style>` block, immediately before the closing `</style>` tag:

```css
    /* Gap cards — two-column (Homelon has 2 gaps) */
    #hb .b-gaps {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px;
      margin: 32px 0; max-width: 600px;
    }
    #hb .b-gap-card {
      background: var(--surface); border: 1px solid var(--line); border-radius: 12px;
      padding: 28px 24px;
      display: flex; flex-direction: column; gap: 14px;
    }
    #hb .b-gap-card .num { font-family: var(--font-serif); font-style: italic; color: var(--accent); font-size: 22px; }
    #hb .b-gap-card h4 { font-family: var(--font-serif); font-size: 22px; font-weight: 400; line-height: 1.15; }
    #hb .b-gap-card p { font-size: 14px; line-height: 1.55; color: var(--muted); }

    /* Reflection — italic editorial */
    #hb .b-reflection { margin: 80px 0 0; padding: 56px 0; border-top: 1px solid var(--line); }
    #hb .b-reflection-mark { font-family: var(--font-serif); font-style: italic; color: var(--accent); font-size: 16px; margin-bottom: 16px; }
    #hb .b-reflection p { font-family: var(--font-serif); font-size: 28px; font-style: italic; line-height: 1.3; max-width: 600px; }
    #hb .b-reflection .note { font-family: var(--font-sans); font-size: 15px; font-style: normal; color: var(--muted); margin-top: 20px; max-width: 600px; line-height: 1.6; }

    /* Footer */
    #hb .b-footer {
      max-width: 1320px; margin: 0 auto;
      padding: 96px 56px 64px;
      border-top: 1px solid var(--line);
      display: grid; grid-template-columns: 1fr 1.4fr; gap: 56px; align-items: center;
    }
    #hb .b-footer-eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); margin-bottom: 12px; }
    #hb .b-footer-title { font-family: var(--font-serif); font-size: 56px; line-height: 1; font-weight: 400; letter-spacing: -0.02em; }
    #hb .b-footer-title em { font-style: italic; color: var(--accent); }
    #hb .b-footer-img { height: 200px; }
```

- [ ] **Step 2: Append Sections 5-7, close the article/body div, add footer**

Append immediately after Task 3's Section 4 (`hb-decisions`) closing `</section>`:

```html
      <section>
        <div class="b-section-mark" id="hb-screens"><span class="num">05</span><span class="label">The screens</span></div>
        <h2>Comparison, <em>close</em> at hand.</h2>

        <h3>Onboarding to search</h3>
        <p>A short onboarding flow introduces the app before dropping the buyer into search. From there, users see both listings and a map on the same screen — scrolling listings with a swipe-up gesture, or tapping into the map to search visually. A hamburger menu and filter controls sit alongside search so buyers can narrow results without leaving the flow.</p>

        <div class="b-figure-grid">
          <figure class="b-figure">
            <div class="b-figure-frame">
              <div class="b-figure-chrome"><span></span><span></span><span></span></div>
              <img src="../visuals/homelon-onboarding.png" alt="Homelon onboarding screen">
            </div>
            <figcaption>Onboarding.</figcaption>
          </figure>
          <figure class="b-figure">
            <div class="b-figure-frame">
              <div class="b-figure-chrome"><span></span><span></span><span></span></div>
              <img src="../visuals/homelon-search.png" alt="Homelon search screen with listings and map">
            </div>
            <figcaption>Search — listings and map in one view.</figcaption>
          </figure>
          <figure class="b-figure">
            <div class="b-figure-frame">
              <div class="b-figure-chrome"><span></span><span></span><span></span></div>
              <img src="../visuals/homelon-menu.png" alt="Homelon hamburger menu">
            </div>
            <figcaption>Navigation menu.</figcaption>
          </figure>
          <figure class="b-figure">
            <div class="b-figure-frame">
              <div class="b-figure-chrome"><span></span><span></span><span></span></div>
              <img src="../visuals/homelon-filter.png" alt="Homelon filter screen">
            </div>
            <figcaption>Filter controls alongside search.</figcaption>
          </figure>
        </div>

        <h3>Favourite &amp; Compare</h3>
        <p>Saved listings aren't just a bookmark list — selecting two properties opens a side-by-side comparison across size, price, facilities, and energy usage. This is the app's core decision-making tool: instead of holding two listings in memory while scrolling back and forth, the buyer sees them side by side.</p>

        <div class="b-figure-grid">
          <figure class="b-figure">
            <div class="b-figure-frame">
              <div class="b-figure-chrome"><span></span><span></span><span></span></div>
              <img src="../visuals/homelon-favourites.png" alt="Homelon favourites screen with saved listings">
            </div>
            <figcaption>Saved listings.</figcaption>
          </figure>
          <figure class="b-figure">
            <div class="b-figure-frame">
              <div class="b-figure-chrome"><span></span><span></span><span></span></div>
              <img src="../visuals/homelon-compare-01.png" alt="Homelon side-by-side property comparison, first view">
            </div>
            <figcaption>Comparing two properties side by side.</figcaption>
          </figure>
        </div>

        <figure class="b-figure">
          <div class="b-figure-frame">
            <div class="b-figure-chrome"><span></span><span></span><span></span></div>
            <img src="../visuals/homelon-compare-02.png" alt="Homelon side-by-side property comparison, second view">
          </div>
          <figcaption>Comparison across size, price, facilities, and energy usage.</figcaption>
        </figure>

        <h3>Property Info &amp; Contacts</h3>
        <p>The property detail screen surfaces everything — visual and written — a buyer needs to decide and act, with a direct path to contacting an agent and a confirmation once that message is sent.</p>

        <div class="b-figure-grid">
          <figure class="b-figure">
            <div class="b-figure-frame">
              <div class="b-figure-chrome"><span></span><span></span><span></span></div>
              <img src="../visuals/homelon-property-info.png" alt="Homelon property detail screen">
            </div>
            <figcaption>Property details.</figcaption>
          </figure>
          <figure class="b-figure">
            <div class="b-figure-frame">
              <div class="b-figure-chrome"><span></span><span></span><span></span></div>
              <img src="../visuals/homelon-send-message.png" alt="Homelon send message to agent screen">
            </div>
            <figcaption>Contacting the agent.</figcaption>
          </figure>
        </div>

        <figure class="b-figure">
          <div class="b-figure-frame">
            <div class="b-figure-chrome"><span></span><span></span><span></span></div>
            <img src="../visuals/homelon-confirmation.png" alt="Homelon confirmation screen after sending a message">
          </div>
          <figcaption>Confirmation once the message is sent.</figcaption>
        </figure>
      </section>

      <section>
        <div class="b-section-mark" id="hb-gaps"><span class="num">06</span><span class="label">Gaps and limitations</span></div>

        <div class="b-gaps">
          <div class="b-gap-card">
            <div class="num">Gap 01</div>
            <h4>No usability testing.</h4>
            <p>The short project timeline meant focus stayed on UI design; no usability testing was conducted. Testing with users of varying abilities and disabilities — including accessibility-focused testing — remains the clearest next step before this design could be validated with real buyers.</p>
          </div>
          <div class="b-gap-card">
            <div class="num">Gap 02</div>
            <h4>Research handed off without competitive context.</h4>
            <p>Competitive positioning wasn't part of the original research scope, so the competitive audit and user-flow prioritization were self-directed rather than handed to me ready-made. This filled the gap for this project, but a fuller research phase would strengthen future iterations.</p>
          </div>
        </div>
      </section>

      <section class="b-reflection" id="hb-conclusion">
        <div class="b-reflection-mark">07 · Conclusion</div>
        <p>Homelon simplifies real estate search by putting comparison at the center of the decision, not buried behind separate listing pages.</p>
        <p class="note">Working under a tight deadline meant prioritizing ruthlessly — a single cohesive moodboard early on kept the design language consistent across every screen without requiring extra iteration later. The clearest next steps are laid out above — validating the design with real buyers and rounding out the visual language it started with.</p>
      </section>

    </article>
  </div>

  <footer class="b-footer">
    <div>
      <div class="b-footer-eyebrow">Next case study</div>
      <h3 class="b-footer-title">A boutique redesign that let the brand do the <em>talking</em>.</h3>
    </div>
    <div class="img-cream-2 b-footer-img">Top-notch Beauty · Brand & Web · 2023</div>
  </footer>
</section>

<script>
  // Scrollspy: highlight the TOC item for the section in view
  (function () {
    const tocLinks = [...document.querySelectorAll('a[href^="#hb-"]')];
    if (!tocLinks.length) return;
    const targets = tocLinks
      .map(a => document.getElementById(a.getAttribute('href').slice(1)))
      .filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          tocLinks.forEach(a => {
            a.closest('li').classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-100px 0px -65% 0px', threshold: 0 });
    targets.forEach(el => observer.observe(el));
  })();
</script>

</body>
</html>
```

- [ ] **Step 3: Verify all TOC anchors now have a matching section id**

```bash
grep -o 'href="#hb-[a-z]*"' homelon_case_study/website_page/index.html | sed 's/href="#//;s/"//' | sort -u > /tmp/toc-ids.txt
grep -o 'id="hb-[a-z]*"' homelon_case_study/website_page/index.html | sed 's/id="//;s/"//' | sort -u > /tmp/section-ids.txt
diff /tmp/toc-ids.txt /tmp/section-ids.txt
```

Expected: no output (empty diff) — every TOC link has exactly one matching section id, and vice versa. Both lists should contain exactly 7 entries: `hb-audit`, `hb-conclusion`, `hb-decisions`, `hb-gaps`, `hb-problem`, `hb-screens`, `hb-stories`.

- [ ] **Step 4: Verify every referenced image file exists**

```bash
grep -o '\.\./visuals/[a-zA-Z0-9_.-]*\.png' homelon_case_study/website_page/index.html | sort -u | sed 's#\.\./visuals/#homelon_case_study/visuals/#' | while read f; do [ -f "$f" ] && echo "OK: $f" || echo "MISSING: $f"; done
```

Expected: 12 `OK:` lines, zero `MISSING:` lines.

- [ ] **Step 5: Verify the HTML is well-formed**

```bash
python3 -c "import xml.etree.ElementTree as ET, re, sys
with open('homelon_case_study/website_page/index.html', encoding='utf-8') as f:
    html = f.read()
open_tags = re.findall(r'<(section|article|div|aside|header|footer|figure)(?:\s[^>]*)?>', html)
close_tags = re.findall(r'</(section|article|div|aside|header|footer|figure)>', html)
from collections import Counter
oc, cc = Counter(open_tags), Counter(close_tags)
mismatched = {t for t in set(oc)|set(cc) if oc[t] != cc[t]}
print('Balanced' if not mismatched else f'MISMATCH: {mismatched} open={dict(oc)} close={dict(cc)}')
"
```

Expected: `Balanced`. If any tag reports a mismatch, find the missing open/close tag before proceeding — self-closing tags like `<img>` and `<br>` are not counted so they won't cause false positives.

- [ ] **Step 6: Open the complete page in a browser**

Open `homelon_case_study/website_page/index.html` as a `file://` URL. Expected: full page renders top to bottom — hero, cover image, 4-field metadata strip, sticky TOC that highlights the section in view while scrolling, all 7 sections with their prose and images, the two gap cards, the italic conclusion reflection, and the footer. All 12 images display (no broken-image icons). Clicking a TOC link scrolls to the matching section.

- [ ] **Step 7: Commit**

```bash
git add homelon_case_study/website_page/index.html
git commit -m "docs(homelon-case-study): webpage sketch body — sections 5-7, footer, scrollspy"
```

---

## Task 5: Sketch README

**Files:**
- Create: `homelon_case_study/website_page/README.md`

**Interfaces:**
- Consumes: nothing from earlier tasks (pure documentation).

- [ ] **Step 1: Write the sketch metadata file**

Mirror `splitsmart-case-study/website_page/README.md`'s frontmatter and structure (that file's lines 1-38 show the pattern: frontmatter block, thesis callout, design question, "how to view", structure note).

```markdown
---
sketch: homelon-01
name: homelon-case-study
question: "How should the Homelon case study read inside the locked Editorial + Structured template, in the Balanced (variant B) register?"
winner: null
tags: [case-study, homelon, full-page, integration, content]
related:
  - .planning/sketches/005-case-study-template
  - splitsmart-case-study/website_page
---

# Homelon Case Study — Webpage Sketch

A single-variant build (Balanced / variant B only — see
`splitsmart-case-study/website_page/README.md` for the full A/B/C comparison this
register comes from) inside the locked **Editorial + Structured** template from
sketch 005. Mirrors SplitSmart's own unfinished Phase 2: this sketch has not been
ported into the Next.js site (`src/app/` has no case-study route), and `winner: null`
reflects that no decision has been made about whether/how to ship it.

## The thesis

**Real estate listings drown new buyers in information — Homelon cuts through it
with a comparison-first search flow.** Homelon leads with side-by-side comparison
instead of burying it behind separate listing pages, helping first-time buyers move
from overwhelmed to confident.

## How to View

Open `index.html` (in this folder) in a browser. There is only one variant — no
keypress switcher (SplitSmart's page has a 1/2/3 switcher across three variants;
this page has a single `#hb` section).

## Structure

7 sections, matching `../case-study.md`: The Problem · Competitive Audit · User
Stories & Flows · Design Decisions · The Screens · Gaps and Limitations ·
Conclusion.

## Notes on Content

Body content is a direct port of `../case-study.md` (Phase 1, complete), with two
deliberate compressions for the hero: the H1 and subhead condense the Problem
section's prose into a punchier headline, matching the rhetorical pattern
SplitSmart's variant B uses (short H1 + explanatory italic subhead) — no new claims,
only rephrasing of already-approved Phase 1 sentences.

## Known Gaps

- **Role, Team, Type** metadata fields render literal "TBD" — `case-study.md`'s
  header has no source for these (see Phase 1 design doc). Update both files
  together once the user provides them.
- **Screenshots** are the curated 12-file set from `../visuals/` (see
  `docs/superpowers/plans/2026-07-02-homelon-case-study-webpage.md` Task 1 for the
  full source-to-copy mapping) — not the complete 28-file `../screens/` set.
```

- [ ] **Step 2: Commit**

```bash
git add homelon_case_study/website_page/README.md
git commit -m "docs(homelon-case-study): webpage sketch README"
```

---

## Task 6: Update case-study hub README.md and LOG.md for Phase 2

**Files:**
- Modify: `homelon_case_study/README.md`
- Modify: `homelon_case_study/LOG.md`

**Interfaces:**
- Consumes: Phase 2 completion state from Tasks 1-5.

- [ ] **Step 1: Update README.md's status table**

Replace the "Sketch" and "Next build step" rows in the "Status at a glance" table (written in Phase 1's Task 8, currently reads `**Sketch** | none yet — no website_page/index.html (Phase 2, not started)` and `**Next build step** | Phase 2 — design and build the case-study webpage...`) with:

```markdown
| **Sketch** | `website_page/index.html` — single variant (Balanced / B), `winner: null` — mirrors SplitSmart's own unfinished Phase 2 |
| **Next build step** | Phase 3 — rebuild key screens as live HTML/Tailwind prototype pages (own brainstorm/spec cycle) |
```

Also update the Phase list (added in Phase 1's Task 8) to mark Phase 2 done:

```markdown
- **Phase 1 (done)** — content rewrite, `case-study.md`.
- **Phase 2 (done)** — case-study webpage sketch, `website_page/index.html` (single variant, `winner: null`).
- **Phase 3 (next)** — rebuild key screens (search, favourites/compare, property info, onboarding, etc.) as live HTML/Tailwind prototype pages, replacing static screenshots as the design reference.
```

- [ ] **Step 2: Append a LOG.md entry**

Append under **Done** and **Not done / deferred** (do not remove or rewrite prior entries — LOG.md is a running history):

```markdown

- **2026-07-02 — Phase 2 webpage sketch complete.** `website_page/index.html` built —
  single variant (Balanced/B register) inside the locked Editorial + Structured
  template (sketch 005 winner E), same pattern as
  `splitsmart-case-study/website_page/index.html`. 7 sections ported from
  `case-study.md`, 12 curated screenshots copied to `visuals/`. `winner: null` —
  not ported to Next.js, mirroring SplitSmart's own unresolved Phase 2 status. See
  design doc `docs/superpowers/specs/2026-07-02-homelon-case-study-webpage-design.md`.
```

Add under **Not done / deferred** (remove the now-stale "website_page/" bullet from Phase 1's entry, since it's done; keep "Live HTML prototype screens"):

```markdown
- **Next.js integration** — sketch is static HTML only, not ported into `src/app/`.
- **Role/Team/Type metadata** — still `_TBD_` in both `case-study.md` and the sketch's metadata strip; needs user input.
- **Live HTML prototype screens** — Phase 3, not started.
```

- [ ] **Step 3: Commit**

```bash
git add homelon_case_study/README.md homelon_case_study/LOG.md
git commit -m "docs(homelon-case-study): update README/LOG for Phase 2 completion"
```

---

## Final Verification

- [ ] **Step 1: Re-run the structural checks from Task 4 Steps 3-5 against the final file**

```bash
grep -o 'href="#hb-[a-z]*"' homelon_case_study/website_page/index.html | sed 's/href="#//;s/"//' | sort -u > /tmp/toc-ids.txt
grep -o 'id="hb-[a-z]*"' homelon_case_study/website_page/index.html | sed 's/id="//;s/"//' | sort -u > /tmp/section-ids.txt
diff /tmp/toc-ids.txt /tmp/section-ids.txt
grep -o '\.\./visuals/[a-zA-Z0-9_.-]*\.png' homelon_case_study/website_page/index.html | sort -u | sed 's#\.\./visuals/#homelon_case_study/visuals/#' | while read f; do [ -f "$f" ] && echo "OK: $f" || echo "MISSING: $f"; done
```

Expected: empty diff, 12 `OK:` lines, zero `MISSING:`.

- [ ] **Step 2: Confirm no out-of-scope files changed**

The Phase 2 design doc was committed at `4ab1b48` (`docs(homelon-case-study): Phase 2 webpage sketch design doc`), immediately before this plan's Task 1 started. Diff from there to the current commit:

```bash
git diff --stat 4ab1b48..HEAD -- homelon_case_study/
```

Expected: only paths under `homelon_case_study/visuals/`, `homelon_case_study/website_page/`, `homelon_case_study/README.md`, and `homelon_case_study/LOG.md` appear. `homelon_case_study/case-study.md` and any path under `homelon_case_study/screens/` must NOT appear — this plan doesn't touch either.

- [ ] **Step 3: Report the known gaps to the user**

At the end of this plan's execution, tell the user: (1) the metadata strip renders literal "TBD" for Role/Team/Type — same gap as Phase 1, still needs their input; (2) this sketch has not been ported to Next.js and has no chosen "winner," mirroring SplitSmart's own Phase 2 status — ask whether that's acceptable to leave open or whether they want a decision made now.
