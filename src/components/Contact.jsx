import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import Seo from '@/components/Seo'
import { generateHreflangLinks } from '@/utils/hreflang'
import { useLocaleContext } from '@/hooks/useLocaleContext'
import LocalizedLink from '@/components/LocalizedLink'

export default function Contact() {
  const { t } = useTranslation()
  const params = useParams()
  const { currentLocale, buildPath } = useLocaleContext()
  const currentLang = params.lang || currentLocale || 'en'
  const canonical = `https://pixelartvillage.org${buildPath('/contact/')}`
  const hreflangLinks = generateHreflangLinks('/contact')
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Seo
        title={t('contact.seoTitle')}
        description={t('contact.seoDesc')}
        canonical={canonical}
        hreflang={hreflangLinks}
        lang={currentLang}
        meta={[
          { property: 'og:url', content: canonical },
          { property: 'og:type', content: 'website' },
          { property: 'og:title', content: t('contact.ogTitle') },
          { property: 'og:description', content: t('contact.ogDesc') },
          { property: 'og:image', content: 'https://pixelartvillage.org/social-contact.png' },
          { property: 'og:site_name', content: t('site.name') },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: t('contact.twitterTitle') },
          { name: 'twitter:description', content: t('contact.twitterDesc') },
          { name: 'twitter:image', content: 'https://pixelartvillage.org/social-contact.png' },
        ]}
      />
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('contact.h1')}</h1>
      <div className="prose prose-sm text-gray-700">
        <p>{t('contact.p1')}</p>
        <ul>
          <li>
            {t('contact.emailLabel')}{' '}
            <a
              className="font-mono text-blue-600 underline"
              href="mailto:2296744453m@gmail.com"
              title={t('contact.emailTitle')}
            >
              2296744453m@gmail.com
            </a>
          </li>
        </ul>
        <p>
          {t('contact.p2')}{' '}
          <LocalizedLink to="/blog/" className="text-blue-600 underline">{t('contact.p3')}</LocalizedLink>{' '}
          {t('contact.p4')}{' '}
          <LocalizedLink to="/" className="text-blue-600 underline">{t('contact.p5')}</LocalizedLink>{' '}
          {t('contact.p6')}{' '}
          <LocalizedLink to="/about/" className="text-blue-600 underline">{t('contact.p7')}</LocalizedLink>{' '}
          {t('contact.p8')}
        </p>
        <p>
          {t('contact.p9')}{' '}
          <LocalizedLink to="/converter/png-to-pixel-art/" className="text-blue-600 underline">{t('contact.p10')}</LocalizedLink>{' '}
          {t('contact.p11')}{' '}
          <LocalizedLink to="/converter/image-to-pixel-art/" className="text-blue-600 underline">{t('contact.p12')}</LocalizedLink>{' '}
          {t('contact.p13')}
        </p>
        <p className="text-xs text-gray-500">{t('contact.note')}</p>
      </div>
    </div>
  )
}
