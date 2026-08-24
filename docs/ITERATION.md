# Pixel Art Village 迭代记录

这个文件是 `pixel-art-v2` 的长期优化记录。
以后每次改 SEO、converter 页面、工具 UI、构建脚本、sitemap、Blog、外链或部署，都要在这里留下记录。

## 当前状态

| 字段 | 内容 |
|---|---|
| 项目类型 | Vite + React 像素图工具站 |
| 当前阶段 | 工具主站已运行，SEO / pSEO 页面继续分批优化 |
| 当前最重要目标 | 让首页继续做主工具入口，先把首页大曝光变成更多点击 |
| 当前最大问题 | 首页 `maker` / `generator` 曝光大但 CTR 偏低；photo 页没有抢回核心词 |
| 当前 SEO 主文档 | `docs/GSC_SEO_DISCUSSION_LOG_2026-06-06.md` |
| 下次复查日期 | `2026-08-10` 用 `2026-07-31` 至 `2026-08-06` 的 final 数据复查首页和 `/es/` |

## 当前 SEO 判断

不要说“网站没流量”。更准确的说法是：

> 曝光已经起来了，但很多曝光没有变成点击。

首页当前很强，负责总入口是正常的。
问题是子页面还不够像专项答案页。

当前分工方向：

| 页面 | 应该承接 |
|---|---|
| `/` | `image to pixel art`、`pixel art converter`、`pixel art maker`、`pixel art generator` |
| `/converter/photo-to-pixel-art/` | 辅助承接 photo / picture 细分和 how-to 长尾，不再硬抢首页大词 |
| `/converter/png-to-pixel-art/` | `png to pixel art` |
| `/converter/gif-to-pixel-art/` | `gif to pixel art` |
| `/converter/8-bit-art-generator/` | `8 bit art generator` |

## 批次 A 边界

批次 A 已执行并完成 28 天复查。当前结论：

- photo 页没有伤害首页。
- photo 页已收录，技术上没有硬故障。
- photo 页没有成功接住 `photo to pixel art` / `picture to pixel art`。
- 后续不继续硬改 photo 页抢首页大词。

历史边界：

- 只动 `/converter/photo-to-pixel-art/`。
- 优先改 `src/content/pseo-pages.en.json`。
- 不顺手改首页、其他 converter、多语言、Blog、`8-bit` 页面。
- JSON 不够表达时，再考虑组件或预渲染脚本。

## 常用验证命令

| 命令 | 用途 |
|---|---|
| `npm run build` | 构建 + 预渲染 |
| `npm run verify:dist` | 验证生产产物 |
| `npm run lint` | lint |
| `npm run typecheck` | 类型检查 |
| `npm run seo:check` | SEO 检查 |
| `npm run sitemap:verify` | sitemap 检查 |
| `npm run seo:density` | 关键词密度 |
| `npm run test` | Playwright |

## 页面验收清单

每次页面改完，至少看：

1. 本地页面 HTTP 200。
2. 构建产物里对应 HTML 存在。
3. title / canonical 正确。
4. OG / Twitter 标签正确。
5. FAQ / HowTo JSON-LD 正常。
6. 页面真实控件可见。
7. sitemap 没漏目标页。

## 优化卡模板

每次开始前先填这张卡。

| 字段 | 内容 |
|---|---|
| 日期 |  |
| 问题 |  |
| GSC 证据 |  |
| 目标页面 |  |
| 当前主要承接页面 |  |
| 本轮边界 |  |
| 本轮不做 |  |
| 修改计划 |  |
| 验证方式 |  |
| 复查日期 |  |

## 记录模板

```md
## YYYY-MM-DD 优化记录

问题：
GSC 证据：
目标页面：
本轮边界：
修改：
验证：
未做：
复查日期：
下一步：
```

## 长期规则

1. 不从“感觉 SEO 不好”直接全站改。
2. 不拿当天 GSC 半成品数据下结论。
3. 不把讨论文档当成已部署结果。
4. 不削弱首页来救子页面。
5. 每个专项词要有明确 URL 归属。
6. 每轮都要写清楚“不动哪些页面”。
7. 页面验收必须打开真实页面或构建产物。

