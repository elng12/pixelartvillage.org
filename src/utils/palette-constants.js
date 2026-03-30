// 仅包含与调色板相关的纯常量
export const PALETTES = [
  'Pico-8',
  'Lost Century',
  'Sunset 8',
  'Twilight 5',
  'Hollow',
]

// 内置固定调色板，颜色值对齐公开 palette 源
export const PALETTE_MAP = {
  'Pico-8': [
    '#000000', '#1d2b53', '#7e2553', '#008751', '#ab5236', '#5f574f', '#c2c3c7', '#fff1e8',
    '#ff004d', '#ffa300', '#ffec27', '#00e436', '#29adff', '#83769c', '#ff77a8', '#ffccaa',
  ],
  'Lost Century': [
    '#d1b187', '#c77b58', '#ae5d40', '#79444a', '#4b3d44', '#ba9158', '#927441', '#4d4539',
    '#77743b', '#b3a555', '#d2c9a5', '#8caba1', '#4b726e', '#574852', '#847875', '#ab9b8e',
  ],
  'Sunset 8': [
    '#ffff78', '#ffd647', '#ffc247', '#ffa936', '#ff8b6f', '#e67595', '#9a6390', '#464678',
  ],
  'Twilight 5': [
    '#fbbbad', '#ee8695', '#4a7a96', '#333f58', '#292831',
  ],
  Hollow: [
    '#0f0f1b', '#565a75', '#c6b7be', '#fafbf6',
  ],
}
