import { useTranslation } from 'react-i18next'
import ShowcaseSection from './ShowcaseSection'
import WplaceFeaturesSection from './WplaceFeaturesSection'
import FeaturesSection from './FeaturesSection'
import HowItWorksSection from './HowItWorksSection'
import FaqSection from './FaqSection'
import LocalizedLink from '@/components/LocalizedLink'

const HOME_BELOW_FOLD_STYLE = {
  contentVisibility: 'auto',
  containIntrinsicSize: '2600px',
}

export default function HomeBelowFold() {
  const { t } = useTranslation()
  const featuredTools = [
    {
      to: '/converter/photo-to-pixel-art/',
      title: t('home.cards.photoToPixel.title'),
      description: t('home.cards.photoToPixel.description'),
    },
    {
      to: '/converter/photo-to-sprite-converter/',
      title: t('home.cards.photoToSprite.title'),
      description: t('home.cards.photoToSprite.description'),
    },
    {
      to: '/converter/png-to-pixel-art/',
      title: t('home.cards.pngToPixel.title'),
      description: t('home.cards.pngToPixel.description'),
    },
    {
      to: '/converter/gif-to-pixel-art/',
      title: t('home.cards.gifToPixel.title'),
      description: t('home.cards.gifToPixel.description'),
    },
  ]

  return (
    <div style={HOME_BELOW_FOLD_STYLE}>
      <ShowcaseSection />
      <WplaceFeaturesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <section className="bg-gray-50 py-8 border-y border-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('home.exploreHeading')}</h2>
          <p className="text-sm text-gray-600 mb-4 max-w-3xl">{t('home.exploreIntro')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTools.map((tool) => (
              <LocalizedLink
                key={tool.to}
                to={tool.to}
                className="block rounded-lg border border-gray-200 bg-white px-4 py-4 hover:border-blue-300 hover:shadow-sm"
              >
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{tool.title}</h3>
                <p className="text-sm text-gray-600 leading-6">{tool.description}</p>
              </LocalizedLink>
            ))}
          </div>
        </div>
      </section>
      <FaqSection />
    </div>
  )
}
