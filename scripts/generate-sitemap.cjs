// Auto-generate sitemap.xml at build time with current date as lastmod (CommonJS)
const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://pixelartvillage.org/';
const outPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');

// ISO date YYYY-MM-DD
const today = new Date();
const isoDate = today.toISOString().slice(0, 10);

// 默认语言使用根路径；不再生成 /en/ 版本
const BASE_PATHS = ['/', '/privacy', '/terms', '/about', '/contact', '/blog'];
const DEFAULT_LANG = 'en';
const OTHER_LANGS = ['es','id','de','pl','it','pt','fr','ru','fil','vi','ja'];
const PATHS = [];
for (const p of BASE_PATHS) {
  // 默认语言根路径（或二级路径）
  PATHS.push(p);
  for (const l of OTHER_LANGS) {
    PATHS.push(`/${l}${p === '/' ? '/' : p}`);
  }
}
// Include blog posts from content
try {
  const posts = require('../src/content/blog-posts.json');
  for (const p of posts) {
    if (p && p.slug) {
  // 默认语言：/blog/slug ；其它语言：/xx/blog/slug
  PATHS.push(`/blog/${p.slug}`);
  for (const l of OTHER_LANGS) PATHS.push(`/${l}/blog/${p.slug}`);
    }
  }
} catch (e) {
  console.warn('[sitemap] warn: cannot load blog-posts.json', e && e.message);
}

// Include pSEO pages (converter/:slug)
try {
  const pseo = require('../src/content/pseo-pages.json');
  for (const p of pseo) {
    if (p && p.slug) {
  PATHS.push(`/converter/${p.slug}`);
  for (const l of OTHER_LANGS) PATHS.push(`/${l}/converter/${p.slug}`);
    }
  }
} catch (e) {
  console.warn('[sitemap] warn: cannot load pseo-pages.json', e && e.message);
}

function withSlash(p) {
  if (!p || p === '/') return '/';
  return p.endsWith('/') ? p : p + '/';
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PATHS.map((p) => `  <url>\n    <loc>${DOMAIN.replace(/\/$/, '')}${withSlash(p)}</loc>\n    <lastmod>${isoDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${p === '/' ? '1.0' : '0.8'}</priority>\n  </url>`).join('\n')}
</urlset>
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, xml, 'utf8');
console.log('[sitemap] Generated', outPath, 'with lastmod =', isoDate);
