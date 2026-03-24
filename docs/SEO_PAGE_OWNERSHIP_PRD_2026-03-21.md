# SEO Page Ownership PRD

状态：Draft for Review

日期：2026-03-21

文档目的：本 PRD（产品需求文档，Product Requirements Document）用于明确 Pixel Art Village 在本轮 SEO 优化中的页面分工、关键词策略、内容改造范围、技术边界、验收标准和上线节奏。本文档用于评审，不直接包含代码实现。

## 1. 背景

Pixel Art Village 当前已经具备较完整的多语言 SEO 基础设施：

- 独立语言 URL，采用子目录结构
- `hreflang` 已实现
- self-canonical（每个页面规范网址指向自己）已实现
- 自动语言跳转已关闭
- 英文是默认语言

但在关键词层面，站点仍存在明显问题：

- 品牌词 `Pixel Art Village` 已经有较强排名基础，目前接近或达到第 2 位
- 泛词 `image to pixel art` 排名较远，说明新增用户获取能力仍然不足
- 首页 `/` 与 `/converter/image-to-pixel-art/` 存在页面角色重叠，容易发生关键词互抢
- 其他格式页和部分内容页也可能在弱化主转换页对核心泛词的集中度

本轮优化不再讨论“是否自动推荐语言”或“是否自动按浏览器语言跳转”。产品决策已经明确：

- 根路径 `/` 永远显示英文
- 其他语言仅通过明确的语言子目录访问
- 不做语言推荐提示条
- 不做浏览器语言、IP、cookie 自动跳转
- 用户仅通过语言切换器手动切换语言

## 2. 问题定义

当前站点的核心 SEO 问题不是“没有内容”，而是“页面分工不够清楚”。

具体表现为：

1. 首页既想承接品牌词，又想承接高竞争泛词，导致页面意图混杂。
2. `/converter/image-to-pixel-art/` 理应是核心商业页，但其角色没有被拉到足够明确。
3. 其他格式页、FAQ 和 Blog 内容有机会分散主词相关性，削弱主页信号。
4. 多语言架构正确，但内容策略尚未围绕“页面所有权”统一展开。

## 3. 核心判断

本项目在 SEO 资源分配上应采用“双线并行、主攻泛词”的策略：

- 主战场：`image to pixel art`
- 护城河：`Pixel Art Village`

这意味着：

- 不需要等品牌词先升到第 1 位再开始抢泛词
- 品牌词继续补强，但不应占用主要 SEO 资源
- 泛词需要由更明确的页面承接，而不是由首页继续模糊承接

## 4. 项目目标

### 4.1 业务目标

- 通过核心泛词提升新增自然搜索用户
- 在不牺牲品牌词表现的前提下，提升全站总点击与总曝光
- 建立清晰的页面分工，减少关键词互抢

### 4.2 SEO 目标

- 提升 `/converter/image-to-pixel-art/` 对 `image to pixel art` 相关词组的承接能力
- 稳住并补强首页对 `Pixel Art Village` 品牌词的排名
- 让格式页只覆盖格式型长尾词，不再稀释核心页信号
- 让 Blog 承担教程型长尾词和内链输送，而非核心商业词竞争

### 4.3 阶段性成功标准

第一阶段成功不以“首页继续排泛词”为判断标准，而以以下结果为主：

- `image to pixel art` 相关词的曝光和点击开始向 `/converter/image-to-pixel-art/` 集中
- 首页对品牌词 `Pixel Art Village` 的相关性更强
- 全站总点击不因页面角色调整而下滑
- 多语言页面结构和 `hreflang` 逻辑保持稳定

## 5. 非目标

本 PRD 不包含以下内容：

- 不在第一阶段批量新建大量 landing pages
- 不在第一阶段重做全语言内容
- 不实现语言提示条
- 不实现基于浏览器语言、IP、cookie 的自动跳转
- 不在第一阶段直接上线 `minecraft` 专题页
- 不为不存在的 AI 功能创建独立 SEO 页面

## 6. 搜索意图拆分

### 6.1 品牌词意图

典型词：

- `Pixel Art Village`
- `Pixel Art Village converter`

用户意图：

- 已经认识品牌，想直接进入工具或回到网站

最适合承接页面：

- 首页 `/`

### 6.2 核心商业词意图

典型词：

- `image to pixel art`
- `image to pixel converter`
- `convert image to pixel art`
- `turn image into pixel art`
- `image to pixel`

用户意图：

- 想立刻上传图片并把它转成像素画

最适合承接页面：

- `/converter/image-to-pixel-art/`

### 6.3 近义商业词意图

典型词：

- `pixel art converter`
- `pixel art maker`
- `pixel art generator`

用户意图：

- 想找一个在线工具，但用词不一致

策略：

