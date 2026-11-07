# SkillPM Design and Frontend Specification

This document describes the frontend as implemented at the time of writing. It is intended to be sufficient for rebuilding the current interface without design interpretation.

## 1. Technical baseline

- Framework: React 19, rendered with `react-dom/client`.
- Build system: Vite 8.
- Language: TypeScript/TSX.
- Styling: Tailwind CSS v4 is imported, but the application does **not** use Tailwind utility strings in JSX. Components use semantic class names defined in `src/index.css`. Do not translate the classes below into guessed Tailwind utilities; the exact class names and values in this specification are canonical.
- Routing: a lightweight History API router in `App.tsx`. `pushState` updates `window.location.pathname`; `popstate` restores browser back/forward navigation.
- Data: local static `skills` records in `App.tsx`. There is no API or persistent state.
- Fonts:
  - UI: `Inter`, fallback `sans-serif`.
  - Commands/code/versions: `JetBrains Mono`, fallback `monospace`.
  - Google Fonts import: `Inter` weights 400/500/600/700 and `JetBrains Mono` weights 400/500/600.

## 2. Sitemap

| Route | Document title | Page component | Purpose |
|---|---|---|---|
| `/` | `Home \| skillpm` | `Home` | Product explanation, search entry, recent packages, categories, workflow, trust, publishing CTA, FAQ. |
| `/browse` | `Browse skills \| skillpm` | `Browse` | Searchable/filterable package registry with list/grid views. |
| `/categories` | `Categories \| skillpm` | `Categories` | Category directory. |
| `/collections` | `Collections \| skillpm` | `Collections` | Curated package sets. |
| `/skills/pdf-summarizer` | `pdf-summarizer \| skillpm` | `SkillDetail` | Package README, versions, security, install controls, metadata, related packages. |
| `/submit` | `Submit a skill \| skillpm` | `Submit` | Local metadata validation and registry-entry preview. |
| `/docs` | `Docs \| skillpm` | `Docs` | CLI documentation. |
| `/security` | `Security \| skillpm` | `Security` | Safety model and installation checklist. |
| `/about` | `About \| skillpm` | `About` | Mission, open-source note, contact. |
| `/brand` | `Brand \| skillpm` | `Brand` | Logo variants, usage rules, downloads. |
| Any unmatched path | `Page not found \| skillpm` | `NotFound` | Terminal-style 404. |

### Global navigation

Desktop navbar order: logo, Discover, Categories, Collections, Publish, Documentation, search/`⌘K`, GitHub, theme toggle, Install CLI.

Mobile full-screen menu order: Home, Discover, Categories, Collections, Publish, Documentation, then theme toggle.

Footer groups:

- Product: Discover, Categories, Collections.
- Developers: Publish, Documentation, Security.
- Project: About, Brand assets, GitHub.
- Footer text: `The open package manager for trusted AI agent skills.`, `© 2025 skillpm. Open source.`, `Built for reusable agent skills.`

## 3. Design tokens

### Color variables

#### Light mode (`:root`)

| Token | Hex | Use |
|---|---:|---|
| `--bg` | `#F5F3EE` | Page background, warm off-white. |
| `--surface` | `#FFFFFF` | Cards, controls, terminal, raised content surfaces. |
| `--surface-muted` | `#EEECE6` | Selected controls, disabled controls, skeletons. |
| `--border` | `#DFDED8` | All standard 1px dividers and outlines. |
| `--text` | `#17191F` | Primary text and graphite logo modules. |
| `--muted` | `#747782` | Secondary copy, metadata, inactive controls. |
| `--accent` | `#4169E1` | Links, primary actions, focus, active logo connector. |
| `--lime` | `#B8D977` | Reserved meaningful status/detail color. |
| `--success` | `#537126` | Success text/icons on light background. |

#### Dark mode (`[data-theme="dark"]`)

