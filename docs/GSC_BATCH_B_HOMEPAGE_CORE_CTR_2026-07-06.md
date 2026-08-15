# 批次 B：首页核心词 CTR 优化草案 - 2026-07-06

## 1. 当前结论

批次 A 已经复查完。

大白话结论：

- photo 页没有伤害首页。
- photo 页也没有抢回 `photo to pixel art` / `picture to pixel art`。
- Google 现在更认可首页承接这类“大工具词”。
- 所以不要继续硬改 photo 页去抢首页。

下一步更值得做的是首页。

## 2. 批次 B 目标

批次 B 只讨论首页 `/`。

目标不是重做首页，而是让搜索用户更愿意点进来。

重点词：

| Query | 当前目标页面 | 为什么看它 |
|---|---|---|
| `pixel art maker` | `/` | 曝光大，CTR 偏低，排名接近机会区 |
| `pixel art generator` | `/` | 曝光大，CTR 偏低，但不能误写成 AI 生成器 |
| `pixel art converter` | `/` | 首页核心词，要保护 |
| `image to pixel art` | `/` | 首页最大主词，要保护 |

## 3. 最新基线

GSC final 窗口：`2026-06-07` 到 `2026-07-03`。

| Query | 页面 | 点击 | 曝光 | CTR | 平均排名 | 判断 |
|---|---|---:|---:|---:|---:|---|
| `pixel art maker` | `/` | 146 | 8,534 | 1.71% | 9.08 | 批次 B 主要机会 |
| `pixel art generator` | `/` | 157 | 8,082 | 1.94% | 8.07 | 批次 B 主要机会 |
| `pixel art converter` | `/` | 199 | 3,054 | 6.52% | 5.00 | 保护词 |
| `image to pixel art` | `/` | 661 | 8,827 | 7.49% | 4.03 | 保护词 |

## 4. 本批次只解决什么

只解决一个问题：

```txt
首页在 maker / generator 这些词上，用户看到搜索结果后，点击理由还不够强。
```

可以讨论：

- title 是否更清楚。
- meta description 是否更像“免费、在线、上传就能用”的工具。
- 首页首屏文案是否让用户马上知道可以做什么。
- 首页是否需要更清楚地区分 converter / maker / generator。

## 5. 本批次不做什么

本批次先不做：

- 不改 photo 页。
- 不改 8-bit 页。
- 不改 image-to-pixel 页。
- 不改 PNG / JPG / GIF 页面。
- 不改 Blog。
- 不改多语言页面。
- 不做新 `/us/`、`/desktop/` 页面。
- 不为了 `pixel art generator` 写成 AI 生成器，除非页面真的有 AI 生成功能。

## 6. 首页改动边界

如果后续进入代码执行，首页改动也要很小。

允许讨论：

- 首页 title / meta description 的小幅优化。
- 首页 H1 下方说明文案的小幅优化。
- 首页首屏上传工具旁边的点击理由。
- 首页工具入口的文字是否更清楚。

不允许一上来做：

- 重做首页 UI。
- 大改主工具。
- 删除当前核心功能。
- 把页面写成不存在的 AI 工具。
- 同时改多个 converter 子页面。

## 7. 验收方式

上线后分两层看：

| 时间 | 看什么 | 怎么判断 |
|---|---|---|
| 2 到 3 天 | 是否被重新抓取、页面是否正常、title/snippet 是否开始变化 | 只判断有没有硬问题，不判断 SEO 成败 |
| 7 到 14 天 | 点击、曝光、CTR 是否有初步方向 | 只做早期观察 |
| 28 天左右 | 是否真的有效 | 用完整窗口判断 |

核心验收：

- `pixel art maker` 点击不下降，CTR 有改善。
- `pixel art generator` 点击不下降，CTR 有改善。
- `image to pixel art` 不明显下滑。
- `pixel art converter` 不明显下滑。

## 8. 当前状态

```txt
批次 B 目前只是草案。
不进入代码执行。
下一步先审评本草案，确认首页是否可以作为下一批代码任务。
```

## 9. 草案审评结论

结论：有条件通过。

通过原因：

