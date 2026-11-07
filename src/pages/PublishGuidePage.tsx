import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "../components/Container";
import { PageHeader } from "../components/PageHeader";
import { SectionTitle } from "../components/SectionTitle";
import { Button } from "../components/Button";
import { CodeBlock } from "../components/CodeBlock";
import { CopyCommand } from "../components/CopyCommand";
import { SEO } from "../components/SEO";

export function PublishGuidePage() {
  const navigate = useNavigate();

  // Interactive manifest generator
  const [skillName, setSkillName] = useState("my-skill");
  const [version, setVersion] = useState("1.0.0");
  const [description, setDescription] = useState("Teaches AI agents how to perform specialized tasks.");
  const [license, setLicense] = useState("MIT");
  const [category, setCategory] = useState("documents");
  const [compat, setCompat] = useState<string[]>(["claude", "cursor", "codex", "antigravity"]);
  const [network, setNetwork] = useState(false);
  const [shell, setShell] = useState(false);
  const [filesystem, setFilesystem] = useState<"none" | "read" | "write" | "read-write">("read");

  const toggleCompat = (name: string) => {
    setCompat((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const generatedManifest = JSON.stringify(
    {
      name: skillName.trim().toLowerCase() || "my-skill",
      version: version.trim() || "1.0.0",
      description: description.trim(),
      license: license.trim() || "MIT",
      category,
      compatibility: compat.length > 0 ? compat : ["claude"],
      permissions: {
        network,
        shell,
        filesystem,
      },
    },
    null,
    2
  );

  return (
    <main className="page">
      <Container>
        <SEO
          title="Publish Guide"
          description="Learn how to package, test, and publish AI agent skills with skillapt."
          url="/publish"
        />

        <div style={{ paddingTop: "64px" }}>
          <PageHeader title="Publishing AI Agent Skills">
            <p>
              Package, verify, and distribute reusable skills across Claude, Cursor, Codex, and Antigravity.
            </p>
          </PageHeader>
        </div>

        {/* Section 1: Overview & Package Format */}
        <section style={{ marginTop: "48px" }}>
          <SectionTitle title="1. Package structure & rules" />
          <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>
            Every skill package is an independent gzip-compressed tar archive (<code>.tar.gz</code>) containing a manifest and documentation. No compilation or npm packages required.
          </p>

          <div className="steps">
            <div className="form-card">
              <h3>Archive Layout</h3>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: "8px 0 12px 0" }}>
                At the root of your package:
              </p>
              <CodeBlock>
{`my-skill/
├── skill.json       # Required: Package manifest
├── SKILL.md         # Required: Agent documentation
└── ...              # Optional: Templates, prompts, scripts`}
              </CodeBlock>
            </div>

            <div className="form-card">
              <h3>Safety & Limits</h3>
              <ul style={{ fontSize: "13px", color: "var(--muted)", paddingLeft: "18px", margin: "8px 0", lineHeight: "1.8" }}>
                <li><strong>Max Size:</strong> 5 MB compressed, 25 MB uncompressed.</li>
                <li><strong>Prohibited:</strong> Executable binaries (<code>.exe, .dylib, .so</code>), hidden files, or nested archives.</li>
                <li><strong>Security:</strong> All tarball entries are checked for path traversal and symlinks.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: Manifest Generator */}
        <section style={{ marginTop: "96px" }}>
          <SectionTitle title="2. Package manifest (skill.json)" />
          <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
            The <code>skill.json</code> file declares runtime compatibility, versioning, and security permissions. Use the interactive builder below to craft your manifest:
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
            <div className="form-card">
              <h3>Manifest Builder</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
                <label>
                  <span style={{ fontSize: "13px", fontWeight: "500", display: "block", marginBottom: "4px" }}>
                    Package Name
                  </span>
                  <input
                    type="text"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    style={{ width: "100%", height: "36px", padding: "0 10px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)" }}
                  />
                </label>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <label>
                    <span style={{ fontSize: "13px", fontWeight: "500", display: "block", marginBottom: "4px" }}>
                      Version (SemVer)
                    </span>
                    <input
                      type="text"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      style={{ width: "100%", height: "36px", padding: "0 10px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)" }}
                    />
                  </label>
                  <label>
                    <span style={{ fontSize: "13px", fontWeight: "500", display: "block", marginBottom: "4px" }}>
                      License (SPDX)
                    </span>
                    <input
                      type="text"
                      value={license}
                      onChange={(e) => setLicense(e.target.value)}
                      style={{ width: "100%", height: "36px", padding: "0 10px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)" }}
                    />
                  </label>
                </div>

                <label>
                  <span style={{ fontSize: "13px", fontWeight: "500", display: "block", marginBottom: "4px" }}>
                    Category
                  </span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: "100%", height: "36px", padding: "0 10px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)" }}
                  >
                    <option value="documents">documents</option>
                    <option value="coding">coding</option>
                    <option value="research">research</option>
                    <option value="data">data</option>
                    <option value="devtools">devtools</option>
                    <option value="communication">communication</option>
                    <option value="productivity">productivity</option>
                    <option value="other">other</option>
                  </select>
                </label>

                <div>
                  <span style={{ fontSize: "13px", fontWeight: "500", display: "block", marginBottom: "8px" }}>
                    Compatibility
                  </span>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {["claude", "cursor", "codex", "antigravity", "openai"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCompat(c)}
                        style={{
                          padding: "6px 12px",
                          fontSize: "12px",
                          border: "1px solid var(--border)",
                          background: compat.includes(c) ? "var(--accent)" : "var(--surface)",
                          color: compat.includes(c) ? "#fff" : "var(--text)",
                          cursor: "pointer",
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: "13px", fontWeight: "500", display: "block", marginBottom: "8px" }}>
                    Permissions
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input type="checkbox" checked={network} onChange={(e) => setNetwork(e.target.checked)} />
                      Network access
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input type="checkbox" checked={shell} onChange={(e) => setShell(e.target.checked)} />
                      Shell execution
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      Filesystem:
                      <select
                        value={filesystem}
                        onChange={(e) => setFilesystem(e.target.value as any)}
                        style={{ marginLeft: "8px", height: "30px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)" }}
                      >
                        <option value="none">none</option>
                        <option value="read">read</option>
                        <option value="write">write</option>
                        <option value="read-write">read-write</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-card">
              <h3>Generated skill.json</h3>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: "8px 0 12px 0" }}>
                Place this in your repository root:
              </p>
              <CodeBlock>{generatedManifest}</CodeBlock>
            </div>
          </div>
        </section>

        {/* Section 3: SKILL.md */}
        <section style={{ marginTop: "96px" }}>
          <SectionTitle title="3. Agent documentation (SKILL.md)" />
          <div className="form-card">
            <h3>Prompt & Execution Guidelines</h3>
            <p style={{ fontSize: "13px", color: "var(--muted)", margin: "8px 0 16px 0", lineHeight: "1.6" }}>
              The <code>SKILL.md</code> file is read directly by LLM agents when the skill is active. Write clear instructions, structured input definitions, and few-shot examples.
            </p>
            <CodeBlock>
{`# PDF Summarizer

Teaches an agent to extract text from PDF documents and output structured bulleted summaries.

## When to Activate
Trigger this skill whenever the user asks to summarize, analyze, or extract insights from a .pdf file.

## Parameters
- \`path\` (string, required): Filepath or URL to the target PDF.
- \`detailLevel\` (string, optional): "brief" | "standard" | "exhaustive". Default "standard".

## Prompt Instructions
1. Verify the PDF exists at the specified path.
2. Read the textual contents using the provided extraction script.
3. Organize key findings by section headers with exact page citations.`}
            </CodeBlock>
          </div>
        </section>

        {/* Section 4: Publishing with CLI */}
        <section style={{ marginTop: "96px", marginBottom: "96px" }}>
          <SectionTitle title="4. Publishing with the CLI" />
          <div className="steps">
            <div className="form-card">
              <h3>Install CLI</h3>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: "8px 0 12px 0" }}>
                Get the global skillapt tool:
              </p>
              <CodeBlock>npm i -g skillapt</CodeBlock>
            </div>

            <div className="form-card">
              <h3>Authenticate</h3>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: "8px 0 12px 0" }}>
                Log in with your GitHub account:
              </p>
              <CodeBlock>skillapt login</CodeBlock>
              <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "8px" }}>
                Or generate a token in your <Link to="/dashboard#tokens">Dashboard</Link>.
              </p>
            </div>

            <div className="form-card">
              <h3>Publish Release</h3>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: "8px 0 12px 0" }}>
                From your package directory:
              </p>
              <CodeBlock>skillapt publish</CodeBlock>
            </div>
          </div>

          <div style={{ marginTop: "32px", display: "flex", gap: "16px" }}>
            <Button onClick={() => navigate("/dashboard")}>
              Go to Publisher Dashboard
            </Button>
            <Button variant="ghost" onClick={() => navigate("/docs")}>
              Read Full CLI Docs
            </Button>
          </div>
        </section>
      </Container>
    </main>
  );
}
