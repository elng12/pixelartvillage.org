#!/usr/bin/env node

/**
 * 关键词密度分析工具 - 分析页面SEO关键词优化情况
 * 运行命令: node scripts/keyword-analyzer.js
 */

import fs from 'fs';
import path from 'path';
import https from 'https';

// 目标关键词列表
const TARGET_KEYWORDS = [
  'pixel art',
  'pixel art converter',
  'image to pixel art',
  'pixel art generator',
  'free pixel art',
  'pixel art maker',
  'sprite generator',
  '8-bit art',
  'retro graphics',
  'pixel graphics',
  'online pixel art',
  'pixel art tool',
  'pixel art software',
  'png to pixel art',
  'jpg to pixel art',
  'photo to pixel art'
];

// 竞争关键词列表
const COMPETITIVE_KEYWORDS = [
  'pixel art studio',
  'piskel',
  'aseprite',
  'lospec',
  'pixel art online',
  'pixel art editor',
  'pixel art creator'
];

function fetchPageContent(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function analyzeKeywords(content, keywords, label) {
  const contentLower = content.toLowerCase();
  const results = [];

  for (const keyword of keywords) {
    const keywordLower = keyword.toLowerCase();

    // 计算关键词出现次数
    const regex = new RegExp(keywordLower.replace(/\s+/g, '\\s+'), 'gi');
    const matches = contentLower.match(regex);
    const count = matches ? matches.length : 0;

    // 计算关键词密度 (假设平均每个词5个字符)
    const density = ((count * keyword.length) / content.length) * 100;

    // 检查位置 (title, h1, h2, meta description等)
    const positions = [];

    // 检查title标签
    const titleMatch = content.match(/<title[^>]*>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1].toLowerCase().includes(keywordLower)) {
      positions.push('title');
    }

    // 检查h1标签
    const h1Matches = content.match(/<h1[^>]*>(.*?)<\/h1>/gi);
    if (h1Matches) {
      h1Matches.forEach(h1 => {
        if (h1.toLowerCase().includes(keywordLower)) {
          positions.push('h1');
        }
      });
    }

    // 检查h2标签
    const h2Matches = content.match(/<h2[^>]*>(.*?)<\/h2>/gi);
    if (h2Matches) {
      h2Matches.forEach(h2 => {
        if (h2.toLowerCase().includes(keywordLower)) {
          positions.push('h2');
        }
      });
    }

    // 检查meta description
    const descMatch = content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*?)["'][^>]*>/i);
    if (descMatch && descMatch[1].toLowerCase().includes(keywordLower)) {
      positions.push('meta-description');
    }

    results.push({
      keyword,
      count,
      density: density.toFixed(2),
      positions,
      importance: getKeywordImportance(keyword)
    });
  }

  return {
    label,
    results: results.sort((a, b) => b.importance - a.importance)
  };
}

function getKeywordImportance(keyword) {
  // 主要关键词权重更高
  const primaryKeywords = ['pixel art', 'pixel art converter', 'image to pixel art'];
  if (primaryKeywords.includes(keyword)) return 10;

  // 次要关键词
  const secondaryKeywords = ['pixel art generator', 'free pixel art', 'pixel art maker'];
  if (secondaryKeywords.includes(keyword)) return 8;

  // 工具相关关键词
  const toolKeywords = ['sprite generator', '8-bit art', 'retro graphics'];
  if (toolKeywords.includes(keyword)) return 7;

  // 格式转换关键词
  const formatKeywords = ['png to pixel art', 'jpg to pixel art', 'photo to pixel art'];
  if (formatKeywords.includes(keyword)) return 6;

  return 5;
}