## 2026-06-09 初始化记录

问题：项目缺少统一迭代记录。
证据：创建 `docs/ITERATION.md`。
本轮边界：只补项目维护文档，不改业务代码。
修改：新增长期迭代记录模板。
验证：文件已创建。
未做：未修改页面、功能、SEO 内容、部署配置。
复查日期：下次项目改动前。
下一步：每次优化前先填“优化卡模板”。

## 2026-06-09 文档精修记录

问题：`AGENTS.md` 和 `docs/ITERATION.md` 需要写入 Pixelart 的真实 SEO 批次边界。
证据：`docs/GSC_SEO_DISCUSSION_LOG_2026-06-06.md` 已明确首页强、子页面弱、批次 A 目标为 `photo-to-pixel-art`。
本轮边界：只精修 `AGENTS.md` 和 `docs/ITERATION.md`，不改业务代码，不提交 git。
修改：补入 GSC 完整日期规则、Query/URL 归属、批次 A 边界、页面验收清单、常用命令。
验证：待复查文件内容和 git 状态。
未做：未修改首页、converter 内容、Blog、多语言、构建脚本、部署配置。
复查日期：下一轮 Pixelart SEO 批次开始前。
下一步：后续做 SEO 时，先按本文件确认本轮页面边界。

## 2026-06-22 批次 A 21 号后只读诊断记录

问题：用户确认已经过了 21 号，要求执行下一步任务。
GSC 证据：沿用 `docs/GSC_BATCH_A_MONITORING_2026-06-12.md` 第 7 节 14 天 final 数据；photo 页仍未明显接住 `photo to pixel art` / `picture to pixel art`。
目标页面：`/converter/photo-to-pixel-art/`。
本轮边界：只做线上和公开搜索只读诊断，不改代码，不提交，不部署。
修改：只补充本次诊断记录到 GSC 监控文档和迭代记录。
验证：线上页面 200；title、canonical、OG、Twitter、HowTo、SoftwareApplication、FAQPage 正常；sitemap 和首页都有 photo 页入口；上传图片后 Pixel Size、Brightness、Contrast、Saturation、Palette 控件可见。
未做：未改首页、其他 converter、多语言、Blog、schema、sitemap、构建脚本。
复查日期：`2026-07-05`。
下一步：等 28 天 GSC final 窗口；提前只允许查 GSC URL Inspection 是否有硬故障。

## 2026-07-05 批次 A 28 天复查记录

问题：批次 A 到了 28 天复查点，需要判断是否继续下一批 SEO 任务。
GSC 证据：GSC final 数据到 `2026-07-03`；正式统计窗口为 `2026-06-07` 到 `2026-07-03`，严格 28 天 final 还差 1 天。全站点击 `10,978`，曝光 `206,932`，CTR `5.31%`，平均排名 `7.50`。photo 页点击 `23`，曝光 `923`，CTR `2.49%`，平均排名 `48.01`。GSC URL Inspection 显示 photo 页已收录，Google 最近抓取时间是 `2026-06-29T06:09:34Z`，canonical 正确。
目标页面：`/converter/photo-to-pixel-art/`。
本轮边界：只做 GSC 复查、线上页面只读检查和文档记录，不改代码，不提交，不部署。
修改：更新 `docs/GSC_BATCH_A_MONITORING_2026-06-12.md` 和 `docs/GSC_SEO_DISCUSSION_LOG_2026-06-06.md` 的 7 月 5 日复查结论。
验证：线上首页和 photo 页均为 200；photo 页 title、canonical、H1、meta description、FAQ、HowTo、上传区和 JSON-LD 正常；首页保留 photo 页入口；URL Inspection 为 `Submitted and indexed`。
未做：未改首页、其他 converter、多语言、Blog、schema、sitemap、构建脚本。
复查日期：下一轮 SEO 方案确定前。
下一步：先做只读诊断和下一轮方案判断；不要直接开 8-bit、image-to-pixel、多语言或博客的新代码批次。

## 2026-07-05 批次 A follow-up 只读诊断记录

