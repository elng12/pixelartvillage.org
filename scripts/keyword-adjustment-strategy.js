#!/usr/bin/env node
// 关键词密度调整策略分析
// 分析当前密度并提供调整建议

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

// 目标关键词密度设置
const TARGET_DENSITIES = {
  'image': { target: 4.0, range: [3.8, 4.2], priority: 1 },
  'pixel': { target: 3.75, range: [3.5, 4.0], priority: 2 },
  'palette': { target: 3.25, range: [3.0, 3.5], priority: 3 },
  'art': { target: 2.25, range: [2.0, 2.5], priority: 4 },
  'palettes': { target: 1.4, range: [1.2, 1.6], priority: 5 }
}

function getText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function countKeyword(text, keyword) {
  const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
  const matches = text.match(regex)
  return matches ? matches.length : 0
}

function analyzeCurrentState() {
  let totalWords = 0
  let keywordCounts = {}
  
  // 初始化计数器
  Object.keys(TARGET_DENSITIES).forEach(keyword => {
    keywordCounts[keyword] = 0
  })
  
  // 分析所有页面
  PAGES.forEach(page => {
    const html = fs.readFileSync(page, 'utf8')
    const text = getText(html)
    const words = text.split(/\s+/).filter(Boolean)
    totalWords += words.length
    
    Object.keys(TARGET_DENSITIES).forEach(keyword => {
      keywordCounts[keyword] += countKeyword(text, keyword)
    })
  })
  
  console.log('🎯 关键词密度调整策略分析')
  console.log('=' .repeat(70))
  console.log(`总页面数: ${PAGES.length}`)
  console.log(`总词数: ${totalWords.toLocaleString()}`)
  console.log('')
  
  console.log('📊 当前状态 vs 目标密度:')
  console.log('-'.repeat(70))
  console.log('关键词'.padEnd(12) + '当前次数'.padStart(8) + '当前密度'.padStart(10) + '目标密度'.padStart(10) + '目标次数'.padStart(10) + '调整量'.padStart(8) + '状态'.padStart(8))
  console.log('-'.repeat(70))
  
  const adjustments = []
  
  Object.entries(TARGET_DENSITIES).forEach(([keyword, config]) => {
    const currentCount = keywordCounts[keyword]
    const currentDensity = (currentCount / totalWords) * 100
    const targetCount = Math.round((config.target / 100) * totalWords)
    const adjustment = targetCount - currentCount
    const status = currentDensity >= config.range[0] && currentDensity <= config.range[1] ? '✅' : 
                  currentDensity < config.range[0] ? '📈' : '📉'
    
    console.log(
      keyword.padEnd(12) +
      currentCount.toString().padStart(8) +
      `${currentDensity.toFixed(2)}%`.padStart(10) +
      `${config.target}%`.padStart(10) +
      targetCount.toString().padStart(10) +
      (adjustment > 0 ? `+${adjustment}` : adjustment.toString()).padStart(8) +
      status.padStart(8)
    )
    
    adjustments.push({
      keyword,
      currentCount,
      currentDensity,
      targetCount,
      adjustment,
      priority: config.priority,
      status: status === '✅' ? 'ok' : currentDensity < config.range[0] ? 'increase' : 'decrease'
    })
  })
  
  console.log('')
  
  // 调整策略建议
  console.log('🔧 调整策略建议:')
  console.log('-'.repeat(70))
  
  const needsIncrease = adjustments.filter(a => a.status === 'increase').sort((a, b) => a.priority - b.priority)
  const needsDecrease = adjustments.filter(a => a.status === 'decrease').sort((a, b) => a.priority - b.priority)
  const isOk = adjustments.filter(a => a.status === 'ok')
  
  if (needsIncrease.length > 0) {
    console.log('📈 需要增加的关键词:')
    needsIncrease.forEach(adj => {
      console.log(`   ${adj.keyword}: 需要增加 ${adj.adjustment} 次 (优先级 ${adj.priority})`)
    })
    console.log('')
  }
  
  if (needsDecrease.length > 0) {
    console.log('📉 需要减少的关键词:')
    needsDecrease.forEach(adj => {
      console.log(`   ${adj.keyword}: 需要减少 ${Math.abs(adj.adjustment)} 次 (优先级 ${adj.priority})`)
    })
    console.log('')
  }
  
  if (isOk.length > 0) {
    console.log('✅ 已达标的关键词:')
    isOk.forEach(adj => {
      console.log(`   ${adj.keyword}: 当前密度 ${adj.currentDensity.toFixed(2)}% (目标范围内)`)
    })
    console.log('')
  }
  
  // 具体调整建议
  console.log('💡 具体调整建议:')
  console.log('-'.repeat(70))
  
  if (needsDecrease.find(a => a.keyword === 'art')) {
    console.log('🎨 "art" 关键词调整策略:')
    console.log('   - 将部分 "pixel art" 替换为 "pixel graphics" 或 "pixel images"')
    console.log('   - 将部分 "art maker" 替换为 "image maker" 或 "graphics maker"')
    console.log('   - 在描述中使用 "visual", "graphic", "design" 等同义词')
    console.log('')
  }
  
  if (needsDecrease.find(a => a.keyword === 'palette')) {
    console.log('🎨 "palette" 关键词调整策略:')
    console.log('   - 将部分 "palette" 替换为 "color scheme", "colors", "color options"')
    console.log('   - 使用 "color controls", "color settings" 等变体')
    console.log('')
  }
  
  if (needsDecrease.find(a => a.keyword === 'pixel')) {
    console.log('🔲 "pixel" 关键词调整策略:')
    console.log('   - 适度使用 "pixelated", "retro", "8-bit" 等相关词汇')
    console.log('   - 在某些上下文中使用 "block", "grid" 等描述')
    console.log('')
  }
  
  if (needsIncrease.find(a => a.keyword === 'image')) {
    console.log('🖼️ "image" 关键词增加策略:')
    console.log('   - 在描述中更多使用 "image" 而不是 "photo" 或 "picture"')
    console.log('   - 添加 "image processing", "image conversion" 等短语')
    console.log('')
  }
  
  console.log('⚠️ 重要提醒:')
  console.log('   - 保持 "image to pixel art" 短语不变')
  console.log('   - 调整时确保内容自然性和可读性')
  console.log('   - 优先在多语言页面中进行调整以分散影响')
  console.log('   - 建议分批次调整，每次调整后重新分析')
}

analyzeCurrentState()