- 目标页面只有首页 `/`，没有把其他页面混进来。
- 目标词和保护词分清楚了。
- `pixel art maker`、`pixel art generator` 有明确 GSC 数据支撑。
- 已经写明不能把页面说成不存在的 AI 生成器。
- 已经写明不改 photo、8-bit、多语言、Blog 等页面。

还不能直接改代码的原因：

- 还需要把首页当前文案、涉及文件、允许改哪里、不允许改哪里写清楚。
- 首页是全站最重要页面，不能只凭一句“优化 CTR”就动手。
- 必须先保证 `image to pixel art` 和 `pixel art converter` 不被误伤。

审评结论：

```txt
批次 B 草案通过。
可以进入首页代码任务拆解草案。
但仍然不直接改代码。
```

## 10. 首页代码任务拆解草案

### 10.1 当前首页文案基线

当前英文首页关键文案：

| 位置 | 当前文案 |
|---|---|
| SEO title | `Image to Pixel Art Converter | Pixel Art Village` |
| meta description | `Turn images into pixel art online with live preview, palette controls, dithering, and private browser-based processing for PNG, JPG, GIF, and WEBP files.` |
| H1 | `Image to Pixel Art Converter` |
| 首屏主说明 | `Turn any image into pixel art in your browser...` |
| FAQ 里是否解释 AI generator | 已有：说明本站不是 AI pixel art generator |
| FAQ 里是否解释 maker | 已有：说明它可作为 image-based pixel art maker |

当前问题：

- SEO title 没有出现 `maker`。
- meta description 对“免费、在线、上传就能用”的点击理由还不够直接。
- `generator` 已经在 FAQ 里解释，但不能放到 title 里误导用户以为是 AI 生成器。
- H1 已经很稳，不建议第一刀就改 H1。

### 10.2 主要涉及文件

| 文件 | 作用 | 批次 B 是否可能改 |
|---|---|---|
| `public/locales/en/translation.json` | 英文文案源头，构建前会同步到 `src/locales/en.json` | 是，第一优先改这里 |
| `src/locales/en.json` | 首页运行时英文文案备份，会被构建前同步覆盖 | 是，但要和 public 英文文案保持一致 |
| `scripts/build/prerender-spa.cjs` | 预渲染首页 fallback title/meta 和首页静态 HTML | 默认不改，只有构建产物不一致时最小同步 |
| `src/App.jsx` | 首页读取 SEO title / description / hero 文案 | 默认不改 |
| `src/components/ToolSection.jsx` | 上传区和 H1 展示组件 | 默认不改 |
| `src/components/HomeBelowFold.jsx` | 首页下方工具入口 | 默认不改 |

### 10.3 建议改动范围

第一批首页改动只允许很小。

注意：不要只改 `src/locales/en.json`。项目构建前会把 `public/locales/en/translation.json` 同步到 `src/locales/en.json`，所以真正源头应优先改 public 英文文案。

建议改：

1. `home.seoTitle`
   - 目标：加入 `Maker`，保护 `Converter`。
   - 候选方向：`Image to Pixel Art Converter & Maker | Pixel Art Village`

2. `home.seoDescription`
   - 目标：更直接表达免费、在线、上传图片、调参数、浏览器内完成。
   - 不能堆词。

3. `home.heroSubtitle`
   - 目标：自然补一点 `pixel art maker` 语义。
   - 不把它写成 AI 生成器。

4. `faq.items`
   - 目标：保持“不是 AI generator”和“也可作为 maker”的解释。
   - 如果改 FAQ，页面可见 FAQ 和 JSON-LD 必须一致。

### 10.3.1 推荐候选文案

这是当前最保守的一版候选。

```json
{
  "home.seoTitle": "Image to Pixel Art Converter & Maker | Pixel Art Village",
  "home.seoDescription": "Turn your image into pixel art with a free online pixel art maker and converter. Upload PNG/JPG/GIF/WEBP, preview live, adjust palette and pixel size, then export in your browser.",
  "home.heroSubtitle": "Upload PNG, JPG, GIF, or WEBP and use the browser-based pixel art maker to preview changes live, adjust pixel size, palette, and dithering, then export clean sprites, icons, or retro graphics."
}
```

