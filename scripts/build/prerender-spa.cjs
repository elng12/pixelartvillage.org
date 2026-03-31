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

  const BLOG_POST_META = {
    'best-pixel-art-converters-compared-2025': {
      badge: 'Comparison',
      chipClass: 'border-amber-200 bg-amber-50 text-amber-800',
      sectionId: 'compare-tools',
      bestFor: 'Choosing the right converter before you invest time in one workflow.',
      whyRead: 'Use this as the hub page when you want the clearest overview of privacy, control, and output tradeoffs.',
      nextStep: 'Read the beginner guide next if you want to test one workflow immediately after comparing tools.',
    },
    'how-to-make-pixel-art-in-photoshop': {
      badge: 'Photoshop',
      chipClass: 'border-indigo-200 bg-indigo-50 text-indigo-800',
      sectionId: 'workflow-export',
      bestFor: 'Making cleaner pixel art in Photoshop without soft edges or blurry export.',
      whyRead: 'This guide focuses on resizing, hard edges, anti-aliasing, and color control instead of filter-heavy shortcuts.',
      nextStep: 'If you want faster testing, compare the Photoshop workflow with the browser converter next.',
    },
    'how-to-pixelate-an-image': {
      badge: 'Beginner',
      chipClass: 'border-sky-200 bg-sky-50 text-sky-800',
      sectionId: 'start-here',
      bestFor: 'First-time users who need a clean, low-friction starting workflow.',
      whyRead: 'This guide explains the main knobs in the simplest order: size first, palette second, cleanup third.',
      nextStep: 'If the result still feels weak after the first pass, move to the cleanup guide.',
    },
    'how-to-get-pixel-art-version-of-image': {
      badge: 'SNES-style',
      chipClass: 'border-cyan-200 bg-cyan-50 text-cyan-800',
      sectionId: 'turn-photos',
      bestFor: 'Turning a real photo into something that feels more like retro scene art.',
      whyRead: 'This workflow focuses on simplifying shapes and palette early so the result feels intentional, not filter-heavy.',
      nextStep: 'Pair it with the beginner guide if you want a more basic explanation of the controls first.',
    },
    'make-image-more-like-pixel': {
      badge: 'Cleanup',
      chipClass: 'border-emerald-200 bg-emerald-50 text-emerald-800',
      sectionId: 'fix-results',
      bestFor: 'Fixing blurry edges, muddy colors, and noisy dithering after the first conversion.',
      whyRead: 'Read this when your image is already pixelated but still does not look crisp or deliberate enough.',
      nextStep: 'If the source came from Illustrator, review the export guide before re-running the conversion.',
    },
    'export-from-illustrator-image-to-pixel-art': {
      badge: 'Illustrator',
      chipClass: 'border-rose-200 bg-rose-50 text-rose-800',
      sectionId: 'workflow-export',
      bestFor: 'Preparing vector artwork so it stays sharper before you convert it to pixel art.',
      whyRead: 'This guide helps you fix problems upstream, which is usually faster than trying to rescue blur later.',
      nextStep: 'After exporting cleanly, run the beginner workflow to dial in size, palette, and cleanup.',
    },
  }

  const INLINE_TOKEN_RE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s]+)/g

  const buildBlogPresentationMeta = (post = {}) => ({
    badge: 'Guide',
    chipClass: 'border-slate-200 bg-slate-50 text-slate-700',
    sectionId: 'start-here',
    bestFor: 'A focused walkthrough for image-to-pixel workflows.',
    whyRead: post.excerpt || 'Use this guide to improve the next conversion you run.',
    nextStep: 'Open the main converter and test the workflow on a real image.',
    ...(BLOG_POST_META[post.slug] || {}),
  })

  const getVisibleBlogCoverImages = () => ({
    before: ABS('/showcase-before-w640.jpg'),
    after: ABS('/showcase-after-w640.jpg'),
  })

  const countWords = (text = '') => String(text)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length

  const estimateVisibleBlogReadTime = (post = {}) => {
    const excerptWords = countWords(post.excerpt)
    const bodyWords = Array.isArray(post.body)
      ? post.body.reduce((total, line) => total + countWords(line), 0)
      : 0
    const minutes = Math.max(3, Math.ceil((excerptWords + bodyWords) / 210))
    return `${minutes} min read`
  }

  const localizeVisibleHref = (href, prefix = '') => {
    const normalized = String(href || '').trim()
    if (!normalized) return '#'

    try {
      const url = new URL(normalized)
      if (url.origin === 'https://pixelartvillage.org') {
        return localizeVisibleHref(`${url.pathname}${url.search}${url.hash}`, prefix)
      }
      return normalized
    } catch {
      if (!normalized.startsWith('/')) return normalized
      if (!prefix) return normalized
      if (normalized === '/') return `${prefix}/`
      if (normalized.startsWith(`${prefix}/`) || normalized === prefix) return normalized
      return `${prefix}${normalized}`
    }
  }

  const renderVisibleInlineContent = (text, prefix = '') => {
    const source = String(text || '')
    if (!source) return ''

    let output = ''
    let lastIndex = 0

    for (const match of source.matchAll(INLINE_TOKEN_RE)) {
      const token = match[0]
      const start = match.index ?? 0
      if (start > lastIndex) {
        output += escapeHtml(source.slice(lastIndex, start))
      }

      if (token.startsWith('**') && token.endsWith('**')) {
        output += `<strong>${escapeHtml(token.slice(2, -2))}</strong>`
      } else if (token.startsWith('[')) {
        const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (linkMatch) {
          const [, label, rawHref] = linkMatch
          const href = localizeVisibleHref(rawHref, prefix)
          output += `<a href="${escapeHtml(href)}" class="text-blue-700 underline underline-offset-4 transition-colors hover:text-blue-800">${escapeHtml(label)}</a>`
        } else {
          output += escapeHtml(token)
        }
      } else {
        const href = localizeVisibleHref(token, prefix)
        output += `<a href="${escapeHtml(href)}" class="text-blue-700 underline underline-offset-4 transition-colors hover:text-blue-800 break-all">${escapeHtml(token)}</a>`
      }

      lastIndex = start + token.length
    }

    if (lastIndex < source.length) {
      output += escapeHtml(source.slice(lastIndex))
    }

    return output
  }

  const parseVisibleHeadingLine = (line) => {
    const match = String(line || '').trim().match(/^(#{1,6})\s+(.+)$/)
    if (!match) return null

    let content = match[2].trim()
    let id = null
    const idMatch = content.match(/\s+\{#([A-Za-z0-9_-]+)\}$/)
    if (idMatch) {
      id = idMatch[1]
      content = content.replace(/\s+\{#([A-Za-z0-9_-]+)\}$/, '').trim()
    }

    return {
      level: Math.min(6, Math.max(2, match[1].length)),
      content,
      id,
    }
  }

  const slugifyVisibleHeading = (text = '') => {
    const slug = String(text)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return slug || 'section'
  }

  const parseVisibleBlogBody = (lines = []) => {
    const blocks = []
    let activeList = null

    const flushList = () => {
      if (activeList) {
        blocks.push(activeList)
        activeList = null
      }
    }

    for (const rawLine of Array.isArray(lines) ? lines : []) {
      const line = String(rawLine || '')
      const trimmed = line.trim()

      if (!trimmed) {
        flushList()
        continue
      }

      if (/^---+$/.test(trimmed)) {
        flushList()
        blocks.push({ type: 'divider' })
        continue
      }

      const heading = parseVisibleHeadingLine(trimmed)
      if (heading) {
        flushList()
        blocks.push({ type: 'heading', ...heading })
        continue
      }

      const unorderedItem = trimmed.match(/^[-•]\s+(.+)$/)
      if (unorderedItem) {
        if (!activeList || activeList.type !== 'unordered-list') {
          flushList()
          activeList = { type: 'unordered-list', items: [] }
        }
        activeList.items.push(unorderedItem[1])
        continue
      }

      const orderedItem = trimmed.match(/^\d+\.\s+(.+)$/)
      if (orderedItem) {
        if (!activeList || activeList.type !== 'ordered-list') {
          flushList()
          activeList = { type: 'ordered-list', items: [] }
        }
        activeList.items.push(orderedItem[1])
        continue
      }

      flushList()
      blocks.push({ type: 'paragraph', content: trimmed })
    }

    flushList()
    return blocks
  }

  const assignVisibleHeadingIds = (blocks = []) => {
    const usedIds = new Map()

    return blocks.map((block) => {
      if (block.type !== 'heading') return block

      const baseId = block.id || slugifyVisibleHeading(block.content)
      const nextCount = (usedIds.get(baseId) || 0) + 1
      usedIds.set(baseId, nextCount)

      return {
        ...block,
        id: nextCount === 1 ? baseId : `${baseId}-${nextCount}`,
      }
    })
  }

  const getVisibleEditorialNoteIndex = (blocks = []) => blocks.findIndex(
    (block) => block.type === 'paragraph' && /^Updated\b/i.test(String(block.content || '')),
  )

  const getVisibleTocItems = (blocks = []) => blocks
    .filter((block) => block.type === 'heading' && block.level === 2 && block.id)
    .map((block) => ({ id: block.id, label: block.content }))

  const stripVisibleInlineMarkdown = (text = '') => String(text || '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()

  const extractVisibleFaqItems = (lines = []) => {
    const blocks = assignVisibleHeadingIds(parseVisibleBlogBody(lines))
    const items = []
    let inFaqSection = false
    let activeQuestion = null
    let answerParts = []

    const pushActiveItem = () => {
      if (!activeQuestion || !answerParts.length) return
      items.push({
        question: activeQuestion,
        answer: answerParts.join(' ').trim(),
      })
    }

    for (const block of blocks) {
      if (block.type === 'heading' && block.level === 2) {
        if (inFaqSection) pushActiveItem()
        inFaqSection = /^faq$/i.test(String(block.content || '').trim())
        activeQuestion = null
        answerParts = []
        continue
      }

      if (!inFaqSection) continue

      if (block.type === 'heading' && block.level === 3) {
        pushActiveItem()
        activeQuestion = stripVisibleInlineMarkdown(block.content)
        answerParts = []
        continue
      }

      if (!activeQuestion) continue

      if (block.type === 'paragraph') {
        const normalized = stripVisibleInlineMarkdown(block.content)
        if (normalized) answerParts.push(normalized)
      }

      if (block.type === 'unordered-list' || block.type === 'ordered-list') {
        const normalized = block.items
          .map((item) => stripVisibleInlineMarkdown(item))
          .filter(Boolean)
          .join(' ')
        if (normalized) answerParts.push(normalized)
      }
    }

    if (inFaqSection) pushActiveItem()
    return items
  }

  const renderVisibleBlogBodyBlocks = (blocks = [], { skipIndexes = [], prefix = '' } = {}) => {
    const hidden = new Set(skipIndexes)

    return blocks
      .map((block, index) => {
        if (hidden.has(index)) return ''

        if (block.type === 'heading') {
          const tag = `h${block.level}`
          const className = block.level === 2
            ? 'scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 md:text-[2rem]'
            : 'scroll-mt-28 text-xl font-semibold tracking-tight text-slate-900 md:text-[1.35rem]'
          return `<${tag} id="${escapeHtml(block.id || '')}" class="${className}">${renderVisibleInlineContent(block.content, prefix)}</${tag}>`
        }

        if (block.type === 'unordered-list') {
          return `<ul class="list-disc space-y-3 pl-5 text-[1.02rem] leading-8 text-slate-700 marker:text-slate-400">${block.items
            .map((item) => `<li>${renderVisibleInlineContent(item, prefix)}</li>`)
            .join('')}</ul>`
        }

        if (block.type === 'ordered-list') {
          return `<ol class="list-decimal space-y-3 pl-5 text-[1.02rem] leading-8 text-slate-700 marker:text-slate-400">${block.items
            .map((item) => `<li>${renderVisibleInlineContent(item, prefix)}</li>`)
            .join('')}</ol>`
        }

        if (block.type === 'divider') {
          return '<hr class="my-6 border-slate-200">'
        }

        return `<p class="text-[1.04rem] leading-8 text-slate-700">${renderVisibleInlineContent(block.content, prefix)}</p>`
      })
      .filter(Boolean)
      .join('')
  }

  const renderVisibleBlogCard = (post, prefix = '') => {
    if (!post || !post.slug) return ''
    const href = `${prefix}/blog/${escapeHtml(post.slug)}/`
    const presentation = buildBlogPresentationMeta(post)
    return `<article class="blog-simple-card px-6 py-6 md:px-8 md:py-8">
      <div class="flex flex-wrap items-center gap-3">
        <span class="inline-flex items-center rounded-full border px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] ${escapeHtml(presentation.chipClass)}">${escapeHtml(presentation.badge)}</span>
      </div>
      <h2 class="mt-4 max-w-3xl text-balance text-[1.24rem] font-semibold tracking-tight text-slate-950 md:text-[1.45rem] md:leading-[1.24]"><a href="${href}" class="transition-colors hover:text-blue-700">${escapeHtml(post.title || '')}</a></h2>
      <p class="mt-4 text-[0.98rem] leading-8 text-slate-600">${escapeHtml(post.excerpt || '')}</p>
      <div class="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <span>${escapeHtml(post.date || '')}</span>
        <span aria-hidden="true" class="text-slate-300">•</span>
        <span>${escapeHtml(estimateVisibleBlogReadTime(post))}</span>
      </div>
      <div class="mt-6"><a href="${href}" class="inline-flex items-center gap-2 text-base font-semibold text-blue-700 transition-colors hover:text-blue-800">Read more<span aria-hidden="true">→</span></a></div>
    </article>`
  }

  const renderBlogIndexVisible = (list = [], lang = DEFAULT_LANG, bundle = {}) => {
    if (!Array.isArray(list) || !list.length) return ''
    const prefix = lang === DEFAULT_LANG ? '' : `/${lang}`
    const blogHeading = pick(bundle, 'blog.title') || 'Blog'
    const blogKeywordHeading = pick(bundle, 'blog.h1') || 'Pixel Art Tutorials and Converter Guides'
    const blogSubtitle = pick(bundle, 'blog.subtitle') || 'Learn how to pixelate images, turn photos into pixel art, compare pixel art converters, and fix blurry or muddy retro-style results.'
    const listHtml = list.map((post) => renderVisibleBlogCard(post, prefix)).join('')

    return `<div class="container mx-auto max-w-4xl px-4 py-14 md:py-20">
      <header class="mx-auto max-w-3xl text-center">
        <h1 class="text-3xl font-semibold tracking-tight text-slate-950 md:text-[2.35rem] md:leading-[1.08]">${escapeHtml(blogHeading)}<span class="sr-only"> — ${escapeHtml(blogKeywordHeading)}</span></h1>
        <p class="mt-4 text-[0.98rem] leading-8 text-slate-600 md:text-[1.05rem] md:leading-8">${escapeHtml(blogSubtitle)}</p>
      </header>
      <section class="mt-12 space-y-7">
        ${listHtml}
      </section>
    </div>`
  }

  const renderBlogPostVisible = (post, lang = DEFAULT_LANG, bundle = {}, relatedHtml = '') => {
    if (!post || !post.slug) return ''
    const prefix = lang === DEFAULT_LANG ? '' : `/${lang}`
    const backLabel = pick(bundle, 'blog.back') || 'Back to Blog'
    const bodyBlocks = assignVisibleHeadingIds(parseVisibleBlogBody(post.body))
    const editorialNoteIndex = getVisibleEditorialNoteIndex(bodyBlocks)
    const editorialNote = editorialNoteIndex >= 0 ? bodyBlocks[editorialNoteIndex] : null
    const tocItems = getVisibleTocItems(bodyBlocks)
    const tocHtml = tocItems.length
      ? `<nav class="mt-8 flex flex-wrap justify-center gap-2">
          ${tocItems.map((item) => `<a href="#${escapeHtml(item.id)}" class="blog-anchor-chip">${escapeHtml(item.label)}</a>`).join('')}
        </nav>`
      : ''

    const contentHtml = renderVisibleBlogBodyBlocks(bodyBlocks, {
      skipIndexes: [editorialNoteIndex].filter((index) => index >= 0),
      prefix,
    })

    const presentation = buildBlogPresentationMeta(post)
    const coverImages = getVisibleBlogCoverImages()
    const coverHtml = `<section class="blog-cover-shell mt-7" aria-label="Article cover preview">
      <div class="blog-cover-grid">
        <figure class="blog-cover-panel">
          <img src="${escapeHtml(coverImages.before)}" alt="Original source image preview" class="blog-cover-image" loading="eager">
          <figcaption class="blog-cover-label">Source image</figcaption>
        </figure>
        <figure class="blog-cover-panel">
          <img src="${escapeHtml(coverImages.after)}" alt="${escapeHtml(post.title || '')} pixel art preview" class="blog-cover-image" loading="eager">
          <figcaption class="blog-cover-label">Pixel art result</figcaption>
        </figure>
      </div>
      <div class="blog-cover-note">
        <span class="inline-flex items-center rounded-full border px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] ${escapeHtml(presentation.chipClass)}">${escapeHtml(presentation.badge)}</span>
        <p class="text-sm leading-7 text-slate-600 md:text-[0.98rem]">${escapeHtml(presentation.bestFor)}</p>
      </div>
    </section>`

    return `<article class="container mx-auto max-w-4xl px-4 py-14 md:py-20">
      <div class="mx-auto max-w-3xl">
        <div class="text-center">
          <a href="${prefix}/blog/" class="inline-flex items-center gap-2 text-sm font-medium text-blue-700 transition-colors hover:text-blue-800"><span aria-hidden="true">←</span>${escapeHtml(backLabel)}</a>
        </div>

        <section class="blog-article-card mt-6 px-6 py-8 md:px-12 md:py-12">
          <header class="text-center">
            <div class="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500">
              <span>${escapeHtml(post.date || '')}</span>
              <span aria-hidden="true" class="text-slate-300">•</span>
              <span>${escapeHtml(estimateVisibleBlogReadTime(post))}</span>
            </div>
            <h1 class="mx-auto mt-4 max-w-xl text-balance text-[1.82rem] font-semibold tracking-tight text-slate-950 md:text-[2.02rem] md:leading-[1.14]">${escapeHtml(post.title || '')}</h1>
            ${coverHtml}
            <p class="mx-auto mt-7 max-w-[42rem] text-[1.05rem] leading-8 text-slate-600 md:text-[1.1rem]">${escapeHtml(post.excerpt || '')}</p>
          </header>

          ${tocHtml}

          <div class="blog-article-prose mt-12">
            ${editorialNote ? `<p class="text-sm leading-7 text-slate-500">${renderVisibleInlineContent(editorialNote.content, prefix)}</p>` : ''}
            ${contentHtml}
          </div>
        </section>

        ${relatedHtml}

        <div class="mt-8 text-center">
          <a href="${prefix}/blog/" class="btn-primary inline-flex items-center justify-center">Back to Blog</a>
        </div>
      </div>
    </article>`
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
    const prefix = lang === DEFAULT_LANG ? '' : `/${lang}`
    const related = getRelatedBlogPosts(posts, post.slug, 3)
    const relatedHtml = related.length
      ? `<section class="mt-12">
          <h2 class="text-xl font-semibold tracking-tight text-slate-950">Related Articles</h2>
          <div class="mt-4 grid gap-4 md:grid-cols-2">
            ${related.slice(0, 2).map((item) => `<article class="blog-simple-card px-5 py-5">
              <h3 class="text-lg font-semibold tracking-tight text-slate-950"><a href="${prefix}/blog/${escapeHtml(item.slug)}/" class="transition-colors hover:text-blue-700">${escapeHtml(item.title || item.slug)}</a></h3>
              <p class="mt-3 text-sm leading-7 text-slate-600">${escapeHtml(item.excerpt || '')}</p>
              <div class="mt-4"><a href="${prefix}/blog/${escapeHtml(item.slug)}/" class="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800">Read more<span aria-hidden="true">→</span></a></div>
            </article>`).join('')}
          </div>
        </section>`
      : ''

    return renderBlogPostVisible(post, lang, bundle, relatedHtml)
  }

  const cleanTitle = (text) => String(text || '')
    .replace(/\s*\|\s*Pixel Art Village\s*$/i, '')
    .replace(/\s*–\s*Pixel Art Village\s*$/i, '')
    .replace(/\s*-\s*Pixel Art Village\s*$/i, '')
    .trim()

  const formatBlogSeoTitle = (title, siteName) => {
    const normalizedTitle = String(title || '').trim()
    const normalizedSiteName = String(siteName || '').trim()

    if (!normalizedTitle && !normalizedSiteName) return ''
    if (!normalizedTitle) return normalizedSiteName
    if (!normalizedSiteName) return normalizedTitle

    return `${normalizedTitle} | ${normalizedSiteName}`
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

  const renderHomeVisible = ({ lang = DEFAULT_LANG, title = '', description = '', bundle = {} } = {}) => {
    const heading = escapeHtml(
      pick(bundle, 'home.heroTitle')
        || cleanTitle(title)
        || pick(bundle, 'home.seoTitle')
        || 'Image to Pixel Art Converter',
    )
    const introParts = [
      pick(bundle, 'home.heroSubtitle') || description,
      pick(bundle, 'home.heroSubtitle2'),
    ].filter(Boolean)
    const introHtml = introParts
      .map((text) => `<p class="text-gray-700 mt-3 text-center max-w-2xl mx-auto">${escapeHtml(text)}</p>`)
      .join('')
    const primaryCtaLabel = pick(bundle, 'home.primaryCtaLabel') || 'Open the full image to pixel art converter'
    const primaryCtaHelp = pick(bundle, 'home.primaryCtaHelp')
    const primaryCtaHref = buildLocalizedPath(lang, '/converter/image-to-pixel-art')
    const primaryCtaHtml = `<div class="mt-5 flex flex-col items-center gap-2"><a class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white" href="${escapeHtml(primaryCtaHref)}">${escapeHtml(primaryCtaLabel)}</a>${primaryCtaHelp ? `<p class="text-sm text-gray-600">${escapeHtml(primaryCtaHelp)}</p>` : ''}</div>`

    const featuredTools = [
      {
        href: buildLocalizedPath(lang, '/converter/image-to-pixel-art'),
        title: pick(bundle, 'home.cards.mainConverter.title') || 'Image to Pixel Art Converter',
        description: pick(bundle, 'home.cards.mainConverter.description') || 'Best fit for general image-to-pixel-art conversions.',
      },
      {
        href: buildLocalizedPath(lang, '/converter/photo-to-pixel-art'),
        title: pick(bundle, 'home.cards.photoToPixel.title') || 'Photo to Pixel Art',
        description: pick(bundle, 'home.cards.photoToPixel.description') || 'Built for turning photos into readable retro pixel art.',
      },
      {
        href: buildLocalizedPath(lang, '/converter/photo-to-sprite-converter'),
        title: pick(bundle, 'home.cards.photoToSprite.title') || 'Photo to Sprite Converter',
        description: pick(bundle, 'home.cards.photoToSprite.description') || 'Use when you need smaller game-ready sprites.',
      },
      {
        href: buildLocalizedPath(lang, '/converter/png-to-pixel-art'),
        title: pick(bundle, 'home.cards.pngToPixel.title') || 'PNG to Pixel Art',
        description: pick(bundle, 'home.cards.pngToPixel.description') || 'Ideal for PNG files and crisp source artwork.',
      },
      {
        href: buildLocalizedPath(lang, '/converter/gif-to-pixel-art'),
        title: pick(bundle, 'home.cards.gifToPixel.title') || 'GIF to Pixel Art',
        description: pick(bundle, 'home.cards.gifToPixel.description') || 'Open this page when your source file is GIF.',
      },
    ].filter((tool) => tool.href && tool.title)

    const exploreHeading = escapeHtml(pick(bundle, 'home.exploreHeading') || 'Open the exact tool you need')
    const exploreIntro = pick(bundle, 'home.exploreIntro')
    const toolsHtml = featuredTools.length
      ? `<section class="mt-8"><h2 class="text-xl font-semibold text-gray-900">${exploreHeading}</h2>${exploreIntro ? `<p class="text-sm text-gray-700 mt-2 max-w-3xl">${escapeHtml(exploreIntro)}</p>` : ''}<ul class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">${featuredTools
          .map((tool) => `<li><a class="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-blue-300" href="${escapeHtml(tool.href)}"><h3 class="text-base font-semibold text-gray-900">${escapeHtml(tool.title)}</h3>${tool.description ? `<p class="mt-2 text-sm text-gray-700">${escapeHtml(tool.description)}</p>` : ''}</a></li>`)
          .join('')}</ul></section>`
      : ''

    if (!heading && !introHtml && !toolsHtml) return ''
    return `<main class="container mx-auto px-4 py-10 max-w-4xl"><section><h1 class="text-2xl font-bold text-gray-900 text-center">${heading}</h1>${introHtml}${primaryCtaHtml}</section>${toolsHtml}</main>`
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
    const homeTitle = normalizeWhitespace(title || pick(bundle, 'home.seoTitle') || `${siteName} | Private Pixel Art Tools & Converters`)
    const homeDescription = shortenText(
      description || pick(bundle, 'home.seoDescription') || 'Image to pixel art online with live preview, palettes, and private export.',
    )

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
    { path: '/', title: 'Image to Pixel Art Converter & Maker | Pixel Art Village', metas: [
      { name: 'description', content: 'Turn images into pixel art with live preview, palette controls, and private browser-based processing.' },
      { property: 'og:url', content: 'https://pixelartvillage.org/' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'Image to Pixel Art Converter & Maker | Pixel Art Village' },
      { property: 'og:description', content: 'Turn images into pixel art with live preview, palette controls, and private browser-based processing.' },
      { property: 'og:image', content: 'https://pixelartvillage.org/social-preview.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Image to Pixel Art Converter & Maker | Pixel Art Village' },
      { name: 'twitter:description', content: 'Turn images into pixel art with live preview, palette controls, and private browser-based processing.' },
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
        { name: 'twitter:card', content: 'summary_large_image' },
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
          supply: [{ '@type': 'HowToSupply', name: 'Image file (PNG/JPG/GIF/WEBP)' }],
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
    const blogIndexJsonLd = [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: pick(bundle, 'blog.h1') || 'Pixel Art Tutorials and Converter Guides',
        description: shortenText(blogSubtitle),
        url: ABS(blogPath),
        inLanguage: lang,
        isPartOf: {
          '@type': 'WebSite',
          name: siteName,
          url: 'https://pixelartvillage.org/',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: postsForLang.map((post, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: ABS(buildBlogPath(lang, post.slug)),
          name: post.title,
          description: shortenText(post.excerpt || ''),
        })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://pixelartvillage.org/' },
          { '@type': 'ListItem', position: 2, name: pick(bundle, 'blog.h1') || 'Blog', item: ABS(blogPath) },
        ],
      },
    ]

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
        { property: 'og:image:alt', content: 'Pixel Art Village blog preview' },
        { property: 'og:site_name', content: siteName },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: blogSeoTitle },
        { name: 'twitter:description', content: shortenText(blogSubtitle) },
        { name: 'twitter:image', content: ABS('/blog-og/_index.png') },
        { name: 'twitter:image:alt', content: 'Pixel Art Village blog preview' },
      ],
      jsonLd: blogIndexJsonLd,
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
      const postMeta = buildBlogPresentationMeta(post)
      const faqItems = extractVisibleFaqItems(post.body)
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
          { property: 'og:image:alt', content: `${post.title} article preview` },
          { property: 'og:site_name', content: siteName },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: seoTitle },
          { name: 'twitter:description', content: seoDescription },
          { name: 'twitter:image', content: ogImage },
          { name: 'twitter:image:alt', content: `${post.title} article preview` },
        ],
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: seoDescription,
            datePublished: post.date || undefined,
            dateModified: post.date || undefined,
            inLanguage: lang,
            articleSection: postMeta.badge,
            keywords: Array.isArray(post.tags) && post.tags.length ? post.tags.join(', ') : undefined,
            mainEntityOfPage: ABS(postPath),
            author: { '@type': 'Organization', name: siteName },
            publisher: { '@type': 'Organization', name: siteName },
            image: ogImage,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://pixelartvillage.org/' },
              { '@type': 'ListItem', position: 2, name: pick(bundle, 'blog.h1') || 'Blog', item: ABS(blogPath) },
              { '@type': 'ListItem', position: 3, name: post.title, item: ABS(postPath) },
            ],
          },
          ...(faqItems.length ? [{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }] : []),
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
