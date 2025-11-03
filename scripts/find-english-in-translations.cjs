const fs = require('fs');
const path = require('path');

// 允许的英文词汇（品牌名、技术术语等）
const ALLOWED_ENGLISH = new Set([
  'PNG', 'JPG', 'JPEG', 'WebP', 'GIF', 'SVG',
  'GitHub', 'Google', 'AdSense',
  'Pixel Art Village',
  'FAQ', 'Blog', 'Cookie', 'Cookies',
  'OK', 'ID', 'URL', 'API', 'CSS', 'HTML',
  'Twitter', 'Facebook', 'Instagram',
  'Chrome', 'Firefox', 'Safari', 'Edge'
]);

function findEnglishText(obj, path = '', results = []) {
  for (let key in obj) {
    const newPath = path ? `${path}.${key}` : key;
    
    if (typeof obj[key] === 'string') {
      const value = obj[key];
      
      // 检查是否包含英文单词（至少4个连续字母）
      const englishWords = value.match(/\b[A-Za-z]{4,}\b/g);
      
      if (englishWords) {
        // 过滤掉允许的英文词汇
        const disallowedWords = englishWords.filter(word => {
          // 检查是否在允许列表中
          if (ALLOWED_ENGLISH.has(word)) return false;
          
          // 检查是否是允许列表中某个词的一部分
          for (let allowed of ALLOWED_ENGLISH) {
            if (allowed.includes(word)) return false;
          }
          
          return true;
        });
        
        if (disallowedWords.length > 0) {
          results.push({
            path: newPath,
            value: value,
            englishWords: disallowedWords
          });
        }
      }
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      findEnglishText(obj[key], newPath, results);
    }
  }
  
  return results;
}

function checkLanguage(lang) {
  const filePath = path.join(__dirname, '..', 'public', 'locales', lang, 'translation.json');
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return [];
  }
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const results = findEnglishText(data);
  
  return results;
}

// 检查指定的语言
const languagesToCheck = process.argv.slice(2);

if (languagesToCheck.length === 0) {
  console.log('Usage: node find-english-in-translations.cjs <lang1> <lang2> ...');
  console.log('Example: node find-english-in-translations.cjs ko ja fr');
  process.exit(1);
}

let totalIssues = 0;

languagesToCheck.forEach(lang => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Checking ${lang.toUpperCase()}...`);
  console.log('='.repeat(60));
  
  const results = checkLanguage(lang);
  
  if (results.length === 0) {
    console.log('✅ No English text found!');
  } else {
    console.log(`⚠️  Found ${results.length} entries with English text:\n`);
    
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.path}`);
      console.log(`   Value: ${result.value}`);
      console.log(`   English words: ${result.englishWords.join(', ')}`);
      console.log('');
    });
    
    totalIssues += results.length;
  }
});

console.log(`\n${'='.repeat(60)}`);
console.log(`Total issues found: ${totalIssues}`);
console.log('='.repeat(60));

process.exit(totalIssues > 0 ? 1 : 0);

