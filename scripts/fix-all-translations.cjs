const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const languages = ['es', 'id', 'de', 'pl', 'it', 'pt', 'fr', 'tl', 'vi', 'sv', 'nb', 'nl'];

// 读取英文基准文件
const enPath = path.join(localesDir, 'en', 'translation.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

console.log('🔧 自动修复所有语言的翻译问题...\n');

let totalFixed = 0;

// 获取英文值
function getEnglishValue(obj, pathArray) {
  let current = obj;
  for (const key of pathArray) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return null;
    }
  }
  return current;
}

// 设置值
function setValue(obj, pathArray, value) {
  let current = obj;
  for (let i = 0; i < pathArray.length - 1; i++) {
    const key = pathArray[i];
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }
  current[pathArray[pathArray.length - 1]] = value;
}

// 递归检查和修复
function checkAndFix(obj, prefix = '', langData, enData) {
  let fixed = 0;
  
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = prefix ? `${prefix}.${key}` : key;
    const pathArray = currentPath.split('.');
    
    if (typeof value === 'string') {
      let needsFix = false;
      let reason = '';
      
      // 检查1: 包含翻译错误提示
      if (value.includes('There seems to be') || 
          value.includes('The text you provided') ||
          value.includes('appears to already be') ||
          value.includes('misunderstanding') ||
          value.includes('The provided text is already')) {
        needsFix = true;
        reason = '包含翻译错误提示';
      }
      
      // 检查2: 超长英文文本（可能未翻译）
      if (!needsFix && value.length > 200 && /^[a-zA-Z\s.,!?;:()\-–—'""\[\]{}\/\\]+$/.test(value.substring(0, 100))) {
        needsFix = true;
        reason = '长英文文本未翻译';
      }
      
      if (needsFix) {
        // 尝试从英文文件获取原始值
        const enValue = getEnglishValue(enData, pathArray);
        if (enValue && typeof enValue === 'string') {
          setValue(langData, pathArray, enValue);
          console.log(`  ✓ 修复 ${currentPath}: ${reason}`);
          fixed++;
        }
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      fixed += checkAndFix(value, currentPath, langData, enData);
    }
  }
  
  return fixed;
}

languages.forEach(lang => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${lang.toUpperCase()}: 文件不存在\n`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  
  console.log(`🔍 检查 ${lang.toUpperCase()}...`);
  const fixed = checkAndFix(data, '', data, enData);
  
  if (fixed > 0) {
    // 保存修复后的文件
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ ${lang.toUpperCase()}: 修复了 ${fixed} 个问题\n`);
    totalFixed += fixed;
  } else {
    console.log(`✅ ${lang.toUpperCase()}: 无需修复\n`);
  }
});

console.log('='.repeat(80));
console.log(`\n🎉 总共修复了 ${totalFixed} 个翻译问题！\n`);
console.log('💡 提示: 这些字段已恢复为英文，需要重新翻译');
console.log('='.repeat(80));
