import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { SearchBar } from "../components/SearchBar";
import { CopyCommand } from "../components/CopyCommand";
import { TerminalWindow } from "../components/TerminalWindow";
import { SectionTitle } from "../components/SectionTitle";
import { SkillListItem } from "../components/SkillListItem";
import { Link } from "../components/Link";
import { Icon } from "../components/Icon";
import { StepCard } from "../components/StepCard";
import { FeatureCard } from "../components/FeatureCard";
import { Button } from "../components/Button";
import { FAQ } from "../components/FAQ";
import { SEO } from "../components/SEO";
import { Container } from "../components/Container";
import { LoadingState } from "../components/LoadingState";
import { api, type ApiStats } from "../lib/api";
import { apiSummaryToSkill } from "../lib/skills";
import type { Skill } from "../types";

export function HomePage({ notify }: { notify?: () => void }) {
  const navigate = useNavigate();
  const outletCtx = useOutletContext<{ openPalette?: () => void } | null>();
  const openPalette = outletCtx?.openPalette || (() => {});

  const [recentSkills, setRecentSkills] = useState<Skill[]>([]);
  const [stats, setStats] = useState<ApiStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [skillsRes, statsRes] = await Promise.all([
        api.getSkills({ limit: 5, sort: "recent" }),
        api.getStats(),
      ]);
      setRecentSkills(skillsRes.skills.map(apiSummaryToSkill));
      setStats(statsRes);
    } catch (err: any) {
      setError(err?.message || "Failed to load skills from the registry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const categories = [
    "Documents",
    "Coding",
    "Data",
    "Design",
    "Writing",
    "Research",
    "Automation",
    "Security",
  ];

  return (
    <>
      <SEO title="Home" description="Discover, install, and share capabilities for AI agents." url="/" />
      <section className="home-hero">
        <Container className="hero-grid">
          <div>
            <span className="hero-kicker">Discover. Install. Build. Share.</span>
            <h1>Your AI skills, one package away.</h1>
            <p>Discover, install, and share reusable skills for the AI agents you build with.</p>
            <SearchBar openPalette={openPalette} />
            <CopyCommand command="skillapt install pdf-summarizer" notify={notify || (() => {})} />
            <div className="hero-actions">
              <Button onClick={() => navigate("/browse")}>Browse skills</Button>
              <Link to="/docs" className="hero-docs">
                Read the CLI docs
              </Link>
            </div>
            {stats && (
              <p className="works" style={{ marginTop: "16px" }}>
                Serving <strong>{stats.totalSkills.toLocaleString()}</strong> skills across{" "}
                <strong>{stats.totalDownloads.toLocaleString()}</strong> installations.
              </p>
            )}
            <p className="works">Works with Claude, Cursor, Codex, and Antigravity.</p>
          </div>
          <TerminalWindow />
        </Container>
      </section>
      <main>
        <section className="home-section">
          <Container>
            <SectionTitle
              title="Recently updated"
              action={<Link to="/browse">View all</Link>}
            />
            {loading ? (
              <LoadingState />
            ) : error ? (
              <div className="field-error" style={{ padding: "20px 0" }}>
                <p>{error}</p>
                <Button variant="ghost" onClick={loadData}>Retry</Button>
              </div>
            ) : (
              <div className="skill-list home-skill-list">
                {recentSkills.map((s) => (
                  <SkillListItem key={s.slug || s.name} skill={s} />
                ))}
              </div>
            )}
          </Container>
        </section>
        <section className="home-section">
          <Container>
            <SectionTitle title="Browse by category" />
            <div className="category-grid">
              {categories.map((c) => (
                <Link key={c} to={`/browse?category=${encodeURIComponent(c.toLowerCase())}`}>
                  <Icon name={c === "Security" ? "shield" : c === "Coding" ? "code" : "package"} />
                  <span>{c}</span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
        <section className="home-section">
          <Container>
            <SectionTitle title="How it works" />
            <div className="steps">
              <StepCard number="1" title="Find">
                Search for a skill that matches your work.
              </StepCard>
              <StepCard number="2" title="Install">
                Run one command and review permissions.
              </StepCard>
              <StepCard number="3" title="Your agent uses it">
                The skill is added to your agent's toolkit.
              </StepCard>
            </div>
          </Container>
        </section>
        <section className="home-section">
          <Container>
            <SectionTitle title="Built for trust" />
            <div className="feature-grid">
              <FeatureCard title="Repository provenance">
                Source links and package history stay visible.
              </FeatureCard>
              <FeatureCard title="Security scanning">Automated checks on every release.</FeatureCard>
              <FeatureCard title="Open source">Inspect source and requested permissions.</FeatureCard>
            </div>
            <Link to="/security" className="inline-link">
              Learn about security
            </Link>
          </Container>
        </section>
        <section className="home-section">
          <Container className="cta">
            <div>
              <h2>Share your skill with the world</h2>
              <p>Publish your agent capability in the public registry.</p>
            </div>
            <Button onClick={() => navigate("/publish")}>Publish a skill</Button>
          </Container>
        </section>
        <section className="home-section">
          <Container>
            <SectionTitle title="Questions, answered" />
            <FAQ />
          </Container>
        </section>
      </main>
    </>
  );
}
