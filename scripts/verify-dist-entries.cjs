#!/usr/bin/env node
// Simple post-build verification for SPA: ensure index.html includes assets,
// 404.html exists (for GitHub Pages SPA fallback), and social images are copied.
const fs = require('fs');
const path = require('path');

const DIST = path.resolve(process.cwd(), 'dist');
const REQUIRED_FILES = ['index.html', '404.html'];

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

for (const f of REQUIRED_FILES) {
  const p = path.join(DIST, f);
  if (!fs.existsSync(p)) {
    fail(`${f} not found in dist`);
    continue;
  }
  const html = fs.readFileSync(p, 'utf8');
  if (f === 'index.html') {
    const hasModuleScript = /<script[^>]*type="module"[^>]*src="\/assets\/[^"]+\.js"/i.test(html);
    const hasCss = /<link[^>]*href="\/assets\/[^"]+\.css"/i.test(html);
    if (!hasModuleScript) fail('index.html missing built module script reference');
    if (!hasCss) fail('index.html missing built css reference');
    if (hasModuleScript && hasCss) ok('index.html includes assets');
  } else {
    ok(`${f} present`);
  }
}

['social-privacy.png', 'social-terms.png', 'social-about.png', 'social-contact.png'].forEach((img) => {
  const p = path.join(DIST, img);
  if (!fs.existsSync(p)) fail(`missing ${img} in dist`);
  else ok(`found ${img}`);
});

if (process.exitCode) {
  console.error('[verify-dist] Some checks failed.');
  process.exit(1);
} else {
  console.log('[verify-dist] All checks passed.');
}

