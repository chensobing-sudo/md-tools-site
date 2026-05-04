import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'MD Tools - 免费在线格式转换工具 | Markdown 转 Word/PDF/HTML',
  description: '免费、快速、安全的在线格式转换工具。支持 Markdown 转 Word、PDF、HTML、YAML、JSON、CSV 等多种格式。100% 浏览器本地处理，无需上传文件，保护您的隐私安全。',
  keywords: ['Markdown', '转换', 'Word', 'PDF', 'HTML', 'YAML', 'JSON', 'CSV', '在线工具', '免费', '本地处理'],
  robots: 'index, follow',
  openGraph: {
    title: 'MD Tools - 免费在线格式转换工具',
    description: '免费、快速、安全的在线格式转换工具。100% 浏览器本地处理。',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
