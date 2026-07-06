# GSC Batch A Monitoring - 2026-06-12

本表用于观察批次 A 上线后的变化。

批次 A 上线时间：

- `2026-06-07 11:00` 左右：增强 `/converter/photo-to-pixel-art/`
- `2026-06-07 11:11` 左右：顶部导航收窄为单个 `Photo to Pixel Art` 链接

当前结论：

- 暂停下一批 SEO 代码任务。
- 只做文档监控。
- `2026-06-19` 已完成 11 天早期预检，未发现硬故障，也未看到 photo 页明显接住核心词。
- `2026-06-22` 已完成正式 14 天复查，photo 页仍未明显接住核心词，首页没有受伤。
- `2026-07-05` 已完成 27 天 final 复查：GSC final 数据到 `2026-07-03`，严格 28 天 final 还差 1 天。
- 复查结论：全站和首页安全，但 photo 页仍未接住 `photo to pixel art` / `picture to pixel art` 这两个核心词。
- 下一步不直接开下一批代码任务，先做只读诊断和下一轮方案判断。

## 1. 判断规则

成功信号不是全站马上上涨。

本批次真正要看：

1. `/converter/photo-to-pixel-art/` 是否开始拿到更多曝光。
2. `photo to pixel art` 是否开始更多展示 photo 页。
3. `picture to pixel art` 是否开始更多展示 photo 页。
4. 首页 `image to pixel art` 和 `pixel art converter` 是否稳定。

现在不能继续改这些：

- 首页 maker / generator / converter。
- `/converter/8-bit-art-generator/`。
- `/converter/image-to-pixel-art/`。
- 多语言。
- 博客。
- 全站导航、footer、schema、sitemap。

## 2. 窗口汇总

| 检查日期 | 数据类型 | 数据窗口 | 全站点击 | 全站曝光 | 全站 CTR | 全站排名 | photo 页点击 | photo 页曝光 | photo 页 CTR | photo 页排名 | 结论 |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `2026-06-12` | all | `2026-06-07` 到 `2026-06-11` | 1,898 | 37,007 | 5.13% | 7.49 | 1 | 148 | 0.68% | 51.16 | 太早，继续观察 |
| `2026-06-19` | final | `2026-06-07` 到 `2026-06-17` | 4,361 | 84,453 | 5.16% | 7.55 | 7 | 383 | 1.83% | 50.14 | 11 天早期预检，继续等 14 天 |
| `2026-06-22` | final | `2026-06-07` 到 `2026-06-20` | 5,507 | 106,132 | 5.19% | 7.53 | 8 | 489 | 1.64% | 49.15 | 14 天复查：全站安全，photo 页未明显接词 |
| `2026-07-05` | final | `2026-06-07` 到 `2026-07-03` | 10,978 | 206,932 | 5.31% | 7.50 | 23 | 923 | 2.49% | 48.01 | 27 天 final 复查：全站安全，photo 页未接住核心词 |

## 3. 目标 query 观察表

