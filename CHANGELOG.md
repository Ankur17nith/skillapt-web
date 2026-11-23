# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- 20-category taxonomy across browse, filters, home and categories pages (live from the registry with a bundled fallback).
- "Unclaimed" badge and claim flow on skill pages.
- Build-time `llms.txt`, `llms-full.txt`, and JSON-LD (site and skill pages) for AI agents and search engines.

- Prerendered HTML for crawlers that do not run JavaScript: the build writes an `index.html` per route (home, browse, categories, docs pages and the top skills) with its own title, description, canonical URL, JSON-LD and readable content. Live registry builds fetch the most-downloaded skills (`PRERENDER_MAX_SKILLS`, default 300); skill URLs are in `sitemap.xml`.

### Changed
- Skill pages now live at `/skills/*` so scoped names such as `/skills/@owner/skill` work with clean URLs.

### Fixed
- Live registry requests now send lowercase category ids and `sort=updated`; filter and category card alignment.

### Added
- `VITE_REGISTRY_URL` (legacy alias `VITE_API_URL`) and `VITE_SITE_URL` configuration; demo mode with a visible banner when no registry is configured.
- Cloudflare deployment: `wrangler.jsonc` (static assets, SPA fallback), build-generated `_headers` with a strict CSP, `robots.txt` and `sitemap.xml`, CI and deploy workflows.
- Shared safe markdown renderer, URL/repository validation helpers, and tests for config, headers, safety helpers and markdown rendering.
- README, CONTRIBUTING, SECURITY, CODE_OF_CONDUCT, LICENSE, issue and PR templates, dependabot, CODEOWNERS.

### Changed
- Package renamed to `skillapt-web`; requires Node.js >= 22.12; npm lockfile only.
- Fonts are self-hosted (@fontsource) instead of loaded from Google Fonts.
- Colour tokens adjusted to meet WCAG AA contrast.
- Binary assets are normal git blobs (no Git LFS).

### Fixed
- Un-yank called a nonexistent endpoint; it now uses `DELETE /v1/skills/:name/:version/yank`.
- `Button` ignored `type`, `disabled` and `style`; cancel buttons inside forms submitted the form.
- Typecheck errors (`Skill.updated`, `replaceAll` target) and a dead mistyped sample dataset.
- Docs heading anchors for headings containing inline code or punctuation.
- Dead `mailto:` link and hard-coded, non-existent domains in SEO files, install commands and sitemap.
- Unsafe `window.open` without `noopener` and unvalidated registry `repository` values.

### Removed
- `vercel.json` (replaced by Cloudflare configuration), Figma scaffold notes, and ~16 MB of design-review screenshots.
