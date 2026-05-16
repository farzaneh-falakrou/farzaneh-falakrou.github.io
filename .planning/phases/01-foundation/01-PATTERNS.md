# Phase 1: Foundation — Pattern Map

**Mapped:** 2026-05-16
**Files analyzed:** 28 (creates + rewrites + deletions)
**Analogs found:** 24 / 28 (4 files are net-new with no codebase precedent — anchor to sketch HTML directly)

**Key truth:** The binding pattern source for visuals, CSS, and behavior is `.planning/sketches/006-full-home/index.html`. Existing scaffold contributes only structural patterns (colocated component + module file, App Router conventions, `@/` alias). All Once UI / SCSS / theme code in the existing scaffold is being deleted, not copied.

---

## File Classification

### Creates (new files)

| File | Role | Data Flow | Closest Analog | Match Quality |
|------|------|-----------|----------------|---------------|
| `src/styles/tokens.css` | global token sheet | static import | sketch `index.html` lines 11–27 | exact (verbatim lift) |
| `src/styles/base.css` | global reset | static import | sketch `index.html` lines 28–38 | exact (verbatim lift) |
| `src/components/primitives/Eyebrow.tsx` | primitive component | render-only | `src/components/HeadingLink.tsx` (colocated pattern) | role-match (structure), sketch (visual) |
| `src/components/primitives/Eyebrow.module.css` | primitive style | static import | sketch `.hero-eyebrow`, `.about-head`, `.contact-eyebrow` | exact (visual) |
| `src/components/primitives/DisplayHeading.tsx` | primitive component | render-only | `src/components/HeadingLink.tsx` | role-match |
| `src/components/primitives/DisplayHeading.module.css` | primitive style | static import | sketch `.hero h1`, `.work-title`, `.about-title`, `.contact-title` | exact (visual) |
| `src/components/primitives/Italic.tsx` | primitive component | render-only | `src/components/HeadingLink.tsx` | role-match |
| `src/components/primitives/Italic.module.css` | primitive style | static import | sketch `em` rules across `.hero h1 em`, `.work-name em`, `.about-text em` | exact (visual) |
| `src/components/primitives/UnderlineAccent.tsx` | primitive component | render-only | `src/components/HeadingLink.tsx` | role-match |
| `src/components/primitives/UnderlineAccent.module.css` | primitive style | static import | sketch `.underline-accent` (lines 110–115) | exact (verbatim) |
| `src/components/primitives/PulseDot.tsx` | primitive component | render-only | `src/components/HeadingLink.tsx` | role-match |
| `src/components/primitives/PulseDot.module.css` | primitive style + keyframes | static import | sketch `.pulse-dot` + `@keyframes pulse` (lines 97–101) | exact (verbatim) |
| `src/components/primitives/TagChip.tsx` | primitive component | render-only | `src/components/HeadingLink.tsx` | role-match |
| `src/components/primitives/TagChip.module.css` | primitive style | static import | sketch `.work-tag` (lines 206–210) | exact (verbatim) |
| `src/components/primitives/index.ts` | barrel export | static import | `src/components/index.ts` (existing barrel) | exact (structure) |
| `src/components/chrome/BrandMark.tsx` | chrome component | client side-effect (scroll listener OR pure CSS) | sketch `.brand` JS (lines 656–668); no React analog in repo | sketch-only |
| `src/components/chrome/BrandMark.module.css` | chrome style | static import | sketch `.brand` + `body.dark-section .brand` (lines 55–61) | exact (verbatim) |
| `src/components/chrome/FloatingDock.tsx` | chrome component | client event-driven (scroll + click) | sketch `.dock` JS (lines 619–653); no React analog in repo | sketch-only |
| `src/components/chrome/FloatingDock.module.css` | chrome style | static import | sketch `.dock`, `.dock a`, `.dock-sep`, `.dock-cta` (lines 66–87) | exact (verbatim) |
| `src/app/styleguide/page.tsx` | route page | render-only | `src/app/page.tsx` (existing — but rewrite away from Once UI) | role-match |
| `src/app/styleguide/page.module.css` | page-scoped style | static import | sketch section padding/layout patterns | partial |

