#!/usr/bin/env node

/**
 * 分析翻译缺口和质量瓶颈
 */

const fs = require('fs');
const path = require('path');

function analyzeTranslationGaps() {
  const en = JSON.parse(fs.readFileSync('public/locales/en/translation.json', 'utf8'));
  const coreLocales = ['es', 'de', 'fr', 'ja', 'ko'];

  console.log('=== 翻译缺口分析 ===\n');

  // 分析各部分翻译质量
  const sections = ['home', 'tool', 'features', 'footer', 'nav', 'common', 'blog', 'consent'];

  sections.forEach(section => {
    if (en[section]) {
      console.log(`📁 ${section.toUpperCase()} 部分:`);

      coreLocales.forEach(locale => {
        const file = `public/locales/${locale}/translation.json`;
        if (fs.existsSync(file)) {
          const data = JSON.parse(fs.readFileSync(file, 'utf8'));
          const sectionData = data[section];

          if (sectionData && typeof sectionData === 'object') {
            const enKeys = Object.keys(en[section]).filter(k => typeof en[section][k] === 'string');
            const translatedKeys = Object.keys(sectionData).filter(k =>
              typeof sectionData[k] === 'string' && sectionData[k] !== en[section][k]
            );
            const translationRate = (translatedKeys.length / enKeys.length * 100).toFixed(1);

            const emoji = translationRate >= 90 ? '🟢' : translationRate >= 70 ? '🟡' : '🔴';
            console.log(`  ${emoji} ${locale.toUpperCase()}: ${translationRate}% (${translatedKeys.length}/${enKeys.length})`);
          } else {
            console.log(`  🔴 ${locale.toUpperCase()}: 缺失`);
          }
        }
      });
      console.log('');
    }
  });

  // 识别最需要改进的部分
  console.log('=== 重点改进领域 ===');
  console.log('1. 🎯 工具核心功能 (tool) - 用户交互关键');
  console.log('2. 🏠 首页SEO内容 (home) - 搜索引擎优化');
  console.log('3. ✨ 功能特性说明 (features) - 产品价值传达');
  console.log('4. 📝 博客内容 (blog) - 内容营销重要');
  console.log('5. 🔧 常用操作 (common) - 用户体验基础');
}

if (require.main === module) {
  analyzeTranslationGaps();
}

module.exports = { analyzeTranslationGaps };