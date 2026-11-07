import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { StepCard } from "../components/StepCard";
import { Button } from "../components/Button";
import { CodeBlock } from "../components/CodeBlock";

export function SubmitPage() {
  const [repo, setRepo] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState("");
  const generate = () => {
    if (!repo.startsWith("https://github.com/")) {
      setError("Enter a public GitHub repository URL.");
      return;
    }
    if (!name.trim()) {
      setError("Add a package name.");
      return;
    }
    setError("");
    setGenerated(true);
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
          </label>
          <label>
            Package name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="pdf-summarizer"
            />
          </label>
          <label>
            Version
            <input defaultValue="0.1.0" />
          </label>
          <label>
            License
            <select defaultValue="MIT">
              <option>MIT</option>
              <option>Apache-2.0</option>
              <option>Other</option>
            </select>
          </label>
          <label>
            Category
            <select defaultValue="">
              <option value="" disabled>
                Select category
              </option>
              <option>Documents</option>
              <option>Coding</option>
              <option>Research</option>
            </select>
          </label>
          <label className="span-2">
            Skill manifest path
            <input defaultValue="SKILL.md" />
          </label>
          <fieldset className="span-2">
            <legend>Compatibility</legend>
            {["Claude", "Cursor", "Codex"].map((agent) => (
              <label key={agent}>
                <input type="checkbox" />
                {agent}
              </label>
            ))}
          </fieldset>
          <label className="span-2">
            Short description
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={160}
              placeholder="Describe what the skill does and when to use it."
            />
            <small>{description.length}/160</small>
          </label>
          {error && (
            <p className="field-error span-2" role="alert">
              {error}
            </p>
          )}
        </div>
      </section>
      <div className="generate">
        <Button onClick={generate}>Generate registry entry</Button>
        {generated && (
          <>
            <CodeBlock>{`{\n  "name": "${name}",\n  "repository": "${repo}",\n  "version": "0.1.0",\n  "manifest": "SKILL.md"\n}`}</CodeBlock>
            <Button
              onClick={() => window.open("https://github.com/skillpm/registry/compare", "_blank")}
            >
              Open pull request
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