### Rewrites (file kept, contents replaced)

| File | Role | Data Flow | Closest Analog | Match Quality |
|------|------|-----------|----------------|---------------|
| `src/app/layout.tsx` | root layout | static composition | existing `src/app/layout.tsx` (strip-and-replace) + Next.js `next/font` standard pattern | role-match |
| `src/app/page.tsx` | route page placeholder | render-only | existing `src/app/page.tsx` (strip Once UI; placeholder text per D-20) | role-match |
| `next.config.mjs` | config | build-time | existing `next.config.mjs` (already wires `@next/mdx`) | exact |
| `package.json` | manifest | n/a | existing `package.json` (remove deps per D-05, D-11) | exact |
| `src/components/index.ts` | barrel | static import | existing `src/components/index.ts` (replace all exports) | exact |

### Deletions (no pattern needed — listed for plan completeness)

| Path | Reason |
|------|--------|
| `src/app/api/authenticate/route.ts` | D-04 |
| `src/app/api/check-auth/route.ts` | D-04 |
| `src/app/api/og/` (fetch, generate, proxy) | D-04 — default = delete (Phase 5 may revisit if SEO needs OG) |
| `src/app/api/rss/route.ts` | D-04 — default = delete |
| `src/app/blog/` (all routes + posts) | D-04 |
| `src/app/gallery/page.tsx` | D-04 |
| `src/app/about/page.tsx` | D-04 (Phase 4 rebuilds) |
| `src/app/work/page.tsx` | D-04 (Phase 3 rebuilds) |
| `src/app/work/[slug]/page.tsx` | D-04 |
| `src/app/work/projects/*.mdx`, `*.md` | D-04 |
| `src/app/not-found.tsx` | D-04 — rewritten in Phase 5; can leave stub or delete (planner decides) |
| `src/components/Mailchimp.tsx` | D-03 |
| `src/components/RouteGuard.tsx` | D-03 |
| `src/components/ThemeToggle.tsx` + `.module.scss` | D-03 |
| `src/components/Header.tsx` + `.module.scss` | D-03 |
| `src/components/Footer.tsx` | D-03 |
| `src/components/FooterCTA.tsx` | D-03 |
| `src/components/HeroHeadline.tsx` | D-03 |
| `src/components/HomeIntro.tsx` | D-03 |
| `src/components/HowIWork.tsx` | D-03 |
| `src/components/MarqueeTicker.tsx` | D-03 |
| `src/components/ProcessAndTools.tsx` | D-03 |
| `src/components/ProjectCard.tsx` + `.module.scss` | D-03 |
| `src/components/Providers.tsx` | D-03 |
| `src/components/StatsStrip.tsx` | D-03 |
| `src/components/HeadingLink.tsx` + `.module.scss` | D-03 |
| `src/components/mdx.tsx` | D-03 (Phase 3 rewrites) |
| `src/components/ScrollToHash.tsx` | D-03 default = delete; dock handles smooth-scroll |
| `src/components/breakpoints.scss` | D-11 (no SCSS) |
| `src/components/about/`, `src/components/blog/`, `src/components/gallery/`, `src/components/work/` | D-03 / D-04 |
| `src/resources/` (all files) | D-06 |
| `src/types/` (all files) | D-06 |
| `src/utils/formatDate.ts`, `src/utils/utils.ts` | D-06 / unused in v1 (planner verify) |

---

## Pattern Assignments

### `src/styles/tokens.css` (global token sheet)

**Analog:** `.planning/sketches/006-full-home/index.html` lines 11–27

**Content to lift verbatim** (sketch lines 11–27):
```css
:root {
  --bg:        #ebe8e2;
  --bg-2:      #e3dfd6;
  --bg-3:      #dcd6c9;
  --ink:       #1a1a1a;
  --ink-2:     #2a2a2a;
  --muted:     #5a5a5a;
  --muted-2:   #8a8a85;
  --line:      #d5d0c5;
  --accent:    #ff5a36;
  --accent-soft: #ffd8c8;
  --surface:   #ffffff;
  --dark:      #1a1612;

  --font-serif: 'Instrument Serif', serif;
  --font-sans:  'Inter', system-ui, sans-serif;
}
```

