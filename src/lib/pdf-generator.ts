/**
 * PDF 文档生成工具
 * 提供 Markdown 到 PDF 文档的转换功能
 */

/**
 * PDF 生成选项
 */
export interface PdfOptions {
  title?: string
  author?: string
  subject?: string
  keywords?: string[]
  pageSize?: 'A4' | 'Letter' | 'Legal' | 'A5'
  orientation?: 'portrait' | 'landscape'
  margins?: {
    top: number // 毫米
    right: number
    bottom: number
    left: number
  }
  includeHeader?: boolean
  includeFooter?: boolean
  fontSize?: number
  lineHeight?: number
  theme?: 'light' | 'dark' | 'sepia'
}

/**
 * 默认 PDF 选项
 */
export const DEFAULT_PDF_OPTIONS: PdfOptions = {
  title: 'Markdown 转换文档',
  author: 'MD Tools',
  subject: 'Markdown 转 PDF 文档',
  keywords: ['Markdown', 'PDF', '转换', '文档'],
  pageSize: 'A4',
  orientation: 'portrait',
  margins: {
    top: 20, // 毫米
    right: 20,
    bottom: 20,
    left: 20
  },
  includeHeader: true,
  includeFooter: true,
  fontSize: 12,
  lineHeight: 1.5,
  theme: 'light'
}

/**
 * 页面尺寸配置（单位：毫米）
 */
export const PAGE_SIZES_MM: Record<string, { width: number; height: number }> = {
  A4: { width: 210, height: 297 },
  Letter: { width: 216, height: 279 },
  Legal: { width: 216, height: 356 },
  A5: { width: 148, height: 210 }
}

/**
 * 将 Markdown 转换为 HTML（用于 PDF 生成）
 */
