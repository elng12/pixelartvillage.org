import Seo from '@/components/Seo'
import LocalizedLink from '@/components/LocalizedLink'
import { useLocalizedContent } from '@/hooks/useLocalizedContent'
import { useLocaleContext } from '@/hooks/useLocaleContext'
import { estimateBlogReadTime, getBlogCoverImages, getBlogPresentationMeta } from '@/utils/blogPresentation'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

const BLOG_OG_IMAGE_SLUGS = new Set([
  'best-pixel-art-converters-compared-2025',
  'export-from-illustrator-image-to-pixel-art',
  'getting-started-pixel-art-maker',
  'how-to-get-pixel-art-version-of-image',
  'how-to-make-pixel-art-in-photoshop',
  'how-to-pixelate-an-image',
  'image-to-pixel-art-converter-free',
  'make-image-more-like-pixel',
  'photo-to-sprite-converter-tips',
  'turn-photo-into-pixel-art',
])

const INLINE_TOKEN_RE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s]+)/g

function buildBlogSeoTitle(title, siteName) {
  const normalizedTitle = String(title || '').trim()
  const normalizedSiteName = String(siteName || '').trim()

  if (!normalizedTitle && !normalizedSiteName) return ''
  if (!normalizedTitle) return normalizedSiteName
  if (!normalizedSiteName) return normalizedTitle

  return `${normalizedTitle} | ${normalizedSiteName}`
}

function resolveBlogOgImage(slug) {
  if (slug && BLOG_OG_IMAGE_SLUGS.has(slug)) {
    return `https://pixelartvillage.org/blog-og/${slug}.png`
  }
  return 'https://pixelartvillage.org/blog-og/_index.png'
}

function getRelatedPosts(posts = [], currentSlug, limit = 2) {
  const normalized = Array.isArray(posts) ? posts.filter((post) => post && post.slug) : []
  if (normalized.length <= 1) return []

  const currentIndex = normalized.findIndex((post) => post.slug === currentSlug)
  const startIndex = currentIndex >= 0 ? currentIndex : 0
  const related = []

  for (let step = 1; related.length < Math.min(limit, normalized.length - 1) && step <= normalized.length; step += 1) {
    const candidate = normalized[(startIndex + step) % normalized.length]
    if (!candidate || candidate.slug === currentSlug) continue
    if (!related.some((item) => item.slug === candidate.slug)) {
      related.push(candidate)
    }
  }

  return related
}

function normalizeInlineHref(href) {
  const normalized = String(href || '').trim()
  if (!normalized) return '#'

  try {
    const url = new URL(normalized)
    if (url.origin === 'https://pixelartvillage.org') {
      return `${url.pathname}${url.search}${url.hash}`
    }
  } catch {
    return normalized
  }

  return normalized
}

function slugifyHeading(text = '') {
  const slug = String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || 'section'
}

