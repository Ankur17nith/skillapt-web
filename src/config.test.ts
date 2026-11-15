import { describe, it, expect, afterEach, vi } from "vitest";
import { normalizeBaseUrl, getRegistryUrl, getSiteUrl } from "./config";

describe("config url handling", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("accepts https and localhost http, strips trailing slashes", () => {
    expect(normalizeBaseUrl("https://reg.example.workers.dev/")).toBe("https://reg.example.workers.dev");
    expect(normalizeBaseUrl("http://localhost:8787")).toBe("http://localhost:8787");
    expect(normalizeBaseUrl("http://127.0.0.1:8787/")).toBe("http://127.0.0.1:8787");
  });

  it("rejects plaintext remote, junk, and non-http schemes", () => {
    expect(normalizeBaseUrl("http://evil.example.com")).toBe("");
    expect(normalizeBaseUrl("javascript:alert(1)")).toBe("");
    expect(normalizeBaseUrl("not a url")).toBe("");
    expect(normalizeBaseUrl("")).toBe("");
    expect(normalizeBaseUrl(undefined)).toBe("");
  });

  it("prefers VITE_REGISTRY_URL over legacy VITE_API_URL", () => {
    vi.stubEnv("VITE_REGISTRY_URL", "https://a.example.dev");
    vi.stubEnv("VITE_API_URL", "https://b.example.dev");
    expect(getRegistryUrl()).toBe("https://a.example.dev");
    vi.stubEnv("VITE_REGISTRY_URL", "");
    expect(getRegistryUrl()).toBe("https://b.example.dev");
  });

  it("is empty (demo mode) and has no site url when unset", () => {
    vi.stubEnv("VITE_REGISTRY_URL", "");
    vi.stubEnv("VITE_API_URL", "");
    vi.stubEnv("VITE_SITE_URL", "");
    expect(getRegistryUrl()).toBe("");
    expect(getSiteUrl()).toBe("");
  });
});
