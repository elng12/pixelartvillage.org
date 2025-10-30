#!/usr/bin/env node

/**
 * 按日期降序排序博客文章（最新的在前）
 */

const fs = require('fs');
const path = require('path');

const postsPath = path.join(__dirname, '../src/content/blog-posts.json');

// 读取现有博客文章
const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));

// 按日期降序排序（最新的在前）
posts.sort((a, b) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  return dateB - dateA; // 降序
});

// 写回文件
fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), 'utf8');

console.log('✅ Blog posts sorted by date (newest first)');
console.log(`Total posts: ${posts.length}`);
posts.forEach((post, idx) => {
  console.log(`  ${idx + 1}. ${post.date} - ${post.title}`);
});

