---
title: "Installing skills"
label: "Installing skills"
slug: "installing-skills"
prev: "getting-started"
prevTitle: "Getting started"
next: "writing-a-skill"
nextTitle: "Writing a skill"
---

# Installing skills

Learn how skillpm installs and configures capabilities for different agent environments.

## Supported agents

Skills can be used with Claude Desktop, Cursor, Codex, and other compatible agent runtimes. When installing, skillpm automatically detects your active IDE or agent workspace configuration.

```bash
skillpm install shipyard/code-reviewer
```

## Specifying versions and branches

You can pin a skill to a specific release tag, branch, or git commit hash:

```bash
skillpm install paperplane/pdf-summarizer@v2.4.1
```

## Monorepo subpaths

For skills located inside a larger repository subfolder, specify the subpath directly:

```bash
skillpm install figma-dev/design-token-sync/packages/sync
```
