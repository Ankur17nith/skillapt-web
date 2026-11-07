---
title: "Writing a skill"
label: "Writing a skill"
slug: "writing-a-skill"
prev: "installing-skills"
prevTitle: "Installing skills"
next: "publishing"
nextTitle: "Publishing"
---

Creating an AI agent skill requires two essential files: `skill.json` and `SKILL.md`.

## Archive structure

```text
my-skill/
├── skill.json       # Required: Package manifest
├── SKILL.md         # Required: Agent documentation and prompt instructions
└── ...              # Optional: Helper templates, prompts, scripts, datasets
```

## The manifest (skill.json)

The manifest defines metadata, runtime compatibility, and explicit capability permissions:

```json
{
  "name": "pdf-summarizer",
  "version": "1.2.0",
  "description": "Extracts text from PDF documents and generates structured agent summaries.",
  "license": "MIT",
  "repository": "https://github.com/agent-skills/pdf-summarizer",
  "keywords": ["pdf", "summarizer", "documents"],
  "category": "documents",
  "compatibility": ["claude", "cursor", "codex", "antigravity"],
  "dependencies": {},
  "permissions": {
    "network": false,
    "shell": false,
    "filesystem": "read"
  }
}
```

### Manifest rules
- **name**: 3 to 50 characters, lowercase alphanumeric and hyphens. Optional scope prefix `@scope/name`.
- **version**: Valid strict SemVer 2.0.0.
- **category**: One of `documents`, `coding`, `research`, `data`, `devtools`, `communication`, `productivity`, `other`.
- **permissions**: Explicitly declare `network`, `shell`, and `filesystem` (`none` | `read` | `write` | `read-write`).

## The documentation (SKILL.md)

`SKILL.md` teaches the agent how and when to use your skill. Provide:
1. Trigger descriptions (when the agent should activate the skill).
2. Input parameters and output format.
3. Security considerations and constraints.

## Testing locally

You can test installation directly from your local filesystem before publishing:

```bash
skillapt install ./my-skill
```
