# SEO脚本清理建议

## 核心保留脚本
- `seo-check.js` - 基础SEO检查
- `generate-sitemap.js` - 站点地图生成
- `keyword-frequency-analysis.js` - 关键词频率分析

## 建议删除的冗余脚本
### 密度分析类（功能重复）
- `kw-density-single.js` - 单页面密度分析
- `kw-density-site-full.js` - 全站密度分析
- `kw-density-words.js` - 词汇密度分析

### 短语优化类（功能重复）
- `phrase-density-optimizer.js` - 短语密度优化
- `phrase-booster.js` - 短语增强
- `target-phrase-injector.js` - 目标短语注入

### 可疑的注入脚本
- `massive-phrase-injection.js` - 大规模短语注入
- `batch-keyword-adjustment.js` - 批量关键词调整
- `reduce-art-keyword.js` - 艺术关键词减少

## 清理理由
1. **功能重复**: 多个脚本执行相似的任务
2. **维护困难**: 15+个SEO脚本难以维护
3. **可疑技术**: 某些脚本涉及"注入"技术，可能违反SEO最佳实践
4. **复杂性**: 过度复杂的SEO工具链增加了项目复杂度

## 建议
1. 保留2-3个核心SEO脚本
2. 合并相似功能的脚本
3. 删除实验性和未使用的脚本
4. 简化SEO工作流
