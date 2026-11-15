export const PRODUCT_NAME = "skillapt";

/**
 * Normalize a user-supplied base URL from the build environment.
 * Returns "" when unset or invalid. Only https:// (or http:// for
 * localhost / 127.0.0.1 during development) is accepted so a mistyped
 * variable can never point the app at a plaintext remote origin.
 */
export function normalizeBaseUrl(value: unknown): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed);
    const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (url.protocol !== "https:" && !(url.protocol === "http:" && isLocal)) return "";
    return `${url.origin}${url.pathname}`.replace(/\/+$/, "");
  } catch {
    return "";
  }
}

/**
 * Registry API base URL. `VITE_REGISTRY_URL` is preferred; `VITE_API_URL` is
 * still honoured for backwards compatibility. Empty means "demo mode": the app
 * serves bundled sample data and never calls the network.
 * Read lazily so tests can stub the environment.
 */
export function getRegistryUrl(): string {
  const env = import.meta.env as Record<string, unknown>;
  return normalizeBaseUrl(env.VITE_REGISTRY_URL) || normalizeBaseUrl(env.VITE_API_URL);
}

/**
 * Public origin of this site (used for canonical/Open Graph URLs and the
 * generated sitemap). Empty when unset, in which case absolute SEO URLs are
 * omitted instead of pointing at a domain that may not exist.
 */
export function getSiteUrl(): string {
  return normalizeBaseUrl((import.meta.env as Record<string, unknown>).VITE_SITE_URL);
}

export const CONFIG = {
  NAME: PRODUCT_NAME,
  PRODUCT_NAME,
  SITE_NAME: "skillapt",
  GITHUB_URL: "https://github.com/Ankur17nith/skillapt-web",
  CLI_GITHUB_URL: "https://github.com/Ankur17nith/skillapt",
  REGISTRY_GITHUB_URL: "https://github.com/Ankur17nith/skillapt-registry",
  ISSUES_URL: "https://github.com/Ankur17nith/skillapt-web/issues",
  CLI_COMMAND: "skillapt",
  CLI_INSTALL: "npm i -g skillapt",
};
