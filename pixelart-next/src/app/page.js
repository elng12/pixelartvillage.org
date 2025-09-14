'use client'

import { useState } from 'react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import UploadSection from '../components/UploadSection'
import DemoSection from '../components/DemoSection'
import InfoSection from '../components/InfoSection'
import Footer from '../components/Footer'
import ControlPanel from '../components/ControlPanel'

export default function Home() {
  const [showControlPanel, setShowControlPanel] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)

  return (
    <div className="min-h-screen bg-[var(--bg-dark)]">
      <Header />
      <main>
        <HeroSection />
        <UploadSection 
          onImageUpload={setUploadedImage}
          onShowControls={() => setShowControlPanel(true)}
        />
        {uploadedImage && (
          <ControlPanel 
            image={uploadedImage}
            show={showControlPanel}
            onClose={() => setShowControlPanel(false)}
          />
        )}
        <DemoSection />
        <InfoSection />
      </main>
      <Footer />
    </div>
  )
}