问题：需要判断 photo 页是否继续抢 `photo to pixel art` / `picture to pixel art`，还是调整定位。
GSC 证据：`photo to pixel art`、`picture to pixel art`、`convert photo to pixel art`、`convert picture to pixel art`、`photo to pixel art converter` 等词仍主要由首页承接；photo 页在这些词上曝光少、0 点击、排名大多在 60 到 80 左右。
目标页面：`/converter/photo-to-pixel-art/`。
本轮边界：只做 GSC 长尾词诊断、SERP 抽样观察和文档记录，不改代码，不提交，不部署。
修改：在 `docs/GSC_BATCH_A_MONITORING_2026-06-12.md` 增加第 10 节；在 `docs/GSC_SEO_DISCUSSION_LOG_2026-06-06.md` 增加第 26 节。
验证：线上 HTML 已确认新版 photo 页内容存在；公开搜索样本显示该类词主要是工具意图，综合 converter 页仍有竞争力。
未做：未改首页、photo 页、8-bit、image-to-pixel、多语言、Blog、schema、sitemap、构建脚本。
复查日期：确认 photo 页后续定位后再定。
下一步：建议承认首页继续承接大词；photo 页作为辅助专项页，后续只讨论是否转向更窄的 how-to / convert / photo-to-pixel 长尾方向。

## 2026-07-06 批次 B 首页核心词 CTR 草案记录

问题：批次 A 复查后，需要决定下一轮 SEO 是否继续做 photo 页，还是转向首页。
GSC 证据：`2026-06-07` 到 `2026-07-03` final 窗口里，`pixel art maker` 为 146 点击 / 8,534 曝光 / CTR 1.71% / 平均排名 9.08；`pixel art generator` 为 157 点击 / 8,082 曝光 / CTR 1.94% / 平均排名 8.07。首页保护词 `image to pixel art` 和 `pixel art converter` 表现稳定。
目标页面：首页 `/`。
本轮边界：只生成批次 B 草案，不改代码，不提交，不部署。
修改：新增 `docs/GSC_BATCH_B_HOMEPAGE_CORE_CTR_2026-07-06.md`；同步更新 GSC 讨论记录和本迭代记录。
验证：文档草案已列出目标词、保护词、改动边界、验收方式和不做事项。
未做：未改首页代码、photo 页、8-bit、image-to-pixel、多语言、Blog、schema、sitemap、构建脚本。
复查日期：批次 B 草案通过并上线后再定。
下一步：先审评批次 B 草案；如果通过，再拆首页代码任务，不直接大改首页。

## 2026-07-06 批次 B 草案审评和首页任务拆解记录

问题：用户同意进入下一步，需要审评批次 B 首页草案，并生成首页代码任务拆解。
GSC 证据：沿用 `2026-06-07` 到 `2026-07-03` final 窗口；`pixel art maker` 和 `pixel art generator` 曝光大但 CTR 偏低，首页保护词稳定。
目标页面：首页 `/`。
本轮边界：只做文档审评和任务拆解，不改首页代码，不提交，不部署。
修改：在 `docs/GSC_BATCH_B_HOMEPAGE_CORE_CTR_2026-07-06.md` 增加草案审评结论和首页代码任务拆解；在 GSC 讨论记录增加第 28 节；同步本迭代记录。
验证：已确认首页文案主要来自 `src/locales/en.json` 和 `public/locales/en/translation.json`；`src/App.jsx`、`ToolSection.jsx`、`HomeBelowFold.jsx` 默认不需要改。
未做：未改首页代码、photo 页、8-bit、image-to-pixel、多语言、Blog、schema、sitemap、构建脚本。
复查日期：批次 B 任务拆解通过并上线后再定。
下一步：先审评首页任务拆解；通过后才进入首页文案代码修改。

## 2026-07-06 批次 B agents 审评记录

