# Pixel Art Village - 项目开发指南

## 项目概述

Pixel Art Village 是一个免费的在线像素艺术转换工具，完全在浏览器中运行，无需上传图片到服务器，确保用户隐私安全。该工具提供实时预览、像素大小调整、调色板管理和高级抖动算法等功能。

### 核心特性
- **纯客户端处理**: 图片永远不会离开用户设备，100% 隐私安全
- **实时预览**: 所有调整（像素大小、颜色、调色板）即时反馈
- **高级色彩控制**: 支持多种内置调色板、自动提取主色调、自定义调色板
- **抖动算法**: 内置 Floyd–Steinberg 抖动算法
- **可调导出选项**: 支持 PNG、JPEG、WebP 格式导出

## 技术栈

- **前端框架**: React 19 + Vite
- **样式**: Tailwind CSS v4
- **路由**: React Router DOM v7
- **国际化**: i18next + react-i18next
- **测试**: Playwright (端到端测试)
- **图像处理**: 原生 Canvas API + Web Workers
- **构建工具**: Node.js (18.x-20.x)

## 项目架构

### 架构模式
**纯单页应用 (SPA)** - 已从事务性的MPA+SPA混合架构重构为现代化SPA

### 目录结构
```
src/
├── components/          # React组件
│   ├── editor/         # 编辑器相关组件
│   └── policy/         # 政策页面组件
├── hooks/              # 自定义Hooks
├── utils/              # 工具函数
│   ├── imageProcessor.js    # 核心图像处理逻辑
│   ├── palette-*.js         # 调色板相关工具
│   └── resizeImage.js       # 图片缩放工具
├── workers/            # Web Workers
│   └── kmeansWorker.js # K-Means聚类算法Worker
├── constants/          # 常量定义
└── content/           # 内容数据 (博客文章等)

scripts/               # 构建和开发脚本
public/               # 静态资源
tests/                # Playwright测试
server/               # 服务器相关文件
```

## 开发指南

### 环境要求
- Node.js: 18.x 或 20.x (避免使用22.x)
- npm: 随Node.js一起安装

### 快速开始
```bash
# 使用正确的Node.js版本
nvm use 20

# 安装依赖
npm ci

# 启动开发服务器
npm run dev
# 应用将在 http://localhost:5173 可用
```

### 核心命令
```bash
# 开发
npm run dev              # 启动开发服务器
npm run preview          # 预览生产构建

# 构建
npm run build            # 生产构建
npm run verify:dist      # 验证构建产物

# 代码质量
npm run lint             # ESLint检查
npm run typecheck        # TypeScript类型检查
npm run format           # Prettier格式化

# 测试
npm test                 # 运行Playwright测试
npm run test:ui          # Playwright UI模式

# 生成
npm run gen:all          # 生成所有资源（图标、社交图片等）
```

## 核心功能实现

### 图像处理流程
1. **图片加载**: 使用 `loadImage()` 函数将图片数据加载为HTMLImageElement
2. **预处理**: 应用亮度、对比度、饱和度滤镜
3. **像素化**: 通过降采样实现像素化效果
4. **调色板量化**: 
   - 支持预设调色板 (Pico-8等)
   - 自动调色板提取 (K-Means算法)
   - 自定义调色板
5. **抖动处理**: 可选的Floyd-Steinberg抖动算法
6. **导出**: 支持多种格式和缩放选项

### 性能优化
- **Web Workers**: K-Means聚类算法在Worker中运行，避免阻塞主线程
- **LRU缓存**: 调色板提取结果缓存，提高重复处理性能
- **防抖处理**: 图像处理Hook使用300ms防抖，避免频繁计算
- **信号控制**: 使用AbortController支持处理取消

### 状态管理
- **React状态**: 使用useState管理组件状态
- **自定义Hooks**: `useImageProcessor` 封装图像处理逻辑
- **本地存储**: 调色板数据支持本地存储

## 开发规范

### 代码风格
- **ESLint**: 使用 `@eslint/js` 和React插件
- **Prettier**: 代码格式化
- **TypeScript**: 类型检查 (noEmit模式)
- **命名规范**: 组件使用PascalCase，工具函数使用camelCase

### 文件组织
- **组件**: 按功能模块组织，支持懒加载
- **工具函数**: 按功能分类，如图像处理、调色板等
- **常量**: 集中管理调色板、配置等常量

### 性能考虑
- **懒加载**: 路由组件使用React.lazy进行代码分割
- **图片优化**: 支持响应式图片和WebP格式
- **缓存策略**: 合理使用浏览器缓存和内存缓存

## 部署配置

### 构建配置
- **Vite**: 现代化构建工具，支持快速开发和构建
- **PostCSS**: 配合Tailwind CSS使用
- **输出**: 静态文件输出到 `dist/` 目录

### 部署平台
- **Netlify**: 主要部署平台，支持SPA路由回退
- **GitHub Pages**: 备用部署选项

### SEO优化
- **预渲染**: 构建时生成静态HTML
- **元数据**: 动态设置页面标题和meta标签
- **站点地图**: 自动生成XML站点地图
- **社交图片**: 自动生成Open Graph和Twitter卡片图片

## 测试策略

### 端到端测试
- **Playwright**: 测试关键用户流程
- **测试覆盖**: 页面可见性、核心功能流程
- **CI集成**: GitHub Actions自动运行测试

### 测试命令
```bash
# 运行所有测试
npm test

# UI模式调试
npm run test:ui

# 特定测试文件
npx playwright test tests/pages.spec.js
```

## 故障排除

### 常见问题
1. **Node.js版本**: 确保使用18.x或20.x，避免22.x
2. **依赖安装**: 使用 `npm ci` 而非 `npm install`
3. **构建失败**: 检查是否通过了lint和typecheck
4. **测试失败**: 确保安装了Playwright浏览器

### 调试技巧
- **开发模式**: 使用 `npm run dev` 和热重载
- **Playwright调试**: 使用UI模式进行可视化调试
- **构建分析**: 使用 `npm run verify:dist` 检查构建产物

## 扩展开发

### 添加新功能
1. **组件开发**: 在 `src/components/` 目录创建新组件
2. **工具函数**: 在 `src/utils/` 添加相应的工具函数
3. **状态管理**: 考虑是否需要新的自定义Hook
4. **测试覆盖**: 为关键功能添加Playwright测试

### 性能监控
- **Web Vitals**: 集成核心Web指标监控
- **错误边界**: 使用ErrorBoundary组件处理错误
- **用户反馈**: 考虑添加性能反馈机制

这个指南提供了Pixel Art Village项目的全面概述，帮助开发者快速理解和参与项目开发。