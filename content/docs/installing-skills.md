---
title: "Installing skills"
label: "Installing skills"
slug: "installing-skills"
prev: "getting-started"
prevTitle: "Getting started"
next: "writing-a-skill"
nextTitle: "Writing a skill"
---

`skillapt` resolves and installs skills deterministically, using strict Semantic Versioning (SemVer 2.0.0) and SHA-256 integrity verification.

## Basic installation

Install the latest non-yanked release of a package:

```bash
skillapt install pdf-summarizer
```

## Specifying versions

You can pin to an exact SemVer release or a version range:

```bash
# Exact version
skillapt install pdf-summarizer@1.2.0

# SemVer range
skillapt install "pdf-summarizer@^1.0.0"
```

## Scoped packages

Packages may belong to an organization or author scope:

```bash
skillapt install @acme/data-cleaner
```

## Deterministic lockfile

Every install updates `skillapt-lock.json` in your repository root. The lockfile records exact package URLs, cryptographic SHA-256 hashes, and declared permissions:

```json
{
  "lockfileVersion": 1,
  "skills": {
    "pdf-summarizer": {
      "version": "1.2.0",
      "resolved": "https://registry.skillapt.dev/v1/skills/pdf-summarizer/-/1.2.0.tgz",
      "integrity": "sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "category": "documents",
      "permissions": {
        "network": false,
        "shell": false,
        "filesystem": "read"
      }
    }
  }
}
```

## Uninstalling a skill

To remove a skill from your workspace and lockfile:

```bash
skillapt remove pdf-summarizer
```
