import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { normalizeBaseUrl } from "./src/config";
import { buildHeadersFile } from "./src/lib/cloudflare-headers";
import { CATEGORIES } from "./src/data/categories";
import rawRegistry from "./src/data/registry.json";
import { outputFileFor, renderPage, skillPath, staticPages, type PrerenderSkill } from "./src/lib/prerender";
import { registryApiBase } from "./src/lib/llms";
import { buildJsonLd, buildLlmsFullTxt, buildLlmsTxt, serializeJsonLd, type LlmsDoc } from "./src/lib/llms";

const ROUTES = [
  ["/", "daily", "1.0"],
  ["/browse", "daily", "0.9"],
  ["/publish", "weekly", "0.8"],
  ["/categories", "weekly", "0.8"],
  ["/collections", "weekly", "0.8"],
  ["/docs", "weekly", "0.8"],
  ["/security", "monthly", "0.6"],
  ["/about", "monthly", "0.5"],
] as const;

/** Reads content/docs/*.md in the order given by each page's `next` link (falls back to name order). */
function readDocs(): LlmsDoc[] {
  const dir = path.resolve(import.meta.dirname, "content/docs");
  const docs = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
      const front = match?.[1] ?? "";
      const title = /^title:\s*"?(.*?)"?\s*$/m.exec(front)?.[1] ?? file.replace(/\.md$/, "");
      return { slug: file.replace(/\.md$/, ""), title, body: match ? raw.slice(match[0].length) : raw };
    });
  const order = ["getting-started", "installing-skills", "writing-a-skill", "publishing", "cli-reference", "security-model", "faq"];
  return docs.sort((a, b) => (order.indexOf(a.slug) + 100) % 100 - (order.indexOf(b.slug) + 100) % 100);
}


