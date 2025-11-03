# 技术环境与依赖

## 开发环境
- 操作系统: Windows 10+ (当前环境 Win32)
- Node 版本: 22.18.0
- 包管理器: npm (package-lock.json 存在)
- 项目路径: `f:\Git des\pixelartvillage.org`

## 依赖
- react 18.x
- react-dom 18.x
- react-router-dom 6.x
- i18next 23.x
- react-i18next 13.x
- i18next-http-backend 2.x
- tailwindcss 3.x
- postcss, autoprefixer
- eslint, prettier

## 构建配置
- Vite + Tailwind
- `vite.config.js` 自定义设置（待阅读详解）
- `eslint.config.js` 自定义规则

## 文件结构
- `src/` React 源码
- `public/locales/` 多语言翻译资源
- `config/locales.json` 语言配置
- `scripts/` 工具脚本

## 运行命令
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run test`

## 注意事项
- 项目启用了 ES Module (`package.json` 中 type: module)
- 部分脚本需使用 `.cjs` 扩展
- 翻译资源需要保持 JSON 格式正确
- 优先使用绝对路径（webpack alias `@` 对应 `src/`）