function parseHeadingLine(line) {
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

function parseBlogBody(lines = []) {
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

    const heading = parseHeadingLine(trimmed)
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

function assignHeadingIds(blocks = []) {
  const usedIds = new Map()

  return blocks.map((block) => {
    if (block.type !== 'heading') return block

    const baseId = block.id || slugifyHeading(block.content)
    const nextCount = (usedIds.get(baseId) || 0) + 1
    usedIds.set(baseId, nextCount)

    return {
      ...block,
      id: nextCount === 1 ? baseId : `${baseId}-${nextCount}`,
    }
  })
}

function getEditorialNoteIndex(blocks = []) {
  return blocks.findIndex(
    (block) => block.type === 'paragraph' && /^Updated\b/i.test(String(block.content || '')),
  )
}

function getTableOfContents(blocks = []) {
  return blocks
    .filter((block) => block.type === 'heading' && block.level === 2 && block.id)
    .map((block) => ({
      id: block.id,
      label: block.content,
    }))
}

function stripInlineMarkdown(text = '') {
  return String(text || '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractFaqItems(blocks = []) {
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
      activeQuestion = stripInlineMarkdown(block.content)
      answerParts = []
      continue
    }

    if (!activeQuestion) continue

    if (block.type === 'paragraph') {
      const normalized = stripInlineMarkdown(block.content)
      if (normalized) answerParts.push(normalized)
    }

    if (block.type === 'unordered-list' || block.type === 'ordered-list') {
      const normalized = block.items
        .map((item) => stripInlineMarkdown(item))
        .filter(Boolean)
        .join(' ')
      if (normalized) answerParts.push(normalized)
    }
  }

  if (inFaqSection) pushActiveItem()
  return items
}

function renderInlineContent(text, keyPrefix = 'inline') {
  const source = String(text || '')
  if (!source) return null

  const nodes = []
  let lastIndex = 0
  let tokenIndex = 0

  for (const match of source.matchAll(INLINE_TOKEN_RE)) {
    const token = match[0]
    const start = match.index ?? 0

    if (start > lastIndex) {
      nodes.push(source.slice(lastIndex, start))
    }

    if (token.startsWith('**') && token.endsWith('**')) {
      nodes.push(
        <strong key={`${keyPrefix}-strong-${tokenIndex}`}>
          {token.slice(2, -2)}
        </strong>,
      )
    } else if (token.startsWith('[')) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (linkMatch) {
        const [, label, rawHref] = linkMatch
        const href = normalizeInlineHref(rawHref)
        const className = 'text-blue-700 underline underline-offset-4 transition-colors hover:text-blue-800'

        if (href.startsWith('/')) {
          nodes.push(
            <LocalizedLink key={`${keyPrefix}-link-${tokenIndex}`} to={href} className={className}>
              {label}
            </LocalizedLink>,
          )
        } else {
          nodes.push(
            <a key={`${keyPrefix}-link-${tokenIndex}`} href={href} className={className}>
              {label}
            </a>,
          )
        }
      } else {
        nodes.push(token)
      }
    } else {
      const href = normalizeInlineHref(token)
      const className = 'text-blue-700 underline underline-offset-4 transition-colors hover:text-blue-800 break-all'
      if (href.startsWith('/')) {
        nodes.push(
          <LocalizedLink key={`${keyPrefix}-url-${tokenIndex}`} to={href} className={className}>
            {token}
          </LocalizedLink>,
        )
      } else {
        nodes.push(
          <a key={`${keyPrefix}-url-${tokenIndex}`} href={href} className={className}>
            {token}
          </a>,
        )
      }
    }

    lastIndex = start + token.length
    tokenIndex += 1
  }

  if (lastIndex < source.length) {
    nodes.push(source.slice(lastIndex))
  }

  return nodes
}

function renderBlogBlocks(blocks = [], editorialNoteIndex = -1) {
  return blocks.map((block, index) => {
    if (index === editorialNoteIndex) return null

    if (block.type === 'heading') {
      const Tag = `h${block.level}`
      const className = block.level === 2
        ? 'scroll-mt-28 text-3xl font-semibold tracking-tight text-slate-950 md:text-[2.2rem]'
        : 'scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-900'

      return (
        <Tag key={`heading-${index}`} id={block.id || undefined} className={className}>
          {renderInlineContent(block.content, `heading-${index}`)}
        </Tag>
      )
    }

    if (block.type === 'unordered-list') {
      return (
        <ul
          key={`ul-${index}`}
          className="list-disc space-y-3 pl-6 text-[1.04rem] leading-8 text-slate-700 marker:text-slate-400"
        >
          {block.items.map((item, itemIndex) => (
            <li key={`ul-${index}-${itemIndex}`}>
              {renderInlineContent(item, `ul-${index}-${itemIndex}`)}
            </li>
          ))}
        </ul>
      )
    }

    if (block.type === 'ordered-list') {
      return (
        <ol
          key={`ol-${index}`}
          className="list-decimal space-y-3 pl-6 text-[1.04rem] leading-8 text-slate-700 marker:text-slate-400"
        >
          {block.items.map((item, itemIndex) => (
            <li key={`ol-${index}-${itemIndex}`}>
              {renderInlineContent(item, `ol-${index}-${itemIndex}`)}
            </li>
          ))}
        </ol>
      )
    }

    if (block.type === 'divider') {
      return <hr key={`divider-${index}`} className="my-8 border-slate-200" />
    }

    return (
      <p key={`paragraph-${index}`} className="text-[1.05rem] leading-8 text-slate-700">
        {renderInlineContent(block.content, `paragraph-${index}`)}
      </p>
    )
  })
}

