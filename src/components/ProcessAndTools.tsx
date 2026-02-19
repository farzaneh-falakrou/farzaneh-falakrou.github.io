"use client";

import { ToolsStrip } from "./ToolsStrip";

const CX = 250, CY = 250, R = 110, NODE_R = 22;
const HALO_R = NODE_R + 9;        // 31
const LABEL_FROM_CENTER = HALO_R + 16; // 47 — halo edge + 16px gap

const toRad = (d: number) => d * Math.PI / 180;
const np = (a: number) => ({
  x: +(CX + R * Math.cos(toRad(a))).toFixed(1),
  y: +(CY + R * Math.sin(toRad(a))).toFixed(1),
});

const arc = (fa: number, ta: number) => {
  const f = np(fa + 22), t = np(ta - 22);
  return `M ${f.x} ${f.y} A ${R} ${R} 0 0 1 ${t.x} ${t.y}`;
};

const STEPS = [
  { num: "01", title: "Research", angle: -90 },
  { num: "02", title: "Define",   angle:   0 },
  { num: "03", title: "Design",   angle:  90 },
  { num: "04", title: "Validate", angle: 180 },
];

interface LabelPos {
  numX: number; numY: number;
  titleX: number; titleY: number;
  anchor: "start" | "middle" | "end";
}

function labelPos(angle: number, p: { x: number; y: number }): LabelPos {
  const d = LABEL_FROM_CENTER;
  if (angle === -90) return {
    numX: p.x,     numY: p.y - d - 20,
    titleX: p.x,   titleY: p.y - d,
    anchor: "middle",
  };
  if (angle === 0) return {
    numX: p.x + d, numY: p.y - 11,
    titleX: p.x + d, titleY: p.y + 11,
    anchor: "start",
  };
  if (angle === 90) return {
    numX: p.x,     numY: p.y + d,
    titleX: p.x,   titleY: p.y + d + 20,
    anchor: "middle",
  };
  return {
    numX: p.x - d, numY: p.y - 11,
    titleX: p.x - d, titleY: p.y + 11,
    anchor: "end",
  };
}

export function ProcessAndTools() {
  return (
    <div className="process-tools-card">

      {/* ── Left: flywheel ── */}
      <div className="process-tools-card__flywheel">
        <span className="process-tools-card__label">My Process</span>

        <svg viewBox="0 0 500 500" className="flywheel-svg"
          aria-label="Iterative design process: Research, Define, Design, Validate">
          <defs>
            <filter id="cg-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="8" result="b"/>
              <feMerge>
                <feMergeNode in="b"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <radialGradient id="cg-fill" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="var(--brand-background-strong)" stopOpacity="0.55"/>
              <stop offset="100%" stopColor="var(--brand-background-strong)" stopOpacity="0.05"/>
            </radialGradient>
            <marker id="fw-arr" markerWidth="8" markerHeight="8"
              refX="6" refY="4" orient="auto">
              <polygon points="0 0, 8 4, 0 8"
                fill="var(--brand-background-strong)" opacity="0.85"/>
            </marker>
          </defs>

          {/* Orbit ring — very subtle dashed */}
          <circle cx={CX} cy={CY} r={R} fill="none"
            stroke="var(--neutral-alpha-weak)" strokeWidth="1" strokeDasharray="2 10"/>

          {/* Arc arrows — animated dashes flow clockwise */}
          {STEPS.map((s, i) => (
            <path key={i}
              className={`flywheel-arc flywheel-arc-${i}`}
              d={arc(s.angle, STEPS[(i + 1) % STEPS.length].angle)}
              fill="none"
              stroke="var(--brand-background-strong)"
              strokeWidth="2"
              strokeOpacity="0.65"
              markerEnd="url(#fw-arr)"
            />
          ))}

          {/* Centre — glow + ring */}
          <circle cx={CX} cy={CY} r={48} fill="url(#cg-fill)" filter="url(#cg-glow)"/>
          <circle cx={CX} cy={CY} r={30}
            fill="var(--brand-alpha-weak)"
            stroke="var(--brand-background-strong)"
            strokeWidth="1" strokeOpacity="0.3"/>

          {/* Step nodes + outer labels */}
          {STEPS.map((s) => {
            const p  = np(s.angle);
            const lp = labelPos(s.angle, p);
            return (
              <g key={s.num}>
                {/* Outer halo */}
                <circle cx={p.x} cy={p.y} r={HALO_R}
                  fill="none"
                  stroke="var(--brand-background-strong)"
                  strokeWidth="1" strokeOpacity="0.12"/>
                {/* Node circle */}
                <circle cx={p.x} cy={p.y} r={NODE_R}
                  fill="var(--neutral-alpha-medium)"
                  stroke="var(--brand-background-strong)"
                  strokeWidth="1.5" strokeOpacity="0.45"/>

                {/* Step number */}
                <text x={lp.numX} y={lp.numY}
                  textAnchor={lp.anchor} dominantBaseline="middle"
                  fontSize="13" fontWeight="700" letterSpacing="0.1em"
                  fill="var(--brand-background-strong)" opacity="0.9"
                  style={{ fontFamily: "inherit" }}>
                  {s.num}
                </text>
                {/* Step title */}
                <text x={lp.titleX} y={lp.titleY}
                  textAnchor={lp.anchor} dominantBaseline="middle"
                  fontSize="18" fontWeight="600"
                  fill="currentColor"
                  style={{ fontFamily: "inherit" }}>
                  {s.title}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Right: tools ── */}
      <div className="process-tools-card__tools">
        <span className="process-tools-card__label">Tools I work with</span>
        <ToolsStrip />
      </div>

    </div>
  );
}
