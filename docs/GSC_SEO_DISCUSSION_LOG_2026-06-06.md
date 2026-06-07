# GSC SEO 讨论记录 - 2026-06-06

本文档记录讨论结论、批次 A 执行记录、批次 A-UI 布局方案、UI 执行记录、关键词 / 标题结构微调记录、Product Design 小修记录和二次关键词微调记录；不代表已经提交或部署。

当前 `3.2` 到 `3.7` 已完成第一轮讨论，已补阶段总审查，已整理执行清单草案，已补强批次 A 任务拆解草案，并已执行批次 A。

批次 A 已完成本地构建、产物验证和代码审评，尚未提交，尚未部署。批次 A-UI 布局改版、关键词密度微调、H 标签结构清理、Product Design 小修和二次关键词微调已本地执行并完成验证，尚未提交，尚未部署。

## 1. 数据来源

- 数据来源：Google Search Console API
- 站点：`sc-domain:pixelartvillage.org`
- 本轮可用完整数据窗口：`2025-09-12` 到 `2026-06-01`
- 注意：GSC 有延迟，所以 `2026-06-06` 当天不是完整数据
- 用户提供的 JSON 是 Google 服务账号钥匙，不是导出的报表数据

## 2. 当前总判断

网站不是没有流量。

真正的问题是：曝光已经起来了，但很多曝光没有变成点击。

当前已经完成问题讨论阶段、阶段总审查、执行清单草案、批次 A 任务拆解、批次 A 本地执行、批次 A 代码审评、批次 A-UI 本地执行、关键词 / 标题结构微调、Product Design 小修和二次关键词微调。

下一步是审评批次 A 当前全部代码改动；通过后再决定是否提交和部署。

## 3. 已发现的问题清单

### 3.1 首页太强，其他页面太弱

现象：

- 首页约拿走全站 `51%` 点击
- 首页约拿走全站 `62%` 曝光
- Google 很多时候把首页当成最主要答案页

已讨论结论：

- 首页强不是坏事
- 首页具备上传、调像素、调颜色、导出等核心功能，所以它抢很多词是正常的
- 问题不是首页抢词，而是子页面还不够像“专门答案页”

首页可以继续负责：

- `image to pixel art`
- `pixel art converter`
- `pixel art maker`
- `pixel art generator`

子页面应该逐步抢回：

- `/converter/photo-to-pixel-art/` 负责 `photo to pixel art`
- `/converter/png-to-pixel-art/` 负责 `png to pixel art`
- `/converter/gif-to-pixel-art/` 负责 `gif to pixel art`
- `/converter/8-bit-art-generator/` 负责 `8 bit art generator`

当前原则：

- 不削弱首页
- 不删除首页功能
- 不强行让首页只讲一个词
- 要增强子页面的专门性
- 首页做总入口，子页面做专项答案页

后续可能执行方向：

- 首页文案改成“总工具入口”
- 首页给专项页面更多清晰内链
- 子页面增加更具体的场景、步骤、例子、调参建议
- 子页面标题、H1、正文和内链都围绕自己的专项词

本问题当前状态：已形成初步共识，待最后统一排期。

### 3.2 核心词卡在第 1 页底部或第 2 页

本节只做问题归类，不进入代码方案。

当前优先讨论 4 组词：

1. `pixel art maker`
2. `pixel art generator`
3. `photo to pixel art` / `picture to pixel art`
4. `pixel art converter`

本节判断维度：

- 排名问题
- CTR 问题
- 页面承接问题
- SERP 竞争问题

注意：本轮没有实查实时 SERP，所以 `SERP 竞争问题` 只能作为待验证假设，不能直接写成结论。

#### 3.2.1 `pixel art maker`

现象：

- 当前主要页面：`/`
- 目标页面：`/`
- 全量数据：`361` 点击，`16,610` 曝光，CTR `2.17%`，平均排名 `10.58`
- 最近 28 天：`171` 点击，`8,055` 曝光
- 主要国家 / 设备：`usa / DESKTOP`
- 最近 28 天曝光明显变大，但 CTR 偏低

问题归类：

- 排名问题：是。平均排名在 `10.58`，属于第 1 页底部到第 2 页边缘。
- CTR 问题：是。曝光很大，但 CTR 只有 `2.17%`。
- 页面承接问题：不是主要问题。当前由首页承接，和当前页面分工一致。
- SERP 竞争问题：未验证。美国桌面端竞争可能强，但本节不能直接下结论。

原因判断：

- 首页已经能被 Google 识别为相关页面，但还没有强到稳定进入更靠前位置。
- `maker` 这个词可能比 `converter` 更偏“制作工具”，用户可能期待更直接的创作能力。
- 如果搜索用户想要“从零制作像素图”，而本站首屏更像“图片转像素图”，点击意愿可能会被压低。

严重程度：

- P1。
- 原因是曝光高、最近 28 天增长明显，离更高点击只差排名和点击率。

要不要改：

- 要改，但不应该新建单独页面先抢这个词。
- 当前阶段仍让首页承接 `pixel art maker` 更稳。

大方向：

- 首页继续承接该词。
- 后续优化重点是让首页更像“可以快速制作像素图的主工具入口”。
- 先提升首页对 `maker` 意图的匹配和点击理由，再观察完整 28 天数据。

#### 3.2.2 `pixel art generator`

现象：

- 当前主要页面：`/`
- 目标页面：`/`
- 全量数据：`299` 点击，`13,840` 曝光，CTR `2.16%`，平均排名 `10.82`
- 最近 28 天：`151` 点击，`6,865` 曝光
- 主要国家 / 设备：`usa / DESKTOP`
- 和 `pixel art maker` 很像，都是曝光大、点击有增长、CTR 偏低

问题归类：

- 排名问题：是。平均排名 `10.82`，接近第 1 页底部或第 2 页。
- CTR 问题：是。CTR `2.16%`，和曝光规模不匹配。
- 页面承接问题：不是主要问题。当前由首页承接，暂时合理。
- SERP 竞争问题：未验证。后续需要实查，但现在不当结论。

原因判断：

- `generator` 和 `maker` 有重叠，但 `generator` 可能更容易让用户想到 AI 生成或自动生成。
- 当前站点主要是“上传图片后转换”，不是“输入文字直接生成图”。
- 如果用户搜索 `pixel art generator` 时期待 AI 或从零生成，本站和搜索意图之间可能有一层错位。

严重程度：

- P1。
- 原因是曝光高、排名临界、CTR 低，而且和首页主定位关系密切。

要不要改：

- 要改，但要谨慎。
- 不能为了抢 `generator` 词，把页面写成不存在的 AI 生成功能。

大方向：

- 首页可以继续承接 `pixel art generator`。
- 后续表达要更清楚：这是把图片生成像素风结果的工具，而不是凭空 AI 画图。
- `maker` 和 `generator` 先一起作为首页 CTR 和意图匹配问题讨论，不拆成两个独立页面。

#### 3.2.3 `photo to pixel art` / `picture to pixel art`

现象：

- `photo to pixel art`
  - 当前主要页面：`/`
  - 目标页面：`/converter/photo-to-pixel-art/`
  - 全量数据：`134` 点击，`6,153` 曝光，CTR `2.18%`，平均排名 `13.01`
  - 最近 28 天：`44` 点击，`1,561` 曝光
- `picture to pixel art`
  - 当前主要页面：`/`
  - 目标页面：`/converter/photo-to-pixel-art/`
  - 全量数据：`184` 点击，`6,063` 曝光，CTR `3.03%`，平均排名 `10.19`
  - 最近 28 天：`75` 点击，`1,742` 曝光
- cluster 表里 `photo to pixel`、`picture to pixel` 也主要由首页承接

问题归类：

- 排名问题：是。`photo to pixel art` 排名 `13.01`，`picture to pixel art` 排名 `10.19`。
- CTR 问题：部分是。`photo to pixel art` CTR 明显偏低，`picture to pixel art` 也不算强。
- 页面承接问题：是，而且是主要问题。目标页应是照片专项页，但当前主要展示页仍是首页。
- SERP 竞争问题：未验证，先不下结论。

原因判断：

- Google 现在仍把首页当成这组词的主要答案页。
- `/converter/photo-to-pixel-art/` 已收录，但它没有稳定拿到 photo / picture 词。
- 该页 Top queries 偏泛，比如 `image to pixel art`、`image to pixel`、`pixelartvillage`。
- 这说明该页的“照片专项语义”不够明显。

严重程度：

- P1。
- 原因是这组词曝光不小，而且页面承接明显错位。
- 如果不处理，首页会继续吃掉照片词，照片专项页很难建立自己的排名。

要不要改：

- 要改。
- 但具体页面怎么改，留到 `3.3 pSEO 工具页分工` 和后续执行清单再定。

大方向：

- 这组词不应长期由首页主承接。
- `/converter/photo-to-pixel-art/` 应该逐步成为 photo / picture cluster 的目标页。
- 第一批不主攻 `portrait`、`avatar`、`pet photo`，因为目前 GSC 没明显数据。它们可以作为照片场景补充，不作为主关键词。

#### 3.2.4 `pixel art converter`

现象：

- 当前主要页面：`/`
- 目标页面：`/`
- 全量数据：`506` 点击，`15,291` 曝光，CTR `3.31%`，平均排名 `8.05`
- 最近 28 天：`177` 点击，`4,391` 曝光
- 主要国家 / 设备：`usa / DESKTOP`

问题归类：

- 排名问题：轻度是。平均排名 `8.05`，在第 1 页中下部。
- CTR 问题：不是最明显。CTR `3.31%` 不算高，但比 `maker`、`generator`、`photo to pixel art` 好。
- 页面承接问题：不是。首页承接这个词是合理的。
- SERP 竞争问题：未验证。

原因判断：

- 这是首页最应该承接的核心词之一。
- 当前不是“页面错了”，而是“首页还有机会往上走”。
- 这个词不能大幅乱动，因为它已经有稳定曝光和点击。

严重程度：

- P1 观察型。
- 它重要，但不应该比 `maker`、`generator`、`photo / picture` 更激进。

要不要改：

- 可以改，但应小幅、保守。
- 不应该为了它大改首页结构。

大方向：

- 首页继续承接 `pixel art converter`。
- 后续如果调整首页，应优先保护这个词的现有表现。
- 如果同时优化 `maker`、`generator`，要避免削弱 `converter` 的清晰度。

#### 3.2.5 小结

当前 3.2 的结论：

| 词组 | 主要问题 | 当前页面 | 目标页面 | 处理态度 |
| --- | --- | --- | --- | --- |
| `pixel art maker` | 排名临界 + CTR 低 | `/` | `/` | 首页 P1 优化机会 |
| `pixel art generator` | 排名临界 + CTR 低 + 意图可能偏 AI | `/` | `/` | 首页 P1 优化机会，但不能误写 AI |
| `photo to pixel art` / `picture to pixel art` | 页面承接错位 + 照片语义不足 | `/` | `/converter/photo-to-pixel-art/` | P1，后续进入 pSEO 分工讨论 |
| `pixel art converter` | 第 1 页中下部，需保护性优化 | `/` | `/` | 首页核心词，保守处理 |

本节不产生代码任务。

进入后续执行清单前，`3.2` 到 `3.7` 已经完成第一轮讨论；后续以第 10 节为准。

### 3.3 pSEO 工具页没有分工清楚

本节只讨论页面分工，不进入代码方案。

目标是确认每个 pSEO 工具页应该：

- 增强
- 保护
- 暂缓
- 还是后面再判断

#### 3.3.1 页面分工总表

| URL | 应负责的词 | 现在实际拿到的词 | 主要问题 | 处理态度 |
| --- | --- | --- | --- | --- |
| `/converter/photo-to-pixel-art/` | `photo to pixel art` / `picture to pixel art` / `photo to pixel` | `image to pixel art`、`image to pixel`、`pixelartvillage` | 照片语义不足，目标词仍由首页承接 | P1-1，后续重点增强照片专项语义 |
| `/converter/8-bit-art-generator/` | `8 bit maker` / `image to 8 bit` / `8-bit art maker` / `8 bit image converter` | `8 bit maker`、`image to 8 bit`、`8-bit art maker` | 有 cluster 机会，但排名靠后，部分词被其他页承接 | P1-2，按 cluster 讨论，不按单词讨论 |
| `/converter/image-to-pixel-art/` | `image to pixel art converter` / `convert image to pixel art` / `online image to pixel art converter` | `image to pixel`、`image to pixel art`、`8 bit image converter` | 和首页重叠高，且定位仍偏泛 | P1-3，先重新定义角色，不急着强抢首页主词 |
| `/converter/png-to-pixel-art/` | `png to pixel art` / `png to pixel` / `png to pixel converter` | `png to pixel`、`png to pixel art`、`png to pixel converter` | 方向基本对，曝光中等 | P2，轻增强，不大改 |
| `/converter/gif-to-pixel-art/` | `gif to pixel art` / `gif pixelator` / `gif to pixel` | `gif to pixel art`、`gif pixelator`、`gif to pixel` | 表现好，专项意图清楚 | 保护型页面，不大改 |
| `/converter/jpg-to-pixel-art/` | `jpg to pixel art` / `jpg to pixel` | `image to pixel art`、`jpg to pixel`、`image to pixel converter` | 有部分首页重叠，排名靠后 | P2，后续排在 photo / 8-bit 之后 |
| `/converter/pixelate-image-online/` | `pixelate image online` / `pixelate online` | `pixelate image online`、`pixelate online`、`pixelartvillage` | CTR低、排名靠后，但规模较小 | P2 / P3，暂缓 |
| `/converter/photo-to-sprite-converter/` | `image to sprite` / `image to sprite converter` / `picture to sprite converter` | `image to sprite`、`image to sprite converter`、`picture to sprite converter` | 表现较好，定位清楚 | 保护型页面 |

#### 3.3.2 `/converter/image-to-pixel-art/`

现象：

- 已收录。
- 全量数据：`419` 点击，`15,097` 曝光，CTR `2.78%`，平均排名 `21.50`
- 最近 28 天：`53` 点击，`1,466` 曝光
- 和首页 Top20 query 重叠 `10` 个，重叠高
- 当前 Top queries 包括：`image to pixel`、`image to pixel art`、`8 bit image converter`

问题归类：

- 页面承接问题：是。它和首页抢主词，又没打过首页。
- 定位问题：是。它现在不像一个清楚的“长尾转换说明页”。
- 排名问题：是。平均排名靠后。
- CTR 问题：是。CTR `2.78%` 偏低。

判断：

- 这个页面不能继续模糊地和首页抢 `image to pixel art` 主词。
- 它需要一个更清楚的独特价值。
- 但是否让它抢 `image to pixel art converter`、`convert image to pixel art` 等长尾词，还要继续看页面 + query 数据。

处理态度：

- P1-3 讨论对象。
- 先重新定义角色，不急着执行。

大方向：

- 首页继续负责 `image to pixel art` 主词。
- 该页暂定负责更长尾、更解释型的 converter 查询。
- 后续需要避免“首页 + 主转换页”变成两个几乎一样的页面。

#### 3.3.3 `/converter/photo-to-pixel-art/`

现象：

- 已收录。
- 全量数据：`320` 点击，`17,779` 曝光，CTR `1.80%`，平均排名 `20.32`
- 最近 28 天：`15` 点击，`1,113` 曝光
- 和首页 Top20 query 重叠 `12` 个，重叠很高
- 当前 Top queries 偏泛：`image to pixel art`、`image to pixel`、`pixelartvillage`
- photo / picture cluster 里，目标词仍主要由首页承接

问题归类：

- 页面承接问题：非常明显。
- 照片语义问题：明显。
- 排名问题：明显。
- CTR 问题：明显。

判断：

- 这个页面不是没收录，而是没有被 Google 稳定理解成“照片专项页”。
- 它现在更像另一个普通 image-to-pixel 页面。
- `photo to pixel art`、`picture to pixel art`、`photo to pixel`、`picture to pixel` 不应长期由首页主要承接。

处理态度：

- P1-1。
- 这是最需要后续进入执行清单的 pSEO 页之一。

大方向：

- 目标是把该页从“泛转换页”改成“照片 / 图片专项页”。
- 第一批主攻 `photo` / `picture` 真实有数据的词。
- `portrait`、`avatar`、`pet photo` 当前无明显 GSC 数据，只作为内容场景备用，不作为第一批主关键词。

#### 3.3.4 `/converter/8-bit-art-generator/`

现象：

- 已收录。
- 全量数据：`154` 点击，`5,875` 曝光，CTR `2.62%`，平均排名 `20.47`
- 最近 28 天：`59` 点击，`1,355` 曝光
- 页面 Top queries：`8 bit maker`、`image to 8 bit`、`8-bit art maker`
- cluster 表显示多个 8-bit 词有曝光，但排名普遍靠后
- 部分 8-bit 词当前由首页或 `/converter/image-to-pixel-art/` 承接

问题归类：

- 排名问题：明显。
- 页面承接问题：部分明显。
- CTR 问题：有。
- cluster 定位问题：有。

判断：

- 这个页面不能只看 `8 bit art generator` 单词。
- 它有一组 8-bit 相关词机会。
- 当前不是“没机会”，而是 8-bit cluster 还没有被稳定吃住。

处理态度：

- P1-2。
- 优先级低于 photo / picture，但高于 `/converter/image-to-pixel-art/` 的角色重定义。

大方向：

- 按 8-bit cluster 做页面定位。
- 目标不是抢所有 `pixel art generator`，而是抢 8-bit 风格转换相关词。
- 后续要注意不要写成不存在的 AI 生成器。

#### 3.3.5 `/converter/png-to-pixel-art/`

现象：

- 已收录。
- 全量数据：`168` 点击，`4,626` 曝光，CTR `3.63%`，平均排名 `8.36`
- 最近 28 天：`48` 点击，`764` 曝光
- 首页重叠低，Top queries 包括：`png to pixel`、`png to pixel art`、`png to pixel converter`

问题归类：

- 页面承接问题：不严重。
- 排名问题：轻度。
- CTR 问题：不算最明显。

判断：

- 这个页面方向基本对。
- 它不像 photo 页那样严重被首页抢泛词。
- 当前更适合轻增强，而不是大改。

处理态度：

- P2。
- 不进入第一批大动作。

大方向：

- 保持专项定位。
- 后续可以围绕 PNG、透明背景、logo、icon 等场景轻微增强。

#### 3.3.6 `/converter/gif-to-pixel-art/`

现象：

- 已收录。
- 全量数据：`551` 点击，`4,878` 曝光，CTR `11.30%`，平均排名 `7.58`
- 最近 28 天：`134` 点击，`1,153` 曝光
- 首页重叠低，Top queries 包括：`gif to pixel art`、`gif pixelator`、`gif to pixel`

问题归类：

