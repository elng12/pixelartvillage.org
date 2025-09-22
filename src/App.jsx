<<<<<<< Updated upstream
import React, { useState, useEffect, Fragment } from 'react';
import Header from './components/Header';
import ToolSection from './components/ToolSection';
import Editor from './components/Editor';
import ShowcaseSection from './components/ShowcaseSection';
import WplaceFeaturesSection from './components/WplaceFeaturesSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);

  // 将全局背景样式施加到 body，避免冗余 div 包装
  useEffect(() => {
    document.body.classList.add('bg-white');
    return () => document.body.classList.remove('bg-white');
  }, []);

  return (
    <Fragment>
      <Header />
      <main>
        <ToolSection onImageUpload={setUploadedImage} />
        {uploadedImage ? <Editor image={uploadedImage} /> : null}
        <ShowcaseSection />
        <WplaceFeaturesSection />
        <FeaturesSection />
        <HowItWorksSection />
        <FaqSection />
      </main>
      <Footer />
    </Fragment>
  );
}

export default App;
=======
import React, { useState, useEffect, Fragment } from 'react';
import Header from './components/Header';
import ToolSection from './components/ToolSection';
import Editor from './components/Editor';
import ShowcaseSection from './components/ShowcaseSection';
import WplaceFeaturesSection from './components/WplaceFeaturesSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);

  // 将全局背景样式施加到 body，避免冗余 div 包装
  useEffect(() => {
    document.body.classList.add('bg-white');
    return () => document.body.classList.remove('bg-white');
  }, []);

  return (
    <Fragment>
      <Header />
      <main>
        <h1 className="sr-only">Pixel Art Village — Online Pixel Art Maker & Converter</h1>
        <ToolSection onImageUpload={setUploadedImage} />
        {uploadedImage ? <Editor image={uploadedImage} /> : null}
        <ShowcaseSection />
        <WplaceFeaturesSection />
        <FeaturesSection />
        <HowItWorksSection />
        <FaqSection />
      </main>
      <Footer />
    </Fragment>
  );
}

export default App;
>>>>>>> Stashed changes
