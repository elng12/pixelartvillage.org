# 首页 SEO 检查清单（2026-03-25）

## 执行摘要

首页并不缺最基础的 SEO 标签。线上页面已经有标题、简介、规范地址、Open Graph、Twitter、`hreflang` 和 `JSON-LD`。

更大的问题不是“没配”，而是“配置链路不一致”：

1. 线上首页 SEO 来自 `dist/` 里的预渲染产物，不是仓库根目录的 `index.html` 模板。
2. React 的 `Seo` 组件在运行时只会更新页面标题和 `<html lang>`，虽然调用方传了更多字段。
3. 首页内容和链接布局，仍然会对高竞争泛词发出比较混杂的信号。

## 单一真相来源

- 线上真实值：`dist/index.html`
- 首页文案来源：`src/locales/en.json`
- 构建时写入 SEO 的脚本：`scripts/build/prerender-spa.cjs`
- 运行时 SEO 辅助组件：`src/components/Seo.jsx`

这意味着团队应该把预渲染产物当作首页 SEO 的真实来源，而不是根目录的 `index.html` 模板。

## 线上首页 SEO：保留还是调整

| 项目 | 当前线上值 / 行为 | 状态 | 建议 | 原因 |
| --- | --- | --- | --- | --- |
| Title | `Image to Pixel Art Converter | Pixel Art Village` | 保留 | 保持这个方向 | 更清晰、更具体，也比旧的泛化首页标题更聚焦。 |
| Meta description | `Turn any image or PNG, JPG, GIF, and WEBP image file into pixel art with live preview, custom palettes, dithering, and private browser-based processing.` | 先保留，后续可收紧 | 目前先不动 | 这段文案能说明工具用途。它稍长、也略重复，但不是当前最大问题。 |
| Canonical | `https://pixelartvillage.org/` | 保留 | 保持现状 | 这是默认语言首页的正确规范地址。 |
| Open Graph / Twitter | 与首页标题和简介保持一致 | 保留 | 继续和标题、简介保持一致 | 这是健康的基础设置，内部也一致。 |
| Hreflang | `en, es, id, de, pl, it, pt, fr, ru, tl, vi, ja, sv, nb, nl, ar, ko, th, x-default` | 保留，但要谨慎 | 保留技术实现，同时复查各语言页质量 | 标签本身是有的，这很好。但前提是各语言页面本身真的够强、够匹配。 |
| JSON-LD | `SoftwareApplication`、`BreadcrumbList`、`WebSite` | 保留 | 保持现状，避免继续堆无关 schema | 这是比较稳妥的基础组合。线上页面已经没有根模板里旧的 FAQ 和评分标记，反而更安全。 |
| Meta robots | 没发现显式 `meta robots` | 中性 | 除非有特殊规则，否则不用补 | 默认可收录是正常行为，这不是阻塞项。 |
| H1 | `Image to Pixel Art Converter | Pixel Art Village` | 调整 | 后续把 H1 里的品牌分隔符去掉 | 方向是对的，但这个 H1 更像标题标签，不像自然页面标题。 |
| Hero 文案 | 明显重复 `image`、`pixel art converter` 和格式词 | 调整 | 减少重复，让文案更像给人看 | 现在读起来更像在照顾关键词，而不是照顾理解。 |
| 首页意图 | 首页既想抢泛工具词，又想把人分流到更窄的工具页 | 调整 | 把首页做成清晰的主入口，不要做 catch-all 关键词中枢 | 意图过杂，会削弱首页对高竞争泛词的相关性。 |
| 外部徽章链接 | 线上首页在展示区和页脚有 26 个第三方外链 | 立即调整 | 减少数量，或迁走大部分 | 这会让首页显得更嘈杂，不利于“主工具页”的聚焦感。 |
| 配置一致性 | 根目录 `index.html` 仍保留旧 SEO 文案和旧 schema 草稿 | 立即调整 | 对齐旧模板，或明确废弃它 | 团队成员很容易看错文件、改错位置。 |
| React SEO API | `App.jsx` 传了 `description`、`canonical`、`hreflang`，但 `Seo.jsx` 实际忽略它们 | 立即调整 | 要么真的支持这些字段，要么别再传 | 当前写法会制造“看起来配了、实际上运行时没生效”的假象。 |

## 当前线上真实生效的内容

下面这些值现在确实存在于线上首页：

- Title：`Image to Pixel Art Converter | Pixel Art Village`
- Description：`Turn any image or PNG, JPG, GIF, and WEBP image file into pixel art with live preview, custom palettes, dithering, and private browser-based processing.`
- Canonical：`https://pixelartvillage.org/`
- Open Graph 标题 / 简介：与首页标题、简介一致
- Twitter 标题 / 简介：与首页标题、简介一致
- Hreflang：已输出，包含 `x-default`
- JSON-LD：`SoftwareApplication`、`BreadcrumbList`、`WebSite`

## 两个主要技术风险

### 1. 模板不一致

根目录 `index.html` 还保留着旧的首页 SEO 文案和旧的 schema，而线上首页实际是由预渲染产物输出的。

这为什么重要：

- 代码审查时，错误的文件看起来反而更像权威来源。
- 有人可能在模板里“修”了首页 SEO，结果线上根本没变化。
- 后面排查排名波动时，会更难定位问题，因为团队没有盯着一个可靠来源。

### 2. 运行时 SEO 不一致

`src/App.jsx` 把 `title`、`description`、`canonical`、`hreflang` 都传给了 SEO 层，但 `src/components/Seo.jsx` 实际只会更新：

- `document.title`
- `<html lang>`

这为什么重要：

- 代码表面上看，运行时 SEO 比实际更完整。
- 以后做路由或多语言调整时，很容易误解当前行为。
- 构建时 SEO 和运行时 SEO 是分开的，但目前没有一个很清晰的契约说明。

## 建议的下一步动作

### P1：现在就该做

1. 明确首页 SEO 的唯一权威来源，并写进文档。
2. 把首页上的大部分第三方徽章外链移走，或至少显著减少。
3. 让 `Seo.jsx` 和调用方“说真话”：
   要么真正支持这些额外传入的字段
   要么停止继续传那些组件根本不会处理的字段

### P2：接着优化

1. 简化首页 H1，让它更像自然页面标题。
2. 重写 hero 文案，降低重复关键词密度。
3. 让首页只聚焦一个主意图：主转换器入口。

### P3：改完后验证

1. 下次部署后，再核对一次线上首页 HTML。
2. 再看一次 GSC 里首页自己的页面和查询趋势。
3. 抽查几个主要语言首页，确认 `hreflang` 指向的页面真的值得被排。

## 参考来源

- `src/App.jsx`
- `src/components/Seo.jsx`
- `src/locales/en.json`
- `index.html`
- `dist/index.html`
- `scripts/build/prerender-spa.cjs`
