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

  // Behavior 2: active-section tracking via IntersectionObserver (D-15, replaces sketch scroll-math)
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

export default FloatingDock;
