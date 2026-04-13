# MD Tools 网站部署指南

## 🚀 方法一：Vercel 部署（推荐）

### 步骤 1：登录 Vercel

```bash
vercel login
```

会打开浏览器，选择使用 GitHub 账号登录。

### 步骤 2：部署项目

```bash
cd ~/workspace/md-tools-site
vercel
```

首次部署会询问一些配置选项，直接回车使用默认值即可。

### 步骤 3：生产环境部署

```bash
vercel --prod
```

## 🔗 方法二：GitHub Pages 部署

### 步骤 1：构建静态站点

```bash
cd ~/workspace/md-tools-site
npm run build
```

### 步骤 2：推送到 GitHub

```bash
git add -A
git commit -m "更新网站"
git push origin main
```

### 步骤 3：开启 GitHub Pages

1. 访问 https://github.com/chensobing-sudo/md-tools-site/settings/pages
2. Source 选择 "GitHub Actions"
3. 创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

## 💰 接入 Google AdSense

### 步骤 1：申请 AdSense

1. 访问 https://www.google.com/adsense/
2. 使用 Google 账号登录
3. 添加您的网站域名
4. 等待审核通过

### 步骤 2：配置广告代码

1. 获取 `ca-pub-XXXXXXXXXXXXXXXX` ID
2. 修改 `src/app/layout.tsx`：

```tsx
<head>
  {/* 取消注释下面这行，替换为您的 ID */}
  {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossOrigin="anonymous"></script> */}
</head>
```

3. 修改 `src/components/AdUnit.tsx`：

```tsx
// 取消注释并替换为您的广告单元 ID
<ins className="adsbygoogle"
     style={{ display: 'block' }}
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="YOUR_SLOT_ID"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
```

### 步骤 3：广告位布局

已在以下位置预留广告位：
- ✅ 导航栏下方（顶部横幅 728x90）
- ✅ 工具页面中部（内容间广告）
- ✅ 侧边栏（矩形广告 250x250）
- ✅ 页脚上方

## 🌐 绑定自定义域名

### Vercel 方式：

```bash
vercel domains add yourdomain.com
```

### GitHub Pages 方式：

1. 在仓库根目录创建 `CNAME` 文件：
```
yourdomain.com
```

2. 在域名 DNS 设置中添加 CNAME 记录：
```
类型: CNAME
名称: @ 或 www
值: chensobing-sudo.github.io/md-tools-site
```

## 📊 添加 Google Analytics

在 `src/app/layout.tsx` 中添加：

```tsx
<head>
  {/* Google Analytics */}
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    `}
  </script>
</head>
```

## 📝 快速部署命令

```bash
# 一键部署到 Vercel
cd ~/workspace/md-tools-site && vercel --prod

# 或推送到 GitHub
cd ~/workspace/md-tools-site && git add -A && git commit -m "更新" && git push origin main
```

## ⚠️ 注意事项

1. 首次部署需要登录 Vercel 或 GitHub
2. Google AdSense 需要网站已上线并通过审核
3. 自定义域名需要 DNS 配置（可能需要 24-48 小时生效）
4. 建议使用 HTTPS（Vercel 和 GitHub Pages 默认支持）