- 页面承接问题：不明显。
- CTR 问题：不明显，表现好。
- 排名问题：有提升空间，但不是当前风险。

判断：

- 这是目前 pSEO 页里比较健康的页面。
- 它说明“专项页如果意图清楚，是能拿到不错 CTR 的”。

处理态度：

- 保护型页面。
- 不应该大改。

大方向：

- 后续只做小修和保护。
- 可以作为其他专项页的参考对象，但不要机械复制。

#### 3.3.7 其他 pSEO 页

`/converter/jpg-to-pixel-art/`：

- 已收录。
- 有 `4,622` 曝光，但平均排名 `26.00`，CTR `2.29%`。
- 和首页有中等重叠。
- 暂定 P2，排在 photo 和 8-bit 后面。

`/converter/pixelate-image-online/`：

- 已收录。
- 曝光 `2,743`，CTR `1.82%`，平均排名 `20.96`。
- 规模不如 photo / 8-bit。
- 暂定 P2 / P3，先观察。

`/converter/photo-to-sprite-converter/`：

- 已收录。
- 点击 `553`，曝光 `6,217`，CTR `8.89%`，平均排名 `7.15`。
- Top queries 和 sprite 语义匹配。
- 保护型页面，不大改。

#### 3.3.8 小结

当前 3.3 的结论：

| 页面 | 类型 | 处理态度 |
| --- | --- | --- |
| `/converter/photo-to-pixel-art/` | 承接错位 + 照片语义不足 | P1-1，第一批最高优先级 |
| `/converter/8-bit-art-generator/` | cluster 有机会，排名靠后 | P1-2，按 8-bit cluster 处理 |
| `/converter/image-to-pixel-art/` | 和首页重叠高，角色不清 | P1-3，先重新定义角色 |
| `/converter/png-to-pixel-art/` | 方向基本正确 | P2，轻增强 |
| `/converter/gif-to-pixel-art/` | 专项意图清楚，表现好 | 保护 |
| `/converter/jpg-to-pixel-art/` | 有曝光但排名差 | P2，后续 |
| `/converter/pixelate-image-online/` | 规模较小且排名差 | P2 / P3，暂缓 |
| `/converter/photo-to-sprite-converter/` | 表现较好 | 保护 |

本节不产生代码任务。

进入执行清单前，`3.2` 到 `3.7` 已经完成第一轮讨论；后续以第 10 节为准。

### 3.4 博客收录和点击很弱

本节只讨论博客在工具站里的角色，不进入代码方案。

核心判断：

- 博客不是当前第一增长战场。
- 博客应该服务工具页，而不是抢首页和 converter 页的主词。
- 已收录博客、博客列表页、未收录教程页要分开处理。

#### 3.4.1 `/blog/` 博客列表页

现象：

- 收录状态：`Submitted and indexed`
- 全量数据：`1` 点击，`2,201` 曝光，CTR `0.05%`，平均排名 `10.81`
- 最近 28 天：`0` 点击，`199` 曝光
- Top queries 偏杂，包括：`pixelartvillage`、`8 bit photo converter`、`8-bit image converter`
- 它是列表页，不是具体教程页，也不是核心转化页

问题归类：

- CTR 问题：是，但不一定值得优先处理。
- 页面角色问题：是。列表页不该承担太多工具词。
- 收录问题：不是。它已经收录。
- 页面承接问题：部分有，但不是第一优先级。

原因判断：

- 列表页本身很难直接满足具体搜索意图。
- 用户搜 `8 bit photo converter` 或工具词时，更想要工具页，不是博客列表。
- 如果 Google 给 `/blog/` 一些工具词曝光但用户不点，这是合理现象，不一定代表它必须大改。

严重程度：

- P3 / 观察。
- 低 CTR 很明显，但它不是核心转化页，也不是当前最接近增长的位置。

要不要改：

- 暂时不作为第一批优化对象。
- 不建议现在直接 noindex。
- 不建议为了提高 `/blog/` CTR 去大改博客列表。

大方向：

- 博客列表页保持作为内容入口。
- 后续如果它持续抢工具词曝光且没有点击，再讨论是否弱化它对工具词的信号。
- 当前重点是让具体文章和工具页分工清楚，而不是先改列表页。

#### 3.4.2 `/blog/how-to-pixelate-an-image/` 教程页

现象：

- URL Inspection 状态：`Crawled - currently not indexed`
- 全量 GSC 数据：`2` 点击，`1,625` 曝光，CTR `0.12%`，平均排名 `62.72`
- 最近 28 天：`0` 点击，`0` 曝光
- Top queries 包括：
  - `how to pixelate a photo`
  - `how to pixelate an image`
  - `how to make an image pixelated`
  - `how to make a picture pixelated`
- Google 抓过页面，但没有选择收录

问题归类：

- 收录问题：是，而且是核心问题。
- 排名问题：是，但收录问题优先级更高。
- CTR 问题：有，但当前不是主因。
- 页面承接问题：待判断。它应该服务 how-to 教程词，而不是工具主词。

原因判断：

- `Crawled - currently not indexed` 说明 Google 能访问页面，但认为它暂时不值得进入索引。
- 可能原因包括内容独特性不足、和工具页或其他教程页重复、教程价值不够明确、内链权重不足。
- 现在不能直接得出“要 noindex / 删除”的结论。

严重程度：

- P3。
- 它有明确 how-to 意图，但不是当前工具页增长的第一优先级。
- 需要单独处理，不能和已收录 converter 页用同一套方法。

要不要改：

- 要讨论，但不急着执行。
- 不建议直接 noindex。
- 不建议直接删除。
- 先判断它是否有独立教程价值。

大方向：

- 先判断这篇文章是否真正回答 `how to pixelate an image`。
- 如果它有独立价值，后续方向是重写或增强教程，而不是让它抢 `image to pixel art` 主词。
- 如果它和工具页/其他文章高度重复，后续再讨论合并或重写。
- 它应该辅助 `/converter/pixelate-image-online/` 或首页，而不是替代工具页。

后续判断标准：

- 是否有独立的 how-to 搜索意图。
- 是否和 `/converter/pixelate-image-online/` 内容重复。
- 是否有清晰步骤、截图或示例。
- 是否能自然导流到对应工具页。
- 是否值得重新提交收录。

#### 3.4.3 已收录博客和未收录博客不能同一套处理

现象：

- 英文博客里有部分文章已收录。
- `/blog/how-to-pixelate-an-image/` 是抓取后未收录。
- `/blog/` 列表页已收录但点击很弱。

判断：

- 已收录但点击弱：更像标题、摘要、内容匹配、内链和搜索意图问题。
- 抓取后未收录：先看内容质量、重复度、独立价值和内部链接。
- 列表页低 CTR：不一定是核心问题，因为列表页本来不适合承担具体工具词。

处理态度：

- 不做“一刀切”。
- 不把所有博客都重写。
- 不把所有弱博客都 noindex。
- 先按页面类型分开判断。

#### 3.4.4 博客整体策略

博客在这个站里的正确角色：

- 解释教程问题。
- 覆盖 how-to 长尾。
- 给工具页提供语义支持。
- 把用户导向 converter 页面。
- 辅助工具页收录和理解。

博客不应该做的事：

- 不应该抢首页的 `image to pixel art` 主词。
- 不应该抢 `/converter/photo-to-pixel-art/` 的 `photo to pixel art` 词。
- 不应该抢 GIF、PNG、8-bit 等专项工具页的主词。
- 不应该变成独立 SEO 战场，分散主工具页权重。

严重程度：

- 整体 P3。
- 当前比不上首页、photo 页、8-bit 页、主 pSEO 分工重要。

要不要改：

- 要改策略，但不急着改代码。
- 第一批不做大规模博客改造。
- 当前不新增大批量博客文章，先处理工具页和已有页面分工。
- 博客只在明确支持工具页时，才进入后续执行清单。
- 博客后续更多作为“辅助层”处理。

大方向：

- 保留博客，但降低优先级。
- 对未收录教程页做单独诊断。
- 对已收录但弱点击文章，后续看是否服务明确工具页。
- 文章内部链接应把用户导向对应 converter 页面。
- 博客的目标是补充解释和长尾，不是替代工具页。

#### 3.4.5 小结

当前 3.4 的结论：

| 对象 | 主要问题 | 处理态度 |
| --- | --- | --- |
| `/blog/` | 列表页 CTR 极低，但不是核心转化页 | P3 / 观察，不优先大改 |
| `/blog/how-to-pixelate-an-image/` | 抓取后未收录，需判断独立教程价值 | P3，先诊断，不直接 noindex |
| 已收录博客 | 点击弱，可能是意图和内链问题 | 后续逐篇看，不一刀切 |
| 博客整体 | 应服务工具页，不抢主词 | 辅助层，不做第一批主战场 |

本节不产生代码任务。

进入执行清单前，`3.2` 到 `3.7` 已经完成第一轮讨论；后续以第 10 节为准。

### 3.5 美国和桌面端 CTR 偏低

本节只做问题归类，不进入代码方案。

数据口径：

- GSC Web Search，完整窗口 `2025-09-12` 到 `2026-06-01`
- 对照窗口 `2026-05-05` 到 `2026-06-01`
- 本轮没有实时 SERP 实查，所以涉及“美国竞争更强”“桌面结果页更难点”的内容，只能作为假设。

#### 3.5.1 国家和设备补充数据

国家维度，全量窗口：

| 国家 | 点击 | 曝光 | CTR | 平均排名 | 初步读法 |
| --- | ---: | ---: | ---: | ---: | --- |
| `usa` | 3,644 | 122,729 | 2.97% | 11.23 | 曝光最大，CTR 偏低 |
| `rus` | 3,115 | 24,342 | 12.80% | 6.64 | CTR 高，排名也更靠前 |
| `ita` | 1,439 | 18,224 | 7.90% | 7.37 | 表现好 |
| `idn` | 1,402 | 21,829 | 6.42% | 7.32 | 表现好 |
| `bra` | 1,232 | 27,725 | 4.44% | 8.28 | 中等 |
| `vnm` | 1,232 | 15,228 | 8.09% | 7.36 | 表现好 |
| `gbr` | 923 | 26,764 | 3.45% | 9.77 | CTR 偏低 |
| `deu` | 778 | 20,258 | 3.84% | 10.32 | CTR 偏低 |

设备维度，全量窗口：

| 设备 | 点击 | 曝光 | CTR | 平均排名 | 初步读法 |
| --- | ---: | ---: | ---: | ---: | --- |
| `MOBILE` | 13,103 | 216,993 | 6.04% | 7.44 | CTR 明显高于桌面 |
| `DESKTOP` | 11,859 | 333,235 | 3.56% | 9.96 | 曝光最大，CTR 明显偏低 |
| `TABLET` | 838 | 11,987 | 6.99% | 6.70 | 量小，参考价值低 |

国家 + 设备维度：

| 国家 / 设备 | 点击 | 曝光 | CTR | 平均排名 | 初步读法 |
| --- | ---: | ---: | ---: | ---: | --- |
| `usa / DESKTOP` | 1,800 | 78,386 | 2.30% | 12.24 | 最大低 CTR 区域 |
| `usa / MOBILE` | 1,703 | 42,389 | 4.02% | 9.52 | 同是美国，但移动端好很多 |
| `rus / MOBILE` | 1,597 | 10,429 | 15.31% | 5.47 | CTR 高，排名靠前 |
| `rus / DESKTOP` | 1,460 | 13,584 | 10.75% | 7.57 | 桌面也好 |
| `ita / MOBILE` | 767 | 7,768 | 9.87% | 5.54 | CTR 高 |
| `vnm / MOBILE` | 686 | 6,894 | 9.95% | 6.03 | CTR 高 |

最近 28 天对照：

| 维度 | 点击 | 曝光 | CTR | 平均排名 | 初步读法 |
| --- | ---: | ---: | ---: | ---: | --- |
| `usa` | 1,144 | 37,930 | 3.02% | 9.73 | 仍然低于全站平均 |
| `DESKTOP` | 3,942 | 101,767 | 3.87% | 8.58 | 仍低于移动端 |
| `MOBILE` | 4,477 | 68,344 | 6.55% | 7.07 | 仍明显更高 |
| `usa / DESKTOP` | 548 | 23,324 | 2.35% | 10.58 | 问题仍存在 |
| `usa / MOBILE` | 558 | 13,993 | 3.99% | 8.39 | 比美国桌面好 |

#### 3.5.2 美国 CTR 偏低

现象：

- 美国是全站最大曝光国家：`122,729` 曝光。
- 美国 CTR `2.97%`，低于全站 CTR `4.59%`。
- 最近 28 天美国 CTR `3.02%`，没有明显变成高 CTR。
- 美国桌面尤其低：全量 CTR `2.30%`，最近 28 天 CTR `2.35%`。

核心 query 里的美国表现：

| Query | 美国点击 | 美国曝光 | 美国 CTR | 美国排名 | 判断 |
| --- | ---: | ---: | ---: | ---: | --- |
| `image to pixel art` | 364 | 13,042 | 2.79% | 8.59 | 大词，CTR 偏低 |
| `pixel art converter` | 128 | 5,664 | 2.26% | 8.97 | 首页核心词，CTR 偏低 |
| `pixel art generator` | 32 | 2,120 | 1.51% | 15.50 | CTR 和排名都弱 |
| `picture to pixel art` | 32 | 1,455 | 2.20% | 12.15 | 承接错位 + CTR 偏低 |
| `photo to pixel art` | 7 | 683 | 1.02% | 17.16 | 美国表现很弱 |
| `gif to pixel art` | 23 | 63 | 36.51% | 3.63 | 专项页表现好，不是所有美国词都差 |

原因假设：

- 关键词结构问题：美国曝光更集中在 `image to pixel art`、`pixel art converter`、`pixel art generator` 这类大词，大词本来更难点。
- 排名问题：美国不少核心词排名在第 1 页下部或第 2 页，CTR 自然会低。
- 页面承接问题：`photo to pixel art`、`picture to pixel art` 在美国仍有承接错位，目标页没有吃住照片意图。
- SERP 竞争问题：可能存在，但本轮没有实时搜索结果验证，不能直接写成结论。
- 文案吸引力问题：可能存在，尤其是美国用户可能更在意 `free`、`online`、`no sign-up`、`upload and convert` 这类点击理由，但这也要后续结合页面和 SERP 再判断。

严重程度：

- P1 诊断问题。
- 它影响首页核心词，也影响 `photo / picture` 专项页。
- 但它不是“单独做一个美国页面”的问题。

要不要改：

- 要处理，但不是直接做美国专属改版。
- 应该把它作为首页 CTR、核心词意图、photo 页承接错位的判断依据。
- 后续执行时优先看美国高曝光 query，而不是泛泛优化“美国市场”。

大方向：

- 首页继续保护 `image to pixel art` 和 `pixel art converter`。
- 对 `pixel art maker`、`pixel art generator` 的点击理由做保守增强，但不能写成不存在的 AI 生成器。
- `photo to pixel art`、`picture to pixel art` 应继续回到 `/converter/photo-to-pixel-art/` 的页面承接问题里处理。
- 如果后续进入执行前要改 title/snippet，应该先人工看美国 SERP，不要只靠 GSC 平均值。

#### 3.5.3 桌面端 CTR 偏低

现象：

- 桌面端曝光 `333,235`，比移动端 `216,993` 更大。
- 桌面端 CTR `3.56%`，明显低于移动端 `6.04%`。
- 桌面端平均排名 `9.96`，也弱于移动端 `7.44`。
- 最近 28 天仍然类似：桌面 CTR `3.87%`，移动 CTR `6.55%`。

核心 query 的设备差异：

| Query | 桌面 CTR / 排名 | 移动 CTR / 排名 | 判断 |
| --- | ---: | ---: | --- |
| `image to pixel art` | 3.24% / 7.06 | 4.43% / 6.77 | 桌面略弱 |
| `pixel art converter` | 2.95% / 8.95 | 3.63% / 7.15 | 桌面弱 |
| `pixel art maker` | 1.64% / 11.01 | 3.31% / 9.65 | 桌面明显弱 |
| `pixel art generator` | 1.69% / 11.40 | 2.69% / 10.17 | 桌面明显弱 |
| `photo to pixel art` | 1.63% / 15.46 | 2.73% / 10.71 | 桌面明显弱 |
| `picture to pixel art` | 2.00% / 12.86 | 3.98% / 7.55 | 桌面明显弱 |
| `gif to pixel art` | 37.95% / 2.90 | 44.83% / 3.02 | 专项页强，桌面也强 |

原因假设：

- 排名问题：很多核心词桌面排名比移动端差，CTR 低不只是标题问题。
- SERP 展示问题：桌面搜索结果一屏能看到更多竞品、图片结果、工具站或聚合页，这可能稀释点击，但本轮未实查，不能当结论。
- 查询结构问题：桌面端承接了更多 `maker`、`generator`、`converter` 这类泛工具词，竞争和意图都更混。
- 摘要吸引力问题：桌面用户更容易横向比较结果，title 和 snippet 如果没有明确点击理由，可能更容易被跳过。
- 页面承接问题：`photo / picture` 词在桌面排名明显弱，仍然和目标页语义不足有关。

严重程度：

- P1 诊断问题。
- 重点影响首页大词和 photo / picture 专项词。
- 但它不是全站所有页面都要改的问题，因为 `gif to pixel art` 在桌面表现很好。

要不要改：

- 要处理。
- 但不应该单独写成“桌面端改版任务”。
- 它应该反哺后续首页标题、摘要、首屏文案、专项页承接和内链策略。

大方向：

- 后续执行前，优先人工看美国桌面 SERP。
- 对首页大词，重点看搜索结果里的点击理由是否弱。
- 对 `photo / picture`，继续先解决页面承接错位，不要只调 title。
- 保护表现好的专项页，不因为“桌面整体低”就大改所有 converter 页。

#### 3.5.4 需要拆分验证的数据维度

后续如果要进入执行清单，至少要继续拆这些维度：

- `query + country`
- `query + device`
- `page + country`
- `page + device`
- `query + page + country + device`
- 美国桌面 SERP 人工实查
- 重点 query 的真实 title / snippet 展示

验证顺序：

1. 先看 `query + country + device`，确认到底是哪批词、哪个国家、哪个设备低。
2. 再看 `query + page + country + device`，确认当前是不是展示了正确页面。
3. 最后人工看美国桌面 SERP，确认竞品、标题摘要、图片结果和工具聚合页情况。

原因：

- 只看“美国 CTR 低”会混掉关键词差异。
- 只看“桌面 CTR 低”会混掉排名差异。
- 只看全站平均 CTR，容易误伤表现好的专项页。

#### 3.5.5 当前不能直接下结论的内容

现在不能直接说：

