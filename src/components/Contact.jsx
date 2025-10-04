import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, Link } from 'react-router-dom'
import Seo from '@/components/Seo'
import { generateHreflangLinks } from '@/utils/hreflang'

export default function Contact() {
  const { t } = useTranslation()
  const params = useParams()
  const currentLang = params.lang || 'en'
  const prefix = currentLang === 'en' ? '' : `/${currentLang}`
  const canonical = `https://pixelartvillage.org${prefix}/contact/`
  const hreflangLinks = generateHreflangLinks('/contact')
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Seo
        title="Contact Us | Support & Feedback | Pixel Art Village"
        description="Contact Pixel Art Village for support, feedback, partnerships, and feature requests. Get help with our pixel art converter tool."
        canonical={canonical}
        hreflang={hreflangLinks}
        lang={currentLang}
        meta={[
          { property: 'og:url', content: canonical },
          { property: 'og:type', content: 'website' },
          { property: 'og:title', content: 'Contact | Pixel Art Village' },
          { property: 'og:description', content: 'Contact Pixel Art Village for support, feedback, partnerships, and feature requests. Get help with our pixel art converter tool.' },
          { property: 'og:image', content: 'https://pixelartvillage.org/social-contact.png' },
          { property: 'og:site_name', content: 'Pixel Art Village' },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: 'Contact | Pixel Art Village' },
          { name: 'twitter:description', content: 'Contact Pixel Art Village for support, feedback, partnerships, and feature requests. Get help with our pixel art converter tool.' },
          { name: 'twitter:image', content: 'https://pixelartvillage.org/social-contact.png' },
        ]}
      />
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('contact.h1')}</h1>
      <div className="prose prose-sm text-gray-700">
        <p>{t('contact.p1')}</p>
        <p>{t('contact.p2')}</p>
        <p>{t('contact.p3')}</p>
        <ul>
          <li>{t('contact.emailLabel')} <a className="font-mono text-blue-600 underline" href="mailto:2296744453m@gmail.com" title="Email Pixel Art Village">2296744453m@gmail.com</a></li>
        </ul>
        <p>
          Before contacting us, you might find answers in our <Link to={`${prefix}/blog`} className="text-blue-600 underline">blog</Link> or
          visit our <Link to={`${prefix}/`} className="text-blue-600 underline">pixel art converter tool</Link> to get started.
          Also check our <Link to={`${prefix}/about`} className="text-blue-600 underline">about page</Link> for more information.
        </p>
        <p>
          For specific converter help, try our <Link to={`${prefix}/converter/png-to-pixel-art/`} className="text-blue-600 underline">PNG to pixel art</Link> or
          <Link to={`${prefix}/converter/image-to-pixel-art/`} className="text-blue-600 underline">image to pixel art</Link> guides.
        </p>
        <p className="text-xs text-gray-500">{t('contact.note')}</p>
      </div>
    </div>
  )
}
