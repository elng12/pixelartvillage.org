#!/usr/bin/env node
// Generate WebP/JPG for showcase images from SVG sources.
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const inputs = [
  {
    preferred: 'src/assets/Before.jpg',
    fallbackSvg: 'public/showcase-before.svg',
    base: 'public/showcase-before'
  },
  {
    preferred: 'src/assets/After.png',
    fallbackSvg: 'public/showcase-after.svg',
    base: 'public/showcase-after'
  },
];

function log(msg) { console.log(`[showcase] ${msg}`); }
function exists(p) { try { fs.accessSync(p, fs.constants.F_OK); return true; } catch { return false; } }

(async () => {
  let sharp;
  try { sharp = require('sharp'); } catch (e) {
    log('warn: sharp not installed. `npm i -D sharp` to enable showcase image generation.');
    process.exit(0);
  }

  for (const item of inputs) {
    const preferredPath = path.join(ROOT, item.preferred);
    const svgPath = path.join(ROOT, item.fallbackSvg);
    let inputBuffer = null;
    if (exists(preferredPath)) inputBuffer = fs.readFileSync(preferredPath);
    else if (exists(svgPath)) inputBuffer = fs.readFileSync(svgPath);
    else { log(`skip: neither ${item.preferred} nor ${item.fallbackSvg} exists`); continue; }
    const sizes = [1200, 800, 480];
    try {
      for (const w of sizes) {
        const webpPath = path.join(ROOT, `${item.base}-w${w}.webp`);
        const jpgPath = path.join(ROOT, `${item.base}-w${w}.jpg`);
        await sharp(inputBuffer).resize(w, null, { fit: 'inside', withoutEnlargement: false }).webp({ quality: 85 }).toFile(webpPath);
        await sharp(inputBuffer).resize(w, null, { fit: 'inside', withoutEnlargement: false }).jpeg({ quality: 88 }).toFile(jpgPath);
      }
      // keep default aliases for 1200w for backward compatibility
      const aliasWebp = path.join(ROOT, `${item.base}.webp`);
      const aliasJpg = path.join(ROOT, `${item.base}.jpg`);
      fs.copyFileSync(path.join(ROOT, `${item.base}-w1200.webp`), aliasWebp);
      fs.copyFileSync(path.join(ROOT, `${item.base}-w1200.jpg`), aliasJpg);
      log(`generated multi-size webp/jpg for ${path.basename(item.base)}`);
    } catch (err) {
      log('error: ' + (err?.message || String(err)));
    }
  }
})();
