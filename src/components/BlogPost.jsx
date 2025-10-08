import React from 'react'
import { useParams, Link } from 'react-router-dom'
import Seo from '@/components/Seo'
import posts from '@/content/blog-posts.json'
import { useTranslation } from 'react-i18next'

export default function BlogPost() {
  const { t } = useTranslation()
  const { slug, lang: urlLang } = useParams()
  const rawLang = urlLang || 'en'
  const prefix = rawLang === 'en' ? '' : `/${rawLang}`
  const post = posts.find((p) => p.slug === slug)
  const renderBody = (blocks = []) => {
    const nodes = []
    let currentList = null

    const flushList = () => {
      if (!currentList) return
      const listKey = `${currentList.type}-${nodes.length}`
      if (currentList.type === 'ol') {
        nodes.push(
          <ol key={listKey} className="list-decimal pl-6 text-left space-y-2">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ol>
        )
      } else {
        nodes.push(
          <ul key={listKey} className="list-disc pl-6 text-left space-y-2">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        )
      }
      currentList = null
    }

    blocks.forEach((raw, idx) => {
      const line = typeof raw === 'string' ? raw.trim() : ''
      if (!line) {
        flushList()
        return
      }

      if (line.startsWith('- ')) {
        if (!currentList || currentList.type !== 'ul') {
          flushList()
          currentList = { type: 'ul', items: [] }
        }
        currentList.items.push(line.slice(2).trim())
        return
      }

      const orderedMatch = line.match(/^(\d+)\.\s+(.*)/)
      if (orderedMatch) {
        if (!currentList || currentList.type !== 'ol') {
          flushList()
          currentList = { type: 'ol', items: [] }
        }
        currentList.items.push(orderedMatch[2].trim())
        return
      }

      flushList()

      if (line.startsWith('### ')) {
        nodes.push(
          <h2 key={`h2-${nodes.length}`} className="text-xl font-semibold text-gray-900 mt-6 mb-3 text-left">
            {line.slice(4).trim()}
          </h2>
        )
        return
      }

      if (line.startsWith('#### ')) {
        nodes.push(
          <h3 key={`h3-${nodes.length}`} className="text-lg font-semibold text-gray-900 mt-5 mb-2 text-left">
            {line.slice(5).trim()}
          </h3>
        )
        return
      }

      if (/^Quick tip:/i.test(line)) {
        nodes.push(
          <p
            key={`tip-${nodes.length}`}
            className="rounded-md border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-medium leading-relaxed text-sky-900 text-left"
          >
            {line}
          </p>
        )
        return
      }

      if (/^Updated:/i.test(line)) {
        nodes.push(
          <p key={`meta-${nodes.length}`} className="text-xs uppercase tracking-wide text-gray-500 text-left">
            {line}
          </p>
        )
        return
      }

      nodes.push(
        <p key={`p-${nodes.length}`} className="leading-relaxed text-left">
          {line}
        </p>
      )
    })

    flushList()
    return nodes
  }

  if (!post) {
    const canonical = `https://pixelartvillage.org${prefix}/blog/${slug || ''}`
    return (
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <Seo title="Not Found | Pixel Art Village" canonical={canonical} lang={rawLang} />
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">{t('blog.notFound.title')}</h1>
        <p className="text-gray-700">{t('blog.notFound.desc')} <Link className="text-blue-600 underline" to={`${prefix}/blog`}>{t('blog.back')}</Link>.</p>
      </div>
    )
  }

  const canonical = `https://pixelartvillage.org${prefix}/blog/${post.slug}`

  return (
    <article className="container mx-auto px-4 py-10 max-w-3xl">
      <Seo
        title={`${post.title} | Pixel Art Village`}
        canonical={canonical}
        lang={rawLang}
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

      <header className="text-center md:text-left">
        <h1 className="text-2xl font-bold text-gray-900 text-center">{post.title}</h1>
        <p className="text-xs text-gray-500 mt-1 text-center md:text-left">{post.date}</p>
      </header>

      <div className="prose prose-sm md:prose-base text-gray-800 mt-4 text-left prose-pre:text-left prose-code:text-left prose-img:mx-0">
        {renderBody(post.body)}
      </div>

      <footer className="mt-8 text-center md:text-left">
        <Link className="text-blue-600 underline" to={`${prefix}/blog`}>
          {t('blog.back')}
        </Link>
      </footer>
    </article>
  )
}
