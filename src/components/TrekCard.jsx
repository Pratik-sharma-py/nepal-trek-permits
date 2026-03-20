export default function TrekCard({ trek, trekKey, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(trekKey)}
      className={`group relative text-left w-full p-5 border transition-all duration-200 focus:outline-none
        ${selected
          ? 'border-gold bg-cream-faint'
          : 'border-cream/8 bg-ink-50 hover:border-cream/20'
        }`}
      style={{
        borderColor: selected ? 'var(--gold)' : 'rgba(242,237,228,0.08)',
        background: selected ? 'rgba(201,168,76,0.06)' : '#1A1A1A',
      }}
    >
      {/* Restricted badge */}
      {trek.restricted && (
        <div className="absolute top-3 right-3 label text-ember" style={{ color: 'var(--ember)', letterSpacing: '0.15em' }}>
          Restricted
        </div>
      )}

      {/* Selected indicator */}
      {selected && (
        <span
          className="absolute left-0 top-0 bottom-0 w-0.5"
          style={{ background: 'var(--gold)' }}
        />
      )}

      <div
        className="font-body font-medium text-sm mb-1 pr-16 leading-snug transition-colors"
        style={{ color: selected ? 'var(--cream)' : 'rgba(242,237,228,0.75)' }}
      >
        {trek.name}
      </div>
      <div className="font-mono text-[10px] opacity-40 leading-relaxed">
        {trek.region} · {trek.typicalDays} days
      </div>
    </button>
  )
}
