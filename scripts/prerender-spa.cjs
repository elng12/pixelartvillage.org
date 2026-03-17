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

async function loadSsrRenderer() {
  const { createServer } = await import('vite')
  const vite = await createServer({
    root: ROOT,
    mode: 'production',
    appType: 'custom',
    logLevel: 'error',
    server: {
      middlewareMode: true,
    },
    optimizeDeps: {
      noDiscovery: true,
    },
  })
  const mod = await vite.ssrLoadModule('/src/entry-server.jsx')
  if (typeof mod.renderApp !== 'function') {
    await vite.close()
    throw new Error('SSR renderer missing renderApp export')
  }
  return {
    renderApp: mod.renderApp,
    close: () => vite.close(),
  }
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

function stripJsonLd(html) {
  return html.replace(/\n?\s*<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/ig, '')
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
  html = stripJsonLd(html)
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
  const shell = `<div id="root"><div data-prerender-shell><div aria-hidden="true" class="h-20 border-b border-gray-200 bg-white/80"></div>${visible}</div></div>`
  return html.replace(placeholder, shell)
}

function injectHeadTags(html, tags = []) {
  if (!Array.isArray(tags) || !tags.length) return html
  return html.replace(/<\/head>/i, `  ${tags.join('\n  ')}\n</head>`)
}

function injectAppContent(html, appHtml) {
  if (!appHtml) return html
  const placeholder = /<div id="root"><\/div>/
  if (!placeholder.test(html)) return html
  return html.replace(placeholder, `<div id="root" data-ssr-root="1">${appHtml}</div>`)
}

function extractHydrationUnsafeHeadTags(appHtml) {
  if (!appHtml) {
    return { appHtml: '', headTags: [] }
  }

  const headTags = []
  const cleanedHtml = appHtml.replace(
    /<link\b[^>]*rel=["'](?:preload|modulepreload|preconnect|dns-prefetch)["'][^>]*>/ig,
    (match) => {
      headTags.push(match)
      return ''
    },
  )

  return {
    appHtml: cleanedHtml.trimStart(),
    headTags: Array.from(new Set(headTags)).filter(
      (tag) => !/<link\b[^>]*rel=["']modulepreload["'][^>]*href=["'][^"']*\/assets\/deferred-ui-[^"']+\.js["'][^>]*>/i.test(tag),
    ),
  }
}

function injectInitialContent(html, payload) {
  if (!payload) return html
  const serialized = JSON.stringify(payload).replace(/</g, '\\u003c')
  const tag = `<script id="pv-initial-content" type="application/json">${serialized}</script>`
  if (/<script[^>]+id=["']pv-initial-content["'][^>]*>[\s\S]*?<\/script>/i.test(html)) {
    html = html.replace(/<script[^>]+id=["']pv-initial-content["'][^>]*>[\s\S]*?<\/script>/i, tag)
  }
  return html.replace(/<\/body>/i, `  ${tag}\n</body>`)
}

function injectInitialI18n(html, payload) {
  if (!payload) return html
  const serialized = JSON.stringify(payload).replace(/</g, '\\u003c')
  const tag = `<script id="pv-initial-i18n" type="application/json">${serialized}</script>`
  if (/<script[^>]+id=["']pv-initial-i18n["'][^>]*>[\s\S]*?<\/script>/i.test(html)) {
    html = html.replace(/<script[^>]+id=["']pv-initial-i18n["'][^>]*>[\s\S]*?<\/script>/i, tag)
  }
  return html.replace(/<\/body>/i, `  ${tag}\n</body>`)
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

async function prerender() {
  if (!fs.existsSync(DIST)) throw new Error('dist not found')
  const base = read(INDEX)
  const ABS = (p) => `https://pixelartvillage.org${p}`
  const ssr = await loadSsrRenderer()

  try {
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
    const blogHeading = pick(bundle, 'blog.h1') || 'Pixel Art Tutorials & Guides'
    const blogSubtitle = pick(bundle, 'blog.subtitle') || 'Articles and updates about making pixel image visuals, tutorials, and new features.'
    const topicHeading = pick(bundle, 'blog.relatedHeading') || 'Popular topics'
    const topics = Array.from(new Set(list.flatMap((item) => toStringArray(item?.tags))))
      .map((tag) => normalizeWhitespace(tag))
      .filter(Boolean)
      .slice(0, 8)
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
    const guideHtml = `<section class="mb-6 max-w-2xl mx-auto rounded-lg border border-gray-200 bg-white p-4 shadow-sm"><h2 class="text-lg font-semibold text-gray-900">${escapeHtml(topicHeading)}</h2><p class="mt-2 text-gray-700">Use this hub to compare tools, learn beginner workflows, troubleshoot exports, explore animation basics, and collect practical pixel art ideas before you open the editor.</p>${topics.length ? `<ul class="mt-3 flex flex-wrap gap-2">${topics.map((tag) => `<li class="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700">${escapeHtml(tag)}</li>`).join('')}</ul>` : ''}</section>`
    return `<div class="container mx-auto px-4 py-10 max-w-3xl"><h1 class="text-2xl font-bold text-gray-900 mb-4 text-center">${escapeHtml(blogHeading)}</h1><p class="text-gray-700 mb-6 max-w-2xl mx-auto text-center">${escapeHtml(blogSubtitle)}</p>${guideHtml}<ul class="space-y-4 max-w-2xl mx-auto">${items}</ul></div>`
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

  const getRelatedBlogPosts = (posts = [], currentSlug, limit = 3) => {
    const normalized = Array.isArray(posts) ? posts.filter((item) => item && item.slug) : []
    if (normalized.length <= 1) return []
    const max = Math.min(limit, normalized.length - 1)
    const currentIndex = normalized.findIndex((item) => item.slug === currentSlug)
    const startIndex = currentIndex >= 0 ? currentIndex : 0
    const related = []
    for (let step = 1; related.length < max && step <= normalized.length; step += 1) {
      const candidate = normalized[(startIndex + step) % normalized.length]
      if (!candidate || candidate.slug === currentSlug) continue
      if (!related.some((item) => item.slug === candidate.slug)) related.push(candidate)
    }
    return related
  }

  const renderBlogPostWithRelatedVisible = (post, posts = [], lang = DEFAULT_LANG, bundle = {}) => {
    if (!post || !post.slug) return ''
    const base = renderBlogPostVisible(post, lang, bundle)
    if (!base) return base
    const prefix = lang === DEFAULT_LANG ? '' : `/${lang}`
    const relatedHeading = escapeHtml(pick(bundle, 'blog.relatedHeading') || 'Related posts')
    const related = getRelatedBlogPosts(posts, post.slug, 3)
    if (!related.length) return base
    const links = related
      .map((item) => `<li><a class="text-blue-600 hover:underline" href="${prefix}/blog/${escapeHtml(item.slug)}/">${escapeHtml(item.title || item.slug)}</a></li>`)
      .join('')
    const relatedHtml = `<section class="mt-8 rounded-lg border border-gray-200 bg-white p-4"><h2 class="text-lg font-semibold text-gray-900">${relatedHeading}</h2><ul class="mt-3 space-y-2">${links}</ul></section>`
    return base.replace(/<footer class="mt-8 text-center md:text-left">/i, `${relatedHtml}<footer class="mt-8 text-center md:text-left">`)
  }

  const cleanTitle = (text) => String(text || '')
    .replace(/\s*\|\s*Pixel Art Village\s*$/i, '')
    .replace(/\s*–\s*Pixel Art Village\s*$/i, '')
    .replace(/\s*-\s*Pixel Art Village\s*$/i, '')
    .trim()

  const formatBlogSeoTitle = (title, siteName, maxLength = 60) => {
    const normalizedTitle = String(title || '').trim()
    const suffix = ` | ${siteName}`
    const maxBaseLength = Math.max(20, maxLength - suffix.length)
    if (normalizedTitle.length <= maxBaseLength) return `${normalizedTitle}${suffix}`
    const trimmed = normalizedTitle.slice(0, Math.max(0, maxBaseLength - 1)).trimEnd()
    return `${trimmed}…${suffix}`
  }

  const shortenSeoTitle = (title, maxLength = 60) => {
    const normalized = normalizeWhitespace(title)
    if (!normalized || normalized.length <= maxLength) return normalized

    for (const separator of [' | ', ' - ', ' – ']) {
      const index = normalized.lastIndexOf(separator)
      if (index <= 0) continue
      const base = normalized.slice(0, index).trim()
      const suffix = normalized.slice(index)
      const maxBaseLength = Math.max(20, maxLength - suffix.length - 1)
      if (base.length <= maxBaseLength) return normalized
      let trimmed = base.slice(0, maxBaseLength).trimEnd()
      const lastSpace = trimmed.lastIndexOf(' ')
      if (lastSpace >= Math.max(15, Math.floor(maxBaseLength * 0.6))) {
        trimmed = trimmed.slice(0, lastSpace).trimEnd()
      }
      return `${trimmed}…${suffix}`
    }

    return shortenText(normalized, maxLength)
  }

  const normalizeWhitespace = (text) => String(text || '').replace(/\s+/g, ' ').trim()

  const shortenText = (text, maxLength = 155) => {
    const normalized = normalizeWhitespace(text)
    if (!normalized || normalized.length <= maxLength) return normalized

    const hardLimit = Math.max(1, maxLength - 1)
    let trimmed = normalized.slice(0, hardLimit).trimEnd()
    const lastSpace = trimmed.lastIndexOf(' ')
    if (lastSpace >= Math.max(40, Math.floor(maxLength * 0.6))) {
      trimmed = trimmed.slice(0, lastSpace).trimEnd()
    }

    return `${trimmed.replace(/[.,;:!?-]+$/g, '').trimEnd()}…`
  }

  const renderBasicVisible = ({ title, description }) => {
    const heading = escapeHtml(cleanTitle(title))
    const desc = description ? `<p class="text-gray-700 mt-3 text-center max-w-2xl mx-auto">${escapeHtml(description)}</p>` : ''
    if (!heading && !desc) return ''
    return `<main class="container mx-auto px-4 py-10 max-w-3xl"><h1 class="text-2xl font-bold text-gray-900 text-center">${heading}</h1>${desc}</main>`
  }

  const renderFaqCardsSection = ({ bundle = {}, title, count = 3 } = {}) => {
    const faqTitle = escapeHtml(title || pick(bundle, 'faq.title') || 'Image to Pixel Art FAQ')
    const faqItems = Array.isArray(pick(bundle, 'faq.items'))
      ? pick(bundle, 'faq.items').filter((item) => item && item.question && item.answer).slice(0, count)
      : []
    if (!faqItems.length) return ''
    return `<section class="mt-8"><h2 class="text-xl font-semibold text-gray-900">${faqTitle}</h2><div class="mt-4 space-y-4">${faqItems
      .map((item) => `<article class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"><h3 class="text-base font-semibold text-gray-900">${escapeHtml(item.question)}</h3><p class="mt-2 text-gray-700">${escapeHtml(item.answer)}</p></article>`)
      .join('')}</div></section>`
  }

  const getPseoTopicLabel = (page) => cleanTitle(page?.h1 || page?.title || page?.slug || 'This converter')
    .replace(/^Convert\s+/i, '')
    .replace(/\s+\(.*?\)\s*$/g, '')
    .replace(/:\s*/g, ' ')
    .replace(/\s+Online$/i, '')
    .trim()

  const renderPseoTipsSection = (page) => {
    const topicLabel = getPseoTopicLabel(page)
    const tips = [
      `${topicLabel} works best when you start with a clear subject, a limited palette, and a target output size in mind. Fewer colors make shapes easier to read at small resolutions and help sprites, icons, and UI graphics stay crisp.`,
      'Before exporting, test several pixel sizes and compare silhouettes in the live preview. A slightly larger grid often keeps edges cleaner, while careful dithering can smooth gradients without making the final artwork muddy or blurry.',
      'If your source image feels too busy, crop tighter and boost contrast before pixelating. Strong value separation, simpler forms, and fewer competing textures usually produce cleaner retro-style results and reduce the amount of manual cleanup afterward.',
    ]

    return `<section class="mt-8"><h2 class="text-xl font-semibold text-gray-900">How to get cleaner pixel art</h2><div class="mt-4 space-y-4">${tips
      .map((tip) => `<p class="text-gray-700">${escapeHtml(tip)}</p>`)
      .join('')}</div><ol class="mt-4 space-y-3 list-decimal pl-5 text-gray-700"><li>Upload the source image with the clearest subject and silhouette.</li><li>Adjust pixel size, palette, and dithering until the shapes read cleanly.</li><li>Export a PNG and review it at the final display size before shipping or sharing.</li></ol></section>`
  }

  const renderPseoVisible = (page, { lang = DEFAULT_LANG, bundle = {}, pages = [] } = {}) => {
    if (!page) return ''
    const heading = escapeHtml(page.h1 || page.title || '')
    const intro = Array.isArray(page.intro) ? page.intro : []
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
    const tipsHtml = renderPseoTipsSection(page)
    const faqHtml = renderFaqCardsSection({ bundle, count: 2 })

    if (!heading && !body && !relatedHtml) return ''
    return `<main class="container mx-auto px-4 py-10 max-w-3xl"><h1 class="text-2xl font-bold text-gray-900 text-center">${heading}</h1>${body}${tipsHtml}${relatedHtml}${siteHtml}${faqHtml}</main>`
  }

  const formatTemplate = (template, values = {}) => String(template || '').replace(/\{\{\s*([^}]+)\s*\}\}/g, (_, key) => {
    const value = values[key.trim()]
    return value == null ? '' : String(value)
  })

  const getPrimarySiteLinks = (lang = DEFAULT_LANG, bundle = {}) => ([
    { href: buildLocalizedPath(lang, '/'), label: pick(bundle, 'nav.home') || 'Home' },
    { href: buildLocalizedPath(lang, '/blog'), label: pick(bundle, 'nav.blog') || 'Blog' },
    { href: buildLocalizedPath(lang, '/about'), label: pick(bundle, 'nav.about') || 'About' },
    { href: buildLocalizedPath(lang, '/contact'), label: pick(bundle, 'nav.contact') || 'Contact' },
    { href: buildLocalizedPath(lang, '/privacy'), label: pick(bundle, 'footer.privacy') || 'Privacy' },
    { href: buildLocalizedPath(lang, '/terms'), label: pick(bundle, 'footer.terms') || 'Terms' },
    { href: buildLocalizedPath(lang, '/converter/png-to-pixel-art'), label: pick(bundle, 'footer.links.png2pixel') || 'PNG to Pixel Art' },
    { href: buildLocalizedPath(lang, '/converter/jpg-to-pixel-art'), label: pick(bundle, 'footer.links.jpg2pixel') || 'JPG to Pixel Art' },
    { href: buildLocalizedPath(lang, '/converter/image-to-pixel-art'), label: pick(bundle, 'footer.links.imageToPixel') || 'Image to Pixel Art' },
    { href: buildLocalizedPath(lang, '/converter/photo-to-sprite-converter'), label: pick(bundle, 'footer.links.photo2sprite') || 'Photo to Sprite Converter' },
  ])

  const renderLinkGridSection = (title, links = [], columns = 'sm:grid-cols-2') => {
    const items = Array.isArray(links)
      ? links.filter((link) => link && link.href && link.label)
      : []
    if (!items.length) return ''
    return `<section class="mt-8"><h2 class="text-xl font-semibold text-gray-900">${escapeHtml(title)}</h2><ul class="mt-4 grid grid-cols-1 gap-3 ${columns}">${items
      .map((link) => `<li><a class="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 hover:border-blue-300 hover:text-blue-600" href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></li>`)
      .join('')}</ul></section>`
  }

  const renderRecentPostsSection = ({ lang = DEFAULT_LANG, bundle = {}, posts = [], title } = {}) => {
    const recentPosts = Array.isArray(posts) ? posts.slice(0, 3) : []
    if (!recentPosts.length) return ''
    return `<section class="mt-8"><h2 class="text-xl font-semibold text-gray-900">${escapeHtml(title || pick(bundle, 'blog.title') || 'Blog')}</h2><ul class="mt-4 space-y-3">${recentPosts
      .map((post) => {
        const href = buildLocalizedPath(lang, `/blog/${post.slug}`)
        const excerpt = post.excerpt ? `<p class="mt-1 text-sm text-gray-700">${escapeHtml(post.excerpt)}</p>` : ''
        return `<li class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"><a class="text-base font-semibold text-blue-600 hover:underline" href="${escapeHtml(href)}">${escapeHtml(post.title || post.slug)}</a>${excerpt}</li>`
      })
      .join('')}</ul></section>`
  }

  const renderAboutVisible = ({ lang = DEFAULT_LANG, bundle = {}, title = '', description = '', blogPosts = [] } = {}) => {
    const heading = escapeHtml(pick(bundle, 'about.h1') || cleanTitle(title))
    const paragraphs = ['about.p1', 'about.p2', 'about.p3']
      .map((key) => pick(bundle, key))
      .filter(Boolean)
      .map((text) => `<p>${escapeHtml(text)}</p>`)
      .join('')
    const principles = [
      {
        title: pick(bundle, 'about.principles.privacy.title'),
        desc: pick(bundle, 'about.principles.privacy.desc'),
      },
      {
        title: pick(bundle, 'about.principles.performance.title'),
        desc: pick(bundle, 'about.principles.performance.desc'),
      },
      {
        title: pick(bundle, 'about.principles.accessibility.title'),
        desc: pick(bundle, 'about.principles.accessibility.desc'),
      },
    ].filter((item) => item.title || item.desc)
    const principlesHtml = principles.length
      ? `<section class="mt-8"><h2 class="text-xl font-semibold text-gray-900">${escapeHtml(pick(bundle, 'about.principles.title') || 'Principles')}</h2><ul class="mt-4 space-y-3">${principles
          .map((item) => `<li class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"><strong class="text-gray-900">${escapeHtml(item.title)}</strong> <span class="text-gray-700">${escapeHtml(item.desc)}</span></li>`)
          .join('')}</ul></section>`
      : ''
    const intro = paragraphs || (description ? `<p>${escapeHtml(description)}</p>` : '')
    const exploreHtml = renderLinkGridSection(pick(bundle, 'footer.explore') || 'Explore', getPrimarySiteLinks(lang, bundle))
    const recentPostsHtml = renderRecentPostsSection({ lang, bundle, posts: blogPosts })
    return `<main class="container mx-auto px-4 py-10 max-w-4xl"><section><h1 class="text-2xl font-bold text-gray-900">${heading}</h1><div class="prose prose-sm max-w-none text-gray-700 mt-4">${intro}</div></section>${principlesHtml}${exploreHtml}${recentPostsHtml}</main>`
  }

  const renderContactVisible = ({ lang = DEFAULT_LANG, bundle = {}, title = '', description = '', blogPosts = [] } = {}) => {
    const heading = escapeHtml(pick(bundle, 'contact.h1') || cleanTitle(title))
    const intro = pick(bundle, 'contact.p1') || description
    const paragraphOneParts = [
      escapeHtml(pick(bundle, 'contact.p2') || ''),
      `<a class="text-blue-600 underline" href="${escapeHtml(buildLocalizedPath(lang, '/blog'))}">${escapeHtml(pick(bundle, 'contact.p3') || pick(bundle, 'nav.blog') || 'Blog')}</a>`,
      escapeHtml(pick(bundle, 'contact.p4') || ''),
      `<a class="text-blue-600 underline" href="${escapeHtml(buildLocalizedPath(lang, '/'))}">${escapeHtml(pick(bundle, 'contact.p5') || pick(bundle, 'nav.home') || 'Home')}</a>`,
      escapeHtml(pick(bundle, 'contact.p6') || ''),
      `<a class="text-blue-600 underline" href="${escapeHtml(buildLocalizedPath(lang, '/about'))}">${escapeHtml(pick(bundle, 'contact.p7') || pick(bundle, 'nav.about') || 'About')}</a>`,
      escapeHtml(pick(bundle, 'contact.p8') || ''),
    ].filter(Boolean).join(' ')
    const paragraphTwoParts = [
      escapeHtml(pick(bundle, 'contact.p9') || ''),
      `<a class="text-blue-600 underline" href="${escapeHtml(buildLocalizedPath(lang, '/converter/png-to-pixel-art'))}">${escapeHtml(pick(bundle, 'contact.p10') || pick(bundle, 'footer.links.png2pixel') || 'PNG to Pixel Art')}</a>`,
      escapeHtml(pick(bundle, 'contact.p11') || ''),
      `<a class="text-blue-600 underline" href="${escapeHtml(buildLocalizedPath(lang, '/converter/image-to-pixel-art'))}">${escapeHtml(pick(bundle, 'contact.p12') || pick(bundle, 'footer.links.imageToPixel') || 'Image to Pixel Art')}</a>`,
      escapeHtml(pick(bundle, 'contact.p13') || ''),
    ].filter(Boolean).join(' ')
    const body = [
      intro ? `<p>${escapeHtml(intro)}</p>` : '',
      paragraphOneParts ? `<p>${paragraphOneParts}</p>` : '',
      paragraphTwoParts ? `<p>${paragraphTwoParts}</p>` : '',
    ].filter(Boolean).join('')
    const exploreHtml = renderLinkGridSection(pick(bundle, 'footer.explore') || 'Explore', getPrimarySiteLinks(lang, bundle))
    const recentPostsHtml = renderRecentPostsSection({ lang, bundle, posts: blogPosts })
    return `<main class="container mx-auto px-4 py-10 max-w-4xl"><section><h1 class="text-2xl font-bold text-gray-900">${heading}</h1><div class="prose prose-sm max-w-none text-gray-700 mt-4">${body}</div></section>${exploreHtml}${recentPostsHtml}</main>`
  }

  const renderPolicySection = ({ title, paragraphs = [], bullets = [] } = {}) => {
    const textBlocks = []
    if (title) textBlocks.push(`<h2 class="text-xl font-semibold text-gray-900">${escapeHtml(title)}</h2>`)
    if (Array.isArray(paragraphs)) {
      textBlocks.push(...paragraphs.filter(Boolean).map((text) => `<p class="mt-3 text-gray-700">${escapeHtml(text)}</p>`))
    }
    if (Array.isArray(bullets) && bullets.length) {
      textBlocks.push(`<ul class="mt-3 list-disc space-y-2 pl-5 text-gray-700">${bullets
        .filter(Boolean)
        .map((text) => `<li>${escapeHtml(text)}</li>`)
        .join('')}</ul>`)
    }
    if (!textBlocks.length) return ''
    return `<section class="mt-8">${textBlocks.join('')}</section>`
  }

  const renderQuickLinksSection = ({ lang = DEFAULT_LANG, bundle = {}, baseKey } = {}) => {
    const leftTitle = pick(bundle, `${baseKey}.quickLinks.mainSite`) || 'Explore Pixel Art Village'
    const rightTitle = pick(bundle, `${baseKey}.quickLinks.popularConverters`) || 'Popular converters'
    const leftLinks = [
      { href: buildLocalizedPath(lang, '/'), label: pick(bundle, `${baseKey}.quickLinks.links.home`) || pick(bundle, 'nav.home') || 'Home' },
      { href: buildLocalizedPath(lang, '/about'), label: pick(bundle, `${baseKey}.quickLinks.links.about`) || pick(bundle, 'nav.about') || 'About' },
      { href: buildLocalizedPath(lang, '/contact'), label: pick(bundle, `${baseKey}.quickLinks.links.contact`) || pick(bundle, 'nav.contact') || 'Contact' },
      { href: buildLocalizedPath(lang, '/blog'), label: pick(bundle, `${baseKey}.quickLinks.links.blog`) || pick(bundle, 'nav.blog') || 'Blog' },
    ]
    const rightLinks = [
      { href: buildLocalizedPath(lang, '/converter/png-to-pixel-art'), label: pick(bundle, `${baseKey}.quickLinks.links.png`) || pick(bundle, 'footer.links.png2pixel') || 'PNG to Pixel Art' },
      { href: buildLocalizedPath(lang, '/converter/jpg-to-pixel-art'), label: pick(bundle, `${baseKey}.quickLinks.links.jpg`) || pick(bundle, 'footer.links.jpg2pixel') || 'JPG to Pixel Art' },
      { href: buildLocalizedPath(lang, '/converter/image-to-pixel-art'), label: pick(bundle, `${baseKey}.quickLinks.links.image`) || pick(bundle, 'footer.links.imageToPixel') || 'Image to Pixel Art' },
      { href: buildLocalizedPath(lang, '/converter/photo-to-pixel-art'), label: pick(bundle, `${baseKey}.quickLinks.links.photo`) || pick(bundle, 'footer.links.converter') || 'Photo to Pixel Art' },
    ]
    const sectionTitle = pick(bundle, `${baseKey}.quickLinks.heading`) || 'Quick links'
    return `<section class="mt-10 border-t border-gray-200 pt-8"><h2 class="text-xl font-semibold text-gray-900">${escapeHtml(sectionTitle)}</h2><div class="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2"><div><h3 class="text-sm font-semibold uppercase tracking-wide text-gray-500">${escapeHtml(leftTitle)}</h3><ul class="mt-3 space-y-2">${leftLinks
      .map((link) => `<li><a class="text-blue-600 hover:underline" href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></li>`)
      .join('')}</ul></div><div><h3 class="text-sm font-semibold uppercase tracking-wide text-gray-500">${escapeHtml(rightTitle)}</h3><ul class="mt-3 space-y-2">${rightLinks
      .map((link) => `<li><a class="text-blue-600 hover:underline" href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></li>`)
      .join('')}</ul></div></div></section>`
  }

  const renderPrivacyVisible = ({ lang = DEFAULT_LANG, bundle = {}, title = '' } = {}) => {
    const today = new Date().toISOString().slice(0, 10)
    const heading = escapeHtml(pick(bundle, 'privacy.h1') || cleanTitle(title))
    const lastUpdated = formatTemplate(pick(bundle, 'common.lastUpdated') || 'Last updated: {{date}}', { date: today })
    const sections = [
      renderPolicySection({
        title: pick(bundle, 'privacy.sections.overview.title'),
        paragraphs: [pick(bundle, 'privacy.sections.overview.p1')],
      }),
      renderPolicySection({
        title: pick(bundle, 'privacy.sections.local.title'),
        paragraphs: [pick(bundle, 'privacy.sections.local.p1')],
      }),
      renderPolicySection({
        title: pick(bundle, 'privacy.sections.collect.title'),
        paragraphs: [pick(bundle, 'privacy.sections.collect.p2')],
        bullets: [
          pick(bundle, 'privacy.sections.collect.li1'),
          pick(bundle, 'privacy.sections.collect.li2'),
          pick(bundle, 'privacy.sections.collect.li3'),
        ],
      }),
      renderPolicySection({
        title: pick(bundle, 'privacy.sections.cookies.title'),
        paragraphs: [pick(bundle, 'privacy.sections.cookies.p1')],
        bullets: [
          pick(bundle, 'privacy.sections.cookies.learn'),
          pick(bundle, 'privacy.sections.cookies.manage'),
          pick(bundle, 'privacy.sections.cookies.more'),
        ],
      }),
      renderPolicySection({
        title: pick(bundle, 'privacy.sections.third.title'),
        paragraphs: [pick(bundle, 'privacy.sections.third.p1')],
      }),
      renderPolicySection({
        title: pick(bundle, 'privacy.sections.use.title'),
        bullets: [
          pick(bundle, 'privacy.sections.use.li1'),
          pick(bundle, 'privacy.sections.use.li2'),
          pick(bundle, 'privacy.sections.use.li3'),
        ],
      }),
      renderPolicySection({
        title: pick(bundle, 'privacy.sections.rights.title'),
        bullets: [
          pick(bundle, 'privacy.sections.rights.li1'),
          pick(bundle, 'privacy.sections.rights.li2'),
          pick(bundle, 'privacy.sections.rights.li3'),
        ],
      }),
      renderPolicySection({
        title: pick(bundle, 'privacy.sections.children.title'),
        paragraphs: [pick(bundle, 'privacy.sections.children.p1')],
      }),
      renderPolicySection({
        title: pick(bundle, 'privacy.sections.changes.title'),
        paragraphs: [pick(bundle, 'privacy.sections.changes.p1')],
      }),
    ].filter(Boolean).join('')
    const quickLinksHtml = renderQuickLinksSection({ lang, bundle, baseKey: 'privacy' })
    return `<main class="container mx-auto px-4 py-10 max-w-4xl"><header><h1 class="text-2xl font-bold text-gray-900">${heading}</h1><p class="mt-2 text-sm text-gray-500">${escapeHtml(lastUpdated)}</p></header>${sections}${quickLinksHtml}</main>`
  }

  const renderTermsVisible = ({ lang = DEFAULT_LANG, bundle = {}, title = '' } = {}) => {
    const today = new Date().toISOString().slice(0, 10)
    const heading = escapeHtml(pick(bundle, 'terms.h1') || cleanTitle(title))
    const lastUpdated = formatTemplate(pick(bundle, 'common.lastUpdated') || 'Last updated: {{date}}', { date: today })
    const sections = [
      renderPolicySection({
        title: pick(bundle, 'terms.sections.acceptance.title'),
        paragraphs: [pick(bundle, 'terms.sections.acceptance.p1')],
      }),
      renderPolicySection({
        title: pick(bundle, 'terms.sections.use.title'),
        bullets: [
          pick(bundle, 'terms.sections.use.li1'),
          pick(bundle, 'terms.sections.use.li2'),
          pick(bundle, 'terms.sections.use.li3'),
        ],
      }),
      renderPolicySection({
        title: pick(bundle, 'terms.sections.ip.title'),
        paragraphs: [pick(bundle, 'terms.sections.ip.p1')],
      }),
      renderPolicySection({
        title: pick(bundle, 'terms.sections.processing.title'),
        paragraphs: [pick(bundle, 'terms.sections.processing.p1')],
      }),
      renderPolicySection({
        title: pick(bundle, 'terms.sections.disclaimer.title'),
        paragraphs: [pick(bundle, 'terms.sections.disclaimer.p1')],
      }),
      renderPolicySection({
        title: pick(bundle, 'terms.sections.liability.title'),
        paragraphs: [pick(bundle, 'terms.sections.liability.p1')],
      }),
      renderPolicySection({
        title: pick(bundle, 'terms.sections.changes.title'),
        paragraphs: [pick(bundle, 'terms.sections.changes.p1')],
      }),
      renderPolicySection({
        title: pick(bundle, 'terms.sections.law.title'),
        paragraphs: [pick(bundle, 'terms.sections.law.p1')],
      }),
    ].filter(Boolean).join('')
    const quickLinksHtml = renderQuickLinksSection({ lang, bundle, baseKey: 'terms' })
    return `<main class="container mx-auto px-4 py-10 max-w-4xl"><header><h1 class="text-2xl font-bold text-gray-900">${heading}</h1><p class="mt-2 text-sm text-gray-500">${escapeHtml(lastUpdated)}</p></header>${sections}${quickLinksHtml}</main>`
  }

  const renderHomeVisible = ({ lang = DEFAULT_LANG, title = '', description = '', bundle = {}, blogPosts = [] } = {}) => {
    const heading = escapeHtml(cleanTitle(title))
    const desc = description
      ? `<p class="text-gray-700 mt-3 text-center max-w-2xl mx-auto">${escapeHtml(description)}</p>`
      : ''

    const siteLinks = [
      { href: buildLocalizedPath(lang, '/converter/image-to-pixel-art'), label: pick(bundle, 'footer.links.generator') || 'Image to Pixel Art Converter' },
      { href: buildLocalizedPath(lang, '/converter/photo-to-pixel-art'), label: pick(bundle, 'footer.links.converter') || 'Photo to Pixel Art Converter' },
      { href: buildLocalizedPath(lang, '/converter/png-to-pixel-art'), label: pick(bundle, 'footer.links.png2pixel') || 'PNG to Pixel Art' },
      { href: buildLocalizedPath(lang, '/converter/jpg-to-pixel-art'), label: pick(bundle, 'footer.links.jpg2pixel') || 'JPG to Pixel Art' },
      { href: buildLocalizedPath(lang, '/blog'), label: pick(bundle, 'nav.blog') || 'Blog' },
      { href: buildLocalizedPath(lang, '/about'), label: pick(bundle, 'nav.about') || 'About' },
      { href: buildLocalizedPath(lang, '/contact'), label: pick(bundle, 'nav.contact') || 'Contact' },
      { href: buildLocalizedPath(lang, '/privacy'), label: pick(bundle, 'footer.privacy') || 'Privacy' },
      { href: buildLocalizedPath(lang, '/terms'), label: pick(bundle, 'footer.terms') || 'Terms' },
    ]

    const faqHtml = renderFaqCardsSection({ bundle, count: 3 })

    const exploreHeading = escapeHtml(pick(bundle, 'footer.explore') || 'Explore')
    const linkHtml = `<section class="mt-8"><h2 class="text-xl font-semibold text-gray-900">${exploreHeading}</h2><ul class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">${siteLinks
      .map((link) => `<li><a class="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 hover:border-blue-300 hover:text-blue-600" href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></li>`)
      .join('')}</ul></section>`

    const recentPosts = Array.isArray(blogPosts) ? blogPosts.slice(0, 3) : []
    const recentPostsHtml = recentPosts.length
      ? `<section class="mt-8"><h2 class="text-xl font-semibold text-gray-900">${escapeHtml(pick(bundle, 'blog.title') || 'Blog')}</h2><ul class="mt-4 space-y-3">${recentPosts
          .map((post) => {
            const href = buildLocalizedPath(lang, `/blog/${post.slug}`)
            const excerpt = post.excerpt ? `<p class="mt-1 text-sm text-gray-700">${escapeHtml(post.excerpt)}</p>` : ''
            return `<li class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"><a class="text-base font-semibold text-blue-600 hover:underline" href="${escapeHtml(href)}">${escapeHtml(post.title || post.slug)}</a>${excerpt}</li>`
          })
          .join('')}</ul></section>`
      : ''

    if (!heading && !desc && !faqHtml && !linkHtml && !recentPostsHtml) return ''
    return `<main class="container mx-auto px-4 py-10 max-w-4xl"><section><h1 class="text-2xl font-bold text-gray-900 text-center">${heading}</h1>${desc}</section>${linkHtml}${faqHtml}${recentPostsHtml}</main>`
  }

  const buildFaqJsonLd = (bundle = {}) => {
    const items = Array.isArray(pick(bundle, 'faq.items'))
      ? pick(bundle, 'faq.items').filter((item) => item && item.question && item.answer)
      : []
    if (!items.length) return null

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: normalizeWhitespace(item.question),
        acceptedAnswer: {
          '@type': 'Answer',
          text: normalizeWhitespace(item.answer),
        },
      })),
    }
  }

  const buildHomeJsonLd = ({ lang = DEFAULT_LANG, bundle = {}, title = '', description = '' } = {}) => {
    const siteName = pick(bundle, 'site.name') || 'Pixel Art Village'
    const homeTitle = normalizeWhitespace(title || pick(bundle, 'home.seoTitle') || `${siteName} | Image to Pixel Art Converter`)
    const homeDescription = shortenText(
      description || pick(bundle, 'home.seoDescription') || 'Image to pixel art online with live preview, palettes, and private export.',
    )
    const faqJsonLd = buildFaqJsonLd(bundle)

    return [
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: homeTitle,
        url: 'https://pixelartvillage.org/',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        description: homeDescription,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        inLanguage: SUPPORTED_LANGS,
        browserRequirements: 'HTML5, JavaScript enabled',
        softwareVersion: '2.0',
        author: {
          '@type': 'Organization',
          name: siteName,
        },
        screenshot: ABS('/social-preview.png'),
      },
      faqJsonLd,
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://pixelartvillage.org/' },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteName,
        url: 'https://pixelartvillage.org/',
        description: homeDescription,
        inLanguage: SUPPORTED_LANGS,
      },
    ].filter(Boolean)
  }

  const getMetaDescription = (metas = []) => {
    const entry = metas.find(m => m && m.name === 'description')
    return entry?.content || ''
  }

  const syncDescriptionMetas = (metas = []) => {
    const description = shortenText(getMetaDescription(metas))
    if (!description) return metas

    return metas.map((meta) => {
      if (!meta) return meta
      if (meta.name === 'description' || meta.property === 'og:description' || meta.name === 'twitter:description') {
        return { ...meta, content: description }
      }
      return meta
    })
  }

  const syncTitleMetas = (metas = [], title = '') => {
    const normalizedTitle = shortenSeoTitle(title)
    if (!normalizedTitle) return metas

    return metas.map((meta) => {
      if (!meta) return meta
      if (meta.property === 'og:title' || meta.name === 'twitter:title') {
        return { ...meta, content: normalizedTitle }
      }
      return meta
    })
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
    ],
      jsonLd: ({ lang, bundle, title, description }) => buildHomeJsonLd({ lang, bundle, title, description }),
      visible: ({ lang, bundle, title, description }) => renderHomeVisible({
        lang,
        bundle,
        title,
        description,
        blogPosts: blogPostsByLang[lang],
      }),
    },
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
    ],
      visible: ({ lang, bundle, title }) => renderPrivacyVisible({ lang, bundle, title }),
    },
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
    ],
      visible: ({ lang, bundle, title }) => renderTermsVisible({ lang, bundle, title }),
    },
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
      visible: ({ lang, bundle, title, description }) => renderAboutVisible({
        lang,
        bundle,
        title,
        description,
        blogPosts: blogPostsByLang[lang],
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
    ],
      visible: ({ lang, bundle, title, description }) => renderContactVisible({
        lang,
        bundle,
        title,
        description,
        blogPosts: blogPostsByLang[lang],
      }),
    },
  ]

  const pseoPages = resolveContent('pseo-pages', DEFAULT_LANG, normalizePseoPages)
  for (const p of pseoPages) {
    if (!p || !p.slug) continue
    const url = ensureTrailingSlash(`/converter/${p.slug}`)
    routes.push({
      path: url,
      title: p.title,
      metas: [
        { name: 'description', content: shortenText(p.metaDescription || '') },
        { property: 'og:url', content: ABS(url) },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: p.title },
        { property: 'og:description', content: shortenText(p.metaDescription || '') },
        { property: 'og:image', content: ABS(`/pseo-og/${p.slug}.png`) },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: p.title },
        { name: 'twitter:description', content: shortenText(p.metaDescription || '') },
        { name: 'twitter:image', content: ABS(`/pseo-og/${p.slug}.png`) },
      ],
      jsonLd: ({ lang, routePath }) => [
        {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: p.h1 || p.title,
          description: shortenText(p.metaDescription || ''),
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
          description: shortenText(p.metaDescription || ''),
          inLanguage: lang,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
      ],
      visible: ({ lang, bundle }) => renderPseoVisible(p, { lang, bundle, pages: pseoPages }),
      initialContent: ({ routePath }) => ({
        baseName: 'pseo-pages',
        locale: DEFAULT_LANG,
        path: routePath,
        data: pseoPages,
      }),
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
    const blogSeoTitle = pick(bundle, 'blog.seoTitle') || `${blogTitle} | ${siteName}`
    const blogSubtitle =
      pick(bundle, 'blog.subtitle') || 'Articles and updates about making pixel image visuals, tutorials, and new features.'
    const blogPath = buildBlogPath(lang)

    blogRoutes.push({
      lang,
      path: blogPath,
      routePath: blogPath,
      basePath: '/blog/',
      title: blogSeoTitle,
      metas: [
        { name: 'description', content: shortenText(blogSubtitle) },
        { property: 'og:url', content: ABS(blogPath) },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: blogSeoTitle },
        { property: 'og:description', content: shortenText(blogSubtitle) },
        { property: 'og:image', content: ABS('/blog-og/_index.png') },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: blogSeoTitle },
        { name: 'twitter:description', content: shortenText(blogSubtitle) },
        { name: 'twitter:image', content: ABS('/blog-og/_index.png') },
      ],
      extras: renderBlogIndex(postsForLang),
      visible: renderBlogIndexVisible(postsForLang, lang, bundle),
      alternates: buildBlogAlternates(),
      initialContent: {
        baseName: 'blog-posts',
        locale: lang,
        path: blogPath,
        data: postsForLang,
      },
    })

    for (const post of postsForLang) {
      if (!post?.slug) continue
      const postPath = buildBlogPath(lang, post.slug)
      const ogImage = blogImageExists(post.slug) ? ABS(`/blog-og/${post.slug}.png`) : ABS('/blog-og/_index.png')
      const seoTitle = formatBlogSeoTitle(post.title, siteName)
      const seoDescription = shortenText(post.excerpt || '')
      blogRoutes.push({
        lang,
        path: postPath,
        routePath: postPath,
        basePath: ensureTrailingSlash(`/blog/${post.slug}`),
        title: seoTitle,
        metas: [
          { name: 'description', content: seoDescription },
          { property: 'og:url', content: ABS(postPath) },
          { property: 'og:type', content: 'article' },
          { property: 'og:title', content: seoTitle },
          { property: 'og:description', content: seoDescription },
          { property: 'og:image', content: ogImage },
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:title', content: seoTitle },
          { name: 'twitter:description', content: seoDescription },
          { name: 'twitter:image', content: ogImage },
        ],
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: seoDescription,
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
        visible: renderBlogPostWithRelatedVisible(post, postsForLang, lang, bundle),
        alternates: buildBlogAlternates(post.slug),
        initialContent: {
          baseName: 'blog-posts',
          locale: lang,
          path: postPath,
          data: postsForLang,
        },
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
      const tTitle = pick(bundle, 'blog.seoTitle') || `${pick(bundle, 'blog.title') || 'Blog'} | Pixel Art Village`
      const tDesc = pick(bundle, 'blog.subtitle')
      if (typeof tTitle === 'string' && tTitle) title = tTitle
      if (typeof tDesc === 'string' && tDesc) upsertDesc(tDesc)
    }

    title = shortenSeoTitle(title)
    metas = syncDescriptionMetas(metas)
    metas = syncTitleMetas(metas, title)

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
    const resolvedInitialContent = typeof r.initialContent === 'function'
      ? r.initialContent({ lang, bundle, title, description, routePath: localizedPath })
      : r.initialContent
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
      initialContent: resolvedInitialContent,
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
    let appHtml = ''
    try {
      appHtml = await ssr.renderApp(r.path, {
        lang: r.lang || DEFAULT_LANG,
        initialContent: r.initialContent || null,
      })
    } catch (error) {
      console.warn(`[prerender] warn: SSR failed for ${r.path} -> ${error.message}`)
    }
    if (appHtml) {
      const normalizedSsr = extractHydrationUnsafeHeadTags(appHtml)
      out = injectHeadTags(out, normalizedSsr.headTags)
      out = injectAppContent(out, normalizedSsr.appHtml)
    } else if (r.visible) {
      out = injectVisibleContent(out, r.visible)
    }
    if (r.initialContent) {
      out = injectInitialContent(out, r.initialContent)
    }
    out = injectInitialI18n(out, buildInitialI18nPayload(r.lang || DEFAULT_LANG))

    const file = path.join(DIST, r.path.replace(/^\//, '').replace(/\/$/, ''), 'index.html')
    write(file, out)
    console.log('[prerender]', r.path, '→', path.relative(DIST, file))
  }
  } finally {
    await ssr.close()
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

function buildInitialI18nPayload(lang) {
  const resolvedLang = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG
  if (resolvedLang === DEFAULT_LANG) return null

  const activeTranslation = loadLocaleBundle(resolvedLang)
  if (!activeTranslation || !Object.keys(activeTranslation).length) return null

  return {
    lang: resolvedLang,
    resources: {
      [DEFAULT_LANG]: {
        translation: loadLocaleBundle(DEFAULT_LANG),
      },
      [resolvedLang]: {
        translation: activeTranslation,
      },
    },
  }
}

function pick(obj, pathStr) {
  try {
    return String(pathStr).split('.').reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj)
  } catch {
    return undefined
  }
}

try {
  Promise.resolve(prerender())
    .then(() => {
      console.log('[prerender] done')
    })
    .catch((e) => {
      console.error('[prerender] failed:', e && e.stack || e)
      process.exit(1)
    })
} catch (e) {
  console.error('[prerender] failed:', e && e.stack || e)
  process.exit(1)
}
