import { describe, it, expect } from "vitest";
import { buildCsp, buildHeadersFile } from "./cloudflare-headers";

describe("cloudflare headers", () => {
  it("is strict by default", () => {
    const csp = buildCsp();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src 'self';");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).not.toContain("unsafe-eval");
    expect(csp).toContain("connect-src 'self';");
    expect(csp).not.toMatch(/script-src[^;]*unsafe-inline/);
  });

  it("allows only the configured registry origin for fetches", () => {
    expect(buildCsp("https://reg.example.workers.dev")).toContain(
      "connect-src 'self' https://reg.example.workers.dev;",
    );
  });

  it("sets security and caching headers", () => {
    const f = buildHeadersFile();
    for (const h of ["X-Content-Type-Options: nosniff", "X-Frame-Options: DENY", "Referrer-Policy:", "Permissions-Policy:", "immutable"]) {
      expect(f).toContain(h);
    }
  });
});
