import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/Button";
import { Container } from "../components/Container";

export function AboutPage() {
  return (
    <main className="page">
      <Container>
        <div className="narrow">
          <PageHeader title="About skillpm">
            <p>We make useful agent capabilities easier to find, inspect, and share.</p>
          </PageHeader>
      <section>
        <h2>Our mission</h2>
        <p>
          AI agents are becoming part of everyday development work. Skills should be portable,
          understandable, and safe to install. skillpm provides a public specification and registry
          for that work.
        </p>
      </section>
      <section>
        <h2>Open source by default</h2>
        <p>
          The CLI, package format, and registry tooling are open source. Decisions are discussed in
          public and contributions are welcome.
        </p>
        <Button
          onClick={() => {
            window.location.href = "mailto:hello@skillpm.dev";
          }}
        >
          Contact us
        </Button>
      </section>
        </div>
      </Container>
    </main>
  );
}