| 检查日期 | Query | 当前主要展示页 | 首页点击 | 首页曝光 | 首页 CTR | 首页排名 | photo 页点击 | photo 页曝光 | photo 页 CTR | photo 页排名 | 判断 |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `2026-06-12` | `photo to pixel art` | `/` | 21 | 260 | 8.08% | 5.20 | 0 | 5 | 0% | 60.00 | 仍由首页承接 |
| `2026-06-12` | `picture to pixel art` | `/` | 10 | 238 | 4.20% | 5.32 | 0 | 4 | 0% | 69.25 | 仍由首页承接 |
| `2026-06-12` | `photo to pixel` | `/` | 9 | 79 | 11.39% | 4.09 | 0 | 1 | 0% | 2.00 | photo 页样本太小 |
| `2026-06-12` | `picture to pixel` | `/` | 0 | 55 | 0% | 7.09 | 0 | 2 | 0% | 29.50 | photo 页样本太小 |
| `2026-06-19` | `photo to pixel art` | `/` | 37 | 567 | 6.53% | 5.44 | 0 | 12 | 0% | 70.33 | 仍由首页承接 |
| `2026-06-19` | `picture to pixel art` | `/` | 25 | 569 | 4.39% | 5.86 | 0 | 13 | 0% | 75.00 | 仍由首页承接 |
| `2026-06-19` | `photo to pixel` | `/` | 15 | 167 | 8.98% | 3.95 | 1 | 4 | 25.00% | 38.25 | 有一点小信号，但样本太小 |
| `2026-06-19` | `picture to pixel` | `/` | 4 | 120 | 3.33% | 6.83 | 0 | 4 | 0% | 50.00 | 仍由首页承接 |
| `2026-06-22` | `photo to pixel art` | `/` | 41 | 714 | 5.74% | 5.37 | 0 | 17 | 0% | 73.59 | 仍由首页承接，photo 页未起 |
| `2026-06-22` | `picture to pixel art` | `/` | 30 | 708 | 4.24% | 5.85 | 0 | 17 | 0% | 75.41 | 仍由首页承接，photo 页未起 |
| `2026-06-22` | `photo to pixel` | `/` | 18 | 207 | 8.70% | 3.94 | 1 | 4 | 25.00% | 38.25 | 有小信号，但样本太小 |
| `2026-06-22` | `picture to pixel` | `/` | 4 | 155 | 2.58% | 6.75 | 0 | 5 | 0% | 50.40 | 仍由首页承接 |
| `2026-07-05` | `photo to pixel art` | `/` | 90 | 1,378 | 6.53% | 5.07 | 0 | 39 | 0% | 76.97 | 仍由首页承接，photo 页未起 |
| `2026-07-05` | `picture to pixel art` | `/` | 76 | 1,368 | 5.56% | 5.26 | 0 | 21 | 0% | 76.19 | 仍由首页承接，photo 页未起 |
| `2026-07-05` | `photo to pixel` | `/` | 40 | 442 | 9.05% | 3.72 | 1 | 11 | 9.09% | 42.73 | 只有小信号，样本仍太小 |
| `2026-07-05` | `picture to pixel` | `/` | 8 | 291 | 2.75% | 6.41 | 0 | 5 | 0% | 50.40 | 仍由首页承接 |

## 4. 首页保护词观察表

| 检查日期 | Query | 页面 | 点击 | 曝光 | CTR | 排名 | 判断 |
| --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| `2026-06-12` | `image to pixel art` | `/` | 115 | 1,562 | 7.36% | 4.02 | 没有受伤 |
| `2026-06-12` | `pixel art converter` | `/` | 41 | 557 | 7.36% | 5.21 | 没有受伤 |
| `2026-06-12` | `pixel art maker` | `/` | 31 | 1,483 | 2.09% | 9.28 | 可继续观察 |
| `2026-06-12` | `pixel art generator` | `/` | 26 | 1,259 | 2.07% | 7.85 | 可继续观察 |
| `2026-06-19` | `image to pixel art` | `/` | 283 | 3,575 | 7.92% | 4.05 | 没有受伤 |
| `2026-06-19` | `pixel art converter` | `/` | 84 | 1,299 | 6.47% | 5.33 | 没有受伤 |
| `2026-06-19` | `pixel art maker` | `/` | 59 | 3,517 | 1.68% | 9.17 | 排名稳定，CTR 仍偏低 |
| `2026-06-19` | `pixel art generator` | `/` | 53 | 2,918 | 1.82% | 7.98 | 排名稳定，CTR 仍偏低 |
| `2026-06-22` | `image to pixel art` | `/` | 348 | 4,539 | 7.67% | 4.01 | 没有受伤，优于上线前 |
| `2026-06-22` | `pixel art converter` | `/` | 111 | 1,635 | 6.79% | 5.25 | 没有受伤，优于上线前 |
| `2026-06-22` | `pixel art maker` | `/` | 83 | 4,544 | 1.83% | 9.13 | 排名稳定，CTR 仍偏低 |
| `2026-06-22` | `pixel art generator` | `/` | 65 | 4,082 | 1.59% | 7.99 | 排名稳定，CTR 仍偏低 |
| `2026-07-05` | `image to pixel art` | `/` | 661 | 8,827 | 7.49% | 4.03 | 没有受伤，明显优于上线前 |
| `2026-07-05` | `pixel art converter` | `/` | 199 | 3,054 | 6.52% | 5.00 | 没有受伤，明显优于上线前 |
| `2026-07-05` | `pixel art maker` | `/` | 146 | 8,534 | 1.71% | 9.08 | 排名稳定，CTR 仍偏低，后续回到首页议题 |
| `2026-07-05` | `pixel art generator` | `/` | 157 | 8,082 | 1.94% | 8.07 | 曝光和排名稳定，CTR 仍偏低 |

