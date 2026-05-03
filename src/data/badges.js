// Badge definitions and a `computeBadges` helper that derives unlocked
// achievements from existing data sources (games results, learning state,
// vault uploads). Keeping it derivation-based means a fresh user with
// activity automatically lights up the right badges without requiring
// us to write through a separate "unlocked" store.

export const BADGES = [
  {
    id: 'first-round',
    label: 'First round played',
    desc: 'Complete a single Knowledge Games round.',
    icon: '🎮',
    tint: 'from-mint-300 to-mint-500',
    test: ({ myResults }) => myResults.length >= 1,
  },
  {
    id: 'streak-3',
    label: '3-day streak',
    desc: 'Play or learn on three different days.',
    icon: '🔥',
    tint: 'from-peach-300 to-peach-500',
    test: ({ activeDays }) => activeDays >= 3,
  },
  {
    id: 'streak-7',
    label: '7-day streak',
    desc: 'A full week of consistent practice.',
    icon: '🌟',
    tint: 'from-purple-300 to-indigo-400',
    test: ({ activeDays }) => activeDays >= 7,
  },
  {
    id: 'perfect-round',
    label: 'Perfect round',
    desc: 'Score 100% on a single Knowledge Games round.',
    icon: '🎯',
    tint: 'from-sky-300 to-sky-500',
    test: ({ myResults }) => myResults.some((r) => (r.accuracy ?? 0) >= 100),
  },
  {
    id: 'subject-explorer',
    label: 'Subject explorer',
    desc: 'Play games across at least 3 different subjects.',
    icon: '🧭',
    tint: 'from-mint-400 to-sky-400',
    test: ({ subjectsPlayed }) => subjectsPlayed >= 3,
  },
  {
    id: 'top-3',
    label: 'Top 3 in your stream',
    desc: 'Land in the top 3 of your stream leaderboard.',
    icon: '🏅',
    tint: 'from-peach-400 to-purple-400',
    test: ({ rank, totalInStream }) => rank > 0 && rank <= 3 && totalInStream >= 5,
  },
  {
    id: 'enrolled',
    label: 'Lifelong learner',
    desc: 'Enroll in your first course.',
    icon: '📘',
    tint: 'from-indigo-300 to-purple-400',
    test: ({ enrolledCount }) => enrolledCount >= 1,
  },
  {
    id: 'lesson-master',
    label: 'Lesson master',
    desc: 'Complete 5 lessons across your courses.',
    icon: '📚',
    tint: 'from-mint-300 to-indigo-400',
    test: ({ lessonsCompleted }) => lessonsCompleted >= 5,
  },
  {
    id: 'archivist',
    label: 'Archivist',
    desc: 'Upload a document to your Academic Vault.',
    icon: '🗂️',
    tint: 'from-sky-300 to-indigo-300',
    test: ({ documentsCount }) => documentsCount >= 1,
  },
  {
    id: 'centurion',
    label: 'Centurion',
    desc: 'Earn a cumulative 100+ points across rounds.',
    icon: '💯',
    tint: 'from-purple-400 to-peach-300',
    test: ({ totalScore }) => totalScore >= 100,
  },
  {
    id: 'consistent',
    label: 'Consistent practitioner',
    desc: 'Play 5 or more rounds in total.',
    icon: '⚡',
    tint: 'from-sky-400 to-mint-400',
    test: ({ myResults }) => myResults.length >= 5,
  },
  {
    id: 'goal-setter',
    label: 'Goal setter',
    desc: 'Set a weekly goal for yourself.',
    icon: '🎯',
    tint: 'from-peach-300 to-indigo-300',
    test: ({ goalsSet }) => goalsSet >= 1,
  },
]

export function computeBadges(stats) {
  return BADGES.map((b) => ({
    ...b,
    unlocked: Boolean(b.test(stats)),
  }))
}
