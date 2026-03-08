import { type IconType } from "react-icons";
import { SiFigma, SiNotion, SiMiro, SiMaze, SiJira, SiClaude, SiDovetail, SiFramer } from "react-icons/si";

interface Tool {
  icon: IconType | null;
  name: string;
  color: string;
}

interface Phase {
  label: string;
  tools: Tool[];
}

const phases: Phase[] = [
  {
    label: "Research",
    tools: [
      { icon: SiMaze,     name: "Maze",     color: "#FF4F00" },
      { icon: SiDovetail, name: "Dovetail", color: "#6B4FBB" },
      { icon: SiClaude,   name: "Claude",   color: "#D97757" },
    ],
  },
  {
    label: "Design",
    tools: [
      { icon: SiFigma,   name: "Figma",  color: "#F24E1E" },
      { icon: null,      name: "FigJam", color: "#F24E1E" },
      { icon: SiFramer,  name: "Framer", color: "#0055FF" },
      { icon: SiMiro,    name: "Miro",   color: "#FFD02F" },
    ],
  },
  {
    label: "Deliver",
    tools: [
      { icon: SiNotion, name: "Notion", color: "#888" },
      { icon: SiJira,   name: "Jira",   color: "#0052CC" },
    ],
  },
];

export function ProcessAndTools() {
  return (
    <div className="tools-section">
      <div className="tools-section__header">
        <span className="tools-section__label">Tools I work with</span>
        <h2 className="tools-section__heading">Built for every phase</h2>
      </div>
      <div className="tools-section__groups">
        {phases.map(({ label, tools }) => (
          <div key={label} className="tools-phase">
            <span className="tools-phase__label">{label}</span>
            <ul className="tools-phase__list">
              {tools.map(({ icon: Icon, name, color }) => (
                <li key={name} className="tools-item">
                  {Icon
                    ? <Icon size={20} color={color} className="tools-item__icon" />
                    : <span className="tools-item__icon tools-item__icon--placeholder" />
                  }
                  <span className="tools-item__name">{name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
