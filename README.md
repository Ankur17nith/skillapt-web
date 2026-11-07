# skillpm-web

The official web portal and marketplace for **[skillpm]** — the open package manager and registry for AI agent skills.

Discover, install, and share reusable capabilities for Claude, Cursor, Codex, and other compatible agent runtimes.

---

## 🚀 Features

* **Approved Flat Design System**: Inter + JetBrains Mono, flat aesthetics, 1px borders, cobalt `#4169E1` accent, 1100px shell, and custom skill cartridge logo.
* **Full Client-Side Routing**: SPA routes handled via React Router with scroll restoration, active navbar states, and dynamic page titles (`Page name | skillpm`).
* **Instant Fuzzy Search**: Fuse.js index supporting hero search and global accessible `⌘K` command palette with keyboard navigation and focus trapping.
* **Browse & URL Filter Syncing**: Filter by Category, Compatibility, and Language, sort by Recent / A–Z / Stars / Installs, view toggle (List & Grid), active filter chips, and pagination (12 items/page).
* **Dynamic Skill Detail Pages**: Breadcrumbs, markdown README parsing (`react-markdown` + `remark-gfm`), sticky install panel (`skillpm`, `npx`, `manual` commands), version history, security report, and report modal with toast notifications.
* **Validated Submit Form**: Real-time validation for GitHub repository URLs, package naming conventions, tags, 160-char descriptions, JSON payload generator, and direct GitHub Pull Request link.
* **Markdown Documentation**: Document files located in `/content/docs` with sticky sidebar navigation, table of contents outline, and previous/next page pagers.
* **Dark & Light Mode**: Persistent theme selection stored in `localStorage`, automatic synchronization with `prefers-color-scheme`, and inline head bootstrap preventing theme flash.
* **SEO & Metadata**: Per-page Open Graph, Twitter cards, meta descriptions via `react-helmet-async`, XML sitemap (`/sitemap.xml`), and robots rules (`/robots.txt`).
* **Test Suite**: Comprehensive unit tests with Vitest for data helpers, search ranking, and form validation.

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

## 💻 Local Development

### 1. Prerequisites
* Node.js v20+ (recommended v22+)
* npm v10+ or pnpm v9+

### 2. Installation
```bash
git clone https://github.com/Ankur17nith/skillpm-web.git
cd skillpm-web
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:8443](http://localhost:8443) in your browser.

### 4. Run Test Suite
```bash
npm test
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
3. Import your `skillpm-web` repository from GitHub.
4. Select framework preset: **Vite**.
5. Leave the default build command (`npm run build`) and output directory (`dist`).
6. Click **Deploy**. Vercel will build the project and deploy it with full SPA rewrite fallback configured via `vercel.json`.

### Option B: Vercel CLI

1. Install the Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. In the project root, run:
   ```bash
   vercel
   ```
3. For production deployment:
   ```bash
   vercel --prod
   ```

---

## 🔗 Custom Domain Setup

To configure a custom domain (e.g. `skillpm.dev` or `marketplace.yourdomain.com`):

1. In the Vercel Dashboard, navigate to **Project Settings > Domains**.
2. Click **Add** and enter your domain name.
3. Choose whether to redirect `www` to the apex domain or vice versa.
4. Update your domain registrar's DNS records as indicated:
   * **Apex Domain (`skillpm.dev`)**:
     * Type: `A`
     * Name: `@`
     * Value: `76.76.21.21`
   * **Subdomain (`www.skillpm.dev`)**:
     * Type: `CNAME`
     * Name: `www`
     * Value: `cname.vercel-dns.com`
5. Once DNS propagates (typically 1–15 minutes), Vercel will automatically provision a free SSL/TLS certificate.

---

## 📄 License

MIT © 2025 skillpm. Open source and built for reusable agent skills.
