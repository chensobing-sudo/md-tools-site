'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'

interface EditorPanelProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  accept?: string
  label?: string
  onClear?: () => void
  stats?: { label: string; value: string | number }[]
}

export default function EditorPanel({
  value,
  onChange,
  placeholder = '在此输入或粘贴内容...',
  accept = '.md,.markdown,.txt',
  label = '输入',
  onClear,
  stats,
}: EditorPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      onChange(content)
    }
    reader.readAsText(file)
  }

  return (
    <div className="tool-panel">
      <div className="tool-panel-header">
        <span>{label}</span>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            上传文件
          </Button>
          {onClear && (
            <Button variant="ghost" size="sm" onClick={onClear}>
              清空
            </Button>
          )}
        </div>
      </div>
      <div className="tool-panel-body">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="editor-textarea"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept={accept}
          style={{ display: 'none' }}
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            支持 {accept} 格式文件
          </span>
          {stats && (
            <div className="flex gap-3">
              {stats.map((stat) => (
                <span key={stat.label} className="text-xs text-muted-foreground">
                  {stat.label}: <strong>{stat.value}</strong>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
