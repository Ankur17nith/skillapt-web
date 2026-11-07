---
title: "Frequently asked questions"
label: "FAQ"
slug: "faq"
prev: "security-model"
prevTitle: "Security model"
---

Answers to common questions about `skillapt`, package distribution, and agent compatibility.

## What is an AI agent skill?

A skill is a self-contained package of instructions, prompts, schemas, and helper scripts that teaches an AI agent how to accomplish a specific development or operational capability.

## How is skillapt different from npm?

`skillapt` is completely independent of npm. It does not install packages into `node_modules` or execute post-install lifecycle scripts. Packages are delivered as sandboxed, immutable tarballs with declared permissions specifically for LLM and agent runtimes.

## Which agent environments are supported?

Skills declare compatibility with Claude Desktop, Cursor, Codex, Google Antigravity, OpenAI, or custom LLM architectures.

## Can I edit a version after publishing?

No. Once published, versions are strictly immutable. To fix an issue or release an update, increment the version number according to SemVer (e.g. `1.0.1`). If a version has a vulnerability, you can yank it from your [Publisher Dashboard](/dashboard).

## Where are packages hosted?

Skillapt uses an edge-native cloud architecture: Cloudflare Workers for edge routing and validation, Cloudflare D1 for metadata, and Cloudflare R2 for immutable archive storage.
