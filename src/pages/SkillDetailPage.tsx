import { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "../components/Link";
import { Icon } from "../components/Icon";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";
import { CopyCommand } from "../components/CopyCommand";
import { CodeBlock } from "../components/CodeBlock";
import { ReportModal } from "../components/ReportModal";
import { SectionTitle } from "../components/SectionTitle";
import { SkillCard } from "../components/SkillCard";
import { skills } from "../data/initialData";

export function SkillDetailPage({ notify }: { notify?: () => void }) {
  const { slug } = useParams<{ slug: string }>();
  const skill = skills.find((s) => s.name === slug) || skills[0];
  const [tab, setTab] = useState("README");
  const [installMode, setInstallMode] = useState("skillpm");
  const [report, setReport] = useState(false);

  const skillName = skill.name;
  const authorName = skill.author;

  const installCommands: Record<string, string> = {
    skillpm: `skillpm install ${authorName}/${skillName}`,
    npx: `npx skillpm install ${authorName}/${skillName}`,
    manual: `git clone github.com/${authorName}/${skillName}`,
  };

  return (
    <main className="shell page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/browse">Browse</Link>
        <span>/</span>
        <span>{skillName}</span>
      </div>
      <div className="detail-grid">
        <article className="detail-main">
          <div className="detail-title">
            <span className="large-icon">
              <Icon name="package" />
            </span>
            <div>
              <div>
                <h1>{skillName}</h1>
              </div>
              <p>by @{authorName}</p>
            </div>
          </div>
          <p className="lead">{skill.description}</p>
          <div className="tags">
            {skill.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <dl className="metadata">
            <div>
              <dt>Version</dt>
              <dd>{skill.version}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>May 24, 2025</dd>
            </div>
            <div>
              <dt>License</dt>
              <dd>MIT</dd>
            </div>
          </dl>
          <div className="tabs">
            {["README", "Versions", "Security"].map((t) => (
              <button className={tab === t ? "active" : ""} onClick={() => setTab(t)} key={t}>
                {t}
              </button>
            ))}
          </div>
          {tab === "README" && (
            <div className="markdown">
              <Logo variant="full" />
              <h2>{skillName.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}</h2>
              <p>{skill.description}</p>
              <h3>Installation</h3>
              <CodeBlock>{`skillpm install ${authorName}/${skillName}`}</CodeBlock>
              <h3>What it can do</h3>
              <ul>
                <li>Extract text from local and remote PDF files</li>
                <li>Return summaries with page-level citations</li>
                <li>Answer questions using only the supplied document</li>
              </ul>
              <h3>Usage</h3>
              <CodeBlock>{`agent.use("${skillName}", {\n  file: "./annual-report.pdf",\n  format: "brief"\n})`}</CodeBlock>
            </div>
          )}
          {tab === "Versions" && (
            <div className="tab-panel">
              <h2>Version history</h2>
              <p>{skill.version} — Improved citation accuracy and large-file handling.</p>
            </div>
          )}
          {tab === "Security" && (
            <div className="security-panel">
              <h2>Security report</h2>
              <div>
                <Icon name="check" />{" "}
                <span>
                  <strong>Scanned</strong> No known issues found
                </span>
              </div>
              <div className="warning">
                <span>!</span>
                <span>
                  <strong>Permissions requested</strong> File read and network access
                </span>
              </div>
              <div>
                <Icon name="check" />
                <span>
                  <strong>Last scan date</strong> May 24, 2025
                </span>
              </div>
            </div>
          )}
        </article>
        <aside className="install-panel">
          <div className="mini-tabs">
            {Object.keys(installCommands).map((mode) => (
              <button
                className={installMode === mode ? "active" : ""}
                onClick={() => setInstallMode(mode)}
                key={mode}
              >
                {mode}
              </button>
            ))}
          </div>
          <CopyCommand command={installCommands[installMode]} notify={notify || (() => {})} />
          <Button onClick={() => window.open(`https://github.com/${authorName}/${skillName}`, "_blank")}>
            View on GitHub
          </Button>
          <Button variant="ghost" onClick={() => setReport(true)}>
            Report
          </Button>
          <dl className="package-facts">
            <div>
              <dt>Version</dt>
              <dd>{skill.version}</dd>
            </div>
            <div>
              <dt>License</dt>
              <dd>MIT</dd>
            </div>
            <div>
              <dt>Language</dt>
              <dd>{skill.language}</dd>
            </div>
            <div>
              <dt>Repository</dt>
              <dd>{authorName}/{skillName}</dd>
            </div>
            <div>
              <dt>Dependencies</dt>
              <dd>pdf.js, zod</dd>
            </div>
          </dl>
          <div className="compatibility">
            <strong>Compatibility</strong>
            {skill.compatibility.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        </aside>
      </div>
      <section className="related">
        <SectionTitle title="Related skills" />
        <div className="card-grid">
          {skills
            .filter((s) => s.name !== skillName)
            .slice(0, 3)
            .map((s) => (
              <SkillCard key={s.name} skill={s} />
            ))}
        </div>
      </section>
      <div className="mobile-install">
        <CopyCommand command={`skillpm install ${authorName}/${skillName}`} notify={notify || (() => {})} />
        <Button onClick={() => window.open(`https://github.com/${authorName}/${skillName}`, "_blank")}>
          View on GitHub
        </Button>
      </div>
      {report && <ReportModal close={() => setReport(false)} />}
    </main>
  );
}
