import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";
import { normalizeBaseUrl } from "./src/config";
import { buildHeadersFile } from "./src/lib/cloudflare-headers";
import { CATEGORIES } from "./src/data/categories";
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
    generateBundle() {
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
      const urls = ROUTES.map(
        ([route, freq, prio]) =>
          `  <url>\n    <loc>${siteUrl}${route === "/" ? "/" : route}</loc>\n    <changefreq>${freq}</changefreq>\n    <priority>${prio}</priority>\n  </url>`,
      ).join("\n");
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
    plugins: [react(), tailwindcss(), siteSeo(siteUrl, registryUrl)],
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
