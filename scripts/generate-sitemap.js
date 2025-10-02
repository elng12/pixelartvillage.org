import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { langs } from './langs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.resolve(PROJECT_ROOT, 'public');
const DOMAIN = 'https://pixelartvillage.org';

const BASE_PATHS = ['/', '/privacy', '/terms', '/about', '/contact', '/blog'];

function loadJson(relativePath) {
  try {
    const filePath = path.resolve(PROJECT_ROOT, relativePath);
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.warn('[sitemap] warn: cannot load', relativePath, error?.message ?? error);
    return [];
  }
}

const blogPosts = loadJson('src/content/blog-posts.json');
const pseoPages = loadJson('src/content/pseo-pages.json');

const paths = new Set(BASE_PATHS);

for (const post of blogPosts) {
  if (post?.slug) {
    paths.add(`/blog/${post.slug}`);
  }
}

for (const page of pseoPages) {
  if (page?.slug) {
    paths.add(`/converter/${page.slug}`);
  }
}

function ensureLeadingSlash(p) {
  return p.startsWith('/') ? p : `/${p}`;
}

function ensureTrailingSlash(p) {
  if (p === '/') {
    return '/';
  }
  return p.endsWith('/') ? p : `${p}/`;
}

const today = new Date().toISOString().slice(0, 10);
const hasAlternate = langs.length > 1;
const urlsetAttributes = [
  'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  hasAlternate ? 'xmlns:xhtml="http://www.w3.org/1999/xhtml"' : null,
]
  .filter(Boolean)
  .join(' ');

const lines = [];
lines.push('<?xml version="1.0" encoding="UTF-8"?>');
lines.push(`<urlset ${urlsetAttributes}>`);

for (const rawPath of paths) {
  const normalized = ensureTrailingSlash(ensureLeadingSlash(rawPath));
  const loc = `${DOMAIN}${normalized}`;
  lines.push('  <url>');
  lines.push(`    <loc>${loc}</loc>`);
  lines.push(`    <lastmod>${today}</lastmod>`);
  lines.push('    <changefreq>weekly</changefreq>');
  lines.push(`    <priority>${normalized === '/' ? '1.0' : '0.8'}</priority>`);
  if (hasAlternate) {
    for (const lang of langs) {
      const prefix = lang.code === langs[0].code ? '' : `/${lang.code}`;
      const href = `${DOMAIN}${prefix}${normalized}`;
      lines.push(
        `    <xhtml:link rel="alternate" hreflang="${lang.code}" href="${href}" />`
      );
    }
  }
  lines.push('  </url>');
}

lines.push('</urlset>');

fs.mkdirSync(PUBLIC_DIR, { recursive: true });
const outputPath = path.resolve(PUBLIC_DIR, 'sitemap.xml');
fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');
console.log(`[sitemap] Generated ${outputPath} with lastmod = ${today}`);
