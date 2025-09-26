#!/usr/bin/env node
// SEO关键词分析报告
// 专门分析核心SEO关键词的分布和密度

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

// 核心SEO关键词定义
const SEO_KEYWORDS = {
  // 主要关键词
  primary: [
    'pixel art',
    'image to pixel art', 
    'photo to pixel art',
    'pixel art maker',
    'pixel art converter'
  ],
  
  // 次要关键词
  secondary: [
    'pixelate image',
    'photo to sprite',
    'retro graphics',
    '8-bit art',
    'digital art converter',
    'online image converter'
  ],
  
  // 长尾关键词
  longTail: [
    'convert image to pixel art',
    'turn photo into pixel art',
    'free pixel art maker online',
    'png to pixel art converter',
    'jpg to pixel art converter',
    'photo to sprite converter',
    'pixelate image online free',
    'retro game graphics maker',
    '8-bit art generator online',
    'browser based pixel art tool'
  ],
  
  // 单个核心词
  core: [
    'pixel', 'art', 'image', 'photo', 'converter', 'maker', 'online', 'free', 
    'retro', 'sprite', 'digital', 'tool', 'generator', 'browser', 'palette'
  ]
}

function getText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function countKeyword(text, keyword) {
  const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
  const matches = text.match(regex)
  return matches ? matches.length : 0
}

function analyzePageKeywords(filePath) {
  const html = fs.readFileSync(filePath, 'utf8')
  const text = getText(html)
  const words = text.split(/\s+/).filter(Boolean)
  
  const analysis = {
    path: filePath.replace(DIST, '').replace(/\\/g, '/'),
    wordCount: words.length,
    keywords: {}
  }
  
  // 分析所有关键词类别
  Object.entries(SEO_KEYWORDS).forEach(([category, keywords]) => {
    analysis.keywords[category] = {}
    keywords.forEach(keyword => {
      const count = countKeyword(text, keyword)
      if (count > 0) {
        analysis.keywords[category][keyword] = {
          count,
          density: ((count / words.length) * 100).toFixed(3)
        }
      }
    })
  })
  
  return analysis
}

