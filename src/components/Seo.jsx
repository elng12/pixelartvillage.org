import { createPortal } from 'react-dom'

// 轻量声明式 Head 管理：通过 Portal 将标签渲染到 <head>
// 避免直接使用 DOM API，保持 React 声明式模型
export default function Seo({ title, canonical, meta = [], hreflang = [] }) {
  const metas = Array.isArray(meta) ? meta : []
  const hreflangs = Array.isArray(hreflang) ? hreflang : []
  if (typeof document === 'undefined') return null
  return createPortal(
    <>
      {title ? <title>{title}</title> : null}
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      {hreflangs.map((h, i) => (
        <link key={`hreflang-${i}`} rel="alternate" hrefLang={h.hreflang} href={h.href} />
      ))}
      {metas.map((m, i) =>
        m?.name ? (
          <meta key={`n-${i}`} name={m.name} content={m.content || ''} />
        ) : m?.property ? (
          <meta key={`p-${i}`} property={m.property} content={m.content || ''} />
        ) : null,
      )}
    </>,
    document.head,
  )
}
