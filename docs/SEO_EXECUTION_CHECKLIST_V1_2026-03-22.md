# SEO Execution Checklist v1

状态：Ready for Review

日期：2026-03-22

本文档用途：把 `SEO_PAGE_OWNERSHIP_PRD_V2_2026-03-21.md` 进一步拆成真正可排期、可执行、可验收的逐页清单。它不是新的策略文档，而是第一阶段英文实施的执行蓝图。

适用范围：

- 第一阶段只覆盖英文主站
- 第一阶段不改多语言架构
- 第一阶段不批量新建大量页面
- 第一阶段不直接进入代码实现决策争论，而是先把执行项写清楚

---

## 1. 本轮执行目标

本轮不是简单“改标题和 H1”，而是要同时完成四件事：

1. 让首页 `/` 退出 `image to pixel art` 主词竞争，回到品牌首页和产品入口页角色。
2. 让 `/converter/image-to-pixel-art/` 成为主词群唯一核心承接页。
3. 让格式页和 Blog 从“可能互抢主词”变成“为主转换页导流和补充语义”。
4. 让可抓取性、内链、结构化数据和后续数据验证形成闭环。

---

## 2. 执行顺序

### P0：必须先完成

- 首页收口
- 主转换页强化
- 内链规则落地
- 可抓取性和结构化数据验证

### P1：紧随其后

- 格式页避让
- Blog 去冲突和导流
- Query-to-URL 迁移监控模板

### P2：观察后再决定

- 是否同步重点语言
- 是否把 `Minecraft` 从区块升级成独立页
- 是否压缩或重组表现差的长尾页

---

## 3. 执行总原则

### 3.1 页面形态优先于文案修饰

如果首页和主转换页在功能形态上仍然几乎一样，即使改了 `title`、`H1` 和 FAQ，ownership 也很难真正生效。

### 3.2 主词集中优先于词面覆盖广度

第一阶段优先保证 `/converter/image-to-pixel-art/` 吃住 `image to pixel art` 词群，而不是让很多页面都“顺便带一点”主词。

### 3.3 先做英文，再考虑同步

第一阶段先把英文主路径跑通。多语言只保留当前技术边界，不在本轮同步大改。

### 3.4 每项都必须能验收

每个页面改动都要有：

- 目标
- 具体动作
- 文件范围
- 完成标准

---

## 4. P0：首页 `/` 执行清单

### 4.1 目标

把首页从“泛词 + 工具混合页”收回成：

- `Pixel Art Village` 品牌首页
- 产品价值页
- 主转换页和其他工具页的入口页

### 4.2 当前主要问题

- 首页当前 `title` / `H1` 仍然过于接近主词页表达。
- 首页直接使用共享的 `ToolSection`，仍然可能承接完整上传心智。
- 首页下方共用 `HowItWorksSection` 和 `FaqSection`，容易继续与主转换页同质化。
- 首页虽然已经有工具卡片入口，但“主转换页是唯一主战页”的信号还不够强。

### 4.3 具体动作

#### 动作 A：收紧首页头部文案

- 首页 `title` 改成品牌优先，不再使用过强的 exact-match 主词。
- 首页 `H1` 改成品牌优先，不再和 `/converter/image-to-pixel-art/` 的 `H1` 形成镜像。
- 首页副标题保留“能把图片转成 pixel art”的表达，但不把它放在最强 SEO 位。

涉及文件：

- `src/locales/en.json`
- `public/locales/en/translation.json`

#### 动作 B：把首页工具区改成“轻入口”

- 首页可以保留上传 CTA 或轻量上传控件。
- 上传动作必须进入 `/converter/image-to-pixel-art/` 继续完成完整流程。
- 首页不得在同一页面完成完整参数调节、完整结果预览和完整下载。
- 如果当前共享 `ToolSection` 无法安全实现这种边界，需要拆出首页专用入口组件，或为 `ToolSection` 增加明确的 `entry-only` 模式。

涉及文件：

- `src/components/ToolSection.jsx`
- `src/App.jsx`
- 如需新建：首页轻入口组件建议放在 `src/components/`

#### 动作 C：重新定义首页下方模块的角色

- `Why use Pixel Art Village`、信任信号、适用场景保留。
- `How it works` 保留简化版，不再写成主转换页级别的工具说明。
- FAQ 缩成品牌与产品层问题，不和主转换页 FAQ 重复。
- 工具入口区继续保留，但主转换页卡片必须更突出，且文案明确强调“主转换器”角色。

