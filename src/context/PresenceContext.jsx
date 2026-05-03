import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

// Simulates a "live presence" feed across tabs without a backend.
// One tab is randomly elected leader (broadcasting via localStorage). Other tabs
// just read the broadcast. The number drifts realistically over time.
const PRESENCE_KEY = 'eduguide-presence'
const HEARTBEAT_MS = 4000

function randomBetween(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1))
}

function loadInitial() {
  try {
    const raw = localStorage.getItem(PRESENCE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Date.now() - (parsed?.t || 0) < HEARTBEAT_MS * 4) {
        return parsed
      }
    }
  } catch {
    // ignore
  }
  return { count: randomBetween(28, 64), peak: 64, t: Date.now() }
}

const PresenceContext = createContext({
  online: 0,
  peak: 0,
  byStream: {},
})

const STREAMS = ['Science', 'Commerce', 'Arts']

export function PresenceProvider({ children }) {
  const [state, setState] = useState(() => loadInitial())
  const tickRef = useRef(null)

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === PRESENCE_KEY && e.newValue) {
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

  useEffect(() => {
    function tick() {
      setState((prev) => {
        // small random walk, kept in a sane range
        const delta = randomBetween(-3, 4)
        const count = Math.max(8, Math.min(120, prev.count + delta))
        const peak = Math.max(prev.peak || 0, count)
        const next = { count, peak, t: Date.now() }
        try {
          localStorage.setItem(PRESENCE_KEY, JSON.stringify(next))
        } catch {
          // ignore
        }
        return next
      })
    }
    tickRef.current = window.setInterval(tick, HEARTBEAT_MS)
    return () => window.clearInterval(tickRef.current)
  }, [])

  const byStream = useMemo(() => {
    // deterministic-ish split of the live count across streams
    const out = {}
    let remaining = state.count
    STREAMS.forEach((s, i) => {
      if (i === STREAMS.length - 1) {
        out[s] = Math.max(0, remaining)
      } else {
        const portion = Math.round(state.count * (i === 0 ? 0.45 : 0.32))
        out[s] = Math.min(portion, remaining)
        remaining -= out[s]
      }
    })
    return out
  }, [state.count])

  const value = useMemo(
    () => ({ online: state.count, peak: state.peak, byStream }),
    [state.count, state.peak, byStream],
  )

  return <PresenceContext.Provider value={value}>{children}</PresenceContext.Provider>
}

export function usePresence() {
  return useContext(PresenceContext)
}
