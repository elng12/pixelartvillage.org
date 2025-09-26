import React from 'react'
import { useTranslation } from 'react-i18next'
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

export default function PrivacyPolicy() {
  const { t } = useTranslation()
  return (
    <div className="container mx-auto px-4 py-10">
      <Seo
        title="Privacy Policy | Pixel Art Village"
        canonical="https://pixelartvillage.org/privacy"
        meta={[
          { property: 'og:url', content: 'https://pixelartvillage.org/privacy' },
          { property: 'og:type', content: 'website' },
          { property: 'og:title', content: 'Privacy Policy | Pixel Art Village' },
          { property: 'og:description', content: 'Pixel Art Village privacy policy: local image processing, AdSense cookies, third‑party partners, your choices and rights, contact info.' },
          { property: 'og:image', content: 'https://pixelartvillage.org/social-privacy.png' },
          { property: 'og:site_name', content: 'Pixel Art Village' },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: 'Privacy Policy | Pixel Art Village' },
          { name: 'twitter:description', content: 'Pixel Art Village privacy policy: local image processing, AdSense cookies, third‑party partners, your choices and rights, contact info.' },
          { name: 'twitter:image', content: 'https://pixelartvillage.org/social-privacy.png' },
        ]}
      />
      <header className="max-w-3xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('privacy.h1')}</h1>
        <p className="text-sm text-gray-500 mt-2">{t('common.lastUpdated', { date: new Date().toISOString().slice(0, 10) })}</p>
      </header>

      <Section title={t('privacy.sections.overview.title')} id="overview">
        <p>
          {t('privacy.sections.overview.p1')}
        </p>
      </Section>

      <Section title={t('privacy.sections.local.title')} id="local-processing">
        <p>
          {t('privacy.sections.local.p1')}
        </p>
      </Section>

      <Section title={t('privacy.sections.collect.title')} id="data-we-collect">
        <ul>
          <li>{t('privacy.sections.collect.li1')}</li>
          <li>{t('privacy.sections.collect.li2')}</li>
          <li>{t('privacy.sections.collect.li3')}</li>
        </ul>
        <p>
          {t('privacy.sections.collect.p2')}
        </p>
      </Section>

      <Section title={t('privacy.sections.cookies.title')} id="cookies-adsense">
        <p>
          {t('privacy.sections.cookies.p1')}
        </p>
        <ul>
          <li>
            {t('privacy.sections.cookies.learn')}
            {' '}<a className="text-blue-600 underline" href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">policies.google.com/technologies/partner-sites</a>
          </li>
          <li>
            {t('privacy.sections.cookies.manage')}
            {' '}<a className="text-blue-600 underline" href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">adssettings.google.com</a>
          </li>
          <li>
            {t('privacy.sections.cookies.more')}
            {' '}<a className="text-blue-600 underline" href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">policies.google.com/technologies/ads</a>
          </li>
        </ul>
      </Section>

      <Section title={t('privacy.sections.third.title')} id="third-parties">
        <p>
          {t('privacy.sections.third.p1')}
        </p>
      </Section>

      <Section title={t('privacy.sections.use.title')} id="use-sharing">
        <ul>
          <li>{t('privacy.sections.use.li1')}</li>
          <li>{t('privacy.sections.use.li2')}</li>
          <li>{t('privacy.sections.use.li3')}</li>
        </ul>
      </Section>

      <Section title={t('privacy.sections.rights.title')} id="your-rights">
        <ul>
          <li>{t('privacy.sections.rights.li1')}</li>
          <li>{t('privacy.sections.rights.li2')}</li>
          <li>{t('privacy.sections.rights.li3')}</li>
        </ul>
      </Section>

      <Section title={t('privacy.sections.children.title')} id="children">
        <p>
          {t('privacy.sections.children.p1')}
        </p>
      </Section>

      <Section title={t('privacy.sections.changes.title')} id="changes">
        <p>
          {t('privacy.sections.changes.p1')}
        </p>
      </Section>

      <Section title={t('privacy.sections.contact.title')} id="contact">
        <p>
          {t('privacy.sections.contact.p1')} Email: <a className="font-mono text-blue-600 underline" href="mailto:2296744453m@gmail.com">2296744453m@gmail.com</a>
        </p>
      </Section>
    </div>
  )
}
