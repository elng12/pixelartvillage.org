#!/usr/bin/env node
/**
 * Remove white background and export pixel icon PNGs (512/192/64/32)
 * Usage: node scripts/make-pixel-icon.cjs "INPUT_PATH"
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('[pixel] missing input path');
    process.exit(1);
  }
  if (!fs.existsSync(inputPath)) {
    console.error('[pixel] file not found:', inputPath);
    process.exit(1);
  }

  const outDir = path.resolve('public', 'icons', 'png');
  fs.mkdirSync(outDir, { recursive: true });

  // 读取原图，生成“黑白遮罩”，将近白色区域设为 0 透明，其它为不透明
  // 思路：将原图转换为灰度，进行较高阈值二值化（白底→1），再取反（前景�?），作为 alpha 通道
  const img = sharp(inputPath);
  const meta = await img.metadata();

  // 灰度→阈值→反相，得�?mask
  const mask = await img
    .clone()
    .removeAlpha()
    .greyscale()
    .threshold(250)   // 250 以上视为白底
    .negate()         // 前景=�?255)，背�?�?0)
    .toBuffer();

  // 合成 RGBA：取 RGB + mask 作为 alpha
  const rgba = await img
    .clone()
    .removeAlpha()
    .joinChannel(mask) // RGBA
    .png()
    .toBuffer();

  // 自动裁切透明�?+ 适度内边距，避免贴边
  const trimmed = await sharp(rgba).trim({ threshold: 10 }).extend({
    top: 12, bottom: 12, left: 12, right: 12, background: { r: 0, g: 0, b: 0, alpha: 0 }
  }).png().toBuffer();

  const sizes = [512, 192, 64, 32];
  const baseName = 'icon-feedback-pixel';

  for (const size of sizes) {
    const outFile = path.join(outDir, `${baseName}-${size}.png`);
    await sharp(trimmed)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(outFile);
    console.log('[pixel] generated', path.relative(process.cwd(), outFile));
  }
  console.log('[pixel] done');
}

main().catch((e) => {
  console.error('[pixel] fail', e);
  process.exit(1);
});
