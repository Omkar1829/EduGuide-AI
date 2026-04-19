import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCourseById } from '../data/courses'
import { useLearning } from '../context/LearningContext'
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
} from '../components/icons'

export default function Lesson() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const course = getCourseById(courseId)
  const {
    enroll,
    isEnrolled,
    toggleLesson,
    isLessonComplete,
    progressFor,
  } = useLearning()

  useEffect(() => {
    if (course && !isEnrolled(course.id)) {
      enroll(course.id)
    }
  }, [course, enroll, isEnrolled])

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Lesson not found
        </h1>
        <Link to="/app/courses" className="eg-btn-primary mt-6 inline-flex">
          Back to courses
        </Link>
      </div>
    )
  }

  const index = course.lessons.findIndex((l) => l.id === lessonId)
  if (index === -1) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Lesson not found
        </h1>
        <Link to={`/app/courses/${course.id}`} className="eg-btn-primary mt-6 inline-flex">
          Back to course
        </Link>
      </div>
    )
  }

  const lesson = course.lessons[index]
  const prev = course.lessons[index - 1]
  const next = course.lessons[index + 1]
  const complete = isLessonComplete(course.id, lesson.id)
  const progress = progressFor(course.id)

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Link
          to={`/app/courses/${course.id}`}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          {course.title}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="eg-card overflow-hidden p-0"
        >
          <div
            className={`flex aspect-video items-center justify-center bg-gradient-to-br ${course.color} text-white`}
          >
            <div className="flex flex-col items-center gap-3">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                <PlayIcon className="h-6 w-6" />
              </span>
              <p className="text-sm opacity-80">
                Lesson {index + 1} of {course.lessons.length} • {lesson.duration}
              </p>
            </div>
          </div>

          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {lesson.title}
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              A short, focused lesson from <strong>{course.title}</strong>.
            </p>

            <div className="prose prose-sm mt-6 max-w-none text-gray-700 dark:prose-invert dark:text-gray-300">
              <p>
                In this lesson, you&apos;ll explore <em>{lesson.title.toLowerCase()}</em>{' '}
                through a mix of short explanations, examples and a mini-exercise.
              </p>
              <p>
                We build everything from intuition first, then move to the formal
                definition. When you feel ready, mark the lesson complete below
                and continue to the next one.
              </p>
              <h3>Key takeaways</h3>
              <ul>
                <li>Understand the core idea in plain English.</li>
                <li>See how it applies to a real example.</li>
                <li>Practice with a quick exercise before moving on.</li>
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <motion.button
                type="button"
                onClick={() => toggleLesson(course.id, lesson.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={
                  complete
                    ? 'inline-flex items-center gap-2 rounded-xl border border-emerald-500 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-400 dark:bg-emerald-900/30 dark:text-emerald-200'
                    : 'eg-btn-primary px-4 py-2.5 text-sm font-semibold'
                }
              >
                <CheckIcon className="h-4 w-4" />
                {complete ? 'Marked complete' : 'Mark as complete'}
              </motion.button>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  disabled={!prev}
                  onClick={() =>
                    prev && navigate(`/app/courses/${course.id}/lessons/${prev.id}`)
                  }
                  className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  Previous
                </button>
                <button
                  type="button"
                  disabled={!next}
                  onClick={() => {
                    if (!complete) toggleLesson(course.id, lesson.id)
                    if (next) navigate(`/app/courses/${course.id}/lessons/${next.id}`)
                  }}
                  className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Next
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <aside className="space-y-4">
        <section className="eg-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Course progress
            </h3>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {progress}%
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            />
          </div>
        </section>

        <section className="eg-card">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            All lessons
          </h3>
          <ol className="mt-3 space-y-1">
            {course.lessons.map((l, i) => {
              const done = isLessonComplete(course.id, l.id)
              const active = l.id === lesson.id
              return (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/app/courses/${course.id}/lessons/${l.id}`)}
                    className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors ${
                      active
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        done
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {done ? <CheckIcon className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    <span className="flex-1 truncate">{l.title}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {l.duration}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </section>
      </aside>
    </div>
  )
}
