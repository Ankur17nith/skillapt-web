---
title: "Writing a skill"
label: "Writing a skill"
slug: "writing-a-skill"
prev: "installing-skills"
prevTitle: "Installing skills"
next: "cli-reference"
nextTitle: "CLI reference"
---

# Writing a skill

A skill is defined by a standard `SKILL.md` manifest at the root of a repository or subfolder.

## The SKILL.md structure

Your manifest specifies metadata, requested permissions, tool bindings, and operational instructions:

```markdown
---
name: my-skill
version: 1.0.0
description: A clear one-line description of what this skill does.
permissions:
  - filesystem:read
  - network:fetch
---

# My Skill Instructions
Explain how your agent should invoke and reason with these tools.
```

## Testing locally

You can test your skill locally before publishing:

```bash
skillpm install ./path-to-skill
```
