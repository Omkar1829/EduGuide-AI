import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'

const EDUCATION_LEVELS = [
  {
    value: 'school-10',
    label: 'School (Class 10)',
    description: 'Currently in or completed 10th standard',
    icon: '📘',
  },
  {
    value: 'school-12',
    label: 'School (Class 12)',
    description: 'Currently in or completed 12th standard',
    icon: '📗',
  },
  {
    value: 'undergraduate',
    label: 'Undergraduate',
    description: 'Pursuing a bachelor\u2019s degree',
    icon: '🎓',
  },
  {
    value: 'postgraduate',
    label: 'Postgraduate',
    description: 'Pursuing a master\u2019s or higher degree',
    icon: '🎯',
  },
  {
    value: 'working',
    label: 'Working professional',
    description: 'Upskilling or switching careers',
    icon: '💼',
  },
]

const STREAMS_BY_LEVEL = {
  'school-10': ['Undecided', 'Preparing for Science', 'Preparing for Commerce', 'Preparing for Arts'],
  'school-12': ['Science (PCM)', 'Science (PCB)', 'Commerce', 'Arts / Humanities', 'Vocational'],
  undergraduate: ['Engineering', 'Medical', 'Commerce / Business', 'Arts / Humanities', 'Science', 'Law', 'Design', 'Other'],
  postgraduate: ['Engineering', 'Management', 'Medical', 'Science', 'Arts / Humanities', 'Law', 'Other'],
  working: ['Software', 'Product / Design', 'Data / AI', 'Finance', 'Healthcare', 'Education', 'Other'],
}

const STEPS = [
  { id: 1, title: 'Account', subtitle: 'Basic info to get started' },
  { id: 2, title: 'Education', subtitle: 'Required details for personalisation' },
  { id: 3, title: 'Review', subtitle: 'Confirm & create account' },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    phone: '',
    level: '',
    stream: '',
    institution: '',
    board: '',
    currentYear: '',
    percentage: '',
  })

  const update = (patch) => setForm((f) => ({ ...f, ...patch }))

  const streams = useMemo(() => STREAMS_BY_LEVEL[form.level] || [], [form.level])
  const levelMeta = useMemo(
    () => EDUCATION_LEVELS.find((l) => l.value === form.level),
    [form.level],
  )

  const validateStep = (s) => {
    if (s === 1) {
      if (!form.name.trim()) return 'Please enter your full name.'
      if (!EMAIL_RE.test(form.email)) return 'Please enter a valid email address.'
      if (form.password.length < 6) return 'Password must be at least 6 characters.'
      if (form.password !== form.confirm) return 'Passwords do not match.'
    }
    if (s === 2) {
      if (!form.level) return 'Please select your current education level.'
      if (!form.stream) return 'Please choose a stream.'
      if (!form.institution.trim()) return 'Please enter your school / college name.'
    }
    return ''
  }

  const next = () => {
    const msg = validateStep(step)
    if (msg) {
      setError(msg)
      return
    }
    setError('')
    setStep((s) => Math.min(STEPS.length, s + 1))
  }

  const back = () => {
    setError('')
    setStep((s) => Math.max(1, s - 1))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    for (let s = 1; s <= 2; s += 1) {
      const msg = validateStep(s)
      if (msg) {
        setError(msg)
        setStep(s)
        return
      }
    }
    setError('')
    setLoading(true)
    try {
      await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
        education: {
          level: form.level,
          levelLabel: levelMeta?.label || form.level,
          stream: form.stream,
          institution: form.institution.trim(),
          board: form.board.trim(),
          currentYear: form.currentYear.trim(),
          percentage: form.percentage.trim(),
          capturedAt: new Date().toISOString(),
        },
      })
      navigate('/app', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-indigo-950/40 dark:via-gray-950 dark:to-purple-950/40"
      />
      <header className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M12 2 1 8l11 6 9-4.91V17h2V8L12 2z" />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
            EduGuide <span className="text-brand-600 dark:text-brand-400">AI</span>
          </span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="container-page flex items-center justify-center py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-2xl"
        >
          <div className="eg-card">
            <StepProgress current={step} />

            <div className="mt-6">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {STEPS[step - 1].title}
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {STEPS[step - 1].subtitle}
              </p>
            </div>

            <form onSubmit={onSubmit} className="mt-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <StepAccount key="s1" form={form} update={update} />
                )}
                {step === 2 && (
                  <StepEducation key="s2" form={form} update={update} streams={streams} />
                )}
                {step === 3 && (
                  <StepReview key="s3" form={form} levelMeta={levelMeta} />
                )}
              </AnimatePresence>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/40 dark:text-red-200"
                >
                  {error}
                </motion.p>
              )}

              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={back}
                  disabled={step === 1 || loading}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  ← Back
                </button>

                {step < STEPS.length ? (
                  <motion.button
                    type="button"
                    onClick={next}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="eg-btn-primary px-5 py-2 text-sm font-semibold"
                  >
                    Continue →
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="eg-btn-primary px-5 py-2 text-sm font-semibold disabled:opacity-60"
                  >
                    {loading ? 'Creating account…' : 'Create account'}
                  </motion.button>
                )}
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-brand-600 hover:underline dark:text-brand-400"
              >
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
            You can fine-tune interests, goals and preferences after signing in.
          </p>
        </motion.div>
      </main>
    </div>
  )
}

