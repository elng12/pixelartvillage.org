# 项目说明

- 全局开发规范文件位置：Windows `C:\Users\elng\.codex\AGENTS.md`，WSL/Linux `~/.codex/AGENTS.md`。
- 若本仓库根目录存在 `AGENTS.md`（本仓已提供），以仓库内为准；否则遵循上述全局文件。

## 运行与构建

环境要求
- Node.js（建议 18+）与 npm（或按项目锁文件使用 pnpm/yarn）。

安装依赖（首次或依赖变更后）
- `npm ci`（优先，需有 `package-lock.json`）
- 或 `npm install`

本地开发（如已配置）
- `npm run dev`

构建
- `npm run build`

类型检查
- `npm run typecheck`

测试（如已配置）
- `npm test`

预览构建产物（如已配置）
- `npm run preview`

说明
- 以上脚本以项目 `package.json` 的 `scripts` 为准；若某脚本未配置，可在 `package.json` 中补充或告知我按你的要求添加。
