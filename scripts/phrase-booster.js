#!/usr/bin/env node
/* eslint-disable no-unused-vars */

import fs from 'fs';
import path from 'path';

// 专门增强目标短语使用的脚本
class PhraseBooster {
  constructor() {
    this.filesToProcess = [
      'public/locales/en/translation.json',
      'public/locales/es/translation.json',
      'public/locales/fr/translation.json',
      'public/locales/de/translation.json',
      'public/locales/it/translation.json',
      'public/locales/pt/translation.json',
      'public/locales/ru/translation.json',
      'public/locales/ja/translation.json',
      'public/locales/pl/translation.json',
      'public/locales/id/translation.json',
      'public/locales/vi/translation.json',
      'public/locales/fil/translation.json'
    ];
  }

  // 获取短语增强规则
  getPhraseBoostRules() {
    return {
      // 增强 "image to" - 目标排名2
      'convert': 'convert image to',
      'Convert': 'Convert image to',
      'transform': 'transform image to',
      'Transform': 'Transform image to',
      'turn': 'turn image to',
      'Turn': 'Turn image to',
      
      // 增强 "pixel size" - 目标排名3
      'size': 'pixel size',
      'Size': 'Pixel size',
      'dimensions': 'pixel size',
      'Dimensions': 'Pixel size',
      'resolution': 'pixel size',
      'Resolution': 'Pixel size',
      
      // 增强 "the image" - 目标排名4
      'your file': 'the image',
      'Your file': 'The image',
      'this file': 'the image',
      'This file': 'The image',
      'uploaded file': 'the image',
      'Uploaded file': 'The image',
      
      // 增强 "art image" - 目标排名5
      'art file': 'art image',
      'Art file': 'Art image',
      'art result': 'art image',
      'Art result': 'Art image',
      
      // 增强 "the palette" - 目标排名6
      'colors': 'the palette',
      'Colors': 'The palette',
      'color options': 'the palette',
      'Color options': 'The palette',
      
      // 增强 "the pixel" - 目标排名8
      'each block': 'the pixel',
      'Each block': 'The pixel',
      'individual pixel': 'the pixel',
      'Individual pixel': 'The pixel',
      
      // 增强三词短语 "pixel art image" - 目标排名1
      'pixel art result': 'pixel art image',
      'Pixel art result': 'Pixel art image',
      'pixel art output': 'pixel art image',
      'Pixel art output': 'Pixel art image',
      
      // 增强四词短语 "image to pixel art"
      'photo to pixel art': 'image to pixel art',
      'Photo to pixel art': 'Image to pixel art',
      'picture to pixel art': 'image to pixel art',
      'Picture to pixel art': 'Image to pixel art'
    };
  }

  // 进一步减少graphics的规则
  getGraphicsReductionRules() {
    return {
      'graphics': 'art',
      'Graphics': 'Art',
      'graphic': 'art',
      'Graphic': 'Art'
    };
  }

  // 处理单个文件
  processFile(filePath) {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  文件不存在: ${filePath}`);
      return { processed: false, changes: 0 };
    }

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let changes = 0;
      const originalContent = content;

      // 应用短语增强规则
      const boostRules = this.getPhraseBoostRules();
      Object.entries(boostRules).forEach(([oldText, newText]) => {
        // 使用更精确的替换，避免过度替换
        const regex = new RegExp(`"${oldText.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}"`, 'g');
        const matches = content.match(regex);
        if (matches) {
          content = content.replace(regex, `"${newText}"`);
          changes += matches.length;
        }
      });

      // 进一步减少graphics
      const graphicsRules = this.getGraphicsReductionRules();
      Object.entries(graphicsRules).forEach(([oldText, newText]) => {
        // 只在特定上下文中替换
        const regex = new RegExp(`"[^"]*\\\\b${oldText.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\\\b[^"]*"`, 'g');
        const matches = content.match(regex);
        if (matches) {
          matches.forEach(match => {
            const newMatch = match.replace(new RegExp(`\\\\b${oldText}\\\\b`, 'g'), newText);
            content = content.replace(match, newMatch);
            changes++;
          });
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

  // 主要增强方法
  boost() {
    console.log('🚀 开始短语密度增强优化...\n');
    console.log('📋 增强目标:');
    console.log('   - image to: 排名17 → 排名2');
    console.log('   - pixel size: 排名48 → 排名3');
    console.log('   - the image: 增加使用频率');
    console.log('   - art image: 增加使用频率');
    console.log('   - the palette: 增加使用频率');
    console.log('   - graphics: 进一步减少到0.03%\n');
    
    let totalChanges = 0;
    let processedFiles = 0;

    this.filesToProcess.forEach(filePath => {
      const result = this.processFile(filePath);
      if (result.processed) {
        console.log(`✅ ${filePath}: ${result.changes} 个短语已增强`);
        processedFiles++;
        totalChanges += result.changes;
      } else if (result.changes === 0) {
        console.log(`ℹ️  ${filePath}: 无需调整`);
      }
    });

    console.log(`\n📊 短语增强完成:`);
    console.log(`   处理的文件: ${processedFiles}/${this.filesToProcess.length}`);
    console.log(`   总增强次数: ${totalChanges}`);
    
    if (totalChanges > 0) {
      console.log(`\n💡 建议运行以下命令查看效果:`);
      console.log(`   npm run seo:phrases`);
    }
  }
}

// 如果直接运行此脚本
const booster = new PhraseBooster();
booster.boost();

export { PhraseBooster };
