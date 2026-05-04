'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

export default function YamlToJson() {
  const [yamlInput, setYamlInput] = useState(`# YAML 配置文件示例
# 这是一个应用程序的配置示例

app:
  name: "MD Tools"
  version: "1.0.0"
  description: "在线格式转换工具"
  author: "MD Tools Team"
  
server:
  port: 3000
  host: "localhost"
  ssl: false
  cors:
    enabled: true
    origins:
      - "https://md-tools.com"
      - "https://www.md-tools.com"
  
database:
  type: "mongodb"
  host: "localhost"
  port: 27017
  name: "md_tools"
  auth:
    username: "admin"
    password: "secret"
  
features:
  enabled:
    - "markdown-to-word"
    - "markdown-to-pdf"
    - "markdown-to-html"
    - "yaml-to-json"
  settings:
    max_file_size: "10MB"
    timeout: 30
    cache_enabled: true
    
logging:
  level: "info"
  format: "json"
  output:
    - "console"
    - "file"
  file:
    path: "./logs"
    max_size: "100MB"
    retention: "30d"
    
# 用户配置示例
users:
  - id: 1
    name: "张三"
    email: "zhangsan@example.com"
    role: "admin"
    permissions:
      - "read"
      - "write"
      - "delete"
      
  - id: 2
    name: "李四"
    email: "lisi@example.com"
    role: "user"
    permissions:
      - "read"
      
# 环境变量配置
env:
  development:
    debug: true
    api_url: "http://localhost:3000/api"
    
  production:
    debug: false
    api_url: "https://api.md-tools.com"
    
# 注释说明
# 这是一个多行注释的示例
# YAML 支持行内注释和块注释`)
  const [jsonOutput, setJsonOutput] = useState('')
  const [formatting, setFormatting] = useState('pretty')
  const [conversionDirection, setConversionDirection] = useState('yaml-to-json')
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const jsonOutputRef = useRef<HTMLTextAreaElement>(null)

  // YAML/JSON 转换函数
  const convertYamlToJson = async (input: string) => {
    try {
      setError('')
      
      if (conversionDirection === 'yaml-to-json') {
        // 使用工具函数进行 YAML 转 JSON
        const { yamlToJson, validateYaml } = await import('@/lib/format-converter')
        
        // 验证 YAML
        const validation = validateYaml(input)
        if (!validation.valid) {
          throw new Error(validation.error || '无效的 YAML 格式')
        }
        
        // 转换
        const result = yamlToJson(input, {
          pretty: formatting === 'pretty',
          sortKeys: true,
          preserveComments: false
        })
        
        return result
      } else {
        // JSON 转 YAML
        const { jsonToYaml, validateJson } = await import('@/lib/format-converter')
        
        // 验证 JSON
        const validation = validateJson(input)
        if (!validation.valid) {
          throw new Error(validation.error || '无效的 JSON 格式')
        }
        
        // 转换
        const result = jsonToYaml(input, {
          indent: 2,
          sortKeys: true
        })
        
        return result
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '转换失败')
      return ''
    }
  }

  useEffect(() => {
    const convert = async () => {
      const result = await convertYamlToJson(yamlInput)
      setJsonOutput(result)
    }
    
    convert()
  }, [yamlInput, formatting, conversionDirection])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setYamlInput(content)
    }
    reader.readAsText(file)
  }

  const handleCopyOutput = async () => {
    try {
      const { copyToClipboard } = await import('@/lib/file-utils')
      const success = await copyToClipboard(jsonOutput)
      
      if (success) {
        alert(`${conversionDirection === 'yaml-to-json' ? 'JSON' : 'YAML'} 代码已复制到剪贴板！`)
      } else {
        alert('复制失败，请手动选择并复制代码')
      }
    } catch (error) {
      console.error('复制失败:', error)
      // 降级到传统方法
      if (jsonOutputRef.current) {
        jsonOutputRef.current.select()
        document.execCommand('copy')
        alert(`${conversionDirection === 'yaml-to-json' ? 'JSON' : 'YAML'} 代码已复制到剪贴板！`)
      }
    }
  }

  const handleDownloadOutput = async () => {
    try {
      const { downloadFile, getMimeType } = await import('@/lib/file-utils')
      
      const extension = conversionDirection === 'yaml-to-json' ? 'json' : 'yaml'
      const mimeType = getMimeType(`.${extension}`)
      const filename = `converted-${new Date().getTime()}.${extension}`
      
      downloadFile(jsonOutput, filename, mimeType)
      alert(`文件已下载为 .${extension} 格式！`)
    } catch (error) {
      console.error('下载失败:', error)
      alert(`下载失败: ${error instanceof Error ? error.message : '请重试'}`)
    }
  }

  const handleClear = () => {
    setYamlInput('')
    setError('')
  }

  const handleExample = () => {
    if (conversionDirection === 'yaml-to-json') {
      setYamlInput(`# 电子商务网站配置
site:
  name: "TechStore"
  domain: "techstore.example.com"
  currency: "USD"
  
products:
  categories:
    - name: "Electronics"
      subcategories:
        - "Laptops"
        - "Smartphones"
        - "Tablets"
        
    - name: "Books"
      subcategories:
        - "Fiction"
        - "Non-fiction"
        - "Educational"
        
  featured:
    - id: "P001"
      name: "Wireless Headphones"
      price: 99.99
      stock: 150
      
    - id: "P002"
      name: "Smart Watch"
      price: 199.99
      stock: 75
      
shipping:
  methods:
    - code: "standard"
      name: "Standard Shipping"
      cost: 4.99
      days: "5-7"
      
    - code: "express"
      name: "Express Shipping"
      cost: 9.99
      days: "2-3"
      
  free_threshold: 50
  
payment:
  gateways:
    - name: "Stripe"
      enabled: true
      test_mode: false
      
    - name: "PayPal"
      enabled: true
      test_mode: true
      
tax:
  rate: 0.08
  included_in_price: false
  
# 性能配置
performance:
  cache:
    enabled: true
    ttl: 3600
    
  cdn:
    enabled: true
    provider: "Cloudflare"
    
# 监控配置
monitoring:
  sentry:
    dsn: "https://abc123@sentry.io/123456"
    environment: "production"
    
  analytics:
    google_analytics: "UA-123456-1"
    hotjar: "1234567"`)
    } else {
      setYamlInput(`{
  "api": {
    "version": "v1",
    "base_url": "https://api.example.com",
    "endpoints": {
      "users": "/users",
      "products": "/products",
      "orders": "/orders"
    },
    "rate_limit": {
      "requests": 100,
      "per_seconds": 60
    }
  },
  "database": {
    "primary": {
      "host": "db-primary.example.com",
      "port": 5432,
      "database": "app_db",
      "username": "app_user",
      "password": "secure_password_123",
      "pool": {
        "max": 20,
        "min": 5,
        "idle_timeout": 30000
      }
    },
    "replica": {
      "host": "db-replica.example.com",
      "port": 5432,
      "database": "app_db",
      "username": "app_user",
      "password": "secure_password_123"
    }
  },
  "cache": {
    "redis": {
      "host": "redis.example.com",
      "port": 6379,
      "password": "redis_password",
      "db": 0,
      "key_prefix": "app:"
    }
  },
  "security": {
    "jwt": {
      "secret": "jwt_super_secret_key_2024",
      "expires_in": "7d",
      "algorithm": "HS256"
    },
    "cors": {
      "origins": [
        "https://app.example.com",
        "https://admin.example.com"
      ],
      "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      "credentials": true
    }
  },
  "logging": {
    "level": "info",
    "transports": [
      {
        "type": "console",
        "format": "pretty"
      },
      {
        "type": "file",
        "filename": "logs/app.log",
        "max_size": "100MB",
        "max_files": "10"
      }
    ]
  }
}`)
    }
  }

  const toggleConversionDirection = () => {
    setConversionDirection(prev => 
      prev === 'yaml-to-json' ? 'json-to-yaml' : 'yaml-to-json'
    )
    // 交换输入和输出的值
    const temp = yamlInput
    setYamlInput(jsonOutput)
    setJsonOutput(temp)
  }

  return (
    <>
      {/* 工具头部 */}
      <section className="tool-header">
        <div className="container">
          <h1>YAML ⇄ JSON 转换器</h1>
          <p>在 YAML 和 JSON 格式之间快速转换，支持双向转换和多种格式化选项</p>
          <div style={{ marginTop: 16, display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/" className="btn btn-secondary">
              ← 返回首页
            </Link>
            <button onClick={handleExample} className="btn btn-secondary">
              加载示例
            </button>
            <button onClick={toggleConversionDirection} className="btn btn-primary">
              {conversionDirection === 'yaml-to-json' ? '切换为 JSON → YAML' : '切换为 YAML → JSON'}
            </button>
          </div>
        </div>
      </section>

      {/* 错误提示 */}
      {error && (
        <div className="container" style={{ marginBottom: 20 }}>
          <div style={{
            padding: '12px 16px',
            background: 'var(--error)',
            color: 'white',
            borderRadius: 'var(--radius)',
            fontSize: 14,
          }}>
            <strong>转换错误:</strong> {error}
          </div>
        </div>
      )}

      {/* 工具工作区 */}
      <div className="container">
        <div className="tool-workspace">
          {/* 左侧：输入区 */}
          <div className="tool-panel">
            <div className="tool-panel-header">
              <span>{conversionDirection === 'yaml-to-json' ? 'YAML 输入' : 'JSON 输入'}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => fileInputRef.current?.click()} className="btn btn-secondary" style={{ fontSize: 12 }}>
                  上传文件
                </button>
                <button onClick={handleClear} className="btn btn-secondary" style={{ fontSize: 12 }}>
                  清空
                </button>
              </div>
            </div>
            <div className="tool-panel-body">
              <textarea
                value={yamlInput}
                onChange={(e) => setYamlInput(e.target.value)}
                placeholder={conversionDirection === 'yaml-to-json' 
                  ? '在此输入或粘贴 YAML 内容...' 
                  : '在此输入或粘贴 JSON 内容...'}
                style={{
                  width: '100%',
                  height: '400px',
                  padding: '12px',
                  border: `1px solid ${error ? 'var(--error)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius)',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  resize: 'vertical',
                  background: 'var(--bg)',
                  color: 'var(--text)',
                }}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept={conversionDirection === 'yaml-to-json' ? '.yaml,.yml' : '.json'}
                style={{ display: 'none' }}
              />
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-dim)' }}>
                {conversionDirection === 'yaml-to-json' 
                  ? '支持 .yaml, .yml 格式文件' 
                  : '支持 .json 格式文件'}
              </div>
            </div>
          </div>

          {/* 右侧：输出区 */}
          <div className="tool-panel">
            <div className="tool-panel-header">
              <span>{conversionDirection === 'yaml-to-json' ? 'JSON 输出' : 'YAML 输出'}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleCopyOutput} className="btn btn-secondary" style={{ fontSize: 12 }}>
                  复制代码
                </button>
                <button onClick={handleDownloadOutput} className="btn btn-secondary" style={{ fontSize: 12 }}>
                  下载文件
                </button>
              </div>
            </div>
            <div className="tool-panel-body">
              <textarea
                ref={jsonOutputRef}
                value={jsonOutput}
                readOnly
                style={{
                  width: '100%',
                  height: '400px',
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  resize: 'vertical',
                  background: 'var(--bg)',
                  color: 'var(--text)',
                }}
              />
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-dim)' }}>
                共 {jsonOutput.length} 字符，{jsonOutput.split('\n').length} 行
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 设置面板 */}
      <div className="container" style={{ marginTop: 40 }}>
        <div className="tool-panel">
          <div className="tool-panel-header">
            <span>转换设置</span>
          </div>
          <div className="tool-panel-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  格式化选项
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="radio"
                      name="formatting"
                      value="pretty"
                      checked={formatting === 'pretty'}
                      onChange={(e) => setFormatting(e.target.value)}
                    />
                    <span>美化格式（带缩进）</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="radio"
                      name="formatting"
                      value="compact"
                      checked={formatting === 'compact'}
                      onChange={(e) => setFormatting(e.target.value)}
                    />
                    <span>紧凑格式（单行）</span>
                  </label>
                </div>

                <div style={{ marginTop: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                    转换选项
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="checkbox"
                        defaultChecked
                      />
                      <span>保留注释（YAML → JSON 时）</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="checkbox"
                        defaultChecked
                      />
                      <span>排序键名（按字母顺序）</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  文档统计
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, textAlign: 'center' }}>
                  <div className="card" style={{ padding: '12px 8px' }}>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{yamlInput.length}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>输入字符</div>
                  </div>
                  <div className="card" style={{ padding: '12px 8px' }}>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{jsonOutput.length}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>输出字符</div>
                  </div>
                  <div className="card" style={{ padding: '12px 8px' }}>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>
                      {conversionDirection === 'yaml-to-json' ? 'YAML→JSON' : 'JSON→YAML'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>转换方向</div>
                  </div>
                  <div className="card" style={{ padding: '12px 8px' }}>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{formatting}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>格式化</div>
                  </div>
                </div>

                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.6 }}>
                    <strong>提示：</strong>
                    {conversionDirection === 'yaml-to-json' 
                      ? 'YAML 更适合人类阅读和编辑，JSON 更适合机器处理和 API 通信。'
                      : 'JSON 更适合数据交换和存储，YAML 更适合配置文件和文档。'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <section className="seo-content">
        <div className="container">
          <h2>YAML 和 JSON 格式转换指南</h2>
          
          <h3>YAML 与 JSON 的区别</h3>
          <table>
            <thead>
              <tr>
                <th>特性</th>
                <th>YAML</th>
                <th>JSON</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>可读性</td>
                <td>✅ 优秀（人类友好）</td>
                <td>⚠️ 一般（机器友好）</td>
              </tr>
              <tr>
                <td>注释支持</td>
                <td>✅ 完整支持</td>
                <td>❌ 不支持</td>
              </tr>
              <tr>
                <td>数据类型</td>
                <td>✅ 丰富（日期、二进制等）</td>
                <td>⚠️ 基本（字符串、数字、布尔等）</td>
              </tr>
              <tr>
                <td>文件大小</td>
                <td>⚠️ 通常较大</td>
                <td>✅ 通常较小</td>
              </tr>
              <tr>
                <td>解析速度</td>
                <td>⚠️ 较慢</td>
                <td>✅ 较快</td>
              </tr>
              <tr>
                <td>主要用途</td>
                <td>配置文件、文档</td>
                <td>API 通信、数据存储</td>
              </tr>
            </tbody>
          </table>

          <h3>YAML 语法示例</h3>
          <pre><code>
{`# 基本结构
app:
  name: "My App"
  version: 1.0.0
  ports: [80, 443]

# 数组表示
features:
  - authentication
  - logging
  - caching

# 多行字符串
description: |
  This is a multi-line
  description that spans
  multiple lines.

# 锚点和引用
defaults: &defaults
  adapter: postgres
  host: localhost

development:
  <<: *defaults
  database: dev_db

test:
  <<: *defaults
  database: test_db`}
          </code></pre>

          <h3>JSON 语法示例</h3>
          <pre><code>
{`{
  "app": {
    "name": "My App",
    "version": "1.0.0",
    "ports": [80, 443]
  },
  "features": [
    "authentication",
    "logging",
    "caching"
  ],
  "description": "This is a multi-line\\ndescription that spans\\nmultiple lines.",
  "environments": {
    "development": {
      "adapter": "postgres",
      "host": "localhost",
      "database": "dev_db"
    },
    "test": {
      "adapter": "postgres",
      "host": "localhost",
      "database": "test_db"
    }
  }
}`}
          </code></pre>

          <h3>最佳实践</h3>
          <ol>
            <li><strong>选择合适的格式</strong>：
              <ul>
                <li>使用 <strong>YAML</strong> 用于配置文件、文档、CI/CD 管道</li>
                <li>使用 <strong>JSON</strong> 用于 API 响应、数据存储、前端配置</li>
              </ul>
            </li>
            <li><strong>保持一致性</strong>：在项目中统一使用一种格式，避免混用</li>
            <li><strong>验证格式</strong>：转换后使用验证工具检查格式正确性</li>
            <li><strong>版本控制</strong>：将配置文件纳入版本控制，跟踪变更历史</li>
            <li><strong>安全性</strong>：避免在配置文件中存储敏感信息（密码、密钥等）</li>
          </ol>

          <h3>常见问题</h3>
          <ul>
            <li><strong>Q: YAML 中的缩进重要吗？</strong><br/>
              A: 非常重要！YAML 使用缩进来表示结构层次，必须使用空格（通常2个或4个），不能使用制表符。</li>
            <li><strong>Q: JSON 能包含注释吗？</strong><br/>
              A: 标准 JSON 不支持注释。如果需要注释，可以考虑使用 JSONC（JSON with Comments）或添加专门的注释字段。</li>
            <li><strong>Q: 哪种格式性能更好？</strong><br/>
              A: JSON 的解析速度通常比 YAML 快，因为它的结构更简单。但对于配置文件，可读性往往比性能更重要。</li>
            <li><strong>Q: 如何选择转换方向？</strong><br/>
              A: 根据使用场景选择：需要人类编辑时用 YAML，需要机器处理时用 JSON。</li>
          </ul>
        </div>
      </section>
    </>
  )
}