- 不建议为这三个近义词分别建独立页面
- 建议统一由 `/converter/image-to-pixel-art/` 承接

### 6.4 格式型长尾意图

典型词：

- `png to pixel art`
- `jpg to pixel art`
- `gif to pixel art`
- `webp to pixel art`
- `photo to pixel art`

用户意图：

- 用户明确知道自己的输入格式，想找更匹配的入口

最适合承接页面：

- 对应的格式页

### 6.5 教程型与比较型意图

典型词：

- `how to convert image to pixel art`
- `best pixel art converter`
- `tips for better pixel art`

用户意图：

- 需要解释、教程、比较或操作建议

最适合承接页面：

- Blog

## 7. 页面所有权策略

### 7.1 首页 `/`

页面角色：

- 品牌首页
- 工具总入口
- 信任与价值主张页

首页负责承接：

- `Pixel Art Village`
- 品牌相关组合词
- 工具总入口型需求

首页可以轻度覆盖但不应主打：

- `image to pixel art`
- `pixel art tools`

首页不应承担：

- `image to pixel art` 的核心排名任务
- `pixel art converter / maker / generator` 的主战页职责

首页内容原则：

- 保留品牌信号
- 清楚说明产品价值
- 提供主转换页和格式页入口
- 避免整页像泛词落地页

### 7.2 主转换页 `/converter/image-to-pixel-art/`

页面角色：

- 核心商业页
- 泛词主战页
- 主转化页

主转换页负责承接：

- `image to pixel art`
- `image to pixel converter`
- `convert image to pixel art`
- `turn image into pixel art`
- `image to pixel`
- `pixel art converter`
- `pixel art maker`
- `pixel art generator`

主转换页内容原则：

- 明确告诉用户“这是把图片转成 pixel art 的工具页”
- 比首页更强调结果、参数和转换能力
- 强化直接转化意图，而不是品牌故事

### 7.3 格式页

页面角色：

- 长尾页
- 格式型入口页

格式页负责承接：

- `png to pixel art`
- `jpg to pixel art`
- `gif to pixel art`
- `webp to pixel art`
- `bmp to pixel art`
- `photo to pixel art`

格式页不应承担：

- `image to pixel art` 大词主排名任务

### 7.4 Blog

页面角色：

- 教程页
- 比较页
- 问题解答页

Blog 负责承接：

- 教程型长尾词
- 问题型长尾词
- 比较型长尾词

Blog 不应承担：

- 核心商业词的主排名任务

## 8. 页面级需求

### 8.1 首页需求

首页需要满足以下要求：

1. 首页 `title` 必须以品牌为核心，同时保留工具识别度。
2. 首页 `H1` 必须同时体现品牌与主功能，但语义上应更接近“品牌首页”，而不是“单页落地页”。
3. 首页首屏两句话必须讲清：
   - Pixel Art Village 是什么
   - 用户在这里可以完成什么核心任务
4. 首页需要保留上传工具入口。
5. 首页需要保留“为什么选择我们”的信任模块。
6. 首页需要明确引导用户进入 `/converter/image-to-pixel-art/`。
7. 首页 FAQ 保持简短，控制在 3 到 4 条，以品牌认知和基础问题为主。
8. 首页避免长篇大段反复堆砌 `converter / maker / generator / image to pixel art`。

首页建议文案方向：

- `title` 候选：
  - `Pixel Art Village | Image to Pixel Art Converter & Pixel Art Tools`
- `H1` 候选：
  - `Pixel Art Village | Image to Pixel Art Converter`

### 8.2 主转换页需求

主转换页需要满足以下要求：

1. `title` 以 `image to pixel art` 为核心，不以品牌优先。
2. `H1` 使用强功能表达，直接说明该页用途。
3. 首屏必须直接对应“上传图片并转成 pixel art”的即时需求。
4. 页面中段要解释参数与效果，而不是只写品牌卖点。
5. FAQ 应围绕：
   - 如何转换
   - 哪些图片更适合
   - 如何获得更干净结果
   - 如何导出
6. 页面要自然覆盖 `converter / maker / generator` 近义词，但不拆成多个独立页面。
7. 页面需要从首页、格式页、Blog 获得稳定内链支持。

主转换页建议文案方向：

- `title` 候选：
  - `Image to Pixel Art Converter | Turn Any Image Into Pixel Art`
- `H1` 候选：
  - `Image to Pixel Art Converter`

### 8.3 格式页需求

格式页需要满足以下要求：

1. 每页只主打自己的格式词。
2. 首段要解释“为什么这个格式适合这样转”。
3. 每页只保留少量 FAQ，回答格式相关问题。
4. 不反复与主转换页争抢 `image to pixel art` 核心词。
5. 每页提供返回主转换页的自然内链。

### 8.4 Blog 需求

Blog 内容需要满足以下要求：

