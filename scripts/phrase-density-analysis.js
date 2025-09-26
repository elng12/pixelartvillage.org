#!/usr/bin/env node
/* eslint-disable no-unused-vars */

import fs from 'fs';
import path from 'path';

// 分析短语密度的脚本
function analyzePhraseDensity() {
  console.log('🔍 分析短语密度排名...\n');
  
  // 读取所有文件内容
  const files = [
    'index.html',
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

  let allText = '';
  let totalWords = 0;

  files.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      allText += ' ' + content;
    }
  });

  // 清理文本，提取纯文本内容
  const cleanText = allText
    .replace(/<[^>]*>/g, ' ')  // 移除HTML标签
    .replace(/[{}[\]",:]/g, ' ')  // 移除JSON符号
    .replace(/\s+/g, ' ')  // 合并多个空格
    .toLowerCase()
    .trim();

  const words = cleanText.split(/\s+/).filter(word => 
    word.length > 0 && 
    /^[a-z]+$/.test(word)  // 只保留纯字母单词
  );

  totalWords = words.length;
  console.log(`📊 总词数: ${totalWords}\n`);

  // 分析双词短语
  const twoWordPhrases = {};
  for (let i = 0; i < words.length - 1; i++) {
    const phrase = `${words[i]} ${words[i + 1]}`;
    twoWordPhrases[phrase] = (twoWordPhrases[phrase] || 0) + 1;
  }

  // 分析三词短语
  const threeWordPhrases = {};
  for (let i = 0; i < words.length - 2; i++) {
    const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
    threeWordPhrases[phrase] = (threeWordPhrases[phrase] || 0) + 1;
  }

  // 分析四词短语
  const fourWordPhrases = {};
  for (let i = 0; i < words.length - 3; i++) {
    const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]} ${words[i + 3]}`;
    fourWordPhrases[phrase] = (fourWordPhrases[phrase] || 0) + 1;
  }

  // 分析单词频率
  const singleWords = {};
  words.forEach(word => {
    singleWords[word] = (singleWords[word] || 0) + 1;
  });

  // 目标短语
  const targetTwoWord = [
    'pixel art', 'image to', 'pixel size', 'the image', 
    'art image', 'the palette', 'to pixel', 'the pixel'
  ];
  
  const targetThreeWord = [
    'pixel art image', 'to pixel art', 'image to pixel'
  ];
  
  const targetFourWord = [
    'image to pixel art'
  ];

  // 输出当前状态
  console.log('🎯 **当前双词短语密度排名**');
  console.log('----------------------------------------------------------------------');
  
  // 获取所有双词短语并排序
  const sortedTwoWord = Object.entries(twoWordPhrases)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50);  // 取前50个

  targetTwoWord.forEach((phrase, index) => {
    const count = twoWordPhrases[phrase] || 0;
    const density = ((count / totalWords) * 100).toFixed(3);
    const currentRank = sortedTwoWord.findIndex(([p]) => p === phrase) + 1;
    const targetRank = index + 1;
    const status = currentRank === targetRank ? '✅' : 
                  currentRank < targetRank ? '📈' : '📉';
    
    console.log(`${targetRank}. ${phrase.padEnd(15)} | 当前排名: ${currentRank || 'N/A'} | 次数: ${count} | 密度: ${density}% | ${status}`);
  });

  console.log('\n🎯 **当前三词短语密度排名**');
  console.log('----------------------------------------------------------------------');
  
  const sortedThreeWord = Object.entries(threeWordPhrases)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30);

  targetThreeWord.forEach((phrase, index) => {
    const count = threeWordPhrases[phrase] || 0;
    const density = ((count / totalWords) * 100).toFixed(3);
    const currentRank = sortedThreeWord.findIndex(([p]) => p === phrase) + 1;
    const targetRank = index + 1;
    const status = currentRank === targetRank ? '✅' : 
                  currentRank < targetRank ? '📈' : '📉';
    
    console.log(`${targetRank}. ${phrase.padEnd(20)} | 当前排名: ${currentRank || 'N/A'} | 次数: ${count} | 密度: ${density}% | ${status}`);
  });

  console.log('\n🎯 **当前四词短语密度排名**');
  console.log('----------------------------------------------------------------------');
  
  const sortedFourWord = Object.entries(fourWordPhrases)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  targetFourWord.forEach((phrase, index) => {
    const count = fourWordPhrases[phrase] || 0;
    const density = ((count / totalWords) * 100).toFixed(3);
    const currentRank = sortedFourWord.findIndex(([p]) => p === phrase) + 1;
    const targetRank = index + 1;
    const status = currentRank === targetRank ? '✅' : 
                  currentRank < targetRank ? '📈' : '📉';
    
    console.log(`${targetRank}. ${phrase.padEnd(25)} | 当前排名: ${currentRank || 'N/A'} | 次数: ${count} | 密度: ${density}% | ${status}`);
  });

  // 检查graphics密度
  const graphicsCount = singleWords['graphics'] || 0;
  const graphicsDensity = ((graphicsCount / totalWords) * 100).toFixed(3);
  
  console.log('\n📊 **关键单词密度检查**');
  console.log('----------------------------------------------------------------------');
  console.log(`graphics: ${graphicsCount} 次 | 当前密度: ${graphicsDensity}% | 目标密度: 0.03% | ${graphicsDensity <= 0.03 ? '✅' : '📉 需要减少'}`);

  // 显示当前排名前10的双词短语
  console.log('\n📈 **当前双词短语排名前10**');
  console.log('----------------------------------------------------------------------');
  sortedTwoWord.slice(0, 10).forEach(([phrase, count], index) => {
    const density = ((count / totalWords) * 100).toFixed(3);
    console.log(`${index + 1}. ${phrase.padEnd(20)} | ${count} 次 | ${density}%`);
  });

  return {
    totalWords,
    twoWordPhrases,
    threeWordPhrases,
    fourWordPhrases,
    singleWords,
    sortedTwoWord,
    sortedThreeWord,
    sortedFourWord
  };
}

// 如果直接运行此脚本
analyzePhraseDensity();

export { analyzePhraseDensity };
