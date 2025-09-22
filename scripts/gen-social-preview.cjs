#!/usr/bin/env node
// Generate public/social-preview.png from public/social-preview.svg using sharp.
// Falls back gracefully if sharp is not installed.

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const svgPath = path.join(ROOT, 'public', 'social-preview.svg');
const pngPath = path.join(ROOT, 'public', 'social-preview.png');

function log(msg) {
  console.log(`[social-preview] ${msg}`);
}

function exists(p) {
  try { fs.accessSync(p, fs.constants.F_OK); return true; } catch { return false; }
}

(async () => {
  if (!exists(svgPath)) {
    log('skip: public/social-preview.svg not found');
    process.exit(0);
  }
  // Skip if PNG is newer than SVG
  try {
    const svgStat = fs.statSync(svgPath);
    if (exists(pngPath)) {
      const pngStat = fs.statSync(pngPath);
      if (pngStat.mtimeMs >= svgStat.mtimeMs) {
        log('ok: social-preview.png is up to date');
        process.exit(0);
      }
    }
  } catch {}

  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    log('warn: sharp not installed. Install with `npm i -D sharp` to auto-generate PNG.');
    process.exit(0);
  }

  try {
    const svg = fs.readFileSync(svgPath);
    await sharp(svg)
      .resize(1200, 630, { fit: 'inside', withoutEnlargement: false })
      .png({ quality: 90 })
      .toFile(pngPath);
    log('generated public/social-preview.png');
  } catch (err) {
    log('error: failed to generate PNG: ' + (err?.message || String(err)));
    process.exit(0);
  }
})();

