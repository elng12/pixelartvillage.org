import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, Link } from 'react-router-dom'
import Seo from '@/components/Seo'
import { generateHreflangLinks } from '@/utils/hreflang'

export default function About() {
  const { t } = useTranslation()
  const params = useParams()
  const currentLang = params.lang || 'en'
  const prefix = currentLang === 'en' ? '' : `/${currentLang}`
  const canonical = `https://pixelartvillage.org${prefix}/about/`
  const hreflangLinks = generateHreflangLinks('/about')
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Seo
        title="About | Pixel Art Village"
        description="About Pixel Art Village: a free, browser‑based pixel art maker & converter. Privacy‑first, fast, and accessible tool for creating retro game graphics."
        canonical={canonical}
        hreflang={hreflangLinks}
        meta={[
          { property: 'og:url', content: canonical },
          { property: 'og:type', content: 'website' },
          { property: 'og:title', content: 'About | Pixel Art Village' },
          { property: 'og:description', content: 'About Pixel Art Village: a free, browser‑based pixel art maker & converter. Privacy‑first, fast, and accessible tool for creating retro game graphics.' },
          { property: 'og:image', content: 'https://pixelartvillage.org/social-about.png' },
          { property: 'og:site_name', content: 'Pixel Art Village' },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: 'About | Pixel Art Village' },
          { name: 'twitter:description', content: 'About Pixel Art Village: a free, browser‑based pixel art maker & converter. Privacy‑first, fast, and accessible tool for creating retro game graphics.' },
          { name: 'twitter:image', content: 'https://pixelartvillage.org/social-about.png' },
        ]}
      />
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('about.h1')}</h1>
      <div className="prose prose-sm text-gray-700">
        <p>{t('about.p1')}</p>
        <p>
          Try our <Link to={`${prefix}/`} className="text-blue-600 underline">pixel art converter</Link> tool
          or explore our <Link to={`${prefix}/blog`} className="text-blue-600 underline">blog</Link> for tips and tutorials.
        </p>
        <h2>{t('about.principles.title')}</h2>
        <ul>
          <li><strong>{t('about.principles.privacy.title')}</strong> {t('about.principles.privacy.desc')}</li>
          <li><strong>{t('about.principles.performance.title')}</strong> {t('about.principles.performance.desc')}</li>
          <li><strong>{t('about.principles.accessibility.title')}</strong> {t('about.principles.accessibility.desc')}</li>
        </ul>
        <h2>{t('about.contact.title')}</h2>
        <p>
          {t('about.contact.p1')}
          {' '}<a className="font-mono text-blue-600 underline" href="mailto:2296744453m@gmail.com">2296744453m@gmail.com</a>.
        </p>
        <p>
          For more information, see our <Link to={`${prefix}/privacy`} className="text-blue-600 underline">privacy policy</Link> and
          <Link to={`${prefix}/terms`} className="text-blue-600 underline"> terms of service</Link>.
        </p>
      </div>
    </div>
  )
}
