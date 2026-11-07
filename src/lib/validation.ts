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
