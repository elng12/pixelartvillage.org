#!/usr/bin/env node
// Minimal prerender: clone dist/index.html into route-specific HTML with route meta
// This focuses on stable SEO meta (title/canonical/OG/Twitter) for crawlers/social cards.
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const INDEX = path.join(DIST, 'index.html');

function read(file) { return fs.readFileSync(file, 'utf8'); }
function write(file, content) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content, 'utf8'); }

function replaceTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
}

function upsertCanonical(html, href) {
  if (html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)) {
    return html.replace(/<link[^>]+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${href}">`);
  }
  return html.replace(/<\/head>/i, `  <link rel="canonical" href="${href}">\n</head>`);
}

function stripOgTwitter(html) {
  return html
    .replace(/\n?\s*<meta[^>]+property=["']og:[^>]*>\s*/ig, '')
    .replace(/\n?\s*<meta[^>]+name=["']twitter:[^>]*>\s*/ig, '');
}

// Remove all meta description(s) so each page injects at most one
function stripMetaDescription(html) {
  return html.replace(/\n?\s*<meta[^>]+name=["']description["'][^>]*>\s*/ig, '');
}

// Remove JSON-LD blocks by @type (e.g., FAQPage) to avoid rich result errors on pages without visible FAQ
function stripJsonLdTypes(html, types = []) {
  if (!types.length) return html;
  return html.replace(/<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/ig, (m) => {
    try {
      const jsonText = m.replace(/^[\s\S]*?<script[^>]*>/i, '').replace(/<\/script>[\s\S]*$/i, '');
      const j = JSON.parse(jsonText);
      const typesFound = Array.isArray(j) ? j.flatMap(x => x && x['@type']) : [j && j['@type']];
      const has = (Array.isArray(typesFound) ? typesFound : [typesFound]).some(v => v && types.includes(v));
      return has ? '' : m;
    } catch {
      return m;
    }
  });
}

function injectMeta(html, metas) {
  const tags = metas.map((m) => {
    if (m.property) return `<meta property="${m.property}" content="${m.content}">`;
    if (m.name) return `<meta name="${m.name}" content="${m.content}">`;
    return '';
  }).join('\n  ');
  return html.replace(/<\/head>/i, `  ${tags}\n</head>`);
}

function buildHtml(base, { title, canonical, metas }) {
  let html = base;
  if (title) html = replaceTitle(html, title);
  if (canonical) html = upsertCanonical(html, canonical);
  html = stripOgTwitter(html);
  html = stripMetaDescription(html);
  // Remove site-wide FAQ JSON-LD on non-home routes
  html = stripJsonLdTypes(html, ['FAQPage']);
  // Remove any pre-existing hidden SEO snippet from base (to avoid duplicates)
  html = html.replace(/\n?\s*<div[^>]+data-prerender-seo[\s\S]*?<\/div>\s*/i, '');
  if (metas && metas.length) html = injectMeta(html, metas);
  return html;
}

function ensureTrailingSlash(p) {
  if (!p || p === '/') return '/';
  return p.endsWith('/') ? p : p + '/';
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function injectHiddenH1AndNav(html, { h1, description, links = [] }) {
  const navLinks = links.map((l) => `<li><a href="${l.href}">${escapeHtml(l.text)}</a></li>`).join('');
  const snippet = `\n    <div data-prerender-seo aria-hidden="true" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;">\n      <main>\n        ${h1 ? `<h1>${escapeHtml(h1)}</h1>` : ''}\n        ${description ? `<p>${escapeHtml(description)}</p>` : ''}\n        ${links.length ? `<nav><ul>${navLinks}</ul></nav>` : ''}\n      </main>\n    </div>\n  `;
  if (html.includes('<div id="root"></div>')) {
    return html.replace('<div id="root"></div>', `<div id="root"></div>${snippet}`);
  }
  return html.replace(/<\/body>/i, `${snippet}</body>`);
}

function prerender() {
  if (!fs.existsSync(DIST)) throw new Error('dist not found');
  const base = read(INDEX);

  const ABS = (p) => `https://pixelartvillage.org${p}`;

  const routes = [
    { path: '/privacy', title: 'Privacy Policy | Pixel Art Village', metas: [
      { name: 'description', content: 'Pixel Art Village privacy policy: local image processing, AdSense cookies, partners, choices and rights.' },
      { property: 'og:url', content: ABS(ensureTrailingSlash('/privacy')) },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'Privacy Policy | Pixel Art Village' },
      { property: 'og:description', content: 'Pixel Art Village privacy policy: local image processing, AdSense cookies, partners, choices and rights.' },
      { property: 'og:image', content: ABS('/social-privacy.png') },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Privacy Policy | Pixel Art Village' },
      { name: 'twitter:description', content: 'Pixel Art Village privacy policy: local image processing, AdSense cookies, partners, choices and rights.' },
      { name: 'twitter:image', content: ABS('/social-privacy.png') },
    ]},
    { path: '/terms', title: 'Terms of Service | Pixel Art Village', metas: [
      { name: 'description', content: 'Usage rules, responsibilities, disclaimer, IP, governing law, contact info.' },
      { property: 'og:url', content: ABS(ensureTrailingSlash('/terms')) },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'Terms of Service | Pixel Art Village' },
      { property: 'og:description', content: 'Usage rules, responsibilities, disclaimer, IP, governing law, contact info.' },
      { property: 'og:image', content: ABS('/social-terms.png') },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Terms of Service | Pixel Art Village' },
      { name: 'twitter:description', content: 'Usage rules, responsibilities, disclaimer, IP, governing law, contact info.' },
      { name: 'twitter:image', content: ABS('/social-terms.png') },
    ]},
    { path: '/about', title: 'About | Pixel Art Village', metas: [
      { name: 'description', content: 'A free, browser‑based pixel art maker & converter. Privacy‑first, fast, and accessible.' },
      { property: 'og:url', content: ABS(ensureTrailingSlash('/about')) },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'About | Pixel Art Village' },
      { property: 'og:description', content: 'A free, browser‑based pixel art maker & converter. Privacy‑first, fast, and accessible.' },
      { property: 'og:image', content: ABS('/social-about.png') },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'About | Pixel Art Village' },
      { name: 'twitter:description', content: 'A free, browser‑based pixel art maker & converter. Privacy‑first, fast, and accessible.' },
      { name: 'twitter:image', content: ABS('/social-about.png') },
    ]},
    { path: '/contact', title: 'Contact | Pixel Art Village', metas: [
      { name: 'description', content: 'Support, feedback, partnerships. Email 2296744453m@gmail.com.' },
      { property: 'og:url', content: ABS(ensureTrailingSlash('/contact')) },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'Contact | Pixel Art Village' },
      { property: 'og:description', content: 'Support, feedback, partnerships. Email 2296744453m@gmail.com.' },
      { property: 'og:image', content: ABS('/social-contact.png') },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Contact | Pixel Art Village' },
      { name: 'twitter:description', content: 'Support, feedback, partnerships. Email 2296744453m@gmail.com.' },
      { name: 'twitter:image', content: ABS('/social-contact.png') },
    ]},
    { path: '/blog', title: 'Blog | Pixel Art Village', metas: [
      { name: 'description', content: 'Articles and updates about making pixel art, tips, and features.' },
      { property: 'og:url', content: ABS(ensureTrailingSlash('/blog')) },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'Blog | Pixel Art Village' },
      { property: 'og:description', content: 'Articles and updates about making pixel art, tips, and features.' },
      { property: 'og:image', content: ABS('/blog-og/_index.png') },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'Blog | Pixel Art Village' },
      { name: 'twitter:description', content: 'Articles and updates about making pixel art, tips, and features.' },
      { name: 'twitter:image', content: ABS('/blog-og/_index.png') },
    ]},
  ];

  // pSEO pages (converter/:slug)
  try {
    const pseo = require('../src/content/pseo-pages.json');
    for (const p of pseo) {
      if (!p || !p.slug) continue;
      const url = ensureTrailingSlash(`/converter/${p.slug}`);
      routes.push({
        path: url,
        title: p.title,
        metas: [
          { name: 'description', content: p.metaDescription || '' },
          { property: 'og:url', content: ABS(url) },
          { property: 'og:type', content: 'website' },
          { property: 'og:title', content: p.title },
          { property: 'og:description', content: p.metaDescription || '' },
          { property: 'og:image', content: ABS(`/pseo-og/${p.slug}.png`) },
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:title', content: p.title },
          { name: 'twitter:description', content: p.metaDescription || '' },
          { name: 'twitter:image', content: ABS(`/pseo-og/${p.slug}.png`) },
        ],
      });
    }
  } catch (e) {
    console.warn('[prerender] warn: cannot load pseo-pages.json', e && e.message);
  }

  // Blog posts
  let posts = [];
  try { posts = require('../src/content/blog-posts.json'); } catch {}
  for (const p of posts) {
    if (!p || !p.slug) continue;
    routes.push({
      path: ensureTrailingSlash(`/blog/${p.slug}`),
      title: `${p.title} | Pixel Art Village`,
      metas: [
        { name: 'description', content: p.excerpt || '' },
        { property: 'og:url', content: ABS(ensureTrailingSlash(`/blog/${p.slug}`)) },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: `${p.title} | Pixel Art Village` },
        { property: 'og:description', content: p.excerpt || '' },
        { property: 'og:image', content: ABS(`/blog-og/${p.slug}.png`) },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: `${p.title} | Pixel Art Village` },
        { name: 'twitter:description', content: p.excerpt || '' },
        { name: 'twitter:image', content: ABS(`/blog-og/${p.slug}.png`) },
      ],
    });
  }

  for (const r of routes) {
    let out = buildHtml(base, { title: r.title, canonical: ABS(ensureTrailingSlash(r.path)), metas: r.metas });

    // Add hidden H1 + minimal internal links (offscreen) to satisfy crawlers without altering UI
    const defaultLinks = [
      { href: ABS('/'), text: 'Home' },
      { href: ABS('/about/'), text: 'About' },
      { href: ABS('/contact/'), text: 'Contact' },
      { href: ABS('/privacy/'), text: 'Privacy' },
      { href: ABS('/terms/'), text: 'Terms' },
      { href: ABS('/blog/'), text: 'Blog' },
    ];
    const h1Text = r.title.replace(/\s*\|\s*Pixel Art Village$/, '');
    const descMeta = (r.metas.find(m => m.name === 'description') || {}).content || '';
    out = injectHiddenH1AndNav(out, { h1: h1Text, description: descMeta, links: defaultLinks });

    const file = path.join(DIST, r.path.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
    write(file, out);
    console.log('[prerender]', r.path, '→', path.relative(DIST, file));
  }
}

try {
  prerender();
  console.log('[prerender] done');
} catch (e) {
  console.error('[prerender] failed:', e && e.stack || e);
  process.exit(1);
}