/** Skills to prerender: bundled demo data, or the registry's most-downloaded skills when one is configured. */
const skillCache = new Map<string, Promise<PrerenderSkill[]>>();
function loadPrerenderSkills(registryUrl: string): Promise<PrerenderSkill[]> {
  const max = Number(process.env.PRERENDER_MAX_SKILLS || 300);
  const key = `${registryUrl}|${max}`;
  const cached = skillCache.get(key);
  if (cached) return cached;
  const task = (async (): Promise<PrerenderSkill[]> => {
    if (!registryUrl) {
      return (rawRegistry as any[]).slice(0, max).map((s) => ({
        name: s.name || s.slug,
        description: s.description,
        category: String(s.category || "other").toLowerCase(),
        author: s.author || "skillapt",
        version: s.version,
        license: s.license,
        sourceUrl: s.repo ? `https://github.com/${s.repo}` : undefined,
      }));
    }
    const base = registryApiBase(registryUrl);
    const out: PrerenderSkill[] = [];
    try {
      for (let page = 1; out.length < max; page++) {
        const res = await fetch(`${base}/v1/skills?sort=downloads&limit=100&page=${page}`, {
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(15000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { skills: any[]; pagination?: { totalPages?: number } };
        for (const s of data.skills) {
          out.push({
            name: s.name,
            description: s.description,
            category: s.category,
            author: s.owner?.handle || "unknown",
            version: s.latestVersion,
            license: s.license,
            claimStatus: s.claimStatus,
          });
        }
        if (data.skills.length === 0 || page >= (data.pagination?.totalPages ?? 1)) break;
      }
    } catch (err) {
      // Never fail a deploy because the registry is briefly unreachable; the SPA still works.
      console.warn(`[prerender] could not load skills from the registry (${(err as Error).message}); prerendering static pages only.`);
    }
    return out.slice(0, max);
  })();
  skillCache.set(key, task);
  return task;
}

/** Writes a static index.html per route (crawlers that skip JavaScript read these). */
function prerenderPages(siteUrl: string, registryUrl: string): Plugin {
  let outDir = "dist";
  return {
    name: "skillapt-prerender",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const template = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
      const docs = readDocs().map((d) => ({
        slug: d.slug,
        title: d.title,
        html: renderToStaticMarkup(createElement(ReactMarkdown, { remarkPlugins: [remarkGfm] }, d.body)),
      }));
      const skills = await loadPrerenderSkills(registryUrl);
      const pages = staticPages({ categories: CATEGORIES, docs, skills });
      for (const page of pages) {
        const file = path.join(outDir, outputFileFor(page.path));
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, renderPage(template, page, siteUrl));
      }
      console.log(`[prerender] wrote ${pages.length} pages (${skills.length} skills)`);
    },
  };
}

/**
 * Emits the Cloudflare _headers file (CSP etc.), robots.txt / sitemap.xml and the static Open Graph/Twitter image tags
 * (read by crawlers that do not run JS) pointing at VITE_SITE_URL. When the variable is unset (e.g. before a custom
 * domain exists) no absolute URLs are produced at all.
 */
function siteSeo(siteUrl: string, registryUrl: string): Plugin {
  return {
    name: "skillapt-site-seo",
    transformIndexHtml() {
      // Structured data is a JSON data block, so the script-src CSP does not apply to it.
      const jsonLd = buildJsonLd({ siteName: "skillapt", siteUrl }).map((data) => ({
        tag: "script",
        attrs: { type: "application/ld+json" },
        children: serializeJsonLd(data),
        injectTo: "head" as const,
      }));
      if (!siteUrl) return jsonLd;
      return [
        { tag: "meta", attrs: { property: "og:image", content: `${siteUrl}/og-image.png` }, injectTo: "head" as const },
        { tag: "meta", attrs: { name: "twitter:image", content: `${siteUrl}/og-image.png` }, injectTo: "head" as const },
        ...jsonLd,
      ];
    },
    async generateBundle() {
      // Cloudflare (Workers static assets / Pages) reads _headers from the output root.
      const registryOrigin = registryUrl ? new URL(registryUrl).origin : "";
      this.emitFile({ type: "asset", fileName: "_headers", source: buildHeadersFile(registryOrigin) });
      const robots = ["User-agent: *", "Allow: /"];
      if (siteUrl) robots.push("", `Sitemap: ${siteUrl}/sitemap.xml`);
      this.emitFile({ type: "asset", fileName: "robots.txt", source: `${robots.join("\n")}\n` });

      // Plain-text guides for LLMs and agents.
      const llmsInput = { siteName: "skillapt", siteUrl, registryUrl, categories: CATEGORIES, docs: readDocs() };
      this.emitFile({ type: "asset", fileName: "llms.txt", source: buildLlmsTxt(llmsInput) });
      this.emitFile({ type: "asset", fileName: "llms-full.txt", source: buildLlmsFullTxt(llmsInput) });
      if (!siteUrl) return;
      const skillRoutes = (await loadPrerenderSkills(registryUrl)).map((s) => [skillPath(s.name), "weekly", "0.7"] as const);
      const docRoutes = readDocs().map((d) => [`/docs/${d.slug}`, "weekly", "0.7"] as const);
      const urls = [...ROUTES, ...docRoutes, ...skillRoutes]
        .map(
          ([route, freq, prio]) =>
            `  <url>\n    <loc>${siteUrl}${route === "/" ? "/" : route}</loc>\n    <changefreq>${freq}</changefreq>\n    <priority>${prio}</priority>\n  </url>`,
        )
        .join("\n");
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const siteUrl = normalizeBaseUrl(env.VITE_SITE_URL);
  const registryUrl = normalizeBaseUrl(env.VITE_REGISTRY_URL) || normalizeBaseUrl(env.VITE_API_URL);
  return {
    plugins: [react(), tailwindcss(), siteSeo(siteUrl, registryUrl), prerenderPages(siteUrl, registryUrl)],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    build: {
      // Never inline assets as data: URIs; the CSP (font-src/img-src) relies on real files.
      assetsInlineLimit: 0,
    },
    server: {
      host: "0.0.0.0",
      port: 8443,
    },
    preview: {
      host: "0.0.0.0",
      port: 8443,
    },
  };
});
