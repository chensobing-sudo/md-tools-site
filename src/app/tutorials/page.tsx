import Link from 'next/link'

export default function TutorialsPage() {
  const tutorials = [
    {
      title: 'Markdown 转 Word 教程',
      description: '学习如何将 Markdown 文档转换为专业的 Word 文档，支持多种模板和样式设置。',
      steps: [
        '在左侧编辑区输入或粘贴 Markdown 内容',
        '从下拉菜单中选择合适的文档模板（商务/学术/极简/创意）',
        '设置页面方向和页边距等文档参数',
        '点击"生成 Word 文档"按钮',
        '下载生成的 .docx 文件到本地',
      ],
      link: '/zh-cn/markdown-to-word',
    },
    {
      title: 'Markdown 转 PDF 教程',
      description: '学习如何将 Markdown 文档转换为精美的 PDF 文件，适合打印和存档。',
      steps: [
        '在编辑区输入或粘贴 Markdown 内容',
        '选择页面尺寸（A4/Letter/Legal/A5）和方向',
        '设置字体大小、行间距等样式选项',
        '选择是否包含页眉和页脚',
        '点击"生成 PDF 文档"，使用浏览器打印功能保存',
      ],
      link: '/zh-cn/markdown-to-pdf',
    },
    {
      title: 'Markdown 转 HTML 教程',
      description: '学习如何将 Markdown 转换为干净的 HTML 代码，用于网站和博客。',
      steps: [
        '在编辑区输入 Markdown 内容',
        '选择代码高亮主题',
        '实时预览生成的 HTML 代码',
        '复制代码或下载完整的 HTML 文件',
      ],
      link: '/zh-cn/markdown-to-html',
    },
    {
      title: 'YAML 与 JSON 互转教程',
      description: '学习如何在 YAML 和 JSON 格式之间快速转换。',
      steps: [
        '在输入区粘贴 YAML 或 JSON 内容',
        '点击切换按钮选择转换方向',
        '选择美化或紧凑格式',
        '复制或下载转换结果',
      ],
      link: '/zh-cn/yaml-to-json',
    },
    {
      title: 'JSON 转 CSV 教程',
      description: '学习如何将 JSON 数据转换为 CSV 表格格式。',
      steps: [
        '在输入区粘贴 JSON 数组数据',
        '选择分隔符（逗号/制表符/分号）',
        '选择是否包含表头行',
        '点击转换按钮',
        '复制或下载 CSV 文件',
      ],
      link: '/zh-cn/json-to-csv',
    },
    {
      title: 'HTML 转 Markdown 教程',
      description: '学习如何将 HTML 代码转换回 Markdown 格式。',
      steps: [
        '在输入区粘贴 HTML 代码',
        '点击转换按钮',
        '查看生成的 Markdown 内容',
        '复制或下载转换结果',
      ],
      link: '/zh-cn/html-to-markdown',
    },
  ]

  return (
    <>
      <section className="tool-header">
        <div className="container">
          <h1>使用教程</h1>
          <p>详细的图文教程，帮助您快速上手 MD Tools 的各项功能</p>
          <div className="mt-4 flex gap-3 justify-center">
            <Link href="/" className="btn btn-secondary">← 返回首页</Link>
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className="space-y-8">
          {tutorials.map((tutorial) => (
            <div key={tutorial.title} className="card p-6">
              <h2 className="text-xl font-semibold mb-2">{tutorial.title}</h2>
              <p className="text-muted-foreground mb-4">{tutorial.description}</p>
              <ol className="space-y-2 mb-4">
                {tutorial.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <Link href={tutorial.link} className="text-sm text-primary font-medium hover:underline">
                前往使用该工具 →
              </Link>
            </div>
          ))}
        </div>
      </div>

      <section className="seo-content">
        <div className="container">
          <h2>更多帮助</h2>
          <p>
            如果您在使用过程中遇到任何问题，请查看我们的
            <Link href="/faq" className="text-primary hover:underline"> 常见问题 </Link>
            页面，或通过
            <a href="mailto:plmm365@gmail.com" className="text-primary hover:underline"> 联系我们 </a>
            获取支持。
          </p>
        </div>
      </section>
    </>
  )
}
