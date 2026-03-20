import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const TREK_NAMES = [
  'Everest Base Camp', 'Annapurna Circuit', 'Annapurna Base Camp',
  'Langtang Valley', 'Manaslu Circuit', 'Upper Mustang',
  'Ghorepani Poon Hill', 'Gosaikunda',
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-ink text-cream flex flex-col">

      {/* Nav */}
      <nav className="px-6 sm:px-12 py-7 flex items-center justify-between">
        <div className="label text-gold">Nepal Permits</div>
        <div className="label opacity-40">2026</div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col justify-center px-6 sm:px-12 pb-16 pt-8 max-w-4xl mx-auto w-full">

        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-10 animate-fade-up">
          <span className="gold-line" />
          <span className="label text-gold">Trekking Permit Guide</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl sm:text-7xl font-light leading-[1.05] tracking-tight mb-8 animate-fade-up delay-100">
          Which permits do<br />
          you need for<br />
          <em className="text-gold font-light">Nepal trekking?</em>
        </h1>

        {/* Subtext */}
        <p className="font-body font-light text-lg text-cream-muted leading-relaxed max-w-lg mb-12 animate-fade-up delay-200">
          Answer three questions. Get your exact permit checklist with fees, purchase locations, and what to watch out for.
        </p>

        {/* CTA */}
        <div className="animate-fade-up delay-300">
          <button
            onClick={() => navigate('/wizard')}
            className="group inline-flex items-center gap-4 bg-gold text-ink font-body font-semibold text-sm tracking-wide px-8 py-4 hover:bg-gold-light transition-all duration-300"
          >
            Find my permits
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          <p className="mt-4 label opacity-40">Free · No account · 30 seconds</p>
        </div>

        {/* Trek list */}
        <div className="mt-20 animate-fade-up delay-400">
          <div className="label opacity-30 mb-5">Covers 8 major treks</div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {TREK_NAMES.map((name, i) => (
              <span key={name} className="font-display text-lg font-light text-cream-muted italic">
                {name}{i < TREK_NAMES.length - 1 && <span className="text-gold mx-3 not-italic font-thin">·</span>}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Stats strip */}
      <div className="border-t hairline">
        <div className="max-w-4xl mx-auto px-6 sm:px-12 py-8 grid grid-cols-3 gap-6">
          {[
            { num: '8', label: 'Major Treks' },
            { num: '2026', label: 'Fees Updated' },
            { num: '0', label: 'Cost to Use' },
          ].map(s => (
            <div key={s.label}>
              <div className="font-display text-3xl font-light text-gold">{s.num}</div>
              <div className="label mt-1 opacity-40">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t hairline px-6 sm:px-12 py-5 flex items-center justify-between">
        <div className="label opacity-30">Data · TAAN & Nepal Tourism Board</div>
        <div className="label opacity-30">Butwal, Nepal</div>
      </footer>
    </div>
  )
}
