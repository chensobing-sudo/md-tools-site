'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const tools = [
  {
    icon: '📝',
    title: 'Markdown 转 Word',
    desc: '将 Markdown 文档转换为专业的 Word 文档，支持多种模板',
    href: '/zh-cn/markdown-to-word',
    color: 'from-blue-500 to-blue-600',
    badge: '热门',
  },
  {
    icon: '📄',
    title: 'Markdown 转 PDF',
    desc: '快速生成精美的 PDF 文档，适合打印和分享',
    href: '/zh-cn/markdown-to-pdf',
    color: 'from-purple-500 to-purple-600',
    badge: '热门',
  },
  {
    icon: '🌐',
    title: 'Markdown 转 HTML',
    desc: '生成干净的 HTML 代码，可直接使用或嵌入网页',
    href: '/zh-cn/markdown-to-html',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: '🔄',
    title: 'YAML 转 JSON',
    desc: '快速转换 YAML 和 JSON 格式，支持双向转换',
    href: '/zh-cn/yaml-to-json',
    color: 'from-red-500 to-red-600',
  },
  {
    icon: '📊',
    title: 'JSON 转 CSV',
    desc: '将 JSON 数据转换为 CSV 表格格式，支持嵌套对象',
    href: '/zh-cn/json-to-csv',
    color: 'from-orange-500 to-orange-600',
    badge: '新工具',
  },
  {
    icon: '🔙',
    title: 'HTML 转 Markdown',
    desc: '将 HTML 代码快速还原为 Markdown 格式',
    href: '/zh-cn/html-to-markdown',
    color: 'from-teal-500 to-teal-600',
    badge: '新工具',
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

const faqs = [
  {
    q: '这些工具真的免费吗？',
    a: '是的，所有工具都完全免费，没有使用次数限制，也不需要注册账号。',
  },
  {
    q: '我的文件安全吗？',
    a: '非常安全！所有转换都在您的浏览器中本地完成，文件不会上传到任何服务器。',
  },
  {
    q: '支持哪些 Markdown 语法？',
    a: '支持完整的 GFM（GitHub Flavored Markdown）语法，包括标题、表格、代码块、列表、引用等。',
  },
  {
    q: '转换后的文件质量如何？',
    a: '我们使用专业的转换引擎，确保输出文件格式规范、排版精美，满足正式使用需求。',
  },
]

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        <div className="container py-16 md:py-24 text-center relative">
          <Badge variant="secondary" className="mb-4">完全免费 · 本地处理 · 无需注册</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            免费在线格式转换工具
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            快速、安全、免费！支持 Markdown、Word、PDF、HTML、YAML、JSON、CSV 等多种格式互转
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {tools.slice(0, 3).map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm"
              >
                {tool.icon} {tool.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 工具列表 */}
      <section className="container py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">所有转换工具</h2>
          <p className="text-muted-foreground">选择您需要的工具，快速完成格式转换</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link href={tool.href} key={tool.href}>
              <Card className="group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl shadow-sm`}>
                      {tool.icon}
                    </div>
                    {tool.badge && (
                      <Badge variant={tool.badge === '新工具' ? 'success' : 'default'}>
                        {tool.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tool.desc}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 特性介绍 */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">为什么选择我们？</h2>
            <p className="text-muted-foreground">六大核心优势，让格式转换更简单</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="text-center">
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">{f.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SEO 内容 */}
      <section className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">免费在线格式转换</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            MD Tools 提供了一系列免费的在线格式转换工具。无论您是开发者、写作者还是学生，
            都可以轻松地将 Markdown 转换为 Word、PDF 或 HTML 格式。所有转换都在您的浏览器中本地完成，
            确保您的文档安全隐私。
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="font-semibold mb-2">Markdown 转 Word</h3>
              <p className="text-sm text-muted-foreground">
                将您的 Markdown 文档快速转换为专业的 Word 文档（.docx）。支持多种模板选择，
                包括商务、学术、极简等风格。
              </p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="font-semibold mb-2">Markdown 转 PDF</h3>
              <p className="text-sm text-muted-foreground">
                生成精美的 PDF 文档，适合打印、分享和存档。支持自定义样式和排版，
                确保输出质量。
              </p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="font-semibold mb-2">Markdown 转 HTML</h3>
              <p className="text-sm text-muted-foreground">
                将 Markdown 转换为干净的 HTML 代码，可直接用于网站、博客或文档系统。
                支持代码高亮、表格、列表等完整 Markdown 语法。
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-4">新增工具</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            我们持续扩展工具集，最新增加了 JSON 转 CSV 和 HTML 转 Markdown 工具。
            JSON 转 CSV 帮助您将结构化数据转换为表格格式，方便在 Excel 中分析。
            HTML 转 Markdown 则让您从网页内容中快速提取 Markdown 格式的文本。
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">常见问题</h2>
            <p className="text-muted-foreground">关于 MD Tools 的常见疑问</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-5 py-4 font-semibold bg-muted/30 border-b border-border">
                  {faq.q}
                </div>
                <div className="px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
