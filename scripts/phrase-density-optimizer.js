#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// 精确的短语密度优化脚本
class PhraseDensityOptimizer {
  constructor() {
    this.targetTwoWord = [
      'pixel art',      // 目标排名1
      'image to',       // 目标排名2  
      'pixel size',     // 目标排名3
      'the image',      // 目标排名4
      'art image',      // 目标排名5
      'the palette',    // 目标排名6
      'to pixel',       // 目标排名7
      'the pixel'       // 目标排名8
    ];
    
    this.targetThreeWord = [
      'pixel art image',    // 目标排名1
      'to pixel art',       // 目标排名2
      'image to pixel'      // 目标排名3
    ];
    
    this.targetFourWord = [
      'image to pixel art'  // 目标排名1
    ];

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
      'public/locales/fil/translation.json',
      'src/content/blog-posts.json'
    ];
  }

  // 大幅减少graphics使用的替换规则
  getGraphicsReductionRules() {
    return {
      // 英语替换 - 将graphics替换为其他词
      'pixel graphics': 'pixel art',
      'Pixel Graphics': 'Pixel Art',
      'graphics maker': 'art maker',
      'Graphics Maker': 'Art Maker',
      'graphics generator': 'art generator',
      'Graphics Generator': 'Art Generator',
      'graphics converter': 'art converter',
      'Graphics Converter': 'Art Converter',
      'graphics creation': 'art creation',
      'Graphics Creation': 'Art Creation',
      'graphics editor': 'art editor',
      'Graphics Editor': 'Art Editor',
      'graphics style': 'art style',
      'Graphics Style': 'Art Style',
      'retro graphics': 'retro art',
      'Retro Graphics': 'Retro Art',
      '8-bit graphics': '8-bit art',
      '8-Bit Graphics': '8-Bit Art',
      'game graphics': 'game art',
      'Game Graphics': 'Game Art',
      'digital graphics': 'digital art',
      'Digital Graphics': 'Digital Art',
      'image graphics': 'image art',
      'Image Graphics': 'Image Art',
      
      // 西班牙语替换
      'gráficos píxel': 'arte píxel',
      'Gráficos Píxel': 'Arte Píxel',
      'gráficos digitales': 'arte digital',
      'Gráficos Digitales': 'Arte Digital',
      
      // 法语替换
      'graphiques pixel': 'art pixel',
      'Graphiques Pixel': 'Art Pixel',
      'graphiques numériques': 'art numérique',
      'Graphiques Numériques': 'Art Numérique',
      
      // 波兰语替换
      'piksel grafiki': 'piksel artu',
      'Piksel Grafiki': 'Piksel Artu',
      'piksel grafika': 'piksel art',
      'Piksel Grafika': 'Piksel Art'
    };
  }

  // 增强目标短语的替换规则
  getPhraseEnhancementRules() {
    return {
      // 增强 "image to" 短语
      'photo to': 'image to',
      'Photo to': 'Image to',
      'picture to': 'image to',
      'Picture to': 'Image to',
      
      // 增强 "pixel size" 短语
      'pixel dimensions': 'pixel size',
      'Pixel Dimensions': 'Pixel Size',
      'pixel resolution': 'pixel size',
      'Pixel Resolution': 'Pixel Size',
      
      // 增强 "the image" 短语
      'your photo': 'the image',
      'Your photo': 'The image',
      'this photo': 'the image',
      'This photo': 'The image',
      'your picture': 'the image',
      'Your picture': 'The image',
      
      // 增强 "art image" 短语
      'art photo': 'art image',
      'Art photo': 'Art image',
      'art picture': 'art image',
      'Art picture': 'Art image',
      
      // 增强 "the palette" 短语
      'color scheme': 'the palette',
      'Color scheme': 'The palette',
      'color set': 'the palette',
      'Color set': 'The palette',
      
      // 增强 "the pixel" 短语
      'each pixel': 'the pixel',
      'Each pixel': 'The pixel',
      'every pixel': 'the pixel',
      'Every pixel': 'The pixel'
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

      // 应用graphics减少规则
      const graphicsRules = this.getGraphicsReductionRules();
      Object.entries(graphicsRules).forEach(([oldText, newText]) => {
        const regex = new RegExp(oldText.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g');
        const matches = content.match(regex);
        if (matches) {
          content = content.replace(regex, newText);
          changes += matches.length;
        }
      });

      // 应用短语增强规则
      const enhancementRules = this.getPhraseEnhancementRules();
      Object.entries(enhancementRules).forEach(([oldText, newText]) => {
        const regex = new RegExp(`\\\\b${oldText.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\\\b`, 'g');
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

  // 主要优化方法
  optimize() {
    console.log('🎯 开始精确短语密度优化...\n');
    console.log('📋 优化目标:');
    console.log('   - graphics密度: 2.902% → 0.03%');
    console.log('   - 双词短语排名优化');
    console.log('   - 三词短语排名优化');
    console.log('   - 四词短语排名优化\n');
    
    let totalChanges = 0;
    let processedFiles = 0;

    this.filesToProcess.forEach(filePath => {
      const result = this.processFile(filePath);
      if (result.processed) {
        console.log(`✅ ${filePath}: ${result.changes} 个短语已优化`);
        processedFiles++;
        totalChanges += result.changes;
      } else if (result.changes === 0) {
        console.log(`ℹ️  ${filePath}: 无需调整`);
      }
    });

    console.log(`\n📊 短语密度优化完成:`);
    console.log(`   处理的文件: ${processedFiles}/${this.filesToProcess.length}`);
    console.log(`   总优化次数: ${totalChanges}`);
    
    if (totalChanges > 0) {
      console.log(`\n💡 建议运行以下命令查看效果:`);
      console.log(`   npm run seo:phrases`);
    }
  }
}

// 如果直接运行此脚本
const optimizer = new PhraseDensityOptimizer();
optimizer.optimize();

export { PhraseDensityOptimizer };