# 伪本地化测试指南

伪本地化（Pseudo-localization）是一种测试技术，用于检测UI中是否存在硬编码的未翻译文本。

## 什么是伪本地化？

伪本地化将所有英文字符转换为特殊字符（例如：`Text` → `［‼ Ťēẋŧ ‼］`），这样可以：
- **快速识别硬编码文本**：如果看到正常的英文字符串，说明有硬编码
- **检测布局问题**：特殊字符可能更长，可以发现文本溢出
- **验证翻译完整性**：确保所有文本都通过i18n系统

## 如何启用伪本地化测试

### Windows PowerShell
```powershell
$env:VITE_ENABLE_PSEUDO="1"
npm run dev
```

### Windows CMD
```cmd
set VITE_ENABLE_PSEUDO=1
npm run dev
```

### Linux/Mac
```bash
VITE_ENABLE_PSEUDO=1 npm run dev
```

## 测试步骤

1. **启动开发服务器**（使用上面的命令）
2. **打开浏览器**访问 `http://localhost:5173`（或显示的端口）
3. **切换语言**到 "pseudo"（通过页面右上角的语言选择器）
4. **检查页面**：
   - ✅ 所有文本都应该显示为 `［‼ ... ‼］` 格式
   - ❌ 如果看到正常的英文字符串，说明有硬编码文本需要修复

## 示例

### 正确（已翻译）
```
［‼ Įɱåǥē ŧö Ƥįẋēŀ Åŗŧ Ćöńṽēŗŧēŗ ‼］
```

### 错误（硬编码）
```
Image to Pixel Art Converter
```

## 常见问题

**Q: 伪本地化语言选项没有出现？**
- 确保设置了 `VITE_ENABLE_PSEUDO=1` 环境变量
- 确保已运行 `npm run i18n:pseudo` 生成了翻译文件

**Q: 某些文本仍然是英文？**
- 检查该组件是否使用了 `useTranslation()` Hook
- 检查是否所有文本都使用了 `t()` 函数
- 运行 `npm run i18n:check` 检查翻译键是否一致

**Q: 如何修复发现的硬编码文本？**
1. 找到硬编码文本所在的组件
2. 在 `public/locales/en/translation.json` 中添加翻译键
3. 替换硬编码文本为 `t('translation.key')`
4. 运行 `npm run i18n:check` 验证
5. 运行 `node scripts/sync-translation-keys.cjs` 同步到其他语言

## 最佳实践

- **开发时定期检查**：在开发新功能时，切换到大伪本地化语言查看
- **提交前验证**：在提交代码前，运行伪本地化测试确保没有硬编码
- **CI集成**：考虑在CI中自动运行伪本地化测试




