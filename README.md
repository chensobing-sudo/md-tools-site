# MD Tools - 免费在线格式转换工具

一个类似于 md-to.com 的在线格式转换工具网站，支持 Markdown 转 Word、PDF、HTML 等多种格式。

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 构建部署

```bash
# 构建静态站点
npm run build

# 输出在 out/ 目录
```

## 📁 项目结构

```
md-tools-site/
├── src/
│   ├── app/              # Next.js 页面
│   │   ├── page.tsx      # 首页
│   │   ├── layout.tsx    # 根布局
│   │   ├── globals.css   # 全局样式
│   │   └── zh-cn/        # 工具页面
│   ├── components/       # React 组件
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── AdUnit.tsx    # 广告组件
│   └── lib/              # 工具函数
├── public/               # 静态资源
└── next.config.js        # Next.js 配置
```

## 🎯 核心功能

- ✅ Markdown 转 Word (.docx)
- ✅ Markdown 转 PDF
- ✅ Markdown 转 HTML
- ✅ YAML 转 JSON
- ✅ 实时预览
- ✅ 多种模板选择
- ✅ 文件上传/下载
- ✅ 响应式设计
- ✅ SEO 优化
- ✅ 广告位预留

## 💰 接入 Google AdSense

1. 申请 Google AdSense 账号
2. 获取您的 `ca-pub-XXXXXXXXXXXXXXXX` ID
3. 在 `src/app/layout.tsx` 中添加 AdSense 脚本
4. 在 `src/components/AdUnit.tsx` 中配置广告位 ID

```tsx
// src/app/layout.tsx
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ID" crossOrigin="anonymous"></script>

// src/components/AdUnit.tsx
data-ad-client="ca-pub-YOUR_ID"
data-ad-slot="YOUR_SLOT_ID"
```

## 🌐 部署到 Vercel（推荐）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

## 📊 SEO 优化清单

- ✅ 语义化 URL 结构
- ✅ H1/H2/H3 标题层级
- ✅ Meta description 和 keywords
- ✅ Canonical URL
- ✅ 内链网络（工具互推）
- ✅ FAQ 结构化数据
- ✅ 移动端适配
- ✅ 快速加载（静态导出）

## 📝 待接入

- [ ] Google AdSense 广告
- [ ] Google Analytics 统计
- [ ] Sitemap.xml
- [ ] robots.txt
- [ ] 多语言支持（i18n）

## 📄 许可证

MIT License
