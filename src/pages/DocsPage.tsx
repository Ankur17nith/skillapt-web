import { Logo } from "../components/Logo";
import { CodeBlock } from "../components/CodeBlock";
import type { Nav } from "../types";

const docSections = [
  "Getting started",
  "Installing skills",
  "Writing a skill",
  "CLI reference",
  "FAQ",
];

export function DocsPage({ nav }: { nav: Nav }) {
  return (
    <main className="docs-layout">
      <aside className="docs-nav">
        <Logo variant="full" nav={nav} />
        <strong>Documentation</strong>
        {docSections.map((s) => (
          <a href={`#${s.replaceAll(" ", "-")}`} key={s}>
            {s}
          </a>
        ))}
      </aside>
      <article className="docs-article">
        <span className="label">Getting started</span>
        <h1>Install your first skill</h1>
        <p className="lead">Use skillpm to find and add capabilities to your AI agent.</p>
        <h2 id="Installing-skills">Install the CLI</h2>
        <p>
          The skillpm CLI works with Node.js 20 or newer. Install it globally or run it with npx.
        </p>
        <CodeBlock>npm install -g skillpm</CodeBlock>
        <div className="callout">
          <strong>Before you install</strong>
          <p>Review the source, requested permissions, and compatibility list for every skill.</p>
        </div>
        <h2 id="Writing-a-skill">Install a skill</h2>
        <p>Pass the publisher and skill name to the install command.</p>
        <CodeBlock>skillpm install paperplane/pdf-summarizer</CodeBlock>
        <h2 id="CLI-reference">Check installed skills</h2>
        <CodeBlock>skillpm list</CodeBlock>
        <div className="docs-pager">
          <a href="#Installing-skills">← Installation</a>
          <a href="#Writing-a-skill">Writing a skill →</a>
        </div>
      </article>
      <aside className="docs-outline">
        <strong>On this page</strong>
        <a href="#Installing-skills">Install the CLI</a>
        <a href="#Writing-a-skill">Install a skill</a>
        <a href="#CLI-reference">Check installed skills</a>
      </aside>
    </main>
  );
}
