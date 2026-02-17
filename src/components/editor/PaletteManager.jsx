import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LospecPalettePicker from '../LospecPalettePicker'

function PaletteManager({ onSavePalette, onDeletePalette, onApplyPalette }) {
  const { t } = useTranslation()
  const [paletteName, setPaletteName] = useState('')
  const [colors, setColors] = useState([])
  const [colorInput, setColorInput] = useState('#000000')
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [activeTab, setActiveTab] = useState('create') // 'create' | 'lospec'
  const tabOrder = ['create', 'lospec']
  const tabRefs = useRef({})

  const tabId = (tab) => `palette-tab-${tab}`
  const panelId = (tab) => `palette-panel-${tab}`

  const handleTabKeyDown = (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const currentTab = event.currentTarget?.dataset?.tab || activeTab
    const currentIndex = tabOrder.indexOf(currentTab)
    if (currentIndex < 0) return
    let nextTab = activeTab
    if (event.key === 'Home') {
      nextTab = tabOrder[0]
    } else if (event.key === 'End') {
      nextTab = tabOrder[tabOrder.length - 1]
    } else {
      const delta = event.key === 'ArrowRight' ? 1 : -1
      nextTab = tabOrder[(currentIndex + delta + tabOrder.length) % tabOrder.length]
    }
    setActiveTab(nextTab)
    requestAnimationFrame(() => {
      tabRefs.current[nextTab]?.focus()
    })
  }

  const handleSavePalette = () => {
    const name = paletteName.trim()
    if (!name || colors.length === 0) return
    onSavePalette?.(name, colors)
  }

  const handleResetForm = () => {
    setPaletteName('')
    setColors([])
    setColorInput('#000000')
    setSelectedIndex(-1)
  }

  const handleDeletePalette = () => {
    const name = paletteName.trim()
    if (!name) return
    onDeletePalette?.(name)
  }

  const handleAddColor = () => {
    const value = colorInput.startsWith('#') ? colorInput : `#${colorInput}`
    if (!/^#[0-9A-Fa-f]{6}$/.test(value)) return
    setColors((prev) => [...prev, value.toUpperCase()])
    setColorInput('#000000')
  }

  const handleRemoveColor = () => {
    if (selectedIndex < 0) return
    setColors((prev) => prev.filter((_, index) => index !== selectedIndex))
    setSelectedIndex(-1)
  }

  const handleLospecPaletteSelect = (paletteColors, paletteInfo) => {
    if (!paletteInfo) return
    const lospecName = `${paletteInfo.name} (Lospec)`
    onSavePalette?.(lospecName, paletteColors)
    onApplyPalette?.(lospecName)
    // 移除确认弹窗，直接应用调色板
    if (import.meta?.env?.DEV) {
      console.log(`[PaletteManager] 已应用调色板: ${paletteInfo.name}`)
    }
  }

  return (
    <div className="border-t pt-6">
      <div
        className="mb-4 flex gap-2 border-b border-gray-200"
        role="tablist"
        aria-label={t('paletteManager.tabsLabel', 'Palette manager tabs')}
      >
        <button
          type="button"
          onClick={() => setActiveTab('create')}
          onKeyDown={handleTabKeyDown}
          data-tab="create"
          ref={(node) => { tabRefs.current.create = node }}
          id={tabId('create')}
          role="tab"
          aria-selected={activeTab === 'create'}
          aria-controls={panelId('create')}
          tabIndex={activeTab === 'create' ? 0 : -1}
          className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'create'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('paletteManager.createTab')}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('lospec')}
          onKeyDown={handleTabKeyDown}
          data-tab="lospec"
          ref={(node) => { tabRefs.current.lospec = node }}
          id={tabId('lospec')}
          role="tab"
          aria-selected={activeTab === 'lospec'}
          aria-controls={panelId('lospec')}
          tabIndex={activeTab === 'lospec' ? 0 : -1}
          className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'lospec'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('paletteManager.importTab')}
        </button>
      </div>

      {activeTab === 'create' && (
        <div role="tabpanel" id={panelId('create')} aria-labelledby={tabId('create')}>
          <h3 className="mb-3 text-base font-semibold">{t('paletteManager.createTitle')}</h3>

          <label className="mb-1 block text-sm font-medium" htmlFor="palette-name-input">
            {t('paletteManager.nameLabel')}
          </label>
          <input
            id="palette-name-input"
            className="mb-3 w-full rounded border px-3 py-2"
            value={paletteName}
            onChange={(event) => setPaletteName(event.target.value)}
            placeholder={t('paletteManager.namePlaceholder')}
          />

          <p className="mb-1 block text-sm font-medium" id="palette-colors-label">
            {t('paletteManager.colorsLabel')}
          </p>
          <div className="mb-2 flex min-h-[48px] flex-wrap gap-2 rounded border p-2" aria-labelledby="palette-colors-label">
            {colors.map((color, index) => (
              <button
                key={`${color}-${index}`}
                type="button"
                title={color}
                aria-label={t('paletteManager.colorSwatchAria', `Select color ${index + 1}: ${color}`)}
                className={`h-6 w-6 rounded border ${selectedIndex === index ? 'ring-2 ring-blue-500' : ''}`}
                style={{ background: color }}
                onClick={() => setSelectedIndex(index)}
              />
            ))}
            {colors.length === 0 && <span className="text-xs text-gray-500">{t('paletteManager.noColors')}</span>}
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="palette-color-input">{t('paletteManager.colorInputLabel', 'Hex color')}</label>
            <input
              id="palette-color-input"
              className="w-36 rounded border px-3 py-2"
              value={colorInput}
              onChange={(event) => setColorInput(event.target.value)}
              placeholder={t('paletteManager.colorInputPlaceholder')}
            />
            <button type="button" className="btn-secondary" onClick={handleAddColor}>
              {t('paletteManager.addColor')}
            </button>
            <button type="button" className="btn-secondary" onClick={handleRemoveColor}>
              {t('paletteManager.removeSelected')}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-primary" onClick={handleSavePalette}>
              {t('paletteManager.save')}
            </button>
            <button type="button" className="btn-secondary" onClick={handleResetForm}>
              {t('paletteManager.reset')}
            </button>
            <button type="button" className="btn-secondary" onClick={handleDeletePalette}>
              {t('paletteManager.delete')}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'lospec' && (
        <div role="tabpanel" id={panelId('lospec')} aria-labelledby={tabId('lospec')}>
          <h3 className="mb-3 text-base font-semibold">{t('paletteManager.importTitle')}</h3>
          <p className="mb-4 text-sm text-gray-600">
            {t('paletteManager.importDesc')}{' '}
            <a
              href="https://lospec.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Lospec.com
            </a>
            {t('paletteManager.importDescSuffix')}
          </p>
          <LospecPalettePicker onSelectPalette={handleLospecPaletteSelect} />
        </div>
      )}
    </div>
  )
}

export default PaletteManager
