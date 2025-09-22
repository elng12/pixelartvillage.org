#!/usr/bin/env node
// Generate Open Graph images for pSEO pages using Sharp by rasterizing SVG.
// Output: public/pseo-og/<slug>.png (1200x630)
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const OUT_PSEO = path.join(ROOT, 'public', 'pseo-og');
const OUT_BLOG = path.join(ROOT, 'public', 'blog-og');
const PSEO_PATH = path.join(ROOT, 'src', 'content', 'pseo-pages.json');
const BLOG_PATH = path.join(ROOT, 'src', 'content', 'blog-posts.json');

function log(...a) { console.log('[pseo-og]', ...a) }
function warn(...a) { console.warn('[pseo-og] warn:', ...a) }

let sharp = null;
try {
  sharp = require('sharp');
} catch (e) {
  warn('sharp not installed; skip OG generation');
  process.exit(0);
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function wrapText(str, max = 36) {
  const words = String(str).split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max) {
      if (cur) lines.push(cur);
      cur = w;
    } else {
      cur = (cur ? cur + ' ' : '') + w;
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 4); // limit lines
}

function svgFor(title, subtitle) {
  const lines = wrapText(title, 30);
  const subtitleLines = wrapText(subtitle, 42);
  const lineHeight = 58;
  const yStart = 280 - (lines.length * lineHeight) / 2;
  const subYStart = 360;
  const titleTspans = lines
    .map((ln, i) => `<tspan x="80" dy="${i === 0 ? 0 : lineHeight}">${escapeXml(ln)}</tspan>`)
    .join('');
  const subtitleTspans = subtitleLines
    .map((ln, i) => `<tspan x="80" dy="${i === 0 ? 0 : 34}">${escapeXml(ln)}</tspan>`)
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0ea5e9"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="1200" height="630" fill="url(#bg)"/>
  <rect x="60" y="60" width="1080" height="510" rx="24" fill="#ffffff" opacity="0.1"/>
  <text x="80" y="${yStart}" fill="#ffffff" font-size="48" font-weight="800" font-family="system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, sans-serif">
    ${titleTspans}
  </text>
  <text x="80" y="${subYStart}" fill="#e5e7eb" font-size="28" font-weight="600" font-family="system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, sans-serif">
    ${subtitleTspans}
  </text>
  <text x="80" y="560" fill="#ffffff" font-size="24" font-weight="700" font-family="system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, sans-serif">Pixel Art Village</text>
  <circle cx="1140" cy="60" r="6" fill="#a78bfa"/>
  <circle cx="60" cy="60" r="6" fill="#60a5fa"/>
  <circle cx="1140" cy="570" r="6" fill="#60a5fa"/>
  <circle cx="60" cy="570" r="6" fill="#a78bfa"/>
</svg>`
}

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }) }

function genPseo() {
  if (!fs.existsSync(PSEO_PATH)) {
    warn('no pseo-pages.json found, skipping pSEO OG');
    return 0;
  }
  const pages = JSON.parse(fs.readFileSync(PSEO_PATH, 'utf8'));
  ensureDir(OUT_PSEO);
  let count = 0;
  for (const p of pages) {
    if (!p || !p.slug) continue;
    const title = p.h1 || p.title || p.slug;
    const subtitle = p.metaDescription || '';
    const svg = svgFor(title, subtitle);
    const out = path.join(OUT_PSEO, `${p.slug}.png`);
    try {
      sharp(Buffer.from(svg)).png({ quality: 90 }).toFile(out);
      count++;
    } catch (e) {
      warn('pseo render failed', p.slug, e && e.message);
    }
  }
  log('pSEO OG generated', count, 'at', path.relative(ROOT, OUT_PSEO));
  return count;
}

function genBlog() {
  if (!fs.existsSync(BLOG_PATH)) {
    warn('no blog-posts.json found, skipping Blog OG');
    return 0;
  }
  const posts = JSON.parse(fs.readFileSync(BLOG_PATH, 'utf8'));
  ensureDir(OUT_BLOG);
  let count = 0;
  for (const p of posts) {
    if (!p || !p.slug) continue;
    const title = p.title || p.slug;
    const subtitle = p.excerpt || '';
    const svg = svgFor(title, subtitle);
    const out = path.join(OUT_BLOG, `${p.slug}.png`);
    try {
      sharp(Buffer.from(svg)).png({ quality: 90 }).toFile(out);
      count++;
    } catch (e) {
      warn('blog render failed', p.slug, e && e.message);
    }
  }
  log('Blog OG generated', count, 'at', path.relative(ROOT, OUT_BLOG));
  return count;
}

function main() {
  const a = genPseo();
  const b = genBlog();
  // Generate a default blog index OG
  try {
    ensureDir(OUT_BLOG);
    const svg = svgFor('Pixel Art Village Blog', 'Tutorials, tips, and updates about pixel art.');
    const out = path.join(OUT_BLOG, `_index.png`);
    if (sharp) sharp(Buffer.from(svg)).png({ quality: 90 }).toFile(out);
  } catch (e) {
    warn('blog index OG render failed', e && e.message);
  }
  if (a + b === 0) warn('no OG assets generated');
}

main();
