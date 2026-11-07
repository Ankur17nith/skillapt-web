---
title: "CLI reference"
label: "CLI reference"
slug: "cli-reference"
prev: "writing-a-skill"
prevTitle: "Writing a skill"
next: "faq"
nextTitle: "FAQ"
---

# CLI reference

Reference guide for all commands in the `skillpm` command-line interface.

## skillpm install

Installs a skill into the current workspace:

```bash
skillpm install <repo>[/subpath][@version]
```

## skillpm list

Lists all currently installed skills and their permissions:

```bash
skillpm list
```

## skillpm update

Updates installed skills to their latest compatible release:

```bash
skillpm update [name]
```

## skillpm remove

Removes a skill from the active environment:

```bash
skillpm remove <name>
```
