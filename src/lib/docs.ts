export interface DocPage {
  slug: string;
  title: string;
  label: string;
  content: string;
  headings: { id: string; text: string }[];
  prev?: { slug: string; title: string } | null;
  next?: { slug: string; title: string } | null;
}

const rawDocs = import.meta.glob("/content/docs/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parseDoc(raw: string, fallbackSlug: string): DocPage {
  let content = raw;
  const metadata: Record<string, any> = {};

  if (raw.startsWith("---")) {
    const end = raw.indexOf("---", 3);
    if (end !== -1) {
      const frontmatter = raw.slice(3, end).trim();
      content = raw.slice(end + 3).trim();
      frontmatter.split("\n").forEach((line) => {
        const colon = line.indexOf(":");
        if (colon !== -1) {
          const key = line.slice(0, colon).trim();
          let val = line.slice(colon + 1).trim();
          if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
          if (val === "null") metadata[key] = null;
          else metadata[key] = val;
        }
      });
    }
  }

  // Extract H2 headings for outline
  const headings: { id: string; text: string }[] = [];
  const lines = content.split("\n");
  lines.forEach((line) => {
    if (line.startsWith("## ")) {
      const text = line.slice(3).trim();
      const id = text.replaceAll(" ", "-");
      headings.push({ id, text });
    }
  });

  return {
    slug: metadata.slug || fallbackSlug,
    title: metadata.title || "Documentation",
    label: metadata.label || "Docs",
    content,
    headings,
    prev: metadata.prev ? { slug: metadata.prev, title: metadata.prevTitle || metadata.prev } : null,
    next: metadata.next ? { slug: metadata.next, title: metadata.nextTitle || metadata.next } : null,
  };
}

export function getAllDocs(): DocPage[] {
  const docs: DocPage[] = [];
  const order = [
    "getting-started",
    "installing-skills",
    "writing-a-skill",
    "publishing",
    "cli-reference",
    "security-model",
    "faq",
  ];

  order.forEach((slug) => {
    const path = `/content/docs/${slug}.md`;
    if (rawDocs[path]) {
      docs.push(parseDoc(rawDocs[path], slug));
    }
  });

  return docs;
}

export function getDocBySlug(slug: string): DocPage | undefined {
  const all = getAllDocs();
  return all.find((d) => d.slug === slug) || all[0];
}
