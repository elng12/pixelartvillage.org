#!/usr/bin/env node

/**
 * 翻译质量改进脚本
 * 自动检测和修复常见的翻译问题
 */

const fs = require('fs');
const path = require('path');

// 需要重点改进的核心语言
const PRIORITY_LANGUAGES = ['es', 'de', 'fr', 'ja', 'ko'];
const ALL_LANGUAGES = ['es', 'de', 'fr', 'ja', 'ko', 'pt', 'ru', 'it', 'nl', 'sv', 'no', 'pl', 'fil', 'vi', 'th', 'id', 'ar'];

// 常见的翻译改进规则
const TRANSLATION_IMPROVEMENTS = {
  es: {
    "Frequently asked questions": "Preguntas frecuentes",
    "Terms": "Términos",
    "About": "Acerca de",
    "Explore": "Explorar",
    "Community": "Comunidad",
    "How it works": "Cómo funciona",
    "Features": "Características",
    "Examples": "Ejemplos",
    "Start": "Inicio",
    "Contact": "Contacto",
    "Error": "Error",
    "Failed": "Error",
    "Success": "Éxito",
    "Loading...": "Cargando...",
    "Image failed to load": "Error al cargar la imagen",
    "Image unavailable": "Imagen no disponible",
    "Last updated: {{date}}": "Última actualización: {{date}}",
    "Start now": "Comenzar ahora",
    "© {{year}} Pixel Art Village. All rights reserved.": "© {{year}} Pixel Art Village. Todos los derechos reservados."
  },

  de: {
    "Frequently asked questions": "Häufig gestellte Fragen",
    "Terms": "Bedingungen",
    "About": "Über uns",
    "Explore": "Erkunden",
    "Community": "Community",
    "How it works": "Wie es funktioniert",
    "Features": "Funktionen",
    "Examples": "Beispiele",
    "Start": "Start",
    "Contact": "Kontakt",
    "Error": "Fehler",
    "Failed": "Fehlgeschlagen",
    "Success": "Erfolg",
    "Loading...": "Laden...",
    "Image failed to load": "Bild konnte nicht geladen werden",
    "Image unavailable": "Bild nicht verfügbar",
    "Last updated: {{date}}": "Zuletzt aktualisiert: {{date}}",
    "Start now": "Jetzt starten",
    "© {{year}} Pixel Art Village. All rights reserved.": "© {{year}} Pixel Art Village. Alle Rechte vorbehalten."
  },

  fr: {
    "Frequently asked questions": "Questions fréquemment posées",
    "Terms": "Conditions",
    "About": "À propos",
    "Explore": "Explorer",
    "Community": "Communauté",
    "How it works": "Comment ça fonctionne",
    "Features": "Fonctionnalités",
    "Examples": "Exemples",
    "Start": "Accueil",
    "Contact": "Contact",
    "Error": "Erreur",
    "Failed": "Échec",
    "Success": "Succès",
    "Loading...": "Chargement...",
    "Image failed to load": "L'image n'a pas pu être chargée",
    "Image unavailable": "Image non disponible",
    "Last updated: {{date}}": "Dernière mise à jour : {{date}}",
    "Start now": "Commencer maintenant",
    "© {{year}} Pixel Art Village. All rights reserved.": "© {{year}} Pixel Art Village. Tous droits réservés."
  },

  ja: {
    "Frequently asked questions": "よくある質問",
    "Terms": "利用規約",
    "About": "について",
    "Explore": "探索",
    "Community": "コミュニティ",
    "How it works": "使い方",
    "Features": "機能",
    "Examples": "例",
    "Start": "ホーム",
    "Contact": "お問い合わせ",
    "Error": "エラー",
    "Failed": "失敗",
    "Success": "成功",
    "Loading...": "読み込み中...",
    "Image failed to load": "画像の読み込みに失敗しました",
    "Image unavailable": "画像は利用できません",
    "Last updated: {{date}}": "最終更新日: {{date}}",
    "Start now": "今すぐ始める",
    "© {{year}} Pixel Art Village. All rights reserved.": "© {{year}} Pixel Art Village. すべての権利を保有。"
  },

  ko: {
    "Frequently asked questions": "자주 묻는 질문",
    "Terms": "약관",
    "About": "소개",
    "Explore": "탐색",
    "Community": "커뮤니티",
    "How it works": "작동 방식",
    "Features": "기능",
    "Examples": "예제",
    "Start": "홈",
    "Contact": "연락처",
    "Error": "오류",
    "Failed": "실패",
    "Success": "성공",
    "Loading...": "로딩 중...",
    "Image failed to load": "이미지 로드 실패",
    "Image unavailable": "이미지를 사용할 수 없음",
    "Last updated: {{date}}": "마지막 업데이트: {{date}}",
    "Start now": "지금 시작하기",
    "© {{year}} Pixel Art Village. All rights reserved.": "© {{year}} Pixel Art Village. 모든 권리 보유."
  }
};

