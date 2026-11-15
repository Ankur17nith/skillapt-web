/**
 * Helpers for handling values that originate from the (untrusted) registry
 * or from markdown content before they are used in URLs or DOM attributes.
 */

const GITHUB_REPO_RE = /^[A-Za-z0-9_.-]{1,100}\/[A-Za-z0-9_.-]{1,100}$/;

/**
 * Accepts "owner/repo" or "https://github.com/owner/repo(.git)(/)" and returns
 * the canonical "owner/repo", or null if the value is anything else.
 */
export function parseGithubRepo(value: string | null | undefined): string | null {
  if (!value) return null;
  let v = value.trim().replace(/^https:\/\/github\.com\//i, "");
  v = v.replace(/\.git$/i, "").replace(/\/+$/, "");
  return GITHUB_REPO_RE.test(v) && !v.includes("..") ? v : null;
}

export function githubRepoUrl(repo: string | null | undefined): string | null {
  const parsed = parseGithubRepo(repo);
  return parsed ? `https://github.com/${parsed}` : null;
}

/** True only for absolute http(s) URLs. */
export function isHttpUrl(value: string | undefined): boolean {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/** Stable, URL-safe heading id used for both the outline and the heading element. */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}
