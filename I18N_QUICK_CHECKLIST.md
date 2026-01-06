# 多语言（i18n）快速检查清单

## 🚀 日常开发检查

### 添加新文本时
- [ ] 在 `public/locales/en/translation.json` 中添加翻译键
- [ ] 在组件中使用 `t('your.key')` 而非硬编码
- [ ] 运行 `npm run i18n:check` 确认键一致性
- [ ] 运行 `node scripts/sync-translation-keys.cjs` 同步到其他语言

### 添加新组件时
- [ ] 导入 `useTranslation`: `import { useTranslation } from 'react-i18next'`
- [ ] 在组件内调用: `const { t } = useTranslation()`
- [ ] 所有用户可见文本使用 `t()` 函数
- [ ] 复杂文本（含链接）使用 `<Trans>` 组件

### 提交代码前
- [ ] 运行 `npm run i18n:check` - 确认键一致性
- [ ] 运行伪本地化测试（见下方）
- [ ] 检查是否有硬编码文本

---

## 🧪 伪本地化测试（检测硬编码）

### Windows PowerShell
```powershell
# 1. 生成伪本地化文件
npm run i18n:pseudo

# 2. 启动开发服务器（启用伪本地化）
$env:VITE_ENABLE_PSEUDO="1"
npm run dev

# 3. 在浏览器中：
#    - 访问 http://localhost:5173
#    - 切换语言到 "pseudo"
#    - 浏览所有页面
#    - 检查是否有正常的英文文本（硬编码）
```

### Windows CMD
```cmd
npm run i18n:pseudo
set VITE_ENABLE_PSEUDO=1
npm run dev
```

### Linux/Mac
```bash
npm run i18n:pseudo
VITE_ENABLE_PSEUDO=1 npm run dev
```

### 检查标准
- ✅ **正确**: 所有文本显示为 `［‼ ... ‼］` 格式
- ❌ **错误**: 看到正常的英文文本 → 有硬编码，需要修复

---

## 🔍 常用命令

### 检查键一致性
```bash
npm run i18n:check
```
**预期输出**: `All locales are consistent with base keys.`

### 生成伪本地化
```bash
npm run i18n:pseudo
```
**输出**: `public/locales/pseudo/translation.json`

### 同步翻译键
```bash
node scripts/sync-translation-keys.cjs
```
**作用**: 将英文的新键同步到所有其他语言

### 导出翻译审查
```bash
node scripts/export-review-md.cjs
```
**输出**: `i18n/review.md` - 列出所有"same as English"的条目

---

## 🌍 支持的语言

当前支持 **18 种语言**:

| 代码 | 语言 | 状态 |
|------|------|------|
| `en` | English | ✅ 基准语言 |
| `es` | Español | ⚠️ 需审校 |
| `de` | Deutsch | ⚠️ 需审校 |
| `fr` | Français | ⚠️ 需审校 |
| `ja` | 日本語 | ⚠️ 需审校 |
| `ko` | 한국어 | ⚠️ 需审校 |
| `zh` | 中文 | ⚠️ 需审校 |
| `pt` | Português | ⚠️ 需审校 |
| `it` | Italiano | ⚠️ 需审校 |
| `ru` | Русский | ⚠️ 需审校 |
| `pl` | Polski | ⚠️ 需审校 |
| `nl` | Nederlands | ⚠️ 需审校 |
| `sv` | Svenska | ⚠️ 需审校 |
| `nb` | Norsk Bokmål | ⚠️ 需审校 |
| `ar` | العربية | ⚠️ 需审校 (RTL) |
| `th` | ไทย | ⚠️ 需审校 |
| `vi` | Tiếng Việt | ⚠️ 需审校 |
| `tl` | Filipino | ⚠️ 需审校 |
| `pseudo` | [Pseudo] | ✅ 测试用 |

---

## 🐛 常见问题排查

### 问题: 翻译不显示
**检查**:
1. 是否导入了 `useTranslation`?
2. 是否在组件内调用了 `const { t } = useTranslation()`?
3. 翻译键是否存在于 `public/locales/en/translation.json`?
4. 运行 `npm run i18n:check` 检查键一致性

### 问题: 语言切换后页面没变化
**检查**:
1. 检查浏览器控制台是否有错误
2. 检查 localStorage 中的 `pv_lang` 值
3. 清除浏览器缓存
4. 检查 `src/i18n.js` 配置

### 问题: 伪本地化语言选项不出现
**检查**:
1. 是否设置了 `VITE_ENABLE_PSEUDO=1` 环境变量?
2. 是否运行了 `npm run i18n:pseudo`?
3. 检查 `public/locales/pseudo/translation.json` 是否存在

### 问题: 构建后翻译丢失
**检查**:
1. 检查 `public/locales/` 目录是否被正确复制到 `dist/`
2. 检查 `vite.config.js` 中的 `publicDir` 配置
3. 运行 `npm run build` 并检查 `dist/locales/` 目录

---

## 📝 代码示例

### 基本用法
```jsx
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation()
  return <h1>{t('my.title')}</h1>
}
```

### 带插值
```jsx
const { t } = useTranslation()
return <p>{t('welcome.message', { name: 'John' })}</p>
// translation.json: "welcome.message": "Hello, {{name}}!"
```

### 复杂文本（含链接）
```jsx
import { Trans } from 'react-i18next'
import LocalizedLink from '@/components/LocalizedLink'

<Trans
  i18nKey="about.cta"
  components={{
    tool: <LocalizedLink to="/" className="text-blue-600" />,
    blog: <LocalizedLink to="/blog/" className="text-blue-600" />,
  }}
/>
// translation.json: "about.cta": "Try our <tool>converter</tool> or read our <blog>blog</blog>."
```

### 数组/对象
```jsx
const { t } = useTranslation()
const faqs = t('faq.items', { returnObjects: true }) || []
return faqs.map((faq, i) => <div key={i}>{faq.question}</div>)
// translation.json: "faq.items": [{"question": "Q1", "answer": "A1"}, ...]
```

---

## 🎯 最佳实践

### ✅ 推荐
- 所有用户可见文本使用 `t()` 函数
- 翻译键使用点号分隔（如 `nav.home`, `footer.copyright`）
- 定期运行伪本地化测试
- 提交前运行 `npm run i18n:check`

### ❌ 避免
- 硬编码任何用户可见文本
- 在组件外调用 `useTranslation()`
- 手动编辑非英文翻译文件（使用同步脚本）
- 在翻译键中使用空格或特殊字符

---

## 📚 相关文档

- [README-i18n.md](./README-i18n.md) - 完整的多语言指南
- [PSEUDO_LOCALE_TESTING.md](./docs/PSEUDO_LOCALE_TESTING.md) - 伪本地化详细说明
- [I18N_VERIFICATION_REPORT.md](./I18N_VERIFICATION_REPORT.md) - 最新验证报告

---

**最后更新**: 2025-11-01
