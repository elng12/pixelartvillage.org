import React, { useEffect } from 'react'

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

export default function TermsOfService() {
  useEffect(() => {
    document.title = 'Terms of Service | Pixel Art Village'
    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) canonical.setAttribute('href', 'https://pixelartvillage.org/terms')
  }, [])

  return (
    <div className="container mx-auto px-4 py-10">
      <header className="max-w-3xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Terms of Service</h1>
        <p className="text-sm text-gray-500 mt-2">Last updated: {new Date().toISOString().slice(0, 10)}</p>
      </header>

      <Section title="Acceptance of Terms" id="acceptance">
        <p>
          By accessing or using Pixel Art Village (the “Service”), you agree to be bound by these Terms. If you do not agree, do not use the Service.
        </p>
      </Section>

      <Section title="Use of the Service" id="use">
        <ul>
          <li>Upload only content you have the rights to use. You are responsible for your content and compliance with applicable laws.</li>
          <li>Do not abuse, interfere with, or disrupt the Service or other users.</li>
          <li>Do not use the Service for illegal, harmful, or infringing activities.</li>
        </ul>
      </Section>

      <Section title="Intellectual Property" id="ip">
        <p>
          We retain all rights to the Service and related materials. You retain rights to your original uploads and generated outputs, subject to your applicable rights and third‑party rights.
        </p>
      </Section>

      <Section title="Image Processing" id="processing">
        <p>
          Image processing is performed locally in your browser. We do not store your uploaded images on our servers.
        </p>
      </Section>

      <Section title="Disclaimer of Warranties" id="disclaimer">
        <p>
          The Service is provided “as is” and “as available” without warranties of any kind, express or implied. We do not warrant that the Service will be uninterrupted or error‑free.
        </p>
      </Section>

      <Section title="Limitation of Liability" id="liability">
        <p>
          To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or related to your use of the Service.
        </p>
      </Section>

      <Section title="Changes to the Service or Terms" id="changes">
        <p>
          We may modify or discontinue the Service and update these Terms at any time. Continued use of the Service constitutes acceptance of updated Terms.
        </p>
      </Section>

      <Section title="Governing Law" id="law">
        <p>
          These Terms are governed by applicable laws in your jurisdiction to the extent not preempted by other laws. Venue and jurisdiction will follow applicable conflict of laws rules.
        </p>
      </Section>

      <Section title="Contact" id="contact">
        <p>
          For questions about these Terms, please see the Contact page. Email: <a className="font-mono text-blue-600 underline" href="mailto:2296744453m@gmail.com">2296744453m@gmail.com</a>
        </p>
      </Section>
    </div>
  )
}
