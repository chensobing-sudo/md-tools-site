/**
 * HTML 转 Markdown 工具库
 */

/**
 * 将 HTML 字符串转换为 Markdown
 */
export function htmlToMarkdown(html: string): string {
  let md = html

  // 移除 DOCTYPE 和 HTML 标签
  md = md.replace(/<!DOCTYPE[^>]*>/gi, '')
  md = md.replace(/<\/?(?:html|head|body|meta|link|title)[^>]*>/gi, '')

  // 处理标题
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
  md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
  md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')

  // 处理粗体和斜体
  md = md.replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
  md = md.replace(/<b>(.*?)<\/b>/gi, '**$1**')
  md = md.replace(/<em>(.*?)<\/em>/gi, '*$1*')
  md = md.replace(/<i>(.*?)<\/i>/gi, '*$1*')

  // 处理删除线
  md = md.replace(/<del>(.*?)<\/del>/gi, '~~$1~~')
  md = md.replace(/<s>(.*?)<\/s>/gi, '~~$1~~')

  // 处理行内代码
  md = md.replace(/<code>(.*?)<\/code>/gi, '`$1`')

  // 处理代码块
  md = md.replace(/<pre><code(?:\s+class="language-(\w+)")?>(.*?)<\/code><\/pre>/gis, (match, lang, code) => {
    const langStr = lang || ''
    return `\`\`\`${langStr}\n${decodeHtmlEntities(code)}\n\`\`\`\n\n`
  })
  md = md.replace(/<pre>(.*?)<\/pre>/gis, (match, code) => {
    return `\`\`\`\n${decodeHtmlEntities(code)}\n\`\`\`\n\n`
  })

  // 处理链接
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')

  // 处理图片
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)')
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![image]($1)')

  // 处理无序列表
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, (match, content) => {
    // 检查是否在有序列表中
    const parent = match
    if (parent.includes('<ol')) {
      return `1. ${content}\n`
    }
    return `- ${content}\n`
  })

  // 移除列表包裹标签
  md = md.replace(/<\/?ul[^>]*>/gi, '\n')
  md = md.replace(/<\/?ol[^>]*>/gi, '\n')

  // 处理引用块
  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (match, content) => {
    const lines = content.trim().split('\n')
    return lines.map((line: string) => `> ${line.trim()}`).join('\n') + '\n\n'
  })

  // 处理水平线
  md = md.replace(/<hr[^>]*\/?>/gi, '\n---\n\n')

  // 处理段落
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')

  // 处理表格
  md = md.replace(/<table[^>]*>(.*?)<\/table>/gis, (match, content) => {
    const rows = content.match(/<tr[^>]*>(.*?)<\/tr>/gi)
    if (!rows) return match

    const mdRows = rows.map((row: string) => {
      const cells = row.match(/<t[dh][^>]*>(.*?)<\/t[dh]>/gi)
      if (!cells) return ''
      return '| ' + cells.map((c: string) => c.replace(/<\/?t[dh][^>]*>/gi, '').trim()).join(' | ') + ' |'
    })

    // 添加分隔行
    const headerSeparator = '| ' + cellsFromRow(rows[0]).map(() => '---').join(' | ') + ' |'
    mdRows.splice(1, 0, headerSeparator)

    return '\n' + mdRows.join('\n') + '\n\n'
  })

  // 清理多余的空白
  md = md.replace(/\n{3,}/g, '\n\n')
  md = md.replace(/&nbsp;/gi, ' ')
  md = md.replace(/&amp;/gi, '&')
  md = md.replace(/&lt;/gi, '<')
  md = md.replace(/&gt;/gi, '>')
  md = md.replace(/&quot;/gi, '"')
  md = md.replace(/&#39;/gi, "'")

  // 移除剩余的 HTML 标签
  md = md.replace(/<[^>]*>/g, '')

  return md.trim()
}

function cellsFromRow(row: string): string[] {
  const cells = row.match(/<t[dh][^>]*>(.*?)<\/t[dh]>/gi)
  return cells ? cells.map(() => '') : []
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
}

/**
 * 验证 HTML 是否可转换
 */
export function validateHtml(html: string): {
  valid: boolean
  error?: string
  contentLength?: number
} {
  if (!html.trim()) {
    return { valid: false, error: 'HTML 内容为空' }
  }

  // 检查是否包含基本的 HTML 结构
  const hasTags = /<[a-z][\s\S]*>/i.test(html)
  if (!hasTags) {
    return { valid: false, error: '未检测到 HTML 标签' }
  }

  return {
    valid: true,
    contentLength: html.length,
  }
}
