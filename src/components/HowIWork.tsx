import { FiTarget, FiZap, FiEdit3 } from "react-icons/fi";
import { type IconType } from "react-icons";

interface Principle {
  icon: IconType;
  headline: string;
  body: string;
}

const principles: Principle[] = [
  {
    icon: FiTarget,
    headline: "Start with the problem",
    body: "I resist jumping to solutions until I understand the real constraint.",
  },
  {
    icon: FiZap,
    headline: "Test rough, refine fast",
    body: "Low-fidelity prototypes that get in front of users beat polished specs that don't.",
  },
  {
    icon: FiEdit3,
    headline: "Write to think clearly",
    body: "If I can't explain the design rationale in plain sentences, the thinking isn't done.",
  },
];

export function HowIWork() {
  return (
    <div className="how-i-work-section">
      <div className="how-i-work-section__header">
        <span className="how-i-work-section__label">How I work</span>
        <h2 className="how-i-work-section__heading">A few things I believe in</h2>
      </div>
      <div className="how-i-work">
        {principles.map(({ icon: Icon, headline, body }) => (
          <div key={headline} className="how-i-work__card">
            <Icon size={22} className="how-i-work__icon" />
            <p className="how-i-work__headline">{headline}</p>
            <p className="how-i-work__body">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
