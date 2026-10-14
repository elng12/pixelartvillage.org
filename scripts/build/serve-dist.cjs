#!/usr/bin/env node
// Static server for `dist/` that applies headers from `dist/_headers`.
// This keeps local preview behavior closer to Cloudflare Pages / Netlify.

const http = require('http');
const fs = require('fs');
const path = require('path');

function getArgValue(name, fallback) {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return fallback;
  const value = process.argv[idx + 1];
  if (!value || value.startsWith('--')) return fallback;
  return value;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function parseHeadersFile(text) {
  const sections = new Map();
  let current = null;
  const lines = String(text || '').split(/\r?\n/);
  for (const line of lines) {
    if (!line.trim()) continue;
    if (!/^[\t ]/.test(line)) {
      current = line.trim();
      if (!sections.has(current)) sections.set(current, {});
      continue;
    }
    if (!current) continue;
    const trimmed = line.trim();
    const idx = trimmed.indexOf(':');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!key) continue;
    sections.get(current)[key] = value;
  }
  return sections;
}

function loadGlobalHeaders(distDir) {
  try {
    const headersPath = path.join(distDir, '_headers');
    const text = fs.readFileSync(headersPath, 'utf8');
    const sections = parseHeadersFile(text);
    return sections.get('/*') || {};
  } catch {
    return {};
  }
}

function getContentType(ext) {
  switch (ext) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.js':
      return 'application/javascript; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.xml':
      return 'application/xml; charset=utf-8';
    case '.txt':
      return 'text/plain; charset=utf-8';
    case '.svg':
      return 'image/svg+xml';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.webp':
      return 'image/webp';
    case '.ico':
      return 'image/x-icon';
    case '.woff2':
      return 'font/woff2';
    default:
      return null;
  }
}

function resolveDistFile(distDir, urlPathname) {
  const safePathname = (() => {
    try {
      return decodeURIComponent(urlPathname || '/');
    } catch {
      return '/';
    }
  })();

  const rel = safePathname.replace(/^\/+/, '');
  const candidates = [];

  if (!rel) {
    candidates.push('index.html');
  } else if (safePathname.endsWith('/')) {
    candidates.push(path.join(rel, 'index.html'));
  } else {
    candidates.push(rel);
    candidates.push(path.join(rel, 'index.html'));
  }

  for (const candidate of candidates) {
    const abs = path.join(distDir, candidate);
    if (!isWithinDist(distDir, abs)) continue;
    try {
      const stat = fs.statSync(abs);
      if (stat.isFile()) return abs;
    } catch {
      // ignore
    }
  }

  return null;
}

function isWithinDist(distDir, filePath) {
  return filePath === distDir || filePath.startsWith(`${distDir}${path.sep}`);
}

function resolveDist404(distDir, urlPathname) {
  let pathname;
  try {
    pathname = decodeURIComponent(urlPathname || '/');
  } catch {
    return null;
  }
  const requestedPath = path.resolve(distDir, pathname.replace(/^\/+/, ''));
  if (!isWithinDist(distDir, requestedPath)) return null;
  let directory = pathname.endsWith('/') ? requestedPath : path.dirname(requestedPath);
  // Cloudflare Pages uses the closest ancestor 404.html for a missing file.
  while (isWithinDist(distDir, directory)) {
    const candidate = path.join(directory, '404.html');
    try {
      if (fs.statSync(candidate).isFile()) return candidate;
    } catch {
      // Continue to the parent directory.
    }
    if (directory === distDir) break;
    directory = path.dirname(directory);
  }
  return null;
}

const distDir = path.join(process.cwd(), 'dist');
const port = Number(getArgValue('--port', process.env.PORT || '4173'));
const strictPort = hasFlag('--strictPort');
const globalHeaders = loadGlobalHeaders(distDir);

const server = http.createServer((req, res) => {
  const host = req.headers.host || `localhost:${port}`;
  const url = new URL(req.url || '/', `http://${host}`);

  let filePath = resolveDistFile(distDir, url.pathname);
  if (!filePath) {
    res.statusCode = 404;
    filePath = resolveDist404(distDir, url.pathname);
  }

  for (const [key, value] of Object.entries(globalHeaders)) {
    res.setHeader(key, value);
  }

  if (!filePath) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(req.method === 'HEAD' ? undefined : 'Not Found');
    return;
  }

  const contentType = getContentType(path.extname(filePath).toLowerCase());
  if (contentType) {
    res.setHeader('Content-Type', contentType);
  }

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  const stream = fs.createReadStream(filePath);
  stream.on('error', () => {
    res.statusCode = 500;
    res.end('Internal Server Error');
  });
  stream.pipe(res);
});

server.on('error', (err) => {
  if (strictPort && err && err.code === 'EADDRINUSE') {
    console.error(`[serve-dist] Port ${port} is already in use.`);
    process.exit(1);
  }
  throw err;
});

server.listen(port, () => {
  console.log(`[serve-dist] Serving dist on http://localhost:${port}`);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

