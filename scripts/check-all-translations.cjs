#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const RUNTIME_LANGS = ['en', 'es', 'id', 'de', 'pl', 'it', 'pt', 'fr', 'ru', 'fil', 'vi', 'ja', 'sv', 'no', 'nl', 'ar', 'ko', 'th'];

// 允许的英文词（占位符、专有名词等）
const ALLOWED_ENGLISH = new Set([
  'name', 'value', 'date', 'year', 'percent',
  'Pico', 'Lospec', 'SNES', 'Plasmo', 'BacklinkPilot', 'React', 'Ctrl', 'Shift', 'Cmd',
  'Floyd', 'Steinberg', 'WEBP', 'PNG', 'JPG', 'GIF',
  'Illustrator', 'Sunset', 'Image', 'Photo', 'Sprite', 'Sprites',
  'tool', 'blog', 'privacy', 'terms', 'photo', 'converter'
]);

function hasEnglish(str) {
  if (typeof str !== 'string') return false;
  const words = str.match(/[A-Za-z]{4,}/g) || [];
  return words.some(word => !ALLOWED_ENGLISH.has(word));
}

function countEnglish(obj, path = '') {
  let count = 0;
  for (const key in obj) {
    const val = obj[key];
    const newPath = path ? `${path}.${key}` : key;
    if (typeof val === 'string') {
      if (hasEnglish(val)) count++;
    } else if (typeof val === 'object' && val !== null) {
      count += countEnglish(val, newPath);
    }
  }
  return count;
}

console.log('\n📊 Translation Status Summary\n');
console.log('=' .repeat(80));
console.log('Language'.padEnd(15) + 'English Issues'.padEnd(20) + 'Status');
console.log('=' .repeat(80));

const results = [];

for (const lang of RUNTIME_LANGS) {
  const filePath = path.join(__dirname, '..', 'public', 'locales', lang, 'translation.json');
  
  if (!fs.existsSync(filePath)) {
    console.log(`${lang.padEnd(15)}${'File not found'.padEnd(20)}❌`);
    continue;
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const issues = countEnglish(data);
    
    let status = '✅ Excellent';
    if (issues > 100) status = '❌ Poor';
    else if (issues > 50) status = '⚠️ Needs work';
    else if (issues > 20) status = '🟡 Good';
    
    results.push({ lang, issues, status });
    
    const langName = lang === 'en' ? 'English (Base)' : lang.toUpperCase();
    console.log(`${langName.padEnd(15)}${String(issues).padEnd(20)}${status}`);
  } catch (error) {
    console.log(`${lang.padEnd(15)}${'Parse error'.padEnd(20)}❌`);
  }
}

console.log('=' .repeat(80));

// 统计
const excellent = results.filter(r => r.issues <= 20).length;
const good = results.filter(r => r.issues > 20 && r.issues <= 50).length;
const needsWork = results.filter(r => r.issues > 50 && r.issues <= 100).length;
const poor = results.filter(r => r.issues > 100).length;

console.log('\n📈 Summary:');
console.log(`  ✅ Excellent (≤20 issues): ${excellent} languages`);
console.log(`  🟡 Good (21-50 issues): ${good} languages`);
console.log(`  ⚠️ Needs work (51-100 issues): ${needsWork} languages`);
console.log(`  ❌ Poor (>100 issues): ${poor} languages`);
console.log('');

