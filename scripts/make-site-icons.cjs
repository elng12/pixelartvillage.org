#!/usr/bin/env node
/**
 * Generate site icons (favicon-16/32, apple-touch-icon.png) from public/icons/png
 * Priority: pixel > line > flat > neumorphic
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC_DIR = path.resolve('public', 'icons', 'png');
const OUT_DIR = path.resolve('public');

const CANDIDATE_BASES = [
  'icon-feedback-pixel',
  'icon-feedback-line',
  'icon-feedback-flat',
  'icon-feedback-neumorphic',
];

function pickSource(name) {
  const files = [
    path.join(SRC_DIR, `${name}-512.png`),
    path.join(SRC_DIR, `${name}-192.png`),
    path.join(SRC_DIR, `${name}-64.png`),
    path.join(SRC_DIR, `${name}-32.png`),
  ];
  for (const f of files) {
    if (fs.existsSync(f)) return f;
  }
  return null;
}

(async () => {
  let input = null;
  let chosenBase = null;
  for (const base of CANDIDATE_BASES) {
    const p = pickSource(base);
    if (p) {
      input = p;
      chosenBase = base;
      break;
    }
  }
  if (!input) {
    console.error('[site-icons] No source icon found in', SRC_DIR);
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const outF32 = path.join(OUT_DIR, 'favicon-32.png');
  const outF16 = path.join(OUT_DIR, 'favicon-16.png');
  const outApple = path.join(OUT_DIR, 'apple-touch-icon.png'); // 180x180 recommended

  // 使用透明背景，若需要实色背景可在下面 background 中设置
  const bg = { r: 0, g: 0, b: 0, alpha: 0 };

  // 生成 favicon-32.png
  await sharp(input).resize(32, 32, { fit: 'contain', background: bg }).png().toFile(outF32);
  // 生成 favicon-16.png（从更高分辨率缩放，保证清晰度）
  await sharp(input).resize(16, 16, { fit: 'contain', background: bg }).png().toFile(outF16);
  // 生成 apple-touch-icon.png（180x180）
  await sharp(input).resize(180, 180, { fit: 'contain', background: bg }).png().toFile(outApple);

  console.log('[site-icons] generated:');
  console.log('-', path.relative(process.cwd(), outF16));
  console.log('-', path.relative(process.cwd(), outF32));
  console.log('-', path.relative(process.cwd(), outApple));
  console.log('[site-icons] source =', path.relative(process.cwd(), input), 'base =', chosenBase);
})().catch((e) => {
  console.error('[site-icons] fail', e);
  process.exit(1);
});