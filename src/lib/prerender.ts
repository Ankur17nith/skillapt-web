/**
 * Static HTML for crawlers that do not run JavaScript. The Vite build writes one
 * `index.html` per route by filling the built index.html template with route-specific
 * metadata and readable body content; React replaces the body on load (createRoot,
 * not hydration), so there is no mismatch to manage.
 *
 * Everything here is pure and escapes all dynamic text: skill names and descriptions
 * come from a registry that may index third-party repositories.
 */

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface PrerenderPage {
  /** Route path, for example "/skills/pdf-summarizer". */
  path: string;
  title: string;
  description: string;
  /** Trusted or already-escaped HTML for the page body. */
  bodyHtml: string;
  jsonLd?: object[];
  type?: "website" | "article";
}

export interface PrerenderSkill {
  name: string;
  description: string;
  category: string;
  author: string;
  version?: string;
  license?: string;
  sourceUrl?: string;
  claimStatus?: string;
  keywords?: string[];
}

const SITE = "skillapt";

/** Output file for a route: "/" -> index.html, "/skills/@a/b" -> skills/@a/b/index.html. */
export function outputFileFor(routePath: string): string {
  const clean = routePath.replace(/^\/+|\/+$/g, "");
  return clean ? `${clean}/index.html` : "index.html";
}

export function renderPage(template: string, page: PrerenderPage, siteUrl: string): string {
  const title = escapeHtml(page.path === "/" ? page.title : `${page.title} | ${SITE}`);
  const description = escapeHtml(page.description);
  const url = siteUrl ? `${siteUrl}${page.path === "/" ? "/" : page.path}` : "";

  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${description}" />`)
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/, `<meta property="og:type" content="${page.type ?? "website"}" />`);

  const extra: string[] = [];
  if (url) {
    extra.push(`<link rel="canonical" href="${escapeHtml(url)}" />`, `<meta property="og:url" content="${escapeHtml(url)}" />`);
  }
  for (const data of page.jsonLd ?? []) {
    extra.push(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`);
  }
  if (extra.length) html = html.replace("</head>", `    ${extra.join("\n    ")}\n  </head>`);

  return html.replace('<div id="root"></div>', `<div id="root">${page.bodyHtml}</div>`);
}

const link = (href: string, text: string) => `<a href="${escapeHtml(href)}">${escapeHtml(text)}</a>`;

export function skillPath(name: string): string {
  return `/skills/${name}`;
}

export function skillPage(skill: PrerenderSkill): PrerenderPage {
  const unclaimed = skill.claimStatus === "unclaimed";
  const safeSource = skill.sourceUrl && /^https:\/\//.test(skill.sourceUrl) ? skill.sourceUrl : undefined;
  const body = [
    "<main><article>",
    `<h1>${escapeHtml(skill.name)}</h1>`,
    `<p>by @${escapeHtml(skill.author)}${unclaimed ? " (unclaimed listing)" : ""}</p>`,
    `<p>${escapeHtml(skill.description)}</p>`,
    `<p>Category: ${link(`/browse?category=${encodeURIComponent(skill.category)}`, skill.category)}</p>`,
    "<h2>Install</h2>",
    `<pre><code>npx skillapt install ${escapeHtml(skill.name)}</code></pre>`,
    safeSource ? `<p><a href="${escapeHtml(safeSource)}" rel="noopener noreferrer">Source repository</a></p>` : "",
    unclaimed ? "<p>Indexed automatically from a public repository. The owner has not claimed it yet.</p>" : "",
    "</article></main>",
  ].join("");

  return {
    path: skillPath(skill.name),
    title: skill.name,
    description: skill.description,
    type: "article",
    bodyHtml: body,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        name: skill.name,
        description: skill.description,
        author: { "@type": "Person", name: skill.author },
        ...(skill.license ? { license: skill.license } : {}),
        ...(safeSource ? { codeRepository: safeSource } : {}),
        ...(skill.version ? { version: skill.version } : {}),
        applicationCategory: skill.category,
      },
    ],
  };
}

function skillList(skills: readonly PrerenderSkill[]): string {
  if (skills.length === 0) return "";
  const items = skills
    .map((s) => `<li>${link(skillPath(s.name), s.name)}: ${escapeHtml(s.description)}</li>`)
    .join("");
  return `<ul>${items}</ul>`;
}

export interface StaticPageInput {
  categories: readonly { id: string; label: string; description: string }[];
  docs: readonly { slug: string; title: string; html: string }[];
  skills: readonly PrerenderSkill[];
}

/** The marketing and index pages, with crawlable links to categories, docs and skills. */
export function staticPages(input: StaticPageInput): PrerenderPage[] {
  const { categories, docs, skills } = input;
  const top = skills.slice(0, 50);
  const categoryList = `<ul>${categories
    .map((c) => `<li>${link(`/browse?category=${c.id}`, c.label)}: ${escapeHtml(c.description)}</li>`)
    .join("")}</ul>`;
  const docList = `<ul>${docs.map((d) => `<li>${link(`/docs/${d.slug}`, d.title)}</li>`).join("")}</ul>`;

  const pages: PrerenderPage[] = [
    {
      path: "/",
      title: "The package manager for AI agent skills | skillapt",
      description: "Discover, install, and share capabilities for AI agents.",
      bodyHtml: `<main><h1>The package manager for AI agent skills</h1><p>Find a skill with plain words, then install it with one command: <code>npx skillapt install &lt;name&gt;</code>.</p><h2>Categories</h2>${categoryList}<h2>Popular skills</h2>${skillList(top.slice(0, 12))}</main>`,
    },
    {
      path: "/browse",
      title: "Browse skills",
      description: "Explore AI agent capabilities across categories.",
      bodyHtml: `<main><h1>Browse skills</h1>${skillList(top)}<h2>Categories</h2>${categoryList}</main>`,
    },
    {
      path: "/categories",
      title: "Categories",
      description: "Browse AI agent skills by what they are for: documents, coding, testing, security, data and more.",
      bodyHtml: `<main><h1>Categories</h1>${categoryList}</main>`,
    },
    {
      path: "/docs",
      title: "Documentation",
      description: "Documentation for the skillapt package manager.",
      bodyHtml: `<main><h1>Documentation</h1>${docList}</main>`,
    },
  ];

  for (const d of docs) {
    pages.push({
      path: `/docs/${d.slug}`,
      title: d.title,
      description: `${d.title}: skillapt documentation.`,
      type: "article",
      bodyHtml: `<main><article><h1>${escapeHtml(d.title)}</h1>${d.html}</article></main>`,
    });
  }

  for (const [path, title, description] of [
    ["/publish", "Publish Guide", "How to package and publish an AI agent skill."],
    ["/security", "Security", "Learn about the skillapt security model and permission guarantees."],
    ["/about", "About", "About skillapt, the package manager for AI agent skills."],
    ["/collections", "Collections", "Curated collections of AI agent skills."],
  ] as const) {
    pages.push({ path, title, description, bodyHtml: `<main><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p></main>` });
  }

  for (const s of skills) pages.push(skillPage(s));
  return pages;
}
