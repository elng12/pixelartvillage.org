import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import Seo from '@/components/Seo'

function Section({ title, children, id }) {
  return (
    <section id={id} className="max-w-3xl mx-auto mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-3">{title}</h2>
      <div className="prose prose-sm text-gray-700">
        {children}
      </div>
    </section>
  )
}

export default function TermsOfService() {
  const { t } = useTranslation()
  const params = useParams()
  const currentLang = params.lang || 'en'
  const prefix = currentLang === 'en' ? '' : `/${currentLang}`
  const canonical = `https://pixelartvillage.org${prefix}/terms`
  return (
    <div className="container mx-auto px-4 py-10">
      <Seo
        title="Terms of Service | Pixel Art Village"
        canonical={canonical}
        meta={[
          { property: 'og:url', content: canonical },
          { property: 'og:type', content: 'website' },
          { property: 'og:title', content: 'Terms of Service | Pixel Art Village' },
          { property: 'og:description', content: 'Pixel Art Village terms of service: usage rules, responsibilities, disclaimer, IP, governing law, contact info.' },
          { property: 'og:image', content: 'https://pixelartvillage.org/social-terms.png' },
          { property: 'og:site_name', content: 'Pixel Art Village' },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: 'Terms of Service | Pixel Art Village' },
          { name: 'twitter:description', content: 'Pixel Art Village terms of service: usage rules, responsibilities, disclaimer, IP, governing law, contact info.' },
          { name: 'twitter:image', content: 'https://pixelartvillage.org/social-terms.png' },
        ]}
      />
      <header className="max-w-3xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('terms.h1')}</h1>
        <p className="text-sm text-gray-500 mt-2">{t('common.lastUpdated', { date: new Date().toISOString().slice(0, 10) })}</p>
      </header>

      <Section title={t('terms.sections.acceptance.title')} id="acceptance">
        <p>
          {t('terms.sections.acceptance.p1')}
        </p>
      </Section>

      <Section title={t('terms.sections.use.title')} id="use">
        <ul>
          <li>{t('terms.sections.use.li1')}</li>
          <li>{t('terms.sections.use.li2')}</li>
          <li>{t('terms.sections.use.li3')}</li>
        </ul>
      </Section>

      <Section title={t('terms.sections.ip.title')} id="ip">
        <p>
          {t('terms.sections.ip.p1')}
        </p>
      </Section>

      <Section title={t('terms.sections.processing.title')} id="processing">
        <p>
          {t('terms.sections.processing.p1')}
        </p>
      </Section>

      <Section title={t('terms.sections.disclaimer.title')} id="disclaimer">
        <p>
          {t('terms.sections.disclaimer.p1')}
        </p>
      </Section>

      <Section title={t('terms.sections.liability.title')} id="liability">
        <p>
          {t('terms.sections.liability.p1')}
        </p>
      </Section>

      <Section title={t('terms.sections.changes.title')} id="changes">
        <p>
          {t('terms.sections.changes.p1')}
        </p>
      </Section>

      <Section title={t('terms.sections.law.title')} id="law">
        <p>
          {t('terms.sections.law.p1')}
        </p>
      </Section>

      <Section title={t('terms.sections.contact.title')} id="contact">
        <p>
          {t('terms.sections.contact.p1')} Email: <a className="font-mono text-blue-600 underline" href="mailto:2296744453m@gmail.com">2296744453m@gmail.com</a>
        </p>
      </Section>
    </div>
  )
}
