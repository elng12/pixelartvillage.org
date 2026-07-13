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
| 下次复查日期 | 下一轮 SEO 批次开始前 |

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
