import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LospecPalettePicker from '../LospecPalettePicker'

function PaletteManager({ onSavePalette, onDeletePalette, onApplyPalette }) {
  const { t } = useTranslation()
  const [paletteName, setPaletteName] = useState('')
  const [colors, setColors] = useState([])
  const [colorInput, setColorInput] = useState('#000000')
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [activeTab, setActiveTab] = useState('create') // 'create' | 'lospec'

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
      <div className="mb-4 flex gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('create')}
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
        <div>
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

          <label className="mb-1 block text-sm font-medium" htmlFor="palette-colors">
            {t('paletteManager.colorsLabel')}
          </label>
          <div className="mb-2 flex min-h-[48px] flex-wrap gap-2 rounded border p-2">
            {colors.map((color, index) => (
              <button
                key={`${color}-${index}`}
                type="button"
                title={color}
                className={`h-6 w-6 rounded border ${selectedIndex === index ? 'ring-2 ring-blue-500' : ''}`}
                style={{ background: color }}
                onClick={() => setSelectedIndex(index)}
              />
            ))}
            {colors.length === 0 && <span className="text-xs text-gray-500">{t('paletteManager.noColors')}</span>}
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <input
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
        <div>
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
