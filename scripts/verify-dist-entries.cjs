#!/usr/bin/env node
// Post-build verification for SPA:
// - index.html includes built assets
// - 404.html exists (GitHub Pages SPA fallback)
// - Social images exist
// - Route pages (privacy/terms/about/contact/blog and blog posts) contain SEO-critical tags
const fs = require('fs');
const path = require('path');

const DIST = path.resolve(process.cwd(), 'dist');
const REQUIRED_FILES = ['index.html', '404.html'];

function fail(msg) {
  console.error('[verify-dist] FAIL:', msg);
  process.exitCode = 1;
}

function ok(msg) {
  console.log('[verify-dist] OK  :', msg);
}

if (!fs.existsSync(DIST)) {
  fail('dist directory not found');
  process.exit(1);
}

for (const f of REQUIRED_FILES) {
  const p = path.join(DIST, f);
  if (!fs.existsSync(p)) {
    fail(`${f} not found in dist`);
    continue;
  }
  const html = fs.readFileSync(p, 'utf8');
  if (f === 'index.html') {
    const hasModuleScript = /<script[^>]*type="module"[^>]*src="\/assets\/[^"]+\.js"/i.test(html);
    const hasCss = /<link[^>]*href="\/assets\/[^"]+\.css"/i.test(html);
    if (!hasModuleScript) fail('index.html missing built module script reference');
    if (!hasCss) fail('index.html missing built css reference');
    if (hasModuleScript && hasCss) ok('index.html includes assets');
  } else {
    ok(`${f} present`);
  }
}

['social-privacy.png', 'social-terms.png', 'social-about.png', 'social-contact.png'].forEach((img) => {
  const p = path.join(DIST, img);
  if (!fs.existsSync(p)) fail(`missing ${img} in dist`);
  else ok(`found ${img}`);
});

// -------- Route SEO checks --------
function readHtml(p) {
  if (!fs.existsSync(p)) { fail(`route file missing: ${path.relative(DIST, p)}`); return null }
  return fs.readFileSync(p, 'utf8');
}

function find(re, html) { const m = re.exec(html); return m && m[1] ? m[1] : null }

function verifyRoute(routePath) {
  const file = path.join(DIST, routePath.replace(/^\//, ''), 'index.html');
  const html = readHtml(file);
  if (!html) return;
  const title = find(/<title>\s*([^<]+)\s<\/title>/i, html) || find(/<title>\s*([^<]+)<\/title>/i, html);
  if (!title) fail(`${routePath}: missing <title>`); else ok(`${routePath}: title OK`);
  const canonical = find(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i, html);
  if (!canonical) fail(`${routePath}: missing canonical`); else ok(`${routePath}: canonical OK`);
  const ogTitle = find(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i, html);
  if (!ogTitle) fail(`${routePath}: missing og:title`); else ok(`${routePath}: og:title OK`);
  const twTitle = find(/<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["'][^>]*>/i, html);
  if (!twTitle) fail(`${routePath}: missing twitter:title`); else ok(`${routePath}: twitter:title OK`);
}

const ROUTES = ['/privacy', '/terms', '/about', '/contact', '/blog'];
try {
  const posts = require('../src/content/blog-posts.json');
  for (const p of posts) {
    if (p && p.slug) ROUTES.push(`/blog/${p.slug}`);
  }
} catch (e) {
  console.warn('[verify-dist] warn: cannot load blog-posts.json', e && e.message);
}

ROUTES.forEach(verifyRoute);

if (process.exitCode) {
  console.error('[verify-dist] Some checks failed.');
  process.exit(1);
} else {
  console.log('[verify-dist] All checks passed.');
}
