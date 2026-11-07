---
title: "CLI reference"
label: "CLI reference"
slug: "cli-reference"
prev: "publishing"
prevTitle: "Publishing"
next: "security-model"
nextTitle: "Security model"
---

Complete reference for the `skillapt` command-line interface.

## skillapt install

Installs one or more skills into your project.

```bash
skillapt install <name>[@version]
```

### Options:
- `--save-dev`: Save to devDependencies in lockfile.
- `--registry <url>`: Override default registry endpoint.

## skillapt publish

Validates, packages, and publishes a new release to the Skillapt Registry.

```bash
skillapt publish
```

### Options:
- `--token <token>`: Explicitly provide API token.
- `--dry-run`: Inspect archive and validate manifest without uploading.

## skillapt list

Lists all installed agent skills in the active workspace.

```bash
skillapt list
```

## skillapt update

Updates installed skills to their highest non-yanked versions matching SemVer ranges.

```bash
skillapt update [name]
```

## skillapt remove

Uninstalls a skill and removes it from `skillapt-lock.json`.

```bash
skillapt remove <name>
```

## skillapt login

Authenticates the CLI tool with your Skillapt / GitHub account.

```bash
skillapt login
```

## skillapt whoami

Displays the currently authenticated username and registry status.

```bash
skillapt whoami
```