- 美国一定是因为 SERP 竞争更强。
- 桌面一定是因为搜索结果里竞品更多。
- CTR 低只要改 title/meta 就能解决。
- 移动端表现好，所以移动端完全不用看。
- 所有 converter 页都要按同一套 CTR 方案改。

现在能说的是：

- 美国和桌面端确实是低 CTR 的主要区域。
- 最大问题集中在高曝光泛词和 `photo / picture` 承接错位词。
- `gif to pixel art` 这类专项页证明：意图清楚的页面可以拿到高 CTR。
- 后续动作要围绕具体 query 和具体页面，不要围绕“国家/设备”空改。

#### 3.5.6 小结

当前 3.5 的结论：

| 问题 | 当前判断 | 处理态度 |
| --- | --- | --- |
| 美国 CTR 偏低 | 成立，但更像 query 结构 + 排名 + 页面承接共同造成 | P1 诊断问题，不做美国专属页面 |
| 桌面端 CTR 偏低 | 成立，且最近 28 天仍存在 | P1 诊断问题，反哺首页和专项页优化 |
| 美国桌面 | 最大低 CTR 区域 | 后续执行前优先实查 SERP |
| `maker` / `generator` | 桌面 CTR 明显弱 | 后续作为首页点击理由问题处理 |
| `photo` / `picture` | 美国和桌面都弱，且承接错位 | 后续回到 photo 专项页处理 |
| `gif to pixel art` | 美国和桌面表现都好 | 保护，不大改 |

补充边界：

- 当前不建议新建 `/us/`、`/desktop/` 或美国专属落地页。
- 美国 / 桌面 CTR 低，应作为现有首页和专项页优化的诊断维度，不作为独立建页理由。

本节不产生代码任务。

进入执行清单前，`3.2` 到 `3.7` 已经完成第一轮讨论；后续以第 10 节为准。

### 3.6 多语言页面机会不均衡

本节只做问题归类，不进入代码方案。

数据口径：

- GSC Web Search，完整窗口 `2025-09-12` 到 `2026-06-01`
- 最近窗口 `2026-05-05` 到 `2026-06-01`
- 本节主要看各语言首页，例如 `/ru/`、`/ja/`、`/de/`
- 收录状态来自 URL Inspection API
- 本轮没有人工检查翻译质量，所以“翻译质量弱”只能作为后续检查项，不能直接当结论。

#### 3.6.1 多语言整体数据

| 语言页 | 收录状态 | 全量点击 | 全量曝光 | CTR | 排名 | 最近 28 天点击/曝光 | 最近 28 天 CTR | 初步判断 |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `/ru/` | Submitted and indexed | 3,062 | 23,573 | 12.99% | 6.16 | 1,146/10,156 | 11.28% | 强，保护 |
| `/it/` | Submitted and indexed | 991 | 7,180 | 13.80% | 5.29 | 521/2,816 | 18.50% | 强，保护 |
| `/vi/` | Submitted and indexed | 949 | 8,677 | 10.94% | 5.96 | 464/4,266 | 10.88% | 强，保护 |
| `/id/` | Submitted and indexed | 848 | 8,353 | 10.15% | 7.16 | 380/2,926 | 12.99% | 强，保护 |
| `/ja/` | Submitted and indexed | 629 | 10,473 | 6.01% | 7.70 | 416/5,605 | 7.42% | 有上升，轻增强 + 保护 |
| `/ko/` | Submitted and indexed | 675 | 13,094 | 5.16% | 7.28 | 359/5,583 | 6.43% | 有量，轻增强 |
| `/pt/` | Submitted and indexed | 615 | 13,290 | 4.63% | 8.23 | 284/5,936 | 4.78% | 有曝光，CTR 一般 |
| `/pl/` | Submitted and indexed | 283 | 3,504 | 8.08% | 5.86 | 133/1,349 | 9.86% | 小而健康 |
| `/es/` | Submitted and indexed | 244 | 3,706 | 6.58% | 7.92 | 60/996 | 6.02% | 中等，不急 |
| `/de/` | Submitted and indexed | 98 | 2,251 | 4.35% | 16.61 | 36/789 | 4.56% | 排名弱，先诊断 |
| `/fr/` | Submitted and indexed | 94 | 1,884 | 4.99% | 9.08 | 14/478 | 2.93% | 最近弱，先诊断 |
| `/sv/` | Submitted and indexed | 78 | 1,509 | 5.17% | 6.49 | 20/469 | 4.26% | 小量，观察 |
| `/nl/` | Submitted and indexed | 33 | 953 | 3.46% | 7.48 | 17/477 | 3.56% | 小量，观察 |
| `/nb/` | Submitted and indexed | 22 | 380 | 5.79% | 6.51 | 11/123 | 8.94% | 样本小，不下重结论 |
| `/ar/` | Submitted and indexed | 13 | 104 | 12.50% | 6.12 | 11/90 | 12.22% | 样本太小，不放大 |
| `/tl/` | Submitted and indexed | 0 | 1 | 0.00% | 8.00 | 0/0 | 0.00% | 几乎无数据，暂缓 |
| `/th/` | Crawled - currently not indexed | 0 | 0 | 0.00% | - | 0/0 | 0.00% | 未收录 / 无数据，暂缓诊断 |

初步读法：

- 多语言不能平均用力。
- `/ru/`、`/it/`、`/vi/`、`/id/` 已经有明显表现，第一原则是保护。
- `/ja/` 最近 28 天占全量点击比例很高，说明正在起来，适合轻增强，但不能大改。
- `/de/` 的主要问题更像排名弱，不是单纯 CTR 弱。
- `/fr/` 最近 28 天 CTR 明显下降，需要先查 query 和页面展示，不直接重写。
- `/es/` 不算很差，只是没有进入强势组，不适合和 `/de/`、`/fr/` 一起粗暴归类为弱。
- `/tl/`、`/th/` 这种几乎无数据语言，不应该在第一批投入。

#### 3.6.2 表现好的语言页

代表页面：

- `/ru/`
- `/it/`
- `/vi/`
- `/id/`
- `/pl/`，量小一些，但指标健康

现象：

- 都已收录。
- CTR 和排名整体好于英文首页很多大词。
- Top query 多数是当地语言的“图片转像素 / 照片转像素 / pixel art village”相关词。
- 这些页面说明：多语言页不是无效资产，做对了能拿点击。

原因判断：

- 这些语言页可能吃到了本地语言长尾词。
- 竞争可能比美国英文大词弱，但本轮没有做 SERP 实查，不能直接下结论。
- 当地语言 query 更明确，用户点击意图更强。

严重程度：

- 不是问题，是保护对象。

要不要改：

- 不建议大改。
- 不建议重写整页。
- 不建议为了统一模板而动这些页面的核心文案。

大方向：

- 保护现有 title、H1、核心文案和主要内链。
- 后续只考虑轻微增强，例如更清楚地链接到对应 converter 页面。
- 上线任何多语言改动前，要先看这些语言页完整 28 天数据，避免误伤。

#### 3.6.3 表现偏弱或需要诊断的语言页

重点页面：

- `/de/`
- `/fr/`
- `/es/`
- `/pt/`
- `/ko/`

分开判断：

| 页面 | 当前问题 | 判断 |
| --- | --- | --- |
| `/de/` | 点击少，曝光有一些，平均排名 `16.61` | 更像排名弱，需要查 query 是否匹配和翻译质量 |
| `/fr/` | 最近 28 天 CTR `2.93%`，点击少 | 需要查最近弱在哪些 query，不直接重写 |
| `/es/` | CTR `6.58%`，排名 `7.92` | 不算差，只是量不大，暂不作为弱页大改 |
| `/pt/` | 曝光 `13,290`，CTR `4.63%` | 有机会，但要先看 query，不急 |
| `/ko/` | 曝光 `13,094`，CTR `5.16%`，最近变好 | 有量，适合轻增强，不是弱页 |

原因假设：

- 可能是翻译质量问题。
- 可能是当地 query 和页面文案不完全匹配。
- 可能是排名不够靠前。
- 可能是当地搜索量本身有限。
- 可能是 Google 更愿意展示英文页或其他页面。

当前不能下的结论：

- 不能直接说这些语言都翻译差。
- 不能直接说德语、法语、西语都要重写。
- 不能因为某个语言 CTR 低，就批量改所有语言页。
- 不能因为 `/de/` 排名弱，就判断所有欧洲语言都弱。

要不要改：

- `/de/` 和 `/fr/`：需要进入后续诊断，但不是第一批代码任务。
- `/es/`：先观察，不急着改。
- `/pt/`、`/ko/`：有曝光基础，后续可以轻增强，但要排在首页、photo、8-bit 之后。

后续诊断重点：

- `/de/` 优先查：query 是否匹配、标题和首屏是否真正本地化、是否被英文页或首页抢展示。
- `/fr/` 优先查：最近 28 天是哪些 query 拉低 CTR、snippet 是否不吸引、是否有排名波动。

大方向：

- 先查 `query + page + country`。
- 再人工抽查翻译质量。
- 再决定是轻修标题、修首屏文案、补内链，还是继续观察。
- 不做批量重写。

#### 3.6.4 日语页面

现象：

- `/ja/` 已收录。
- 全量：`629` 点击，`10,473` 曝光，CTR `6.01%`，平均排名 `7.70`
- 最近 28 天：`416` 点击，`5,605` 曝光，CTR `7.42%`
- 最近 28 天贡献了全量点击的大部分，说明它不是死页，而是在上升。
- Top queries 包括 `画像をピクセル化`、`ピクセル化`、`画像 ピクセル化`，语义方向比较清楚。

问题归类：

- 收录问题：不是。
- CTR 问题：不是最明显。
- 排名问题：轻度。
- 趋势问题：有上升，应该保护。

判断：

- `/ja/` 不应该粗暴重写。
- 它适合作为“轻增强 + 继续观察”的页面。
- 后续如果做多语言优化，日语页应该先保护现在已经有效的 query 方向。

处理态度：

- P2 轻增强。
- 不进入第一批大动作。

大方向：

- 保持日语页面主语义。
- 可以后续轻微加强本地 query 对应文案。
- 不要为了英文 SEO 逻辑，把日语页改成直译式英文结构。
- 观察完整 28 天窗口，不看几天波动。

#### 3.6.5 无数据或样本太小的语言

代表页面：

- `/tl/`
- `/th/`
- `/ar/`
- `/nb/`
- `/nl/`
- `/sv/`

现象：

- 有些已收录但曝光很小。
- `/th/` 是 `Crawled - currently not indexed`，当前没有 GSC 点击和曝光。
- `/ar/` CTR 看起来高，但只有 `104` 曝光，样本太小。

判断：

- 样本太小时，不应该用 CTR 做大决策。
- 无数据语言不应该进入第一批。
- 未收录语言页可以记录问题，但不能抢首页和 pSEO 页面优先级。

处理态度：

- P3 / 观察。
- `/th/` 可以后续做收录诊断，但不急。

大方向：

- 不平均投入。
- 不批量新写内容。
- 不因为“多语言覆盖”而制造低质量页面。
- 等首页、核心 converter、photo、8-bit 这些问题处理完，再决定是否补这些语言。

#### 3.6.6 小结

当前 3.6 的结论：

| 语言类型 | 页面 | 当前判断 | 处理态度 |
| --- | --- | --- | --- |
| 表现好 | `/ru/`、`/it/`、`/vi/`、`/id/` | 已有点击和 CTR，优先保护 | 不大改，轻微内链增强即可 |
| 有上升趋势 | `/ja/` | 最近 28 天明显起来 | P2，轻增强 + 观察 |
| 有量但不强 | `/ko/`、`/pt/`、`/es/` | 有曝光基础，不能算失败 | P2 / P3，先诊断再轻改 |
| 偏弱 | `/de/`、`/fr/` | 德语排名弱，法语最近 CTR 弱 | P3，先查 query、页面、翻译质量 |
| 小样本 / 无数据 | `/nl/`、`/sv/`、`/nb/`、`/ar/`、`/tl/`、`/th/` | 数据不足或未收录 | 观察，暂缓 |

后续多语言诊断时，需要检查：

- `hreflang` 是否完整，互相指向是否正确。
- `canonical` 是否指向自身语言页，而不是统一指向英文页。
- sitemap 是否包含主要语言 URL。
- `html lang` 是否正确。
- title / meta / H1 是否真正本地化，而不是机械直译。
- 多语言页是否能清楚导向对应工具页。

优先级边界：

- 多语言优化不进入第一批主战场。
- 第一批仍优先处理首页核心词、photo 页、8-bit 页。
- 多语言当前只做保护和轻诊断，不做批量重写。

本节不产生代码任务。

进入执行清单前，`3.2` 到 `3.7` 已经完成第一轮讨论。

### 3.7 GSC 里的锚点噪音

本节只做问题归类，不进入代码方案。

数据口径：

- GSC Web Search，完整窗口 `2025-09-12` 到 `2026-06-01`
- 最近窗口 `2026-05-05` 到 `2026-06-01`
- 本地源码检查：`src/components/Footer.jsx`
- 本地 sitemap 与线上 sitemap 均未发现这些 hash URL

#### 3.7.1 现象

GSC 页面维度里出现 4 个 hash URL：

| URL | 全量点击 | 全量曝光 | CTR | 平均排名 | 最近 28 天数据 |
| --- | ---: | ---: | ---: | ---: | --- |
| `https://pixelartvillage.org/#faq` | 0 | 3,732 | 0.00% | 6.66 | 无 |
| `https://pixelartvillage.org/#features` | 0 | 3,732 | 0.00% | 6.66 | 无 |
| `https://pixelartvillage.org/#how-it-works` | 0 | 3,732 | 0.00% | 6.66 | 无 |
| `https://pixelartvillage.org/#showcase` | 0 | 3,732 | 0.00% | 6.66 | 无 |

补充观察：

- 4 个 URL 的曝光、排名完全一样。
- query 列表也基本一样。
- 最近 28 天没有这些 hash URL 数据。
- 它们没有点击，主要是在页面报表里制造噪音。

#### 3.7.2 是否是 sitemap 问题

判断：

- 不是 sitemap 错误。
- 本地 `public/sitemap.xml` 没有这些 hash URL。
- 线上 `https://pixelartvillage.org/sitemap.xml` 也没有这些 hash URL。
- 本地源码里能看到 Footer 有这些站内锚点链接：
  - `/#showcase`
  - `/#features`
  - `/#how-it-works`
  - `/#faq`

原因判断：

- 更可能来自站内锚点链接。
- 也可能是 Google 在 GSC 页面报表里把 fragment URL 单独展示。
- 这不是“提交了错误 sitemap URL”的问题。

#### 3.7.3 是否影响 SEO 判断

影响：

- 对真实页面收录判断影响不大。
- 对核心增长问题影响不大。
- 对 GSC 页面报表有污染，因为它们会产生 4 条 `0` 点击、`3,732` 曝光的页面记录。
- 如果直接看“页面 CTR 最低”或“页面曝光列表”，这些 hash URL 会干扰判断。

不影响：

- 不能把它当成首页真实 CTR 直接下降的唯一原因。
- 不能把它当成 canonical 错误。
- 不能把它当成 sitemap 错误。
- 不能因此判断首页结构一定有 SEO 问题。

严重程度：

- P3。
- 它是报表噪音，不是 P0 / P1 增长问题。

#### 3.7.4 要不要改

当前不建议作为第一批代码任务。

原因：

- 这些锚点没有最近 28 天数据。
- 它们没有点击，更多是历史页面报表噪音。
- 锚点链接本身对用户跳转到 FAQ、Features、How it works、Showcase 有用。
- 为了“消灭 GSC hash URL”，直接删除所有锚点，可能伤害用户体验。

后续什么时候再考虑改：

- 如果未来最近 28 天又大量出现 hash URL 曝光。
- 如果 GSC 页面报表里 hash URL 持续污染首页判断。
- 如果发现站内大量内链都在用 `/#...`，导致 Google 长期单独展示 fragment URL。
- 如果这些 hash URL 开始拿到点击，且影响真实落地页判断。

可能的大方向：

- 优先在报表分析里把 hash URL 单独归类或合并回首页。
- 如果后续确实要改，再讨论 Footer 锚点链接策略。
- 不建议现在为了清理 GSC 报表，直接删掉所有锚点链接。

#### 3.7.5 后续报表处理规则

以后看 GSC 页面数据时：

- `/#faq`、`/#features`、`/#how-it-works`、`/#showcase` 单独归为“首页 hash 噪音”。
- 分析首页真实表现时，应把这些 hash URL 从页面列表里排除，或合并回 `/` 做辅助参考。
- 分析执行效果时，不把这些 hash URL 当成独立落地页。
- 如果只看最近 28 天，本轮这些 hash URL 暂时没有数据，可以低优先级观察。

#### 3.7.6 小结

当前 3.7 的结论：

| 问题 | 当前判断 | 处理态度 |
| --- | --- | --- |
| 是否 sitemap 错误 | 不是，本地和线上 sitemap 都没有 hash URL | 不按 sitemap 问题处理 |
| 是否 canonical 错误 | 当前无证据支持 | 不作为 canonical 问题 |
| 是否影响增长 | 不是 P0 / P1 增长问题 | P3，报表噪音 |
| 是否要删锚点 | 暂不建议 | 先保护用户体验 |
| 后续怎么处理 | GSC 报表里单独归类或合并回首页 | 分析规则处理优先 |

本节不产生代码任务。

至此，`3.2` 到 `3.7` 已完成第一轮讨论。

阶段总审查、执行清单草案、批次 A 任务拆解均已完成，批次 A 已本地执行并完成代码审评。当前新增批次 A-UI 布局执行方案，下一步以第 10 节为准。

## 4. 后续讨论规则

每个问题都按这个格式讨论：

1. 现象是什么
2. 为什么会这样
3. 严重不严重
4. 要不要改
5. 如果改，大方向是什么

## 5. 后续执行规则

在全部问题讨论完之前：

- 不改代码
- 不提交
- 不部署

等讨论完成后：

- 先把本文档整理成执行清单
- 再按优先级逐步改
- 每改一批都单独验证
- 每批上线后看 GSC 变化，不把太多改动混在一起

## 6. 同事意见评审

评审对象：用户粘贴的同事意见。

总体判断：

- 大方向基本正确
- 可以作为下一版执行清单的基础
- 但里面有些判断还需要更细，不应该直接当成最终执行方案

### 6.1 说得对的地方

1. 不急着改代码是对的

SEO 改动如果一次做太多，后面 GSC 变了也看不清是哪一步造成的。

2. “首页强不是坏事”这个判断是对的

首页本来就有主工具功能，所以它拿 `image to pixel art`、`pixel art converter`、`pixel art maker`、`pixel art generator` 这些词是正常的。

3. 先做 `Query -> 当前排名页面 -> 目标页面` 映射表是对的

这是后续执行前最应该补的东西。没有这张表，就容易首页、主转换页、pSEO 页互相抢。

