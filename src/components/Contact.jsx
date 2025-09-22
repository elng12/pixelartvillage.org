import React, { useEffect } from 'react'

export default function Contact() {
  useEffect(() => {
    document.title = 'Contact | Pixel Art Village'
    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) canonical.setAttribute('href', 'https://pixelartvillage.org/contact')
  }, [])

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Contact</h1>
      <div className="prose prose-sm text-gray-700">
        <p>We’d love to hear from you. For support, feedback, or partnership inquiries, reach out via email.</p>
        <ul>
          <li>
            Email: <a className="font-mono text-blue-600 underline" href="mailto:2296744453m@gmail.com">2296744453m@gmail.com</a>
          </li>
        </ul>
        <p className="text-xs text-gray-500">Replace the email placeholder with your official contact address to meet AdSense review requirements.</p>
      </div>
    </div>
  )
}
