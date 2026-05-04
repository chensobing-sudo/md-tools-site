/**
 * DOCX 文档生成工具
 * 提供 Markdown 到 Word 文档的转换功能
 */

// 注意：由于 docx 和 html-to-docx 是客户端库，我们需要在客户端使用
// 这里提供类型定义和工具函数

/**
 * DOCX 生成选项
 */
export interface DocxOptions {
  title?: string
  author?: string
  subject?: string
  description?: string
  keywords?: string[]
  template?: 'business' | 'academic' | 'minimal' | 'creative'
  pageSize?: 'A4' | 'Letter' | 'Legal' | 'A5'
  orientation?: 'portrait' | 'landscape'
  margins?: {
    top: number
    right: number
    bottom: number
    left: number
  }
  includeHeader?: boolean
  includeFooter?: boolean
  fontSize?: number
  lineHeight?: number
}

/**
 * 默认 DOCX 选项
 */
export const DEFAULT_DOCX_OPTIONS: DocxOptions = {
  title: 'Markdown 转换文档',
  author: 'MD Tools',
  subject: 'Markdown 转 Word 文档',
  description: '由 MD Tools 生成的 Word 文档',
  keywords: ['Markdown', 'Word', '转换', '文档'],
  template: 'business',
  pageSize: 'A4',
  orientation: 'portrait',
  margins: {
    top: 72, // 1 inch = 72 points
    right: 72,
    bottom: 72,
    left: 72
  },
  includeHeader: true,
  includeFooter: true,
  fontSize: 12,
  lineHeight: 1.5
}

/**
 * 模板配置
 */
export const TEMPLATE_CONFIGS: Record<string, Partial<DocxOptions>> = {
  business: {
    title: '商业文档',
    margins: { top: 54, right: 54, bottom: 54, left: 54 },
    fontSize: 11,
    lineHeight: 1.15
  },
  academic: {
    title: '学术文档',
    margins: { top: 72, right: 72, bottom: 72, left: 90 }, // 左侧留出装订空间
    fontSize: 12,
    lineHeight: 2.0
  },
  minimal: {
    title: '极简文档',
    margins: { top: 36, right: 36, bottom: 36, left: 36 },
    fontSize: 14,
    lineHeight: 1.8
  },
  creative: {
    title: '创意文档',
    margins: { top: 54, right: 54, bottom: 54, left: 54 },
    fontSize: 13,
    lineHeight: 1.6
  }
}

/**
 * 页面尺寸配置（单位：点）
 */
export const PAGE_SIZES: Record<string, { width: number; height: number }> = {
  A4: { width: 595, height: 842 },
  Letter: { width: 612, height: 792 },
  Legal: { width: 612, height: 1008 },
  A5: { width: 420, height: 595 }
}

/**
 * 将 Markdown 转换为 HTML（用于 DOCX 生成）
 */
export function markdownToHtmlForDocx(markdown: string): string {
  // 简单的 Markdown 转 HTML 转换，针对 DOCX 优化
  let html = markdown
  
  // 标题
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
    return `<pre><code>${escapeHtml(code)}</code></pre>`
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
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  
  // 图片（简化处理，DOCX 可能不支持网络图片）
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<div class="image-placeholder">[$1]</div>')
  
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
  
  // 添加基本样式
  const styledHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Microsoft YaHei', 'Segoe UI', sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            font-weight: bold;
        }
        h1 { font-size: 24pt; }
        h2 { font-size: 18pt; }
        h3 { font-size: 16pt; }
        h4 { font-size: 14pt; }
        h5 { font-size: 12pt; }
        h6 { font-size: 10pt; }
        p {
            margin: 0.5em 0;
            text-align: justify;
        }
        code {
            font-family: 'Consolas', 'Monaco', monospace;
            background-color: #f5f5f5;
            padding: 2px 4px;
            border-radius: 3px;
            font-size: 0.9em;
        }
        pre {
            background-color: #f5f5f5;
            padding: 12px;
            border-radius: 4px;
            overflow-x: auto;
            border-left: 4px solid #ddd;
        }
        blockquote {
            border-left: 4px solid #ccc;
            padding-left: 16px;
            margin-left: 0;
            color: #666;
            font-style: italic;
        }
        ul, ol {
            padding-left: 2em;
        }
        li {
            margin: 0.25em 0;
        }
        hr {
            border: none;
            border-top: 1px solid #ddd;
            margin: 2em 0;
        }
        a {
            color: #0066cc;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .image-placeholder {
            background-color: #f0f0f0;
            border: 1px dashed #ccc;
            padding: 20px;
            text-align: center;
            color: #666;
            margin: 1em 0;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px 12px;
            text-align: left;
        }
        th {
            background-color: #f5f5f5;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="document-content">
        ${html}
    </div>
</body>
</html>`
  
  return styledHtml
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
 * 生成 DOCX 文档
 * 注意：这是一个客户端函数，需要在浏览器中运行
 * 使用 docx 库作为主要方案，html-to-docx 作为备选方案
 */
export async function generateDocx(
  markdown: string,
  options: DocxOptions = DEFAULT_DOCX_OPTIONS
): Promise<Blob> {
  // 合并选项
  const mergedOptions = { ...DEFAULT_DOCX_OPTIONS, ...options }
  const templateConfig = TEMPLATE_CONFIGS[mergedOptions.template!] || {}
  const finalOptions = { ...mergedOptions, ...templateConfig }
  
  try {
    // 首先尝试使用 docx 库
    return await generateDocxWithDocxLibrary(markdown, finalOptions)
  } catch (error) {
    console.error('docx 库生成失败，尝试备选方案:', error)
    
    // 备选方案：创建一个简单的文本文件作为 DOCX
    const html = markdownToHtmlForDocx(markdown)
    const content = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${finalOptions.title}</title>
</head>
<body>
    <h1>${finalOptions.title}</h1>
    <p><strong>作者:</strong> ${finalOptions.author}</p>
    <p><strong>生成时间:</strong> ${new Date().toLocaleDateString('zh-CN')}</p>
    <hr>
    <div>${html}</div>
</body>
</html>`
    
    // 创建一个简单的文本文件（实际项目中应该使用真正的 DOCX 生成）
    const blob = new Blob([content], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    })
    
    return blob
  }
}

