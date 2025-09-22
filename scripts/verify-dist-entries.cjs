#!/usr/bin/env node
// Simple post-build verification: ensure multi-page entries exist and include built assets.
const fs = require('fs');
const path = require('path');

const DIST = path.resolve(process.cwd(), 'dist');
const PAGES = ['privacy', 'terms', 'about', 'contact'];

function fail(msg) {
  console.error('[verify-dist] FAIL:', msg);
  process.exitCode = 1;
}

function ok(msg) {
  console.log('[verify-dist] OK  :', msg);
}

if (!fs.existsSync(DIST)) {
  fail('dist directory not found');
  process.exit(1);
}

for (const p of PAGES) {
  const htmlPath = path.join(DIST, `${p}.html`);
  if (!fs.existsSync(htmlPath)) {
    fail(`${p}.html not found in dist`);
    continue;
  }
  const html = fs.readFileSync(htmlPath, 'utf8');
  const hasModuleScript = /<script[^>]*type="module"[^>]*src="\/assets\/[^"]+\.js"/i.test(html);
  const hasCss = /<link[^>]*href="\/assets\/[^"]+\.css"/i.test(html);
  if (!hasModuleScript) fail(`${p}.html missing built module script reference`);
  if (!hasCss) fail(`${p}.html missing built css reference`);
  if (hasModuleScript && hasCss) ok(`${p}.html includes assets`);
}

// Summarize
if (process.exitCode) {
  console.error('[verify-dist] Some checks failed.');
  process.exit(1);
} else {
  console.log('[verify-dist] All checks passed.');
}