| Token | Hex |
|---|---:|
| `--bg` | `#17191F` |
| `--surface` | `#202329` |
| `--surface-muted` | `#292C33` |
| `--border` | `#34373F` |
| `--text` | `#F5F3EE` |
| `--muted` | `#A4A7B0` |
| `--accent` | inherited `#4169E1` |
| `--lime` | inherited `#B8D977` |
| `--success` | `#B8D977` |

Additional literal colors:

- Primary button text: `#FFFFFF`.
- Field error: `#A33A2B`.
- Modal/palette/sheet backdrop: `rgba(17, 20, 24, 0.55)`.
- Brand-page fixed light sample: text `#17191F`, background `#F5F3EE`.
- Brand-page fixed dark sample: text `#F5F3EE`, background `#17191F`.

No gradients, backdrop blur, text shadow, or box shadow are used.

### Typography

Global body: Inter 16px/normal, weight 400, color `--text`.

| Role | Size | Weight | Line height | Letter spacing |
|---|---:|---:|---:|---:|
| Home H1 | 48px desktop, 40px mobile | 600 | 1.1 | -0.01em |
| Standard page H1 | 44px desktop, 36px mobile | default/700 | normal | -0.01em |
| Detail H1 | 40px desktop, 30px mobile | default/700 | normal | default |
| 404 H1 | 56px | default/700 | normal | default |
| Section H2 | 28px | default/700 | normal | -0.01em |
| Collection/form H2 | 24px | default/700 | normal | default |
| Markdown H2 | 28px | default/700 | normal | default |
| Markdown H3 | 20px | default/700 | normal | default |
| Hero subtitle | 18px | 400 | 1.6 | default |
| Lead copy | 18px | 400 | 1.6 | default |
| Standard body | 14–16px | 400 | 1.5–1.7 | default |
| Navigation/labels/metadata | 13–14px | 400–600 | normal–1.6 | default |
| Hero kicker | 13px | 600 | normal | 0.02em |
| Code/commands | 13–14px JetBrains Mono | 400 | 1.7 or 2 | default |
| Logo wordmark | 26 SVG units, Inter | 600 | SVG baseline y=24 | -0.26 SVG units |

Minimum visible text is 13px. The only `font-size: 0` rule hides copy-button text in the 390px sticky install bar while retaining the icon and accessible button content.

### Spacing

The layout follows a 4px sub-grid and an 8px primary grid.

- Atomic values present: 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 72, 80, and 96px.
- Standard control gaps: 8–12px.
- Card/internal padding: 20–24px.
- Section-title bottom margin: 32px.
- Page header bottom margin: 40px.
- Standard page vertical padding: 72px top, 96px bottom.
- Home section vertical padding: 72px, with 1px separators.
- Footer main padding: 64px vertical.
- Mobile section vertical padding: 64px.

### Shape, borders, containers, and depth

- Global radius token: `--radius: 5px`.
- Buttons/inputs/small controls: 4–5px.
- Cards, dialogs, terminal, code blocks: 6px.
- Tags only: 999px pill radius.
- Warning icon: 50% radius.
- Standard border: `1px solid var(--border)`.
- Callout left border: `3px solid var(--accent)`.
- No elevation shadows.
- Primary container: `width: min(1100px, calc(100% - 48px))`.
- Mobile primary container: `width: calc(100% - 32px)`.
- Docs container: `width: min(1280px, calc(100% - 48px))`.
- Modal/palette width: `min(520px, calc(100% - 32px))`.
- 404 terminal width: `min(560px, calc(100% - 32px))`.
- Narrow page max width: 760px.

### Breakpoints

- Tablet/mobile navigation and two-column reductions: `@media (max-width: 900px)`.
- Phone layouts: `@media (max-width: 600px)`.
- Reduced motion: `@media (prefers-reduced-motion: reduce)`.

At ≤900px:

- Desktop nav/actions hide; hamburger appears.
- Hero becomes one column.
- Package grids become two columns.
- Desktop filter sidebar hides; Filters button and bottom sheet are used.
- Detail and FAQ-style two-column layouts stack.
- Docs right outline hides.
- Footer becomes two columns.
- Registry list metadata moves beneath the main row.

