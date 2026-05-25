import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('ss_user')
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)) } catch (_) { localStorage.removeItem('ss_user') }
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('ss_users') || '[]')
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) return { success: false, error: 'Invalid email or password' }
    const userData = { id: found.id, name: found.name, email: found.email }
    setUser(userData)
    localStorage.setItem('ss_user', JSON.stringify(userData))
    return { success: true }
  }

  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('ss_users') || '[]')
    if (users.find(u => u.email === email)) return { success: false, error: 'Email already registered' }
    const newUser = { id: Date.now().toString(), name, email, password }
    users.push(newUser)
    localStorage.setItem('ss_users', JSON.stringify(users))
    const userData = { id: newUser.id, name: newUser.name, email: newUser.email }
    setUser(userData)
    localStorage.setItem('ss_user', JSON.stringify(userData))
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ss_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)