问题：用户要求使用相关 agents 执行这次任务，需要并行审评批次 B 是否可以进入首页文案执行。
GSC 证据：沿用 `2026-06-07` 到 `2026-07-03` final 窗口；`pixel art maker`、`pixel art generator` 是机会词，`image to pixel art`、`pixel art converter` 是保护词。
目标页面：首页 `/`。
本轮边界：只让 agents 做只读审评，并把结论写回文档；不改首页代码，不提交，不部署。
修改：在 `docs/GSC_BATCH_B_HOMEPAGE_CORE_CTR_2026-07-06.md` 和 GSC 讨论记录里补充 agents 审评结论、最终候选英文文案、执行文件顺序和构建产物验收项。
验证：3 个 agents 分别完成 SEO/GSC 审评、前端代码边界审评、首页文案建议；共同结论是有条件通过，可以进入小范围首页英文文案执行。
未做：未改首页代码、photo 页、8-bit、image-to-pixel、多语言、Blog、schema、sitemap、构建脚本。
复查日期：批次 B 代码执行并上线后再定。
下一步：如果用户确认开始改代码，只改 `public/locales/en/translation.json` 并同步 `src/locales/en.json`，默认不改首页组件。

## 2026-07-06 批次 B 首页标题小改记录

问题：用户确认首页 SEO title 可以从 `Image to Pixel Art Converter | Pixel Art Village` 改为 `Image to Pixel Art Converter & Maker | Pixel Art Village`。
GSC 证据：沿用批次 B 草案；`pixel art maker` 曝光大但 CTR 偏低，首页保护词稳定。
目标页面：首页 `/`。
本轮边界：只改首页英文 SEO title，不改描述、不改 H1、不改首页布局、不改其他页面。
修改：更新 `public/locales/en/translation.json` 和 `src/locales/en.json` 的 `home.seoTitle`。
验证：`npm run build` 通过；`npm run sitemap:verify` 通过；`npm run lint` 通过；构建产物 `dist/index.html` 的 title、OG title、Twitter title 已同步为新标题；本地 preview 首页 HTTP 200，浏览器 title 为新标题，H1 仍是 `Image to Pixel Art Converter`。
未做：未改 meta description、heroSubtitle、FAQ、photo 页、8-bit、image-to-pixel、多语言、Blog、schema、sitemap、构建脚本。
复查日期：上线后先看 2 到 3 天硬错误，正式效果看完整窗口。
下一步：跑构建检查，确认 `dist/index.html` 的 title / OG / Twitter title 都同步为新标题。

## 2026-07-06 批次 B 标题小改复查计划记录

问题：用户确认先按短周期复查，不等到很久以后才看。
GSC 证据：本次只改首页 SEO title；目标是帮 `pixel art maker` 增加点击理由，同时保护 `image to pixel art` 和 `pixel art converter`。
目标页面：首页 `/`。
本轮边界：只补复查计划，不改代码，不提交，不部署。
修改：补充批次 B 标题小改后的复查节奏。
验证：计划已写入 `docs/ITERATION.md` 和 `docs/GSC_BATCH_B_HOMEPAGE_CORE_CTR_2026-07-06.md`。
未做：未改 meta description、H1、首页文案、photo 页、8-bit、多语言、Blog、schema、sitemap、构建脚本。
复查日期：`2026-07-08` 或 `2026-07-09`。
下一步：到期只做硬检查，重点看线上 title、Google 抓取、页面是否正常；不要马上继续第二刀。

## 2026-07-08 批次 B 第一次硬检查记录

问题：标题小改上线后到了 2 天硬检查点，需要确认有没有抓取、收录、页面或 SEO 标签硬问题。
GSC 证据：GSC URL Inspection 显示首页 `verdict=PASS`、`Submitted and indexed`、`pageFetchState=SUCCESSFUL`、`robotsTxtState=ALLOWED`、`indexingState=INDEXING_ALLOWED`，Google 最近抓取时间为 `2026-07-07T07:20:14Z`，canonical 为 `https://pixelartvillage.org/`。
目标页面：首页 `/`。
本轮边界：只做线上页面、Googlebot、sitemap、robots 和 GSC URL Inspection 硬检查；不判断 SEO 成败，不改代码，不提交，不部署。
修改：在 `docs/GSC_BATCH_B_HOMEPAGE_CORE_CTR_2026-07-06.md` 增加第 13 节硬检查结果；同步本迭代记录。
验证：线上首页 `200`，无跳转；title 为 `Image to Pixel Art Converter & Maker | Pixel Art Village`；canonical 正确；H1 仍为 `Image to Pixel Art Converter`；无 noindex；Googlebot 访问首页和 sitemap 均为 `200`；`robots.txt` 和 `sitemap.xml` 均为 `200`。
未做：未改 meta description、H1、heroSubtitle、FAQ、首页布局、photo 页、8-bit、多语言、Blog、schema、sitemap、构建脚本。
复查日期：`2026-07-11` 或 `2026-07-12`。
下一步：做早期信号检查，重点看 `pixel art maker`、`pixel art generator`、`image to pixel art`、`pixel art converter`；现在不继续第二刀。

