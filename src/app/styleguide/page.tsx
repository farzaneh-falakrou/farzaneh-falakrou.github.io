import styles from "./page.module.css";

export default function StyleguidePage() {
  return (
    <main>
      <section id="hero" className={styles.section}>
        <h1>Hero placeholder</h1>
        <p>
          This is the hero section of the styleguide. It demonstrates the cream background, Instrument
          Serif heading, and Inter body text. Phase 2 (HOME-01) replaces this with real hero content.
        </p>
      </section>

      <section id="work" className={styles.section}>
        <h2>Work placeholder</h2>
        <p>
          This is the work section of the styleguide. Phase 2 (HOME-03) adds real project cards.
          PLAN 03 wires the TagChip and DisplayHeading primitives into this section.
        </p>
      </section>

      <section id="about" className={styles.section} data-darken>
        <h2>About placeholder</h2>
        <p>
          This is the about section — rendered dark (ink background, cream text) via the data-darken
          attribute. The brand mark does not yet invert over dark sections; PLAN 04 adds mix-blend-difference.
        </p>
      </section>

      <section id="contact" className={styles.section} data-darken>
        <h2>Contact placeholder</h2>
        <p>
          This is the contact section — also dark via data-darken. Phase 2 (HOME-06) adds real contact
          copy. Clicking the floating dock CTA jumps here via native browser anchor behavior.
        </p>
      </section>
    </main>
  );
}
