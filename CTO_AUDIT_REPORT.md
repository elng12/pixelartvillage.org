# PixelArtVillage.org 技术健康度审计（CTO 级）

**版本**: v1.0  •  审计日期: 2025-09-25  •  范围: 仓库根目录与全部子目录

## 执行摘要（Executive Summary）
整体健康度良好：Vite 构建、预渲染与多语言路由链路清晰，核心像素化算法拆分合理并使用 Web Worker 与中止控制。主要风险集中在三点：1) ESLint 在本地基线下未通过且未被 CI 阻断；2) SEO 基线与校验脚本不一致导致构建门禁失败；3) 本地 Node 22 与 engines/CI（18/20）不一致。建议优先：修复并收敛 Lint 与 SEO 规则、将构建门禁固化到 CI、统一 Node 版本策略。

---

## 阶段一：项目初探与自动化基线分析

- 技术栈：React 19 + Vite 7 + Tailwind v4 + i18next；E2E 测试 Playwright；SSR/Prerender 生成多语言静态路由与 OG。
- 关键脚本：`lint`、`typecheck`、`build(含 prerender & seo-check)`、`verify:dist`、`test`。
- 本地验证（摘要）：
  - Typecheck：通过（`npx tsc --noEmit` 退出码 0）。
  - Lint：未通过（11 个问题，见下表）。
  - Build：产物生成成功，但 postbuild SEO 检查失败（12 项中 2 项未通过，构建退出码 1）。
  - Verify:dist：失败（语言前缀路由未按预期生成非前缀副本）。

| 风险等级 | 审计领域 | 问题定位 | 问题描述与战略影响 | 核心整改建议 |
|---|---|---|---|---|
| 严重 | 质量门禁 | scripts/seo-check.js, index.html:15,186 | SEO 校验强约束首页 `<title>` 必含“Pixel Art Village”，`<h1>` 必含“Image to Pixel Art”；当前为“Image to Digital Art…”，导致 postbuild 失败，阻断部署。长期放任将造成发布不可控与 SEO 质量漂移。 | 统一基线：要么按校验规则修正文案；要么更新 `seo-check.js` 的匹配词库。将 SEO 校验设为 CI 必过。 |
| 严重 | 构建与发布 | scripts/verify-dist-entries.cjs | 校验期望 `/privacy` 等非语言前缀路由，但 prerender 仅生成了带语言前缀（如 `/en/privacy`）。门禁失败将使 CI 红灯，影响发布节奏。 | 收敛策略：要么在 prerender 额外生成非前缀版本；要么下调 verify-dist 期望到“仅语言前缀”。保持与路由策略一致。 |
| 严重 | 代码规范 | 多处（见下） | ESLint 本地运行对 tests、配置文件也生效，当前有 10 个 error。CI 使用 `lint:ci` 仅覆盖 `src/ scripts`，掩盖了风险。长期将积累技术债并降低新成员认知成本。 | 统一 Lint 目标与环境：扩展 eslint config 的 Node 覆盖（含 `vite.config.js`、`tests/**`），并让 CI 使用与本地一致的 lint 范围。 |
| 警告 | 运行环境 | engines(Node>=18<22), 本地 node v22.19.0 | 本地 Node 22 与 engines/CI（18/20）不一致，可能引发“构建通过/部署失败”型问题（历史上 npm/rollup 可选依赖在 Node 22 环境下有兼容性议题）。 | 在项目/CI/开发机层面统一 Node 版本（建议 Node 20）。在仓库根添加 `.nvmrc`/文档提示并在 CI 明确 `setup-node` 版本矩阵。 |

ESLint 明细（机器可发现问题）：
- src/components/CompatNotice.jsx:42:81 no-empty（空 catch）
- src/components/ErrorBoundary.jsx:32:63 no-undef `__BUILD_ID__`
- src/components/Header.jsx:7:14 no-unused-vars `i18n`
- src/components/LanguageSwitcher.jsx:66:59 no-undef `__BUILD_ID__`
- src/components/LanguageSwitcherFixed.jsx:90:59 no-undef `__BUILD_ID__`
- src/runtime-fallback.js:2:58 no-undef `__BUILD_ID__`; 14:11 no-empty（空 catch）
- tests/layout.spec.js:41:23 no-empty-pattern（空解构）
- vite.config.js:9:123 no-empty；11:8 no-undef `process`
- src/i18n.js:81:7 warning 未使用的 eslint-disable

---

## 阶段二：核心架构与逻辑审查

