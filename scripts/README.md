# scripts/

This folder contains project maintenance scripts, grouped by domain:

- `build/`: build-time steps (used by `npm run dev/build` and Playwright web server)
- `seo/`: SEO checks, keyword tools, and sitemap generation
- `i18n/`: translation and locale maintenance utilities
- `assets/`: icon and image generation helpers
- `tools/`: one-off utilities (redirects CSV, CRX extraction, blog sorting)
- `test/`: lightweight unit checks (used by `npm run test:unit`)

Most scripts assume they are executed from the repository root (so `process.cwd()` points at the project).