**Override pattern (Phase 1 specific):** When `next/font` is loaded in `layout.tsx`, it generates `--font-instrument-serif` / `--font-inter` (or whatever variable names are chosen). Override `--font-serif` and `--font-sans` in `tokens.css` to fall back through them:
```css
--font-serif: var(--font-instrument-serif), 'Instrument Serif', serif;
--font-sans:  var(--font-inter), 'Inter', system-ui, sans-serif;
```

Spacing/radius scale (DS-03): not present as named tokens in the sketch — derive from the literal pixel values used throughout (e.g., section padding `80px`, `100px`, `140px`; radii `4px`, `16px`, `24px`, `100px`). Planner decides whether to define `--space-*` and `--radius-*` tokens or leave as literal values in component CSS.

---

### `src/styles/base.css` (global reset)

**Analog:** `.planning/sketches/006-full-home/index.html` lines 28–38

**Content to lift verbatim:**
```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 100%; overflow-x: hidden; }
body {
  font-family: var(--font-sans);
  background: var(--bg);
  color: var(--ink);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}
a { text-decoration: none; color: inherit; }
button { font-family: inherit; cursor: pointer; border: none; background: none; }
```

---

### `src/app/layout.tsx` (rewrite)

**Analog:** existing `src/app/layout.tsx` (file kept, contents wholly replaced) + Next.js `next/font/google` documented pattern.

**Existing imports to delete** (current lines 1–17):
```tsx
import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "@/resources/custom.css";
import classNames from "classnames";
import { Background, Column, Flex, Meta, opacity, RevealFx, SpacingToken } from "@once-ui-system/core";
import { Footer, Header, RouteGuard, Providers } from "@/components";
import { baseURL, effects, fonts, style, dataStyle, home } from "@/resources";
```

