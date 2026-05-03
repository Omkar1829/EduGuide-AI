import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useAuth } from './AuthContext'

// Tracks weekly goals, dismissed nudges and ambient activity that doesn't
// already live in another context (e.g. study sessions logged from the
// dashboard). Game rounds and lesson completions are NOT duplicated here —
// they remain in GamesContext / LearningContext respectively, and we
// derive streaks/feeds from those plus optional ambient logs.

const STORAGE_KEY_PREFIX = 'eduguide-activity:'

const ActivityContext = createContext({
  goals: [],
  events: [],
  dismissed: {},
  addGoal: () => {},
  removeGoal: () => {},
  bumpGoal: () => {},
  logEvent: () => {},
  dismissNudge: () => {},
})

function startOfWeekKey(d = new Date()) {
  const date = new Date(d)
  date.setHours(0, 0, 0, 0)
  const day = date.getDay() // 0 = Sun
  const monday = new Date(date)
  monday.setDate(date.getDate() - ((day + 6) % 7))
  return monday.toISOString().slice(0, 10)
}

function load(userId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + (userId || 'guest'))
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function save(userId, state) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + (userId || 'guest'), JSON.stringify(state))
  } catch {
    // ignore quota errors
  }
}

export function ActivityProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id || 'guest'
  const [state, setState] = useState(() => load(userId) || { goals: [], events: [], dismissed: {} })

  // Reload on user switch.
  useEffect(() => {
    setState(load(userId) || { goals: [], events: [], dismissed: {} })
  }, [userId])

  useEffect(() => {
    save(userId, state)
  }, [state, userId])

  const addGoal = useCallback((label, target = 5) => {
    setState((prev) => ({
      ...prev,
      goals: [
        ...prev.goals,
        {
          id: `g_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
          label,
          target,
          progress: 0,
          week: startOfWeekKey(),
        },
      ],
    }))
  }, [])

  const removeGoal = useCallback((id) => {
    setState((prev) => ({ ...prev, goals: prev.goals.filter((g) => g.id !== id) }))
  }, [])

  const bumpGoal = useCallback((id, by = 1) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === id ? { ...g, progress: Math.min(g.target, g.progress + by) } : g,
      ),
    }))
  }, [])

  const logEvent = useCallback((evt) => {
    setState((prev) => ({
      ...prev,
      events: [
        {
          id: `e_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
          ts: Date.now(),
          ...evt,
        },
        ...prev.events,
      ].slice(0, 100),
    }))
  }, [])

  const dismissNudge = useCallback((nudgeId) => {
    setState((prev) => ({
      ...prev,
      dismissed: { ...prev.dismissed, [nudgeId]: Date.now() },
    }))
  }, [])

  const value = useMemo(
    () => ({
      goals: state.goals,
      events: state.events,
      dismissed: state.dismissed,
      addGoal,
      removeGoal,
      bumpGoal,
      logEvent,
      dismissNudge,
    }),
    [state, addGoal, removeGoal, bumpGoal, logEvent, dismissNudge],
  )

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>
}

export function useActivity() {
  return useContext(ActivityContext)
}
