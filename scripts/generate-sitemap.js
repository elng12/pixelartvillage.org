// Auto-generate sitemap.xml at build time with current date as lastmod
// Usage: run automatically via "prebuild" npm script
const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://pixelartvillage.org/';
const outPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');

// ISO date YYYY-MM-DD
const today = new Date();
const isoDate = today.toISOString().slice(0, 10);

const PATHS = [
  '/',
  '/privacy/',
  '/terms/',
  '/about/',
  '/contact/',
  '/blog/',
  '/blog/getting-started-pixel-art-maker/',
  '/blog/photo-to-sprite-converter-tips/',
  '/converter/png-to-pixel-art/',
  '/converter/jpg-to-pixel-art/',
  '/converter/image-to-pixel-art/',
  '/converter/gif-to-pixel-art/',
  '/converter/webp-to-pixel-art/',
  '/converter/bmp-to-pixel-art/',
  '/converter/photo-to-pixel-art/',
  '/converter/photo-to-sprite-converter/',
  '/converter/pixelate-image-online/',
  '/converter/8-bit-art-generator/',
  '/converter/retro-game-graphics-maker/',
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PATHS.map((p) => `  <url>\n    <loc>${DOMAIN.replace(/\/$/, '')}${p}</loc>\n    <lastmod>${isoDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${p === '/' ? '1.0' : '0.8'}</priority>\n  </url>`).join('\n')}
</urlset>
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, xml, 'utf8');
console.log('[sitemap] Generated', outPath, 'with lastmod =', isoDate);
