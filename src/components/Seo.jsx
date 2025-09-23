import { createPortal } from 'react-dom'

// 轻量声明式 Head 管理：通过 Portal 将标签渲染到 <head>
// 避免直接使用 DOM API，保持 React 声明式模型
export default function Seo({ title, canonical, meta = [] }) {
  const metas = Array.isArray(meta) ? meta : []
  if (typeof document === 'undefined') return null
  return createPortal(
    <>
      {title ? <title>{title}</title> : null}
      {canonical ? <link rel="canonical" href={canonical} /> : null}
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
