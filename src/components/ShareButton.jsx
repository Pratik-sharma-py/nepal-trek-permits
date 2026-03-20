import { useState } from 'react'
import { Link2, Check } from 'lucide-react'

export default function ShareButton() {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try { await navigator.clipboard.writeText(window.location.href) }
    catch { prompt('Copy this link:', window.location.href) }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleShare}
      className="share-button no-print inline-flex items-center gap-2.5 font-mono text-[10px] tracking-widest uppercase transition-colors px-5 py-3 border"
      style={{
        borderColor: 'rgba(242,237,228,0.12)',
        color: copied ? 'var(--sage-light)' : 'rgba(242,237,228,0.4)',
        background: 'transparent',
      }}
    >
      {copied ? <Check size={11} /> : <Link2 size={11} />}
      {copied ? 'Copied' : 'Share'}
    </button>
  )
}
