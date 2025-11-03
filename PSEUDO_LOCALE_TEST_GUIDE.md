# 伪本地化测试指南

**目的**: 检测应用中的硬编码文本  
**方法**: 使用伪本地化（Pseudo-localization）将所有文本转换为特殊字符  
**原理**: 如果看到正常的英文文本，说明该文本是硬编码的，没有使用 i18n

---

## 🎯 什么是伪本地化？

伪本地化会将所有翻译文本转换为特殊格式：

```
正常文本:  "Examples"
伪本地化:  "［‼ Ēẋåɱƥŀēś ‼］"

正常文本:  "Image to Pixel Art Converter"
伪本地化:  "［‼ Įɱåǥē ŧö Ƥįẋēŀ Åŗŧ Ćöńṽēŗŧēŗ ‼］"
```

**特点**:
- 使用特殊字符（ẋ, å, ɱ, ƥ, ŀ, ē, ś 等）
- 添加前缀 `［‼ ` 和后缀 ` ‼］`
- 文本长度增加约 40%（模拟某些语言的长度）
- 仍然可读，但明显不同于正常英文

---

## 🚀 如何运行伪本地化测试

### 步骤 1: 生成伪本地化文件

```powershell
npm run i18n:pseudo
```

**预期输出**:
```
✅ Pseudo-locale generated at public/locales/pseudo/translation.json
```

### 步骤 2: 启动开发服务器（启用伪本地化）

**Windows PowerShell**:
```powershell
$env:VITE_ENABLE_PSEUDO="1"
npm run dev
```

**Windows CMD**:
```cmd
set VITE_ENABLE_PSEUDO=1
npm run dev
```

**Linux/Mac**:
```bash
VITE_ENABLE_PSEUDO=1 npm run dev
```

### 步骤 3: 在浏览器中测试

1. 打开浏览器访问 `http://localhost:5173`
2. 点击语言切换器（通常在页面右上角）
3. 选择 **"[Pseudo]"** 语言
4. 浏览所有页面和功能

---

## 🔍 如何检查

### ✅ 正确的情况（已国际化）

所有文本应该显示为伪本地化格式：

```
导航栏:
［‼ Ēẋåɱƥŀēś ‼］
［‼ Ƒēåŧüŗēś ‼］
［‼ Ĥöŵ įŧ ŵöŗķś ‼］
［‼ ƑÅQ ‼］

按钮:
［‼ Śŧåŗŧ Ńöŵ ‼］
［‼ Ũƥŀöåð Įɱåǥē ‼］
［‼ Ēẋƥöŗŧ ‼］

标题:
［‼ Ƒŗēē Öńŀįńē Ƥįẋēŀ Åŗŧ Ćöńṽēŗŧēŗ ‼］
```

### ❌ 错误的情况（硬编码）

如果看到正常的英文文本，说明有硬编码：

```
导航栏:
［‼ Ēẋåɱƥŀēś ‼］
［‼ Ƒēåŧüŗēś ‼］
How it works              ← ❌ 硬编码！
［‼ ƑÅQ ‼］

按钮:
［‼ Śŧåŗŧ Ńöŵ ‼］
Upload Image              ← ❌ 硬编码！
［‼ Ēẋƥöŗŧ ‼］

错误消息:
File size too large       ← ❌ 硬编码！
```

---

## 📋 测试检查清单

### 页面级别测试

- [ ] **首页 (`/`)**
  - [ ] 导航栏所有链接
  - [ ] Hero 区域标题和描述
  - [ ] CTA 按钮
  - [ ] 功能列表
  - [ ] 示例展示
  - [ ] FAQ 部分
  - [ ] 页脚所有链接和文本

- [ ] **编辑器 (`/`)**
  - [ ] 上传按钮和提示
  - [ ] 调整控制标签（像素大小、亮度等）
  - [ ] 导出面板选项
  - [ ] 错误消息
  - [ ] 成功消息
  - [ ] 工具提示（hover 时显示）

- [ ] **关于页面 (`/about/`)**
  - [ ] 页面标题
  - [ ] 所有段落文本
  - [ ] 链接文本

- [ ] **联系页面 (`/contact/`)**
  - [ ] 表单标签
  - [ ] 占位符文本
  - [ ] 提交按钮
  - [ ] 验证消息

- [ ] **隐私政策 (`/privacy/`)**
  - [ ] 所有标题
  - [ ] 所有段落文本

- [ ] **服务条款 (`/terms/`)**
  - [ ] 所有标题
  - [ ] 所有段落文本

- [ ] **博客 (`/blog/`)**
  - [ ] 博客列表标题
  - [ ] 文章标题
  - [ ] 日期格式
  - [ ] "阅读更多" 按钮

### 交互级别测试

- [ ] **语言切换器**
  - [ ] 语言名称显示
  - [ ] 切换后 URL 变化
  - [ ] 切换后内容变化

- [ ] **图片上传**
  - [ ] 拖放区域文本
  - [ ] 文件选择按钮
  - [ ] 上传进度文本
  - [ ] 错误消息（尝试上传无效文件）

- [ ] **调整控制**
  - [ ] 滑块标签
  - [ ] 数值显示
  - [ ] 重置按钮

