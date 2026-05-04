'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface ToolLayoutProps {
  title: string
  description: string
  children: ReactNode
  seoContent?: ReactNode
}

export default function ToolLayout({ title, description, children, seoContent }: ToolLayoutProps) {
  return (
    <>
      {/* 工具头部 */}
      <section className="tool-header">
        <div className="container">
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="mt-4 flex gap-3 justify-center">
            <Link href="/" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-accent transition-colors">
              ← 返回首页
            </Link>
          </div>
        </div>
      </section>

      {/* 工具工作区 */}
      <div className="container">
        {children}
      </div>

      {/* SEO 内容 */}
      {seoContent && (
        <section className="seo-content">
          <div className="container">
            {seoContent}
          </div>
        </section>
      )}
    </>
  )
}