function generateOptimizationSuggestions(analysis) {
  const suggestions = [];

  // 检查主要关键词密度
  const primaryKeyword = analysis.results.find(r => r.keyword === 'pixel art');
  if (primaryKeyword) {
    if (parseFloat(primaryKeyword.density) < 1.0) {
      suggestions.push({
        type: 'keyword-density',
        priority: 'high',
        keyword: 'pixel art',
        message: `主要关键词"pixel art"密度偏低 (${primaryKeyword.density}%)，建议增加到1.5-2.5%`,
        recommendation: '在内容中自然增加"pixel art"的出现次数'
      });
    } else if (parseFloat(primaryKeyword.density) > 3.0) {
      suggestions.push({
        type: 'keyword-density',
        priority: 'medium',
        keyword: 'pixel art',
        message: `主要关键词"pixel art"密度偏高 (${primaryKeyword.density}%)，可能被视为关键词堆砌`,
        recommendation: '适当减少关键词密度，保持自然语言'
      });
    }
  }

  // 检查标题标签优化
  const titleKeywords = analysis.results.filter(r => r.positions.includes('title'));
  if (titleKeywords.length < 2) {
    suggestions.push({
      type: 'title-optimization',
      priority: 'high',
      message: '标题标签中关键词覆盖不足',
      recommendation: '在标题中包含主要关键词如"pixel art converter"'
    });
  }

  // 检查H1标签
  const h1Keywords = analysis.results.filter(r => r.positions.includes('h1'));
  if (h1Keywords.length === 0) {
    suggestions.push({
      type: 'heading-optimization',
      priority: 'high',
      message: 'H1标签缺少目标关键词',
      recommendation: '在H1标签中包含最重要的关键词'
    });
  }

  // 检查meta description
  const descKeywords = analysis.results.filter(r => r.positions.includes('meta-description'));
  if (descKeywords.length < 2) {
    suggestions.push({
      type: 'meta-optimization',
      priority: 'medium',
      message: 'Meta description关键词覆盖不足',
      recommendation: '在meta description中包含2-3个重要关键词'
    });
  }

  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

async function runKeywordAnalysis() {
  console.log('🔍 开始关键词分析...\n');

  try {
    // 获取首页内容
    console.log('获取首页内容...');
    const homeContent = await fetchPageContent('https://pixelartvillage.org/');

    // 分析目标关键词
    console.log('分析目标关键词...');
    const targetAnalysis = analyzeKeywords(homeContent, TARGET_KEYWORDS, 'Target Keywords');

    // 分析竞争关键词
    console.log('分析竞争关键词...');
    const competitiveAnalysis = analyzeKeywords(homeContent, COMPETITIVE_KEYWORDS, 'Competitive Keywords');

    // 生成优化建议
    console.log('生成优化建议...');
    const suggestions = generateOptimizationSuggestions(targetAnalysis);

    // 创建报告
    const report = {
      timestamp: new Date().toISOString(),
      url: 'https://pixelartvillage.org/',
      contentLength: homeContent.length,
      targetKeywords: targetAnalysis,
      competitiveKeywords: competitiveAnalysis,
      optimizationSuggestions: suggestions,
      summary: {
        totalTargetKeywords: targetAnalysis.results.length,
        keywordsInTitle: targetAnalysis.results.filter(r => r.positions.includes('title')).length,
        keywordsInH1: targetAnalysis.results.filter(r => r.positions.includes('h1')).length,
        keywordsInH2: targetAnalysis.results.filter(r => r.positions.includes('h2')).length,
        keywordsInMeta: targetAnalysis.results.filter(r => r.positions.includes('meta-description')).length,
        highPrioritySuggestions: suggestions.filter(s => s.priority === 'high').length,
        mediumPrioritySuggestions: suggestions.filter(s => s.priority === 'medium').length
      }
    };

    // 保存报告
    const reportPath = path.resolve(process.cwd(), 'keyword-analysis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // 显示结果
    console.log('\n📊 关键词分析结果:');
    console.log(`  内容长度: ${report.contentLength} 字符`);
    console.log(`  目标关键词覆盖: ${report.summary.keywordsInTitle} in title, ${report.summary.keywordsInH1} in H1`);
    console.log(`  优化建议: ${report.summary.highPrioritySuggestions} 高优先级, ${report.summary.mediumPrioritySuggestions} 中优先级`);

    console.log('\n🎯 最重要的优化建议:');
    suggestions.slice(0, 5).forEach((suggestion, index) => {
      console.log(`  ${index + 1}. [${suggestion.priority.toUpperCase()}] ${suggestion.message}`);
    });

    console.log(`\n📄 详细报告已保存到: ${reportPath}`);

    return report;

  } catch (error) {
    console.error('❌ 关键词分析失败:', error.message);
    throw error;
  }
}

// 运行分析
if (import.meta.url === `file://${process.argv[1]}`) {
  runKeywordAnalysis().catch(console.error);
}

export { runKeywordAnalysis };
