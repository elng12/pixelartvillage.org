// Auto-generate sitemap.xml at build time with current date as lastmod (CommonJS)
// 优化：包含所有可索引语言版本，保证多语言页面可被收录
const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://pixelartvillage.org/';
const localeConfig = require(path.resolve(__dirname, '..', 'config', 'locales.json'));
const DEFAULT_LANG = (localeConfig && localeConfig.default) || 'en';
const SUPPORTED_LANGS = Array.from(new Set((localeConfig && localeConfig.supported) || [DEFAULT_LANG]));
const OTHER_LANGS = SUPPORTED_LANGS.filter((lang) => lang && lang !== DEFAULT_LANG);
const outPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');

function loadContent(baseName) {
  const attempts = [
    path.resolve(__dirname, `../src/content/${baseName}.en.json`),
    path.resolve(__dirname, `../src/content/${baseName}.json`),
  ];
  for (const filePath of attempts) {
    if (fs.existsSync(filePath)) {
      try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch (error) {
        console.warn(`[sitemap] warn: failed to parse ${path.basename(filePath)} -> ${error.message}`);
        return [];
      }
    }
  }
  console.warn(`[sitemap] warn: content source not found for ${baseName}`);
  return [];
}

// ISO date YYYY-MM-DD
const today = new Date();
const isoDate = today.toISOString().slice(0, 10);

// 基础路径（会扩展到所有支持语言）
const BASE_PATHS = ['/', '/privacy', '/terms', '/about', '/contact', '/blog'];
const PATHS = [];

// Include blog posts & pSEO pages (用于扩展多语言路径)
const blogPosts = loadContent('blog-posts');
const pseoPages = loadContent('pseo-pages');

function localizePath(p, lang) {
  const clean = p.startsWith('/') ? p : `/${p}`;
  if (lang === DEFAULT_LANG) return clean;
  if (clean === '/') return `/${lang}`;
  return `/${lang}${clean}`;
}

function stripLangPrefix(p) {
  const clean = p === '/' ? '/' : p.replace(/\/+$/, '');
  const parts = clean.split('/').filter(Boolean);
  if (parts.length && OTHER_LANGS.includes(parts[0])) {
    return '/' + parts.slice(1).join('/');
  }
  return clean;
}

function addPathForLangs(p) {
  for (const lang of SUPPORTED_LANGS) {
    PATHS.push(localizePath(p, lang));
  }
}

// 扩展基础路径到所有语言版本
for (const p of BASE_PATHS) addPathForLangs(p);

// 扩展博客与 pSEO 页面到所有语言版本
for (const p of blogPosts) {
  if (p && p.slug) addPathForLangs(`/blog/${p.slug}`);
}
for (const p of pseoPages) {
  if (p && p.slug) addPathForLangs(`/converter/${p.slug}`);
}

// 可选：生成 hreflang sitemap 供参考
const generateHreflangSitemap = () => {
  const HREFLANG_PATHS = [];

  for (const p of BASE_PATHS) {
    for (const l of OTHER_LANGS) {
      HREFLANG_PATHS.push(localizePath(p, l));
    }
  }

  for (const p of blogPosts) {
    if (p && p.slug) {
      for (const l of OTHER_LANGS) {
        HREFLANG_PATHS.push(localizePath(`/blog/${p.slug}`, l));
      }
    }
  }

  for (const p of pseoPages) {
    if (p && p.slug) {
      for (const l of OTHER_LANGS) {
        HREFLANG_PATHS.push(localizePath(`/converter/${p.slug}`, l));
      }
    }
  }

  return HREFLANG_PATHS;
}

function withSlash(p) {
  if (!p || p === '/') return '/';
  return p.endsWith('/') ? p : p + '/';
}

// 生成主 sitemap（包含所有可索引语言版本）
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- 优化站点地图：包含所有可索引语言版本 -->
<!-- 生成时间: ${new Date().toISOString()} -->
<!-- URL总数: ${PATHS.length} (全量多语言) -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PATHS.map((p) => {
  const basePath = stripLangPrefix(p);
  const priority = basePath === '/' ? '1.0' :
                   basePath.startsWith('/converter/') ? '0.9' :
                   basePath.startsWith('/blog/') ? '0.7' : '0.8';
  const changefreq = basePath === '/' ? 'daily' :
                      basePath.startsWith('/blog/') ? 'monthly' : 'weekly';

  return `  <url>\n    <loc>${DOMAIN.replace(/\/$/, '')}${withSlash(p)}</loc>\n    <lastmod>${isoDate}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}).join('\n')}
</urlset>
`;

// 确保目录存在
fs.mkdirSync(path.dirname(outPath), { recursive: true });

// 写入主sitemap
fs.writeFileSync(outPath, xml, 'utf8');
console.log('[sitemap] Generated multilingual sitemap:', outPath);
console.log('[sitemap] Total URLs:', PATHS.length);
console.log('[sitemap] Last modified:', isoDate);

// 可选：生成 hreflang 参考站点地图（仅用于人工核对）
const hreflangPaths = generateHreflangSitemap();
const hreflangXml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- hreflang 参考站点地图（仅供开发参考，不要提交给搜索引擎） -->
<!-- 生成时间: ${new Date().toISOString()} -->
<!-- URL总数: ${hreflangPaths.length} (包含非规范版本) -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${hreflangPaths.map((p) => {
  const priority = p === '/' ? '0.8' : '0.6';
  return `  <url>\n    <loc>${DOMAIN.replace(/\/$/, '')}${withSlash(p)}</loc>\n    <lastmod>${isoDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}).join('\n')}
</urlset>
`;

const hreflangOutPath = path.resolve(process.cwd(), 'public', 'sitemap-hreflang-reference.xml');
fs.writeFileSync(hreflangOutPath, hreflangXml, 'utf8');
console.log('[sitemap] Generated hreflang reference sitemap:', hreflangOutPath);
console.log('[sitemap] Total hreflang URLs (reference only):', hreflangPaths.length);
console.log('[sitemap] Note: Do not submit hreflang-reference.xml to search engines');
