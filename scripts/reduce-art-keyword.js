#!/usr/bin/env node
/* eslint-disable no-dupe-keys, no-unused-vars */

import fs from 'fs';
import path from 'path';

// 需要调整的文件路径
const filesToProcess = [
  'public/locales/en/translation.json',
  'public/locales/es/translation.json',
  'public/locales/fr/translation.json',
  'public/locales/de/translation.json',
  'public/locales/it/translation.json',
  'public/locales/pt/translation.json',
  'public/locales/pt-br/translation.json',
  'public/locales/ru/translation.json',
  'public/locales/ja/translation.json',
  'public/locales/pl/translation.json',
  'public/locales/id/translation.json',
  'public/locales/vi/translation.json',
  'public/locales/fil/translation.json'
];

// "art" 替换规则 - 减少 art 关键词使用
const artReplacements = {
  // 英语替换
  'pixel art': 'pixel graphics',
  'Pixel Art': 'Pixel Graphics', 
  'pixel art maker': 'pixel graphics maker',
  'Pixel Art Maker': 'Pixel Graphics Maker',
  'art maker': 'graphics maker',
  'Art Maker': 'Graphics Maker',
  'digital art': 'digital graphics',
  'Digital Art': 'Digital Graphics',
  'art generator': 'graphics generator',
  'Art Generator': 'Graphics Generator',
  'art converter': 'graphics converter',
  'Art Converter': 'Graphics Converter',
  'art creation': 'graphics creation',
  'Art Creation': 'Graphics Creation',
  'art tools': 'graphics tools',
  'Art Tools': 'Graphics Tools',
  'art editor': 'graphics editor',
  'Art Editor': 'Graphics Editor',
  'art style': 'graphics style',
  'Art Style': 'Graphics Style',
  'retro art': 'retro graphics',
  'Retro Art': 'Retro Graphics',
  '8-bit art': '8-bit graphics',
  '8-Bit Art': '8-Bit Graphics',
  'game art': 'game graphics',
  'Game Art': 'Game Graphics',
  
  // 西班牙语替换
  'arte píxel': 'gráficos píxel',
  'Arte Píxel': 'Gráficos Píxel',
  'creador de arte': 'creador de gráficos',
  'Creador de Arte': 'Creador de Gráficos',
  'arte digital': 'gráficos digitales',
  'Arte Digital': 'Gráficos Digitales',
  'generador de arte': 'generador de gráficos',
  'Generador de Arte': 'Generador de Gráficos',
  'conversor de arte': 'conversor de gráficos',
  'Conversor de Arte': 'Conversor de Gráficos',
  
  // 法语替换
  'art pixel': 'graphiques pixel',
  'Art Pixel': 'Graphiques Pixel',
  'créateur d\'art': 'créateur de graphiques',
  'Créateur d\'Art': 'Créateur de Graphiques',
  'art numérique': 'graphiques numériques',
  'Art Numérique': 'Graphiques Numériques',
  
  // 德语替换
  'Pixel-Art': 'Pixel-Grafiken',
  'Kunst-Ersteller': 'Grafik-Ersteller',
  'digitale Kunst': 'digitale Grafiken',
  'Digitale Kunst': 'Digitale Grafiken',
  
  // 意大利语替换
  'arte pixel': 'grafica pixel',
  'Arte Pixel': 'Grafica Pixel',
  'creatore di arte': 'creatore di grafica',
  'Creatore di Arte': 'Creatore di Grafica',
  'arte digitale': 'grafica digitale',
  'Arte Digitale': 'Grafica Digitale',
  
  // 葡萄牙语替换
  'arte pixel': 'gráficos pixel',
  'Arte Pixel': 'Gráficos Pixel',
  'criador de arte': 'criador de gráficos',
  'Criador de Arte': 'Criador de Gráficos',
  'arte digital': 'gráficos digitais',
  'Arte Digital': 'Gráficos Digitais',
  
  // 俄语替换
  'пиксельное искусство': 'пиксельная графика',
  'Пиксельное Искусство': 'Пиксельная Графика',
  'создатель искусства': 'создатель графики',
  'Создатель Искусства': 'Создатель Графики',
  'цифровое искусство': 'цифровая графика',
  'Цифровое Искусство': 'Цифровая Графика',
  
  // 日语替换
  'ピクセルアート': 'ピクセルグラフィック',
  'アート作成': 'グラフィック作成',
  'デジタルアート': 'デジタルグラフィック',
  
  // 韩语替换
  '픽셀 아트': '픽셀 그래픽',
  '아트 제작': '그래픽 제작',
  '디지털 아트': '디지털 그래픽',
  
  // 中文替换
  '像素艺术': '像素图形',
  '艺术制作': '图形制作',
  '数字艺术': '数字图形',
  
  // 阿拉伯语替换
  'فن البكسل': 'رسوميات البكسل',
  'صانع الفن': 'صانع الرسوميات',
  'الفن الرقمي': 'الرسوميات الرقمية',
  
  // 印地语替换
  'पिक्सेल कला': 'पिक्सेल ग्राफिक्स',
  'कला निर्माता': 'ग्राफिक्स निर्माता',
  'डिजिटल कला': 'डिजिटल ग्राफिक्स',
  
  // 波兰语替换
  'piksel artu': 'piksel grafiki',
  'Piksel Artu': 'Piksel Grafiki',
  'piksel art': 'piksel grafika',
  'Piksel Art': 'Piksel Grafika',
  'tworzeniu piksel artu': 'tworzeniu piksel grafiki',
  'Tworzeniu Piksel Artu': 'Tworzeniu Piksel Grafiki',
  'generator piksel artu': 'generator piksel grafiki',
  'Generator Piksel Artu': 'Generator Piksel Grafiki',
  'konwerter piksel artu': 'konwerter piksel grafiki',
  'Konwerter Piksel Artu': 'Konwerter Piksel Grafiki'
};

