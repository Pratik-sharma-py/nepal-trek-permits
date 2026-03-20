import { useState } from 'react'

export default function AltitudeChart({ profile }) {
  const [hovered, setHovered] = useState(null)
  if (!profile || profile.length === 0) return null

  const maxAlt = Math.max(...profile.map(p => p.altitude)) + 200
  const minAlt = Math.min(...profile.map(p => p.altitude)) - 100
  const range = maxAlt - minAlt

  const W = 600, H = 200
  const PAD = { top: 16, right: 16, bottom: 36, left: 50 }
  const cW = W - PAD.left - PAD.right
  const cH = H - PAD.top - PAD.bottom
  const xStep = cW / (profile.length - 1)

  const x = i => PAD.left + i * xStep
  const y = alt => PAD.top + cH - ((alt - minAlt) / range) * cH

  const linePath = profile.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p.altitude).toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L ${x(profile.length - 1)} ${H - PAD.bottom} L ${x(0)} ${H - PAD.bottom} Z`

  const tickStep = range > 3000 ? 1000 : 500
  const startTick = Math.ceil(minAlt / tickStep) * tickStep
  const ticks = []
  for (let a = startTick; a <= maxAlt; a += tickStep) ticks.push(a)

  function altColor(alt) {
    if (alt >= 5000) return '#C4622D'
    if (alt >= 4500) return '#C9A84C'
    if (alt >= 3500) return '#A89880'
    return '#4A7C6F'
  }

  return (
    <div className="p-5 border" style={{ background: '#1A1A1A', borderColor: 'rgba(242,237,228,0.07)' }}>
      <div className="flex items-center justify-between mb-4">
        <span className="label opacity-30">Altitude Profile</span>
        {hovered !== null && (
          <span className="font-mono text-[10px]" style={{ color: altColor(profile[hovered].altitude) }}>
            {profile[hovered].place} · {profile[hovered].altitude.toLocaleString()}m
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 280 }} onMouseLeave={() => setHovered(null)}>
          {/* Grid lines */}
          {ticks.map(a => (
            <g key={a}>
              <line x1={PAD.left} y1={y(a)} x2={PAD.left + cW} y2={y(a)} stroke="rgba(242,237,228,0.04)" strokeWidth={1} />
              <text x={PAD.left - 6} y={y(a) + 4} textAnchor="end" fontSize={8} fill="rgba(242,237,228,0.2)" fontFamily="Courier Prime, monospace">
                {a >= 1000 ? `${(a / 1000).toFixed(1)}k` : a}
              </text>
            </g>
          ))}

          {/* Area */}
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#areaGrad)" />
          <path d={linePath} fill="none" stroke="rgba(201,168,76,0.5)" strokeWidth={1.5} strokeLinejoin="round" />

          {/* Points */}
          {profile.map((p, i) => {
            const isHov = hovered === i
            return (
              <g key={i}>
                <rect x={x(i) - xStep / 2} y={PAD.top} width={xStep} height={cH} fill="transparent" onMouseEnter={() => setHovered(i)} />
                {isHov && <line x1={x(i)} y1={PAD.top} x2={x(i)} y2={H - PAD.bottom} stroke="rgba(201,168,76,0.2)" strokeWidth={1} />}
                <circle cx={x(i)} cy={y(p.altitude)} r={isHov ? 4 : 2.5} fill={altColor(p.altitude)} stroke="#0E0E0E" strokeWidth={1.5} />
                <text x={x(i)} y={H - PAD.bottom + 12} textAnchor="middle" fontSize={7.5} fill={isHov ? 'rgba(242,237,228,0.6)' : 'rgba(242,237,228,0.2)'} fontFamily="Courier Prime, monospace">
                  {p.day}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3">
        {[
          { color: '#4A7C6F', label: 'Low risk' },
          { color: '#A89880', label: 'Acclimatize' },
          { color: '#C9A84C', label: 'High altitude' },
          { color: '#C4622D', label: 'AMS risk' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
            <span className="font-mono text-[9px] opacity-30">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
