import { useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import { formatRelativeTime, getSkillLanguage } from "../lib/skills";
import type { Skill } from "../types";

export function SkillListItem({ skill }: { skill: Skill }) {
  const navigate = useNavigate();
  const slug = skill.slug || skill.name;
  const version = skill.version || skill.ref.replace(/^v/, "");
  const updatedText = skill.updatedAt ? formatRelativeTime(skill.updatedAt) : skill.updated;
  const lang = getSkillLanguage(skill);

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
        <code>v{version}</code>
        <span>{lang}</span>
        <span>{skill.compatibility.join(", ")}</span>
        <span>Updated {updatedText}</span>
      </div>
    </article>
  );
}