## 2026-07-11 页脚增加 ObbyList 外链

问题：需要从 Pixel Art Village 给 `https://obbylist.com/` 增加一个可被搜索引擎正常抓取的普通外链。
目标位置：全站页脚底部链接栏。
本轮边界：只增加 ObbyList 链接和对应页面测试，不改首页文案、converter 页面、Blog、sitemap 或其他外链。
修改：增加文字链接 `ObbyList`，新窗口打开；`rel` 只包含安全属性，没有 `nofollow`。
验证：Playwright 的 Chromium 单项测试通过，真实页面能看到该链接，地址正确且没有 `nofollow`。
发布方式：随本次提交推送到 `main`，由 GitHub Pages 工作流自动发布。

## 2026-07-13 西班牙语首页描述去重记录

问题：必应报告多个页面的 meta description 重复；线上复核发现西班牙语首页 `/es/` 使用了与其他多语言首页完全相同的英文描述。
必应证据：`/es/` 最近页面明细中曝光增加 19，点击减少 17，平均排名保持第 4；更像点击率和搜索摘要问题，不是排名崩落。
目标页面：西班牙语首页 `/es/`。
本轮边界：只改西班牙语首页 `home.seoDescription`；不改葡萄牙语、Terms、Blog、英文首页、title、H1 或页面布局。
修改：将 `public/locales/es/translation.json` 中重复的英文描述替换为独立的西班牙语描述，说清免费在线转换、支持的图片格式、像素大小、调色板、预览和浏览器内导出。
验证：`npm run build`、`npm run sitemap:verify`、`npm run lint` 全部通过；本地 preview 的 `/es/` 返回 200，meta description、OG description 和 Twitter description 已同步为新的西班牙语文案，canonical 和 `lang=es` 正确，上传区可见，页面没有水平溢出。
未做：未修改其他多语言首页、其他 meta description、converter 页、Blog、Terms、schema、sitemap 或构建脚本。
复查节奏：上线后先检查抓取和搜索摘要，7 到 14 天后再对比 `/es/` 的曝光、点击、点击率和排名。

## 2026-07-13 批次 B 首页标题回滚记录

问题：批次 B 新标题上线后，首页机会词没有获得有效改善，两个保护词也出现早期下滑。
GSC 证据：最后完整日期为 `2026-07-11`；同星期 4 天对比中，首页点击下降 54.6%，曝光下降 47.2%，平均排名从 7.44 变为 12.11。`pixel art maker` 和 `pixel art generator` 的曝光分别下降 88.1% 和 90.2%；`image to pixel art` 点击下降 58.3%、CTR 从 5.95% 降至 2.97%；`pixel art converter` 曝光下降 58.4%、平均排名从 4.95 变为 8.17。
目标页面：首页 `/`。
本轮边界：只回滚英文首页 `home.seoTitle`；不改 meta description、H1、heroSubtitle、FAQ、首页布局、子页面或多语言页面。
修改：将标题从 `Image to Pixel Art Converter & Maker | Pixel Art Village` 恢复为 `Image to Pixel Art Converter | Pixel Art Village`，同步更新 public 和 src 两份英文文案。
验证：`npm run build`、`npm run verify:dist`、`npm run seo:check`、`npm run sitemap:verify`、`npm run lint` 全部通过；本地 preview 首页返回 200，title、OG title 和 Twitter title 已同步恢复，canonical 和 H1 正确，上传区可见，页面没有水平溢出。
未做：未修改其他首页文案、converter 页、Blog、schema、sitemap 或构建脚本。
复查节奏：上线后先确认 Google 重新抓取；正式数据使用完整窗口，不立刻做第二次首页文案修改。

