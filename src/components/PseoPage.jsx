import React, { Fragment, lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useOutletContext } from 'react-router-dom'
import Seo from '@/components/Seo'
import ToolSection from '@/components/ToolSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import FaqSection from '@/components/FaqSection'
import { useLocalizedContent } from '@/hooks/useLocalizedContent'
import { useLocaleContext } from '@/hooks/useLocaleContext'
import LocalizedLink from '@/components/LocalizedLink'

const Editor = lazy(() => import('@/components/Editor'))

function buildFaqJsonLd(items = []) {
  const faqItems = Array.isArray(items)
    ? items.filter((item) => item && item.question && item.answer)
    : []

  if (!faqItems.length) return null

  return {
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
  }
}

function ConverterSupportBlock({ title, body = [], ctaLabel, ctaTo = '#tool' }) {
  if (!title && (!Array.isArray(body) || !body.length)) return null

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {title ? <h2 className="text-xl font-semibold text-gray-900">{title}</h2> : null}
      <div className="mt-3 space-y-3 text-gray-700">
        {(Array.isArray(body) ? body : []).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      {ctaLabel ? (
        <div className="mt-5">
          <LocalizedLink
            to={ctaTo}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            {ctaLabel}
          </LocalizedLink>
        </div>
      ) : null}
    </article>
  )
}

function MainConverterCallout({ callout, testId }) {
  if (!callout?.title && !Array.isArray(callout?.body)) return null

  return (
    <article
      data-testid={testId}
      className="rounded-2xl border border-blue-200 bg-blue-50/80 p-5 shadow-sm"
    >
      {callout.title ? (
        <h2 className="text-xl font-semibold text-gray-900">{callout.title}</h2>
      ) : null}
      <div className="mt-3 space-y-3 text-gray-700">
        {(Array.isArray(callout.body) ? callout.body : []).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      {callout.ctaLabel ? (
        <div className="mt-5">
          <LocalizedLink
            to={callout.ctaTo || '/converter/image-to-pixel-art/'}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            {callout.ctaLabel}
          </LocalizedLink>
        </div>
      ) : null}
    </article>
  )
}

export default function PseoPage() {
  const { t } = useTranslation()
  const { slug } = useParams()
  const { uploadedImage, setUploadedImage } = useOutletContext()
  const { currentLocale, buildPath } = useLocaleContext()
  const { data: pages, fallback } = useLocalizedContent('pseo-pages')

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
  const isPrimaryConverter = page.slug === 'image-to-pixel-art'
  const relatedPages = pages
    .filter((entry) => entry.slug !== page.slug)
    .sort((a, b) => Number(b.slug === 'image-to-pixel-art') - Number(a.slug === 'image-to-pixel-art'))
    .slice(0, 6)
  const faqItems = t('faq.items', { returnObjects: true }) || []
  const siteLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/blog/', label: t('nav.blog') },
    { to: '/about/', label: t('nav.about') },
    { to: '/contact/', label: t('nav.contact') },
    { to: '/privacy/', label: t('footer.privacy') },
    { to: '/terms/', label: t('footer.terms') },
  ]
  const introParas = Array.isArray(page.intro) ? page.intro : [page.intro]
  const faqJsonLd = buildFaqJsonLd(faqItems)
  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: page.h1 || page.title,
    description: page.metaDescription,
    inLanguage: currentLocale || 'en',
    totalTime: 'PT2M',
    supply: [
      { '@type': 'HowToSupply', name: 'Image file (PNG/JPG/GIF/WEBP)' },
    ],
    tool: [
      { '@type': 'HowToTool', name: 'Pixel Art Village Converter' },
    ],
    step: [
      { '@type': 'HowToStep', name: t('tool.ariaChoose', 'Upload an image') },
      { '@type': 'HowToStep', name: t('howItWorks.steps.configure.title', 'Adjust pixel size and palette') },
      { '@type': 'HowToStep', name: t('editor.downloadBtn', 'Download result') },
    ],
  }
  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: page.title,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    url: canonical,
    inLanguage: currentLocale || 'en',
    description: page.metaDescription,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }

  return (
    <Fragment>
      <Seo
        title={page.title}
        canonical={canonical}
        lang={currentLocale || 'en'}
        description={page.metaDescription}
        jsonLd={[howToJsonLd, softwareJsonLd, faqJsonLd].filter(Boolean)}
        meta={[
          { property: 'og:url', content: canonical },
          { property: 'og:type', content: 'website' },
          { property: 'og:title', content: page.title },
          { property: 'og:description', content: page.metaDescription },
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:title', content: page.title },
          { name: 'twitter:description', content: page.metaDescription },
        ]}
      />

      {isPrimaryConverter ? (
        <Fragment>
          <ToolSection
            onImageUpload={setUploadedImage}
            headingLevel="h1"
            titleText={page.h1}
            subtitleText={page.heroSubtitle || introParas[0] || page.metaDescription}
            subtitleText2={page.heroSubtitle2 || ''}
          />
          {uploadedImage ? (
            <Suspense fallback={null}>
              <Editor image={uploadedImage} />
            </Suspense>
          ) : null}
          <section className="bg-white py-8">
            <div className="container mx-auto px-4 max-w-4xl">
              {fallback ? (
                <p className="text-xs text-gray-500 mb-3">{t('content.fallbackNotice')}</p>
              ) : null}
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {page.detailsHeading || 'When to use this converter'}
              </h2>
              {introParas.map((para, index) => (
                <p key={index} className="text-gray-700 mb-3">
                  {para}
                </p>
              ))}
            </div>
          </section>
          <section className="bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl grid grid-cols-1 gap-4 lg:grid-cols-2">
              <ConverterSupportBlock
                title={page.minecraftBlock?.title}
                body={page.minecraftBlock?.body}
                ctaLabel={page.minecraftBlock?.ctaLabel}
                ctaTo={page.minecraftBlock?.ctaTo}
              />
              <ConverterSupportBlock
                title={page.aiBlock?.title}
                body={page.aiBlock?.body}
                ctaLabel={page.aiBlock?.ctaLabel}
                ctaTo={page.aiBlock?.ctaTo}
              />
            </div>
          </section>
        </Fragment>
      ) : (
        <Fragment>
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
              {page.topCallout ? (
                <div className="mt-6">
                  <MainConverterCallout callout={page.topCallout} testId="primary-converter-callout-top" />
                </div>
              ) : null}
            </div>
          </section>
          <ToolSection
            onImageUpload={setUploadedImage}
            headingLevel="h2"
            titleText={page.toolHeading}
            subtitleText={page.toolSubtitle}
            subtitleText2={page.toolSubtitle2}
          />
          {uploadedImage ? (
            <Suspense fallback={null}>
              <Editor image={uploadedImage} />
            </Suspense>
          ) : null}
        </Fragment>
      )}
      <HowItWorksSection />
      {!isPrimaryConverter && page.bottomCallout ? (
        <section className="bg-white py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <MainConverterCallout callout={page.bottomCallout} testId="primary-converter-callout-bottom" />
          </div>
        </section>
      ) : null}
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
      <FaqSection items={faqItems} />
    </Fragment>
  )
}
