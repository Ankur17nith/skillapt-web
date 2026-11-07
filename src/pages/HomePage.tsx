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
import { getSkills, sortSkills } from "../lib/skills";

export function HomePage({ notify }: { notify?: () => void }) {
  const navigate = useNavigate();
  const outletCtx = useOutletContext<{ openPalette?: () => void } | null>();
  const openPalette = outletCtx?.openPalette || (() => {});
  const recentlyUpdated = sortSkills(getSkills(), "Recently updated").slice(0, 5);

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
            <CopyCommand command="npx skillpm install user/repo" notify={notify || (() => {})} />
            <div className="hero-actions">
              <Button onClick={() => navigate("/browse")}>Browse skills</Button>
              <Link to="/docs" className="hero-docs">
                Read the CLI docs
              </Link>
            </div>
            <p className="works">Works with Claude, Cursor and Codex.</p>
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
            <div className="skill-list home-skill-list">
              {recentlyUpdated.map((s) => (
                <SkillListItem key={s.slug || s.name} skill={s} />
              ))}
            </div>
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
            <Button onClick={() => navigate("/submit")}>Submit a skill</Button>
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
