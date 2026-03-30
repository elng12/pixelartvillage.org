import Seo from '@/components/Seo'
import LocalizedLink from '@/components/LocalizedLink'
import { useLocalizedContent } from '@/hooks/useLocalizedContent'
import { useLocaleContext } from '@/hooks/useLocaleContext'
import { estimateBlogReadTime, getBlogPresentationMeta } from '@/utils/blogPresentation'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

const BLOG_INDEX_IMAGE = 'https://pixelartvillage.org/blog-og/_index.png'

function BlogListCard({ post }) {
  const presentation = getBlogPresentationMeta(post)

  return (
    <article className="blog-simple-card px-6 py-6 md:px-8 md:py-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] ${presentation.chipClass}`}>
          {presentation.badge}
        </span>
      </div>

      <h2 className="mt-4 max-w-3xl text-balance text-[1.24rem] font-semibold tracking-tight text-slate-950 md:text-[1.45rem] md:leading-[1.24]">
        <LocalizedLink to={`/blog/${post.slug}/`} className="transition-colors hover:text-blue-700">
          {post.title}
        </LocalizedLink>
      </h2>

      <p className="mt-4 text-[0.98rem] leading-8 text-slate-600">{post.excerpt}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <span>{post.date}</span>
        <span aria-hidden="true" className="text-slate-300">•</span>
        <span>{estimateBlogReadTime(post)}</span>
      </div>

      <div className="mt-6">
        <LocalizedLink
          to={`/blog/${post.slug}/`}
          className="inline-flex items-center gap-2 text-base font-semibold text-blue-700 transition-colors hover:text-blue-800"
        >
          Read more
          <span aria-hidden="true">→</span>
        </LocalizedLink>
      </div>
    </article>
  )
}

export default function Blog() {
  const { t, i18n } = useTranslation()
  const params = useParams()
  const rawLang = params.lang || 'en'
  const { currentLocale, buildPath } = useLocaleContext()
  const { data: posts, fallback } = useLocalizedContent('blog-posts')
  const canonical = `https://pixelartvillage.org${buildPath('/blog/')}`
  const resolvedLocale = currentLocale || rawLang
  const siteName = t('site.name')
  const localizedBlogSeoTitle = i18n.getResource(resolvedLocale, 'translation', 'blog.seoTitle')
  const blogSeoTitle = typeof localizedBlogSeoTitle === 'string' && localizedBlogSeoTitle.trim()
    ? localizedBlogSeoTitle
    : `${t('blog.title')} | ${siteName}`
  const blogTitle = t('blog.title', { defaultValue: 'Blog' })
  const blogKeywordHeading = t('blog.h1', { defaultValue: 'Pixel Art Tutorials and Converter Guides' })
  const blogSubtitle = t('blog.subtitle')

  if (!posts) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <Seo title={blogSeoTitle} canonical={canonical} lang={resolvedLocale} />
        <p className="text-sm text-gray-600">{t('common.loading')}</p>
      </div>
    )
  }

  const blogCollectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: blogTitle,
    description: blogSubtitle,
    url: canonical,
    inLanguage: resolvedLocale,
    isPartOf: {
      '@type': 'WebSite',
      name: siteName,
      url: 'https://pixelartvillage.org/',
    },
  }

  const blogItemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://pixelartvillage.org${buildPath(`/blog/${post.slug}/`)}`,
      name: post.title,
      description: post.excerpt,
    })),
  }

  const blogBreadcrumbJsonLd = {
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
        name: blogTitle,
        item: canonical,
      },
    ],
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-14 md:py-20">
      <Seo
        title={blogSeoTitle}
        canonical={canonical}
        lang={resolvedLocale}
        description={blogSubtitle}
        jsonLd={[blogCollectionJsonLd, blogItemListJsonLd, blogBreadcrumbJsonLd]}
        meta={[
          { property: 'og:url', content: canonical },
          { property: 'og:type', content: 'website' },
          { property: 'og:title', content: blogSeoTitle },
          { property: 'og:description', content: blogSubtitle },
          { property: 'og:image', content: BLOG_INDEX_IMAGE },
          { property: 'og:image:alt', content: 'Pixel Art Village blog preview' },
          { property: 'og:site_name', content: siteName },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: blogSeoTitle },
          { name: 'twitter:description', content: blogSubtitle },
          { name: 'twitter:image', content: BLOG_INDEX_IMAGE },
          { name: 'twitter:image:alt', content: 'Pixel Art Village blog preview' },
        ]}
      />

      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-[2.35rem] md:leading-[1.08]">
          {blogTitle}
          <span className="sr-only"> — {blogKeywordHeading}</span>
        </h1>
        <p className="mt-4 text-[0.98rem] leading-8 text-slate-600 md:text-[1.05rem] md:leading-8">
          {blogSubtitle}
        </p>
      </header>

      {fallback ? (
        <p className="mt-6 text-center text-xs text-gray-500">{t('content.fallbackNotice')}</p>
      ) : null}

      <section className="mt-12 space-y-7">
        {posts.map((post) => (
          <BlogListCard key={post.slug} post={post} />
        ))}
      </section>
    </div>
  )
}
