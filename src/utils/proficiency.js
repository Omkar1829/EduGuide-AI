// Derive subject proficiency, skill radar, weakness/strength heatmap,
// and streak data from existing context data sources.

import { SUBJECTS } from '../data/games'

// SUBJECT_TOPIC_MAP — maps each game subject to one or more "topics"
// inside that subject so the heatmap has a finer grid than the per-subject
// proficiency map. We don't have real per-question topic tagging, so we
// derive a stable pseudo-topic from the question id which is stable per
// question.
const TOPIC_LABELS = {
  physics: ['Mechanics', 'Optics', 'Electromagnetism', 'Modern'],
  chemistry: ['Atomic', 'Bonding', 'Reactions', 'Inorganic'],
  biology: ['Cells', 'Genetics', 'Human Systems', 'Ecology'],
  mathematics: ['Algebra', 'Calculus', 'Probability', 'Geometry'],
  accounts: ['Journals', 'Ledgers', 'Statements', 'Ratios'],
  economics: ['Micro', 'Macro', 'Trade', 'Public'],
  history: ['Ancient', 'Medieval', 'Modern', 'World'],
  english: ['Grammar', 'Vocab', 'Comprehension', 'Writing'],
}

export function topicsFor(subjectId) {
  return TOPIC_LABELS[subjectId] || ['Core']
}

export function myResultsOf(results, userId) {
  return results.filter((r) => r.userId === userId)
}

// Per-subject proficiency: average accuracy of the user's rounds on that
// subject, normalised 0–100. Subjects with no rounds yet sit at 0 and are
// flagged "untouched".
export function proficiencyMap(myResults) {
  const out = SUBJECTS.map((s) => {
    const rounds = myResults.filter((r) => r.subjectId === s.id)
    if (rounds.length === 0) {
      return {
        subjectId: s.id,
        name: s.name,
        gradient: s.gradient,
        rounds: 0,
        score: 0,
        accuracy: 0,
        bestScore: 0,
        untouched: true,
      }
    }
    const avgAcc = Math.round(
      rounds.reduce((a, r) => a + (r.accuracy ?? 0), 0) / rounds.length,
    )
    const bestScore = Math.max(...rounds.map((r) => r.score ?? 0))
    return {
      subjectId: s.id,
      name: s.name,
      gradient: s.gradient,
      rounds: rounds.length,
      score: avgAcc, // alias used by some widgets
      accuracy: avgAcc,
      bestScore,
      untouched: false,
    }
  })
  return out.sort((a, b) => b.accuracy - a.accuracy)
}

// 6-axis skill radar (0–100). Loosely derived so updating data shifts it.
export function skillRadar({
  myResults,
  enrolledCount,
  lessonsCompleted,
  documentsCount,
  activeDays,
}) {
  const quantSubjects = ['mathematics', 'physics', 'accounts']
  const verbalSubjects = ['english', 'history']
  const logicalSubjects = ['mathematics', 'physics', 'economics']
  const subjectAvg = (ids) => {
    const rounds = myResults.filter((r) => ids.includes(r.subjectId))
    if (rounds.length === 0) return 30 // baseline
    return Math.round(rounds.reduce((a, r) => a + (r.accuracy ?? 0), 0) / rounds.length)
  }
  const overall =
    myResults.length === 0
      ? 30
      : Math.round(myResults.reduce((a, r) => a + (r.accuracy ?? 0), 0) / myResults.length)

  return [
    { axis: 'Quantitative', value: subjectAvg(quantSubjects) },
    { axis: 'Verbal', value: subjectAvg(verbalSubjects) },
    { axis: 'Logical', value: subjectAvg(logicalSubjects) },
    { axis: 'Subject Mastery', value: overall },
    { axis: 'Consistency', value: Math.min(100, activeDays * 14) },
    {
      axis: 'Communication',
      value: Math.min(100, 30 + lessonsCompleted * 5 + documentsCount * 4 + enrolledCount * 3),
    },
  ]
}

