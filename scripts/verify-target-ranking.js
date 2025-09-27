#!/usr/bin/env node

import fs from 'fs';

// 验证目标排名的脚本
class TargetRankingVerifier {
  constructor() {
    this.targetSingleWords = ['image', 'pixel', 'palette', 'art', 'palettes'];
    this.targetTwoWords = ['pixel art', 'image to', 'pixel size', 'the image', 'art image', 'the palette', 'to pixel'];
    this.targetThreeWords = ['pixel art village', 'to pixel art', 'image to pixel', 'with custom palette', 'pixel art with', 'to digital art', 'digital art converter'];
  }

  // 分析HTML文件内容
  analyzeContent() {
    const htmlContent = fs.readFileSync('index.html', 'utf8');
    console.log(`📝 HTML文件大小: ${htmlContent.length} 字符`);
    
    // 提取文本内容，移除HTML标签，但保留所有文本内容（包括隐藏内容）
    let textContent = htmlContent
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    
    // 移除HTML标签但保留内容
    textContent = textContent.replace(/<[^>]*>/g, ' ');
    
    // 清理特殊字符
    textContent = textContent
      .replace(/&[^;]+;/g, ' ')  // 移除HTML实体
      .replace(/—/g, ' ')  // 移除特殊字符
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .trim();
    
    console.log(`📝 提取的文本内容长度: ${textContent.length} 字符`);
    console.log(`📝 文本内容前200字符: ${textContent.substring(0, 200)}...`);
    
    // 检查是否包含我们添加的关键词
    const imageCount = (textContent.match(/\bimage\b/g) || []).length;
    const pixelCount = (textContent.match(/\bpixel\b/g) || []).length;
    console.log(`📝 直接计数 - image: ${imageCount}, pixel: ${pixelCount}`);

    const words = textContent.split(/\s+/).filter(word => 
      word.length > 0 && /^[a-z0-9]+$/.test(word)
    );
    
    console.log(`📝 过滤后的词汇数量: ${words.length}`);
    console.log(`📝 前20个词汇: ${words.slice(0, 20).join(', ')}`);

    const totalWords = words.length;
    console.log(`📊 HTML文件总词数: ${totalWords}\n`);

    // 分析单词频率
    const singleWordCounts = {};
    words.forEach(word => {
      singleWordCounts[word] = (singleWordCounts[word] || 0) + 1;
    });

    // 分析双词短语
    const twoWordCounts = {};
    for (let i = 0; i < words.length - 1; i++) {
      const phrase = `${words[i]} ${words[i + 1]}`;
      twoWordCounts[phrase] = (twoWordCounts[phrase] || 0) + 1;
    }

    // 分析三词短语
    const threeWordCounts = {};
    for (let i = 0; i < words.length - 2; i++) {
      const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      threeWordCounts[phrase] = (threeWordCounts[phrase] || 0) + 1;
    }

    return {
      totalWords,
      singleWordCounts,
      twoWordCounts,
      threeWordCounts
    };
  }

  // 验证排名
  verifyRanking() {
    const analysis = this.analyzeContent();
    
    console.log('🎯 **单个关键词密度验证**');
    console.log('目标排序: image > pixel > palette > art > palettes');
    console.log('----------------------------------------------------------------------');
    
    this.targetSingleWords.forEach((word, index) => {
      const count = analysis.singleWordCounts[word] || 0;
      const density = ((count / analysis.totalWords) * 100).toFixed(2);
      console.log(`${index + 1}. ${word.padEnd(10)} | ${count} 次 | ${density}%`);
    });

    console.log('\n🎯 **双词短语密度验证**');
    console.log('目标排序: pixel art > image to > pixel size > the image > art image > the palette > to pixel');
    console.log('----------------------------------------------------------------------');
    
    this.targetTwoWords.forEach((phrase, index) => {
      const count = analysis.twoWordCounts[phrase] || 0;
      const density = ((count / analysis.totalWords) * 100).toFixed(2);
      console.log(`${index + 1}. ${phrase.padEnd(15)} | ${count} 次 | ${density}%`);
    });

    console.log('\n🎯 **三词短语密度验证**');
    console.log('目标排序: pixel art village > to pixel art > image to pixel > with custom palette > pixel art with > to digital art > digital art converter');
    console.log('----------------------------------------------------------------------');
    
    this.targetThreeWords.forEach((phrase, index) => {
      const count = analysis.threeWordCounts[phrase] || 0;
      const density = ((count / analysis.totalWords) * 100).toFixed(2);
      console.log(`${index + 1}. ${phrase.padEnd(20)} | ${count} 次 | ${density}%`);
    });

    // 显示实际排名
    console.log('\n📈 **实际双词短语排名 (前10)**');
    console.log('----------------------------------------------------------------------');
    const sortedTwoWords = Object.entries(analysis.twoWordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    sortedTwoWords.forEach(([phrase, count], index) => {
      const density = ((count / analysis.totalWords) * 100).toFixed(2);
      console.log(`${index + 1}. ${phrase.padEnd(20)} | ${count} 次 | ${density}%`);
    });

    console.log('\n📈 **实际三词短语排名 (前10)**');
    console.log('----------------------------------------------------------------------');
    const sortedThreeWords = Object.entries(analysis.threeWordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    sortedThreeWords.forEach(([phrase, count], index) => {
      const density = ((count / analysis.totalWords) * 100).toFixed(2);
      console.log(`${index + 1}. ${phrase.padEnd(25)} | ${count} 次 | ${density}%`);
    });
  }
}

// 如果直接运行此脚本
const verifier = new TargetRankingVerifier();
verifier.verifyRanking();

export { TargetRankingVerifier };
