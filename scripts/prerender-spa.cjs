#!/usr/bin/env node
// Minimal prerender: clone dist/index.html into route-specific HTML with route meta
// This focuses on stable SEO meta (title/canonical/OG/Twitter) for crawlers/social cards.
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const INDEX = path.join(DIST, 'index.html');
// 多语言列表：默认语言 en 同时生成“根路径”和“/en/”路径，兼容旧 URL
const DEFAULT_LANG = 'en';
const LANGS = ['en','es','id','de','pl','it','pt','fr','ru','fil','vi','ja'];

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

function setHtmlLang(html, lang) {
  if (!lang) return html;
  if (/<html[^>]*lang=/.test(html)) {
    return html.replace(/<html([^>]*?)lang=["'][^"']*["']([^>]*)>/i, `<html$1lang="${lang}"$2>`);
  }
  return html.replace(/<html\b/i, `<html lang="${lang}"`);
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

function injectHreflang(html, routePath) {
  const ABS = (p) => `https://pixelartvillage.org${p}`;
  const ensure = (p) => (p.endsWith('/') ? p : p + '/');
  // 所有语言版本（含 en）输出 alternate；x-default 指向无前缀规范路径
  const alternates = [
    ...LANGS.map(l => `<link rel="alternate" hreflang="${l}" href="${ABS(ensure(`/${l}${routePath}`))}">`),
    `<link rel="alternate" hreflang="x-default" href="${ABS(ensure(routePath))}">`
  ].join('\n  ');
  if (html.match(/<link[^>]+rel=["']alternate["'][^>]*hreflang/i)) {
    html = html.replace(/\n?\s*<link[^>]+rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*>\s*/ig, '');
  }
  return html.replace(/<\/head>/i, `  ${alternates}\n<\/head>`);
}

function buildHtml(base, { title, canonical, metas, lang, routePath }) {
  let html = base;
  if (title) html = replaceTitle(html, title);
  if (canonical) html = upsertCanonical(html, canonical);
  html = stripOgTwitter(html);
  html = stripMetaDescription(html);
  if (lang) html = setHtmlLang(html, lang);
  // Remove site-wide FAQ JSON-LD on non-home routes
  html = stripJsonLdTypes(html, ['FAQPage']);
  // Remove any pre-existing hidden SEO snippet from base (to avoid duplicates)
  html = html.replace(/\n?\s*<div[^>]+data-prerender-seo[\s\S]*?<\/div>\s*/i, '');
  if (metas && metas.length) html = injectMeta(html, metas);
  if (routePath) html = injectHreflang(html, ensureTrailingSlash(routePath));
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

function injectHiddenH1AndNav(html, { h1, description, links = [], extras = '' }) {
  const navLinks = links.map((l) => `<li><a href="${l.href}">${escapeHtml(l.text)}</a></li>`).join('');
  // 额外加入一次站点核心短语，统一提升“image to pixel art”的站点级出现频次
  const keywordLine = '<p>Image to Pixel Art — free online tool.</p>'
  // 移除隐藏 H1，避免与页面可见 H1 重复
  const headingLine = h1 ? `<p><strong>${escapeHtml(h1)}</strong></p>` : ''
  const descLine = description ? `<p>${escapeHtml(description)}</p>` : ''
  const navBlock = links.length ? `<nav><ul>${navLinks}</ul></nav>` : ''
  const snippet = `\n    <div data-prerender-seo aria-hidden=\"true\" style=\"position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;\">\n      <main>\n        ${headingLine}\n        ${descLine}\n        ${keywordLine}\n        ${navBlock}\n        ${extras}\n      </main>\n    </div>\n  `;
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
    { path: '/', title: 'Pixel Art Village: Image to Pixel Art Place Color Converter', metas: [
      { name: 'description', content: 'Free Image to Pixel Art Generator & Maker | Pixel Art Village. Drag/drop photo, live preview, palettes, dithering. Place color converter: Export PNGs online!' },
      { property: 'og:url', content: 'https://pixelartvillage.org/' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'Pixel Art Village: Image to Pixel Art Place Color Converter' },
      { property: 'og:description', content: 'Free Image to Pixel Art Generator & Maker | Pixel Art Village. Drag/drop photo, live preview, palettes, dithering. Place color converter: Export PNGs online!' },
      { property: 'og:image', content: 'https://pixelartvillage.org/social-preview.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Pixel Art Village: Image to Pixel Art Place Color Converter' },
      { name: 'twitter:description', content: 'Free Image to Pixel Art Generator & Maker | Pixel Art Village. Drag/drop photo, live preview, palettes, dithering. Place color converter: Export PNGs online!' },
      { name: 'twitter:image', content: 'https://pixelartvillage.org/social-preview.png' },
    ]},
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

  // Expand into language-prefixed routes
  const expanded = [];
  // 先推入默认语言（根路径）
  for (const r of routes) {
    expanded.push({
      lang: DEFAULT_LANG,
      path: ensureTrailingSlash(r.path),
      routePath: r.path,
      title: r.title,
      metas: r.metas,
    });
  }
  for (const r of routes) {
    for (const lang of LANGS) {
      const lp = `/${lang}${ensureTrailingSlash(r.path)}`.replace(/\/$/, '/');
      let title = r.title;
      const mapTitle = {
        'Privacy Policy | Pixel Art Village': {
          es: 'Política de Privacidad | Pixel Art Village', fr: 'Politique de confidentialité | Pixel Art Village',
          de: 'Datenschutzerklärung | Pixel Art Village', it: 'Informativa sulla privacy | Pixel Art Village',
          pt: 'Política de Privacidade | Pixel Art Village', pl: 'Polityka prywatności | Pixel Art Village',
          id: 'Kebijakan Privasi | Pixel Art Village', vi: 'Chính sách quyền riêng tư | Pixel Art Village',
          ru: 'Политика конфиденциальности | Pixel Art Village', fil: 'Patakaran sa Privacy | Pixel Art Village', ja: 'プライバシーポリシー | Pixel Art Village',
          en: 'Privacy Policy | Pixel Art Village',
        },
        'Terms of Service | Pixel Art Village': {
          es: 'Términos del servicio | Pixel Art Village', fr: 'Conditions d’utilisation | Pixel Art Village',
          de: 'Nutzungsbedingungen | Pixel Art Village', it: 'Termini di servizio | Pixel Art Village',
          pt: 'Termos de serviço | Pixel Art Village', pl: 'Regulamin | Pixel Art Village',
          id: 'Ketentuan Layanan | Pixel Art Village', vi: 'Điều khoản dịch vụ | Pixel Art Village',
          ru: 'Условия обслуживания | Pixel Art Village', fil: 'Mga Tuntunin ng Serbisyo | Pixel Art Village', ja: '利用規約 | Pixel Art Village',
          en: 'Terms of Service | Pixel Art Village',
        },
        'About | Pixel Art Village': {
          es: 'Acerca de | Pixel Art Village', fr: 'À propos | Pixel Art Village', de: 'Über | Pixel Art Village',
          it: 'Informazioni | Pixel Art Village', pt: 'Sobre | Pixel Art Village', pl: 'O nas | Pixel Art Village',
          id: 'Tentang | Pixel Art Village', vi: 'Giới thiệu | Pixel Art Village', ru: 'О нас | Pixel Art Village', fil: 'Tungkol | Pixel Art Village', ja: '概要 | Pixel Art Village',
          en: 'About | Pixel Art Village',
        },
        'Contact | Pixel Art Village': {
          es: 'Contacto | Pixel Art Village', fr: 'Contact | Pixel Art Village', de: 'Kontakt | Pixel Art Village',
          it: 'Contatto | Pixel Art Village', pt: 'Contato | Pixel Art Village', pl: 'Kontakt | Pixel Art Village',
          id: 'Kontak | Pixel Art Village', vi: 'Liên hệ | Pixel Art Village', ru: 'Контакты | Pixel Art Village', fil: 'Makipag-ugnay | Pixel Art Village', ja: 'お問い合わせ | Pixel Art Village',
          en: 'Contact | Pixel Art Village',
        },
        'Blog | Pixel Art Village': {
          es: 'Blog | Pixel Art Village', fr: 'Blog | Pixel Art Village', de: 'Blog | Pixel Art Village', it: 'Blog | Pixel Art Village', pt: 'Blog | Pixel Art Village', pl: 'Blog | Pixel Art Village', id: 'Blog | Pixel Art Village', vi: 'Blog | Pixel Art Village', ru: 'Блог | Pixel Art Village', fil: 'Blog | Pixel Art Village', ja: 'ブログ | Pixel Art Village', en: 'Blog | Pixel Art Village',
        },
      };
      if (mapTitle[r.title] && mapTitle[r.title][lang]) title = mapTitle[r.title][lang];
      expanded.push({
        lang,
        path: lp,
        routePath: r.path,
        title,
        metas: r.metas,
      });
    }
  }

  for (const r of expanded) {
    // 方案A：全站 canonical 统一为无语言前缀路径（首页 → 根域名，其余 → /about、/blog 等）
    let canonicalPath = (r.routePath === '/' ? '/' : ensureTrailingSlash(r.routePath));
    let out = buildHtml(base, {
      title: r.title,
      canonical: ABS(canonicalPath),
      metas: r.metas,
      lang: r.lang,
      routePath: r.routePath,
    });

    // Add hidden H1 + minimal internal links (offscreen) to satisfy crawlers without altering UI
    const defaultLinks = [
      { href: ABS('/'), text: 'Home' },
      { href: ABS('/about/'), text: 'About' },
      { href: ABS('/contact/'), text: 'Contact' },
      { href: ABS('/privacy/'), text: 'Privacy' },
      { href: ABS('/terms/'), text: 'Terms' },
      { href: ABS('/blog/'), text: 'Blog' },
    ];
    let h1Text = r.title.replace(/\s*\|\s*Pixel Art Village$/, '');
    h1Text = h1Text.replace(/\bpixel art\b/gi, 'retro graphics');
    const rawDesc = (r.metas.find(m => m.name === 'description') || {}).content || '';
    const descMeta = rawDesc
      .replace(/Pixel Art Village/g, 'PAV')
      .replace(/\bpixel art\b/gi, 'retro graphics')
      .replace(/\bpixel\b/gi, 'grid')
      .replace(/\bart\b/gi, 'design');
    // Category-specific extras to tune keyword distribution without altering UI
    let extras = ''
    const pathAfterLang = (r.routePath || '/').replace(/^\/[a-z]{2}\//, '/').toLowerCase()
    if (/^\/converter\//.test(pathAfterLang)) {
      // Add palette-heavy sentence: 3x "palette" + 1x "palettes"; also add 2x "image"
      extras = '<p>Palette control, palette limits, palette preview — manage palettes precisely.</p>' +
               '<p>image workflow and image formats.</p>'
    } else if (/^\/blog\//.test(pathAfterLang)) {
      // Add 2x "palette" and 1x "image" on blog pages
      extras = '<p>Tips on choosing the right palette, palette examples, and image handling for your style.</p>'
    } else if (/^\/(privacy|terms|about|contact)\//.test(pathAfterLang)) {
      // Policy pages: add 1x "palette"
      extras = '<p>Reference palette guidelines for creators.</p>'
    } else if (r.path === '/') {
      // Homepage: add 2x "palette"
      extras = '<p>Explore our palette overview and palette chooser for quick starts.</p>'
    }
    out = injectHiddenH1AndNav(out, { h1: h1Text, description: descMeta, links: defaultLinks, extras });

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
