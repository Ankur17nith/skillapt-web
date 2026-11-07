import { useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "../components/Link";
import { Icon } from "../components/Icon";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";
import { CopyCommand } from "../components/CopyCommand";
import { CodeBlock } from "../components/CodeBlock";
import { ReportModal } from "../components/ReportModal";
import { SectionTitle } from "../components/SectionTitle";
import { SkillCard } from "../components/SkillCard";
import { SEO } from "../components/SEO";
import { Container } from "../components/Container";
import { NotFoundPage } from "./NotFoundPage";
import { getSkillBySlug, getRelated, getInstallCommand, getSkillLanguage, formatRelativeTime } from "../lib/skills";

export function SkillDetailPage({ notify: propNotify }: { notify?: (title?: string, msg?: string) => void }) {
  const { slug } = useParams<{ slug: string }>();
  const outletCtx = useOutletContext<{ notify?: (title?: string, msg?: string) => void } | null>();
  const notify = propNotify || outletCtx?.notify || (() => {});

  const [tab, setTab] = useState("README");
  const [installMode, setInstallMode] = useState<"skillapt" | "curl" | "manual">("skillapt");
  const [reportOpen, setReportOpen] = useState(false);

  if (!slug) {
    return <NotFoundPage />;
  }

  const skill = getSkillBySlug(slug);
  if (!skill) {
    return <NotFoundPage />;
  }

  const version = skill.version || skill.ref.replace(/^v/, "");
  const lang = getSkillLanguage(skill);
  const relatedSkills = getRelated(skill, 3);
  const installCmd = getInstallCommand(skill);

  const installCommands: Record<string, string> = {
    skillapt: installCmd,
    curl: `curl -fsSL https://registry.skillapt.dev/v1/skills/${skill.name || skill.slug}/-/${version}.tgz -o skill.tgz`,
    manual: `git clone https://github.com/${skill.repo}.git`,
  };

  const handleReportSubmit = (_reason: string, _details: string) => {
    notify(
      "Report submitted",
      "Thank you for reporting. Our security team will review it."
    );
  };

  return (
    <main className="page">
      <Container>
        <SEO
          title={skill.name}
          description={skill.description}
          url={`/skills/${skill.slug}`}
          type="article"
        />
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/browse">Browse</Link>
        <span>/</span>
        <span>{skill.name}</span>
      </div>
      <div className="detail-grid">
        <article className="detail-main">
          <div className="detail-title">
            <span className="large-icon">
              <Icon name="package" />
            </span>
            <div>
              <div>
                <h1>{skill.name}</h1>
                {skill.verified && (
                  <span
                    className="verified"
                    title="Verified publisher"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      marginLeft: "8px",
                      color: "var(--accent)",
                      verticalAlign: "middle",
                    }}
                  >
                    <Icon name="check" size={18} />
                  </span>
                )}
              </div>
              <p>by @{skill.author}</p>
            </div>
          </div>
          <p className="lead">{skill.longDescription || skill.description}</p>
          <div className="tags">
            {skill.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <dl className="metadata">
            <div>
              <dt>Version</dt>
              <dd>{version}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>
                {new Date(skill.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </dd>
            </div>
            <div>
              <dt>License</dt>
              <dd>{skill.license}</dd>
            </div>
          </dl>
          <div className="tabs">
            {["README", "Versions", "Security"].map((t) => (
              <button
                className={tab === t ? "active" : ""}
                onClick={() => setTab(t)}
                key={t}
              >
                {t}
              </button>
            ))}
          </div>
          {tab === "README" && (
            <div className="markdown">
              <Logo variant="full" />
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const text = String(children).replace(/\n$/, "");
                    if (
                      text.includes("\n") ||
                      text.startsWith("skillapt") ||
                      text.startsWith("skillpm") ||
                      text.startsWith("curl") ||
                      text.startsWith("agent.use")
                    ) {
                      return <CodeBlock>{text}</CodeBlock>;
                    }
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {skill.readmeMarkdown}
              </ReactMarkdown>
            </div>
          )}
          {tab === "Versions" && (
            <div className="tab-panel">
              <h2>Version history</h2>
              <p>
                <strong>{version}</strong> ({formatRelativeTime(skill.updatedAt)}) — Initial registry release with security scanning.
              </p>
            </div>
          )}
          {tab === "Security" && (
            <div className="security-panel">
              <h2>Security report</h2>
              <div>
                <Icon name="check" />{" "}
                <span>
                  <strong>Scanned</strong> No known vulnerabilities found
                </span>
              </div>
              <div className="warning">
                <span>!</span>
                <span>
                  <strong>Permissions requested</strong> File read and network access
                </span>
              </div>
              <div>
                <Icon name="check" />{" "}
                <span>
                  <strong>Last scan date</strong>{" "}
                  {new Date(skill.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          )}
        </article>
        <aside className="install-panel">
          <div className="mini-tabs">
            {(["skillapt", "curl", "manual"] as const).map((mode) => (
              <button
                className={installMode === mode ? "active" : ""}
                onClick={() => setInstallMode(mode)}
                key={mode}
              >
                {mode}
              </button>
            ))}
          </div>
          <CopyCommand
            command={installCommands[installMode]}
            notify={() => notify("Copied to clipboard", "Install command copied.")}
          />
          <Button
            onClick={() => window.open(`https://github.com/${skill.repo}`, "_blank")}
          >
            View on GitHub
          </Button>
          <Button variant="ghost" onClick={() => setReportOpen(true)}>
            Report
          </Button>
          <dl className="package-facts">
            <div>
              <dt>Version</dt>
              <dd>{version}</dd>
            </div>
            <div>
              <dt>License</dt>
              <dd>{skill.license}</dd>
            </div>
            <div>
              <dt>Language</dt>
              <dd>{lang}</dd>
            </div>
            <div>
              <dt>Repository</dt>
              <dd>{skill.repo}</dd>
            </div>
            <div>
              <dt>Stars</dt>
              <dd>{skill.stars.toLocaleString()}</dd>
            </div>
            <div>
              <dt>Installs</dt>
              <dd>{skill.installs.toLocaleString()}</dd>
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
      {relatedSkills.length > 0 && (
        <section className="related">
          <SectionTitle title="Related skills" />
          <div className="card-grid">
            {relatedSkills.map((s) => (
              <SkillCard key={s.slug} skill={s} />
            ))}
          </div>
        </section>
      )}
      <div className="mobile-install">
        <CopyCommand
          command={installCommands.skillapt}
          notify={() => notify("Copied to clipboard", "Install command copied.")}
        />
        <Button
          onClick={() => window.open(`https://github.com/${skill.repo}`, "_blank")}
        >
          View on GitHub
        </Button>
      </div>
      {reportOpen && (
        <ReportModal
          close={() => setReportOpen(false)}
          onSubmit={handleReportSubmit}
        />
      )}
      </Container>
    </main>
  );
}
