#!/usr/bin/env node
// Generate PNG variants from SVG icons
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC = path.resolve(process.cwd(), 'public', 'icons');
const OUT = path.join(SRC, 'png');
const SIZES = [512, 192, 64, 32];
const FILES = [
  'icon-feedback-line.svg',
  'icon-feedback-flat.svg',
  'icon-feedback-neumorphic.svg',
];

fs.mkdirSync(OUT, { recursive: true });

(async () => {
  for (const f of FILES) {
    const input = path.join(SRC, f);
    if (!fs.existsSync(input)) {
      console.error('[icons] missing', input);
      continue;
    }
    const base = f.replace(/\.svg$/, '');
    for (const size of SIZES) {
      const out = path.join(OUT, `${base}-${size}.png`);
      await sharp(input).resize(size, size, { fit: 'contain' }).png().toFile(out);
      console.log('[icons] generated', path.relative(process.cwd(), out));
    }
  }
  console.log('[icons] done');
})().catch((e) => {
  console.error('[icons] fail', e);
  process.exit(1);
});