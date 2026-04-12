import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-section">
          <h4>转换工具</h4>
          <Link href="/zh-cn/markdown-to-word">Markdown 转 Word</Link>
          <Link href="/zh-cn/markdown-to-pdf">Markdown 转 PDF</Link>
          <Link href="/zh-cn/markdown-to-html">Markdown 转 HTML</Link>
          <Link href="/zh-cn/yaml-to-json">YAML 转 JSON</Link>
        </div>
        <div className="footer-section">
          <h4>资源</h4>
          <Link href="/blog">博客</Link>
          <Link href="/tutorials">使用教程</Link>
          <Link href="/faq">常见问题</Link>
          <Link href="/api">API 文档</Link>
        </div>
        <div className="footer-section">
          <h4>法律条款</h4>
          <Link href="/terms">服务条款</Link>
          <Link href="/privacy">隐私政策</Link>
          <Link href="/cookies">Cookie 政策</Link>
        </div>
        <div className="footer-section">
          <h4>关注我们</h4>
          <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
          <a href="https://twitter.com" target="_blank" rel="noopener">Twitter</a>
          <a href="mailto:contact@mdtools.com">联系我们</a>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          © {new Date().getFullYear()} MD Tools. 保留所有权利。
        </div>
      </div>
    </footer>
  )
}
