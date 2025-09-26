import React from 'react'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/Seo'

export default function About() {
  const { t } = useTranslation()
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Seo
        title="About | Pixel Art Village"
        canonical="https://pixelartvillage.org/about"
        meta={[
          { property: 'og:url', content: 'https://pixelartvillage.org/about' },
          { property: 'og:type', content: 'website' },
          { property: 'og:title', content: 'About | Pixel Art Village' },
          { property: 'og:description', content: 'About Pixel Art Village: a free, browser‑based pixel art maker & converter. Privacy‑first, fast, and accessible.' },
          { property: 'og:image', content: 'https://pixelartvillage.org/social-about.png' },
          { property: 'og:site_name', content: 'Pixel Art Village' },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: 'About | Pixel Art Village' },
          { name: 'twitter:description', content: 'About Pixel Art Village: a free, browser‑based pixel art maker & converter. Privacy‑first, fast, and accessible.' },
          { name: 'twitter:image', content: 'https://pixelartvillage.org/social-about.png' },
        ]}
      />
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('about.h1')}</h1>
      <div className="prose prose-sm text-gray-700">
        <p>{t('about.p1')}</p>
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
      </div>
    </div>
  )
}
