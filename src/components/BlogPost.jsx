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

      <header className="text-center md:text-left">
        <h1 className="text-2xl font-bold text-gray-900 text-center">{post.title}</h1>
        <p className="text-xs text-gray-500 mt-1 text-center md:text-left">{post.date}</p>
      </header>

      <div className="prose prose-sm md:prose-base text-gray-800 mt-4 text-center md:text-left prose-pre:text-left prose-code:text-left prose-img:mx-0">
        {post.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <footer className="mt-8">
  <Link className="text-blue-600 underline" to={`${prefix}/blog`}>← {t('blog.back')}</Link>
      </footer>
    </article>
  )
}
