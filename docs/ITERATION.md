# Pixel Art Village 迭代记录

这个文件是 `pixel-art-v2` 的长期优化记录。
以后每次改 SEO、converter 页面、工具 UI、构建脚本、sitemap、Blog、外链或部署，都要在这里留下记录。

## 2026-09-14 项目文件整理与 Git 归档

授权：用户要求整理项目文件，将应保留的内容提交上传，删除无用文件。本轮开始时 main 与实时 origin/main 均为 `ad2b50c`，没有未上传提交。保留并归档已有项目规则、竞品优先级记录、历史迭代及发布回执、HowItWorksSection 的可选 compactLayout 参数；该参数默认 false，当前调用没有开启，不改变现有页面布局。仅清理 AGENTS.md 的行尾空白和多余末尾空行，不重写规则。

Git 清理：35 个已经被现有 .gitignore 排除、却仍在 Git 跟踪中的本地文件退出跟踪，包括 Claude 本地配置、33 张 CodeBuddy 缓存图和一份 Superdesign 本地设计稿；电脑上的原文件全部保留，不改变本地权限或 hook。正式 OG 图、调色板数据、favicon 资源和历史文档保留，没有一律删除被忽略但仍受跟踪的资源，也没有改写 Git 历史。

实际删除：当前源码、测试和脚本均无引用，且历史记录确认已由 mana 案例替代的 `public/sprite-demo-pixel6.png`；另删除约 16MB 的旧 `.lighthouseci/` 自动报告。保留现有失败测试证据、人工截图、依赖和其他不明用途文件。两份 sitemap 按现有脚本重新生成，确认相对 HEAD 只有日期变化，正式 sitemap 仍为 205 个 URL；不修改生成策略或 URL 集合。

本地验证：Node 20.19.0 完整 build（含 SEO、dist 和重定向校验）、lint、typecheck、sitemap:verify 与差异空白检查通过。浏览器使用独立 4193 端口加载本轮真实 dist，不复用 4173 端口的旧发布副本。首次 Chromium 全套为 74 通过、1 跳过、1 失败：使用生产构建却未设置现有 EXPECT_CONSENT_BANNER 开关，Cookie 弹层挡住西班牙语页脚链接；保留失败证据，按生产弹层模式重新验证，不修改测试断言或业务代码。构建保留浏览器兼容性数据过期提示，未更新依赖。

最终浏览器结果：同一生产 dist 设置现有 `EXPECT_CONSENT_BANNER=1` 后，完整 Chromium 76 项全部通过，无自动重试；包含 Cookie 弹层、西班牙语导航、Photo/Sprite 桌面手机真实导出、调色板库导入导出和其他 converter 回归。未验证 Firefox/WebKit，临时端口随测试结束关闭。

上传边界：main 推送会触发现有自动部署，不修改部署配置；Git 上传、本地测试和生产验收分开记录，本轮不执行 GSC 提交或宣称搜索效果。

## 2026-09-14 Photo 页发布

新授权：用户明确要求“现在部署上线”，授权提交、推送及发布前述 Photo 页内容、真实案例和 on-page 小修。发布只包含本页源码、预渲染回退、三张相关图片、测试及本批记录；不包含已有 AGENTS、Claude 配置、竞品记录、HowItWorksSection、工作区 sitemap、旧 Sprite 示例及其他历史未提交文档修改。发布前 HEAD 与实时 origin/main 同为 `71b53602f9ea5f5885928343c773f368ab64a956`，沿用现有 Git 集成部署。干净暂存副本 `/tmp/pixelart-photo-release.uT9U2s` 用于最终验证；发布结果另行补记。

### Photo 发布回执

