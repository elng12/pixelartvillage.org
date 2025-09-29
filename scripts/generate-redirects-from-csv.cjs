#!/usr/bin/env node
/**
 * Generate candidate 301 redirects from a CSV export (e.g., GSC coverage URLs).
 * - Input CSV: --in data/gsc.csv (default). The CSV must contain a column named URL/url/Link or a single-column list of URLs.
 * - Safe by default: writes suggestions to tmp/redirects.generated.txt
 * - With --write: append the generated rules to public/_redirects in a timestamped block
 *
 * Heuristics:
 * 1) If URL path lacks trailing slash and a known route exists with trailing slash, propose: /path   /path/  301
 * 2) Known slug migration: best-image-to-pixel-art-converters-2024 -> ...-2025 (both root and /en/)
 * 3) Skip language-to-English 301 (we keep localized pages accessible; canonical handles consolidation)
 *
 * This script never overwrites existing rules; it only appends.
 */

const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, 'public');
const REDIRECTS = path.join(PUBLIC, '_redirects');

const argv = process.argv.slice(2);
const arg = (name, def) => {
  const i = argv.findIndex(a => a === name || a.startsWith(name + '='));
  if (i === -1) return def;
  const v = argv[i].includes('=') ? argv[i].split('=').slice(1).join('=') : argv[i + 1];
  return v ?? true;
};

const INPUT = arg('--in', 'data/gsc.csv');
const WRITE = !!argv.find(a => a === '--write');
const TMP_DIR = path.join(ROOT, 'tmp');
const OUT_TMP = path.join(TMP_DIR, 'redirects.generated.txt');

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

