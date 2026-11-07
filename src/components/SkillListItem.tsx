import { useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import type { Skill } from "../types";

export function SkillListItem({ skill }: { skill: Skill }) {
  const navigate = useNavigate();
  const slug = (skill as any).slug || skill.name;
  return (
    <article className="skill-list-item">
      <button className="skill-list-main" onClick={() => navigate(`/skills/${slug}`)}>
        <span className="skill-icon">
          <Icon name="package" size={16} />
        </span>
        <span>
          <strong>{skill.name}</strong>
          <small>@{skill.author}</small>
        </span>
        <p>{skill.description}</p>
      </button>
      <div className="skill-list-details">
        <code>v{skill.version}</code>
        <span>{skill.language}</span>
        <span>{skill.compatibility.join(", ")}</span>
        <span>Updated {skill.updated}</span>
      </div>
    </article>
  );
}
