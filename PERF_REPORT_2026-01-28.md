# Performance Audit Report (2026-01-28)

基于 Lighthouse 报告文件 `pixelartvillage.org_2026-01-28_14-08-12.json` 进行分析。由于 DevTools MCP 连接失败（Transport closed），本报告未包含新的运行时 trace，只依据 Lighthouse 输出与代码对照。

## 1. Summary
- 最大问题：CLS 过高 (0.414)
- 次要问题：图片传送过大、字体资源 404、生产环境加载 /src/index.css 失败
- 中等优化空间：未使用 JS、渲染阻塞 CSS

## 2. Lighthouse Baseline
- Performance: 0.81
- FCP: 0.3s
- LCP: 0.6s
- TBT: 0ms
- Speed Index: 0.7s
- CLS: 0.414 (核心瓶颈)

## 3. Findings (ordered by impact)

### 3.1 High CLS (0.414)
证据：Lighthouse `layout-shifts` / `cls-culprits-insight` 指向
- footer: `footer.bg-gray-900 > div.relative > div.hidden`
- header: `header.sticky > div.container`

对应代码：
- `src/components/Footer.jsx` 使用 `absolute inset-0` 的 `pixel-grid-bg` 背景层
- `src/components/HowItWorksSection.jsx` 存在同类背景层（次要）
- `src/components/ShowcaseSection.jsx` 图片宽高比与实际资源不匹配（见 3.2）

风险：字体切换或图片尺寸修正会导致布局偏移，放大 CLS。

### 3.2 Showcase 图片尺寸/比例不匹配 + 图片过大
证据：Lighthouse `image-delivery-insight`
- 实际显示约 520x690，却下载 800x1062 资源，浪费约 150KiB

对应代码：
- `src/components/ShowcaseSection.jsx`
  - `<img width="600" height="400">` 与真实比例不一致 (原图约 928x1232 或 800x1062)
  - `<source sizes>` 与 `<img sizes>` 不一致 (520px vs 600px)

影响：
- 额外下载大图
- 图片加载后尺寸调整，引发 CLS

### 3.3 字体资源 404 (Inter)
证据：Lighthouse `errors-in-console` 显示 `/fonts/inter-var.woff2` 404

对应代码：
- `src/components/CriticalCSS.jsx` 引用 `/fonts/inter-var.woff2`
- `src/components/ResourcePreloader.jsx` 预加载 `/fonts/inter-var.woff2`

影响：
- 字体切换导致 CLS
- 无效预加载浪费网络资源

### 3.4 生产环境加载 /src/index.css 失败
证据：Lighthouse 控制台错误
- `Refused to apply style from 'https://pixelartvillage.org/src/'... MIME type`

对应代码：
- `src/components/CriticalCSS.jsx` 动态注入 `/src/index.css`
- `src/components/ResourcePreloader.jsx` preload `/src/index.css`

影响：
- 生产环境 404/MIME 错误
- 可能造成样式加载时机不稳定

### 3.5 未使用 JavaScript (~25KiB)
证据：Lighthouse `unused-javascript`
- bundle `assets/index-*.js` 内含未使用代码

关联模块：
- `src/components/ToolSection.jsx`
- `src/utils/safeStorage.js`
- `src/utils/languageManager.js`

影响：下载体积可减少，但性能影响中等。

### 3.6 Render-blocking CSS
证据：Lighthouse `render-blocking-insight`
- `/assets/index-*.css` (~8.6KiB)

影响：较小。优先级低于 CLS 修复。

### 3.7 Badge 资源 404
证据：Lighthouse 控制台错误
- `/fazier-badge.svg`, `/twelve-tools-badge.svg`, `/indie-deals-badge.svg`, `/startupfame-badge.webp`, `/turbo0-badge.svg`, `/ai-dirs-badge.svg`

对应代码：
- `src/components/Footer.jsx`

说明：本地 `public/` 中存在这些文件，但线上 404，需检查部署或 CDN。

## 4. Recommendations (Priority)

### P0 (highest)
1) 修正 Showcase 图片比例与 `sizes`
- 文件：`src/components/ShowcaseSection.jsx`
- 建议：
  - `width/height` 改成真实比例 (例如 800x1062 或 928x1232)
  - `<source>` 与 `<img>` 的 `sizes` 统一
  - 若原图宽度 928px，移除 1200w 或禁止放大

2) 修复字体资源 404
- 方案 A：补齐 `/public/fonts/inter-var.woff2` 并在 `index.html` preload
- 方案 B：移除 `CriticalCSS`/`ResourcePreloader` 内 Inter 相关逻辑

3) 移除生产环境对 `/src/index.css` 的动态注入
- 删除 `CriticalCSS`/`ResourcePreloader` 中 `/src/index.css` 的 link 注入
- 让 Vite 构建产物的 CSS 自动加载

### P1 (medium)
4) 优化 Showcase 图片分辨率
- `scripts/gen-showcase.cjs` 添加 520w/640w
- 禁止 1200w 放大 (`withoutEnlargement: true`)

5) 修复线上 badge 404
- 检查 Netlify/静态资源路径/CDN 配置

### P2 (long term)
6) 减少未使用 JS
- 上传后再动态 import Editor/重型模块

## 5. Expected Impact
- CLS 预期从 0.414 降到 < 0.1
- 图片传送节省约 100-150KiB
- 控制台错误清零，稳定首屏布局

## 6. Validation Plan
- Lighthouse (desktop + mobile) 对比
- DevTools Performance trace 看 CLS 事件数量
- Console 检查 404 与 MIME 错误