4. 缺少优先级和验收指标这个批评是对的

当前讨论文档还是“问题记录”，还不是“可执行清单”。后面需要补：

- 严重程度
- 预期收益
- 执行动作
- 验收指标

5. pSEO 页面要避免伪重复，这个方向是对的

子页面不能只是换标题和关键词。每个页面要有自己的使用场景、步骤、FAQ、例子和调参建议。

6. 博客不应该优先于工具页，这个判断基本对

这个站是工具站。当前最接近增长的机会在首页和 converter 页面，不在大规模写博客。

### 6.2 需要修正或补充的地方

1. “首页继续负责 `pixel art maker` 和 `pixel art generator`”只能算当前阶段判断

现在可以先让首页承接这两个词，因为首页确实最强。

但这不是永久规则。后面如果要做更专门的 maker/generator 页面，或者 GSC 显示用户意图更偏“从零画图”，这个分工可能要改。

2. `排名 10-13` 不能简单理解成真实固定排名

GSC 的平均排名是很多国家、设备、日期混在一起算出来的平均值。

所以 `pixel art maker` 平均排名 `10.58`，只能说明它接近机会区，不能简单说它在所有地方都是第 10 名。

执行前要拆：

- 国家
- 设备
- 最近 28 天
- 页面 + query 组合

3. title/meta 可以优化，但不能以为只改 title/meta 就能解决

Google 的标题和摘要不完全听 `<title>` 和 meta description。它还会看页面里的大标题、正文、锚文本、外部链接文字等。

所以执行时要同时改：

- title
- meta description
- H1
- 首屏可见文案
- 页面内链文字
- FAQ
- 页面真实内容

4. “pSEO 页至少 30%-40% 独特内容”是经验规则，不是官方规则

可以作为内部执行要求。

但不要把它写成 Google 官方要求。

更稳的说法是：每个 pSEO 页面必须有清楚不同的搜索意图和页面价值。

5. canonical 那段引用方向对，但不能误判当前问题

Google 确实会在相似页面里选代表页。

但本轮抽查中，几个重点 converter 页自己的 canonical 都是正确的，也都已经收录。

所以当前主要问题不是“Google 把 canonical 选错了”，而是：

- 子页面内容不够强
- 子页面和首页意图不够分明
- Google 排名时更愿意展示首页

6. 锚点 URL 暂时不是 P0，但不能完全忽略

`/#faq`、`/#features` 这类不是 sitemap 错误。

但它们在 GSC 里有曝光没点击，会让页面数据看起来更乱。

先不作为核心增长任务，但后面做报表时要把这类锚点单独排除或单独归类。

### 6.3 对同事建议的采纳方式

采纳：

- 补 `Query -> 当前页面 -> 目标页面` 表
- 给每个问题补严重程度、预期收益、动作、验收指标
- 首页不削弱，子页增强
- pSEO 页做真正差异化
- 博客暂时放在工具页后面
- 多语言不平均用力

不直接采纳：

- 不把 `30%-40% 独特内容` 写成硬性官方规则
- 不把平均排名当成真实固定排名
- 不把问题简单归因到 canonical
- 不只改 title/meta 就期望解决排名和 CTR

### 6.4 下一步建议

下一步最应该补的是关键词映射表。

字段建议：

- Query
- 当前主要展示页面
- 目标承接页面
- 点击
- 曝光
- CTR
- 平均排名
- 最近 28 天变化
- 国家
- 设备
- 问题类型
- 优先级
- 初步动作
- 验收指标

## 7. 第二轮审批意见评审

评审对象：用户粘贴的“审批结论”。

总体判断：

- 基本正确
- 可以作为下一步讨论推进方式
- 但仍然不能直接进入代码执行
- 下一步应该先补数据表，不是先改页面

### 7.1 说得对的地方

1. “有条件通过讨论记录阶段”这个判断是对的

当前文档已经能说明方向，但还没有形成可执行清单。

所以它可以继续作为讨论底稿，但不能直接作为代码任务。

2. 指出 `3.2` 到 `3.7` 还没讨论完，这个对

当前已经真正讨论较充分的是：

- 首页强不是坏事
- 子页面要增强专门性
- 同事意见哪些能采纳

但下面这些还没有逐项定结论：

- 核心词为什么卡在第 1 页底部或第 2 页
- pSEO 工具页具体怎么分工
- 博客到底保留、增强、合并还是暂缓
- 美国和桌面端 CTR 为什么偏低
- 多语言页面怎么保守处理
- 锚点噪音怎么归类

3. 要补 `Query 映射表`，这个非常对

没有这张表，后面容易出现“感觉某页应该抢某词”，但 GSC 实际不是这样。

4. 要补 `URL 诊断表`，这个也对

只看关键词不够。还要看每个页面：

- 是否收录
- 是否有点击
- 是否承担了正确角色
- 是否和首页抢同一批词
- 是否值得优先增强

5. “美国和桌面端 CTR 偏低”要拆原因，这个对

不能只写“优化 CTR”。

后面要拆成假设，再用数据或 SERP 实查验证。

6. 多语言要保守处理，这个对

表现好的语言页不能大改，避免误伤。

表现弱的语言页要先查原因，不能直接重写。

### 7.2 需要补充或修正的地方

1. 补表不等于进入执行代码

补 `Query 映射表` 和 `URL 诊断表` 仍然属于分析阶段。

它不会违反“不改代码、不提交、不部署”的原则。

2. `Query 映射表` 不能只看全站总数据

这张表至少要看：

- 全量数据
- 最近 28 天
- 页面 + query 组合
- 国家
- 设备

否则还是会被平均值误导。

3. `URL 诊断表` 里的“是否和首页重复”不能只靠文字感觉

应该用三类证据判断：

- 页面内容是否太像
- GSC query 是否重叠
- Google 实际更常展示哪个页面

4. 美国和桌面端 CTR 的原因现在只能先写成假设

例如：

- 美国 SERP 竞争更强
- 桌面端结果页展示更多竞品
- title/snippet 缺少点击理由
- 美国用户更区分 converter、maker、generator

这些都还需要后续实查，不能直接当结论。

5. 观察周期要写清楚

GSC 有延迟。上线后不要看当天，也不要只看几天。

建议：

- 先等 Google 重新抓取重点页
- 再看完整 14 到 28 天窗口
- 核心 SEO 判断最好看 28 天以上

### 7.3 采纳结论

采纳：

- 当前文档只通过“讨论记录阶段”
- 不进入代码执行
- 下一步先补两张表
- 继续逐个讨论 `3.2` 到 `3.7`
- 最后再整理真正执行清单

不直接采纳：

- 不把 CTR 偏低原因直接写成结论
- 不只凭页面名字判断页面重复
- 不用全站平均排名直接定优先级

### 7.4 下一步顺序

建议下一步按这个顺序推进：

1. 补 `Query 映射表`
2. 补 `URL 诊断表`
3. 用两张表讨论 `3.2` 核心词卡位问题
4. 再讨论 `3.3` pSEO 工具页分工
5. 后面继续讨论博客、多语言、美国/桌面 CTR、锚点噪音

## 8. Query 映射表（GSC 数据版）

数据口径：GSC Web Search，完整窗口 `2025-09-12` 到 `2026-06-01`，最近窗口 `2026-05-05` 到 `2026-06-01`。

| Query | 当前主要页面 | 最近28天主要页面 | 目标页面 | 全量点击 | 全量曝光 | CTR | 排名 | 最近28天点击/曝光 | 主要国家/设备 | 问题类型 | 优先级 | 初步动作 | 验收指标 |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- |
| `image to pixel art` | `/` | `/` | `/` | 1,814 | 48,637 | 3.73% | 6.94 | 532/10,971 | usa / DESKTOP | 基本正常 | P2 | 保持观察，少改 | 完整28天保持点击和排名不下降 |
| `pixel art converter` | `/` | `/` | `/` | 506 | 15,291 | 3.31% | 8.05 | 177/4,391 | usa / DESKTOP | 第 1 页中下部 | P1 | 保持观察，少改 | 完整28天平均排名进入或接近前10 |
| `pixel art maker` | `/` | `/` | `/` | 361 | 16,610 | 2.17% | 10.58 | 171/8,055 | usa / DESKTOP | 排名靠后 / CTR低 / 曝光涨但CTR降 | P1 | 优化标题/摘要/首屏点击理由 | 完整28天CTR比当前提升，且点击不下降 |
| `pixel art generator` | `/` | `/` | `/` | 299 | 13,840 | 2.16% | 10.82 | 151/6,865 | usa / DESKTOP | 排名靠后 / CTR低 / 曝光涨但CTR降 | P1 | 优化标题/摘要/首屏点击理由 | 完整28天CTR比当前提升，且点击不下降 |
| `photo to pixel art` | `/` | `/` | `/converter/photo-to-pixel-art/` | 134 | 6,153 | 2.18% | 13.01 | 44/1,561 | usa / MOBILE | 当前展示页不匹配 / 排名靠后 / CTR低 | P1 | 补目标页专门内容 + 首页内链指向目标页 | 目标 query 的主要展示页逐步变成目标页 |
| `png to pixel art` | `/` | `/` | `/converter/png-to-pixel-art/` | 102 | 2,545 | 4.01% | 6.91 | 39/626 | usa / DESKTOP | 当前展示页不匹配 | P2 | 补目标页专门内容 + 首页内链指向目标页 | 目标 query 的主要展示页逐步变成目标页 |
| `gif to pixel art` | `/converter/gif-to-pixel-art/` | `/converter/gif-to-pixel-art/` | `/converter/gif-to-pixel-art/` | 89 | 224 | 39.73% | 2.93 | 13/37 | usa / DESKTOP | 基本正常 | P3 | 保持观察，少改 | 完整28天保持点击和排名不下降 |
| `8 bit art generator` | `/` | `/` | `/converter/8-bit-art-generator/` | 1 | 37 | 2.70% | 21.65 | 0/6 | usa / DESKTOP | 当前展示页不匹配 / 排名靠后 | 观察 | 补目标页专门内容 + 首页内链指向目标页 | 目标 query 的主要展示页逐步变成目标页 |
| `image to pixel` | `/` | `/` | `/` | 569 | 12,610 | 4.51% | 6.76 | 177/3,356 | usa / DESKTOP | 基本正常 | P2 | 保持观察，少改 | 完整28天保持点击和排名不下降 |
| `image to pixel converter` | `/` | `/` | `/` | 277 | 3,797 | 7.30% | 7.30 | 64/932 | ind / MOBILE | 第 1 页中下部 | P2 | 保持观察，少改 | 完整28天平均排名进入或接近前10 |
| `picture to pixel art` | `/` | `/` | `/converter/photo-to-pixel-art/` | 184 | 6,063 | 3.03% | 10.19 | 75/1,742 | usa / MOBILE | 当前展示页不匹配 / 排名靠后 | P1 | 补目标页专门内容 + 首页内链指向目标页 | 目标 query 的主要展示页逐步变成目标页 |
| `pixelate image online` | `/converter/pixelate-image-online/` | `/converter/pixelate-image-online/` | `/converter/pixelate-image-online/` | 3 | 200 | 1.50% | 17.84 | 0/14 | idn / DESKTOP | 排名靠后 | P3 | 增强页面内容深度和专项场景 | 完整28天平均排名进入或接近前10 |
| `jpg to pixel art` | `/` | `/` | `/converter/jpg-to-pixel-art/` | 17 | 539 | 3.15% | 8.26 | 7/153 | usa / DESKTOP | 当前展示页不匹配 / 第 1 页中下部 | P3 | 补目标页专门内容 + 首页内链指向目标页 | 目标 query 的主要展示页逐步变成目标页 |
| `image to sprite` | `/converter/photo-to-sprite-converter/` | `/converter/photo-to-sprite-converter/` | `/converter/photo-to-sprite-converter/` | 87 | 523 | 16.63% | 6.30 | 38/202 | usa / DESKTOP | 基本正常 | P3 | 保持观察，少改 | 完整28天保持点击和排名不下降 |
| `8 bit image converter` | `/converter/image-to-pixel-art/` | `/converter/image-to-pixel-art/` | `/converter/8-bit-art-generator/` | 12 | 295 | 4.07% | 10.91 | 6/100 | usa / DESKTOP | 当前展示页不匹配 / 排名靠后 | P3 | 补目标页专门内容 + 首页内链指向目标页 | 目标 query 的主要展示页逐步变成目标页 |

初步读法：

- `image to pixel art`、`pixel art converter`、`image to pixel` 目前让首页承接是合理的。
- `photo to pixel art`、`png to pixel art`、`8 bit image converter` 这类词当前主要页面和目标页不完全匹配，后面要重点讨论。
- `pixel art maker`、`pixel art generator` 曝光大、点击有增长，但 CTR 低，属于首页 P1 优化机会。
- `gif to pixel art` 当前表现好，不适合大改，先保护。

## 9. URL 诊断表（GSC + URL Inspection 版）

数据口径同上；收录状态来自 URL Inspection API。

| URL | 当前角色 | 目标关键词 | 收录状态 | 全量点击 | 全量曝光 | CTR | 排名 | 最近28天点击/曝光 | 首页重叠 | Top queries | 当前问题 | 优先级 |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| `/` | 总工具入口 | image to pixel art / pixel art converter / pixel art maker / pixel art generator | Submitted and indexed | 13,344 | 377,422 | 3.54% | 8.08 | 4,299/123,594 | 正常强势 | image to pixel art, pixel art village, image to pixel | 可保持观察 | P1 |
| `/converter/image-to-pixel-art/` | 主转换说明页 / 长尾转换页 | image to pixel art converter / convert image to pixel art / online image to pixel art converter | Submitted and indexed | 419 | 15,097 | 2.78% | 21.50 | 53/1,466 | 高（Top20重叠10个） | image to pixel, image to pixel art, 8 bit image converter | 和首页 query 重叠高 / CTR低 / 排名靠后；是否让它抢 converter 长尾词，后续还要看页面 + query 数据 | P1 |
| `/converter/photo-to-pixel-art/` | 照片专项页 | photo to pixel art / photo to pixel | Submitted and indexed | 320 | 17,779 | 1.80% | 20.32 | 15/1,113 | 高（Top20重叠12个） | image to pixel art, image to pixel, pixelartvillage | 和首页 query 重叠高 / CTR低 / 排名靠后 | P1 |
| `/converter/png-to-pixel-art/` | PNG专项页 | png to pixel art | Submitted and indexed | 168 | 4,626 | 3.63% | 8.36 | 48/764 | 低（Top20重叠1个） | png to pixel, png to pixel art, png to pixel converter | 可保持观察 | P2 |
| `/converter/gif-to-pixel-art/` | GIF专项页 | gif to pixel art | Submitted and indexed | 551 | 4,878 | 11.30% | 7.58 | 134/1,153 | 低（Top20重叠1个） | gif to pixel art, gif pixelator, gif to pixel | 可保持观察 | P2 |
| `/converter/jpg-to-pixel-art/` | JPG专项页 | jpg to pixel art | Submitted and indexed | 106 | 4,622 | 2.29% | 26.00 | 22/880 | 中（Top20重叠6个） | image to pixel art, jpg to pixel, image to pixel converter | CTR低 / 排名靠后 | P2 |
| `/converter/8-bit-art-generator/` | 8-bit专项页 | 8 bit art generator / 8 bit image converter | Submitted and indexed | 154 | 5,875 | 2.62% | 20.47 | 59/1,355 | 低 | 8 bit maker, image to 8 bit, 8-bit art maker | CTR低 / 排名靠后 | P1 |
| `/converter/pixelate-image-online/` | pixelate专项页 | pixelate image online | Submitted and indexed | 50 | 2,743 | 1.82% | 20.96 | 8/315 | 低（Top20重叠1个） | pixelate image online, pixelate online, pixelartvillage | CTR低 / 排名靠后 | P2 |
| `/converter/photo-to-sprite-converter/` | sprite专项页 | photo to sprite / image to sprite | Submitted and indexed | 553 | 6,217 | 8.89% | 7.15 | 162/1,375 | 低 | image to sprite, image to sprite converter, picture to sprite converter | 可保持观察 | P2 |
| `/blog/` | 博客列表页 | 教程集合入口 | Submitted and indexed | 1 | 2,201 | 0.05% | 10.81 | 0/199 | 低（Top20重叠2个） | pixelartvillage, 8 bit photo converter, 8-bit image converter | CTR 低，但不是核心转化页；暂不优先处理 | P3 / 观察 |
| `/blog/how-to-pixelate-an-image/` | 教程页 | how to pixelate an image | Crawled - currently not indexed | 2 | 1,625 | 0.12% | 62.72 | 0/0 | 低 | 128x128 pixel art maker, how can i pixelate a photo, how do i pixelate a photo | 收录问题 / CTR低 / 排名靠后 | P3 |
| `/ru/` | 俄语首页 | 俄语转换词 | Submitted and indexed | 3,062 | 23,573 | 12.99% | 6.16 | 1,146/10,156 | 低（Top20重叠1个） | сделать пиксель арт из фото, фото в пиксель арт, пиксель арт из фото | 可保持观察 | P2 |
| `/ja/` | 日语首页 | 日语转换词 | Submitted and indexed | 629 | 10,473 | 6.01% | 7.70 | 416/5,605 | 中（Top20重叠3个） | 画像をピクセル化, ピクセル化, 画像 ピクセル化 | 可保持观察 | P2 |

初步读法：

- 首页是正常强势页，下一步不是削弱首页，而是让首页更清楚地导向专项页。
- `/converter/image-to-pixel-art/`、`/converter/photo-to-pixel-art/`、`/converter/8-bit-art-generator/` 已收录，但排名和承接不理想，适合进入后续重点讨论。
- `/converter/gif-to-pixel-art/` 点击率高，说明专项意图清楚，先不要大改。
- `/blog/how-to-pixelate-an-image/` 是收录问题，不应和已收录工具页用同一套处理方式。
- `/ru/`、`/ja/` 有点击和收录基础，属于保护型页面，后面多语言讨论时不能粗暴重写。

### 9.1 8-bit query cluster 小表

单看 `8 bit art generator` 会低估 `/converter/8-bit-art-generator/`。这个页面要按一组 8-bit 相关词看。