- [ ] **导出功能**
  - [ ] 格式选项（PNG, JPG, WebP）
  - [ ] 质量设置
  - [ ] 下载按钮
  - [ ] 成功消息

- [ ] **错误处理**
  - [ ] 网络错误消息
  - [ ] 文件大小错误
  - [ ] 格式不支持错误
  - [ ] 浏览器不支持消息

### 特殊情况测试

- [ ] **动态内容**
  - [ ] 日期格式（如 "Last updated: 2025-11-01"）
  - [ ] 数字格式（如 "Pixel size: 8"）
  - [ ] 百分比（如 "Brightness: 100%"）

- [ ] **Aria 标签**
  - [ ] 使用屏幕阅读器测试
  - [ ] 检查 `aria-label` 属性
  - [ ] 检查 `title` 属性

- [ ] **Meta 标签**
  - [ ] 查看页面源代码
  - [ ] 检查 `<title>` 标签
  - [ ] 检查 `<meta name="description">` 标签
  - [ ] 检查 Open Graph 标签

---

## 🐛 发现硬编码后如何修复

### 示例 1: 简单文本

**问题**:
```jsx
<button>Upload Image</button>  // ❌ 硬编码
```

**修复**:
```jsx
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation()
  return <button>{t('editor.uploadImage')}</button>  // ✅ 正确
}
```

**添加翻译键**:
```json
// public/locales/en/translation.json
{
  "editor": {
    "uploadImage": "Upload Image"
  }
}
```

### 示例 2: 带插值的文本

**问题**:
```jsx
<p>Pixel size: {pixelSize}</p>  // ❌ 硬编码
```

**修复**:
```jsx
const { t } = useTranslation()
return <p>{t('adjustments.pixelSize', { value: pixelSize })}</p>  // ✅ 正确
```

**添加翻译键**:
```json
{
  "adjustments": {
    "pixelSize": "Pixel size: {{value}}"
  }
}
```

### 示例 3: 复杂文本（含链接）

**问题**:
```jsx
<p>
  Read our <a href="/privacy/">privacy policy</a> for more info.
</p>  // ❌ 硬编码
```

**修复**:
```jsx
import { Trans } from 'react-i18next'
import LocalizedLink from '@/components/LocalizedLink'

<Trans
  i18nKey="footer.privacyInfo"
  components={{
    link: <LocalizedLink to="/privacy/" className="underline" />
  }}
/>  // ✅ 正确
```

**添加翻译键**:
```json
{
  "footer": {
    "privacyInfo": "Read our <link>privacy policy</link> for more info."
  }
}
```

---

## 📊 测试结果记录模板

```markdown
# 伪本地化测试结果

**测试日期**: 2025-11-01  
**测试人**: [你的名字]  
**浏览器**: Chrome 120 / Firefox 121 / Safari 17

## 发现的硬编码文本

### 1. 首页导航栏
- **位置**: Header.jsx, line 45
- **硬编码文本**: "How it works"
- **应该使用**: `t('nav.how')`
- **优先级**: 🔴 高

### 2. 上传按钮
- **位置**: Editor.jsx, line 123
- **硬编码文本**: "Upload Image"
- **应该使用**: `t('editor.uploadImage')`
- **优先级**: 🔴 高

### 3. 错误消息
- **位置**: ExportPanel.jsx, line 67
- **硬编码文本**: "File size too large"
- **应该使用**: `t('errors.fileTooLarge')`
- **优先级**: 🟡 中

## 总结
- 发现硬编码: 3 处
- 高优先级: 2 处
- 中优先级: 1 处
- 低优先级: 0 处
```

---

## 🎉 测试通过标准

当满足以下条件时，伪本地化测试通过：

✅ **所有用户可见文本都显示为伪本地化格式**  
✅ **无正常英文文本出现**  
✅ **所有交互和错误消息都已国际化**  
✅ **动态内容正确显示**  
✅ **Aria 标签和 Meta 标签已国际化**

---

## 🔧 常见问题

### Q: 伪本地化语言选项没有出现？
**A**: 确保设置了环境变量 `VITE_ENABLE_PSEUDO=1` 并重启开发服务器。

### Q: 切换到伪本地化后页面空白？
**A**: 检查浏览器控制台是否有错误。可能是 `public/locales/pseudo/translation.json` 文件格式错误。

### Q: 某些文本显示为 `undefined` 或翻译键？
**A**: 说明翻译键不存在。检查：
1. 键是否在 `public/locales/en/translation.json` 中
2. 是否运行了 `npm run i18n:pseudo`
3. 键名是否拼写正确

### Q: 技术术语（如 "PNG", "JPEG"）需要伪本地化吗？
**A**: 是的！即使是技术术语也应该通过 i18n 系统。这样可以：
- 确保一致性
- 允许某些语言使用本地化术语
- 便于未来修改

---

## 📚 相关文档

- [I18N_QUICK_CHECKLIST.md](./I18N_QUICK_CHECKLIST.md) - 日常开发检查清单
- [I18N_VERIFICATION_REPORT.md](./I18N_VERIFICATION_REPORT.md) - 验证报告
- [README-i18n.md](./README-i18n.md) - 完整的多语言指南

---

**最后更新**: 2025-11-01

