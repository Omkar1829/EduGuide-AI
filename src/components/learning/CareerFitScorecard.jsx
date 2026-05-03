import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { BriefcaseIcon, SparkleIcon } from '../icons'
import { CAREER_ROLES, rolesForStream } from '../../data/careers'
import { careerFitFor } from '../../utils/proficiency'

export default function CareerFitScorecard({ myResults, stream }) {
  const [showAll, setShowAll] = useState(false)
  const ranked = useMemo(() => {
    const pool = showAll ? CAREER_ROLES : rolesForStream(stream)
    return pool
      .map((r) => ({ ...r, fit: careerFitFor(r, { myResults, stream }) }))
      .sort((a, b) => b.fit - a.fit)
      .slice(0, 6)
  }, [myResults, stream, showAll])

  return (
    <section className="eg-card">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BriefcaseIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Career-fit scorecard
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
        >
          {showAll ? 'Show stream only' : 'Show all roles'}
        </button>
      </div>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        Match scores blend stream fit, subject proficiency, and skill exposure.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {ranked.map((r, i) => (
          <motion.details
            key={r.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white/70 p-4 transition-shadow hover:shadow-soft dark:border-gray-700 dark:bg-gray-800/60"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {r.title}
                  </span>
                  {r.streams.includes(stream) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-mint-50 px-1.5 py-0.5 text-[10px] font-medium text-mint-700 dark:bg-mint-500/15 dark:text-mint-300">
                      <SparkleIcon className="h-2.5 w-2.5" /> stream
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {r.summary}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400">match</div>
                <div className="text-lg font-semibold text-brand-700 dark:text-brand-300">
                  {r.fit}%
                </div>
              </div>
            </summary>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
              <motion.div
                key={r.fit}
                initial={{ width: 0 }}
                animate={{ width: `${r.fit}%` }}
                transition={{ duration: 0.7 }}
                className="h-full rounded-full bg-gradient-to-r from-mint-400 via-sky-400 to-purple-400"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {r.skills.slice(0, 5).map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {s}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-gray-500 dark:text-gray-400 group-open:hidden">
              Click to expand interview prep ↓
            </p>
            <div className="hidden pt-3 group-open:block">
              <p className="mb-2 text-xs font-semibold text-gray-700 dark:text-gray-200">
                Sample interview questions
              </p>
              <ul className="space-y-1.5">
                {r.interviewPrep.map((p, idx) => (
                  <li
                    key={idx}
                    className="rounded-lg bg-brand-50/60 px-2.5 py-1.5 text-[12px] text-gray-700 dark:bg-brand-900/20 dark:text-gray-200"
                  >
                    <span
                      className={`mr-2 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                        p.kind === 'tech'
                          ? 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300'
                          : 'bg-peach-100 text-peach-700 dark:bg-peach-500/20 dark:text-peach-300'
                      }`}
                    >
                      {p.kind}
                    </span>
                    {p.q}
                  </li>
                ))}
              </ul>
            </div>
          </motion.details>
        ))}
      </div>
    </section>
  )
}
