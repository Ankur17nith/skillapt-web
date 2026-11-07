import { Icon } from "./Icon";
import type { Nav, Skill } from "../types";

export function SkillListItem({ skill, nav }: { skill: Skill; nav: Nav }) {
  return (
    <article className="skill-list-item">
      <button className="skill-list-main" onClick={() => nav("/skills/pdf-summarizer")}>
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
