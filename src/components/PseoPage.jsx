import React, { useState, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import Seo from '@/components/Seo'
import ToolSection from '@/components/ToolSection'
import Editor from '@/components/Editor'
import HowItWorksSection from '@/components/HowItWorksSection'
import FaqSection from '@/components/FaqSection'
import { useLocalizedContent } from '@/hooks/useLocalizedContent'
import { useLocaleContext } from '@/hooks/useLocaleContext'
import LocalizedLink from '@/components/LocalizedLink'

export default function PseoPage() {
  const { t } = useTranslation()
  const { slug } = useParams()
  const { currentLocale, buildPath } = useLocaleContext()
  const { data: pages, fallback } = useLocalizedContent('pseo-pages')
  const [uploadedImage, setUploadedImage] = useState(null)

  if (!pages) {
    const canonical = `https://pixelartvillage.org${buildPath(`/converter/${slug || ''}/`)}`
    return (
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <Seo title={t('tool.title')} canonical={canonical} lang={currentLocale || 'en'} />
        <p className="text-sm text-gray-600">{t('common.loading')}</p>
      </div>
    )
  }

  const page = pages.find((entry) => entry.slug === slug)

  if (!page) {
    const canonical = `https://pixelartvillage.org${buildPath(`/converter/${slug || ''}/`)}`
    return (
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <Seo title={t('pseo.notFound.seoTitle')} canonical={canonical} lang={currentLocale || 'en'} />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('pseo.notFound.title')}</h1>
        <p className="text-gray-700">{t('pseo.notFound.desc')}</p>
      </div>
    )
  }

  const canonical = `https://pixelartvillage.org${buildPath(`/converter/${page.slug}/`)}`
  const relatedPages = pages.filter((entry) => entry.slug !== page.slug).slice(0, 6)
  const siteLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/blog/', label: t('nav.blog') },
    { to: '/about/', label: t('nav.about') },
    { to: '/contact/', label: t('nav.contact') },
    { to: '/privacy/', label: t('footer.privacy') },
    { to: '/terms/', label: t('footer.terms') },
  ]
  const introParas = Array.isArray(page.intro) ? page.intro : [page.intro]

  return (
    <Fragment>
      <Seo
        title={page.title}
        canonical={canonical}
        lang={currentLocale || 'en'}
        meta={[
          { name: 'description', content: page.metaDescription },
          { property: 'og:url', content: canonical },
          { property: 'og:type', content: 'website' },
          { property: 'og:title', content: page.title },
          { property: 'og:description', content: page.metaDescription },
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:title', content: page.title },
          { name: 'twitter:description', content: page.metaDescription },
        ]}
      />

      <section className="bg-white py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{page.h1}</h1>
          {fallback ? (
            <p className="text-xs text-gray-500 mb-3">{t('content.fallbackNotice')}</p>
          ) : null}
          {introParas.map((para, index) => (
            <p key={index} className="text-gray-700 mb-3">
              {para}
            </p>
          ))}
        </div>
      </section>

      <ToolSection onImageUpload={setUploadedImage} headingLevel="h2" />
      {uploadedImage ? <Editor image={uploadedImage} /> : null}
      <HowItWorksSection />
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('pseo.relatedHeading')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedPages.map((related) => (
              <LocalizedLink
                key={related.slug}
                to={`/converter/${related.slug}/`}
                className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <h3 className="font-medium text-gray-900 mb-2">{related.h1}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {Array.isArray(related.intro) ? related.intro[0] : related.intro}
                </p>
              </LocalizedLink>
            ))}
          </div>
          <div className="mt-8 rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('footer.explore')}</h3>
            <div className="flex flex-wrap gap-2">
              {siteLinks.map((link) => (
                <LocalizedLink
                  key={link.to}
                  to={link.to}
                  className="rounded border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-blue-300 hover:text-blue-600"
                >
                  {link.label}
                </LocalizedLink>
              ))}
            </div>
          </div>
        </div>
      </section>
      <FaqSection />
    </Fragment>
  )
}
