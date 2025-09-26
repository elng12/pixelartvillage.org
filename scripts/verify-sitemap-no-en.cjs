#!/usr/bin/env node
// Verifies sitemap.xml has no /en/ entries after canonical consolidation
// and still contains root + other language locales.
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');

function fail(msg) {
  console.error('❌ ' + msg);
  process.exitCode = 1;
}
function pass(msg) {
  console.log('✅ ' + msg);
}

if (!fs.existsSync(sitemapPath)) {
  fail(`sitemap.xml not found at ${sitemapPath}`);
  process.exit(1);
}

const xml = fs.readFileSync(sitemapPath, 'utf8');

// 1. Ensure no /en/ occurrences
if (/https:\/\/pixelartvillage\.org\/en\//.test(xml)) {
  fail('Found /en/ entries in sitemap.xml (should be removed)');
} else {
  pass('No /en/ entries present');
}

// 2. Ensure root URL present
if (!/https:\/\/pixelartvillage\.org\/<\/loc>/.test(xml)) {
  fail('Root <loc> entry missing');
} else {
  pass('Root <loc> present');
}

// 3. Ensure at least one other language (sample a set) present
const OTHER_LANGS = ['es','id','de','pl','it','pt','fr','ru','fil','vi','ja'];
const presentLangs = OTHER_LANGS.filter(l => new RegExp(`https://pixelartvillage\\.org/${l}/</loc>`).test(xml));
if (presentLangs.length === 0) {
  fail('No other language homepage entries found');
} else {
  pass('Other language homepage entries present: ' + presentLangs.join(', '));
}

// 4. Spot check one converter URL per language set (root + es)
if (!/https:\/\/pixelartvillage\.org\/converter\/png-to-pixel-art\//.test(xml)) {
  fail('Root converter png-to-pixel-art missing');
} else {
  pass('Root converter png-to-pixel-art present');
}
if (!/https:\/\/pixelartvillage\.org\/es\/converter\/png-to-pixel-art\//.test(xml)) {
  fail('es converter png-to-pixel-art missing');
} else {
  pass('es converter png-to-pixel-art present');
}

// 5. Ensure total url count roughly > X (sanity). Not failing hard if small, just warn.
const urlCount = (xml.match(/<url>/g) || []).length;
if (urlCount < 50) {
  console.warn(`⚠️  Sitemap contains only ${urlCount} <url> entries (expected many more).`);
} else {
  pass(`Sitemap url count = ${urlCount}`);
}

if (process.exitCode) {
  console.error('\nSitemap verification FAILED');
  process.exit(1);
} else {
  console.log('\n🎉 Sitemap verification PASSED');
}
