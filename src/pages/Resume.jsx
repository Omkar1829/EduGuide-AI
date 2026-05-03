import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useGames } from '../context/GamesContext'
import { useLearning } from '../context/LearningContext'
import { useVault } from '../context/VaultContext'
import { COURSES } from '../data/courses'
import { CAREER_ROLES, rolesForStream } from '../data/careers'
import {
  myResultsOf,
  peerPercentile,
  proficiencyMap,
} from '../utils/proficiency'
import {
  DownloadIcon,
  FileTextIcon,
  PencilIcon,
  PlusIcon,
  SparkleIcon,
  TrashIcon,
} from '../components/icons'

const STORAGE_PREFIX = 'eduguide-resume:'

const TEMPLATES = [
  {
    id: 'classic',
    label: 'Classic',
    description: 'Single column, serif feel — works well for academic/CV uploads.',
  },
  {
    id: 'modern',
    label: 'Modern',
    description: 'Two columns, accent sidebar — pops on a portfolio site.',
  },
]

function load(userId) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + (userId || 'guest'))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function save(userId, state) {
  try {
    localStorage.setItem(STORAGE_PREFIX + (userId || 'guest'), JSON.stringify(state))
  } catch {
    // ignore quota
  }
}

function buildAutoFill({ user, proficiency, completedCourses, documents, peer, results }) {
  const stream = user?.education?.stream
  const topRoles = (rolesForStream(stream).length > 0 ? rolesForStream(stream) : CAREER_ROLES)
    .slice(0, 1)
  const objective = topRoles[0]
    ? `Aspiring ${topRoles[0].title.toLowerCase()} with a strong foundation in ${topRoles[0].coreSubjects.join(', ')}. Currently building proficiency through hands-on practice on EduGuide AI.`
    : 'Curious learner blending consistent practice with real-world projects.'

  const skills = proficiency
    .filter((p) => !p.untouched)
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 8)
    .map((p) => `${p.name} (${p.accuracy}%)`)

  const education = []
  const ed = user?.education
  if (ed) {
    education.push({
      institution: ed.institution || 'Institution',
      degree:
        ed.level === 'School'
          ? `${ed.currentClass || 'Class XII'} · ${ed.board || 'Board'}`
          : `${ed.level || 'Graduation'}${ed.stream ? ` · ${ed.stream}` : ''}`,
      year: ed.year || '',
      score: ed.scorePercent ? `${ed.scorePercent}%` : '',
    })
  }

  const certifications = (documents || [])
    .filter((d) => d.category === 'Certifications')
    .slice(0, 6)
    .map((d) => d.name.replace(/\.[a-z0-9]+$/i, ''))

  const achievements = []
  if (peer?.percentile != null) {
    achievements.push(
      `Top ${Math.max(1, 100 - peer.percentile + 1)}% of ${stream || 'stream'} on EduGuide leaderboard (rank ${peer.rank}/${peer.total}).`,
    )
  }
  const totalScore = results.reduce((a, r) => a + (r.score ?? 0), 0)
  if (totalScore > 0) {
    achievements.push(`Earned ${totalScore} cumulative points across ${results.length} game rounds.`)
  }
  if (completedCourses.length > 0) {
    achievements.push(
      `Completed ${completedCourses.length} courses on EduGuide AI: ${completedCourses
        .slice(0, 3)
        .map((c) => c.title)
        .join(', ')}.`,
    )
  }

  return {
    name: user?.name || 'Your Name',
    role: topRoles[0]?.title || 'Student',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.education?.institution || '',
    objective,
    skills,
    education,
    certifications,
    achievements,
    projects: [
      {
        title: 'EduGuide AI activity portfolio',
        bullets: [
          `Built proficiency across ${proficiency.filter((p) => !p.untouched).length} subjects through adaptive practice rounds.`,
          'Maintained an ongoing streak of self-directed quizzes, lessons, and document uploads.',
        ],
      },
    ],
  }
}

