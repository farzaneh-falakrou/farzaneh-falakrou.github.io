const disciplines = [
  "UX Research",
  "Visual Design",
  "Design Systems",
  "Prototyping",
  "Product Strategy",
  "Information Architecture",
  "Workshop Facilitation",
  "Interaction Design",
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