function StepProgress({ current }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((s, i) => {
        const done = s.id < current
        const active = s.id === current
        return (
          <div key={s.id} className="flex flex-1 items-center gap-2">
            <div className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: active ? 1.05 : 1,
                  backgroundColor: active || done ? '#4f46e5' : 'transparent',
                  color: active || done ? '#fff' : undefined,
                }}
                transition={{ duration: 0.2 }}
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                  active || done
                    ? 'border-indigo-600 text-white'
                    : 'border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400'
                }`}
              >
                {done ? '✓' : s.id}
              </motion.div>
              <p
                className={`mt-1 hidden text-[11px] font-medium sm:block ${
                  active
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {s.title}
              </p>
            </div>
            {i < STEPS.length - 1 && (
              <div className="mt-[-14px] h-0.5 flex-1 rounded-full bg-gray-200 dark:bg-gray-800 sm:mt-[-20px]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: done ? '100%' : '0%' }}
                  transition={{ duration: 0.3 }}
                  className="h-full rounded-full bg-indigo-600"
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function StepWrap({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.22 }}
      className="space-y-4"
    >
      {children}
    </motion.div>
  )
}

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
          {hint}
        </span>
      )}
    </label>
  )
}

function StepAccount({ form, update }) {
  return (
    <StepWrap>
      <Field label="Full name">
        <input
          value={form.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="Ada Lovelace"
          className="eg-input"
          autoFocus
          required
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email">
          <input
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => update({ email: e.target.value })}
            placeholder="you@example.com"
            className="eg-input"
            required
          />
        </Field>
        <Field label="Phone (optional)">
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update({ phone: e.target.value })}
            placeholder="+91 98XXXXXXXX"
            className="eg-input"
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Password" hint="At least 6 characters">
          <input
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => update({ password: e.target.value })}
            placeholder="••••••••"
            className="eg-input"
            required
          />
        </Field>
        <Field label="Confirm password">
          <input
            type="password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={(e) => update({ confirm: e.target.value })}
            placeholder="••••••••"
            className="eg-input"
            required
          />
        </Field>
      </div>
    </StepWrap>
  )
}

function StepEducation({ form, update, streams }) {
  return (
    <StepWrap>
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Current education level
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {EDUCATION_LEVELS.map((lvl) => {
            const active = form.level === lvl.value
            return (
              <button
                key={lvl.value}
                type="button"
                onClick={() => update({ level: lvl.value, stream: '' })}
                className={`flex items-start gap-3 rounded-2xl border p-3 text-left transition ${
                  active
                    ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200 dark:border-indigo-400 dark:bg-indigo-500/10 dark:ring-indigo-500/30'
                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-500/60 dark:hover:bg-indigo-500/5'
                }`}
              >
                <span className="text-xl">{lvl.icon}</span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                    {lvl.label}
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    {lvl.description}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Stream / field">
          <select
            value={form.stream}
            onChange={(e) => update({ stream: e.target.value })}
            className="eg-input"
            disabled={!form.level}
            required
          >
            <option value="">
              {form.level ? 'Select a stream' : 'Choose education level first'}
            </option>
            {streams.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="School / college / organisation">
          <input
            value={form.institution}
            onChange={(e) => update({ institution: e.target.value })}
            placeholder="e.g. DPS RK Puram, IIT Bombay"
            className="eg-input"
            required
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Board / university (optional)">
          <input
            value={form.board}
            onChange={(e) => update({ board: e.target.value })}
            placeholder="CBSE, ICSE, Mumbai Univ."
            className="eg-input"
          />
        </Field>
        <Field label="Current year / class (optional)">
          <input
            value={form.currentYear}
            onChange={(e) => update({ currentYear: e.target.value })}
            placeholder="e.g. 2nd year, Class 12"
            className="eg-input"
          />
        </Field>
        <Field label="Latest score % (optional)">
          <input
            value={form.percentage}
            onChange={(e) => update({ percentage: e.target.value })}
            placeholder="e.g. 88.5"
            className="eg-input"
            inputMode="decimal"
          />
        </Field>
      </div>

      <p className="rounded-xl bg-indigo-50 px-3 py-2 text-xs text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
        These details power your career recommendations. You can refine interests, goals and skills after signing in.
      </p>
    </StepWrap>
  )
}

function StepReview({ form, levelMeta }) {
  const rows = [
    { label: 'Name', value: form.name },
    { label: 'Email', value: form.email },
    { label: 'Phone', value: form.phone || '—' },
    { label: 'Education level', value: levelMeta?.label || form.level },
    { label: 'Stream', value: form.stream },
    { label: 'Institution', value: form.institution },
    { label: 'Board / university', value: form.board || '—' },
    { label: 'Current year / class', value: form.currentYear || '—' },
    { label: 'Latest score', value: form.percentage ? `${form.percentage}%` : '—' },
  ]
  return (
    <StepWrap>
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
        <dl className="divide-y divide-gray-200 dark:divide-gray-800">
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex items-start justify-between gap-4 bg-white px-4 py-3 dark:bg-gray-900"
            >
              <dt className="text-sm text-gray-500 dark:text-gray-400">{r.label}</dt>
              <dd className="text-right text-sm font-medium text-gray-900 dark:text-white">
                {r.value || '—'}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        By creating an account you agree to our terms and acknowledge this is a demo app — details are stored locally in your browser.
      </p>
    </StepWrap>
  )
}
