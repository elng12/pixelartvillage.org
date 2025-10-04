import React, { useState, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, Link } from 'react-router-dom'
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
  const currentLang = lang || 'en'
  const prefix = currentLang === 'en' ? '' : `/${currentLang}`
  const [uploadedImage, setUploadedImage] = useState(null)
  const page = pages.find((p) => p.slug === slug)

  if (!page) {
    const canonical = `https://pixelartvillage.org${prefix}/converter/${slug || ''}`
    return (
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <Seo title={t('pseo.notFound.seoTitle')} canonical={canonical} lang={currentLang} />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('pseo.notFound.title')}</h1>
        <p className="text-gray-700">{t('pseo.notFound.desc')}</p>
      </div>
    )
  }

  const canonical = `https://pixelartvillage.org${prefix}/converter/${page.slug}/`

  return (
    <Fragment>
      <Seo
        title={page.title}
        canonical={canonical}
        lang={currentLang}
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

      {/* 相关工具链接部分 */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Pixel Art Converters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages
              .filter(p => p.slug !== page.slug)
              .slice(0, 6)
              .map(relatedPage => (
                <Link
                  key={relatedPage.slug}
                  to={`/converter/${relatedPage.slug}/`}
                  className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                >
                  <h3 className="font-medium text-gray-900 mb-2">{relatedPage.h1}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {Array.isArray(relatedPage.intro) ? relatedPage.intro[0] : relatedPage.intro}
                  </p>
                </Link>
              ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Site Navigation</h3>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link to={`${prefix}/`} className="text-blue-600 hover:text-blue-800">Home</Link>
              <Link to={`${prefix}/about/`} className="text-blue-600 hover:text-blue-800">About</Link>
              <Link to={`${prefix}/contact/`} className="text-blue-600 hover:text-blue-800">Contact</Link>
              <Link to={`${prefix}/privacy/`} className="text-blue-600 hover:text-blue-800">Privacy Policy</Link>
              <Link to={`${prefix}/terms/`} className="text-blue-600 hover:text-blue-800">Terms of Service</Link>
              <Link to={`${prefix}/blog/`} className="text-blue-600 hover:text-blue-800">Blog</Link>
            </nav>
          </div>
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