| Query | 当前主要页面 | 目标页面 | 点击 | 曝光 | CTR | 排名 | 判断 |
| --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| `8 bit art generator` | `/` | `/converter/8-bit-art-generator/` | 1 | 37 | 2.70% | 21.65 | 当前页面不匹配 / 排名靠后 |
| `8 bit image converter` | `/converter/image-to-pixel-art/` | `/converter/8-bit-art-generator/` | 12 | 295 | 4.07% | 10.91 | 当前页面不匹配 / 排名靠后 |
| `8 bit maker` | `/converter/8-bit-art-generator/` | `/converter/8-bit-art-generator/` | 16 | 397 | 4.03% | 12.43 | 排名靠后 |
| `image to 8 bit` | `/converter/image-to-pixel-art/` | `/converter/8-bit-art-generator/` | 9 | 154 | 5.84% | 11.60 | 当前页面不匹配 / 排名靠后 |
| `8-bit art maker` | `/converter/8-bit-art-generator/` | `/converter/8-bit-art-generator/` | 3 | 45 | 6.67% | 32.62 | 排名靠后 |
| `8 bit art maker` | `/converter/8-bit-art-generator/` | `/converter/8-bit-art-generator/` | 2 | 134 | 1.49% | 28.30 | CTR低 / 排名靠后 |
| `8 bit converter` | `/converter/image-to-pixel-art/` | `/converter/8-bit-art-generator/` | 8 | 169 | 4.73% | 19.96 | 当前页面不匹配 / 排名靠后 |
| `8bit converter` | `/converter/8-bit-art-generator/` | `/converter/8-bit-art-generator/` | 4 | 107 | 3.74% | 12.39 | 排名靠后 |
| `8 bit generator` | `/converter/8-bit-art-generator/` | `/converter/8-bit-art-generator/` | 3 | 48 | 6.25% | 13.19 | 排名靠后 |

初步读法：

- 这个 cluster 的主要问题是排名靠后，不是完全没数据。
- 有几类词当前被 `/` 或 `/converter/image-to-pixel-art/` 承接，目标页不够稳。
- 后面讨论 pSEO 分工时，应把 `/converter/8-bit-art-generator/` 当成一个独立 cluster，而不是只看单个 query。

### 9.2 photo / picture query cluster 小表

`/converter/photo-to-pixel-art/` 的问题不是简单“内容弱”，而是照片语义还不够明确，导致很多 photo / picture 词仍由首页承接。

| Query | 当前主要页面 | 目标页面 | 点击 | 曝光 | CTR | 排名 | 判断 |
| --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| `photo to pixel art` | `/` | `/converter/photo-to-pixel-art/` | 134 | 6,153 | 2.18% | 13.01 | 当前页面不匹配 / CTR低 / 排名靠后 |
| `picture to pixel art` | `/` | `/converter/photo-to-pixel-art/` | 184 | 6,063 | 3.03% | 10.19 | 当前页面不匹配 / 排名靠后 |
| `photo to pixel` | `/` | `/converter/photo-to-pixel-art/` | 117 | 2,008 | 5.83% | 6.53 | 当前页面不匹配 |
| `picture to pixel` | `/` | `/converter/photo-to-pixel-art/` | 31 | 1,273 | 2.44% | 9.57 | 当前页面不匹配 / CTR低 |
| `portrait to pixel art` | `无数据` | `/converter/photo-to-pixel-art/` | 0 | 0 | 0.00% | - | 无明显数据，先不判断 |
| `avatar pixel art` | `无数据` | `/converter/photo-to-pixel-art/` | 0 | 0 | 0.00% | - | 无明显数据，先不判断 |
| `pet photo pixel art` | `无数据` | `/converter/photo-to-pixel-art/` | 0 | 0 | 0.00% | - | 无明显数据，先不判断 |
| `photo into pixel art` | `/` | `/converter/photo-to-pixel-art/` | 11 | 474 | 2.32% | 12.61 | 当前页面不匹配 / CTR低 / 排名靠后 |
| `pic to pixel art` | `/` | `/converter/photo-to-pixel-art/` | 21 | 868 | 2.42% | 9.14 | 当前页面不匹配 / CTR低 |
| `picture to pixel converter` | `/` | `/converter/photo-to-pixel-art/` | 43 | 555 | 7.75% | 6.90 | 当前页面不匹配 |

初步读法：

- `photo to pixel art` 和 `picture to pixel art` 是明确的 P1 承接错位问题。
- `photo to pixel`、`picture to pixel` 排名不差，但仍由首页承接，说明照片专项页的语义没有抢回来。
- `portrait`、`avatar`、`pet photo` 当前无明显 GSC 数据，不能作为第一批主攻词，只能作为内容场景备用。

## 10. 当前下一步

当前已经完成第一轮讨论：

- `3.2 核心词卡在第 1 页底部或第 2 页`
- `3.3 pSEO 工具页没有分工清楚`
- `3.4 博客收录和点击很弱`
- `3.5 美国和桌面端 CTR 偏低`
- `3.6 多语言页面机会不均衡`
- `3.7 GSC 里的锚点噪音`

批次 A 当前状态：

- 已执行 `/converter/photo-to-pixel-art/` 批次 A。
- 已跑 `npm run build`。
- 已跑 `npm run verify:dist`。
- 已跑 `npm run lint`。
- 已跑 `npm run i18n:check`，命令退出码为 0；输出里仍有项目原本存在的多语言缺失 / extra 提示，本批次不处理多语言。
- 已完成批次 A 代码审评。
- 已新增批次 A-UI 布局执行方案。
- 已执行批次 A-UI 布局改版。
- 已完成 UI 改版后的本地构建、产物验证和视觉检查。
- 已执行关键词密度微调：补少量 `picture to pixel art`，不继续增加首页大词。
- 已执行 H 标签结构清理：上传提示不再作为 H2，hero 小卡片标题不再作为 H2。
- 尚未提交，尚未部署。

下一步：

- 审评批次 A 当前全部代码改动。
- 如果通过，再决定是否提交和部署。

### 10.1 批次 A 开工清单

批次 A 已按下面这张清单执行。

| 项目 | 要求 |
| --- | --- |
| 本批次只改 | `/converter/photo-to-pixel-art/` |
| 主攻 query | `photo to pixel art`、`picture to pixel art`、`photo to pixel`、`picture to pixel` |
| 首页保护 query | `image to pixel art`、`pixel art converter` |
| 第一优先文件 | `src/content/pseo-pages.en.json` |
| 允许最小改动 | 只有字段不够时，才改 `src/components/PseoPage.jsx` |
| 组件同步要求 | 如果新增字段影响预渲染，必须同步 `scripts/build/prerender-spa.cjs` |
| 首页最多允许 | 只改 photo 专项入口卡片或锚文本 |
| 本批次禁止 | 首页 hero / title / meta / H1 / 主 CTA / `maker` / `generator` / `converter` 核心文案 |
| 本批次禁止 | 8-bit 页、image-to-pixel 页、多语言页、博客页、hash URL 处理 |
| 内容模块 | title、meta description、H1、intro、top callout、how-to / settings tips、photo 场景、FAQ、内链 |
| FAQ 要求 | FAQ JSON-LD 的问答必须在页面可见内容中出现 |
| 必跑命令 | `npm run build`、`npm run verify:dist` |
| 视情况运行 | 如果改了组件或脚本，再跑 `npm run lint` |
| 必查产物 | `dist/converter/photo-to-pixel-art/index.html` |
| PR 边界 | 只包含批次 A 相关文件，不混入其他页面和无关重构 |

开工顺序：

1. 先改 `src/content/pseo-pages.en.json`。
2. 看现有字段能不能表达 photo 页内容。
3. 如果不够，再最小改 `PseoPage.jsx`。
4. 如果改了页面字段或组件，再同步预渲染脚本。
5. 最后最多轻改首页 photo 入口文字。
6. 跑构建和产物验证。

## 11. 阶段总审查

本节是对 `3.2` 到 `3.7` 的阶段收口。

本节仍然不是最终执行清单，也不是代码任务。

### 11.1 是否可以整理执行清单

结论：

- 可以开始整理执行清单草案。
- 不能直接进入代码执行。
- 不能把下面的候选分层直接当成开发任务。

理由：

- `3.2` 到 `3.7` 已完成第一轮讨论。
- 已有 Query 映射表、URL 诊断表、8-bit cluster 表、photo / picture cluster 表。
- 已经区分了 P1、P2、P3、保护项和观察项。
- 但真正执行前，还要把每个候选动作拆成小批次，并写清楚验收指标。

当前最重要的边界：

- 不做大而全改版。
- 不把首页、photo 页、8-bit 页同时大改。
- 不把 title/meta 当成唯一动作。
- 不批量重写博客。
- 不批量重写多语言页。
- 不为了清理 GSC hash 噪音删除所有锚点。

### 11.2 第一批执行候选

第一批是“最值得进入执行清单草案的候选池”，不是说一次上线全部改完。

| 候选对象 | 主要问题 | 为什么进第一批候选 | 执行边界 |
| --- | --- | --- | --- |
| 首页核心词 CTR / 意图匹配 | `pixel art maker`、`pixel art generator` 排名临界，CTR 偏低 | 曝光大，和首页主定位强相关 | 保守优化，不能误写 AI 生成器，不能削弱 `pixel art converter` |
| `/converter/photo-to-pixel-art/` | `photo / picture` 词由首页承接，目标页照片语义不足 | 承接错位最明显，GSC 数据明确 | 主攻 photo / picture，不把 portrait、avatar、pet photo 当第一批主词 |
| `/converter/8-bit-art-generator/` | 8-bit cluster 排名靠后，部分 query 被其他页承接 | 有一组 8-bit query 机会，不是单个词问题 | 按 8-bit 风格转换定位，不写成不存在的 AI 生成器 |

第一批内部顺序建议：

1. `/converter/photo-to-pixel-art/`
2. `/converter/8-bit-art-generator/`
3. 首页 `maker / generator` 点击理由和意图匹配

说明：

- 这个顺序不是最终开发顺序。
- 真正执行时，每次只改一类问题。
- 如果同时改多个页面，后续 GSC 很难判断是哪一处产生影响。

### 11.3 第二批执行候选

第二批是“重要，但不应该抢第一批”的候选。

| 候选对象 | 主要问题 | 当前处理态度 |
| --- | --- | --- |
| `/converter/image-to-pixel-art/` | 和首页重叠高，角色不清 | 角色重定义，但不能急着抢首页主词 |
| `/converter/png-to-pixel-art/` | 方向基本对，有轻增强空间 | P2，轻增强 |
| `/converter/jpg-to-pixel-art/` | 有曝光但排名靠后，部分泛词重叠 | P2，排在 photo / 8-bit 后 |
| `/converter/pixelate-image-online/` | 排名和 CTR 弱，但规模较小 | P2 / P3，观察后再定 |
| `/de/`、`/fr/` | 德语排名弱，法语最近 CTR 弱 | 先查 query、页面、翻译质量，不直接重写 |
| `/ko/`、`/pt/`、`/es/` | 有量但不强 | 先诊断，后续轻增强 |

第二批边界：

- 不和第一批混在同一次上线。
- 不做批量模板化重写。
- 先诊断，再决定是否进代码任务。

### 11.4 保护项

这些页面或语言已有不错表现，第一原则是不要误伤。

| 保护对象 | 保护原因 | 当前处理 |
| --- | --- | --- |
| `/converter/gif-to-pixel-art/` | CTR 高，专项意图清楚 | 不大改 |
| `/converter/photo-to-sprite-converter/` | 点击和排名健康，定位清楚 | 不大改 |
| `/ru/` | 点击多，CTR 高，排名好 | 保护 |
| `/it/` | 最近 28 天表现强 | 保护 |
| `/vi/` | CTR 和排名健康 | 保护 |
| `/id/` | CTR 和排名健康 | 保护 |
| `/ja/` | 最近 28 天明显上升 | 轻增强 + 保护，不粗暴重写 |
| 首页 `image to pixel art` / `pixel art converter` | 首页核心词已有基础 | 保守处理，不削弱 |

保护规则：

- 不做大改。
- 不为了统一模板而重写。
- 不和第一批试验混在一起。
- 如果必须改，先记录完整 28 天基线。

### 11.5 观察项

这些对象暂时不进入第一批，也不应该拖慢主任务。

| 观察对象 | 原因 | 当前处理 |
| --- | --- | --- |
| `/blog/` | 列表页低 CTR，但不是核心转化页 | P3 / 观察 |
| `/blog/how-to-pixelate-an-image/` | 抓取后未收录，需要判断教程价值 | P3，先诊断 |
| 已收录但弱点击博客 | 需要逐篇看是否服务工具页 | 不一刀切 |
| 小样本语言页 | 数据太少，不能用 CTR 做大决策 | 观察 |
| `/th/` | 抓取后未收录，无 GSC 点击曝光 | 暂缓诊断 |
| GSC hash URL | 报表噪音，不是增长问题 | 报表归类处理 |

观察项边界：

- 不进入第一批代码任务。
- 不因为数据差就直接删除或 noindex。
- 不因为 CTR 高低就放大样本太小的页面。

### 11.6 绝不进入第一批的事项

以下事项不进入第一批：

- 新建 `/us/`、`/desktop/` 或美国专属落地页。
- 批量重写所有多语言页面。
- 批量生产博客文章。
- 为了清理 GSC 报表删除所有 Footer 锚点。
- 只改 title/meta，不动页面真实内容和内链。
- 同时大改首页、photo 页、8-bit 页、多个 pSEO 页。
- 对表现好的 GIF、sprite、强势多语言页做大改。

### 11.7 执行清单整理原则

后续整理执行清单时，要按这些规则：

1. 每批只解决一类问题。
2. 每个任务要写清楚目标 query、目标页面、当前基线和验收指标。
3. 每批上线后观察完整 `14` 到 `28` 天，不看当天数据下结论。
4. 重点看目标 query 的主要展示页面、CTR、点击、曝光和平均排名。
5. 保护项要单独标记，避免误改。
6. 报表里 hash URL 单独归类，不当成独立落地页。
7. 多语言任务先做诊断，不直接进入批量改文案。

验收指标原则：

- 首页任务：看 `pixel art maker`、`pixel art generator`、`pixel art converter` 是否点击不降，CTR 是否改善，核心排名是否不退。
- photo 页任务：看 `photo to pixel art`、`picture to pixel art`、`photo to pixel`、`picture to pixel` 是否逐步由 `/converter/photo-to-pixel-art/` 承接。
- 8-bit 页任务：看 8-bit cluster 是否更多由 `/converter/8-bit-art-generator/` 承接，排名和点击是否改善。
- 保护项：看点击和排名是否稳定，不追求短期大涨。

### 11.8 阶段总审查结论

当前结论：

- `3.2` 到 `3.7` 的问题讨论阶段通过。
- 阶段总审查已完成。
- 后续执行清单草案、批次 A 任务拆解、批次 A 本地执行也已完成。
- 当前下一步以第 10 节为准：审评批次 A-UI 代码改动，再决定是否提交和部署。

## 12. 执行清单草案（已审评通过）

本节是已审评通过的执行清单草案，用来拆分批次。

本节已用于批次 A 执行；当前执行记录见第 15 节。

### 12.1 执行总原则

执行时要遵守这些规则：

1. 每次只改一类问题。
2. 首页、photo 页、8-bit 页不能同一批大改。
3. 不能只改 title/meta，必须同时看页面真实内容、H1、首屏、FAQ、内链。
4. 每批上线后看完整 `14` 到 `28` 天 GSC 数据。
5. 不看当天数据下结论。
6. 表现好的页面只保护，不大改。
7. 草案通过后，才把具体代码任务拆到文件级。

### 12.2 批次总览

| 批次 | 类型 | 对象 | 目的 | 状态 |
| --- | --- | --- | --- | --- |
| A | 第一优先 | `/converter/photo-to-pixel-art/` | 解决 photo / picture 承接错位 | 草案候选 |
| B | 第一优先 | `/converter/8-bit-art-generator/` | 解决 8-bit cluster 承接和排名弱 | 草案候选 |
| C | 第一优先 | 首页 `/` | 优化 `maker / generator` 点击理由，同时保护 `converter` | 草案候选 |
| D | 第二优先 | `/converter/image-to-pixel-art/` | 重新定义长尾 converter 角色 | 后续候选 |
| E | 第二优先 | PNG / JPG / pixelate 页 | 轻增强或观察 | 后续候选 |
| F | 诊断项 | 多语言弱项、博客、hash URL | 先查，不直接改 | 观察 / 诊断 |

建议先做 A，再看数据；不要 A、B、C 一起上线。

### 12.3 批次 A：`/converter/photo-to-pixel-art/`

目标：

- 让 Google 更清楚它是“照片 / 图片转像素图”的专项页。
- 让 `photo to pixel art`、`picture to pixel art`、`photo to pixel`、`picture to pixel` 逐步由该页承接。

当前基线：

| Query | 当前主要页面 | 目标页面 | 点击 | 曝光 | CTR | 排名 |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| `photo to pixel art` | `/` | `/converter/photo-to-pixel-art/` | 134 | 6,153 | 2.18% | 13.01 |
| `picture to pixel art` | `/` | `/converter/photo-to-pixel-art/` | 184 | 6,063 | 3.03% | 10.19 |
| `photo to pixel` | `/` | `/converter/photo-to-pixel-art/` | 113 | 1,509 | 7.49% | 5.95 |
| `picture to pixel` | `/` | `/converter/photo-to-pixel-art/` | 31 | 1,273 | 2.44% | 9.57 |

草案动作方向：

- 强化 title / H1 / 首屏文案里的 photo、picture 语义。
- 页面正文增加照片场景说明，但不把 `portrait`、`avatar`、`pet photo` 当第一批主关键词。
- FAQ 围绕照片上传、图片转像素、照片效果控制来写。
- 首页用明确锚文本指向该页，例如 `Photo to Pixel Art`。
- 该页反向链接首页时，锚文本区分为 `Image to Pixel Art Converter`。

不能做：

- 不把该页写成泛泛的 image-to-pixel 页面。
- 不让它抢首页的 `image to pixel art` 主词。
- 不同时大改首页。

验收：

- 完整 `14` 到 `28` 天后看目标 query 的主要展示页面是否逐步变成 `/converter/photo-to-pixel-art/`。
- CTR 和点击不应继续明显下降。
- 首页核心词 `image to pixel art`、`pixel art converter` 不应明显受伤。

### 12.4 批次 B：`/converter/8-bit-art-generator/`

目标：

- 让 8-bit 相关 query 更稳定地由 `/converter/8-bit-art-generator/` 承接。
- 把它从泛 pixel art 页面里分出来。

当前基线：

| Query | 当前主要页面 | 目标页面 | 点击 | 曝光 | CTR | 排名 |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| `8 bit art generator` | `/` | `/converter/8-bit-art-generator/` | 1 | 37 | 2.70% | 21.65 |
| `8 bit image converter` | `/converter/image-to-pixel-art/` | `/converter/8-bit-art-generator/` | 12 | 295 | 4.07% | 10.91 |
| `8 bit maker` | `/converter/8-bit-art-generator/` | `/converter/8-bit-art-generator/` | 16 | 397 | 4.03% | 12.43 |
| `image to 8 bit` | `/converter/image-to-pixel-art/` | `/converter/8-bit-art-generator/` | 9 | 154 | 5.84% | 11.60 |