// 常见的不一致翻译修正
const CONSISTENCY_FIXES = {
  es: {
    "Start": "Inicio", // 统一导航中的"Start"为"Inicio"
    "Error": "Error", // 统一错误信息
    "Failed": "Error" // 统一失败状态
  },
  de: {
    "Error": "Fehler", // 德语Error应该是Fehler
    "Failed": "Fehlgeschlagen" // 保持更准确的翻译
  },
  fr: {
    "Error": "Erreur", // 法语Error应该是Erreur
    "Failed": "Échec"  // 保持更准确的翻译
  }
};

function loadTranslationFile(locale) {
  const filePath = path.join('public', 'locales', locale, 'translation.json');
  if (!fs.existsSync(filePath)) {
    console.warn(`警告: 翻译文件不存在: ${filePath}`);
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`错误: 无法解析翻译文件 ${filePath}:`, error.message);
    return null;
  }
}

function saveTranslationFile(locale, data) {
  const filePath = path.join('public', 'locales', locale, 'translation.json');

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`✅ 已保存: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`错误: 无法保存翻译文件 ${filePath}:`, error.message);
    return false;
  }
}

function improveObject(obj, improvements, path = '') {
  let changes = 0;

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;

    if (typeof value === 'string') {
      // 检查是否有预定义的改进
      if (improvements[value]) {
        const oldValue = obj[key];
        obj[key] = improvements[value];
        console.log(`  ${currentPath}: "${oldValue}" → "${improvements[value]}"`);
        changes++;
      }
    } else if (typeof value === 'object' && value !== null) {
      changes += improveObject(value, improvements, currentPath);
    }
  }

  return changes;
}

function analyzeTranslationQuality(locale, data) {
  const enData = loadTranslationFile('en');
  if (!enData) return { total: 0, translated: 0, quality: 0 };

  let totalKeys = 0;
  let likelyTranslated = 0;
  let issues = [];

  function analyze(obj, enObj, path = '') {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      totalKeys++;

      if (typeof value === 'string') {
        const enValue = enObj?.[key];

        if (value === enValue) {
          issues.push(`未翻译: ${currentPath}`);
        } else if (value.trim().length > 5 && !value.includes('same as English')) {
          likelyTranslated++;
        }
      } else if (typeof value === 'object' && value !== null) {
        analyze(value, enObj?.[key], currentPath);
      }
    }
  }

  analyze(data, enData);

  const quality = totalKeys > 0 ? (likelyTranslated / totalKeys * 100) : 0;

  return {
    total: totalKeys,
    translated: likelyTranslated,
    quality: Math.round(quality * 10) / 10,
    issues: issues.slice(0, 5) // 只显示前5个问题
  };
}

function main() {
  console.log('🚀 开始翻译质量改进...\n');

  // 改进优先语言
  for (const locale of PRIORITY_LANGUAGES) {
    console.log(`\n📝 处理语言: ${locale.toUpperCase()}`);

    const data = loadTranslationFile(locale);
    if (!data) continue;

    // 应用一致性修正
    const consistencyFixes = CONSISTENCY_FIXES[locale] || {};
    let totalChanges = 0;

    totalChanges += improveObject(data, consistencyFixes);
    totalChanges += improveObject(data, TRANSLATION_IMPROVEMENTS[locale] || {});

    if (totalChanges > 0) {
      saveTranslationFile(locale, data);
      console.log(`  ✅ 完成 ${totalChanges} 项改进`);
    } else {
      console.log(`  ℹ️  无需改进`);
    }

    // 分析改进后的质量
    const quality = analyzeTranslationQuality(locale, data);
    console.log(`  📊 翻译质量: ${quality.quality}% (${quality.translated}/${quality.total})`);

    if (quality.issues.length > 0) {
      console.log(`  ⚠️  主要问题:`);
      quality.issues.forEach(issue => console.log(`     - ${issue}`));
    }
  }

  console.log('\n🎉 翻译质量改进完成！');
  console.log('\n建议后续步骤:');
  console.log('1. 手动审校关键页面的翻译');
  console.log('2. 使用专业翻译服务改进深度内容');
  console.log('3. 运行 npm run i18n:check 验证一致性');
  console.log('4. 测试网站在不同语言下的表现');
}

if (require.main === module) {
  main();
}

module.exports = { main, improveObject, analyzeTranslationQuality };