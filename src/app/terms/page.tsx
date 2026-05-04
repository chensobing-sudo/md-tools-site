import Link from 'next/link'

export default function TermsPage() {
  return (
    <>
      <section className="tool-header">
        <div className="container">
          <h1>服务条款</h1>
          <p>MD Tools 服务条款 — 使用本网站即表示您同意以下条款</p>
          <div className="mt-4 flex gap-3 justify-center">
            <Link href="/" className="btn btn-secondary">← 返回首页</Link>
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className="max-w-3xl mx-auto prose prose-sm dark:prose-invert">
          <p className="text-muted-foreground">最后更新日期：2026年5月4日</p>

          <h2>1. 接受条款</h2>
          <p>
            欢迎使用 MD Tools（以下简称"本网站"）。通过访问或使用本网站，您同意受这些服务条款（以下简称"条款"）的约束。
            如果您不同意这些条款的任何部分，请勿使用本网站。
          </p>

          <h2>2. 服务描述</h2>
          <p>
            MD Tools 提供在线格式转换工具，包括但不限于 Markdown 转 Word、Markdown 转 PDF、
            Markdown 转 HTML、YAML 转 JSON、JSON 转 CSV、HTML 转 Markdown 等格式转换功能。
            所有转换过程均在用户浏览器本地完成，不上传至服务器。
          </p>

          <h2>3. 使用许可</h2>
          <p>在遵守这些条款的前提下，我们授予您有限的、非排他性的、不可转让的许可，允许您：</p>
          <ul>
            <li>出于个人或商业目的使用本网站的转换工具</li>
            <li>下载转换后的文档用于合法用途</li>
            <li>分享本网站的链接</li>
          </ul>

          <h2>4. 用户责任</h2>
          <p>您同意在使用本网站时：</p>
          <ul>
            <li>不违反任何适用法律或法规</li>
            <li>不上传或处理非法内容</li>
            <li>不试图干扰本网站的正常运行</li>
            <li>不滥用本网站的资源</li>
            <li>不将本网站用于任何非法或未经授权的目的</li>
          </ul>

          <h2>5. 知识产权</h2>
          <p>
            本网站及其原始内容、功能和特性均归 MD Tools 所有，受国际版权、商标和其他知识产权法律的保护。
            您转换生成的文档内容的知识产权归您所有。
          </p>

          <h2>6. 隐私保护</h2>
          <p>
            我们重视您的隐私。由于所有转换过程均在浏览器本地完成，我们不会收集、存储或处理您的文档内容。
            有关我们如何收集和使用信息的详细信息，请参阅我们的
            <Link href="/privacy" className="text-primary hover:underline"> 隐私政策</Link>。
          </p>

          <h2>7. 免责声明</h2>
          <p>
            本网站按"现状"提供，不作任何明示或暗示的保证。我们不对以下情况承担责任：
          </p>
          <ul>
            <li>转换结果的准确性和完整性</li>
            <li>服务中断或错误</li>
            <li>因使用本网站而产生的任何直接或间接损失</li>
          </ul>

          <h2>8. 服务变更</h2>
          <p>
            我们保留随时修改、暂停或终止本网站任何部分的权利，恕不另行通知。
            我们不对您或任何第三方因服务变更造成的损失承担责任。
          </p>

          <h2>9. 条款更新</h2>
          <p>
            我们可能会不时更新这些条款。更新后的条款将在本页面发布，并注明最后更新日期。
            继续使用本网站即表示您接受更新后的条款。
          </p>

          <h2>10. 联系我们</h2>
          <p>
            如果您对这些条款有任何疑问，请通过以下方式联系我们：
            <br />
            邮箱：<a href="mailto:plmm365@gmail.com" className="text-primary hover:underline">plmm365@gmail.com</a>
          </p>
        </div>
      </div>
    </>
  )
}
