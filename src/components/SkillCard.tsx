import { Icon } from "./Icon";
import type { Nav, Skill } from "../types";

export function SkillCard({ skill, nav, hover = false }: { skill: Skill; nav: Nav; hover?: boolean }) {
  return (
    <article
      className={`skill-card ${hover ? "hover-example" : ""}`}
      onClick={() => nav("/skills/pdf-summarizer")}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") nav("/skills/pdf-summarizer");
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
