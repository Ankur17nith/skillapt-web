import { useState, type ChangeEvent } from "react";
import { PageHeader } from "../components/PageHeader";
import { StepCard } from "../components/StepCard";
import { Button } from "../components/Button";
import { CodeBlock } from "../components/CodeBlock";
import { SEO } from "../components/SEO";
import { Container } from "../components/Container";
import { CONFIG } from "../config";
import { validateSubmitForm, generateRegistryPayload } from "../lib/validation";

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

  const handleGenerate = () => {
    const errs = validateSubmitForm({
      repo,
      name,
      category,
      compatibility,
      description,
    });

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setGeneratedJson(null);
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const payload = generateRegistryPayload({
      repo,
      name,
      version,
      license,
      category,
      manifest,
      compatibility,
      tags,
      description,
    });

    setGeneratedJson(JSON.stringify(payload, null, 2));
  };

  return (
    <main className="page">
      <Container>
        <SEO title="Submit a skill" description="Add your skill to the public registry." url="/submit" />
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
        <div className="form-card">
          <div className="form-intro">
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
      </div>
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
      </Container>
    </main>
  );
}
