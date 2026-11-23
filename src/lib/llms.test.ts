import { describe, expect, it } from "vitest";
import { buildJsonLd, buildLlmsFullTxt, buildLlmsTxt, registryApiBase, serializeJsonLd, skillJsonLd } from "./llms";

const base = {
  siteName: "skillapt",
  siteUrl: "https://skills.example",
  registryUrl: "https://reg.example/v1/",
  categories: [{ id: "security", label: "Security", description: "Audit code." }],
  docs: [{ slug: "getting-started", title: "Getting started", body: "Run npx skillapt." }],
};

describe("llms files", () => {
  it("normalises the registry base", () => {
    expect(registryApiBase("https://reg.example/v1/")).toBe("https://reg.example");
    expect(registryApiBase("https://reg.example")).toBe("https://reg.example");
  });

  it("tells agents how to search, install and where the plain-text API is", () => {
    const txt = buildLlmsTxt(base);
    expect(txt).toContain("npx skillapt search");
    expect(txt).toContain("npx skillapt install <name>");
    expect(txt).toContain("https://reg.example/v1/skills?q=<what you need>&format=text");
    expect(txt).toContain("- security: Audit code.");
    expect(txt).toContain("(https://skills.example/docs/getting-started)");
    expect(txt).toContain("unclaimed");
  });

  it("omits registry endpoints and absolute links when they are not configured", () => {
    const txt = buildLlmsTxt({ ...base, siteUrl: "", registryUrl: "" });
    expect(txt).not.toContain("Registry API");
    expect(txt).not.toContain("https://");
    expect(txt).toContain("(/docs/getting-started)");
  });

  it("concatenates every doc in the full file", () => {
    const full = buildLlmsFullTxt(base);
    expect(full).toContain("# Getting started");
    expect(full).toContain("Run npx skillapt.");
  });

  it("builds JSON-LD with a search action only when the site URL is known", () => {
    const [site] = buildJsonLd(base) as any[];
    expect(site.potentialAction.target).toBe("https://skills.example/browse?q={search_term_string}");
    const [bare] = buildJsonLd({ siteName: "skillapt", siteUrl: "" }) as any[];
    expect(bare.potentialAction).toBeUndefined();
  });

  it("cannot break out of a script tag", () => {
    const out = serializeJsonLd(skillJsonLd({ name: "x", description: "</script><script>alert(1)</script>", author: "a" }));
    expect(out).not.toContain("</script>");
    expect(JSON.parse(out).description).toContain("</script>");
  });
});