## 5. 继续或暂停规则

继续下一批代码任务的条件：

- 到 `2026-07-05`，能看出 photo 页已经开始明显接住目标词。
- 或者发现明确硬故障，例如页面没有被抓取、canonical 错误、结构化数据坏了、线上页面打不开。

截至 `2026-07-05`，这两个条件都没有满足：

- photo 页没有明显接住目标词。
- 线上页面没有发现硬故障。

继续观察的条件：

- photo 页样本仍然很小。
- 首页核心词没有受伤。
- 目标词仍主要由首页承接，但没有明显下滑。

暂停下一批代码的条件：

- 当前就是这个状态。
- 不能因为 5 天数据不明显，就马上改首页、8-bit、image-to-pixel、多语言或博客。

## 6. 2026-06-19 早期预检记录

本次是上线后 11 天早期预检，不是正式 14 天复查。

可用数据：

- GSC final 数据到 `2026-06-17`。
- GSC all 数据到 `2026-06-19`。
- 本次统计使用 final 窗口：`2026-06-07` 到 `2026-06-17`。

只读线上检查结果：

| 检查项 | 结果 |
| --- | --- |
| `/converter/photo-to-pixel-art/` 是否 200 | 通过 |
| canonical | `https://pixelartvillage.org/converter/photo-to-pixel-art/` |
| 顶部是否有 `Photo to Pixel Art` 入口 | 通过 |
| 是否仍有 `Tools` 下拉 | 没有 |
| FAQ JSON-LD | 存在 |
| HowTo JSON-LD | 存在 |

本次判断：

- 全站没有受伤。
- 首页核心词没有受伤。
- photo 页还没有明显接住 `photo to pixel art` / `picture to pixel art`。
- `photo to pixel` 有 1 次点击，但样本太小，不能当成成功。
- 继续等 `2026-06-21` 做正式 14 天复查。

当时动作：

```txt
不改代码。
不提交。
不部署。
继续观察到 2026-06-21。
```

## 7. 2026-06-22 正式 14 天复查记录

本次是批次 A 上线后的正式 14 天复查。

可用数据：

- GSC final 数据到 `2026-06-20`。
- GSC all 数据到 `2026-06-21`。
- 本次统计使用 final 窗口：`2026-06-07` 到 `2026-06-20`。
- 对照窗口：`2026-05-24` 到 `2026-06-06`。

只读线上检查结果：

| 检查项 | 结果 |
| --- | --- |
| `/converter/photo-to-pixel-art/` 是否 200 | 通过 |
| canonical | `https://pixelartvillage.org/converter/photo-to-pixel-art/` |
| 顶部是否有 `Photo to Pixel Art` 入口 | 通过 |
| 是否仍有 `Tools` 下拉 | 没有 |
| FAQ JSON-LD | 存在 |
| HowTo JSON-LD | 存在 |

本次判断：

- 全站没有受伤：点击、曝光、CTR、平均排名都比对照窗口略好。
- 首页核心词没有受伤：`image to pixel art` 和 `pixel art converter` 都更稳。
- photo 页自身没有明显起量：点击从 6 到 8，曝光从 581 到 489，排名仍在 49 左右。
- `photo to pixel art` 和 `picture to pixel art` 仍然主要由首页承接。
- photo 页在这两个核心词上只有少量曝光、0 点击、排名 70 左右。
- `photo to pixel` 有 1 次点击，但样本太小，不能当成成功信号。