At ≤600px:

- Primary width becomes viewport minus 32px.
- Package/category/card grids become one column.
- Detail sidebar hides; sticky bottom install bar appears.
- Form becomes one column.
- Docs sidebar hides.
- Footer brand spans both columns.

### Motion and focus

- Standard hover transitions: 150ms.
- Button press: `transform: scale(0.98)` over 100ms.
- Button transition: background 150ms, color 150ms, transform 100ms.
- Skill-card border transition: 150ms.
- Registry-row background transition: 150ms.
- Copy state duration/toast duration: 2000ms.
- Focus: `2px solid var(--accent)` with 2px offset.
- Reduced-motion mode forces animation/transition duration to 0.01ms and one iteration.

## 4. Components

Because the implementation uses semantic CSS, the “exact Tailwind classes” for every component are: **none**. The exact JSX class names are listed below; definitions live in `src/index.css`.

### Foundation

| Component | Props | Variants/states | Exact classes |
|---|---|---|---|
| `Icon` | `name: IconName`, `size?: number=18` | 16 named Lucide-style path sets; stroke 1.5, round caps/joins. | `icon` |
| `Link` | `to`, `nav`, `children`, `className?`, `label?` | Internal History API navigation. | caller-provided |
| `Logo` | `variant?: "full" \| "mark"`, `size?: number=32`, `nav?`, `className?` | Full/mark; linked/unlinked; currentColor light/dark. Full width is `size * 4.15`. | `logo`, `logo-art`, optional caller class |
| `Button` | `children`, `variant?: "primary" \| "secondary" \| "ghost"`, `onClick?` | default, hover, active, focus-visible, disabled. | `button`, plus `primary` implicitly, `secondary`, or `ghost` |
| `ThemeToggle` | `theme`, `toggle` | sun in light, moon in dark. | `theme-toggle` |

### Navigation and global utilities

| Component | Props/states | Exact classes |
|---|---|---|
| `Navbar` | `nav`, `theme`, `toggleTheme`, `openPalette`; desktop/mobile open state. | `navbar`, `nav-links`, `nav-actions`, `nav-search`, `icon-button`, `mobile-menu-button`, `full-menu` |
| `Footer` | `nav` | `footer-main`, `footer-bottom` |
| `SearchBar` | `compact?`, `openPalette` | standard/compact, hover/focus. | `search-bar`, optional `compact` |
| `CommandPalette` | `close`, `nav`; open overlay; input auto-focus. | `palette-backdrop`, `palette`, `palette-search` |
| `Toast` | no props; appears after copy for 2s. | `toast` |
| `PageHeader` | `title`, `children?` | default. | `page-header` |
| `SectionTitle` | `title`, `action?` | default. | `section-title` |

### Package/discovery

| Component | Props/states | Exact classes |
|---|---|---|
| `SkillCard` | `skill`, `nav`, `hover?=false` | default, hover/focus link, optional forced hover class. | `skill-card`, optional `hover-example`, `skill-head`, `skill-icon`, `author`, `tags`, `skill-meta` |
| `SkillListItem` | `skill`, `nav` | default/hover, responsive stacked metadata. | `skill-list-item`, `skill-list-main`, `skill-icon`, `skill-list-details` |
| `FilterSidebar` | category/compatibility/language values and setters, `clear`, `close?` | desktop, mobile sheet; controlled radios. | `filters`, `filter-head` |
| `LoadingState` | none | three neutral loading rows. | `loading-state` |
| `EmptyState` | `clear` | empty; clear action. | `empty-state` |
| Registry view controls | local Browse state | list/grid active states, active-filter chips. | `registry-search`, `browse-tools`, `browse-layout`, `results`, `results-bar`, `view-toggle`, `active`, `active-filters`, `filter-button` |

### Content and installation

