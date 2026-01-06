#!/usr/bin/env node
// Minimal prerender: clone dist/index.html into route-specific HTML with route meta
// Focus on stable SEO meta（title/canonical/OG/Twitter）for crawlers and social cards.
const fs = require('fs')
const path = require('path')

const ROOT = process.cwd()
const DIST = path.join(ROOT, 'dist')
const INDEX = path.join(DIST, 'index.html')
const localeConfig = require(path.join(ROOT, 'config', 'locales.json'))
const DEFAULT_LANG = (localeConfig && localeConfig.default) || 'en'
const SUPPORTED_LANGS = Array.from(new Set(((localeConfig && localeConfig.supported) || ['en']).filter(Boolean)))

function resolveContent(baseName) {
  const paths = [
    path.join(ROOT, 'src', 'content', `${baseName}.en.json`),
    path.join(ROOT, 'src', 'content', `${baseName}.json`),
  ]
  for (const filePath of paths) {
    if (fs.existsSync(filePath)) {
      try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'))
      } catch (error) {
        console.warn(`[prerender] warn: failed to parse ${path.basename(filePath)} -> ${error.message}`)
        return []
      }
    }
  }
  console.warn(`[prerender] warn: content source not found for ${baseName}`)
  return []
}

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

function injectHreflang(html, alternates = []) {
  if (!alternates || !alternates.length) return html
  const tags = alternates.map(a => `<link rel="alternate" hreflang="${a.lang}" href="${a.href}">`).join('\n  ')
  if (html.match(/<link[^>]+rel=["']alternate["'][^>]*hreflang/i)) {
    html = html.replace(/\n?\s*<link[^>]+rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*>\s*/ig, '')
  }
  return html.replace(/<\/head>/i, `  ${tags}\n</head>`)
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
  // hreflang is injected later with full alternates set
  return html
}

function ensureTrailingSlash(p) {
  if (!p || p === '/') return '/'
  return p.endsWith('/') ? p : `${p}/`
}

function injectVisibleContent(html, visible) {
  if (!visible) return html
  const placeholder = /<div id="root"><\/div>/
  if (!placeholder.test(html)) return html
  return html.replace(placeholder, `<div id="root">${visible}</div>`)
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

  const renderBlogIndexVisible = (list = [], lang = DEFAULT_LANG, bundle = {}) => {
    if (!Array.isArray(list) || !list.length) return ''
    const prefix = lang === DEFAULT_LANG ? '' : `/${lang}`
    const blogTitle = pick(bundle, 'blog.title') || 'Blog'
    const blogSubtitle = pick(bundle, 'blog.subtitle') || 'Articles and updates about making pixel image visuals, tutorials, and new features.'
    const items = list
      .map((item) => {
        if (!item || !item.slug) return ''
        const title = escapeHtml(item.title || '')
        const date = item.date ? `<p class="text-xs text-gray-500 mt-1 text-left">${escapeHtml(item.date)}</p>` : ''
        const excerpt = item.excerpt ? `<p class="text-gray-700 mt-2 text-left">${escapeHtml(item.excerpt)}</p>` : ''
        const href = `${prefix}/blog/${escapeHtml(item.slug)}/`
        return `<li class="p-4 rounded-lg border border-gray-200 bg-white shadow-sm"><h2 class="text-lg font-semibold text-gray-900 text-center"><a href="${href}" class="hover:text-blue-600">${title}</a></h2>${date}${excerpt}</li>`
      })
      .filter(Boolean)
      .join('')
    if (!items) return ''
    return `<div class="container mx-auto px-4 py-10 max-w-3xl"><h1 class="text-2xl font-bold text-gray-900 mb-4 text-center">${escapeHtml(blogTitle)}</h1><p class="text-gray-700 mb-6 max-w-2xl mx-auto text-center">${escapeHtml(blogSubtitle)}</p><ul class="space-y-4 max-w-2xl mx-auto">${items}</ul></div>`
  }

  const renderBlogPostVisible = (post, lang = DEFAULT_LANG, bundle = {}) => {
    if (!post || !post.slug) return ''
    const prefix = lang === DEFAULT_LANG ? '' : `/${lang}`
    const title = escapeHtml(post.title || '')
    const date = post.date ? `<p class="text-xs text-gray-500 mt-1 text-center md:text-left">${escapeHtml(post.date)}</p>` : ''
    const paragraphs = Array.isArray(post.body)
      ? post.body
          .filter((para) => typeof para === 'string')
          .map((para) => `<p>${escapeHtml(para)}</p>`)
          .join('')
      : ''
    const excerpt = post.excerpt ? `<p class="text-gray-700 mt-2 text-left">${escapeHtml(post.excerpt)}</p>` : ''
    const backLabel = pick(bundle, 'blog.back') || 'Back to Blog'
    const backHref = `${prefix}/blog/`
    return `<article class="container mx-auto px-4 py-10 max-w-3xl"><h1 class="text-2xl font-bold text-gray-900 text-center">${title}</h1>${date}<div class="prose prose-sm md:prose-base text-gray-800 mt-4 text-center md:text-left prose-pre:text-left prose-code:text-left prose-img:mx-0">${paragraphs || excerpt}</div><footer class="mt-8 text-center md:text-left"><a class="text-blue-600 underline" href="${backHref}">${escapeHtml(backLabel)}</a></footer></article>`
  }

  const cleanTitle = (text) => String(text || '')
    .replace(/\s*\|\s*Pixel Art Village\s*$/i, '')
    .replace(/\s*–\s*Pixel Art Village\s*$/i, '')
    .trim()

  const renderBasicVisible = ({ title, description }) => {
    const heading = escapeHtml(cleanTitle(title))
    const desc = description ? `<p class="text-gray-700 mt-3 text-center max-w-2xl mx-auto">${escapeHtml(description)}</p>` : ''
    if (!heading && !desc) return ''
    return `<main class="container mx-auto px-4 py-10 max-w-3xl"><h1 class="text-2xl font-bold text-gray-900 text-center">${heading}</h1>${desc}</main>`
  }

  const renderPseoVisible = (page) => {
    if (!page) return ''
    const heading = escapeHtml(page.h1 || page.title || '')
    const intro = Array.isArray(page.intro) ? page.intro.slice(0, 2) : []
    const paragraphs = intro.length
      ? intro.map((para) => `<p class="text-gray-700 mt-3">${escapeHtml(para)}</p>`).join('')
      : ''
    const fallback = !paragraphs && page.metaDescription
      ? `<p class="text-gray-700 mt-3">${escapeHtml(page.metaDescription)}</p>`
      : ''
    const body = paragraphs || fallback
    if (!heading && !body) return ''
    return `<main class="container mx-auto px-4 py-10 max-w-3xl"><h1 class="text-2xl font-bold text-gray-900 text-center">${heading}</h1>${body}</main>`
  }

  const getMetaDescription = (metas = []) => {
    const entry = metas.find(m => m && m.name === 'description')
    return entry?.content || ''
  }

  const posts = resolveContent('blog-posts')
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
      { name: 'description', content: 'Support, feedback, partnerships.' },
      { property: 'og:url', content: ABS(ensureTrailingSlash('/contact')) },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'Contact | Pixel Art Village' },
      { property: 'og:description', content: 'Support, feedback, partnerships.' },
      { property: 'og:image', content: ABS('/social-contact.png') },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Contact | Pixel Art Village' },
      { name: 'twitter:description', content: 'Support, feedback, partnerships.' },
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
    ], extras: blogIndexExtras, visible: ({ lang, bundle }) => renderBlogIndexVisible(posts, lang, bundle) },
  ]

  const pseoPages = resolveContent('pseo-pages')
  for (const p of pseoPages) {
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
      visible: () => renderPseoVisible(p),
    })
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
      visible: ({ lang, bundle }) => renderBlogPostVisible(p, lang, bundle),
    })
  }

  const expandForLang = (r, lang) => {
    const ensure = ensureTrailingSlash
    const basePath = ensure(r.path)
    const localizedPath = (lang === DEFAULT_LANG)
      ? basePath
      : (basePath === '/' ? `/${lang}/` : `/${lang}${basePath}`)

    let title = r.title
    let metas = Array.isArray(r.metas) ? [...r.metas] : []

    // Localized SEO meta per route
    const bundle = loadLocaleBundle(lang)
    const upsertDesc = (desc) => {
      if (!desc) return
      const idx = metas.findIndex(m => m && m.name === 'description')
      if (idx >= 0) metas[idx] = { ...metas[idx], content: desc }
      else metas.push({ name: 'description', content: desc })
    }

    if (basePath === '/') {
      const tTitle = pick(bundle, 'home.seoTitle')
      const tDesc = pick(bundle, 'home.seoDescription')
      if (typeof tTitle === 'string' && tTitle) title = tTitle
      if (typeof tDesc === 'string' && tDesc) upsertDesc(tDesc)
    } else if (basePath === '/about/') {
      const tTitle = pick(bundle, 'about.seoTitle')
      const tDesc = pick(bundle, 'about.seoDesc')
      if (typeof tTitle === 'string' && tTitle) title = tTitle
      if (typeof tDesc === 'string' && tDesc) upsertDesc(tDesc)
    } else if (basePath === '/privacy/') {
      const tTitle = pick(bundle, 'privacy.seoTitle')
      const tDesc = pick(bundle, 'privacy.seoDesc')
      if (typeof tTitle === 'string' && tTitle) title = tTitle
      if (typeof tDesc === 'string' && tDesc) upsertDesc(tDesc)
    } else if (basePath === '/terms/') {
      const tTitle = pick(bundle, 'terms.seoTitle')
      const tDesc = pick(bundle, 'terms.seoDesc')
      if (typeof tTitle === 'string' && tTitle) title = tTitle
      if (typeof tDesc === 'string' && tDesc) upsertDesc(tDesc)
    } else if (basePath === '/contact/') {
      const tTitle = pick(bundle, 'contact.seoTitle')
      const tDesc = pick(bundle, 'contact.seoDesc')
      if (typeof tTitle === 'string' && tTitle) title = tTitle
      if (typeof tDesc === 'string' && tDesc) upsertDesc(tDesc)
    } else if (basePath === '/blog/') {
      const tTitle = pick(bundle, 'blog.title')
      const tDesc = pick(bundle, 'blog.subtitle')
      if (typeof tTitle === 'string' && tTitle) title = `${tTitle} | Pixel Art Village`
      if (typeof tDesc === 'string' && tDesc) upsertDesc(tDesc)
    }

    const ogUrl = `https://pixelartvillage.org${localizedPath}`
    const ogIdx = metas.findIndex(m => m && m.property === 'og:url')
    if (ogIdx >= 0) metas[ogIdx] = { ...metas[ogIdx], content: ogUrl }
    else metas.push({ property: 'og:url', content: ogUrl })

    const description = getMetaDescription(metas)
    const resolvedVisible = typeof r.visible === 'function'
      ? r.visible({ lang, bundle, title, description })
      : r.visible
    const visible = resolvedVisible || renderBasicVisible({ title, description })

    return {
      lang,
      path: localizedPath,
      routePath: localizedPath,
      title,
      metas,
      extras: r.extras || '',
      links: r.links || null,
      visible,
      basePath,
    }
  }

  const expanded = []
  for (const r of routes) {
    for (const lang of SUPPORTED_LANGS) {
      expanded.push(expandForLang(r, lang))
    }
  }

  for (const r of expanded) {
    const canonicalPath = (r.routePath === '/' ? '/' : ensureTrailingSlash(r.routePath))

    const ABS = (p) => `https://pixelartvillage.org${p}`
    const alternates = SUPPORTED_LANGS.map(l => {
      const ensure = ensureTrailingSlash
      const p = (l === DEFAULT_LANG) ? ensure(r.basePath) : (r.basePath === '/' ? `/${l}/` : `/${l}${ensure(r.basePath)}`)
      return { lang: l, href: ABS(ensure(p)) }
    }).concat([{ lang: 'x-default', href: ABS((r.basePath === '/' ? '/' : ensureTrailingSlash(r.basePath))) }])

    let out = buildHtml(base, {
      title: r.title,
      canonical: ABS(canonicalPath),
      metas: r.metas,
      lang: r.lang,
      routePath: r.routePath,
    })

    out = injectHreflang(out, alternates)

    if (r.visible) {
      out = injectVisibleContent(out, r.visible)
    }

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
    const pathKey = (r.basePath || '/').toLowerCase()
    if (/^\/converter\//.test(pathKey)) {
      addExtras('<p>Palette control, palette limits, palette preview – manage palettes precisely.</p>')
      addExtras('<p>image workflow and image formats.</p>')
    } else if (/^\/blog\//.test(pathKey)) {
      addExtras('<p>Tips on choosing the right palette, palette examples, and image handling for your style.</p>')
    } else if (/^\/(privacy|terms|about|contact)\//.test(pathKey)) {
      addExtras('<p>Reference palette guidelines for creators.</p>')
    } else if (r.basePath === '/') {
      addExtras('<p>Explore our palette overview and palette chooser for quick starts.</p>')
    }

    const navLinks = r.links && r.links.length ? r.links : defaultLinks
    out = injectHiddenH1AndNav(out, { h1: h1Text, description: descMeta, links: navLinks, extras })

    const file = path.join(DIST, r.path.replace(/^\//, '').replace(/\/$/, ''), 'index.html')
    write(file, out)
    console.log('[prerender]', r.path, '→', path.relative(DIST, file))
  }
}

function loadLocaleBundle(lang) {
  try {
    const file = path.join(ROOT, 'public', 'locales', lang, 'translation.json')
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf8')) || {}
    }
  } catch {}
  return {}
}

function pick(obj, pathStr) {
  try {
    return String(pathStr).split('.').reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj)
  } catch {
    return undefined
  }
}

try {
  prerender()
  console.log('[prerender] done')
} catch (e) {
  console.error('[prerender] failed:', e && e.stack || e)
  process.exit(1)
}
