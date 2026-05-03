import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useGames } from '../context/GamesContext'
import { usePresence } from '../context/PresenceContext'
import { SUBJECTS, streamGroupFor } from '../data/games'
import { SparkleIcon, TrophyIcon } from '../components/icons'

const TIME_WINDOWS = [
  { id: 'all', label: 'All time' },
  { id: 'week', label: 'Past week', ms: 1000 * 60 * 60 * 24 * 7 },
  { id: 'day', label: 'Today', ms: 1000 * 60 * 60 * 24 },
]

export default function Leaderboard() {
  const { user } = useAuth()
  const { results } = useGames()
  const { online, byStream } = usePresence()

  const myStream = streamGroupFor(user?.education?.stream)
  const [stream, setStream] = useState(myStream === 'Mixed' ? 'all' : myStream)
  const [subjectId, setSubjectId] = useState('all')
  const [windowId, setWindowId] = useState('all')

  const subjectMap = useMemo(
    () => Object.fromEntries(SUBJECTS.map((s) => [s.id, s])),
    [],
  )

  const rows = useMemo(() => {
    const win = TIME_WINDOWS.find((w) => w.id === windowId)
    const cutoff = win?.ms ? Date.now() - win.ms : 0
    const filtered = results.filter((r) => {
      if (stream !== 'all' && r.stream !== stream) return false
      if (subjectId !== 'all' && r.subjectId !== subjectId) return false
      if (cutoff && r.ts < cutoff) return false
      return true
    })
    // Best score per (userId, subjectId) so multiple plays don't crowd one user.
    const best = new Map()
    filtered.forEach((r) => {
      const key = `${r.userId || r.id || r.name}::${r.subjectId}`
      const existing = best.get(key)
      if (!existing || (r.score ?? 0) > (existing.score ?? 0)) {
        best.set(key, r)
      }
    })
    return [...best.values()]
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0) || (b.accuracy ?? 0) - (a.accuracy ?? 0))
      .slice(0, 50)
  }, [results, stream, subjectId, windowId])

  const myBest = useMemo(() => {
    if (!user) return null
    const mine = results.filter((r) => r.userId === user.id)
    if (mine.length === 0) return null
    return mine.reduce((acc, r) => ((r.score ?? 0) > (acc.score ?? 0) ? r : acc), mine[0])
  }, [results, user])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-white">
            Leaderboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Best scores across the EduGuide community. Filter by stream, subject, or time window.
          </p>
        </div>
        <Link to="/app/games" className="eg-btn-primary px-4 py-2 text-sm">
          <SparkleIcon className="h-4 w-4" /> Play a round
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <LiveStat label="Online now" value={online} pulse />
        <LiveStat label="Science live" value={byStream.Science ?? 0} />
        <LiveStat label="Commerce live" value={byStream.Commerce ?? 0} />
      </div>

      <div className="eg-card flex flex-wrap items-center gap-3">
        <FilterChips
          label="Stream"
          value={stream}
          onChange={setStream}
          options={[
            { id: 'all', label: 'All' },
            { id: 'Science', label: 'Science' },
            { id: 'Commerce', label: 'Commerce' },
            { id: 'Arts', label: 'Arts' },
          ]}
        />
        <div className="ml-auto flex flex-wrap gap-2">
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          >
            <option value="all">All subjects</option>
            {SUBJECTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <FilterChips
            label="Window"
            compact
            value={windowId}
            onChange={setWindowId}
            options={TIME_WINDOWS.map((w) => ({ id: w.id, label: w.label }))}
          />
        </div>
      </div>

      {myBest && (
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 dark:border-indigo-500/30 dark:from-indigo-500/10 dark:to-purple-500/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
            Your best
          </p>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">
            <span className="font-semibold text-gray-900 dark:text-white">{myBest.score}</span>
            {' '}on{' '}
            <span className="font-medium">{subjectMap[myBest.subjectId]?.name || myBest.subjectId}</span>
            {' · '}
            {myBest.accuracy}% accuracy
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft dark:border-gray-700 dark:bg-gray-900">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:bg-gray-950 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Stream</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3 text-right">Score</th>
              <th className="px-4 py-3 text-right">Accuracy</th>
              <th className="hidden px-4 py-3 text-right md:table-cell">Played</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                  No rounds match these filters yet.{' '}
                  <Link to="/app/games" className="font-medium text-indigo-600 hover:underline dark:text-indigo-300">
                    Play a round
                  </Link>{' '}
                  to claim a spot.
                </td>
              </tr>
            ) : (
              rows.map((r, i) => {
                const isMe = user && r.userId === user.id
                return (
                  <motion.tr
                    key={`${r.userId || r.id || r.name}-${r.subjectId}-${r.ts || i}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className={`border-t border-gray-100 dark:border-gray-800 ${
                      isMe ? 'bg-indigo-50/60 dark:bg-indigo-500/10' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      {i < 3 ? (
                        <span
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                            ['bg-peach-100 text-peach-700', 'bg-gray-200 text-gray-700', 'bg-mint-100 text-mint-700'][i]
                          } ${isMe ? 'ring-2 ring-indigo-400' : ''}`}
                        >
                          {i + 1}
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {i + 1}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {r.name}{' '}
                        {isMe && (
                          <span className="ml-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                            you
                          </span>
                        )}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{r.stream}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {subjectMap[r.subjectId]?.name || r.subjectId}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                      {r.score}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">
                      {r.accuracy}%
                    </td>
                    <td className="hidden px-4 py-3 text-right text-xs text-gray-500 md:table-cell dark:text-gray-400">
                      {timeAgo(r.ts)}
                    </td>
                  </motion.tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <TrophyIcon className="h-4 w-4 text-peach-500" />
        Scores are stored locally in your browser; mock peers are seeded for context.
      </div>
    </div>
  )
}

function FilterChips({ label, value, onChange, options, compact }) {
  return (
    <div className="flex items-center gap-2">
      {!compact && (
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {label}
        </span>
      )}
      <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-0.5 dark:border-gray-700 dark:bg-gray-900">
        {options.map((o) => {
          const active = value === o.id
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onChange(o.id)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                active
                  ? 'bg-white text-indigo-700 shadow-sm dark:bg-gray-800 dark:text-indigo-300'
                  : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function LiveStat({ label, value, pulse }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-soft dark:border-gray-700 dark:bg-gray-900">
      {pulse ? (
        <span className="relative inline-flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400 opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mint-500" />
        </span>
      ) : (
        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-indigo-300 dark:bg-indigo-500/60" />
      )}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  )
}

function timeAgo(ts) {
  if (!ts) return '—'
  const diff = Date.now() - ts
  const m = Math.round(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.round(h / 24)
  return `${d}d ago`
}