function ClassicTemplate({ data }) {
  return (
    <div className="bg-white p-8 font-serif text-gray-900 print:p-6">
      <header className="border-b border-gray-300 pb-3">
        <h1 className="text-3xl font-bold tracking-tight">{data.name}</h1>
        <p className="mt-1 text-sm text-gray-600">{data.role}</p>
        <p className="mt-1 text-xs text-gray-500">
          {[data.email, data.phone, data.location].filter(Boolean).join('  ·  ')}
        </p>
      </header>
      {data.objective && (
        <Section title="Objective">
          <p className="text-sm leading-relaxed">{data.objective}</p>
        </Section>
      )}
      {data.skills?.length > 0 && (
        <Section title="Skills">
          <p className="text-sm leading-relaxed">{data.skills.join(' • ')}</p>
        </Section>
      )}
      {data.education?.length > 0 && (
        <Section title="Education">
          <ul className="space-y-2">
            {data.education.map((e, i) => (
              <li key={i}>
                <p className="text-sm font-semibold">{e.institution}</p>
                <p className="text-xs text-gray-600">
                  {e.degree}
                  {e.year ? ` · ${e.year}` : ''}
                  {e.score ? ` · ${e.score}` : ''}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}
      {data.projects?.length > 0 && (
        <Section title="Projects">
          {data.projects.map((p, i) => (
            <div key={i} className="mb-2">
              <p className="text-sm font-semibold">{p.title}</p>
              <ul className="ml-4 list-disc text-xs text-gray-700">
                {(p.bullets || []).map((b, bi) => (
                  <li key={bi}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}
      {data.certifications?.length > 0 && (
        <Section title="Certifications">
          <ul className="ml-4 list-disc text-xs">
            {data.certifications.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </Section>
      )}
      {data.achievements?.length > 0 && (
        <Section title="Achievements">
          <ul className="ml-4 list-disc text-xs">
            {data.achievements.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  )
}

function ModernTemplate({ data }) {
  return (
    <div className="bg-white text-gray-900 print:p-0">
      <div className="grid grid-cols-[35%_65%]">
        <aside className="bg-gradient-to-br from-brand-600 to-purple-600 p-6 text-white">
          <h1 className="text-2xl font-bold leading-tight">{data.name}</h1>
          <p className="mt-1 text-sm opacity-90">{data.role}</p>
          <div className="mt-4 space-y-1 text-[11px] opacity-95">
            {data.email && <p>✉️ {data.email}</p>}
            {data.phone && <p>📱 {data.phone}</p>}
            {data.location && <p>📍 {data.location}</p>}
          </div>
          {data.skills?.length > 0 && (
            <div className="mt-5">
              <h2 className="text-xs font-bold uppercase tracking-wide opacity-90">
                Skills
              </h2>
              <ul className="mt-2 space-y-1.5">
                {data.skills.map((s, i) => (
                  <li
                    key={i}
                    className="rounded-md bg-white/15 px-2 py-1 text-[11px] backdrop-blur"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {data.certifications?.length > 0 && (
            <div className="mt-5">
              <h2 className="text-xs font-bold uppercase tracking-wide opacity-90">
                Certifications
              </h2>
              <ul className="mt-2 list-disc pl-4 text-[11px]">
                {data.certifications.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>
        <main className="p-6">
          {data.objective && (
            <Section title="Objective" mono>
              <p className="text-sm leading-relaxed">{data.objective}</p>
            </Section>
          )}
          {data.education?.length > 0 && (
            <Section title="Education" mono>
              <ul className="space-y-2">
                {data.education.map((e, i) => (
                  <li key={i}>
                    <p className="text-sm font-semibold">{e.institution}</p>
                    <p className="text-xs text-gray-600">
                      {e.degree}
                      {e.year ? ` · ${e.year}` : ''}
                      {e.score ? ` · ${e.score}` : ''}
                    </p>
                  </li>
                ))}
              </ul>
            </Section>
          )}
          {data.projects?.length > 0 && (
            <Section title="Projects" mono>
              {data.projects.map((p, i) => (
                <div key={i} className="mb-2">
                  <p className="text-sm font-semibold">{p.title}</p>
                  <ul className="ml-4 list-disc text-xs text-gray-700">
                    {(p.bullets || []).map((b, bi) => (
                      <li key={bi}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </Section>
          )}
          {data.achievements?.length > 0 && (
            <Section title="Achievements" mono>
              <ul className="ml-4 list-disc text-xs">
                {data.achievements.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </Section>
          )}
        </main>
      </div>
    </div>
  )
}

function Section({ title, children, mono }) {
  return (
    <section className="mt-4">
      <h2
        className={`text-xs font-bold uppercase tracking-[0.2em] text-brand-700 ${mono ? '' : 'border-b border-gray-200 pb-1'}`}
      >
        {title}
      </h2>
      <div className="mt-2">{children}</div>
    </section>
  )
}

export default function ResumeBuilder() {
  const { user } = useAuth()
  const { results } = useGames()
  const { enrollments } = useLearning()
  const { documents } = useVault()
  const userId = user?.id

  const myResults = useMemo(() => myResultsOf(results, userId), [results, userId])
  const proficiency = useMemo(() => proficiencyMap(myResults), [myResults])
  const peer = useMemo(
    () => peerPercentile({ results, stream: user?.education?.stream, userId }),
    [results, user?.education?.stream, userId],
  )
  const completedCourses = useMemo(() => {
    return COURSES.filter((c) => {
      const enr = enrollments[c.id]
      if (!enr) return false
      const total = c.lessons.length || 1
      return (enr.completedLessons?.length || 0) >= total
    })
  }, [enrollments])

  const auto = useMemo(
    () =>
      buildAutoFill({
        user,
        proficiency,
        completedCourses,
        documents,
        peer,
        results: myResults,
      }),
    [user, proficiency, completedCourses, documents, peer, myResults],
  )

  const [data, setData] = useState(() => load(userId) || auto)
  const [template, setTemplate] = useState('modern')
  const [editing, setEditing] = useState(false)

  // If no saved resume, keep the auto-filled view in sync with new activity.
  useEffect(() => {
    if (!load(userId)) setData(auto)
  }, [auto, userId])

  useEffect(() => {
    save(userId, data)
  }, [data, userId])

  const resetToAuto = () => {
    setData(auto)
  }

  const downloadPdf = () => {
    window.print()
  }

  const shareLink = () => {
    const link = `${window.location.origin}/app/resume?u=${encodeURIComponent(userId || 'guest')}`
    navigator.clipboard?.writeText(link).catch(() => {})
    alert(`Share link copied to clipboard:\n${link}`)
  }

  const exportPortfolio = () => {
    const blob = new Blob([JSON.stringify({ data, generatedAt: new Date().toISOString() }, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(data.name || 'portfolio').replace(/\s+/g, '_')}_portfolio.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-br from-brand-100 via-mint-100 to-peach-100 p-6 dark:from-brand-900/40 dark:via-mint-500/10 dark:to-peach-500/10"
      >
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">
          <SparkleIcon className="h-3.5 w-3.5" /> Resume Builder
        </p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          A resume that updates as you learn
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-700 dark:text-gray-200">
          Auto-filled from your profile, vault, proficiency, and leaderboard rank. Tweak anything in the editor on the left, pick a template, and print or export when you're ready.
        </p>
      </motion.section>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr] print:block">
        <div className="space-y-4 print:hidden">
          <section className="eg-card">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <FileTextIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" /> Template
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplate(t.id)}
                  className={`rounded-xl border p-3 text-left text-xs transition-colors ${
                    template === t.id
                      ? 'border-brand-500 bg-brand-50 text-brand-800 dark:border-brand-400 dark:bg-brand-900/30 dark:text-brand-200'
                      : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                  }`}
                >
                  <p className="text-sm font-semibold">{t.label}</p>
                  <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                    {t.description}
                  </p>
                </button>
              ))}
            </div>
          </section>

          <section className="eg-card">
            <h2 className="mb-3 flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-white">
              <span className="flex items-center gap-2">
                <PencilIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" /> Edit
              </span>
              <button
                type="button"
                onClick={() => setEditing((v) => !v)}
                className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
              >
                {editing ? 'Collapse' : 'Expand'}
              </button>
            </h2>
            {editing ? (
              <Editor data={data} setData={setData} />
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Click <strong>Expand</strong> to edit name, objective, skills, education, projects, certifications and achievements directly.
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={resetToAuto}
                className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200"
              >
                ↺ Re-fill from activity
              </button>
            </div>
          </section>

          <section className="eg-card">
            <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              Export
            </h2>
            <div className="space-y-2 text-sm">
              <button
                type="button"
                onClick={downloadPdf}
                className="eg-btn-primary flex w-full items-center justify-center gap-2"
              >
                <DownloadIcon className="h-4 w-4" /> Download as PDF (print)
              </button>
              <button
                type="button"
                onClick={shareLink}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                🔗 Copy share link
              </button>
              <button
                type="button"
                onClick={exportPortfolio}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                📦 Export portfolio JSON
              </button>
            </div>
            <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
              Tip: in the print dialog choose "Save as PDF" for a clean export.
            </p>
          </section>
        </div>

        <motion.div
          key={template}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="resume-preview overflow-hidden rounded-2xl border border-gray-200 shadow-soft dark:border-gray-700 print:rounded-none print:border-0 print:shadow-none"
        >
          {template === 'classic' ? <ClassicTemplate data={data} /> : <ModernTemplate data={data} />}
        </motion.div>
      </div>
    </div>
  )
}

function Editor({ data, setData }) {
  const set = (key, value) => setData((d) => ({ ...d, [key]: value }))

  const updateList = (key, idx, value) =>
    setData((d) => ({
      ...d,
      [key]: d[key].map((v, i) => (i === idx ? value : v)),
    }))

  const removeFromList = (key, idx) =>
    setData((d) => ({ ...d, [key]: d[key].filter((_, i) => i !== idx) }))

  const addToList = (key, value) =>
    setData((d) => ({ ...d, [key]: [...(d[key] || []), value] }))

  return (
    <div className="space-y-3 text-xs">
      <Field label="Name">
        <input className="eg-input" value={data.name} onChange={(e) => set('name', e.target.value)} />
      </Field>
      <Field label="Headline / Role">
        <input className="eg-input" value={data.role} onChange={(e) => set('role', e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Email">
          <input className="eg-input" value={data.email} onChange={(e) => set('email', e.target.value)} />
        </Field>
        <Field label="Phone">
          <input className="eg-input" value={data.phone} onChange={(e) => set('phone', e.target.value)} />
        </Field>
      </div>
      <Field label="Location / Institution">
        <input className="eg-input" value={data.location} onChange={(e) => set('location', e.target.value)} />
      </Field>
      <Field label="Objective">
        <textarea
          rows={3}
          className="eg-input"
          value={data.objective}
          onChange={(e) => set('objective', e.target.value)}
        />
      </Field>

      <ListBlock
        label="Skills"
        items={data.skills}
        onUpdate={(i, v) => updateList('skills', i, v)}
        onRemove={(i) => removeFromList('skills', i)}
        onAdd={() => addToList('skills', '')}
      />
      <ListBlock
        label="Certifications"
        items={data.certifications}
        onUpdate={(i, v) => updateList('certifications', i, v)}
        onRemove={(i) => removeFromList('certifications', i)}
        onAdd={() => addToList('certifications', '')}
      />
      <ListBlock
        label="Achievements"
        items={data.achievements}
        onUpdate={(i, v) => updateList('achievements', i, v)}
        onRemove={(i) => removeFromList('achievements', i)}
        onAdd={() => addToList('achievements', '')}
      />

      <details className="rounded-xl border border-gray-200 p-2 dark:border-gray-700">
        <summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
          Education entries ({data.education?.length || 0})
        </summary>
        <div className="mt-2 space-y-3">
          {(data.education || []).map((e, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-2 dark:border-gray-700">
              <input
                className="eg-input"
                value={e.institution}
                onChange={(ev) => updateList('education', i, { ...e, institution: ev.target.value })}
                placeholder="Institution"
              />
              <input
                className="eg-input mt-1"
                value={e.degree}
                onChange={(ev) => updateList('education', i, { ...e, degree: ev.target.value })}
                placeholder="Degree / Programme"
              />
              <div className="mt-1 grid grid-cols-2 gap-1.5">
                <input
                  className="eg-input"
                  value={e.year}
                  onChange={(ev) => updateList('education', i, { ...e, year: ev.target.value })}
                  placeholder="Year"
                />
                <input
                  className="eg-input"
                  value={e.score}
                  onChange={(ev) => updateList('education', i, { ...e, score: ev.target.value })}
                  placeholder="Score"
                />
              </div>
              <button
                type="button"
                onClick={() => removeFromList('education', i)}
                className="mt-1 inline-flex items-center gap-1 text-[11px] text-rose-500"
              >
                <TrashIcon className="h-3 w-3" /> Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              addToList('education', { institution: '', degree: '', year: '', score: '' })
            }
            className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
          >
            <PlusIcon className="h-3 w-3" /> Add education
          </button>
        </div>
      </details>

      <details className="rounded-xl border border-gray-200 p-2 dark:border-gray-700">
        <summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
          Projects ({data.projects?.length || 0})
        </summary>
        <div className="mt-2 space-y-3">
          {(data.projects || []).map((p, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-2 dark:border-gray-700">
              <input
                className="eg-input"
                value={p.title}
                onChange={(ev) => updateList('projects', i, { ...p, title: ev.target.value })}
                placeholder="Project title"
              />
              <textarea
                className="eg-input mt-1"
                rows={3}
                value={(p.bullets || []).join('\n')}
                onChange={(ev) =>
                  updateList('projects', i, {
                    ...p,
                    bullets: ev.target.value.split('\n').filter(Boolean),
                  })
                }
                placeholder="One bullet per line"
              />
              <button
                type="button"
                onClick={() => removeFromList('projects', i)}
                className="mt-1 inline-flex items-center gap-1 text-[11px] text-rose-500"
              >
                <TrashIcon className="h-3 w-3" /> Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addToList('projects', { title: '', bullets: [''] })}
            className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
          >
            <PlusIcon className="h-3 w-3" /> Add project
          </button>
        </div>
      </details>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <div className="mt-0.5">{children}</div>
    </label>
  )
}

function ListBlock({ label, items = [], onUpdate, onRemove, onAdd }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <div className="mt-1 space-y-1">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <input
              className="eg-input"
              value={it}
              onChange={(e) => onUpdate(i, e.target.value)}
            />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="text-rose-500 hover:text-rose-600"
              aria-label="Remove"
            >
              <TrashIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
        >
          <PlusIcon className="h-3 w-3" /> Add
        </button>
      </div>
    </div>
  )
}
