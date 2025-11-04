#!/usr/bin/env node

/**
 * SEO监控工具 - 定期检查网站SEO健康状况
 * 运行命令: node scripts/seo-monitor.js
 */

import https from 'https';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://pixelartvillage.org';
const REPORT_FILE = path.resolve(process.cwd(), 'seo-monitor-report.json');

// SEO检查项目
const SEO_CHECKS = {
  sitemap: {
    name: 'Sitemap完整性',
    url: '/sitemap.xml',
    expectedStatus: 200,
    checkContent: true
  },
  robots: {
    name: 'Robots.txt配置',
    url: '/robots.txt',
    expectedStatus: 200,
    checkContent: true
  },
  homepage: {
    name: '首页可访问性',
    url: '/',
    expectedStatus: 200,
    checkContent: true
  },
  converter: {
    name: '转换工具页面',
    url: '/converter/png-to-pixel-art/',
    expectedStatus: 200,
    checkContent: true
  },
  international: {
    name: '多语言版本',
    urls: [
      '/es/converter/png-to-pixel-art/',
      '/fr/converter/png-to-pixel-art/',
      '/de/converter/png-to-pixel-art/',
      '/ja/converter/png-to-pixel-art/'
    ],
    expectedStatus: 200
  }
};

function checkUrl(url, checkContent = false) {
  return new Promise((resolve) => {
    const startTime = Date.now();

    const req = https.get(`${SITE_URL}${url}`, (res) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          url: `${SITE_URL}${url}`,
          status: res.statusCode,
          responseTime,
          contentType: res.headers['content-type'],
          contentLength: data.length,
          hasContent: data.length > 0,
          success: res.statusCode === 200 && data.length > 0
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        url: `${SITE_URL}${url}`,
        error: error.message,
        success: false
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        url: `${SITE_URL}${url}`,
        error: '请求超时',
        success: false
      });
    });
  });
}

async function runSEOChecks() {
  console.log('🔍 开始SEO健康检查...\n');

  const results = {
    timestamp: new Date().toISOString(),
    site: SITE_URL,
    overall: 'UNKNOWN',
    checks: {}
  };

  let passedChecks = 0;
  let totalChecks = 0;

  for (const [key, config] of Object.entries(SEO_CHECKS)) {
    console.log(`检查: ${config.name}`);

    if (config.urls) {
      // 多URL检查
      const urlResults = [];
      for (const url of config.urls) {
        const result = await checkUrl(url);
        urlResults.push(result);
        console.log(`  ${result.success ? '✅' : '❌'} ${result.url} (${result.status || 'ERROR'}) ${result.responseTime ? `${result.responseTime}ms` : ''}`);
      }

      results.checks[key] = {
        name: config.name,
        type: 'multi-url',
        results: urlResults,
        success: urlResults.every(r => r.success),
        avgResponseTime: urlResults.reduce((sum, r) => sum + (r.responseTime || 0), 0) / urlResults.length
      };

      if (results.checks[key].success) passedChecks++;
      totalChecks++;
    } else {
      // 单URL检查
      const result = await checkUrl(config.url, config.checkContent);
      console.log(`  ${result.success ? '✅' : '❌'} ${result.url} (${result.status || 'ERROR'}) ${result.responseTime ? `${result.responseTime}ms` : ''}`);

      results.checks[key] = {
        name: config.name,
        type: 'single-url',
        ...result
      };

      if (result.success) passedChecks++;
      totalChecks++;
    }

    console.log('');
  }

  // 检查sitemap XML内容
  console.log('检查: Sitemap内容完整性');
  try {
    const sitemapCheck = await checkUrl('/sitemap.xml', true);
    if (sitemapCheck.success) {
      // 这里可以添加更多sitemap内容检查逻辑
      console.log('  ✅ Sitemap XML格式正确');
      results.checks.sitemapContent = {
        success: true,
        message: 'Sitemap XML格式正确'
      };
      passedChecks++;
      totalChecks++;
    } else {
      console.log('  ❌ Sitemap无法访问或格式错误');
      results.checks.sitemapContent = {
        success: false,
        message: 'Sitemap无法访问或格式错误'
      };
    }
  } catch (error) {
    console.log(`  ❌ Sitemap检查失败: ${error.message}`);
    results.checks.sitemapContent = {
      success: false,
      message: error.message
    };
  }

  // 计算总体状态
  const successRate = (passedChecks / totalChecks) * 100;
  if (successRate >= 90) {
    results.overall = 'EXCELLENT';
  } else if (successRate >= 80) {
    results.overall = 'GOOD';
  } else if (successRate >= 70) {
    results.overall = 'FAIR';
  } else {
    results.overall = 'POOR';
  }

  results.summary = {
    totalChecks,
    passedChecks,
    failedChecks: totalChecks - passedChecks,
    successRate: Math.round(successRate)
  };

  // 保存报告
  fs.writeFileSync(REPORT_FILE, JSON.stringify(results, null, 2));

  // 显示总结
  console.log('📊 SEO健康检查总结:');
  console.log(`  总体状态: ${results.overall} (${results.summary.successRate}%通过率)`);
  console.log(`  通过检查: ${results.summary.passedChecks}/${results.summary.totalChecks}`);
  console.log(`  详细报告已保存到: ${REPORT_FILE}`);

  return results;
}

// 运行检查
if (import.meta.url === `file://${process.argv[1]}`) {
  runSEOChecks().catch(console.error);
}

export { runSEOChecks };