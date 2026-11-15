# skillapt-web

Web portal for [skillapt](https://github.com/Ankur17nith/skillapt): browse skills, read docs, and manage
publisher tokens. React 19 + Vite 8 + TypeScript + Tailwind CSS v4 single-page app, deployed as static
assets on Cloudflare.

## Commands

- `npm ci` - install (npm + `package-lock.json` is the only supported package manager)
- `npm run dev` - dev server on port 8443
- `npm run typecheck` / `npm test` / `npm run build` - or all three with `npm run check`

## Layout

- `src/pages` routes, `src/components` UI, `src/lib` API client, auth, search, validation
- `src/lib/api.ts` registry client; live when `VITE_REGISTRY_URL` is set, otherwise bundled demo data
- `content/docs/*.md` documentation rendered at `/docs`
- `public/_headers`, `public/_redirects` Cloudflare headers (CSP) and SPA fallback
- `docs/` specification and OpenAPI description of the registry API the client targets

## Rules

- Never render untrusted HTML; markdown goes through react-markdown without raw HTML.
- External links need `rel="noopener noreferrer"`.
- No hard-coded domains: use `CONFIG` in `src/config.ts`.
- Keep `npm run check` green.