| Component | Props/states | Exact classes |
|---|---|---|
| `TerminalWindow` | none | static five-line install output. | `terminal`, `terminal-title`, `terminal-body`, `muted`, `success` |
| `CopyCommand` | `command`, `notify` | default/copied for 2s. | `copy-command` |
| `CodeBlock` | `children: string` | default/copied for 2s. | `code-block` |
| `FeatureCard` | `title`, `children` | default. | `feature-card` |
| `StepCard` | `number`, `title`, `children` | default. | `step-card` |
| `FAQ` | none | first open initially; each item open/closed. | `faq`, `faq-item` |
| `ReportModal` | `close` | modal open; unavailable submit disabled. | `modal-backdrop`, `modal`, `modal-head`, `modal-actions`, `button` |
| Skill tabs | local `tab` state | README/Versions/Security active content. | `tabs`, `active`, `markdown`, `tab-panel`, `security-panel`, `warning` |
| Install tabs | local `installMode` | skillpm/npx/manual. | `mini-tabs`, `active`, `install-panel`, `package-facts`, `compatibility` |

### Layout classes

- App/page: `app`, `shell`, `page`, `narrow`.
- Home: `home-hero`, `hero-grid`, `hero-kicker`, `hero-actions`, `hero-docs`, `works`, `home-skill-list`, `category-grid`, `steps`, `feature-grid`, `cta`.
- Browse: `browse-tools`, `browse-layout`, `results`.
- Categories: `category-directory`.
- Collections: `collection-list`.
- Detail: `breadcrumbs`, `detail-grid`, `detail-main`, `detail-title`, `large-icon`, `lead`, `metadata`, `related`, `mobile-install`.
- Submit: `submit-steps`, `form-card`, `form-intro`, `form-grid`, `span-2`, `field-error`, `generate`.
- Docs: `docs-layout`, `docs-nav`, `docs-article`, `docs-outline`, `callout`, `docs-pager`, `label`.
- Security: `checklist`.
- 404: `not-found`, `not-found-logo`, `terminal nf`.
- Brand: `brand-page`, `brand-logos`, `brand-sample`, `light-sample`, `dark-sample`, `mark-sample`, `monochrome-sample`, `brand-rules`, `clear-space`, `minimum-size`, `download-links`, `dont-grid`, `dont-stretch`, `dont-recolor`, `dont-effects`, `dont-rotate`.
- Overlays: `sheet-backdrop`, `bottom-sheet`, `modal-backdrop`, `palette-backdrop`.

## 5. Interaction specification

### Navigation

- Internal links call `preventDefault()`, `history.pushState({}, "", path)`, update React path state, and scroll to top.
- `popstate` updates React state for browser Back/Forward.
- Unknown paths render `NotFound`.
- Document title updates synchronously to `[Page name] | skillpm`.

### Search and command palette

- Navbar search and home SearchBar open the palette.
- `Meta+K` or `Ctrl+K` opens it globally.
- Escape closes it.
- Clicking the backdrop closes it; clicking the panel stops propagation.
- Palette input auto-focuses.
- Clicking a result navigates and closes the palette.
- Results: Browse all skills, Browse categories, Curated collections, pdf-summarizer, Submit a skill, Documentation, Security, Brand assets.

### Browse

- Search matches lowercased package name, description, or tags.
- Category, compatibility, and language are controlled single-choice radio groups.
- Clear All resets query and all filters.
- Sort options: Recently updated (source order) and A–Z.
- Result count updates immediately.
- View toggle switches list/grid.
- Active filters render removable tags.
- Zero results show EmptyState; Clear filters restores all packages.
- At ≤900px, Filters opens a bottom sheet; backdrop or “Show N packages” closes it.

### Package cards/lists

- SkillCard navigates on click, Enter, or Space.
- SkillListItem opens detail from its main button.
- Hover changes only border/background as defined; no lift/shadow.

### Copy

- CopyCommand writes its command to `navigator.clipboard`.
- CodeBlock writes its child string.
- Icon/text changes from Copy to Copied.
- Global toast appears at bottom-right.
- Both reset after 2000ms.