## 2026-07-23 首页回滚和西班牙语描述复查记录

问题：7 月 13 日的英文首页标题回滚和西班牙语首页描述去重都到了复查点，需要确认 Google 是否重新抓取，并判断是否已经有足够数据下结论。
GSC 证据：本次能读取到的最新 final 数据截止 `2026-07-20`。URL Inspection 显示首页最近抓取时间为 `2026-07-23T02:36:02Z`，`/es/` 最近抓取时间为 `2026-07-21T06:04:28Z`；两页均为 `PASS`、`Submitted and indexed`、允许抓取、抓取成功，Google canonical 与页面 canonical 一致。
目标页面：首页 `/` 和西班牙语首页 `/es/`。
本轮边界：只读检查 GSC、URL Inspection 和线上真实页面；只更新复查文档，不改页面代码，不提交，不部署。
首页数据：标题测试期 `2026-07-06` 至 `2026-07-12` 为 523 点击、15,989 曝光、CTR 3.27%、平均排名 11.6；回滚后 `2026-07-14` 至 `2026-07-20` 为 829 点击、27,146 曝光、CTR 3.05%、平均排名 8.5。相比标题测试期，点击增加 58.5%，曝光增加 69.8%，平均排名改善 3.1 位。
首页判断：回滚后的时间段里，曝光和排名明显恢复，`pixel art maker` 和 `pixel art generator` 也从测试期低点恢复，但首页仍未完全回到 `2026-06-29` 至 `2026-07-05` 的原始基线。URL Inspection 只提供最近一次抓取时间，不能证明恢复全部由标题回滚造成；现有证据支持继续保留回滚后的原标题，不做第二次首页文案修改。
西班牙语数据：`2026-07-06` 至 `2026-07-12` 为 23 点击、412 曝光、CTR 5.58%、平均排名 18.8；`2026-07-14` 至 `2026-07-20` 为 17 点击、399 曝光、CTR 4.26%、平均排名 13.8。当前唯一确认的变更后抓取时间是 `2026-07-21`，而现有 final 数据截止 `2026-07-20`，所以还不能用来判断新描述成功或失败。
线上验证：首页和 `/es/` 均为 HTTP 200、无跳转、canonical 正确、无 noindex、上传控件可见、没有横向溢出；首页 title 已恢复为 `Image to Pixel Art Converter | Pixel Art Village`；`/es/` 的 meta、OG 和 Twitter description 均为新的西班牙语描述。
修改：在 `docs/GSC_BATCH_B_HOMEPAGE_CORE_CTR_2026-07-06.md` 补充首页回滚复查结论，并同步本迭代记录和下次复查日期。
未做：未改 title、meta description、H1、heroSubtitle、FAQ、首页布局、converter 页、多语言内容、Blog、schema、sitemap 或构建脚本。
复查日期：`2026-08-02`。
下一步：等 Google 重新抓取后的 7 个完整日期都进入 final 数据，再复查首页恢复程度和 `/es/` 新描述效果；期间不做第二次 SEO 文案修改。

## 2026-08-02 首页回滚和西班牙语描述 7 天复查记录

