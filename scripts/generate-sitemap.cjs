// Auto-generate sitemap.xml at build time with current date as lastmod (CommonJS)
const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://pixelartvillage.org/';
const outPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');

// ISO date YYYY-MM-DD
const today = new Date();
const isoDate = today.toISOString().slice(0, 10);

const PATHS = ['/', '/privacy', '/terms', '/about', '/contact', '/blog'];
// Include blog posts from content
try {
  const posts = require('../src/content/blog-posts.json');
  for (const p of posts) {
    if (p && p.slug) PATHS.push(`/blog/${p.slug}`);
  }
} catch (e) {
  console.warn('[sitemap] warn: cannot load blog-posts.json', e && e.message);
}

// Include pSEO pages (converter/:slug)
try {
  const pseo = require('../src/content/pseo-pages.json');
  for (const p of pseo) {
    if (p && p.slug) PATHS.push(`/converter/${p.slug}`);
  }
} catch (e) {
  console.warn('[sitemap] warn: cannot load pseo-pages.json', e && e.message);
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PATHS.map((p, i) => `  <url>\n    <loc>${DOMAIN.replace(/\/$/, '')}${p}</loc>\n    <lastmod>${isoDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${p === '/' ? '1.0' : '0.8'}</priority>\n  </url>`).join('\n')}
</urlset>
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, xml, 'utf8');
console.log('[sitemap] Generated', outPath, 'with lastmod =', isoDate);
