'use client'

import { useState, useRef, useMemo } from 'react'
import Link from 'next/link'

export default function MarkdownToWord() {
  const [markdown, setMarkdown] = useState(`# Markdown 转 Word 示例

这是一个示例 Markdown 文档，您可以编辑它或上传自己的文件。

## 功能特点

- ✅ **快速转换**：毫秒级转换速度
- ✅ **多种模板**：商务、学术、极简等风格
- ✅ **完整支持**：表格、代码块、图片等
- ✅ **本地处理**：文件不上传服务器，保护隐私

## 使用说明

1. 在左侧编辑 Markdown 内容
2. 选择您喜欢的模板样式
3. 点击"生成 Word 文档"按钮
4. 下载生成的 .docx 文件

## 代码示例

\`\`\`javascript
// 这是一个 JavaScript 代码示例
function greet(name) {
  return \`Hello, \${name}!\`
}

console.log(greet('World'))
\`\`\`

## 表格示例

| 功能 | 状态 | 说明 |
|------|------|------|
| 标题支持 | ✅ | 支持 H1-H6 标题 |
| 列表支持 | ✅ | 有序列表和无序列表 |
| 代码高亮 | ✅ | 支持多种编程语言 |
| 表格转换 | ✅ | 完整表格样式支持 |
| 图片嵌入 | ✅ | 支持本地和网络图片 |

> 提示：所有转换都在浏览器本地完成，确保您的数据安全。
`)
  const [template, setTemplate] = useState('business')
  const [orientation, setOrientation] = useState('portrait')
  const [margin, setMargin] = useState('normal')
  const [isConverting, setIsConverting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const templates = [
    { id: 'business', name: '商务模板', desc: '专业商务文档样式' },
    { id: 'academic', name: '学术模板', desc: '适合论文和报告' },
    { id: 'minimal', name: '极简模板', desc: '简洁干净的样式' },
    { id: 'creative', name: '创意模板', desc: '设计感强的样式' },
  ]

  // 简单的 Markdown 转 HTML 预览
  const previewHtml = useMemo(() => {
    let html = markdown
      // 标题
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      // 粗体和斜体
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // 行内代码
      .replace(/`(.+?)`/g, '<code>$1</code>')
      // 链接
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
      // 换行转段落
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
      await new Promise(resolve => setTimeout(resolve, 1000))

      const { generateDocx, downloadDocx, estimateDocxPages, validateMarkdownForDocx } = await import('@/lib/docx-generator')

      const validation = validateMarkdownForDocx(markdown)
      if (!validation.valid) {
        alert(`文档验证失败: ${validation.errors.join(', ')}`)
        return
      }

      if (validation.warnings.length > 0) {
        console.log('文档警告:', validation.warnings)
      }

      const options = {
        template: template as any,
        title: `Markdown 转换文档 - ${new Date().toLocaleDateString('zh-CN')}`,
        author: 'MD Tools 用户',
        description: '由 MD Tools 生成的 Word 文档'
      }

      const estimatedPages = estimateDocxPages(markdown, options)
      const docxBlob = await generateDocx(markdown, options)
      const filename = `markdown-converted-${new Date().getTime()}.docx`
      downloadDocx(docxBlob, filename)

      alert(`Word 文档生成成功！预计 ${estimatedPages} 页。`)
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
    setMarkdown(`# 新的示例文档

这是一个新的示例，展示了更多 Markdown 功能。

## 二级标题

### 三级标题

#### 四级标题

## 列表示例

### 无序列表
- 项目一
- 项目二
  - 子项目 A
  - 子项目 B
- 项目三

### 有序列表
1. 第一步
2. 第二步
3. 第三步

## 强调文本

**粗体文本** 和 *斜体文本*

## 链接和图片

[访问 MD Tools](https://md-tools.com)

![示例图片](https://via.placeholder.com/400x200)

## 引用块

> 这是一个引用块
> 可以有多行内容
`)
  }

  return (
    <>
      {/* 工具头部 */}
      <section className="tool-header">
        <div className="container">
          <h1>Markdown 转 Word</h1>
          <p>将 Markdown 文档转换为专业的 Word 文档 (.docx)，支持多种模板和样式</p>
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

          {/* 右侧：输出预览 + 设置 */}
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
              {/* 模板选择 */}
              <div style={{ flex: '1 1 200px', minWidth: 180 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                  文档模板
                </label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
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
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name} — {t.desc}</option>
                  ))}
                </select>
              </div>

              {/* 页面方向 */}
              <div style={{ flex: '0 1 160px', minWidth: 140 }}>
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

              {/* 页边距 */}
              <div style={{ flex: '0 1 160px', minWidth: 140 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                  页边距
                </label>
                <select
                  value={margin}
                  onChange={(e) => setMargin(e.target.value)}
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
                  <option value="normal">正常</option>
                  <option value="narrow">窄边距</option>
                  <option value="wide">宽边距</option>
                </select>
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
                  {isConverting ? '转换中...' : '生成 Word 文档'}
                </button>
              </div>
            </div>

            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-dim)', textAlign: 'center' }}>
              转换过程在浏览器本地完成，文件不会上传到服务器
            </div>
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <section className="seo-content">
        <div className="container">
          <h2>Markdown 转 Word 使用指南</h2>

          <h3>什么是 Markdown？</h3>
          <p>
            Markdown 是一种轻量级标记语言，使用简单的符号（如 #、*、- 等）来格式化文本。
            它被广泛用于文档编写、博客文章、README 文件等。
          </p>

          <h3>为什么需要 Markdown 转 Word？</h3>
          <p>
            Word 文档 (.docx) 是商业和学术领域最常用的文档格式。将 Markdown 转换为 Word 可以：
          </p>
          <ul>
            <li>与不熟悉 Markdown 的同事或客户共享文档</li>
            <li>满足正式文档的格式要求</li>
            <li>进行打印和纸质存档</li>
            <li>使用 Word 的高级编辑功能</li>
          </ul>

          <h3>支持的功能</h3>
          <ul>
            <li><strong>标题</strong>：支持 H1 到 H6 六级标题</li>
            <li><strong>列表</strong>：有序列表和无序列表</li>
            <li><strong>表格</strong>：完整的表格样式支持</li>
            <li><strong>代码块</strong>：支持语法高亮</li>
            <li><strong>引用</strong>：引用块样式</li>
            <li><strong>强调</strong>：粗体、斜体、删除线</li>
            <li><strong>链接和图片</strong>：内嵌链接和图片</li>
          </ul>

          <h3>隐私保护</h3>
          <p>
            所有转换都在您的浏览器中本地完成，Markdown 内容不会上传到任何服务器。
            这意味着您的文档始终安全，不会被第三方访问。
          </p>
        </div>
      </section>
    </>
  )
}
