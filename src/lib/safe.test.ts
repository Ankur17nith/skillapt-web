import { describe, it, expect } from "vitest";
import { parseGithubRepo, githubRepoUrl, isHttpUrl, slugifyHeading } from "./safe";

describe("parseGithubRepo", () => {
  it("accepts owner/repo and github urls", () => {
    expect(parseGithubRepo("paperplane/pdf-summarizer")).toBe("paperplane/pdf-summarizer");
    expect(parseGithubRepo("https://github.com/a/b.git")).toBe("a/b");
    expect(parseGithubRepo("https://github.com/a/b/")).toBe("a/b");
  });
  it("rejects anything else", () => {
    for (const bad of ["", null, undefined, "javascript:alert(1)", "https://evil.com/a/b", "a/b/c", "a b/c", "../x", "a/..", "//evil.com"]) {
      expect(parseGithubRepo(bad as string)).toBeNull();
    }
    expect(githubRepoUrl("x")).toBeNull();
    expect(githubRepoUrl("a/b")).toBe("https://github.com/a/b");
  });
});

describe("isHttpUrl", () => {
  it("only allows http(s)", () => {
    expect(isHttpUrl("https://example.com/x")).toBe(true);
    expect(isHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isHttpUrl("data:text/html,x")).toBe(false);
    expect(isHttpUrl("/relative")).toBe(false);
  });
});

describe("slugifyHeading", () => {
  it("makes stable ids", () => {
    expect(slugifyHeading("Getting Started")).toBe("getting-started");
    expect(slugifyHeading("`skillapt install`: usage!")).toBe("skillapt-install-usage");
  });
});
