import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
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

export default function PrivacyPolicy() {
  const { t } = useTranslation()
  const { currentLocale, buildPath } = useLocaleContext()
  const canonical = `https://pixelartvillage.org${buildPath('/privacy/')}`
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="container mx-auto px-4 py-10">
      <Seo
        title={t('privacy.seoTitle')}
        description={t('privacy.seoDesc')}
        canonical={canonical}
        lang={currentLocale}
        meta={[
          { property: 'og:url', content: canonical },
          { property: 'og:type', content: 'website' },
          { property: 'og:title', content: t('privacy.meta.ogTitle') },
          { property: 'og:description', content: t('privacy.meta.ogDescription') },
          { property: 'og:image', content: 'https://pixelartvillage.org/social-privacy.png' },
          { property: 'og:site_name', content: t('site.name') },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: t('privacy.meta.twitterTitle') },
          { name: 'twitter:description', content: t('privacy.meta.twitterDescription') },
          { name: 'twitter:image', content: 'https://pixelartvillage.org/social-privacy.png' },
        ]}
      />
      <header className="max-w-3xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('privacy.h1')}</h1>
        <p className="text-sm text-gray-500 mt-2">{t('common.lastUpdated', { date: today })}</p>
      </header>

      <Section title={t('privacy.sections.overview.title')} id="overview">
        <p>{t('privacy.sections.overview.p1')}</p>
      </Section>

      <Section title={t('privacy.sections.local.title')} id="local-processing">
        <p>{t('privacy.sections.local.p1')}</p>
      </Section>

      <Section title={t('privacy.sections.collect.title')} id="data-we-collect">
        <ul>
          <li>{t('privacy.sections.collect.li1')}</li>
          <li>{t('privacy.sections.collect.li2')}</li>
          <li>{t('privacy.sections.collect.li3')}</li>
        </ul>
        <p>{t('privacy.sections.collect.p2')}</p>
      </Section>

      <Section title={t('privacy.sections.cookies.title')} id="cookies-adsense">
        <p>{t('privacy.sections.cookies.p1')}</p>
        <ul>
          <li>
            <Trans
              i18nKey="privacy.sections.cookies.learn"
              components={{
                link: (
                  <a
                    className="text-blue-600 underline"
                    href="https://policies.google.com/technologies/partner-sites"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  />
                ),
              }}
            />
          </li>
          <li>
            <Trans
              i18nKey="privacy.sections.cookies.manage"
              components={{
                link: (
                  <a
                    className="text-blue-600 underline"
                    href="https://adssettings.google.com/"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  />
                ),
              }}
            />
          </li>
          <li>
            <Trans
              i18nKey="privacy.sections.cookies.more"
              components={{
                link: (
                  <a
                    className="text-blue-600 underline"
                    href="https://policies.google.com/technologies/ads"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  />
                ),
              }}
            />
          </li>
        </ul>
      </Section>

      <Section title={t('privacy.sections.third.title')} id="third-parties">
        <p>{t('privacy.sections.third.p1')}</p>
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
        <p>{t('privacy.sections.children.p1')}</p>
      </Section>

      <Section title={t('privacy.sections.changes.title')} id="changes">
        <p>{t('privacy.sections.changes.p1')}</p>
      </Section>

      <section className="max-w-3xl mx-auto mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('privacy.quickLinks.heading')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">{t('privacy.quickLinks.mainSite')}</h3>
            <ul className="space-y-1">
              <li>
                <LocalizedLink to="/" className="text-blue-600 hover:text-blue-800">
                  {t('privacy.quickLinks.links.home')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink to="/about/" className="text-blue-600 hover:text-blue-800">
                  {t('privacy.quickLinks.links.about')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink to="/contact/" className="text-blue-600 hover:text-blue-800">
                  {t('privacy.quickLinks.links.contact')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink to="/blog/" className="text-blue-600 hover:text-blue-800">
                  {t('privacy.quickLinks.links.blog')}
                </LocalizedLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">{t('privacy.quickLinks.popularConverters')}</h3>
            <ul className="space-y-1">
              <li>
                <LocalizedLink to="/converter/png-to-pixel-art/" className="text-blue-600 hover:text-blue-800">
                  {t('privacy.quickLinks.links.png')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink to="/converter/jpg-to-pixel-art/" className="text-blue-600 hover:text-blue-800">
                  {t('privacy.quickLinks.links.jpg')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink to="/converter/image-to-pixel-art/" className="text-blue-600 hover:text-blue-800">
                  {t('privacy.quickLinks.links.image')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink to="/converter/photo-to-pixel-art/" className="text-blue-600 hover:text-blue-800">
                  {t('privacy.quickLinks.links.photo')}
                </LocalizedLink>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
