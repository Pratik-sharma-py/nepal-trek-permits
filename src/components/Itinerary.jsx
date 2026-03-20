import { useState } from 'react'
import { ChevronDown, ChevronUp, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const AMS_GUIDE = [
  {
    level: 'mild', title: 'Mild AMS',
    symptoms: ['Headache', 'Fatigue', 'Nausea', 'Dizziness', 'Loss of appetite'],
    action: 'Stop ascending. Rest. Hydrate. Take ibuprofen for headache. Do not go higher until fully resolved.',
    color: '#C9A84C',
  },
  {
    level: 'moderate', title: 'Moderate AMS',
    symptoms: ['Severe headache (not relieved by pills)', 'Vomiting', 'Extreme fatigue', 'Breathlessness at rest'],
    action: 'DESCEND IMMEDIATELY by 300–500m minimum. Do not sleep at current altitude. Use supplemental oxygen if available.',
    color: '#C4622D',
  },
  {
    level: 'severe', title: 'Severe AMS / HACE / HAPE',
    symptoms: ['Confusion or altered mental state', 'Cannot walk straight', 'Wet cough / pink frothy sputum', 'Blue lips or fingernails'],
    action: '⚠ MEDICAL EMERGENCY. Descend immediately, even at night. Call helicopter rescue. Administer Dexamethasone 8mg if available.',
    color: '#EF4444',
  },
]

function getTrend(cur, prev) {
  if (!prev) return null
  const d = cur.altitude - prev.altitude
  if (d > 200) return 'up'
  if (d < -200) return 'down'
  return 'flat'
}

function altColor(alt) {
  if (alt >= 5000) return '#C4622D'
  if (alt >= 4500) return '#C9A84C'
  if (alt >= 3500) return '#A89880'
  return '#4A7C6F'
}

export default function Itinerary({ itinerary, trekName }) {
  const [expanded, setExpanded] = useState(null)
  const [activeAms, setActiveAms] = useState(null)
  if (!itinerary || itinerary.length === 0) return null

  const maxAlt = Math.max(...itinerary.map(d => d.altitude))
  const minAlt = Math.min(...itinerary.map(d => d.altitude))
  const border = { borderColor: 'rgba(242,237,228,0.06)' }

  return (
    <div className="space-y-px">
      {/* Itinerary list */}
      <div className="border" style={{ background: '#1A1A1A', borderColor: 'rgba(242,237,228,0.07)' }}>
        <div className="px-5 py-3 border-b flex items-center justify-between" style={border}>
          <span className="label opacity-30">Day by Day</span>
          <span className="font-mono text-[9px] opacity-20">{itinerary.length} days</span>
        </div>

        {itinerary.map((day, i) => {
          const isOpen = expanded === i
          const trend = getTrend(day, itinerary[i - 1])
          const isAcclimatize = /acclimatize|rest/i.test(day.title)
          const isHighest = day.altitude === maxAlt
          const altPct = ((day.altitude - minAlt) / (maxAlt - minAlt)) * 100

          return (
            <div key={i} className="border-b last:border-b-0" style={border}>
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="w-full text-left px-5 py-4 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-4">
                  {/* Day number */}
                  <div className="shrink-0 font-mono text-[11px] w-6 text-right"
                    style={{ color: isHighest ? 'var(--gold)' : 'rgba(242,237,228,0.2)' }}>
                    {day.day}
                  </div>

                  {/* Alt bar */}
                  <div className="shrink-0 w-16 h-0.5 rounded-full" style={{ background: 'rgba(242,237,228,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${altPct}%`, background: altColor(day.altitude) }} />
                  </div>

                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <div className="font-body text-sm leading-snug truncate"
                      style={{ color: isOpen ? 'var(--cream)' : 'rgba(242,237,228,0.65)' }}>
                      {day.title}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="font-mono text-[9px]" style={{ color: altColor(day.altitude) }}>
                        {day.altitude.toLocaleString()}m
                      </span>
                      {trend === 'up' && <TrendingUp size={9} style={{ color: 'var(--ember)' }} />}
                      {trend === 'down' && <TrendingDown size={9} style={{ color: 'var(--sage)' }} />}
                      {trend === 'flat' && <Minus size={9} className="opacity-20" />}
                      {day.duration && <span className="font-mono text-[9px] opacity-20">{day.duration}</span>}
                    </div>
                  </div>

                  {/* Chevron */}
                  <div className="shrink-0 opacity-20">
                    {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </div>
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-4 pt-1 border-t" style={{ borderColor: 'rgba(242,237,228,0.04)', background: 'rgba(242,237,228,0.01)' }}>
                  <p className="font-body text-xs leading-relaxed opacity-45">{day.description}</p>
                  {isAcclimatize && (
                    <div className="mt-3 flex items-center gap-2 text-[11px] px-3 py-2 border"
                      style={{ color: 'var(--gold)', borderColor: 'rgba(201,168,76,0.2)', background: 'rgba(201,168,76,0.04)' }}>
                      <AlertTriangle size={11} className="shrink-0" />
                      Do not skip this day. AMS risk increases above 3,500m.
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* AMS Checker */}
      <div className="border mt-4" style={{ background: '#1A1A1A', borderColor: 'rgba(242,237,228,0.07)' }}>
        <div className="px-5 py-3 border-b" style={border}>
          <div className="label opacity-30">AMS Symptom Checker</div>
          <div className="font-mono text-[9px] opacity-20 mt-0.5">{trekName}</div>
        </div>

        <div className="p-4 space-y-2">
          {AMS_GUIDE.map(g => (
            <div key={g.level}>
              <button
                onClick={() => setActiveAms(activeAms === g.level ? null : g.level)}
                className="w-full text-left px-4 py-3 border flex items-center justify-between transition-all"
                style={{
                  borderColor: activeAms === g.level ? `${g.color}40` : 'rgba(242,237,228,0.06)',
                  background: activeAms === g.level ? `${g.color}08` : 'transparent',
                }}
              >
                <div>
                  <div className="font-body text-sm font-medium" style={{ color: g.color }}>{g.title}</div>
                  <div className="font-mono text-[9px] opacity-30 mt-0.5">
                    {g.symptoms.slice(0, 2).join(' · ')}…
                  </div>
                </div>
                {activeAms === g.level ? <ChevronUp size={11} style={{ color: g.color }} /> : <ChevronDown size={11} className="opacity-20" />}
              </button>

              {activeAms === g.level && (
                <div className="px-4 pb-4 pt-3 border border-t-0"
                  style={{ borderColor: `${g.color}30`, background: `${g.color}05` }}>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {g.symptoms.map(s => (
                      <span key={s} className="font-mono text-[9px] px-2 py-1 border"
                        style={{ borderColor: `${g.color}30`, color: g.color }}>
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="font-body text-xs leading-relaxed" style={{ color: `${g.color}CC` }}>{g.action}</p>
                </div>
              )}
            </div>
          ))}

          <div className="font-mono text-[9px] opacity-20 pt-2 leading-relaxed">
            Nepal rescue: +977-1-4111078 · CIWEC Clinic Kathmandu: +977-1-4424111
          </div>
        </div>
      </div>
    </div>
  )
}
