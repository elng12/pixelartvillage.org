# AGENTS.md instructions for /Users/elng/web/pixelartvillage.org

用中文大白话和用户沟通，少说术语。
这个项目是 Pixel Art Village，一个 Vite + React 的像素图工具站，重点是转换工具、pSEO converter 页面、Blog、SEO 和静态构建产物。

## 项目结构

- `src/`：React 应用主代码。
- `src/components/`：通用 UI。
- `src/components/editor/`：编辑器相关，比如预览、调参。
- `src/content/`：内容数据，pSEO 页面优先看这里。
- `scripts/`：构建、SEO、sitemap、预渲染、OG 图等脚本。
- `tests/`：Playwright E2E。
- `public/`：静态资源。
- `dist/`：构建产物，不要手动编辑。
- `server/`：可选 Express + Sharp 图片服务。
- `docs/`：SEO、执行计划、讨论记录。

## 默认工作方式

1. 用户说“看一下 / 游览 / 检查 / 为什么”，默认只读，不改文件。
2. 用户说“执行 / 修改 / 生成 / 提交上传”，才进入修改流程。
3. SEO 大改先看文档和 GSC 证据，不要直接改代码。
4. 每轮只动一个明确页面或一个明确内容源。
5. 改完必须本地构建和真实页面验收。

## 必备文档

长期必须保留：

- `AGENTS.md`：项目工作规则。
- `docs/ITERATION.md`：每轮优化、SEO、发布、复查记录。

SEO 相关优先看：

- `docs/GSC_SEO_DISCUSSION_LOG_2026-06-06.md`
- `docs/SEO_README.md`
- `docs/SEO_PAGE_OWNERSHIP_PRD_2026-03-21.md`
- `docs/SEO_PAGE_OWNERSHIP_PRD_V2_2026-03-21.md`

## 常用命令

| 命令 | 用途 |
|---|---|
| `npm run dev` | 启动本地开发 |
| `npm run build` | 构建并预渲染关键路由 |
| `npm run preview` | 预览构建产物 |
| `npm run lint` | ESLint 检查 |
| `npm run typecheck` | TypeScript 检查 |
| `npm run test` | Playwright 测试 |
| `npm run verify:dist` | 验证构建产物关键 SEO 标签和资源 |
| `npm run seo:check` | SEO 检查 |
| `npm run sitemap:verify` | sitemap 检查 |
| `npm run seo:density` | 关键词密度检查 |

推荐 Node.js：18.x 或 20.x。避免 Node 22。项目有 `.nvmrc` 时优先 `nvm use 20`。

## SEO / GSC 规则

这个项目不要凭感觉做 SEO。

1. GSC 只用完整日期窗口。
2. `docs/GSC_SEO_DISCUSSION_LOG_2026-06-06.md` 是讨论和执行记录，不等于所有内容都已提交或部署。
3. 先看 Query 映射和 URL 诊断，再决定能不能动代码。
4. 首页强不是坏事，首页负责总工具入口。
5. 子页面要做专项答案页，不要靠全站乱塞词解决。
6. 每轮 SEO 必须写清楚只动哪个页面。
7. 以后修改任一语言页面的 SEO 搜索标题时，最终完整标题 MUST 为 55–60 字符（含两端），包括程序追加的品牌名、空格和标点；不是只计算源码中的标题字段，也不要求正文 H1 使用同样长度。
8. 以后修改任一语言页面的 SEO 搜索描述时，最终完整描述 MUST 为 150–160 字符（含两端），包括空格和标点；不能以构建时自动截断后的长度代替完整文案长度。
9. 在上述范围内尽量用足空间，优先放入符合页面主题和搜索意图的核心关键词及相关关键词。关键词必须与页面实际内容一致，保持该语言自然、准确、可读；不要重复堆词、加入无关词或为凑长度添加空话。不据关键词数量或字符长度保证曝光、权重或排名提升。
10. 每轮修改后，必须记录最终标题和描述的实际字符数，并核对构建产物及真实页面中的对应值。按字符计数而不是字节计数，程序自动追加的品牌不得重复填写。
11. 以上是本项目的执行规则，不是 Google 官方的固定字符上限。本次定规则不授权批量重写现有页面；仍按每轮指定页面执行，其他页面保持不变。

## 当前高优先级边界

批次 A 的边界很窄：

- 目标页：`/converter/photo-to-pixel-art/`
- 优先编辑面：`src/content/pseo-pages.en.json`
- 只有 JSON 内容不够表达时，才考虑 `PseoPage.jsx` 或预渲染脚本。

本轮不要顺手改：

- 首页
- 其他 converter 页面
- 多语言页面
- Blog
- `8-bit` 页面

## 页面验收规则

不能只看文档说“应该有”。必须看真实页面或构建产物。

验收重点：

- 页面 HTTP 200。
- title / canonical / OG / Twitter 标签正确。
- `HowTo` 或 FAQ 等 JSON-LD 正常。
- FAQ 可见。
- 上传区、工具控件、调参控件真实存在。
- pSEO 页面构建后在 `dist/` 里有对应 HTML。

`photo-to-pixel-art` 页面重点看：

- upload area
- FAQ
- Explore other converters
- Pixel Size
- Brightness
- Contrast
- Saturation
- Palette

## 技术规则

- JavaScript / JSX 用 ES modules。
- React 19 函数组件。
- hooks 用 `use*` 命名。
- 组件用 `PascalCase`。
- 函数和变量用 `lowerCamelCase`。
- 常量用 `UPPER_SNAKE_CASE`。
- 缩进 2 spaces。
- Tailwind v4 utility-first，少写自定义 CSS。
- E2E 测试优先用稳定 selector，比如 `data-testid`。

## Preview Scaling 项目特殊规则

预览缩放要按布局尺寸算：

- 用 `width = originalWidth * zoom`
- 用 `height = originalHeight * zoom`
- 保持 `max-w-none`
- 不要用 `transform: scale()`
- 不要用 CSS contain

这样可以避免滚动容器里的布局和视觉不一致。

## 提交规则

1. 先看 `git status --short`。
2. 只提交本轮相关文件。
3. 不要 `git add .`。
4. 不要把已有无关本地改动混进提交。
5. 提交前跑需要的检查，比如 `npm run build`、`npm run verify:dist`、`npm run lint`。

如果用户只是让你补文档，不要顺手提交 git。

## 技能优先级

- 项目文档和迭代记录：`project-doc-guard`。
- 本地预览和真实页面检查：Browser。
- SEO 数据分析：先用 GSC / Data Analytics 思路，只看完整日期。
- UI 原型或页面重设计：Product Design / Prototype。
- 提交上传：Publish Changes / GitHub。
