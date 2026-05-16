"use client";

import styles from "./FloatingDock.module.css";

/* Stub FloatingDock — static markup only.
   PLAN 04 adds: hide-on-scroll-down, active-section tracking, and smooth-scroll on anchor click. */
export function FloatingDock() {
  return (
    <nav className={styles.dock}>
      <a href="#hero">Home</a>
      <a href="#work">Work</a>
      <a href="#about">About</a>
      <a href="#contact">Contact</a>
      <div className={styles.sep} />
      <a href="#contact" className={styles.cta}>Get in touch ↗</a>
    </nav>
  );
}

export default FloatingDock;
