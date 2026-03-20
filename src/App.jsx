import { BrowserRouter, Routes, Route, useSearchParams, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import Results from './components/Results.jsx'
import Wizard from './components/Wizard.jsx'

// Root decides: if all params present → Results directly, else → Wizard
function RootRoute() {
  const [searchParams] = useSearchParams()
  const trek = searchParams.get('trek')
  const nat = searchParams.get('nat')
  const days = searchParams.get('days')

  if (trek && nat && days) {
    return <Results trek={trek} nat={nat} days={days} />
  }
  return <Home />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/wizard" element={<Wizard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
