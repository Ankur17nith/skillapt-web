import { useState } from "react";
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
import type { Nav } from "../types";

export function SkillDetailPage({ nav, notify }: { nav: Nav; notify: () => void }) {
  const [tab, setTab] = useState("README");
  const [installMode, setInstallMode] = useState("skillpm");
  const [report, setReport] = useState(false);
  const installCommands: Record<string, string> = {
    skillpm: "skillpm install paperplane/pdf-summarizer",
    npx: "npx skillpm install paperplane/pdf-summarizer",
    manual: "git clone github.com/paperplane/pdf-summarizer",
  };
  return (
    <main className="shell page">
      <div className="breadcrumbs">
        <Link to="/" nav={nav}>
          Home
        </Link>
        <span>/</span>
        <Link to="/browse" nav={nav}>
          Browse
        </Link>
        <span>/</span>
        <span>pdf-summarizer</span>
      </div>
      <div className="detail-grid">
        <article className="detail-main">
          <div className="detail-title">
            <span className="large-icon">
              <Icon name="package" />
            </span>
            <div>
              <div>
                <h1>pdf-summarizer</h1>
              </div>
              <p>by @paperplane</p>
            </div>
          </div>
          <p className="lead">
            Extract, summarize, and query any PDF with citations and page-level references.
          </p>
          <div className="tags">
            <span>documents</span>
            <span>research</span>
            <span>pdf</span>
          </div>
          <dl className="metadata">
            <div>
              <dt>Version</dt>
              <dd>2.4.1</dd>
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
              <h2>PDF Summarizer</h2>
              <p>
                Give your agent a reliable way to read long PDF files and return structured
                summaries with citations.
              </p>
              <h3>Installation</h3>
              <CodeBlock>skillpm install paperplane/pdf-summarizer</CodeBlock>
              <h3>What it can do</h3>
              <ul>
                <li>Extract text from local and remote PDF files</li>
                <li>Return summaries with page-level citations</li>
                <li>Answer questions using only the supplied document</li>
              </ul>
              <h3>Usage</h3>
              <CodeBlock>{`agent.use("pdf-summarizer", {\n  file: "./annual-report.pdf",\n  format: "brief"\n})`}</CodeBlock>
            </div>
          )}
          {tab === "Versions" && (
            <div className="tab-panel">
              <h2>Version history</h2>
              <p>2.4.1 — Improved citation accuracy and large-file handling.</p>
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
          <CopyCommand command={installCommands[installMode]} notify={notify} />
          <Button onClick={() => window.open("https://github.com", "_blank")}>
            View on GitHub
          </Button>
          <Button variant="ghost" onClick={() => setReport(true)}>
            Report
          </Button>
          <dl className="package-facts">
            <div>
              <dt>Version</dt>
              <dd>2.4.1</dd>
            </div>
            <div>
              <dt>License</dt>
              <dd>MIT</dd>
            </div>
            <div>
              <dt>Language</dt>
              <dd>TypeScript</dd>
            </div>
            <div>
              <dt>Repository</dt>
              <dd>paperplane/pdf-summarizer</dd>
            </div>
            <div>
              <dt>Dependencies</dt>
              <dd>pdf.js, zod</dd>
            </div>
          </dl>
          <div className="compatibility">
            <strong>Compatibility</strong>
            <span>Claude</span>
            <span>Cursor</span>
            <span>Codex</span>
          </div>
        </aside>
      </div>
      <section className="related">
        <SectionTitle title="Related skills" />
        <div className="card-grid">
          {skills.slice(1, 4).map((s) => (
            <SkillCard key={s.name} skill={s} nav={nav} />
          ))}
        </div>
      </section>
      <div className="mobile-install">
        <CopyCommand command="skillpm install paperplane/pdf-summarizer" notify={notify} />
        <Button onClick={() => window.open("https://github.com", "_blank")}>View on GitHub</Button>
      </div>
      {report && <ReportModal close={() => setReport(false)} />}
    </main>
  );
}