// "image" 增强规则 - 增加 image 关键词使用
const imageEnhancements = {
  // 英语增强
  'photo': 'image',
  'Photo': 'Image',
  'picture': 'image',
  'Picture': 'Image',
  'pic': 'image',
  'Pic': 'Image',
  
  // 西班牙语增强
  'foto': 'imagen',
  'Foto': 'Imagen',
  
  // 法语增强
  'photo': 'image',
  'Photo': 'Image',
  
  // 德语增强
  'Foto': 'Bild',
  
  // 意大利语增强
  'foto': 'immagine',
  'Foto': 'Immagine',
  
  // 葡萄牙语增强
  'foto': 'imagem',
  'Foto': 'Imagem'
};

// "palette" 增强规则 - 增加 palette 关键词使用
const paletteEnhancements = {
  // 英语增强
  'color scheme': 'color palette',
  'Color Scheme': 'Color Palette',
  'color set': 'color palette',
  'Color Set': 'Color Palette',
  'colors': 'palette colors',
  'Colors': 'Palette Colors',
  
  // 西班牙语增强
  'esquema de colores': 'paleta de colores',
  'Esquema de Colores': 'Paleta de Colores',
  'conjunto de colores': 'paleta de colores',
  'Conjunto de Colores': 'Paleta de Colores',
  
  // 法语增强
  'schéma de couleurs': 'palette de couleurs',
  'Schéma de Couleurs': 'Palette de Couleurs',
  
  // 德语增强
  'Farbschema': 'Farbpalette',
  
  // 意大利语增强
  'schema colori': 'tavolozza colori',
  'Schema Colori': 'Tavolozza Colori',
  
  // 葡萄牙语增强
  'esquema de cores': 'paleta de cores',
  'Esquema de Cores': 'Paleta de Cores'
};

function processFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  文件不存在: ${filePath}`);
    return { processed: false, changes: 0 };
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changes = 0;
    const originalContent = content;

    // 应用 art 替换规则
    Object.entries(artReplacements).forEach(([oldText, newText]) => {
      const regex = new RegExp(oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, newText);
        changes += matches.length;
      }
    });

    // 应用 image 增强规则
    Object.entries(imageEnhancements).forEach(([oldText, newText]) => {
      const regex = new RegExp(`\\b${oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, newText);
        changes += matches.length;
      }
    });

    // 应用 palette 增强规则
    Object.entries(paletteEnhancements).forEach(([oldText, newText]) => {
      const regex = new RegExp(oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, newText);
        changes += matches.length;
      }
    });

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      return { processed: true, changes };
    }

    return { processed: false, changes: 0 };
  } catch (error) {
    console.error(`❌ 处理文件时出错 ${filePath}:`, error.message);
    return { processed: false, changes: 0 };
  }
}

function main() {
  console.log('🎯 开始批量减少 "art" 关键词并增强 "image" 和 "palette" 关键词...\n');
  
  let totalChanges = 0;
  let processedFiles = 0;

  filesToProcess.forEach(filePath => {
    const result = processFile(filePath);
    if (result.processed) {
      console.log(`✅ ${filePath}: ${result.changes} 个关键词已调整`);
      processedFiles++;
      totalChanges += result.changes;
    } else if (result.changes === 0) {
      console.log(`ℹ️  ${filePath}: 无需调整`);
    }
  });

  console.log(`\n📊 批量调整完成:`);
  console.log(`   处理的文件: ${processedFiles}/${filesToProcess.length}`);
  console.log(`   总调整次数: ${totalChanges}`);
  
  if (totalChanges > 0) {
    console.log(`\n💡 建议运行以下命令查看效果:`);
    console.log(`   npm run seo:adjust`);
  }
}

// 如果直接运行此脚本
main();

export { processFile, artReplacements, imageEnhancements, paletteEnhancements };
