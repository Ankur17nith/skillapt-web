export interface SubmitFormValues {
  repo: string;
  name: string;
  version: string;
  license: string;
  category: string;
  manifest: string;
  compatibility: string[];
  tags: string[];
  description: string;
}

export function validateSubmitForm(values: Partial<SubmitFormValues>): Record<string, string> {
  const errors: Record<string, string> = {};

  const ghRegex = /^https:\/\/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)(\/.*)?$/;
  if (!values.repo?.trim()) {
    errors.repo = "Enter a public GitHub repository URL.";
  } else if (!ghRegex.test(values.repo.trim())) {
    errors.repo = "Must be a valid GitHub repository URL (e.g., https://github.com/user/repo).";
  }

  if (!values.name?.trim()) {
    errors.name = "Add a package name.";
  } else if (!/^[a-z0-9-]+$/.test(values.name.trim())) {
    errors.name = "Package name must be lowercase alphanumeric and hyphens only.";
  }

  if (!values.category) {
    errors.category = "Select a primary category.";
  }

  if (!values.compatibility || values.compatibility.length === 0) {
    errors.compatibility = "Select at least one compatible agent runtime.";
  }

  if (!values.description?.trim()) {
    errors.description = "Add a short description.";
  } else if (values.description.length > 160) {
    errors.description = "Description cannot exceed 160 characters.";
  }

  return errors;
}

export function generateRegistryPayload(values: SubmitFormValues) {
  const cleanRepoMatch = values.repo.trim().match(/^https:\/\/github\.com\/([a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+)/);
  const repoIdentifier = cleanRepoMatch ? cleanRepoMatch[1] : values.repo.trim();

  return {
    name: values.name.trim(),
    slug: values.name.trim(),
    description: values.description.trim(),
    repository: repoIdentifier,
    category: values.category,
    tags: values.tags.length > 0 ? values.tags : [values.category.toLowerCase()],
    compatibility: values.compatibility,
    license: values.license,
    manifest: values.manifest.trim() || "SKILL.md",
    version: values.version.trim() || "0.1.0",
  };
}

export interface SkillManifest {
  name: string;
  version: string;
  description: string;
  license: string;
  category: string;
  compatibility: string[];
  permissions: {
    network: boolean;
    shell: boolean;
    filesystem: "none" | "read" | "write" | "read-write";
  };
  repository?: string;
  keywords?: string[];
  dependencies?: Record<string, string>;
}

export function validateSkillManifest(manifest: Partial<SkillManifest>): Record<string, string> {
  const errors: Record<string, string> = {};

  // Package name regex: optional scope, 3-50 chars total name, lowercase alphanumeric + hyphen
  const nameRegex = /^(@[a-z0-9-]{2,30}\/)?[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/;
  if (!manifest.name?.trim()) {
    errors.name = "Package name is required.";
  } else if (!nameRegex.test(manifest.name.trim())) {
    errors.name = "Invalid package name format. Must be lowercase alphanumeric and hyphens (3-50 chars).";
  }

  // SemVer regex
  const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
  if (!manifest.version?.trim()) {
    errors.version = "Version is required.";
  } else if (!semverRegex.test(manifest.version.trim())) {
    errors.version = "Version must be valid SemVer 2.0.0 (e.g. 1.0.0).";
  }

  if (!manifest.description?.trim()) {
    errors.description = "Description is required.";
  } else if (manifest.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters.";
  } else if (manifest.description.trim().length > 300) {
    errors.description = "Description cannot exceed 300 characters.";
  }

  if (!manifest.license?.trim()) {
    errors.license = "SPDX license is required.";
  }

  const validCategories = [
    "documents",
    "coding",
    "research",
    "data",
    "devtools",
    "communication",
    "productivity",
    "other",
  ];
  if (!manifest.category) {
    errors.category = "Category is required.";
  } else if (!validCategories.includes(manifest.category.toLowerCase())) {
    errors.category = `Category must be one of: ${validCategories.join(", ")}`;
  }

  if (!manifest.compatibility || !Array.isArray(manifest.compatibility) || manifest.compatibility.length === 0) {
    errors.compatibility = "At least one compatibility runtime is required.";
  }

  if (!manifest.permissions || typeof manifest.permissions !== "object") {
    errors.permissions = "Declared permissions object is required.";
  } else {
    if (typeof manifest.permissions.network !== "boolean") {
      errors["permissions.network"] = "permissions.network must be a boolean.";
    }
    if (typeof manifest.permissions.shell !== "boolean") {
      errors["permissions.shell"] = "permissions.shell must be a boolean.";
    }
    const validFs = ["none", "read", "write", "read-write"];
    if (!validFs.includes(manifest.permissions.filesystem)) {
      errors["permissions.filesystem"] = `permissions.filesystem must be one of: ${validFs.join(", ")}`;
    }
  }

  return errors;
}
