import React, { useState, useEffect, Fragment, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import Seo from '@/components/Seo';
import Header from './components/Header';
import ToolSection from './components/ToolSection';
import { generateHreflangLinks } from '@/utils/hreflang';
const Editor = lazy(() => import('./components/Editor'));
const ShowcaseSection = lazy(() => import('./components/ShowcaseSection'));
const WplaceFeaturesSection = lazy(() => import('./components/WplaceFeaturesSection'));
const FeaturesSection = lazy(() => import('./components/FeaturesSection'));
const HowItWorksSection = lazy(() => import('./components/HowItWorksSection'));
const FaqSection = lazy(() => import('./components/FaqSection'));
const Footer = lazy(() => import('./components/Footer'));
import ScrollManager from './components/ScrollManager';
import LanguageSwitcher from '@/components/LanguageSwitcherFixed';
import CompatNotice from '@/components/CompatNotice.jsx';
import ResourcePreloader from '@/components/ResourcePreloader';
import CriticalCSS from '@/components/CriticalCSS';
import i18n, { SUPPORTED_LANGS, getStoredLang, setStoredLang, detectBrowserLang } from '@/i18n';
const PrivacyPolicy = lazy(() => import('./components/policy/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/policy/TermsOfService'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
const Blog = lazy(() => import('./components/Blog'));
const BlogPost = lazy(() => import('./components/BlogPost'));
const PseoPage = lazy(() => import('./components/PseoPage'));
const NotFound = lazy(() => import('./components/NotFound'));
const ConsentBanner = lazy(() => import('./components/ConsentBanner'));

function Home({ uploadedImage, setUploadedImage }) {
  const { lang } = useParams();
  const currentLang = (lang && SUPPORTED_LANGS.includes(lang)) ? lang : 'en';
  const prefix = currentLang === 'en' ? '' : `/${currentLang}`;
  const canonical = `https://pixelartvillage.org${prefix}/`;
  const hreflangLinks = generateHreflangLinks('/');
  return (
    <Fragment>
      <Seo
        title="Pixel Art Village: Image to Pixel Art Place Color Converter"
        description="Pixelate photos in your browser – convert PNG/JPG into crisp, grid‑friendly pixel art. Adjust pixel size and palettes with instant preview, then export clean results for sprites, icons, or retro game graphics. Fast, private, and free."
        canonical={canonical}
        hreflang={hreflangLinks}
        lang={currentLang}
      />
      
      <ToolSection onImageUpload={setUploadedImage} enablePaste={!uploadedImage} />
      {uploadedImage ? <Editor image={uploadedImage} /> : null}
      <ShowcaseSection />
      <WplaceFeaturesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FaqSection />
    </Fragment>
  );
}

function useLangRouting() {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  // Derive current language from URL or storage/detection
  useEffect(() => {
    const seg = (pathname.split('/')[1] || '').toLowerCase();
    const hasLangInPath = SUPPORTED_LANGS.includes(seg);
    if (hasLangInPath) {
      if (i18n.language !== seg) i18n.changeLanguage(seg);
      setStoredLang(seg);
      return;
    }
    // 无语言前缀：仅设置语言，不再跳转
    const persisted = getStoredLang();
    const auto = persisted || detectBrowserLang();
    if (i18n.language !== auto) i18n.changeLanguage(auto);
    setStoredLang(auto);
  }, [pathname, search, hash, navigate]);
}

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);

  // 兜底释放通过 URL.createObjectURL 生成的临时资源
  useEffect(() => {
    return () => {
      try {
        if (uploadedImage && typeof uploadedImage === 'string' && uploadedImage.startsWith('blob:')) {
          URL.revokeObjectURL(uploadedImage)
        }
      } catch { /* ignore */ }
    }
  }, [uploadedImage])

  // 将全局背景样式施加到 body，避免冗余 div 包装
  useEffect(() => {
    document.body.classList.add('bg-white');
    return () => document.body.classList.remove('bg-white');
  }, []);

  useLangRouting();

  return (
    <Fragment>
      <CriticalCSS />
      <ResourcePreloader />
      <Header rightSlot={<LanguageSwitcher />} />
      <CompatNotice />
      <ScrollManager />
      <main>
        <Suspense fallback={<div className="container mx-auto px-4 py-10 text-sm text-gray-600" role="status">Loading…</div>}>
          <Routes>
            {/* 根路径与无语言路径（规范路径） */}
            <Route path="/" element={<Home uploadedImage={uploadedImage} setUploadedImage={setUploadedImage} />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsOfService />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="converter/:slug" element={<PseoPage />} />

            {/* 保留语言前缀路径（非默认语言） */}
            <Route path=":lang/">
              <Route index element={<Home uploadedImage={uploadedImage} setUploadedImage={setUploadedImage} />} />
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<TermsOfService />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="converter/:slug" element={<PseoPage />} />
            </Route>
            {/* 404页面 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <ConsentBanner />
        <Footer />
      </Suspense>
    </Fragment>
  );
}

export default App;
