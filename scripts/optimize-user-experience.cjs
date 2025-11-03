#!/usr/bin/env node

/**
 * 用户体验优化脚本
 * 专注于细节翻译和本地化体验
 */

const fs = require('fs');
const path = require('path');

// 用户体验细节优化
const UX_OPTIMIZATIONS = {
  es: {
    // 错误和成功消息优化
    common: {
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
      failed: "Fallo",
      imageFailedToLoad: "No se pudo cargar la imagen",
      imageUnavailable: "Imagen no disponible",
      lastUpdated: "Última actualización: {{date}}"
    },
    // 页脚链接描述优化
    footer: {
      github: "GitHub",
      links: {
        generator: "Generador de imágenes digitales con paleta personalizada",
        converter: "Convertidor de imagen a arte píxel con paleta personalizada",
        imageToPixel: "Imagen a arte píxel con paletas",
        makePixelArt: "Crea visuales de arte píxel con controles de paleta",
        png2pixel: "PNG a arte píxel con paleta",
        jpg2pixel: "JPG a arte píxel con paletas personalizadas",
        img2pixel: "IMG a arte píxel con opciones de paleta",
        gridPreview: "Vista previa de cuadrícula de píxeles",
        how: "Cómo funciona",
        start: "Comenzar en Pixel Art Village",
        tips: "Consejos y paletas",
        privacyLocal: "Privacidad y procesamiento local"
      }
    },
    // 博客内容优化
    blog: {
      title: "Blog",
      subtitle: "Artículos y actualizaciones sobre la creación de visuales de arte píxel, tutoriales y nuevas funciones.",
      back: "Volver al Blog",
      notFound: {
        title: "Artículo no encontrado",
        desc: "El artículo que buscas no existe. Vuelve al blog."
      }
    }
  },

  de: {
    // 错误和成功消息优化
    common: {
      loading: "Laden...",
      error: "Fehler",
      success: "Erfolg",
      failed: "Fehlgeschlagen",
      imageFailedToLoad: "Bild konnte nicht geladen werden",
      imageUnavailable: "Bild nicht verfügbar",
      lastUpdated: "Zuletzt aktualisiert: {{date}}"
    },
    // 页脚链接描述优化
    footer: {
      github: "GitHub",
      links: {
        generator: "Digitaler Bildgenerator mit benutzerdefinierter Palette",
        converter: "Bild zu Pixel Art Konverter mit benutzerdefinierter Palette",
        imageToPixel: "Bild zu Pixel Art mit Paletten",
        makePixelArt: "Pixel-Art-Grafiken mit Paletten-Steuerung erstellen",
        png2pixel: "PNG zu Pixel Art mit Palette",
        jpg2pixel: "JPG zu Pixel Art mit benutzerdefinierten Paletten",
        img2pixel: "IMG zu Pixel Art mit Paletten-Optionen",
        gridPreview: "Pixel-Raster-Vorschau",
        how: "Wie es funktioniert",
        start: "Starten in Pixel Art Village",
        tips: "Tipps & Paletten",
        privacyLocal: "Datenschutz & lokale Verarbeitung"
      }
    },
    // 博客内容优化
    blog: {
      title: "Blog",
      subtitle: "Artikel und Updates zur Erstellung von Pixel-Art-Grafiken, Tutorials und neue Funktionen.",
      back: "Zurück zum Blog",
      notFound: {
        title: "Beitrag nicht gefunden",
        desc: "Der gesuchte Artikel existiert nicht. Gehen Sie zurück zum Blog."
      }
    }
  },

  fr: {
    // 错误和成功消息优化
    common: {
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
      failed: "Échec",
      imageFailedToLoad: "L'image n'a pas pu être chargée",
      imageUnavailable: "Image non disponible",
      lastUpdated: "Dernière mise à jour : {{date}}"
    },
    // 页脚链接描述优化
    footer: {
      github: "GitHub",
      links: {
        generator: "Générateur d'images numériques avec palette personnalisée",
        converter: "Convertisseur d'image en art pixel avec palette personnalisée",
        imageToPixel: "Image en art pixel avec palettes",
        makePixelArt: "Créez des visuels d'art pixel avec contrôles de palette",
        png2pixel: "PNG en art pixel avec palette",
        jpg2pixel: "JPG en art pixel avec palettes personnalisées",
        img2pixel: "IMG en art pixel avec options de palette",
        gridPreview: "Aperçu de grille de pixels",
        how: "Comment ça fonctionne",
        start: "Commencer dans Pixel Art Village",
        tips: "Conseils & palettes",
        privacyLocal: "Confidentialité et traitement local"
      }
    },
    // 博客内容优化
    blog: {
      title: "Blog",
      subtitle: "Articles et mises à jour sur la création de visuels d'art pixel, tutoriels et nouvelles fonctionnalités.",
      back: "Retour au Blog",
      notFound: {
        title: "Article non trouvé",
        desc: "L'article que vous recherchez n'existe pas. Retournez au blog."
      }
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
    console.log(`✅ 已优化用户体验: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`错误: 无法保存 ${filePath}:`, error.message);
    return false;
  }
}

function optimizeUXObject(target, source, path = '') {
  let changes = 0;

  for (const [key, value] of Object.entries(source)) {
    const currentPath = path ? `${path}.${key}` : key;

    if (typeof value === 'string') {
      if (target[key] !== value) {
        const oldValue = target[key] || '未定义';
        target[key] = value;
        console.log(`  💫 ${currentPath}: "${oldValue}" → "${value}"`);
        changes++;
      }
    } else if (typeof value === 'object' && value !== null) {
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      changes += optimizeUXObject(target[key], value, currentPath);
    }
  }

  return changes;
}

function main() {
  console.log('✨ 开始用户体验优化...\n');

  const targetLocales = ['es', 'de', 'fr'];
  let totalChanges = 0;

  for (const locale of targetLocales) {
    console.log(`🎨 用户体验优化: ${locale.toUpperCase()}`);

    const data = loadTranslationFile(locale);
    if (!data) continue;

    const optimizations = UX_OPTIMIZATIONS[locale];
    if (!optimizations) continue;

    const changes = optimizeUXObject(data, optimizations);
    totalChanges += changes;

    if (changes > 0) {
      saveTranslationFile(locale, data);
      console.log(`  ✅ 完成 ${changes} 项用户体验优化`);
    } else {
      console.log(`  ℹ️  无需优化`);
    }
    console.log('');
  }

  console.log(`🎉 用户体验优化完成！总计优化 ${totalChanges} 项细节`);
  console.log('\n改进成果:');
  console.log('✨ 错误消息更加友好自然');
  console.log('✨ 页脚链接描述更专业');
  console.log('✨ 博客内容完全本地化');
  console.log('✨ 用户体验细节完善');
}

if (require.main === module) {
  main();
}

module.exports = { main, optimizeUXObject };