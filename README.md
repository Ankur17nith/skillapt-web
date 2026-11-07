# skillapt-web

The official web portal and marketplace for **[skillapt]** — the independent package manager and registry for AI agent skills.

Discover, install, and share reusable capabilities for Claude, Cursor, Codex, Google Antigravity, and other compatible agent runtimes.

---

## 🚀 Key Features

* **Approved Flat Design System**: Inter + JetBrains Mono, flat aesthetics, 1px borders, cobalt `#4169E1` accent, 1100px shared `<Container>`, and custom "skill cartridge" logo.
* **Full Client-Side Routing**: SPA routes handled via React Router with scroll restoration, active navbar states, and dynamic page titles (`Page name | skillapt`).
* **Live Registry API Integration**: Typed client connecting to OpenAPI specification (`/v1/skills`, `/v1/skills/:name`, `/v1/stats`, `/v1/reports`, `/v1/tokens`), with in-memory caching and offline mock fallback.
* **Instant Fuzzy Search**: Fuse.js index supporting hero search and global accessible `⌘K` command palette with keyboard navigation and focus trapping.
* **Browse & URL Filter Syncing**: Filter by Category, Compatibility, and Language, sort by Recent / A–Z / Stars / Installs, view toggle (List & Grid), active filter chips, and pagination (12 items/page).
* **Dynamic Skill Detail Pages**: Breadcrumbs, markdown README parsing (`react-markdown` + `remark-gfm`), sticky install panel (`skillapt`, `curl`, `manual` commands), version history with yank flags, security report, and abuse report modal with toast notifications.
* **Publisher Dashboard (`/dashboard`)**: Authenticated portal for skill authors to inspect package downloads, yank/restore compromised versions, and create/revoke CLI publishing API tokens with one-time copy modal.
* **Interactive Publish Guide (`/publish`)**: Comprehensive guide detailing archive formats, `skill.json` manifest builder, `SKILL.md` prompt formatting, and CLI release workflows.
* **Markdown Documentation**: Document files located in `/content/docs` with sticky sidebar navigation, table of contents outline, and previous/next page pagers.
* **Dark & Light Mode**: Persistent theme selection stored in `localStorage`, automatic synchronization with `prefers-color-scheme`, and inline head bootstrap preventing theme flash.
* **SEO & Metadata**: Per-page Open Graph, Twitter cards, meta descriptions via `react-helmet-async`, XML sitemap (`/sitemap.xml`), and robots rules (`/robots.txt`).
* **Test Suite**: Comprehensive unit tests with Vitest covering data helpers, search ranking, manifest validation, API client fallback, and user session management.

---

## 🛠 Tech Stack

* **Framework**: React 19 + ReactDOM 19
* **Build System**: Vite 8 + TypeScript 5.7
* **Routing**: React Router 7
* **Search**: Fuse.js 7
* **Markdown Engine**: React Markdown 10 + Remark GFM 4
* **SEO**: React Helmet Async 3
* **Styling**: Tailwind CSS v4 + Semantic CSS Variables
* **Testing**: Vitest 5 + @testing-library/react 16

---

## ⚙️ Environment Variables

Configure frontend behavior using `.env` or deployment settings:

| Variable | Default | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | *None (Fallback mode)* | Base URL of the live Skillapt Registry API (e.g. `https://registry.skillapt.dev`). When left unset, the frontend runs offline with mock local data. |

---

## 🔒 Authentication & Cookie Domain Configuration

The frontend authenticates with the registry via GitHub OAuth:

1. User clicks **Sign in with GitHub** → Browser redirects to `${VITE_API_URL}/v1/auth/github`.
2. Upon successful authentication, the registry API issues an HTTP-only session cookie:
   - `Name`: `skillapt_session`
   - `HttpOnly`: `true`
   - `SameSite`: `Lax`
   - `Secure`: `true`
   - `Domain`: `.skillapt.dev` (in production)
3. The frontend makes all API requests with `credentials: "include"`, enabling cross-subdomain authentication between:
   - Web App: `https://skillapt.dev` (or `https://www.skillapt.dev`)
   - Registry API: `https://registry.skillapt.dev`
4. In local development (`localhost`), cookie security flags are relaxed automatically.

---

## 💻 Local Development

### 1. Prerequisites
* Node.js v20+ (recommended v22+)
* npm v10+ or pnpm v9+

### 2. Installation
```bash
git clone https://github.com/Ankur17nith/skillapt-web.git
cd skillapt-web
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:8443](http://localhost:8443) in your browser.

### 4. Run Test Suite
```bash
npm test -- --run
```

### 5. Build for Production
```bash
npm run build
npm run preview
```

---

## 🌐 Deploying to Vercel

### Option A: Vercel Web Dashboard (Recommended)

1. Push your repository to GitHub:
   ```bash
   git push origin main
   ```
2. Navigate to [vercel.com/new](https://vercel.com/new).
3. Import your `skillapt-web` repository from GitHub.
4. Framework preset: **Vite**.
5. Build command: `npm run build`, Output directory: `dist`.
6. Add environment variable `VITE_API_URL` pointing to your deployed API (e.g. `https://registry.skillapt.dev`).
7. Click **Deploy**. Vercel will build the project and deploy it with full SPA rewrite fallback configured via `vercel.json`.

### Option B: Vercel CLI

```bash
npm install -g vercel
vercel
# For production:
vercel --prod
```

---

## 🔗 Custom Domain Setup

To configure a custom domain (e.g. `skillapt.dev`):

1. In the Vercel Dashboard, navigate to **Project Settings > Domains**.
2. Click **Add** and enter `skillapt.dev`.
3. Choose redirect settings (e.g. redirect `www.skillapt.dev` to `skillapt.dev`).
4. Configure DNS records:
   * **Apex Domain (`skillapt.dev`)**:
     * Type: `A`, Name: `@`, Value: `76.76.21.21`
   * **Subdomain (`www.skillapt.dev`)**:
     * Type: `CNAME`, Name: `www`, Value: `cname.vercel-dns.com`
5. Vercel provisions free SSL/TLS certificates automatically.

---

## 📄 License

MIT © 2026 skillapt. Open source and built for reusable agent skills.
