import React from 'react'
import { useTranslation } from 'react-i18next'

function toGridOverlayColor(hexColor) {
  const normalized = String(hexColor || '').trim().replace('#', '')
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return 'rgba(71, 85, 105, 0.28)'
  const r = parseInt(normalized.slice(0, 2), 16)
  const g = parseInt(normalized.slice(2, 4), 16)
  const b = parseInt(normalized.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, 0.28)`
}

function Preview({ previewRef, processedImage, zoom, pixelSize, showGrid, gridColor, isProcessing, imgDim, onDropFiles }) {
  const { t } = useTranslation()
  const scaledW = imgDim?.w && imgDim?.h ? Math.max(1, Math.round(imgDim.w * zoom)) : undefined
  const scaledH = imgDim?.w && imgDim?.h ? Math.max(1, Math.round(imgDim.h * zoom)) : undefined
  const gridColumns = imgDim?.w && pixelSize > 1 ? Math.max(1, Math.floor(imgDim.w / pixelSize)) : imgDim?.w
  const gridRows = imgDim?.h && pixelSize > 1 ? Math.max(1, Math.floor(imgDim.h / pixelSize)) : imgDim?.h
  const gridStepX = scaledW && gridColumns ? Math.max(1, scaledW / gridColumns) : Math.max(1, pixelSize) * zoom
  const gridStepY = scaledH && gridRows ? Math.max(1, scaledH / gridRows) : Math.max(1, pixelSize) * zoom
  return (
    <div
      ref={previewRef}
      data-testid="preview-container"
      aria-busy={isProcessing}
      className={"relative border rounded-lg p-2 bg-white h-[70vh] flex items-center justify-center shadow-sm overflow-auto"}
      onDragOver={(e) => { e.preventDefault(); }}
      onDrop={(e) => {
        e.preventDefault();
        const files = e.dataTransfer?.files;
        if (files && files.length && onDropFiles) onDropFiles(files);
      }}
    >
      <img
        src={processedImage || null}
        alt={t('preview.alt', { defaultValue: 'Pixel art preview' })}
        className={`transition-opacity ${isProcessing ? 'opacity-50' : 'opacity-100'} max-w-none`}
        style={{
          imageRendering: 'pixelated',
          width: scaledW ? `${scaledW}px` : undefined,
          height: scaledH ? `${scaledH}px` : undefined,
        }}
      />
      <div className="absolute -top-3 right-4 text-xs text-gray-500 bg-white/80 px-2 rounded">
        {imgDim?.w && imgDim?.h ? t('preview.sizeBadge', { w: imgDim.w, h: imgDim.h, mp: Math.round((imgDim.w * imgDim.h) / 1000000) }) : ''}
      </div>
      {showGrid && (
        <div aria-hidden className="pointer-events-none absolute inset-2 rounded" style={{
          backgroundImage: `linear-gradient(to right, ${toGridOverlayColor(gridColor)} 1px, transparent 1px), linear-gradient(to bottom, ${toGridOverlayColor(gridColor)} 1px, transparent 1px)`,
          backgroundSize: `${gridStepX}px ${gridStepY}px`,
        }} />
      )}
      {isProcessing && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-lg"
          data-testid="processing-indicator"
          role="status"
          aria-live="polite"
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
            <p className="text-gray-500">{t('preview.processing')}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Preview
