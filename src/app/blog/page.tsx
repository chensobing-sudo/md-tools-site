import Link from 'next/link'

export default function BlogPage() {
  const posts = [
    {
      title: 'Markdown 转 Word 完全指南：从入门到精通',
      date: '2026-04-28',
      category: '使用教程',
      excerpt: '详细介绍如何使用 MD Tools 将 Markdown 文档转换为专业 Word 文档，包括模板选择、样式设置和高级技巧。',
    },
    {
      title: '为什么 PDF 是技术文档的最佳格式？',
      date: '2026-04-25',
      category: '格式科普',
      excerpt: 'PDF 格式在技术文档领域的优势分析，以及如何通过 Markdown 快速生成高质量的 PDF 文档。',
    },
    {
      title: 'YAML vs JSON：配置文件格式选择指南',
      date: '2026-04-20',
      category: '技术对比',
      excerpt: '深入对比 YAML 和 JSON 两种配置格式的优缺点，帮助你在项目中做出正确的选择。',
    },
    {
      title: '在线格式转换工具的安全性分析',
      date: '2026-04-15',
      category: '安全科普',
      excerpt: '使用在线工具进行文档格式转换时需要注意的安全问题，以及 MD Tools 如何保护您的数据隐私。',
    },
    {
      title: 'HTML 转 Markdown：内容迁移的最佳实践',
      date: '2026-04-10',
      category: '使用教程',
      excerpt: '将现有 HTML 内容转换为 Markdown 格式的最佳方法和工具推荐，适用于网站迁移和内容重构。',
    },
    {
      title: 'Markdown 高级语法技巧汇总',
      date: '2026-04-05',
      category: '技巧分享',
      excerpt: '掌握 Markdown 的高级语法技巧，包括表格、脚注、任务列表、数学公式等，提升文档编写效率。',
    },
  ]

  return (
    <>
      <section className="tool-header">
        <div className="container">
          <h1>博客</h1>
          <p>MD Tools 官方博客 — 分享格式转换技巧、技术科普和产品更新</p>
          <div className="mt-4 flex gap-3 justify-center">
            <Link href="/" className="btn btn-secondary">← 返回首页</Link>
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.title} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {post.category}
                </span>
                <span className="text-xs text-muted-foreground">{post.date}</span>
              </div>
              <h2 className="text-lg font-semibold mb-2 line-clamp-2">{post.title}</h2>
              <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
              <div className="mt-4">
                <span className="text-sm text-primary font-medium hover:underline cursor-pointer">
                  阅读更多 →
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <section className="seo-content">
        <div className="container">
          <h2>关于 MD Tools 博客</h2>
          <p>
            MD Tools 博客致力于为用户提供高质量的格式转换相关内容。我们定期发布使用教程、
            技术科普、最佳实践和产品更新，帮助您更好地利用在线格式转换工具提高工作效率。
          </p>
          <p>
            无论您是 Markdown 新手还是资深用户，都能在这里找到有价值的内容。
            如果您有任何建议或想了解的话题，欢迎通过联系我们页面与我们分享。
          </p>
        </div>
      </section>
    </>
  )
}
