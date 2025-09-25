#!/usr/bin/env node

// SEO health check script
// Validates common SEO issues before deployment

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}: ${filePath}`);
    return true;
  } else {
    console.log(`❌ ${description}: ${filePath} (missing)`);
    return false;
  }
}

function checkFileContent(filePath, pattern, description) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${description}: ${filePath} (file missing)`);
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  if (pattern.test(content)) {
    console.log(`✅ ${description}: Found in ${filePath}`);
    return true;
  } else {
    console.log(`❌ ${description}: Not found in ${filePath}`);
    return false;
  }
}

function runSeoCheck() {
  console.log('🔍 Running SEO Health Check...\n');
  
  let passed = 0;
  let total = 0;
  
  // Check essential files
  const checks = [
    () => checkFile(path.join(PUBLIC_DIR, 'robots.txt'), 'Robots.txt'),
    () => checkFile(path.join(PUBLIC_DIR, 'sitemap.xml'), 'Sitemap.xml'),
    () => checkFile(path.join(PUBLIC_DIR, 'favicon.ico'), 'Favicon.ico'),
    () => checkFile(path.join(PUBLIC_DIR, '_redirects'), 'Redirects file'),
    
    // Check HTML content
    () => checkFileContent(
      path.join(process.cwd(), 'index.html'),
      /<title>.*Pixel Art Village.*<\/title>/,
      'Title tag in index.html'
    ),
    () => checkFileContent(
      path.join(process.cwd(), 'index.html'),
      /<meta name="description"[\s\S]*?content="[^"]{120,160}"/,
      'Meta description (120-160 chars) in index.html'
    ),
    () => checkFileContent(
      path.join(process.cwd(), 'index.html'),
      /<link rel="canonical" href="https:\/\/pixelartvillage\.org\/"/,
      'Canonical URL in index.html'
    ),
    () => checkFileContent(
      path.join(process.cwd(), 'index.html'),
      /<script type="application\/ld\+json">/,
      'Structured data in index.html'
    ),
    () => checkFileContent(
      path.join(process.cwd(), 'index.html'),
      /<h1[^>]*>.*Free Online Pixel Art Maker.*<\/h1>/,
      'H1 tag in hidden SEO content'
    ),
    
    // Check sitemap content
    () => checkFileContent(
      path.join(PUBLIC_DIR, 'sitemap.xml'),
      /<loc>https:\/\/pixelartvillage\.org\/(en|es|id|de|pl|it|pt|fr|ru|fil|vi)\/<\/loc>/,
      'Homepage URLs in sitemap (multilingual)'
    ),
    () => checkFileContent(
      path.join(PUBLIC_DIR, 'sitemap.xml'),
      /<loc>https:\/\/pixelartvillage\.org\/(en|es|id|de|pl|it|pt|fr|ru|fil|vi)\/converter\//,
      'Converter pages in sitemap (multilingual)'
    ),
    
    // Check robots.txt content
    () => checkFileContent(
      path.join(PUBLIC_DIR, 'robots.txt'),
      /Sitemap: https:\/\/pixelartvillage\.org\/sitemap\.xml/,
      'Sitemap reference in robots.txt'
    ),
  ];
  
  checks.forEach(check => {
    total++;
    if (check()) {
      passed++;
    }
  });
  
  console.log(`\n📊 SEO Check Results: ${passed}/${total} checks passed`);
  
  if (passed === total) {
    console.log('🎉 All SEO checks passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some SEO issues found. Please fix them before deployment.');
    process.exit(1);
  }
}

runSeoCheck();