[Lighthouse CI 34924845946](https://github.com/elng12/pixelartvillage.org/actions/runs/34924845946) 最终成功。GitHub Actions 保留 Node 20 action runtime 弃用提示，本轮未升级工作流或依赖。

代码提交 `ad2b50c` 已推送 main。干净发布副本 Node 20 构建、lint、typecheck 通过；完整 Chromium 回归 75 项通过、1 项跳过，无重试。暂存的 8 个文件与干净构建输入逐字节一致，未混入无关工作区修改。

[CI 34924845971](https://github.com/elng12/pixelartvillage.org/actions/runs/34924845971) 与 [GitHub Pages 34924845968](https://github.com/elng12/pixelartvillage.org/actions/runs/34924845968) 成功。Cloudflare Pages 项目 `pixelartvillage1` 部署 `7392776a-3d8b-4fcc-a3ce-f55f7e49a9f1` 成功，正式域名已显示新版首段、真实照片案例及缩短的相关工具描述。

生产验证：Photo 初始 HTML、描述/OG/Twitter、单 H1、FAQ/schema、四词及五词主词独立第一、桌面 1440x900 和手机 390x844 真实上传/调参/下载共 3 项通过，无重试。两种尺寸下载的 80x63 PNG 与线上案例逐像素一致，无横向溢出；证据在 `/tmp/pixelart-photo-release.uT9U2s/production-test-results/`。Codex 隔离浏览器确认正式页面已更新。首页、Photo 和 PNG 页 HTTP 200/canonical 正常，robots 与 sitemap 正常，205 个 sitemap URL 抽查前 50 个全部 200，保留“未全量抽查”的警告。未修改广告设置，没有验证 Google 收录或排名提升；已有快速调参后立即下载旧结果的风险仍在范围外。此回执先保留本地，避免纯记录变更再次触发生产部署。

## 2026-09-14 Photo 页 on-page 小修（仅本地）

用户审查后授权“执行建议”。只调整英文 Photo 页首段、meta description 和本页相关工具短介绍；title、H1、URL、canonical、案例图片、工具参数及其他页面内容不变。首段自然加入完整主词，描述改为直接表达照片转换和 PNG 下载；相关工具短介绍来自 Photo 自己的 `relatedDescriptions`，React 与预渲染回退共用，不改 PNG/JPG 原页面正文。已有构建脚本同时更新 `public/pseo-og/photo-to-pixel-art.png` 中的描述文字，属于本页相关产物。

最终主内容词频复核（不含导航、页脚和元标签）：`photo to pixel art` 4 次，在四词短语中独立第一；`photo to pixel art converter` 3 次，在五词短语中独立第一。新增测试固定统计范围并检查各自严格高于其他同长度短语。这是本页词频验收，不代表 Google 搜索排名第一。

Node 20 完整构建及自带 SEO/dist/ownership/重定向检查、受影响文件 ESLint、typecheck 通过；最终 Chromium 6 项通过，无重试，包括新描述及 OG/Twitter 同步、词频断言、桌面/手机真实上传下载逐像素验证、首页/Sprite/PNG 回归。隔离浏览器刷新确认新文案。证据：`/tmp/pixel-photo-build.DhEAGk/onpage-acceptance/`。保留所有已有修改，构建后恢复原本 sitemap 字节；未提交、推送、部署或验证搜索效果，上一节记录的处理器风险仍未修复。

## 2026-09-14 Photo 页真实案例与文案去重（仅本地）

授权：用户在 Photo 页优化建议后回复“执行”。只修改 `/converter/photo-to-pixel-art/` 的英文内容、页面专属展示及对应预渲染回退；不提交、推送或部署，不改首页、其他 converter、翻译文件、Blog、广告或索引设置。保留开始时全部已有未提交修改。JSON 对比确认只改变 Photo 条目，title、description、H1 和 canonical 不变。

实现：合并原先桌面/手机各一份的介绍和要点 DOM，压缩介绍，将上传入口保留在首屏。原来的 CSS 色块只是装饰示意，本轮改为一张真实照片及本站工具实际下载的结果；不是 AI 图片，也不是手工重画。重复 DOM 不等于用户同时看到两份，也没有证据证明它导致此前流量下降。

素材：[Sunflower Public Domain](https://commons.wikimedia.org/wiki/File:Sunflower_Public_Domain.jpg)，Don McCulley，CC0；来源页已实时核验。使用 Wikimedia 的 960x762 JPEG 缩略图，保存为 `public/photo-sunflower-source.jpg`，下载后没有裁剪或修图。设置 Pixel Size 12、Palette None、dithering 关闭、Brightness/Contrast/Saturation 均为 0、grid 关闭、PNG、Pixel size 导出，透明背景选项保持默认开启；照片本身不透明。最终 `public/photo-sunflower-pixel12.png` 是本地构建页 Chromium 下载的 80x63 PNG，未二次加工。页面提供来源、许可、尺寸、参数与三条短建议，不宣称固定调色板适合所有肤色或所有照片。

验证：Node 20.19.0 最终完整构建通过，包含 ownership、SEO、dist 和重定向检查；受影响 JS/JSX ESLint、typecheck 和 diff-check 通过。Chromium 定向 6 项最终全部通过、无重试：Photo 初始 HTML/单份要点/FAQ 与 JSON-LD 一致、1440x900 与 390x844 上传入口、非法文件后重新上传、各控件、实际 80x63 下载与案例逐像素相同、无横向溢出，以及 Sprite/PNG/首页相关回归。下载证据在 `/tmp/pixel-photo-build.DhEAGk/acceptance/`。Codex 隔离浏览器和测试截图检查了页面与图片展示。构建生成的 sitemap 已恢复为构建前原始字节，未覆盖原本的本地修改。

测试过程保留的限制：初版测试错误假定导出按钮带 aria-pressed、预览图尺寸等于小尺寸导出，已按实际实现修正；调参后仅等待 aria-busy=false 也可能仍读到旧结果，最终测试等待每次预览图真正更新再下载。开发服务器首次生成的案例与构建页导出像素不一致，原因未确定，最终案例取自构建页真实下载，并在桌面和手机分别复现；没有放宽像素比较，也没有借此修改共享处理器。快速调参后立即下载的旧结果风险未修复，不将本轮内容修改说成处理器修复。未验证 Firefox/WebKit、实体手机、生产发布或搜索排名改善。预览：`http://localhost:4173/converter/photo-to-pixel-art/`。

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

## 2026-09-01 16x16 固定尺寸工具页实现记录

问题：32x32 专项页已经获得点击和稳定的查询归属，需要从 16x16、Minecraft、AI 三个方向中选择第二个真实工具页，而不是继续等待完整 14 天后才行动。
需求证据：GSC 使用 `2026-08-02` 至 `2026-08-29` 的完整 final 数据；16x16 相关可见查询共 56 曝光、1 点击，其中 `convert image to 16x16 pixel art`、`image to 16x16 pixel art`、`image to pixel art 16x16` 的平均排名约为 7.67 至 9.25，说明 Google 已经识别本站与该需求相关。Minecraft 搜索结果要求方块映射、材料统计和蓝图等当前产品没有的能力；AI 搜索结果主要要求真正的 AI 生成，与现有规则式转换器不匹配。本轮 Keyword Planner 新查询被 Google Ads 的广告拦截提示挡住，没有用猜测数字补齐。
目标页面：`/converter/16x16-pixel-art/`。
关键词归属：唯一核心词为 `image to pixel art 16x16`；辅助词为 `convert image to 16x16 pixel art`、`16x16 pixel art converter` 和 `image to 16x16 pixel art`；泛词 `image to pixel art` 继续归主转换页，`image to pixel art 32x32` 继续归 32x32 页面，`16x16 pixel art generator` 不在本页承诺范围内。
本轮边界：只新增英文 16x16 固定输出页并让现有固定尺寸组件同时支持 16 和 32；不改首页、不改 32x32 页面内容、不建 Minecraft 或 AI 页面、不新增多语言内容、不改 Blog 或部署配置。
修改：新增真实 16x16 处理路径，支持裁剪填满、完整适配、调色和抖动、16x16 精确导出，以及 32x32、64x64 最近邻放大。新增独立 H1、正文、HowTo、FAQ、SoftwareApplication、OG 和 sitemap 路由。title 为 59 字符，meta description 为 158 字符。通过内容顺序让主转换页的“Explore other converters”自动产生到新页的普通站内链接，便于搜索引擎发现。
首屏：沿用已经验收的固定尺寸页结构，采用居中 H1、一句价值说明、下方完整上传区和三项关键信息，不再使用左右分栏或工具前的大段 SEO 文案。1440 x 900 和 390 x 844 真实页面截图均确认标题、上传动作和关键信息清晰可见，没有横向溢出。
验证：Node `20.19.0` 下 `npm run seo:ownership`、`npm run build` 和 `npm run lint` 通过；构建生成 `dist/converter/16x16-pixel-art/index.html`，title、canonical、OG、Twitter、HowTo、FAQ、图片和 sitemap 均通过 dist 校验。Chromium 专项测试验证 16x16 精确导出、32x32 最近邻放大和 390px 无横向溢出，同时确认原 32x32 导出流程未回归，2 项测试全部通过。
已知测试基线：`npm run test:unit` 中新增的 16x16 内容与关键词归属断言通过；整套命令仍只有仓库原有的西班牙语 BMP 重定向断言失败，本轮没有扩大范围处理。
发布结果：实现提交为 `6b4d77a`，已推送 `main`；GitHub Pages、CI 和 Lighthouse CI 均通过。生产页由 Cloudflare 发布后返回 HTTP 200，title、description、canonical、H1、上传区、HowTo 和 FAQ 均已核对；线上 sitemap 和主转换页都已包含 `/converter/16x16-pixel-art/` 链接。
GSC 提交：上线后 URL Inspection 返回 `NEUTRAL / URL is unknown to Google`，没有抓取时间、Google canonical 或引用页，符合刚发布的新 URL 状态。已通过 Search Console API 重新提交 `https://pixelartvillage.org/sitemap.xml`，接口返回 HTTP 204；没有使用只适用于 JobPosting 和 BroadcastEvent 的 Indexing API 冒充普通页面提交。
当前状态：页面已经上线并进入 sitemap，Google 仍未发现或抓取，不能把部署成功写成已收录。
下一步：等待 Google 首次抓取；出现抓取时间后再核对 canonical，并用完整 final 数据观察 16x16 查询是否从首页转移到专项页。

## 2026-09-05 About 品牌身份链接修正

问题：GEO 只读审评发现 About 页 Organization.sameAs 指向 `https://github.com/pixelartvillage/pixelartvillage`，公开访问返回 HTTP 404。
证据：当前项目 origin 为 `https://github.com/elng12/pixelartvillage.org.git`；对应网页返回 HTTP 200，GitHub API 确认仓库公开且未归档。本地 HEAD 与远程 main 均为 `9cd5d2295b7084aa9d1c9a3c64e3fca8ac8be535`。
本轮边界：只修正 About 页品牌身份链接，不改首页、converter、Blog、翻译文案或页面布局，不提交、不推送、不部署。
修改：同步将 `src/components/About.jsx` 和 `scripts/build/prerender-spa.cjs` 的同一条 sameAs 替换为 `https://github.com/elng12/pixelartvillage.org`。共用 About 模板的语言版本随之使用正确地址，没有新增外部身份或全站 schema。
验证：Node `20.19.0` 下在临时副本运行 `npm run build`，构建及内置 SEO、dist、重定向检查全部通过；原工作区 `npm run lint` 通过。本地 18 个语言版本 About HTML 的 Organization.sameAs 和 canonical 断言全部通过；Codex 隔离浏览器确认 `/about/` 正文正常、无横向溢出，实际 DOM 保留正确 title、canonical 和新 sameAs。
工作区保护：构建副本为 `/tmp/pixelart-about-geo-TAdztq`，未覆盖原工作区已有的 sitemap、AGENTS.md 或其他无关改动。本轮代码差异检查通过。
初次验证状态：仅本地完成，生产尚未更新。未运行全套端到端测试，未修改 llms.txt、日期、统计数字或首页尺寸声明。

### 同日提交部署结果

授权：用户随后明确要求“提交部署”；仅发布本轮两个源码文件及本迭代记录，保留其他本地改动。
发布前验证：在基于远程 main 的干净临时 worktree `/tmp/pixelart-about-release-1fR1jk` 中，仅加入本轮变更；Node `20.19.0` 下 `npm run lint`、`npm run build`、`npm run verify:dist`、`npm run sitemap:verify` 通过，18 个 About HTML 的 sameAs 与 canonical 专项断言通过。
实现提交：`03756c19fec4f65e4ec917a1f6998077c6d2b5cb` 已推送 main，仅包含 `src/components/About.jsx`、`scripts/build/prerender-spa.cjs` 和本记录。
自动检查：[CI 33968334110](https://github.com/elng12/pixelartvillage.org/actions/runs/33968334110)、[GitHub Pages 33968334228](https://github.com/elng12/pixelartvillage.org/actions/runs/33968334228)、[Lighthouse CI 33968334286](https://github.com/elng12/pixelartvillage.org/actions/runs/33968334286) 均成功；该提交的 Cloudflare Pages 检查也成功，项目 `pixelartvillage1`，部署 ID `cda1bc5b-b2cb-4f12-acba-87d457c0ace9`。
生产验收：18 个语言版本的 About 页面均返回成功响应，新 sameAs 已生效、旧地址已消失；title、canonical、OG/Twitter、正文及其余 schema 与本次已验证构建一致。新 GitHub 目标返回 HTTP 200。生产启动检查确认首页、About、西班牙语 About、robots.txt 和 sitemap 正常；sitemap 共 205 个 URL，前 50 个抽样均返回 200，唯一提示是只抽查了前 50 个，而非全量逐 URL 验收。
当前状态：About 身份链接修正已在生产生效。本次没有重新执行 GSC 收录或 AI 引用效果检查，不把部署成功等同于 AI 引用提升。

## 2026-09-09 Photo 页自动广告单页排除

问题：此前真实页面诊断发现底部锚定广告遮挡内容，且查看上传后的编辑区时出现全屏广告。本轮用户要求继续处理，只限 Photo 页，不改全站广告设置。
目标页面：`https://pixelartvillage.org/converter/photo-to-pixel-art/`。
账号核对：通过 Codex 隔离浏览器切换已有登录账号，确认 AdSense 发布商编号与 `src/utils/loadAdSense.js` 中的编号一致，网站列表包含 `pixelartvillage.org`；未启用或修改其他账号。
变更前状态：全站自动广告启用，自动优化停用，意向驱动格式 1/1、重叠式格式 3/3、页内格式 0/2，排除网页数为 0。
实际操作：在 AdSense 的“排除的网页”中添加目标精确 URL，选择“仅此网页”，未选择“此版块下的所有网页”；点击“应用到网站”，选择“立即应用”并保存。未修改任何广告格式开关。
后台回执：北京时间约 16:36 保存成功，提示“大功告成！所做更改最多可能需要一个小时才能反映在您的网站上。”刷新后台后，全站自动广告仍启用，排除网页数为 1。
影响：目标页停止展示自动广告后会失去该页自动广告收入；首页、其他 converter、多语言和 Blog 未加入排除范围。未估算收入损失，也不将广告调整等同于 SEO 排名提升。
首次生产抽查：保存后重新打开目标页，使用站内公开 `showcase-before.jpg` 插画验证上传，编辑器出现；Pixel Size 从 1 调至 2、Palette 选为 Pico-8，预览更新。但页面仍出现底部锚定广告与意向广告，尚未证明排除已在前台生效。此次不是照片质量测试，未完成无广告的下载全流程及手机验收。
当前状态：后台配置已保存并确认持久化；前台消除广告遮挡仍待验收，不能标为已解决。Google 官方说明设置最多需要一小时生效：https://support.google.com/adsense/answer/9262311?hl=en 。
工作区边界：仅追加本记录，不改业务代码、SEO 文案、广告加载器或部署配置；保留原有四个无关修改文件。未提交、未推送、未部署；无源码变更，未运行构建或代码测试。
下一步：北京时间 17:36 之后，用新打开的 Photo 页完成桌面和手机的“上传 -> 调参 -> 预览 -> 下载”验收；若仍出现自动广告，再核对保存的精确排除规则与实际访问路径，不扩大到全站关广告。

## 2026-09-10 Sprite 页首屏上传与 PNG 需求补充（仅本地）

问题：用户截图中的 Sprite 页首屏被两段介绍和跳往主转换页的大蓝色提示框占据，实际上传区被挤到下方。用户同意在原页面上调整，不新建 URL。
GSC 证据：本次前序只读检查使用 `2026-08-10` 至 `2026-09-06` 完整窗口；目标页为 424 点击、2,270 展示、CTR 18.7%、平均排名 6.2。`png to sprite` 为 0 点击、33 展示、平均排名 14.0；`png to sprite converter` 为 2 点击、21 展示、平均排名 3.9。这是补充相同工具意图的依据，不是承诺排名提升。
目标页面：`/converter/photo-to-sprite-converter/`，仅英文。保留原 slug、title、meta description 和 H1，不修改首页、其他 converter 内容、多语言内容、Blog、广告或部署配置。
修改：在 `PseoPage.jsx` 增加仅匹配英文 Sprite 的首屏分支，显示 H1、一句简述和现有真实上传组件；编辑器继续复用原组件。长介绍移到工具后，原大提示框改成普通辅助内链。英文内容源补充 PNG 转单张 sprite 的说明、三步 HowTo 和三个 FAQ，明确保留已有透明区域不等于自动抠图，也不提供 sprite sheet 或动画帧生成。
验证：Node `20.19.0` 下在临时副本 `/tmp/pixelart-sprite-preview-ISHdPZ` 运行 `npm run build`，构建及自带 SEO、dist、重定向检查通过；原工作区 `npm run lint` 通过。静态 HTML 包含 SSR 根节点、原 H1 和上传区；title、canonical、OG、Twitter、FAQ 与 HowTo 已通过构建及浏览器断言。内容对比确认其余 11 个 converter 条目未变。
页面验收：Chromium 的 pSEO ownership、export options 和固定尺寸回归共 6 项通过，覆盖 1440 x 900 与 390 x 844 首屏上传区完整可见、无横向溢出、PNG 页原提示框保留、无效文件报错后恢复上传、Pixel Size 调整、真实下载文件尺寸与透明像素检查，以及原 16x16/32x32 导出。透明导出用合成测试图验证，不代表照片质量评测。桌面和手机截图已人工查看。
补充真人页面检查：Codex 隔离浏览器上传站内公开 `showcase-before.jpg` 后编辑器正常出现，Pixel Size 从 1 调到 2，Palette 选择 Pico-8，预览图片正常显示，无捕获到的页面 error 日志；内置浏览器的下载事件等待超时，未将其记为人工下载成功。实际导出文件的验证以上述 Playwright 测试为准。
工作区保护：仅改两个业务文件、一个已有测试文件，并追加本记录；未覆盖原有 AGENTS.md、sitemap 或其他无关改动。构建只在临时副本进行，未手改 dist。
当前状态：本地完成，本地预览为 `http://localhost:4173/converter/photo-to-sprite-converter/`；未提交、未推送、未部署，生产仍为旧版。未运行全套跨浏览器测试，也未执行新的 GSC 提交。
下一步：用户确认本地页面后再按明确授权提交发布；上线并确认 Google 重新抓取后，用完整窗口观察本页及 PNG 相关查询，不把本地验收当成 SEO 效果。

## 2026-09-11 Sprite 上传后体验审评修复（仅本地）

范围：用户授权修复审评中的四项问题；保留已有 Sprite 页面内容和未提交工作，不提交、不推送、不部署。
修改：收起后的上传入口仍渲染错误和读屏通知，补回描述关联；非图片、损坏 PNG、超过 10MB 的文件均保留旧预览并显示错误，之后可重新上传。手机设置自然展开，预览保留双向滚动；放大图以可访问的左上角为起点，小图仍居中。桌面预览与父容器等高，避免压住下载按钮。
隔离：通过显式页面参数仅让英文 Sprite 启用手机布局、标题层级、FAQ 前移和上传图标；恢复共用布局高度和其他页面原来的重置行为，首页/PNG 页 Reset 不再清除所选调色板。
示例边界：保留 CSS 示意图，但明确标注“Illustration only, not an actual conversion result.”，去掉真实原图/8-bit 结果的误导标签；试用按钮改为 Try demo image。真实转换前后对照素材尚未补充，本轮不声称完成真实样例。
验证：Node 20.19.0 下类型检查、受影响文件 ESLint 及 src/tests 差异空白检查通过。当前源码在临时副本 `/tmp/pixelart-sprite-fix-CwRxL2` 构建，完整 build 及自带 SEO、dist、重定向检查通过，不覆盖原工作区已有 sitemap 改动。
浏览器测试：当前构建的 Chromium 共 9 项通过（pseo-ownership 5、export-options 1、fixed-32x32 2、zoom-controls 1），无自动重试。覆盖 1440 x 900/390 x 844、成功上传后连续错误输入及恢复、PNG 透明导出、真实 CDP 触摸手势横向滚动、放大图左上角可达、首页/PNG 布局与 Reset 隔离，以及 16x16/32x32 导出。合成测试图仅用于功能验证，不代表图片质量评估。
人工页面检查：Codex 隔离浏览器检查当前构建的桌面/手机截图，示例可进入像素预览；手机再次选择非图片时错误可见、旧预览保留，控件 overflow 为 visible、内容自然展开。Firefox/WebKit 因本机缺少运行文件未能启动，未验证，未安装新工具。
交付：本地预览 `http://localhost:4187/converter/photo-to-sprite-converter/`；仍未提交、未部署，无新的外部 SEO 提交。全工作区 diff-check 中 AGENTS.md 原有空白告警未改动。

### 同日二次审评修复：吸顶下载栏与 Claude 配置

范围：只修复本轮发现的两处问题，保留其他未提交改动，不提交、不部署。
页面修复：英文 Sprite 的手机/平板参数区仍采用页面滚动，吸顶下载栏增加站点导航的 5rem 高度及 1px 边框偏移；lg 及以上继续使用原 top-0 和内部滚动，其他页面不变。
回归验证：新增测试先在修复前构建复现按钮 y=0 被 81px 导航遮挡；最终测试覆盖 390x844 和 820x1180 滚动后按钮未被遮挡、真实点击下载且页面不跳动，并补验桌面及其他页面的原吸顶设置。Node 20.19.0 构建、类型检查、受影响文件 ESLint 与差异空白检查通过；Chromium 10 项通过，无自动重试。Codex 隔离浏览器手机截图确认按钮顶边与导航底边均为 81px，点击命中按钮。Firefox/WebKit 本轮未验证。
配置修复：`.claude/settings.local.json` 使用事件数组和 command handler 结构，路径锚定 CLAUDE_PROJECT_DIR，去掉 BOM 以及无效的 Python/Node 工具名；原 Bash 权限不变。按 [Claude 官方文档链接的配置 schema](https://code.claude.com/docs/en/settings#edit-a-settings-file) 校验完整配置，并确认旧字符串 hook 会被拒绝。
未解决的脚本依赖：用户要求自行寻找后，检查了本机可访问目录（含隐藏/忽略文件）、Spotlight 文件索引及 Git 历史，未找到 `sessions_enforce.py` 或 `post_tool_use.py`。历史只显示 2025-11-04 的 5d221b3 引入路径引用，sessions 目录没有提交记录；macOS 部分受保护目录无法读取，未绕过权限。保留原脚本引用，不删除或编造检查逻辑；配置格式通过不等于 hook 可执行，缺少脚本仍会报错，实际执行能力未恢复。
交付：预览仍为 `http://localhost:4187/converter/photo-to-sprite-converter/`。构建只在临时副本进行，未覆盖原工作区 sitemap；脚本依赖未补齐，因此不将这部分标记为完全修复。

## 2026-09-11 英文 Sprite 单页 SEO 优化（仅本地）

范围：按用户目标只优化 `/converter/photo-to-sprite-converter/`，不提交、不推送、不部署、不操作 GSC 或付费工具。保留先前未提交工作；本轮不改 Claude hooks、首页、其他 converter 内容、多语言、Blog 或广告。
内容：Title 从 45 改为 56 字符，Description 从 139 改为 157 字符；核心词 `photo to sprite converter` 前置于标题，并自然分布于 H1、首段、H2、正文和 FAQ。辅助词为 `png to sprite converter`、`png to sprite`。补充输入选择、Pixel Size 3/6/12 起点、调色板和抖动选择、输出尺寸、透明背景及后期清理限制，不承诺自动抠图、动画或直接可用游戏素材。
真实示例：复用已有 `/showcase-before-w480.webp` 插画（480x637），通过本站编辑器完成 Pixel Size 6、Palette None、dithering off、Brightness/Contrast/Saturation 0、PNG Pixel size、Transparent background enabled 的实际导出。新增 `public/sprite-demo-pixel6.png`（80x106，21,205 字节），替换 CSS 示意图；页面说明这不是照片或手绘 sprite，原图不透明，转换不会去掉背景。回归测试将重新导出的像素数据与展示文件逐像素比较，不以示意图冒充结果。
统计口径：对未上传时的初始 HTML，分别读取 main 主内容区与 body 全页文本；排除 head、script、style、noscript、hidden 和 aria-hidden=true 内容，不计图片 alt。英文/数字分词保留词内连字符和撇号。密度为完整四词词组次数/总词数；排名按同长度词组次数计算，并列同名次。不是第三方工具原始分数，也不是 Google 排名门槛。

| 统计范围 | 本轮修改前 | 本轮修改后 |
| --- | --- | --- |
| 主内容区词数 | 592 | 1054 |
| 主内容区核心词次数/密度/排名 | 1 / 0.169% / 并列12 | 6 / 0.569% / 1 |
| 全页词数 | 760 | 1222 |
| 全页核心词次数/密度/排名 | 2 / 0.263% / 并列7 | 7 / 0.573% / 1 |

检查范围：在 Sprite 内容项补充 seo 字段，复用原 `validate-page-ownership.cjs`，使原有长度和关键词归属检查实际覆盖该页，不新增全站规则。现有 pseo-ownership 测试增加初始 HTML 的长度、前置词、H1/H2、首100词、主内容区/全页密度排名、OG/Twitter 一致性、robots/sitemap、真实示例加载及逐像素导出比对，并核对 FAQ 问答及 HowTo 步骤名与可见页面一致。
构建与页面：在 `/tmp/pixelart-sprite-fix-CwRxL2` 使用 Node 20.19.0 构建，build 及自带 SEO/dist/重定向检查通过，类型检查与受影响文件 ESLint 通过；原工作区 sitemap 未被构建覆盖。桌面 1440x900 和手机 390x844 截图已检查，上传按钮在首屏完整可见、真实对照图加载正常、无水平溢出。Codex 隔离浏览器桌面可用，后续连接失败，手机最终截图使用项目 Playwright Chromium 补验；截图位于 `/tmp/sprite-seo-390-first.png`、`/tmp/sprite-seo-390-example.png`、`/tmp/sprite-seo-1440-example.png`。
最终回归：当前构建的 Chromium 11 项全部通过，无自动重试（pseo-ownership 7、export-options 1、fixed-32x32 2、zoom-controls 1），覆盖 SEO、真实示例、首屏上传、错误恢复、透明导出、手机滚动下载、预览缩放及其他页面隔离。当前预览 HTTP 200；src 与已验收临时构建输入逐文件内容一致，受影响范围 diff-check 通过。
未验证：Firefox/WebKit、生产发布、实时 GSC/搜索展示与 SEO 效果均不在本次已完成证据中。预览为 `http://localhost:4187/converter/photo-to-sprite-converter/`，生产仍为旧版。

### 同日 PNG 辅助词自然布局补充

用户同意不强制三词榜第一、四词榜第二，改为强化 PNG 需求承接。仅调整 Sprite 内容源及对应测试：H2 使用 PNG to sprite converter，边缘处理段说明 PNG to sprite 流程，FAQ 改为具体的输入/尺寸/PNG 下载说明，不增加重复段落、不改核心词和标题描述、不删导航。
沿用上述统计口径，主内容区 1074 词：核心词 6 次、0.559%、四词榜第1；png to sprite converter 3 次、0.279%、并列第3；png to sprite 5 次、0.466%、并列第3。全页 1242 词：核心词 7 次、0.564%、第1；两个辅助词分别为 3 次、0.242%、并列第4，以及 5 次、0.403%、第5。排名是同长度词组频次，不是搜索排名，不为精确名次继续堆词。
验证：Node 20.19.0 临时副本完整构建及自带校验通过，受影响测试 ESLint、diff-check 通过，pseo-ownership Chromium 7 项全部通过，覆盖手机/桌面、可见文案与结构化数据一致性、真实导出、错误恢复和手机滚动。源码与临时构建输入一致；保留已有工作区改动，无提交、部署或外部操作。

## 2026-09-12 英文 Sprite 正文精简与透明物品案例（仅本地）

授权与范围：按 9 月 11 日用户要求，优化 `/converter/photo-to-sprite-converter/` 英文页；跨午夜完成本地验证。不提交、不推送、不部署，不做 GSC 提交或排名承诺。开始时 HEAD、origin/main 和实时远程 main 均为 `7a0ed7cb9b1c8b9e18880fedf24f9be9ab2f836b`；保留原有全部未提交修改。

内容与布局：移除英文页独立的三步操作区、三段长介绍、重复透明背景段落与底部主工具提示，流程融入上传按钮、参数表、导出选择三处。页面顺序为工具、一个真实案例、四行参数表与两项导出对比、五条可见 FAQ、相关工具。保留 Pixel Size 3/6/12、Palette None/Pico-8、dithering off 和颜色参数 0 的真实起点；导出说明区分 Pixel size 与 Original size，明确预览缩放不改变导出尺寸。正文只留一句透明背景限制，边缘清理、背景预处理、动画和固定尺寸细节集中在 FAQ。正文/FAQ 最大宽度 768px，FAQ 改为分隔线列表，不用折叠隐藏重复内容；相关工具描述同步缩短，仅影响本页显示。

语言隔离：当前仅有英文 pSEO 内容文件，非英文 Sprite 路由会回退读取它。因此在同一 Sprite 条目增加 `englishSprite` 内容，只在英文目标页及该页预渲染元信息中应用；保留旧基础字段供其他语言回退。逐条比较确认全部 12 个基础条目未变，另外 11 个英文 converter 内容未变；没有改翻译文件、首页或共享图片处理逻辑。

元信息与断言：英文 title 为 `Photo to Sprite Converter | Pixel Art Village`，H1 保持 `Photo to Sprite Converter`，canonical 保持原 URL；description 准确描述单张图片、本地处理和已有透明区域。删除 Sprite 测试中的密度、词频名次、硬性长度及强制 H2 重复关键词断言；ownership 脚本仅将 Sprite 的长度改为编辑参考，其他页原规则不变。保留关键词归属、非空元信息、OG/Twitter 一致性、robots/sitemap、可见 FAQ 与 JSON-LD 一致性、真实导出及错误恢复检查。

案例来源与授权：[Free Health and Mana Potions](https://opengameart.org/content/free-health-and-mana-potions)，作者 bevouliin.com，页面明确标注 [CC0](https://creativecommons.org/publicdomain/zero/1.0/)，并说明提供透明 PNG。下载该条目附件 `health and mana potions.zip` 中的 `PNG/mana.png`，原样复制为 `public/sprite-mana-source.png`（228x228，12,671 字节）；源文件字节比较一致，没有抠图、裁切、重画或生成图。素材是游戏物品图标而不是照片，页面已说明。

真实导出：通过本站本地页面加载该 PNG，Pixel Size 6、Palette None、dithering off、Brightness/Contrast/Saturation 0、PNG、Pixel size、Transparent background on，点击真实下载按钮生成 `public/sprite-mana-pixel6.png`（38x38，2,907 字节）。最终展示文件由项目 Playwright Chromium 141.0.7390.37 下载，未做后期处理。原图完全透明/半透明/不透明像素分别为 10,872 / 642 / 40,470；结果为 237 / 173 / 1,034，四角透明度均为 0，中心为 255。灰色只来自页面展示背景。原有未跟踪的 `sprite-demo-pixel6.png` 保留，没有删除用户已有文件。

验证过程说明：初次使用另一浏览器环境下载的结果与项目 Chromium 的重采样像素不同；最终改用项目同一 Chromium 实际下载，保留严格逐像素比对，并在最终构建重新导出通过，不放宽像素断言。旧手机滚动测试依赖 End 键却没有确认缩放值改变，换用较小素材后暴露问题；改成真实点击缩放滑条并断言大于 4，再验证触摸横向滚动及导出尺寸不随缩放改变。没有扩展修改共享缩放逻辑。

最终检查：Node 20.19.0 下 `npm run build`（含 ownership、SEO、dist、重定向检查）、`npm run lint`、`npm run typecheck` 和受影响文件 diff-check 均通过。构建使用临时副本 `/tmp/pixelart-sprite-content-spRTBO/build`，未覆盖原工作区已有 sitemap；最终输入文件与工作区逐文件一致。

真实页面与回归：当前最终构建 Chromium 11 项全部通过，无自动重试（pseo-ownership 7、export-options 1、fixed-32x32 2、zoom-controls 1）。覆盖 1440x900、390x844 真实素材上传、Pixel Size 6 改 7、Pico-8、预览更新和实际下载 32x32；案例默认导出 38x38 与展示文件逐像素一致，Original size 为 228x228且透明角保留；还覆盖非法文件/损坏 PNG/超限文件恢复、手机触摸滚动、390/820 宽吸顶下载、首页与 PNG 页原布局及 Reset、16x16/32x32 导出、西班牙语 Sprite 回退页原 title/HowTo/四条 FAQ。初始 HTML 和客户端元信息、五条可见 FAQ 与结构化数据一致。

人工检查：Codex 隔离浏览器查看桌面参数/导出区，以及手机首屏、前后图对齐、参数表；手机实际试用素材并调至 Pixel Size 7、Pico-8，预览正常且页面无横向溢出。下载文件尺寸与像素结论以上述 Playwright 实际下载检查为准。构建日志仍提示浏览器兼容性数据过期，没有因此更新依赖。

交付与限制：本轮最终预览为 `http://localhost:4173/converter/photo-to-sprite-converter/`，使用上述临时副本的最终构建；此前 4187 端口预览未替换。测试日志在 `/tmp/pixelart-sprite-content-spRTBO/tests-final.log`，HTML 报告（含桌面/手机截图）在该副本 `playwright-report/`。未验证 Firefox/WebKit、实体手机浏览器、生产页面、Google 抓取或搜索效果；本地通过不等于线上更新或排名提升。

### 同日恢复已确认元信息与主关键词检查（仅本地）

用户指出上一轮修改标题、描述及取消主关键词首位检查不符合已确认要求，并明确要求恢复。仅修改英文 Sprite 覆盖内容及对应测试，保留精简正文、透明物品案例和其他已有未提交改动。title 恢复为 `Photo to Sprite Converter - Free PNG | Pixel Art Village`；description 恢复为 `Photo to Sprite Converter turns photos and PNGs into single sprite-style images. Adjust pixel size and palettes, preview changes, and download PNGs for free.`。首屏一句介绍自然补回主关键词，没有新增段落；恢复全页可见正文四词组中主关键词频次严格高于其他词组的测试，不要求辅助词名次或固定密度。

当前验证：Node 20 临时副本完整构建及自带校验、测试文件 ESLint、Chromium 7 项受影响测试全部通过，无重试。覆盖初始 HTML 和客户端元信息、FAQ 一致性、真实素材下载与透明像素比对、桌面手机上传调参下载、错误恢复及其他页面隔离。全页 innerText 四词组统计主关键词 3 次，其余最高 2 次，独占第一；此统计不是用户截图插件的统计结果。1440x900 和 390x844 页面截图复核，均无横向溢出。Codex 隔离浏览器连接报 request-header policy 错误，本次改用项目 Playwright 浏览器截图检查，未直接复核用户插件。

预览继续使用 `http://localhost:4173/converter/photo-to-sprite-converter/`，日志为 `/tmp/pixelart-sprite-content-spRTBO/build-restore.log` 和 `tests-restore.log`，截图为同目录 `restore-1440.png`、`restore-390.png`。未提交、推送或部署；线上状态未改变，也未验证搜索排名。


## 2026-09-12 英文 Sprite 页发布

授权：用户明确要求“推送部署”。仅发布 `/converter/photo-to-sprite-converter/` 英文页及必要的页面专属展示逻辑、测试和两张透明物品 PNG。标题保留 `Photo to Sprite Converter - Free PNG | Pixel Art Village`，描述保留已确认的 Photo to Sprite Converter turns photos and PNGs 开头原文；正文保持精简参数表、导出对比、五条 FAQ 与真实案例，不恢复重复长说明。

案例：[Free Health and Mana Potions by bevouliin.com](https://opengameart.org/content/free-health-and-mana-potions)，CC0；原 PNG 228x228，本站 Pixel Size 6 / Palette None / dithering off 实际下载结果 38x38，无后期加工，透明角保留。保留主关键词可见正文四词组独占第一的测试，不要求辅助词名次或固定密度；未直接验证用户截图插件。

发布隔离：从当前远程 main `7a0ed7cb9b1c8b9e18880fedf24f9be9ab2f836b` 构造干净发布副本 `/tmp/pixelart-sprite-release-chgOSO`。全部 12 个基础内容条目与该提交一致，只新增英文 Sprite 覆盖字段（含其 seo），因此较早的本地非英文回退内容修改不进入发布。对应西班牙语测试按已发布版本校验原 title、HowTo 和七条 FAQ。保留这些未发布内容、旧示例 PNG、HowItWorksSection 未使用样式、Claude 配置、AGENTS、其他文档和 sitemap 的本地改动，不一并提交。

发布前：干净发布副本的 Node 20 构建及自带 SEO/dist/重定向检查、lint、typecheck 通过；Chromium 11 项回归全部通过，无重试，覆盖真实导出像素、透明度、上传错误恢复、手机滚动、尺寸与缩放和页面隔离。生产是否成功，以后续部署回执及线上验收补充为准。


发布结果：代码提交 `eb77238678b66ee0faa291ad89bd8ee9a49db161` 已推送 main。[CI 34622499624](https://github.com/elng12/pixelartvillage.org/actions/runs/34622499624)、[GitHub Pages 34622500071](https://github.com/elng12/pixelartvillage.org/actions/runs/34622500071)、[Lighthouse 34622499666](https://github.com/elng12/pixelartvillage.org/actions/runs/34622499666) 全部成功；Cloudflare Pages 项目 pixelartvillage1 的检查成功，部署 ID `5f96b6b6-5bfc-4281-8123-fb2737a0b415`。

生产验收：目标页 HTTP 200，title、description、canonical 和五条 FAQ/JSON-LD 与发布版本一致，原图和结果资源为 228x228 / 38x38。隔离 Playwright 浏览器桌面 1440x900 试用真实素材并下载 38x38 PNG；手机 390x844 调至 Pixel Size 7、Pico-8 后实际下载 32x32 PNG，两次下载四角 alpha 均为 0，页面无水平溢出。首页和 PNG 页抽查 HTTP 200。`/es/converter/photo-to-sprite-converter/` 在线仍按原有 `_redirects` 301 到英文页，不把重定向后的内容当作西班牙语独立页面验收。

部署切换过程中曾短暂遇到图片/旧资源 404，部署完成后刷新恢复，重新验证图片正常加载和真实下载；未修改缓存或全站配置。本轮浏览器选择拒绝非必要 Cookie，不代表已验证允许广告后的体验。未验证用户关键词插件、Firefox/WebKit、实体手机或 Google 搜索效果。发布截图与下载证据保存在 `/tmp/pixelart-sprite-release-*`，其他未提交改动仍保留本地。

## 2026-09-12 西语首页翻译残留清理（仅本地）

范围：在 On Page SEO 只读检查后，按已确认的单页范围执行 `/es/` 首页修复，不提交、不推送、不部署。开始与结束 HEAD 均为 `ba5e0310553324a9aa99e59067281b8fd3ad6df0`；保留已有 Claude 配置、AGENTS、其他文档、HowItWorksSection、pSEO 内容和测试、sitemap 以及未跟踪旧示例 PNG 的改动。

内容：仅在西语 `home` 命名空间补首屏 H1/说明、上传格式提示、工具推荐、调色板介绍、格式 FAQ、Cookie 说明、跳转正文链接和页脚缺失翻译。格式 FAQ 不再显示 `English translation` / `Wait, I need to clarify` 等翻译对话。已有西语和英文 title/description 原文不变。上传提示按实际行为写为本页打开编辑器并注明 10 MB，未照搬旧英文的下一页说法。品牌、调色板专有名称和第三方徽章图片不翻改。

隔离：组件新增可选文案参数，只由西语首页传入；原共享西语翻译命名空间内容逐项比对保持一致，未改变其他页面文案。测试发现既有 TranslationPreloader 从静态语言路由读取不到 `:lang`，同语言内页跳转可能切回英文。本轮仅为 `/es/` 显式传入 `es`，保障从内页返回首页时保持西语；其他内页和语言的共享同步缺陷没有扩改。

验证：Node 20.19.0 下完整 `npm run build`（包含 ownership、SEO、dist、重定向检查）、`npm run lint`、`npm run typecheck`、本轮文件 diff-check 均通过。构建位于临时副本 `/tmp/pixelart-es-home-sCEA3x`，不覆盖原工作区已有 sitemap；最终 src 和西语翻译输入与工作区内容一致。构建保留生产式 Cookie 行为，未设置 VITE_E2E=1。浏览器兼容性数据过期告警未触发依赖更新。

最终 Chromium 24 项通过，无自动重试：i18n 7、seo-hreflang 2、pages 8、pseo-ownership 7。覆盖无 JavaScript 初始 HTML、西语首页 1440x900/390x844、七条可见 FAQ、canonical/hreflang、Cookie 拒绝、英文已确认元信息、页面专属文案隔离与内页返回首页，以及原英文 Sprite 的真实案例、主关键词检查、错误恢复和手机导出。新增西语流程使用本站已有真实物品 PNG（228x228），经 Pixel Size 6、Pico-8、PNG Pixel size 实际下载为 38x38，四角 alpha 为 0 且保留可见图像像素，下载附在测试报告。初次测试的连续按键被现有逐帧调节合并，改为逐次等待可见数值更新，不改调参实现、不放宽最终尺寸断言。

真实页面：Codex 隔离浏览器复核最终桌面首屏、手机首屏和格式 FAQ、页脚与 Cookie 布局，页面无横向溢出；手机真实上传和调参后预览正常。该浏览器的下载事件等待超时，下载文件结论以项目 Playwright 实际保存并解析的 PNG 为准。运行时 title、description、H1、canonical、OG/Twitter 已核对；现有三个 JSON-LD 均可解析，首页本来没有 FAQPage schema，本轮不新增。

交付与限制：本地预览 `http://localhost:4190/es/`；最终日志为临时副本 `build-final.log`、`tests-final.log`，下载证据在 `playwright-report/`。仅完成本次首页 On Page SEO 文案范围；其他多语言页、内页语言同步、上传后共享编辑器中少量英文标签，以及原有尺寸无限制等功能承诺未扩改。Firefox/WebKit、实体手机、线上重新抓取、第三方评分和 Google 搜索效果未验证；本地结果不代表线上已更新或排名改善。

## 2026-09-12 修复未提交 Sprite 内容的语言隔离回归（仅本地）

授权：用户在未提交改动审查后要求修复。仅处理 Sprite 共享内容回退及相关测试，不提交、不推送、不部署。开始核对 HEAD、origin/main 和实时远程 main 均为 `ba5e0310553324a9aa99e59067281b8fd3ad6df0`，保留西语首页、其他文档、配置、sitemap 和旧示例图片等已有改动。

修复：恢复 `src/content/pseo-pages.en.json` 中原有 Sprite 基础内容，把英文专项内容及 seo 保留在 `englishSprite` 内。该文件现与 HEAD 一致；英文已确认标题、描述、真实案例、参数表和五条 FAQ 不变。非英语 Sprite 不再被新增英文 HowTo/FAQ 覆盖，也不再显示与实际默认值 1 冲突的 Pixel Size 6 说明。西语隔离测试恢复原 title、西语 HowTo 和七条 FAQ，增加错误默认值文案不存在、上传后滑条默认值为 1 的断言；使用合成图片仅测试控件状态，不冒充真实案例。

验证：先将恢复后的测试运行在修复前的本地构建上，按预期因西语 Sprite title 被英文专项标题覆盖而失败，确认能拦住回归。随后在已有临时副本 `/tmp/pixelart-es-home-sCEA3x` 重新完整构建，包含 ownership、SEO、dist 和重定向检查，通过；源码及测试输入与工作区一致，未覆盖工作区 sitemap。最终 lint、typecheck、受影响文件 diff-check 通过。中断恢复后重新运行 Chromium 回归，i18n 7 项及 pseo-ownership 7 项全部通过，无重试；覆盖桌面/手机、英文元信息和主关键词检查、FAQ/JSON-LD、真实案例及透明 PNG 下载、西语首页隔离、非英语 Sprite 上传默认值。构建保留已有浏览器兼容性数据过期告警，没有更新依赖。

本地预览：`http://localhost:4190/es/converter/photo-to-sprite-converter/` 返回 200；英文页为 `http://localhost:4190/converter/photo-to-sprite-converter/`。本次真实页面验证通过项目 Playwright Chromium 完成，未新增人工浏览器截图检查，未验证 Firefox/WebKit、实体手机或线上页面。仅为本地修复，不改变生产部署及既有线上重定向行为。

## 2026-09-12 所有语言 Sprite 入口统一新版结构（仅本地）

新授权：用户明确要求“所有语言页都应采用新版结构”，因此本轮不再保留非英语 Sprite 的旧版布局。范围仅为 `/converter/photo-to-sprite-converter/` 及配置中的 17 个非英语前缀入口；不改其他 converter 内容、首页文案、Blog、翻译文件、线上重定向或 sitemap 收录范围，不提交、推送或部署，保留其余已有未提交改动。

实现：Sprite 页面不再用英语条件决定布局，统一采用工具、真实物品案例、四行参数表、两项导出对比、五条 FAQ、相关工具的顺序。全部入口默认 Pixel Size 6，手机控件正常随页面滚动。沿用原有 CC0 素材及真实导出文件，英文已确认 title/description 和主关键词检查不变；没有重新生成或加工案例图片。仅对 Sprite 路径显式同步当前界面语言，防止切换语言时控件被预加载器切回英文。

语言边界：目前 pSEO 专项内容只有英文，因此本轮完成的是 18 个语言入口的结构统一，不是 18 种全文翻译。上传按钮使用现有翻译，非英语正文保留本语言的英文回退提示；案例、参数表、FAQ 等英文正文标注 lang=en、dir=ltr，避免阿拉伯语页面里的标点和原图/结果顺序倒置。其他已有缺失翻译继续遵循原英文回退机制。

静态页面：为原先没有独立 HTML 的非英语 Sprite 入口补齐初始新版内容及匹配的 FAQ/JSON-LD，不再返回首页 SEO 标签。英文回退页 canonical 指向英文 Sprite 原页，HowTo 的内容语言标为 en；不将这些回退入口加入 sitemap 或作为新的语言替代页。现有生产 `_redirects` 仍将非英语 converter 路径 301 到英文页，发布行为未变。

验证：Node 20 完整构建及自带 ownership、SEO、dist、重定向检查通过；lint、typecheck、受影响文件 diff-check 通过。最终 Chromium 33 项通过，无重试：原 i18n 7 项、pseo-ownership 7 项，加 18 个语言入口和一项连续语言切换测试。逐一检查 1440x900 与 390x844 页面无横向溢出、初始 HTML 和运行时新版结构、canonical、五条可见 FAQ 与 schema 一致、默认值 6；每种语言真实上传 228x228 素材并下载 38x38 PNG，与案例文件逐像素相同且四角透明，再调到 7 和 Pico-8 验证预览变化。测试修正了缺失翻译键的标准英文回退、等待实际预览与导出选中状态、阿拉伯语原生滑条按键方向及切换语言时可选尾斜杠，不放宽实际尺寸或像素断言。

浏览器复核：Codex 隔离浏览器检查西语桌面/手机首屏、案例和参数表，以及日语、阿拉伯语手机入口；阿拉伯语英文回退内容的阅读方向已修正。构建复用 `/tmp/pixelart-es-home-sCEA3x`，最终输入与工作区一致，未覆盖原工作区 sitemap。本地预览仍为 `http://localhost:4190/es/converter/photo-to-sprite-converter/`，可从顶部切换语言。未验证 Firefox/WebKit、实体手机、生产部署或 Google 搜索效果；本地结构通过不代表完整翻译、线上已发布或排名改善。

## 2026-09-12 西语首页与多语言 Sprite 定向发布

授权：用户在审查和下一步说明后明确回复“执行”，授权提交、推送、部署已验收的西语首页修复及所有语言 Sprite 新版结构，并做线上验收。保留其他已有未提交改动，不改变全文翻译范围、非英语 converter 重定向、canonical 策略或索引范围。

发布隔离：开始时 HEAD、origin/main 与实时远程 main 均为 `ba5e0310553324a9aa99e59067281b8fd3ad6df0`。从 HEAD 导出干净副本 `/tmp/pixelart-locale-release-UDpfZM`，仅加入 13 个相关代码/翻译/测试文件；不包含 Claude 配置、AGENTS、竞品文档、未使用的 HowItWorksSection 样式、工作区 sitemap 或旧示例 PNG。本记录只暂存本批相关段落，其他历史文档修改仍保留本地。沿用仓库 Git 集成部署，不另建站点或修改云端配置。

发布前检查：Node 20.19.0 下完整构建及 ownership、SEO、dist、重定向检查通过，lint、typecheck 和受影响文件 diff-check 通过。构建仅在干净副本生成产物，未覆盖工作区 sitemap；保留现有浏览器兼容性数据过期告警，没有更新依赖。完整 Chromium 73 项回归全部通过，无重试，覆盖 18 个 Sprite 入口、首页、Blog、导航、调色板管理、透明导出、固定尺寸、手机布局和 SEO；Codex 隔离浏览器复核了干净副本西语首页。13 个暂存代码/翻译/测试文件与构建输入逐字节一致。推送及生产状态待后续回执补充。

### 本次发布回执

代码提交 `285986090f46b0baebc55b761fd8c4afd28ab3b1` 已推送 main。[CI 34685733463](https://github.com/elng12/pixelartvillage.org/actions/runs/34685733463)、[GitHub Pages 34685733457](https://github.com/elng12/pixelartvillage.org/actions/runs/34685733457)、[Lighthouse 34685733459](https://github.com/elng12/pixelartvillage.org/actions/runs/34685733459) 全部成功。Cloudflare Pages 项目 pixelartvillage1 检查成功，部署 ID `6a48873f-102e-4142-87c0-57ca420f7285`。

生产验证：正式域名运行 Chromium 9 项针对性检查全部通过，无重试；覆盖西语首页初始 HTML、已确认 title/description、桌面 1440/手机 390 布局、文案隔离、语言切换和 Cookie 文案；西语首页使用真实透明素材，Pixel Size 6 / Pico-8 实际下载 38x38 PNG，透明角保留。英文 Sprite 初始元信息、五条可见 FAQ/JSON-LD 一致；实际导出 38x38 与已有案例逐像素相同，Original size 实际下载 228x228 且透明角保留。手机再调到 Pixel Size 7 / Pico-8，预览变化，无横向溢出。证据位于 `/tmp/pixelart-locale-release-UDpfZM/production-test-results/` 和该副本的 Playwright 报告。

线上边界：逐一请求全部 17 个非英语 Sprite 地址，均返回 301 到英文原页，未解除原重定向。Codex 隔离浏览器确认西语首页新文案已生效；从英文 Sprite 站内切换西语时显示新版结构及明确的英文回退提示，而非旧 HowTo/大提示卡。独立多语言全文翻译和语言页直接访问策略不在此次发布范围。

上线检查：首页、西语首页、英文 Sprite 和 PNG converter 均为 HTTP 200，canonical 域名正确，robots 与 sitemap 正常；sitemap 共 205 个 URL，前 50 个抽查全部返回 200，唯一告警为未全量抽查。未修改广告设置；隔离浏览器 Sprite 页面仍可出现原有自动广告，不把此次测试等同于无广告或所有访客体验通过。Firefox/WebKit、实体手机、GSC 收录及搜索排名效果未验证。无关工作区修改仍保留本地。

后续复查补记：仅文档提交 `ebb02e5` 推送后，Cloudflare 部署 `882e550d-023e-4193-be44-71eb061b3338` 及 CI/Pages/Lighthouse 全部成功，业务源码未变。再次运行相同 9 项线上测试时，8 项通过，手机 Sprite 测试有一次上传后 20 秒未出现预览而失败；保留了失败截图、视频和页面快照，没有删除失败记录或放宽断言。该项随后单独开启 trace 复测通过，再连续独立运行 3 次均通过，包含真实 38x38 下载、逐像素比对、透明角和 Pixel Size 7 / Pico-8 预览检查。失败原因未确定，不能据此认定是网络或缓存，也不能把后续通过称为已修复。该间歇现象作为本次发布的剩余风险；原失败证据在 `production-test-results/`，后续 trace 分别在 `production-sprite-recheck/` 与 `production-sprite-repeat/`，均位于上述干净副本。没有据此扩大修改共享图片处理或广告逻辑。
