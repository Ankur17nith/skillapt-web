import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { normalizeBaseUrl } from "./src/config";

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

/**
 * Emits robots.txt / sitemap.xml and the static Open Graph/Twitter image tags
 * (read by crawlers that do not run JS) pointing at VITE_SITE_URL. When the variable is unset (e.g. before a custom
 * domain exists) no absolute URLs are produced at all.
 */
function siteSeo(siteUrl: string): Plugin {
  return {
    name: "skillapt-site-seo",
    transformIndexHtml() {
      if (!siteUrl) return [];
      return [
        { tag: "meta", attrs: { property: "og:image", content: `${siteUrl}/og-image.png` }, injectTo: "head" },
        { tag: "meta", attrs: { name: "twitter:image", content: `${siteUrl}/og-image.png` }, injectTo: "head" },
      ];
    },
    generateBundle() {
      const robots = ["User-agent: *", "Allow: /"];
      if (siteUrl) robots.push("", `Sitemap: ${siteUrl}/sitemap.xml`);
      this.emitFile({ type: "asset", fileName: "robots.txt", source: `${robots.join("\n")}\n` });
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
  return {
    plugins: [react(), tailwindcss(), siteSeo(siteUrl)],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
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
