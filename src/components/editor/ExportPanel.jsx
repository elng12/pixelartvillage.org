import React from 'react'

function ExportPanel({ exportFormat, setExportFormat, exportScale, setExportScale, transparentBG, setTransparentBG, quality, setQuality }) {
  return (
    <div className="border-t pt-4">
      <label htmlFor="format-select" className="block text-sm font-medium mb-2">Export format</label>
      <select id="format-select" className="w-full border rounded p-2" value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
        <option value="png">PNG (lossless)</option>
        <option value="jpeg">JPEG</option>
        <option value="webp">WebP</option>
      </select>
      <div className="mt-3">
        <label htmlFor="scale-select" className="block text-sm font-medium mb-2">Export size</label>
        <div className="flex gap-2">
          <button type="button" className={`btn-secondary ${exportScale===0.5?'ring-1 ring-blue-500':''}`} onClick={() => setExportScale(0.5)}>XS (0.5×)</button>
          <button type="button" className={`btn-secondary ${exportScale===1?'ring-1 ring-blue-500':''}`} onClick={() => setExportScale(1)}>Small (1×)</button>
          <button type="button" className={`btn-secondary ${exportScale===2?'ring-1 ring-blue-500':''}`} onClick={() => setExportScale(2)}>Large (2×)</button>
          <button type="button" className={`btn-secondary ${exportScale===4?'ring-1 ring-blue-500':''}`} onClick={() => setExportScale(4)}>XL (4×)</button>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-3">
        <input id="transparent-bg" type="checkbox" className="h-4 w-4" checked={transparentBG} onChange={(e)=>setTransparentBG(e.target.checked)} />
        <label htmlFor="transparent-bg" className="text-sm">Transparent background (PNG/WebP)</label>
      </div>
      {exportFormat !== 'png' && (
        <div className="mt-3">
          <label htmlFor="quality-slider" className="block text-sm font-medium mb-2">Quality: {Math.round(quality * 100)}%</label>
          <input id="quality-slider" type="range" min="0.1" max="1" step="0.01" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" />
        </div>
      )}
    </div>
  )
}

export default ExportPanel

