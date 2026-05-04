'use client'

import { useState, useRef, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function MarkdownToHtml() {
  const [markdown, setMarkdown] = useState(`# Markdown 转 HTML 示例

将 Markdown 转换为干净的 HTML 代码，可直接用于网站、博客或文档系统。

## 功能演示

### 文本格式化
- **粗体文本**：使用 \`**粗体**\` 或 \`__粗体__\`
- *斜体文本*：使用 \`*斜体*\` 或 \`_斜体_\`
- ~~删除线文本~~：使用 \`~~删除线~~\`
- \`行内代码\`：使用反引号包裹

### 链接和图片
[访问 MD Tools 官网](https://md-tools.com)

![示例图片](https://via.placeholder.com/400x200/2563eb/ffffff?text=MD+Tools)

### 代码块
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>示例页面</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>欢迎使用 MD Tools</h1>
        <p>将 Markdown 转换为 HTML 从未如此简单！</p>
    </div>
</body>
</html>
\`\`\`

\`\`\`javascript
// JavaScript 代码示例
function convertMarkdownToHtml(markdown) {
    // 简单的转换逻辑
    return markdown
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
        .replace(/\\*(.*?)\\*/g, '<em>$1</em>')
        .replace(/\\n/g, '<br>')
}

// 使用示例
const html = convertMarkdownToHtml('# 标题\\n这是一段**重要**文本。')
console.log(html)
\`\`\`

### 表格示例
| 功能 | 状态 | 说明 |
|------|------|------|
| 标题转换 | ✅ | H1-H6 完整支持 |
| 列表转换 | ✅ | 有序和无序列表 |
| 代码高亮 | ✅ | 支持多种语言 |
| 表格转换 | ✅ | 完整表格样式 |
| 图片嵌入 | ✅ | 支持相对和绝对路径 |

### 引用块
> 这是一个引用块示例。
> 可以有多行内容。
> 
> — *MD Tools 团队*

## 使用提示
1. 在左侧编辑 Markdown 内容
2. 实时查看 HTML 预览
3. 复制生成的 HTML 代码
4. 直接用于您的项目

---
*最后更新: ${new Date().toLocaleDateString('zh-CN')}*
`)
  const [htmlOutput, setHtmlOutput] = useState('')
  const [theme, setTheme] = useState('github')
  const [includeStyles, setIncludeStyles] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const htmlOutputRef = useRef<HTMLTextAreaElement>(null)

  const themes = [
    { id: 'github', name: 'GitHub', desc: 'GitHub 风格的代码高亮' },
    { id: 'vs', name: 'Visual Studio', desc: 'VS Code 风格' },
    { id: 'atom', name: 'Atom', desc: 'Atom 编辑器风格' },
    { id: 'monokai', name: 'Monokai', desc: 'Sublime Text 风格' },
  ]

  useEffect(() => {
    const convertMarkdown = async () => {
      try {
        const { markdownToHtml, analyzeMarkdown } = await import('@/lib/markdown-converter')
        
        const html = markdownToHtml(markdown, {
          includeStyles: false, // 不在实时预览中包含样式
          theme,
          isDarkMode
        })
        
        setHtmlOutput(html)
        
        // 更新统计信息
        const stats = analyzeMarkdown(markdown)
        console.log('文档统计:', stats)
      } catch (error) {
        console.error('Markdown 转换失败:', error)
        // 降级到简单转换
        const simpleHtml = simpleMarkdownToHtml(markdown)
        setHtmlOutput(simpleHtml)
      }
    }
    
    convertMarkdown()
  }, [markdown, theme, isDarkMode])

  // 简单的降级转换函数
  const simpleMarkdownToHtml = (md: string) => {
    let html = md
    
    // 基本转换
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>')
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>')
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>')
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    html = html.replace(/\n\n/g, '</p><p>')
    html = html.replace(/\n/g, '<br>')
    
    return `<p>${html}</p>`
  }

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

  const handleCopyHtml = async () => {
    try {
      const { copyToClipboard } = await import('@/lib/file-utils')
      const success = await copyToClipboard(htmlOutput)
      
      if (success) {
        alert('HTML 代码已复制到剪贴板！')
      } else {
        alert('复制失败，请手动选择并复制代码')
      }
    } catch (error) {
      console.error('复制失败:', error)
      // 降级到传统方法
      if (htmlOutputRef.current) {
        htmlOutputRef.current.select()
        document.execCommand('copy')
        alert('HTML 代码已复制到剪贴板！')
      }
    }
  }

  const handleDownloadHtml = async () => {
    try {
      const { markdownToHtml, analyzeMarkdown } = await import('@/lib/markdown-converter')
      const { downloadFile } = await import('@/lib/file-utils')
      
      // 生成完整的 HTML
      const fullHtml = markdownToHtml(markdown, {
        includeStyles: true,
        theme,
        isDarkMode
      })
      
      // 下载文件
      const filename = `markdown-converted-${new Date().getTime()}.html`
      downloadFile(fullHtml, filename, 'text/html')
      
      // 显示统计信息
      const stats = analyzeMarkdown(markdown)
      alert(`HTML 文件已下载！\n文档统计:\n- 字符数: ${stats.characters}\n- 单词数: ${stats.words}\n- 标题数: ${stats.headings}\n- 代码块: ${stats.codeBlocks}`)
    } catch (error) {
      console.error('下载失败:', error)
      alert(`下载失败: ${error instanceof Error ? error.message : '请重试'}`)
    }
  }

  const handleClear = () => {
    setMarkdown('')
  }

  const handleExample = () => {
    setMarkdown(`# 博客文章示例

## 引言

欢迎阅读这篇由 Markdown 生成的博客文章示例。本文将展示如何利用 Markdown 的简洁语法创建内容丰富、格式规范的网页内容。

## 技术栈介绍

### 前端技术
- **React**: 用于构建用户界面
- **TypeScript**: 提供类型安全
- **Next.js**: 服务端渲染框架
- **Tailwind CSS**: 实用优先的 CSS 框架

### 后端技术
- **Node.js**: JavaScript 运行时
- **Express**: Web 应用框架
- **MongoDB**: NoSQL 数据库
- **Redis**: 缓存数据库

## 代码示例

\`\`\`typescript
interface User {
  id: number
  name: string
  email: string
  createdAt: Date
}

class UserService {
  private users: User[] = []

  addUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: this.users.length + 1,
      createdAt: new Date()
    }
    this.users.push(newUser)
    return newUser
  }

  getUsers(): User[] {
    return [...this.users]
  }
}

// 使用示例
const userService = new UserService()
userService.addUser({
  name: '张三',
  email: 'zhangsan@example.com'
})
\`\`\`

## 性能对比

| 方案 | 响应时间 | 内存占用 | 开发效率 |
|------|----------|----------|----------|
| 传统方案 | 200ms | 150MB | 中等 |
| 优化方案 | 50ms | 80MB | 高 |
| 改进幅度 | **-75%** | **-47%** | **+40%** |

## 实施步骤

1. **需求分析**
   - 确定项目目标
   - 收集用户需求
   - 制定技术方案

2. **系统设计**
   - 架构设计
   - 数据库设计
   - API 设计

3. **开发实施**
   - 前端开发
   - 后端开发
   - 集成测试

4. **部署上线**
   - 环境配置
   - 性能测试
   - 监控设置

## 总结

> "优秀的工具让复杂的工作变得简单。" — 技术格言

通过本文的介绍，我们可以看到 Markdown 作为一种轻量级标记语言，在文档编写和内容创作方面的巨大优势。结合现代化的转换工具，我们可以轻松地将 Markdown 内容转换为高质量的 HTML 页面。

## 下一步计划

- [ ] 添加更多代码高亮主题
- [ ] 支持数学公式渲染
- [ ] 集成图表生成功能
- [ ] 优化移动端体验

---
*文章作者: MD Tools 团队 | 发布日期: ${new Date().toLocaleDateString('zh-CN')}*
`)
  }

  return (
    <>
      <Navbar />

      {/* 工具头部 */}
      <section className="tool-header">
        <div className="container">
          <h1>Markdown 转 HTML</h1>
          <p>将 Markdown 转换为干净的 HTML 代码，可直接用于网站、博客或文档系统</p>
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

          {/* 右侧：输出区 */}
          <div className="tool-panel">
            <div className="tool-panel-header">
              <span>HTML 输出</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleCopyHtml} className="btn btn-secondary" style={{ fontSize: 12 }}>
                  复制代码
                </button>
                <button onClick={handleDownloadHtml} className="btn btn-secondary" style={{ fontSize: 12 }}>
                  下载文件
                </button>
              </div>
            </div>
            <div className="tool-panel-body">
              <textarea
                ref={htmlOutputRef}
                value={htmlOutput}
                readOnly
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
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-dim)' }}>
                共 {htmlOutput.length} 字符，{htmlOutput.split('\n').length} 行
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 设置面板 */}
      <div className="container" style={{ marginTop: 40 }}>
        <div className="tool-panel">
          <div className="tool-panel-header">
            <span>转换设置</span>
          </div>
          <div className="tool-panel-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  代码高亮主题
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                  {themes.map((t) => (
                    <label
                      key={t.id}
                      style={{
                        padding: '12px',
                        border: `2px solid ${theme === t.id ? 'var(--primary)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius)',
                        cursor: 'pointer',
                        background: theme === t.id ? 'var(--bg-secondary)' : 'var(--bg-card)',
                      }}
                    >
                      <input
                        type="radio"
                        name="theme"
                        value={t.id}
                        checked={theme === t.id}
                        onChange={(e) => setTheme(e.target.value)}
                        style={{ marginRight: 8 }}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{t.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>{t.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  输出选项
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={includeStyles}
                      onChange={(e) => setIncludeStyles(e.target.checked)}
                    />
                    <span>包含 CSS 样式</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={isDarkMode}
                      onChange={(e) => setIsDarkMode(e.target.checked)}
                    />
                    <span>深色模式</span>
                  </label>
                </div>

                <div style={{ marginTop: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                    文档统计
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center' }}>
                    <div className="card" style={{ padding: '12px 8px' }}>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>{markdown.length}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>Markdown 字符</div>
                    </div>
                    <div className="card" style={{ padding: '12px 8px' }}>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>{htmlOutput.length}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>HTML 字符</div>
                    </div>
                    <div className="card" style={{ padding: '12px 8px' }}>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>{theme}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>当前主题</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <section className="seo-content">
        <div className="container">
          <h2>Markdown 转 HTML 使用指南</h2>
          
          <h3>什么是 HTML？</h3>
          <p>
            HTML（超文本标记语言）是构建网页和 Web 应用的标准标记语言。
            它将 Markdown 的简洁语法转换为浏览器可以理解和渲染的标准 HTML 代码。
          </p>

          <h3>转换优势</h3>
          <ul>
            <li><strong>标准化输出</strong>：生成符合 W3C 标准的 HTML 代码</li>
            <li><strong>样式可控</strong>：支持多种主题和样式选项</li>
            <li><strong>代码高亮</strong>：自动为代码块添加语法高亮</li>
            <li><strong>响应式设计</strong>：生成的 HTML 适配各种设备屏幕</li>
            <li><strong>SEO 友好</strong>：生成语义化的 HTML 结构，有利于搜索引擎优化</li>
          </ul>

          <h3>应用场景</h3>
          <ul>
            <li><strong>博客系统</strong>：将 Markdown 文章转换为网页内容</li>
            <li><strong>文档网站</strong>：创建产品文档、API 文档等</li>
            <li><strong>电子邮件</strong>：生成 HTML 格式的邮件内容</li>
            <li><strong>内容管理系统</strong>：集成到 CMS 中作为编辑器输出</li>
            <li><strong>静态网站生成</strong>：配合静态网站生成器使用</li>
          </ul>

          <h3>支持的 Markdown 语法</h3>
          <table>
            <thead>
              <tr>
                <th>语法</th>
                <th>示例</th>
                <th>HTML 输出</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>标题</td>
                <td><code># 标题</code></td>
                <td><code>&lt;h1&gt;标题&lt;/h1&gt;</code></td>
              </tr>
              <tr>
                <td>粗体</td>
                <td><code>**文本**</code></td>
                <td><code>&lt;strong&gt;文本&lt;/strong&gt;</code></td>
              </tr>
              <tr>
                <td>斜体</td>
                <td><code>*文本*</code></td>
                <td><code>&lt;em&gt;文本&lt;/em&gt;</code></td>
              </tr>
              <tr>
                <td>代码块</td>
                <td><code>```js\ncode\n```</code></td>
                <td><code>&lt;pre&gt;&lt;code class="language-js"&gt;code&lt;/code&gt;&lt;/pre&gt;</code></td>
              </tr>
              <tr>
                <td>链接</td>
                <td><code>[文本](URL)</code></td>
                <td><code>&lt;a href="URL"&gt;文本&lt;/a&gt;</code></td>
              </tr>
              <tr>
                <td>图片</td>
                <td><code>![alt](URL)</code></td>
                <td><code>&lt;img src="URL" alt="alt"&gt;</code></td>
              </tr>
            </tbody>
          </table>

          <h3>最佳实践</h3>
          <ol>
            <li><strong>使用语义化标签</strong>：合理使用标题、段落、列表等语义化元素</li>
            <li><strong>优化图片</strong>：为图片添加 alt 文本，提高可访问性</li>
            <li><strong>代码质量</strong>：确保生成的 HTML 代码整洁、无错误</li>
            <li><strong>样式分离</strong>：将样式放在外部 CSS 文件中，提高可维护性</li>
            <li><strong>测试兼容性</strong>：在不同浏览器和设备上测试 HTML 显示效果</li>
          </ol>
        </div>
      </section>

      <Footer />
    </>
  )
}