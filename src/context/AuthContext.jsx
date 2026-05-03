import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'eduguide-auth'

const AuthContext = createContext({
  user: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  updateProfile: () => {},
})

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadUser())

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }, [user])

  const inferRole = (email) => {
    const e = (email || '').toLowerCase()
    if (e === 'admin@eduguide.ai' || e.startsWith('admin@') || e.startsWith('admin+'))
      return 'admin'
    return 'student'
  }

  const login = useCallback(async ({ email, password, role }) => {
    // Client-side mock: accept any email + non-empty password.
    if (!email || !password) {
      throw new Error('Please enter your email and password.')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please enter a valid email address.')
    }
    const name = email.split('@')[0].replace(/[._-]+/g, ' ')
    const next = {
      id: 'u_' + Math.random().toString(36).slice(2, 10),
      email,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      joinedAt: new Date().toISOString(),
      plan: 'Free',
      role: role || inferRole(email),
    }
    setUser(next)
    return next
  }, [])

  const signup = useCallback(async ({ name, email, password, phone, education }) => {
    if (!name || !email || !password) {
      throw new Error('All fields are required.')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please enter a valid email address.')
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.')
    }
    if (!education || !education.level) {
      throw new Error('Please provide your education details.')
    }
    const next = {
      id: 'u_' + Math.random().toString(36).slice(2, 10),
      email,
      name,
      phone: phone || '',
      joinedAt: new Date().toISOString(),
      plan: 'Free',
      role: inferRole(email),
      education,
    }
    setUser(next)
    return next
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const updateProfile = useCallback((patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev))
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
