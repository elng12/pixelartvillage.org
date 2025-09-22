# Repository Guidelines

## Project Structure & Module Organization
- `src/`: React app (App.jsx), `components/` (UI), `components/editor/` (Preview, Adjustments), `hooks/`, `utils/`, `index.css`.
- `tests/`: Playwright end‑to‑end specs.
- `public/`: static assets. `dist/`: build output.
- `server/`: optional Express + Sharp image service.
- Config: `vite.config.js`, `tailwind.config.js`, `eslint.config.js`.

## Build, Test, and Development Commands
- `npm run dev`: start Vite dev server.
- `npm run build`: production build.
- `npm run preview`: preview built assets.
- `npm run lint`: ESLint check.
- E2E: `npx playwright install` then `npx playwright test` (uses `tests/`).

### Node.js Version & Environment
- Recommended Node.js: 18.x or 20.x (avoid Node 22 due to npm optional-deps issue with Rollup).
- Use nvm to switch: `nvm use 20` (repo includes `.nvmrc`).
- After switching Node versions, run a clean install: `rm -rf node_modules package-lock.json && npm ci`.

### Build & Verify (Production)
- `npm run build`: Builds, generates prerendered HTML for routes (including Blog and pSEO pages), and produces OG images.
- `npm run verify:dist`: Verifies production artifacts, checking critical SEO tags and required assets exist.

## Coding Style & Naming Conventions
- JavaScript/JSX, ES modules (use `import`/`export`, prefer named exports).
- React 19 functional components; hooks prefixed with `use*`.
- Components: `PascalCase` (e.g., `Editor.jsx`); functions/vars: `lowerCamelCase`; constants: `UPPER_SNAKE_CASE`.
- Indentation: 2 spaces. Tailwind v4 utility‑first; keep custom CSS minimal.

## Testing Guidelines
- E2E via Playwright in `tests/`; prefer `data-testid` selectors for stability.
- Name tests `*.spec.js`. Run locally with `npx playwright test`; commit only deterministic tests.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (e.g., `feat:`, `fix:`, `refactor:`). Keep changes focused.
- PRs must include: what/why summary, linked issues, UI screenshots for visual changes, and passing `npm run lint`/`npm run build`.

## Security & Configuration Tips
- CSP (see `index.html`): images allowed from `self`, `data:`, and `blob:`. Avoid external image URLs in UI.
- No secrets in repo; use environment variables for local services under `server/`.

## SEO & Prerender Notes
- SPA routing uses prerender to emit static HTML for key routes (Blog, pSEO `/converter/:slug`), ensuring title/canonical/OG/Twitter tags are present without JavaScript.
- OG images are generated at build time for Blog and pSEO pages (`public/blog-og/*`, `public/pseo-og/*`).
- The verification step enforces presence of critical meta tags and image assets.

## Preview Scaling Rule (Project‑Specific)
- Scale by layout size, not transform: compute `width = originalWidth * zoom`, `height = originalHeight * zoom` on the `<img>`; keep `max-w-none`. Avoid CSS contain and avoid `transform: scale()` to prevent layout/visual mismatch in scrollable containers.