涉及文件：

- `src/components/HomeBelowFold.jsx`
- `src/components/FaqSection.jsx`
- `src/components/HowItWorksSection.jsx`
- `src/locales/en.json`
- `public/locales/en/translation.json`

#### 动作 D：加强首页到主转换页的显眼入口

- 首屏附近至少 1 个主 CTA 指向 `/converter/image-to-pixel-art/`
- 中下部至少 1 个明确入口再次导向主转换页
- 锚文本以自然变体为主，但要保持“这是主转换页”的稳定认知

涉及文件：

- `src/components/HomeBelowFold.jsx`
- `src/App.jsx`
- `src/locales/en.json`
- `public/locales/en/translation.json`

### 4.4 完成标准

- 首页不再看起来像 `image to pixel art` 的主战页
- 首页上传动作不会在首页完成完整流程
- 首页首屏和中下部都能明确进入主转换页
- 首页 FAQ 与主转换页 FAQ 不再高度重复
- 预渲染结果中，首页的品牌信号和导流入口可抓取可见

---

## 5. P0：主转换页 `/converter/image-to-pixel-art/` 执行清单

### 5.1 目标

把 `/converter/image-to-pixel-art/` 做成第一阶段绝对主战页：

- 主词群唯一主承接页
- 真正的 Tool-first page
- 商业意图和交互意图最强的一页

### 5.2 当前主要问题

- 当前主转换页虽然有独立 `title` / `H1` / intro，但工具区、FAQ、How it works 仍大量复用通用组件。
- 页面形态和首页仍然太像，缺少“这是主战页”的强烈差异。
- `Minecraft`、AI、参数解释虽然在 PRD 里定义了，但页面上还没有对应的专属区块。
- 当前 `SoftwareApplication` JSON-LD 已有，但页面专属 FAQ 和更完整的工具语义还没有同步跟上。

### 5.3 具体动作

#### 动作 A：把主转换页工具区做成第一视觉中心

- 首屏必须先看到上传区和至少一个结果容器或结果反馈区域。
- 上传后必须马上出现明确反馈：预览、loading、处理中状态之一。
- 参数控制必须紧邻工具区，而不是藏在长文后。
- 下载 CTA 必须靠近结果区域。
- 如果当前共享 `ToolSection` 难以满足主战页需求，优先给主转换页做专用模式或专用组件。

涉及文件：

- `src/components/PseoPage.jsx`
- `src/components/ToolSection.jsx`
- `src/components/Editor.jsx`

#### 动作 B：主转换页内容与首页彻底拉开

- `Title`、`H1`、首段继续以 `image to pixel art` 为核心。
- 首段直接回答“把图片转成 pixel art”这个即时问题。
- 中段解释参数、输出场景、适合什么源图。
- FAQ 保留，但不得压过工具区。

涉及文件：

- `src/content/pseo-pages.en.json`
- `src/components/PseoPage.jsx`

#### 动作 C：新增主转换页专属区块

第一阶段至少补两个专属区块：

1. `Convert Image to Minecraft Pixel Art`
2. `Is this an AI pixel art generator?`

其中：

- `Minecraft` 区块必须满足 PRD 的最小深度要求，不是只塞两句话。
- AI 区块或 FAQ 只能做真实解释，不能暗示并不存在的 AI 功能。

涉及文件：

- `src/content/pseo-pages.en.json`
- `src/components/PseoPage.jsx`
- 如需区块组件：`src/components/`

#### 动作 D：主转换页使用专属 FAQ / How it works

- 不再直接复用首页 FAQ 作为主转换页 FAQ。
- `How it works` 可保留 3 步结构，但文案要明显偏向主转换页真实流程。
- 如有必要，拆出：
  - `ConverterFaqSection`
  - `ConverterHowItWorksSection`

涉及文件：

- `src/components/FaqSection.jsx`
- `src/components/HowItWorksSection.jsx`
- `src/components/PseoPage.jsx`
- `src/locales/en.json`
- `public/locales/en/translation.json`

#### 动作 E：竞品对标产物落地

执行前必须补一个对标表，至少比较前 3 个工具型竞品的：

