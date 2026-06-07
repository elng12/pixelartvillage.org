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

function PseoContentSections({ sections = [] }) {
  const visibleSections = Array.isArray(sections)
    ? sections.filter((section) => section?.title || section?.body?.length || section?.items?.length)
    : []

  if (!visibleSections.length) return null

  return (
    <section className="bg-white py-8">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        {visibleSections.map((section, sectionIndex) => {
          const body = Array.isArray(section.body) ? section.body : []
          const items = Array.isArray(section.items) ? section.items : []

          return (
            <div key={sectionIndex}>
              {section.title ? (
                <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
              ) : null}
              {body.length ? (
                <div className="mt-3 space-y-3 text-gray-700">
                  {body.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
              {items.length ? (
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                  {items.map((item, index) => (
                    <article key={index} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      {item.title ? (
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      ) : null}
                      {item.description ? (
                        <p className="mt-2 text-sm text-gray-700">{item.description}</p>
                      ) : null}
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}

const PHOTO_HERO_POINTS = [
  {
    title: 'Photo-first controls',
    body: 'Built for portraits, pet photos, scenery, and camera pictures with soft detail.',
  },
  {
    title: 'Private in your browser',
    body: 'Upload and adjust the photo locally before exporting the pixel art result.',
  },
  {
    title: 'Cleaner readable shapes',
    body: 'Focus on pixel size, palette, crop, and contrast so the subject still reads clearly.',
  },
]

function PhotoPreviewStrip({ className = '' }) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm ${className}`} aria-hidden="true">
      <div className="mb-3 flex items-center justify-between text-xs font-semibold text-gray-500">
        <span>Photo source</span>
        <span>Pixel result</span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="relative h-24 overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-sky-100 via-rose-100 to-emerald-100">
          <div className="absolute left-5 top-5 h-10 w-10 rounded-full bg-white/75" />
          <div className="absolute bottom-3 left-4 h-8 w-24 rounded-full bg-slate-700/20" />
          <div className="absolute right-5 top-7 h-12 w-16 rounded-lg bg-white/45" />
        </div>
        <div className="text-xs font-semibold uppercase tracking-normal text-gray-300">to</div>
        <div className="relative h-24 overflow-hidden rounded-lg border border-blue-200 bg-blue-50 pixel-grid-bg">
          <div className="absolute left-5 top-5 h-10 w-10 bg-blue-500/80" />
          <div className="absolute bottom-4 left-4 h-6 w-24 bg-slate-700/70" />
          <div className="absolute right-6 top-8 h-10 w-14 bg-emerald-400/80" />
          <div className="absolute right-4 bottom-4 h-4 w-8 bg-violet-400/80" />
        </div>
      </div>
    </div>
  )
}

function PhotoHeroPointGrid({ className = '' }) {
  return (
    <ul className={`grid gap-3 text-sm text-gray-700 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 ${className}`}>
      {PHOTO_HERO_POINTS.map((item) => (
        <li key={item.title} className="flex gap-3">
          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-hidden="true" />
          <span className="leading-6">
            <span className="font-semibold text-gray-950">{item.title}</span>
            <span className="text-gray-600">{' - '}{item.body}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}

function PhotoMainConverterLink({ to, label, note, className = '' }) {
  return (
    <p className={`max-w-2xl text-sm leading-6 text-gray-600 ${className}`}>
      {note ? <span>{note} </span> : null}
      <LocalizedLink
        to={to}
        className="font-semibold text-blue-700 underline decoration-blue-200 underline-offset-4 transition-colors hover:text-blue-800 hover:decoration-blue-500"
      >
        {label}
      </LocalizedLink>
    </p>
  )
}

function PhotoPseoHero({ page, introParas = [], fallback, onImageUpload }) {
  const mainConverterLabel = page.topCallout?.ctaLabel || 'Use the main image converter'
  const mainConverterTo = page.topCallout?.ctaTo || '/converter/image-to-pixel-art/'
  const firstIntro = introParas[0] || page.metaDescription
  const secondIntro = page.toolSubtitle2 || introParas[1]

  return (
    <section className="bg-gradient-to-b from-white to-slate-50 py-8 md:py-10">
      <div className="container mx-auto max-w-6xl px-4">
        {fallback ? (
          <p className="mb-3 text-xs text-gray-500">{'Using fallback English content.'}</p>
        ) : null}
        <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="order-1 lg:order-1">
            <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-blue-700">
              Photo to pixel art
            </p>
            <h1 className="text-3xl font-extrabold leading-tight text-gray-950 md:text-5xl">
              {page.h1}
            </h1>
            <div className="hidden lg:block">
              {firstIntro ? (
                <p className="mt-4 max-w-2xl text-base leading-7 text-gray-700 md:text-lg">
                  {firstIntro}
                </p>
              ) : null}
              <PhotoHeroPointGrid className="mt-6" />
              <PhotoMainConverterLink
                to={mainConverterTo}
                label={mainConverterLabel}
                note={secondIntro}
                className="mt-6"
              />
            </div>
          </div>

          <div className="order-2 space-y-4 lg:order-2">
            <ToolSection
              onImageUpload={onImageUpload}
              showHeader={false}
              instructionText="Drag and drop your photo here"
              instructionElement="p"
              showInlineChooseText={false}
              chooseFileLabel="Upload photo"
              chooseButtonClassName="font-semibold shadow-sm"
              chooseButtonStyle={{ padding: '0.75rem 1.25rem', fontSize: '0.9375rem' }}
              supportsText="Supports PNG, JPG, GIF, and WEBP - up to 10MB"
              sectionClassName="bg-transparent py-0"
              containerClassName="px-0 text-center"
              uploadZoneClassName="max-w-none border-blue-200 shadow-lg hover:border-blue-500"
              uploadZoneStyle={{ minHeight: '14rem', borderRadius: '0.5rem' }}
            />
            <PhotoPreviewStrip className="hidden lg:block" />
          </div>

          <div className="order-3 lg:hidden">
            <PhotoHeroPointGrid />
            <PhotoMainConverterLink
              to={mainConverterTo}
              label={mainConverterLabel}
              note={secondIntro}
              className="mt-5"
            />
            {firstIntro ? (
              <p className="mt-5 max-w-2xl text-base leading-7 text-gray-700">
                {firstIntro}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

function PhotoContentSections({ sections = [] }) {
  const visibleSections = Array.isArray(sections)
    ? sections.filter((section) => section?.title || section?.body?.length || section?.items?.length)
    : []
  const cardSection = visibleSections.find((section) => Array.isArray(section.items) && section.items.length)
  const settingsSection = visibleSections.find((section) => Array.isArray(section.body) && section.body.length)

  return (
    <Fragment>
      {cardSection ? (
        <section className="bg-white py-10">
          <div className="container mx-auto max-w-5xl px-4">
            <h2 className="text-2xl font-bold text-gray-950">{cardSection.title}</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
              {cardSection.items.map((item, index) => (
                <article key={index} className="rounded-lg border border-gray-200 bg-slate-50 p-5">
                  {item.title ? (
                    <h3 className="text-base font-semibold text-gray-950">{item.title}</h3>
                  ) : null}
                  {item.description ? (
                    <p className="mt-2 text-sm leading-6 text-gray-700">{item.description}</p>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {settingsSection ? (
        <section className="bg-slate-50 py-10">
          <div className="container mx-auto grid max-w-5xl gap-6 px-4 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="text-2xl font-bold text-gray-950">{settingsSection.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Start with the photo, then tune only the settings that make the subject easier to read.
              </p>
            </div>
            <div className="space-y-3">
              {settingsSection.body.map((paragraph, index) => (
                <article key={index} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-6 text-gray-700">{paragraph}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </Fragment>
  )
}

function PhotoHowToSection({ howItWorks }) {
  const steps = Array.isArray(howItWorks?.steps) ? howItWorks.steps.slice(0, 3) : []
  if (!steps.length) return null

  return (
    <section className="bg-white py-10">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-gray-950 md:text-3xl">{howItWorks?.title}</h2>
          {howItWorks?.description ? (
            <p className="mt-3 text-sm leading-6 text-gray-600 md:text-base">{howItWorks.description}</p>
          ) : null}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title || index} className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                {index + 1}
              </span>
              <h3 className="mt-4 text-base font-semibold text-gray-950">{step.title}</h3>
              {step.description ? (
                <p className="mt-2 text-sm leading-6 text-gray-700">{step.description}</p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function PhotoFaqSection({ title, items = [] }) {
  const visibleItems = Array.isArray(items)
    ? items.filter((item) => item?.question && item?.answer).slice(0, 3)
    : []
  if (!visibleItems.length) return null

  return (
    <section id="faq" className="bg-white py-10">
      <div className="container mx-auto max-w-3xl px-4">
        <h2 className="text-2xl font-bold text-gray-950">{title || 'Photo to Pixel Art FAQ'}</h2>
        <div className="mt-5 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
          {visibleItems.map((item, index) => (
            <article key={index} className="p-5">
              <h3 className="text-base font-semibold text-gray-950">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-700">{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function RelatedConvertersSection({
  heading,
  relatedPages = [],
  showSiteLinks = false,
  siteLinks = [],
  siteHeading = 'Explore',
}) {
  if (!relatedPages.length && !showSiteLinks) return null

  return (
    <section className="bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {relatedPages.length ? (
          <Fragment>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">{heading}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {relatedPages.map((related) => (
                <LocalizedLink
                  key={related.slug}
                  to={`/converter/${related.slug}/`}
                  className="block rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                >
                  <h3 className="mb-2 font-medium text-gray-900">{related.displayH1 || related.h1}</h3>
                  <p className="line-clamp-2 text-sm text-gray-600">
                    {related.displayIntro || (Array.isArray(related.intro) ? related.intro[0] : related.intro)}
                  </p>
                </LocalizedLink>
              ))}
            </div>
          </Fragment>
        ) : null}
        {showSiteLinks ? (
          <div className="mt-8 rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">{siteHeading}</h3>
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
        ) : null}
      </div>
    </section>
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
  const isEnglishPhotoConverter = page.slug === 'photo-to-pixel-art' && (currentLocale || 'en') === 'en'
  const defaultRelatedPages = pages
    .filter((entry) => entry.slug !== page.slug)
    .sort((a, b) => Number(b.slug === 'image-to-pixel-art') - Number(a.slug === 'image-to-pixel-art'))
    .slice(0, 6)
  const photoRelatedPages = ['image-to-pixel-art', 'png-to-pixel-art', 'jpg-to-pixel-art']
    .map((relatedSlug) => pages.find((entry) => entry.slug === relatedSlug))
    .filter(Boolean)
    .map((entry) => entry.slug === 'image-to-pixel-art'
      ? {
          ...entry,
          displayH1: 'General image converter',
          displayIntro: 'Use the main converter when your source is a logo, screenshot, icon, or mixed image.',
        }
      : entry)
  const relatedPages = isEnglishPhotoConverter
    ? (photoRelatedPages.length ? photoRelatedPages : defaultRelatedPages.slice(0, 3))
    : defaultRelatedPages
  const faqItems = t('faq.items', { returnObjects: true }) || []
  const pageFaqItems = Array.isArray(page.faq?.items)
    ? page.faq.items.filter((item) => item?.question && item?.answer)
    : []
  const renderedFaqItems = pageFaqItems.length ? pageFaqItems : faqItems
  const renderedFaqTitle = pageFaqItems.length ? page.faq?.title : undefined
  const pageHowSteps = Array.isArray(page.howItWorks?.steps)
    ? page.howItWorks.steps.filter((step) => step?.title)
    : []
  const siteLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/blog/', label: t('nav.blog') },
    { to: '/about/', label: t('nav.about') },
    { to: '/contact/', label: t('nav.contact') },
    { to: '/privacy/', label: t('footer.privacy') },
    { to: '/terms/', label: t('footer.terms') },
  ]
  const introParas = Array.isArray(page.intro) ? page.intro : [page.intro]
  const faqJsonLd = buildFaqJsonLd(renderedFaqItems)
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
    step: pageHowSteps.length
      ? pageHowSteps.map((step) => ({ '@type': 'HowToStep', name: step.title }))
      : [
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
      ) : isEnglishPhotoConverter ? (
        <Fragment>
          <PhotoPseoHero
            page={page}
            introParas={introParas}
            fallback={fallback}
            onImageUpload={setUploadedImage}
          />
          {uploadedImage ? (
            <Suspense fallback={null}>
              <Editor image={uploadedImage} />
            </Suspense>
          ) : null}
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
      {isEnglishPhotoConverter ? (
        <Fragment>
          <PhotoContentSections sections={page.contentSections} />
          <PhotoHowToSection howItWorks={page.howItWorks} />
          <RelatedConvertersSection
            heading={t('pseo.relatedHeading')}
            relatedPages={relatedPages}
          />
          <PhotoFaqSection title={renderedFaqTitle} items={renderedFaqItems} />
        </Fragment>
      ) : (
        <Fragment>
          <PseoContentSections sections={page.contentSections} />
          <HowItWorksSection
            title={page.howItWorks?.title}
            description={page.howItWorks?.description}
            steps={page.howItWorks?.steps}
          />
          {!isPrimaryConverter && page.bottomCallout ? (
            <section className="bg-white py-8">
              <div className="container mx-auto px-4 max-w-4xl">
                <MainConverterCallout callout={page.bottomCallout} testId="primary-converter-callout-bottom" />
              </div>
            </section>
          ) : null}
          <RelatedConvertersSection
            heading={t('pseo.relatedHeading')}
            relatedPages={relatedPages}
            showSiteLinks
            siteLinks={siteLinks}
            siteHeading={t('footer.explore')}
          />
          <FaqSection title={renderedFaqTitle} items={renderedFaqItems} />
        </Fragment>
      )}
    </Fragment>
  )
}
