import { useParams } from 'react-router-dom'
import Seo from '@/components/Seo'
import { useTranslation } from 'react-i18next'
import { useLocalizedContent } from '@/hooks/useLocalizedContent'
import { useLocaleContext } from '@/hooks/useLocaleContext'
import LocalizedLink from '@/components/LocalizedLink'

const BLOG_OG_IMAGE_SLUGS = new Set([
  'best-pixel-art-converters-compared-2025',
  'export-from-illustrator-image-to-pixel-art',
  'getting-started-pixel-art-maker',
  'how-to-get-pixel-art-version-of-image',
  'how-to-pixelate-an-image',
  'image-to-pixel-art-converter-free',
  'make-image-more-like-pixel',
  'photo-to-sprite-converter-tips',
  'turn-photo-into-pixel-art',
])

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

function getRelatedPosts(posts = [], currentSlug, limit = 3) {
  const normalized = Array.isArray(posts) ? posts.filter((p) => p && p.slug) : []
  if (normalized.length <= 1) return []
  const max = Math.min(limit, normalized.length - 1)
  const currentIndex = normalized.findIndex((p) => p.slug === currentSlug)
  const startIndex = currentIndex >= 0 ? currentIndex : 0
  const related = []
  for (let step = 1; related.length < max && step <= normalized.length; step += 1) {
    const candidate = normalized[(startIndex + step) % normalized.length]
    if (!candidate || candidate.slug === currentSlug) continue
    if (!related.some((item) => item.slug === candidate.slug)) related.push(candidate)
  }
  return related
}

const INLINE_TOKEN_RE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s]+)/g

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
        </strong>
      )
    } else if (token.startsWith('[')) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (linkMatch) {
        const [, label, rawHref] = linkMatch
        const href = normalizeInlineHref(rawHref)
        const className = 'text-blue-600 underline underline-offset-2 hover:text-blue-700'

        if (href.startsWith('/')) {
          nodes.push(
            <LocalizedLink key={`${keyPrefix}-link-${tokenIndex}`} to={href} className={className}>
              {label}
            </LocalizedLink>
          )
        } else {
          nodes.push(
            <a key={`${keyPrefix}-link-${tokenIndex}`} href={href} className={className}>
              {label}
            </a>
          )
        }
      } else {
        nodes.push(token)
      }
    } else {
      const href = normalizeInlineHref(token)
      const className = 'text-blue-600 underline underline-offset-2 hover:text-blue-700 break-all'
      if (href.startsWith('/')) {
        nodes.push(
          <LocalizedLink key={`${keyPrefix}-url-${tokenIndex}`} to={href} className={className}>
            {token}
          </LocalizedLink>
        )
      } else {
        nodes.push(
          <a key={`${keyPrefix}-url-${tokenIndex}`} href={href} className={className}>
            {token}
          </a>
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

function renderBlogBlocks(blocks = []) {
  return blocks.map((block, index) => {
    if (block.type === 'heading') {
      const Tag = `h${block.level}`
      return (
        <Tag key={`heading-${index}`} id={block.id || undefined}>
          {renderInlineContent(block.content, `heading-${index}`)}
        </Tag>
      )
    }

    if (block.type === 'unordered-list') {
      return (
        <ul key={`ul-${index}`}>
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
        <ol key={`ol-${index}`}>
          {block.items.map((item, itemIndex) => (
            <li key={`ol-${index}-${itemIndex}`}>
              {renderInlineContent(item, `ol-${index}-${itemIndex}`)}
            </li>
          ))}
        </ol>
      )
    }

    if (block.type === 'divider') {
      return <hr key={`divider-${index}`} className="my-8 border-gray-200" />
    }

    return (
      <p key={`p-${index}`}>
        {renderInlineContent(block.content, `p-${index}`)}
      </p>
    )
  })
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
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <Seo title={`${t('blog.title')} | ${t('site.name')}`} canonical={canonical} lang={resolvedLocale} />
        <p className="text-sm text-gray-600">{t('common.loading')}</p>
      </div>
    )
  }

  const post = posts.find((p) => p.slug === slug)
  const canonical = `https://pixelartvillage.org${buildPath(canonicalBase)}`
  const siteName = t('site.name')

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <Seo title={`${t('blog.notFound.title')} | ${t('site.name')}`} canonical={canonical} lang={resolvedLocale} />
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">{t('blog.notFound.title')}</h1>
        <p className="text-gray-700">
          {t('blog.notFound.desc')}{' '}
          <LocalizedLink className="text-blue-600 underline" to="/blog/">
            {t('blog.back')}
          </LocalizedLink>
          .
        </p>
      </div>
    )
  }

  const seoTitle = buildBlogSeoTitle(post.title, siteName)
  const articleImage = resolveBlogOgImage(slug)
  const relatedPosts = getRelatedPosts(posts, post.slug, 3)
  const renderedBody = parseBlogBody(post.body)
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || '',
    datePublished: post.date || undefined,
    dateModified: post.date || undefined,
    inLanguage: resolvedLocale,
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

  return (
    <article className="container mx-auto px-4 py-10 max-w-3xl">
      <Seo
        title={seoTitle}
        canonical={canonical}
        lang={resolvedLocale}
        description={post.excerpt}
        jsonLd={articleJsonLd}
        meta={[
          { property: 'og:url', content: canonical },
          { property: 'og:type', content: 'article' },
          { property: 'og:title', content: seoTitle },
          { property: 'og:description', content: post.excerpt },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: seoTitle },
          { name: 'twitter:description', content: post.excerpt },
        ]}
      />

      <header>
        <h1 className="text-3xl font-bold text-gray-900 text-center">{post.title}</h1>
        <p className="text-xs text-gray-500 mt-2 text-left">{post.date}</p>
      </header>

      {fallback ? (
        <p className="mt-4 text-center text-xs text-gray-500">{t('content.fallbackNotice')}</p>
      ) : null}

      <div className="prose prose-sm md:prose-base max-w-none text-gray-800 mt-6 text-left prose-headings:text-gray-900 prose-a:no-underline prose-pre:text-left prose-code:text-left prose-img:mx-0">
        {renderBlogBlocks(renderedBody)}
      </div>

      {relatedPosts.length ? (
        <section className="mt-8 rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('blog.relatedHeading', 'Related posts')}
          </h2>
          <ul className="mt-3 space-y-2">
            {relatedPosts.map((related) => (
              <li key={related.slug}>
                <LocalizedLink className="text-blue-600 hover:underline" to={`/blog/${related.slug}/`}>
                  {related.title}
                </LocalizedLink>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <footer className="mt-8">
        <LocalizedLink className="text-blue-600 underline" to="/blog/">
          ← {t('blog.back')}
        </LocalizedLink>
      </footer>
    </article>
  )
}
