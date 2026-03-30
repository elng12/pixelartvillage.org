#!/usr/bin/env node
// 详细的关键词频率分析工具
// 统计整个网站中单个关键词和短语的出现频率

import fs from 'node:fs'
import path from 'node:path'

const DIST = path.resolve('dist')
const PAGES = []

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const stat = fs.statSync(p)
    if (stat.isDirectory()) walk(p)
    else if (name === 'index.html') PAGES.push(p)
  }
}

if (!fs.existsSync(DIST)) {
  console.error('❌ dist/ not found. Run `npm run build` first.')
  process.exit(2)
}

walk(DIST)

// 提取纯文本内容
function getText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

// 统计单词频率
function analyzeKeywords() {
  let allText = ''
  let totalWords = 0
  
  console.log(`🔍 分析 ${PAGES.length} 个页面的关键词频率...\n`)
  
  // 收集所有文本
  for (const file of PAGES) {
    const html = fs.readFileSync(file, 'utf8')
    const text = getText(html)
    allText += ' ' + text
  }
  
  // 清理和分词
  const words = allText
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2) // 过滤掉太短的词
    .filter(word => !isStopWord(word)) // 过滤停用词
  
  totalWords = words.length
  
  // 统计单词频率
  const wordCount = {}
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1
  })
  
  // 统计重要短语
  const phrases = {
    // 核心关键词
    'pixel art': countPhrase(allText, 'pixel art'),
    'image': countPhrase(allText, 'image'),
    'photo': countPhrase(allText, 'photo'),
    'converter': countPhrase(allText, 'converter'),
    'maker': countPhrase(allText, 'maker'),
    'online': countPhrase(allText, 'online'),
    'free': countPhrase(allText, 'free'),
    'digital': countPhrase(allText, 'digital'),
    'art': countPhrase(allText, 'art'),
    'retro': countPhrase(allText, 'retro'),
    'sprite': countPhrase(allText, 'sprite'),
    'pixelate': countPhrase(allText, 'pixelate'),
    'generator': countPhrase(allText, 'generator'),
    'tool': countPhrase(allText, 'tool'),
    'browser': countPhrase(allText, 'browser'),
    'palette': countPhrase(allText, 'palette'),
    'png': countPhrase(allText, 'png'),
    'jpg': countPhrase(allText, 'jpg'),
    'jpeg': countPhrase(allText, 'jpeg'),
    'gif': countPhrase(allText, 'gif'),
    'webp': countPhrase(allText, 'webp'),
    'bmp': countPhrase(allText, 'bmp'),
    
    // 长尾关键词短语
    'image to pixel art': countPhrase(allText, 'image to pixel art'),
    'photo to pixel art': countPhrase(allText, 'photo to pixel art'),
    'pixel art maker': countPhrase(allText, 'pixel art maker'),
    'pixel art converter': countPhrase(allText, 'pixel art converter'),
    'photo to sprite converter': countPhrase(allText, 'photo to sprite converter'),
    'pixelate image online': countPhrase(allText, 'pixelate image online'),
    'turn photo into pixel art': countPhrase(allText, 'turn photo into pixel art'),
    '8-bit art generator': countPhrase(allText, '8-bit art generator'),
    'retro game graphics maker': countPhrase(allText, 'retro game graphics maker'),
    'png to pixel art': countPhrase(allText, 'png to pixel art'),
    'jpg to pixel art': countPhrase(allText, 'jpg to pixel art'),
    'image to digital art': countPhrase(allText, 'image to digital art'),
    'convert photos to digital art': countPhrase(allText, 'convert photos to digital art'),
    'online image converter': countPhrase(allText, 'online image converter'),
    'free pixel art maker': countPhrase(allText, 'free pixel art maker'),
    'browser based': countPhrase(allText, 'browser based'),
    'custom palette': countPhrase(allText, 'custom palette'),
    'palette controls': countPhrase(allText, 'palette controls'),
    'instant preview': countPhrase(allText, 'instant preview'),
    'clean export': countPhrase(allText, 'clean export'),
  }
  
  // 排序并显示结果
  console.log('📊 关键词频率分析结果')
  console.log('=' .repeat(50))
  console.log(`总页面数: ${PAGES.length}`)
  console.log(`总词数: ${totalWords.toLocaleString()}`)
  console.log(`独特词汇: ${Object.keys(wordCount).length.toLocaleString()}`)
  console.log('')
  
  // 显示短语频率
  console.log('🎯 重要短语频率:')
  console.log('-'.repeat(50))
  const sortedPhrases = Object.entries(phrases)
    .sort(([,a], [,b]) => b - a)
    .filter(([,count]) => count > 0)
  
  sortedPhrases.forEach(([phrase, count]) => {
    const density = ((count / totalWords) * 100).toFixed(3)
    console.log(`${phrase.padEnd(30)} ${count.toString().padStart(4)} 次  ${density}%`)
  })
  
  console.log('')
  
  // 显示高频单词
  console.log('🔤 高频单词 (Top 30):')
  console.log('-'.repeat(50))
  const sortedWords = Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 30)
  
  sortedWords.forEach(([word, count], index) => {
    const density = ((count / totalWords) * 100).toFixed(3)
    console.log(`${(index + 1).toString().padStart(2)}. ${word.padEnd(20)} ${count.toString().padStart(4)} 次  ${density}%`)
  })
  
  // SEO建议
  console.log('')
  console.log('💡 SEO 分析建议:')
  console.log('-'.repeat(50))
  
  const mainKeyword = sortedPhrases[0]
  if (mainKeyword) {
    console.log(`✅ 主要关键词: "${mainKeyword[0]}" (${mainKeyword[1]} 次, ${((mainKeyword[1] / totalWords) * 100).toFixed(2)}%)`)
  }
  
  // 检查关键词密度
  const pixelArtCount = phrases['pixel art']
  const pixelArtDensity = (pixelArtCount / totalWords) * 100
  
  if (pixelArtDensity < 1) {
    console.log(`⚠️  "pixel art" 密度较低 (${pixelArtDensity.toFixed(2)}%), 建议增加使用`)
  } else if (pixelArtDensity > 3) {
    console.log(`⚠️  "pixel art" 密度较高 (${pixelArtDensity.toFixed(2)}%), 注意避免过度优化`)
  } else {
    console.log(`✅ "pixel art" 密度适中 (${pixelArtDensity.toFixed(2)}%)`)
  }
  
  // 检查长尾关键词覆盖
  const longTailCount = sortedPhrases.filter(([phrase]) => phrase.includes(' ')).length
  console.log(`✅ 长尾关键词覆盖: ${longTailCount} 个短语`)
  
  // 检查格式支持覆盖
  const formats = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp']
  const formatCoverage = formats.filter(format => phrases[format] > 0)
  console.log(`✅ 图片格式覆盖: ${formatCoverage.join(', ')} (${formatCoverage.length}/${formats.length})`)
}

function countPhrase(text, phrase) {
  const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
  const matches = text.match(regex)
  return matches ? matches.length : 0
}

function isStopWord(word) {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'all', 'any', 'some', 'no', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'now', 'here', 'there', 'when', 'where', 'why', 'how', 'what', 'which', 'who', 'whom', 'whose', 'if', 'because', 'as', 'until', 'while', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once'
  ])
  return stopWords.has(word.toLowerCase())
}

analyzeKeywords()