问题：到了 8 月 2 日计划复查点，需要使用 Google 重新抓取后的完整 7 天数据，判断英文首页是否继续恢复，以及西班牙语独立描述是否有效。
GSC 证据：本次只使用 final 数据，最新完整日期为 `2026-07-30`。首页 `2026-07-24` 至 `2026-07-30` 为 978 点击、32,938 曝光、CTR 2.97%、平均排名 8.13；相比回滚早期点击增加 18.0%、曝光增加 21.3%、排名改善 0.35 位。相比原标题基线，曝光高 10.4%，但点击仍低 11.8%，主要差距是 CTR。
首页重点词：`pixel art maker` 和 `pixel art generator` 已基本恢复；`pixel art converter` 的点击和曝光已恢复；`image to pixel art` 曝光接近基线，但 CTR 为 4.65%、排名 5.04，仍弱于基线的 6.23% 和 4.03。
西班牙语数据：新描述抓取后的 `2026-07-22` 至 `2026-07-28` 为 16 点击、356 曝光、CTR 4.49%、平均排名 13.60；与抓取前过渡期基本持平。样本很小，不能证明明显提升，也没有硬伤证据。
目标页面：首页 `/` 和西班牙语首页 `/es/`。
本轮边界：只读检查 GSC final 数据、URL Inspection 和线上真实页面；只更新复查文档，不改页面代码，不提交，不部署。
验证：首页和 `/es/` 均为 HTTP 200、无跳转；GSC 均为 `PASS`、`Submitted and indexed`、允许抓取、抓取成功，Google canonical 与页面 canonical 一致；两页均无 noindex。
修改：在 `docs/GSC_BATCH_B_HOMEPAGE_CORE_CTR_2026-07-06.md` 增加第 15 节，并更新本迭代记录的下次复查日期。
未做：未改 title、meta description、H1、heroSubtitle、FAQ、首页布局、converter 页、多语言内容、Blog、schema、sitemap 或构建脚本。
复查日期：`2026-08-10`。
下一步：等待 `2026-07-31` 至 `2026-08-06` 的 7 天 final 数据齐全，重点复查 `image to pixel art` 的 CTR 和排名；在此之前不做第二次 SEO 文案修改。

## 2026-08-15 首页核心词分解和摘要正文小改记录

问题：计划观察窗口已经齐全，首页总 CTR 仍未恢复；`image to pixel art` 的搜索结果摘要抽样采用了首屏第二段正文，而不是 meta description，这段正文只在介绍其他页面入口，点击理由偏弱。
GSC 证据：`2026-07-31` 至 `2026-08-06` 首页为 959 点击、32,261 曝光、CTR 2.97%、平均排名 8.19；`image to pixel art` 为 119 点击、2,336 曝光、CTR 5.09%、平均排名 5.12，仍弱于原标题基线的 6.23% 和 4.03。设备分解显示 Desktop CTR 从基线 6.05% 降至 4.45%，Mobile 从 6.54% 变为 6.01%。
目标页面：首页 `/`。
本轮边界：只改英文首页 `home.heroSubtitle2`，不改 title、meta description、H1、FAQ、布局、广告页、其他 converter、多语言页面或 Blog。
修改：把介绍站内页面分工的第二段正文，改为直接说明免费、支持格式、实时预览、像素大小、调色板、抖动和浏览器内导出。
验证：第一次构建因本地依赖未安装而明确失败；执行 `npm ci` 后，使用项目指定的 Node `20.19.0` 重新运行，`npm run build`、`npm run verify:dist`、`npm run seo:check`、`npm run sitemap:verify`、`npm run lint` 全部通过。第一次整套 Playwright 测试因三个测试浏览器未安装而失败；安装项目锁定版本的 Chromium、Firefox 和 WebKit 后，`npm run test` 120 项全部通过。Codex App 内置浏览器确认新正文可见，title、meta description、H1 和 canonical 未变化；非图片文件会显示明确错误，真实 JPG 能打开编辑器并显示 Pixel Size、Palette 和下载按钮；390px 移动端没有横向溢出。
复查节奏：上线并被 Google 重新抓取后，先看硬错误，再用抓取后的完整 7 天 final 数据复查 Desktop CTR 和四个首页重点词。
下一步：本轮不提交、不推送、不部署。发布后先确认 Google 重新抓取，再用抓取后的完整 7 天 final 数据复查。

## 2026-08-24 32x32 固定尺寸工具页实现记录

