import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { FeatureCard } from "../components/FeatureCard";
import { SectionTitle } from "../components/SectionTitle";
import { Icon } from "../components/Icon";
import { Button } from "../components/Button";
import { Container } from "../components/Container";

export function SecurityPage() {
  const navigate = useNavigate();
  return (
    <main className="page">
      <Container>
        <PageHeader title="How we keep skills safe">
          <p>Clear checks, visible permissions, and a public process.</p>
        </PageHeader>
      <div className="feature-grid">
        <FeatureCard title="Repository provenance">
          Package pages link directly to their source and history.
        </FeatureCard>
        <FeatureCard title="Automated scanning">
          Every release is checked for risky behavior.
        </FeatureCard>
        <FeatureCard title="Visible permissions">
          Skills declare what they can access before install.
        </FeatureCard>
      </div>
      <section>
        <SectionTitle title="Tips before installing a skill" />
        <ul className="checklist">
          {[
            "Review the source repository and recent changes",
            "Check the publisher identity and package history",
            "Read every requested permission",
            "Pin versions in shared or production environments",
          ].map((x) => (
            <li key={x}>
              <Icon name="check" />
              {x}
            </li>
          ))}
        </ul>
      </section>
      <section className="cta">
        <div>
          <h2>Report a problem</h2>
          <p>Tell us about suspicious behavior or a security issue.</p>
        </div>
        <Button onClick={() => navigate("/about")}>Contact security</Button>
      </section>
      </Container>
    </main>
  );
}
