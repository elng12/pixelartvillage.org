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
  // Check OG/Twitter image references
  const expected = `social-${p}.png`;
  const hasOg = new RegExp(`<meta[^>]+property=\\"og:image\\"[^>]+${expected.replace('.', '\\.')}`, 'i').test(html);
  const hasTw = new RegExp(`<meta[^>]+name=\\"twitter:image\\"[^>]+${expected.replace('.', '\\.')}`, 'i').test(html);
  if (!hasOg) fail(`${p}.html missing og:image -> ${expected}`);
  if (!hasTw) fail(`${p}.html missing twitter:image -> ${expected}`);
}

// Ensure social images exist in dist root
;['social-privacy.png', 'social-terms.png', 'social-about.png', 'social-contact.png'].forEach((img) => {
  const p = path.join(DIST, img);
  if (!fs.existsSync(p)) fail(`missing ${img} in dist`);
  else ok(`found ${img}`);
});

// Summarize
if (process.exitCode) {
  console.error('[verify-dist] Some checks failed.');
  process.exit(1);
} else {
  console.log('[verify-dist] All checks passed.');
}
