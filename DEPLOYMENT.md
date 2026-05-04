# MD Tools 网站部署指南

## 项目概述

MD Tools 是一个在线格式转换工具网站，提供以下功能：
- Markdown 转 Word 文档
- Markdown 转 PDF 文档
- Markdown 转 HTML
- YAML 与 JSON 双向转换
- Google AdSense 广告集成

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: CSS Modules + 自定义样式
- **构建工具**: npm
- **部署平台**: Vercel (推荐)

## 部署前准备

### 1. 环境变量配置

在部署前，需要配置以下环境变量：

```bash
# Google AdSense 配置
NEXT_PUBLIC_ADSENSE_ENABLED=true
NEXT_PUBLIC_ADSENSE_CLIENT_ID=你的AdSense发布商ID
NEXT_PUBLIC_ADSENSE_AUTO_ADS=true

# 可选：其他配置
NEXT_PUBLIC_SITE_URL=你的网站URL
NEXT_PUBLIC_SITE_NAME=MD Tools
```

**注意**: AdSense 广告位配置通过网站管理界面进行，无需环境变量配置。

### 2. 本地测试

部署前请确保：
- [x] 本地构建成功：`npm run build`
- [x] 本地开发服务器正常运行：`npm run dev`
- [x] 所有功能测试通过

## 部署到 Vercel

### 方法一：通过 Vercel CLI 部署

1. 安装 Vercel CLI：
   ```bash
   npm i -g vercel
   ```

2. 登录 Vercel：
   ```bash
   vercel login
   ```

3. 部署项目：
   ```bash
   vercel
   ```

4. 生产环境部署：
   ```bash
   vercel --prod
   ```

### 方法二：通过 GitHub 集成部署

1. 将代码推送到 GitHub 仓库
2. 登录 [Vercel Dashboard](https://vercel.com)
3. 点击 "New Project"
4. 导入你的 GitHub 仓库
5. 配置环境变量
6. 点击 "Deploy"

### 方法三：通过 Vercel Web UI 部署

1. 访问 [Vercel Dashboard](https://vercel.com)
2. 点击 "New Project"
3. 选择 "Import Git Repository"
4. 选择你的仓库
5. 配置项目设置：
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
6. 添加环境变量
7. 点击 "Deploy"

## 环境变量配置

在 Vercel 项目中配置环境变量：

1. 进入项目设置
2. 选择 "Environment Variables"
3. 添加以下变量：

| 变量名 | 描述 | 示例值 | 必需 |
|--------|------|--------|------|
| `NEXT_PUBLIC_ADSENSE_ENABLED` | 是否启用 AdSense | `true` | 是 |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Google AdSense 发布商 ID | `ca-pub-1234567890123456` | 是 |
| `NEXT_PUBLIC_ADSENSE_AUTO_ADS` | 是否启用自动广告 | `true` | 否 |

**注意**: 
- 广告位配置通过网站管理界面 (`/admin/adsense`) 进行
- 本地开发可使用测试 ID: `ca-pub-3940256099942544`
- 生产环境必须使用真实的 AdSense 发布商 ID

## 自定义域名配置

1. 在 Vercel 项目设置中选择 "Domains"
2. 添加你的域名
3. 按照提示配置 DNS 记录
4. 等待 DNS 传播（通常需要几分钟到几小时）

## 性能优化

### 1. 缓存策略

项目已配置以下缓存策略：
- 静态资源：1年缓存
- 图片资源：1天缓存
- Next.js 构建文件：永久缓存

### 2. CDN 配置

Vercel 自动提供全球 CDN，无需额外配置。

### 3. 安全头

项目已配置以下安全头：
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## 监控和维护

### 1. 性能监控

Vercel 提供内置的：
- 实时日志
- 性能指标
- 错误跟踪
- 用户分析

### 2. 自动部署

配置 GitHub 集成后：
- 推送到 `main` 分支自动触发生产部署
- 推送到其他分支自动触发预览部署

### 3. 回滚策略

如果部署出现问题：
1. 在 Vercel Dashboard 中选择项目
2. 进入 "Deployments"
3. 找到稳定版本
4. 点击 "..." 选择 "Promote to Production"

## 故障排除

### 常见问题

1. **构建失败**
   - 检查 `npm run build` 本地是否成功
   - 查看 Vercel 构建日志
   - 确保所有依赖已正确安装

2. **环境变量未生效**
   - 检查变量名是否正确
   - 确保变量已添加到生产环境
   - 重启部署

3. **AdSense 广告不显示**
   - 确认 AdSense 账户已批准
   - 检查 AdSense 代码是否正确
   - 验证域名是否已添加到 AdSense

4. **页面加载缓慢**
   - 检查 CDN 缓存
   - 优化图片大小
   - 启用 Vercel 的 Edge Functions

### 日志查看

1. Vercel Dashboard → 项目 → "Logs"
2. 使用 Vercel CLI：
   ```bash
   vercel logs <deployment-url>
   ```

## 更新和升级

### 1. 更新依赖

```bash
# 更新所有依赖
npm update

# 更新特定依赖
npm update package-name

# 检查安全漏洞
npm audit
```

### 2. 部署更新

```bash
# 本地测试
npm run build
npm run dev

# 部署到 Vercel
vercel --prod
```

## 备份策略

1. **代码备份**: GitHub 仓库
2. **数据库备份**: 项目无数据库
3. **环境变量备份**: 导出 Vercel 环境变量
4. **配置文件备份**: 项目根目录的配置文件

## 🚀 部署状态

### 当前部署
- **部署时间**: 2026年4月16日
- **部署状态**: ✅ 生产就绪
- **部署 URL**: https://md-tools-site.vercel.app
- **构建状态**: 成功
- **页面数量**: 9个静态页面

### 访问地址
1. 主域名: https://md-tools-site.vercel.app
2. 具体部署: https://md-tools-site-pgjay40q4-chensobing-sudos-projects.vercel.app
3. 别名: https://md-tools-site-chensobing-sudos-projects.vercel.app

### 功能验证
部署后请验证以下功能：
1. ✅ 首页访问
2. ✅ Markdown 转 Word 工具
3. ✅ Markdown 转 PDF 工具
4. ✅ Markdown 转 HTML 工具
5. ✅ YAML 转 JSON 工具
6. ✅ AdSense 管理界面

## 支持与联系

如有问题，请：
1. 查看项目 [README.md](./README.md)
2. 检查 Vercel 文档
3. 查看控制台错误信息
4. 联系项目维护者

---

**最后更新**: 2026年4月16日
**部署状态**: ✅ 已部署到生产环境