问题：需要判断并执行 `32x32` 专项页，避免再次上线只有文案和跳转按钮、没有独立产品能力的薄页面。
需求证据：Google Keyword Planner 使用“所有位置、所有语言、Google、过去 12 个月”查询；`image to pixel art 32x32` 和 `32x32 image converter` 均显示月搜 `100-1000`，前者同比 `+900%`、三个月变化 `0%`，精确长尾多为 `10-100`。账号没有活跃广告，因此只能看到区间，不能把 `+900%` 当成稳定增长率。GSC 最近 28 个 final 日期中，`image to pixel art 32x32` 已有 159 曝光、2 点击、平均排名约 9.14，主要由首页承接。
目标页面：`/converter/32x32-pixel-art/`。
本轮边界：只实现英文 32x32 固定输出功能和对应专项页；不改首页、photo 页、其他 converter 内容、多语言内容、Blog 或部署配置。
修改：将 `image to pixel art 32x32` 定为本页唯一核心词，title 为 56 字符，meta description 为 159 字符，H1 和首屏说明自然覆盖核心词；内容源增加机器可读的关键词、意图、归属 URL、辅助词和排除词，构建前新增 55-60 / 150-160 长度及唯一归属校验。新增真实 32x32 处理路径；提供“裁剪填满 / 完整适配”两种方形适配模式；预览按 32x32 网格显示；导出提供 32x32、64x64、128x128，其中放大版本使用最近邻缩放；新增专项内容、HowTo、FAQ、SoftwareApplication、OG 和 sitemap 路由；主转换页增加指向该专项页的上下文内链；新增尺寸和透明留白的浏览器回归测试。
首屏修订：首次真实页面检查发现 SEO 介绍、工具标题和上传区纵向重复，导致核心上传动作落到首屏下半部；第一版左右分栏又让标题与工具形成两个竞争焦点。最终改为单一居中 H1、一句价值说明、下方完整上传区和末尾三项关键信息。在 780 x 764 视口中上传区位于约 258-482px；390 x 844 移动端中位于约 319-543px，关键信息行底部约 657px，桌面和手机首屏都能完整看到主操作且无横向溢出。
验证：Node `20.19.0` 下 `npm run build` 通过，预渲染生成 `dist/converter/32x32-pixel-art/index.html`，title、canonical、OG、Twitter、HowTo、FAQ 和 sitemap 均通过构建检查。Chromium 专项测试验证 32x32 精确导出、完整适配透明留白、64x64 最近邻放大和 390px 无横向溢出；现有 export、pSEO ownership 和 layout 共 6 个 Chromium 测试通过；`npm run lint` 通过。本地真实页面为 HTTP 200，上传区、内容、FAQ 和站内链接可见。
已知测试基线：`npm run test:unit` 中新增的 32x32 纯函数和内容断言通过，但整套命令仍被仓库原有的 BMP 西班牙语显式跳转断言阻断；当前 `_redirects` 与 `HEAD` 都使用两段跳转策略，`npm run build` 的 redirect 校验通过，本轮不扩大范围修改该旧测试。
发布结果：实现提交为 `001f128`，已推送 `main`；GitHub Pages、CI 和 Lighthouse CI 均通过。线上目标页 HTTP 200，title 56 字符、meta description 159 字符、canonical、H1、上传区和主转换页上下文内链均已核对，线上 sitemap 已包含目标 URL。
GSC 结果：URL Inspection API 返回 `URL is unknown to Google`，符合新页面首次上线状态。已于 `2026-08-24T14:12:38Z` 重新提交 `https://pixelartvillage.org/sitemap.xml`，接口返回 pending、0 warnings、0 errors。当前内置浏览器登录的 Google 账号没有该资源权限，无法在 GSC 界面点击“请求编入索引”；没有使用仅适用于 JobPosting / BroadcastEvent 的 Indexing API 冒充普通页面提交。
未做：没有创建 16x16、Minecraft 或 AI 新页面；GSC 界面的单 URL“请求编入索引”仍待有权限账号完成。
复查节奏：发布并被 Google 抓取后，先确认 URL Inspection、canonical 和 sitemap；再用抓取后的完整 7 天和 28 天 final 数据对比该页的曝光、点击、查询归属和首页是否出现自相竞争。
下一步：用有 `pixelartvillage.org` 权限的 Google 账号在 GSC 对线上目标 URL 点击一次“请求编入索引”；随后等待实际抓取，在此之前不扩建第二个尺寸页。