草案动作方向：

- 页面定位围绕 8-bit 风格转换。
- 强化 `8 bit maker`、`image to 8 bit`、`8-bit art maker`、`8 bit image converter` 这组词。
- 从首页和 `/converter/image-to-pixel-art/` 用明确锚文本导向该页。
- FAQ 解释 8-bit 风格和普通 pixel art 的区别。

不能做：

- 不写成 AI 生成器。
- 不抢首页的 `pixel art generator` 主词。
- 不同时重写 `/converter/image-to-pixel-art/`。

验收：

- 8-bit cluster 更多 query 由 `/converter/8-bit-art-generator/` 承接。
- 平均排名接近或进入第一页。
- 点击和曝光不下降。

### 12.5 批次 C：首页 `maker / generator` 点击理由

目标：

- 提升首页在 `pixel art maker`、`pixel art generator` 上的点击吸引力。
- 同时保护 `image to pixel art`、`pixel art converter`。

当前基线：

| Query | 当前页面 | 点击 | 曝光 | CTR | 排名 |
| --- | --- | ---: | ---: | ---: | ---: |
| `pixel art maker` | `/` | 361 | 16,610 | 2.17% | 10.58 |
| `pixel art generator` | `/` | 299 | 13,840 | 2.16% | 10.82 |
| `pixel art converter` | `/` | 506 | 15,291 | 3.31% | 8.05 |
| `image to pixel art` | `/` | 1,814 | 48,637 | 3.73% | 6.94 |

草案动作方向：

- 保守优化首页 title / meta / 首屏点击理由。
- 明确免费、在线、上传图片、转换成像素图等真实功能。
- 不把页面写成不存在的 AI 生成器。
- 首页增加清楚的专项入口：Photo、PNG、GIF、8-bit 等。

不能做：

- 不削弱 `image to pixel art` 和 `pixel art converter`。
- 不承诺不存在的 AI 生成能力。
- 不和 photo 页、8-bit 页同批大改。

验收：

- `pixel art maker`、`pixel art generator` 完整 `14` 到 `28` 天 CTR 有改善。
- `image to pixel art`、`pixel art converter` 点击和排名不明显下降。

### 12.6 批次 D：`/converter/image-to-pixel-art/` 角色重定义

目标：

- 让它从“和首页抢主词”变成“长尾 converter 说明页”。

草案动作方向：

- 目标词暂定为 `image to pixel art converter`、`convert image to pixel art`、`online image to pixel art converter`。
- 明确它和首页的区别。
- 不抢首页的 `image to pixel art` 主词。
- 是否执行，要等 A、B、C 后再判断。

状态：

- 第二批候选。
- 不进入第一批。

### 12.7 批次 E：轻增强候选

| 页面 | 草案方向 | 当前状态 |
| --- | --- | --- |
| `/converter/png-to-pixel-art/` | 轻增强 PNG 场景和内链 | P2 |
| `/converter/jpg-to-pixel-art/` | 轻增强 JPG 场景，避免泛词重叠 | P2 |
| `/converter/pixelate-image-online/` | 先观察，再判断是否增强 | P2 / P3 |

执行边界：

- 不和第一批混在一起。
- 不大改。
- 不影响 GIF、sprite 保护页。

### 12.8 诊断项和观察项

| 对象 | 草案动作 | 是否进代码 |
| --- | --- | --- |
| `/blog/` | 观察，不优先改 | 否 |
| `/blog/how-to-pixelate-an-image/` | 判断独立教程价值 | 暂不进 |
| `/de/`、`/fr/` | 查 query、页面、翻译质量 | 先诊断 |
| `/ko/`、`/pt/`、`/es/` | 有量但不强，先诊断 | 先诊断 |
| 小样本语言页 | 观察 | 否 |
| GSC hash URL | 报表归类或合并回首页 | 否 |

### 12.9 保护清单

这些对象进入执行阶段时要特别避免误伤：

- `/converter/gif-to-pixel-art/`
- `/converter/photo-to-sprite-converter/`
- `/ru/`
- `/it/`
- `/vi/`
- `/id/`
- `/ja/`
- 首页 `image to pixel art`
- 首页 `pixel art converter`

保护规则：

- 不大改。
- 不和试验任务混在一起。
- 改之前记录完整 28 天基线。

### 12.10 草案结论

当前草案结论：

1. 执行清单草案已审评通过。
2. 第一批只选一个方向进入代码任务：`/converter/photo-to-pixel-art/`。
3. 批次 A 任务拆解已补完成。
4. 完成一批后观察完整 `14` 到 `28` 天，再决定下一批。

批次 A 已按本草案执行并完成代码审评。批次 A-UI 也已本地执行，当前下一步是审评 UI 代码改动。

## 13. 执行清单草案审评

审评对象：第 12 节执行清单草案。

### 13.1 审评结论

结论：

- 执行清单草案通过。
- 可以进入批次 A 的具体代码任务拆解。
- 批次 A 后续已完成本地执行，见第 15 节。

通过理由：

- 批次已经拆开，没有把首页、photo 页、8-bit 页混在同一批。
- 第一批建议从 `/converter/photo-to-pixel-art/` 开始，符合前面讨论的 P1-1 顺序。
- 保护项写得清楚，避免误伤 GIF、sprite、强势多语言页和首页核心词。
- 观察项没有混进第一批。
- 验收指标已经按目标 query 和目标页面写出来。

需要注意：

- 批次 A 只能做 photo 页，不顺手大改首页。
- 首页最多做明确入口或锚文本调整，不能同时重写首页 title、首屏或 `maker/generator`。
- 如果代码任务拆解发现需要组件能力支持，要先写清楚“为什么要动组件”，不能为了文案改动重构页面。

### 13.2 下一步

当前状态：

- 批次 A：`/converter/photo-to-pixel-art/` 具体代码任务拆解草案已完成。
- 批次 A 后续已完成本地执行，见第 15 节。

当前仍未提交，未部署。

## 14. 批次 A 代码任务拆解草案（执行安全补强版）

本节是批次 A 的代码任务拆解，已用于本地执行。

当前状态：

- 批次 A 任务拆解：已通过。
- 本节已补执行安全边界。
- 批次 A 后续已完成本地执行，见第 15 节。

目标页面：`/converter/photo-to-pixel-art/`

目标 query：

- `photo to pixel art`
- `picture to pixel art`
- `photo to pixel`
- `picture to pixel`

### 14.1 目标和边界

目标：

- 让 `/converter/photo-to-pixel-art/` 更像一个照片 / 图片专项页。
- 让 Google 更容易把 photo / picture cluster 分配给该页。
- 保持首页 `/` 的 `image to pixel art`、`pixel art converter` 不受伤。

边界：

- 不改首页主 title / meta / H1。
- 不改首页 hero、主描述、主 CTA。
- 不改首页 `maker`、`generator`、`converter` 相关核心文案。
- 首页本批次最多只允许修改 photo 专项入口锚文本或工具卡片文字，例如 `Photo to Pixel Art`。
- 不改 `/converter/8-bit-art-generator/`。
- 不改 `/converter/image-to-pixel-art/` 的角色。
- 不批量改其他 pSEO 页面。
- 不改多语言页面。
- 不改博客。
- 不做不存在的 AI 功能承诺。

### 14.2 涉及文件

主要文件：

| 文件 | 用途 | 批次 A 是否需要 |
| --- | --- | --- |
| `src/content/pseo-pages.en.json` | pSEO 页面内容源，包含 photo 页 title、meta、H1、intro、callout | 必改 |
| `src/components/PseoPage.jsx` | pSEO 页面渲染组件，目前支持 intro、topCallout、bottomCallout、通用 FAQ | 只有必要时最小改 |
| `scripts/build/prerender-spa.cjs` | 生产环境预渲染 HTML，独立渲染 pSEO 可见内容 | 如果新增字段，必须同步 |
| `src/locales/en.json` | 首页英文运行时文案，包括首页工具卡片 | 最多只改 photo 入口卡片 |
| `public/locales/en/translation.json` | 首页英文静态加载文案，需要和 `src/locales/en.json` 同步 | 最多只改 photo 入口卡片 |

组件改动条件：

- 优先只改 `src/content/pseo-pages.en.json`。
- 只有现有字段无法表达 photo 页独特 section、步骤、FAQ、场景时，才允许最小改动 `PseoPage.jsx`。
- 如果改 `PseoPage.jsx`，只能新增通用可选字段渲染能力，不能重构整个 pSEO 页面。
- 如果新增字段，`scripts/build/prerender-spa.cjs` 必须同步。

暂不改：

| 文件 / 区域 | 原因 |
| --- | --- |
| 其他 `public/locales/*/translation.json` | 批次 A 不做多语言 |
| 其他 `src/content/pseo-pages.*.json` | 批次 A 先只做英文主页面 |
| `src/components/Footer.jsx` | 当前已有 photo 页链接，不先动 |
| `/converter/image-to-pixel-art/` 内容 | 角色重定义属于批次 D |
| 首页主 SEO 文案 | 首页属于批次 C |

### 14.3 内容任务

任务 A1：改 photo 页 SEO 和首屏语义。

位置：

- `src/content/pseo-pages.en.json`
- `slug: photo-to-pixel-art`

需要调整：

- `title`
- `metaDescription`
- `h1`
- `intro`
- `toolHeading`
- `toolSubtitle`
- `toolSubtitle2`

内容模块清单：

- title
- meta description
- H1
- intro
- top callout
- how-to / settings tips
- photo-specific use cases
- FAQ
- internal links

写法方向：

- 明确 `Photo to Pixel Art` 和 `Picture to Pixel Art`。
- 强调照片、图片、camera photo、portrait/scenery 这类真实场景。
- 不把页面写成泛 image-to-pixel 页面。
- 不承诺 AI 生成。

任务 A2：增强 photo 页正文。

当前问题：

- `PseoPage.jsx` 对非主 converter 页主要渲染 `intro`、工具区、top/bottom callout、通用 HowItWorks、通用 FAQ。
- 如果只加长 `intro`，页面结构可能还是偏薄。

拆解选择：

1. 保守做法：先只扩展 `intro`、`topCallout`、`bottomCallout`，不改组件。
2. 稳一点做法：给 pSEO 内容增加可选 `sections` 或 `tips` 字段，再让 `PseoPage.jsx` 渲染。

建议：

- 优先采用第 2 种，但只做小能力，不做大组件重构。
- 字段只服务 pSEO 页面，不影响首页。
- 如果加字段，`scripts/build/prerender-spa.cjs` 必须同步渲染，避免生产 HTML 和客户端内容不一致。

任务 A3：增加 photo 专项 FAQ。

当前情况：

- `PseoPage.jsx` 现在使用通用 `t('faq.items')`。
- 这会让 photo 页 FAQ 不够专项。

建议：

- 给 `photo-to-pixel-art` 增加可选页面级 FAQ 字段。
- `PseoPage.jsx` 优先使用页面级 FAQ；没有时再 fallback 到通用 FAQ。
- `buildFaqJsonLd` 也要用同一组 FAQ。
- `scripts/build/prerender-spa.cjs` 同步渲染页面级 FAQ。
- FAQ JSON-LD 里的问题和答案必须在页面可见内容中出现，不能只写在结构化数据里。

FAQ 方向：

- photo 和 picture 有什么区别。
- 什么照片适合转成像素图。
- 如何让人像、风景、宠物照片更清楚。
- 能否免费在线使用。
- 是否需要上传到服务器。

注意：

- `portrait`、`avatar`、`pet photo` 只能作为场景，不作为第一批主关键词。

### 14.4 内链任务

任务 A4：首页入口轻调整。

涉及文件：

- `src/components/HomeBelowFold.jsx`
- `src/locales/en.json`
- `public/locales/en/translation.json`
- 可能涉及 `scripts/build/prerender-spa.cjs` 的首页预渲染显示

当前情况：

- 首页已经有 `to: '/converter/photo-to-pixel-art/'`。
- 英文卡片标题当前是 `Photo Pixel Converter`，不够贴合目标 query。

建议：

- 把首页卡片锚文本调整为更清楚的 `Photo to Pixel Art`。
- 描述里自然带 `picture` 或 `photo`，但不堆词。
- 不改首页主 title / H1 / hero。
- 不改首页主描述、主 CTA。
- 不改首页 `maker`、`generator`、`converter` 相关核心文案。

任务 A5：photo 页回链首页要区分。

当前情况：

- `topCallout` 和 `bottomCallout` 都指向 `/converter/image-to-pixel-art/`。

建议：

- 保留回到主 converter 的链接。
- 锚文本区分为 `Image to Pixel Art Converter` 或类似表达。
- 不用泛泛的 `Learn more`。

### 14.5 预渲染和结构化数据任务

任务 A6：同步预渲染。

原因：

- 本项目 SEO 靠 prerender 输出静态 HTML。
- `PseoPage.jsx` 和 `scripts/build/prerender-spa.cjs` 是两套渲染路径。
- 如果新增页面级 `sections` 或 FAQ，只改 React 组件不够。

要求：

- `scripts/build/prerender-spa.cjs` 的 `renderPseoVisible` 要同步输出新增内容。
- 如果 FAQ 改为页面级，预渲染的 FAQ HTML 也要同步。
- 构建后检查 `dist/converter/photo-to-pixel-art/index.html`。

任务 A7：结构化数据同步。

要求：

- 页面级 FAQ 如果存在，要进入 FAQ JSON-LD。
- HowTo / SoftwareApplication 不做大改。
- canonical 保持 `https://pixelartvillage.org/converter/photo-to-pixel-art/`。

### 14.6 验收任务

代码前基线：

| Query | 当前主要页面 | 目标页面 | 点击 | 曝光 | CTR | 排名 | 用途 |
| --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| `photo to pixel art` | `/` | `/converter/photo-to-pixel-art/` | 134 | 6,153 | 2.18% | 13.01 | 目标词 |
| `picture to pixel art` | `/` | `/converter/photo-to-pixel-art/` | 184 | 6,063 | 3.03% | 10.19 | 目标词 |
| `photo to pixel` | `/` | `/converter/photo-to-pixel-art/` | 113 | 1,509 | 7.49% | 5.95 | 目标词 |
| `picture to pixel` | `/` | `/converter/photo-to-pixel-art/` | 31 | 1,273 | 2.44% | 9.57 | 目标词 |
| `image to pixel art` | `/` | `/` | 1,814 | 48,637 | 3.73% | 6.94 | 首页保护词 |
| `pixel art converter` | `/` | `/` | 506 | 15,291 | 3.31% | 8.05 | 首页保护词 |

本地验收：

- `npm run build`
- `npm run verify:dist`
- 必要时跑 `npm run lint`

产物检查：

- `dist/converter/photo-to-pixel-art/index.html` 存在。
- HTML 里有新的 title。
- HTML 里有新的 meta description。
- HTML 里有新的 H1。
- HTML 里能看到 photo / picture 相关正文。
- canonical 仍然正确。
- FAQ JSON-LD 不为空且内容和页面一致。

页面检查：

- 打开 `/converter/photo-to-pixel-art/`。
- 确认页面不是泛泛 image-to-pixel。
- 确认没有 AI 生成承诺。
- 确认首页仍能正常进入 photo 页。
- 确认 `/converter/gif-to-pixel-art/`、`/converter/photo-to-sprite-converter/` 没被改动。

上线后 GSC 验收：

- 等 Google 重新抓取。
- 看完整 `14` 到 `28` 天窗口。
- 重点看：
  - `photo to pixel art`
  - `picture to pixel art`
  - `photo to pixel`
  - `picture to pixel`
- 目标是主要展示页逐步从 `/` 转向 `/converter/photo-to-pixel-art/`。
- 同时检查首页 `image to pixel art` 和 `pixel art converter` 没明显下降。

失败 / 回滚判断：

- 如果首页核心词 `image to pixel art` / `pixel art converter` 在完整 28 天窗口明显下滑，先暂停下一批改动。
- 如果 photo cluster 没有转向目标页，但首页未受伤，先观察一个完整周期，不立刻回滚。
- 如果目标页排名、曝光、点击同时下降，再检查 title / H1 / 内容是否过度收窄。
- 如果 `/converter/photo-to-pixel-art/` 曝光上涨但 CTR 短期下降，先看 query 是否变宽，不马上回滚。
- 如果 Google 仍然主要展示首页，下一步优先检查内链和页面语义，不直接扩大到首页大改。

### 14.7 不进入本批次的任务

本批次不做：

- 首页主 title / meta / H1 优化。
- `pixel art maker` / `pixel art generator` 首页点击理由优化。
- `/converter/8-bit-art-generator/`。
- `/converter/image-to-pixel-art/` 角色重定义。
- PNG / JPG / pixelate 页轻增强。
- 多语言页。
- 博客页。
- GSC hash URL 处理。

### 14.8 批次 A 拆解结论

结论：

- 批次 A 任务拆解已通过。
- 执行安全补强已补。
- 已按本拆解进入批次 A 代码执行。
- 执行记录见第 15 节。

建议第一步代码任务：

1. 先改 `src/content/pseo-pages.en.json` 的 photo 页内容。
2. 只有内容字段不够时，才最小改 `PseoPage.jsx` 支持页面级 section / FAQ。
3. 如改组件，必须同步 `scripts/build/prerender-spa.cjs`。
4. 最后最多轻改首页 photo 卡片锚文本。

PR 边界：

- PR 名称建议：`Batch A - Photo to Pixel Art page semantic enhancement`
- PR 只允许包含批次 A 相关文件。
- 不允许混入首页 hero、8-bit、image-to-pixel、多语言、博客改动。
- 不允许顺手重构无关组件。

## 15. 批次 A 执行记录

执行对象：`/converter/photo-to-pixel-art/`

执行状态：

- 已完成本地代码改动。
- 已完成本地验证。
- 尚未提交。
- 尚未部署。

本批次实际改动：

| 文件 | 改动 |
| --- | --- |
| `src/content/pseo-pages.en.json` | 强化 photo / picture 语义，补 title、meta、intro、photo 步骤、photo 场景、设置建议、页面级 FAQ |
| `src/components/PseoPage.jsx` | 最小支持页面级内容段、页面级 how-to、页面级 FAQ，并让 FAQ JSON-LD 使用同一批可见 FAQ |
| `scripts/build/prerender-spa.cjs` | 同步预渲染，让静态 HTML 也输出 photo 专项内容、how-to 步骤和 FAQ JSON-LD |
| `src/locales/en.json` | 首页 photo 入口卡片锚文本从 `Photo Pixel Converter` 改成 `Photo to Pixel Art` |
| `public/locales/en/translation.json` | 同步首页 photo 入口卡片英文文案 |
| `public/pseo-og/photo-to-pixel-art.png` | 因 photo 页 title 改动，构建时重新生成对应 OG 图 |

