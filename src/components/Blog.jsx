import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Seo from '@/components/Seo'
import posts from '@/content/blog-posts.json'
import { useTranslation } from 'react-i18next'

export default function Blog() {
  const { t } = useTranslation()
  const params = useParams()
  const rawLang = params.lang || 'en'
  const prefix = rawLang === 'en' ? '' : `/${rawLang}`
  const canonical = `https://pixelartvillage.org${prefix}/blog`
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Seo
        title={`${t('blog.title')} | Pixel Art Village`}
        canonical={canonical}
        meta={[
          { property: 'og:url', content: canonical },
          { property: 'og:type', content: 'website' },
          { property: 'og:title', content: `${t('blog.title')} | Pixel Art Village` },
          { property: 'og:description', content: t('blog.subtitle') },
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:title', content: `${t('blog.title')} | Pixel Art Village` },
          { name: 'twitter:description', content: t('blog.subtitle') },
        ]}
      />

      <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">{t('blog.title')}</h1>
      <p className="text-gray-700 mb-6 max-w-2xl mx-auto text-center">{t('blog.subtitle')}</p>

      <ul className="space-y-4 max-w-2xl mx-auto">
        {posts.map((p) => (
          <li key={p.slug} className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 text-center">
              <Link to={`${prefix}/blog/${p.slug}`} className="hover:text-blue-600">
                {p.title}
              </Link>
            </h2>
            <p className="text-xs text-gray-500 mt-1 text-left">{p.date}</p>
            <p className="text-gray-700 mt-2 text-left">{p.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
