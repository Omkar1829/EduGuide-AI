import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAdmin } from '../context/AdminContext'
import { useLearning } from '../context/LearningContext'
import { useVault, VAULT_CATEGORIES } from '../context/VaultContext'
import { COURSES } from '../data/courses'
import { PROFILE, STREAMS } from '../data/aiProfile'
import { AI_PROVIDERS_CATALOG } from '../data/admin'
import CourseCard from '../components/CourseCard'
import {
  BookIcon,
  BrainIcon,
  CheckIcon,
  FireIcon,
  FolderIcon,
  MessageIcon,
  SendIcon,
  SparkleIcon,
  TargetIcon,
  TrophyIcon,
  ZapIcon,
} from '../components/icons'

/* --------------------------------- Helpers -------------------------------- */

function miniReply(input) {
  const t = input.toLowerCase()
  if (t.includes('plan')) return 'Sure — I’ll draft a 7-day plan. Open the AI Tutor to iterate.'
  if (t.includes('quiz')) return 'Want 5 or 10 questions? I can generate either.'
  if (t.includes('weak')) return 'Your weakest area is the chain rule — 8-min refresher available.'
  if (t.includes('career') || t.includes('role')) return 'Based on your profile, Data Scientist is the top match at 92% confidence.'
  if (t.includes('stream')) return 'You currently look like a Science fit. Try the What-If panel to explore others.'
  return 'Got it. For deeper answers, hop into the full AI Tutor — I have more room to think there.'
}

/* ----------------------------- AI Recommendation --------------------------- */

function RecommendationCard({ stream, data, modelBadge }) {
  return (
    <motion.section
      key={stream}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-6 text-white shadow-xl sm:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.28),_transparent_60%)]"
      />
      <div className="relative grid gap-6 lg:grid-cols-[1fr_220px] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur">
              <SparkleIcon className="h-3.5 w-3.5" /> AI Recommendation
            </span>
            {modelBadge && (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-1 font-mono text-[11px] text-white/90 backdrop-blur">
                Powered by {modelBadge}
              </span>
            )}
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Recommended stream:{' '}
            <span className="underline decoration-white/40 decoration-2 underline-offset-4">
              {stream}
            </span>
          </h2>
          <p className="mt-1 text-sm font-medium text-indigo-50">
            Best-fit role: <span className="font-semibold">{data.role}</span> — {data.tagline}
          </p>

          <details className="group mt-4 rounded-xl bg-white/10 p-3 backdrop-blur">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
              Why this recommendation?
              <span className="text-xs text-indigo-100 group-open:hidden">Show</span>
              <span className="hidden text-xs text-indigo-100 group-open:inline">Hide</span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-indigo-50">{data.why}</p>
          </details>
        </div>

        <ConfidenceRing value={data.confidence} />
      </div>
    </motion.section>
  )
}

function ConfidenceRing({ value }) {
  const radius = 54
  const circ = 2 * Math.PI * radius
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
          <circle cx="70" cy="70" r={radius} stroke="rgba(255,255,255,0.2)" strokeWidth="10" fill="none" />
          <motion.circle
            cx="70"
            cy="70"
            r={radius}
            stroke="white"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - (circ * value) / 100 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold">{value}%</span>
          <span className="text-[11px] uppercase tracking-wide text-indigo-100">
            confidence
          </span>
        </div>
      </div>
    </div>
  )
}

/* ----------------------------- Multi-factor bars --------------------------- */

