import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <Link href="/" className="navbar-brand">
          📄 MD Tools
        </Link>
        <div className="navbar-nav">
          <Link href="/zh-cn/markdown-to-word">MD 转 Word</Link>
          <Link href="/zh-cn/markdown-to-pdf">MD 转 PDF</Link>
          <Link href="/zh-cn/markdown-to-html">MD 转 HTML</Link>
          <Link href="/zh-cn/yaml-to-json">YAML 转 JSON</Link>
          <Link href="/blog">博客</Link>
        </div>
      </div>
    </nav>
  )
}
