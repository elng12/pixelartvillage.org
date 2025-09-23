// 业务类工具：从名称推断自动调色板大小等
export function inferAutoPaletteSize(name) {
  if (!name) return null
  const m = String(name).match(/(\d+)\s*$/)
  if (m) return Math.max(2, Math.min(64, parseInt(m[1], 10)))
  const map = {
    'Lost Century': 16,
    'Hollow': 8,
  }
  return map[name] ?? null
}

