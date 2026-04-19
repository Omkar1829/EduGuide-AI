import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CATEGORIES, COURSES, LEVELS } from '../data/courses'
import CourseCard from '../components/CourseCard'
import { SearchIcon } from '../components/icons'

export default function Courses() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [level, setLevel] = useState('All')

  const filtered = useMemo(() => {
    return COURSES.filter((c) => {
      if (category !== 'All' && c.category !== category) return false
      if (level !== 'All' && c.level !== level) return false
      if (query) {
        const q = query.toLowerCase()
        if (
          !c.title.toLowerCase().includes(q) &&
          !c.tagline.toLowerCase().includes(q) &&
          !c.category.toLowerCase().includes(q)
        ) {
          return false
        }
      }
      return true
    })
  }, [query, category, level])

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-white">
          Explore courses
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Handpicked courses taught by real educators.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="eg-card space-y-4 p-4 sm:p-5"
      >
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, topic or category…"
            className="eg-input pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                category === c
                  ? 'border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Level:
          </span>
          {['All', ...LEVELS].map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLevel(l)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                level === l
                  ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-900/30 dark:text-brand-200'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-white'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </motion.div>

      {filtered.length === 0 ? (
        <div className="eg-card text-center">
          <p className="text-gray-600 dark:text-gray-300">
            No courses match your filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setCategory('All')
              setLevel('All')
            }}
            className="eg-btn-ghost mt-3"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c, i) => (
            <CourseCard key={c.id} course={c} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
