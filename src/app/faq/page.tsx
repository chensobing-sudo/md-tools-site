import Link from 'next/link'

export default function FaqPage() {
  const faqs = [
    {
      q: 'MD Tools 是免费的吗？',
      a: '是的，MD Tools 完全免费使用。所有格式转换功能都不需要付费，也没有使用次数限制。',
    },
    {
      q: '我的文档会上传到服务器吗？',
      a: '不会。所有转换过程都在您的浏览器本地完成，文档内容不会上传到任何服务器。您可以放心处理敏感文档。',
    },
    {
      q: '支持哪些 Markdown 语法？',
      a: '我们支持标准的 Markdown 语法，包括：标题（H1-H6）、粗体、斜体、删除线、列表（有序/无序）、代码块（支持语法高亮）、表格、引用、链接、图片、任务列表等。',
    },
    {
      q: '转换后的文档质量如何？',
      a: '转换质量非常高。我们使用专业的文档生成引擎，确保生成的 Word、PDF、HTML 等格式文档保持原有的排版和样式。',
    },
    {
      q: '支持哪些文件格式上传？',
      a: '目前支持上传 .md、.markdown、.txt 格式的文本文件。对于其他格式，您可以复制粘贴内容到编辑区。',
    },
    {
      q: '最大支持多大的文件？',
      a: '由于所有处理都在浏览器本地完成，理论上没有文件大小限制。但建议单次转换不超过 10MB，以获得最佳体验。',
    },
    {
      q: '转换速度如何？',
      a: '转换速度非常快，通常在毫秒级完成。实际速度取决于文档大小和复杂度。',
    },
    {
      q: '支持移动设备吗？',
      a: '是的，MD Tools 采用响应式设计，在手机、平板和桌面设备上都能正常使用。',
    },
    {
      q: '如何保存转换结果？',
      a: '转换完成后，您可以直接下载文件到本地，或复制内容到剪贴板。部分工具还支持实时预览。',
    },
    {
      q: '遇到问题如何反馈？',
      a: '您可以通过联系我们页面发送邮件到 plmm365@gmail.com，我们会尽快回复您的问题。',
    },
  ]

  return (
    <>
      <section className="tool-header">
        <div className="container">
          <h1>常见问题</h1>
          <p>关于 MD Tools 的常见问题解答</p>
          <div className="mt-4 flex gap-3 justify-center">
            <Link href="/" className="btn btn-secondary">← 返回首页</Link>
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="card p-0 group">
              <summary className="p-5 cursor-pointer list-none flex items-center justify-between hover:bg-accent/50 transition-colors rounded-lg">
                <span className="font-medium text-base">{faq.q}</span>
                <svg
                  className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180 flex-shrink-0 ml-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border pt-4">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      <section className="seo-content">
        <div className="container">
          <h2>没有找到答案？</h2>
          <p>
            如果您的问题没有在上面列出，请通过
            <a href="mailto:plmm365@gmail.com" className="text-primary hover:underline"> plmm365@gmail.com </a>
            联系我们，我们会尽快为您解答。
          </p>
        </div>
      </section>
    </>
  )
}
