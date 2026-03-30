#!/usr/bin/env node
// Watch public/social-preview.svg and regenerate PNG on change.
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = process.cwd();
const svgPath = path.join(ROOT, 'public', 'social-preview.svg');

function log(msg) {
  console.log(`[social-preview:watch] ${msg}`);
}

function runGen() {
  return new Promise((resolve) => {
    const p = spawn(process.execPath, [path.join(ROOT, 'scripts', 'gen-social-preview.cjs')], {
      stdio: 'inherit',
    });
    p.on('exit', () => resolve());
  });
}

(async () => {
  // initial
  await runGen();

  if (!fs.existsSync(svgPath)) {
    log('public/social-preview.svg not found; watching skipped.');
    process.exit(0);
  }

  log('watching public/social-preview.svg for changes...');
  let timer = null;
  fs.watch(svgPath, { persistent: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      await runGen();
    }, 200);
  });
})();

