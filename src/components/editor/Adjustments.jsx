import React from 'react'
import { useTranslation } from 'react-i18next'
import { PALETTES } from '../../utils/constants'

function Adjustments({ state, dispatch, customPalettes }) {
  const { t } = useTranslation()
  const set = (field) => (e) => dispatch({ type: 'SET', field, value: typeof state[field] === 'number' ? Number(e.target.value) : e.target.value })
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
          >
            {t('adjustments.reset.all')}
          </button>
          <button type="button" className="btn-secondary px-2 py-1 text-xs" onClick={() => dispatch({ type: 'SET', field: 'pixelSize', value: 1 })} title={t('adjustments.reset.pixelSizeBtnTitle')}>▌ PS</button>
          <button type="button" className="btn-secondary px-2 py-1 text-xs" onClick={() => dispatch({ type: 'SET', field: 'brightness', value: 0 })} title={t('adjustments.reset.brightnessBtnTitle')}>▌ BR</button>
          <button type="button" className="btn-secondary px-2 py-1 text-xs" onClick={() => dispatch({ type: 'SET', field: 'contrast', value: 0 })} title={t('adjustments.reset.contrastBtnTitle')}>▌ CT</button>
          <button type="button" className="btn-secondary px-2 py-1 text-xs" onClick={() => dispatch({ type: 'SET', field: 'saturation', value: 0 })} title={t('adjustments.reset.saturationBtnTitle')}>▌ SN</button>
        </div>
      </div>

      {/* Pixel size */}
      <div>
        <label htmlFor="pixel-size-slider" className="block text-sm font-medium mb-2">{t('adjustments.pixelSize', { value: state.pixelSize })}</label>
        <input id="pixel-size-slider" type="range" min="1" max="50" value={state.pixelSize} onChange={set('pixelSize')} className="w-full" />
      </div>

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
          <label htmlFor="zoom-slider" className="block text-sm font-medium mb-2">{t('adjustments.zoom', { value: state.zoom })}</label>
          <input id="zoom-slider" type="range" min="0.05" max="8" step="0.05" value={state.zoom} onChange={set('zoom')} className="w-full" />
          <div className="flex items-center gap-3 mt-2">
            <input id="grid-toggle" type="checkbox" className="h-4 w-4" checked={state.showGrid} onChange={setBool('showGrid')} />
            <label htmlFor="grid-toggle" className="text-sm">{t('adjustments.grid')}</label>
          </div>
        </div>
      </div>
    </>
  )
}

export default Adjustments
