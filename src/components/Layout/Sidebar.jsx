import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

const NAV_ITEMS = [
  { to: '/dashboard', icon: '⬛', label: 'Dashboard' },
  { to: '/transactions', icon: '↕', label: 'Transactions' },
  { to: '/analytics', icon: '◎', label: 'Analytics' },
  { to: '/budget', icon: '◈', label: 'Budget' },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="logo-text">SpendSmart</span>
      </div>

      {/* User */}
      <div className="sidebar-user">
        <div className="user-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
        <div className="user-info">
          <span className="user-name">{user?.name}</span>
          <span className="user-email">{user?.email}</span>
        </div>
      </div>

      <div className="sidebar-divider" />

      {/* Nav */}
      <nav className="sidebar-nav">
        <p className="nav-section-label">MENU</p>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            <span className="nav-active-dot" />
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-divider" />
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <span className="nav-icon">⎋</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  )
}