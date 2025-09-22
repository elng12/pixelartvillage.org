import React, { useState, useEffect, Fragment } from 'react';
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
import PrivacyPolicy from './components/policy/PrivacyPolicy';
import TermsOfService from './components/policy/TermsOfService';
import About from './components/About';
import Contact from './components/Contact';
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
        
        <h1 className="sr-only">Pixel Art Village — Online Pixel Art Maker & Converter</h1>
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
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <ConsentBanner />
      <Footer />
    </Fragment>
  );
}

export default App;