### FAQ

- Item zero starts open.
- Clicking an item toggles it; opening one closes the previous item.

### Detail tabs/install

- README, Versions, Security switch local rendered content.
- skillpm, npx, manual switch the copied command.
- View on GitHub uses `window.open(..., "_blank")`.
- Report opens an accessible modal; Cancel/X closes it. Submission is disabled because no registry service exists.
- On ≤600px, desktop install panel hides and sticky bottom install controls appear.

### Submit

- Generate validates:
  1. URL must start `https://github.com/`.
  2. Package name must be non-empty.
- Failure shows a role=alert field error.
- Success renders a JSON CodeBlock and Open pull request action.
- Open pull request opens `https://github.com/skillpm/registry/compare`.
- Character count is live and capped at 160.

### Mobile menu/theme

- Hamburger opens a fixed full-screen menu.
- X closes it.
- Selecting an item navigates and closes it.
- ThemeToggle switches root `data-theme` between light and dark.

## 6. Page copy

### Shared package records

1. `pdf-summarizer` — `@paperplane` — “Extract, summarize, and query PDFs with citations and page references.” — documents, research — v2.4.1 — TypeScript — Claude/Cursor/Codex — updated 2 days ago.
2. `code-reviewer` — `@shipyard` — “Review pull requests for bugs, security issues, and maintainability.” — coding, github — v1.8.0 — TypeScript — Claude/Cursor — 4 days ago.
3. `sql-helper` — `@databloom` — “Write, explain, and optimize SQL across common databases.” — data, coding — v3.1.2 — Python — Claude/Codex — 6 days ago.
4. `web-researcher` — `@deeptrace` — “Research topics across the web and return cited findings.” — research, web — v1.3.0 — Python — Claude/Cursor — 1 week ago.
5. `ui-copywriter` — `@wordsmith` — “Write concise, accessible product copy for interfaces.” — writing, design — v0.9.4 — Markdown — Claude/Cursor/Codex — 1 week ago.
6. `workflow-runner` — `@autopilot` — “Run multi-step automations with review and approval gates.” — automation, tools — v2.0.0 — TypeScript — Cursor/Codex — 2 weeks ago.
7. `api-tester` — `@requestly` — “Test API endpoints and generate readable failure reports.” — coding, testing — v1.5.3 — TypeScript — Claude/Codex — 2 weeks ago.
8. `csv-cleaner` — `@rows` — “Normalize, validate, and clean tabular data files.” — data, documents — v1.2.1 — Python — Claude/Cursor — 3 weeks ago.
9. `dependency-auditor` — `@safechain` — “Check project dependencies for known risks and updates.” — security, coding — v0.8.2 — TypeScript — Claude/Cursor/Codex — 3 weeks ago.

### Home

- Kicker: `Discover. Install. Build. Share.`
- H1: `Your AI skills, one package away.`
- Subtitle: `Discover, install, and share reusable skills for the AI agents you build with.`
- Search placeholder: `Search skills... try 'pdf'`
- Command: `npx skillpm install user/repo`
- Actions: `Browse skills`, `Read the CLI docs`
- Compatibility: `Works with Claude, Cursor and Codex.`
- Terminal: `Terminal`; `$ skillpm install pdf-summarizer`; `Resolving skill manifest...`; `Verifying publisher signature...`; `Checking requested permissions...`; `✓ Installed pdf-summarizer@2.4.1`
- Sections: `Recently updated` / `View all`; `Browse by category`; `How it works`; `Built for trust`; `Share your skill with the world`; `Questions, answered`.
- Steps: Find — `Search for a skill that matches your work.`; Install — `Run one command and review permissions.`; Your agent uses it — `The skill is added to your agent's toolkit.`
- Trust: Repository provenance — `Source links and package history stay visible.`; Security scanning — `Automated checks on every release.`; Open source — `Inspect source and requested permissions.`
- CTA: `Publish your agent capability in the public registry.` / `Submit a skill`
- FAQ:
  - What is an AI agent skill? — `A skill is a portable package of instructions, tools, and context that gives an AI agent a specific capability.`
  - Which agents does skillpm support? — `Skills can declare support for Claude, Cursor, Codex, and other compatible runtimes.`
  - Are skills safe to install? — `Package pages show their source repository and requested permissions before installation.`
  - Can I publish my own skill? — `Yes. Add a SKILL.md file to a public repository and submit it for review.`
  - Is skillpm open source? — `The CLI, specification, and registry tooling are developed in public.`