- 入口/关键路径：`src/main.jsx`（挂载/性能上报）、`src/App.jsx`（多语言路由与页面拆分）、`src/components/Editor.jsx` + `src/hooks/useImageProcessor.js` + `src/utils/imageProcessor.js`（核心像素化与导出）。

| 风险等级 | 审计领域 | 问题定位 | 问题描述与战略影响 | 核心整改建议 |
|---|---|---|---|---|
| 建议 | 架构/状态流 | src/App.jsx: useLangRouting | 语言前缀注入依赖 `useEffect + navigate(replace)`，首屏存在轻微重定向跳变；但逻辑清晰且有存储/浏览器检测兜底。 | 可在服务器或 prerender 侧预生成语言首页并提供 302/CDN 规则，减少前端跳变。 |
| 建议 | 组件设计 | src/components/Editor.jsx(~240行) | 职责分拆相对良好（预览/导出/调色板/调节抽离），但组件体量接近边界，后续可维护性与复用性有压力。 | 按“面板/操作区/状态”进一步切分（例如导出/下载逻辑抽到 hook），保持组件 <150 行。 |
| 警告 | 代码组织 | src/utils/imageProcessor.js(>600行) | 算法集中过大，含 Worker 路由/调色/抖动/色彩空间等多职责，增加理解与回归风险。 | 拆分模块：worker-bridge、palette-utils、dithering、lab-color、export-helpers 等，导出清晰 API，利于单测覆盖。 |
| 警告 | 安全/健壮性 | src/runtime-fallback.js:8 | 使用 `innerHTML` 拼接并包含错误消息 `msg`，虽 CSP 较严且输入来源为错误对象，但仍属不必要的 XSS 面。 | 使用 DOM API 构建节点并插入 `textContent`，或对 `msg` 做转义。保持与 CSP“拒绝内联脚本”策略一致。 |
| 建议 | 可维护性 | src/components/LanguageSwitcher.jsx | 与 `LanguageSwitcherFixed.jsx` 存在重复实现且未被引用，易造成漂移。 | 合并实现或删除冗余文件，减少重复维护面。 |

亮点（正向发现）：
- 使用 Web Worker 进行 KMeans 计算，主线程通过 AbortController 可取消并复用 Worker 实例，避免抖动与阻塞。
- 预览缩放遵循“按布局尺寸缩放图片元素尺寸”而非 CSS transform，契合项目特定的滚动与布局一致性规则。

---

## 阶段三：构建系统与开发者体验（DX）审计

| 风险等级 | 审计领域 | 问题定位 | 问题描述与战略影响 | 核心整改建议 |
|---|---|---|---|---|
| 严重 | 构建门禁 | npm run build（postbuild） | `scripts/seo-check.js` 失败导致构建退出码 1；当前分支如启用 CI 将无法发布。 | 先统一 SEO 基线（见阶段一），短期可在 CI 将 SEO 检查改为“告警不阻断”，修复完成后再转“阻断”。 |
| 警告 | Lint 环境 | eslint.config.js | 未为 `vite.config.js`、`tests/**` 指定 Node/Playwright 环境，触发误报（如 `process` 未定义）。影响 DX 与 PR 通过率。 | 在 ESLint 配置增加针对 `vite.config.*`、`scripts/**`、`tests/**` 的 `globals: globals.node`/Playwright 覆盖。 |
| 建议 | 产物体积 | dist/assets/index-*.js ~346KB（gzip 109KB） | 首屏包体积中位偏高，移动端首开存在压力。 | 进一步分包：将 i18n backend/非首屏路由懒加载、拆分编辑器高级功能包；引入 `@vitejs/plugin-legacy`（按需）或预加载策略优化。 |
| 建议 | 配置健壮性 | vite.config.js: execSync git | 生产模式下从 git 提取短 Hash 作为 BUILD_ID，`catch{}` 空处理，少量环境下易产生空标识且 lint 报警。 | 为异常分支赋默认值并记录（dev warn），并修复空 catch（加入 `void 0` 或日志聚合）。 |

---

## 阶段四：质量保证与测试策略评估

