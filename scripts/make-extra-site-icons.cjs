#!/usr/bin/env node
// Generate 96x96 favicon from existing pixel icons
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
(async () => {
  const srcDir = path.resolve('public','icons','png');
  const out = path.resolve('public','favicon-96x96.png');
  const candidates = ['icon-feedback-pixel-512.png','icon-feedback-pixel-192.png','icon-feedback-line-512.png'];
  let input = null;
  for (const c of candidates) {
    const p = path.join(srcDir, c);
    if (fs.existsSync(p)) { input = p; break; }
  }
  if (!input) { console.error('[extra-icons] no pixel base found'); process.exit(1); }
  await sharp(input).resize(96,96,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png().toFile(out);
  console.log('[extra-icons] generated', path.relative(process.cwd(), out));
})().catch(e => { console.error(e); process.exit(1); });