#!/bin/bash

# AdSense 配置验证脚本

echo "🔍 验证 AdSense 配置..."
echo "=============================="

# 检查环境变量
echo "📋 环境变量检查:"
if [ -f ".env.local" ]; then
    echo "✅ .env.local 文件存在"
    grep -E "NEXT_PUBLIC_ADSENSE" .env.local || echo "⚠️  未找到 AdSense 环境变量"
else
    echo "⚠️  .env.local 文件不存在"
    echo "提示: 复制 .env.example 为 .env.local 并配置 AdSense"
fi

echo ""
echo "📁 代码检查:"

# 检查 AdSense 相关文件
FILES=(
    "src/contexts/AdSenseContext.tsx"
    "src/components/AdSenseConfig.tsx"
    "src/components/AdUnit.tsx"
    "src/app/layout.tsx"
    "src/app/admin/adsense/page.tsx"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file 不存在"
    fi
done

echo ""
echo "🔧 配置验证:"

# 检查 layout.tsx 中的环境变量使用
if grep -q "process.env.NEXT_PUBLIC_ADSENSE" src/app/layout.tsx; then
    echo "✅ layout.tsx 正确使用环境变量"
else
    echo "❌ layout.tsx 未使用环境变量"
fi

# 检查 AdSenseContext 中的初始配置支持
if grep -q "initialConfig" src/contexts/AdSenseContext.tsx; then
    echo "✅ AdSenseContext 支持初始配置"
else
    echo "❌ AdSenseContext 不支持初始配置"
fi

echo ""
echo "🚀 测试建议:"
echo "1. 设置环境变量:"
echo "   NEXT_PUBLIC_ADSENSE_ENABLED=true"
echo "   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-3940256099942544 (测试ID)"
echo "2. 运行开发服务器: npm run dev"
echo "3. 访问 http://localhost:3000/admin/adsense"
echo "4. 验证广告配置和预览功能"

echo ""
echo "📝 生产部署配置:"
echo "- 在 Vercel 中设置环境变量:"
echo "  NEXT_PUBLIC_ADSENSE_ENABLED=true"
echo "  NEXT_PUBLIC_ADSENSE_CLIENT_ID=你的真实发布商ID"
echo "  NEXT_PUBLIC_ADSENSE_AUTO_ADS=true"
echo "- 部署后访问 /admin/adsense 配置广告位"

echo ""
echo "✅ AdSense 配置验证完成"