FAQ 不建议新增。最多小改现有 `Is this an AI pixel art generator?`：

```txt
No. Pixel Art Village is an image-based pixel art maker and converter, not a text-prompt AI generator. You upload your own image and control the palette, pixel size, and dithering yourself.
```

注意：

- 不把 `pixel art generator` 放进 title。
- `generator` 只在 FAQ 里解释，避免用户误以为是 AI 生成器。
- 不堆关键词。

### 10.4 不建议第一批改

暂不改：

- 不改首页 H1，先保护 `Image to Pixel Art Converter`。
- 不改主工具功能。
- 不改上传区结构。
- 不改首页 UI 布局。
- 不改首页下方 converter 卡片。
- 不加新的导航下拉。
- 不改其他语言首页。

### 10.5 验收清单

如果后续进入代码执行，必须检查：

- `npm run build`
- `npm run verify:dist`
- `npm run seo:check`
- `npm run sitemap:verify`
- `npm run lint`
- 打开首页，确认 title / meta / H1 正常。
- 构建后检查 `dist/index.html` 里的 title、meta description、OG title、OG description、Twitter title、Twitter description。
- 确认上传区仍可见。
- 确认 FAQ 可见。
- 确认 FAQ JSON-LD 和页面可见 FAQ 一致。
- 确认 `/converter/photo-to-pixel-art/` 没被本批次改动。

### 10.6 失败 / 暂停标准

上线后如果出现这些情况，暂停下一批：

- `image to pixel art` 明显下滑。
- `pixel art converter` 明显下滑。
- 首页 title 被 Google 展示成奇怪或不通顺的句子。
- 用户看到页面后以为这是 AI 生成器，但页面没有 AI 功能。

### 10.7 当前状态

```txt
批次 B 草案已通过。
首页代码任务拆解草案已生成。
相关 agents 已完成审评。
当前结论：有条件通过，可以进入很小范围首页文案执行。
代码执行前，必须确认只改英文首页文案源头，不改首页组件结构。
```

## 11. 2026-07-06 标题小改执行记录

本次只执行用户已确认的首页 SEO title 小改。

修改内容：

```txt
旧标题：Image to Pixel Art Converter | Pixel Art Village
新标题：Image to Pixel Art Converter & Maker | Pixel Art Village
```

涉及文件：

- `public/locales/en/translation.json`
- `src/locales/en.json`

未改：

- 不改首页 H1。
- 不改 meta description。
- 不改 heroSubtitle。
- 不改 FAQ。
- 不改首页布局。
- 不改任何 converter 子页面。

当前状态：

```txt
首页标题小改已执行。
构建、sitemap 验证和 lint 已通过。
dist/index.html 的 title / OG title / Twitter title 已同步为新标题。
本地 preview 首页 HTTP 200，title 为新标题，H1 没变。
仍保持批次 B 的窄范围。
```

## 12. 标题小改后复查计划

本次只改首页 SEO title，所以复查也要很窄。

大白话：

```txt
2 到 3 天先看有没有坏。
7 到 10 天再看有没有苗头。
不要刚改完标题就马上继续改 meta、H1 或首页文案。
```

### 12.1 第一次硬检查

时间：`2026-07-08` 或 `2026-07-09`。

只看硬问题：

- 线上首页是否 200。
- 线上首页 title 是否还是 `Image to Pixel Art Converter & Maker | Pixel Art Village`。
- Google 是否能抓首页。
- 是否有抓取失败、404、canonical 异常。
- `image to pixel art` 和 `pixel art converter` 是否出现明显异常。

这次不判断 SEO 成败。

### 12.2 第二次早期信号检查

时间：`2026-07-11` 或 `2026-07-12`。

看早期苗头：

- `pixel art maker` 有没有点击、CTR、排名方向变化。
- `pixel art generator` 有没有被误伤。
- 首页 `/` 是否仍是主要承接页面。
- 保护词 `image to pixel art`、`pixel art converter` 是否稳定。

这次只判断方向，不做最终结论。

### 12.3 第三次 7 到 10 天判断

时间：`2026-07-16` 左右。

判断能不能进入下一步：

