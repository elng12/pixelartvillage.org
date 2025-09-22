# Quality Gates

本项目的合并/发布必须满足以下最低门槛（DoD）：

## 必过检查
- Lint（源码与脚本）：`npm run lint:ci` 通过。
- 类型检查：`npm run typecheck` 通过。
- 构建：`npm run build` 通过。
- 构建产物校验：`npm run verify:dist` 通过（检查 `dist/privacy.html`、`dist/terms.html`、`dist/about.html`、`dist/contact.html` 均存在且已注入 `/assets/*.js/.css`）。
- 社交图与元信息：校验 `dist` 下存在 `social-privacy.png`、`social-terms.png`、`social-about.png`、`social-contact.png`，且四页 HTML 的 `og:image`/`twitter:image` 指向对应文件（由 `verify:dist` 自动检查）。
- 直链探活 E2E：`npx playwright test tests/pages.spec.js --project=chromium` 通过（验证四个页面标题/核心区块可见与邮箱链接可见）。
- Sitemap 同步覆盖四个直链页面。

## 本地验证命令
1. `npm ci`
2. `npm run lint:ci`
3. `npm run typecheck`
4. `npm run build`
5. `npm run verify:dist`
6. 首次安装浏览器：`npx playwright install --with-deps`（非 CI 可省略 `--with-deps`）
7. 仅跑直链用例：`npx playwright test tests/pages.spec.js --project=chromium`

## CI 建议（与示例）
- 在 `.github/workflows/ci.yml` 中串联上述命令，失败即阻断。
- E2E 仅跑 `tests/pages.spec.js` 且仅限 `chromium`，确保快速稳定。
- 失败时上传 Playwright HTML 报告以便排障。

## 相关文档
- AdSense 与 Consent Mode 脚本顺序：`docs/ADSENSE_CONSENT.md`

## 分支保护建议（GitHub 设置）
在仓库 Settings → Branches → Branch protection rules：
- 保护 `main`（或你的默认分支）。
- 启用 “Require status checks to pass before merging”。
- 选择 CI 的必过检查（Actions 列表中的 CI 工作流）。
- 可选：Require linear history、Require PR reviews、Restrict who can push。
