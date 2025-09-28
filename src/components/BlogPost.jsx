import React from 'react'
import { useParams, Link } from 'react-router-dom'
import Seo from '@/components/Seo'
import posts from '@/content/blog-posts.json'
import { useTranslation } from 'react-i18next'

export default function BlogPost() {
  const { t } = useTranslation()
  const { slug, lang: urlLang } = useParams()
  const rawLang = urlLang || 'en'
  const prefix = rawLang === 'en' ? '' : `/${rawLang}`
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    const canonical = `https://pixelartvillage.org${prefix}/blog/${slug || ''}`
    return (
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <Seo title="Not Found | Image to Pixel Art" canonical={canonical} />
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">{t('blog.notFound.title')}</h1>
        <p className="text-gray-700">{t('blog.notFound.desc')} <Link className="text-blue-600 underline" to={`${prefix}/blog`}>{t('blog.back')}</Link>.</p>
      </div>
    )
  }

  const canonical = `https://pixelartvillage.org${prefix}/blog/${post.slug}`

  // 相关文章（按标签重叠度，最多3条）
  const relatedPosts = (() => {
    if (!post.tags || !Array.isArray(post.tags) || post.tags.length === 0) return []
    const set = new Set(post.tags)
    return posts
      .filter((p) => p.slug !== post.slug && Array.isArray(p.tags))
      .map((p) => ({
        post: p,
        score: p.tags.reduce((acc, t) => acc + (set.has(t) ? 1 : 0), 0),
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.post)
  })()

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Person", name: "Editorial Team" },
    mainEntityOfPage: canonical,
    url: canonical,
    image: post.ogImage ? [post.ogImage] : undefined
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `https://pixelartvillage.org${prefix || ''}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `https://pixelartvillage.org${prefix}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: canonical }
    ]
  }

  return (
    <article className="container mx-auto px-4 py-10 max-w-3xl">
      <Seo
        title={`${post.title} | Image to Pixel Art`}
        canonical={canonical}
        meta={[
          { property: 'og:url', content: canonical },
          { property: 'og:type', content: 'article' },
          { property: 'og:title', content: `${post.title} | Image to Pixel Art` },
          { property: 'og:description', content: post.excerpt },
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:title', content: `${post.title} | Image to Pixel Art` },
          { name: 'twitter:description', content: post.excerpt },
        ]}
      />

      {/* JSON-LD: Article + BreadcrumbList */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <header className="text-center md:text-left">
        <h1 className="text-2xl font-bold text-gray-900 text-center">{post.title}</h1>
        <p className="text-xs text-gray-500 mt-1 text-center md:text-left">{post.date}</p>
      </header>

      {/* CTA：首屏摘要后 */}
      <div className="mt-4 flex justify-center">
        <Link className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" to={`${prefix || ''}/`}>
          {t('blog.cta.useTool', { defaultValue: 'Try Image to Pixel Art Converter' })}
        </Link>
      </div>

      <div className="prose prose-sm md:prose-base text-gray-800 mt-4 text-center md:text-left prose-pre:text-left prose-code:text-left prose-img:mx-0">
        {post.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {/* 相关文章 */}
      {relatedPosts.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('blog.related', { defaultValue: 'Related Articles' })}</h2>
          <ul className="space-y-3">
            {relatedPosts.map((rp) => (
              <li key={rp.slug} className="p-3 rounded border border-gray-200 bg-white">
                <h3 className="text-base font-semibold">
                  <Link to={`${prefix}/blog/${rp.slug}`} className="hover:text-blue-600">{rp.title}</Link>
                </h3>
                <p className="text-xs text-gray-500 mt-1">{rp.date}</p>
                <p className="text-gray-700 mt-1">{rp.excerpt}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* CTA：文末 */}
      <div className="mt-8 flex justify-center">
        <Link className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" to={`${prefix || ''}/`}>
          {t('blog.cta.tryNow', { defaultValue: 'Convert Your Image Now' })}
        </Link>
      </div>

      <footer className="mt-8">
        <Link className="text-blue-600 underline" to={`${prefix}/blog`}>← {t('blog.back')}</Link>
      </footer>
    </article>
  )
}
