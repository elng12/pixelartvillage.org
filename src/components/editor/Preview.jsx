import React from 'react'

function Preview({ previewRef, processedImage, zoom, pixelSize, showGrid, isProcessing, imgDim, onDropFiles }) {
  const scaledW = imgDim?.w && imgDim?.h ? Math.max(1, Math.round(imgDim.w * zoom)) : undefined
  const scaledH = imgDim?.w && imgDim?.h ? Math.max(1, Math.round(imgDim.h * zoom)) : undefined
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
        alt="Pixel art generator preview"
        className={`transition-opacity ${isProcessing ? 'opacity-50' : 'opacity-100'} max-w-none`}
        style={{
          imageRendering: 'pixelated',
          width: scaledW ? `${scaledW}px` : undefined,
          height: scaledH ? `${scaledH}px` : undefined,
        }}
      />
      <div className="absolute -top-3 right-4 text-xs text-gray-500 bg-white/80 px-2 rounded">
        {imgDim?.w && imgDim?.h ? `${imgDim.w} × ${imgDim.h} (${Math.round((imgDim.w * imgDim.h) / 1000000)}M px)` : ''}
      </div>
      {showGrid && (
        <div aria-hidden className="pointer-events-none absolute inset-2 rounded" style={{
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.12) 1px, transparent 1px)',
          backgroundSize: `${Math.max(1, pixelSize) * zoom}px ${Math.max(1, pixelSize) * zoom}px`,
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
            <p className="text-gray-500">Processing...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Preview
