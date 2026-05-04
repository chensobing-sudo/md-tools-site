'use client'

import { ReactNode } from 'react'

interface SettingsPanelProps {
  title?: string
  children: ReactNode
}

export default function SettingsPanel({ title = '设置', children }: SettingsPanelProps) {
  return (
    <div className="tool-panel">
      <div className="tool-panel-header">
        <span>{title}</span>
      </div>
      <div className="tool-panel-body">
        {children}
      </div>
    </div>
  )
}
