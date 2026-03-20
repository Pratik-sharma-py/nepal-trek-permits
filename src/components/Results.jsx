import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Printer, ArrowLeft, AlertTriangle } from 'lucide-react'
import permitsData from '../data/permits.json'
import trekDetails from '../data/trekDetails.json'
import PermitCard from './PermitCard.jsx'
import ShareButton from './ShareButton.jsx'
import AltitudeChart from './AltitudeChart.jsx'
import WeatherWidget from './WeatherWidget.jsx'
import Itinerary from './Itinerary.jsx'
import TrailMap from './TrailMap.jsx'

function calcTotal(permits, isSaarc) {
  let total = 0
  permits.forEach(p => {
    if (p.currency === 'NPR') {
      const amount = isSaarc ? p.fee.saarc : p.fee.other
      if (typeof amount === 'number') total += amount
    }
  })
  return total
}

const DURATION_LABELS = {
  '7': 'Up to 7 days',
  '14': '8–14 days',
  '15plus': '15+ days',
}

const TABS = ['Permits', 'Map', 'Weather', 'Itinerary']

export default function Results({ trek, nat, days }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Permits')
  const [leafletReady, setLeafletReady] = useState(false)

  const trekData = permitsData.treks[trek]
  const details = trekDetails[trek]
  const isSaarc = nat === 'saarc'

  useEffect(() => {
    if (window.L) { setLeafletReady(true); return }
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => setLeafletReady(true)
    document.head.appendChild(script)
  }, [])

  if (!trekData) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="text-center">
          <p className="font-body text-sm opacity-40 mb-4">Trek not found.</p>
          <button onClick={() => navigate('/')} className="label" style={{ color: 'var(--gold)' }}>Back to home</button>
        </div>
      </div>
    )
  }

  const required = trekData.permits.required
  const recommended = trekData.permits.recommended
  const total = calcTotal(required, isSaarc)
  const natLabel = isSaarc ? 'SAARC national' : 'Non-SAARC national'
  const daysLabel = DURATION_LABELS[days] || `${days} days`
  const hasUsdPermits = required.some(p => p.currency === 'USD')

  return (
    <div className="min-h-screen bg-ink text-cream">

      {/* Top bar */}
      <div className="no-print sticky top-0 z-20 border-b px-6 sm:px-12 py-5 flex items-center justify-between"
        style={{ borderColor: 'rgba(242,237,228,0.06)', background: 'rgba(14,14,14,0.95)', backdropFilter: 'blur(12px)' }}>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 label transition-colors hover:opacity-100"
          style={{ color: 'var(--cream-muted)' }}
        >
          <ArrowLeft size={12} />
          Change trek
        </button>
        <div className="label opacity-20 hidden sm:block">{trekData.name}</div>
        <div className="label opacity-0 pointer-events-none">placeholder</div>
      </div>

      <div className="max-w-3xl mx-auto px-6 sm:px-12">

        {/* Print header */}
        <div className="print-header hidden">{`Nepal Permits — ${trekData.name}`}</div>
        <div className="print-subheader hidden">{`${natLabel} · ${daysLabel}`}</div>

        {/* Page header */}
        <div className="no-print pt-12 pb-8 border-b" style={{ borderColor: 'rgba(242,237,228,0.06)' }}>
          <div className="flex items-center gap-3 mb-5">
            <span className="gold-line" />
            <span className="label opacity-40">Permit Checklist</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-light leading-tight mb-3">
            {trekData.name}
          </h1>
          <p className="font-mono text-[11px] opacity-35 tracking-widest uppercase">
            {natLabel} · {daysLabel}
          </p>
        </div>

        {/* Restricted warning */}
        {trekData.restricted && (
          <div className="no-print mt-6 p-4 border flex items-start gap-3"
            style={{ borderColor: 'rgba(196,98,45,0.3)', background: 'rgba(196,98,45,0.06)' }}>
            <AlertTriangle size={14} className="shrink-0 mt-0.5" style={{ color: 'var(--ember)' }} />
            <div>
              <div className="font-body font-medium text-sm mb-0.5" style={{ color: 'var(--ember)' }}>Restricted Area</div>
              <p className="font-body text-xs opacity-50 leading-relaxed">
                Licensed guide mandatory. Solo trekking not permitted. Arrange permits at Nepal Immigration, Kathmandu.
              </p>
            </div>
          </div>
        )}

        {/* Tab bar */}
        <div className="no-print flex gap-0 mt-8 border-b" style={{ borderColor: 'rgba(242,237,228,0.06)' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="font-mono text-[10px] tracking-widest uppercase px-5 py-3 transition-all duration-200 border-b-[1px] -mb-px"
              style={{
                color: activeTab === tab ? 'var(--cream)' : 'rgba(242,237,228,0.3)',
                borderBottomColor: activeTab === tab ? 'var(--gold)' : 'transparent',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="py-8">

          {/* ── PERMITS ── */}
          {activeTab === 'Permits' && (
            <div>
              {/* Required */}
              <div className="label opacity-30 mb-4">Required Permits</div>
              <div className="flex flex-col gap-2 mb-8">
                {required.map(permit => (
                  <PermitCard key={permit.id} permit={permit} isSaarc={isSaarc} type="required" />
                ))}
              </div>

              {/* Total */}
              <div className="flex items-end justify-between py-5 border-t border-b mb-8"
                style={{ borderColor: 'rgba(242,237,228,0.08)' }}>
                <div>
                  <div className="label opacity-30 mb-1">Estimated Total (NPR)</div>
                  {hasUsdPermits && (
                    <div className="font-mono text-[10px] opacity-25">NPR permits only · USD fees listed above</div>
                  )}
                </div>
                <div className="font-display text-4xl font-light" style={{ color: 'var(--gold)' }}>
                  Rs. {total.toLocaleString()}
                </div>
              </div>

              {/* Recommended */}
              {recommended.length > 0 && (
                <div className="mb-8">
                  <div className="label opacity-30 mb-4">Recommended</div>
                  <div className="flex flex-col gap-2">
                    {recommended.map(permit => (
                      <PermitCard key={permit.id} permit={permit} isSaarc={isSaarc} type="recommended" />
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="no-print flex items-center gap-3 mb-8">
                <button
                  onClick={() => window.print()}
                  className="print-button inline-flex items-center gap-2.5 font-mono text-[10px] tracking-widest uppercase transition-colors px-5 py-3 border"
                  style={{ borderColor: 'rgba(242,237,228,0.12)', color: 'rgba(242,237,228,0.4)', background: 'transparent' }}
                >
                  <Printer size={11} />
                  Print
                </button>
                <ShareButton />
              </div>

              <div className="disclaimer font-mono text-[10px] opacity-20 leading-relaxed pt-6 border-t"
                style={{ borderColor: 'rgba(242,237,228,0.05)' }}>
                Fees updated for 2026. Verify at issuing office before departure. Not affiliated with Nepal government.
              </div>
            </div>
          )}

          {/* ── MAP ── */}
          {activeTab === 'Map' && (
            <div className="space-y-4">
              {leafletReady && details?.trailPoints ? (
                <TrailMap trailPoints={details.trailPoints} mapCenter={details.mapCenter} mapZoom={details.mapZoom} />
              ) : (
                <div className="flex items-center justify-center h-48 border" style={{ borderColor: 'rgba(242,237,228,0.06)' }}>
                  <span className="label opacity-30 animate-pulse">Loading map…</span>
                </div>
              )}
              {details?.altitudeProfile && <AltitudeChart profile={details.altitudeProfile} />}
              <p className="font-mono text-[10px] opacity-20 leading-relaxed pt-2">
                Trail waypoints are approximate. Use Maps.me or Gaia GPS for offline navigation on the trail.
              </p>
            </div>
          )}

          {/* ── WEATHER ── */}
          {activeTab === 'Weather' && (
            <div className="space-y-4">
              {details ? (
                <>
                  <WeatherWidget lat={details.weatherLat} lon={details.weatherLon} cityName={details.weatherCity} />
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {[
                      { season: 'Spring', months: 'Mar – May', desc: 'Best weather. Clear skies, wildflowers.', good: true },
                      { season: 'Autumn', months: 'Oct – Nov', desc: 'Crisp air. Excellent visibility.', good: true },
                      { season: 'Winter', months: 'Dec – Feb', desc: 'Cold. High passes may close.', good: false },
                      { season: 'Monsoon', months: 'Jun – Sep', desc: 'Heavy rain. Not recommended.', good: false },
                    ].map(s => (
                      <div key={s.season} className="p-4 border"
                        style={{
                          borderColor: s.good ? 'rgba(74,124,111,0.3)' : 'rgba(242,237,228,0.05)',
                          background: s.good ? 'rgba(74,124,111,0.05)' : 'rgba(255,255,255,0.01)',
                        }}>
                        <div className="font-body font-medium text-sm mb-0.5"
                          style={{ color: s.good ? 'var(--sage-light)' : 'rgba(242,237,228,0.4)' }}>
                          {s.season}
                        </div>
                        <div className="font-mono text-[10px] opacity-30 mb-1">{s.months}</div>
                        <div className="font-body text-xs opacity-40 leading-relaxed">{s.desc}</div>
                      </div>
                    ))}
                  </div>
                  <p className="font-mono text-[10px] opacity-20">
                    Live data from Open-Meteo · Nearest weather station · Mountain conditions vary rapidly
                  </p>
                </>
              ) : (
                <div className="label opacity-30 py-8 text-center">No weather data available.</div>
              )}
            </div>
          )}

          {/* ── ITINERARY ── */}
          {activeTab === 'Itinerary' && (
            <div>
              {details?.itinerary
                ? <Itinerary itinerary={details.itinerary} trekName={trekData.name} />
                : <div className="label opacity-30 py-8 text-center">Itinerary not available.</div>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