| 风险等级 | 审计领域 | 问题定位 | 问题描述与战略影响 | 核心整改建议 |
|---|---|---|---|---|
| 警告 | E2E 选择器稳健性 | tests/pages.spec.js | 使用 `locator('h1:text("…")')` 风格，依赖文案稳定性；但整体已偏稳健（多处以 role/aria）。 | 优先使用可读性更强的 `getByRole/getByTestId`。对文案敏感处增加 `data-testid`。 |
| 建议 | 单测缺口 | utils/ 与 hooks/ | 核心像素化与调色逻辑缺少单测，问题只能由 E2E 兜底，定位回归成本高。 | 为 `palette utils`、`resizeImage`、`export helpers` 等纯函数补最小单测（不引入新框架，可用 Vitest/Node + JSDOM）。 |
| 建议 | Lint 与测试一致性 | tests/layout.spec.js:41 | 空对象解构导致 ESLint error，但 CI 未覆盖 tests 目录，可能出现“本地红、CI 绿”。 | 统一 lint 范围并修复该处写法（`async (_,_info)=>{}`）。 |

---

## 阶段五：依赖链与软件供应链安全审计

| 风险等级 | 审计领域 | 问题定位 | 问题描述与战略影响 | 核心整改建议 |
|---|---|---|---|---|
| 建议 | 依赖一致性 | root vs server/ | `sharp` 版本根与 server 子项目不同（0.34.x vs 0.33.x），可能重复安装、增大发布镜像体积。 | 若服务端方案长期保留，优先统一版本，必要时隔离独立仓库/镜像。 |
| 建议 | 审计流程 | package.json/lock | 未见自动化依赖审计（`npm audit`）在 CI 中运行；当前网络受限未执行本地审计。 | 在 CI 增加 `npm audit --omit=dev` 与周期开票；对高危项设阈值阻断。 |
| 警告 | 运行版本 | engines vs 本地 | engines 限定 `<22`，本地检测到 Node 22；潜在“本地 OK/线上不稳”的供应链漂移。 | 在 README/AGENTS.md 强化 Node 版本要求，并通过 `.nvmrc` 与 CI matrix 固化。 |

---

## 附：证据与本地验证记录

- Lint：`npm run lint` 输出 10 errors, 1 warning（已截断，见上明细）。
- Typecheck：`npx --no-install tsc --noEmit` 退出码 0。
- Build：`npm run build` 完成产物输出，但 postbuild SEO 检查失败（12/10 通过），退出码 1。
- Verify:dist：`node scripts/verify-dist-entries.cjs` 失败（期望非语言前缀路由缺失）。
- 关键文件：
  - 入口与路由：`src/main.jsx`、`src/App.jsx`
  - 编辑器与处理：`src/components/Editor.jsx`、`src/hooks/useImageProcessor.js`、`src/utils/imageProcessor.js`
  - Worker：`src/workers/kmeansWorker.js`
  - 构建：`vite.config.js`、`scripts/prerender-spa.cjs`、`scripts/seo-check.js`、`scripts/verify-dist-entries.cjs`
  - 测试：`tests/*.spec.js`

---

## 优先级行动清单（建议执行顺序）

1) 统一并修复门禁（高）：
- 将 CI 的 Lint 范围与本地一致，并修复以下问题：
  - `__BUILD_ID__` → 在 ESLint 配置声明只读全局或改为 `globalThis.__BUILD_ID__`/`import.meta.env.*` 注入。
  - 空 catch → 填入 `void 0` 或日志聚合，消除 `no-empty`。
  - tests 空解构 → 改为 `_` 占位。
  - `vite.config.js` 加 Node 环境覆盖，消除 `process` 误报。
- SEO 基线决策：修正文案或放宽校验规则，确保 postbuild 通过。
- `verify:dist` 与 prerender 路由策略对齐（是否需要无语言前缀页面）。

2) 架构与可维护性（中）：
- 拆分 `imageProcessor.js` 为多模块；为关键纯函数补最小单测。
- 合并/移除重复的 `LanguageSwitcher*` 实现。
- 将 `runtime-fallback.js` 由 `innerHTML` 改为安全 DOM API。

3) 体积与体验（中）：
- 进一步懒加载非首屏模块与 i18n 后端；评估首屏包压缩与关键资源预加载策略。

---

## 回滚与开关（建议）
- SEO 检查可临时通过环境开关降级为警告（如 `SEO_CHECK_MODE=warn`），便于先恢复构建；修复完成后再回归“阻断”。
- prerender 生成非前缀路由可作为可选开关（`PRERENDER_LEGACY_ROUTES=1`）。

## 已知问题与风险
- 由于网络限制，未执行 `npm audit` 与 Playwright 浏览器安装后的完整 E2E 套件；建议在 CI 中作为每日报告补齐。

---

如需，我可基于本报告直接提交最小修复 PR（Lint/SEO/Verify 对齐），并补充 2-3 个针对纯函数的单测以降低回归风险。

