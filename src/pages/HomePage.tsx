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
import { skills } from "../data/initialData";
import type { Nav } from "../types";

export function HomePage({
  nav,
  openPalette,
  notify,
}: {
  nav: Nav;
  openPalette: () => void;
  notify: () => void;
}) {
  return (
    <>
      <section className="home-hero">
        <div className="hero-grid">
          <div>
            <span className="hero-kicker">Discover. Install. Build. Share.</span>
            <h1>Your AI skills, one package away.</h1>
            <p>Discover, install, and share reusable skills for the AI agents you build with.</p>
            <SearchBar openPalette={openPalette} />
            <CopyCommand command="npx skillpm install user/repo" notify={notify} />
            <div className="hero-actions">
              <Button onClick={() => nav("/browse")}>Browse skills</Button>
              <Link to="/docs" nav={nav} className="hero-docs">
                Read the CLI docs
              </Link>
            </div>
            <p className="works">Works with Claude, Cursor and Codex.</p>
          </div>
          <TerminalWindow />
        </div>
      </section>
      <main className="shell">
        <section>
          <SectionTitle
            title="Recently updated"
            action={
              <Link to="/browse" nav={nav}>
                View all
              </Link>
            }
          />
          <div className="skill-list home-skill-list">
            {skills.slice(0, 5).map((s) => (
              <SkillListItem key={s.name} skill={s} nav={nav} />
            ))}
          </div>
        </section>
        <section>
          <SectionTitle title="Browse by category" />
          <div className="category-grid">
            {[
              "Documents",
              "Coding",
              "Data",
              "Design",
              "Writing",
              "Research",
              "Automation",
              "Security",
            ].map((c) => (
              <Link key={c} to="/categories" nav={nav}>
                <Icon name={c === "Security" ? "shield" : c === "Coding" ? "code" : "package"} />
                <span>{c}</span>
              </Link>
            ))}
          </div>
        </section>
        <section>
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
        </section>
        <section>
          <SectionTitle title="Built for trust" />
          <div className="feature-grid">
            <FeatureCard title="Repository provenance">
              Source links and package history stay visible.
            </FeatureCard>
            <FeatureCard title="Security scanning">Automated checks on every release.</FeatureCard>
            <FeatureCard title="Open source">Inspect source and requested permissions.</FeatureCard>
          </div>
          <Link to="/security" nav={nav} className="inline-link">
            Learn about security
          </Link>
        </section>
        <section className="cta">
          <div>
            <h2>Share your skill with the world</h2>
            <p>Publish your agent capability in the public registry.</p>
          </div>
          <Button onClick={() => nav("/submit")}>Submit a skill</Button>
        </section>
        <section>
          <SectionTitle title="Questions, answered" />
          <FAQ />
        </section>
      </main>
    </>
  );
}
