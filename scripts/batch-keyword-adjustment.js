#!/usr/bin/env node
// 批量关键词调整脚本
// 在所有翻译文件中调整关键词分布

import fs from 'node:fs'
import path from 'node:path'

const LOCALES_DIR = path.resolve('public/locales')
const LANGUAGES = ['en', 'es', 'id', 'de', 'pl', 'it', 'pt', 'fr', 'ru', 'fil', 'vi', 'ja']

// 关键词替换规则 - 减少"art"，增加"image"和"palette"
const REPLACEMENTS = {
  // 减少 "art" 的使用
  'pixel art': 'pixel graphics',
  'digital art': 'digital graphics', 
  'art maker': 'graphics maker',
  'art generator': 'graphics generator',
  'art converter': 'graphics converter',
  'create art': 'create graphics',
  'make art': 'make graphics',
  
  // 但保持核心短语不变
  'image to pixel art': 'image to pixel art', // 保持不变
  'photo to pixel art': 'photo to pixel art', // 保持不变
  
  // 增加 palette 相关词汇
  'color controls': 'palette controls',
  'color options': 'palette options',
  'color settings': 'palette settings',
  'custom colors': 'custom palettes',
  'advanced colors': 'advanced palettes',
  
  // 增加 image 相关词汇
  'photo processing': 'image processing',
  'picture conversion': 'image conversion',
  'photo converter': 'image converter',
  'picture to': 'image to',
}

// 语言特定的替换规则
const LANGUAGE_REPLACEMENTS = {
  es: {
    'arte píxel': 'gráficos píxel',
    'arte digital': 'gráficos digitales',
    'creador de arte': 'creador de gráficos',
    'generador de arte': 'generador de gráficos',
    'conversor de arte': 'conversor de gráficos',
    'crear arte': 'crear gráficos',
    'hacer arte': 'hacer gráficos',
    'colores personalizados': 'paletas personalizadas',
    'opciones de color': 'opciones de paleta',
    'controles de color': 'controles de paleta',
  },
  pt: {
    'pixel art': 'gráficos pixel',
    'arte digital': 'gráficos digitais',
    'criador de arte': 'criador de gráficos',
    'gerador de arte': 'gerador de gráficos',
    'conversor de arte': 'conversor de gráficos',
    'criar arte': 'criar gráficos',
    'fazer arte': 'fazer gráficos',
    'cores personalizadas': 'paletas personalizadas',
    'opções de cor': 'opções de paleta',
    'controles de cor': 'controles de paleta',
  },
  fr: {
    'art pixel': 'graphiques pixel',
    'art numérique': 'graphiques numériques',
    'créateur d\'art': 'créateur de graphiques',
    'générateur d\'art': 'générateur de graphiques',
    'convertisseur d\'art': 'convertisseur de graphiques',
    'créer de l\'art': 'créer des graphiques',
    'faire de l\'art': 'faire des graphiques',
    'couleurs personnalisées': 'palettes personnalisées',
    'options de couleur': 'options de palette',
    'contrôles de couleur': 'contrôles de palette',
  },
  de: {
    'pixel art': 'pixel grafiken',
    'digitale kunst': 'digitale grafiken',
    'kunst ersteller': 'grafiken ersteller',
    'kunst generator': 'grafiken generator',
    'kunst konverter': 'grafiken konverter',
    'kunst erstellen': 'grafiken erstellen',
    'kunst machen': 'grafiken machen',
    'benutzerdefinierte farben': 'benutzerdefinierte paletten',
    'farboptionen': 'palettenoptionen',
    'farbsteuerung': 'palettensteuerung',
  },
  it: {
    'pixel art': 'grafica pixel',
    'arte digitale': 'grafica digitale',
    'creatore di arte': 'creatore di grafica',
    'generatore di arte': 'generatore di grafica',
    'convertitore di arte': 'convertitore di grafica',
    'creare arte': 'creare grafica',
    'fare arte': 'fare grafica',
    'colori personalizzati': 'palette personalizzate',
    'opzioni colore': 'opzioni palette',
    'controlli colore': 'controlli palette',
  },
  ru: {
    'пиксель‑арт': 'пиксельная графика',
    'цифровое искусство': 'цифровая графика',
    'создатель искусства': 'создатель графики',
    'генератор искусства': 'генератор графики',
    'конвертер искусства': 'конвертер графики',
    'создать искусство': 'создать графику',
    'сделать искусство': 'сделать графику',
    'пользовательские цвета': 'пользовательские палитры',
    'настройки цвета': 'настройки палитры',
    'управление цветом': 'управление палитрой',
  }
}

function adjustTranslationFile(langCode) {
  const filePath = path.join(LOCALES_DIR, langCode, 'translation.json')
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${langCode}: translation.json not found`)
    return
  }
  
  let content = fs.readFileSync(filePath, 'utf8')
  let changeCount = 0
  
  // 应用通用替换规则
  Object.entries(REPLACEMENTS).forEach(([from, to]) => {
    const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    const matches = content.match(regex)
    if (matches) {
      content = content.replace(regex, to)
      changeCount += matches.length
    }
  })
  
  // 应用语言特定替换规则
  if (LANGUAGE_REPLACEMENTS[langCode]) {
    Object.entries(LANGUAGE_REPLACEMENTS[langCode]).forEach(([from, to]) => {
      const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
      const matches = content.match(regex)
      if (matches) {
        content = content.replace(regex, to)
        changeCount += matches.length
      }
    })
  }
  
  if (changeCount > 0) {
    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`✅ ${langCode}: ${changeCount} 个关键词已调整`)
  } else {
    console.log(`ℹ️  ${langCode}: 无需调整`)
  }
}

function batchAdjust() {
  console.log('🔧 批量关键词调整开始...')
  console.log('=' .repeat(50))
  
  LANGUAGES.forEach(lang => {
    adjustTranslationFile(lang)
  })
  
  console.log('')
  console.log('✅ 批量调整完成！')
  console.log('💡 建议：运行 npm run build && npm run seo:adjust 查看效果')
}

batchAdjust()