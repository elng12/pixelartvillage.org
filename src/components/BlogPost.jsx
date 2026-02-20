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

function buildBlogSeoTitle(title, siteName, maxLength = 60) {
  const suffix = ` | ${siteName}`
  const maxBaseLength = Math.max(20, maxLength - suffix.length)
  const normalized = String(title || '').trim()
  if (normalized.length <= maxBaseLength) return `${normalized}${suffix}`
  const trimmed = normalized.slice(0, Math.max(0, maxBaseLength - 1)).trimEnd()
  return `${trimmed}…${suffix}`
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
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:title', content: seoTitle },
          { name: 'twitter:description', content: post.excerpt },
        ]}
      />

      <header className="text-center md:text-left">
        <h1 className="text-2xl font-bold text-gray-900 text-center">{post.title}</h1>
        <p className="text-xs text-gray-500 mt-1 text-center md:text-left">{post.date}</p>
      </header>

      {fallback ? (
        <p className="mt-4 text-center text-xs text-gray-500">{t('content.fallbackNotice')}</p>
      ) : null}

      <div className="prose prose-sm md:prose-base text-gray-800 mt-4 text-center md:text-left prose-pre:text-left prose-code:text-left prose-img:mx-0">
        {post.body.map((para, index) => (
          <p key={index}>{para}</p>
        ))}
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
