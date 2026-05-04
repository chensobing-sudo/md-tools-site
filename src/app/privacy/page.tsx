import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <>
      <section className="tool-header">
        <div className="container">
          <h1>隐私政策</h1>
          <p>MD Tools 隐私政策 — 我们如何保护您的隐私和数据安全</p>
          <div className="mt-4 flex gap-3 justify-center">
            <Link href="/" className="btn btn-secondary">← 返回首页</Link>
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className="max-w-3xl mx-auto prose prose-sm dark:prose-invert">
          <p className="text-muted-foreground">最后更新日期：2026年5月4日</p>

          <h2>概述</h2>
          <p>
            MD Tools（以下简称"我们"）致力于保护您的隐私。本隐私政策说明了我们如何收集、使用和保护您的信息。
            使用本网站即表示您同意本隐私政策中描述的做法。
          </p>

          <h2>我们收集的信息</h2>

          <h3>我们不收集的信息</h3>
          <p>
            <strong>最重要的是：我们不会收集、存储或处理您转换的文档内容。</strong>
            所有格式转换过程均在您的浏览器本地完成，文档内容不会上传到我们的服务器。
            这意味着：
          </p>
          <ul>
            <li>您的文档内容始终保留在您的设备上</li>
            <li>我们无法访问您转换的文件</li>
            <li>您的敏感信息不会通过我们的服务器传输</li>
          </ul>

          <h3>我们可能收集的信息</h3>
          <p>为了改善服务体验，我们可能收集以下匿名信息：</p>
          <ul>
            <li><strong>使用数据</strong>：页面访问次数、使用的工具类型（不包含具体内容）</li>
            <li><strong>设备信息</strong>：浏览器类型、操作系统、屏幕分辨率</li>
            <li><strong>Cookie</strong>：用于记住您的主题偏好（亮色/暗色模式）</li>
          </ul>

          <h2>我们如何使用信息</h2>
          <p>我们收集的有限信息仅用于：</p>
          <ul>
            <li>改善网站功能和用户体验</li>
            <li>分析使用趋势以优化工具性能</li>
            <li>记住您的偏好设置（如主题模式）</li>
          </ul>

          <h2>Cookie 政策</h2>
          <p>
            我们使用必要的 Cookie 来记住您的主题偏好（亮色/暗色模式）。
            这些 Cookie 不会用于跟踪您的浏览活动或收集个人信息。
            您可以在浏览器设置中管理或删除 Cookie。
          </p>

          <h2>数据安全</h2>
          <p>
            由于您的文档内容不会上传到我们的服务器，数据安全风险已降至最低。
            我们采用行业标准的安全措施保护网站本身的安全，包括：
          </p>
          <ul>
            <li>HTTPS 加密传输</li>
            <li>定期安全更新和维护</li>
            <li>最小权限原则</li>
          </ul>

          <h2>第三方服务</h2>
          <p>
            本网站可能使用以下第三方服务，它们都有各自的隐私政策：
          </p>
          <ul>
            <li><strong>Vercel</strong>：网站托管服务</li>
            <li><strong>GitHub</strong>：代码托管和版本控制</li>
          </ul>
          <p>
            这些第三方服务可能会收集标准的网络日志信息（如 IP 地址、浏览器类型等），
            但我们不会与它们共享您的文档内容或个人身份信息。
          </p>

          <h2>儿童隐私</h2>
          <p>
            本网站不面向13岁以下的儿童。我们不会故意收集儿童的个人信息。
            如果您发现儿童向我们提供了个人信息，请立即联系我们，我们将删除相关信息。
          </p>

          <h2>隐私政策更新</h2>
          <p>
            我们可能会不时更新本隐私政策。更新后的政策将在本页面发布，并注明最后更新日期。
            建议您定期查看本页面以了解任何变更。
          </p>

          <h2>您的权利</h2>
          <p>根据适用的隐私法律，您可能拥有以下权利：</p>
          <ul>
            <li>了解我们收集了哪些关于您的信息</li>
            <li>要求删除您的个人信息</li>
            <li>反对或限制某些数据处理</li>
            <li>数据可携带性</li>
          </ul>
          <p>
            由于我们收集的信息非常有限，这些权利主要涉及我们可能存储的匿名使用数据。
            如需行使这些权利，请通过以下方式联系我们。
          </p>

          <h2>联系我们</h2>
          <p>
            如果您对本隐私政策有任何疑问或顾虑，请通过以下方式联系我们：
            <br />
            邮箱：<a href="mailto:plmm365@gmail.com" className="text-primary hover:underline">plmm365@gmail.com</a>
          </p>
        </div>
      </div>
    </>
  )
}
