import { useState, useEffect, useMemo, lazy, Suspense } from 'react'
import { Routes, Route, Outlet, useLocation, useNavigate, useParams, useOutletContext } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logger from '@/utils/logger'
import ScrollManager from './components/ScrollManager'
import CompatNotice from '@/components/CompatNotice.jsx'
import ResourcePreloader from '@/components/ResourcePreloader'
import TranslationPreloader from '@/components/TranslationPreloader'
import Header from './components/Header'
import ToolSection from './components/ToolSection'
import ShowcaseSection from './components/ShowcaseSection'
import WplaceFeaturesSection from './components/WplaceFeaturesSection'
import FeaturesSection from './components/FeaturesSection'
import HowItWorksSection from './components/HowItWorksSection'
import FaqSection from './components/FaqSection'
import LocalizedLink from '@/components/LocalizedLink'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { generateHreflangLinks } from '@/utils/hreflang'
import Seo from '@/components/Seo'
import i18n, { CANONICAL_LOCALE, setStoredLang } from '@/i18n'
import { buildLocalizedPath, extractLocaleFromPath, RUNTIME_LANGS } from '@/utils/locale'

const Editor = lazy(() => import('./components/Editor'))
const Footer = lazy(() => import('./components/Footer'))
const PrivacyPolicy = lazy(() => import('./components/policy/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./components/policy/TermsOfService'))
const About = lazy(() => import('./components/About'))
const Contact = lazy(() => import('./components/Contact'))
const Blog = lazy(() => import('./components/Blog'))
const BlogPost = lazy(() => import('./components/BlogPost'))
const PseoPage = lazy(() => import('./components/PseoPage'))
const NotFound = lazy(() => import('./components/NotFound'))

function useAppOutletContext() {
  return useOutletContext()
}

function Home() {
  const { t } = useTranslation()
  const { uploadedImage, setUploadedImage, currentLocale } = useAppOutletContext()
  const IS_E2E = String(import.meta?.env?.VITE_E2E) === '1'
  const relatedLinks = [
    { to: '/converter/image-to-pixel-art/', label: t('footer.links.generator') },
    { to: '/converter/photo-to-pixel-art/', label: t('footer.links.converter') },
    { to: '/converter/png-to-pixel-art/', label: t('footer.links.png2pixel') },
    { to: '/converter/jpg-to-pixel-art/', label: t('footer.links.jpg2pixel') },
    { to: '/blog/', label: t('nav.blog') },
    { to: '/about/', label: t('nav.about') },
    { to: '/contact/', label: t('nav.contact') },
    { to: '/privacy/', label: t('footer.privacy') },
    { to: '/terms/', label: t('footer.terms') },
  ]
  const canonical =
    currentLocale === CANONICAL_LOCALE
      ? 'https://pixelartvillage.org/'
      : `https://pixelartvillage.org/${currentLocale}/`
  const hreflangLinks = generateHreflangLinks('/')

  return (
    <>
      <Seo
        title={t('home.seoTitle')}
        description={t('home.seoDescription')}
        canonical={canonical}
        hreflang={hreflangLinks}
        lang={currentLocale}
      />
      <ToolSection onImageUpload={setUploadedImage} enablePaste={!uploadedImage} />
      {(uploadedImage || IS_E2E) ? (
        <Suspense fallback={null}>
          <Editor image={uploadedImage} />
        </Suspense>
      ) : null}
      <ShowcaseSection />
      <WplaceFeaturesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <section className="bg-gray-50 py-8 border-y border-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('footer.explore')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {relatedLinks.map((link) => (
              <LocalizedLink
                key={link.to}
                to={link.to}
                className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 hover:border-blue-300 hover:text-blue-600"
              >
                {link.label}
              </LocalizedLink>
            ))}
          </div>
        </div>
      </section>
      <FaqSection />
    </>
  )
}

function SharedLayout({ uploadedImage, setUploadedImage, currentLocale }) {
  const { t } = useTranslation()
  const localeValue = useMemo(
    () => ({
      currentLocale,
      buildPath: (path) => buildLocalizedPath(currentLocale, path),
    }),
    [currentLocale]
  )

  return (
    <LocaleProvider value={localeValue}>
      <ResourcePreloader />
      <TranslationPreloader />
      <Header />
      <CompatNotice />
      <ScrollManager />
      <main>
        <Suspense
          fallback={
            <div className="container mx-auto px-4 py-10 text-sm text-gray-600" role="status" aria-live="polite">
              {t('common.loading')}
            </div>
          }
        >
          <Outlet context={{ uploadedImage, setUploadedImage, currentLocale }} />
        </Suspense>
      </main>
      <div className="bg-gray-900">
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </LocaleProvider>
  )
}

function BaseLayout(props) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // 完全禁用自动语言重定向，防止刷新后跳转到日语
    // 用户必须手动选择语言或通过URL访问
    if (import.meta?.env?.DEV) {
      console.log('[BaseLayout] 自动语言重定向已禁用')
    }

    // 确保i18n使用默认语言
    if (i18n.language !== CANONICAL_LOCALE) {
      i18n.changeLanguage(CANONICAL_LOCALE)
    }
  }, [location.pathname, navigate])

  return <SharedLayout {...props} currentLocale={CANONICAL_LOCALE} />
}

function LocaleLayout(props) {
  const { lang } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!lang) return
    if (!RUNTIME_LANGS.includes(lang)) {
      navigate('/', { replace: true })
      return
    }
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
    setStoredLang(lang)
  }, [lang, navigate])

  useEffect(() => {
    const localeFromPath = extractLocaleFromPath(location.pathname)
    if (!localeFromPath || !RUNTIME_LANGS.includes(localeFromPath)) return
    if (localeFromPath !== lang) {
      navigate(`/${localeFromPath}/`, { replace: true })
    }
  }, [lang, location.pathname, navigate])

  return <SharedLayout {...props} currentLocale={lang || CANONICAL_LOCALE} />
}

function useUploadedImageCleanup(uploadedImage) {
  useEffect(() => {
    return () => {
      try {
        if (uploadedImage && typeof uploadedImage === 'string' && uploadedImage.startsWith('blob:')) {
          URL.revokeObjectURL(uploadedImage)
        }
      } catch {
        /* noop */
      }
    }
  }, [uploadedImage])
}

function useBodyBackground() {
  useEffect(() => {
    document.body.classList.add('bg-white')
    return () => document.body.classList.remove('bg-white')
  }, [])
}

export default function App() {
  const [uploadedImage, setUploadedImage] = useState(null)

  useEffect(() => {
    const status =
      typeof uploadedImage === 'string'
        ? `blob:${uploadedImage.slice(0, 20)}`
        : uploadedImage === null
        ? 'null'
        : typeof uploadedImage
    logger.debug('[App] uploadedImage changed:', status)
  }, [uploadedImage])

  useUploadedImageCleanup(uploadedImage)
  useBodyBackground()

  return (
    <Routes>
      <Route
        path="/"
        element={<BaseLayout uploadedImage={uploadedImage} setUploadedImage={setUploadedImage} />}
      >
        <Route index element={<Home />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<TermsOfService />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="converter/:slug" element={<PseoPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route
        path=":lang"
        element={<LocaleLayout uploadedImage={uploadedImage} setUploadedImage={setUploadedImage} />}
      >
        <Route index element={<Home />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<TermsOfService />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="converter/:slug" element={<PseoPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
