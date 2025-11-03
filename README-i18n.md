# 多语言（i18n）集成指引

本项目使用 i18next + react-i18next + i18next-http-backend 构建多语言能力，配合静态预渲染输出多语言 HTML、hreflang 与站点地图。

## 支持语言
- 语言清单集中在 `config/locales.json`，包含 `default`（默认语言）与 `supported`（构建产出的全部语言）。
- 当前配置：en / es / id / de / pl / it / pt / fr / ru / fil / vi / ja / sv / no / nl / ar / ko / th。

## 目录结构
- `public/locales/{lang}/translation.json`：每种语言的文案 JSON。
- `src/i18n.js`：i18n 初始化（按需加载、fallback、本地存储记忆）。
- `src/contexts/LocaleContext.jsx`：提供 `currentLocale` 与 `buildPath`，供导航等组件生成语言化 URL。
- `scripts/prerender-spa.cjs`、`scripts/generate-sitemap.cjs`：多语言静态页与 sitemap 生成脚本。

## 路由规范
- 客户端路由结构：`/:lang/*`（其中 `lang` 来源于配置文件，默认语言可省略前缀）。
- 未携带语言前缀的旧路径在运行时重定向至默认语言版本（见 `src/App.jsx`）。
- 锚点链接通过 `buildPath()` + hash 生成，确保在当前语言下滚动到对应位置。

## 自动检测与持久化
- 首次访问：使用浏览器语言（`navigator.languages`）匹配支持列表，若存在则重定向至 `/{lang}/`。
- 切换语言：写入 `localStorage`（key=`pv_lang`），记忆 1 年；离线时回退到默认语言。

## SEO 与构建
- `npm run build` 会执行：
  1. Vite 构建；
  2. `scripts/prerender-spa.cjs` 为每个语言/路由组合生成静态 HTML，注入 canonical、hreflang、隐藏内容；
  3. `scripts/generate-sitemap.cjs` 输出多语言 `sitemap.xml` 与参考文件；
  4. `scripts/seo-check.js` 验证 meta、结构化数据、robots 等。
- `public/_redirects` 仅保留静态资源直出与 SPA 兜底，不再强制重定向语言路径。

## 新增语言步骤
1. 在 `config/locales.json` 的 `supported` 数组中加入语言代码（若要切换默认语言，同时调整 `default`）。
2. 复制 `public/locales/en/translation.json` 为新语言的初始文本，然后逐步替换译文。
3. 运行 `npm run i18n:check`，确认键名与英文一致（脚本会在 CI 中比对差异）。
4. 执行 `npm run build`，验证生成的多语言静态页与 SEO 产物。

## 文案使用示例
```js
import { useTranslation } from 'react-i18next'

const Component = () => {
  const { t } = useTranslation()
  return <h1>{t('blog.title')}</h1>
}
```

### 导航 key 规范
- 固定键名：`nav.home`、`nav.examples`、`nav.features`、`nav.how`、`nav.faq`、`nav.blog`、`nav.about`、`nav.contact`。
- 页眉、页脚及其他导航场景统一复用上述键，避免重复文案。

## 注意事项
- 文案尽量放在 JSON 中管理，组件仅负责渲染。
- 避免手动修改预渲染产物，所有 SEO 相关字符串请在源码中维护。
- 若需引入 CMS/外部翻译，可在构建前同步生成 `public/locales/` 目录，但须保持键结构与英文一致。
- `ResourcePreloader` 会依据当前语言提前预取 `/locales/{lang}/translation.json`，新增语言时无需额外处理。

## 开发辅助
- 伪本地化：`npm run i18n:pseudo` 生成 `public/locales/pseudo/translation.json`，配合 `VITE_ENABLE_PSEUDO=1 npm run dev` 查看 UI 是否存在硬编码。
- 键一致性检查：`npm run i18n:check`，输出各语言与英文基线的差异（CI 亦会执行）。
