export default function AdUnit({ slot, format = 'auto', className = '' }: { slot: string; format?: string; className?: string }) {
  return (
    <div className={`ad-container ${className}`}>
      <div>
        <div className="ad-label">广告</div>
        {/* Google AdSense 广告位 - 替换为您的广告单元 ID */}
        {/* <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot={slot}
             data-ad-format={format}
             data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script> */}
        <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 8 }}>
          广告位 ID: {slot}
        </p>
      </div>
    </div>
  )
}
