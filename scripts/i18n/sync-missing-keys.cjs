#!/usr/bin/env node

/**
 * 同步缺失的翻译键
 * 将英语基准文件中的所有键同步到其他语言文件
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
    console.log(`✅ 已同步: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`错误: 无法保存翻译文件 ${filePath}:`, error.message);
    return false;
  }
}

function syncMissingKeys(targetData, sourceData, path = '') {
  let addedKeys = 0;

  for (const [key, value] of Object.entries(sourceData)) {
    const currentPath = path ? `${path}.${key}` : key;

    if (!(key in targetData)) {
      // 添加缺失的键，保持英语原文
      targetData[key] = value;
      console.log(`  ➕ 添加缺失键: ${currentPath}`);
      addedKeys++;
    } else if (typeof value === 'object' && value !== null && typeof targetData[key] === 'object') {
      addedKeys += syncMissingKeys(targetData[key], value, currentPath);
    }
  }

  return addedKeys;
}

function main() {
  console.log('🔄 同步缺失的翻译键...\n');

  const enData = loadTranslationFile('en');
  if (!enData) {
    console.error('错误: 无法加载英语基准文件');
    return;
  }

  const locales = ['es', 'de', 'fr', 'ja', 'ko'];
  let totalAdded = 0;

  for (const locale of locales) {
    console.log(`📝 同步语言: ${locale.toUpperCase()}`);

    const data = loadTranslationFile(locale);
    if (!data) continue;

    const addedKeys = syncMissingKeys(data, enData);
    totalAdded += addedKeys;

    if (addedKeys > 0) {
      saveTranslationFile(locale, data);
      console.log(`  ✅ 已添加 ${addedKeys} 个缺失键`);
    } else {
      console.log(`  ℹ️  所有键已存在，无需同步`);
    }
  }

  console.log(`\n🎉 同步完成！总计添加 ${totalAdded} 个缺失键`);
  console.log('\n现在可以运行 npm run i18n:check 验证一致性');
}

if (require.main === module) {
  main();
}

module.exports = { main, syncMissingKeys };