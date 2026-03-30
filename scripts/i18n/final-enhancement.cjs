#!/usr/bin/env node

/**
 * 最终增强脚本 - 将新增键同步到英语基准文件
 */

const fs = require('fs');
const path = require('path');

// 新增的翻译键
const NEW_KEYS = {
  tool: {
    dropZone: "Drop zone",
    downloadButton: "Download image",
    resetButton: "New image",
    pixelSize: "Pixel size",
    colorPalette: "Color palette",
    dithering: "Dithering",
    preview: "Preview",
    original: "Original",
    result: "Result"
  },
  features: {
    highQuality: "High Quality",
    highQualityDesc: "Export high-quality images perfect for your project",
    easyToUse: "Easy to Use",
    easyToUseDesc: "Intuitive interface designed for artists and developers"
  }
};

function loadTranslationFile(locale) {
  const filePath = path.join('public', 'locales', locale, 'translation.json');
  if (!fs.existsSync(filePath)) return null;

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`错误: 无法解析 ${filePath}:`, error.message);
    return null;
  }
}

function saveTranslationFile(locale, data) {
  const filePath = path.join('public', 'locales', locale, 'translation.json');

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`✅ 已更新: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`错误: 无法保存 ${filePath}:`, error.message);
    return false;
  }
}

function addKeysToTarget(target, source, path = '') {
  let added = 0;

  for (const [key, value] of Object.entries(source)) {
    const currentPath = path ? `${path}.${key}` : key;

    if (!(key in target)) {
      target[key] = value;
      console.log(`  ➕ 添加: ${currentPath}`);
      added++;
    } else if (typeof value === 'object' && value !== null && typeof target[key] === 'object') {
      added += addKeysToTarget(target[key], value, currentPath);
    }
  }

  return added;
}

function main() {
  console.log('🔧 最终增强：同步新增键到基准文件...\n');

  // 1. 更新英语基准文件
  console.log('📝 更新英语基准文件:');
  const enData = loadTranslationFile('en');
  if (!enData) {
    console.error('❌ 无法加载英语基准文件');
    return;
  }

  const addedToEn = addKeysToTarget(enData, NEW_KEYS);
  if (addedToEn > 0) {
    saveTranslationFile('en', enData);
    console.log(`✅ 英语基准文件已添加 ${addedToEn} 个新键\n`);
  }

  // 2. 将新键同步到其他核心语言
  const otherLocales = ['ja', 'ko'];
  let totalSynced = 0;

  for (const locale of otherLocales) {
    console.log(`📝 同步到 ${locale.toUpperCase()}:`);
    const data = loadTranslationFile(locale);
    if (!data) continue;

    const synced = addKeysToTarget(data, NEW_KEYS);
    if (synced > 0) {
      saveTranslationFile(locale, data);
      console.log(`✅ ${locale} 已同步 ${synced} 个键`);
    } else {
      console.log(`ℹ️  ${locale} 无需同步`);
    }
    totalSynced += synced;
    console.log('');
  }

  console.log(`🎉 最终增强完成！总计处理 ${addedToEn + totalSynced} 个键`);
  console.log('\n现在所有语言文件应该完全一致！');
}

if (require.main === module) {
  main();
}

module.exports = { main, addKeysToTarget };