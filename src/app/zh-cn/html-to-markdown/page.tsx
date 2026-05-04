'use client'

import { useState, useRef, useEffect } from 'react'
import ToolLayout from '@/components/shared/ToolLayout'
import EditorPanel from '@/components/shared/EditorPanel'
import SettingsPanel from '@/components/shared/SettingsPanel'
import { Button } from '@/components/ui/button'

export default function HtmlToMarkdown() {
  const [htmlInput, setHtmlInput] = useState(`<h1>欢迎使用 HTML 转 Markdown 工具</h1>

<p>这是一个 <strong>示例 HTML</strong> 文档，展示了各种 HTML 元素如何转换为 Markdown 格式。</p>

<h2>功能特点</h2>

<ul>
  <li>支持标题转换（H1-H6）</li>
  <li>支持 <strong>粗体</strong> 和 <em>斜体</em> 文本</li>
  <li>支持 <code>行内代码</code> 和代码块</li>
  <li>支持链接和图片</li>
  <li>支持列表和表格</li>
</ul>

<h3>代码示例</h3>

<pre><code class="language-javascript">function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
</code></pre>

<h3>表格示例</h3>

<table>
  <thead>
    <tr>
      <th>功能</th>
      <th>状态</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>标题转换</td>
      <td>✅</td>
      <td>完整支持</td>
    </tr>
    <tr>
      <td>列表转换</td>
      <td>✅</td>
      <td>有序和无序</td>
    </tr>
  </tbody>
</table>

<blockquote>
  <p>这是一个引用块示例。</p>
  <p>可以包含多行内容。</p>
</blockquote>

<p>更多信息请访问 <a href="https://md-tools.com">MD Tools 官网</a>。</p>`)
  const [markdownOutput, setMarkdownOutput] = useState('')
  const [error, setError] = useState('')
  const outputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    convertHtmlToMarkdown()
  }, [htmlInput])

  const convertHtmlToMarkdown = async () => {
    if (!htmlInput.trim()) {
      setMarkdownOutput('')
      setError('')
      return
    }

    try {
      const { htmlToMarkdown, validateHtml } = await import('@/lib/html-markdown-converter')
      const validation = validateHtml(htmlInput)
      if (!validation.valid) {
        setError(validation.error || '无效的 HTML')
        setMarkdownOutput('')
        return
      }

      setError('')
      const md = htmlToMarkdown(htmlInput)
      setMarkdownOutput(md)
    } catch (err) {
      setError(err instanceof Error ? err.message : '转换失败')
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownOutput)
      alert('Markdown 已复制到剪贴板！')
    } catch {
      if (outputRef.current) {
        outputRef.current.select()
        document.execCommand('copy')
        alert('Markdown 已复制到剪贴板！')
      }
    }
  }

  const handleDownload = () => {
    const blob = new Blob([markdownOutput], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `converted-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExample = () => {
    setHtmlInput(`<article>
  <h1>技术博客文章示例</h1>
  <p>本文展示了如何将 <strong>HTML 内容</strong> 转换为 Markdown 格式。</p>

  <h2>为什么使用 Markdown？</h2>
  <p>Markdown 是一种轻量级标记语言，具有以下优点：</p>
  <ul>
    <li>语法简单，易于学习</li>
    <li>可读性强，纯文本即可阅读</li>
    <li>广泛支持，几乎所有平台都支持</li>
    <li>版本控制友好，易于 diff</li>
  </ul>

  <h2>安装指南</h2>
  <pre><code>npm install marked
# 或者使用 yarn
yarn add marked</code></pre>

  <h2>配置选项</h2>
  <table>
    <tr>
      <th>选项</th>
      <th>类型</th>
      <th>默认值</th>
    </tr>
    <tr>
      <td>gfm</td>
      <td>boolean</td>
      <td>true</td>
    </tr>
    <tr>
      <td>breaks</td>
      <td>boolean</td>
      <td>false</td>
    </tr>
  </table>

  <blockquote>
    <p>提示：选择合适的工具可以让工作效率翻倍。</p>
  </blockquote>

  <p>了解更多，请访问 <a href="https://marked.js.org">marked 官方文档</a>。</p>
</article>`)
  }

  return (
    <ToolLayout
      title="HTML 转 Markdown"
      description="将 HTML 代码快速还原为 Markdown 格式，支持标题、列表、表格、代码块等常见元素"
      seoContent={
        <>
          <h2>HTML 转 Markdown 使用指南</h2>
          <p>
            HTML 转 Markdown 工具帮助您将网页 HTML 代码快速转换为简洁的 Markdown 格式。
            无论您是内容创作者、开发者还是博客作者，都能轻松从 HTML 中提取 Markdown 内容。
          </p>
          <h3>适用场景</h3>
          <ul>
            <li><strong>内容迁移</strong>：将现有 HTML 内容迁移到 Markdown 格式的 CMS 或博客</li>
            <li><strong>网页抓取</strong>：从网页中提取内容并转换为 Markdown 存档</li>
            <li><strong>文档整理</strong>：将 HTML 格式的文档转换为更易读的 Markdown</li>
            <li><strong>邮件转换</strong>：将 HTML 邮件内容转换为 Markdown 格式</li>
          </ul>
          <h3>支持的元素</h3>
          <ul>
            <li>标题（H1-H6）</li>
            <li>粗体、斜体、删除线</li>
            <li>行内代码和代码块（保留语言标识）</li>
            <li>有序列表和无序列表</li>
            <li>链接和图片</li>
            <li>引用块</li>
            <li>表格</li>
            <li>水平线</li>
          </ul>
        </>
      }
    >
      {/* 错误提示 */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
          <strong>错误：</strong> {error}
        </div>
      )}

      <div className="tool-workspace">
        <EditorPanel
          label="HTML 输入"
          value={htmlInput}
          onChange={setHtmlInput}
          placeholder="在此输入或粘贴 HTML 代码..."
          accept=".html,.htm"
          stats={[
            { label: '字符', value: htmlInput.length },
            { label: '标签', value: (htmlInput.match(/<[^>]+>/g) || []).length.toString() },
          ]}
        />

        <div className="tool-panel">
          <div className="tool-panel-header">
            <span>Markdown 输出</span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={handleCopy}>复制</Button>
              <Button variant="secondary" size="sm" onClick={handleDownload}>下载</Button>
            </div>
          </div>
          <div className="tool-panel-body">
            <textarea
              ref={outputRef}
              value={markdownOutput}
              readOnly
              className="editor-textarea"
              placeholder="转换后的 Markdown 将显示在这里..."
            />
            <div className="mt-3 text-xs text-muted-foreground">
              共 {markdownOutput.length} 字符，{markdownOutput.split('\n').length} 行
            </div>
          </div>
        </div>
      </div>

      {/* 设置面板 */}
      <div className="mb-10">
        <SettingsPanel title="操作">
          <div className="flex gap-3">
            <Button onClick={handleExample} variant="outline">加载示例</Button>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>提示：HTML 转 Markdown 是实时转换的，修改左侧 HTML 内容后右侧会立即更新。</p>
          </div>
        </SettingsPanel>
      </div>
    </ToolLayout>
  )
}
