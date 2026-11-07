import { useState, useEffect } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { Container } from "../components/Container";
import { PageHeader } from "../components/PageHeader";
import { SectionTitle } from "../components/SectionTitle";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { CopyCommand } from "../components/CopyCommand";
import { CodeBlock } from "../components/CodeBlock";
import { LoadingState } from "../components/LoadingState";
import { SEO } from "../components/SEO";
import { useAuth } from "../lib/auth";
import { api, type ApiSkillSummary, type ApiToken, type CreateTokenResponse } from "../lib/api";
import { formatRelativeTime } from "../lib/skills";

export function DashboardPage() {
  const { user, loading: authLoading, login } = useAuth();
  const outletCtx = useOutletContext<{ notify?: (title?: string, msg?: string) => void } | null>();
  const notify = outletCtx?.notify || (() => {});
  const navigate = useNavigate();

  const [skills, setSkills] = useState<ApiSkillSummary[]>([]);
  const [tokens, setTokens] = useState<ApiToken[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Modals state
  const [yankModal, setYankModal] = useState<{
    open: boolean;
    skillName: string;
    version: string;
    yanked: boolean;
    reason: string;
    submitting: boolean;
  }>({
    open: false,
    skillName: "",
    version: "",
    yanked: false,
    reason: "",
    submitting: false,
  });

  const [tokenModal, setTokenModal] = useState<{
    open: boolean;
    name: string;
    submitting: boolean;
  }>({
    open: false,
    name: "",
    submitting: false,
  });

  const [newTokenResult, setNewTokenResult] = useState<CreateTokenResponse | null>(null);

  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      const [skillsRes, tokensRes] = await Promise.all([
        api.getSkills({ limit: 50 }),
        api.getTokens(),
      ]);
      // Filter skills owned by user if logged in, or show skills in dev
      if (user) {
        const userSkills = skillsRes.skills.filter(
          (s) => s.owner.handle.toLowerCase() === user.handle.toLowerCase()
        );
        // If user has no skills yet in mock, show their packages or first 3
        setSkills(userSkills.length > 0 ? userSkills : skillsRes.skills.slice(0, 3));
      } else {
        setSkills(skillsRes.skills.slice(0, 3));
      }
      setTokens(tokensRes);
    } catch {
      // Fallback
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const handleYankSubmit = async () => {
    setYankModal((prev) => ({ ...prev, submitting: true }));
    try {
      if (yankModal.yanked) {
        await api.unyankVersion(yankModal.skillName, yankModal.version);
        notify("Version restored", `${yankModal.skillName}@${yankModal.version} is now available in resolution.`);
      } else {
        await api.yankVersion(yankModal.skillName, yankModal.version, yankModal.reason);
        notify("Version yanked", `${yankModal.skillName}@${yankModal.version} has been yanked.`);
      }
      setYankModal((prev) => ({ ...prev, open: false, submitting: false }));
      loadDashboardData();
    } catch (err: any) {
      notify("Action failed", err?.message || "Failed to update version yank status.");
      setYankModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenModal.name.trim()) return;

    setTokenModal((prev) => ({ ...prev, submitting: true }));
    try {
      const res = await api.createToken(tokenModal.name.trim());
      setNewTokenResult(res);
      setTokenModal({ open: false, name: "", submitting: false });
      const updatedTokens = await api.getTokens();
      setTokens(updatedTokens);
    } catch (err: any) {
      notify("Token error", err?.message || "Failed to generate token.");
      setTokenModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const handleRevokeToken = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to revoke API token "${name}"? Any CLI instances using it will stop working.`)) {
      return;
    }
    try {
      await api.revokeToken(id);
      notify("Token revoked", `API token "${name}" has been revoked.`);
      setTokens((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      notify("Revoke failed", err?.message || "Failed to revoke token.");
    }
  };

  if (authLoading) {
    return (
      <main className="page">
        <Container>
          <div style={{ padding: "64px 0" }}>
            <LoadingState />
          </div>
        </Container>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="page">
        <Container>
          <SEO title="Publisher Dashboard" url="/dashboard" />
          <div className="form-card" style={{ maxWidth: "540px", margin: "64px auto", textAlign: "center" }}>
            <h2>Publisher Dashboard</h2>
            <p style={{ margin: "16px 0 24px 0", color: "var(--muted)", fontSize: "14px", lineHeight: "1.6" }}>
              Sign in with your GitHub account to manage your published AI agent skills, yank compromised versions, and generate CLI publishing tokens.
            </p>
            <Button onClick={login} style={{ width: "100%", justifyContent: "center" }}>
              <Icon name="github" /> Sign in with GitHub
            </Button>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="page">
      <Container>
        <SEO title="Publisher Dashboard" url="/dashboard" />
        <div style={{ paddingTop: "64px" }}>
          <PageHeader title="Publisher Dashboard">
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
              <img
                src={user.avatarUrl || "https://avatars.githubusercontent.com/u/12345"}
                alt={user.handle}
                style={{ width: "28px", height: "28px", borderRadius: "50%", border: "1px solid var(--border)" }}
              />
              <span>
                <strong>@{user.handle}</strong> {user.name ? `(${user.name})` : ""} · {user.email}
              </span>
            </div>
          </PageHeader>
        </div>

        {/* Section 1: Published Skills */}
        <section style={{ marginTop: "48px" }}>
          <SectionTitle
            title="My published skills"
            action={
              <Button onClick={() => navigate("/publish")}>
                Publish new skill
              </Button>
            }
          />

          {loadingData ? (
            <LoadingState />
          ) : skills.length === 0 ? (
            <div className="form-card" style={{ textAlign: "center", padding: "40px 20px" }}>
              <h3>No skills published yet</h3>
              <p style={{ color: "var(--muted)", margin: "8px 0 20px 0" }}>
                You haven't published any skills to the registry. Ready to share a capability?
              </p>
              <Button onClick={() => navigate("/publish")}>Publish your first skill</Button>
            </div>
          ) : (
            <div className="skill-list">
              {skills.map((skill) => (
                <article key={skill.name} className="skill-list-item" style={{ alignItems: "center" }}>
                  <div className="skill-list-main" onClick={() => navigate(`/skills/${skill.name}`)}>
                    <span className="skill-icon">
                      <Icon name="package" size={16} />
                    </span>
                    <span>
                      <strong>{skill.name}</strong>
                      <small>v{skill.latestVersion}</small>
                    </span>
                    <p>{skill.description}</p>
                  </div>
                  <div className="skill-list-details" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span>{skill.downloads.toLocaleString()} installs</span>
                    <span>{formatRelativeTime(skill.updatedAt)}</span>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setYankModal({
                          open: true,
                          skillName: skill.name,
                          version: skill.latestVersion,
                          yanked: false,
                          reason: "",
                          submitting: false,
                        })
                      }
                      style={{ fontSize: "12px", height: "30px", padding: "0 8px" }}
                    >
                      Yank v{skill.latestVersion}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Section 2: API Tokens */}
        <section style={{ marginTop: "96px" }} id="tokens">
          <SectionTitle
            title="API tokens (CLI publishing)"
            action={
              <Button onClick={() => setTokenModal({ open: true, name: "", submitting: false })}>
                Generate new token
              </Button>
            }
          />
          <p style={{ color: "var(--muted)", fontSize: "13px", marginBottom: "16px" }}>
            API tokens authenticate the <code>skillapt publish</code> CLI command. Never share your tokens.
          </p>

          <div className="form-card" style={{ padding: "0" }}>
            {tokens.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--muted)" }}>
                No active tokens. Click "Generate new token" to create one.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {tokens.map((tok, idx) => (
                  <div
                    key={tok.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 24px",
                      borderBottom: idx === tokens.length - 1 ? "none" : "1px solid var(--border)",
                      gap: "16px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <strong>{tok.name}</strong>
                      <div style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--muted)", marginTop: "4px" }}>
                        Prefix: {tok.prefix}••••••••
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "12px", color: "var(--muted)" }}>
                      <span>Created {formatRelativeTime(tok.createdAt)}</span>
                      {tok.lastUsedAt && <span>Last used {formatRelativeTime(tok.lastUsedAt)}</span>}
                      <Button
                        variant="ghost"
                        onClick={() => handleRevokeToken(tok.id, tok.name)}
                        style={{ color: "var(--error)", height: "28px", padding: "0 8px", fontSize: "12px" }}
                      >
                        Revoke
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Section 3: CLI Publishing Guide */}
        <section style={{ marginTop: "96px", marginBottom: "96px" }}>
          <SectionTitle title="CLI publishing quickstart" />
          <div className="steps" style={{ marginTop: "16px" }}>
            <div className="form-card">
              <h3>1. Authenticate CLI</h3>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: "8px 0 12px 0" }}>
                Log in interactively or set your API token in the environment:
              </p>
              <CodeBlock>
{`# Option A: Interactive login
skillapt login

# Option B: Set environment variable
export SKILLAPT_TOKEN=apt_live_...`}
              </CodeBlock>
            </div>

            <div className="form-card">
              <h3>2. Prepare Manifest</h3>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: "8px 0 12px 0" }}>
                Add <code>skill.json</code> and <code>SKILL.md</code> to your skill root:
              </p>
              <CodeBlock>
{`{
  "name": "my-agent-skill",
  "version": "1.0.0",
  "description": "Teaches agents how to analyze files.",
  "license": "MIT",
  "category": "documents",
  "compatibility": ["claude", "cursor"],
  "permissions": {
    "network": false,
    "shell": false,
    "filesystem": "read"
  }
}`}
              </CodeBlock>
            </div>

            <div className="form-card">
              <h3>3. Publish to Registry</h3>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: "8px 0 12px 0" }}>
                Inspects archive safety, calculates SHA-256 hash, and publishes:
              </p>
              <CodeBlock>
{`skillapt publish`}
              </CodeBlock>
            </div>
          </div>
        </section>

        {/* Yank Confirm Modal */}
        {yankModal.open && (
          <div className="sheet-backdrop" onClick={() => setYankModal((prev) => ({ ...prev, open: false }))}>
            <div className="form-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "480px", margin: "auto", position: "relative" }}>
              <h3>{yankModal.yanked ? "Restore Version" : "Yank Version"}</h3>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: "8px 0 16px 0", lineHeight: "1.6" }}>
                {yankModal.yanked
                  ? `Restoring ${yankModal.skillName}@${yankModal.version} will allow SemVer range queries to include this release again.`
                  : `Yanking ${yankModal.skillName}@${yankModal.version} excludes it from automatic dependency resolution. Existing lockfiles and explicit pinned downloads will continue to work.`}
              </p>

              {!yankModal.yanked && (
                <label style={{ display: "block", marginBottom: "16px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "500", display: "block", marginBottom: "6px" }}>
                    Reason (optional)
                  </span>
                  <input
                    type="text"
                    value={yankModal.reason}
                    onChange={(e) => setYankModal((prev) => ({ ...prev, reason: e.target.value }))}
                    placeholder="e.g. Critical security bug or deprecation"
                    style={{ width: "100%", height: "36px", padding: "0 10px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)" }}
                  />
                </label>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <Button variant="ghost" onClick={() => setYankModal((prev) => ({ ...prev, open: false }))}>
                  Cancel
                </Button>
                <Button onClick={handleYankSubmit} disabled={yankModal.submitting}>
                  {yankModal.submitting ? "Processing..." : yankModal.yanked ? "Restore" : "Confirm Yank"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Create Token Modal */}
        {tokenModal.open && (
          <div className="sheet-backdrop" onClick={() => setTokenModal((prev) => ({ ...prev, open: false }))}>
            <div className="form-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "460px", margin: "auto" }}>
              <h3>Generate API Token</h3>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: "8px 0 16px 0" }}>
                Provide a friendly description to identify where this token is used.
              </p>
              <form onSubmit={handleCreateToken}>
                <label style={{ display: "block", marginBottom: "16px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "500", display: "block", marginBottom: "6px" }}>
                    Token Name
                  </span>
                  <input
                    type="text"
                    value={tokenModal.name}
                    onChange={(e) => setTokenModal((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. cli-laptop or github-ci"
                    required
                    style={{ width: "100%", height: "36px", padding: "0 10px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)" }}
                  />
                </label>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                  <Button variant="ghost" type="button" onClick={() => setTokenModal((prev) => ({ ...prev, open: false }))}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={tokenModal.submitting || !tokenModal.name.trim()}>
                    {tokenModal.submitting ? "Creating..." : "Create Token"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* One-Time Token Display Modal */}
        {newTokenResult && (
          <div className="sheet-backdrop">
            <div className="form-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px", margin: "auto" }}>
              <h3>API Token Generated</h3>
              <p style={{ fontSize: "13px", color: "var(--error)", margin: "8px 0 12px 0", fontWeight: "500" }}>
                ⚠ {newTokenResult.warning}
              </p>
              <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "16px" }}>
                Token <strong>{newTokenResult.name}</strong>:
              </p>
              <CopyCommand command={newTokenResult.token} notify={() => notify("Token copied", "API token copied to clipboard.")} />
              <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={() => setNewTokenResult(null)}>
                  I have saved my token
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
