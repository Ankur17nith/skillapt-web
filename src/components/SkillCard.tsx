import { useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import type { Skill } from "../types";

export function SkillCard({ skill, hover = false }: { skill: Skill; hover?: boolean }) {
  const navigate = useNavigate();
  const slug = (skill as any).slug || skill.name;
  return (
    <article
      className={`skill-card ${hover ? "hover-example" : ""}`}
      onClick={() => navigate(`/skills/${slug}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") navigate(`/skills/${slug}`);
      }}
      role="link"
      tabIndex={0}
    >
      <div className="skill-head">
        <span className="skill-icon">
          <Icon name="package" />
        </span>
        <code>v{skill.version}</code>
      </div>
      <h3>{skill.name}</h3>
      <span className="author">by @{skill.author}</span>
      <p>{skill.description}</p>
      <div className="tags">
        {skill.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div className="skill-meta">
        <span>{skill.language}</span>
        <span>{skill.compatibility.join(" · ")}</span>
        <span>{skill.updated}</span>
      </div>
    </article>
  );
}
