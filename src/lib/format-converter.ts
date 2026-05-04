/**
 * 格式转换工具库
 * 提供各种格式之间的转换功能
 */

/**
 * YAML 转 JSON 选项
 */
export interface YamlToJsonOptions {
  pretty?: boolean
  sortKeys?: boolean
  preserveComments?: boolean
}

/**
 * JSON 转 YAML 选项
 */
export interface JsonToYamlOptions {
  indent?: number
  lineWidth?: number
  sortKeys?: boolean
}

/**
 * 将 YAML 字符串转换为 JSON 字符串
 * 注意：这是一个简化版本，实际项目中应该使用 js-yaml 库
 * @param yaml YAML 字符串
 * @param options 转换选项
 * @returns JSON 字符串
 */
export function yamlToJson(
  yaml: string, 
  options: YamlToJsonOptions = {}
): string {
  const {
    pretty = true,
    sortKeys = false,
    preserveComments = false
  } = options

  try {
    // 移除注释（如果不需要保留）
    let processedYaml = yaml
    if (!preserveComments) {
      processedYaml = removeYamlComments(yaml)
    }

    // 简化的 YAML 解析逻辑
    // 实际项目中应该使用 js-yaml 库：import yaml from 'js-yaml'
    const result = {
      converted: true,
      originalLength: yaml.length,
      processedLength: processedYaml.length,
      timestamp: new Date().toISOString(),
      note: '这是一个简化的 YAML 解析示例。实际项目中请使用 js-yaml 库。',
      sampleData: {
        app: {
          name: 'MD Tools',
          version: '1.0.0'
        }
      }
    }

    // 根据选项格式化 JSON
    if (pretty) {
      return JSON.stringify(result, null, 2)
    } else {
      return JSON.stringify(result)
    }
  } catch (error) {
    throw new Error(`YAML 解析失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 将 JSON 字符串转换为 YAML 字符串
 * 注意：这是一个简化版本，实际项目中应该使用 js-yaml 库
 * @param json JSON 字符串
 * @param options 转换选项
 * @returns YAML 字符串
 */
export function jsonToYaml(
  json: string, 
  options: JsonToYamlOptions = {}
): string {
  const {
    indent = 2,
    lineWidth = 80,
    sortKeys = false
  } = options

  try {
    const obj = JSON.parse(json)
    
    // 简化的 JSON 转 YAML 逻辑
    // 实际项目中应该使用 js-yaml 库：import yaml from 'js-yaml'
    let yaml = `# 从 JSON 转换的 YAML\n`
    yaml += `# 生成时间: ${new Date().toISOString()}\n\n`
    
    yaml += convertObjectToYaml(obj, '', indent, sortKeys)
    
    return yaml
  } catch (error) {
    throw new Error(`JSON 解析失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 将对象转换为 YAML 字符串（递归）
 */
function convertObjectToYaml(
  obj: any,
  indentStr: string,
  indentSize: number,
  sortKeys: boolean
): string {
  let yaml = ''
  
  const keys = Object.keys(obj)
  if (sortKeys) {
    keys.sort()
  }
  
  for (const key of keys) {
    const value = obj[key]
    
    if (Array.isArray(value)) {
      yaml += `${indentStr}${key}:\n`
      for (const item of value) {
        if (typeof item === 'object' && item !== null) {
          yaml += `${indentStr}${' '.repeat(indentSize)}- `
          yaml += convertObjectToYaml(item, `${indentStr}${' '.repeat(indentSize * 2)}`, indentSize, sortKeys).trimStart()
        } else {
          yaml += `${indentStr}${' '.repeat(indentSize)}- ${formatYamlValue(item)}\n`
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      yaml += `${indentStr}${key}:\n`
      yaml += convertObjectToYaml(value, `${indentStr}${' '.repeat(indentSize)}`, indentSize, sortKeys)
    } else {
      yaml += `${indentStr}${key}: ${formatYamlValue(value)}\n`
    }
  }
  
  return yaml
}

/**
 * 格式化 YAML 值
 */
function formatYamlValue(value: any): string {
  if (value === null) {
    return 'null'
  }
  
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }
  
  if (typeof value === 'number') {
    return value.toString()
  }
  
  if (typeof value === 'string') {
    // 检查是否需要引号
    if (value.includes(':') || value.includes('#') || value.includes('"') || value.includes("'") || value.trim() !== value) {
      return `"${value.replace(/"/g, '\\"')}"`
    }
    return value
  }
  
  return String(value)
}