### Browse

- H1: `Browse skills`
- Dynamic: `[N] packages`, `[N] results`
- Search: `Search by name, function, or tag`
- Sort: `Recently updated`, `A–Z`
- Views: `List`, `Grid`
- Filters:
  - Category: All categories, Coding, Documents, Data, Research, Security.
  - Compatibility: Any agent, Claude, Cursor, Codex.
  - Language: Any language, TypeScript, Python, Markdown.
- Empty: `No skills found` / `Try a broader search or remove a filter.` / `Clear filters`
- Mobile: `Filters`, `Show [N] packages`

### Categories

- H1: `Categories`
- Intro: `Browse skills by the work they help an agent perform.`
- Documents: `Read, transform, and organize files.`
- Coding: `Review, test, and maintain software.`
- Data: `Query, clean, and explain datasets.`
- Design: `Support interface and content workflows.`
- Writing: `Draft and revise clear technical copy.`
- Research: `Gather sources and structure findings.`
- Automation: `Connect tools and repeat workflows.`
- Security: `Audit dependencies and permissions.`

### Collections

- H1: `Collections`
- Intro: `Small, maintained sets for common developer workflows.`
- `Start with documents` — `Skills for extracting, cleaning, and summarizing files.` — pdf-summarizer, csv-cleaner.
- `Review before merge` — `Tools for pull requests, dependencies, and API checks.` — code-reviewer, dependency-auditor, api-tester.
- `Research with sources` — `Skills that collect and organize referenced material.` — web-researcher, pdf-summarizer.

### Skill detail

- Breadcrumb: Home / Browse / pdf-summarizer.
- Name/author: `pdf-summarizer`, `by @paperplane`.
- Description: `Extract, summarize, and query any PDF with citations and page-level references.`
- Tags: documents, research, pdf.
- Metadata: Version 2.4.1; Last updated May 24, 2025; License MIT.
- Tabs: README, Versions, Security.
- README:
  - `PDF Summarizer`
  - `Give your agent a reliable way to read long PDF files and return structured summaries with citations.`
  - Installation: `skillpm install paperplane/pdf-summarizer`
  - What it can do: Extract text from local and remote PDF files; Return summaries with page-level citations; Answer questions using only the supplied document.
  - Usage code: `agent.use("pdf-summarizer", { file: "./annual-report.pdf", format: "brief" })`
- Versions: `Version history`; `2.4.1 — Improved citation accuracy and large-file handling.`
- Security: `Security report`; `Scanned — No known issues found`; `Permissions requested — File read and network access`; `Last scan date — May 24, 2025`.
- Install modes:
  - skillpm: `skillpm install paperplane/pdf-summarizer`
  - npx: `npx skillpm install paperplane/pdf-summarizer`
  - manual: `git clone github.com/paperplane/pdf-summarizer`
- Facts: Version 2.4.1; License MIT; Language TypeScript; Repository paperplane/pdf-summarizer; Dependencies pdf.js, zod; Compatibility Claude/Cursor/Codex.
- Actions: View on GitHub, Report.
- Report modal: Report skill; Reason; Security concern/Misleading information/Broken package; Details; Tell us what happened; Cancel; Submission unavailable.
- Bottom section: `Related skills`.

### Submit

