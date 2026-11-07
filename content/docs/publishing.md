---
title: "Publishing skills & immutability"
label: "Publishing"
slug: "publishing"
prev: "writing-a-skill"
prevTitle: "Writing a skill"
next: "cli-reference"
nextTitle: "CLI reference"
---

`skillapt` distributes packages through an edge-native registry with immutable releases and cryptographic verification.

## 1. Authentication

To publish packages, authenticate the CLI with your GitHub account:

```bash
skillapt login
```

Alternatively, generate a personal access token in your [Publisher Dashboard](/dashboard) and set it in your environment:

```bash
export SKILLAPT_TOKEN=apt_live_...
```

## 2. Publishing a release

Run the publish command from inside your skill repository:

```bash
skillapt publish
```

The CLI:
1. Validates that `skill.json` and `SKILL.md` are present and valid.
2. Packages safe text, prompt, and script files into a `.tar.gz` archive (max 5 MB).
3. Verifies that no executable binaries or symlinks exist.
4. Uploads to the registry and calculates the SHA-256 integrity digest.

## Version immutability

Once published, version `X.Y.Z` of a package is **strictly immutable**:
- Tarball bytes, SHA-256 hashes, and manifest metadata cannot be modified or overwritten.
- Re-publishing an existing version returns a `409 CONFLICT` error.
- To release updates or bugfixes, increment the version (e.g. `1.0.1` or `1.1.0`).

## Yanking a version

If a released version contains a severe bug or security vulnerability, the package owner can **yank** it from their [Publisher Dashboard](/dashboard) or via API:

- **What yanking does**: Excludes the version from SemVer range queries and automatic resolution.
- **What yanking does NOT do**: Does not delete the tarball; existing lockfiles and explicit pinned downloads continue to function deterministically.
