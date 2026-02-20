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

function sortObjectKeys(a, b) {
  const aNum = Number(a)
  const bNum = Number(b)
  const aIsNum = Number.isFinite(aNum)
  const bIsNum = Number.isFinite(bNum)
  if (aIsNum && bIsNum) return aNum - bNum
  if (aIsNum) return -1
  if (bIsNum) return 1
  return String(a).localeCompare(String(b))
}

function toArray(value) {
  if (Array.isArray(value)) return value
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort(sortObjectKeys)
      .map((key) => value[key])
  }
  return []
}

function toStringArray(value) {
  return toArray(value)
    .map((item) => (typeof item === 'string' ? item : String(item ?? '')))
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeBlogPosts(value) {
  return toArray(value)
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return null
      return {
        ...entry,
        tags: toStringArray(entry.tags),
        body: toStringArray(entry.body),
      }
    })
    .filter((entry) => entry && typeof entry.slug === 'string' && entry.slug.trim())
}

function normalizePseoPages(value) {
  return toArray(value).filter((entry) => entry && typeof entry.slug === 'string' && entry.slug.trim())
}

function resolveContent(baseName, lang = DEFAULT_LANG, normalizer = toArray) {
  const paths = [
    path.join(ROOT, 'src', 'content', `${baseName}.${lang}.json`),
    path.join(ROOT, 'src', 'content', `${baseName}.${DEFAULT_LANG}.json`),
    path.join(ROOT, 'src', 'content', `${baseName}.json`),
  ]
  for (const filePath of paths) {
    if (fs.existsSync(filePath)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        return typeof normalizer === 'function' ? normalizer(parsed) : parsed
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

function injectJsonLd(html, jsonLd = []) {
  const entries = Array.isArray(jsonLd) ? jsonLd : (jsonLd ? [jsonLd] : [])
  if (!entries.length) return html
  const tags = entries
    .filter(Boolean)
    .map((entry) => `  <script type="application/ld+json">${JSON.stringify(entry).replace(/</g, '\\u003c')}</script>`)
    .join('\n')
  if (!tags) return html
  return html.replace(/<\/head>/i, `${tags}\n</head>`)
}

function injectHreflang(html, alternates = []) {
  if (!alternates || !alternates.length) return html
  const tags = alternates.map(a => `<link rel="alternate" hreflang="${a.lang}" href="${a.href}">`).join('\n  ')
  if (html.match(/<link[^>]+rel=["']alternate["'][^>]*hreflang/i)) {
    html = html.replace(/\n?\s*<link[^>]+rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*>\s*/ig, '')
  }
  return html.replace(/<\/head>/i, `  ${tags}\n</head>`)
}

function buildHtml(base, { title, canonical, metas, lang, jsonLd }) {
  let html = base
  if (title) html = replaceTitle(html, title)
  if (canonical) html = upsertCanonical(html, canonical)
  html = stripOgTwitter(html)
  html = stripMetaDescription(html)
  if (lang) html = setHtmlLang(html, lang)
  html = stripJsonLdTypes(html, ['FAQPage'])
  html = html.replace(/\n?\s*<div[^>]+data-prerender-seo[\s\S]*?<\/div>\s*/i, '')
  if (metas?.length) html = injectMeta(html, metas)
  html = injectJsonLd(html, jsonLd)
  // hreflang is injected later with full alternates set
  return html
}

function ensureTrailingSlash(p) {
  if (!p || p === '/') return '/'
  return p.endsWith('/') ? p : `${p}/`
}

function buildLocalizedPath(lang, basePath) {
  const normalized = ensureTrailingSlash(basePath)
  if (!lang || lang === DEFAULT_LANG) return normalized
  if (normalized === '/') return `/${lang}/`
  return `/${lang}${normalized}`
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

  const formatBlogSeoTitle = (title, siteName, maxLength = 60) => {
    const normalizedTitle = String(title || '').trim()
    const suffix = ` | ${siteName}`
    const maxBaseLength = Math.max(20, maxLength - suffix.length)
    if (normalizedTitle.length <= maxBaseLength) return `${normalizedTitle}${suffix}`
    const trimmed = normalizedTitle.slice(0, Math.max(0, maxBaseLength - 1)).trimEnd()
    return `${trimmed}…${suffix}`
  }

  const renderBasicVisible = ({ title, description }) => {
    const heading = escapeHtml(cleanTitle(title))
    const desc = description ? `<p class="text-gray-700 mt-3 text-center max-w-2xl mx-auto">${escapeHtml(description)}</p>` : ''
    if (!heading && !desc) return ''
    return `<main class="container mx-auto px-4 py-10 max-w-3xl"><h1 class="text-2xl font-bold text-gray-900 text-center">${heading}</h1>${desc}</main>`
  }

  const renderPseoVisible = (page, { lang = DEFAULT_LANG, bundle = {}, pages = [] } = {}) => {
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

    const relatedHeading = pick(bundle, 'pseo.relatedHeading') || 'Related Converters'
    const exploreHeading = pick(bundle, 'footer.explore') || 'Explore More'
    const siteLinks = [
      { href: buildLocalizedPath(lang, '/'), label: pick(bundle, 'nav.home') || 'Home' },
      { href: buildLocalizedPath(lang, '/blog'), label: pick(bundle, 'nav.blog') || 'Blog' },
      { href: buildLocalizedPath(lang, '/about'), label: pick(bundle, 'nav.about') || 'About' },
      { href: buildLocalizedPath(lang, '/contact'), label: pick(bundle, 'nav.contact') || 'Contact' },
      { href: buildLocalizedPath(lang, '/privacy'), label: pick(bundle, 'footer.privacy') || 'Privacy' },
      { href: buildLocalizedPath(lang, '/terms'), label: pick(bundle, 'footer.terms') || 'Terms' },
    ]

    const relatedLinks = Array.isArray(pages)
      ? pages.filter((entry) => entry && entry.slug && entry.slug !== page.slug).slice(0, 6)
      : []

    const relatedHtml = relatedLinks.length
      ? `<section class="mt-8"><h2 class="text-xl font-semibold text-gray-900">${escapeHtml(relatedHeading)}</h2><ul class="mt-3 space-y-2">${relatedLinks
          .map((entry) => {
            const title = entry.h1 || entry.title || entry.slug
            const href = buildLocalizedPath(lang, `/converter/${entry.slug}`)
            return `<li><a class="text-blue-600 hover:underline" href="${escapeHtml(href)}">${escapeHtml(title)}</a></li>`
          })
          .join('')}</ul></section>`
      : ''

    const siteHtml = `<section class="mt-8"><h2 class="text-lg font-semibold text-gray-900">${escapeHtml(exploreHeading)}</h2><ul class="mt-3 flex flex-wrap gap-3">${siteLinks
      .map((link) => `<li><a class="text-blue-600 hover:underline" href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></li>`)
      .join('')}</ul></section>`

    if (!heading && !body && !relatedHtml) return ''
    return `<main class="container mx-auto px-4 py-10 max-w-3xl"><h1 class="text-2xl font-bold text-gray-900 text-center">${heading}</h1>${body}${relatedHtml}${siteHtml}</main>`
  }

  const getMetaDescription = (metas = []) => {
    const entry = metas.find(m => m && m.name === 'description')
    return entry?.content || ''
  }

  const blogPostsByLang = Object.fromEntries(
    SUPPORTED_LANGS.map((lang) => [lang, resolveContent('blog-posts', lang, normalizeBlogPosts)]),
  )

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
    ],
      jsonLd: ({ lang, bundle }) => ({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: pick(bundle, 'site.name') || 'Pixel Art Village',
        url: 'https://pixelartvillage.org/',
        description: pick(bundle, 'about.seoDesc') || 'A free, browser-based pixel art maker & converter.',
        inLanguage: lang,
        sameAs: ['https://github.com/pixelartvillage/pixelartvillage'],
      }),
    },
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
  ]

  const pseoPages = resolveContent('pseo-pages', DEFAULT_LANG, normalizePseoPages)
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
      jsonLd: ({ lang, routePath }) => [
        {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: p.h1 || p.title,
          description: p.metaDescription || '',
          inLanguage: lang,
          totalTime: 'PT2M',
          supply: [{ '@type': 'HowToSupply', name: 'Image file (PNG/JPG/WebP/GIF/BMP)' }],
          tool: [{ '@type': 'HowToTool', name: 'Pixel Art Village Converter' }],
          step: [
            { '@type': 'HowToStep', name: 'Upload an image' },
            { '@type': 'HowToStep', name: 'Adjust pixel size and palette settings' },
            { '@type': 'HowToStep', name: 'Download your pixel art result' },
          ],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: p.title,
          applicationCategory: 'MultimediaApplication',
          operatingSystem: 'Web',
          url: `https://pixelartvillage.org${routePath}`,
          description: p.metaDescription || '',
          inLanguage: lang,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
      ],
      visible: ({ lang, bundle }) => renderPseoVisible(p, { lang, bundle, pages: pseoPages }),
    })
  }

  const blogRoutes = []
  const blogImageExists = (slug) => fs.existsSync(path.join(ROOT, 'public', 'blog-og', `${slug}.png`))
  const buildBlogPath = (lang, slug = '') => {
    const prefix = lang === DEFAULT_LANG ? '' : `/${lang}`
    if (!slug) return `${prefix}/blog/`
    return `${prefix}/blog/${slug}/`
  }
  const blogIndexLocales = []
  const blogLocalesBySlug = new Map()
  for (const lang of SUPPORTED_LANGS) {
    const posts = Array.isArray(blogPostsByLang[lang]) ? blogPostsByLang[lang] : []
    if (posts.length > 0) blogIndexLocales.push(lang)
    for (const post of posts) {
      if (!post?.slug) continue
      const locales = blogLocalesBySlug.get(post.slug) || new Set()
      locales.add(lang)
      blogLocalesBySlug.set(post.slug, locales)
    }
  }
  const sortBySupportedLangs = (langs = []) => {
    const set = new Set(langs)
    return SUPPORTED_LANGS.filter((lang) => set.has(lang))
  }
  const buildBlogAlternates = (slug = '') => {
    const langs = slug
      ? sortBySupportedLangs(Array.from(blogLocalesBySlug.get(slug) || []))
      : sortBySupportedLangs(blogIndexLocales)
    const alternates = langs.map((lang) => ({ lang, href: ABS(buildBlogPath(lang, slug)) }))
    const xDefaultLang = langs.includes(DEFAULT_LANG) ? DEFAULT_LANG : langs[0]
    if (xDefaultLang) {
      alternates.push({ lang: 'x-default', href: ABS(buildBlogPath(xDefaultLang, slug)) })
    }
    return alternates
  }

  for (const lang of SUPPORTED_LANGS) {
    const bundle = loadLocaleBundle(lang)
    const postsForLang = Array.isArray(blogPostsByLang[lang]) ? blogPostsByLang[lang] : []
    if (!postsForLang.length) continue

    const siteName = pick(bundle, 'site.name') || 'Pixel Art Village'
    const blogTitle = pick(bundle, 'blog.title') || 'Blog'
    const blogSubtitle =
      pick(bundle, 'blog.subtitle') || 'Articles and updates about making pixel image visuals, tutorials, and new features.'
    const blogPath = buildBlogPath(lang)

    blogRoutes.push({
      lang,
      path: blogPath,
      routePath: blogPath,
      basePath: '/blog/',
      title: `${blogTitle} | ${siteName}`,
      metas: [
        { name: 'description', content: blogSubtitle },
        { property: 'og:url', content: ABS(blogPath) },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: `${blogTitle} | ${siteName}` },
        { property: 'og:description', content: blogSubtitle },
        { property: 'og:image', content: ABS('/blog-og/_index.png') },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: `${blogTitle} | ${siteName}` },
        { name: 'twitter:description', content: blogSubtitle },
        { name: 'twitter:image', content: ABS('/blog-og/_index.png') },
      ],
      extras: renderBlogIndex(postsForLang),
      visible: renderBlogIndexVisible(postsForLang, lang, bundle),
      alternates: buildBlogAlternates(),
    })

    for (const post of postsForLang) {
      if (!post?.slug) continue
      const postPath = buildBlogPath(lang, post.slug)
      const ogImage = blogImageExists(post.slug) ? ABS(`/blog-og/${post.slug}.png`) : ABS('/blog-og/_index.png')
      const seoTitle = formatBlogSeoTitle(post.title, siteName)
      blogRoutes.push({
        lang,
        path: postPath,
        routePath: postPath,
        basePath: ensureTrailingSlash(`/blog/${post.slug}`),
        title: seoTitle,
        metas: [
          { name: 'description', content: post.excerpt || '' },
          { property: 'og:url', content: ABS(postPath) },
          { property: 'og:type', content: 'article' },
          { property: 'og:title', content: seoTitle },
          { property: 'og:description', content: post.excerpt || '' },
          { property: 'og:image', content: ogImage },
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:title', content: seoTitle },
          { name: 'twitter:description', content: post.excerpt || '' },
          { name: 'twitter:image', content: ogImage },
        ],
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt || '',
            datePublished: post.date || undefined,
            dateModified: post.date || undefined,
            inLanguage: lang,
            mainEntityOfPage: ABS(postPath),
            author: { '@type': 'Organization', name: siteName },
            publisher: { '@type': 'Organization', name: siteName },
            image: ogImage,
          },
        ],
        extras: renderBlogArticle(post),
        visible: renderBlogPostVisible(post, lang, bundle),
        alternates: buildBlogAlternates(post.slug),
      })
    }
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
    const resolvedJsonLd = typeof r.jsonLd === 'function'
      ? r.jsonLd({ lang, bundle, title, description, routePath: localizedPath })
      : r.jsonLd
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
      jsonLd: resolvedJsonLd,
      basePath,
      alternates: null,
    }
  }

  const expanded = []
  const seenPaths = new Set()
  const appendRoute = (route) => {
    const normalizedPath = ensureTrailingSlash(route.path || route.routePath || '/')
    const key = `${route.lang || DEFAULT_LANG}:${normalizedPath}`
    if (seenPaths.has(key)) return
    seenPaths.add(key)
    expanded.push(route)
  }
  for (const r of routes) {
    for (const lang of SUPPORTED_LANGS) {
      appendRoute(expandForLang(r, lang))
    }
  }
  for (const route of blogRoutes) appendRoute(route)

  for (const r of expanded) {
    const canonicalPath = (r.routePath === '/' ? '/' : ensureTrailingSlash(r.routePath))

    const ABS = (p) => `https://pixelartvillage.org${p}`
    const alternates = Array.isArray(r.alternates) && r.alternates.length
      ? r.alternates
      : SUPPORTED_LANGS.map((l) => {
          const ensure = ensureTrailingSlash
          const p = l === DEFAULT_LANG ? ensure(r.basePath) : (r.basePath === '/' ? `/${l}/` : `/${l}${ensure(r.basePath)}`)
          return { lang: l, href: ABS(ensure(p)) }
        }).concat([{ lang: 'x-default', href: ABS((r.basePath === '/' ? '/' : ensureTrailingSlash(r.basePath))) }])

    let out = buildHtml(base, {
      title: r.title,
      canonical: ABS(canonicalPath),
      metas: r.metas,
      lang: r.lang,
      jsonLd: r.jsonLd,
    })

    out = injectHreflang(out, alternates)
    if (r.visible) {
      out = injectVisibleContent(out, r.visible)
    }

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
