'use client'

import { useState, useRef, useEffect } from 'react'
import ToolLayout from '@/components/shared/ToolLayout'
import EditorPanel from '@/components/shared/EditorPanel'
import SettingsPanel from '@/components/shared/SettingsPanel'
import { Button } from '@/components/ui/button'

export default function MarkdownToText() {
  const [markdown, setMarkdown] = useState(`# Markdown 转纯文本示例

这是一个 **Markdown 文档**，我们将把它转换为纯文本格式。

## 功能特点

- 移除所有 Markdown 标记符号
- 保留文本内容和基本结构
- 支持标题、列表、表格等元素
- 适合复制到不支持 Markdown 的编辑器

## 代码示例

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

## 表格示例

| 功能 | 状态 |
|------|------|
| 标题转换 | ✅ |
| 列表转换 | ✅ |

> 这是一个引用块示例。

更多信息请访问 [MD Tools](https://md-tools.com)。`)
  const [textOutput, setTextOutput] = useState('')
  const [preserveStructure, setPreserveStructure] = useState(true)
  const [removeUrls, setRemoveUrls] = useState(false)
  const outputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    convertToText()
  }, [markdown, preserveStructure, removeUrls])

  const convertToText = () => {
    let text = markdown

    // 移除代码块标记
    text = text.replace(/```[\s\S]*?```/g, (match) => {
      const code = match.replace(/```\w*\n?/g, '').trim()
      return code
    })

    // 移除行内代码标记
    text = text.replace(/`([^`]+)`/g, '$1')

    // 处理标题
    text = text.replace(/^#{1,6}\s+/gm, '')

    // 处理粗体和斜体
    text = text.replace(/\*\*(.*?)\*\*/g, '$1')
    text = text.replace(/__(.*?)__/g, '$1')
    text = text.replace(/\*(.*?)\*/g, '$1')
    text = text.replace(/_(.*?)_/g, '$1')

    // 处理删除线
    text = text.replace(/~~(.*?)~~/g, '$1')

    // 处理链接
    if (removeUrls) {
      text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    } else {
      text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
    }

    // 处理图片
    text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')

    // 处理列表标记
    text = text.replace(/^\s*[-*+]\s+/gm, '• ')
    text = text.replace(/^\s*\d+\.\s+/gm, (match) => match.trim())

    // 处理引用块
    text = text.replace(/^>\s+/gm, '')

    // 处理水平线
    text = text.replace(/^---$/gm, '——————————')
    text = text.replace(/^\*\*\*$/gm, '——————————')
    text = text.replace(/^___$/gm, '——————————')

    // 处理表格
    text = text.replace(/^\|.+\|$/gm, (match) => {
      // 移除表格边框和分隔行
      if (match.includes('---')) return ''
      return match.replace(/\|/g, ' ').trim()
    })

    // 清理多余空行
    text = text.replace(/\n{3,}/g, '\n\n')

    // 清理行尾空格
    text = text.replace(/[ \t]+$/gm, '')

    setTextOutput(text.trim())
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textOutput)
      alert('纯文本已复制到剪贴板！')
    } catch {
      if (outputRef.current) {
        outputRef.current.select()
        document.execCommand('copy')
        alert('纯文本已复制到剪贴板！')
      }
    }
  }

  const handleDownload = () => {
    const blob = new Blob([textOutput], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `converted-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExample = () => {
    setMarkdown(`# 项目报告

## 执行摘要

本报告总结了 **Q4 季度** 的项目进展情况。

### 关键指标

| 指标 | 目标 | 实际 |
|------|------|------|
| 完成率 | 100% | 95% |
| 满意度 | 90% | 92% |

### 主要成果

1. 完成了核心功能开发
2. 通过了性能测试
3. 发布了 v2.0 版本

> 团队表现优异，超额完成了季度目标。

详情请查看 [完整报告](https://example.com/report)。`)
  }

  return (
    <ToolLayout
      title="Markdown 转纯文本"
      description="将 Markdown 文档转换为纯文本格式，移除所有标记符号，保留可读的内容结构"
      seoContent={
        <>
          <h2>Markdown 转纯文本使用指南</h2>
          <p>
            Markdown 转纯文本工具帮助您从 Markdown 文档中提取纯文本内容，
            移除所有格式标记符号，保留可读的文本结构。适合将 Markdown 内容粘贴到不支持格式的编辑器中。
          </p>
          <h3>适用场景</h3>
          <ul>
            <li><strong>内容提取</strong>：从 Markdown 文档中提取纯文本内容</li>
            <li><strong>字数统计</strong>：获取去除格式后的真实文本字数</li>
            <li><strong>跨平台粘贴</strong>：将内容粘贴到不支持 Markdown 的系统中</li>
            <li><strong>文本分析</strong>：对文档内容进行纯文本分析</li>
          </ul>
          <h3>处理规则</h3>
          <ul>
            <li>移除标题标记（#），保留标题文本</li>
            <li>移除粗体（**）、斜体（*）、删除线（~~）标记</li>
            <li>将链接转换为"文本 (URL)"格式</li>
            <li>将列表标记替换为符号（•）</li>
            <li>移除引用块标记（&gt;）</li>
            <li>提取代码块中的代码内容</li>
          </ul>
        </>
      }
    >
      <div className="tool-workspace">
        <EditorPanel
          label="Markdown 输入"
          value={markdown}
          onChange={setMarkdown}
          placeholder="在此输入或粘贴 Markdown 内容..."
          accept=".md,.markdown,.txt"
          stats={[
            { label: '字符', value: markdown.length },
            { label: '行数', value: markdown.split('\n').length.toString() },
          ]}
        />

        <div className="tool-panel">
          <div className="tool-panel-header">
            <span>纯文本输出</span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={handleCopy}>复制</Button>
              <Button variant="secondary" size="sm" onClick={handleDownload}>下载</Button>
            </div>
          </div>
          <div className="tool-panel-body">
            <textarea
              ref={outputRef}
              value={textOutput}
              readOnly
              className="editor-textarea"
              placeholder="转换后的纯文本将显示在这里..."
            />
            <div className="mt-3 text-xs text-muted-foreground">
              共 {textOutput.length} 字符，{textOutput.split('\n').length} 行
              {markdown.length > 0 && (
                <span>（减少 {((1 - textOutput.length / markdown.length) * 100).toFixed(1)}% 字符）</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 设置面板 */}
      <div className="mb-10">
        <SettingsPanel title="转换选项">
          <div className="space-y-3">
            <label className="flex items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={preserveStructure}
                onChange={(e) => setPreserveStructure(e.target.checked)}
                className="rounded border-border"
              />
              保留文本结构（空行分隔段落）
            </label>
            <label className="flex items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={removeUrls}
                onChange={(e) => setRemoveUrls(e.target.checked)}
                className="rounded border-border"
              />
              移除链接 URL（仅保留链接文本）
            </label>
          </div>
          <div className="mt-6 flex gap-3">
            <Button onClick={handleExample} variant="outline">加载示例</Button>
          </div>
        </SettingsPanel>
      </div>
    </ToolLayout>
  )
}
