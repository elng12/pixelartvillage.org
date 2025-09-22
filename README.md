# Pixel Art Village

Pixel Art Village 是一个免费、完全在浏览器中运行的在线工具，用于将普通图片（如 PNG、JPG）转换为像素艺术风格。它提供实时预览、像素大小调整、调色板管理和高级抖动算法，所有处理均在用户本地完成，以确保隐私安全。

## ✨ 核心功能

- **纯客户端处理**: 图片永远不会离开你的设备，保证了 100% 的隐私安全。
- **实时预览**: 所有调整（像素大小、颜色、调色板）都能即时反馈，所见即所得。
- **高级色彩控制**:
  - 支持多种内置调色板 (Pico-8, etc.)。
  - 可从图片中自动提取主色调生成新调色板。
  - 支持创建并保存自定义调色板。
- **抖动算法**: 内置 Floyd–Steinberg 抖动算法，用于在有限颜色下创建更平滑的色阶过渡。
- **可调导出选项**: 支持导出为 PNG, JPEG, WebP 格式，并可选择放大倍率和背景透明度。

## 🛠️ 技术栈

- **前端**: React, Vite, Tailwind CSS
- **测试**: Playwright
- **图像处理**: 使用原生 Canvas API 和 Web Workers 进行性能优化
- **构建/脚本**: Node.js

## 🚀 本地开发指南

### 环境要求

- [Node.js](https://nodejs.org/) (版本 `20.x` 或更高)
- [npm](https://www.npmjs.com/) (通常随 Node.js 一起安装)

### 安装与启动

1.  **克隆仓库**
    ```bash
    git clone https://github.com/your-username/pixelartvillage.org.git
    cd pixelartvillage.org
    ```

2.  **安装依赖**
    为了保证依赖版本的一致性，请使用 `npm ci`：
    ```bash
    npm ci
    ```

3.  **启动开发服务器**
    此命令会同时启动 Vite 开发服务器和相关的文件监视脚本。
    ```bash
    npm run dev
    ```
    应用将在 `http://localhost:5173` 上可用。

## 📜 可用脚本命令

- `npm run dev`: 启动开发服务器，支持热重载。
- `npm run build`: 构建用于生产环境的静态文件到 `dist` 目录。
- `npm run preview`: 在本地预览生产构建的成果。
- `npm run lint`: 使用 ESLint 检查代码规范。
- `npm run typecheck`: 使用 `tsc` 对项目进行类型检查。
- `npm test` 或 `npm run test:e2e`: 运行 Playwright 端到端测试。
- `npm run verify:dist`: 在构建后校验 `dist` 目录的产物是否符合预期。
- `npm run gen:all`: 运行所有资产生成脚本（图标、社交图片、站点地图等）。

## 🏗️ 项目架构

本项目是一个**单页应用 (Single-Page Application, SPA)**，使用 Vite 进行构建。

- **`src/`**: 包含所有 React 组件、Hooks、工具函数和核心应用逻辑。
  - `components/`: 可复用的 React 组件。
  - `hooks/`: 自定义 Hooks，用于封装复杂逻辑。
  - `utils/`: 通用工具函数，如图像处理逻辑。
  - `workers/`: Web Worker 脚本，用于在后台线程执行计算密集型任务（如 K-Means 调色板生成）。
- **`public/`**: 存放静态资源，这些资源在构建时会被直接复制到 `dist` 根目录。
- **`scripts/`**: 包含用于开发和构建流程的 Node.js 辅助脚本。
- **`tests/`**: 包含 Playwright 端到端测试文件。

## 🧪 测试

项目使用 Playwright 进行端到端测试，以确保关键用户流程的正确性。

- **运行所有测试**:
  ```bash
  npm test
  ```
- **打开 UI 模式进行调试**:
  ```bash
  npx playwright test --ui
  ```

## 🤝 贡献

我们欢迎任何形式的贡献。请在提交 Pull Request 前确保：
1. 遵循现有的代码风格。
2. 通过所有的 Lint 和类型检查 (`npm run lint` & `npm run typecheck`)。
3. 相关的测试用例已添加或更新。
## Development Environment

- Recommended Node.js: 18.x or 20.x (avoid Node 22 due to npm optional-deps issue with Rollup).
- Use nvm to switch: `nvm use 20` (this repo ships `.nvmrc` with Node 20).
- Fresh install if you switched Node: `rm -rf node_modules package-lock.json && npm ci`.

### Build & Verify

- Build (includes prerender + OG image generation): `npm run build`
- Verify production artifacts (SEO checks): `npm run verify:dist`