- H1: `Submit a skill`
- Intro: `Add your skill to the public registry.`
- Steps: Add a SKILL.md — `Describe capabilities and permissions.`; Open a pull request — `Generate the registry entry.`; Get reviewed — `Automated checks and human review.`
- Form intro: `Frontend preview`; `Package metadata`; `This form validates and generates a registry entry locally. Publishing happens through a GitHub pull request.`
- Fields: GitHub repository URL, Package name, Version, License, Category, Skill manifest path, Compatibility, Short description.
- Defaults: version `0.1.0`, license MIT, manifest `SKILL.md`.
- Validation: `Enter a public GitHub repository URL.`; `Add a package name.`
- Action: `Generate registry entry`; then `Open pull request`.

### Docs

- Sidebar: Documentation; Getting started; Installing skills; Writing a skill; CLI reference; FAQ.
- Article: Getting started; `Install your first skill`; `Use skillpm to find and add capabilities to your AI agent.`
- `Install the CLI`; `The skillpm CLI works with Node.js 20 or newer. Install it globally or run it with npx.`; `npm install -g skillpm`
- Callout: `Before you install`; `Review the source, requested permissions, and compatibility list for every skill.`
- `Install a skill`; `Pass the publisher and skill name to the install command.`; `skillpm install paperplane/pdf-summarizer`
- `Check installed skills`; `skillpm list`
- Pager: `← Installation`; `Writing a skill →`
- Outline: On this page; Install the CLI; Install a skill; Check installed skills.

### Security

- H1: `How we keep skills safe`
- Intro: `Clear checks, visible permissions, and a public process.`
- Repository provenance: `Package pages link directly to their source and history.`
- Automated scanning: `Every release is checked for risky behavior.`
- Visible permissions: `Skills declare what they can access before install.`
- Checklist: Review the source repository and recent changes; Check the publisher identity and package history; Read every requested permission; Pin versions in shared or production environments.
- CTA: `Report a problem`; `Tell us about suspicious behavior or a security issue.`; `Contact security`.

### About

- H1: `About skillpm`
- Intro: `We make useful agent capabilities easier to find, inspect, and share.`
- `Our mission`: `AI agents are becoming part of everyday development work. Skills should be portable, understandable, and safe to install. skillpm provides a public specification and registry for that work.`
- `Open source by default`: `The CLI, package format, and registry tooling are open source. Decisions are discussed in public and contributions are welcome.`
- Action: `Contact us`

### 404

- Terminal: `$ skillpm open /missing-page`; `skillpm: command not found`
- H1: `404`
- `The page you requested does not exist.`
- Action: `Go home`

### Brand

- H1: `Brand assets`
- Intro: `Logo files and usage guidance for skillpm.`
- Clear space: `Keep clear space equal to half the mark height on every side.`
- Minimum size: `Use the mark at 16px or larger and the full logo at 80px or larger.`
- Colors: `Use graphite for the modular S and cobalt for its active connector.`; Cobalt #4169E1; Light text #17191F; Dark text #F5F3EE.
- Downloads: Download full logo SVG; Download mark SVG; Download single-color SVG.
- Don’t: Don't stretch; Don't recolor; Don't add effects; Don't rotate.
- Action: `Back to home`

## 7. Logo SVG

The live React component uses `currentColor` for graphite/warm-white modules and fixed cobalt for the active connector. The full viewBox is `0 0 133 32`; mark viewBox is `0 0 32 32`.

```svg
<svg viewBox="0 0 133 32" role="img" aria-label="skillpm">
  <rect x="5" y="4" width="22" height="6" rx="3" fill="currentColor"/>
  <rect x="5" y="8" width="6" height="8" rx="3" fill="currentColor"/>
  <rect x="5" y="13" width="22" height="6" rx="3" fill="currentColor"/>
  <rect x="21" y="16" width="6" height="8" rx="3" fill="#4169E1"/>
  <rect x="5" y="22" width="22" height="6" rx="3" fill="currentColor"/>
  <text
    x="42"
    y="24"
    fill="currentColor"
    font-family="Inter, sans-serif"
    font-size="26"
    font-weight="600"
    letter-spacing="-0.26"
  >skillpm</text>
</svg>
```

