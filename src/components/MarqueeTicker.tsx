"use client";

const disciplines = [
  "UX Research",
  "Service Design",
  "Prototyping",
  "User Testing",
  "Information Architecture",
  "Design Systems",
  "Interaction Design",
  "Usability Studies",
];

// Duplicate so the loop is seamless
const items = [...disciplines, ...disciplines];

export function MarqueeTicker() {
  return (
    <div className="marquee-outer" aria-hidden="true">
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={i} className="marquee-item">
            {item}
            <span className="marquee-dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
