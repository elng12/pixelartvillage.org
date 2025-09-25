# 多语言（i18n）集成指南

本项目已集成 i18next + react-i18next + i18next-http-backend，实现 URL 前缀化语言、延迟加载翻译与 SEO 产物（hreflang、多语言站点地图）。

## 支持语言
- en / es / id / de / pl / it / pt / fr / ru / fil / vi / ja

## 目录结构
- public/locales/{lang}/translation.json —— 文案资源（按需加载，≤ 15 kB/语言）
- src/i18n.js —— i18n 初始化（延迟加载、fallback、持久化）
- src/components/LanguageSwitcher.jsx —— 页眉语言下拉

## 路由规范
- 所有页面均支持 `/:lang/*` 前缀。如：`/es/blog`、`/fr/converter/png-to-pixel-art`。
- 未带语言前缀的旧路径，将在边缘层 301 到英语版本（见 `public/_redirects`）。
- 未知语言（如 `/xyz/...`）将 301 到 `/en/...`。

## 自动检测与持久化
- 首次访问：按浏览器语言（`navigator.language`）匹配到支持列表，默认回退 `en`。
- 切换语言：存储到 `localStorage`（key=`pv_lang`），有效期 1 年。

## SEO 与构建
- 预渲染脚本 `scripts/prerender-spa.cjs` 为每个页面与语言输出静态 HTML，并在 `<head>` 注入 11 条 `link[rel="alternate"][hreflang]`。
- 站点地图 `public/sitemap.xml` 在构建时由 `scripts/generate-sitemap.cjs` 生成，已包含全部多语言 URL。

## 新增语言步骤
1. 在 `public/locales/{lang}/translation.json` 新增语言文件（参考 `en/translation.json`）。
2. 将新语言代码追加到 `src/i18n.js` 中的 `SUPPORTED_LANGS`。
3. 在 `public/_redirects` 的“Allowlisted languages”段添加 `/{lang}/*    /index.html   200`。
4. 在 `scripts/prerender-spa.cjs` 与 `scripts/generate-sitemap.cjs` 的 `LANGS` 列表补充该语言代码。
5. 运行构建与预渲染：`npm run build`。

## 提取与使用 key
- 在组件中使用：
  ```js
  import { useTranslation } from 'react-i18next'
  const { t } = useTranslation()
  return <h1>{t('blog.title')}</h1>
  ```
- 常用命名空间：统一使用默认 `translation`（避免多命名空间增加开销）。
- Key 组织建议：
  - 导航：`nav.*`；CTA：`cta.*`；页脚：`footer.*`；页面：`blog.*`、`consent.*` 等。

### 导航 key 规范
- 固定键名（大小写与含义一致）：
  - `nav.home`、`nav.examples`、`nav.features`、`nav.how`、`nav.faq`、`nav.blog`、`nav.about`、`nav.contact`
- 适用范围：页眉导航与页脚相关链接统一引用上述键（Terms/Privacy 仍保持 `footer.*`）。

## 注意事项
- 文案与代码分离：新增/修改文案仅需调整 JSON 文件，无需改动组件逻辑。
- 性能：i18n 启用 HTTP Backend，按需拉取当前语言 JSON；切换时才 fetch 其它语言文件，FCP 增加 < 100 ms。
- SEO：hreflang 与多语言 URL 均在构建阶段产出，无需运行时注入即可通过“查看源代码”校验。

---

如需接入 CMS / 众包翻译：可将 `public/locales/` 的生成下沉为构建前脚本（拉取远端资源或从 CMS 导出），保持前端只读与按需加载策略不变。

## 伪本地化与一致性检查（开发辅助）
- 伪本地化（Pseudo‑locale）：从英文自动生成 `public/locales/pseudo/translation.json`，用于在开发中显著标注未外化/未翻译文本。
  - 生成：`npm run i18n:pseudo`
  - 启用：`VITE_ENABLE_PSEUDO=1 npm run dev`，然后访问 `http://localhost:5173/pseudo/`
- 键一致性检查：比较各语言与英文基线的 key 差异（忽略数组长度）。
  - 运行：`npm run i18n:check`
  - 输出：列出每种语言缺失或多余的 key，便于补齐与清理。