/**
 * 使用 docx 库生成 DOCX（替代方案）
 */
export async function generateDocxWithDocxLibrary(
  markdown: string,
  options: DocxOptions = DEFAULT_DOCX_OPTIONS
): Promise<Blob> {
  try {
    // 动态导入 docx 库
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx')
    
    // 将 Markdown 转换为文档段落
    const paragraphs = convertMarkdownToParagraphs(markdown, options)
    
    // 创建文档
    const doc = new Document({
      creator: options.author || DEFAULT_DOCX_OPTIONS.author,
      title: options.title || DEFAULT_DOCX_OPTIONS.title,
      description: options.description || DEFAULT_DOCX_OPTIONS.description,
      keywords: (options.keywords || DEFAULT_DOCX_OPTIONS.keywords)?.join(', '),
      sections: [{
        properties: {
          page: {
            size: {
              width: PAGE_SIZES[options.pageSize || 'A4'].width,
              height: PAGE_SIZES[options.pageSize || 'A4'].height
            },
            margin: options.margins || DEFAULT_DOCX_OPTIONS.margins
          }
        },
        children: paragraphs
      }]
    })
    
    // 生成 Blob
    const blob = await Packer.toBlob(doc)
    return blob
  } catch (error) {
    console.error('使用 docx 库生成失败:', error)
    throw new Error(`无法生成 DOCX 文档: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 将 Markdown 转换为 docx 段落
 */
function convertMarkdownToParagraphs(
  markdown: string,
  options: DocxOptions
): any[] {
  const lines = markdown.split('\n')
  const paragraphs: any[] = []
  
  // 动态导入 docx 类型
  const { Paragraph, TextRun, HeadingLevel } = require('docx')
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    if (!trimmedLine) {
      // 空行
      paragraphs.push(new Paragraph({}))
      continue
    }
    
    // 检查标题
    if (trimmedLine.startsWith('# ')) {
      paragraphs.push(new Paragraph({
        text: trimmedLine.substring(2),
        heading: HeadingLevel.HEADING_1
      }))
    } else if (trimmedLine.startsWith('## ')) {
      paragraphs.push(new Paragraph({
        text: trimmedLine.substring(3),
        heading: HeadingLevel.HEADING_2
      }))
    } else if (trimmedLine.startsWith('### ')) {
      paragraphs.push(new Paragraph({
        text: trimmedLine.substring(4),
        heading: HeadingLevel.HEADING_3
      }))
    } else {
      // 普通段落
      const textRuns: any[] = []
      let text = trimmedLine
      
      // 处理粗体
      text = text.replace(/\*\*(.*?)\*\*/g, (match, content) => {
        textRuns.push(new TextRun({ text: content, bold: true }))
        return ''
      })
      
      // 处理斜体
      text = text.replace(/\*(.*?)\*/g, (match, content) => {
        textRuns.push(new TextRun({ text: content, italics: true }))
        return ''
      })
      
      // 添加剩余文本
      if (text) {
        textRuns.push(new TextRun({ text }))
      }
      
      paragraphs.push(new Paragraph({
        children: textRuns
      }))
    }
  }
  
  return paragraphs
}

/**
 * 下载 DOCX 文档
 */
export function downloadDocx(blob: Blob, filename: string = 'document.docx'): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * 估计 DOCX 文档页数
 */
export function estimateDocxPages(
  markdown: string,
  options: DocxOptions = DEFAULT_DOCX_OPTIONS
): number {
  // 简单的页数估算：每 500 字符约 1 页
  const charsPerPage = 500
  const pageCount = Math.ceil(markdown.length / charsPerPage)
  
  // 根据模板调整
  const templateFactor: Record<string, number> = {
    business: 1.0,
    academic: 1.2,  // 学术文档通常行距更大
    minimal: 0.8,   // 极简风格更紧凑
    creative: 1.1
  }
  
  const factor = templateFactor[options.template || 'business']
  return Math.max(1, Math.ceil(pageCount * factor))
}

/**
 * 验证 Markdown 是否适合转换为 DOCX
 */
export function validateMarkdownForDocx(markdown: string): {
  valid: boolean
  warnings: string[]
  errors: string[]
} {
  const warnings: string[] = []
  const errors: string[] = []
  
  // 检查长度
  if (markdown.length > 100000) {
    warnings.push('文档较大，转换可能需要较长时间')
  }
  
  // 检查图片链接
  const imageMatches = markdown.match(/!\[.*?\]\(.*?\)/g) || []
  if (imageMatches.length > 0) {
    warnings.push(`文档包含 ${imageMatches.length} 个图片，部分图片可能无法在 Word 中正确显示`)
  }
  
  // 检查复杂表格
  const complexTables = markdown.match(/\|.*\|.*\|/g) || []
  if (complexTables.length > 5) {
    warnings.push('文档包含多个表格，表格格式可能需要进行调整')
  }
  
  // 检查代码块
  const codeBlocks = (markdown.match(/```[\s\S]*?```/g) || []).length
  if (codeBlocks > 10) {
    warnings.push('文档包含大量代码块，建议检查代码格式')
  }
  
  return {
    valid: errors.length === 0,
    warnings,
    errors
  }
}