- 是否首屏即上传
- 是否首屏即预览
- 是否展示免费、隐私、无水印、导出能力
- 参数控制是否紧邻工具区
- 移动端首屏结构
- 我们要跟进的点
- 我们明确不跟进的点

建议产物：

- 单独文档，或补入本清单附录

### 5.4 完成标准

- 用户进入页面后，不读长文也知道“这里就是主转换器”
- 页面工具区明显强于首页工具区
- `Minecraft` 与 AI 相关覆盖已落到页面可见区块或 FAQ
- 页面不再与首页共享完全相同的 FAQ / How it works
- 结构化数据、可抓取性、主 CTA 都通过验证

---

## 6. P1：格式页执行清单

### 6.1 目标

让格式页只承接各自格式词，不再稀释主词 ownership。

### 6.2 当前主要问题

以下页面存在不同程度的主词化表达：

- `png-to-pixel-art`
- `jpg-to-pixel-art`
- `gif-to-pixel-art`
- `webp-to-pixel-art`
- `bmp-to-pixel-art`
- `pixelate-image-online`

其中部分 intro 明确反复使用了 `image to pixel art` 泛词表达，容易和主转换页发生语义重叠。

### 6.3 具体动作

#### 动作 A：收紧真正格式页的 intro

格式页只强调：

- 这个格式为什么适合或不适合 pixel art
- 这个格式的典型使用场景
- 这个格式页和主转换页的关系

不再强调：

- 泛主词流程
- 通用的“image to pixel art” 解释段
- 与主转换页高度相似的长段落

涉及文件：

- `src/content/pseo-pages.en.json`

#### 动作 B：补稳定的回流入口

每个格式页至少保留：

- 上半部分 1 个回到主转换页的入口
- 页尾或 FAQ 附近 1 个回到主转换页的入口

涉及文件：

- `src/components/PseoPage.jsx`
- `src/content/pseo-pages.en.json`

#### 动作 C：把场景页和格式页区分开

以下页面不应继续按“纯格式页”思路处理：

- `photo-to-pixel-art`
- `photo-to-sprite-converter`
- `pixelate-image-online`
- `8-bit-art-generator`
- `retro-game-graphics-maker`

第一阶段建议：

- 明确把它们标记成场景页或主题页
- 文案上减少主词竞争
- 强化它们服务主转换页的辅助角色

### 6.4 完成标准

- 各格式页读起来像“格式场景页”，而不是换了格式名的主词页
- `photo to pixel art` 不再被当作格式词 ownership 处理
- 所有格式页都有自然回流到主转换页的内链

---

## 7. P1：Blog 执行清单

### 7.1 目标

让 Blog 承担教程、比较和问题型长尾词入口，而不是继续和主转换页争商业词。

### 7.2 当前优先处理文章

第一批建议优先处理以下英文文章：

- `best-pixel-art-converters-compared-2025`
- `how-to-get-pixel-art-version-of-image`
- `make-image-more-like-pixel`
- `export-from-illustrator-image-to-pixel-art`
- `how-to-pixelate-an-image`

### 7.3 具体动作

#### 动作 A：把教程文从“半落地页”改回教程页

以下风险需要优先处理：

- 反复使用 `image to pixel art` 做强商业表达
- 把工具页语气写进教程正文
- 在标题、首段、FAQ 中都过重堆主词

建议调整方向：

- 标题更像教程、问题解答或比较页
- 首段更快进入教学问题，不再像落地页
- FAQ 更偏问题解答，不再重复商业导购句式

涉及文件：

- `src/content/blog-posts.en.json`

#### 动作 B：加回主转换页的内链和 CTA

每篇相关 Blog 至少：

- 前半部分 1 个自然内链到主转换页
- 结尾 1 个 CTA 或自然导流到主转换页

锚文本使用自然变体，不全站只用一个 exact match。

涉及文件：

- `src/content/blog-posts.en.json`

#### 动作 C：比较型文章保持“真比较”

`best pixel art converter` 这类文章可以保留，但必须满足：

- 真正做比较
- 有明确比较维度
- 不伪装成主商业落地页
- 最终把自家主转换页作为推荐路径之一，而不是唯一主角

### 7.4 完成标准

- Blog 不再成为主词群的第二入口
- 教程文和比较文的页面意图更清晰
- 相关文章能稳定给主转换页导流

---

## 8. P0 / P1：技术 SEO 与验证清单

### 8.1 结构化数据

