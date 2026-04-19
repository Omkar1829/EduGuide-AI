import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLearning } from '../context/LearningContext'
import { COURSES } from '../data/courses'
import CourseCard from '../components/CourseCard'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const { enrollments, bookmarks, progressFor } = useLearning()

  const [name, setName] = useState(user?.name || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [saved, setSaved] = useState(false)

  const enrolledCourses = Object.keys(enrollments)
    .map((id) => COURSES.find((c) => c.id === id))
    .filter(Boolean)
  const bookmarkedCourses = Object.keys(bookmarks)
    .filter((id) => bookmarks[id])
    .map((id) => COURSES.find((c) => c.id === id))
    .filter(Boolean)
  const completedCount = enrolledCourses.filter((c) => progressFor(c.id) === 100).length

  const save = (e) => {
    e.preventDefault()
    updateProfile({ name, bio })
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  const initials = (user?.name || user?.email || '?')
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-white">
          Profile
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your account and review your learning.
        </p>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="eg-card"
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-xl font-semibold text-white shadow-md">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {user?.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Joined {new Date(user?.joinedAt || Date.now()).toLocaleDateString()} •
              Plan: <span className="font-medium text-gray-700 dark:text-gray-200">{user?.plan}</span>
            </p>
          </div>
          <div className="ml-auto grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Enrolled', value: enrolledCourses.length },
              { label: 'Completed', value: completedCount },
              { label: 'Saved', value: bookmarkedCourses.length },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-gray-200 px-3 py-2 dark:border-gray-700"
              >
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {s.value}
                </p>
                <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <section className="eg-card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Edit profile
        </h2>
        <form onSubmit={save} className="mt-4 space-y-4">
          <div>
            <label htmlFor="p-name" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full name
            </label>
            <input
              id="p-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="eg-input"
            />
          </div>
          <div>
            <label htmlFor="p-bio" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Bio
            </label>
            <textarea
              id="p-bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a bit about yourself…"
              className="eg-input"
            />
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="eg-btn-primary px-4 py-2 text-sm">
              Save changes
            </button>
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-emerald-600 dark:text-emerald-400"
              >
                Saved!
              </motion.span>
            )}
          </div>
        </form>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
          My courses
        </h2>
        {enrolledCourses.length === 0 ? (
          <div className="eg-card text-sm text-gray-500 dark:text-gray-400">
            You haven&apos;t enrolled in any courses yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((c, i) => (
              <CourseCard key={c.id} course={c} index={i} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
          Bookmarked
        </h2>
        {bookmarkedCourses.length === 0 ? (
          <div className="eg-card text-sm text-gray-500 dark:text-gray-400">
            Nothing bookmarked yet. Tap the bookmark icon on a course card to save it.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarkedCourses.map((c, i) => (
              <CourseCard key={c.id} course={c} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