## 8. Favicon and app-icon contents

### `public/icon.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
<style>.ink{fill:#17191F}@media(prefers-color-scheme:dark){.ink{fill:#F5F3EE}}</style>
<rect class="ink" x="5" y="4" width="22" height="6" rx="3"/><rect class="ink" x="5" y="8" width="6" height="8" rx="3"/><rect class="ink" x="5" y="13" width="22" height="6" rx="3"/><rect x="21" y="16" width="6" height="8" rx="3" fill="#4169E1"/><rect class="ink" x="5" y="22" width="22" height="6" rx="3"/>
</svg>
```

### `public/site.webmanifest`

```json
{
  "name": "skillpm",
  "short_name": "skillpm",
  "description": "The package manager for AI skills",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F5F3EE",
  "theme_color": "#4169E1",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### Exact binary asset inventory

Binary content is identified by dimensions and SHA-256. These hashes are the byte-exact acceptance values for a rebuild.

| File | Dimensions/content | SHA-256 |
|---|---|---|
| `favicon.ico` | ICO containing 16×16, 32×32, 48×48 RGBA PNG frames | `9334a3ca511d47a3e81139ecabbc691b35c19d0654d58644fdbae1c80421a2a4` |
| `apple-touch-icon.png` | 180×180 RGBA | `1f29b644f75a18114b576262ae848f9fb10a10a0bf4175812ac5e599b589d87b` |
| `icon-192.png` | 192×192 RGBA | `1ee07738215ebf0eeb8a8f28de1f777700a9554b4013db627a04518856d1f2e5` |
| `icon-512.png` | 512×512 RGBA | `549238522f393c4114066d3189e83863bc9afd383931afafe2173928aa350d92` |
| `icon-maskable-512.png` | 512×512 RGBA, safe padding | `d5293174b61cc316a2a1648b71a344173db02d9e511746549ac594d364cf3016` |
| `og-image.png` | 1200×630 RGB | `7d01da40a32b156c237e705b8812da44b51aa7ab4e29baf59a55c7557176e8e7` |
| `logo-full.svg` | SVG | `da181b233f349c2d5c1a3e54d969c44fe0a6b0be5b39ece9f7d6261f2a3c6a0b` |
| `logo-monochrome.svg` | SVG | `8d3d7ebffc9ddfbb130c6f9ef2b5fbecd4c63e4d6ff8c4792d9bed5d50578400` |

Always verify all files with `sha256sum public/*` after a rebuild.

### `favicon.ico` exact Base64 payload

Decode with `base64 -d > public/favicon.ico`.

```base64
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
AU7qAAAAAElFTkSuQmCC
```

## 9. HTML head wiring

Required links/meta:

```html
<title>Home | skillpm</title>
<meta name="description" content="Discover, install, and share capabilities for AI agents." />
<meta name="theme-color" content="#4169E1" />
<link rel="icon" type="image/svg+xml" href="/icon.svg" />
<link rel="icon" type="image/svg+xml" href="/icon.svg" media="(prefers-color-scheme: light)" />
<link rel="icon" type="image/svg+xml" href="/icon.svg" media="(prefers-color-scheme: dark)" />
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta property="og:title" content="The package manager for AI skills | skillpm" />
<meta property="og:description" content="Discover, install, and share capabilities for AI agents." />
<meta property="og:image" content="/og-image.png" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
```

## 10. Rebuild acceptance checklist

1. Production build succeeds with `pnpm build`.
2. All sitemap paths render and update the title.
3. Light/dark variables switch from the root `data-theme`.
4. No text below 13px except intentionally hidden mobile copy text.
5. No gradient, glow, glass blur, or box shadow.
6. Search/filter/sort/view controls update the registry.
7. Copy controls and toast reset after 2 seconds.
8. Keyboard focus uses the 2px cobalt ring.
9. Layouts work at >900px, 601–900px, and ≤600px.
10. Binary asset SHA-256 values match the inventory.
