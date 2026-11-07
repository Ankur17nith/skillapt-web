import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Logo } from "../components/Logo";
import { CodeBlock } from "../components/CodeBlock";
import { Container } from "../components/Container";
import { getAllDocs, getDocBySlug } from "../lib/docs";

import { SEO } from "../components/SEO";

export function DocsPage() {
  const { "*": restSlug } = useParams();
  const allDocs = getAllDocs();
  const activeSlug = restSlug?.replace(/^\//, "") || "getting-started";
  const doc = getDocBySlug(activeSlug) || allDocs[0];

  return (
    <main className="page">
      <Container>
        <SEO title={doc.title} description={`${doc.label} documentation for skillapt.`} url={`/docs/${doc.slug}`} />
        <div className="docs-layout">
          <aside className="docs-nav">
        <Logo variant="full" />
        <strong>Documentation</strong>
        {allDocs.map((d) => (
          <Link
            key={d.slug}
            to={`/docs/${d.slug}`}
            style={{
              color: d.slug === doc.slug ? "var(--text)" : "var(--muted)",
              fontWeight: d.slug === doc.slug ? 600 : 400,
            }}
          >
            {d.label}
          </Link>
        ))}
      </aside>

      <article className="docs-article">
        <span className="label">{doc.label}</span>
        <h1>{doc.title}</h1>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: () => null, // Suppress top H1 since rendered above
            h2: ({ children }) => {
              const text = String(children);
              const id = text.replaceAll(" ", "-");
              return <h2 id={id}>{children}</h2>;
            },
            blockquote: ({ children }) => (
              <div className="callout">{children}</div>
            ),
            code: ({ className, children, ...props }) => {
              const text = String(children).replace(/\n$/, "");
              if (
                text.includes("\n") ||
                text.startsWith("npm") ||
                text.startsWith("skillapt") ||
                text.startsWith("skillpm") ||
                text.startsWith("git")
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
          {doc.content}
        </ReactMarkdown>

        <div className="docs-pager">
          {doc.prev ? (
            <Link to={`/docs/${doc.prev.slug}`}>← {doc.prev.title}</Link>
          ) : (
            <span />
          )}
          {doc.next ? (
            <Link to={`/docs/${doc.next.slug}`}>{doc.next.title} →</Link>
          ) : (
            <span />
          )}
        </div>
      </article>

      <aside className="docs-outline">
        <strong>On this page</strong>
        {doc.headings.map((h) => (
          <a href={`#${h.id}`} key={h.id}>
            {h.text}
          </a>
        ))}
      </aside>
        </div>
      </Container>
    </main>
  );
}
