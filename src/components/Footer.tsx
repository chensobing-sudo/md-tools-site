import Link from 'next/link'

const toolLinks = [
  { href: '/zh-cn/markdown-to-word', label: 'Markdown 转 Word' },
  { href: '/zh-cn/markdown-to-pdf', label: 'Markdown 转 PDF' },
  { href: '/zh-cn/markdown-to-html', label: 'Markdown 转 HTML' },
  { href: '/zh-cn/yaml-to-json', label: 'YAML 转 JSON' },
  { href: '/zh-cn/json-to-csv', label: 'JSON 转 CSV' },
  { href: '/zh-cn/html-to-markdown', label: 'HTML 转 Markdown' },
]

const resourceLinks = [
  { href: '/blog', label: '博客' },
  { href: '/tutorials', label: '使用教程' },
  { href: '/faq', label: '常见问题' },
]

const legalLinks = [
  { href: '/terms', label: '服务条款' },
  { href: '/privacy', label: '隐私政策' },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* 转换工具 */}
          <div>
            <h4 className="text-sm font-semibold mb-4">转换工具</h4>
            <ul className="space-y-2.5">
              {toolLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 资源 */}
          <div>
            <h4 className="text-sm font-semibold mb-4">资源</h4>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 法律条款 */}
          <div>
            <h4 className="text-sm font-semibold mb-4">法律条款</h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 关注我们 */}
          <div>
            <h4 className="text-sm font-semibold mb-4">关注我们</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="https://github.com" target="_blank" rel="noopener" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="mailto:contact@mdtools.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  联系我们
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} MD Tools. 保留所有权利。
        </div>
      </div>
    </footer>
  )
}