结论：

```txt
14 天复查不支持开启下一批大改。
继续观察到 2026-07-05 的 28 天窗口。
如果要提前行动，也只能做只读诊断，不改代码。
```

允许提前做的只读诊断：

- 查 Google 是否已重新抓取 `/converter/photo-to-pixel-art/`。
- 人工看 `photo to pixel art` 和 `picture to pixel art` 的 SERP 类型。
- 复查 photo 页是否有明显技术问题。

暂时不做：

- 不改首页 title / H1 / hero / CTA。
- 不改 `/converter/8-bit-art-generator/`。
- 不改 `/converter/image-to-pixel-art/`。
- 不改多语言、博客、schema、sitemap。

## 8. 2026-06-22 21 号后只读诊断执行记录

本次按“过了 21 号，可以执行下一步任务”执行，但仍然遵守 14 天复查结论：

```txt
只做只读诊断。
不改代码。
不进入下一批 SEO 大改。
```

本地可用入口：

- 项目内没有发现专门的 GSC API 查询脚本。
- 本次没有新的 GSC 原始拉取，只沿用第 7 节的 14 天 final 数据。
- 公开页面无法确认 Google 的具体重新抓取日期；具体抓取时间仍需要 GSC URL Inspection 看。

线上技术复查：

| 检查项 | 结果 |
| --- | --- |
| `/converter/photo-to-pixel-art/` 是否 200 | 通过 |
| title | `Photo to Pixel Art Converter | Pixelate a Photo Online` |
| canonical | `https://pixelartvillage.org/converter/photo-to-pixel-art/` |
| OG title / OG url | 通过 |
| Twitter card | `summary_large_image` |
| JSON-LD | `HowTo`、`SoftwareApplication`、`FAQPage` 都存在 |
| sitemap | 包含 `/converter/photo-to-pixel-art/` |
| 首页 | 包含 `/converter/photo-to-pixel-art/` 入口 |

真实浏览器上传后控件复查：

| 控件 | 结果 |
| --- | --- |
| Upload | 可见 |
| FAQ | 可见 |
| Explore other converters | 可见 |
| Pixel Size | 可见 |
| Brightness | 上传后可见 |
| Contrast | 可见 |
| Saturation | 上传后可见 |
| Palette | 可见 |

公开搜索结果观察：

- 精准搜索 `site:pixelartvillage.org/converter/photo-to-pixel-art/` 可以找到 photo 页。
- 带品牌或精确 URL 的 `photo to pixel art` / `picture to pixel art` 搜索可以找到 photo 页。
- 泛搜索 `photo to pixel art` / `picture to pixel art` 仍然更偏首页、旧 `.com` 站和竞品页面，不能证明 photo 页已经接住目标词。

本次结论：

- 没发现明显技术故障。
- photo 页已可访问、可索引、可操作，结构化数据也正常。
- 但公开搜索和 14 天 GSC 数据都不支持马上进入下一批大改。
- 当时下一步是等 `2026-07-05` 做 28 天 GSC 复查；除非 GSC URL Inspection 显示硬故障，否则不改代码。

## 9. 2026-07-05 28 天复查记录

本次是批次 A 上线后的 28 天复查点。

可用数据：

- GSC final 数据到 `2026-07-03`。
- GSC all 数据到 `2026-07-05`，但 `all` 包含未最终稳定数据，只做辅助参考。
- 本次正式统计使用 final 窗口：`2026-06-07` 到 `2026-07-03`。
- 这个窗口是 27 天 final 数据，严格 28 天 final 还差 1 天。
- 对照窗口：`2026-05-11` 到 `2026-06-06`。

只读线上检查结果：

