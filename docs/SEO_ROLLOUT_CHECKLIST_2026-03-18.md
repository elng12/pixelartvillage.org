# SEO Rollout Checklist - 2026-03-18

## 这次上线要解决什么

这次改动的目标不是单纯改文案，而是让 Google 更清楚地理解各页面分工：

- 首页 `https://pixelartvillage.org/` 是总入口
- `https://pixelartvillage.org/converter/image-to-pixel-art/` 负责更精确的 `image to pixel art`
- `https://pixelartvillage.org/converter/photo-to-pixel-art/` 负责更精确的 `photo to pixel art`

## 最佳上线时间

- 建议上线时间：`2026-03-18 10:00-14:00`（北京时间）
- 上线后不要在 7 天内继续改这 3 个页面的标题、H1、canonical、主文案

## 上线前检查

- [ ] 本地执行 `npm run build`
- [ ] 确认构建通过，没有阻断错误
- [ ] 确认本次上线包含以下页面文案调整
- [ ] 首页首屏文案更像工具总入口，不再和精确页抢同一批词
- [ ] 首页可见区域有更明确的工具入口卡片
- [ ] `/converter/image-to-pixel-art/` 标题、H1、intro 更偏向通用图片转像素画
- [ ] `/converter/photo-to-pixel-art/` 标题、H1、intro 更偏向照片转像素画
- [ ] 确认本次上线不要混入额外 SEO 大改，避免后面看不清效果

## 上线动作

- [ ] 发布当前版本到生产环境
- [ ] 发布后打开首页，确认页面可正常访问
- [ ] 打开 `https://pixelartvillage.org/converter/image-to-pixel-art/`，确认页面可正常访问
- [ ] 打开 `https://pixelartvillage.org/converter/photo-to-pixel-art/`，确认页面可正常访问
- [ ] 如果生产环境前面有 CDN 缓存，先执行一次缓存清理

## Search Console 提交抓取

上线后，在 Google Search Console 里依次提交这 3 个 URL：

- `https://pixelartvillage.org/`
- `https://pixelartvillage.org/converter/image-to-pixel-art/`
- `https://pixelartvillage.org/converter/photo-to-pixel-art/`

每个页面操作步骤：

1. 打开 Search Console
2. 选择 `pixelartvillage.org`
3. 顶部搜索框粘贴完整 URL
4. 点击“测试实时 URL”
5. 如果可抓取，点击“请求编入索引”

## 上线后 7 天观察项

观察周期：

- 第一轮复盘：`2026-03-25`
- 第二轮复盘：`2026-04-01`

第一轮重点只看下面 5 项：

1. 首页展示量有没有止跌
2. `/converter/image-to-pixel-art/` 展示量有没有上升
3. `/converter/photo-to-pixel-art/` 展示量有没有上升
4. `image to pixel art` 这个词是否更多落到精确页
5. `pixel art maker` 是否还在持续下滑

## 不要做的事

- 不要在观察期里频繁改首页标题和 H1
- 不要同时新加一批相近关键词页面
- 不要把首页、`image-to-pixel-art`、`photo-to-pixel-art` 的定位又改混
- 不要在 3 天内就判断“这次没效果”

## 如果第一轮数据还是弱

优先考虑下面两步，而不是继续全站乱改：

1. 单独评估是否要做一个更贴近 `pixel art maker` 搜索意图的落地页
2. 继续加强首页到精确转换页的可见内链和文案区分
