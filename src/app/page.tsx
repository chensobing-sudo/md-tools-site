import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const tools = [
  {
    icon: '📝',
    title: 'Markdown 转 Word',
    desc: '将 Markdown 文档转换为专业的 Word 文档，支持多种模板',
    href: '/zh-cn/markdown-to-word',
    color: '#2563eb',
  },
  {
    icon: '📄',
    title: 'Markdown 转 PDF',
    desc: '快速生成精美的 PDF 文档，适合打印和分享',
    href: '/zh-cn/markdown-to-pdf',
    color: '#7c3aed',
  },
  {
    icon: '🌐',
    title: 'Markdown 转 HTML',
    desc: '生成干净的 HTML 代码，可直接使用或嵌入网页',
    href: '/zh-cn/markdown-to-html',
    color: '#059669',
  },
  {
    icon: '🔄',
    title: 'YAML 转 JSON',
    desc: '快速转换 YAML 和 JSON 格式，支持双向转换',
    href: '/zh-cn/yaml-to-json',
    color: '#dc2626',
  },
]

const features = [
  { icon: '🔒', title: '隐私安全', desc: '100% 浏览器本地处理，文件不会上传到服务器' },
  { icon: '⚡', title: '极速转换', desc: '毫秒级转换速度，无需等待' },
  { icon: '🆓', title: '完全免费', desc: '无使用次数限制，无隐藏费用' },
  { icon: '📱', title: '响应式设计', desc: '完美适配桌面、平板和手机' },
  { icon: '🌍', title: '多语言支持', desc: '支持中文、英文等多种语言界面' },
  { icon: '💾', title: '即下即用', desc: '无需注册登录，打开即用' },
]

export default function Home() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="tool-header">
        <div className="container">
          <h1>免费在线格式转换工具</h1>
          <p>快速、安全、免费！支持 Markdown、Word、PDF、HTML、YAML、JSON 等多种格式互转</p>
        </div>
      </section>

      {/* 工具列表 */}
      <section className="container" style={{ padding: '40px 20px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>
          所有转换工具
        </h2>
        <div className="features-grid">
          {tools.map((tool) => (
            <Link href={tool.href} key={tool.href} className="card" style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{tool.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{tool.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 特性介绍 */}
      <section className="container" style={{ padding: '40px 20px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>
          为什么选择我们？
        </h2>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="card feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SEO 内容 */}
      <section className="seo-content">
        <h2>免费在线格式转换</h2>
        <p>
          MD Tools 提供了一系列免费的在线格式转换工具。无论您是开发者、写作者还是学生，
          都可以轻松地将 Markdown 转换为 Word、PDF 或 HTML 格式。所有转换都在您的浏览器中本地完成，
          确保您的文档安全隐私。
        </p>
        
        <h3>Markdown 转 Word</h3>
        <p>
          将您的 Markdown 文档快速转换为专业的 Word 文档（.docx）。支持多种模板选择，
          包括商务、学术、极简等风格，满足不同场景的需求。
        </p>

        <h3>Markdown 转 PDF</h3>
        <p>
          生成精美的 PDF 文档，适合打印、分享和存档。支持自定义样式和排版，
          确保输出质量。
        </p>

        <h3>Markdown 转 HTML</h3>
        <p>
          将 Markdown 转换为干净的 HTML 代码，可直接用于网站、博客或文档系统。
          支持代码高亮、表格、列表等完整 Markdown 语法。
        </p>
      </section>

      {/* FAQ */}
      <section className="container" style={{ padding: '40px 20px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>
          常见问题
        </h2>
        <div className="faq-list">
          <div className="faq-item">
            <div className="faq-question">
              这些工具真的免费吗？
            </div>
            <div className="faq-answer">
              是的，所有工具都完全免费，没有使用次数限制，也不需要注册账号。
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-question">
              我的文件安全吗？
            </div>
            <div className="faq-answer">
              非常安全！所有转换都在您的浏览器中本地完成，文件不会上传到任何服务器。
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-question">
              支持哪些 Markdown 语法？
            </div>
            <div className="faq-answer">
              支持完整的 GFM（GitHub Flavored Markdown）语法，包括标题、表格、代码块、列表、引用等。
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
