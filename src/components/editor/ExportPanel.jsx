import React from 'react'
import { useTranslation } from 'react-i18next'

function ExportPanel({ exportFormat, setExportFormat, exportSize, setExportSize, transparentBG, setTransparentBG, quality, setQuality, fixedOutput }) {
  const { t } = useTranslation()
  const fixedWidth = fixedOutput?.width
  const fixedHeight = fixedOutput?.height
  const fixedSizes = fixedWidth && fixedHeight
    ? [
        { value: 'pixel', label: `${fixedWidth} x ${fixedHeight}` },
        { value: 'double', label: `${fixedWidth * 2} x ${fixedHeight * 2}` },
        { value: 'quad', label: `${fixedWidth * 4} x ${fixedHeight * 4}` },
      ]
    : []
  return (
    <div className="border-t pt-4">
      <label htmlFor="format-select" className="block text-sm font-medium mb-2">{t('export.label.format')}</label>
      <select id="format-select" className="w-full border rounded p-2" value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
        <option value="png">{t('export.option.png')}</option>
        <option value="jpeg">{t('export.option.jpeg')}</option>
        <option value="webp">{t('export.option.webp')}</option>
      </select>
      <div className="mt-3">
        <label htmlFor="scale-select" className="block text-sm font-medium mb-2">{t('export.label.size')}</label>
        <div className="flex flex-wrap gap-2">
          {fixedSizes.length ? fixedSizes.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={exportSize === option.value}
              className={`btn-secondary ${exportSize === option.value ? 'ring-1 ring-blue-500' : ''}`}
              onClick={() => setExportSize(option.value)}
            >
              {option.label}
            </button>
          )) : (
            <>
              <button type="button" className={`btn-secondary ${exportSize==='pixel'?'ring-1 ring-blue-500':''}`} onClick={() => setExportSize('pixel')}>{t('export.size.pixel')}</button>
              <button type="button" className={`btn-secondary ${exportSize==='source'?'ring-1 ring-blue-500':''}`} onClick={() => setExportSize('source')}>{t('export.size.source')}</button>
              <button type="button" className={`btn-secondary ${exportSize==='double'?'ring-1 ring-blue-500':''}`} onClick={() => setExportSize('double')}>{t('export.size.double')}</button>
              <button type="button" className={`btn-secondary ${exportSize==='quad'?'ring-1 ring-blue-500':''}`} onClick={() => setExportSize('quad')}>{t('export.size.quad')}</button>
            </>
          )}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          {fixedSizes.length
            ? t('export.fixedNote', {
                width: fixedWidth,
                height: fixedHeight,
                defaultValue: 'The first option downloads the exact {{width}} x {{height}} pixel file. Larger options use nearest-neighbor scaling to keep edges crisp.',
              })
            : t('export.note')}
        </p>
      </div>
      <div className="flex items-center gap-3 mt-3">
        <input id="transparent-bg" type="checkbox" className="h-4 w-4" checked={transparentBG} onChange={(e)=>setTransparentBG(e.target.checked)} />
        <label htmlFor="transparent-bg" className="text-sm">{t('export.transparent.label')}</label>
      </div>
      {exportFormat !== 'png' && (
        <div className="mt-3">
          <label htmlFor="quality-slider" className="block text-sm font-medium mb-2">{t('export.quality.label', { percent: Math.round(quality * 100) })}</label>
          <input id="quality-slider" type="range" min="0.1" max="1" step="0.01" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" />
        </div>
      )}
    </div>
  )
}

export default ExportPanel