// Career fit %: average proficiency on the role's coreSubjects, blended with
// stream alignment + skill exposure (any badge / lesson topics).
export function careerFitFor(role, { myResults, stream }) {
  const subjAvg = (ids) => {
    const rounds = myResults.filter((r) => ids.includes(r.subjectId))
    if (rounds.length === 0) return 35
    return Math.round(rounds.reduce((a, r) => a + (r.accuracy ?? 0), 0) / rounds.length)
  }
  const proficiency = subjAvg(role.coreSubjects)
  const streamBoost = stream && role.streams.includes(stream) ? 10 : 0
  const value = Math.min(99, Math.round(proficiency * 0.85 + streamBoost + 5))
  return value
}

// Strengths/weaknesses heatmap — flat list of { subjectId, topic, accuracy, attempts }.
export function topicHeatmap(myResults) {
  const buckets = new Map()
  myResults.forEach((r) => {
    const subjectId = r.subjectId
    if (!subjectId) return
    // Round-level accuracy projected onto a stable topic via the subject's first question.
    // We don't have per-question topic tags, so fall back to evenly spreading rounds
    // across the subject's topics for variety.
    const topics = topicsFor(subjectId)
    const idx =
      Math.abs(
        String(r.id || r.ts || '')
          .split('')
          .reduce((a, c) => a + c.charCodeAt(0), 0),
      ) % topics.length
    const key = `${subjectId}::${topics[idx]}`
    const cur = buckets.get(key) || {
      subjectId,
      topic: topics[idx],
      total: 0,
      attempts: 0,
    }
    cur.total += r.accuracy ?? 0
    cur.attempts += 1
    buckets.set(key, cur)
  })
  return [...buckets.values()].map((b) => ({
    subjectId: b.subjectId,
    topic: b.topic,
    accuracy: Math.round(b.total / b.attempts),
    attempts: b.attempts,
  }))
}

// Streak heatmap data for the past N days, deriving day buckets from
// timestamps in games results + lesson completion logs supplied by caller.
export function streakDays({ activityTimestamps, days = 84 }) {
  const out = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const oneDay = 24 * 60 * 60 * 1000

  // Pre-bucket activity by date string for O(1) lookup.
  const counts = new Map()
  activityTimestamps.forEach((ts) => {
    const d = new Date(ts)
    d.setHours(0, 0, 0, 0)
    const key = d.toISOString().slice(0, 10)
    counts.set(key, (counts.get(key) || 0) + 1)
  })

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * oneDay)
    const key = d.toISOString().slice(0, 10)
    const value = counts.get(key) || 0
    out.push({ date: key, value, label: d.toDateString() })
  }
  return out
}

export function activeDayCount(activityTimestamps) {
  const set = new Set(
    activityTimestamps.map((ts) => {
      const d = new Date(ts)
      d.setHours(0, 0, 0, 0)
      return d.toISOString().slice(0, 10)
    }),
  )
  return set.size
}

export function currentStreak(activityTimestamps) {
  const set = new Set(
    activityTimestamps.map((ts) => {
      const d = new Date(ts)
      d.setHours(0, 0, 0, 0)
      return d.toISOString().slice(0, 10)
    }),
  )
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let streak = 0
  for (let i = 0; i < 365; i++) {
    const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().slice(0, 10)
    if (set.has(key)) streak += 1
    else if (i === 0) {
      // Allow today to be empty without breaking the streak.
      continue
    } else break
  }
  return streak
}

// Peer percentile within a stream, by total points across all rounds.
export function peerPercentile({ results, stream, userId }) {
  const inStream = results.filter((r) => (stream ? r.stream === stream : true))
  if (inStream.length === 0) return { percentile: null, rank: 0, total: 0 }
  const totals = new Map()
  inStream.forEach((r) => {
    const k = r.userId || r.id || r.name
    totals.set(k, (totals.get(k) || 0) + (r.score ?? 0))
  })
  const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1])
  const myKey = userId
  const idx = sorted.findIndex(([k]) => k === myKey)
  if (idx === -1) return { percentile: null, rank: 0, total: sorted.length }
  const rank = idx + 1
  const percentile = Math.max(1, Math.round(((sorted.length - idx) / sorted.length) * 100))
  return { percentile, rank, total: sorted.length, myTotal: sorted[idx][1] }
}
