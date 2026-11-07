import { describe, it, expect } from "vitest";
import {
  getSkills,
  getSkillBySlug,
  getRelated,
  getCategories,
  filterSkills,
  sortSkills,
  getInstallCommand,
  getRegistryStats,
} from "./skills";

describe("Skills Registry & Helpers", () => {
  it("loads 12 skills from registry.json", () => {
    const all = getSkills();
    expect(all.length).toBe(12);
    expect(all[0]).toHaveProperty("slug");
    expect(all[0]).toHaveProperty("repo");
    expect(all[0]).toHaveProperty("compatibility");
  });

  it("finds skill by slug correctly", () => {
    const skill = getSkillBySlug("pdf-summarizer");
    expect(skill).toBeDefined();
    expect(skill?.name).toBe("pdf-summarizer");
    expect(skill?.author).toBe("paperplane");

    const nonExistent = getSkillBySlug("unknown-skill-xyz");
    expect(nonExistent).toBeUndefined();
  });

  it("generates correct install command including subpath", () => {
    const pdf = getSkillBySlug("pdf-summarizer");
    expect(getInstallCommand(pdf!)).toBe("skillpm install paperplane/pdf-summarizer");

    const tokenSync = getSkillBySlug("design-token-sync");
    expect(getInstallCommand(tokenSync!)).toBe(
      "skillpm install figma-dev/design-token-sync/packages/sync"
    );
  });

  it("retrieves distinct categories", () => {
    const categories = getCategories();
    expect(categories).toContain("Documents");
    expect(categories).toContain("Coding");
    expect(categories).toContain("Data");
    expect(categories).toContain("Security");
  });

  it("filters skills by query, category, compatibility and verification", () => {
    const all = getSkills();

    // Query filter
    const queryResults = filterSkills(all, { query: "pdf" });
    expect(queryResults.some((s) => s.slug === "pdf-summarizer")).toBe(true);

    // Category filter
    const codingSkills = filterSkills(all, { category: "Coding" });
    expect(codingSkills.length).toBeGreaterThan(0);
    expect(codingSkills.every((s) => s.category === "Coding" || s.tags.includes("coding"))).toBe(true);

    // Compatibility filter
    const cursorSkills = filterSkills(all, { compat: "Cursor" });
    expect(cursorSkills.every((s) => s.compatibility.includes("Cursor"))).toBe(true);

    // Verified filter
    const verifiedSkills = filterSkills(all, { verified: true });
    expect(verifiedSkills.every((s) => s.verified === true)).toBe(true);
  });

  it("sorts skills properly", () => {
    const all = getSkills();

    const azSorted = sortSkills(all, "A–Z");
    expect(azSorted[0].name.localeCompare(azSorted[1].name)).toBeLessThanOrEqual(0);

    const starsSorted = sortSkills(all, "Stars");
    expect(starsSorted[0].stars).toBeGreaterThanOrEqual(starsSorted[1].stars);

    const installsSorted = sortSkills(all, "Installs");
    expect(installsSorted[0].installs).toBeGreaterThanOrEqual(installsSorted[1].installs);
  });

  it("computes stats accurately", () => {
    const stats = getRegistryStats();
    expect(stats.totalSkills).toBe(12);
    expect(stats.totalInstalls).toBeGreaterThan(100000);
    expect(stats.totalStars).toBeGreaterThan(5000);
    expect(stats.verifiedCount).toBeGreaterThan(0);
  });

  it("finds related skills by category or tags", () => {
    const pdf = getSkillBySlug("pdf-summarizer");
    const related = getRelated(pdf!, 3);
    expect(related.length).toBeLessThanOrEqual(3);
    expect(related.every((s) => s.slug !== "pdf-summarizer")).toBe(true);
  });
});