**Replacement skeleton** (anchored to D-10, D-12, D-14, D-15):
```tsx
import { Instrument_Serif, Inter } from "next/font/google";
import "@/styles/tokens.css";
import "@/styles/base.css";
import { BrandMark } from "@/components/chrome/BrandMark";
import { FloatingDock } from "@/components/chrome/FloatingDock";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${inter.variable}`}>
      <body>
        <BrandMark />
        {children}
        <FloatingDock />
      </body>
    </html>
  );
}
```

**Notes:**
- No `RouteGuard`, no `Providers`, no Once UI components, no theme-init inline script.
- `generateMetadata` can stay in Phase 1 as a stub or be deferred to Phase 5 (SEO-01). Planner picks.
- Dock and BrandMark are global, mounted once here, applied to all routes — including `/styleguide`.

---

### `src/app/page.tsx` (rewrite — placeholder per D-20)

**Analog:** existing `src/app/page.tsx` (replace entire contents).

**Replacement (simplest valid placeholder):**
```tsx
export default function Home() {
  return (
    <main style={{ padding: "120px 80px" }}>
      <p>Foundation in place. See <a href="/styleguide">/styleguide</a>.</p>
    </main>
  );
}
```

Planner may opt for a redirect to `/styleguide` instead — either is fine per D-20.

---

### `src/components/primitives/*.tsx` + `*.module.css` (6 primitives)

**Structural analog (TSX side):** `src/components/HeadingLink.tsx` (lines 1–6) — established colocated client/server component pattern with module import.

**Import pattern from analog** (HeadingLink.tsx lines 1–6, adapted to `.module.css`):
```tsx
import React from "react";
import styles from "./Eyebrow.module.css";
```

Most primitives are server components (no `"use client"` needed) since they're render-only. Only add `"use client"` if a primitive needs hooks (none in this list do).

**Visual analog (CSS side):** the sketch. Lift exact rules.

#### `Eyebrow.tsx` / `Eyebrow.module.css`

**Sketch source — sans variant** (lines 93–96, `.hero-eyebrow`):
```css
.eyebrow-sans {
  display: flex; align-items: center; gap: 12px;
  font-size: 13px; color: var(--muted);
}
```

**Sketch source — italic-serif variant** (lines 233–236, `.about-head` and `.contact-eyebrow` lines 293–296):
```css
.eyebrow-italic {
  font-family: var(--font-serif); font-style: italic;
  color: var(--accent); font-size: 22px;
}
```

**Props shape** (planner-locked, derived from sketch usage):
```tsx
interface EyebrowProps {
  variant?: "sans" | "italic";   // default "sans"
  withPulseDot?: boolean;         // composes PulseDot
  children: React.ReactNode;
}
```

#### `DisplayHeading.tsx` / `DisplayHeading.module.css`

**Sketch source — hero h1 (lines 103–109):**
```css
.display {
  font-family: var(--font-serif);
  font-weight: 400;
  letter-spacing: -0.04em;
  line-height: 0.92;
}
.display em { font-style: italic; color: var(--accent); }
.size-hero  { font-size: clamp(72px, 10vw, 168px); }
.size-work  { font-size: clamp(48px, 6vw,  80px);  line-height: 1; }
.size-about { font-size: clamp(48px, 6vw,  84px);  line-height: 1.04; letter-spacing: -0.025em; }
.size-contact { font-size: clamp(56px, 8vw, 120px); line-height: 1; letter-spacing: -0.035em; }
```

**Props shape:**
```tsx
interface DisplayHeadingProps {
  as?: "h1" | "h2" | "h3";       // semantic level
  size?: "hero" | "work" | "about" | "contact";
  children: React.ReactNode;     // supports inline <em> via Italic primitive
}
```

#### `Italic.tsx` / `Italic.module.css`

**Sketch source** — `em` rules vary by container size. Italic primitive normalizes them:
- `.hero h1 em` (line 109): italic + accent (in display context)
- `.hero-sub-text em` (line 122): font 21px, serif italic (in body context)
- `.work-name em` (line 200), `.about-title em` (line 247), `.contact-title em` (line 303): italic + accent
- `.work-desc em` (line 205): font 17px serif italic (in body context — no accent)
- `.about-text em` (line 252): font 20px serif italic (in body context)

**Rules:** When nested inside a `DisplayHeading`, `<em>` inherits the heading's size and adds `color: var(--accent)` only. When standalone in body text, switches font-family to serif and bumps size by ~2px.

Planner decides whether `Italic` always renders `<em>` and lets parent CSS govern, or accepts a `tone="accent" | "body"` prop. Recommendation: just render `<em>` and let the parent component's `.module.css` style `em` descendants. This matches the sketch's CSS-driven approach.

#### `UnderlineAccent.tsx` / `UnderlineAccent.module.css`

**Sketch source verbatim** (lines 110–115):
```css
.underline-accent {
  text-decoration: underline;
  text-decoration-thickness: 3px;
  text-underline-offset: 8px;
  text-decoration-color: var(--accent);
}
```

**TSX:** wrap children in `<span className={styles.underline}>`.

#### `PulseDot.tsx` / `PulseDot.module.css`

**Sketch source verbatim** (lines 97–101):
```css
.pulse-dot {
  width: 8px; height: 8px; border-radius: 50%; background: var(--accent);
  display: inline-block; animation: pulse 2s infinite;
}
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
```

**TSX:** `<span className={styles.dot} aria-hidden />`. No props.

#### `TagChip.tsx` / `TagChip.module.css`

**Sketch source verbatim** (lines 206–210):
```css
.tag {
  padding: 5px 12px; border: 1px solid var(--line); border-radius: 100px;
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted);
}
```

**TSX:** `<span className={styles.tag}>{children}</span>`.

#### `src/components/primitives/index.ts` (barrel)

**Analog:** existing `src/components/index.ts` line-style:
```ts
export { Eyebrow } from "./Eyebrow";
export { DisplayHeading } from "./DisplayHeading";
export { Italic } from "./Italic";
export { UnderlineAccent } from "./UnderlineAccent";
export { PulseDot } from "./PulseDot";
export { TagChip } from "./TagChip";
```

---

### `src/components/chrome/BrandMark.tsx` + `BrandMark.module.css`

**Analog:** sketch `.brand` CSS (lines 55–61) + sketch script (lines 656–668). No React precedent in repo.

**CSS — lift verbatim** (sketch lines 55–61):
```css
.brand {
  position: fixed; top: 60px; left: 40px; z-index: 60;
  font-family: var(--font-serif); font-style: italic; font-size: 22px;
  color: var(--ink);
  transition: color 0.3s;
}
body.dark-section .brand,
.brand[data-dark="true"] { color: var(--bg); }
```

**Two-path implementation (D-14 — planner's discretion):**

**Path A — `mix-blend-difference`** (preferred per D-14 and roadmap SC #5):
```css
.brand {
  position: fixed; top: 60px; left: 40px; z-index: 60;
  font-family: var(--font-serif); font-style: italic; font-size: 22px;
  color: var(--bg);                  /* light cream — blends to ink over cream sections */
  mix-blend-mode: difference;
}
```
TSX is pure markup — no client hooks, no scroll listener:
```tsx
export function BrandMark() {
  return <div className={styles.brand}>Farzaneh</div>;
}
```
This is a server component. Dark sections (Contact, Footer) get `data-darken` for semantic clarity even though the brand mark doesn't read it under this approach. Planner verifies `mix-blend-difference` produces the expected ink color over the cream `#ebe8e2` background and accent color over `#1a1a1a` dark sections.

