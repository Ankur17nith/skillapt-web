# Security Policy

## Supported versions

Only the latest commit on `main` (and the most recent tagged release, if any) receives security fixes.

| Version | Supported |
| :--- | :---: |
| `main` / latest release | ✅ |
| older releases | ❌ |

## Reporting a vulnerability

**Please do not open a public issue for security problems.**

Report privately through GitHub Security Advisories:
<https://github.com/Ankur17nith/skillapt-web/security/advisories/new>

Include a description, steps to reproduce or a proof of concept, the affected page or component, and the impact you expect. You can expect an acknowledgement within a few days and a status update as we investigate. Please allow reasonable time for a fix before public disclosure; we will credit reporters who want credit.

## Scope

In scope for this repository:

- XSS or content injection (markdown rendering, registry data, URL handling)
- Weaknesses in the Content-Security-Policy or other generated security headers
- Open redirects, unsafe link handling, leaking of tokens or other sensitive data in the client
- Vulnerable dependencies that are reachable in the shipped bundle

Out of scope here (report to the relevant repository instead):

- The registry API, its authentication and storage: [skillapt-registry](https://github.com/Ankur17nith/skillapt-registry)
- The CLI: [skillapt](https://github.com/Ankur17nith/skillapt)
- Findings that need a compromised browser or device, social engineering, or denial of service by traffic volume

## How this site is hardened

- Strict CSP generated at build time: `script-src 'self'`, `frame-ancestors 'none'`, `object-src 'none'`, `connect-src` limited to the configured registry origin
- No third-party requests (fonts are self-hosted)
- Markdown is rendered without raw HTML; unsafe URL schemes are dropped; external links use `rel="noopener noreferrer"`
- Registry-supplied values (repository, avatar URLs) are validated before use
- API tokens are displayed once and never persisted by the site; `VITE_*` build variables are public and must never hold secrets
