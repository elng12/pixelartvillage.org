#!/bin/bash

# Pixel Art Village - 高级SEO脚本清理工具
# 清理冗余和可疑的SEO脚本

echo "🧹 高级SEO脚本清理工具"
echo "=============================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# 计数器
deleted_count=0
skipped_count=0
warning_count=0

# 函数：安全删除文件
safe_remove() {
    local file="$1"
    local description="$2"
    local warning="$3"
    
    if [ -f "$file" ]; then
        if [ -n "$warning" ]; then
            echo -e "${RED}⚠️  警告: ${warning}${NC}"
            ((warning_count++))
        fi
        echo -e "${YELLOW}删除: ${file} ${NC}(${description})"
        git rm "$file" 2>/dev/null || rm "$file"
        ((deleted_count++))
    else
        echo -e "${GREEN}跳过: ${file} ${NC}(文件不存在)"
        ((skipped_count++))
    fi
}

# 函数：更新package.json
update_package_json() {
    local script_name="$1"
    echo "  📝 从package.json中移除: $script_name"
    sed -i "/\"seo:$script_name\":/d" package.json 2>/dev/null || true
}

echo -e "${BLUE}=== 第一阶段：清理功能重复的SEO脚本 ===${NC}"

# 1. 密度分析类 - 功能重复，保留最基础的density
echo -e "${YELLOW}清理密度分析类脚本...${NC}"
safe_remove "scripts/kw-density-single.js" "单页面关键词密度分析（功能重复）"
update_package_json "kw:single"

safe_remove "scripts/kw-density-site-full.js" "全站关键词密度分析（功能重复）"
update_package_json "kw:site:full"

safe_remove "scripts/kw-density-words.js" "关键词词汇密度分析（功能重复）"
update_package_json "kw:words"

# 2. 短语优化类 - 功能重复，保留基础的phrases
echo -e "${YELLOW}清理短语优化类脚本...${NC}"
safe_remove "scripts/phrase-density-optimizer.js" "短语密度优化器（功能重复）"
update_package_json "optimize-phrases"

safe_remove "scripts/phrase-booster.js" "短语增强器（功能重复）"
update_package_json "boost-phrases"

# 3. 关键词分析类 - 功能重复
echo -e "${YELLOW}清理关键词分析类脚本...${NC}"
safe_remove "scripts/seo-keyword-report.js" "SEO关键词报告（功能重复）"
update_package_json "report"

# 4. 高级关键词密度类 - 过度复杂
echo -e "${YELLOW}清理过度复杂的SEO脚本...${NC}"
safe_remove "scripts/kw-density-single.js" "单页面分析（过度复杂）"
update_package_json "kw:single"

# 清理复杂的kw:en变体
echo -e "${YELLOW}清理复杂的英文关键词变体...${NC}"
update_package_json "kw:en:text"
update_package_json "kw:en:meta"
update_package_json "kw:en:meta:hyphen"
update_package_json "kw:en:full"

# 清理复杂的kw:root变体
echo -e "${YELLOW}清理复杂的根路径关键词变体...${NC}"
update_package_json "kw:root:full"
update_package_json "kw:root:yourtool"

echo ""
echo -e "${BLUE}=== 第二阶段：清理可疑的SEO脚本 ===${NC}"

# 5. 可疑的"注入"脚本 - 可能涉及黑帽SEO
echo -e "${RED}⚠️  清理可疑的注入类脚本（可能涉及黑帽SEO）:${NC}"
safe_remove "scripts/massive-phrase-injection.js" "大规模短语注入脚本（可疑）" "可能涉及黑帽SEO技术"
update_package_json "massive-inject"

safe_remove "scripts/target-phrase-injector.js" "目标短语注入器（可疑）" "可能涉及黑帽SEO技术"
update_package_json "inject-phrases"

# 6. 批处理调整类 - 功能重复
echo -e "${YELLOW}清理批处理调整类脚本...${NC}"
safe_remove "scripts/batch-keyword-adjustment.js" "批量关键词调整（功能重复）"
update_package_json "adjust"

# 7. 艺术关键词类 - 功能不明确
echo -e "${YELLOW}清理艺术关键词类脚本...${NC}"
safe_remove "scripts/reduce-art-keyword.js" "艺术关键词减少（功能不明确）"
update_package_json "reduce-art"

echo ""
echo -e "${BLUE}=== 第三阶段：清理其他冗余文件 ===${NC}"

# 8. 临时生成的文件
echo -e "${YELLOW}清理临时生成的文件...${NC}"
# 清理可能生成的临时SEO文件
find . -name "*.tmp" -o -name "*.temp" -o -name "*seo-*.tmp" 2>/dev/null | while read -r file; do
    if [ -f "$file" ]; then
        echo "  🗑️  删除临时文件: $file"
        rm "$file"
        ((deleted_count++))
    fi
done

# 9. 旧的分析报告
echo -e "${YELLOW}清理旧的SEO分析报告...${NC}"
find . -name "*seo-report*.txt" -o -name "*keyword-report*.txt" -o -name "*density-report*.txt" 2>/dev/null | while read -r file; do
    if [ -f "$file" ] && [[ "$file" != *"/node_modules/"* ]]; then
        echo "  🗑️  删除旧报告: $file"
        rm "$file"
        ((deleted_count++))
    fi
done

echo ""
echo -e "${BLUE}=== 第四阶段：优化package.json ===${NC}"

# 简化SEO脚本定义，只保留核心功能
echo -e "${YELLOW}简化package.json中的SEO脚本定义...${NC}"

# 创建备份
cp package.json package.json.backup

# 移除所有复杂的SEO脚本变体
sed -i '/"seo:kw:/d' package.json
sed -i '/"seo:.*:.*:/d' package.json  # 移除所有带冒号的复杂变体

echo "  📋 package.json已备份为 package.json.backup"
echo "  📋 已简化SEO脚本定义"

echo ""
echo -e "${BLUE}=== 清理统计 ===${NC}"
echo -e "删除文件数量: ${GREEN}${deleted_count}${NC}"
echo -e "跳过文件数量: ${GREEN}${skipped_count}${NC}"
echo -e "警告数量: ${YELLOW}${warning_count}${NC}"

echo ""
echo -e "${BLUE}=== 清理结果总结 ===${NC}"
echo -e "✅ ${GREEN}成功清理了冗余和可疑的SEO脚本${NC}"
echo -e "✅ ${GREEN}简化了package.json中的SEO脚本定义${NC}"
echo -e "⚠️  ${YELLOW}警告: 删除了可能涉及黑帽SEO技术的脚本${NC}"

echo ""
echo -e "${BLUE}=== 建议后续操作 ===${NC}"
echo "1. 运行: git status 查看所有变更"
echo "2. 运行: npm run seo:check 测试核心SEO功能"
echo "3. 运行: npm run build 确保构建仍然正常"
echo "4. 运行: git add . 暂存所有变更"
echo "5. 运行: git commit -m 'cleanup: remove redundant SEO scripts and suspicious injection tools'"
echo ""
echo -e "${YELLOW}重要提醒:${NC}"
echo "- 清理脚本已备份为 package.json.backup"
echo "- 如果出现问题，可以恢复备份: cp package.json.backup package.json"
echo "- 建议在清理后进行充分测试"
echo ""
echo -e "${GREEN}🎉 高级SEO脚本清理完成！${NC}"
echo "📊 项目SEO工具链已简化和优化"