1. 只主打教程型、比较型、问题型长尾词。
2. 文章正文要自然导向主转换页或相关格式页。
3. 不把文章主标题做成 `image to pixel art` 这种强商业词。

## 9. 多语言需求

本 PRD 采用“英文先行，规则全站统一”的执行方式。

### 9.1 已确认规则

- `/` 永远显示英文
- 非英文页面仅通过语言子目录访问
- 不做语言推荐提示条
- 不做语言自动跳转
- `hreflang` 继续保留
- self-canonical 继续保留

### 9.2 本阶段范围

第一阶段只改英文高信号内容：

- `title`
- `H1`
- 首段文案
- FAQ
- 关键模块顺序与意图

### 9.3 第二阶段范围

英文效果稳定后，再同步 2 到 3 个重点语言：

- 仅同步高信号字段
- 不做全量重写

## 10. 技术与实现边界

### 10.1 必须保持的技术边界

- 继续使用语言子目录
- 不恢复任何自动语言重定向
- 不通过 cookie 或浏览器语言改变根路径内容
- 不引入同一 URL 多语言内容切换

### 10.2 允许的实现动作

- 调整首页与主转换页 SEO 文案
- 调整模块顺序
- 调整 FAQ 内容
- 调整页面内链
- 调整首页到主转换页的引导强度

## 11. KPI 与衡量方式

### 11.1 核心指标

第一优先级：

- `image to pixel art` 词群的总曝光
- `image to pixel art` 词群的总点击
- `/converter/image-to-pixel-art/` 的曝光与点击

第二优先级：

- `Pixel Art Village` 品牌词排名
- 首页点击与曝光稳定性

第三优先级：

- 格式页长尾词点击
- Blog 向主转换页导流效果

### 11.2 判断逻辑

以下情况视为正向变化：

- 核心泛词更多由主转换页承接
- 首页品牌词表现提升或稳定
- 全站总点击不因分工调整而恶化

以下情况不视为失败：

- 首页在部分泛词上的排名下降，但主转换页接住了这些词并带来更多总点击

## 12. 上线节奏

### 阶段 1：策略对齐

- 确认页面分工
- 确认首页与主转换页的文案方向
- 确认是否保持 `minecraft` 为第二阶段候选

### 阶段 2：英文实施

- 首页调整
- `/converter/image-to-pixel-art/` 调整
- 格式页去重与避让
- Blog 内链和标题方向校准

### 阶段 3：观察

- 观察 2 到 4 周 Search Console 数据
- 判断泛词是否向主转换页集中

### 阶段 4：扩展

- 同步重点语言
- 评估是否新增 `minecraft` 专题页

## 13. 风险与缓解

### 风险 1：首页泛词短期下滑

风险说明：

- 首页不再主抢泛词后，首页自身泛词排名可能短期下降

缓解方案：

- 以全站总曝光与主转换页承接情况为主，不以首页单页表现单独判断成败

### 风险 2：主转换页承接不够强

风险说明：

- 如果主转换页内容没有真正拉开差异，Google 仍可能继续把首页视作主页

缓解方案：

- 强化页面角色差异
- 强化首页到主转换页的内链
- 减少其他页面对主词的稀释

### 风险 3：多语言同步过早

风险说明：

- 太早同步所有语言会放大工作量，也会增加变量

缓解方案：

- 先看英文结果，再扩展

## 14. 验收标准

以下条件满足时，可认为第一阶段交付完成：

1. 首页与主转换页的 `title`、`H1`、首段、FAQ 完成区分。
2. 首页从语义上明确成为品牌首页 + 工具总入口。
3. `/converter/image-to-pixel-art/` 从语义上明确成为核心转换页。
4. 格式页不再反复争抢 `image to pixel art` 主词。
5. Blog 内容继续保留，但其标题与定位不再冲击主商业词。
6. 根路径继续固定英文，多语言策略不被破坏。
7. 构建、预渲染、canonical、`hreflang` 验证通过。

## 15. 本次评审需要用户确认的决策

以下内容请在评审时重点确认：

1. 是否同意“首页守品牌，主转换页攻泛词”的总策略。
2. 是否接受首页不再把 `image to pixel art` 作为首要排名目标。
3. 是否接受 `/converter/image-to-pixel-art/` 同时承接 `converter / maker / generator` 三组近义商业词。
4. 是否同意第一阶段只做英文，不立即全语言同步。
5. 是否同意 `minecraft` 保持第二阶段候选，而不是立即上线。

## 16. 推荐结论

建议按本 PRD 执行。

原因如下：

- 当前最核心的问题是页面角色混杂，而不是缺少页面数量
- 首页与主转换页分工清楚后，品牌词和泛词才能同时增长
- 现有多语言架构已经足够健康，不需要再围绕语言入口做复杂改造
- 英文先做，能最快验证策略是否有效，风险最可控
