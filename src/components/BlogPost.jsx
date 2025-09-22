import React from 'react'
import { useParams, Link } from 'react-router-dom'
import Seo from '@/components/Seo'
import posts from '@/content/blog-posts.json'

export default function BlogPost() {
  const { slug } = useParams()
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <Seo title="Not Found | Pixel Art Village" canonical={`https://pixelartvillage.org/blog/${slug || ''}`} />
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">Post not found</h1>
        <p className="text-gray-700">The article you’re looking for does not exist. Go back to the <Link className="text-blue-600 underline" to="/blog">Blog</Link>.</p>
      </div>
    )
  }

  const canonical = `https://pixelartvillage.org/blog/${post.slug}`

  return (
    <article className="container mx-auto px-4 py-10 max-w-3xl">
      <Seo
        title={`${post.title} | Pixel Art Village`}
        canonical={canonical}
        meta={[
          { property: 'og:url', content: canonical },
          { property: 'og:type', content: 'article' },
          { property: 'og:title', content: `${post.title} | Pixel Art Village` },
          { property: 'og:description', content: post.excerpt },
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:title', content: `${post.title} | Pixel Art Village` },
          { name: 'twitter:description', content: post.excerpt },
        ]}
      />

      <header>
        <h1 className="text-2xl font-bold text-gray-900 text-center">{post.title}</h1>
        <p className="text-xs text-gray-500 mt-1">{post.date}</p>
      </header>

      <div className="prose prose-sm md:prose-base text-gray-800 mt-4">
        {post.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <footer className="mt-8">
        <Link className="text-blue-600 underline" to="/blog">← Back to Blog</Link>
      </footer>
    </article>
  )
}

