#!/usr/bin/env node

/**
 * 深度翻译增强脚本
 * 针对关键缺口进行专业级翻译改进
 */

const fs = require('fs');
const path = require('path');

// 专业级深度翻译内容
const PROFESSIONAL_TRANSLATIONS = {
  es: {
    // 工具部分完整翻译
    tool: {
      title: "Convertidor de Imagen a Arte Píxel con Paleta Personalizada",
      subtitle: "Transforma fotos en impresionantes píxeles al instante",
      subtitle2: "Tamaño de píxel ajustable y paletas personalizadas. Perfecto para sprites, iconos y gráficos de juegos retro con opciones avanzadas de paleta.",
      dragOrClick: "Arrastra tu imagen aquí o",
      clickToChoose: "haz clic para elegir",
      dropZone: "Zona de arrastre",
      processing: "Procesando imagen...",
      converted: "¡Imagen convertida exitosamente!",
      downloadButton: "Descargar imagen",
      resetButton: "Nueva imagen",
      pixelSize: "Tamaño de píxel",
      colorPalette: "Paleta de colores",
      dithering: "Tramado",
      preview: "Vista previa",
      original: "Original",
      result: "Resultado"
    },
    // 功能特性完整翻译
    features: {
      title: "Características Principales",
      customPalettes: "Paletas Personalizables",
      customPalettesDesc: "Elige entre paletas predefinidas o crea tu propia paleta de colores personalizada",
      realTimePreview: "Vista Previa en Tiempo Real",
      realTimePreviewDesc: "Ve los cambios instantáneamente mientras ajustas la configuración",
      multipleFormats: "Múltiples Formatos",
      multipleFormatsDesc: "Compatible con PNG, JPG, GIF, BMP y formatos de imagen WebP",
      highQuality: "Alta Calidad",
      highQualityDesc: "Exporta imágenes de alta calidad perfectas para tu proyecto",
      easyToUse: "Fácil de Usar",
      easyToUseDesc: "Interfaz intuitiva diseñada para artistas y desarrolladores"
    },
    // 导航完整翻译
    nav: {
      examples: "Ejemplos",
      features: "Características",
      how: "Cómo funciona",
      faq: "Preguntas Frecuentes",
      blog: "Blog",
      home: "Inicio",
      about: "Acerca de",
      contact: "Contacto"
    }
  },

  de: {
    // 工具部分完整翻译
    tool: {
      title: "Bild zu Pixel Art Konverter mit benutzerdefinierter Palette",
      subtitle: "Verwandeln Sie Ihre Fotos sofort in beeindruckende Pixel",
      subtitle2: "Anpassbare Pixelgröße und benutzerdefinierte Paletten. Perfekt für Sprites, Symbole und Retro-Spiel-Grafiken mit erweiterten Paletten-Optionen.",
      dragOrClick: "Ziehen Sie Ihr Bild hierher oder",
      clickToChoose: "klicken Sie zum Auswählen",
      dropZone: "Drop-Zone",
      processing: "Bild wird verarbeitet...",
      converted: "Bild erfolgreich konvertiert!",
      downloadButton: "Bild herunterladen",
      resetButton: "Neues Bild",
      pixelSize: "Pixelgröße",
      colorPalette: "Farbpalette",
      dithering: "Dithering",
      preview: "Vorschau",
      original: "Original",
      result: "Ergebnis"
    },
    // 功能特性完整翻译
    features: {
      title: "Hauptfunktionen",
      customPalettes: "Anpassbare Paletten",
      customPalettesDesc: "Wählen Sie aus vordefinierten Paletten oder erstellen Sie Ihre eigene benutzerdefinierte Farbpalette",
      realTimePreview: "Echtzeit-Vorschau",
      realTimePreviewDesc: "Änderungen sofort sehen, während Sie die Einstellungen anpassen",
      multipleFormats: "Mehrere Formate",
      multipleFormatsDesc: "Unterstützt PNG, JPG, GIF, BMP und WebP Bildformate",
      highQuality: "Hohe Qualität",
      highQualityDesc: "Exportieren Sie hochwertige Bilder, perfekt für Ihr Projekt",
      easyToUse: "Einfach zu verwenden",
      easyToUseDesc: "Intuitive Benutzeroberfläche für Künstler und Entwickler"
    },
    // 导航完整翻译
    nav: {
      examples: "Beispiele",
      features: "Funktionen",
      how: "Wie es funktioniert",
      faq: "Häufig gestellte Fragen",
      blog: "Blog",
      home: "Start",
      about: "Über uns",
      contact: "Kontakt"
    }
  },

  fr: {
    // 工具部分完整翻译
    tool: {
      title: "Convertisseur d'Image en Art Pixel avec Palette Personnalisée",
      subtitle: "Transformez vos photos en pixels impressionnants instantanément",
      subtitle2: "Taille de pixel ajustable et palettes personnalisables. Parfait pour sprites, icônes et graphiques de jeux rétro avec options avancées de palette.",
      dragOrClick: "Glissez votre image ici ou",
      clickToChoose: "cliquez pour choisir",
      dropZone: "Zone de dépôt",
      processing: "Traitement de l'image...",
      converted: "Image convertie avec succès !",
      downloadButton: "Télécharger l'image",
      resetButton: "Nouvelle image",
      pixelSize: "Taille de pixel",
      colorPalette: "Palette de couleurs",
      dithering: "Tramage",
      preview: "Aperçu",
      original: "Original",
      result: "Résultat"
    },
    // 功能特性完整翻译
    features: {
      title: "Fonctionnalités Principales",
      customPalettes: "Palettes Personnalisables",
      customPalettesDesc: "Choisissez parmi des palettes prédéfinies ou créez votre propre palette de couleurs personnalisée",
      realTimePreview: "Aperçu en Temps Réel",
      realTimePreviewDesc: "Voyez les changements instantanément pendant que vous ajustez les paramètres",
      multipleFormats: "Formats Multiples",
      multipleFormatsDesc: "Prend en charge les formats d'image PNG, JPG, GIF, BMP et WebP",
      highQuality: "Haute Qualité",
      highQualityDesc: "Exportez des images haute qualité parfaites pour votre projet",
      easyToUse: "Facile à Utiliser",
      easyToUseDesc: "Interface intuitive conçue pour les artistes et développeurs"
    },
    // 导航完整翻译
    nav: {
      examples: "Exemples",
      features: "Fonctionnalités",
      how: "Comment ça fonctionne",
      faq: "Questions Fréquemment Posées",
      blog: "Blog",
      home: "Accueil",
      about: "À propos",
      contact: "Contact"
    }
  }
};

