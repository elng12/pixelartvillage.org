#!/usr/bin/env node
/**
 * Remove white/black background automatically and export pixel icon PNGs (512/192/64/32)
 * Usage: node scripts/make-pixel-icon.cjs "INPUT_PATH"
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function autoMaskRGBA(inputPath) {
  const src = sharp(inputPath);
  const meta = await src.metadata();

  // 估算整体亮度，作为背景是黑或白的近似判断
  const stats = await src.clone().removeAlpha().stats();
  const r = stats.channels[0].mean;
  const g = stats.channels[1].mean;
  const b = stats.channels[2].mean;
  const brightness = (r + g + b) / 3; // 0~255

  // 生成灰度图用于阈值
  const gray = src.clone().removeAlpha().greyscale();

  // 阈值策略：
  // - 黑底：brightness 较低（如 < 60），阈值设为 30，前景更亮 → threshold(30) 后前景=白，背景=黑
  // - 白底：brightness 较高（如 >= 60），阈值设为 250，先阈值得到白底=白、前景=黑，再取反使前景=白
  const isBlackBG = brightness < 60;

  let mask;
  if (isBlackBG) {
    mask = await gray.threshold(30).toBuffer(); // 背景≈0，前景≈255
  } else {
    mask = await gray.threshold(250).negate().toBuffer(); // 背景≈0，前景≈255
  }

  // 合成 RGBA
  const rgba = await src.clone().removeAlpha().joinChannel(mask).png().toBuffer();

  // 裁切透明边 + 适度内边距
  const trimmed = await sharp(rgba)
    .trim({ threshold: 10 })
    .extend({
      top: 12, bottom: 12, left: 12, right: 12,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toBuffer();

  return trimmed;
}

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

  const baseName = 'icon-feedback-pixel';
  const sizes = [512, 192, 64, 32];

  const prepared = await autoMaskRGBA(inputPath);

  for (const size of sizes) {
    const outFile = path.join(outDir, `${baseName}-${size}.png`);
    await sharp(prepared)
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