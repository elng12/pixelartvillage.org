#!/usr/bin/env node
/*
  Inline critical CSS for all built HTML files in dist/ using Critters.
  - Minimal, safe defaults: keep external CSS (pruneSource=false)
  - Preload strategy: swap
  - Compress inlined CSS
*/

const fs = require('fs');
const path = require('path');

async function main() {
  const distDir = path.resolve(__dirname, '..', 'dist');
  if (!fs.existsSync(distDir)) {
    console.error('[critters] dist/ not found, skip');
    process.exit(0);
  }
  let Critters;
  try {
    Critters = require('critters');
  } catch (err) {
    console.error('[critters] module not installed. Run: npm i -D critters');
    process.exit(1);
  }

  const critters = new Critters({
    path: distDir,
    preload: 'swap',
    noscriptFallback: false,
    pruneSource: false,
    inlineFonts: true,
    compress: true,
    minimumExternalSize: 0,
  });

  const htmlFiles = [];
  (function walk(dir) {
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f);
      const st = fs.statSync(p);
      if (st.isDirectory()) walk(p);
      else if (f.endsWith('.html')) htmlFiles.push(p);
    }
  })(distDir);

  if (htmlFiles.length === 0) {
    console.log('[critters] no HTML files found under dist/.');
    return;
  }

  // Wrap critters logs to dedupe noisy repeated lines from underlying processor
  let ok = 0;
  await withCrittersLogsDedup(async () => {
    for (const file of htmlFiles) {
      try {
        const html = fs.readFileSync(file, 'utf8');
        const inlined = await critters.process(html);
        fs.writeFileSync(file, inlined);
        ok++;
      } catch (e) {
        console.error(`[critters] failed: ${file}\n  ${e?.message || e}`);
      }
    }
  });
  console.log(`[critters] processed ${ok}/${htmlFiles.length} HTML files.`);
}

main().catch((e) => {
  console.error('[critters] fatal:', e?.message || e);
  process.exit(1);
});

// --- helpers ---
function withCrittersLogsDedup(fn) {
  const orig = { log: console.log, warn: console.warn, error: console.error };
  const seen = new Map(); // text -> count
  let suppressed = 0;
  const PATTERNS = [
    /Empty sub-selector/i,
    /^Inlined .* of assets\//i,
    /^Time\s+\d/i,
    /rules skipped due to selector errors/i,
  ];
  const shouldDedup = (text) => PATTERNS.some((re) => re.test(text));
  const wrap = (fn) => (...args) => {
    const text = args.map((a) => (typeof a === 'string' ? a : String(a))).join(' ');
    if (shouldDedup(text)) {
      const c = seen.get(text) || 0;
      if (c === 0) fn(text); // print first occurrence
      else suppressed++;
      seen.set(text, c + 1);
      return;
    }
    fn(...args);
  };
  console.log = wrap(orig.log);
  console.warn = wrap(orig.warn);
  console.error = wrap(orig.error);
  const finalize = () => {
    console.log = orig.log;
    console.warn = orig.warn;
    console.error = orig.error;
    if (suppressed > 0) {
      orig.log(`[critters] log dedupe: suppressed ${suppressed} duplicate lines (${seen.size} unique).`);
    }
  };
  try {
    const r = fn();
    if (r && typeof r.then === 'function') return r.finally(finalize);
    finalize();
    return r;
  } catch (e) {
    finalize();
    throw e;
  }
}
