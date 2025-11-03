# 翻译修复指南

## 问题总结

扫描发现大量英文残留：

| 语言 | 英文残留数量 | 状态 |
|------|-------------|------|
| 韩语 (ko) | 138 处 | ⚠️ 需要修复 |
| 日语 (ja) | 227 处 | ⚠️ 需要修复 |
| 法语 (fr) | 350+ 处 | ⚠️ 需要修复 |

## 修复方案

### 方案 1: 使用自动翻译脚本（推荐）⭐

我已经创建了 `scripts/force-retranslate.cjs` 脚本，可以自动检测并翻译所有英文残留。

#### 步骤：

1. **配置 API 密钥**

创建 `.env` 文件：

```bash
# 使用 MiniMax API (推荐)
TRANSLATE_PROVIDER=minimax
ANTHROPIC_AUTH_TOKEN=your_api_key_here
ANTHROPIC_BASE_URL=https://api.minimaxi.com/anthropic

# 或者使用本地 LibreTranslate
# TRANSLATE_PROVIDER=libre
# LIBRETRANSLATE_URL=http://localhost:5000/translate
```

2. **运行翻译脚本**

```bash
# 翻译所有三种语言（ko, ja, fr）
node scripts/force-retranslate.cjs

# 或者只翻译特定语言
node scripts/force-retranslate.cjs ko
node scripts/force-retranslate.cjs ja
node scripts/force-retranslate.cjs fr
```

#### 优点：
- ✅ 自动化，快速
- ✅ 保留占位符（{{name}}, {{date}} 等）
- ✅ 使用术语表保持一致性
- ✅ 有缓存机制，避免重复翻译

#### 缺点：
- ⚠️ 需要 API 密钥（MiniMax 或 LibreTranslate）
- ⚠️ 机器翻译可能需要人工审校

---

### 方案 2: 使用 LibreTranslate（免费本地方案）

如果你不想使用付费 API，可以运行本地 LibreTranslate 服务器：

```bash
# 使用 Docker 运行 LibreTranslate
docker run -ti --rm -p 5000:5000 libretranslate/libretranslate

# 然后配置 .env
TRANSLATE_PROVIDER=libre
LIBRETRANSLATE_URL=http://localhost:5000/translate

# 运行翻译
node scripts/force-retranslate.cjs
```

---

### 方案 3: 手动翻译（最准确但最耗时）

如果你想要最高质量的翻译，可以手动翻译这些内容。

#### 查看需要翻译的内容：

```bash
# 查看韩语中的英文残留
node scripts/find-english-in-translations.cjs ko

# 查看日语中的英文残留
node scripts/find-english-in-translations.cjs ja

# 查看法语中的英文残留
node scripts/find-english-in-translations.cjs fr
```

#### 手动编辑文件：

- `public/locales/ko/translation.json`
- `public/locales/ja/translation.json`
- `public/locales/fr/translation.json`

---

## 主要需要翻译的内容类别

根据扫描结果，以下是主要的英文残留类别：

### 1. 页面内容（最多）
- Privacy Policy 页面
- Terms of Service 页面
- About 页面
- Contact 页面
- FAQ 页面

### 2. UI 标签和按钮
- `editor.downloadBtn`: "Download Pixel Art Image"
- `editor.uploadBtn`: "Upload Image"
- `adjustments.reset.*`: "Reset Sliders", "Reset All" 等

### 3. SEO 元数据
- `*.seoTitle`
- `*.seoDesc`
- `*.ogTitle`
- `*.ogDescription`
- `*.twitterTitle`
- `*.twitterDescription`

### 4. 功能描述
- `features.*`: 所有功能描述
- `wplace.*`: 工作区描述
- `showcase.*`: 展示区描述

### 5. 相关链接和指南
- `related.converters.*`: 相关转换器
- `related.guides.*`: 相关指南

---

## 快速开始（推荐流程）

### 如果你有 MiniMax API 密钥：

```bash
# 1. 创建 .env 文件
echo "TRANSLATE_PROVIDER=minimax" > .env
echo "ANTHROPIC_AUTH_TOKEN=your_key_here" >> .env
echo "ANTHROPIC_BASE_URL=https://api.minimaxi.com/anthropic" >> .env

# 2. 运行翻译（预计 10-20 分钟）
node scripts/force-retranslate.cjs

# 3. 验证结果
node scripts/find-english-in-translations.cjs ko ja fr

# 4. 测试
npm run dev
# 在浏览器中切换到 ko, ja, fr 语言查看效果
```

### 如果你没有 API 密钥：

**选项 A**: 使用本地 LibreTranslate（见方案 2）

**选项 B**: 我可以帮你手动翻译最关键的 UI 部分（约 50-100 个字符串），然后你可以决定是否需要翻译其余的页面内容。

---

## 预估工作量

| 方案 | 时间 | 成本 | 质量 |
|------|------|------|------|
| 自动翻译 (MiniMax) | 10-20 分钟 | ~$1-5 | 8/10 ⭐⭐⭐⭐ |
| 自动翻译 (LibreTranslate) | 20-30 分钟 | 免费 | 6/10 ⭐⭐⭐ |
| 手动翻译 | 20-40 小时 | 免费 | 10/10 ⭐⭐⭐⭐⭐ |
| 混合方案（自动+审校） | 2-4 小时 | ~$1-5 | 9/10 ⭐⭐⭐⭐⭐ |

---

## 下一步

请告诉我你想使用哪个方案：

1. **方案 1**: 我有 API 密钥，想用自动翻译
2. **方案 2**: 我想用本地 LibreTranslate
3. **方案 3**: 我想先手动翻译最关键的 UI 部分

或者你有其他想法？