| 检查项 | 结果 |
| --- | --- |
| 首页是否 200 | 通过 |
| `/converter/photo-to-pixel-art/` 是否 200 | 通过 |
| photo 页 title | `Photo to Pixel Art Converter | Pixelate a Photo Online` |
| photo 页 canonical | `https://pixelartvillage.org/converter/photo-to-pixel-art/` |
| photo 页 H1 | `Photo to Pixel Art Converter` |
| photo 页 meta description | `Turn a photo or picture to pixel art online. Upload portraits, pet photos, or camera shots, then adjust pixel size and palette in your browser.` |
| 首页是否有 photo 页入口 | 通过 |
| photo 页 FAQ | 可见 |
| photo 页 HowTo | 可见 |
| photo 页上传区 | 可见 |
| JSON-LD | 存在 |
| GSC URL Inspection | `Submitted and indexed` |
| Google 最近抓取 | `2026-06-29T06:09:34Z` |
| Google canonical | `https://pixelartvillage.org/converter/photo-to-pixel-art/` |
| 用户 canonical | `https://pixelartvillage.org/converter/photo-to-pixel-art/` |

本次判断：

- 全站安全：上线后 final 窗口点击、曝光、CTR、平均排名都没有变坏。
- 首页安全：`image to pixel art` 和 `pixel art converter` 明显优于上线前。
- photo 页自身略有改善：点击从 `11` 到 `23`，CTR 从 `1.05%` 到 `2.49%`，但曝光没有增长，排名仍在 `48` 左右。
- GSC URL Inspection 显示 photo 页已收录、允许索引、抓取成功，canonical 也正确。
- `photo to pixel art` 仍由首页承接，photo 页只有 `39` 曝光、`0` 点击、排名 `76.97`。
- `picture to pixel art` 仍由首页承接，photo 页只有 `21` 曝光、`0` 点击、排名 `76.19`。
- `photo to pixel` 有 `1` 次点击，但样本太小，不能当成成功。
- `pixel art maker` / `pixel art generator` 仍然是首页 CTR 问题，不是本批次要马上处理的问题。

结论：

```txt
批次 A 没有伤到网站，也没有伤到首页。
但批次 A 没有让 photo 页接住核心 photo / picture 大词。
现在不建议直接进入下一批代码大改。
下一步先做只读诊断和下一轮方案判断。
```

下一步建议：

1. 人工看美国桌面端 `photo to pixel art` / `picture to pixel art` 搜索结果，判断 Google 更喜欢首页工具、教程页，还是专项 converter 页。
2. 重新判断 photo 页是否应该继续抢这两个大词，还是改成主攻 `convert photo to pixel art`、`convert picture to pixel art`、`photo to pixel` 这类更长尾的词。
3. 如果要继续做 photo 页，只做一份“批次 A follow-up 诊断 + 方案”，不要直接改代码。
4. 在这个判断完成前，不开 `/converter/8-bit-art-generator/`、`/converter/image-to-pixel-art/`、多语言或博客的新代码批次。

当前不做：

- 不因为 photo 页没接住词，就重写首页。
- 不马上加大首页内链。
- 不马上改 8-bit 页面。
- 不马上改 image-to-pixel 页面。
- 不马上改多语言和博客。

## 10. 2026-07-05 批次 A follow-up 只读诊断

本节执行第 9 节的下一步，只做诊断，不改代码。

数据来源：

- GSC final 窗口：`2026-06-07` 到 `2026-07-03`。
- URL Inspection：photo 页已收录，canonical 正确。
- 线上 HTML：photo 页 title、H1、HowTo、FAQ、上传区均已是新版内容。
- SERP 抽样：使用公开搜索结果做方向判断，不等同于精确美国桌面 Google 排名。

### 10.1 GSC 长尾词复查