- 如果 `pixel art maker` 有改善，继续观察，不急着改第二刀。
- 如果 `pixel art maker` 没变化，但首页保护词没受伤，可以讨论是否小改 meta description。
- 如果首页保护词明显下滑，暂停下一批，不继续改首页。

### 12.4 当前不做

- 不立刻改 meta description。
- 不改 H1。
- 不改 heroSubtitle。
- 不改 FAQ。
- 不改首页布局。
- 不改 photo 页、8-bit 页、多语言页、Blog。

## 13. 2026-07-08 第一次硬检查结果

本次是标题小改上线后的 2 天硬检查。

结论：

```txt
没有发现硬问题。
Google 已在 2026-07-07 抓过首页。
现在还不能判断 SEO 成败。
```

### 13.1 线上页面检查

| 检查项 | 结果 |
|---|---|
| 首页 URL | `https://pixelartvillage.org/` |
| HTTP 状态 | `200` |
| 跳转 | `0` 次 |
| 线上 title | `Image to Pixel Art Converter & Maker | Pixel Art Village` |
| canonical | `https://pixelartvillage.org/` |
| H1 | `Image to Pixel Art Converter` |
| noindex | 未发现 |
| 上传区文字 | 可见 |
| Googlebot 首页访问 | `200` |
| Googlebot sitemap 访问 | `200` |

### 13.2 sitemap / robots 检查

| 检查项 | 结果 |
|---|---|
| `robots.txt` | `200` |
| `sitemap.xml` | `200` |
| sitemap 类型 | `urlset` |
| sitemap URL 数量 | `203` |
| 首页是否在 sitemap | 是 |
| photo 页是否在 sitemap | 是 |

说明：`robots.txt` 允许首页抓取，没有发现首页被屏蔽。

### 13.3 GSC URL Inspection

| 检查项 | 结果 |
|---|---|
| GSC property | `sc-domain:pixelartvillage.org` |
| 权限 | `siteFullUser` |
| verdict | `PASS` |
| coverageState | `Submitted and indexed` |
| robotsTxtState | `ALLOWED` |
| indexingState | `INDEXING_ALLOWED` |
| pageFetchState | `SUCCESSFUL` |
| googleCanonical | `https://pixelartvillage.org/` |
| userCanonical | `https://pixelartvillage.org/` |
| lastCrawlTime | `2026-07-07T07:20:14Z` |

这说明 Google 已经在标题小改之后抓过首页。

### 13.4 GSC 近期数据辅助看一眼

注意：这不是成功 / 失败判断。

本次 GSC Performance 可用数据到 `2026-07-06`，而 Google 抓首页时间是 `2026-07-07T07:20:14Z`，所以这些点击数据大多还不能反映新标题效果。

窗口：`2026-07-04` 到 `2026-07-06`，页面：`/`。

| Query | 点击 | 曝光 | CTR | 平均排名 |
|---|---:|---:|---:|---:|
| `pixel art maker` | 4 | 585 | 0.68% | 9.77 |
| `pixel art generator` | 14 | 597 | 2.35% | 8.59 |
| `image to pixel art` | 70 | 1,018 | 6.88% | 4.16 |
| `pixel art converter` | 15 | 275 | 5.45% | 5.02 |

### 13.5 当前判断

- 首页正常。
- 新 title 已在线上生效。
- Googlebot 能正常访问首页和 sitemap。
- GSC URL Inspection 显示首页已收录、可抓取、可索引，canonical 正确。
- Google 已在 `2026-07-07` 抓过首页。
- 现在不应该继续改 meta、H1、heroSubtitle 或首页布局。

下一步：

```txt
等 2026-07-11 或 2026-07-12 做早期信号检查。
重点看 pixel art maker 是否有方向变化，同时保护 image to pixel art 和 pixel art converter。
```

## 14. 2026-07-23 首页标题回滚复查

7 月 13 日已经把首页 title 恢复为：

```txt
Image to Pixel Art Converter | Pixel Art Village
```

本次使用 GSC final 数据复查回滚后的恢复情况。最新可用完整日期为 `2026-07-20`。

### 14.1 首页三段 7 天数据

