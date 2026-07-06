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
