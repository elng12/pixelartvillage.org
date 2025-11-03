// Auto-generate sitemap.xml at build time with current date as lastmod (CommonJS)
// 优化：只包含规范URL（英文无前缀版本），避免向搜索引擎提交重复内容
const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://pixelartvillage.org/';
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

// 只包含规范URL（英文无前缀版本），避免重复内容
// 根据 canonical 策略，其他语言版本不应包含在sitemap中
const CANONICAL_PATHS = ['/', '/privacy', '/terms', '/about', '/contact', '/blog'];
const PATHS = [...CANONICAL_PATHS];

// Include blog posts from content - 只包含规范版本
const blogPosts = loadContent('blog-posts');
for (const p of blogPosts) {
  if (p && p.slug) {
    PATHS.push(`/blog/${p.slug}`);
  }
}

// Include pSEO pages (converter/:slug) - 只包含规范版本
const pseoPages = loadContent('pseo-pages');
for (const p of pseoPages) {
  if (p && p.slug) {
    PATHS.push(`/converter/${p.slug}`);
  }
}

// 可选：生成hreflang sitemap供参考（但不推荐提交给搜索引擎）
const generateHreflangSitemap = () => {
  const OTHER_LANGS = ['es','id','de','pl','it','pt','fr','ru','fil','vi','ja'];
  const HREFLANG_PATHS = [];

  for (const p of CANONICAL_PATHS) {
    for (const l of OTHER_LANGS) {
      HREFLANG_PATHS.push(`/${l}${p === '/' ? '/' : p}`);
    }
  }

  for (const p of blogPosts) {
    if (p && p.slug) {
      for (const l of OTHER_LANGS) {
        HREFLANG_PATHS.push(`/${l}/blog/${p.slug}`);
      }
    }
  }

  for (const p of pseoPages) {
    if (p && p.slug) {
      for (const l of OTHER_LANGS) {
        HREFLANG_PATHS.push(`/${l}/converter/${p.slug}`);
      }
    }
  }

  return HREFLANG_PATHS;
}

function withSlash(p) {
  if (!p || p === '/') return '/';
  return p.endsWith('/') ? p : p + '/';
}

// 生成主sitemap（只包含规范URL）
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- 优化站点地图：只包含规范URL，避免重复内容问题 -->
<!-- 生成时间: ${new Date().toISOString()} -->
<!-- URL总数: ${PATHS.length} (规范版本) -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PATHS.map((p) => {
  const priority = p === '/' ? '1.0' :
                   p.startsWith('/converter/') ? '0.9' :
                   p.startsWith('/blog/') ? '0.7' : '0.8';
  const changefreq = p === '/' ? 'daily' :
                      p.startsWith('/blog/') ? 'monthly' : 'weekly';

  return `  <url>\n    <loc>${DOMAIN.replace(/\/$/, '')}${withSlash(p)}</loc>\n    <lastmod>${isoDate}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}).join('\n')}
</urlset>
`;

// 确保目录存在
fs.mkdirSync(path.dirname(outPath), { recursive: true });

// 写入主sitemap
fs.writeFileSync(outPath, xml, 'utf8');
console.log('[sitemap] Generated canonical sitemap:', outPath);
console.log('[sitemap] Total canonical URLs:', PATHS.length);
console.log('[sitemap] Last modified:', isoDate);

// 可选：生成包含所有语言版本的sitemap供开发参考
const hreflangPaths = generateHreflangSitemap();
const hreflangXml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- 非规范URL参考站点地图（仅供开发参考，不要提交给搜索引擎） -->
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