/**
 * 移除 YAML 注释
 */
function removeYamlComments(yaml: string): string {
  const lines = yaml.split('\n')
  const processedLines: string[] = []
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    // 跳过空行和注释行
    if (trimmedLine === '' || trimmedLine.startsWith('#')) {
      continue
    }
    
    // 移除行内注释
    const commentIndex = line.indexOf('#')
    if (commentIndex !== -1) {
      // 检查 # 是否在引号内
      const beforeComment = line.substring(0, commentIndex)
      const quoteCount = (beforeComment.match(/"/g) || []).length
      
      if (quoteCount % 2 === 0) {
        // # 不在引号内，移除注释
        processedLines.push(line.substring(0, commentIndex).trimEnd())
        continue
      }
    }
    
    processedLines.push(line)
  }
  
  return processedLines.join('\n')
}

/**
 * 验证 JSON 字符串
 * @param json JSON 字符串
 * @returns 验证结果
 */
export function validateJson(json: string): { valid: boolean; error?: string } {
  try {
    JSON.parse(json)
    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : '无效的 JSON 格式'
    }
  }
}

/**
 * 验证 YAML 字符串
 * 注意：这是一个简化版本
 * @param yaml YAML 字符串
 * @returns 验证结果
 */
export function validateYaml(yaml: string): { valid: boolean; error?: string } {
  try {
    // 简化的 YAML 验证
    // 实际项目中应该使用 js-yaml 库
    
    // 检查基本的 YAML 结构
    const lines = yaml.split('\n')
    let indentLevel = 0
    const indentStack: number[] = [0]
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      // 跳过空行和注释
      if (line === '' || line.startsWith('#')) {
        continue
      }
      
      // 检查缩进
      const leadingSpaces = lines[i].match(/^(\s*)/)?.[1].length || 0
      
      if (leadingSpaces > indentStack[indentStack.length - 1]) {
        // 增加缩进
        indentStack.push(leadingSpaces)
      } else if (leadingSpaces < indentStack[indentStack.length - 1]) {
        // 减少缩进
        while (indentStack.length > 1 && leadingSpaces < indentStack[indentStack.length - 1]) {
          indentStack.pop()
        }
        
        if (leadingSpaces !== indentStack[indentStack.length - 1]) {
          return {
            valid: false,
            error: `第 ${i + 1} 行: 缩进不一致`
          }
        }
      }
      
      // 检查基本的 YAML 语法
      if (line.includes(':') || line.startsWith('-')) {
        // 有效的 YAML 行
        continue
      }
      
      return {
        valid: false,
        error: `第 ${i + 1} 行: 无效的 YAML 语法`
      }
    }
    
    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : '无效的 YAML 格式'
    }
  }
}

/**
 * 美化 JSON 字符串
 * @param json JSON 字符串
 * @param indent 缩进空格数
 * @returns 美化后的 JSON 字符串
 */
export function prettifyJson(json: string, indent: number = 2): string {
  try {
    const obj = JSON.parse(json)
    return JSON.stringify(obj, null, indent)
  } catch {
    // 如果解析失败，尝试修复常见的 JSON 问题
    return tryFixAndPrettifyJson(json, indent)
  }
}

/**
 * 尝试修复并美化 JSON
 */
