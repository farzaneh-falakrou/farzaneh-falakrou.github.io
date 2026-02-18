"use client";

import { ToolsStrip } from "./ToolsStrip";

const CX = 200, CY = 200, R = 106, NODE_R = 20;

const toRad = (d: number) => d * Math.PI / 180;
const np = (a: number) => ({
  x: +(CX + R * Math.cos(toRad(a))).toFixed(1),
  y: +(CY + R * Math.sin(toRad(a))).toFixed(1),
});

const arc = (fa: number, ta: number) => {
  const f = np(fa + 20), t = np(ta - 20);
  return `M ${f.x} ${f.y} A ${R} ${R} 0 0 1 ${t.x} ${t.y}`;
};

const STEPS = [
  { num: "01", title: "Research", angle: -90 },
  { num: "02", title: "Define",   angle:   0 },
  { num: "03", title: "Design",   angle:  90 },
  { num: "04", title: "Validate", angle: 180 },
];

// Labels sit outside the orbit, clear of the node circle
function labelPos(angle: number, p: { x: number; y: number }) {
  const pad = NODE_R + 20;
  if (angle === -90) return { x: p.x,       y: p.y - pad, anchor: "middle" as const, dy2: 16 };
  if (angle ===   0) return { x: p.x + pad,  y: p.y - 8,  anchor: "start"  as const, dy2: 15 };
  if (angle ===  90) return { x: p.x,       y: p.y + pad, anchor: "middle" as const, dy2: 16 };
  /*  180 */         return { x: p.x - pad,  y: p.y - 8,  anchor: "end"    as const, dy2: 15 };
}

export function ProcessAndTools() {
  return (
    <div className="process-tools-card">

      {/* ── Left: flywheel ── */}
      <div className="process-tools-card__flywheel">
        <span className="process-tools-card__label">My Process</span>

        <svg viewBox="0 0 400 400" className="flywheel-svg"
          aria-label="Iterative design process: Research, Define, Design, Validate">
          <defs>
            {/* Glow for centre circle */}
            <filter id="cg-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="7" result="b"/>
              <feMerge>
                <feMergeNode in="b"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            {/* Radial gradient fill for centre */}
            <radialGradient id="cg-fill" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="var(--brand-background-strong)" stopOpacity="0.55"/>
              <stop offset="100%" stopColor="var(--brand-background-strong)" stopOpacity="0.05"/>
            </radialGradient>
            {/* Arrowhead */}
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
          <circle cx={CX} cy={CY} r={44} fill="url(#cg-fill)" filter="url(#cg-glow)"/>
          <circle cx={CX} cy={CY} r={28}
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
                <circle cx={p.x} cy={p.y} r={NODE_R + 9}
                  fill="none"
                  stroke="var(--brand-background-strong)"
                  strokeWidth="1" strokeOpacity="0.12"/>
                {/* Node circle */}
                <circle cx={p.x} cy={p.y} r={NODE_R}
                  fill="var(--neutral-alpha-medium)"
                  stroke="var(--brand-background-strong)"
                  strokeWidth="1.5" strokeOpacity="0.45"/>

                {/* Step number — brand colour, above title */}
                <text x={lp.x} y={lp.y}
                  textAnchor={lp.anchor} dominantBaseline="middle"
                  fontSize="9" fontWeight="700" letterSpacing="0.1em"
                  fill="var(--brand-background-strong)" opacity="0.9"
                  style={{ fontFamily: "inherit" }}>
                  {s.num}
                </text>
                {/* Step title */}
                <text x={lp.x} y={lp.y + lp.dy2}
                  textAnchor={lp.anchor} dominantBaseline="middle"
                  fontSize="12.5" fontWeight="600"
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
        <ToolsStrip />
      </div>

    </div>
  );
}