**Path B — JS scroll listener** (sketch's approach, lines 656–668):
```tsx
"use client";
import { useEffect } from "react";
import styles from "./BrandMark.module.css";

export function BrandMark() {
  useEffect(() => {
    const darkSections = document.querySelectorAll("[data-darken]");
    const onScroll = () => {
      const y = window.scrollY + 80;
      let inDark = false;
      darkSections.forEach((s) => {
        const el = s as HTMLElement;
        if (y >= el.offsetTop && y < el.offsetTop + el.offsetHeight) inDark = true;
      });
      document.body.classList.toggle("dark-section", inDark);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className={styles.brand}>Farzaneh</div>;
}
```
Recommendation: implement Path A first; fall back to Path B only if visual verification on `/styleguide` shows blending breaks.

**Brand text:** literal string `Farzaneh` (sketch line 369, confirmed in CONTEXT specifics).

---

### `src/components/chrome/FloatingDock.tsx` + `FloatingDock.module.css`

**Analog:** sketch `.dock` CSS (lines 66–87) + sketch JS (lines 619–653). No React precedent in repo.

**CSS — lift verbatim** (sketch lines 66–87):
```css
.dock {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  z-index: 60;
  background: rgba(26,26,26,0.92); backdrop-filter: blur(10px);
  padding: 6px;
  border-radius: 100px;
  display: flex; gap: 2px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  transition: transform 0.3s ease;
}
.dock.hidden { transform: translate(-50%, 120px); }
.dock a {
  padding: 10px 22px; font-size: 13px; color: #e8e5df;
  border-radius: 100px; transition: all 0.15s;
  display: flex; align-items: center; gap: 8px;
  cursor: pointer;
}
.dock a:hover { background: #2a2a2a; color: var(--accent); }
.dock a.active { background: var(--accent); color: var(--ink); }
.dock-sep { width: 1px; background: #3a3a3a; margin: 6px 4px; }
.dock-cta { background: var(--accent); color: var(--ink); font-weight: 500; }
.dock-cta:hover { background: #ffaa8a; color: var(--ink); }
```

**TSX skeleton — three behaviors from sketch JS** (lines 619–653), with `IntersectionObserver` replacing the scroll-math active-section tracking per D-15:
```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./FloatingDock.module.css";

const SECTIONS = ["hero", "work", "about", "contact"] as const;

export function FloatingDock() {
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string>("hero");
  const lastY = useRef(0);

  // Behavior 1: hide on scroll-down, reveal on scroll-up (sketch lines 621–629)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY.current && y > 200) setHidden(true);
      else setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Behavior 2: active-section tracking via IntersectionObserver (replaces sketch scroll-math)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-33% 0px -33% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Behavior 3: smooth-scroll on anchor click (sketch lines 647–652)
  const onClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`${styles.dock} ${hidden ? styles.hidden : ""}`}>
      {SECTIONS.map((id) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={onClick(id)}
          className={active === id ? styles.active : ""}
        >
          {id === "hero" ? "Home" : id.charAt(0).toUpperCase() + id.slice(1)}
        </a>
      ))}
      <div className={styles.sep} />
      <a href="#contact" onClick={onClick("contact")} className={styles.cta}>
        Get in touch ↗
      </a>
    </nav>
  );
}
```

**Notes:**
- Section IDs locked: `hero`, `work`, `about`, `contact` (D-15). On `/styleguide` these are stub sections; on `/` (Phase 2) they're real.
- CTA copy: `Get in touch ↗` verbatim (sketch line 378, CONTEXT specifics).
- Cross-page anchor behavior (clicking `Work` from `/about`) is deferred per CONTEXT deferred-ideas. On `/styleguide` and `/`, anchors target same-page sections.

---

### `src/app/styleguide/page.tsx` + `page.module.css`

**Analog (structural):** existing `src/app/page.tsx` (route file shape), but rewritten to import primitives directly.

**Purpose** (D-18): Demonstrate every primitive variant + dock active tracking + brand mark inversion. Includes stub sections `#hero`, `#work`, `#about`, `#contact` so the dock has anchors to track.

**Skeleton:**
```tsx
import {
  Eyebrow, DisplayHeading, Italic, UnderlineAccent, PulseDot, TagChip,
} from "@/components/primitives";
import styles from "./page.module.css";

export default function StyleguidePage() {
  return (
    <main>
      <section id="hero" className={styles.section}>
        <Eyebrow variant="sans" withPulseDot>Product designer · Available May 2026</Eyebrow>
        <DisplayHeading as="h1" size="hero">
          I design <Italic>products</Italic> that <UnderlineAccent>feel right</UnderlineAccent> —
          not just look it.
        </DisplayHeading>
        {/* show body-text Italic variant */}
      </section>
      <section id="work" className={styles.section}>
        <DisplayHeading as="h2" size="work">Selected <Italic>work</Italic></DisplayHeading>
        <div>
          <TagChip>EDTECH</TagChip><TagChip>STRATEGY</TagChip><TagChip>UI</TagChip>
        </div>
      </section>
      <section id="about" className={styles.section} data-darken>
        {/* dark section to verify brand-mark inversion */}
        <Eyebrow variant="italic">About me —</Eyebrow>
        <DisplayHeading as="h2" size="about">Five years of <Italic>shipping</Italic>.</DisplayHeading>
      </section>
      <section id="contact" className={styles.section} data-darken>
        <Eyebrow variant="italic">Get in touch —</Eyebrow>
        <DisplayHeading as="h2" size="contact">Let's <Italic>talk</Italic>.</DisplayHeading>
      </section>
      {/* Optional: MDX render proof per D-17 */}
    </main>
  );
}
```

**CSS module:** sketch-derived section padding (`140px 80px 100px` for hero, `60px 80px 100px` for work, etc.). Dark sections set `background: var(--ink); color: var(--bg);` to mirror sketch `.contact` / `.footer` so brand-mark inversion can be verified.

**Note on `data-darken`:** the BrandMark Path B JS reads this attribute. Path A (`mix-blend-difference`) doesn't need it but having it on dark sections is harmless and semantically correct.

---

### MDX proof of life (D-16, D-17)

**Decision required of planner:** `@next/mdx` (file-based) vs `next-mdx-remote` (programmatic). CONTEXT recommends `@next/mdx`.

**Analog (config):** existing `next.config.mjs` already wires `@next/mdx`:
```js
import mdx from "@next/mdx";
const withMDX = mdx({ extension: /\.mdx?$/, options: {} });
const nextConfig = { pageExtensions: ["ts", "tsx", "md", "mdx"], /* ... */ };
export default withMDX(nextConfig);
```
This config can stay almost verbatim (remove `sassOptions` per D-11; remove `transpilePackages: ["next-mdx-remote"]` if `next-mdx-remote` is dropped per D-05 path).

**Proof-of-life file:** per D-17, drop one MDX page somewhere under `/styleguide` (e.g., `src/app/styleguide/mdx-test/page.mdx`) with a heading + paragraph + `<em>`. No custom component map in Phase 1; Phase 3 will add one. Default MDX renders standard HTML, which inherits styles from `base.css` / `tokens.css`.

**Dependency cleanup** (per D-05):
- Keep: `@mdx-js/loader`, `@next/mdx`, `gray-matter`
- Drop: `next-mdx-remote` (unless planner chooses the remote path — then drop `@next/mdx` instead)

---

### `next.config.mjs` (rewrite)

**Analog:** existing `next.config.mjs` (lines 1–27).

**Changes:**
1. Remove `sassOptions` block (D-11).
2. Remove `transpilePackages: ["next-mdx-remote"]` if dropping that dep.
3. Keep `pageExtensions` and `withMDX` wrapper.
4. Keep or drop `images.remotePatterns` based on whether `www.google.com` is still referenced anywhere (it's a leftover from previous case studies — drop it; add back when Phase 3 needs remote images).

**Result skeleton:**
```js
import mdx from "@next/mdx";

const withMDX = mdx({ extension: /\.mdx?$/, options: {} });

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

export default withMDX(nextConfig);
```

---

### `package.json` (rewrite)

**Analog:** existing `package.json`.

**Remove deps** (D-05, D-11):
- `@once-ui-system/core`
- `cookie`, `@types/cookie`
- `transliteration`
- `react-icons`
- `react-rough-notation`
- `sass`
- `next-mdx-remote` (if `@next/mdx` chosen per D-16; otherwise drop `@next/mdx`)
- `tzdata` (verify — appears unused without Once UI)

**Keep:** `next`, `react`, `react-dom`, `@mdx-js/loader`, `@next/mdx`, `gray-matter`, `classnames`, `lint-staged`, `@biomejs/biome`, `eslint`, `eslint-config-next`, `typescript`, `@types/node`, `@types/react`, `@types/react-dom`.

**Verify `classnames`:** keep only if any new primitive actually uses it. Tiny dep, fine to keep.

**Verify `gray-matter`:** only needed once MDX with frontmatter exists. Phase 3 will use it. Keep.

**Rename:** `"name": "@once-ui-system/magic-portfolio"` → something like `"farzaneh-portfolio"` (cosmetic, planner's call).

---

### `src/components/index.ts` (rewrite)

**Analog:** existing `src/components/index.ts` (10 lines, all reexports).

**Replacement:**
```ts
// Chrome
export { BrandMark } from "@/components/chrome/BrandMark";
export { FloatingDock } from "@/components/chrome/FloatingDock";

// Primitives — re-exported from primitives barrel
export * from "@/components/primitives";
```

Planner may prefer dropping this barrel entirely and importing directly from `@/components/primitives` and `@/components/chrome/*`. Either way, the existing barrel cannot survive untouched.

---

## Shared Patterns

### Colocated component + CSS Module

**Source:** existing pair `src/components/HeadingLink.tsx` + `src/components/HeadingLink.module.scss` (being deleted, but the *pattern* survives).

**Apply to:** every component file in `src/components/primitives/` and `src/components/chrome/`.

**Import convention** (HeadingLink.tsx line 6):
```tsx
import styles from "@/components/HeadingLink.module.scss";   // existing
import styles from "./Eyebrow.module.css";                    // Phase 1 (relative is also fine — both work)
```
Phase 1 uses `.module.css` (D-07, D-11). Relative imports are preferred for colocated modules — Next.js conventions agree.

### `@/` path alias

**Source:** existing `tsconfig.json` lines 28–32 — `"@/*": ["./src/*"]`.

**Apply to:** any cross-directory imports (e.g., `import { Eyebrow } from "@/components/primitives"` from `src/app/styleguide/page.tsx`). Colocated/sibling imports use relative paths.

### `"use client"` boundary

**Source:** `src/components/HeadingLink.tsx` line 1 (`"use client";`) and `src/components/ScrollToHash.tsx` line 1.

**Apply to:** only the chrome components that use hooks/event listeners (`FloatingDock` always; `BrandMark` only if Path B is chosen). All primitives stay server components.

### App Router conventions

**Source:** existing `src/app/` structure (`layout.tsx`, `page.tsx`, route folders).

**Apply to:** `src/app/styleguide/page.tsx` follows the same shape as existing `src/app/page.tsx` (just a default-exported page component).

### Sketch as binding visual spec

**Source:** `.planning/sketches/006-full-home/index.html` — every CSS rule, every animation, every pixel value.

**Apply to:** every `.module.css` file in this phase. Where the sketch has a literal value (e.g., `padding: 10px 22px` on dock anchors), use that literal value. Do not invent new values.

---

## No Analog Found

Files with no codebase precedent — anchored only to the sketch:

| File | Role | Reason |
|------|------|--------|
| `src/components/chrome/BrandMark.tsx` | chrome (mix-blend or scroll-flip) | New visual mechanism; sketch is the spec |
| `src/components/chrome/FloatingDock.tsx` | chrome (scroll/click event-driven nav) | Existing `Header.tsx` is a top-bar pill nav with no scroll-hide / no active-section tracking — different enough that it's not a useful analog |
| `src/styles/tokens.css` | global token sheet | Existing tokens come from `@once-ui-system/core/css/tokens.css` (deleted) — fully new |
| `src/styles/base.css` | global reset | Existing reset comes from Once UI bundle — fully new |

Planner should reference the sketch HTML directly for these four. Code excerpts in this document are the most that can be lifted faithfully.

---

## Metadata

**Analog search scope:**
- `src/app/**`
- `src/components/**`
- `src/resources/**` (confirmed Once UI only)
- `next.config.mjs`, `tsconfig.json`, `package.json`
- `.planning/sketches/006-full-home/index.html` (binding spec)

**Files scanned:** ~30 source files in current scaffold + sketch HTML (672 lines).

**Pattern extraction date:** 2026-05-16

---

## PATTERN MAPPING COMPLETE

**Phase:** 01 - foundation
**Files classified:** 28 (21 creates, 5 rewrites, ~30 deletions enumerated)
**Analogs found:** 24 / 28

### Coverage
- Files with exact/verbatim sketch analog: 14 (all primitive `.module.css` + tokens + base + chrome CSS)
- Files with role-match structural analog: 10 (TSX shells use existing colocated component pattern, layout/page use existing App Router files)
- Files with no analog: 4 (BrandMark.tsx, FloatingDock.tsx, tokens.css, base.css — sketch-only)

### Key Patterns Identified
- Sketch HTML at `.planning/sketches/006-full-home/index.html` is the single source of truth for all CSS, animation, and chrome behavior — every `.module.css` in this phase lifts rules verbatim from labeled line ranges
- Colocated `Foo.tsx` + `Foo.module.css` with relative import (`import styles from "./Foo.module.css"`) is the locked component shape; primitives stay as server components, chrome components opt in to `"use client"` only when they need scroll/event hooks
- Existing `src/app/layout.tsx` is rewritten in place: strip all Once UI imports, replace with `next/font/google` + global CSS + `<BrandMark />` + `<FloatingDock />`; the file path stays the same, the content is wholly new
- D-14 brand-mark mechanism is a binary planner choice (`mix-blend-difference` Path A vs JS scroll-flip Path B) — both paths are spelled out concretely in this document; recommendation Path A
- D-15 dock active-section tracking upgrades from sketch's scroll-math to `IntersectionObserver` while keeping the same visible behavior; section IDs locked to `hero`, `work`, `about`, `contact`

### File Created
`.planning/phases/01-foundation/01-PATTERNS.md`

### Ready for Planning
Pattern mapping complete. Planner can reference analog patterns and sketch line ranges directly in PLAN.md action sections.
