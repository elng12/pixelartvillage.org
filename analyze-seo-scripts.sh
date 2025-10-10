#!/bin/bash

# Pixel Art Village - 高级SEO脚本清理工具
# 分析并清理冗余的SEO脚本

echo "🔍 分析SEO脚本的使用情况和冗余度..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 分析SEO脚本使用情况
echo -e "${BLUE}=== SEO脚本使用情况分析 ===${NC}"

# 检查package.json中的SEO脚本定义
echo -e "${YELLOW}在package.json中定义的SEO脚本:${NC}"
grep -E '"seo:' package.json | sed 's/.*"seo:/  /' | sed 's/".*$//' | sort | uniq

echo ""

# 检查脚本文件中的交叉引用
echo -e "${YELLOW}脚本间的交叉引用情况:${NC}"
echo "检查哪些SEO脚本被其他脚本引用..."

# 被引用的SEO脚本
referenced_scripts=()
for script in scripts/*.js; do
    if grep -q "npm run seo:" "$script" 2>/dev/null; then
        # 提取被引用的seo命令
        grep -o "npm run seo:[a-zA-Z-]*" "$script" | while read -r cmd; do
            script_name=$(echo "$cmd" | sed 's/npm run seo://')
            echo "  📋 $script_name 被 $(basename "$script") 引用"
            referenced_scripts+=("$script_name")
        done
    fi
done

echo ""
echo -e "${BLUE}=== 冗余SEO脚本识别 ===${NC}"

# 定义功能重复的脚本组
declare -A redundant_groups=(
    ["density-basic"]="kw-density-check.js:phrase-density-analysis.js"
    ["density-advanced"]="kw-density-single.js:kw-density-site-full.js:kw-density-words.js"
    ["phrase-optimization"]="phrase-density-optimizer.js:phrase-booster.js:target-phrase-injector.js"
    ["keyword-analysis"]="keyword-frequency-analysis.js:seo-keyword-report.js"
    ["injection-tools"]="massive-phrase-injection.js:target-phrase-injector.js"
    ["adjustment-tools"]="keyword-adjustment-strategy.js:batch-keyword-adjustment.js:reduce-art-keyword.js"
)

echo -e "${YELLOW}检测到的功能重复组:${NC}"
for group in "${!redundant_groups[@]}"; do
    echo -e "${RED}⚠️  $group:${NC}"
    IFS=':' read -ra scripts <<< "${redundant_groups[$group]}"
    for script in "${scripts[@]}"; do
        if [ -f "scripts/$script" ]; then
            size=$(wc -c < "scripts/$script" | awk '{print int($1/1024)}')
            echo "     📄 $script (${size}KB)"
        fi
    done
done

echo ""
echo -e "${BLUE}=== 可疑脚本分析 ===${NC}"

# 检查可疑的"注入"脚本
echo -e "${RED}🚨  可疑的黑帽SEO脚本:${NC}"
suspicious_scripts=("massive-phrase-injection.js" "target-phrase-injector.js")
for script in "${suspicious_scripts[@]}"; do
    if [ -f "scripts/$script" ]; then
        echo "  ⚠️  $script - 包含'注入'功能，可能涉及黑帽SEO技术"
        # 检查脚本内容
        if grep -q "inject\|injection" "scripts/$script"; then
            echo "     📝 检测到注入相关关键词"
        fi
    fi
done

echo ""
echo -e "${BLUE}=== 清理建议 ===${NC}"

# 建议保留的核心SEO脚本
core_scripts=("seo-check.js" "generate-sitemap.js" "generate-sitemap.cjs" "keyword-frequency-analysis.js")

# 建议删除的冗余脚本
redundant_scripts=(
    "kw-density-single.js"
    "kw-density-site-full.js" 
    "kw-density-words.js"
    "phrase-density-optimizer.js"
    "phrase-booster.js"
    "massive-phrase-injection.js"
    "target-phrase-injector.js"
    "batch-keyword-adjustment.js"
    "reduce-art-keyword.js"
)

echo -e "${GREEN}✅ 建议保留的核心SEO脚本:${NC}"
for script in "${core_scripts[@]}"; do
    if [ -f "scripts/$script" ]; then
        size=$(wc -c < "scripts/$script" | awk '{print int($1/1024)}')
        echo "  📄 $script (${size}KB) - 基础功能"
    fi
done

echo ""
echo -e "${RED}❌ 建议删除的冗余脚本:${NC}"
total_size=0
for script in "${redundant_scripts[@]}"; do
    if [ -f "scripts/$script" ]; then
        size=$(wc -c < "scripts/$script" | awk '{print int($1/1024)}')
        total_size=$((total_size + size))
        echo "  🗑️  $script (${size}KB) - 功能重复或可疑"
    fi
done

echo ""
echo -e "${YELLOW}预计可释放空间: ${total_size}KB${NC}"

echo ""
echo -e "${BLUE}=== 自动化清理选项 ===${NC}"
echo "1. 保守清理: 只删除确定无用的脚本"
echo "2. 激进清理: 删除所有标记为冗余的脚本"
echo "3. 手动审查: 逐一检查每个脚本的功能"
echo ""
echo -e "${YELLOW}建议: ${NC}先运行保守清理，观察项目是否正常运行"
echo -e "${YELLOW}警告: ${NC}删除前请确保已备份重要数据！"

# 创建清理建议文件
cat > seo-cleanup-recommendations.md << 'EOF'
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
EOF

echo ""
echo "📋 详细建议已保存到: seo-cleanup-recommendations.md"
echo "🚀 准备创建自动化清理脚本吗？运行下一步命令！"