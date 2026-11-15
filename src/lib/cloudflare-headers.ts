/**
 * Builds the Cloudflare `_headers` file served with the static assets.
 * Used by the Vite build (see vite.config.ts) so connect-src can include the
 * configured registry origin, and covered by unit tests.
 */
export function buildCsp(registryOrigin = ""): string {
  const connect = ["'self'", registryOrigin].filter(Boolean).join(" ");
  return [
    "default-src 'self'",
    "script-src 'self'",
    // React inline style={{}} attributes cannot be hashed, so 'unsafe-inline' is required for styles only.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    `connect-src ${connect}`,
    "manifest-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export function buildHeadersFile(registryOrigin = ""): string {
  return `# Generated at build time by vite.config.ts (src/lib/cloudflare-headers.ts)
/*
  Content-Security-Policy: ${buildCsp(registryOrigin)}
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
  Cross-Origin-Opener-Policy: same-origin
  Strict-Transport-Security: max-age=31536000

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/index.html
  Cache-Control: no-cache
`;
}
