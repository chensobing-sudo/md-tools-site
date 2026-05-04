/**
 * Markdown 转换工具库
 * 提供 Markdown 到各种格式的转换功能
 */

/**
 * 将 Markdown 转换为 HTML
 * @param markdown Markdown 文本
 * @param options 转换选项
 * @returns HTML 字符串
 */
export function markdownToHtml(markdown: string, options: {
  includeStyles?: boolean
  theme?: string
  isDarkMode?: boolean
} = {}): string {
  const {
    includeStyles = true,
    theme = 'github',
    isDarkMode = false
  } = options

  // 简单的 Markdown 转换逻辑
  let html = markdown
  
  // 标题转换
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>')
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>')
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>')
  html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>')
  html = html.replace(/^##### (.*$)/gm, '<h5>$1</h5>')
  html = html.replace(/^###### (.*$)/gm, '<h6>$1</h6>')
  
  // 粗体
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>')
  
  // 斜体
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  html = html.replace(/_(.*?)_/g, '<em>$1</em>')
  
  // 删除线
  html = html.replace(/~~(.*?)~~/g, '<del>$1</del>')
  
  // 行内代码
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  
  // 代码块
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code class="language-${lang || 'text'}">${escapeHtml(code)}</code></pre>`
  })
  
  // 无序列表
  html = html.replace(/^\s*[-*+] (.*$)/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
    return `<ul>${match}</ul>`
  })
  
  // 有序列表
  html = html.replace(/^\s*\d+\. (.*$)/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
    return `<ol>${match}</ol>`
  })
  
  // 链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
  
  // 图片
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;height:auto;">')
  
  // 引用块
  html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
  
  // 水平线
  html = html.replace(/^---$/gm, '<hr>')
  html = html.replace(/^\*\*\*$/gm, '<hr>')
  html = html.replace(/^___$/gm, '<hr>')
  
  // 换行处理
  html = html.replace(/\n\n/g, '</p><p>')
  html = html.replace(/\n/g, '<br>')
  
  // 包装段落
  const lines = html.split('</p><p>')
  const wrappedLines = lines.map(line => {
    if (!line.startsWith('<') || line.startsWith('<p>')) {
      return `<p>${line}</p>`
    }
    return line
  })
  html = wrappedLines.join('')

  // 添加完整 HTML 结构
  if (includeStyles) {
    const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown 转换结果</title>
    <style>
        ${getThemeStyles(theme, isDarkMode)}
    </style>
</head>
<body>
    <div class="markdown-content">
        ${html}
    </div>
</body>
</html>`
    return fullHtml
  }

  return html
}

/**
 * 获取主题样式
 */
function getThemeStyles(theme: string, isDarkMode: boolean): string {
  const baseStyles = `
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: ${isDarkMode ? '#f8fafc' : '#0f172a'};
      background: ${isDarkMode ? '#0f172a' : '#ffffff'};
    }
    .markdown-content {
      width: 100%;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: 600;
      line-height: 1.25;
    }
    h1 { font-size: 2em; }
    h2 { font-size: 1.5em; }
    h3 { font-size: 1.25em; }
    code {
      background: ${isDarkMode ? '#1e293b' : '#f1f5f9'};
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'SFMono-Regular', Consolas, monospace;
      font-size: 0.9em;
    }
    pre {
      background: ${isDarkMode ? '#1e293b' : '#f8fafc'};
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      border: 1px solid ${isDarkMode ? '#334155' : '#e2e8f0'};
    }
    pre code {
      background: transparent;
      padding: 0;
    }
    blockquote {
      border-left: 4px solid ${isDarkMode ? '#475569' : '#cbd5e1'};
      padding-left: 16px;
      margin-left: 0;
      color: ${isDarkMode ? '#94a3b8' : '#64748b'};
    }
    img {
      max-width: 100%;
      height: auto;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    th, td {
      border: 1px solid ${isDarkMode ? '#475569' : '#cbd5e1'};
      padding: 8px 12px;
      text-align: left;
    }
    th {
      background: ${isDarkMode ? '#1e293b' : '#f8fafc'};
      font-weight: 600;
    }
    ul, ol {
      padding-left: 2em;
    }
    hr {
      border: none;
      border-top: 1px solid ${isDarkMode ? '#475569' : '#e2e8f0'};
      margin: 2em 0;
    }
    a {
      color: ${isDarkMode ? '#60a5fa' : '#2563eb'};
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  `

  // 主题特定的样式
  const themeStyles: Record<string, string> = {
    github: `
      pre code {
        color: ${isDarkMode ? '#e5e7eb' : '#24292e'};
      }
      .language-javascript { color: ${isDarkMode ? '#fbbf24' : '#d73a49'}; }
      .language-html { color: ${isDarkMode ? '#34d399' : '#22863a'}; }
      .language-css { color: ${isDarkMode ? '#60a5fa' : '#6f42c1'}; }
    `,
    vs: `
      pre {
        background: ${isDarkMode ? '#1e1e1e' : '#f3f3f3'};
      }
      .language-javascript { color: ${isDarkMode ? '#9cdcfe' : '#000080'}; }
      .language-html { color: ${isDarkMode ? '#ce9178' : '#a31515'}; }
      .language-css { color: ${isDarkMode ? '#d7ba7d' : '#0451a5'}; }
    `,
    atom: `
      pre {
        background: ${isDarkMode ? '#282c34' : '#fafafa'};
      }
      .language-javascript { color: ${isDarkMode ? '#61afef' : '#d19a66'}; }
      .language-html { color: ${isDarkMode ? '#e06c75' : '#e45649'}; }
      .language-css { color: ${isDarkMode ? '#98c379' : '#50a14f'}; }
    `,
    monokai: `
      pre {
        background: ${isDarkMode ? '#272822' : '#f8f8f2'};
      }
      .language-javascript { color: ${isDarkMode ? '#f8f8f2' : '#66d9ef'}; }
      .language-html { color: ${isDarkMode ? '#f92672' : '#f92672'}; }
      .language-css { color: ${isDarkMode ? '#a6e22e' : '#a6e22e'}; }
    `
  }

  return baseStyles + (themeStyles[theme] || themeStyles.github)
}

/**
 * 转义 HTML 特殊字符
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * 分析 Markdown 文档统计信息
 */
export interface MarkdownStats {
  characters: number
  words: number
  lines: number
  headings: number
  links: number
  images: number
  codeBlocks: number
  lists: number
}

export function analyzeMarkdown(markdown: string): MarkdownStats {
  const lines = markdown.split('\n')
  
  return {
    characters: markdown.length,
    words: markdown.split(/\s+/).length,
    lines: lines.length,
    headings: (markdown.match(/^#+\s+/gm) || []).length,
    links: (markdown.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []).length,
    images: (markdown.match(/!\[([^\]]*)\]\(([^)]+)\)/g) || []).length,
    codeBlocks: (markdown.match(/```[\s\S]*?```/g) || []).length,
    lists: (markdown.match(/^(\s*[-*+]\s+|^\s*\d+\.\s+)/gm) || []).length
  }
}

/**
 * 清理和格式化 Markdown 文本
 */
export function cleanMarkdown(markdown: string): string {
  let cleaned = markdown
  
  // 移除多余的空行（保留最多两个连续空行）
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n')
  
  // 标准化换行符
  cleaned = cleaned.replace(/\r\n/g, '\n')
  
  // 移除行尾空格
  cleaned = cleaned.replace(/[ \t]+$/gm, '')
  
  // 标准化缩进（2个空格）
  cleaned = cleaned.replace(/^\s+/gm, (match) => {
    const spaces = match.replace(/\t/g, '  ')
    return '  '.repeat(Math.floor(spaces.length / 2))
  })
  
  return cleaned
}

/**
 * 提取 Markdown 文档的标题结构
 */
export interface Heading {
  level: number
  text: string
  id: string
}

export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = []
  const lines = markdown.split('\n')
  
  for (const line of lines) {
    const match = line.match(/^(#+)\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
      
      headings.push({ level, text, id })
    }
  }
  
  return headings
}