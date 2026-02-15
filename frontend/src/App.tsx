import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Forecast from './pages/Forecast'
import Overview from './pages/Overview'
import StoreAnalytics from './pages/StoreAnalytics'

const links = [
  { path: '/', title: 'Overview' },
  { path: '/store', title: 'Store Analytics' },
  { path: '/forecast', title: 'Forecast' },
]

export default function App() {
  const location = useLocation()

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>Rossmann</h1>
        <p className="subtitle">Analytics Dashboard</p>
        <nav>
          {links.map((link) => (
            <Link key={link.path} to={link.path} className={location.pathname === link.path ? 'nav-link active' : 'nav-link'}>
              {link.title}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/store" element={<StoreAnalytics />} />
          <Route path="/forecast" element={<Forecast />} />
        </Routes>
      </main>
    </div>
  )
}
