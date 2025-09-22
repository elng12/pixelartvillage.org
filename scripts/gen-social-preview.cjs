#!/usr/bin/env node
// Generate public/social-preview.png from public/social-preview.svg using sharp.
// Falls back gracefully if sharp is not installed.

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, 'public');
const svgPath = path.join(PUBLIC, 'social-preview.svg');
const pngPath = path.join(PUBLIC, 'social-preview.png');

function log(msg) {
  console.log(`[social-preview] ${msg}`);
}

function exists(p) {
  try { fs.accessSync(p, fs.constants.F_OK); return true; } catch { return false; }
}

(async () => {
  // Discover all public/social-*.svg files (including social-preview.svg)
  let svgs = [];
  try {
    svgs = fs.readdirSync(PUBLIC)
      .filter((f) => f.startsWith('social-') && f.endsWith('.svg'))
      .map((f) => path.join(PUBLIC, f));
  } catch {}

  // Always include legacy social-preview.svg if present
  if (exists(svgPath) && !svgs.includes(svgPath)) svgs.push(svgPath);

  if (svgs.length === 0) {
    log('skip: no social-*.svg found');
    process.exit(0);
  }

  let sharp;
  try { sharp = require('sharp'); }
  catch { log('warn: sharp not installed. Install with `npm i -D sharp`'); process.exit(0); }

  for (const svgFile of svgs) {
    const out = svgFile.replace(/\.svg$/, '.png');
    try {
      const svgStat = fs.statSync(svgFile);
      if (exists(out)) {
        const outStat = fs.statSync(out);
        if (outStat.mtimeMs >= svgStat.mtimeMs) {
          log(`ok: ${path.basename(out)} is up to date`);
          continue;
        }
      }
    } catch {}

    try {
      const svg = fs.readFileSync(svgFile);
      await sharp(svg)
        .resize(1200, 630, { fit: 'inside', withoutEnlargement: false })
        .png({ quality: 90 })
        .toFile(out);
      log(`generated ${path.relative(PUBLIC, out)}`);
    } catch (err) {
      log('error: failed ' + path.basename(svgFile) + ': ' + (err?.message || String(err)));
    }
  }
})();

