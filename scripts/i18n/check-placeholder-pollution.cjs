const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'public', 'locales');
const languages = ['es', 'id', 'de', 'pl', 'it', 'pt', 'fr', 'ru', 'tl', 'vi', 'ja', 'sv', 'nb', 'nl', 'ar', 'ko', 'th'];

console.log('🔍 检查所有语言的占位符污染问题...\n');

const issues = [];

languages.forEach(lang => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${lang.toUpperCase()}: 文件不存在`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  
  // 递归检查所有字段
  function checkObject(obj, path = '') {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'string') {
        // 检查是否包含大量重复的占位符
        const placeholderMatches = value.match(/\{\{[^}]+\}\}/g) || [];
        const termMatches = value.match(/\{\{TERM_\d+__\}\}/g) || [];
        const phMatches = value.match(/__PH_\d+__/g) || [];
        
        const totalPlaceholders = placeholderMatches.length + termMatches.length + phMatches.length;
        
        // 如果占位符数量超过10个，或者字符串长度超过2000，标记为问题
        if (totalPlaceholders > 10 || value.length > 2000) {
          issues.push({
            lang,
            path: currentPath,
            length: value.length,
            placeholders: totalPlaceholders,
            preview: value.substring(0, 200) + (value.length > 200 ? '...' : '')
          });
        }
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        checkObject(value, currentPath);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            checkObject(item, `${currentPath}[${index}]`);
          }
        });
      }
    }
  }
  
  checkObject(data);
  
  if (issues.filter(i => i.lang === lang).length === 0) {
    console.log(`✅ ${lang.toUpperCase()}: 无问题`);
  }
});

console.log('\n' + '='.repeat(80));

if (issues.length > 0) {
  console.log(`\n❌ 发现 ${issues.length} 个问题：\n`);
  
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. 🇺🇳 ${issue.lang.toUpperCase()} - ${issue.path}`);
    console.log(`   长度: ${issue.length} 字符`);
    console.log(`   占位符数量: ${issue.placeholders}`);
    console.log(`   预览: ${issue.preview}`);
    console.log('');
  });
  
  console.log('💡 建议: 运行修复脚本清理这些问题');
} else {
  console.log('\n✅ 所有语言文件都正常！');
}

console.log('='.repeat(80));
