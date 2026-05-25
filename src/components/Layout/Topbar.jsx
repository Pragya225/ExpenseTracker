import { useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Your financial overview' },
  '/transactions': { title: 'Transactions', subtitle: 'Manage your income & expenses' },
  '/analytics': { title: 'Analytics', subtitle: 'Visual spending insights' },
  '/budget': { title: 'Budget', subtitle: 'Monthly budget management' },
}

export default function Topbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  const page = PAGE_TITLES[pathname] || { title: 'SpendSmart', subtitle: '' }
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
        <div className="page-title-group">
          <h1 className="topbar-title">{page.title}</h1>
          <p className="topbar-subtitle">{page.subtitle}</p>
        </div>
      </div>
      <div className="topbar-right">
        <span className="topbar-date">{dateStr}</span>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme" title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          {theme === 'dark'
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          }
        </button>
      </div>
    </header>
  )
}