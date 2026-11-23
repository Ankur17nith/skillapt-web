import { Helmet } from "react-helmet-async";
import { CONFIG, getSiteUrl } from "../config";
import { serializeJsonLd } from "../lib/llms";

interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  type?: "website" | "article";
  /** Structured data for this page (schema.org). */
  jsonLd?: object;
}

export function SEO({
  title,
  description = "Discover, install, and share capabilities for AI agents.",
  url = "/",
  type = "website",
  jsonLd,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${CONFIG.SITE_NAME}` : `The package manager for AI agent skills | ${CONFIG.SITE_NAME}`;
  // Absolute URLs are only emitted when VITE_SITE_URL is configured; we never
  // advertise a domain the deployment does not actually serve.
  const siteUrl = getSiteUrl();
  const canonicalUrl = siteUrl ? `${siteUrl}${url.startsWith("/") ? url : `/${url}`}` : "";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content={CONFIG.SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {jsonLd && <script type="application/ld+json">{serializeJsonLd(jsonLd)}</script>}
    </Helmet>
  );
}
