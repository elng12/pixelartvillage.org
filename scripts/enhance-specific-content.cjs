#!/usr/bin/env node

/**
 * 特定内容深度翻译增强脚本
 * 针对首页、工具功能等关键内容进行深度翻译改进
 */

const fs = require('fs');
const path = require('path');

// 关键内容的深度翻译
const DEEP_TRANSLATIONS = {
  es: {
    // 首页标题和描述
    "home": {
      "seoTitle": "Convertidor de Imagen a Arte Píxel | Pixel Art Village",
      "seoDescription": "Convierte cualquier foto en arte píxel retro de 8 bits con paletas personalizables, vista previa instantánea, controles de tramado y procesamiento seguro en el navegador, sin registro requerido."
    },
    // 工具相关
    "tool": {
      "title": "Convertidor de Imagen a Arte Píxel",
      "subtitle": "Transforma tus fotos en impresionantes píxeles al instante",
      "dragDrop": "Arrastra y suelta una imagen aquí",
      "orClick": "o haz clic para seleccionar",
      "convertButton": "Convertir a Arte Píxel",
      "processing": "Procesando imagen...",
      "converted": "Imagen convertida exitosamente"
    },
    // 功能特性
    "features": {
      "title": "Características Principales",
      "customPalettes": "Paletas Personalizables",
      "customPalettesDesc": "Elige entre paletas predefinidas o crea tu propia paleta de colores personalizada",
      "realTimePreview": "Vista Previa en Tiempo Real",
      "realTimePreviewDesc": "Ve los cambios instantáneamente mientras ajustas la configuración",
      "multipleFormats": "Múltiples Formatos",
      "multipleFormatsDesc": "Compatible con PNG, JPG, GIF, BMP y formatos de imagen WebP"
    }
  },

  de: {
    // 首页标题和描述
    "home": {
      "seoTitle": "Bild zu Pixel Art Konverter | Pixel Art Village",
      "seoDescription": "Wandle jedes Foto in retro 8-Bit Pixel Art mit anpassbaren Paletten, sofortiger Vorschau, Dithering-Kontrollen und sicherer Browser-Verarbeitung um, ohne Anmeldung erforderlich."
    },
    // 工具相关
    "tool": {
      "title": "Bild zu Pixel Art Konverter",
      "subtitle": "Verwandeln Sie Ihre Fotos sofort in beeindruckende Pixel",
      "dragDrop": "Ziehen Sie ein Bild hierher",
      "orClick": "oder klicken Sie zum Auswählen",
      "convertButton": "In Pixel Art konvertieren",
      "processing": "Bild wird verarbeitet...",
      "converted": "Bild erfolgreich konvertiert"
    },
    // 功能特性
    "features": {
      "title": "Hauptfunktionen",
      "customPalettes": "Anpassbare Paletten",
      "customPalettesDesc": "Wählen Sie aus vordefinierten Paletten oder erstellen Sie Ihre eigene benutzerdefinierte Farbpalette",
      "realTimePreview": "Echtzeit-Vorschau",
      "realTimePreviewDesc": "Sehen Sie Änderungen sofort, während Sie die Einstellungen anpassen",
      "multipleFormats": "Mehrere Formate",
      "multipleFormatsDesc": "Unterstützt PNG, JPG, GIF, BMP und WebP Bildformate"
    }
  },

  fr: {
    // 首页标题和描述
    "home": {
      "seoTitle": "Convertisseur d'Image en Art Pixel | Pixel Art Village",
      "seoDescription": "Transformez n'importe quelle photo en art pixel rétro 8 bits avec des palettes personnalisables, aperçu instantané, contrôles de tramage et traitement sécurisé dans le navigateur, sans inscription requise."
    },
    // 工具相关
    "tool": {
      "title": "Convertisseur d'Image en Art Pixel",
      "subtitle": "Transformez vos photos en pixels impressionnants instantanément",
      "dragDrop": "Glissez et déposez une image ici",
      "orClick": "ou cliquez pour sélectionner",
      "convertButton": "Convertir en Art Pixel",
      "processing": "Traitement de l'image...",
      "converted": "Image convertie avec succès"
    },
    // 功能特性
    "features": {
      "title": "Fonctionnalités Principales",
      "customPalettes": "Palettes Personnalisables",
      "customPalettesDesc": "Choisissez parmi des palettes prédéfinies ou créez votre propre palette de couleurs personnalisée",
      "realTimePreview": "Aperçu en Temps Réel",
      "realTimePreviewDesc": "Voyez les changements instantanément pendant que vous ajustez les paramètres",
      "multipleFormats": "Formats Multiples",
      "multipleFormatsDesc": "Prend en charge les formats d'image PNG, JPG, GIF, BMP et WebP"
    }
  },

  ja: {
    // 首页标题和描述
    "home": {
      "seoTitle": "画像をピクセルアートに変換 | Pixel Art Village",
      "seoDescription": "カスタマイズ可能なパレット、インスタントプレビュー、ディザリング制御、安全なブラウザ内処理で、写真をレトロ8ビットピクセルアートに変換。登録不要。"
    },
    // 工具相关
    "tool": {
      "title": "画像ピクセルアート変換ツール",
      "subtitle": "写真を素晴らしいピクセルアートに瞬時に変換",
      "dragDrop": "ここに画像をドラッグ＆ドロップ",
      "orClick": "またはクリックして選択",
      "convertButton": "ピクセルアートに変換",
      "processing": "画像を処理中...",
      "converted": "画像の変換が完了しました"
    },
    // 功能特性
    "features": {
      "title": "主な機能",
      "customPalettes": "カスタムパレット",
      "customPalettesDesc": "定義済みパレットから選択するか、独自のカスタムカラーパレットを作成",
      "realTimePreview": "リアルタイムプレビュー",
      "realTimePreviewDesc": "設定を調整しながら変更を即座に確認",
      "multipleFormats": "複数のフォーマット",
      "multipleFormatsDesc": "PNG、JPG、GIF、BMP、WebP画像フォーマットをサポート"
    }
  },

  ko: {
    // 首页标题和描述
    "home": {
      "seoTitle": "이미지 픽셀아트 변환기 | Pixel Art Village",
      "seoDescription": "사용자 정의 팔레트, 즉시 미리보기, 디더링 제어, 안전한 브라우저 처리로 모든 사진을 레트로 8비트 픽셀아트로 변환하세요. 가입 필요 없습니다."
    },
    // 工具相关
    "tool": {
      "title": "이미지 픽셀아트 변환기",
      "subtitle": "사진을 즉시 멋진 픽셀아트로 변환하세요",
      "dragDrop": "여기에 이미지를 드래그 앤 드롭하세요",
      "orClick": "또는 클릭하여 선택하세요",
      "convertButton": "픽셀아트로 변환",
      "processing": "이미지 처리 중...",
      "converted": "이미지 변환 완료"
    },
    // 功能特性
    "features": {
      "title": "주요 기능",
      "customPalettes": "사용자 정의 팔레트",
      "customPalettesDesc": "미리 정의된 팔레트에서 선택하거나 자신만의 사용자 정의 색상 팔레트 만들기",
      "realTimePreview": "실시간 미리보기",
      "realTimePreviewDesc": "설정을 조정하면서 변경 사항을 즉시 확인",
      "multipleFormats": "여러 형식",
      "multipleFormatsDesc": "PNG, JPG, GIF, BMP 및 WebP 이미지 형식 지원"
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
    console.log(`✅ 已保存深度翻译: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`错误: 无法保存翻译文件 ${filePath}:`, error.message);
    return false;
  }
}

function mergeDeepTranslations(target, source) {
  let changes = 0;

  function merge(targetObj, sourceObj, path = '') {
    for (const [key, value] of Object.entries(sourceObj)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof value === 'string') {
        if (targetObj[key] !== value) {
          const oldValue = targetObj[key];
          targetObj[key] = value;
          console.log(`  ${currentPath}: "${oldValue}" → "${value}"`);
          changes++;
        }
      } else if (typeof value === 'object' && value !== null) {
        if (!targetObj[key] || typeof targetObj[key] !== 'object') {
          targetObj[key] = {};
        }
        changes += merge(targetObj[key], value, currentPath);
      }
    }
    return changes;
  }

  return merge(target, source);
}

function main() {
  console.log('🚀 开始深度内容翻译增强...\n');

  for (const [locale, translations] of Object.entries(DEEP_TRANSLATIONS)) {
    console.log(`\n📝 深度翻译增强: ${locale.toUpperCase()}`);

    const data = loadTranslationFile(locale);
    if (!data) continue;

    const changes = mergeDeepTranslations(data, translations);

    if (changes > 0) {
      saveTranslationFile(locale, data);
      console.log(`  ✅ 完成 ${changes} 项深度翻译改进`);
    } else {
      console.log(`  ℹ️  无需改进`);
    }
  }

  console.log('\n🎉 深度内容翻译增强完成！');
  console.log('\n下一步建议:');
  console.log('1. 测试网站在改进后的语言下的用户体验');
  console.log('2. 验证SEO标题和描述是否符合搜索引擎要求');
  console.log('3. 检查UI元素是否因文本长度变化而影响布局');
}

if (require.main === module) {
  main();
}

module.exports = { main, mergeDeepTranslations };