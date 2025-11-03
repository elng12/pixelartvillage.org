# Cloudflare Pages 部署指南

## 构建配置

在 Cloudflare Pages 项目设置中：

```yaml
Framework preset: None (or Vite)
Build command: npm run build
Build output directory: dist
Root directory: / (or blank)
Node version: 20
```

## 环境变量（可选）

```
NODE_VERSION=20
```

## 部署步骤

### 1. 推送代码到 GitHub

```bash
git add .
git commit -m "your message"
git push origin main
```

### 2. 检查部署状态

访问：`https://dash.cloudflare.com/`
- Workers & Pages → 你的项目 → Deployments

### 3. 清除缓存（重要！）

**每次部署后必须清除缓存！**

#### 方法A：清除所有缓存
1. Cloudflare Dashboard
2. 选择域名 → Caching → Configuration
3. 点击 "Purge Everything"

#### 方法B：清除特定URL
1. Caching → Custom Purge
2. 输入URL：
   ```
   https://pixelartvillage.org/blog/
   https://pixelartvillage.org/blog/best-pixel-art-converters-compared-2025/
   ```

### 4. 验证部署

访问：
```
https://pixelartvillage.org/blog/
```

使用硬刷新：`Ctrl + F5`

## 常见问题

### Q: 部署成功但网站还是旧版本？
**A**: 清除 Cloudflare 缓存（见上方步骤3）

### Q: 新页面显示404？
**A**: 
1. 检查部署是否成功
2. 清除缓存
3. 等待5分钟让CDN同步

### Q: 构建失败？
**A**: 
1. 检查 Build log 查看错误
2. 确认 Node 版本是 20.x
3. 确认 Build command 是 `npm run build`

## 重新触发部署

如果需要强制重新部署：

### 方法1：Cloudflare Dashboard
Workers & Pages → 项目 → Deployments → "Retry deployment"

### 方法2：推送空提交
```bash
git commit --allow-empty -m "chore: trigger redeploy"
git push origin main
```

## 调试技巧

### 查看构建日志
Deployments → 点击具体的 deployment → "View build log"

### 本地测试构建
```bash
npm run build
npm run preview
```

### 验证生成的文件
检查 `dist/blog/` 目录下是否有新文章：
```bash
ls dist/blog/
```

应该看到：
```
best-pixel-art-converters-compared-2025/
  index.html
```















