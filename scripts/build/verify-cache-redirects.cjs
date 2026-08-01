/**
 * 回归防护：缓存策略与重定向规则数检查（postbuild 自动执行）
 *
 * 背景（2026-07-31 线上事故复盘）：
 * 1. _headers 中 /* 的 "no-store" 会经 Cloudflare Pages 多规则值合并
 *    污染 /assets/* 的 immutable 缓存 —— 静态资源全部失去缓存。
 * 2. _redirects 总规则数超过 Cloudflare Pages 单文件应用上限（实测 ~102 条）
 *    时，超限规则直接失效，旧 URL 重定向变 404 断链。
 *
 * 任何改动导致这两类回归时，构建即失败。
 */
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', '..', 'dist');
const failures = [];

// 1. _headers：禁止 no-store 出现在任何规则值中
const headersPath = path.join(DIST, '_headers');
if (!fs.existsSync(headersPath)) {
  failures.push('dist/_headers 不存在');
} else {
  const headers = fs.readFileSync(headersPath, 'utf8');
  if (/\bno-store\b/.test(headers)) {
    failures.push('dist/_headers 含 no-store —— 会经多规则值合并污染 /assets/* 的 immutable 缓存');
  } else {
    console.log('[verify-cache-redirects] _headers: 无 no-store ✓');
  }
}

// 2. _redirects：总规则数 <= 100、动态规则数 <= 100
const redirectsPath = path.join(DIST, '_redirects');
if (!fs.existsSync(redirectsPath)) {
  failures.push('dist/_redirects 不存在');
} else {
  const rules = fs
    .readFileSync(redirectsPath, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));
  const total = rules.length;
  const dynamic = rules.filter((r) => r.includes('*') || r.includes(':')).length;
  if (total > 100) {
    failures.push(`_redirects 总规则数 ${total} 超过 100 条 —— 超限规则在线上失效（Cloudflare Pages 单文件应用上限实测 ~102）`);
  } else {
    console.log(`[verify-cache-redirects] _redirects: ${total} 条规则 (${dynamic} 动态) ✓`);
  }
  if (dynamic > 100) {
    failures.push(`_redirects 动态规则数 ${dynamic} 超过 100 条 —— Cloudflare Pages 动态规则上限`);
  }
}

if (failures.length > 0) {
  for (const f of failures) console.error(`[verify-cache-redirects] FAIL: ${f}`);
  process.exit(1);
}
