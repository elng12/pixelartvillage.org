#!/usr/bin/env node
// Run social-preview watcher and Vite dev server together.
const { spawn } = require('child_process');
const path = require('path');

function spawnProc(cmd, args, name) {
  const p = spawn(cmd, args, { stdio: 'inherit', shell: false, windowsHide: true });
  p.on('exit', (code) => {
    // If vite exits, stop the whole dev
    if (name === 'vite') process.exit(code ?? 0);
  });
  return p;
}

const watcher = spawnProc(process.execPath, [path.join(process.cwd(), 'scripts', 'watch-social-preview.cjs')], 'watch');
const viteBin = path.join(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js');
const vite = spawnProc(process.execPath, [viteBin], 'vite');

function shutdown() {
  watcher && watcher.kill('SIGTERM');
  vite && vite.kill('SIGTERM');
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

