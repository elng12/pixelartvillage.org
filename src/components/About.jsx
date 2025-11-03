import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Seo from '@/components/Seo'
import { generateHreflangLinks } from '@/utils/hreflang'
import { useLocaleContext } from '@/contexts/LocaleContext'
import LocalizedLink from '@/components/LocalizedLink'

export default function About() {
  const { t } = useTranslation()
  const { currentLocale, buildPath } = useLocaleContext()
  const canonical = `https://pixelartvillage.org${buildPath('/about/')}`
  const hreflangLinks = generateHreflangLinks('/about')
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Seo
        title={t('about.seoTitle')}
        description={t('about.seoDesc')}
        canonical={canonical}
        hreflang={hreflangLinks}
        lang={currentLocale}
        meta={[
          { property: 'og:url', content: canonical },
          { property: 'og:type', content: 'website' },
          { property: 'og:title', content: t('about.ogTitle') },
          { property: 'og:description', content: t('about.ogDesc') },
          { property: 'og:image', content: 'https://pixelartvillage.org/social-about.png' },
          { property: 'og:site_name', content: t('site.name') },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: t('about.twitterTitle') },
          { name: 'twitter:description', content: t('about.twitterDesc') },
          { name: 'twitter:image', content: 'https://pixelartvillage.org/social-about.png' },
        ]}
      />
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('about.h1')}</h1>
      <div className="prose prose-sm text-gray-700">
        <p>{t('about.p1')}</p>
        <p>{t('about.p2')}</p>
        <p>{t('about.p3')}</p>
        <p>
          <Trans
            i18nKey="about.cta"
            components={{
              tool: <LocalizedLink to="/" className="text-blue-600 underline" />,
              blog: <LocalizedLink to="/blog/" className="text-blue-600 underline" />,
            }}
          />
        </p>
        <p>
          <Trans
            i18nKey="about.specializedLinks"
            components={{
              png: <LocalizedLink to="/converter/png-to-pixel-art/" className="text-blue-600 underline" />,
              jpg: <LocalizedLink to="/converter/jpg-to-pixel-art/" className="text-blue-600 underline" />,
              photo: <LocalizedLink to="/converter/photo-to-sprite-converter/" className="text-blue-600 underline" />,
            }}
          />
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
          {' '}
          <a className="font-mono text-blue-600 underline" href="mailto:2296744453m@gmail.com" title={t('about.contact.emailTitle')}>
            2296744453m@gmail.com
          </a>.
        </p>
        <p>
          <Trans
            i18nKey="about.moreInfoRich"
            components={{
              privacy: <LocalizedLink to="/privacy/" className="text-blue-600 underline" />,
              terms: <LocalizedLink to="/terms/" className="text-blue-600 underline" />,
            }}
          />
        </p>
      </div>
    </div>
  )
}
