import { useEffect, useRef } from 'react'

export default function TrailMap({ trailPoints, mapCenter, mapZoom }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    if (!window.L || !mapRef.current || mapInstanceRef.current) return
    const L = window.L

    const map = L.map(mapRef.current, {
      center: mapCenter || [28.0, 85.0],
      zoom: mapZoom || 9,
      zoomControl: true,
      scrollWheelZoom: false,
    })
    mapInstanceRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 17,
    }).addTo(map)

    if (!trailPoints || trailPoints.length === 0) return

    const latlngs = trailPoints.map(p => [p.lat, p.lng])

    L.polyline(latlngs, { color: '#C9A84C', weight: 2, opacity: 0.7 }).addTo(map)

    trailPoints.forEach((p, i) => {
      const isEnd = i === 0 || i === trailPoints.length - 1
      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:${isEnd ? 10 : 7}px;height:${isEnd ? 10 : 7}px;
          background:${isEnd ? '#C9A84C' : 'rgba(201,168,76,0.4)'};
          border:1.5px solid ${isEnd ? '#0E0E0E' : 'rgba(14,14,14,0.8)'};
          border-radius:50%;
          box-shadow:0 0 0 1px rgba(201,168,76,0.3);
        "></div>`,
        iconSize: [isEnd ? 10 : 7, isEnd ? 10 : 7],
        iconAnchor: [isEnd ? 5 : 3.5, isEnd ? 5 : 3.5],
      })

      L.marker([p.lat, p.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:Outfit,sans-serif;min-width:110px">
            <div style="font-weight:500;font-size:12px;color:#F2EDE4">${p.name}</div>
            <div style="font-size:10px;color:#A89880;margin-top:2px;font-family:'Courier Prime',monospace">${p.alt.toLocaleString()}m</div>
          </div>
        `)
    })

    map.fitBounds(L.latLngBounds(latlngs), { padding: [24, 24] })

    return () => { map.remove(); mapInstanceRef.current = null }
  }, [trailPoints, mapCenter, mapZoom])

  return (
    <div className="border overflow-hidden" style={{ borderColor: 'rgba(242,237,228,0.07)' }}>
      <div className="px-5 py-3 flex items-center justify-between border-b" style={{ background: '#1A1A1A', borderColor: 'rgba(242,237,228,0.05)' }}>
        <span className="label opacity-30">Trail Map</span>
        <span className="font-mono text-[9px] opacity-20">Click markers · Scroll to zoom</span>
      </div>
      <div ref={mapRef} style={{ height: 280 }} />
      {trailPoints && (
        <div className="px-5 py-3 flex flex-wrap gap-x-5 gap-y-1.5 border-t" style={{ background: '#1A1A1A', borderColor: 'rgba(242,237,228,0.05)' }}>
          {trailPoints.map((p, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: i === 0 || i === trailPoints.length - 1 ? 'var(--gold)' : 'rgba(201,168,76,0.35)' }} />
              <span className="font-mono text-[9px] opacity-30">{p.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