function readCsv(file) {
  if (!fs.existsSync(file)) return [];
  const raw = fs.readFileSync(file, 'utf8').trim();
  if (!raw) return [];
  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  // Try to detect header
  const header = lines[0].split(',').map(s => s.trim().replace(/^"|"$/g, ''));
  let urlIdx = -1;
  if (header.length === 1 && /^https?:\/\//i.test(header[0])) {
    // single URL line without header
    return lines.map(l => l.trim().replace(/^"|"$/g, ''));
  }
  const keys = header.map(h => h.toLowerCase());
  urlIdx = keys.findIndex(k => ['url', 'link', 'address'].includes(k));
  const rows = lines.slice(1).map(l => l.split(','));
  if (urlIdx === -1) {
    // fallback: single-column CSV with headerless content
    return lines.map(l => l.trim().replace(/^"|"$/g, '')).filter(l => /^https?:\/\//i.test(l));
  }
  return rows.map(cols => (cols[urlIdx] || '').trim().replace(/^"|"$/g, '')).filter(Boolean);
}

function loadKnownRoutes() {
  const routes = new Set([
    '/', '/about/', '/contact/', '/privacy/', '/terms/', '/blog/',
  ]);
  // Load pSEO and blog slugs
  const langPrefixes = ['en','es','id','de','pl','it','pt','fr','ru','fil','vi','ja'];
  function addWithLangs(p) {
    const clean = p.endsWith('/') ? p : p + '/';
    routes.add(clean);
    for (const l of langPrefixes) {
      routes.add(`/${l}${clean}`);
    }
  }
  try {
    const posts = require(path.join(ROOT, 'src/content/blog-posts.json'));
    for (const p of posts) {
      if (p && p.slug) addWithLangs(`/blog/${p.slug}`);
    }
  } catch {}
  try {
    const pseo = require(path.join(ROOT, 'src/content/pseo-pages.json'));
    for (const p of pseo) {
      if (p && p.slug) addWithLangs(`/converter/${p.slug}`);
    }
  } catch {}
  return routes;
}

function parsePath(u) {
  try {
    const url = new URL(u);
    return url.pathname.replace(/\/+/g, '/');
  } catch {
    // maybe it's already a path
    return String(u || '').trim();
  }
}

function withSlash(p) {
  if (!p) return p;
  return p.endsWith('/') ? p : p + '/';
}

function hasLangPrefix(p) {
  return /^\/[a-z]{2}(\/|$)/i.test(p);
}

function generateRules(urls, known) {
  const rules = [];
  const seen = new Set();

  function pushRule(from, to, code = 301) {
    if (!from || !to || from === to) return;
    const key = `${from}::${to}::${code}`;
    if (seen.has(key)) return;
    seen.add(key);
    rules.push({ from, to, code });
  }

  for (const u of urls) {
    const p = parsePath(u);
    if (!p || p.includes('://')) continue; // we only handle same-site paths
    const norm = p.replace(/\/+/g, '/');
    const normSlash = withSlash(norm);

    // Skip known routes
    if (known.has(normSlash)) continue;

    // Heuristic 1: missing trailing slash but route with slash exists
    if (!norm.endsWith('/') && known.has(normSlash)) {
      pushRule(norm, normSlash, 301);
      continue;
    }

    // Heuristic 2: year migration 2024 -> 2025 for the known post
    if (/best-image-to-pixel-art-converters-2024\/?$/.test(norm)) {
      const target = norm.replace(/2024\/?$/, '2025/');
      pushRule(withSlash(norm), withSlash(target), 301);
      continue;
    }

    // Heuristic 3: nothing matched — keep as unresolved for manual review
    pushRule(withSlash(norm), withSlash(norm), 0); // code 0 marks unresolved
  }

  return rules;
}

function formatRule(r) {
  if (r.code === 0) {
    return `# TODO review: ${r.from}`;
  }
  // Netlify style: FROM    TO    301
  return `${r.from}    ${r.to}   ${r.code}`;
}

function main() {
  const input = path.resolve(ROOT, INPUT);
  if (!fs.existsSync(input)) {
    console.error(`[gsc-redirects] Input not found: ${input}`);
    process.exit(1);
  }
  const urls = readCsv(input)
    .filter(Boolean)
    .filter(u => /^https?:\/\//i.test(u) || u.startsWith('/'));
  if (!urls.length) {
    console.error('[gsc-redirects] No URLs parsed from CSV.');
    process.exit(1);
  }

  const known = loadKnownRoutes();
  const rules = generateRules(urls, known);

  // Split resolvable vs TODO
  const todo = rules.filter(r => r.code === 0);
  const ok = rules.filter(r => r.code !== 0);

  ensureDir(TMP_DIR);
  const header = [
    '# Autogenerated candidate redirects',
    `# Generated at: ${new Date().toISOString()}`,
    '# NOTE:',
    '# - Lines starting with "# TODO review" need manual decision (no known target).',
    '# - Resolvable rules are included below.',
    '',
  ].join('\n');

  const body = rules.map(formatRule).join('\n');
  fs.writeFileSync(OUT_TMP, `${header}${body}\n`, 'utf8');
  console.log(`[gsc-redirects] Wrote suggestions to ${path.relative(ROOT, OUT_TMP)}`);
  console.log(`[gsc-redirects] Resolvable: ${ok.length}, TODO: ${todo.length}`);

  if (WRITE) {
    // Append only resolvable ones to public/_redirects
    const blockHeader = [
      '',
      `# ==== BEGIN AUTO 301 (generate-redirects-from-csv) ${new Date().toISOString()} ====`,
    ].join('\n');
    const blockFooter = '\n# ==== END AUTO 301 ====\n';
    const lines = ok.map(formatRule).join('\n');
    const append = `${blockHeader}\n${lines}${blockFooter}`;
    fs.appendFileSync(REDIRECTS, append, 'utf8');
    console.log(`[gsc-redirects] Appended ${ok.length} rule(s) to ${path.relative(ROOT, REDIRECTS)}`);
    if (todo.length) {
      console.log(`[gsc-redirects] ${todo.length} unresolved item(s) kept in ${path.relative(ROOT, OUT_TMP)} for manual review.`);
    }
  } else {
    console.log('[gsc-redirects] Dry-run complete. Use --write to append resolvable rules to public/_redirects.');
  }
}

try {
  main();
} catch (e) {
  console.error('[gsc-redirects] failed:', e && e.stack || e);
  process.exit(1);
}