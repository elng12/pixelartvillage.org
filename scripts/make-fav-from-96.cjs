#!/usr/bin/env node
// Create favicon-32.png and favicon-16.png from public/icons/png/favicon-96x96.png
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

(async () => {
  const src = path.resolve('public','icons','png','favicon-96x96.png');
  if (!fs.existsSync(src)) {
    console.error('[fav96] source not found:', src);
    process.exit(1);
  }
  const outDir = path.resolve('public');
  fs.mkdirSync(outDir, { recursive: true });

  const bg = { r: 0, g: 0, b: 0, alpha: 0 };
  const out32 = path.join(outDir, 'favicon-32.png');
  const out16 = path.join(outDir, 'favicon-16.png');

  await sharp(src).resize(32, 32, { fit: 'contain', background: bg }).png().toFile(out32);
  await sharp(src).resize(16, 16, { fit: 'contain', background: bg }).png().toFile(out16);

  console.log('[fav96] generated:', path.relative(process.cwd(), out32));
  console.log('[fav96] generated:', path.relative(process.cwd(), out16));
})();