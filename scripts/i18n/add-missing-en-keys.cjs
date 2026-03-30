#!/usr/bin/env node

/**
 * 向英语基准文件添加缺失的键
 */

const fs = require('fs');
const path = require('path');

function loadTranslationFile(locale) {
  const filePath = path.join('public', 'locales', locale, 'translation.json');
  if (!fs.existsSync(filePath)) {
    console.warn(`警告: 翻译文件不存在: ${filePath}`);
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`错误: 无法解析翻译文件 ${filePath}:`, error.message);
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
    console.error(`错误: 无法保存翻译文件 ${filePath}:`, error.message);
    return false;
  }
}

function addMissingKeys(targetData, sourceData, path = '') {
  let addedKeys = 0;

  for (const [key, value] of Object.entries(sourceData)) {
    const currentPath = path ? `${path}.${key}` : key;

    if (!(key in targetData)) {
      // 添加缺失的键
      targetData[key] = value;
      console.log(`  ➕ 添加键: ${currentPath}`);
      addedKeys++;
    } else if (typeof value === 'object' && value !== null && typeof targetData[key] === 'object') {
      addedKeys += addMissingKeys(targetData[key], value, currentPath);
    }
  }

  return addedKeys;
}

function main() {
  console.log('➕ 向英语基准文件添加缺失的键...\n');

  const enData = loadTranslationFile('en');
  if (!enData) {
    console.error('错误: 无法加载英语基准文件');
    return;
  }

  // 从其他语言文件收集缺失的键
  const locales = ['es', 'de', 'fr'];
  let totalAdded = 0;

  for (const locale of locales) {
    console.log(`📝 检查语言: ${locale.toUpperCase()} 以获取缺失键`);

    const data = loadTranslationFile(locale);
    if (!data) continue;

    const addedKeys = addMissingKeys(enData, data);
    totalAdded += addedKeys;

    if (addedKeys > 0) {
      console.log(`  ✅ 从 ${locale} 添加了 ${addedKeys} 个键`);
    }
  }

  if (totalAdded > 0) {
    saveTranslationFile('en', enData);
    console.log(`\n🎉 英语基准文件已更新！总计添加 ${totalAdded} 个新键`);
  } else {
    console.log('\nℹ️  无需添加任何键');
  }

  console.log('\n现在所有语言文件应该保持一致');
}

if (require.main === module) {
  main();
}

module.exports = { main, addMissingKeys };