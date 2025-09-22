import React from 'react'
import Seo from '@/components/Seo'

export default function About() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Seo
        title="About | Pixel Art Village"
        canonical="https://pixelartvillage.org/about"
        meta={[
          { property: 'og:url', content: 'https://pixelartvillage.org/about' },
          { property: 'og:type', content: 'website' },
          { property: 'og:title', content: 'About | Pixel Art Village' },
          { property: 'og:description', content: 'About Pixel Art Village: a free, browser‑based pixel art maker & converter. Privacy‑first, fast, and accessible.' },
          { property: 'og:image', content: 'https://pixelartvillage.org/social-about.png' },
          { property: 'og:site_name', content: 'Pixel Art Village' },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: 'About | Pixel Art Village' },
          { name: 'twitter:description', content: 'About Pixel Art Village: a free, browser‑based pixel art maker & converter. Privacy‑first, fast, and accessible.' },
          { name: 'twitter:image', content: 'https://pixelartvillage.org/social-about.png' },
        ]}
      />
      <h1 className="text-2xl font-bold text-gray-900 mb-4">About Pixel Art Village</h1>
      <div className="prose prose-sm text-gray-700">
        <p>
          Pixel Art Village is a free, browser‑based pixel art maker & converter. Upload a PNG/JPG, tweak pixel size and palettes, preview instantly, and export crisp results.
        </p>
        <h2>Principles</h2>
        <ul>
          <li><strong>Privacy‑first:</strong> Your images are processed locally in your browser — we do not upload files.</li>
          <li><strong>Performance:</strong> Fast previews and clean exports without heavy dependencies.</li>
          <li><strong>Accessibility:</strong> Keyboard‑friendly UI and visible focus states.</li>
        </ul>
        <h2>Contact</h2>
        <p>
          See the Contact page for support and inquiries. You can also email us directly at
          {' '}<a className="font-mono text-blue-600 underline" href="mailto:2296744453m@gmail.com">2296744453m@gmail.com</a>.
        </p>
      </div>
    </div>
  )
}
