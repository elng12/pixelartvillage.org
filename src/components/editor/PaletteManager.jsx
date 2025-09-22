import React, { useState } from 'react'
import { loadCustomPalettes, saveCustomPalettes } from '../../utils/constants'

function PaletteManager({ onPalettesChanged }) {
  const [pmName, setPmName] = useState('')
  const [pmColors, setPmColors] = useState([])
  const [pmInput, setPmInput] = useState('#000000')
  const [pmSelectedIdx, setPmSelectedIdx] = useState(-1)

  const savePalette = () => {
    const name = pmName.trim()
    if (!name || pmColors.length === 0) return
    const next = loadCustomPalettes()
    const idx = next.findIndex((p) => p.name === name)
    if (idx >= 0) next[idx] = { name, colors: pmColors }
    else next.push({ name, colors: pmColors })
    saveCustomPalettes(next)
    onPalettesChanged?.(next)
  }

  const resetPaletteForm = () => {
    setPmName('')
    setPmColors([])
    setPmInput('#000000')
    setPmSelectedIdx(-1)
  }

  const deleteCurrentPalette = () => {
    const name = pmName.trim()
    if (!name) return
    const next = loadCustomPalettes().filter((p) => p.name !== name)
    saveCustomPalettes(next)
    onPalettesChanged?.(next)
  }
  return (
    <div className="border-t pt-6">
      <h3 className="text-base font-semibold mb-3">Create palette</h3>
      <label className="block text-sm font-medium mb-1" htmlFor="pm-name">Palette Name</label>
      <input id="pm-name" className="w-full border rounded p-2 mb-3" value={pmName} onChange={(e)=>setPmName(e.target.value)} placeholder="My Palette" />
      <label className="block text-sm font-medium mb-1">Palette Colors</label>
      <div className="min-h-[48px] border rounded p-2 flex flex-wrap gap-2 mb-2">
        {pmColors.map((c, i) => (
          <button key={`${c}-${i}`} type="button" title={c}
            className={`h-6 w-6 rounded border ${pmSelectedIdx===i?'ring-2 ring-blue-500':''}`}
            style={{ background: c }}
            onClick={()=>setPmSelectedIdx(i)} />
        ))}
        {pmColors.length===0 && (<span className="text-xs text-gray-500">No colors yet</span>)}
      </div>
      <div className="flex items-center gap-2 mb-3">
        <input className="border rounded p-2 w-36" value={pmInput} onChange={(e)=>setPmInput(e.target.value)} placeholder="#000000" />
        <button type="button" className="btn-secondary" onClick={()=>{ if(/^#?[0-9a-fA-F]{6}$/.test(pmInput.startsWith('#')?pmInput:('#'+pmInput))) { const hex = pmInput.startsWith('#')?pmInput:('#'+pmInput); setPmColors((arr)=>[...arr, hex]); } }}>
          Add color
        </button>
        <button type="button" className="btn-secondary" onClick={()=>{ if(pmSelectedIdx>=0){ setPmColors((arr)=>arr.filter((_,i)=>i!==pmSelectedIdx)); setPmSelectedIdx(-1);} }}>
          Remove selected
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-primary" onClick={savePalette}>Save palette</button>
        <button type="button" className="btn-secondary" onClick={resetPaletteForm}>Reset form</button>
        <button type="button" className="btn-secondary" onClick={deleteCurrentPalette}>Delete palette</button>
      </div>
    </div>
  )
}

export default PaletteManager
