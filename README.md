# Pixel Art Village (React + Vite)

Free online pixel art converter. Turn images into pixel art with adjustable pixel size, brightness, contrast, and saturation. Live preview and one‑click download.

## Quick Start

```bash
npm install
npm run dev
```

Open the dev server, upload an image, and tweak the sliders.

## Scripts

- `npm run dev`: start dev server
- `npm run build`: build for production
- `npm run preview`: preview built assets
- `npm run lint`: run ESLint

## Highlights

- Live preview for all adjustments
- Pixelation pipeline: filter first, then pixelate for stable results
- Accessibility: keyboard‑operable upload; editor supports ESC/overlay close and initial focus
- Tailwind v4: simplified config; design tokens via CSS variables

## Limitations

- Palettes: Pico‑8 implemented; more palettes coming soon
- Large images: limited by browser memory/Canvas; prefer moderate sizes

## Privacy

All processing happens locally in your browser. No uploads to a server.

## Context7 MCP (Global) — Up‑to‑date Docs In Your IDE

Get fresh, version‑specific code docs/examples in your prompts (Cursor / Claude Code / VS Code MCP) without polluting this repo.

### Why global, not project dep?

- No front‑end bloat or secret exposure. MCP server runs outside the browser; API keys never enter your Vite bundle.
- One install, all projects. No per‑repo scaffolding or lockfile noise.

### Install (global)

Requires Node >= 18.

```bash
# already present in this environment, included for reference
npm i -g @upstash/context7-mcp@latest

# verify
context7-mcp --help
```

### Cursor (local MCP)

`~/.cursor/mcp.json`

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp", "--api-key", "YOUR_API_KEY"]
    }
  }
}
```

Or use the remote HTTP endpoint instead of local command:

```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "headers": { "CONTEXT7_API_KEY": "YOUR_API_KEY" }
    }
  }
}
```

### Claude Code (local MCP)

```bash
claude mcp add context7 -- npx -y @upstash/context7-mcp --api-key YOUR_API_KEY
```

Or remote HTTP:

```bash
claude mcp add --transport http context7 \
  https://mcp.context7.com/mcp \
  --header "CONTEXT7_API_KEY: YOUR_API_KEY"
```

### VS Code MCP (local)

`settings.json` MCP servers section (VS Code MCP preview):

```json
"mcp": {
  "servers": {
    "context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp", "--api-key", "YOUR_API_KEY"]
    }
  }
}
```

### Security notes

- Do NOT import the MCP package in front‑end code; keep keys out of the browser.
- Prefer HTTP remote when team‑wide keys/quotas are centrally managed.
- Rotate `YOUR_API_KEY` as needed; keep it outside this repo (e.g. `~/.cursor/mcp.json`).
