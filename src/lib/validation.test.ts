import { describe, it, expect } from "vitest";
import { validateSubmitForm, generateRegistryPayload, validateSkillManifest } from "./validation";

describe("Submit Form Validation & Generation", () => {
  it("rejects invalid or empty GitHub repository URLs", () => {
    expect(validateSubmitForm({ repo: "" }).repo).toBe("Enter a public GitHub repository URL.");
    expect(validateSubmitForm({ repo: "https://gitlab.com/user/repo" }).repo).toBe(
      "Must be a valid GitHub repository URL (e.g., https://github.com/user/repo)."
    );
    expect(validateSubmitForm({ repo: "https://github.com/user" }).repo).toBe(
      "Must be a valid GitHub repository URL (e.g., https://github.com/user/repo)."
    );
  });

  it("accepts valid GitHub repository URLs", () => {
    const errors = validateSubmitForm({
      repo: "https://github.com/octocat/hello-world",
      name: "hello-world",
      category: "Coding",
      compatibility: ["Claude"],
      description: "A test description",
    });
    expect(errors.repo).toBeUndefined();
    expect(Object.keys(errors).length).toBe(0);
  });

  it("validates package names for lowercase alphanumeric and hyphens", () => {
    expect(validateSubmitForm({ name: "" }).name).toBe("Add a package name.");
    expect(validateSubmitForm({ name: "Invalid Name!" }).name).toBe(
      "Package name must be lowercase alphanumeric and hyphens only."
    );
    expect(validateSubmitForm({ name: "my_package" }).name).toBe(
      "Package name must be lowercase alphanumeric and hyphens only."
    );
  });

  it("requires at least one compatibility runtime", () => {
    const errors = validateSubmitForm({ compatibility: [] });
    expect(errors.compatibility).toBe("Select at least one compatible agent runtime.");
  });

  it("requires a category and description", () => {
    const errors = validateSubmitForm({ category: "", description: "" });
    expect(errors.category).toBe("Select a primary category.");
    expect(errors.description).toBe("Add a short description.");
  });

  it("generates correct registry payload", () => {
    const payload = generateRegistryPayload({
      repo: "https://github.com/paperplane/pdf-summarizer",
      name: "pdf-summarizer",
      version: "2.4.1",
      license: "MIT",
      category: "Documents",
      manifest: "SKILL.md",
      compatibility: ["Claude", "Cursor"],
      tags: ["pdf", "documents"],
      description: "Extract, summarize, and query PDFs.",
    });

    expect(payload.name).toBe("pdf-summarizer");
    expect(payload.repository).toBe("paperplane/pdf-summarizer");
    expect(payload.version).toBe("2.4.1");
    expect(payload.category).toBe("Documents");
    expect(payload.compatibility).toEqual(["Claude", "Cursor"]);
  });
});

describe("Skill Manifest (skill.json) Validation", () => {
  const validManifest = {
    name: "pdf-summarizer",
    version: "1.2.0",
    description: "Extracts text from PDF documents and generates structured agent summaries.",
    license: "MIT",
    category: "documents",
    compatibility: ["claude", "cursor"],
    permissions: {
      network: false,
      shell: false,
      filesystem: "read" as const,
    },
  };

  it("accepts valid manifest with scoped or unscoped name", () => {
    expect(Object.keys(validateSkillManifest(validManifest)).length).toBe(0);

    const scoped = { ...validManifest, name: "@acme/doc-reader" };
    expect(Object.keys(validateSkillManifest(scoped)).length).toBe(0);
  });

  it("rejects invalid SemVer versions", () => {
    const invalidVer = { ...validManifest, version: "v1.2" };
    const errors = validateSkillManifest(invalidVer);
    expect(errors.version).toBeDefined();
  });

  it("rejects invalid categories", () => {
    const invalidCat = { ...validManifest, category: "invalid-category-xyz" };
    const errors = validateSkillManifest(invalidCat);
    expect(errors.category).toBeDefined();
  });

  it("validates permission types strictly", () => {
    const invalidPerms: any = {
      ...validManifest,
      permissions: {
        network: "yes",
        shell: false,
        filesystem: "full-access",
      },
    };
    const errors = validateSkillManifest(invalidPerms);
    expect(errors["permissions.network"]).toBeDefined();
    expect(errors["permissions.filesystem"]).toBeDefined();
  });
});