本批次没有改：

- 首页 hero。
- 首页主 title / meta / H1。
- 首页主 CTA。
- 首页 `maker` / `generator` / `converter` 核心文案。
- `/converter/8-bit-art-generator/`。
- `/converter/image-to-pixel-art/`。
- 多语言页。
- 博客页。
- GSC hash URL。

本地验证：

| 检查项 | 结果 |
| --- | --- |
| `npm run build` | 通过 |
| `npm run verify:dist` | 通过 |
| `npm run lint` | 通过 |
| `npm run i18n:check` | 退出码为 0；仍有历史多语言缺失 / extra 提示，本批次不处理 |
| `dist/converter/photo-to-pixel-art/index.html` title | 已变成 `Photo to Pixel Art Converter | Pixelate a Photo Online` |
| canonical | 仍为 `https://pixelartvillage.org/converter/photo-to-pixel-art/` |
| 页面可见内容 | 已能看到 photo / picture、photo 场景、photo 设置建议 |
| HowTo JSON-LD | 已使用 photo 专项步骤 |
| FAQ JSON-LD | 已输出，且问答也在页面可见内容中出现 |

上线后观察：

- 等 Google 重新抓取。
- 看完整 `14` 到 `28` 天窗口。
- 重点看 `photo to pixel art`、`picture to pixel art`、`photo to pixel`、`picture to pixel` 是否逐步由 `/converter/photo-to-pixel-art/` 承接。
- 同时保护首页 `image to pixel art` 和 `pixel art converter`，不能只看 photo 页上涨。

## 16. 批次 A 代码审评

审评结论：

- 通过。
- 没有发现必须回修的问题。
- 可以进入提交 / 部署决策。

审评检查：

| 检查项 | 结果 |
| --- | --- |
| 是否只围绕 `/converter/photo-to-pixel-art/` | 通过 |
| 是否误改首页 hero / title / meta / H1 | 未发现 |
| 是否误改 `maker` / `generator` / `converter` 首页核心文案 | 未发现 |
| 是否误改 8-bit、image-to-pixel、多语言、博客、hash URL | 未发现 |
| photo 页 title / meta / H1 是否更贴近 photo / picture | 通过 |
| 页面可见 FAQ 和 FAQ JSON-LD 是否一致 | 通过 |
| 静态 HTML 是否有 photo 专项内容 | 通过 |
| 首页 photo 入口是否只做轻改 | 通过 |
| 构建和验证命令 | 已通过 |

本轮保留的注意事项：

- `npm run i18n:check` 退出码为 0，但输出里仍有历史多语言缺失 / extra 提示；这不是批次 A 引入的问题。
- `docs/COMPETITOR_GAP_PRIORITY_2026-03-30.md` 是既有未提交改动，本批次没有处理。
- 当前仍未提交，未部署。

下一步：

- 先审评第 18 节批次 A-UI 执行记录和当前 UI 代码改动。
- 如果通过，再决定是否提交和部署。
- 后续提交时，不应把 `docs/COMPETITOR_GAP_PRIORITY_2026-03-30.md` 混进本次提交。
- 部署前再跑一次 `npm run build` 和 `npm run verify:dist`。

## 17. 批次 A-UI 布局执行方案

本节记录 image2 最终底稿和 Product Design 审评后的 UI 执行方案。

当前状态：

- 本节是布局执行方案。
- 后续已按本节进入 UI 代码执行。
- 执行记录见第 18 节。
- 当前仍尚未提交，尚未部署。

底稿来源：

- 最终底稿文件：`/Users/elng/.codex/generated_images/019e9b6d-a5a1-7e03-a153-83c3e62bf96e/ig_051d1497ee6fe181016a24314af1c08191afd1d554a5101d5b.png`
- Product Design 审评结论：通过，可以作为实现目标。

### 17.1 这次 UI 改版要解决什么

当前页面的问题：

- 首屏太像说明文章，工具上传入口不够靠前。
- 页面先讲了很多文字，用户要往下看才看到真正能用的工具。
- 顶部说明、蓝色提示框、工具区标题都在抢注意力。
- 上传框存在，但视觉上不够像页面主角。
- FAQ、相关 converter、footer 可以更短、更干净。

这次目标：

- 让 `/converter/photo-to-pixel-art/` 变成“工具优先”的页面。
- 用户第一屏就能看到上传照片的入口。
- 保留 photo / picture SEO 内容，不删掉已经补好的语义。
- FAQ 必须可见，不做默认隐藏。
- 不削弱首页 `image to pixel art` 和 `pixel art converter`。
- 不动其他批次页面。

### 17.2 桌面端布局方向

桌面端采用两栏首屏。

左侧：

- H1：继续突出 `Photo to Pixel Art Converter`。
- 一句话说明：强调照片、头像、宠物照、风景照转像素图。
- 三个短卖点：例如 photo-first、private in browser、clean pixel output。
- 一个轻链接：引导非照片用户去 main image to pixel art converter。

右侧：

- 上传面板放在首屏。
- 上传按钮是最明显的行动入口。
- 拖拽文案不要和按钮重复。
- 可以保留一个安全的抽象预览占位，不放真人、宠物、评分、头像等假素材。

首屏之后：

1. `Best photos for this converter`
   - 三张轻卡片。
   - 只写 portraits/profile pictures、pet photos、scenery/objects。

2. `Photo settings that usually work best`
   - 用更短的建议列表。
   - 重点讲 pixel size、palette、contrast/crop。

3. `How to turn a photo into pixel art`
   - 三步即可。
   - 不加复杂箭头。
   - 内容继续围绕 photo，而不是泛泛 image。

4. FAQ
   - 只保留短问题。
   - 必须页面可见。
   - 不做默认折叠。

5. Related converters
   - 只保留 3 个相关入口。
   - 优先：Image to Pixel Art Converter、PNG to Pixel Art、JPG to Pixel Art。

6. Footer
   - 本批次不做全站 footer 大改。
   - 如果页面底部显得太重，优先先收紧本页上方内容，不先重写全局 footer。

### 17.3 手机端布局顺序

手机端不能照搬桌面两栏。

顺序必须是：

1. H1。
2. 上传面板。
3. 三个短卖点。
4. main converter 轻链接。
5. Best photos。
6. Photo settings。
7. How-to。
8. FAQ。
9. Related converters。
10. Footer。

手机端重点：

- 上传按钮必须在第一屏附近。
- 文字要短。
- 卡片不要堆太厚。
- 不让用户先看一整屏说明文字。

### 17.4 本批次允许改什么

优先允许：

- `src/components/PseoPage.jsx`
- `scripts/build/prerender-spa.cjs`

视情况允许：

- `src/content/pseo-pages.en.json`
  - 只在需要轻微调整文案顺序或新增布局字段时改。
  - 不重新推翻已经完成的 photo SEO 内容。

可选：

- 如果 `PseoPage.jsx` 变得太大，可以新增一个小组件。
- 新组件必须只服务 photo 页布局，不做全站重构。

推荐实现方式：

- 用 `slug === 'photo-to-pixel-art'` 或明确的 `layoutVariant` 控制新布局。
- 不要让所有 pSEO 页面一起换成这个布局。
- 如果静态 HTML 输出受影响，必须同步 `scripts/build/prerender-spa.cjs`。

### 17.5 本批次禁止改什么

禁止：

- 不改首页 hero。
- 不改首页 title / meta / H1。
- 不改首页主 CTA。
- 不改首页 `maker` / `generator` / `converter` 核心文案。
- 不改 `/converter/8-bit-art-generator/`。
- 不改 `/converter/image-to-pixel-art/`。
- 不改多语言页。
- 不改博客页。
- 不处理 hash URL。
- 不全局重写 footer。
- 不顺手重构无关组件。
- 不放假用户、假评分、假头像、假评价。
- 不使用未授权真实照片。
- 不把 FAQ 只写进 JSON-LD，页面上必须看得到。

### 17.6 执行顺序

1. 先在 `PseoPage.jsx` 做 photo 页专属布局入口。
2. 把上传面板移动到首屏右侧。
3. 保留现有上传功能，不重写上传逻辑。
4. 调整 photo 页内容模块顺序。
5. 保持 FAQ 页面可见，并继续和 FAQ JSON-LD 一致。
6. Related converters 收紧到 3 个。
7. 同步预渲染脚本。
8. 跑构建、验证、lint。
9. 本地预览桌面和手机宽度。

### 17.7 验收标准

本地命令：

- `npm run build`
- `npm run verify:dist`
- `npm run lint`

产物检查：

- `dist/converter/photo-to-pixel-art/index.html` 里仍有正确 title。
- canonical 仍是 `https://pixelartvillage.org/converter/photo-to-pixel-art/`。
- 页面静态 HTML 里能看到 photo / picture 相关内容。
- FAQ 页面可见。
- FAQ JSON-LD 和页面可见 FAQ 一致。
- HowTo JSON-LD 仍然围绕 photo。

视觉检查：

- 桌面首屏能看到上传面板。
- 手机首屏附近能看到上传按钮。
- 页面不像长说明文，工具入口更突出。
- Related converters 只显示 3 个。
- footer 没有被本批次大改。

SEO 保护检查：

- 首页核心词不在本批次改动范围内。
- 不改首页主标题、主描述、主 CTA。
- 不把 photo 页写成泛 `image to pixel art` 页面。
- 不把 photo 页写成不存在的 AI generator 功能。

### 17.8 风险和回滚判断

主要风险：

- 如果布局改得太通用，可能误伤所有 pSEO 页面。
- 如果把上传逻辑重写，可能引入功能问题。
- 如果删掉可见 SEO 内容，可能影响收录和理解。
- 如果 FAQ 变成默认隐藏，可能削弱页面可读内容。

回滚判断：

- 如果上传功能出问题，优先回滚 UI 布局改动。
- 如果静态 HTML 丢失 photo 内容，必须回修，不进入提交。
- 如果 FAQ JSON-LD 和页面可见内容不一致，必须回修。
- 如果改动影响其他 converter 页面，必须收窄到 photo 页。

### 17.9 本节结论

- Product Design 最终底稿可以作为 UI 实现目标。
- 本节方案已用于批次 A-UI 代码执行。
- 代码执行仍然只围绕 `/converter/photo-to-pixel-art/`。
- 执行结果见第 18 节。

## 18. 批次 A-UI 执行记录

执行结论：

- 已完成本地 UI 改版。
- 尚未提交。
- 尚未部署。

本次实际改动：

| 文件 | 作用 |
| --- | --- |
| `src/components/PseoPage.jsx` | 给英文 `/converter/photo-to-pixel-art/` 加专属工具优先布局 |
| `src/components/ToolSection.jsx` | 给上传区增加可选布局参数，默认行为不变 |
| `scripts/build/prerender-spa.cjs` | 同步 photo 页预渲染兜底 HTML |

本次没有做：

- 没有改首页 hero / title / meta / H1。
- 没有改首页 `maker` / `generator` / `converter` 核心文案。
- 没有改 `/converter/8-bit-art-generator/`。
- 没有改 `/converter/image-to-pixel-art/`。
- 没有改多语言页。
- 没有改博客页。
- 没有全局重写 footer。
- 没有处理 hash URL。

布局结果：

- 桌面端首屏改成两栏。
- 左侧保留 H1、photo 说明、三个短卖点和 main converter 轻链接。
- 右侧首屏直接显示上传框。
- 桌面端保留安全的抽象预览占位，不使用真人、宠物或未授权图片。
- 手机端顺序改为：H1 -> 上传框 -> 三个卖点 -> main converter 链接 -> 后续内容。
- FAQ 保持页面可见，不做默认折叠。
- Related converters 收紧为 3 个：`image-to-pixel-art`、`png-to-pixel-art`、`jpg-to-pixel-art`。

验证记录：

| 检查项 | 结果 |
| --- | --- |
| `node --check scripts/build/prerender-spa.cjs` | 通过 |
| `npm run lint` | 通过 |
| `npm run build` | 通过 |
| `npm run verify:dist` | 通过 |
| `dist/converter/photo-to-pixel-art/index.html` title | 正确 |
| canonical | 仍是 `https://pixelartvillage.org/converter/photo-to-pixel-art/` |
| HowTo JSON-LD | 仍围绕 photo 专项步骤 |
| FAQ JSON-LD | 仍输出，且页面有可见 FAQ |
| Related converters | 页面主相关区只保留 3 个 |

视觉检查记录：

| 检查项 | 结果 |
| --- | --- |
| 桌面上传区 | `top = 240px`，在首屏内 |
| 手机上传区 | `top = 252px`，在首屏内 |
| 手机顺序 | H1 后紧接上传区，上传区后显示卖点卡 |
| FAQ | DOM 中可见 |
| title / canonical | 正确 |

注意事项：

- 构建脚本会刷新 `public/sitemap.xml` 和 `public/sitemap-hreflang-reference.xml` 的日期；本次已恢复，避免把 sitemap 日期噪音混进提交。
- `docs/COMPETITOR_GAP_PRIORITY_2026-03-30.md` 是既有未提交改动，本批次没有处理。
- 当前仍需人工审评 UI 代码改动，通过后再决定是否提交和部署。

## 19. 批次 A 关键词密度和标题结构微调记录

执行结论：

- 已完成本地微调。
- 尚未提交。
- 尚未部署。

本次讨论后确认的关键词目标：

| 类型 | 关键词 | 处理 |
| --- | --- | --- |
| 主核心词 | `photo to pixel art` | 保持，不继续堆 |
| 并列核心词 | `picture to pixel art` | 从几乎没有补到少量出现 |
| 次要词 | `photo to pixel`、`picture to pixel` | 跟随主词自然出现 |
| 首页保护词 | `image to pixel art`、`pixel art converter` | 不继续增加 |
| 不做词 | `pixel art maker`、`pixel art generator` | 本页不抢 |

本次实际改动：

| 文件 | 作用 |
| --- | --- |
| `src/content/pseo-pages.en.json` | 给 photo 页补少量 `picture to pixel art` 语义 |
| `src/components/ToolSection.jsx` | 增加可选 `instructionElement`，默认仍是 H2 |
| `src/components/PseoPage.jsx` | photo 页上传提示改为普通文字；hero 小卡片标题改为普通文字；正文顺序调整为 Explore 再 FAQ |
| `scripts/build/prerender-spa.cjs` | 同步 photo 页预渲染 HTML |

构建后关键词检查：

| 关键词 | 次数 | 密度 | 判断 |
| --- | ---: | ---: | --- |
| `photo to pixel art` | 7 | 0.72% | 合格，保持 |
| `picture to pixel art` | 3 | 0.31% | 已补到轻量出现 |
| `photo to pixel art converter` | 4 | 0.41% | 合格 |
| `picture to pixel art converter` | 2 | 0.21% | 合格 |
| `pixel art maker` | 0 | 0.00% | 不抢首页词 |
| `pixel art generator` | 0 | 0.00% | 不抢首页词 |

注意：

- `pixel art` 作为双词在页面和 footer 中出现较多，本轮不为了压低它而删除全站链接。
- 本轮重点不是堆 `photo to pixel art`，而是补齐 `picture to pixel art` 这个并列核心词。

构建后标题结构：

```text
H1 Photo to Pixel Art Converter
H2 Best photos for this converter
  H3 Portraits and profile pictures
  H3 Pet photos
  H3 Scenery and objects
H2 Photo settings that usually work best
H2 How to turn a photo into pixel art
  H3 Upload a photo
  H3 Simplify the photo
  H3 Download the pixel art
H2 Explore other converters
  H3 Image to Pixel Art Converter
  H3 Convert PNG to Pixel Art Online
  H3 Convert JPG to Pixel Art Online
H2 Photo to Pixel Art FAQ
  H3 Can I turn any photo into pixel art?
  H3 What kind of photo works best for pixel art?
  H3 Is this page different from the main image to pixel art converter?
```

验证记录：

| 检查项 | 结果 |
| --- | --- |
| `node --check scripts/build/prerender-spa.cjs` | 通过 |
| `npm run lint` | 通过 |
| `npm run build` | 通过 |
| 上传提示是否仍是 H2 | 否 |
| hero 小卡片是否仍是 H2 | 否 |
| 正文 related converters | 只保留 3 个 |
| Playwright 本地页面快照 | 通过 |
| 临时截图 | 已检查，不作为提交产物保留 |

## 20. 批次 A Product Design 小修记录

执行结论：

- 已按截图审评建议完成 3 个小修。
- 尚未提交。
- 尚未部署。

本次审评后的不足：

| 问题 | 判断 |
| --- | --- |
| `Open the full image to pixel art converter` 太像主按钮 | 会抢上传动作 |
| hero 三个小卡片太碎 | 信息像装饰，不够干净 |
| 上传按钮 `Choose file` 不够明确 | 主动作不够强 |

本次实际改动：

| 文件 | 作用 |
| --- | --- |
| `src/components/PseoPage.jsx` | 把 hero 小卡片改成轻量 bullet；把 main converter 按钮改成弱文字链接 |
| `src/components/ToolSection.jsx` | 增加可选上传按钮样式参数，默认行为不变 |
| `src/content/pseo-pages.en.json` | 只把 photo 页 CTA 文案改成 `Use the main image converter` |
| `scripts/build/prerender-spa.cjs` | 同步预渲染兜底 HTML |

本次没有做：

- 没有改首页 hero / title / meta / H1。
- 没有改 `/converter/8-bit-art-generator/`。
- 没有改 `/converter/image-to-pixel-art/` 正文。
- 没有改多语言页。
- 没有改博客页。
- 没有改 footer。

构建后检查：

| 检查项 | 结果 |
| --- | --- |
| 上传按钮文案 | `Upload photo` |
| 旧强 CTA 可见文案 | 已移除 |
| 新弱 CTA 可见文案 | `Use the main image converter` |
| hero 卖点 | 已从卡片改成 bullet |
| H1/H2/H3 结构 | 未新增噪音标题 |
| `photo to pixel art` | 7 次，0.72% |
| `picture to pixel art` | 3 次，0.31% |
| `image to pixel art` | 8 次，0.83%，比上次更低 |
| `pixel art maker` / `pixel art generator` | 仍为 0 |

验证记录：

| 检查项 | 结果 |
| --- | --- |
| `node --check scripts/build/prerender-spa.cjs` | 通过 |
| `npm run lint` | 通过 |
| `npm run build` | 通过 |
| `npm run verify:dist` | 已随 build 通过 |

## 21. 批次 A 二次关键词微调记录

执行结论：

- 已完成小修。
- 本轮没有按 `2%-3%` 硬堆核心词。
- 本轮只做自然微调：少量增加 `photo to pixel art`，同时降低 `image to pixel art converter` 这类主转换器词在 photo 页里的存在感。
- 尚未提交。
- 尚未部署。

本轮判断：

