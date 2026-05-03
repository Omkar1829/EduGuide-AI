import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { CheckIcon, ZapIcon } from '../icons'

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function buildPlan(weakSubjects) {
  const items = []
  const focus = weakSubjects.length > 0 ? weakSubjects : [
    { name: 'Mathematics', subjectId: 'mathematics' },
    { name: 'English', subjectId: 'english' },
    { name: 'Physics', subjectId: 'physics' },
  ]

  const tasks = [
    'Quick concept refresh (15 min reading)',
    'Practice 5-question game round',
    'Watch a worked example',
    'Mock-test 10 mixed questions',
    'Review notes & flashcards',
    'Apply to a small project / write-up',
    'Reflect on the week & identify gaps',
  ]

  for (let i = 0; i < 7; i++) {
    const f = focus[i % focus.length]
    items.push({
      day: DAY_NAMES[i],
      focus: f.name,
      task: tasks[i],
    })
  }
  return items
}

export default function StudyPlan({ weakSubjects = [], storageKey = 'eduguide-plan' }) {
  const plan = useMemo(() => buildPlan(weakSubjects), [weakSubjects])
  const [done, setDone] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(done))
    } catch {
      // ignore quota
    }
  }, [done, storageKey])

  const toggle = (i) =>
    setDone((d) => ({ ...d, [i]: !d[i] }))

  const completed = Object.values(done).filter(Boolean).length
  const pct = Math.round((completed / plan.length) * 100)

  return (
    <section className="eg-card">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ZapIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Personalised study plan
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setDone({})}
          className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
        >
          Reset
        </button>
      </div>
      <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
        7-day plan auto-tuned to your weakest subjects. Tick off as you go.
      </p>
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
          className="h-full rounded-full bg-gradient-to-r from-mint-400 to-sky-400"
        />
      </div>
      <ol className="space-y-2">
        {plan.map((it, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: i * 0.03 }}
            className="flex items-start gap-3 rounded-xl border border-gray-200 p-3 dark:border-gray-700"
          >
            <button
              type="button"
              onClick={() => toggle(i)}
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                done[i]
                  ? 'border-mint-500 bg-mint-500 text-white'
                  : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
              }`}
              aria-pressed={Boolean(done[i])}
              aria-label={`Toggle ${it.day} task`}
            >
              {done[i] && <CheckIcon className="h-3.5 w-3.5" />}
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-sm">
                <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                  {it.day}
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  {it.focus}
                </span>
              </div>
              <p
                className={`mt-1 text-xs ${
                  done[i]
                    ? 'text-gray-400 line-through dark:text-gray-500'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {it.task}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}
