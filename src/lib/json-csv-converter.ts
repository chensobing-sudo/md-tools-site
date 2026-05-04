/**
 * JSON 转 CSV 工具库
 */

export interface JsonToCsvOptions {
  delimiter?: string
  includeHeader?: boolean
  flattenArrays?: boolean
  flattenObjects?: boolean
}

export const DEFAULT_CSV_OPTIONS: JsonToCsvOptions = {
  delimiter: ',',
  includeHeader: true,
  flattenArrays: false,
  flattenObjects: true,
}

/**
 * 将 JSON 字符串转换为 CSV 字符串
 */
export function jsonToCsv(
  json: string,
  options: JsonToCsvOptions = DEFAULT_CSV_OPTIONS
): string {
  const { delimiter = ',', includeHeader = true, flattenObjects = true } = options

  let data: any[]
  try {
    const parsed = JSON.parse(json)
    data = Array.isArray(parsed) ? parsed : [parsed]
  } catch {
    throw new Error('无效的 JSON 格式')
  }

  if (data.length === 0) {
    return ''
  }

  // 收集所有键（展平嵌套对象）
  const allKeys = new Set<string>()
  const collectKeys = (obj: any, prefix = '') => {
    if (typeof obj !== 'object' || obj === null) return
    for (const key of Object.keys(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key
      if (flattenObjects && typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        collectKeys(obj[key], fullKey)
      } else {
        allKeys.add(fullKey)
      }
    }
  }

  data.forEach((item) => collectKeys(item))
  const keys = Array.from(allKeys)

  // 获取展平后的值
  const getValue = (obj: any, keyPath: string): string => {
    const parts = keyPath.split('.')
    let current = obj
    for (const part of parts) {
      if (current === null || current === undefined) return ''
      current = current[part]
    }
    return formatCsvValue(current, delimiter)
  }

  // 构建 CSV
  const rows: string[] = []

  if (includeHeader) {
    rows.push(keys.map((key) => escapeCsvField(key, delimiter)).join(delimiter))
  }

  for (const item of data) {
    const row = keys.map((key) => getValue(item, key))
    rows.push(row.join(delimiter))
  }

  return rows.join('\n')
}

function formatCsvValue(value: any, delimiter: string): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') {
    return escapeCsvField(JSON.stringify(value), delimiter)
  }
  return escapeCsvField(String(value), delimiter)
}

function escapeCsvField(value: string, delimiter: string): string {
  const str = String(value)
  if (str.includes(delimiter) || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * 将 CSV 字符串转换为 JSON 字符串
 */
export function csvToJson(
  csv: string,
  options: { delimiter?: string; hasHeader?: boolean } = {}
): string {
  const { delimiter = ',', hasHeader = true } = options

  const lines = csv.trim().split('\n')
  if (lines.length === 0) return '[]'

  // 解析 CSV 行（支持引号转义）
  const parseLine = (line: string): string[] => {
    const fields: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === delimiter && !inQuotes) {
        fields.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    fields.push(current.trim())
    return fields
  }

  const parsedLines = lines.map(parseLine)

  if (hasHeader) {
    const headers = parsedLines[0]
    const data = parsedLines.slice(1).map((row) => {
      const obj: Record<string, any> = {}
      headers.forEach((header, i) => {
        const value = row[i] || ''
        // 尝试解析数字和布尔值
        if (value === 'true') obj[header] = true
        else if (value === 'false') obj[header] = false
        else if (value === '' || value === 'null') obj[header] = null
        else if (!isNaN(Number(value)) && value.trim() !== '') obj[header] = Number(value)
        else obj[header] = value
      })
      return obj
    })
    return JSON.stringify(data, null, 2)
  } else {
    const data = parsedLines.map((row) =>
      row.map((v) => {
        if (v === 'true') return true
        if (v === 'false') return false
        if (v === '' || v === 'null') return null
        if (!isNaN(Number(v)) && v.trim() !== '') return Number(v)
        return v
      })
    )
    return JSON.stringify(data, null, 2)
  }
}

/**
 * 验证 JSON 是否可转换为 CSV
 */
export function validateJsonForCsv(json: string): {
  valid: boolean
  error?: string
  rowCount?: number
} {
  try {
    const parsed = JSON.parse(json)
    const data = Array.isArray(parsed) ? parsed : [parsed]
    if (data.length === 0) {
      return { valid: false, error: 'JSON 数据为空' }
    }
    return { valid: true, rowCount: data.length }
  } catch {
    return { valid: false, error: '无效的 JSON 格式' }
  }
}
