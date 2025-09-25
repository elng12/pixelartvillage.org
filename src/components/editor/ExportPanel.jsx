import React from 'react'
import { useTranslation } from 'react-i18next'

function ExportPanel({ exportFormat, setExportFormat, exportScale, setExportScale, transparentBG, setTransparentBG, quality, setQuality }) {
  const { t } = useTranslation()
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
        <div className="flex gap-2">
          <button type="button" className={`btn-secondary ${exportScale===0.5?'ring-1 ring-blue-500':''}`} onClick={() => setExportScale(0.5)}>{t('export.size.xs')}</button>
          <button type="button" className={`btn-secondary ${exportScale===1?'ring-1 ring-blue-500':''}`} onClick={() => setExportScale(1)}>{t('export.size.sm')}</button>
          <button type="button" className={`btn-secondary ${exportScale===2?'ring-1 ring-blue-500':''}`} onClick={() => setExportScale(2)}>{t('export.size.lg')}</button>
          <button type="button" className={`btn-secondary ${exportScale===4?'ring-1 ring-blue-500':''}`} onClick={() => setExportScale(4)}>{t('export.size.xl')}</button>
        </div>
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
