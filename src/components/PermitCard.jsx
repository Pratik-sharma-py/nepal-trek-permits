import { MapPin, ExternalLink } from 'lucide-react'

function formatFee(fee, isSaarc) {
  if (fee === 'varies') return 'Varies'
  if (typeof fee === 'string') return fee
  const amount = isSaarc ? fee.saarc : fee.other
  if (typeof amount === 'string') return amount
  return `Rs. ${amount.toLocaleString()}`
}

export default function PermitCard({ permit, isSaarc, type }) {
  const isRequired = type === 'required'
  const feeDisplay = formatFee(permit.fee, isSaarc)

  return (
    <div
      className="permit-card relative p-5 border transition-all"
      style={{
        background: '#1A1A1A',
        borderColor: isRequired ? 'rgba(242,237,228,0.08)' : 'rgba(242,237,228,0.04)',
        borderRadius: 0,
      }}
    >
      {/* Left accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px"
        style={{ background: isRequired ? 'var(--gold)' : 'rgba(242,237,228,0.1)' }}
      />

      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="font-mono text-[9px] tracking-widest uppercase"
              style={{ color: isRequired ? 'var(--sage-light)' : 'rgba(242,237,228,0.3)' }}
            >
              {isRequired ? '● Required' : '○ Recommended'}
            </span>
          </div>
          {/* Name */}
          <div className="font-body font-medium text-sm leading-snug" style={{ color: 'rgba(242,237,228,0.9)' }}>
            {permit.fullName || permit.name}
          </div>
        </div>

        {/* Fee */}
        <div className="shrink-0 text-right">
          <div
            className="permit-fee font-display text-xl font-light whitespace-nowrap"
            style={{ color: isRequired ? 'var(--gold)' : 'rgba(242,237,228,0.4)' }}
          >
            {feeDisplay}
          </div>
        </div>
      </div>

      {/* Where */}
      <div className="flex items-center gap-2 mb-1">
        <MapPin size={10} style={{ color: 'rgba(242,237,228,0.2)' }} className="shrink-0" />
        <span className="font-mono text-[10px] opacity-40">
          {permit.where}
          {permit.buyOnline && <ExternalLink size={9} className="inline ml-1 opacity-60" />}
        </span>
      </div>

      {/* Note */}
      {permit.note && (
        <div className="mt-2 pt-2 font-body text-[11px] leading-relaxed opacity-35 border-t"
          style={{ borderColor: 'rgba(242,237,228,0.05)' }}>
          {permit.note}
        </div>
      )}
    </div>
  )
}
