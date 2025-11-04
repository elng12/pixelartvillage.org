import React from 'react'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/Seo'
import { useLocaleContext } from '@/hooks/useLocaleContext'
import LocalizedLink from '@/components/LocalizedLink'

function Section({ title, children, id }) {
  return (
    <section id={id} className="max-w-3xl mx-auto mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-3">{title}</h2>
      <div className="prose prose-sm text-gray-700">{children}</div>
    </section>
  )
}

export default function TermsOfService() {
  const { t } = useTranslation()
  const { currentLocale, buildPath } = useLocaleContext()
  const canonical = `https://pixelartvillage.org${buildPath('/terms/')}`
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="container mx-auto px-4 py-10">
      <Seo
        title={t('terms.seoTitle')}
        canonical={canonical}
        lang={currentLocale}
        meta={[
          { property: 'og:url', content: canonical },
          { property: 'og:type', content: 'website' },
          { property: 'og:title', content: t('terms.meta.ogTitle') },
          { property: 'og:description', content: t('terms.meta.ogDescription') },
          { property: 'og:image', content: 'https://pixelartvillage.org/social-terms.png' },
          { property: 'og:site_name', content: t('site.name') },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: t('terms.meta.twitterTitle') },
          { name: 'twitter:description', content: t('terms.meta.twitterDescription') },
          { name: 'twitter:image', content: 'https://pixelartvillage.org/social-terms.png' },
        ]}
      />
      <header className="max-w-3xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('terms.h1')}</h1>
        <p className="text-sm text-gray-500 mt-2">{t('common.lastUpdated', { date: today })}</p>
      </header>

      <Section title={t('terms.sections.acceptance.title')} id="acceptance">
        <p>{t('terms.sections.acceptance.p1')}</p>
      </Section>

      <Section title={t('terms.sections.use.title')} id="use">
        <ul>
          <li>{t('terms.sections.use.li1')}</li>
          <li>{t('terms.sections.use.li2')}</li>
          <li>{t('terms.sections.use.li3')}</li>
        </ul>
      </Section>

      <Section title={t('terms.sections.ip.title')} id="ip">
        <p>{t('terms.sections.ip.p1')}</p>
      </Section>

      <Section title={t('terms.sections.processing.title')} id="processing">
        <p>{t('terms.sections.processing.p1')}</p>
      </Section>

      <Section title={t('terms.sections.disclaimer.title')} id="disclaimer">
        <p>{t('terms.sections.disclaimer.p1')}</p>
      </Section>

      <Section title={t('terms.sections.liability.title')} id="liability">
        <p>{t('terms.sections.liability.p1')}</p>
      </Section>

      <Section title={t('terms.sections.changes.title')} id="changes">
        <p>{t('terms.sections.changes.p1')}</p>
      </Section>

      <Section title={t('terms.sections.law.title')} id="law">
        <p>{t('terms.sections.law.p1')}</p>
      </Section>

      <Section title={t('terms.sections.contact.title')} id="contact">
        <p>
          {t('terms.sections.contact.p1')}{' '}
          <a
            className="font-mono text-blue-600 underline"
            href="mailto:2296744453m@gmail.com"
            title={t('terms.sections.contact.emailTitle')}
          >
            2296744453m@gmail.com
          </a>
        </p>
      </Section>

      <section className="max-w-3xl mx-auto mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('terms.quickLinks.heading')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">{t('terms.quickLinks.mainSite')}</h3>
            <ul className="space-y-1">
              <li>
                <LocalizedLink to="/" className="text-blue-600 hover:text-blue-800">
                  {t('terms.quickLinks.links.home')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink to="/about/" className="text-blue-600 hover:text-blue-800">
                  {t('terms.quickLinks.links.about')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink to="/contact/" className="text-blue-600 hover:text-blue-800">
                  {t('terms.quickLinks.links.contact')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink to="/blog/" className="text-blue-600 hover:text-blue-800">
                  {t('terms.quickLinks.links.blog')}
                </LocalizedLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">{t('terms.quickLinks.popularConverters')}</h3>
            <ul className="space-y-1">
              <li>
                <LocalizedLink to="/converter/png-to-pixel-art/" className="text-blue-600 hover:text-blue-800">
                  {t('terms.quickLinks.links.png')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink to="/converter/jpg-to-pixel-art/" className="text-blue-600 hover:text-blue-800">
                  {t('terms.quickLinks.links.jpg')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink to="/converter/image-to-pixel-art/" className="text-blue-600 hover:text-blue-800">
                  {t('terms.quickLinks.links.image')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink to="/converter/photo-to-pixel-art/" className="text-blue-600 hover:text-blue-800">
                  {t('terms.quickLinks.links.photo')}
                </LocalizedLink>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