export function markdownToHtmlForPdf(markdown: string, options: PdfOptions = DEFAULT_PDF_OPTIONS): string {
  // 简单的 Markdown 转 HTML 转换，针对 PDF 优化
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
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  
  // 图片（PDF 中可能不支持网络图片，使用占位符）
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
  
  // 获取主题样式
  const themeStyles = getThemeStyles(options.theme || 'light')
  
  // 添加完整 HTML 结构
  const fullHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${options.title || 'Markdown 转换文档'}</title>
    <style>
        ${themeStyles}
        
        /* PDF 特定样式 */
        @media print {
            body {
                margin: ${options.margins?.top || 20}mm ${options.margins?.right || 20}mm ${options.margins?.bottom || 20}mm ${options.margins?.left || 20}mm;
                font-size: ${options.fontSize || 12}pt;
                line-height: ${options.lineHeight || 1.5};
            }
            
            h1 { font-size: 24pt; }
            h2 { font-size: 18pt; }
            h3 { font-size: 16pt; }
            h4 { font-size: 14pt; }
            h5 { font-size: 12pt; }
            h6 { font-size: 10pt; }
            
            .page-break {
                page-break-before: always;
            }
            
            .no-break {
                page-break-inside: avoid;
            }
            
            /* 页眉页脚 */
            @page {
                @top-left {
                    content: "${options.title || '文档'}";
                    font-size: 10pt;
                    color: #666;
                }
                @bottom-center {
                    content: "第 " counter(page) " 页 / " counter(pages);
                    font-size: 10pt;
                    color: #666;
                }
            }
        }
        
        /* 屏幕显示样式 */
        @media screen {
            body {
                max-width: ${PAGE_SIZES_MM[options.pageSize || 'A4'].width}mm;
                margin: 0 auto;
                padding: 20px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
                background: white;
            }
        }
    </style>
</head>
<body>
    ${options.includeHeader ? `
    <header class="document-header">
        <h1>${options.title || 'Markdown 转换文档'}</h1>
        <div class="document-meta">
            <span>作者: ${options.author || 'MD Tools'}</span>
            <span>生成时间: ${new Date().toLocaleDateString('zh-CN')}</span>
        </div>
    </header>
    ` : ''}
    
    <div class="document-content">
        ${html}
    </div>
    
    ${options.includeFooter ? `
    <footer class="document-footer">
        <hr>
        <div class="footer-content">
            <p>本文档由 MD Tools 生成 - ${new Date().toLocaleDateString('zh-CN')}</p>
            <p>${options.subject || 'Markdown 转 PDF 文档'}</p>
        </div>
    </footer>
    ` : ''}
</body>
</html>`
  
  return fullHtml
}

/**
 * 获取主题样式
 */
function getThemeStyles(theme: string): string {
  const themes: Record<string, string> = {
    light: `
      body {
        color: #333;
        background: #fff;
      }
      code {
        background: #f5f5f5;
        color: #d14;
      }
      pre {
        background: #f5f5f5;
        border-left: 4px solid #ddd;
      }
      blockquote {
        border-left: 4px solid #ccc;
        color: #666;
      }
      table {
        border-color: #ddd;
      }
      th {
        background: #f5f5f5;
      }
    `,
    dark: `
      body {
        color: #f0f0f0;
        background: #1a1a1a;
      }
      code {
        background: #2d2d2d;
        color: #f8f8f2;
      }
      pre {
        background: #2d2d2d;
        border-left: 4px solid #444;
      }
      blockquote {
        border-left: 4px solid #555;
        color: #aaa;
      }
      table {
        border-color: #444;
      }
      th {
        background: #2d2d2d;
      }
      a {
        color: #66b3ff;
      }
    `,
    sepia: `
      body {
        color: #5c4b37;
        background: #f4ecd8;
      }
      code {
        background: #e8dfc8;
        color: #8b4513;
      }
      pre {
        background: #e8dfc8;
        border-left: 4px solid #d4c9a8;
      }
      blockquote {
        border-left: 4px solid #d4c9a8;
        color: #8b7355;
      }
      table {
        border-color: #d4c9a8;
      }
      th {
        background: #e8dfc8;
      }
      a {
        color: #8b4513;
      }
    `
  }
  
  const baseStyles = `
    body {
      font-family: 'Microsoft YaHei', 'Segoe UI', 'SimSun', sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: bold;
      page-break-after: avoid;
    }
    p {
      margin: 0.5em 0;
      text-align: justify;
      orphans: 3;
      widows: 3;
    }
    code {
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      padding: 2px 4px;
      border-radius: 3px;
      font-size: 0.9em;
    }
    pre {
      padding: 12px;
      border-radius: 4px;
      overflow-x: auto;
      page-break-inside: avoid;
    }
    pre code {
      padding: 0;
      background: transparent;
    }
    blockquote {
      padding-left: 16px;
      margin-left: 0;
      font-style: italic;
      page-break-inside: avoid;
    }
    ul, ol {
      padding-left: 2em;
      page-break-inside: avoid;
    }
    li {
      margin: 0.25em 0;
      page-break-inside: avoid;
    }
    hr {
      border: none;
      border-top: 1px solid;
      margin: 2em 0;
    }
    a {
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .image-placeholder {
      padding: 20px;
      text-align: center;
      border: 1px dashed;
      margin: 1em 0;
      page-break-inside: avoid;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid;
      padding: 8px 12px;
      text-align: left;
    }
    th {
      font-weight: bold;
    }
    .document-header {
      margin-bottom: 2em;
      text-align: center;
    }
    .document-meta {
      display: flex;
      justify-content: center;
      gap: 20px;
      font-size: 0.9em;
      color: #666;
      margin-top: 10px;
    }
    .document-footer {
      margin-top: 3em;
      font-size: 0.9em;
      color: #666;
      text-align: center;
    }
    .footer-content {
      margin-top: 1em;
    }
  `
  
  return baseStyles + (themes[theme] || themes.light)
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
 * 使用浏览器打印功能生成 PDF
 */
export async function generatePdfWithPrint(
  markdown: string,
  options: PdfOptions = DEFAULT_PDF_OPTIONS
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // 创建打印窗口
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        throw new Error('无法打开打印窗口，请检查浏览器弹窗设置')
      }
      
      // 生成 HTML 内容
      const html = markdownToHtmlForPdf(markdown, options)
      
      // 写入内容
      printWindow.document.write(html)
      printWindow.document.close()
      
      // 等待内容加载
      printWindow.onload = () => {
        try {
          // 触发打印
          printWindow.print()
          
          // 关闭窗口（延迟以确保打印对话框已打开）
          setTimeout(() => {
            printWindow.close()
            resolve()
          }, 100)
        } catch (error) {
          printWindow.close()
          reject(new Error(`打印失败: ${error instanceof Error ? error.message : '未知错误'}`))
        }
      }
      
      // 设置超时
      setTimeout(() => {
        if (printWindow.closed) {
          resolve()
        }
      }, 5000)
      
    } catch (error) {
      reject(new Error(`PDF 生成失败: ${error instanceof Error ? error.message : '未知错误'}`))
    }
  })
}

/**
 * 使用 jsPDF 生成 PDF（需要安装 jsPDF 库）
 * 注意: 此功能需要额外安装 jspdf 包
 * 这是一个可选功能，如果未安装 jspdf 包，此函数将抛出错误
 */
export async function generatePdfWithJsPdf(
  markdown: string,
  options: PdfOptions = DEFAULT_PDF_OPTIONS
): Promise<Blob> {
  // 检查是否在浏览器环境中
  if (typeof window === 'undefined') {
    throw new Error('jsPDF 只能在浏览器环境中使用')
  }
  
  // 延迟导入以避免构建时错误
  const jsPDFModule = await import('jspdf').catch(error => {
    console.error('无法加载 jsPDF 模块:', error)
    throw new Error('jsPDF 模块未安装。请运行: npm install jspdf')
  })
  
  if (!jsPDFModule || !jsPDFModule.jsPDF) {
    throw new Error('jsPDF 模块加载失败')
  }
  
  const { jsPDF } = jsPDFModule
  
  try {
    // 创建 PDF 文档
    const pageSize = PAGE_SIZES_MM[options.pageSize || 'A4']
    const doc = new jsPDF({
      orientation: options.orientation || 'portrait',
      unit: 'mm',
      format: [pageSize.width, pageSize.height]
    })
    
    // 设置文档属性
    doc.setProperties({
      title: options.title || 'Markdown 转换文档',
      author: options.author || 'MD Tools',
      subject: options.subject || 'Markdown 转 PDF 文档',
      keywords: options.keywords?.join(', ') || 'Markdown, PDF, 转换'
    })
    
    // 设置边距
    const margins = options.margins || DEFAULT_PDF_OPTIONS.margins!
    let yPos = margins.top
    
    // 设置字体
    doc.setFont('helvetica')
    doc.setFontSize(options.fontSize || 12)
    
    // 添加标题
    if (options.includeHeader) {
      doc.setFontSize(16)
      doc.text(options.title || 'Markdown 转换文档', margins.left, yPos)
      yPos += 10
      
      doc.setFontSize(10)
      doc.text(`作者: ${options.author || 'MD Tools'}`, margins.left, yPos)
      doc.text(`生成时间: ${new Date().toLocaleDateString('zh-CN')}`, pageSize.width - margins.right, yPos, { align: 'right' })
      yPos += 15
      
      doc.setFontSize(options.fontSize || 12)
    }
    
    // 分割文本为行
    const lines = markdown.split('\n')
    const pageHeight = pageSize.height
    const lineHeight = (options.fontSize || 12) * (options.lineHeight || 1.5) / 3.5 // 转换为 mm
    
    for (const line of lines) {
      // 检查是否需要换页
      if (yPos > pageHeight - margins.bottom) {
        doc.addPage()
        yPos = margins.top
      }
      
      const trimmedLine = line.trim()
      
      if (!trimmedLine) {
        // 空行
        yPos += lineHeight
        continue
      }
      
      // 处理标题
      if (trimmedLine.startsWith('# ')) {
        doc.setFontSize(16)
        doc.text(trimmedLine.substring(2), margins.left, yPos)
        doc.setFontSize(options.fontSize || 12)
        yPos += lineHeight * 1.5
      } else if (trimmedLine.startsWith('## ')) {
        doc.setFontSize(14)
        doc.text(trimmedLine.substring(3), margins.left, yPos)
        doc.setFontSize(options.fontSize || 12)
        yPos += lineHeight * 1.3
      } else if (trimmedLine.startsWith('### ')) {
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text(trimmedLine.substring(4), margins.left, yPos)
        doc.setFont('helvetica', 'normal')
        yPos += lineHeight * 1.2
      } else {
        // 普通文本
        // 处理文本换行
        const maxWidth = pageSize.width - margins.left - margins.right
        const splitLines = doc.splitTextToSize(trimmedLine, maxWidth)
        
        for (const splitLine of splitLines) {
          if (yPos > pageHeight - margins.bottom) {
            doc.addPage()
            yPos = margins.top
          }
          
          doc.text(splitLine, margins.left, yPos)
          yPos += lineHeight
        }
      }
    }
    
    // 添加页脚
    if (options.includeFooter) {
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.text(
          `第 ${i} 页 / 共 ${pageCount} 页`,
          pageSize.width / 2,
          pageSize.height - margins.bottom + 5,
          { align: 'center' }
        )
        doc.text(
          '由 MD Tools 生成',
          margins.left,
          pageSize.height - margins.bottom + 5
        )
        doc.text(
          new Date().toLocaleDateString('zh-CN'),
          pageSize.width - margins.right,
          pageSize.height - margins.bottom + 5,
          { align: 'right' }
        )
      }
    }
    
    // 生成 Blob
    const pdfBlob = doc.output('blob')
    return pdfBlob
    
  } catch (error) {
    console.error('jsPDF 生成失败:', error)
    throw new Error(`无法生成 PDF 文档: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 下载 PDF 文档
 */
export function downloadPdf(blob: Blob, filename: string = 'document.pdf'): void {
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
 * 估计 PDF 文档页数
 */
export function estimatePdfPages(
  markdown: string,
  options: PdfOptions = DEFAULT_PDF_OPTIONS
): number {
  // 简单的页数估算
  const pageSize = PAGE_SIZES_MM[options.pageSize || 'A4']
  const margins = options.margins || DEFAULT_PDF_OPTIONS.margins!
  
  // 计算可用高度
  const usableHeight = pageSize.height - margins.top - margins.bottom
  
  // 每行高度（毫米）
  const lineHeight = (options.fontSize || 12) * (options.lineHeight || 1.5) / 3.5
  
  // 每页行数
  const linesPerPage = Math.floor(usableHeight / lineHeight)
  
  // 总行数
  const totalLines = markdown.split('\n').length
  
  // 计算页数
  const pageCount = Math.ceil(totalLines / linesPerPage)
  
  return Math.max(1, pageCount)
}

/**
 * 验证 Markdown 是否适合转换为 PDF
 */
export function validateMarkdownForPdf(markdown: string): {
  valid: boolean
  warnings: string[]
  errors: string[]
} {
  const warnings: string[] = []
  const errors: string[] = []
  
  // 检查长度
  if (markdown.length > 50000) {
    warnings.push('文档较大，建议分章节转换')
  }
  
  if (markdown.length > 200000) {
    errors.push('文档过长，请缩短内容或分多次转换')
  }
  
  // 检查图片链接
  const imageMatches = markdown.match(/!\[.*?\]\(.*?\)/g) || []
  if (imageMatches.length > 0) {
    warnings.push(`文档包含 ${imageMatches.length} 个图片，PDF 中可能无法显示网络图片`)
  }
  
  // 检查复杂表格
  const complexTables = markdown.match(/\|.*\|.*\|/g) || []
  if (complexTables.length > 10) {
    warnings.push('文档包含多个复杂表格，建议简化表格结构')
  }
  
  // 检查代码块长度
  const codeBlocks = markdown.match(/```[\s\S]*?```/g) || []
  for (const block of codeBlocks) {
    if (block.length > 1000) {
      warnings.push('包含过长的代码块，可能影响 PDF 布局')
      break
    }
  }
  
  return {
    valid: errors.length === 0,
    warnings,
    errors
  }
}

/**
 * 获取支持的 PDF 生成方法
 */
export function getSupportedPdfMethods(): Array<{
  id: string
  name: string
  description: string
  requiresLibrary?: boolean
}> {
  return [
    {
      id: 'print',
      name: '浏览器打印',
      description: '使用浏览器内置打印功能生成 PDF，兼容性好'
    },
    {
      id: 'jspdf',
      name: 'jsPDF 库',
      description: '使用 jsPDF 库生成，功能更强大',
      requiresLibrary: true
    }
  ]
}