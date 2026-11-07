import { describe, it, expect } from "vitest";
import { searchSkillsWithFuse } from "./search";

describe("Fuse.js Search", () => {
  it("returns all skills when query is empty", () => {
    const results = searchSkillsWithFuse("");
    expect(results.length).toBe(12);
  });

  it("finds skills by exact name", () => {
    const results = searchSkillsWithFuse("pdf-summarizer");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toBe("pdf-summarizer");
  });

  it("finds skills by fuzzy keyword in description", () => {
    const results = searchSkillsWithFuse("pull requests");
    expect(results.some((s) => s.slug === "code-reviewer")).toBe(true);
  });

  it("finds skills by tag", () => {
    const results = searchSkillsWithFuse("database");
    expect(results.some((s) => s.slug === "sql-helper")).toBe(true);
  });

  it("finds skills by author name", () => {
    const results = searchSkillsWithFuse("paperplane");
    expect(results.some((s) => s.author === "paperplane")).toBe(true);
  });
});
