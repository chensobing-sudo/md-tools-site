'use client'

import { useState, useRef, useEffect } from 'react'
import ToolLayout from '@/components/shared/ToolLayout'
import EditorPanel from '@/components/shared/EditorPanel'
import SettingsPanel from '@/components/shared/SettingsPanel'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function JsonToCsv() {
  const [jsonInput, setJsonInput] = useState(`[
  {
    "name": "张三",
    "email": "zhangsan@example.com",
    "age": 28,
    "city": "北京",
    "active": true
  },
  {
    "name": "李四",
    "email": "lisi@example.com",
    "age": 35,
    "city": "上海",
    "active": false
  },
  {
    "name": "王五",
    "email": "wangwu@example.com",
    "age": 42,
    "city": "深圳",
    "active": true
  }
]`)
  const [csvOutput, setCsvOutput] = useState('')
  const [delimiter, setDelimiter] = useState(',')
  const [includeHeader, setIncludeHeader] = useState(true)
  const [flattenObjects, setFlattenObjects] = useState(true)
  const [error, setError] = useState('')
  const [rowCount, setRowCount] = useState(0)
  const outputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    convertJsonToCsv()
  }, [jsonInput, delimiter, includeHeader, flattenObjects])

  const convertJsonToCsv = async () => {
    if (!jsonInput.trim()) {
      setCsvOutput('')
      setError('')
      setRowCount(0)
      return
    }

    try {
      const { jsonToCsv, validateJsonForCsv } = await import('@/lib/json-csv-converter')
      const validation = validateJsonForCsv(jsonInput)
      if (!validation.valid) {
        setError(validation.error || '无效的 JSON')
        setCsvOutput('')
        setRowCount(0)
        return
      }

      setError('')
      setRowCount(validation.rowCount || 0)
      const csv = jsonToCsv(jsonInput, { delimiter, includeHeader, flattenObjects })
      setCsvOutput(csv)
    } catch (err) {
      setError(err instanceof Error ? err.message : '转换失败')
      setCsvOutput('')
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(csvOutput)
      alert('CSV 已复制到剪贴板！')
    } catch {
      if (outputRef.current) {
        outputRef.current.select()
        document.execCommand('copy')
        alert('CSV 已复制到剪贴板！')
      }
    }
  }

  const handleDownload = () => {
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `data-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExample = () => {
    setJsonInput(`[
  {
    "product": "无线耳机",
    "price": 299,
    "stock": 150,
    "category": "电子产品",
    "rating": 4.5
  },
  {
    "product": "机械键盘",
    "price": 599,
    "stock": 80,
    "category": "电子产品",
    "rating": 4.8
  },
  {
    "product": "办公椅",
    "price": 1299,
    "stock": 45,
    "category": "家具",
    "rating": 4.3
  }
]`)
  }

  return (
    <ToolLayout
      title="JSON 转 CSV"
      description="将 JSON 数据快速转换为 CSV 表格格式，支持嵌套对象展平，方便在 Excel 中分析"
      seoContent={
        <>
          <h2>JSON 转 CSV 使用指南</h2>
          <p>
            JSON 转 CSV 工具帮助您将结构化的 JSON 数据转换为通用的 CSV 表格格式。
            CSV 格式广泛支持于 Excel、Google Sheets 等电子表格软件，方便数据分析和处理。
          </p>
          <h3>适用场景</h3>
          <ul>
            <li><strong>数据分析</strong>：将 API 返回的 JSON 数据导出为表格进行分析</li>
            <li><strong>数据迁移</strong>：在不同系统之间转换数据格式</li>
            <li><strong>报表生成</strong>：从 JSON 数据生成 CSV 报表</li>
            <li><strong>数据备份</strong>：将结构化数据导出为通用格式存档</li>
          </ul>
          <h3>功能特点</h3>
          <ul>
            <li><strong>嵌套对象展平</strong>：自动将嵌套的 JSON 对象展平为扁平的列</li>
            <li><strong>自定义分隔符</strong>：支持逗号、制表符等多种分隔符</li>
            <li><strong>智能类型转换</strong>：自动处理字符串、数字、布尔值等数据类型</li>
            <li><strong>本地处理</strong>：所有转换在浏览器中完成，数据安全</li>
          </ul>
        </>
      }
    >
      {/* 错误提示 */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
          <strong>错误：</strong> {error}
        </div>
      )}

      <div className="tool-workspace">
        <EditorPanel
          label="JSON 输入"
          value={jsonInput}
          onChange={setJsonInput}
          placeholder='在此输入 JSON 数据，例如 [{"key": "value"}]'
          accept=".json"
          stats={[
            { label: '字符', value: jsonInput.length },
            { label: '对象', value: rowCount.toString() },
          ]}
        />

        <div className="tool-panel">
          <div className="tool-panel-header">
            <span>CSV 输出</span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={handleCopy}>复制</Button>
              <Button variant="secondary" size="sm" onClick={handleDownload}>下载</Button>
            </div>
          </div>
          <div className="tool-panel-body">
            <textarea
              ref={outputRef}
              value={csvOutput}
              readOnly
              className="editor-textarea"
              placeholder="转换后的 CSV 将显示在这里..."
            />
            <div className="mt-3 text-xs text-muted-foreground">
              共 {csvOutput.length} 字符，{csvOutput.split('\n').length} 行
            </div>
          </div>
        </div>
      </div>

      {/* 设置面板 */}
      <div className="mb-10">
        <SettingsPanel title="转换设置">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-3">分隔符</label>
              <div className="flex gap-3">
                {[
                  { value: ',', label: '逗号 (,)' },
                  { value: '\t', label: '制表符 (Tab)' },
                  { value: ';', label: '分号 (;)' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex-1 p-3 rounded-lg border-2 cursor-pointer text-center text-sm transition-all ${
                      delimiter === opt.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delimiter"
                      value={opt.value}
                      checked={delimiter === opt.value}
                      onChange={(e) => setDelimiter(e.target.value)}
                      className="sr-only"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-3">选项</label>
              <div className="space-y-3">
                <label className="flex items-center gap-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={includeHeader}
                    onChange={(e) => setIncludeHeader(e.target.checked)}
                    className="rounded border-border"
                  />
                  包含表头行
                </label>
                <label className="flex items-center gap-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={flattenObjects}
                    onChange={(e) => setFlattenObjects(e.target.checked)}
                    className="rounded border-border"
                  />
                  展平嵌套对象
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button onClick={handleExample} variant="outline">加载示例</Button>
          </div>
        </SettingsPanel>
      </div>
    </ToolLayout>
  )
}
