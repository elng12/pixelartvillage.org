#!/usr/bin/env node

/**
 * 完成所有语言的基本翻译同步
 * 将新添加的键同步到所有语言文件
 */

const fs = require('fs');
const path = require('path');

// 所有需要同步的语言
const ALL_LANGUAGES = ['es', 'de', 'fr', 'ja', 'ko', 'pt', 'ru', 'it', 'nl', 'sv', 'nb', 'pl', 'tl', 'vi', 'th', 'id', 'ar'];

// 基础翻译模板（对于缺失的键提供基本翻译）
const BASIC_TRANSLATIONS = {
  tool: {
    dragDrop: "Drag and drop image here",
    orClick: "or click to choose",
    convertButton: "Convert to Pixel Art",
    processing: "Processing...",
    converted: "Successfully converted"
  },
  features: {
    customPalettes: "Custom Palettes",
    customPalettesDesc: "Choose from predefined palettes or create your own custom color palette",
    realTimePreview: "Real-time Preview",
    realTimePreviewDesc: "See changes instantly as you adjust settings",
    multipleFormats: "Multiple Formats",
    multipleFormatsDesc: "Supports PNG, JPG, GIF, BMP and WebP image formats"
  }
};

// 语言特定的基础翻译
const LANGUAGE_SPECIFIC = {
  es: {
    tool: {
      dragDrop: "Arrastra y suelta una imagen aquí",
      orClick: "o haz clic para seleccionar",
      convertButton: "Convertir a Arte Píxel",
      processing: "Procesando...",
      converted: "Convertido exitosamente"
    },
    features: {
      customPalettes: "Paletas Personalizables",
      customPalettesDesc: "Elige entre paletas predefinidas o crea tu propia paleta de colores",
      realTimePreview: "Vista Previa en Tiempo Real",
      realTimePreviewDesc: "Ve los cambios instantáneamente mientras ajustas la configuración",
      multipleFormats: "Múltiples Formatos",
      multipleFormatsDesc: "Compatible con PNG, JPG, GIF, BMP y formatos de imagen WebP"
    }
  },

  de: {
    tool: {
      dragDrop: "Ziehen Sie ein Bild hierher",
      orClick: "oder klicken Sie zum Auswählen",
      convertButton: "In Pixel Art konvertieren",
      processing: "Verarbeitung...",
      converted: "Erfolgreich konvertiert"
    },
    features: {
      customPalettes: "Anpassbare Paletten",
      customPalettesDesc: "Wählen Sie aus vordefinierten Paletten oder erstellen Sie Ihre eigene Farbpalette",
      realTimePreview: "Echtzeit-Vorschau",
      realTimePreviewDesc: "Änderungen sofort sehen während Sie Einstellungen anpassen",
      multipleFormats: "Mehrere Formate",
      multipleFormatsDesc: "Unterstützt PNG, JPG, GIF, BMP und WebP Bildformate"
    }
  },

  fr: {
    tool: {
      dragDrop: "Glissez et déposez une image ici",
      orClick: "ou cliquez pour sélectionner",
      convertButton: "Convertir en Art Pixel",
      processing: "Traitement...",
      converted: "Converti avec succès"
    },
    features: {
      customPalettes: "Palettes Personnalisables",
      customPalettesDesc: "Choisissez parmi des palettes prédéfinies ou créez votre propre palette de couleurs",
      realTimePreview: "Aperçu en Temps Réel",
      realTimePreviewDesc: "Voyez les changements instantanément pendant que vous ajustez les paramètres",
      multipleFormats: "Formats Multiples",
      multipleFormatsDesc: "Prend en charge les formats d'image PNG, JPG, GIF, BMP et WebP"
    }
  },

  ja: {
    tool: {
      dragDrop: "ここに画像をドラッグ＆ドロップ",
      orClick: "またはクリックして選択",
      convertButton: "ピクセルアートに変換",
      processing: "処理中...",
      converted: "変換完了"
    },
    features: {
      customPalettes: "カスタムパレット",
      customPalettesDesc: "定義済みパレットから選択するか、独自のカスタムカラーパレットを作成",
      realTimePreview: "リアルタイムプレビュー",
      realTimePreviewDesc: "設定を調整しながら変更を即座に確認",
      multipleFormats: "複数のフォーマット",
      multipleFormatsDesc: "PNG、JPG、GIF、BMP、WebP画像フォーマットをサポート"
    }
  },

  ko: {
    tool: {
      dragDrop: "여기에 이미지를 드래그 앤 드롭하세요",
      orClick: "또는 클릭하여 선택하세요",
      convertButton: "픽셀아트로 변환",
      processing: "처리 중...",
      converted: "변환 완료"
    },
    features: {
      customPalettes: "사용자 정의 팔레트",
      customPalettesDesc: "미리 정의된 팔레트에서 선택하거나 자신만의 사용자 정의 색상 팔레트 만들기",
      realTimePreview: "실시간 미리보기",
      realTimePreviewDesc: "설정을 조정하면서 변경 사항을 즉시 확인",
      multipleFormats: "여러 형식",
      multipleFormatsDesc: "PNG, JPG, GIF, BMP 및 WebP 이미지 형식 지원"
    }
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
    console.log(`✅ 已更新: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`错误: 无法保存翻译文件 ${filePath}:`, error.message);
    return false;
  }
}

function addMissingKeys(targetData, sourceData, path = '') {
  let addedKeys = 0;

  for (const [key, value] of Object.entries(sourceData)) {
    const currentPath = path ? `${path}.${key}` : key;

    if (!(key in targetData)) {
      targetData[key] = value;
      console.log(`  ➕ 添加键: ${currentPath}`);
      addedKeys++;
    } else if (typeof value === 'object' && value !== null && typeof targetData[key] === 'object') {
      addedKeys += addMissingKeys(targetData[key], value, currentPath);
    }
  }

  return addedKeys;
}

function main() {
  console.log('🔧 完成所有语言的基本翻译同步...\n');

  let totalAdded = 0;
  let processedCount = 0;

  for (const locale of ALL_LANGUAGES) {
    console.log(`📝 处理语言: ${locale.toUpperCase()}`);

    const data = loadTranslationFile(locale);
    if (!data) {
      console.log(`  ❌ 跳过：文件不存在`);
      continue;
    }

    const translations = LANGUAGE_SPECIFIC[locale] || BASIC_TRANSLATIONS;
    const addedKeys = addMissingKeys(data, translations);

    if (addedKeys > 0) {
      saveTranslationFile(locale, data);
      console.log(`  ✅ 已添加 ${addedKeys} 个键`);
    } else {
      console.log(`  ℹ️  无需添加键`);
    }

    totalAdded += addedKeys;
    processedCount++;
  }

  console.log(`\n🎉 完成！处理了 ${processedCount} 个语言，总计添加 ${totalAdded} 个键`);
  console.log('\n现在运行 npm run i18n:check 验证一致性');
}

if (require.main === module) {
  main();
}

module.exports = { main, addMissingKeys };
