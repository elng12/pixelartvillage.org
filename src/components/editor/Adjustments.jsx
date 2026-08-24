import React, { useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { PALETTES } from '../../utils/constants'
import { clampZoom, formatZoomLabel, MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from '../../utils/zoom-utils'

function Adjustments({ state, dispatch, customPalettes, onZoomChange, fixedOutput }) {
  const { t } = useTranslation()
  // Use rAF-throttled setter so slider drag is smooth; coalesce multiple events per frame
  const rafId = useRef(0)
  const pending = useRef({})
  const flush = useCallback(() => {
    // Commit all pending field updates in a single reducer pass per frame
    const entries = Object.entries(pending.current)
    for (const [field, value] of entries) {
      if (field === 'zoom' && typeof onZoomChange === 'function') onZoomChange(value)
      else dispatch({ type: 'SET', field, value })
    }
    pending.current = {}
    rafId.current = 0
  }, [dispatch, onZoomChange])

  const set = (field) => (e) => {
    const raw = e?.target?.value
    const value = typeof state[field] === 'number' ? Number(raw) : raw
    pending.current[field] = value
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(flush)
    }
  }
  const setBool = (field) => (e) => dispatch({ type: 'SET', field, value: e.target.checked })

  return (
    <>
      {/* Reset sliders block */}
      <div>
        <label className="block text-sm font-medium mb-2">{t('adjustments.reset.title')}</label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-secondary px-2 py-1 text-xs"
            onClick={() => dispatch({ type: 'RESET_SLIDERS' })}
            title={t('adjustments.reset.tooltip')}
            aria-label={t('adjustments.reset.all')}
          >
            {t('adjustments.reset.all')}
          </button>
          {!fixedOutput ? (
            <button type="button" className="btn-secondary px-2 py-1 text-xs" onClick={() => dispatch({ type: 'SET', field: 'pixelSize', value: 1 })} title={t('adjustments.reset.pixelSizeBtnTitle')} aria-label={t('adjustments.reset.pixelSizeBtnTitle')}>▌ PS</button>
          ) : null}
          <button type="button" className="btn-secondary px-2 py-1 text-xs" onClick={() => dispatch({ type: 'SET', field: 'brightness', value: 0 })} title={t('adjustments.reset.brightnessBtnTitle')} aria-label={t('adjustments.reset.brightnessBtnTitle')}>▌ BR</button>
          <button type="button" className="btn-secondary px-2 py-1 text-xs" onClick={() => dispatch({ type: 'SET', field: 'contrast', value: 0 })} title={t('adjustments.reset.contrastBtnTitle')} aria-label={t('adjustments.reset.contrastBtnTitle')}>▌ CT</button>
          <button type="button" className="btn-secondary px-2 py-1 text-xs" onClick={() => dispatch({ type: 'SET', field: 'saturation', value: 0 })} title={t('adjustments.reset.saturationBtnTitle')} aria-label={t('adjustments.reset.saturationBtnTitle')}>▌ SN</button>
        </div>
      </div>

      {fixedOutput ? (
        <div data-testid="fixed-output-controls">
          <p className="text-sm font-medium">
            {t('adjustments.fixedOutput.label', { defaultValue: 'Output size' })}
          </p>
          <p className="mt-1 text-lg font-semibold text-gray-950">
            {fixedOutput.width} x {fixedOutput.height} px
          </p>
          <fieldset className="mt-3">
            <legend className="text-sm font-medium">
              {t('adjustments.fixedOutput.fitLabel', { defaultValue: 'Image fit' })}
            </legend>
            <div className="mt-2 inline-flex overflow-hidden rounded-lg border border-gray-300" role="group" aria-label={t('adjustments.fixedOutput.fitLabel', { defaultValue: 'Image fit' })}>
              {[
                ['cover', t('adjustments.fixedOutput.cover', { defaultValue: 'Crop to fill' })],
                ['contain', t('adjustments.fixedOutput.contain', { defaultValue: 'Fit entire image' })],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={state.outputFit === value}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${state.outputFit === value ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => dispatch({ type: 'SET', field: 'outputFit', value })}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {state.outputFit === 'cover'
                ? t('adjustments.fixedOutput.coverNote', { defaultValue: 'Fills the square and crops the outer edges.' })
                : t('adjustments.fixedOutput.containNote', { defaultValue: 'Keeps the whole image and leaves transparent space when needed.' })}
            </p>
          </fieldset>
        </div>
      ) : (
        <div>
          <label htmlFor="pixel-size-slider" className="block text-sm font-medium mb-2">{t('adjustments.pixelSize', { value: state.pixelSize })}</label>
          <input id="pixel-size-slider" type="range" min="1" max="50" value={state.pixelSize} onChange={set('pixelSize')} className="w-full" />
        </div>
      )}

      {/* Color adjustments */}
      <div className="space-y-4 border-t pt-4">
        <label className="block text-base font-medium">{t('adjustments.section.color')}</label>
        <div>
          <label htmlFor="brightness-slider" className="block text-sm font-medium mb-2">{t('adjustments.brightness', { value: state.brightness })}</label>
          <input id="brightness-slider" type="range" min="-100" max="100" value={state.brightness} onChange={set('brightness')} className="w-full" />
        </div>
        <div>
          <label htmlFor="contrast-slider" className="block text-sm font-medium mb-2">{t('adjustments.contrast', { value: state.contrast })}</label>
          <input id="contrast-slider" type="range" min="-100" max="100" value={state.contrast} onChange={set('contrast')} className="w-full" />
        </div>
        <div>
          <label htmlFor="saturation-slider" className="block text-sm font-medium mb-2">{t('adjustments.saturation', { value: state.saturation })}</label>
          <input id="saturation-slider" type="range" min="-100" max="100" value={state.saturation} onChange={set('saturation')} className="w-full" />
        </div>

        <div>
          <label htmlFor="palette-select" className="block text-sm font-medium mb-2">{t('adjustments.palette.label')}</label>
          <select id="palette-select" className="w-full border rounded p-2" value={state.palette} onChange={set('palette')}>
            <option value="none">{t('adjustments.palette.none')}</option>
            {PALETTES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
            {customPalettes?.length > 0 && (
              <optgroup label={t('adjustments.palette.custom')}>
                {customPalettes.map((p) => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </optgroup>
            )}
          </select>
          <p className="text-xs text-gray-500 mt-1">{t('adjustments.palette.note')}</p>
        </div>

        <div>
          <label htmlFor="color-distance" className="block text-sm font-medium mb-2">{t('adjustments.colorDistance.label')}</label>
          <select id="color-distance" className="w-full border rounded p-2" value={state.colorDistance} onChange={set('colorDistance')}>
            <option value="rgb">{t('adjustments.colorDistance.rgb')}</option>
            <option value="lab">{t('adjustments.colorDistance.lab')}</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input id="auto-palette" type="checkbox" className="h-4 w-4" checked={state.autoPalette} onChange={setBool('autoPalette')} />
          <label htmlFor="auto-palette" className="text-sm">{t('adjustments.autoPalette')}</label>
        </div>
        {state.autoPalette && (
          <div>
            <label htmlFor="palette-size" className="block text-sm font-medium mb-2">{t('adjustments.paletteSize', { value: state.paletteSize })}</label>
            <input id="palette-size" type="range" min="2" max="64" value={state.paletteSize} onChange={set('paletteSize')} className="w-full" />
          </div>
        )}

        <div className="flex items-center gap-3">
          <input id="dither" type="checkbox" className="h-4 w-4" checked={state.dither} onChange={setBool('dither')} />
          <label htmlFor="dither" className="text-sm">{t('adjustments.dither')}</label>
        </div>

        <div>
          <label htmlFor="zoom-slider" className="block text-sm font-medium mb-2">{t('adjustments.zoom', { value: formatZoomLabel(state.zoom) })}</label>
          <input id="zoom-slider" type="range" min={MIN_ZOOM} max={MAX_ZOOM} step={ZOOM_STEP} value={clampZoom(state.zoom)} onChange={set('zoom')} className="w-full" />
          <div className="flex items-center gap-3 mt-2">
            <input id="grid-toggle" type="checkbox" className="h-4 w-4" checked={state.showGrid} onChange={setBool('showGrid')} />
            <label htmlFor="grid-toggle" className="text-sm">{t('adjustments.grid')}</label>
          </div>
          {state.showGrid ? (
            <div className="mt-3">
              <label htmlFor="grid-color" className="block text-sm font-medium mb-2">{t('adjustments.gridColor')}</label>
              <div className="flex items-center gap-3">
                <input id="grid-color" type="color" className="h-10 w-14 rounded border" value={state.gridColor} onChange={set('gridColor')} />
                <span className="text-sm text-gray-500">{state.gridColor.toUpperCase()}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default Adjustments