function tryFixAndPrettifyJson(json: string, indent: number): string {
  let fixedJson = json
  
  // 修复常见的 JSON 问题
  // 1. 修复单引号
  fixedJson = fixedJson.replace(/'/g, '"')
  
  // 2. 修复未转义的控制字符
  fixedJson = fixedJson.replace(/\\n/g, '\n')
  fixedJson = fixedJson.replace(/\\t/g, '\t')
  fixedJson = fixedJson.replace(/\\r/g, '\r')
  
  // 3. 修复尾随逗号
  fixedJson = fixedJson.replace(/,\s*}/g, '}')
  fixedJson = fixedJson.replace(/,\s*]/g, ']')
  
  try {
    const obj = JSON.parse(fixedJson)
    return JSON.stringify(obj, null, indent)
  } catch {
    // 如果仍然失败，返回原始字符串
    return json
  }
}

/**
 * 压缩 JSON 字符串（移除所有空白字符）
 * @param json JSON 字符串
 * @returns 压缩后的 JSON 字符串
 */
export function minifyJson(json: string): string {
  try {
    const obj = JSON.parse(json)
    return JSON.stringify(obj)
  } catch {
    // 如果解析失败，尝试简单的压缩
    return json.replace(/\s+/g, ' ').trim()
  }
}

/**
 * 比较两个 JSON 字符串的差异
 * @param json1 第一个 JSON 字符串
 * @param json2 第二个 JSON 字符串
 * @returns 差异描述
 */
export function compareJson(
  json1: string, 
  json2: string
): { areEqual: boolean; differences?: string[] } {
  try {
    const obj1 = JSON.parse(json1)
    const obj2 = JSON.parse(json2)
    
    if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
      return { areEqual: true }
    }
    
    const differences: string[] = []
    findDifferences(obj1, obj2, '', differences)
    
    return {
      areEqual: false,
      differences: differences.length > 0 ? differences : ['结构相同但顺序不同']
    }
  } catch (error) {
    return {
      areEqual: false,
      differences: [`解析错误: ${error instanceof Error ? error.message : '未知错误'}`]
    }
  }
}

/**
 * 递归查找对象差异
 */
function findDifferences(
  obj1: any,
  obj2: any,
  path: string,
  differences: string[]
): void {
  if (typeof obj1 !== typeof obj2) {
    differences.push(`${path}: 类型不同 (${typeof obj1} vs ${typeof obj2})`)
    return
  }
  
  if (typeof obj1 !== 'object' || obj1 === null || obj2 === null) {
    if (obj1 !== obj2) {
      differences.push(`${path}: 值不同 (${obj1} vs ${obj2})`)
    }
    return
  }
  
  if (Array.isArray(obj1) !== Array.isArray(obj2)) {
    differences.push(`${path}: 数组/对象类型不同`)
    return
  }
  
  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length) {
      differences.push(`${path}: 数组长度不同 (${obj1.length} vs ${obj2.length})`)
    }
    
    const maxLength = Math.max(obj1.length, obj2.length)
    for (let i = 0; i < maxLength; i++) {
      if (i >= obj1.length) {
        differences.push(`${path}[${i}]: 只在第二个数组中存在`)
      } else if (i >= obj2.length) {
        differences.push(`${path}[${i}]: 只在第一个数组中存在`)
      } else {
        findDifferences(obj1[i], obj2[i], `${path}[${i}]`, differences)
      }
    }
  } else {
    const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)])
    const keysArray = Array.from(allKeys)

    for (const key of keysArray) {
      const newPath = path ? `${path}.${key}` : key

      if (!(key in obj1)) {
        differences.push(`${newPath}: 只在第二个对象中存在`)
      } else if (!(key in obj2)) {
        differences.push(`${newPath}: 只在第一个对象中存在`)
      } else {
        findDifferences(obj1[key], obj2[key], newPath, differences)
      }
    }
  }
}