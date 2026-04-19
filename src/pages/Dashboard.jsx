import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLearning } from '../context/LearningContext'
import { COURSES } from '../data/courses'
import CourseCard from '../components/CourseCard'
import { BookIcon, FireIcon, TrophyIcon } from '../components/icons'

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
        {hint && (
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{hint}</p>
        )}
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const { enrollments, progressFor } = useLearning()

  const enrolledCourses = Object.keys(enrollments)
    .map((id) => COURSES.find((c) => c.id === id))
    .filter(Boolean)

  const inProgress = enrolledCourses.filter((c) => progressFor(c.id) < 100)
  const completed = enrolledCourses.filter((c) => progressFor(c.id) === 100)

  const recommendations = COURSES.filter((c) => !enrollments[c.id]).slice(0, 3)

  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="mx-auto max-w-7xl space-y-8">
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
          Pick up where you left off — small steps, every day.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Enrolled courses"
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
      </div>

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

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recommended for you
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Based on what students like you are learning.
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
