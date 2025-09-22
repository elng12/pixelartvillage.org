export const PALETTES = [
  'Pico-8',
  'Lost Century',
  'Sunset 8',
  'Twilight 5',
  'Hollow',
];

// 已实现的调色板映射：仅提供 Pico-8，其他名称将不生效（等后续补齐）
export const PALETTE_MAP = {
  'Pico-8': [
    '#000000', '#1d2b53', '#7e2553', '#008751', '#ab5236', '#5f574f', '#c2c3c7', '#fff1e8',
    '#ff004d', '#ffa300', '#ffec27', '#00e436', '#29adff', '#83769c', '#ff77a8', '#ffccaa',
  ],
};

// 预览图最大边阈值（前端等比下采样用）
export const PREVIEW_LIMIT = { maxEdge: 2200 };

// ---- Custom palettes (localStorage) ----
const STORAGE_KEY = 'customPalettes';

export function loadCustomPalettes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // normalize schema: [{ name: string, colors: string[] }]
    return parsed
      .filter((p) => p && typeof p.name === 'string' && Array.isArray(p.colors))
      .map((p) => ({ name: p.name, colors: p.colors.filter((c) => typeof c === 'string') }));
  } catch (err) {
    if (import.meta?.env?.DEV) {
      console.error('Failed to load custom palettes from localStorage:', err);
    }
    return [];
  }
}

export function saveCustomPalettes(palettes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes || []));
  } catch {
    // ignore write failures (private mode, quota, etc.)
  }
}

export function getCustomPaletteByName(name) {
  const list = loadCustomPalettes();
  const hit = list.find((p) => p.name === name);
  return hit ? hit.colors : null;
}

// For names without built-in colors, infer an auto-palette size
export function inferAutoPaletteSize(name) {
  if (!name) return null;
  // numeric suffix e.g. "Sunset 8" / "Twilight 5"
  const m = String(name).match(/(\d+)\s*$/);
  if (m) return Math.max(2, Math.min(64, parseInt(m[1], 10)));
  // known labels without explicit size
  const map = {
    'Lost Century': 16,
    'Hollow': 8,
  };
  return map[name] ?? null;
}