第一阶段需要确认：

- 主转换页 `SoftwareApplication` 保留并补强必要字段
- 主转换页 FAQ 若独立，结构化数据同步匹配新 FAQ
- 首页评估是否补 `WebSite` / `Organization`

涉及文件：

- `src/components/PseoPage.jsx`
- `src/components/Seo.jsx`
- `scripts/prerender-spa.cjs`

### 8.2 可抓取性

必须验证：

- 首页品牌信号、主转换页入口、核心 CTA 在预渲染结果中可见
- 主转换页 `title`、`H1`、首段、FAQ、Minecraft 区块、AI 解释在抓取结果中可见
- 关键文本不是只能靠用户交互后才出现

涉及文件：

- `scripts/prerender-spa.cjs`
- `scripts/verify-dist-entries.cjs`
- `scripts/seo-check.js`

### 8.3 内链可抓取性

必须检查：

- 首页、格式页、Blog 到主转换页的入口是否都是真实可抓取链接
- 不使用会阻断权重传递的无意义处理
- 锚文本与上下文保持自然

涉及文件：

- `src/components/HomeBelowFold.jsx`
- `src/components/PseoPage.jsx`
- `src/content/blog-posts.en.json`

### 8.4 Indexation 风险处理

本轮不是大规模 `noindex`，但要先完成风险识别：

- 哪些格式页只是模板换词
- 哪些 Blog 过度靠近主词
- 哪些场景页值得继续保留

若发现明显重复风险，优先顺序如下：

1. 改 intro / 标题 / FAQ，拉开差异
2. 加回流主转换页的内链，弱化商业位
3. 若仍无独特价值，再评估是否合并、降权或减少重点维护

### 8.5 性能和交互

本轮至少要把以下项目纳入验收，而不是只看 SEO 文案：

- 首屏上传是否可操作
- 上传后是否快速出现反馈
- 移动端是否先看到工具 CTA
- 结果区和下载 CTA 是否容易找到

如果图片处理明显阻塞交互，后续实现阶段要评估是否进一步收紧主线程负担。

---

## 9. 数据验证清单

### 9.1 上线前必须准备的监控项

- Search Console query cluster 观察表
- 页面维度观察：
  - `/`
  - `/converter/image-to-pixel-art/`
- 首页到主转换页点击率
- 主转换页上传率
- 主转换页上传后继续操作率

### 9.2 Query-to-URL 迁移验证

第一阶段固定观察这组 query：

- `image to pixel art`
- `turn image into pixel art`
- `convert image to pixel art`
- `image to pixel art converter`

判断逻辑：

- 不是只看首页排名有没有掉
- 而是看这组词是否逐步更多落到 `/converter/image-to-pixel-art/`
- 如果首页下降、主转换页上升，并且总承接更集中，不视为失败

### 9.3 检查窗口

- 第 2 周：查是否翻车
- 第 4 到 8 周：看 ownership 是否生效
- 第 8 周后：决定是否同步重点语言、是否独立做 `Minecraft`

---

## 10. 建议实施顺序

### Sprint 1

- 首页收口
- 主转换页工具优先化
- 首页与主转换页分离 FAQ / How it works
- 首页和主转换页的内链主入口落地

### Sprint 2

- 格式页避让
- Blog 第一批文章去冲突
- 主转换页补 `Minecraft` / AI 区块
- Schema 与可抓取性验证

### Sprint 3

- 数据复查
- 根据 GSC 看是否继续收紧首页表达
- 决定是否进入多语言同步和专题扩展

---

## 11. 待你审核拍板的点

这份执行清单默认采用以下判断。如果你不同意，我们再改清单，不急着写代码。

1. 首页上传只做轻入口，完整流程必须进入 `/converter/image-to-pixel-art/`
2. 主转换页需要和首页分离 FAQ / How it works，而不是继续完全共用
3. `photo-to-pixel-art` 视为场景页，不再视为格式页
4. Blog 第一批优先处理上述 5 篇文章
5. 第一阶段仍然不单独新建 `Minecraft` 页

---

## 12. 推荐结论

建议按这份执行清单进入实施阶段。

原因很直接：

- PRD 已经回答了“为什么这么做”
- 这份清单回答的是“先改什么、在哪改、改完怎么算过”
- 只要按这个顺序推进，首页和主转换页的角色就能真正拉开，而不是只停留在文案层
