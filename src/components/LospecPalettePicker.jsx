import React, { useMemo, useState } from 'react'
import palettesData from '@/data/lospec-palettes.json'

const CURATED_PALETTES = palettesData.map((palette) => ({
  ...palette,
  colors: palette.colors.map((color) => (color.startsWith('#') ? color : `#${color}`)),
  colorCount: palette.colors.length,
  url: `https://lospec.com/palette-list/${palette.slug}`,
}))

const COLOR_FILTERS = Array.from(new Set(CURATED_PALETTES.map((palette) => palette.colorCount))).sort(
  (a, b) => a - b,
)

function PaletteCard({ palette, isSelected, onSelect }) {
  return (
    <button
      type="button"
      className={`w-full rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-sm ${isSelected ? 'border-blue-500 shadow-sm' : 'border-slate-200 bg-white'}`}
      onClick={() => onSelect(palette)}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">{palette.name}</div>
          <div className="text-xs text-slate-500">
            {palette.colorCount} colors{palette.author ? ` · ${palette.author}` : ''}
          </div>
        </div>
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">Lospec</span>
      </div>
      <div className="mt-3 flex overflow-hidden rounded">
        {palette.colors.slice(0, 12).map((color) => (
          <span key={color} className="h-3 flex-1" style={{ backgroundColor: color }} />
        ))}
      </div>
    </button>
  )
}

function ColorSwatch({ color, onCopy }) {
  return (
    <button
      type="button"
      className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm transition hover:border-blue-400 hover:text-blue-600"
      onClick={() => onCopy(color)}
    >
      <span className="flex items-center gap-2">
        <span className="h-5 w-5 rounded border border-slate-200" style={{ backgroundColor: color }} />
        {color.toUpperCase()}
      </span>
      <span className="text-xs text-slate-400">复制</span>
    </button>
  )
}

export default function LospecPalettePicker({ onSelectPalette }) {
  const [query, setQuery] = useState('')
  const [colorFilter, setColorFilter] = useState(null)
  const [selectedSlug, setSelectedSlug] = useState(null)
  const [copyHint, setCopyHint] = useState('')

  const filteredPalettes = useMemo(() => {
    const byQuery = CURATED_PALETTES.filter((palette) => {
      if (!query.trim()) return true
      const keywords = [palette.name, palette.slug, palette.author].filter(Boolean).join(' ').toLowerCase()
      return keywords.includes(query.trim().toLowerCase())
    })
    if (!colorFilter) return byQuery
    return byQuery.filter((palette) => palette.colorCount === colorFilter)
  }, [query, colorFilter])

  const selectedPalette = useMemo(() => {
    if (!selectedSlug) return null
    return CURATED_PALETTES.find((palette) => palette.slug === selectedSlug) || null
  }, [selectedSlug])

  const handleSelect = (palette) => {
    setSelectedSlug(palette.slug)
    onSelectPalette?.(palette.colors, {
      name: palette.name,
      slug: palette.slug,
      author: palette.author,
      colorCount: palette.colorCount,
      url: palette.url,
      source: 'lospec',
    })
  }

  const handleCopy = async (color) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(color)
      }
      setCopyHint(`${color.toUpperCase()} 已复制到剪贴板`)
      setTimeout(() => setCopyHint(''), 2000)
    } catch {
      setCopyHint('复制失败，请手动复制颜色值')
      setTimeout(() => setCopyHint(''), 3000)
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="lospec-search" className="text-xs font-medium text-slate-500">
            搜索Lospec调色板（名称、作者或Slug）
          </label>
          <div className="flex gap-2">
            <input
              id="lospec-search"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="例如：pico-8 / dawnbringer"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 hover:border-slate-400"
              onClick={() => setQuery('')}
            >
              清除
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {COLOR_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${colorFilter === filter ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-200 bg-white text-slate-500 hover:border-blue-400 hover:text-blue-600'}`}
              onClick={() => setColorFilter((prev) => (prev === filter ? null : filter))}
            >
              {filter} colors
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filteredPalettes.map((palette) => (
          <PaletteCard
            key={palette.slug}
            palette={palette}
            isSelected={palette.slug === selectedSlug}
            onSelect={handleSelect}
          />
        ))}
        {filteredPalettes.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
            未找到匹配的调色板，请调整搜索关键词或筛选条件。
          </div>
        )}
      </div>

      {selectedPalette && (
        <div className="mt-6 rounded-xl border border-blue-100 bg-white p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-base font-semibold text-slate-900">{selectedPalette.name}</div>
              <div className="text-sm text-slate-500">
                {selectedPalette.colorCount} colors
                {selectedPalette.author ? ` · ${selectedPalette.author}` : ''}{' '}
                ·{' '}
                <a
                  href={selectedPalette.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  在 Lospec.com 查看
                </a>
              </div>
            </div>
            <button
              type="button"
              className="rounded-lg border border-blue-500 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
              onClick={() => handleSelect(selectedPalette)}
            >
              再次导入该调色板
            </button>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {selectedPalette.colors.map((color) => (
              <ColorSwatch key={color} color={color} onCopy={handleCopy} />
            ))}
          </div>
          {copyHint && <p className="mt-3 text-xs text-emerald-600">{copyHint}</p>}
        </div>
      )}

      <p className="mt-6 text-xs text-slate-500">
        提示：Lospec 官方 API 限制跨域调用，因此这里提供精选的热门调色板集合。若需检索更多调色板，可访问{' '}
        <a className="text-blue-600 hover:underline" href="https://lospec.com/palette-list" target="_blank" rel="noopener noreferrer">
          Lospec Palette List
        </a>
        。如需扩展，请考虑部署后端代理以访问完整 API。
      </p>
    </div>
  )
}