## 7. Key Files
- `src/components/ShowcaseSection.jsx`
- `src/components/Footer.jsx`
- `src/components/CriticalCSS.jsx`
- `src/components/ResourcePreloader.jsx`
- `scripts/gen-showcase.cjs`
- `index.html`

---

## 8. Review Additions (Peer Feedback Incorporated)

### 8.1 Showcase 图片 CLS 深入说明
- Lighthouse 将 Footer 标记为 CLS culprit，但真实触发源更可能是 Showcase 图片比例不匹配导致高度被撑开，下方整体位移，Footer 只是“受害者”。  
- 建议不仅修正 `width/height`，也补上 `aspect-ratio`（Tailwind `aspect-[w/h]` 或内联 style），避免 CSS reset 覆盖 HTML 属性。
- 检查 Showcase 是否在首屏视口内：  
  - 若在首屏，移除 `loading="lazy"`，避免首屏图片加载延迟与布局回流。  
  - 若不在首屏，保留 lazy，但确保 `width/height` 与 `aspect-ratio` 正确。

### 8.2 字体策略明确化
- 选择 `font-display: swap` 或 `optional` 的策略需要明确：  
  - `swap` 更稳妥但需确保 fallback 字体 metrics 接近 Inter，减少 CLS。  
  - 若不需要 Inter，可直接移除 Inter 相关逻辑，避免字体切换导致布局变化。
- 若保留 Inter，建议 `preload` 并确保 `/public/fonts/inter-var.woff2` 实际存在。

### 8.3 CSS 动态注入问题
- `CriticalCSS.jsx`/`ResourcePreloader.jsx` 中对 `/src/index.css` 的引用是生产环境错误根源。  
- 建议将其视为“遗留/错误的优化”，直接删除该注入逻辑，让 Vite 的构建产物负责 CSS 加载。

### 8.4 Header CLS 待确认项
可能导致 Header CLS 的常见原因（需确认）：  
- Logo 图片未设置明确 `width/height`  
- Header 高度缺乏固定约束，动态内容加载后撑高  
建议检查 `Header.jsx` 是否存在固定高度（如 `h-16`）与 Logo 尺寸约束。

---

## 9. Validation Checklist (To-Be-Confirmed)
- **图片源分辨率核实**：确认 Showcase 原图真实尺寸（`naturalWidth`/`naturalHeight`），确保 `width/height` 与 `aspect-ratio` 一致。  
- **字体加载行为**：确认修复后是否仍有 fallback->Inter 的跳变；优先检查 CLS 是否下降。  
- **CSS 注入移除**：确认生产环境不再请求 `/src/index.css`。  
- **Header 稳定性**：确认 Header 高度在首次渲染与最终渲染一致。  
- **静态资源 404**：核对 `public/` 中的 badge 文件名大小写与部署路径一致性（Linux 环境对大小写敏感）。  
- **环境一致性**：建议在 CI/CD 中加入 Lighthouse 或简单 404 资源校验，确保生产与开发一致。

---

## 10. Validation Results (Local Preview)
**环境**：`npm run build` + `npm run preview` (http://localhost:4173)  
**工具**：Lighthouse (headless), 输出保存为 `lighthouse-local.json`  

**结果**  
- Performance: 0.94  
- Accessibility: 0.97  
- Best Practices: 0.92  
- SEO: 1.00  
- FCP: 1.8s / LCP: 2.8s / TBT: 30ms / **CLS: 0** / SI: 3.0s  
- `layout-shifts` 记录数：0  

**结论**：本地预览环境已消除 CLS，改动有效。线上仍需再次验证。

---

## 11. Decision Log
- 字体策略：选择系统字体（不引入 Inter）。  
  理由：避免新增字体请求与潜在 CLS 风险，优先确保性能与稳定性。  

---

## 12. Validation Results (Production URL)
**环境**：https://pixelartvillage.org/  
**工具**：Lighthouse (headless)  
**输出**：`lighthouse-prod-desktop.json`（桌面 preset）、`lighthouse-prod-mobile.json`（默认 mobile）  

**桌面（desktop preset）**  
- Performance: 0.99  
- Accessibility: 0.97  
- Best Practices: 0.92  
- SEO: 1.00  
- FCP: 0.4s / LCP: 0.9s / TBT: 0ms / CLS: 0.025 / SI: 0.7s  

**移动（mobile 默认）**  
- Performance: 0.92  
- Accessibility: 0.97  
- Best Practices: 0.92  
- SEO: 1.00  
- FCP: 2.0s / LCP: 2.8s / TBT: 20ms / **CLS: 0** / SI: 4.0s  

**结论**：线上 CLS 已显著改善，移动端归零；桌面端残留 0.025 属于轻微抖动，建议后续监控。

**补充定位（desktop CLS 0.025）**  
- Lighthouse `layout-shifts` 指向 Showcase 区域的 `<img>`，原因是 “Media element lacking an explicit size”。  
- 这表明线上页面仍在使用旧版 `width/height`（600x400）与 `sizes=600px` 的标记。  
- 建议：确认线上部署已更新到最新构建，避免旧版缓存或未发布版本导致 CLS 残留。

**补充验证（Badge 404）**  
- 线上检查（`curl`）结果：`/fazier-badge.svg`、`/twelve-tools-badge.svg`、`/indie-deals-badge.svg`、`/startupfame-badge.webp`、`/turbo0-badge.svg`、`/ai-dirs-badge.svg` 均为 404。  
- 本地 `dist/` 中存在这些文件，说明问题可能是部署未更新或 CDN/缓存未刷新。  
