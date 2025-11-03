import React from 'react'
import { useParams } from 'react-router-dom'
import Seo from '@/components/Seo'
import { useTranslation } from 'react-i18next'
import { useLocalizedContent } from '@/hooks/useLocalizedContent'
import { useLocaleContext } from '@/contexts/LocaleContext'
import LocalizedLink from '@/components/LocalizedLink'

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

  return (
    <article className="container mx-auto px-4 py-10 max-w-3xl">
      <Seo
        title={`${post.title} | ${t('site.name')}`}
        canonical={canonical}
        lang={resolvedLocale}
        meta={[
          { property: 'og:url', content: canonical },
          { property: 'og:type', content: 'article' },
          { property: 'og:title', content: `${post.title} | ${t('site.name')}` },
          { property: 'og:description', content: post.excerpt },
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:title', content: `${post.title} | ${t('site.name')}` },
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

      <footer className="mt-8">
        <LocalizedLink className="text-blue-600 underline" to="/blog/">
          ← {t('blog.back')}
        </LocalizedLink>
      </footer>
    </article>
  )
}
