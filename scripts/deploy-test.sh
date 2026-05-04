#!/bin/bash

# MD Tools 部署测试脚本
# 用于验证项目是否准备好部署

set -e

echo "🔍 开始 MD Tools 部署测试..."
echo "=============================="

# 检查当前目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

echo "✅ 项目目录检查通过"

# 检查 Node.js 版本
NODE_VERSION=$(node --version)
echo "📦 Node.js 版本: $NODE_VERSION"

# 检查 npm 版本
NPM_VERSION=$(npm --version)
echo "📦 npm 版本: $NPM_VERSION"

# 检查依赖安装
echo "📦 检查依赖安装..."
if [ ! -d "node_modules" ]; then
    echo "⚠️  警告：node_modules 目录不存在，正在安装依赖..."
    npm install
else
    echo "✅ 依赖已安装"
fi

# 运行 TypeScript 检查
echo "🔧 运行 TypeScript 检查..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo "✅ TypeScript 检查通过"
else
    echo "❌ TypeScript 检查失败"
    exit 1
fi

# 运行构建测试
echo "🏗️  运行构建测试..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 构建测试通过"
else
    echo "❌ 构建测试失败"
    exit 1
fi

# 检查关键文件
echo "📁 检查关键文件..."
REQUIRED_FILES=(
    "package.json"
    "next.config.js"
    "tsconfig.json"
    "vercel.json"
    "src/app/page.tsx"
    "src/lib/index.ts"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file 存在"
    else
        echo "❌ $file 不存在"
        exit 1
    fi
done

# 检查工具页面
echo "🛠️  检查工具页面..."
TOOL_PAGES=(
    "src/app/zh-cn/markdown-to-word/page.tsx"
    "src/app/zh-cn/markdown-to-pdf/page.tsx"
    "src/app/zh-cn/markdown-to-html/page.tsx"
    "src/app/zh-cn/yaml-to-json/page.tsx"
    "src/app/admin/adsense/page.tsx"
)

for page in "${TOOL_PAGES[@]}"; do
    if [ -f "$page" ]; then
        echo "✅ $page 存在"
    else
        echo "❌ $page 不存在"
        exit 1
    fi
done

# 检查 lib 工具函数
echo "🔧 检查 lib 工具函数..."
LIB_FILES=(
    "src/lib/markdown-converter.ts"
    "src/lib/file-utils.ts"
    "src/lib/format-converter.ts"
    "src/lib/docx-generator.ts"
    "src/lib/pdf-generator.ts"
)

for lib in "${LIB_FILES[@]}"; do
    if [ -f "$lib" ]; then
        echo "✅ $lib 存在"
    else
        echo "❌ $lib 不存在"
        exit 1
    fi
done

# 检查环境变量配置
echo "⚙️  检查环境变量配置..."
if grep -q "NEXT_PUBLIC_ADSENSE" .env* 2>/dev/null || grep -q "NEXT_PUBLIC_ADSENSE" src/**/*.ts* 2>/dev/null; then
    echo "✅ AdSense 环境变量配置存在"
else
    echo "⚠️  警告：未找到 AdSense 环境变量配置"
    echo "提示：部署时需要配置以下环境变量："
    echo "  - NEXT_PUBLIC_ADSENSE_CLIENT_ID"
    echo "  - NEXT_PUBLIC_ADSENSE_SLOT_ID"
fi

# 运行开发服务器测试
echo "🚀 启动开发服务器测试..."
npm run dev &
DEV_PID=$!

# 等待服务器启动
sleep 8

# 测试服务器响应
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo "✅ 开发服务器响应正常"
else
    echo "❌ 开发服务器无响应"
    kill $DEV_PID 2>/dev/null
    exit 1
fi

# 停止开发服务器
kill $DEV_PID 2>/dev/null
wait $DEV_PID 2>/dev/null

echo ""
echo "🎉 所有测试通过！"
echo "=============================="
echo ""
echo "📋 部署准备清单："
echo "1. ✅ 项目结构完整"
echo "2. ✅ 依赖安装完成"
echo "3. ✅ TypeScript 检查通过"
echo "4. ✅ 构建测试通过"
echo "5. ✅ 关键文件存在"
echo "6. ✅ 工具页面完整"
echo "7. ✅ 开发服务器正常"
echo ""
echo "🚀 项目已准备好部署！"
echo ""
echo "📝 下一步："
echo "1. 配置环境变量（特别是 AdSense）"
echo "2. 运行部署命令：vercel --prod"
echo "3. 验证生产环境功能"
echo ""
echo "💡 提示：查看 DEPLOYMENT.md 获取详细部署指南"