| 规则 | 结论 |
| --- | --- |
| 不把 `photo to pixel art` 硬塞到 `2%-3%` | 通过 |
| 不增加 `pixel art maker` / `pixel art generator` | 通过 |
| 不继续强化首页主词 `image to pixel art` | 通过 |
| 只围绕 `/converter/photo-to-pixel-art/` | 通过 |
| 不改首页、不改 8-bit、不改博客、不改多语言 | 通过 |

本次实际改动：

| 文件 | 作用 |
| --- | --- |
| `src/content/pseo-pages.en.json` | 在 photo 页正文、callout、FAQ 里自然增加少量 `photo to pixel art`；把部分 `main image to pixel art converter` 改成 `main converter` |
| `src/components/PseoPage.jsx` | 只在 photo 页相关卡片里，把 `Image to Pixel Art Converter` 弱化显示为 `General image converter` |
| `scripts/build/prerender-spa.cjs` | 同步预渲染 HTML，保证构建后的静态页面和 React 页面一致 |

最新构建后关键词检查：

| 关键词 | 当前次数 | 当前密度 | 判断 |
| --- | ---: | ---: | --- |
| `photo to pixel art` | 9 | 0.95% | 比上一轮更强，但没有硬堆 |
| `picture to pixel art` | 3 | 0.32% | 保持轻量出现 |
| `photo to pixel` | 9 | 0.95% | 与主词同步增强 |
| `picture to pixel` | 3 | 0.32% | 保持轻量出现 |
| `image to pixel art` | 2 | 0.21% | 已明显降低，避免抢首页主词 |
| `image to pixel art converter` | 2 | 0.21% | 已明显降低 |
| `pixel art converter` | 9 | 0.95% | 主要来自页面标题、FAQ 和 footer，当前可接受 |
| `pixel art maker` | 0 | 0.00% | 不抢首页 maker 词 |
| `pixel art generator` | 0 | 0.00% | 不抢首页 generator 词 |

最新 H 标签检查：

```text
H1 Photo to Pixel Art Converter
H2 Best photos for this converter
H3 Portraits and profile pictures
H3 Pet photos
H3 Scenery and objects
H2 Photo settings that usually work best
H2 How to turn a photo into pixel art
H3 Upload a photo
H3 Simplify the photo
H3 Download the pixel art
H2 Explore other converters
H3 General image converter
H3 Convert PNG to Pixel Art Online
H3 Convert JPG to Pixel Art Online
H2 Photo to Pixel Art FAQ
H3 Can I turn any photo into pixel art?
H3 What kind of photo works best for pixel art?
H3 Is this page different from the main converter?
```

验证记录：

| 检查项 | 结果 |
| --- | --- |
| `node --check scripts/build/prerender-spa.cjs` | 通过 |
| `src/content/pseo-pages.en.json` JSON 解析 | 通过 |
| `npm run lint` | 通过 |
| `npm run build` | 通过 |
| `npm run verify:dist` | 已随 build 通过 |
| 本地页面 `http://127.0.0.1:4173/converter/photo-to-pixel-art/` | 可访问，已核对真实页面 |

## 22. 首页 Tools 导航入口执行记录

本节记录首页如何打开 `/converter/photo-to-pixel-art/` 的处理。

### 22.1 为什么要加

问题：

- 首页虽然已有工作流卡片和 footer 链接，但顶部导航没有清楚的工具入口。
- 用户从首页首屏附近不容易直接发现 `Photo to Pixel Art` 这个专项页。
- 之前批次 A 的目标是让 photo 页更明确承接 `photo / picture` 相关词，首页也需要给它一个清楚入口。

判断：

- 可以加一个轻量 `Tools` 下拉菜单。
- 这属于“导航入口增强”，不是首页主词重写。
- 不需要把 `Photo to Pixel Art` 单独做成导航主按钮，避免顶部导航变乱。

### 22.2 本次实际改动

| 文件 | 改动 |
| --- | --- |
| `src/components/Header.jsx` | 桌面端新增 `Tools` 下拉菜单，手机端汉堡菜单新增工具列表，并改用 `nav.toolLinks.*` 短导航文案 |
| `public/locales/*/translation.json` | 增加 `nav.tools` 和 `nav.toolLinks.*`，避免多语言页面顶部混英文 fallback |
| `src/locales/en.json` | 构建时同步英文导航文案 |

菜单顺序：

1. `Image to pixel art converter`
2. `Photo to pixel art`
3. `PNG to pixel art`
4. `JPG to pixel art`
5. `GIF to pixel art`
6. `8-bit art generator`
7. `Photo to sprite converter`

### 22.3 本次没有改什么

- 没有改首页 hero。
- 没有改首页 title / meta / H1。
- 没有改首页主 CTA。
- 没有改首页 `pixel art maker` / `pixel art generator` / `pixel art converter` 核心文案。
- 没有改 8-bit 页。
- 没有重写多语言页面内容；只补了顶部导航需要的短文案。
- 没有改博客页。

### 22.4 验收记录

| 检查项 | 结果 |
| --- | --- |
| 桌面端首页顶部是否出现 `Tools` | 通过 |
| 桌面端 `Tools` 是否能展开工具列表 | 通过 |
| 桌面端点击 `Photo to pixel art` 是否进入目标页 | 通过 |
| 手机端汉堡菜单是否出现 `Tools` 列表 | 通过 |
| 手机端点击 `Photo to pixel art` 是否进入目标页 | 通过 |
| 所有语言是否存在 `nav.tools` 和 `nav.toolLinks.*` | 通过 |
| `npm run lint` | 通过 |
| `npm run build` | 通过 |

### 22.5 本节结论

通过。

这次改动解决的是首页到 photo 专项页的入口问题。

后续 code review 发现不能只补英文，否则多语言页顶部会出现英文 `Tools` 或工具名 fallback。

已按建议改成专门的 `nav.toolLinks.*` 短文案，并补齐所有语言。

当前仍然保持批次 A 边界：

- 首页主词继续由首页承接。
- photo 页继续承接 `photo to pixel art` / `picture to pixel art`。
- 后续是否继续调整首页内链，要看完整 14 到 28 天 GSC 数据。

## 附录：历史审批记录

### 第三轮审批意见评审

评审对象：用户粘贴的“数据补表阶段审批结论”。

总体判断：

- 基本正确
- 可以通过“数据补表阶段”
- 可以进入 `3.2 核心词卡位问题` 的正式讨论
- 但仍然不能进入代码执行

#### 11.1 说得对的地方

1. 可以进入 `3.2` 正式讨论，这个判断对

现在已经有 Query 映射表和 URL 诊断表，不再只是凭感觉讨论。

下一步可以基于数据讨论：

- 哪些是排名问题
- 哪些是 CTR 问题
- 哪些是页面承接问题
- 哪些可能是 SERP 竞争问题

2. 识别出 P1 机会，这个对

当前最值得优先讨论的是：

- `pixel art maker`
- `pixel art generator`
- `photo to pixel art`
- `picture to pixel art`
- `/converter/8-bit-art-generator/`

这些都有曝光、排名或承接问题，值得先讨论。

3. `/converter/image-to-pixel-art/` 的角色确实有冲突

前面一边说首页负责 `image to pixel art`，一边又在 URL 表里把 `/converter/image-to-pixel-art/` 写成也负责 `image to pixel art`。

这个需要修正。

临时定义：

- 首页负责：`image to pixel art`、`pixel art converter`、`pixel art maker`、`pixel art generator`
- `/converter/image-to-pixel-art/` 更偏：`image to pixel art converter`、`convert image to pixel art`、`online image to pixel art converter`

注意：这些长尾词当前很多也还是首页在拿，所以后面仍要用 GSC 数据继续判断是否真的值得让主转换页抢。

4. `/blog/` 的优先级 P2 偏高，这个判断对

`/blog/` 是博客列表页，不是核心转化页。

它虽然 CTR 很低，但不是当前最接近增长的页面。

建议暂时改成：

- `/blog/`：P3 或观察
- `/blog/how-to-pixelate-an-image/`：单独作为收录问题讨论

5. `8-bit` 页面要按 query cluster 看，这个对

不能只看 `8 bit art generator` 一个词。

应当作为一组词讨论：

- `8 bit art generator`
- `8 bit maker`
- `image to 8 bit`
- `8-bit art maker`
- `8 bit image converter`

6. `photo-to-pixel-art` 的问题不只是“内容弱”，这个对

URL 表显示该页 Top queries 偏泛：

- `image to pixel art`
- `image to pixel`
- `pixelartvillage`

这说明它还没很好地表达照片专项语义。

后面讨论时要升级为：

- 照片语义不够明确
- photo / picture / portrait / avatar / pet photo 等场景不足
- 导致 Google 仍把它当普通 image-to-pixel 页面

7. 首页内链要更具体，这个对

后续执行清单不能只写“首页内链指向目标页”。

更具体的方向是：

- 首页增加 `Convert specific formats` 或类似模块
- 锚文本直接写 `Photo to Pixel Art`、`PNG to Pixel Art`、`GIF to Pixel Art`、`8-bit Art Generator`
- 少用泛泛的 `Learn more`、`Try it`
- 专项页反向链接回首页时，锚文本和语义要区分
- FAQ 里可以自然引出专项页，但不能堆关键词

#### 11.2 需要补充或谨慎的地方

1. `/converter/image-to-pixel-art/` 是否应该抢长尾词，还不能直接下最终结论

虽然从页面分工上看，主转换页适合承接更长尾的 converter 词。

但当前 GSC 里，很多长尾 converter 词也是首页表现更强。

所以后面要讨论：

- 是继续让首页承接所有主转换词
- 还是让 `/converter/image-to-pixel-art/` 成为更细的转换器说明页
- 如果保留两个页面，怎样避免互相抢得更乱

2. `/blog/` 降优先级是对的，但不能直接忽略

博客列表页本身不一定值得优先改。

但如果它持续抢工具词曝光又没有点击，后续要考虑：

- noindex 是否合适
- 是否弱化博客列表页对工具词的信号
- 是否通过内链把用户导回工具页

这些都先留到博客问题再讨论。

3. `8-bit` query cluster 需要补一张小表

当前文档只列了单词和页面总表现。

后面进入 pSEO 页面讨论时，最好单独补 `8-bit cluster` 小表，看每个词的当前页面、点击、曝光、排名。

4. `photo` query cluster 也需要补一张小表

建议包含：

- `photo to pixel art`
- `picture to pixel art`
- `photo to pixel`
- `picture to pixel`
- `portrait to pixel art`
- `avatar pixel art`
- `pet photo pixel art`

不是每个都有数据，但要确认真实机会在哪里。

#### 11.3 采纳结论

采纳：

- 通过数据补表阶段
- 进入 `3.2` 正式讨论
- 不进入代码执行
- 修正 `/converter/image-to-pixel-art/` 的目标词表述
- `/blog/` 暂时降到 P3 或观察
- `8-bit` 按 query cluster 讨论
- `photo-to-pixel-art` 问题升级为照片语义不明确
- 首页内链方向要写得更具体

不直接采纳：

- 不立刻决定 `/converter/image-to-pixel-art/` 一定要抢所有 converter 长尾词
- 不把 `/blog/` 完全丢掉不管
- 不在 `3.2` 讨论时直接写代码方案

#### 11.4 下一步讨论顺序

进入 `3.2` 时按这个顺序讨论：

1. `pixel art maker`：首页 CTR 问题 + 排名临界问题
2. `pixel art generator`：首页 CTR 问题 + 和 maker 的搜索意图是否重叠
3. `photo to pixel art` / `picture to pixel art`：页面承接错位 + 照片语义不足
4. `pixel art converter`：首页是小幅优化，还是先保护观察

讨论规则：

- 不直接提出代码改法
- 先归类问题
- 每个词先判断属于：排名问题 / CTR 问题 / 页面承接问题 / SERP 竞争问题

### 第四轮审批意见评审

评审对象：用户粘贴的“第三轮审批意见已记录，但原表未修正”的审批结论。

总体判断：

- 这个审批是对的
- 问题不在方向，而在文档一致性
- 第 11 节已经记录了修正意见，但第 8 节和第 9 节的核心表格还没有同步改
- 所以当前文档不能算真正完成修正

#### 12.1 说得对的地方

1. “只是记录了意见，还没更新原表”这个判断对

第 11 节已经承认：

- `/converter/image-to-pixel-art/` 角色冲突
- `/blog/` P2 偏高
- `8-bit` 要按 query cluster 看
- `photo-to-pixel-art` 要按照片语义 cluster 看

但第 8 节和第 9 节仍保留旧表述，所以后续如果直接进入执行清单，会把旧问题带进去。

2. `/converter/image-to-pixel-art/` 的目标词确实要改

第 9 节里它还写着 `image to pixel art / image to pixel art converter`。

这会和首页的主词分工冲突。

下一版应改成：

- 当前角色：主转换说明页 / 长尾转换页
- 目标词：`image to pixel art converter` / `convert image to pixel art` / `online image to pixel art converter`
- 备注：是否真的让它抢这些词，后续还要看 GSC 页面 + query 数据

3. `/blog/` 的优先级确实要降

第 9 节仍写 `/blog/` 是 P2。

这会让后续执行清单误把博客列表页排得太靠前。

下一版应改成：

- 当前问题：CTR 低，但不是核心转化页；暂不优先处理
- 优先级：P3 / 观察

4. `8-bit query cluster` 小表确实需要补

单看 `8 bit art generator` 只有很少数据，会低估 `/converter/8-bit-art-generator/`。

但 URL 表显示该页有 `5,875` 曝光，所以必须按词组看。

5. `photo / picture query cluster` 小表也确实需要补

`photo to pixel art` 和 `picture to pixel art` 都显示当前主要页面是首页，目标页应是 `/converter/photo-to-pixel-art/`。

但还需要补 `photo to pixel`、`picture to pixel`、`portrait to pixel art` 等词，才能真正判断照片专项页的问题边界。

#### 12.2 采纳结论

采纳：

- 当前不能算完成修正
- 不能直接进入 `3.2` 正式讨论
- 先修第 8、9 节里的表
- 再补两个 cluster 小表

需要修正的 4 个点：

1. 修改 `/converter/image-to-pixel-art/` 的目标词，避免和首页抢 `image to pixel art` 主词
2. 把 `/blog/` 优先级从 P2 改成 `P3 / 观察`
3. 增加 `8-bit query cluster` 小表
4. 增加 `photo / picture query cluster` 小表

#### 12.3 当前状态

当前文档状态应改为：

- 第三轮审批意见已记录
- 数据补表已完成初版
- 表格仍需同步修正
- 修表完成前，不进入 `3.2` 正式讨论
- 仍不进入代码执行

### 表格同步修正完成记录

本节记录对第 12 节提出的 4 个修正点的实际处理结果。

已完成：

1. 已修正 `/converter/image-to-pixel-art/` 在 URL 诊断表里的目标词

修正后它不再和首页一起直接抢 `image to pixel art` 主词。

现在定义为：

- 当前角色：主转换说明页 / 长尾转换页
- 目标词：`image to pixel art converter` / `convert image to pixel art` / `online image to pixel art converter`
- 备注：是否真的让它抢这些长尾词，后续还要看页面 + query 数据

2. 已把 `/blog/` 优先级从 P2 改为 `P3 / 观察`

修正理由：

- `/blog/` 是博客列表页，不是核心转化页
- 虽然 CTR 很低，但当前不是最接近增长的机会
- 博客问题后续单独讨论，不进入第一批工具页优化

3. 已补 `8-bit query cluster` 小表

结论：

- 不能只看 `8 bit art generator` 单个 query
- `/converter/8-bit-art-generator/` 要按一组 8-bit 相关词讨论
- 主要问题是排名靠后，部分词当前由首页或主转换页承接

4. 已补 `photo / picture query cluster` 小表

结论：

- `photo to pixel art` 和 `picture to pixel art` 是明确的页面承接错位问题
- 首页现在仍然是主要展示页
- `/converter/photo-to-pixel-art/` 的核心问题升级为“照片语义不够明确”
- `portrait`、`avatar`、`pet photo` 当前无明显 GSC 数据，不能作为第一批主攻词

当前状态：

- 第 8、9 节核心表格已同步修正
- 两张 cluster 小表已补
- 可以进入 `3.2 核心词卡位问题` 的正式讨论
- 仍然不进入代码执行

### 第五轮审批意见评审

评审对象：用户粘贴的“通过当前阶段，可以进入 3.2”的审批结论。

总体判断：

- 这个审批是对的
- 当前阶段可以通过
- 可以正式进入 `3.2 核心词卡在第 1 页底部或第 2 页` 的讨论
- 仍然不能进入代码执行
- 仍然不生成最终执行清单

#### 14.1 说得对的地方

1. 确认 4 个修正点已经完成，这个判断对

已完成：

- `/converter/image-to-pixel-art/` 目标词已改成更长尾的 converter 词
- `/blog/` 已降为 `P3 / 观察`
- `8-bit query cluster` 小表已补
- `photo / picture query cluster` 小表已补

2. “不再只是记录审批意见，而是同步修正了核心表格”这个判断对

第 8、9 节的旧问题已经实际改掉。

第 13 节也明确记录了当前状态。

3. 下一步应直接展开 `3.2`，这个对

后面不应该继续新增纯审批记录。

下一步应该回到第 3.2 本身，按词逐个讨论：

- `pixel art maker`
- `pixel art generator`
- `photo to pixel art` / `picture to pixel art`
- `pixel art converter`

4. 历史审批记录后续应移到附录，这个建议对

当前为了保留过程，先不移动。

等进入执行清单阶段，正文应该只保留最终结论，把第 6、7、11、12、14 这类审批过程移到附录。

5. `image to pixel converter` 的归属需要留到 `3.3`，这个提醒对

现在暂时不影响通过。

但后面讨论 pSEO 工具页分工时，要单独判断：

- `image to pixel converter` 是否继续由首页承接
- 是否逐步转给 `/converter/image-to-pixel-art/`
- 如果不转，主转换页的独特价值是什么

#### 14.2 采纳结论

采纳：

- 当前数据补表阶段通过
- 表格同步修正完成
- cluster 小表完成
- 当时下一步进入 `3.2`，目前 `3.2` 和 `3.3` 已完成第一轮讨论
- 不进入代码执行
- 不生成最终执行清单

#### 14.3 当时下一步（已完成）

本节是历史记录。当前下一步以第 10 节为准。

当时要求是不再新增审批记录，直接展开：

直接展开：

```md
### 3.2 核心词卡在第 1 页底部或第 2 页

#### 3.2.1 pixel art maker
现象：
原因：
严重程度：
要不要改：
大方向：

#### 3.2.2 pixel art generator
...

#### 3.2.3 photo to pixel art / picture to pixel art
...

#### 3.2.4 pixel art converter
...
```