| 阶段 | 日期 | 点击 | 曝光 | CTR | 平均排名 |
|---|---|---:|---:|---:|---:|
| 原标题基线 | `2026-06-29` 至 `2026-07-05` | 1,109 | 29,826 | 3.72% | 7.5 |
| 新标题测试 | `2026-07-06` 至 `2026-07-12` | 523 | 15,989 | 3.27% | 11.6 |
| 回滚后 | `2026-07-14` 至 `2026-07-20` | 829 | 27,146 | 3.05% | 8.5 |

回滚后与新标题测试期相比：

- 点击增加 58.5%。
- 曝光增加 69.8%。
- 平均排名从 11.6 改善到 8.5。
- CTR 从 3.27% 变为 3.05%，还没有恢复。

回滚后的时间段里，曝光和排名明显恢复，但还没有完全回到原始基线。URL Inspection 只提供最近一次抓取时间，不能证明这段恢复全部由标题回滚造成。

### 14.2 四个重点词

| Query | 测试期点击 / 曝光 / CTR / 排名 | 回滚后点击 / 曝光 / CTR / 排名 |
|---|---|---|
| `pixel art maker` | 5 / 262 / 1.91% / 17.7 | 21 / 1,038 / 2.02% / 10.3 |
| `pixel art generator` | 5 / 257 / 1.95% / 14.2 | 41 / 1,827 / 2.24% / 8.4 |
| `image to pixel art` | 80 / 2,118 / 3.78% / 5.4 | 83 / 2,206 / 3.76% / 5.4 |
| `pixel art converter` | 22 / 324 / 6.79% / 7.4 | 29 / 718 / 4.04% / 6.1 |

`maker` 和 `generator` 已从测试期低点恢复，两个保护词也没有继续恶化。`image to pixel art` 仍未回到原始基线，`pixel art converter` 的 CTR 仍偏低，所以不能宣布完全恢复。

### 14.3 抓取和线上页面

GSC URL Inspection：

| 检查项 | 结果 |
|---|---|
| verdict | `PASS` |
| coverageState | `Submitted and indexed` |
| pageFetchState | `SUCCESSFUL` |
| robotsTxtState | `ALLOWED` |
| indexingState | `INDEXING_ALLOWED` |
| lastCrawlTime | `2026-07-23T02:36:02Z` |
| Google canonical | `https://pixelartvillage.org/` |
| User canonical | `https://pixelartvillage.org/` |

线上首页返回 HTTP 200、无跳转，title、OG title 和 Twitter title 都是回滚后的原标题，H1 仍为 `Image to Pixel Art Converter`，上传控件可见，没有 noindex 和横向溢出。

### 14.4 当前结论

```txt
现有数据支持继续保留回滚后的原标题。
首页已经明显恢复，但还没有完全回到原始基线。
现在不改 meta description、H1、heroSubtitle 或首页布局。
```

下一次在 `2026-08-02` 使用 Google 本次重新抓取后的完整 7 天 final 数据复查。

## 15. 2026-08-02 首页回滚与西班牙语描述 7 天复查

本次只使用 GSC `final` 数据。最新完整日期为 `2026-07-30`，不使用 7 月 31 日和 8 月 1 日的未完成数据。

### 15.1 首页完整 7 天窗口

首页在 2026-07-23 已确认被 Google 重新抓取，因此本轮使用 `2026-07-24` 至 `2026-07-30`。

| 阶段 | 日期 | 点击 | 曝光 | CTR | 平均排名 |
|---|---|---:|---:|---:|---:|
| 原标题基线 | `2026-06-29` 至 `2026-07-05` | 1,109 | 29,826 | 3.72% | 7.53 |
| 新标题测试 | `2026-07-06` 至 `2026-07-12` | 523 | 15,989 | 3.27% | 11.58 |
| 回滚早期 | `2026-07-14` 至 `2026-07-20` | 829 | 27,146 | 3.05% | 8.48 |
| 重新抓取后 | `2026-07-24` 至 `2026-07-30` | 978 | 32,938 | 2.97% | 8.13 |

重新抓取后与回滚早期相比：

- 点击增加 18.0%。
- 曝光增加 21.3%。
- 平均排名从 8.48 改善到 8.13。
- CTR 从 3.05% 轻微下降到 2.97%。

