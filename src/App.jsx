import React, { useState, useEffect, Fragment, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Seo from '@/components/Seo';
import Header from './components/Header';
import ToolSection from './components/ToolSection';
import Editor from './components/Editor';
import ShowcaseSection from './components/ShowcaseSection';
import WplaceFeaturesSection from './components/WplaceFeaturesSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import ScrollManager from './components/ScrollManager';
const PrivacyPolicy = lazy(() => import('./components/policy/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/policy/TermsOfService'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
import ConsentBanner from './components/ConsentBanner';

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);

  // 将全局背景样式施加到 body，避免冗余 div 包装
  useEffect(() => {
    document.body.classList.add('bg-white');
    return () => document.body.classList.remove('bg-white');
  }, []);

  function Home() {
    return (
      <Fragment>
        <Seo
          title="Pixel Art Village | Online Pixel Art Maker & Converter"
          canonical="https://pixelartvillage.org/"
        />
        
        <ToolSection onImageUpload={setUploadedImage} />
        {uploadedImage ? <Editor image={uploadedImage} /> : null}
        <ShowcaseSection />
        <WplaceFeaturesSection />
        <FeaturesSection />
        <HowItWorksSection />
        <FaqSection />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Header />
      <ScrollManager />
      <main>
        <Suspense fallback={<div className="container mx-auto px-4 py-10 text-sm text-gray-600" role="status">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </main>
      <ConsentBanner />
      <Footer />
    </Fragment>
  );
}

export default App;
