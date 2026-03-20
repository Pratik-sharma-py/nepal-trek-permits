import { useNavigate } from 'react-router-dom'
import { Mountain } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6 text-center">
      <Mountain size={40} className="text-stone-300 mb-4" strokeWidth={1} />
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-2">Trail not found</h1>
      <p className="text-stone-400 text-sm mb-8">This page doesn't exist. Let's get you back on the right path.</p>
      <button
        onClick={() => navigate('/')}
        className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-xl px-6 py-3 transition-colors"
      >
        Back to home
      </button>
    </div>
  )
}
