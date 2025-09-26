import React, { useState, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import Seo from '@/components/Seo'
import ToolSection from '@/components/ToolSection'
import Editor from '@/components/Editor'
import ShowcaseSection from '@/components/ShowcaseSection'
import WplaceFeaturesSection from '@/components/WplaceFeaturesSection'
import FeaturesSection from '@/components/FeaturesSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import FaqSection from '@/components/FaqSection'
import pages from '@/content/pseo-pages.json'

export default function PseoPage() {
  const { t } = useTranslation()
  const { slug, lang } = useParams()
  const [uploadedImage, setUploadedImage] = useState(null)
  const page = pages.find((p) => p.slug === slug)

  if (!page) {
    const canonical = `https://pixelartvillage.org/converter/${slug || ''}`
    return (
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <Seo title={t('pseo.notFound.seoTitle')} canonical={canonical} />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('pseo.notFound.title')}</h1>
        <p className="text-gray-700">{t('pseo.notFound.desc')}</p>
      </div>
    )
  }

  const canonical = `https://pixelartvillage.org/converter/${page.slug}`

  return (
    <Fragment>
      <Seo
        title={page.title}
        canonical={canonical}
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

      {/* pSEO 独特内容块（核心工具之上） */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{page.h1}</h1>
          {(Array.isArray(page.intro) ? page.intro : [page.intro]).map((para, i) => (
            <p key={i} className="text-gray-700 mb-3">{para}</p>
          ))}
        </div>
      </section>

      {/* 工具与站点内容（将工具区标题降级为 H2 以避免重复 H1） */}
      <ToolSection onImageUpload={setUploadedImage} headingLevel="h2" />
      {uploadedImage ? <Editor image={uploadedImage} /> : null}
      <ShowcaseSection />
      <WplaceFeaturesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FaqSection />
    </Fragment>
  )
}
