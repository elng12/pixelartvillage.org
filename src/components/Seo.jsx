import { useEffect } from 'react'

function upsertTag(tagName, attributes) {
  const selector = Object.entries(attributes)
    .map(([k, v]) => `[${k}="${CSS.escape(v)}"]`)
    .join('')
  let el = document.head.querySelector(`${tagName}${selector}`)
  if (!el) {
    el = document.createElement(tagName)
    for (const [k, v] of Object.entries(attributes)) el.setAttribute(k, v)
    document.head.appendChild(el)
  }
  return el
}

export default function Seo({ title, canonical, meta = [] }) {
  useEffect(() => {
    if (title) document.title = title
    if (canonical) {
      const link = document.head.querySelector('link[rel="canonical"]') || (() => {
        const l = document.createElement('link'); l.setAttribute('rel', 'canonical'); document.head.appendChild(l); return l
      })()
      link.setAttribute('href', canonical)
    }
    for (const m of meta) {
      if (m.name) {
        upsertTag('meta', { name: m.name, content: m.content })
      } else if (m.property) {
        upsertTag('meta', { property: m.property, content: m.content })
      }
    }
  }, [title, canonical, JSON.stringify(meta)])
  return null
}

