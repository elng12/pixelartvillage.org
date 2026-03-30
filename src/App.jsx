import { useState, useEffect, useMemo, lazy, Suspense } from 'react'
import { Routes, Route, Outlet, useLocation, useNavigate, useParams, useOutletContext } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logger from '@/utils/logger'
import ScrollManager from './components/ScrollManager'
import CompatNotice from '@/components/CompatNotice.jsx'
import ConsentBanner from '@/components/ConsentBanner.jsx'
import ResourcePreloader from '@/components/ResourcePreloader'
import TranslationPreloader from '@/components/TranslationPreloader'
import Header from './components/Header'
import ToolSection from './components/ToolSection'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { generateHreflangLinks } from '@/utils/hreflang'
import Seo from '@/components/Seo'
import i18n, { CANONICAL_LOCALE, setStoredLang } from '@/i18n'
import { buildLocalizedPath, extractLocaleFromPath, RUNTIME_LANGS } from '@/utils/locale'
import { getDeferredUiComponent } from './deferredUi.js'
import { getDeferredRoutePage } from './routePages.js'
const Editor = lazy(() => import('./components/Editor'))
const FOOTER_SHELL_STYLE = {
  contentVisibility: 'auto',
  containIntrinsicSize: '720px',
}

function DeferredRoutePage({ name }) {
  const Component = getDeferredRoutePage(name)
  return (
    <Suspense fallback={null}>
      <Component />
    </Suspense>
  )
}

function DeferredUi({ name, ...props }) {
  const Component = getDeferredUiComponent(name)
  return (
    <Suspense fallback={null}>
      <Component {...props} />
    </Suspense>
  )
}

function useAppOutletContext() {
  return useOutletContext()
}

function Home() {
  const { t } = useTranslation()
  const { uploadedImage, setUploadedImage, currentLocale } = useAppOutletContext()
  const IS_E2E = String(import.meta.env.VITE_E2E) === '1'
  const homeExampleImages = [
    {
      id: 'landscape-photo',
      label: t('home.examples.landscape'),
      src: '/showcase-before.jpg',
    },
    {
      id: 'pixel-scene',
      label: t('home.examples.pixelScene'),
      src: '/showcase-after.jpg',
    },
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
      <ToolSection
        onImageUpload={setUploadedImage}
        enablePaste={!uploadedImage}
        titleText={t('home.heroTitle')}
        subtitleText={t('home.heroSubtitle')}
        subtitleText2={t('home.heroSubtitle2')}
        supportsText={t('home.entrySupports')}
        exampleImages={homeExampleImages}
        exampleLabel={t('home.examplesLabel')}
        exampleHint={t('home.examplesHint')}
      />
      {(uploadedImage || IS_E2E) ? (
        <Suspense fallback={null}>
          <Editor image={uploadedImage} />
        </Suspense>
      ) : null}
      <DeferredUi name="HomeBelowFold" />
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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-blue-700 focus:shadow"
      >
        {t('a11y.skipToMain', 'Skip to main content')}
      </a>
      <Header />
      <CompatNotice />
      <ScrollManager />
      <main id="main-content">
        <Outlet context={{ uploadedImage, setUploadedImage, currentLocale }} />
      </main>
      <ConsentBanner />
      <div className="bg-gray-900" style={FOOTER_SHELL_STYLE}>
        <DeferredUi name="Footer" />
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
    if (import.meta.env.DEV) {
      console.log('[BaseLayout] 自动语言重定向已禁用')
    }

    // 确保i18n使用默认语言
    if (i18n.language !== CANONICAL_LOCALE) {
      i18n.changeLanguage(CANONICAL_LOCALE)
    }
  }, [location.pathname, navigate])

  return <SharedLayout {...props} currentLocale={CANONICAL_LOCALE} />
}

function LocaleLayout({ routeLang, ...props }) {
  const params = useParams()
  const lang = routeLang || params.lang
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!lang || !RUNTIME_LANGS.includes(lang)) return
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
    setStoredLang(lang)
  }, [lang])

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
        <Route path="privacy" element={<DeferredRoutePage name="PrivacyPolicy" />} />
        <Route path="terms" element={<DeferredRoutePage name="TermsOfService" />} />
        <Route path="about" element={<DeferredRoutePage name="About" />} />
        <Route path="contact" element={<DeferredRoutePage name="Contact" />} />
        <Route path="blog" element={<DeferredRoutePage name="Blog" />} />
        <Route path="blog/:slug" element={<DeferredRoutePage name="BlogPost" />} />
        <Route path="converter/:slug" element={<DeferredRoutePage name="PseoPage" />} />
        <Route path="*" element={<DeferredRoutePage name="NotFound" />} />
      </Route>
      {RUNTIME_LANGS.map((routeLang) => (
        <Route
          key={routeLang}
          path={routeLang}
          element={<LocaleLayout routeLang={routeLang} uploadedImage={uploadedImage} setUploadedImage={setUploadedImage} />}
        >
          <Route index element={<Home />} />
          <Route path="privacy" element={<DeferredRoutePage name="PrivacyPolicy" />} />
          <Route path="terms" element={<DeferredRoutePage name="TermsOfService" />} />
          <Route path="about" element={<DeferredRoutePage name="About" />} />
          <Route path="contact" element={<DeferredRoutePage name="Contact" />} />
          <Route path="blog" element={<DeferredRoutePage name="Blog" />} />
          <Route path="blog/:slug" element={<DeferredRoutePage name="BlogPost" />} />
          <Route path="converter/:slug" element={<DeferredRoutePage name="PseoPage" />} />
          <Route path="*" element={<DeferredRoutePage name="NotFound" />} />
        </Route>
      ))}
    </Routes>
  )
}
