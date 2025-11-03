const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const languages = ['es', 'id', 'de', 'pl', 'it', 'pt', 'fr', 'ru', 'fil', 'vi', 'ja', 'sv', 'no', 'nl', 'ar', 'ko', 'th'];

// 读取英文基准文件
const enPath = path.join(localesDir, 'en', 'translation.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

console.log('🔍 深度检查所有语言翻译质量...\n');

const allIssues = {};

// 获取所有键路径
function getAllKeys(obj, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      keys.push({ path, value });
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...getAllKeys(value, path));
    }
  }
  return keys;
}

const enKeys = getAllKeys(enData);

languages.forEach(lang => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${lang.toUpperCase()}: 文件不存在\n`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  const langKeys = getAllKeys(data);
  
  const issues = {
    longUntranslated: [],
    suspiciousPatterns: [],
    missingKeys: [],
    extraLongValues: []
  };
  
  // 检查每个键
  langKeys.forEach(({ path, value }) => {
    // 1. 检查是否有超长的英文文本（可能未翻译）
    if (value.length > 200 && /^[a-zA-Z\s.,!?;:()\-–—'""\[\]{}\/\\]+$/.test(value.substring(0, 100))) {
      issues.longUntranslated.push({
        path,
        length: value.length,
        preview: value.substring(0, 100) + '...'
      });
    }
    
    // 2. 检查可疑的模式（大量重复字符）
    if (/(.{10,})\1{3,}/.test(value)) {
      issues.suspiciousPatterns.push({
        path,
        reason: '包含重复模式',
        preview: value.substring(0, 100) + '...'
      });
    }
    
    // 3. 检查超长值（可能有问题）
    if (value.length > 1500) {
      issues.extraLongValues.push({
        path,
        length: value.length,
        preview: value.substring(0, 100) + '...'
      });
    }
  });
  
  // 4. 检查缺失的键
  const langKeyPaths = new Set(langKeys.map(k => k.path));
  enKeys.forEach(({ path }) => {
    if (!langKeyPaths.has(path)) {
      issues.missingKeys.push(path);
    }
  });
  
  const totalIssues = 
    issues.longUntranslated.length + 
    issues.suspiciousPatterns.length + 
    issues.extraLongValues.length +
    issues.missingKeys.length;
  
  if (totalIssues === 0) {
    console.log(`✅ ${lang.toUpperCase()}: 无问题`);
  } else {
    console.log(`⚠️  ${lang.toUpperCase()}: 发现 ${totalIssues} 个潜在问题`);
    allIssues[lang] = issues;
  }
});

console.log('\n' + '='.repeat(80));

if (Object.keys(allIssues).length > 0) {
  console.log('\n📋 详细问题报告：\n');
  
  Object.entries(allIssues).forEach(([lang, issues]) => {
    console.log(`\n🇺🇳 ${lang.toUpperCase()}`);
    console.log('─'.repeat(80));
    
    if (issues.longUntranslated.length > 0) {
      console.log(`\n  ❌ 长英文文本（可能未翻译）: ${issues.longUntranslated.length} 个`);
      issues.longUntranslated.slice(0, 3).forEach(item => {
        console.log(`     • ${item.path} (${item.length} 字符)`);
        console.log(`       "${item.preview}"`);
      });
      if (issues.longUntranslated.length > 3) {
        console.log(`     ... 还有 ${issues.longUntranslated.length - 3} 个`);
      }
    }
    
    if (issues.suspiciousPatterns.length > 0) {
      console.log(`\n  ⚠️  可疑模式: ${issues.suspiciousPatterns.length} 个`);
      issues.suspiciousPatterns.slice(0, 3).forEach(item => {
        console.log(`     • ${item.path}: ${item.reason}`);
        console.log(`       "${item.preview}"`);
      });
    }
    
    if (issues.extraLongValues.length > 0) {
      console.log(`\n  📏 超长值: ${issues.extraLongValues.length} 个`);
      issues.extraLongValues.slice(0, 3).forEach(item => {
        console.log(`     • ${item.path} (${item.length} 字符)`);
      });
    }
    
    if (issues.missingKeys.length > 0) {
      console.log(`\n  🔑 缺失键: ${issues.missingKeys.length} 个`);
      issues.missingKeys.slice(0, 5).forEach(key => {
        console.log(`     • ${key}`);
      });
      if (issues.missingKeys.length > 5) {
        console.log(`     ... 还有 ${issues.missingKeys.length - 5} 个`);
      }
    }
  });
} else {
  console.log('\n✅ 所有语言文件质量良好！');
}

console.log('\n' + '='.repeat(80));