function BlogPostCover({ post }) {
  const coverImages = getBlogCoverImages()
  const presentation = getBlogPresentationMeta(post)

  return (
    <section className="blog-cover-shell mt-7" aria-label="Article cover preview">
      <div className="blog-cover-grid">
        <figure className="blog-cover-panel">
          <img
            src={coverImages.before}
            alt="Original source image preview"
            className="blog-cover-image"
            loading="eager"
          />
          <figcaption className="blog-cover-label">Source image</figcaption>
        </figure>

        <figure className="blog-cover-panel">
          <img
            src={coverImages.after}
            alt={`${post.title} pixel art preview`}
            className="blog-cover-image"
            loading="eager"
          />
          <figcaption className="blog-cover-label">Pixel art result</figcaption>
        </figure>
      </div>

      <div className="blog-cover-note">
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] ${presentation.chipClass}`}>
          {presentation.badge}
        </span>
        <p className="text-sm leading-7 text-slate-600 md:text-[0.98rem]">
          {presentation.bestFor}
        </p>
      </div>
    </section>
  )
}

export default function BlogPost() {
  const { t } = useTranslation()
  const { slug, lang: urlLang } = useParams()
  const { currentLocale, buildPath } = useLocaleContext()
  const { data: posts, fallback } = useLocalizedContent('blog-posts')
  const resolvedLocale = currentLocale || urlLang || 'en'
  const canonicalBase = slug ? `/blog/${slug}` : '/blog/'

  if (!posts) {
    const canonical = `https://pixelartvillage.org${buildPath(canonicalBase)}`
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <Seo title={`${t('blog.title')} | ${t('site.name')}`} canonical={canonical} lang={resolvedLocale} />
        <p className="text-sm text-gray-600">{t('common.loading')}</p>
      </div>
    )
  }

  const post = posts.find((entry) => entry.slug === slug)
  const canonical = `https://pixelartvillage.org${buildPath(canonicalBase)}`
  const siteName = t('site.name')

  if (!post) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <Seo title={`${t('blog.notFound.title')} | ${siteName}`} canonical={canonical} lang={resolvedLocale} />
        <h1 className="text-center text-3xl font-semibold text-slate-950">{t('blog.notFound.title')}</h1>
        <p className="mt-4 text-center text-slate-600">
          {t('blog.notFound.desc')}
        </p>
      </div>
    )
  }

  const seoTitle = buildBlogSeoTitle(post.title, siteName)
  const articleImage = resolveBlogOgImage(post.slug)
  const renderedBody = assignHeadingIds(parseBlogBody(post.body))
  const editorialNoteIndex = getEditorialNoteIndex(renderedBody)
  const editorialNote = editorialNoteIndex >= 0 ? renderedBody[editorialNoteIndex] : null
  const tableOfContents = getTableOfContents(renderedBody)
  const faqItems = extractFaqItems(renderedBody)
  const relatedPosts = getRelatedPosts(posts, post.slug, 2)
  const readTime = estimateBlogReadTime(post)
  const presentation = getBlogPresentationMeta(post)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    datePublished: post.date || undefined,
    dateModified: post.date || undefined,
    inLanguage: resolvedLocale,
    articleSection: presentation.badge,
    keywords: Array.isArray(post.tags) && post.tags.length ? post.tags.join(', ') : undefined,
    mainEntityOfPage: canonical,
    author: {
      '@type': 'Organization',
      name: siteName,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
    },
    image: articleImage,
  }

  const faqJsonLd = faqItems.length ? {
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
  } : null

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://pixelartvillage.org/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('blog.title'),
        item: `https://pixelartvillage.org${buildPath('/blog/')}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: canonical,
      },
    ],
  }

  return (
    <article className="container mx-auto max-w-4xl px-4 py-14 md:py-20">
      <Seo
        title={seoTitle}
        canonical={canonical}
        lang={resolvedLocale}
        description={post.excerpt}
        jsonLd={[articleJsonLd, breadcrumbJsonLd, ...(faqJsonLd ? [faqJsonLd] : [])]}
        meta={[
          { property: 'og:url', content: canonical },
          { property: 'og:type', content: 'article' },
          { property: 'og:title', content: seoTitle },
          { property: 'og:description', content: post.excerpt },
          { property: 'og:image', content: articleImage },
          { property: 'og:image:alt', content: `${post.title} article preview` },
          { property: 'og:site_name', content: siteName },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: seoTitle },
          { name: 'twitter:description', content: post.excerpt },
          { name: 'twitter:image', content: articleImage },
          { name: 'twitter:image:alt', content: `${post.title} article preview` },
        ]}
      />

      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <LocalizedLink
            to="/blog/"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 transition-colors hover:text-blue-800"
          >
            <span aria-hidden="true">←</span>
            {t('blog.back')}
          </LocalizedLink>
        </div>

        <section className="blog-article-card mt-6 px-6 py-8 md:px-12 md:py-12">
          <header className="text-center">
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500">
              <span>{post.date}</span>
              <span aria-hidden="true" className="text-slate-300">•</span>
              <span>{readTime}</span>
            </div>
            <h1 className="mx-auto mt-4 max-w-xl text-balance text-[1.82rem] font-semibold tracking-tight text-slate-950 md:text-[2.02rem] md:leading-[1.14]">
              {post.title}
            </h1>

            <BlogPostCover post={post} />

            <p className="mx-auto mt-7 max-w-[42rem] text-[1.05rem] leading-8 text-slate-600 md:text-[1.1rem]">
              {post.excerpt}
            </p>
          </header>

          {fallback ? (
            <p className="mt-6 text-center text-xs text-gray-500">{t('content.fallbackNotice')}</p>
          ) : null}

          {tableOfContents.length ? (
            <nav className="mt-10 flex flex-wrap justify-center gap-2">
              {tableOfContents.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="blog-anchor-chip"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          ) : null}

          <div className="blog-article-prose mt-12">
            {editorialNote ? (
              <p className="text-sm leading-7 text-slate-500">
                {renderInlineContent(editorialNote.content, 'editorial-note')}
              </p>
            ) : null}
            {renderBlogBlocks(renderedBody, editorialNoteIndex)}
          </div>
        </section>

        {relatedPosts.length ? (
          <section className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">Related Articles</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {relatedPosts.map((related) => (
                <article key={related.slug} className="blog-simple-card px-5 py-5">
                  <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                    <LocalizedLink to={`/blog/${related.slug}/`} className="transition-colors hover:text-blue-700">
                      {related.title}
                    </LocalizedLink>
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{related.excerpt}</p>
                  <div className="mt-4">
                    <LocalizedLink
                      to={`/blog/${related.slug}/`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800"
                    >
                      Read more
                      <span aria-hidden="true">→</span>
                    </LocalizedLink>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-8 text-center">
          <LocalizedLink to="/blog/" className="btn-primary inline-flex items-center justify-center">
            Back to Blog
          </LocalizedLink>
        </div>
      </div>
    </article>
  )
}
