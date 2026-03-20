import { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, CloudLightning } from 'lucide-react'

const WMO = {
  0: { label: 'Clear', Icon: Sun }, 1: { label: 'Clear', Icon: Sun }, 2: { label: 'Partly cloudy', Icon: Cloud },
  3: { label: 'Overcast', Icon: Cloud }, 45: { label: 'Fog', Icon: Cloud }, 48: { label: 'Fog', Icon: Cloud },
  51: { label: 'Drizzle', Icon: CloudRain }, 53: { label: 'Drizzle', Icon: CloudRain }, 55: { label: 'Drizzle', Icon: CloudRain },
  61: { label: 'Rain', Icon: CloudRain }, 63: { label: 'Rain', Icon: CloudRain }, 65: { label: 'Heavy rain', Icon: CloudRain },
  71: { label: 'Snow', Icon: CloudSnow }, 73: { label: 'Snow', Icon: CloudSnow }, 75: { label: 'Heavy snow', Icon: CloudSnow },
  80: { label: 'Showers', Icon: CloudRain }, 81: { label: 'Showers', Icon: CloudRain }, 82: { label: 'Showers', Icon: CloudRain },
  85: { label: 'Snow showers', Icon: CloudSnow }, 86: { label: 'Snow showers', Icon: CloudSnow },
  95: { label: 'Thunderstorm', Icon: CloudLightning }, 96: { label: 'Thunderstorm', Icon: CloudLightning },
}
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function WeatherWidget({ lat, lon, cityName }) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!lat || !lon) return
    setLoading(true)
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FKathmandu&forecast_days=7`)
      .then(r => r.json())
      .then(d => { setWeather(d); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [lat, lon])

  const border = { borderColor: 'rgba(242,237,228,0.07)' }

  if (loading) return (
    <div className="p-5 border animate-pulse" style={{ background: '#1A1A1A', ...border }}>
      <div className="label opacity-20 mb-4">Loading weather…</div>
      <div className="flex gap-2">{[...Array(7)].map((_, i) => <div key={i} className="w-12 h-16 rounded" style={{ background: 'rgba(242,237,228,0.04)' }} />)}</div>
    </div>
  )

  if (error) return (
    <div className="p-5 border" style={{ background: '#1A1A1A', ...border }}>
      <span className="label opacity-20">Weather unavailable</span>
    </div>
  )

  const cur = weather.current
  const daily = weather.daily
  const curInfo = WMO[cur.weather_code] || WMO[0]
  const CurIcon = curInfo.Icon

  return (
    <div className="p-5 border" style={{ background: '#1A1A1A', ...border }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="label opacity-30 mb-1">Weather near {cityName}</div>
          <div className="font-body text-xs opacity-25">Live · Open-Meteo</div>
        </div>
        <div className="text-right flex items-center gap-3">
          <CurIcon size={16} style={{ color: 'rgba(242,237,228,0.3)' }} />
          <div>
            <div className="font-display text-3xl font-light" style={{ color: 'var(--cream)' }}>
              {Math.round(cur.temperature_2m)}°
            </div>
            <div className="font-mono text-[10px] opacity-25">{curInfo.label}</div>
          </div>
        </div>
      </div>

      {/* Current stats */}
      <div className="flex gap-5 pb-4 mb-4 border-b" style={{ borderColor: 'rgba(242,237,228,0.05)' }}>
        {[
          { Icon: Wind, val: `${Math.round(cur.wind_speed_10m)} km/h` },
          { Icon: Droplets, val: `${cur.relative_humidity_2m}%` },
        ].map(({ Icon, val }) => (
          <div key={val} className="flex items-center gap-2 font-mono text-[10px] opacity-30">
            <Icon size={11} />
            {val}
          </div>
        ))}
      </div>

      {/* 7-day */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {daily.time.map((date, i) => {
          const d = new Date(date)
          const info = WMO[daily.weather_code[i]] || WMO[0]
          const DayIcon = info.Icon
          const precip = daily.precipitation_probability_max[i]
          const isToday = i === 0
          return (
            <div key={date}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 px-3 py-2.5 min-w-[52px]"
              style={{
                background: isToday ? 'rgba(201,168,76,0.06)' : 'rgba(242,237,228,0.02)',
                border: `1px solid ${isToday ? 'rgba(201,168,76,0.2)' : 'rgba(242,237,228,0.04)'}`,
              }}
            >
              <span className="font-mono text-[9px]" style={{ color: isToday ? 'var(--gold)' : 'rgba(242,237,228,0.25)' }}>
                {isToday ? 'Now' : DAYS[d.getDay()]}
              </span>
              <DayIcon size={13} style={{ color: isToday ? 'var(--gold)' : 'rgba(242,237,228,0.25)' }} />
              <span className="font-body text-xs font-medium" style={{ color: 'rgba(242,237,228,0.7)' }}>
                {Math.round(daily.temperature_2m_max[i])}°
              </span>
              <span className="font-mono text-[9px] opacity-25">
                {Math.round(daily.temperature_2m_min[i])}°
              </span>
              {precip > 20 && (
                <span className="font-mono text-[8px]" style={{ color: 'rgba(74,124,111,0.7)' }}>{precip}%</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
