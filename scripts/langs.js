// 网站支持的所有语言 - 修复SEO多语言sitemap生成
// 基于实际public/locales目录配置，确保sitemap包含所有语言版本
export const langs = [
  { code: 'en', name: 'English' },    // 默认语言放在第一位，无URL前缀
  { code: 'ar', name: 'العربية' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'fil', name: 'Filipino' },
  { code: 'fr', name: 'Français' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'it', name: 'Italiano' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'no', name: 'Norsk' },
  { code: 'pl', name: 'Polski' },
  { code: 'pt', name: 'Português' },
  { code: 'pseudo', name: 'Pseudo' }, // 用于测试的伪语言
  { code: 'ru', name: 'Русский' },
  { code: 'sv', name: 'Svenska' },
  { code: 'th', name: 'ไทย' },
  { code: 'vi', name: 'Tiếng Việt' }
];
