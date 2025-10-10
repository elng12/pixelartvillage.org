import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, Link } from 'react-router-dom'
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
  const canonical = `https://pixelartvillage.org${prefix}/terms/`
  return (
    <div className="container mx-auto px-4 py-10">
      <Seo
        title="Terms of Service | Pixel Art Village"
        canonical={canonical}
        lang={currentLang}
        meta={[
          { property: 'og:url', content: canonical },
          { property: 'og:type', content: 'website' },
          { property: 'og:title', content: 'Terms of Service | Image to Pixel Art Converter' },
        { property: 'og:description', content: 'Terms of service for our image to pixel art converter: usage rules, responsibilities, disclaimer, IP, governing law, contact info.' },
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
          {t('terms.sections.contact.p1')} Email: <a className="font-mono text-blue-600 underline" href="mailto:2296744453m@gmail.com" title="Email Pixel Art Village">2296744453m@gmail.com</a>
        </p>
      </Section>

      {/* Internal Links Section */}
      <section className="max-w-3xl mx-auto mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Main Site</h3>
            <ul className="space-y-1">
              <li><Link to={`${prefix}/`} className="text-blue-600 hover:text-blue-800">Pixel Art Converter</Link></li>
              <li><Link to={`${prefix}/about/`} className="text-blue-600 hover:text-blue-800">About Us</Link></li>
              <li><Link to={`${prefix}/contact/`} className="text-blue-600 hover:text-blue-800">Contact</Link></li>
              <li><Link to={`${prefix}/blog/`} className="text-blue-600 hover:text-blue-800">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Popular Converters</h3>
            <ul className="space-y-1">
              <li><Link to={`${prefix}/converter/png-to-pixel-art/`} className="text-blue-600 hover:text-blue-800">PNG to Pixel Art</Link></li>
              <li><Link to={`${prefix}/converter/jpg-to-pixel-art/`} className="text-blue-600 hover:text-blue-800">JPG to Pixel Art</Link></li>
              <li><Link to={`${prefix}/converter/image-to-pixel-art/`} className="text-blue-600 hover:text-blue-800">Image to Pixel Art</Link></li>
              <li><Link to={`${prefix}/converter/photo-to-pixel-art/`} className="text-blue-600 hover:text-blue-800">Photo to Pixel Art</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
