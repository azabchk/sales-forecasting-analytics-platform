import { Link, Route, Routes } from 'react-router-dom'
import Overview from './pages/Overview'
import StoreAnalytics from './pages/StoreAnalytics'
import Forecast from './pages/Forecast'

export default function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '16px' }}>
      <h1>Rossmann Analytics Dashboard</h1>
      <nav style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <Link to="/">Overview</Link>
        <Link to="/store">Store Analytics</Link>
        <Link to="/forecast">Forecast</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/store" element={<StoreAnalytics />} />
        <Route path="/forecast" element={<Forecast />} />
      </Routes>
    </div>
  )
}
