import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import permitsData from '../data/permits.json'
import TrekCard from './TrekCard.jsx'

const TREKS = Object.entries(permitsData.treks).map(([key, val]) => ({ key, ...val }))

const NAT_OPTIONS = [
  { value: 'saarc', label: 'SAARC Country', note: 'India · Bangladesh · Pakistan · Sri Lanka · Bhutan · Maldives · Afghanistan' },
  { value: 'other', label: 'Other Country', note: 'USA · Europe · Australia · China · all other countries' },
]

const DAYS_OPTIONS = [
  { value: '7', label: 'Up to 7 days' },
  { value: '14', label: '8 to 14 days' },
  { value: '15plus', label: '15 or more days' },
]

const STEPS = [
  { num: '01', question: 'Which trek are you doing?', sub: 'Select your main route' },
  { num: '02', question: 'What is your nationality?', sub: 'SAARC nationals pay lower fees' },
  { num: '03', question: 'How long is your trek?', sub: 'Used to check permit validity' },
]

export default function Wizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [trek, setTrek] = useState(null)
  const [nat, setNat] = useState(null)

  function handleTrekSelect(key) {
    setTrek(key)
    setTimeout(() => setStep(1), 280)
  }
  function handleNatSelect(value) {
    setNat(value)
    setTimeout(() => setStep(2), 280)
  }
  function handleDaysSelect(value) {
    navigate(`/?trek=${trek}&nat=${nat}&days=${value}`)
  }

  const current = STEPS[step]

  return (
    <div className="min-h-screen bg-ink text-cream flex flex-col">

      {/* Top bar */}
      <div className="px-6 sm:px-12 py-6 flex items-center justify-between border-b hairline"
        style={{ borderColor: 'rgba(242,237,228,0.06)' }}>
        <button
          onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/')}
          className="flex items-center gap-2 label text-cream-muted hover:text-cream transition-colors"
          style={{ color: 'var(--cream-muted)' }}
        >
          <ArrowLeft size={13} />
          {step > 0 ? 'Back' : 'Home'}
        </button>

        {/* Step indicators */}
        <div className="flex items-center gap-3">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="font-mono text-[10px] transition-all duration-300"
                style={{ color: i === step ? 'var(--gold)' : i < step ? 'rgba(242,237,228,0.3)' : 'rgba(242,237,228,0.15)' }}
              >
                {s.num}
              </div>
              {i < 2 && (
                <div className="w-6 h-px" style={{ background: i < step ? 'var(--gold)' : 'rgba(242,237,228,0.1)' }} />
              )}
            </div>
          ))}
        </div>

        <div className="label opacity-0 pointer-events-none">placeholder</div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-6 sm:px-12 py-12">

        {/* Question header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="gold-line" />
            <span className="label text-gold">{current.sub}</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-light leading-tight">
            {current.question}
          </h2>
        </div>

        {/* Step 0 — Trek grid */}
        {step === 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TREKS.map(t => (
              <TrekCard key={t.key} trek={t} trekKey={t.key} selected={trek === t.key} onSelect={handleTrekSelect} />
            ))}
          </div>
        )}

        {/* Step 1 — Nationality */}
        {step === 1 && (
          <div className="flex flex-col gap-3 max-w-lg">
            {NAT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleNatSelect(opt.value)}
                className="group text-left p-5 border transition-all duration-200 focus:outline-none"
                style={{
                  borderColor: nat === opt.value ? 'var(--gold)' : 'rgba(242,237,228,0.08)',
                  background: nat === opt.value ? 'rgba(201,168,76,0.06)' : '#1A1A1A',
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-body font-medium text-sm" style={{ color: nat === opt.value ? 'var(--cream)' : 'rgba(242,237,228,0.75)' }}>
                    {opt.label}
                  </span>
                  {nat === opt.value && <ArrowRight size={13} style={{ color: 'var(--gold)' }} />}
                </div>
                <div className="font-mono text-[10px] opacity-35 leading-relaxed">{opt.note}</div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2 — Duration */}
        {step === 2 && (
          <div className="flex flex-col gap-3 max-w-lg">
            {DAYS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleDaysSelect(opt.value)}
                className="group text-left p-5 border transition-all duration-200 focus:outline-none hover:border-gold/30"
                style={{
                  borderColor: 'rgba(242,237,228,0.08)',
                  background: '#1A1A1A',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(242,237,228,0.08)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-body font-medium text-sm" style={{ color: 'rgba(242,237,228,0.75)' }}>
                    {opt.label}
                  </span>
                  <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--gold)' }} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
