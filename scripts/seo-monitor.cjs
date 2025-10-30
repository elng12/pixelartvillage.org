#!/usr/bin/env node
/**
 * SEO监控脚本 - 记录关键指标变化
 * 
 * 用法：node scripts/seo-monitor.cjs
 * 
 * 功能：
 * 1. 检查网站可访问性
 * 2. 验证关键meta标签
 * 3. 检查Schema标记
 * 4. 记录到日志文件供趋势分析
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://pixelartvillage.org';
const LOG_FILE = path.join(__dirname, '../data/seo-metrics.csv');

// 目标关键词列表
const TARGET_KEYWORDS = [
  'image to pixel art',
  'pixel art converter',
  'png to pixel art',
  'jpg to pixel art',
  'free pixel art converter',
  'online pixel art maker',
  '8-bit art generator',
  'photo to pixel art'
];

// 检查页面的函数
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`Status ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

// 提取meta标签内容
function extractMeta(html, name) {
  const patterns = [
    new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]*)"`, 'i'),
    new RegExp(`<meta\\s+content="([^"]*)"\\s+name="${name}"`, 'i'),
    new RegExp(`<meta\\s+property="${name}"\\s+content="([^"]*)"`, 'i')
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// 提取title
function extractTitle(html) {
  const match = html.match(/<title>([^<]*)<\/title>/i);
  return match ? match[1] : null;
}

// 检查关键词密度
function calculateKeywordDensity(html, keyword) {
  const text = html.replace(/<[^>]*>/g, ' ').toLowerCase();
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const keywordWords = keyword.toLowerCase().split(/\s+/);
  
  let count = 0;
  for (let i = 0; i <= words.length - keywordWords.length; i++) {
    const phrase = words.slice(i, i + keywordWords.length).join(' ');
    if (phrase === keyword.toLowerCase()) {
      count++;
    }
  }
  
  return {
    count,
    density: words.length > 0 ? ((count / words.length) * 100).toFixed(3) : 0,
    totalWords: words.length
  };
}

// 检查Schema标记
function checkSchema(html) {
  const schemas = [];
  const schemaPattern = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  
  while ((match = schemaPattern.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      schemas.push(data['@type'] || 'Unknown');
    } catch (e) {
      schemas.push('Invalid');
    }
  }
  
  return schemas;
}

// 主监控函数
async function monitorSEO() {
  console.log('🔍 开始SEO监控...\n');
  
  const timestamp = new Date().toISOString();
  const results = {
    timestamp,
    url: SITE_URL,
    status: 'unknown',
    title: null,
    description: null,
    schemas: [],
    keywords: []
  };
  
  try {
    // 1. 获取首页HTML
    console.log('📥 正在获取首页...');
    const html = await fetchPage(SITE_URL);
    results.status = 'success';
    
    // 2. 提取meta信息
    console.log('📋 提取meta标签...');
    results.title = extractTitle(html);
    results.description = extractMeta(html, 'description');
    const ogTitle = extractMeta(html, 'og:title');
    const ogDescription = extractMeta(html, 'og:description');
    
    console.log(`✅ Title: ${results.title}`);
    console.log(`✅ Description: ${results.description?.substring(0, 60)}...`);
    console.log(`✅ OG Title: ${ogTitle}`);
    
    // 3. 检查Schema
    console.log('\n📊 检查Schema标记...');
    results.schemas = checkSchema(html);
    console.log(`✅ 发现 ${results.schemas.length} 个Schema: ${results.schemas.join(', ')}`);
    
    // 4. 关键词分析
    console.log('\n🔑 关键词分析:');
    console.log('─'.repeat(70));
    console.log('关键词'.padEnd(30) + '出现次数'.padEnd(15) + '密度');
    console.log('─'.repeat(70));
    
    for (const keyword of TARGET_KEYWORDS.slice(0, 5)) { // 只检查前5个
      const density = calculateKeywordDensity(html, keyword);
      results.keywords.push({
        keyword,
        ...density
      });
      
      const warning = density.density > 3 ? ' ⚠️ 过高' : density.density < 0.5 ? ' ⚠️ 过低' : ' ✅';
      console.log(
        keyword.padEnd(30) +
        density.count.toString().padEnd(15) +
        `${density.density}%${warning}`
      );
    }
    
    // 5. 检查关键元素
    console.log('\n🔍 关键元素检查:');
    const checks = [
      { name: 'Title包含核心关键词', pass: results.title?.toLowerCase().includes('image to pixel art') },
      { name: 'Title长度适中', pass: results.title?.length > 30 && results.title?.length < 60 },
      { name: 'Description长度适中', pass: results.description?.length > 120 && results.description?.length < 160 },
      { name: 'HowTo Schema存在', pass: results.schemas.includes('HowTo') },
      { name: 'FAQ Schema存在', pass: results.schemas.includes('FAQPage') },
      { name: 'SoftwareApplication Schema存在', pass: results.schemas.includes('SoftwareApplication') }
    ];
    
    checks.forEach(check => {
      console.log(`${check.pass ? '✅' : '❌'} ${check.name}`);
    });
    
    // 6. 记录到CSV
    if (!fs.existsSync(path.dirname(LOG_FILE))) {
      fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
    }
    
    const csvExists = fs.existsSync(LOG_FILE);
    const csvLine = [
      timestamp,
      results.status,
      results.title ? `"${results.title.replace(/"/g, '""')}"` : '',
      results.description ? results.description.length : 0,
      results.schemas.length,
      results.keywords[0]?.count || 0,
      results.keywords[0]?.density || 0
    ].join(',');
    
    if (!csvExists) {
      fs.writeFileSync(LOG_FILE, 'timestamp,status,title,desc_length,schema_count,main_keyword_count,main_keyword_density\n');
    }
    fs.appendFileSync(LOG_FILE, csvLine + '\n');
    
    console.log(`\n💾 监控结果已保存到: ${LOG_FILE}`);
    
  } catch (error) {
    console.error('❌ 监控失败:', error.message);
    results.status = 'error';
    
    // 记录错误
    const csvLine = [timestamp, 'error', '', '', '', '', ''].join(',');
    fs.appendFileSync(LOG_FILE, csvLine + '\n');
  }
  
  // 7. 生成建议
  console.log('\n💡 建议:');
  if (results.keywords[0]?.density > 3) {
    console.log('⚠️  核心关键词密度过高，可能被视为过度优化');
  } else if (results.keywords[0]?.density < 0.5) {
    console.log('⚠️  核心关键词密度过低，建议自然增加使用频率');
  }
  
  if (!results.schemas.includes('HowTo')) {
    console.log('💡 建议添加HowTo Schema以获得Rich Snippet');
  }
  
  if (results.description && results.description.length < 120) {
    console.log('💡 Meta description过短，建议扩展至120-160字符');
  }
  
  console.log('\n✨ 监控完成！');
}

// 执行监控
if (require.main === module) {
  monitorSEO().catch(console.error);
}

module.exports = { monitorSEO };

