---
title: "Getting started with skillapt"
label: "Getting started"
slug: "getting-started"
next: "installing-skills"
nextTitle: "Installing skills"
---

`skillapt` is a dedicated, secure package manager and marketplace built specifically for **AI agent skills**.

An **agent skill** is a modular package that teaches an AI agent (such as Claude, Cursor, Codex, Antigravity, or custom LLM frameworks) how to perform specialized tasks. Skills provide prompts, templates, schemas, and helper scripts that agents consume to accomplish workflows.

## Prerequisites

The `skillapt` CLI requires Node.js 20 or newer. Install it globally via npm:

```bash
npm install -g skillapt
```

Verify your installation:

```bash
skillapt --version
```

## Installing your first skill

To install a skill into your current workspace or project:

```bash
skillapt install pdf-summarizer
```

The CLI inspects the package manifest (`skill.json`), verifies the SHA-256 integrity hash against the registry, displays declared permissions, and downloads the tarball into your `.skills/` directory.

## Listing installed skills

To view all installed skills and their permissions in the current workspace:

```bash
skillapt list
```

## Running with agents

Skills declare runtime compatibility with Claude Desktop, Cursor, Codex, Antigravity, and OpenAI. Once installed, your agent runtime automatically detects the skill's `SKILL.md` prompt instructions.
