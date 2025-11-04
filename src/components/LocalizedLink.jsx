import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { useLocaleContext } from '@/hooks/useLocaleContext'

function resolveLocalizedTo(buildPath, to) {
  if (typeof to === 'string') {
    if (to.startsWith('http') || to.startsWith('mailto:') || to.startsWith('tel:')) return to
    if (to.startsWith('#')) return to

    let path = to
    let hash = ''
    let search = ''

    const hashIndex = path.indexOf('#')
    if (hashIndex >= 0) {
      hash = path.slice(hashIndex)
      path = path.slice(0, hashIndex)
    }

    const searchIndex = path.indexOf('?')
    if (searchIndex >= 0) {
      search = path.slice(searchIndex)
      path = path.slice(0, searchIndex)
    }

    const localized = buildPath(path || '/')
    return `${localized}${search}${hash}`
  }

  if (typeof to === 'object' && to !== null) {
    const next = { ...to }
    if (next.pathname) {
      next.pathname = buildPath(next.pathname)
    }
    return next
  }

  return to
}

const LocalizedLink = forwardRef(function LocalizedLink({ to, ...rest }, ref) {
  const { buildPath } = useLocaleContext()
  const resolvedTo = resolveLocalizedTo(buildPath, to)
  return <Link ref={ref} to={resolvedTo} {...rest} />
})

export default LocalizedLink
