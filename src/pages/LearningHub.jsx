import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useGames } from '../context/GamesContext'
import { useLearning } from '../context/LearningContext'
import { useVault } from '../context/VaultContext'
import { useActivity } from '../context/ActivityContext'
import { COURSES } from '../data/courses'
import { computeBadges } from '../data/badges'
import {
  activeDayCount,
  currentStreak,
  myResultsOf,
  peerPercentile,
  proficiencyMap,
  skillRadar,
  topicHeatmap,
} from '../utils/proficiency'
import ProficiencyMap from '../components/learning/ProficiencyMap'
import SkillRadar from '../components/learning/SkillRadar'
import CareerFitScorecard from '../components/learning/CareerFitScorecard'
import StudyPlan from '../components/learning/StudyPlan'
import StrengthsHeatmap from '../components/learning/StrengthsHeatmap'
import BadgesGrid from '../components/learning/BadgesGrid'
import PeerPercentile from '../components/learning/PeerPercentile'
import MockInterview from '../components/learning/MockInterview'
import AINudges from '../components/learning/AINudges'

export default function LearningHub() {
  const { user } = useAuth()
  const { results } = useGames()
  const { enrollments } = useLearning()
  const { documents } = useVault()
  const { goals } = useActivity()

  const stream = user?.education?.stream
  const userId = user?.id

  const myResults = useMemo(() => myResultsOf(results, userId), [results, userId])

  const proficiency = useMemo(() => proficiencyMap(myResults), [myResults])

  const lessonsCompleted = useMemo(() => {
    return Object.values(enrollments || {}).reduce(
      (a, e) => a + (e?.completedLessons?.length || 0),
      0,
    )
  }, [enrollments])
  const enrolledCount = Object.keys(enrollments || {}).length
  const documentsCount = documents?.length ?? 0

  const activityTimestamps = useMemo(() => {
    const fromGames = myResults.map((r) => r.ts).filter(Boolean)
    return fromGames
  }, [myResults])
  const activeDays = activeDayCount(activityTimestamps)
  const streak = currentStreak(activityTimestamps)

  const radar = useMemo(
    () =>
      skillRadar({
        myResults,
        enrolledCount,
        lessonsCompleted,
        documentsCount,
        activeDays,
      }),
    [myResults, enrolledCount, lessonsCompleted, documentsCount, activeDays],
  )

  const heatmap = useMemo(() => topicHeatmap(myResults), [myResults])

  const badges = useMemo(() => {
    const subjectsPlayed = new Set(myResults.map((r) => r.subjectId)).size
    const totalScore = myResults.reduce((a, r) => a + (r.score ?? 0), 0)
    const peer = peerPercentile({ results, stream, userId })
    return computeBadges({
      myResults,
      activeDays,
      subjectsPlayed,
      enrolledCount,
      lessonsCompleted,
      documentsCount,
      totalScore,
      goalsSet: goals.length,
      rank: peer.rank,
      totalInStream: peer.total,
    })
  }, [myResults, activeDays, enrolledCount, lessonsCompleted, documentsCount, goals.length, results, stream, userId])

  const peer = useMemo(
    () => peerPercentile({ results, stream, userId }),
    [results, stream, userId],
  )

  const weakSubjects = useMemo(
    () =>
      proficiency
        .filter((p) => !p.untouched && p.accuracy < 70)
        .slice(0, 4)
        .map((p) => ({ name: p.name, subjectId: p.subjectId })),
    [proficiency],
  )

  const completedCourses = COURSES.filter((c) => {
    const enr = enrollments[c.id]
    if (!enr) return false
    const total = c.lessons.length || 1
    return (enr.completedLessons?.length || 0) >= total
  })

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl bg-gradient-to-br from-brand-100 via-mint-100 to-peach-100 p-6 dark:from-brand-900/40 dark:via-mint-500/10 dark:to-peach-500/10"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">
          Learning Hub
        </p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Hi {user?.name?.split(' ')[0] || 'there'} — here's where you are 👋
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-700 dark:text-gray-200">
          Proficiency, skill balance, career fit, and a 7-day plan — all auto-tuned to your activity. Need to ask a quick question? Use the floating chat in the bottom-right.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <Link
            to="/app/games"
            className="rounded-full bg-white/80 px-3 py-1.5 font-semibold text-brand-700 shadow-soft hover:bg-white dark:bg-gray-900/40 dark:text-brand-200"
          >
            🎮 Play a round
          </Link>
          <Link
            to="/app/quiz"
            className="rounded-full bg-white/80 px-3 py-1.5 font-semibold text-brand-700 shadow-soft hover:bg-white dark:bg-gray-900/40 dark:text-brand-200"
          >
            🧠 Adaptive quiz
          </Link>
          <Link
            to="/app/resume"
            className="rounded-full bg-white/80 px-3 py-1.5 font-semibold text-brand-700 shadow-soft hover:bg-white dark:bg-gray-900/40 dark:text-brand-200"
          >
            📄 Build resume
          </Link>
          <Link
            to="/app/leaderboard"
            className="rounded-full bg-white/80 px-3 py-1.5 font-semibold text-brand-700 shadow-soft hover:bg-white dark:bg-gray-900/40 dark:text-brand-200"
          >
            🏆 See leaderboard
          </Link>
        </div>
      </motion.section>

      <AINudges proficiency={proficiency} peer={peer} currentStreak={streak} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ProficiencyMap rows={proficiency} />
        <SkillRadar data={radar} />
      </div>

      <CareerFitScorecard myResults={myResults} stream={stream} />

      <div className="grid gap-6 lg:grid-cols-2">
        <StudyPlan weakSubjects={weakSubjects} storageKey={`eduguide-plan:${userId || 'guest'}`} />
        <StrengthsHeatmap heatmap={heatmap} />
      </div>

      <BadgesGrid badges={badges} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MockInterview stream={stream} />
        </div>
        <PeerPercentile data={peer} stream={stream} />
      </div>

      {completedCourses.length > 0 && (
        <section className="eg-card">
          <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Courses you've completed
          </h2>
          <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
            Show these off in your resume — pull them in automatically with one click.
          </p>
          <div className="flex flex-wrap gap-2">
            {completedCourses.map((c) => (
              <span
                key={c.id}
                className="rounded-full bg-mint-50 px-3 py-1 text-xs font-medium text-mint-700 dark:bg-mint-500/15 dark:text-mint-300"
              >
                {c.title}
              </span>
            ))}
          </div>
          <Link
            to="/app/resume"
            className="mt-3 inline-flex items-center text-xs font-semibold text-brand-600 hover:underline dark:text-brand-400"
          >
            Generate resume →
          </Link>
        </section>
      )}
    </div>
  )
}
