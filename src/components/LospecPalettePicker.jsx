import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import palettesData from '@/data/lospec-palettes.json'
import { importPaletteFromInput } from '@/utils/palette-import'

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
  const { t } = useTranslation()

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
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">{t('paletteManager.sourceBadge')}</span>
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
  const { t } = useTranslation()

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
      <span className="text-xs text-slate-400">{t('paletteManager.copyColor')}</span>
    </button>
  )
}

export default function LospecPalettePicker({ onSelectPalette }) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [colorFilter, setColorFilter] = useState(null)
  const [selectedSlug, setSelectedSlug] = useState(null)
  const [copyHint, setCopyHint] = useState('')
  const [directImportInput, setDirectImportInput] = useState('')
  const [directImportName, setDirectImportName] = useState('')
  const [importFeedback, setImportFeedback] = useState(null)
  const [isImporting, setIsImporting] = useState(false)

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
      setCopyHint(t('paletteManager.copied', { color: color.toUpperCase() }))
      setTimeout(() => setCopyHint(''), 2000)
    } catch {
      setCopyHint(t('paletteManager.copyFailed'))
      setTimeout(() => setCopyHint(''), 3000)
    }
  }

  const handleDirectImport = async () => {
    if (!directImportInput.trim()) {
      setImportFeedback({ tone: 'error', text: t('paletteManager.emptyImportInput') })
      return
    }

    setIsImporting(true)
    setImportFeedback(null)

    try {
      const imported = await importPaletteFromInput(directImportInput, { nameHint: directImportName })
      if (imported.slug) {
        setSelectedSlug(imported.slug)
      } else {
        setSelectedSlug(null)
      }
      onSelectPalette?.(imported.colors, {
        ...imported,
        colorCount: imported.colors.length,
      })
      const feedbackText = imported.usedFallbackName
        ? t('paletteManager.importSuccessGeneric')
        : t('paletteManager.importSuccess', { name: imported.name })
      setImportFeedback({ tone: 'success', text: feedbackText })
    } catch (error) {
      let message = t('paletteManager.noColorsFound')
      if (error?.code === 'PIXILART_BLOCKED') message = t('paletteManager.pixilartBlocked')
      else if (error?.code === 'UNSUPPORTED_URL') message = t('paletteManager.unsupportedUrl')
      else if (error?.code === 'LOSPEC_FETCH_FAILED') message = t('paletteManager.fetchFailed')
      else if (error?.code === 'EMPTY_INPUT') message = t('paletteManager.emptyImportInput')
      setImportFeedback({ tone: 'error', text: message })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">{t('paletteManager.directImportTitle')}</h4>
            <p className="mt-1 text-sm text-slate-500">
              {t('paletteManager.directImportDesc')}{' '}
              <a className="text-blue-600 hover:underline" href="https://lospec.com/palette-list" target="_blank" rel="noopener noreferrer">
                Lospec
              </a>
              {' / '}
              <a className="text-blue-600 hover:underline" href="https://www.pixilart.com/palettes/" target="_blank" rel="noopener noreferrer">
                PixilArt
              </a>
              .
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
            {t('paletteManager.directImportBadge')}
          </span>
        </div>

        <div className="mt-4">
          <label htmlFor="palette-import-input" className="text-xs font-medium text-slate-500">
            {t('paletteManager.directImportLabel')}
          </label>
          <textarea
            id="palette-import-input"
            data-testid="palette-import-input"
            rows="3"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={t('paletteManager.directImportPlaceholder')}
            value={directImportInput}
            onChange={(event) => setDirectImportInput(event.target.value)}
          />
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <label htmlFor="palette-import-name" className="text-xs font-medium text-slate-500">
              {t('paletteManager.directImportNameLabel')}
            </label>
            <input
              id="palette-import-name"
              data-testid="palette-import-name"
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder={t('paletteManager.directImportNamePlaceholder')}
              value={directImportName}
              onChange={(event) => setDirectImportName(event.target.value)}
            />
          </div>
          <button
            type="button"
            data-testid="palette-import-submit"
            disabled={isImporting || !directImportInput.trim()}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${isImporting || !directImportInput.trim() ? 'cursor-not-allowed bg-slate-300' : 'bg-blue-600 hover:bg-blue-700'}`}
            onClick={handleDirectImport}
          >
            {isImporting ? t('paletteManager.importing') : t('paletteManager.importButton')}
          </button>
        </div>

        {importFeedback ? (
          <p
            role={importFeedback.tone === 'error' ? 'alert' : 'status'}
            className={`mt-3 text-sm ${importFeedback.tone === 'error' ? 'text-rose-600' : 'text-emerald-600'}`}
          >
            {importFeedback.text}
          </p>
        ) : null}

        <p className="mt-3 text-xs text-slate-500">{t('paletteManager.pixilartHint')}</p>
      </div>

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="lospec-search" className="text-xs font-medium text-slate-500">
            {t('paletteManager.searchLabel')}
          </label>
          <div className="flex gap-2">
            <input
              id="lospec-search"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder={t('paletteManager.searchPlaceholder')}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 hover:border-slate-400"
              onClick={() => setQuery('')}
            >
              {t('paletteManager.clearSearch')}
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

      <div className="mb-3 text-sm font-semibold text-slate-700">{t('paletteManager.curatedHeading')}</div>
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
            {t('paletteManager.emptyState')}
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
                  {t('paletteManager.viewOnLospec')}
                </a>
              </div>
            </div>
            <button
              type="button"
              className="rounded-lg border border-blue-500 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
              onClick={() => handleSelect(selectedPalette)}
            >
              {t('paletteManager.importAgain')}
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
        {t('paletteManager.curatedTip')}{' '}
        <a className="text-blue-600 hover:underline" href="https://lospec.com/palette-list" target="_blank" rel="noopener noreferrer">
          {t('paletteManager.paletteListLink')}
        </a>
        .
      </p>
    </div>
  )
}
