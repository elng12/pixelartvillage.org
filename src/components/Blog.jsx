import React from 'react'
import { Link } from 'react-router-dom'
import Seo from '@/components/Seo'
import posts from '@/content/blog-posts.json'

export default function Blog() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl text-center">
      <Seo
        title="Blog | Pixel Art Village"
        canonical="https://pixelartvillage.org/blog"
        meta={[
          { property: 'og:url', content: 'https://pixelartvillage.org/blog' },
          { property: 'og:type', content: 'website' },
          { property: 'og:title', content: 'Blog | Pixel Art Village' },
          { property: 'og:description', content: 'Articles and updates about making pixel art, tips, and features from Pixel Art Village.' },
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:title', content: 'Blog | Pixel Art Village' },
          { name: 'twitter:description', content: 'Articles and updates about making pixel art, tips, and features from Pixel Art Village.' },
        ]}
      />

      <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog</h1>
      <p className="text-gray-700 mb-6">Articles and updates about making pixel art, tutorials, and new features.</p>

      <ul className="space-y-4 max-w-2xl mx-auto">
        {posts.map((p) => (
          <li key={p.slug} className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              <Link to={`/blog/${p.slug}`} className="hover:text-blue-600">
                {p.title}
              </Link>
            </h2>
            <p className="text-xs text-gray-500 mt-1">{p.date}</p>
            <p className="text-gray-700 mt-2">{p.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