function MultiFactor({ metrics }) {
  return (
    <section className="eg-card">
      <div className="mb-4 flex items-center gap-2">
        <TargetIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Multi-factor analysis
        </h2>
      </div>
      <div className="space-y-4">
        {metrics.map((m, i) => (
          <div key={m.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {m.label}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {m.value}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
              <motion.div
                key={`${m.label}-${m.value}`}
                initial={{ width: 0 }}
                animate={{ width: `${m.value}%` }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
                className={`h-full rounded-full bg-gradient-to-r ${m.tint}`}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* --------------------------------- Roadmap -------------------------------- */

function Roadmap({ steps }) {
  return (
    <section className="eg-card">
      <div className="mb-4 flex items-center gap-2">
        <ZapIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Career roadmap
        </h2>
      </div>
      <ol className="relative space-y-4 border-l border-dashed border-gray-200 pl-6 dark:border-gray-700">
        {steps.map((s, i) => (
          <motion.li
            key={s.title}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="relative"
          >
            <span className="absolute -left-[33px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-xs font-semibold text-white shadow-md ring-4 ring-white dark:ring-gray-800">
              {i + 1}
            </span>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {s.title}
            </p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {s.desc}
            </p>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}

/* --------------------------------- Skill gap ------------------------------- */

function SkillGap({ skills }) {
  return (
    <section className="eg-card">
      <div className="mb-3 flex items-center gap-2">
        <BrainIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Skill gap analysis
        </h2>
      </div>
      <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
        Skills you&apos;ll want to build for this path.
      </p>
      <div className="flex flex-wrap gap-2">
        {skills.map((s, i) => (
          <motion.span
            key={s}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: i * 0.03 }}
            className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300"
          >
            {s}
          </motion.span>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------ Weakness card ------------------------------ */

function Weakness({ areas }) {
  return (
    <section className="eg-card">
      <div className="mb-3 flex items-center gap-2">
        <FireIcon className="h-4 w-4 text-rose-500" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Weakness analysis
        </h2>
      </div>
      <ul className="space-y-3">
        {areas.map((a) => (
          <li
            key={a.subject}
            className="rounded-xl border border-gray-200 p-3 dark:border-gray-700"
          >
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {a.subject}
            </p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              💡 {a.tip}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* --------------------------- What-If simulator --------------------------- */

function WhatIf({ active, onChange }) {
  return (
    <section className="eg-card">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SparkleIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            What-if simulator
          </h2>
        </div>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          Live preview
        </span>
      </div>
      <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
        Flip the stream and watch the recommendation, roadmap, and gaps update.
      </p>
      <div className="grid grid-cols-3 gap-2">
        {STREAMS.map((s) => {
          const isActive = s === active
          return (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              className={`relative rounded-xl border p-3 text-center text-sm font-medium transition-all ${
                isActive
                  ? 'border-transparent bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'border-gray-200 text-gray-700 hover:border-brand-400 hover:bg-brand-50 dark:border-gray-700 dark:text-gray-200 dark:hover:border-brand-400 dark:hover:bg-brand-900/20'
              }`}
            >
              <span className="block">What if</span>
              <span className="block text-base font-semibold">{s}?</span>
              {isActive && (
                <span className="absolute right-2 top-2">
                  <CheckIcon className="h-4 w-4" />
                </span>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}

/* --------------------------- Mini AI assistant --------------------------- */

function MiniAssistant() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: 'Quick question? Ask me in a line — or open the full AI Tutor for deeper help.' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  const send = (override) => {
    const text = (override ?? input).trim()
    if (!text) return
    setMessages((m) => [...m, { id: Date.now(), role: 'user', text }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: Date.now() + 1, role: 'bot', text: miniReply(text) },
      ])
      setTyping(false)
    }, 500)
  }

  return (
    <section className="eg-card flex h-[460px] flex-col p-0">
      <div className="flex items-center gap-2 rounded-t-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-white">
        <MessageIcon className="h-4 w-4" />
        <p className="text-sm font-semibold">AI Assistant</p>
        <Link
          to="/app/tutor"
          className="ml-auto rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium hover:bg-white/25"
        >
          Open full tutor →
        </Link>
      </div>

      <div ref={listRef} className="eg-scroll flex-1 space-y-2 overflow-y-auto p-4">
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
              }`}
            >
              {m.text}
            </div>
          </motion.div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-gray-100 px-3 py-2 dark:bg-gray-800">
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          send()
        }}
        className="border-t border-gray-200 p-3 dark:border-gray-800"
      >
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a quick question…"
            className="eg-input"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={!input.trim()}
            className="eg-btn-primary h-10 w-10 shrink-0 p-0 disabled:opacity-50"
            aria-label="Send"
          >
            <SendIcon className="h-4 w-4" />
          </motion.button>
        </div>
      </form>
    </section>
  )
}

/* ------------------------------ Data Source ------------------------------ */

function DataSource() {
  const { documents } = useVault()
  const total = documents.length
  // Confidence boost scales with both count and category coverage.
  const categoriesCovered = new Set(documents.map((d) => d.category)).size
  const coverageRatio = categoriesCovered / VAULT_CATEGORIES.length
  const volumeRatio = Math.min(total / 6, 1)
  const boost = Math.round((coverageRatio * 0.6 + volumeRatio * 0.4) * 18) // 0–18%
  const perCategory = VAULT_CATEGORIES.map((cat) => ({
    cat,
    count: documents.filter((d) => d.category === cat).length,
  }))

  return (
    <section className="eg-card">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Data source
          </h2>
        </div>
        <Link
          to="/app/vault"
          className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
        >
          Open vault →
        </Link>
      </div>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        Your uploaded academic records power these recommendations.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-700">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Documents
          </p>
          <p className="mt-0.5 text-2xl font-semibold text-gray-900 dark:text-white">
            {total}
          </p>
          <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
            across {categoriesCovered}/{VAULT_CATEGORIES.length} categories
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-700">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Confidence boost
          </p>
          <p className="mt-0.5 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
            +{boost}%
          </p>
          <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
            vs. no documents
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {perCategory.map(({ cat, count }) => (
          <li key={cat} className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-300">{cat}</span>
            <span
              className={`rounded-full px-2 py-0.5 font-medium ${
                count > 0
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {count > 0 ? `${count} uploaded` : 'Not yet'}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* --------------------------------- Stats ---------------------------------- */

function StatCard({ label, value, hint, Icon, tint, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -2 }}
      className="eg-card flex items-center gap-4"
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tint} text-white shadow-md`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <p className="mt-0.5 text-2xl font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
        {hint && <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
      </div>
    </motion.div>
  )
}

/* --------------------------------- Page ---------------------------------- */

export default function Dashboard() {
  const { user } = useAuth()
  const { enrollments, progressFor } = useLearning()
  const { taskRouting, providers } = useAdmin()
  const navigate = useNavigate()

  const [stream, setStream] = useState('Science')
  const data = PROFILE[stream]

  const recoModelBadge = useMemo(() => {
    const t = taskRouting?.recommendation
    if (!t?.enabled) return null
    const p = providers?.[t.provider]
    if (!p?.enabled || p.status !== 'connected') return null
    const name = AI_PROVIDERS_CATALOG.find((x) => x.id === t.provider)?.name || t.provider
    return `${name} · ${t.model}`
  }, [taskRouting, providers])

  const enrolledCourses = useMemo(
    () =>
      Object.keys(enrollments)
        .map((id) => COURSES.find((c) => c.id === id))
        .filter(Boolean),
    [enrollments],
  )
  const inProgress = enrolledCourses.filter((c) => progressFor(c.id) < 100)
  const completed = enrolledCourses.filter((c) => progressFor(c.id) === 100)
  const recommendations = COURSES.filter((c) => !enrollments[c.id]).slice(0, 3)

  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Greeting */}
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-white">
          Hi, {firstName} 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Your AI-generated career & study insights — updated in real time.
        </p>
      </div>

      {/* 1 — AI Recommendation */}
      <RecommendationCard stream={stream} data={data} modelBadge={recoModelBadge} />

      {/* 2 & 6 — Multi-factor + What-If side by side */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MultiFactor metrics={data.metrics} />
        </div>
        <WhatIf active={stream} onChange={setStream} />
      </div>

      {/* Data Source — wires the Academic Vault into AI confidence */}
      <DataSource />

      {/* 3 — Roadmap */}
      <Roadmap steps={data.roadmap} />

      {/* 4 & 5 — Skill gap + Weakness */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SkillGap skills={data.skillsMissing} />
        <Weakness areas={data.weakAreas} />
      </div>

      {/* 7 — Mini AI assistant + CTA to full tutor */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MiniAssistant />
        </div>
        <div className="eg-card flex flex-col justify-between bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 text-white">
          <div>
            <div className="flex items-center gap-2">
              <BrainIcon className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Go deeper</h3>
            </div>
            <p className="mt-2 text-sm text-indigo-50">
              Open the full AI Tutor for worked examples, quizzes, summaries and
              plans — all in one place.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/app/tutor')}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/25"
          >
            Launch AI Tutor <SendIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Enrolled"
          value={enrolledCourses.length}
          hint={`${inProgress.length} in progress`}
          Icon={BookIcon}
          tint="from-indigo-500 to-purple-500"
        />
        <StatCard
          label="Completed"
          value={completed.length}
          hint="Keep it up!"
          Icon={TrophyIcon}
          tint="from-emerald-500 to-teal-500"
          delay={0.05}
        />
        <StatCard
          label="Day streak"
          value="14d"
          hint="Current learning streak"
          Icon={FireIcon}
          tint="from-orange-500 to-rose-500"
          delay={0.1}
        />
        <StatCard
          label="AI sessions"
          value="27"
          hint="This month"
          Icon={SparkleIcon}
          tint="from-fuchsia-500 to-pink-500"
          delay={0.15}
        />
      </div>

      {/* Continue learning */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Continue learning
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Pick up one of your active courses.
            </p>
          </div>
          <Link
            to="/app/courses"
            className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            View all
          </Link>
        </div>

        {inProgress.length === 0 ? (
          <div className="eg-card text-center">
            <p className="text-gray-600 dark:text-gray-300">
              You haven&apos;t enrolled in any courses yet.
            </p>
            <Link to="/app/courses" className="eg-btn-primary mt-4 inline-flex">
              Explore courses
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {inProgress.map((c, i) => (
              <CourseCard key={c.id} course={c} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Recommended courses */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recommended for you
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Hand-picked based on your stream and weak areas.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((c, i) => (
            <CourseCard key={c.id} course={c} index={i} />
          ))}
        </div>
      </section>
    </div>
  )
}
