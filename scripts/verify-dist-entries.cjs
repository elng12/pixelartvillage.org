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

[
  'social-privacy.png',
  'social-terms.png',
  'social-about.png',
  'social-contact.png',
  'social-preview.png',
  'consent-default.js',
].forEach((img) => {
  const p = path.join(DIST, img);
  if (!fs.existsSync(p)) fail(`missing ${img} in dist`);
  else ok(`found ${img}`);
});

// Guardrails for Cloudflare Pages redirects:
// - Keep /en/* canonicalization rule
// - Prevent extension-stripping rewrites that caused root static assets to 404
const redirectsPath = path.join(DIST, '_redirects');
if (!fs.existsSync(redirectsPath)) {
  fail('missing _redirects in dist');
} else {
  const redirects = fs.readFileSync(redirectsPath, 'utf8');
  if (/^\s*\/en\/\*\s+\/:splat\s+301\b/m.test(redirects)) {
    ok('_redirects includes /en/* canonical redirect');
  } else {
    fail('_redirects missing required rule: /en/* -> /:splat 301');
  }

  const dangerousRuleRegex = /^\s*\/\*\.(?:js|css|png|jpe?g|svg|webp)\s+\/:splat\s+200\b/mg;
  const dangerousRules = redirects.match(dangerousRuleRegex) || [];
  if (dangerousRules.length > 0) {
    fail(`_redirects contains dangerous extension rewrite rules: ${dangerousRules.join(' | ')}`);
  } else {
    ok('_redirects has no extension-stripping static rewrite rules');
  }
}

// -------- Route SEO checks --------
function resolveRouteFile(routePath, lang = 'en') {
  const normalized = routePath.replace(/^\//, '');
  const candidates = [path.join(DIST, normalized, 'index.html')];
  if (lang) candidates.push(path.join(DIST, lang, normalized, 'index.html'));
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  const hint = lang ? `${lang}/${normalized}` : normalized;
  fail(`route file missing: ${hint}/index.html`);
  return null;
}

function find(re, html) { const m = re.exec(html); return m && m[1] ? m[1] : null }

// 默认校验英文版路由；若 dist 根目录存在同名页面，则优先使用根目录
function verifyRoute(routePath, lang = 'en') {
  const file = resolveRouteFile(routePath, lang);
  if (!file) return;
  const html = fs.readFileSync(file, 'utf8');
  if (!html) return;
  const title = find(/<title>\s*([^<]+)\s<\/title>/i, html) || find(/<title>\s*([^<]+)<\/title>/i, html);
  if (!title) fail(`${routePath}: missing <title>`); else ok(`${routePath}: title OK`);
  const canonical = find(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i, html);
  if (!canonical) fail(`${routePath}: missing canonical`); else ok(`${routePath}: canonical OK`);
  const ogTitle = find(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i, html);
  if (!ogTitle) fail(`${routePath}: missing og:title`); else ok(`${routePath}: og:title OK`);
  const twTitle = find(/<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["'][^>]*>/i, html);
  if (!twTitle) fail(`${routePath}: missing twitter:title`); else ok(`${routePath}: twitter:title OK`);

  // For pSEO pages, ensure og:image/twitter:image exists and file is emitted
  if (routePath.startsWith('/converter/')) {
    const ogImage = find(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i, html);
    const twImage = find(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["'][^>]*>/i, html);
    if (!ogImage) fail(`${routePath}: missing og:image`); else ok(`${routePath}: og:image OK`);
    if (!twImage) fail(`${routePath}: missing twitter:image`); else ok(`${routePath}: twitter:image OK`);
    const imgPath = (ogImage || twImage || '').replace(/^https?:\/\/[^/]+/, '');
    if (imgPath) {
      const disk = path.join(DIST, imgPath.replace(/^\//, ''));
      if (!fs.existsSync(disk)) fail(`${routePath}: image not found in dist -> ${imgPath}`); else ok(`${routePath}: image found`);
    }

    const outgoingAnchors = (html.match(/<a\s[^>]*href=["'][^"']+["'][^>]*>/ig) || []).length;
    if (outgoingAnchors < 1) fail(`${routePath}: missing crawlable outgoing links in prerendered HTML`);
    else ok(`${routePath}: outgoing links OK (${outgoingAnchors})`);
  }

  // For Blog posts, ensure og:image/twitter:image exists and file is emitted
  if (routePath.startsWith('/blog/') && routePath !== '/blog') {
    const ogImage = find(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i, html);
    const twImage = find(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["'][^>]*>/i, html);
    if (!ogImage) fail(`${routePath}: missing og:image`); else ok(`${routePath}: og:image OK`);
    if (!twImage) fail(`${routePath}: missing twitter:image`); else ok(`${routePath}: twitter:image OK`);
    const imgPath = (ogImage || twImage || '').replace(/^https?:\/\/[^/]+/, '');
    if (imgPath) {
      const disk = path.join(DIST, imgPath.replace(/^\//, ''));
      if (!fs.existsSync(disk)) fail(`${routePath}: image not found in dist -> ${imgPath}`); else ok(`${routePath}: image found`);
    }
  }
}

const ROUTES = ['/privacy', '/terms', '/about', '/contact', '/blog'];
function loadJsonList(label, candidates) {
  for (const rel of candidates) {
    const filePath = path.resolve(__dirname, rel);
    if (!fs.existsSync(filePath)) continue;
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) return data;
      console.warn(`[verify-dist] warn: ${label} not an array in ${rel}`);
    } catch (e) {
      console.warn(`[verify-dist] warn: cannot parse ${rel}`, e && e.message);
    }
  }
  console.warn(`[verify-dist] warn: cannot load ${label} (no candidate found)`);
  return [];
}

const posts = loadJsonList('blog-posts', [
  '../src/content/blog-posts.json',
  '../src/content/blog-posts.en.json',
]);
for (const p of posts) {
  if (p && p.slug) ROUTES.push(`/blog/${p.slug}`);
}

const pseo = loadJsonList('pseo-pages', [
  '../src/content/pseo-pages.json',
  '../src/content/pseo-pages.en.json',
]);
for (const p of pseo) {
  if (p && p.slug) ROUTES.push(`/converter/${p.slug}`);
}

ROUTES.forEach((r) => verifyRoute(r, 'en'));

// Extra: verify blog index has image meta
try {
  verifyRoute('/blog', 'en');
  const blogIndex = resolveRouteFile('/blog', 'en');
  const html = blogIndex ? fs.readFileSync(blogIndex, 'utf8') : null;
  if (html) {
    const ogImage = /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i.exec(html);
    const twImage = /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["'][^>]*>/i.exec(html);
    if (!ogImage) fail('/blog: missing og:image'); else ok('/blog: og:image OK');
    if (!twImage) fail('/blog: missing twitter:image'); else ok('/blog: twitter:image OK');
    let imgPath = (ogImage && ogImage[1]) || (twImage && twImage[1]) || '';
    imgPath = imgPath.replace(/^https?:\/\/[^/]+/, '');
    if (imgPath) {
      const disk = path.join(DIST, imgPath.replace(/^\//, ''));
      if (!fs.existsSync(disk)) fail(`/blog: image not found in dist -> ${imgPath}`); else ok('/blog: image found');
    }
  }
} catch (e) {
  fail(`/blog: verification failed: ${e && e.message}`)
}

if (process.exitCode) {
  console.error('[verify-dist] Some checks failed.');
  process.exit(1);
} else {
  console.log('[verify-dist] All checks passed.');
}
