import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { SEED_LEADERBOARD } from '../data/games'

const STORAGE_KEY = 'eduguide-games'

const GamesContext = createContext({
  results: [],
  leaderboard: [],
  recordResult: () => {},
  myStats: { played: 0, bestScore: 0, avgAccuracy: 0 },
})

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function GamesProvider({ children }) {
  const [state, setState] = useState(() => {
    const loaded = load()
    if (loaded?.results) return loaded
    return { results: [...SEED_LEADERBOARD] }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [state])

  // Cross-tab sync: when another tab posts a result, pick it up.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setState(JSON.parse(e.newValue))
        } catch {
          // ignore
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const recordResult = useCallback((entry) => {
    setState((prev) => {
      const id = `r_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`
      const row = { id, ts: Date.now(), ...entry }
      return { ...prev, results: [row, ...prev.results].slice(0, 200) }
    })
  }, [])

  const value = useMemo(() => ({
    results: state.results,
    recordResult,
  }), [state.results, recordResult])

  return <GamesContext.Provider value={value}>{children}</GamesContext.Provider>
}

export function useGames() {
  return useContext(GamesContext)
}