function loadTranslationFile(locale) {
  const filePath = path.join('public', 'locales', locale, 'translation.json');
  if (!fs.existsSync(filePath)) return null;

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`错误: 无法解析 ${filePath}:`, error.message);
    return null;
  }
}

function saveTranslationFile(locale, data) {
  const filePath = path.join('public', 'locales', locale, 'translation.json');

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`✅ 已深度优化: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`错误: 无法保存 ${filePath}:`, error.message);
    return false;
  }
}

function deepEnhanceObject(target, source, path = '') {
  let changes = 0;

  for (const [key, value] of Object.entries(source)) {
    const currentPath = path ? `${path}.${key}` : key;

    if (typeof value === 'string') {
      if (target[key] !== value) {
        const oldValue = target[key] || '未定义';
        target[key] = value;
        console.log(`  🎨 ${currentPath}: "${oldValue}" → "${value}"`);
        changes++;
      }
    } else if (typeof value === 'object' && value !== null) {
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      changes += deepEnhanceObject(target[key], value, currentPath);
    }
  }

  return changes;
}

function main() {
  console.log('🚀 开始深度翻译增强...\n');

  const targetLocales = ['es', 'de', 'fr'];
  let totalChanges = 0;

  for (const locale of targetLocales) {
    console.log(`📝 深度优化: ${locale.toUpperCase()}`);

    const data = loadTranslationFile(locale);
    if (!data) continue;

    const translations = PROFESSIONAL_TRANSLATIONS[locale];
    if (!translations) continue;

    const changes = deepEnhanceObject(data, translations);
    totalChanges += changes;

    if (changes > 0) {
      saveTranslationFile(locale, data);
      console.log(`  ✅ 完成 ${changes} 项深度优化`);
    } else {
      console.log(`  ℹ️  无需优化`);
    }
    console.log('');
  }

  console.log(`🎉 深度翻译增强完成！总计优化 ${totalChanges} 项内容`);
  console.log('\n下一步建议:');
  console.log('1. 测试优化后的语言版本');
  console.log('2. 检查UI布局是否受文本长度影响');
  console.log('3. 验证所有交互功能正常工作');
}

if (require.main === module) {
  main();
}

module.exports = { main, deepEnhanceObject };