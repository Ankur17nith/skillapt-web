---
title: "Install your first skill"
label: "Getting started"
slug: "getting-started"
prev: null
next: "installing-skills"
nextTitle: "Installing skills"
---

# Install your first skill

Use skillpm to find and add capabilities to your AI agent.

## Install the CLI

The skillpm CLI works with Node.js 20 or newer. Install it globally or run it with npx.

```bash
npm install -g skillpm
```

> **Before you install**
> Review the source, requested permissions, and compatibility list for every skill.

## Install a skill

Pass the publisher and skill name to the install command.

```bash
skillpm install paperplane/pdf-summarizer
```

## Check installed skills

```bash
skillpm list
```
