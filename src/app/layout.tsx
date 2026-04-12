import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MD Tools - 免费在线格式转换工具 | Markdown 转 Word/PDF/HTML',
  description: '免费、快速、安全的在线格式转换工具。支持 Markdown 转 Word、PDF、HTML、YAML 等多种格式。100% 浏览器本地处理，无需上传文件，保护您的隐私安全。',
  keywords: ['Markdown', '转换', 'Word', 'PDF', 'HTML', '在线工具', '免费', '本地处理'],
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        {/* Google AdSense - 替换为您的 AdSense ID */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossOrigin="anonymous"></script> */}
      </head>
      <body>{children}</body>
    </html>
  )
}
