# Prerender & SEO Evaluation Report: skillapt-web

## 1. Executive Summary

`skillapt-web` is the user-facing web portal for the Skillapt package manager. To balance SEO discovery for agent skills with developer velocity and security, this evaluation compares Client-Side Rendering (SPA), Static Site Generation (SSG / Prerendering), and Server-Side Rendering (SSR).

## 2. Current Architecture & SEO Assessment

- **Stack**: React 18, Vite, React Router 7, Tailwind CSS, `react-helmet-async`.
- **Metadata Management**:
  - `react-helmet-async` manages `<title>`, `<meta name="description">`, OpenGraph (`og:title`, `og:description`, `og:image`, `og:url`), and Twitter Cards per route.
  - Sitemaps (`/sitemap.xml`) and crawler guidelines (`/robots.txt`) index core routes (`/`, `/browse`, `/publish`, `/docs/*`, `/security`, `/about`, `/brand`).
  - Fallback document title synchronization runs synchronously via `DocumentTitle.tsx`.
- **Performance Characteristics**:
  - Gzipped bundle size: **~92 KB** total application code.
  - Zero heavy 3rd-party tracking or layout-shifting fonts.
  - Fast First Contentful Paint (FCP) and Largest Contentful Paint (LCP) under 0.8s on CDN edge.

## 3. Prerendering & Rendering Strategies Comparison

| Criteria | Client-Side SPA (Current) | Prerendering (SSG via Vite) | Edge SSR (Cloudflare/Vercel) |
| :--- | :--- | :--- | :--- |
| **SEO for Modern Crawlers** | Good (Google/Bing parse JS) | Excellent (Instant static HTML) | Excellent (Dynamic HTML per request) |
| **Social Media Preview Bots** | Requires Twitter/Slack bot JS | 100% compatible | 100% compatible |
| **Edge Cacheability** | 100% static assets | 100% static HTML + assets | Cache-Control managed |
| **Build & Deploy Complexity** | Zero infrastructure (Static CDN) | Low (Vite prerender crawl step) | Medium (Serverless runtime / Workers) |
| **Auth & Dynamic State** | Seamless (Client cookie check) | Needs client hydration boundary | Requires edge session decryption |

## 4. Recommendations & Roadmap

1. **Short Term (Current Production Setup)**:
   - Maintain Vite SPA deployed to Vercel / Cloudflare Pages.
   - Comprehensive OpenGraph and meta tags rendered by `SEO.tsx` with server fallback headers.
   - All documentation and public skill detail URLs crawled via deterministic `sitemap.xml`.

2. **Phase 2 (Static Snapshot Prerendering)**:
   - For marketing and documentation routes (`/docs/*`, `/publish`, `/security`), integrate `@prerenderer/rollup-plugin` into `vite.config.ts` during production build.
   - Generates pre-baked `dist/docs/*.html` static files for non-JS web crawlers.
   - Interactive pages (`/dashboard`) remain dynamic client routes.