function generateReport() {
  console.log('🎯 SEO关键词分析报告')
  console.log('=' .repeat(60))
  console.log(`分析页面数: ${PAGES.length}`)
  console.log('')
  
  let totalWords = 0
  let allKeywordCounts = {}
  const pageAnalyses = []
  
  // 初始化关键词计数器
  Object.values(SEO_KEYWORDS).flat().forEach(keyword => {
    allKeywordCounts[keyword] = 0
  })
  
  // 分析每个页面
  PAGES.forEach(page => {
    const analysis = analyzePageKeywords(page)
    pageAnalyses.push(analysis)
    totalWords += analysis.wordCount
    
    // 累计关键词计数
    Object.values(analysis.keywords).forEach(categoryKeywords => {
      Object.entries(categoryKeywords).forEach(([keyword, data]) => {
        allKeywordCounts[keyword] += data.count
      })
    })
  })
  
  console.log(`总词数: ${totalWords.toLocaleString()}`)
  console.log('')
  
  // 1. 主要关键词分析
  console.log('🏆 主要关键词表现:')
  console.log('-'.repeat(60))
  SEO_KEYWORDS.primary.forEach(keyword => {
    const count = allKeywordCounts[keyword] || 0
    const density = ((count / totalWords) * 100).toFixed(3)
    const status = count > 50 ? '🟢' : count > 20 ? '🟡' : '🔴'
    console.log(`${status} ${keyword.padEnd(25)} ${count.toString().padStart(4)} 次  ${density.padStart(6)}%`)
  })
  
  console.log('')
  
  // 2. 次要关键词分析
  console.log('🥈 次要关键词表现:')
  console.log('-'.repeat(60))
  SEO_KEYWORDS.secondary.forEach(keyword => {
    const count = allKeywordCounts[keyword] || 0
    const density = ((count / totalWords) * 100).toFixed(3)
    const status = count > 20 ? '🟢' : count > 5 ? '🟡' : '🔴'
    console.log(`${status} ${keyword.padEnd(25)} ${count.toString().padStart(4)} 次  ${density.padStart(6)}%`)
  })
  
  console.log('')
  
  // 3. 长尾关键词分析
  console.log('🎯 长尾关键词表现:')
  console.log('-'.repeat(60))
  SEO_KEYWORDS.longTail.forEach(keyword => {
    const count = allKeywordCounts[keyword] || 0
    const density = ((count / totalWords) * 100).toFixed(3)
    const status = count > 10 ? '🟢' : count > 2 ? '🟡' : '🔴'
    console.log(`${status} ${keyword.padEnd(35)} ${count.toString().padStart(3)} 次  ${density.padStart(6)}%`)
  })
  
  console.log('')
  
  // 4. 核心单词分析
  console.log('🔤 核心单词频率:')
  console.log('-'.repeat(60))
  const coreWordsSorted = SEO_KEYWORDS.core
    .map(word => ({
      word,
      count: allKeywordCounts[word] || 0,
      density: (((allKeywordCounts[word] || 0) / totalWords) * 100).toFixed(3)
    }))
    .sort((a, b) => b.count - a.count)
  
  coreWordsSorted.forEach(({word, count, density}) => {
    const status = count > 200 ? '🟢' : count > 50 ? '🟡' : '🔴'
    console.log(`${status} ${word.padEnd(15)} ${count.toString().padStart(4)} 次  ${density.padStart(6)}%`)
  })
  
  console.log('')
  
  // 5. 页面类型分析
  console.log('📄 页面类型关键词分布:')
  console.log('-'.repeat(60))
  
  const pageTypes = {
    '首页': pageAnalyses.filter(p => p.path.match(/^\/[a-z]{2,3}\/$/)),
    '转换器页面': pageAnalyses.filter(p => p.path.includes('/converter/')),
    '博客页面': pageAnalyses.filter(p => p.path.includes('/blog/')),
    '政策页面': pageAnalyses.filter(p => p.path.includes('/privacy/') || p.path.includes('/terms/')),
    '其他页面': pageAnalyses.filter(p => !p.path.includes('/converter/') && !p.path.includes('/blog/') && !p.path.includes('/privacy/') && !p.path.includes('/terms/') && !p.path.match(/^\/[a-z]{2,3}\/$/))
  }
  
  Object.entries(pageTypes).forEach(([type, pages]) => {
    if (pages.length === 0) return
    
    const totalWordsInType = pages.reduce((sum, p) => sum + p.wordCount, 0)
    const pixelArtCount = pages.reduce((sum, p) => {
      return sum + (p.keywords.primary?.['pixel art']?.count || 0)
    }, 0)
    const density = ((pixelArtCount / totalWordsInType) * 100).toFixed(3)
    
    console.log(`${type.padEnd(12)} ${pages.length.toString().padStart(3)} 页  "pixel art": ${pixelArtCount.toString().padStart(3)} 次  ${density}%`)
  })
  
  console.log('')
  
  // 6. SEO建议
  console.log('💡 SEO优化建议:')
  console.log('-'.repeat(60))
  
  const pixelArtTotal = allKeywordCounts['pixel art'] || 0
  const pixelArtDensity = (pixelArtTotal / totalWords) * 100
  
  if (pixelArtDensity < 1) {
    console.log('⚠️  主关键词"pixel art"密度偏低，建议增加使用')
  } else if (pixelArtDensity > 5) {
    console.log('⚠️  主关键词"pixel art"密度过高，注意自然性')
  } else {
    console.log('✅ 主关键词"pixel art"密度适中')
  }
  
  const imageToPixelArt = allKeywordCounts['image to pixel art'] || 0
  if (imageToPixelArt < 100) {
    console.log('⚠️  核心短语"image to pixel art"使用不足，建议增加')
  } else {
    console.log('✅ 核心短语"image to pixel art"使用充分')
  }
  
  const longTailCoverage = SEO_KEYWORDS.longTail.filter(kw => (allKeywordCounts[kw] || 0) > 0).length
  const longTailPercentage = (longTailCoverage / SEO_KEYWORDS.longTail.length * 100).toFixed(1)
  console.log(`📊 长尾关键词覆盖率: ${longTailCoverage}/${SEO_KEYWORDS.longTail.length} (${longTailPercentage}%)`)
  
  if (longTailPercentage < 50) {
    console.log('⚠️  长尾关键词覆盖不足，建议增加相关内容')
  } else {
    console.log('✅ 长尾关键词覆盖良好')
  }
}

generateReport()