与原标题基线相比：曝光已增加 10.4%，但点击仍低 11.8%，主要差距是 CTR 从 3.72% 降到 2.97%。首页已经恢复大部分曝光和排名，但点击率还没有完全恢复。

### 15.2 首页四个重点词

| Query | 原标题基线 点击 / 曝光 / CTR / 排名 | 重新抓取后 点击 / 曝光 / CTR / 排名 |
|---|---|---|
| `pixel art maker` | 19 / 1,841 / 1.03% / 9.37 | 33 / 1,805 / 1.83% / 9.50 |
| `pixel art generator` | 44 / 1,737 / 2.53% / 8.37 | 51 / 2,307 / 2.21% / 7.96 |
| `image to pixel art` | 150 / 2,407 / 6.23% / 4.03 | 111 / 2,389 / 4.65% / 5.04 |
| `pixel art converter` | 33 / 716 / 4.61% / 4.88 | 36 / 812 / 4.43% / 5.84 |

判断：

- `pixel art maker` 已基本恢复到原始排名，CTR 高于原始基线。
- `pixel art generator` 的曝光和点击超过原始基线，排名也略有改善。
- `image to pixel art` 的曝光已恢复，但 CTR 和排名仍弱于原始基线，是当前主要剩余问题。
- `pixel art converter` 的点击和曝光已恢复，CTR 接近基线，但排名仍低约 1 位。

### 15.3 西班牙语首页描述

西班牙语描述在 2026-07-21 已确认被 Google 抓取，本轮使用 `2026-07-22` 至 `2026-07-28` 的 7 天 final 数据。

| 阶段 | 日期 | 点击 | 曝光 | CTR | 平均排名 |
|---|---|---:|---:|---:|---:|
| 修改前基线 | `2026-07-06` 至 `2026-07-12` | 23 | 412 | 5.58% | 18.77 |
| 抓取前过渡期 | `2026-07-14` 至 `2026-07-20` | 17 | 399 | 4.26% | 13.77 |
| 新描述抓取后 | `2026-07-22` 至 `2026-07-28` | 16 | 356 | 4.49% | 13.60 |

新描述抓取后与过渡期相比，点击减少 1 次、曝光减少 10.8%，CTR 增加 0.23 个百分点，平均排名基本不变。样本很小，不能证明新描述带来明显提升，也没有证据表明它造成硬伤。

当前 `/es/` 的主要查询仍包括 `pixel art online`、`pixel art converter` 和品牌词；西班牙语查询曝光较少。保留独立西班牙语描述，不回滚，也不继续修改其他页面文案。

### 15.4 抓取与线上硬检查

| 页面 | GSC 状态 | 最近抓取 | 线上状态 | canonical |
|---|---|---|---|---|
| `/` | PASS / Submitted and indexed | `2026-08-01T16:30:38Z` | 200，无跳转 | 正确 |
| `/es/` | PASS / Submitted and indexed | `2026-07-25T12:17:11Z` | 200，无跳转 | 正确 |

两页均允许抓取和索引，抓取成功，Google canonical 与页面 canonical 一致。线上首页保留回滚后的原标题；`/es/` 保留独立西班牙语 description，均未发现 noindex。

### 15.5 当前结论和下一步

```txt
继续保留英文首页原标题和西班牙语独立描述。
首页曝光已经恢复并超过原始基线，剩余问题是 CTR，尤其是 image to pixel art。
本轮不改 title、meta description、H1、heroSubtitle、FAQ 或页面布局。
```

下一次使用 `2026-07-31` 至 `2026-08-06` 的 7 天 final 数据复查，预计在 `2026-08-10` 数据齐全后执行。届时重点判断 `image to pixel art` 的 CTR 和排名是否继续恢复，再决定是否只做讨论，不直接改代码。

## 16. 2026-08-15 首页核心词分解和摘要正文小改

本次先完成上轮约定的 `2026-07-31` 至 `2026-08-06` final 数据复查，再把首页的 `image to pixel art` 按设备和国家拆开。

### 16.1 完整观察窗口

首页 `/`：

