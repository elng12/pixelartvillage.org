#!/usr/bin/env node
// Simple i18n keys consistency check for navTitle.*
// - Baseline: src/locales/en.json
// - Targets:  public/locales/*/translation.json
// - Fails if baseline is missing or any locale misses required keys.
const fs = require('fs');
const path = require('path');

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error(`[i18n-validate] Failed to read JSON: ${file}`);
    throw e;
  }
}

const root = process.cwd();
const baseFile = path.join(root, 'src/locales/en.json');
const base = readJson(baseFile);
if (!base.navTitle || typeof base.navTitle !== 'object') {
  console.error('[i18n-validate] Missing navTitle in src/locales/en.json');
  process.exit(1);
}
const required = Object.keys(base.navTitle);
if (required.length === 0) {
  console.error('[i18n-validate] navTitle in baseline is empty');
  process.exit(1);
}

const localesDir = path.join(root, 'public/locales');
const locales = fs.readdirSync(localesDir).filter((d) => fs.statSync(path.join(localesDir, d)).isDirectory());
const problems = [];

for (const lang of locales) {
  const file = path.join(localesDir, lang, 'translation.json');
  if (!fs.existsSync(file)) {
    problems.push({ lang, file, missing: ['<file missing>'] });
    continue;
    }
  const json = readJson(file);
  const got = json.navTitle || {};
  const missing = required.filter((k) => typeof got[k] !== 'string' || got[k].length === 0);
  if (missing.length) problems.push({ lang, file, missing });
}

if (problems.length) {
  console.error('[i18n-validate] navTitle key check failed. Missing keys by locale:');
  for (const p of problems) {
    console.error(` - ${p.lang} (${p.file}): ${p.missing.join(', ')}`);
  }
  process.exit(1);
}

console.log(`[i18n-validate] OK. navTitle keys present in all locales: ${required.join(', ')}`);
process.exit(0);
