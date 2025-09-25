import React from 'react'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/Seo'

export default function Contact() {
  const { t } = useTranslation()
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Seo
        title="Contact | Pixel Art Village"
        canonical="https://pixelartvillage.org/contact"
        meta={[
          { property: 'og:url', content: 'https://pixelartvillage.org/contact' },
          { property: 'og:type', content: 'website' },
          { property: 'og:title', content: 'Contact | Pixel Art Village' },
          { property: 'og:description', content: 'Contact Pixel Art Village: support, feedback, partnerships. Email 2296744453m@gmail.com.' },
          { property: 'og:image', content: 'https://pixelartvillage.org/social-contact.png' },
          { property: 'og:site_name', content: 'Pixel Art Village' },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: 'Contact | Pixel Art Village' },
          { name: 'twitter:description', content: 'Contact Pixel Art Village: support, feedback, partnerships. Email 2296744453m@gmail.com.' },
          { name: 'twitter:image', content: 'https://pixelartvillage.org/social-contact.png' },
        ]}
      />
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('contact.h1')}</h1>
      <div className="prose prose-sm text-gray-700">
        <p>{t('contact.p1')}</p>
        <ul>
          <li>{t('contact.emailLabel')} <a className="font-mono text-blue-600 underline" href="mailto:2296744453m@gmail.com">2296744453m@gmail.com</a></li>
        </ul>
        <p className="text-xs text-gray-500">{t('contact.note')}</p>
      </div>
    </div>
  )
}
