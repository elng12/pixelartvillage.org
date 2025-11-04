import { useParams } from 'react-router-dom'
import Seo from '@/components/Seo'
import { useTranslation } from 'react-i18next'
import { useLocalizedContent } from '@/hooks/useLocalizedContent'
import { useLocaleContext } from '@/hooks/useLocaleContext'
import LocalizedLink from '@/components/LocalizedLink'

export default function Blog() {
  const { t } = useTranslation()
  const params = useParams()
  const rawLang = params.lang || 'en'
  const { currentLocale, buildPath } = useLocaleContext()
  const { data: posts, fallback } = useLocalizedContent('blog-posts')
  const canonical = `https://pixelartvillage.org${buildPath('/blog/')}`

  if (!posts) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <Seo title={`${t('blog.title')} | ${t('site.name')}`} canonical={canonical} lang={rawLang} />
        <p className="text-sm text-gray-600">{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Seo
        title={`${t('blog.title')} | ${t('site.name')}`}
        canonical={canonical}
        lang={currentLocale || rawLang}
        meta={[
          { property: 'og:url', content: canonical },
          { property: 'og:type', content: 'website' },
          { property: 'og:title', content: `${t('blog.title')} | ${t('site.name')}` },
          { property: 'og:description', content: t('blog.subtitle') },
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:title', content: `${t('blog.title')} | ${t('site.name')}` },
          { name: 'twitter:description', content: t('blog.subtitle') },
        ]}
      />

      <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">{t('blog.title')}</h1>
      <p className="text-gray-700 mb-6 max-w-2xl mx-auto text-center">{t('blog.subtitle')}</p>
      {fallback ? (
        <p className="mb-6 text-center text-xs text-gray-500">{t('content.fallbackNotice')}</p>
      ) : null}

      <ul className="space-y-4 max-w-2xl mx-auto">
        {posts.map((p) => (
          <li key={p.slug} className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 text-center">
              <LocalizedLink to={`/blog/${p.slug}`} className="hover:text-blue-600">
                {p.title}
              </LocalizedLink>
            </h2>
            <p className="text-xs text-gray-500 mt-1 text-left">{p.date}</p>
            <p className="text-gray-700 mt-2 text-left">{p.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
