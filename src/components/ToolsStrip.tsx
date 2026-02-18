"use client";

import { SiFigma, SiNotion, SiMiro, SiMaze, SiJira } from "react-icons/si";
import { Text } from "@once-ui-system/core";

const tools = [
  { icon: SiFigma,  name: "Figma",  color: "#F24E1E" },
  { icon: SiFigma,  name: "FigJam", color: "#8B5CF6" },
  { icon: SiMaze,   name: "Maze",   color: "#FF4F00" },
  { icon: SiMiro,   name: "Miro",   color: "#FFD02F" },
  { icon: SiNotion, name: "Notion", color: "#888" },
  { icon: SiJira,   name: "Jira",   color: "#0052CC" },
];

export function ToolsStrip() {
  return (
    <div className="tools-strip">
      <span className="tools-strip__label">Tools I work with</span>
      <div className="tools-strip__row">
        {tools.map(({ icon: Icon, name, color }) => (
          <div key={name} className="tools-strip__item">
            <Icon size={24} color={color} className="tools-strip__icon" />
            <Text variant="label-default-m" onBackground="neutral-weak">
              {name}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
