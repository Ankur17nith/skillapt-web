import { Helmet } from "react-helmet-async";
import { CONFIG } from "../config";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
}

export function SEO({
  title,
  description = "Discover, install, and share capabilities for AI agents.",
  image = "/og-image.png",
  url = "/",
  type = "website",
}: SEOProps) {
  const fullTitle = title ? `${title} | ${CONFIG.SITE_NAME}` : `The package manager for AI agent skills | ${CONFIG.SITE_NAME}`;
  const canonicalUrl = `${CONFIG.SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
  const fullImage = image.startsWith("http") ? image : `${CONFIG.SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={CONFIG.SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
    </Helmet>
  );
}
