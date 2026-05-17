import {
  Eyebrow,
  DisplayHeading,
  Italic,
  UnderlineAccent,
  TagChip,
} from "@/components/primitives";
import styles from "./page.module.css";

export default function StyleguidePage() {
  return (
    <main>
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section id="hero" className={styles.section}>
        <Eyebrow variant="sans" withPulseDot>
          Product designer · Available May 2026
        </Eyebrow>
        <DisplayHeading as="h1" size="hero">
          I design <Italic>products</Italic> that{" "}
          <UnderlineAccent>feel right</UnderlineAccent> — not just look it.
        </DisplayHeading>
        <p className={styles.heroBody}>
          Combining systems thinking with strong aesthetic taste —{" "}
          <Italic>the kind of design that ships.</Italic>
        </p>
      </section>

      {/* ── Work ────────────────────────────────────────────────── */}
      <section id="work" className={styles.section}>
        <Eyebrow variant="sans">Selected work · 2024–2026</Eyebrow>
        <DisplayHeading as="h2" size="work">
          Selected <Italic>work</Italic>
        </DisplayHeading>
        <div className={styles.tagRow}>
          <TagChip>EDTECH</TagChip>
          <TagChip>STRATEGY</TagChip>
          <TagChip>UI/UX</TagChip>
        </div>
      </section>

      {/* ── About (dark) ────────────────────────────────────────── */}
      <section id="about" className={styles.section} data-darken>
        <Eyebrow variant="italic">About me —</Eyebrow>
        <DisplayHeading as="h2" size="about">
          Five years of <Italic>shipping</Italic>.
        </DisplayHeading>
      </section>

      {/* ── Contact (dark) ──────────────────────────────────────── */}
      <section id="contact" className={styles.section} data-darken>
        <Eyebrow variant="italic">Get in touch —</Eyebrow>
        <DisplayHeading as="h2" size="contact">
          Let&apos;s <Italic>talk</Italic>.
        </DisplayHeading>
      </section>
    </main>
  );
}
