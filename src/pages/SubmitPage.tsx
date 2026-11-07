import { useState, type ChangeEvent } from "react";
import { PageHeader } from "../components/PageHeader";
import { StepCard } from "../components/StepCard";
import { Button } from "../components/Button";
import { CodeBlock } from "../components/CodeBlock";
import { CONFIG } from "../config";

export function SubmitPage() {
  const [repo, setRepo] = useState("");
  const [name, setName] = useState("");
  const [version, setVersion] = useState("0.1.0");
  const [license, setLicense] = useState("MIT");
  const [category, setCategory] = useState("");
  const [manifest, setManifest] = useState("SKILL.md");
  const [compatibility, setCompatibility] = useState<string[]>(["Claude", "Cursor"]);
  const [tagsInput, setTagsInput] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatedJson, setGeneratedJson] = useState<string | null>(null);

  const toggleCompat = (agent: string) => {
    setCompatibility((prev) =>
      prev.includes(agent) ? prev.filter((a) => a !== agent) : [...prev, agent]
    );
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const ghRegex = /^https:\/\/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)(\/.*)?$/;
    if (!repo.trim()) {
      newErrors.repo = "Enter a public GitHub repository URL.";
    } else if (!ghRegex.test(repo.trim())) {
      newErrors.repo = "Must be a valid GitHub repository URL (e.g., https://github.com/user/repo).";
    }

    if (!name.trim()) {
      newErrors.name = "Add a package name.";
    } else if (!/^[a-z0-9-]+$/.test(name.trim())) {
      newErrors.name = "Package name must be lowercase alphanumeric and hyphens only.";
    }

    if (!category) {
      newErrors.category = "Select a primary category.";
    }

    if (compatibility.length === 0) {
      newErrors.compatibility = "Select at least one compatible agent runtime.";
    }

    if (!description.trim()) {
      newErrors.description = "Add a short description.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = () => {
    if (!validate()) {
      setGeneratedJson(null);
      return;
    }

    const cleanRepoMatch = repo.trim().match(/^https:\/\/github\.com\/([a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+)/);
    const repoIdentifier = cleanRepoMatch ? cleanRepoMatch[1] : repo.trim();

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const payload = {
      name: name.trim(),
      slug: name.trim(),
      description: description.trim(),
      repository: repoIdentifier,
      category,
      tags: tags.length > 0 ? tags : [category.toLowerCase()],
      compatibility,
      license,
      manifest: manifest.trim() || "SKILL.md",
      version: version.trim() || "0.1.0",
    };

    setGeneratedJson(JSON.stringify(payload, null, 2));
  };

  return (
    <main className="shell page">
      <PageHeader title="Submit a skill">
        <p>Add your skill to the public registry.</p>
      </PageHeader>
      <div className="submit-steps">
        <StepCard number="1" title="Add a SKILL.md">
          Describe capabilities and permissions.
        </StepCard>
        <StepCard number="2" title="Open a pull request">
          Generate the registry entry.
        </StepCard>
        <StepCard number="3" title="Get reviewed">
          Automated checks and human review.
        </StepCard>
      </div>
      <section className="form-card">
        <div className="form-intro">
          <span>Frontend preview</span>
          <h2>Package metadata</h2>
          <p>
            This form validates and generates a registry entry locally. Publishing happens through a
            GitHub pull request.
          </p>
        </div>
        <div className="form-grid">
          <label className="span-2">
            GitHub repository URL
            <input
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="https://github.com/user/repo"
            />
            {errors.repo && (
              <p className="field-error" role="alert">
                {errors.repo}
              </p>
            )}
          </label>
          <label>
            Package name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="pdf-summarizer"
            />
            {errors.name && (
              <p className="field-error" role="alert">
                {errors.name}
              </p>
            )}
          </label>
          <label>
            Version
            <input
              value={version}
              onChange={(e) => setVersion(e.target.value)}
            />
          </label>
          <label>
            License
            <select value={license} onChange={(e) => setLicense(e.target.value)}>
              <option>MIT</option>
              <option>Apache-2.0</option>
              <option>BSD-3-Clause</option>
              <option>ISC</option>
              <option>Other</option>
            </select>
          </label>
          <label>
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="" disabled>
                Select category
              </option>
              <option>Documents</option>
              <option>Coding</option>
              <option>Data</option>
              <option>Design</option>
              <option>Writing</option>
              <option>Research</option>
              <option>Automation</option>
              <option>Security</option>
            </select>
            {errors.category && (
              <p className="field-error" role="alert">
                {errors.category}
              </p>
            )}
          </label>
          <label className="span-2">
            Skill manifest path
            <input
              value={manifest}
              onChange={(e) => setManifest(e.target.value)}
            />
          </label>
          <label className="span-2">
            Tags (comma separated)
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="documents, pdf, extraction"
            />
          </label>
          <fieldset className="span-2">
            <legend>Compatibility</legend>
            {["Claude", "Cursor", "Codex"].map((agent) => (
              <label key={agent}>
                <input
                  type="checkbox"
                  checked={compatibility.includes(agent)}
                  onChange={() => toggleCompat(agent)}
                />
                {agent}
              </label>
            ))}
            {errors.compatibility && (
              <p className="field-error span-2" role="alert">
                {errors.compatibility}
              </p>
            )}
          </fieldset>
          <label className="span-2">
            Short description
            <textarea
              rows={4}
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              maxLength={160}
              placeholder="Describe what the skill does and when to use it."
            />
            <small>{description.length}/160</small>
            {errors.description && (
              <p className="field-error" role="alert">
                {errors.description}
              </p>
            )}
          </label>
        </div>
      </section>
      <div className="generate">
        <Button onClick={handleGenerate}>Generate registry entry</Button>
        {generatedJson && (
          <>
            <CodeBlock>{generatedJson}</CodeBlock>
            <Button
              onClick={() =>
                window.open(`https://github.com/${CONFIG.REGISTRY_REPO}/compare`, "_blank")
              }
            >
              Open pull request
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
