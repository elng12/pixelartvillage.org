# Cloudflare Pages 部署指南

## 🎯 问题解决方案

你的 pixelartvillage.org 网站出现 404 错误的原因是 Next.js 配置不适合 Cloudflare Pages 的静态托管。现在已经修复！

## ✅ 已完成的修复

### 1. 修改了 `next.config.ts`
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',           // 启用静态导出
  trailingSlash: true,        // 添加尾部斜杠
  images: {
    unoptimized: true         // 禁用图像优化（静态导出需要）
  },
  assetPrefix: ''             // 确保静态资源路径正确
};

export default nextConfig;
```

### 2. 更新了 `package.json` 构建脚本
```json
{
  "scripts": {
    "build": "next build",    // 移除了 --turbopack 标志
    "export": "next build"    // 添加了导出命令
  }
}
```

### 3. 修复了代码问题
- 移除了未使用的 `Image` 导入
- 修复了 JSX 中的单引号转义问题

## 🚀 Cloudflare Pages 部署设置

### 在 Cloudflare Pages 控制台中设置：

1. **构建命令**: `npm run build`
2. **构建输出目录**: `out`
3. **Node.js 版本**: `18.x` 或更高
4. **环境变量**: 无需特殊设置

### 部署步骤：

1. 将修复后的代码推送到你的 Git 仓库
2. 在 Cloudflare Pages 中触发新的部署
3. 确认构建设置如上所述
4. 等待部署完成

## 📁 生成的文件结构

构建成功后，`out` 目录包含：
```
out/
├── index.html          # 主页
├── converter/
│   └── index.html      # 转换器页面
├── _next/              # Next.js 静态资源
├── 404.html           # 404 错误页面
└── 其他静态资源...
```

## 🔧 验证构建

本地验证命令：
```bash
cd pixel-art-app
npm run build
```

构建成功的标志：
- ✅ 编译成功
- ✅ 生成静态页面 (6/6)
- ✅ 导出成功 (2/2)
- ✅ `out` 目录包含所有必要文件

## 🌐 部署后验证

部署完成后，你的网站应该能够正常访问：
- https://pixelartvillage.org - 主页
- https://pixelartvillage.org/converter/ - 转换器页面

## 🆘 如果仍有问题

如果部署后仍然出现 404 错误，请检查：

1. **Cloudflare Pages 构建日志** - 确认构建成功
2. **构建输出目录设置** - 必须是 `out`
3. **自定义域名设置** - 确认 DNS 记录正确
4. **缓存问题** - 尝试清除浏览器缓存或使用无痕模式

## 📞 技术支持

如果需要进一步帮助，请提供：
- Cloudflare Pages 构建日志
- 具体的错误信息
- 浏览器开发者工具中的网络请求信息

---

**状态**: ✅ 修复完成，准备部署
**最后更新**: 2025/9/13 16:14