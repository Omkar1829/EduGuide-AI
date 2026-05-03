import { motion, AnimatePresence } from 'framer-motion'
import { useMemo, useState } from 'react'
import { CpuIcon, MessageIcon } from '../icons'
import { CAREER_ROLES, rolesForStream } from '../../data/careers'

const STAR_HINT = [
  { letter: 'S', label: 'Situation', desc: 'Set the context — when, where, what was happening.' },
  { letter: 'T', label: 'Task', desc: 'What was your responsibility?' },
  { letter: 'A', label: 'Action', desc: 'What did you specifically do?' },
  { letter: 'R', label: 'Result', desc: 'What was the outcome — quantify it if possible.' },
]

export default function MockInterview({ stream }) {
  const candidates = useMemo(() => {
    const fromStream = rolesForStream(stream)
    return fromStream.length > 0 ? fromStream : CAREER_ROLES.slice(0, 5)
  }, [stream])
  const [roleId, setRoleId] = useState(candidates[0]?.id)
  const role = candidates.find((r) => r.id === roleId) || candidates[0]
  const [openIdx, setOpenIdx] = useState(0)

  if (!role) return null

  return (
    <section className="eg-card">
      <div className="mb-3 flex items-center gap-2">
        <CpuIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Mock interview prep
        </h2>
      </div>
      <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
        Sample HR + technical questions per career. Use the STAR framework on the right for HR answers.
      </p>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {candidates.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => {
              setRoleId(r.id)
              setOpenIdx(0)
            }}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              r.id === roleId
                ? 'bg-gradient-to-r from-brand-600 to-purple-500 text-white'
                : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {r.title}
          </button>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
        <ul className="space-y-2">
          {role.interviewPrep.map((p, idx) => (
            <li
              key={idx}
              className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <button
                type="button"
                onClick={() => setOpenIdx((cur) => (cur === idx ? -1 : idx))}
                className="flex w-full items-center justify-between gap-2 bg-gray-50 px-3 py-2 text-left text-sm dark:bg-gray-800/60"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                      p.kind === 'tech'
                        ? 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300'
                        : 'bg-peach-100 text-peach-700 dark:bg-peach-500/20 dark:text-peach-300'
                    }`}
                  >
                    {p.kind}
                  </span>
                  <span className="text-gray-800 dark:text-gray-100">{p.q}</span>
                </span>
                <MessageIcon className="h-4 w-4 text-gray-400" />
              </button>
              <AnimatePresence initial={false}>
                {openIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 px-3 py-3 text-xs text-gray-600 dark:text-gray-300">
                      <p className="font-semibold text-gray-700 dark:text-gray-200">
                        Tips
                      </p>
                      <p>
                        {p.kind === 'tech'
                          ? 'Walk through your reasoning out loud — interviewers care about the journey, not just the final answer.'
                          : 'Pick a real story you can defend. Anchor with concrete numbers and what you would do differently.'}
                      </p>
                      <textarea
                        rows={3}
                        className="eg-input text-xs"
                        placeholder="Type your answer outline here…"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>

        <aside className="rounded-xl bg-gradient-to-br from-mint-50 to-sky-50 p-3 text-xs text-gray-700 dark:from-mint-500/10 dark:to-sky-500/10 dark:text-gray-200">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-mint-700 dark:text-mint-300">
            STAR framework
          </p>
          <ol className="mt-2 space-y-1.5">
            {STAR_HINT.map((s) => (
              <li key={s.letter}>
                <span className="font-bold text-brand-700 dark:text-brand-300">
                  {s.letter}
                </span>{' '}
                <span className="font-semibold">{s.label}</span> — {s.desc}
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </section>
  )
}
