"use client";

import { useEffect, useState } from "react";
import { RoughNotation } from "react-rough-notation";
import { Column, Heading, Text } from "@once-ui-system/core";
import { home } from "@/resources";

const VIOLET_HIGHLIGHT = "rgba(155, 127, 228, 0.22)";

export function RotatingBadge() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="rotating-badge-wrap"
      style={{
        position: "absolute",
        top: "-10px",
        right: "-60px",
        cursor: "default",
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
          animationDuration: hovered ? "5s" : "12s",
        }}
      >
        <svg viewBox="0 0 100 100" width="120" height="120" aria-hidden="true">
          <defs>
            <path
              id="textCircle"
              d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
            />
          </defs>
          <text fontSize="9.5" fill="#9b7fe4" letterSpacing="2.8" fontWeight="600">
            <textPath href="#textCircle">
              ✦ Open to work · Available now ·{" "}
            </textPath>
          </text>
          <circle cx="50" cy="50" r="6" fill="#9b7fe4" opacity="0.9" />
          <circle cx="50" cy="50" r="3" fill="white" opacity="0.75" />
        </svg>
      </div>
    </div>
  );
}

export function HeroHeadline() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Column fillWidth horizontal="center" align="center" gap="24">
      <Heading wrap="balance" variant="display-strong-l" align="center">
        {home.headline}
      </Heading>

      <Text
        wrap="balance"
        onBackground="neutral-weak"
        variant="body-default-l"
        align="center"
      >
        I&apos;m a{" "}
        <RoughNotation
          type="highlight"
          show={show}
          color={VIOLET_HIGHLIGHT}
          animationDuration={500}
          multiline
        >
          Product Designer
        </RoughNotation>{" "}
        with 6+ years turning complex problems into interfaces people actually use.
        Trained as an architect, now designing digital products — based in Berlin.
      </Text>
    </Column>
  );
}
