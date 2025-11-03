const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const languages = ['es', 'id', 'de', 'pl', 'it', 'pt', 'fr', 'ru', 'fil', 'vi', 'ja', 'sv', 'no', 'nl', 'ar', 'ko', 'th'];

console.log('\n' + '='.repeat(80));
console.log('📊 最终翻译质量报告');
console.log('='.repeat(80) + '\n');

const results = [];

languages.forEach(lang => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  
  if (!fs.existsSync(filePath)) {
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  
  let totalStrings = 0;
  let translatedStrings = 0;
  let englishStrings = 0;
  let errorStrings = 0;
  
  function checkStrings(obj) {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        totalStrings++;
        
        // 检查是否包含错误提示
        if (value.includes('There seems to be') || 
            value.includes('The text you provided') ||
            value.includes('appears to already be') ||
            value.includes('misunderstanding')) {
          errorStrings++;
        }
        // 检查是否是英文（简单判断：超过50%是ASCII字母）
        else {
          const asciiLetters = (value.match(/[a-zA-Z]/g) || []).length;
          const totalChars = value.replace(/\s/g, '').length;
          
          if (totalChars > 0 && asciiLetters / totalChars > 0.5) {
            englishStrings++;
          } else {
            translatedStrings++;
          }
        }
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        checkStrings(value);
      }
    }
  }
  
  checkStrings(data);
  
  const translationRate = totalStrings > 0 ? (translatedStrings / totalStrings * 100).toFixed(1) : 0;
  
  results.push({
    lang,
    totalStrings,
    translatedStrings,
    englishStrings,
    errorStrings,
    translationRate: parseFloat(translationRate)
  });
});

// 按翻译率排序
results.sort((a, b) => b.translationRate - a.translationRate);

console.log('语言    总字符串  已翻译  英文  错误  翻译率  状态');
console.log('-'.repeat(80));

results.forEach(r => {
  const langName = r.lang.toUpperCase().padEnd(6);
  const total = String(r.totalStrings).padStart(8);
  const translated = String(r.translatedStrings).padStart(7);
  const english = String(r.englishStrings).padStart(5);
  const errors = String(r.errorStrings).padStart(5);
  const rate = String(r.translationRate + '%').padStart(7);
  
  let status = '';
  if (r.errorStrings > 0) {
    status = '❌ 有错误';
  } else if (r.translationRate >= 90) {
    status = '✅ 优秀';
  } else if (r.translationRate >= 70) {
    status = '🟡 良好';
  } else if (r.translationRate >= 50) {
    status = '⚠️  需改进';
  } else {
    status = '❌ 较差';
  }
  
  console.log(`${langName} ${total} ${translated} ${english} ${errors} ${rate}  ${status}`);
});

console.log('\n' + '='.repeat(80));

// 统计
const excellent = results.filter(r => r.translationRate >= 90 && r.errorStrings === 0).length;
const good = results.filter(r => r.translationRate >= 70 && r.translationRate < 90 && r.errorStrings === 0).length;
const needsWork = results.filter(r => r.translationRate >= 50 && r.translationRate < 70 && r.errorStrings === 0).length;
const poor = results.filter(r => r.translationRate < 50 || r.errorStrings > 0).length;

console.log('\n📈 统计摘要:');
console.log(`  ✅ 优秀 (≥90%): ${excellent} 种语言`);
console.log(`  🟡 良好 (70-89%): ${good} 种语言`);
console.log(`  ⚠️  需改进 (50-69%): ${needsWork} 种语言`);
console.log(`  ❌ 较差 (<50% 或有错误): ${poor} 种语言`);

console.log('\n💡 建议:');
if (poor > 0) {
  console.log('  • 有些语言的翻译质量较差，建议重新运行批量翻译');
}
if (excellent >= results.length * 0.7) {
  console.log('  • 大部分语言翻译质量优秀，可以进行生产部署！');
}

console.log('\n' + '='.repeat(80) + '\n');

