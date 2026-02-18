"use client";

import { useEffect, useState } from "react";
import { RoughNotation } from "react-rough-notation";
import { Column, Heading, Text } from "@once-ui-system/core";

const VIOLET = "#9b7fe4";
const VIOLET_HIGHLIGHT = "rgba(155, 127, 228, 0.22)";

export function RotatingBadge() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    // Appear after the hero RevealFx + rough notation have settled
    const timer = setTimeout(() => setVisible(true), 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="rotating-badge-wrap"
      style={{
        position: "absolute",
        top: "-10px",
        right: "-60px",
        cursor: "pointer",
        zIndex: 1,
        opacity: visible ? 1 : 0,
        transition: "opacity 1.2s ease-in-out",
      }}
      aria-label="Open to work"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="rotating-badge"
        style={{
          width: 120,
          height: 120,
          animationDuration: hovered ? "2s" : "12s",
        }}
      >
        <svg viewBox="0 0 100 100" width="120" height="120" aria-hidden="true">
          <defs>
            <path
              id="textCircle"
              d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
            />
          </defs>
          <text fontSize="9.5" fill={VIOLET} letterSpacing="2.8" fontWeight="600">
            <textPath href="#textCircle">
              ✦ Open to work · Available now ·{" "}
            </textPath>
          </text>
          <circle cx="50" cy="50" r="6" fill={VIOLET} opacity="0.9" />
          <circle cx="50" cy="50" r="3" fill="white" opacity="0.75" />
        </svg>
      </div>
    </div>
  );
}

export function HeroHeadline() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Delay so rough notation fires after the RevealFx fade-in settles
    const timer = setTimeout(() => setShow(true), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Column fillWidth horizontal="center" align="center" gap="32">
      <Heading wrap="balance" variant="display-strong-l" align="center">
        Hi, I&apos;m Farzaneh!
      </Heading>

      <Text
        wrap="balance"
        onBackground="neutral-weak"
        variant="heading-default-xl"
        align="center"
      >
        I&apos;m a{" "}
        <RoughNotation
          type="highlight"
          show={show}
          color={VIOLET_HIGHLIGHT}
          animationDuration={600}
          animationDelay={800}
          multiline
        >
          Product Designer
        </RoughNotation>{" "}
        with +6 years of experience in design and project management, skilled in
        user-centered solutions and creative thinking. I&apos;ve led{" "}
        <RoughNotation
          type="underline"
          show={show}
          color={VIOLET}
          strokeWidth={2}
          animationDuration={400}
          animationDelay={1500}
        >
          +20 projects
        </RoughNotation>
        , demonstrating strong leadership in both independent projects and
        cross-functional teams.
      </Text>
    </Column>
  );
}
