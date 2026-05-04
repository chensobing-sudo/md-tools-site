'use client'

import { useState, useRef, useMemo } from 'react'
import Link from 'next/link'

export default function MarkdownToPdf() {
  const [markdown, setMarkdown] = useState(`# Markdown 转 PDF 示例

生成精美的 PDF 文档，适合打印、分享和存档。

## 文档信息

- **标题**: 项目报告
- **作者**: 张三
- **日期**: ${new Date().toLocaleDateString('zh-CN')}
- **版本**: 1.0.0

## 执行摘要

本报告详细介绍了项目的进展情况、遇到的问题以及下一步计划。
通过 Markdown 编写，转换为 PDF 格式便于分发和存档。

## 项目进展

### 已完成工作
1. ✅ 需求分析和规划
2. ✅ 系统架构设计
3. ✅ 核心功能开发
4. ✅ 单元测试编写

### 进行中工作
1. 🔄 集成测试
2. 🔄 性能优化
3. 🔄 文档编写

## 技术细节

### 系统架构
\`\`\`
┌─────────────────┐
│   用户界面层     │
├─────────────────┤
│  业务逻辑层     │
├─────────────────┤
│  数据访问层     │
└─────────────────┘
\`\`\`

### 性能指标

| 指标 | 目标值 | 当前值 | 状态 |
|------|--------|--------|------|
| 响应时间 | < 200ms | 150ms | ✅ |
| 并发用户 | > 1000 | 1200 | ✅ |
| 错误率 | < 0.1% | 0.05% | ✅ |
| 可用性 | > 99.9% | 99.95% | ✅ |

## 结论与建议

> **结论**: 项目按计划顺利进行，核心功能已基本完成。
>
> **建议**:
> 1. 继续完善测试覆盖
> 2. 加强性能监控
> 3. 准备用户培训材料

---
*文档由 MD Tools 生成 - ${new Date().toLocaleDateString('zh-CN')}*
`)
  const [pageSize, setPageSize] = useState('A4')
  const [orientation, setOrientation] = useState('portrait')
  const [includeHeader, setIncludeHeader] = useState(true)
  const [includeFooter, setIncludeFooter] = useState(true)
  const [fontSize, setFontSize] = useState('normal')
  const [lineSpacing, setLineSpacing] = useState('1.5')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const pageSizes = [
    { id: 'A4', name: 'A4', desc: '标准文档尺寸 (210×297mm)' },
    { id: 'Letter', name: 'Letter', desc: '北美标准 (216×279mm)' },
    { id: 'Legal', name: 'Legal', desc: '法律文档 (216×356mm)' },
    { id: 'A5', name: 'A5', desc: '小册子尺寸 (148×210mm)' },
  ]

  // 简单的 Markdown 转 HTML 预览
  const previewHtml = useMemo(() => {
    let html = markdown
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
      .split('\n\n').map(p => {
        const trimmed = p.trim()
        if (!trimmed) return ''
        if (trimmed.startsWith('<h') || trimmed.startsWith('<pre') || trimmed.startsWith('<table')) return trimmed
        return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`
      }).join('\n')
    return html
  }, [markdown])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setMarkdown(content)
    }
    reader.readAsText(file)
  }

  const handleConvert = async () => {
    setIsConverting(true)

    try {
      const { validateMarkdownForPdf } = await import('@/lib/pdf-generator')
      const validation = validateMarkdownForPdf(markdown)

      if (!validation.valid) {
        alert(`文档验证失败: ${validation.errors.join(', ')}`)
        return
      }

      if (validation.warnings.length > 0) {
        console.log('文档警告:', validation.warnings)
      }

      await new Promise(resolve => setTimeout(resolve, 1000))

      const { generatePdfWithPrint, estimatePdfPages } = await import('@/lib/pdf-generator')

      const options = {
        title: `Markdown 转换文档 - ${new Date().toLocaleDateString('zh-CN')}`,
        author: 'MD Tools 用户',
        subject: '由 MD Tools 生成的 PDF 文档',
        pageSize: pageSize as any,
        orientation: orientation as any,
        includeHeader,
        includeFooter,
        theme: isDarkMode ? 'dark' : 'light' as any
      }

      const estimatedPages = estimatePdfPages(markdown, options)
      await generatePdfWithPrint(markdown, options)

      alert(`PDF 生成成功！预计 ${estimatedPages} 页。请使用浏览器的打印功能保存为 PDF。`)
    } catch (error) {
      console.error('转换失败:', error)
      alert(`转换失败: ${error instanceof Error ? error.message : '请重试'}`)
    } finally {
      setIsConverting(false)
    }
  }

  const handleClear = () => {
    setMarkdown('')
  }

  const handleExample = () => {
    setMarkdown(`# 技术文档示例

## 项目概述

这是一个技术文档示例，展示了如何将 Markdown 转换为精美的 PDF 文档。

## 安装说明

\`\`\`bash
# 克隆仓库
git clone https://github.com/example/project.git

# 安装依赖
npm install

# 启动开发服务器
npm run dev
\`\`\`

## 配置选项

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| \`port\` | number | 3000 | 服务器端口 |
| \`debug\` | boolean | false | 调试模式 |
| \`cache\` | boolean | true | 启用缓存 |
| \`logLevel\` | string | 'info' | 日志级别 |

## API 参考

### GET /api/users
获取用户列表。

**请求参数**:
- \`page\`: 页码 (可选)
- \`limit\`: 每页数量 (可选)

**响应示例**:
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "张三",
      "email": "zhangsan@example.com"
    }
  ],
  "total": 100
}
\`\`\`

## 故障排除

### 常见问题

1. **无法启动服务**
   - 检查端口是否被占用
   - 确认依赖已正确安装

2. **数据库连接失败**
   - 检查数据库服务是否运行
   - 验证连接配置

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0.0 | 2024-01-01 | 初始版本 |
| 1.1.0 | 2024-02-01 | 新增 API 功能 |
| 1.2.0 | 2024-03-01 | 性能优化 |

---
*文档最后更新: ${new Date().toLocaleDateString('zh-CN')}*
`)
  }

  return (
    <>
      {/* 工具头部 */}
      <section className="tool-header">
        <div className="container">
          <h1>Markdown 转 PDF</h1>
          <p>将 Markdown 文档转换为精美的 PDF 文件，适合打印、分享和存档</p>
          <div style={{ marginTop: 16, display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/" className="btn btn-secondary">
              ← 返回首页
            </Link>
            <button onClick={handleExample} className="btn btn-secondary">
              加载示例
            </button>
          </div>
        </div>
      </section>

      {/* 工具工作区 */}
      <div className="container">
        <div className="tool-workspace">
          {/* 左侧：输入区 */}
          <div className="tool-panel">
            <div className="tool-panel-header">
              <span>Markdown 输入</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => fileInputRef.current?.click()} className="btn btn-secondary" style={{ fontSize: 12 }}>
                  上传文件
                </button>
                <button onClick={handleClear} className="btn btn-secondary" style={{ fontSize: 12 }}>
                  清空
                </button>
              </div>
            </div>
            <div className="tool-panel-body">
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="在此输入或粘贴 Markdown 内容..."
                style={{
                  width: '100%',
                  height: '400px',
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  resize: 'vertical',
                  background: 'var(--bg)',
                  color: 'var(--text)',
                }}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".md,.markdown,.txt"
                style={{ display: 'none' }}
              />
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-dim)' }}>
                支持 .md, .markdown, .txt 格式文件
              </div>
            </div>
          </div>

          {/* 右侧：输出预览 */}
          <div className="tool-panel">
            <div className="tool-panel-header">
              <span>输出预览</span>
            </div>
            <div className="tool-panel-body">
              <div
                style={{
                  width: '100%',
                  height: '400px',
                  padding: '16px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  overflow: 'auto',
                  background: 'var(--bg-card)',
                  color: 'var(--text)',
                  fontSize: '14px',
                  lineHeight: '1.8',
                }}
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-dim)' }}>
                实时预览 Markdown 渲染效果
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 输出设置 - 下拉菜单形式 */}
      <div className="container" style={{ marginTop: 24 }}>
        <div className="tool-panel">
          <div className="tool-panel-header">
            <span>输出设置</span>
          </div>
          <div className="tool-panel-body">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end' }}>
              {/* 页面尺寸 */}
              <div style={{ flex: '1 1 180px', minWidth: 160 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                  页面尺寸
                </label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card)',
                    color: 'var(--text)',
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  {pageSizes.map(size => (
                    <option key={size.id} value={size.id}>{size.name} — {size.desc}</option>
                  ))}
                </select>
              </div>

              {/* 页面方向 */}
              <div style={{ flex: '0 1 150px', minWidth: 130 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                  页面方向
                </label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card)',
                    color: 'var(--text)',
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  <option value="portrait">纵向</option>
                  <option value="landscape">横向</option>
                </select>
              </div>

              {/* 字体大小 */}
              <div style={{ flex: '0 1 150px', minWidth: 130 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                  字体大小
                </label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card)',
                    color: 'var(--text)',
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  <option value="small">小 (10pt)</option>
                  <option value="normal">正常 (12pt)</option>
                  <option value="large">大 (14pt)</option>
                </select>
              </div>

              {/* 行间距 */}
              <div style={{ flex: '0 1 150px', minWidth: 130 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                  行间距
                </label>
                <select
                  value={lineSpacing}
                  onChange={(e) => setLineSpacing(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card)',
                    color: 'var(--text)',
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  <option value="single">单倍行距</option>
                  <option value="1.5">1.5 倍行距</option>
                  <option value="double">双倍行距</option>
                </select>
              </div>

              {/* 文档元素 */}
              <div style={{ flex: '1 1 200px', minWidth: 180 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                  文档元素
                </label>
                <div style={{ display: 'flex', gap: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={includeHeader}
                      onChange={(e) => setIncludeHeader(e.target.checked)}
                    />
                    页眉
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={includeFooter}
                      onChange={(e) => setIncludeFooter(e.target.checked)}
                    />
                    页脚
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isDarkMode}
                      onChange={(e) => setIsDarkMode(e.target.checked)}
                    />
                    深色
                  </label>
                </div>
              </div>

              {/* 文档统计 */}
              <div style={{ flex: '1 1 200px', minWidth: 180 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                  文档统计
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { label: '字符', value: markdown.length },
                    { label: '单词', value: markdown.split(/\s+/).length },
                    { label: '行数', value: markdown.split('\n').length },
                  ].map(s => (
                    <div key={s.label} style={{
                      flex: 1,
                      padding: '8px 4px',
                      textAlign: 'center',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius)',
                    }}>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 转换按钮 */}
              <div style={{ flex: '0 0 auto' }}>
                <button
                  onClick={handleConvert}
                  disabled={isConverting || !markdown.trim()}
                  className="btn btn-primary"
                  style={{ padding: '10px 28px', fontSize: 15, whiteSpace: 'nowrap' }}
                >
                  {isConverting ? '生成中...' : '生成 PDF 文档'}
                </button>
              </div>
            </div>

            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-dim)', textAlign: 'center' }}>
              使用浏览器打印功能保存为 PDF，文档不会上传到服务器
            </div>
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <section className="seo-content">
        <div className="container">
          <h2>Markdown 转 PDF 使用指南</h2>

          <h3>为什么选择 PDF 格式？</h3>
          <p>
            PDF（便携式文档格式）是一种广泛使用的文档格式，具有以下优点：
          </p>
          <ul>
            <li><strong>跨平台兼容</strong>：在所有设备和操作系统上显示效果一致</li>
            <li><strong>格式固定</strong>：文档布局和样式不会因查看环境而改变</li>
            <li><strong>适合打印</strong>：保持原始排版，适合纸质文档输出</li>
            <li><strong>安全性</strong>：支持密码保护和权限控制</li>
            <li><strong>标准化</strong>：行业和学术领域的标准文档格式</li>
          </ul>

          <h3>适用场景</h3>
          <ul>
            <li><strong>技术文档</strong>：API 文档、用户手册、开发指南</li>
            <li><strong>学术论文</strong>：研究报告、学位论文、期刊文章</li>
            <li><strong>商业文件</strong>：合同、提案、报告、简历</li>
            <li><strong>宣传材料</strong>：产品手册、宣传册、电子书</li>
            <li><strong>个人文档</strong>：笔记、日记、计划表</li>
          </ul>

          <h3>最佳实践</h3>
          <ol>
            <li><strong>使用清晰的标题结构</strong>：合理使用 H1-H6 标题，便于生成目录</li>
            <li><strong>优化表格设计</strong>：避免过于复杂的表格，确保在 PDF 中可读</li>
            <li><strong>控制文档长度</strong>：过长的文档可能影响 PDF 生成性能</li>
            <li><strong>测试打印预览</strong>：生成前使用打印预览检查布局</li>
            <li><strong>选择合适的页面尺寸</strong>：根据用途选择 A4、Letter 等标准尺寸</li>
          </ol>

          <h3>隐私保护承诺</h3>
          <p>
            我们重视您的隐私安全。所有 Markdown 转 PDF 的转换过程都在您的浏览器本地完成，
            文档内容不会上传到任何服务器，也不会被第三方访问。您可以放心处理敏感文档。
          </p>

          <h3>技术支持</h3>
          <p>
            如果在使用过程中遇到问题，请参考以下解决方案：
          </p>
          <ul>
            <li><strong>PDF 生成失败</strong>：检查浏览器是否支持打印功能，尝试使用 Chrome 或 Firefox</li>
            <li><strong>格式错乱</strong>：简化复杂的 Markdown 语法，避免嵌套过深</li>
            <li><strong>中文显示问题</strong>：确保使用标准的中文字符，避免特殊符号</li>
            <li><strong>性能问题</strong>：对于超长文档，建议分段转换</li>
          </ul>
        </div>
      </section>
    </>
  )
}
