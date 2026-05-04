/**
 * 文件处理工具库
 * 提供文件上传、下载、格式验证等功能
 */

/**
 * 文件类型验证配置
 */
export interface FileValidationOptions {
  allowedExtensions?: string[]
  maxSize?: number // 字节
  maxFiles?: number
}

/**
 * 默认文件验证配置
 */
export const DEFAULT_VALIDATION_OPTIONS: FileValidationOptions = {
  allowedExtensions: ['.md', '.markdown', '.txt', '.yaml', '.yml', '.json'],
  maxSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 1
}

/**
 * 验证文件
 * @param file 文件对象
 * @param options 验证选项
 * @returns 验证结果
 */
export function validateFile(
  file: File, 
  options: FileValidationOptions = DEFAULT_VALIDATION_OPTIONS
): { valid: boolean; error?: string } {
  const {
    allowedExtensions = DEFAULT_VALIDATION_OPTIONS.allowedExtensions!,
    maxSize = DEFAULT_VALIDATION_OPTIONS.maxSize!,
    maxFiles = DEFAULT_VALIDATION_OPTIONS.maxFiles!
  } = options

  // 检查文件大小
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1)
    return {
      valid: false,
      error: `文件大小不能超过 ${maxSizeMB}MB`
    }
  }

  // 检查文件扩展名
  const fileName = file.name.toLowerCase()
  const hasValidExtension = allowedExtensions.some(ext => 
    fileName.endsWith(ext.toLowerCase())
  )

  if (!hasValidExtension) {
    return {
      valid: false,
      error: `不支持的文件格式。支持的文件格式: ${allowedExtensions.join(', ')}`
    }
  }

  return { valid: true }
}

/**
 * 读取文件内容为文本
 * @param file 文件对象
 * @returns Promise<string> 文件内容
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string)
      } else {
        reject(new Error('无法读取文件内容'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
    
    reader.readAsText(file, 'UTF-8')
  })
}

/**
 * 下载文件
 * @param content 文件内容
 * @param filename 文件名
 * @param mimeType MIME 类型
 */
export function downloadFile(
  content: string | Blob,
  filename: string,
  mimeType: string
): void {
  let blob: Blob
  
  if (typeof content === 'string') {
    blob = new Blob([content], { type: mimeType })
  } else {
    blob = content
  }
  
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise<boolean> 是否复制成功
 */
export function copyToClipboard(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (navigator.clipboard && window.isSecureContext) {
      // 使用现代 Clipboard API
      navigator.clipboard.writeText(text)
        .then(() => resolve(true))
        .catch(() => {
          // 降级到传统方法
          resolve(copyUsingExecCommand(text))
        })
    } else {
      // 使用传统方法
      resolve(copyUsingExecCommand(text))
    }
  })
}

/**
 * 使用 execCommand 复制文本（传统方法）
 */
function copyUsingExecCommand(text: string): boolean {
  try {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    return successful
  } catch (err) {
    console.error('复制失败:', err)
    return false
  }
}

/**
 * 获取文件扩展名
 * @param filename 文件名
 * @returns 文件扩展名（包含点）
 */
export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.')
  if (lastDotIndex === -1) return ''
  return filename.slice(lastDotIndex).toLowerCase()
}

/**
 * 根据扩展名获取 MIME 类型
 * @param extension 文件扩展名
 * @returns MIME 类型
 */
export function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    '.md': 'text/markdown',
    '.markdown': 'text/markdown',
    '.txt': 'text/plain',
    '.yaml': 'text/yaml',
    '.yml': 'text/yaml',
    '.json': 'application/json',
    '.html': 'text/html',
    '.htm': 'text/html',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.pdf': 'application/pdf',
    '.csv': 'text/csv',
    '.xml': 'application/xml'
  }
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream'
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @param decimals 小数位数
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * 生成唯一文件名
 * @param originalName 原始文件名
 * @param timestamp 是否添加时间戳
 * @returns 唯一文件名
 */
export function generateUniqueFilename(
  originalName: string,
  timestamp: boolean = true
): string {
  const extension = getFileExtension(originalName)
  const nameWithoutExt = originalName.slice(0, -extension.length)
  
  let uniqueName = nameWithoutExt
  
  if (timestamp) {
    const now = new Date()
    const timestampStr = now.getTime().toString()
    uniqueName += `-${timestampStr}`
  }
  
  return uniqueName + extension
}

/**
 * 批量验证文件
 * @param files 文件列表
 * @param options 验证选项
 * @returns 验证结果
 */
export function validateFiles(
  files: File[],
  options: FileValidationOptions = DEFAULT_VALIDATION_OPTIONS
): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const { maxFiles = DEFAULT_VALIDATION_OPTIONS.maxFiles! } = options
  
  // 检查文件数量
  if (files.length > maxFiles) {
    errors.push(`最多只能上传 ${maxFiles} 个文件`)
  }
  
  // 验证每个文件
  for (const file of files) {
    const result = validateFile(file, options)
    if (!result.valid && result.error) {
      errors.push(`${file.name}: ${result.error}`)
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * 创建文件输入元素
 * @param options 配置选项
 * @returns 文件输入元素
 */
export function createFileInput(options: {
  accept?: string
  multiple?: boolean
  onChange: (files: File[]) => void
}): HTMLInputElement {
  const input = document.createElement('input')
  input.type = 'file'
  
  if (options.accept) {
    input.accept = options.accept
  }
  
  if (options.multiple) {
    input.multiple = options.multiple
  }
  
  input.style.display = 'none'
  document.body.appendChild(input)
  
  input.addEventListener('change', (event) => {
    const files = Array.from((event.target as HTMLInputElement).files || [])
    options.onChange(files)
    document.body.removeChild(input)
  })
  
  return input
}