| 窗口 | 点击 | 曝光 | CTR | 平均排名 |
|---|---:|---:|---:|---:|
| `2026-07-24` 至 `2026-07-30` | 978 | 32,938 | 2.97% | 8.13 |
| `2026-07-31` 至 `2026-08-06` | 959 | 32,261 | 2.97% | 8.19 |

`image to pixel art`：

| 窗口 | 点击 | 曝光 | CTR | 平均排名 |
|---|---:|---:|---:|---:|
| 原标题基线 `2026-06-29` 至 `2026-07-05` | 150 | 2,407 | 6.23% | 4.03 |
| `2026-07-31` 至 `2026-08-06` | 119 | 2,336 | 5.09% | 5.12 |

首页总点击率没有继续恢复。核心词比上一观察期略有回升，但仍明显弱于原标题基线。

### 16.2 设备分解

| 设备 | 原标题基线 CTR / 排名 | `2026-07-31` 至 `2026-08-06` CTR / 排名 | 判断 |
|---|---|---|---|
| Desktop | 6.05% / 3.99 | 4.45% / 4.93 | 主要差距在桌面端 |
| Mobile | 6.54% / 4.06 | 6.01% / 5.37 | CTR 接近基线，排名变弱 |
| Tablet | 5.00% / 4.38 | 4.92% / 5.54 | 样本很小 |

截至 `2026-08-12` 的最新 6 个 final 日期里，Desktop CTR 进一步降至 2.84%，Mobile CTR 为 4.89%。因此不能把问题只解释成整体排名波动。

### 16.3 国家分解

核心曝光国家里，美国从 6.46% CTR / 5.02 位变为 4.63% / 6.65 位；加拿大从 6.67% / 4.11 位变为 1.02% / 6.30 位；法国从 9.43% / 4.09 位变为 3.33% / 4.90 位。不同国家同时出现排名和点击率走弱，不支持新增国家页面或对某一个国家单独改文案。

### 16.4 搜索摘要检查

当前搜索结果抽样没有采用首页 meta description，而是采用首页第二段首屏正文：

```txt
Pixel Art Village keeps the main image to pixel art workflow on this page, with dedicated photo, PNG, JPG, GIF, and sprite routes available when you need a narrower starting point.
```

这段文字在介绍站内页面分工，没有直接告诉搜索用户“免费、上传、调参数、导出”。同一搜索结果里的多个工具页面会直接说明免费、上传、无需注册或浏览器内完成。

### 16.5 本轮唯一页面改动

保留首页 title、meta description 和 H1，只替换被搜索结果采用的 `home.heroSubtitle2`：

```txt
Upload a PNG, JPG, GIF, or WEBP and turn it into pixel art for free. Preview changes live, adjust pixel size, palette, and dithering, then export directly in your browser.
```

涉及文件：

- `public/locales/en/translation.json`
- `src/locales/en.json`

不改广告页、其他 converter、多语言页面、Blog、title、meta description、H1、FAQ 或页面布局。

### 16.6 本地验证

- 项目指定的 Node `20.19.0` 已安装并用于验证。
- 第一次构建因为本地依赖未安装而明确失败，执行 `npm ci` 后重新验证。
- 第一次整套 Playwright 测试因为三个测试浏览器未安装而失败；安装项目锁定版本的 Chromium、Firefox 和 WebKit 后重新验证。
- `npm run build`、`npm run verify:dist`、`npm run seo:check`、`npm run sitemap:verify`、`npm run lint` 全部通过；`npm run test` 为 120 项全部通过。
- Codex App 内置浏览器确认新正文可见，title、meta description、H1 和 canonical 未变化。
- 上传非图片文件时显示明确错误，不打开编辑器；上传真实 JPG 后编辑器、Pixel Size、Palette 和下载按钮正常出现。
- 390px 移动端下正文没有越界，页面没有横向溢出。

### 16.7 复查计划

- 上线后先确认首页重新抓取、页面和上传功能正常。
- 抓取后的前 2 至 3 个完整日期只看硬错误。
- 使用抓取后的完整 7 天 final 数据复查 `image to pixel art` 的 Desktop CTR，同时保护 `pixel art converter`、`pixel art maker` 和 `pixel art generator`。
- 如果 Google 仍不采用这段正文，不继续连续改文案，先重新检查实际搜索摘要来源。
