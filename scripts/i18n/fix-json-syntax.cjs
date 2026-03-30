const fs = require('fs');
const path = require('path');

// 需要修复的文件列表
const files = [
  'src/content/blog-posts.ar.json',
  'src/content/blog-posts.de.json',
  'src/content/blog-posts.en.json',
  'src/content/blog-posts.es.json',
  'src/content/blog-posts.tl.json',
  'src/content/blog-posts.fr.json',
  'src/content/blog-posts.id.json',
  'src/content/blog-posts.it.json',
  'src/content/blog-posts.ja.json',
  'src/content/blog-posts.ko.json',
  'src/content/blog-posts.nl.json',
  'src/content/blog-posts.nb.json',
  'src/content/blog-posts.pl.json',
  'src/content/blog-posts.pseudo.json',
  'src/content/blog-posts.pt.json',
  'src/content/blog-posts.ru.json',
  'src/content/blog-posts.sv.json',
  'src/content/blog-posts.th.json',
  'src/content/blog-posts.vi.json',
  'src/content/pseo-pages.en.json'
];

console.log('🔧 开始修复JSON文件语法错误...\n');

let fixedFiles = 0;
let totalErrors = 0;

files.forEach(filePath => {
  try {
    console.log(`处理文件: ${filePath}`);

    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠️  文件不存在，跳过\n`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let errorsInFile = 0;

    // 修复模式1: "- "开头缺少引号的行
    const pattern1 = /^(\s*)- (.*)$/gm;
    const beforePattern1 = (content.match(pattern1) || []).length;
    content = content.replace(pattern1, (match, indent, text) => {
      // 检查是否已经正确格式化
      if (text.startsWith('"')) return match;
      return `${indent}- "${text.replace(/"/g, '\\"')}"`;
    });
    const afterPattern1 = (content.match(pattern1) || []).length;
    errorsInFile += Math.abs(beforePattern1 - afterPattern1);

    // 修复模式2: 数字列表项中的引号错误 "1. "text**:"
    const pattern2 = /^(\s*)"(\d+\.\s*)"([^"]*"\*\*":?)$/gm;
    content = content.replace(pattern2, '$1$2**$3**');

    // 修复模式3: 列表项中缺少引号的情况
    const pattern3 = /^(\s*)- "([^"]*)$/gm;
    const beforePattern3 = (content.match(pattern3) || []).length;
    content = content.replace(pattern3, (match, indent, text) => {
      return `${indent}- "${text}"`;
    });
    const afterPattern3 = (content.match(pattern3) || []).length;
    errorsInFile += Math.abs(beforePattern3 - afterPattern3);

    // 修复模式4: 不正确的引号组合 "- "text**:"
    const pattern4 = /^(\s*)- "([^"]*"\*\*:?)$/gm;
    content = content.replace(pattern4, '$1- **$2**');

    // 修复模式5: 数字列表中的引号错误 "3. "text**:"
    const pattern5 = /^(\s*)"(\d+\.\s*)"([^"]*"\*\*:?)$/gm;
    content = content.replace(pattern5, '$1$2**$3**');

    // 修复模式6: 任何数字开头的行中有错误引号的情况
    const pattern6 = /^(\s*)"(\d+\.\s*)"([^"]*)"([^"]*)$/gm;
    content = content.replace(pattern6, (match, indent, num, text1, text2) => {
      return `${indent}${num}"${text1}${text2}"`;
    });

    // 验证JSON语法
    try {
      JSON.parse(content);
      console.log(`  ✅ 修复成功，写入文件`);
      fs.writeFileSync(filePath, content, 'utf8');
      fixedFiles++;
      totalErrors += errorsInFile;
    } catch (error) {
      console.log(`  ❌ 仍有错误: ${error.message}`);
      // 尝试找到具体的错误位置
      const match = error.message.match(/position (\d+)/);
      if (match) {
        const pos = parseInt(match[1]);
        const context = content.substring(Math.max(0, pos - 50), pos + 50);
        console.log(`     错误位置附近: ...${context}...`);
      }
    }

  } catch (error) {
    console.log(`  ❌ 处理失败: ${error.message}`);
  }

  console.log('');
});

console.log(`🎯 修复完成！`);
console.log(`📁 成功修复文件数: ${fixedFiles}/${files.length}`);
console.log(`🔧 总计修复错误数: ${totalErrors}`);
