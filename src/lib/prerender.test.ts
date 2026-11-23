import { describe, expect, it } from "vitest";
import { escapeHtml, outputFileFor, renderPage, skillPage, staticPages } from "./prerender";

const template = `<!doctype html>
<html lang="en">
  <head>
    <title>Home | skillapt</title>
    <meta name="description" content="Discover, install, and share capabilities for AI agents." />
    <meta property="og:title" content="The package manager for AI agent skills | skillapt" />
    <meta
      property="og:description"
      content="Discover, install, and share capabilities for AI agents."
    />
    <meta property="og:type" content="website" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

const skill = {
  name: "@alice/pdf-tools",
  description: 'Extract <b>text</b> & "tables"',
  category: "documents",
  author: "alice",
  license: "MIT",
  sourceUrl: "https://github.com/alice/skills",
  claimStatus: "unclaimed",
};

describe("prerender", () => {
  it("maps routes to files", () => {
    expect(outputFileFor("/")).toBe("index.html");
    expect(outputFileFor("/docs/faq")).toBe("docs/faq/index.html");
    expect(outputFileFor("/skills/@alice/pdf-tools")).toBe("skills/@alice/pdf-tools/index.html");
  });

  it("fills metadata, canonical, JSON-LD and body", () => {
    const html = renderPage(template, skillPage(skill), "https://skills.example");
    expect(html).toContain("<title>@alice/pdf-tools | skillapt</title>");
    expect(html).toContain('<link rel="canonical" href="https://skills.example/skills/@alice/pdf-tools" />');
    expect(html).toContain('<meta property="og:type" content="article" />');
    expect(html).toContain('<script type="application/ld+json">');
    expect(html).toContain("<h1>@alice/pdf-tools</h1>");
    expect(html).toContain("npx skillapt install @alice/pdf-tools");
    expect(html).toContain("(unclaimed listing)");
    expect(html).not.toContain('<div id="root"></div>');
  });

  it("escapes untrusted text everywhere", () => {
    const html = renderPage(template, skillPage({ ...skill, name: "x", description: '</script><img src=x onerror=alert(1)>' }), "");
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(escapeHtml(`<a href="x">'&`)).toBe("&lt;a href=&quot;x&quot;&gt;&#39;&amp;");
  });

  it("emits no absolute URLs when the site URL is unknown, and drops non-https sources", () => {
    const html = renderPage(template, skillPage({ ...skill, sourceUrl: "javascript:alert(1)" }), "");
    expect(html).not.toContain("canonical");
    expect(html).not.toContain("javascript:");
  });

  it("builds crawlable index pages that link to skills and docs", () => {
    const pages = staticPages({
      categories: [{ id: "documents", label: "Documents", description: "Files." }],
      docs: [{ slug: "faq", title: "FAQ", html: "<p>Q</p>" }],
      skills: [skill],
    });
    const paths = pages.map((p) => p.path);
    expect(paths).toEqual(expect.arrayContaining(["/", "/browse", "/categories", "/docs", "/docs/faq", "/publish", "/skills/@alice/pdf-tools"]));
    expect(pages.find((p) => p.path === "/browse")!.bodyHtml).toContain('href="/skills/@alice/pdf-tools"');
    expect(pages.find((p) => p.path === "/docs/faq")!.bodyHtml).toContain("<p>Q</p>");
  });
});
