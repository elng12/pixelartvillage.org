import React from 'react'
import Seo from '@/components/Seo'

function Section({ title, children, id }) {
  return (
    <section id={id} className="max-w-3xl mx-auto mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-3">{title}</h2>
      <div className="prose prose-sm text-gray-700">
        {children}
      </div>
    </section>
  )
}

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-10">
      <Seo
        title="Privacy Policy | Pixel Art Village"
        canonical="https://pixelartvillage.org/privacy"
        meta={[
          { property: 'og:url', content: 'https://pixelartvillage.org/privacy' },
          { property: 'og:type', content: 'website' },
          { property: 'og:title', content: 'Privacy Policy | Pixel Art Village' },
          { property: 'og:description', content: 'Pixel Art Village privacy policy: local image processing, AdSense cookies, third‑party partners, your choices and rights, contact info.' },
          { property: 'og:image', content: 'https://pixelartvillage.org/social-privacy.png' },
          { property: 'og:site_name', content: 'Pixel Art Village' },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: 'Privacy Policy | Pixel Art Village' },
          { name: 'twitter:description', content: 'Pixel Art Village privacy policy: local image processing, AdSense cookies, third‑party partners, your choices and rights, contact info.' },
          { name: 'twitter:image', content: 'https://pixelartvillage.org/social-privacy.png' },
        ]}
      />
      <header className="max-w-3xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mt-2">Last updated: {new Date().toISOString().slice(0, 10)}</p>
      </header>

      <Section title="Overview" id="overview">
        <p>
          Pixel Art Village respects your privacy. This policy explains what data we process, how we use cookies (including Google AdSense cookies), and your choices. If you have questions, please contact us via the email on the Contact page.
        </p>
      </Section>

      <Section title="Local Image Processing" id="local-processing">
        <p>
          Your images never leave your device. All image processing happens locally in your browser. We do not upload, store, or share your image files on our servers.
        </p>
      </Section>

      <Section title="Information We Collect" id="data-we-collect">
        <ul>
          <li>Technical data for site operation (e.g., basic device/browser info) necessary to deliver the service.</li>
          <li>Usage data in aggregate to improve features (if analytics is enabled, we avoid collecting personally identifiable information).</li>
          <li>Advertising data from Google AdSense (see below) if ads are displayed.</li>
        </ul>
        <p>
          We do not require account registration. We do not knowingly collect sensitive personal data.
        </p>
      </Section>

      <Section title="Cookies and AdSense" id="cookies-adsense">
        <p>
          We may use cookies and similar technologies to operate the website and improve your experience. If Google AdSense is enabled, Google and its partners may use cookies to serve ads based on your visits to this and other sites.
        </p>
        <ul>
          <li>
            Learn how Google uses information from sites or apps that use Google services:
            {' '}<a className="text-blue-600 underline" href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">policies.google.com/technologies/partner-sites</a>
          </li>
          <li>
            Manage ad personalization:
            {' '}<a className="text-blue-600 underline" href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">adssettings.google.com</a>
          </li>
          <li>
            More on Google ads and cookies:
            {' '}<a className="text-blue-600 underline" href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">policies.google.com/technologies/ads</a>
          </li>
        </ul>
      </Section>

      <Section title="Third‑Party Partners" id="third-parties">
        <p>
          We may integrate third‑party services (e.g., Google AdSense). These partners may process data under their own privacy policies. We encourage you to review their policies to understand data handling practices.
        </p>
      </Section>

      <Section title="Data Use and Sharing" id="use-sharing">
        <ul>
          <li>Provide and maintain the service.</li>
          <li>Safeguard service integrity, detect abuse, and improve features.</li>
          <li>Comply with legal obligations. We do not sell personal data.</li>
        </ul>
      </Section>

      <Section title="Your Choices and Rights" id="your-rights">
        <ul>
          <li>Opt‑out or manage ad personalization using the links above.</li>
          <li>Control cookies via your browser settings.</li>
          <li>Contact us to exercise applicable privacy rights (access, correction, deletion as required by law).</li>
        </ul>
      </Section>

      <Section title="Children’s Privacy" id="children">
        <p>
          The service is not directed to children under 13 (or the age required by local law). We do not knowingly collect personal information from children.
        </p>
      </Section>

      <Section title="Changes to this Policy" id="changes">
        <p>
          We may update this policy from time to time. Material changes will be highlighted on this page with an updated date. Your continued use of the site indicates acceptance of the updated policy.
        </p>
      </Section>

      <Section title="Contact" id="contact">
        <p>
          For privacy inquiries, please see the Contact page. Email: <a className="font-mono text-blue-600 underline" href="mailto:2296744453m@gmail.com">2296744453m@gmail.com</a>
        </p>
      </Section>
    </div>
  )
}
