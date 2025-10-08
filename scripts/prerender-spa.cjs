#!/usr/bin/env node
// Minimal prerender: clone dist/index.html into route-specific HTML with route meta
// Focus on stable SEO meta（title/canonical/OG/Twitter）for crawlers and social cards.
const fs = require('fs')
const path = require('path')

const ROOT = process.cwd()
const DIST = path.join(ROOT, 'dist')
const INDEX = path.join(DIST, 'index.html')
// 单语言站点：仅保留英文规范路径
const DEFAULT_LANG = 'en'

function read(file) { return fs.readFileSync(file, 'utf8') }
function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content, 'utf8')
}

function replaceTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
}

function upsertCanonical(html, href) {
  if (html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)) {
    return html.replace(/<link[^>]+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${href}">`)
  }
  return html.replace(/<\/head>/i, `  <link rel="canonical" href="${href}">\n</head>`)
}

function setHtmlLang(html, lang) {
  if (!lang) return html
  if (/<html[^>]*lang=/.test(html)) {
    return html.replace(/<html([^>]*?)lang=["'][^"']*["']([^>]*)>/i, `<html$1lang="${lang}"$2>`)
  }
  return html.replace(/<html\b/i, `<html lang="${lang}"`)
}

function stripOgTwitter(html) {
  return html
    .replace(/\n?\s*<meta[^>]+property=["']og:[^>]*>\s*/ig, '')
    .replace(/\n?\s*<meta[^>]+name=["']twitter:[^>]*>\s*/ig, '')
}

function stripMetaDescription(html) {
  return html.replace(/\n?\s*<meta[^>]+name=["']description["'][^>]*>\s*/ig, '')
}

function stripJsonLdTypes(html, types = []) {
  if (!types.length) return html
  return html.replace(/<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/ig, (m) => {
    try {
      const jsonText = m.replace(/^[\s\S]*?<script[^>]*>/i, '').replace(/<\/script>[\s\S]*$/i, '')
      const parsed = JSON.parse(jsonText)
      const typesFound = Array.isArray(parsed) ? parsed.flatMap(x => x && x['@type']) : [parsed && parsed['@type']]
      const has = (Array.isArray(typesFound) ? typesFound : [typesFound]).some(v => v && types.includes(v))
      return has ? '' : m
    } catch {
      return m
    }
  })
}

function injectMeta(html, metas) {
  const tags = metas.map((m) => {
    if (m?.property) return `<meta property="${m.property}" content="${m.content}">`
    if (m?.name) return `<meta name="${m.name}" content="${m.content}">`
    return ''
  }).join('\n  ')
  return html.replace(/<\/head>/i, `  ${tags}\n</head>`)
}

function injectHreflang(html, routePath) {
  const ABS = (p) => `https://pixelartvillage.org${p}`
  const ensure = (p) => (p.endsWith('/') ? p : `${p}/`)
  const canonicalHref = ABS(ensure(routePath))
  const alternates = [
    `<link rel="alternate" hreflang="en" href="${canonicalHref}">`,
    `<link rel="alternate" hreflang="x-default" href="${canonicalHref}">`,
  ].join('\n  ')
  if (html.match(/<link[^>]+rel=["']alternate["'][^>]*hreflang/i)) {
    html = html.replace(/\n?\s*<link[^>]+rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*>\s*/ig, '')
  }
  return html.replace(/<\/head>/i, `  ${alternates}\n</head>`)
}

function buildHtml(base, { title, canonical, metas, lang, routePath }) {
  let html = base
  if (title) html = replaceTitle(html, title)
  if (canonical) html = upsertCanonical(html, canonical)
  html = stripOgTwitter(html)
  html = stripMetaDescription(html)
  if (lang) html = setHtmlLang(html, lang)
  html = stripJsonLdTypes(html, ['FAQPage'])
  html = html.replace(/\n?\s*<div[^>]+data-prerender-seo[\s\S]*?<\/div>\s*/i, '')
  if (metas?.length) html = injectMeta(html, metas)
  if (routePath) html = injectHreflang(html, ensureTrailingSlash(routePath))
  return html
}

function ensureTrailingSlash(p) {
  if (!p || p === '/') return '/'
  return p.endsWith('/') ? p : `${p}/`
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function injectHiddenH1AndNav(html, { h1, description, links = [], extras = '' }) {
  const navLinks = links.map((l) => `<li><a href="${l.href}">${escapeHtml(l.text)}</a></li>`).join('')
  const headingLine = h1 ? `<p><strong>${escapeHtml(h1)}</strong></p>` : ''
  const descLine = description ? `<p>${escapeHtml(description)}</p>` : ''
  const navBlock = links.length ? `<nav><ul>${navLinks}</ul></nav>` : ''
  const snippet = `
    <div data-prerender-seo aria-hidden="true" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;">
      <main>
        ${headingLine}
        ${descLine}
        ${navBlock}
        ${extras || ''}
      </main>
    </div>
  `.replace(/\s+$/gm, '')
  return html.replace(/<\/body>/i, `${snippet}\n\n</body>`)
}

function prerender() {
  if (!fs.existsSync(DIST)) throw new Error('dist not found')
  const base = read(INDEX)
  const ABS = (p) => `https://pixelartvillage.org${p}`

  const renderBlogIndex = (list = []) => {
    if (!Array.isArray(list) || !list.length) return ''
    const items = list
      .map((item) => {
        if (!item || !item.slug) return ''
        const url = ABS(ensureTrailingSlash(`/blog/${item.slug}`))
        const title = escapeHtml(item.title || '')
        const date = item.date ? `<p class="date">${escapeHtml(item.date)}</p>` : ''
        const excerpt = item.excerpt ? `<p class="excerpt">${escapeHtml(item.excerpt)}</p>` : ''
        return `<li><a href="${url}">${title}</a>${date}${excerpt}</li>`
      })
      .filter(Boolean)
      .join('')
    if (!items) return ''
    return `<section aria-label="Blog articles"><h2>Latest Posts</h2><ul>${items}</ul></section>`
  }

  const renderBlogArticle = (post) => {
    if (!post) return ''
    const title = escapeHtml(post.title || '')
    const date = post.date ? `<p class="date">${escapeHtml(post.date)}</p>` : ''
    const tags = Array.isArray(post.tags) && post.tags.length
      ? `<ul class="tags">${post.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join('')}</ul>`
      : ''
    const paragraphs = Array.isArray(post.body)
      ? post.body.filter((para) => typeof para === 'string' && para.trim())
      : []
    const body = paragraphs.length
      ? paragraphs.map((para) => `<p>${escapeHtml(para)}</p>`).join('')
      : ''
    return `<article><header><h2>${title}</h2>${date}${tags}</header>${body}</article>`
  }

  let posts = []
  try { posts = require('../src/content/blog-posts.json') } catch {}
  const blogIndexExtras = renderBlogIndex(posts)

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
    ], extras: blogIndexExtras },
  ]

  try {
    const pseo = require('../src/content/pseo-pages.json')
    for (const p of pseo) {
      if (!p || !p.slug) continue
      const url = ensureTrailingSlash(`/converter/${p.slug}`)
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
      })
    }
  } catch (e) {
    console.warn('[prerender] warn: cannot load pseo-pages.json', e && e.message)
  }

  for (const p of posts) {
    if (!p || !p.slug) continue
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
      extras: renderBlogArticle(p),
    })
  }

  const expanded = routes.map((r) => ({
    lang: DEFAULT_LANG,
    path: ensureTrailingSlash(r.path),
    routePath: r.path,
    title: r.title,
    metas: r.metas,
    extras: r.extras || '',
    links: r.links || null,
  }))

  for (const r of expanded) {
    const canonicalPath = (r.routePath === '/' ? '/' : ensureTrailingSlash(r.routePath))
    let out = buildHtml(base, {
      title: r.title,
      canonical: ABS(canonicalPath),
      metas: r.metas,
      lang: r.lang,
      routePath: r.routePath,
    })

    const defaultLinks = [
      { href: ABS('/'), text: 'Home' },
      { href: ABS('/about/'), text: 'About' },
      { href: ABS('/contact/'), text: 'Contact' },
      { href: ABS('/privacy/'), text: 'Privacy' },
      { href: ABS('/terms/'), text: 'Terms' },
      { href: ABS('/blog/'), text: 'Blog' },
    ]
    let h1Text = r.title.replace(/\s*\|\s*Pixel Art Village$/, '').replace(/\bpixel art\b/gi, 'retro graphics')
    const rawDesc = (r.metas.find(m => m.name === 'description') || {}).content || ''
    const descMeta = rawDesc
      .replace(/Pixel Art Village/g, 'PAV')
      .replace(/\bpixel art\b/gi, 'retro graphics')
      .replace(/\bpixel\b/gi, 'grid')
      .replace(/\bart\b/gi, 'design')

    let extras = r.extras || ''
    const addExtras = (html) => {
      extras = extras ? `${extras}${html}` : html
    }
    const pathKey = (r.routePath || '/').toLowerCase()
    if (/^\/converter\//.test(pathKey)) {
      addExtras('<p>Palette control, palette limits, palette preview – manage palettes precisely.</p>')
      addExtras('<p>image workflow and image formats.</p>')
    } else if (/^\/blog\//.test(pathKey)) {
      addExtras('<p>Tips on choosing the right palette, palette examples, and image handling for your style.</p>')
    } else if (/^\/(privacy|terms|about|contact)\//.test(pathKey)) {
      addExtras('<p>Reference palette guidelines for creators.</p>')
    } else if (r.path === '/') {
      addExtras('<p>Explore our palette overview and palette chooser for quick starts.</p>')
    }

    const navLinks = r.links && r.links.length ? r.links : defaultLinks
    out = injectHiddenH1AndNav(out, { h1: h1Text, description: descMeta, links: navLinks, extras })

    const file = path.join(DIST, r.path.replace(/^\//, '').replace(/\/$/, ''), 'index.html')
    write(file, out)
    console.log('[prerender]', r.path, '→', path.relative(DIST, file))
  }
}

try {
  prerender()
  console.log('[prerender] done')
} catch (e) {
  console.error('[prerender] failed:', e && e.stack || e)
  process.exit(1)
}
