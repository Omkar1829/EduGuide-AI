import { motion } from 'framer-motion'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCourseById } from '../data/courses'
import { useLearning } from '../context/LearningContext'
import {
  BookmarkIcon,
  CheckIcon,
  ChevronLeftIcon,
  ClockIcon,
  PlayIcon,
  StarIcon,
} from '../components/icons'

export default function CourseDetail() {
  const { courseId } = useParams()
  const course = getCourseById(courseId)
  const navigate = useNavigate()
  const {
    isEnrolled,
    enroll,
    unenroll,
    isBookmarked,
    toggleBookmark,
    isLessonComplete,
    progressFor,
  } = useLearning()

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Course not found
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          The course you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link to="/app/courses" className="eg-btn-primary mt-6 inline-flex">
          Back to courses
        </Link>
      </div>
    )
  }

  const enrolled = isEnrolled(course.id)
  const bookmarked = isBookmarked(course.id)
  const progress = progressFor(course.id)

  const startFirstLesson = () => {
    const firstIncomplete =
      course.lessons.find((l) => !isLessonComplete(course.id, l.id)) || course.lessons[0]
    if (!enrolled) enroll(course.id)
    navigate(`/app/courses/${course.id}/lessons/${firstIncomplete.id}`)
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ChevronLeftIcon className="h-4 w-4" /> Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${course.color} p-8 text-white shadow-md`}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              <span className="rounded-full bg-white/20 px-2 py-0.5 backdrop-blur">
                {course.category}
              </span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 backdrop-blur">
                {course.level}
              </span>
              <span className="inline-flex items-center gap-1">
                <ClockIcon className="h-3.5 w-3.5" /> {course.durationHours}h
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-bold">{course.title}</h1>
            <p className="mt-2 max-w-2xl text-indigo-50/90">
              {course.tagline}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-indigo-50/90">
              <span className="inline-flex items-center gap-1">
                <StarIcon className="h-4 w-4 text-yellow-300" />
                {course.rating.toFixed(1)} • {course.students.toLocaleString()} students
              </span>
              <span>
                Taught by <strong>{course.instructor.name}</strong>
              </span>
            </div>
          </div>
          <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-5xl backdrop-blur">
            {course.emoji}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <motion.button
            type="button"
            onClick={startFirstLesson}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 shadow-md transition-shadow hover:shadow-lg"
          >
            <PlayIcon className="h-4 w-4" />
            {enrolled ? (progress > 0 ? 'Continue learning' : 'Start learning') : 'Enroll and start'}
          </motion.button>

          {enrolled ? (
            <button
              type="button"
              onClick={() => unenroll(course.id)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
            >
              Unenroll
            </button>
          ) : (
            <button
              type="button"
              onClick={() => enroll(course.id)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
            >
              Enroll for free
            </button>
          )}

          <button
            type="button"
            onClick={() => toggleBookmark(course.id)}
            aria-pressed={bookmarked}
            className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
          >
            <BookmarkIcon filled={bookmarked} className="h-4 w-4" />
            {bookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>
        </div>

        {enrolled && (
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-indigo-50/90">
              <span>Your progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6 }}
                className="h-full bg-white"
              />
            </div>
          </div>
        )}
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <section className="eg-card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              About this course
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {course.description}
            </p>
          </section>

          <section className="eg-card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              What you&apos;ll learn
            </h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {course.outcomes.map((o) => (
                <li
                  key={o}
                  className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="eg-card">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Curriculum
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {course.lessons.length} lessons
              </span>
            </div>
            <ol className="mt-3 divide-y divide-gray-200 dark:divide-gray-700">
              {course.lessons.map((lesson, idx) => {
                const done = isLessonComplete(course.id, lesson.id)
                return (
                  <li key={lesson.id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (!enrolled) enroll(course.id)
                        navigate(`/app/courses/${course.id}/lessons/${lesson.id}`)
                      }}
                      className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40"
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                          done
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {done ? <CheckIcon className="h-4 w-4" /> : idx + 1}
                      </span>
                      <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white">
                        {lesson.title}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {lesson.duration}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="eg-card">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Instructor
            </h3>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-semibold text-white">
                {course.instructor.name
                  .split(' ')
                  .map((s) => s[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {course.instructor.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {course.instructor.role}
                </p>
              </div>
            </div>
          </section>

          <section className="eg-card">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Course details
            </h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Duration</dt>
                <dd className="text-gray-900 dark:text-white">
                  {course.durationHours} hours
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Lessons</dt>
                <dd className="text-gray-900 dark:text-white">
                  {course.lessons.length}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Level</dt>
                <dd className="text-gray-900 dark:text-white">{course.level}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Certificate</dt>
                <dd className="text-gray-900 dark:text-white">On completion</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  )
}
