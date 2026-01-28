import { useState, useEffect, useMemo, lazy, Suspense } from 'react'
import { Routes, Route, Outlet, useLocation, useNavigate, useParams, useOutletContext } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logger from '@/utils/logger'
import ScrollManager from './components/ScrollManager'
import CompatNotice from '@/components/CompatNotice.jsx'
import ResourcePreloader from '@/components/ResourcePreloader'
import TranslationPreloader from '@/components/TranslationPreloader'
import CriticalCSS from '@/components/CriticalCSS'
import Header from './components/Header'
import ToolSection from './components/ToolSection'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { generateHreflangLinks } from '@/utils/hreflang'
import Seo from '@/components/Seo'
import i18n, { CANONICAL_LOCALE, setStoredLang } from '@/i18n'
import { buildLocalizedPath, extractLocaleFromPath, RUNTIME_LANGS } from '@/utils/locale'

const Editor = lazy(() => import('./components/Editor'))
const ShowcaseSection = lazy(() => import('./components/ShowcaseSection'))
const WplaceFeaturesSection = lazy(() => import('./components/WplaceFeaturesSection'))
const FeaturesSection = lazy(() => import('./components/FeaturesSection'))
const HowItWorksSection = lazy(() => import('./components/HowItWorksSection'))
const FaqSection = lazy(() => import('./components/FaqSection'))
const RelatedLinks = lazy(() => import('./components/RelatedLinks'))
const Footer = lazy(() => import('./components/Footer'))
const PrivacyPolicy = lazy(() => import('./components/policy/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./components/policy/TermsOfService'))
const About = lazy(() => import('./components/About'))
const Contact = lazy(() => import('./components/Contact'))
const Blog = lazy(() => import('./components/Blog'))
const BlogPost = lazy(() => import('./components/BlogPost'))
const PseoPage = lazy(() => import('./components/PseoPage'))
const NotFound = lazy(() => import('./components/NotFound'))
const ConsentBanner = lazy(() => import('./components/ConsentBanner'))

function useAppOutletContext() {
  return useOutletContext()
}

function Home() {
  const { t } = useTranslation()
  const { uploadedImage, setUploadedImage, currentLocale } = useAppOutletContext()
  const IS_E2E = String(import.meta?.env?.VITE_E2E) === '1'
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
      {(uploadedImage || IS_E2E) ? <Editor image={uploadedImage} /> : null}
      <ShowcaseSection />
      <WplaceFeaturesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FaqSection />
      <RelatedLinks currentPath="/" />
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
      <CriticalCSS />
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
      <Suspense fallback={null}>
        <ConsentBanner />
      </Suspense>
      <Suspense fallback={<div className="bg-gray-900 min-h-[520px] md:min-h-[570px]" aria-hidden />}>
        <Footer />
      </Suspense>
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
