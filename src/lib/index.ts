/**
 * 工具函数库索引
 * 导出所有工具函数供项目使用
 */

// 导出 Markdown 转换工具
export {
  markdownToHtml,
  analyzeMarkdown,
  cleanMarkdown,
  extractHeadings,
  type MarkdownStats,
  type Heading
} from './markdown-converter'

// 导出文件处理工具
export {
  validateFile,
  validateFiles,
  readFileAsText,
  downloadFile,
  copyToClipboard,
  getFileExtension,
  getMimeType,
  formatFileSize,
  generateUniqueFilename,
  createFileInput,
  type FileValidationOptions,
  DEFAULT_VALIDATION_OPTIONS
} from './file-utils'

// 导出格式转换工具
export {
  yamlToJson,
  jsonToYaml,
  validateJson,
  validateYaml,
  prettifyJson,
  minifyJson,
  compareJson,
  type YamlToJsonOptions,
  type JsonToYamlOptions
} from './format-converter'

/**
 * 工具库版本信息
 */
export const LIB_VERSION = '1.0.0'

/**
 * 工具库描述
 */
export const LIB_DESCRIPTION = 'MD Tools 格式转换工具库'

/**
 * 初始化工具库
 * 可以在这里添加全局初始化逻辑
 */
export function initializeTools(): void {
  console.log(`${LIB_DESCRIPTION} v${LIB_VERSION} 已初始化`)
  
  // 添加全局错误处理
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      console.error('工具库错误:', event.error)
    })
  }
}

/**
 * 工具库工具函数
 */
export const utils = {
  /**
   * 防抖函数
   */
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null
    
    return (...args: Parameters<T>) => {
      if (timeout) {
        clearTimeout(timeout)
      }
      
      timeout = setTimeout(() => {
        func(...args)
        timeout = null
      }, wait)
    }
  },
  
  /**
   * 节流函数
   */
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => {
          inThrottle = false
        }, limit)
      }
    }
  },
  
  /**
   * 生成随机 ID
   */
  generateId(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    
    return result
  },
  
  /**
   * 深度克隆对象
   */
  deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj
    }
    
    if (obj instanceof Date) {
      return new Date(obj.getTime()) as T
    }
    
    if (obj instanceof Array) {
      return obj.map(item => this.deepClone(item)) as T
    }
    
    if (typeof obj === 'object') {
      const clonedObj = {} as T
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key])
        }
      }
      return clonedObj
    }
    
    return obj
  },
  
  /**
   * 对象合并（深合并）
   */
  deepMerge<T extends Record<string, any>>(target: T, source: T): T {
    const output = { ...target } as T

    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] })
          } else {
            ;(output as any)[key] = this.deepMerge(target[key], source[key])
          }
        } else {
          Object.assign(output, { [key]: source[key] })
        }
      })
    }

    return output
  },
  
  /**
   * 判断是否为对象
   */
  isObject(item: any): boolean {
    return item && typeof item === 'object' && !Array.isArray(item)
  },
  
  /**
   * 格式化日期
   */
  formatDate(date: Date | string, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
    const d = typeof date === 'string' ? new Date(date) : date
    
    const pad = (n: number) => n.toString().padStart(2, '0')
    
    const replacements: Record<string, string> = {
      'YYYY': d.getFullYear().toString(),
      'MM': pad(d.getMonth() + 1),
      'DD': pad(d.getDate()),
      'HH': pad(d.getHours()),
      'mm': pad(d.getMinutes()),
      'ss': pad(d.getSeconds())
    }
    
    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => replacements[match])
  },
  
  /**
   * 延迟执行
   */
  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  },
  
  /**
   * 安全解析 JSON
   */
  safeJsonParse<T>(json: string, defaultValue: T): T {
    try {
      return JSON.parse(json) as T
    } catch {
      return defaultValue
    }
  },
  
  /**
   * 安全字符串化 JSON
   */
  safeJsonStringify(obj: any): string {
    try {
      return JSON.stringify(obj)
    } catch {
      return '{}'
    }
  }
}