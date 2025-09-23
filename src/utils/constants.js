// 向后兼容聚合导出：保留原 API 名称，内部转发到拆分模块
export { PALETTES, PALETTE_MAP } from './palette-constants'
export { inferAutoPaletteSize } from './palette-utils'
export { loadCustomPalettes, saveCustomPalettes, getCustomPaletteByName } from './palette-storage'

// 预览图最大边阈值（前端等比下采样用）
export const PREVIEW_LIMIT = { maxEdge: 2200 }
