#!/bin/bash

# Pixel Art Village - 无用文件清理脚本
# 这个脚本会删除GitHub仓库中的无用文件

echo "🧹 开始清理无用文件..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
deleted_count=0
skipped_count=0

# 函数：安全删除文件
safe_remove() {
    local file="$1"
    local description="$2"
    
    if [ -f "$file" ]; then
        echo -e "${YELLOW}删除: ${file} ${NC}(${description})"
        git rm "$file" 2>/dev/null || rm "$file"
        ((deleted_count++))
    else
        echo -e "${GREEN}跳过: ${file} ${NC}(文件不存在)"
        ((skipped_count++))
    fi
}

# 函数：安全删除目录
safe_remove_dir() {
    local dir="$1"
    local description="$2"
    
    if [ -d "$dir" ]; then
        echo -e "${YELLOW}删除目录: ${dir} ${NC}(${description})"
        git rm -r "$dir" 2>/dev/null || rm -rf "$dir"
        ((deleted_count++))
    else
        echo -e "${GREEN}跳过: ${dir} ${NC}(目录不存在)"
        ((skipped_count++))
    fi
}

echo "🔴 删除确定无用的文件..."

# 1. 临时/错误文件
safe_remove "hhfkpjffbhledfpkhhcoidplcebgdgbk_crxdl.com_v3_2.4.2.0.crx" "浏览器扩展文件，无用"
safe_remove "Image To Pixel Art (2025_9_20 21：06：57).html" "带时间戳的临时HTML导出文件"
safe_remove "tatus" "拼写错误的Git状态文件"

# 2. 重复的测试HTML文件
safe_remove "design_principles.html" "设计原则测试页面"
safe_remove "homepage_layout_seo_optimized.html" "SEO优化的首页布局测试"
safe_remove "homepage_layout_v2.html" "首页布局版本2测试"

echo ""
echo "🟡 删除旧的审查报告文件（保留最新的）..."

# 3. 过多的审查报告文件（保留最新的）
safe_remove "code_review_claude_fixes.md" "旧的Claude修复报告"
safe_remove "code_review_claude_issues.md" "旧的Claude问题报告"
safe_remove "CODE_REVIEW_CRITIQUE_REPORT.md" "旧的审查批评报告"
safe_remove "CODE_REVIEW_REPORT_V2.md" "旧版本审查报告"
safe_remove "code_review_fixes.md" "旧的修复报告"
safe_remove "code_review_issues.md" "旧的问题报告"

echo ""
echo "🟠 检查可能无用的SEO/营销脚本..."

# 4. 可能冗余的SEO脚本（需要确认）
echo -e "${YELLOW}注意: ${NC}以下脚本需要确认是否仍在使用："
echo "  - keyword-frequency-analysis.js"
echo "  - kw-density-*.js (多个关键词密度脚本)"
echo "  - phrase-density-*.js (多个短语密度脚本)"
echo "  - massive-phrase-injection.js"
echo "  - target-phrase-injector.js"
echo ""
echo -e "${YELLOW}建议: ${NC}运行以下命令检查脚本使用情况："
echo "  grep -r \"seo:\" package.json"
echo "  grep -r \"npm run seo\" scripts/"

echo ""
echo "🔵 检查徽章相关文件..."

# 5. 徽章相关HTML文件（这些是有用的，用于反向链接验证）
echo -e "${GREEN}保留: ${NC}ai-dirs.html - AI目录反向链接验证"
echo -e "${GREEN}保留: ${NC}turbo0.html - Turbo0反向链接验证"

echo ""
echo "📊 清理统计："
echo -e "删除文件数量: ${GREEN}${deleted_count}${NC}"
echo -e "跳过文件数量: ${GREEN}${skipped_count}${NC}"

echo ""
echo "✅ 清理完成！"
echo ""
echo "🔧 建议后续操作："
echo "1. 运行: git status 查看变更"
echo "2. 运行: git commit -m 'cleanup: remove unused files' 提交变更"
echo "3. 运行: git push 推送到远程仓库"
echo ""
echo -e "${YELLOW}警告: ${NC}请在运行此脚本前确保已备份重要数据！"