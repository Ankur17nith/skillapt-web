import { describe, expect, it } from "vitest";
import { CATEGORIES, categoryLabel, getCategory } from "./categories";

describe("categories", () => {
  it("has unique ids and a description for every category", () => {
    expect(new Set(CATEGORIES.map((c) => c.id)).size).toBe(CATEGORIES.length);
    expect(CATEGORIES.every((c) => c.description.length > 10)).toBe(true);
    expect(CATEGORIES.at(-1)?.id).toBe("other");
  });

  it("looks up case-insensitively and labels unknown ids", () => {
    expect(getCategory("Security")?.label).toBe("Security");
    expect(categoryLabel("ai-agents")).toBe("AI agents & prompts");
    expect(categoryLabel("mystery")).toBe("Mystery");
    expect(categoryLabel("")).toBe("Other");
  });
});
