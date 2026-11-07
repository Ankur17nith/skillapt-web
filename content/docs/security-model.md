---
title: "Security model & permissions"
label: "Security model"
slug: "security-model"
prev: "cli-reference"
prevTitle: "CLI reference"
next: "faq"
nextTitle: "FAQ"
---

`skillapt` enforces security at every layer of package packaging, transmission, and installation.

## Zero execution on registry

The Skillapt Registry never executes, builds, runs, or evaluates user code. Packages are inspected statically and served as static tarballs.

## Static archive inspection

Every uploaded archive is strictly scrutinized before publication:
- **No Binaries**: Compiled executables (`.exe`, `.dll`, `.so`, `.dylib`, `.bin`) are rejected.
- **No Path Traversal**: Tar entry paths cannot contain `..`, absolute paths, or leading slashes.
- **No Links**: Symlinks and hardlinks are rejected.
- **Decompression Bomb Protection**: Maximum upload payload 5 MB; maximum uncompressed size 25 MB; max file count 500 files.

## Explicit permission declarations

Every package declares its capability requirements in `skill.json`:
- `network` (`boolean`): Whether the skill makes outbound network calls.
- `shell` (`boolean`): Whether the skill requires command-line execution privileges.
- `filesystem` (`none` | `read` | `write` | `read-write`): Scope of local filesystem access.

The CLI displays requested permissions before installation so users and agents are always aware of a skill's footprint.

## Cryptographic integrity

Every package version receives a SHA-256 digest upon publication. When the CLI downloads a package, it computes the SHA-256 hash and compares it against `skillapt-lock.json`. Any mismatch results in an immediate installation abort.