| Query | 当前主要页面 | 首页表现 | photo 页表现 | 判断 |
| --- | --- | --- | --- | --- |
| `photo to pixel art` | `/` | 90 点击 / 1,378 曝光 / 排名 5.07 | 0 点击 / 39 曝光 / 排名 76.97 | 大词仍由首页承接 |
| `picture to pixel art` | `/` | 76 点击 / 1,368 曝光 / 排名 5.26 | 0 点击 / 21 曝光 / 排名 76.19 | 大词仍由首页承接 |
| `convert photo to pixel art` | `/` | 3 点击 / 117 曝光 / 排名 5.56 | 0 点击 / 15 曝光 / 排名 66.07 | 长尾也未转向 photo 页 |
| `convert picture to pixel art` | `/` | 4 点击 / 149 曝光 / 排名 5.41 | 0 点击 / 17 曝光 / 排名 75.94 | 长尾也未转向 photo 页 |
| `photo to pixel art converter` | `/` | 7 点击 / 161 曝光 / 排名 4.27 | 0 点击 / 9 曝光 / 排名 70.56 | converter 长尾仍由首页承接 |
| `picture to pixel art converter` | `/` | 7 点击 / 104 曝光 / 排名 4.14 | 0 点击 / 5 曝光 / 排名 62.00 | converter 长尾仍由首页承接 |
| `turn photo into pixel art` | `/` | 4 点击 / 155 曝光 / 排名 7.12 | 0 点击 / 3 曝光 / 排名 83.33 | 仍由首页承接 |
| `turn picture into pixel art` | `/` | 12 点击 / 275 曝光 / 排名 6.47 | 0 点击 / 7 曝光 / 排名 59.57 | 仍由首页承接 |

补充观察：

- `how to convert photo to pixel art` 全站有 `497` 曝光，但整体点击为 `0`，平均排名 `20.96`。
- photo 页在 `how to convert photo to pixel art` 上只有 `19` 曝光、`0` 点击、平均排名 `57.16`。
- 这说明 how-to 方向有曝光，但当前 photo 页也没有拿到这个机会。

### 10.2 SERP 抽样观察

公开搜索结果样本显示，这类词更像“马上上传图片并转换”的工具意图。

观察到的竞品/结果类型：

| 结果类型 | 例子 | 对我们的启发 |
| --- | --- | --- |
| 综合 converter 页 | `pixelartvillage.org/` 首页、Sprite-AI image-to-pixel 页 | Google 愿意展示广义 image-to-pixel 工具页 |
| photo/picture 专项工具页 | Pi7 `picture-to-pixel-art` | 专项页需要非常直接地提供上传、参数、下载 |
| 宽泛 photo/pixel 工具页 | MakeBead pixel art converter | 竞品把 photo、picture、grid、palette、export 放在一个强工具页里 |
| AI / 大品牌生成器页 | Canva pixel art generator | 部分结果把 photo 转 pixel art 当成生成器/编辑器意图 |

这不是精确排名结论，但方向很清楚：

- 用户想要立刻上传图片。
- Google 不一定把 `photo` 和 `picture` 拆成独立 URL。
- 首页强是合理的，因为首页就是完整工具入口。
- photo 页如果只是“同一个工具 + photo 文案”，很难超过首页。

### 10.3 当前判断

本轮诊断结论：

```txt
photo 页不是收录问题。
photo 页不是 canonical 问题。
photo 页不是页面打不开问题。
photo 页也不是没有上线新版内容。

真正问题是：Google 认为首页对这些词更强。
```

所以不建议继续用小修小补强行让 photo 页抢 `photo to pixel art` / `picture to pixel art`。

### 10.4 下一步建议

建议下一步不要直接改代码，先选方向：

| 方向 | 做什么 | 是否推荐 |
| --- | --- | --- |
| A. 保留首页承接大词 | 让首页继续负责 `photo to pixel art` / `picture to pixel art`，photo 页作为辅助专项页 | 推荐 |
| B. photo 页改成长尾教程/专项页 | 让 photo 页主攻 `how to convert photo to pixel art`、`convert photo to pixel art online` 这类更窄词 | 可讨论 |
| C. 继续强推 photo 页抢大词 | 继续加内链、加密度、改标题，试图超过首页 | 不推荐 |

我建议采用 A + B：

- 短期承认首页继续承接 `photo to pixel art` / `picture to pixel art`。
- photo 页不再硬抢大词，改成支持更窄的 photo/picture 教程和场景词。
- 下一批代码不要直接做 8-bit 或多语言，先整理一个“photo 页后续定位调整方案”。

暂不进入代码执行。
