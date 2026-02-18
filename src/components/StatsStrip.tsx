"use client";

import { useEffect, useState } from "react";
import { Column, Heading, Row, Text } from "@once-ui-system/core";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  highlight?: boolean;
}

const stats: Stat[] = [
  { value: 6,   suffix: "+", label: "Years of experience" },
  { value: 20,  suffix: "+", label: "Projects led" },
  { value: 3,   suffix: "",  label: "Countries worked in" },
  { value: 100, suffix: "%", label: "User-centred", highlight: true },
];

const gradientStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #9b7fe4 0%, #c4b5fd 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

// Spring physics simulation — feels organic because it mimics real physical motion.
// velocity accumulates toward the target, then naturally decelerates and settles.
// stiffness: how strongly the spring pulls (higher = faster)
// damping:   how much velocity is preserved each frame (lower = more friction)
function useSpring(target: number, started: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!started) return;

    let rafId: number;
    let position = 0;
    let velocity = 0;
    const stiffness = 0.005;
    const damping   = 0.88;

    const tick = () => {
      velocity = velocity * damping + (target - position) * stiffness;
      position = Math.min(position + velocity, target);

      setValue(Math.round(position));

      if (Math.abs(target - position) > 0.05 || Math.abs(velocity) > 0.05) {
        rafId = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [started, target]);

  return value;
}

function StatItem({ stat, delay = 0, started }: { stat: Stat; delay?: number; started: boolean }) {
  const numberStyle = stat.highlight ? gradientStyle : undefined;
  const [delayedStart, setDelayedStart] = useState(false);

  useEffect(() => {
    if (!started) return;
    const timer = setTimeout(() => setDelayedStart(true), delay);
    return () => clearTimeout(timer);
  }, [started, delay]);

  const value = useSpring(stat.value, delayedStart);

  return (
    <Column horizontal="center" align="center" gap="4">
      <Heading variant="display-strong-m" onBackground="neutral-strong">
        {/* Ghost reserves the final value's width permanently */}
        <span style={{ position: "relative", display: "inline-block" }}>
          <span style={{ visibility: "hidden" }}>{stat.value}{stat.suffix}</span>
          <span style={{ position: "absolute", inset: 0, textAlign: "center", ...numberStyle }}>{value}{stat.suffix}</span>
        </span>
      </Heading>
      <Text variant="body-default-s" onBackground="neutral-weak" align="center">
        {stat.label}
      </Text>
    </Column>
  );
}

export function StatsStrip() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Wait for RevealFx to fully finish before starting
    const timer = setTimeout(() => setStarted(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Row fillWidth horizontal="center" gap="xl" wrap>
      {stats.map((stat, i) => (
        <StatItem key={stat.label} stat={stat} started={started} delay={i * 120} />
      ))}
    </Row>
  );
}
