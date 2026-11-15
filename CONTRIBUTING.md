# Contributing to skillapt-web

Thanks for helping improve skillapt! This repo is the website; the CLI lives in
[skillapt](https://github.com/Ankur17nith/skillapt) and the registry API in
[skillapt-registry](https://github.com/Ankur17nith/skillapt-registry). Changes that
need an API change should be discussed in an issue first.

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
Security problems: do **not** open a public issue, see [SECURITY.md](SECURITY.md).

## Setup

Requires Node.js ≥ 22.12 and npm (npm and `package-lock.json` are the only supported package manager).

```bash
git clone https://github.com/<you>/skillapt-web.git
cd skillapt-web
npm ci
npm run dev          # http://localhost:8443, demo mode with bundled sample data
```

## Before you open a pull request

```bash
npm run check        # typecheck + tests + production build
```

CI runs the same commands, plus a build with a registry/site URL configured and a
production dependency audit.

## Workflow

1. Fork and create a branch from `main`: `feat/<topic>`, `fix/<topic>`, `docs/<topic>`, `chore/<topic>`.
2. Keep changes small and focused; one logical change per commit.
3. Add or update tests for behavior changes (Vitest; component tests use Testing Library with `// @vitest-environment jsdom`).
4. Open a PR against `main` and fill in the template.

### Commit messages

[Conventional Commits](https://www.conventionalcommits.org/): `type(scope): summary`, imperative mood, body explains *why*.
Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`, `perf`, `build`.

## Code guidelines

- TypeScript strict mode; `npm run typecheck` must pass.
- **Never render untrusted HTML.** Markdown goes through `react-markdown` with the shared overrides in `src/components/markdownComponents.tsx` (no `dangerouslySetInnerHTML`, no raw HTML plugins).
- Data from the registry is untrusted: validate before putting it in URLs or attributes (`src/lib/safe.ts`).
- External links need `rel="noopener noreferrer"`.
- No hard-coded domains or secrets. URLs come from `src/config.ts` (`VITE_REGISTRY_URL`, `VITE_SITE_URL`). `VITE_*` values are public.
- The CSP is `script-src 'self'`: no inline scripts, no third-party scripts, fonts or images from new hosts without updating `src/lib/cloudflare-headers.ts` and its test.
- Accessibility: keep WCAG AA contrast (use the `--accent-text` token for coloured text), label controls, keep everything keyboard reachable.
- Format with `npm run format` (oxfmt).

## Pull request checklist

- [ ] `npm run check` passes locally
- [ ] Tests added/updated for behavior changes
- [ ] No new third-party network requests, inline scripts, or unvalidated registry data in the DOM
- [ ] Docs / README / CHANGELOG updated if behavior or configuration changed
- [ ] Screenshots attached for visible UI changes (light and dark)

## Reporting bugs and requesting features

Use the issue templates. Include steps to reproduce, expected vs actual behavior, browser, and whether you ran in demo mode or against a registry.
