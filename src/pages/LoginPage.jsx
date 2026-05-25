import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import '../styles/auth.css'

export default function LoginPage() {
  const { login } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState('')

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setLoading(true)
    setGlobalError('')
    await new Promise(r => setTimeout(r, 600))
    const result = login(form.email, form.password)
    if (result.success) { toast.success('Welcome back!') }
    else { setGlobalError(result.error); toast.error(result.error) }
    setLoading(false)
  }

  const fillDemo = () => {
    setForm({ email: 'demo@spendsmart.com', password: 'demo1234' })
    setErrors({})
    setGlobalError('')
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-blob auth-bg-blob-1" />
      <div className="auth-bg-blob auth-bg-blob-2" />
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="auth-logo-text">SpendSmart</span>
        </div>
        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-subheading">Sign in to your account to continue</p>
        {globalError && <div className="auth-alert auth-alert-error">{globalError}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <button onClick={fillDemo} style={{ width:'100%', marginTop:'10px', padding:'10px', borderRadius:'var(--radius-sm)', background:'var(--bg-input)', color:'var(--text-secondary)', fontSize:'0.82rem', border:'1px solid var(--border)', cursor:'pointer', transition:'all var(--transition)' }}>
          Use Demo Account
        </button>
        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">Create account</Link>
        </p>
      </div>
    </div>
  )
}