import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import {
  CheckCircleIcon,
  ClipboardCheckIcon,
  RefreshIcon,
  SparkleIcon,
  XCircleIcon,
} from '../../components/icons'
import Modal from '../components/Modal'

const FILTERS = [
  { id: 'pending', label: 'Pending' },
  { id: 'question', label: 'Questions' },
  { id: 'recommendation', label: 'Recommendations' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'all', label: 'All' },
]

function KindPill({ kind }) {
  const m = {
    question: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300',
    recommendation: 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300',
  }
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${m[kind] || m.question}`}>
      {kind === 'question' ? 'Quiz question' : 'Career recommendation'}
    </span>
  )
}

function StatusPill({ status }) {
  if (status === 'approved')
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
        <CheckCircleIcon className="h-3 w-3" /> Approved
      </span>
    )
  if (status === 'rejected')
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
        <XCircleIcon className="h-3 w-3" /> Rejected
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
      Awaiting review
    </span>
  )
}

function ItemCard({ item, onApprove, onReject, onRegenerate, onView }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      whileHover={{ y: -2 }}
      className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex flex-wrap items-center gap-2">
        <KindPill kind={item.kind} />
        <StatusPill status={item.status} />
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 font-mono text-[11px] text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          <SparkleIcon className="h-3 w-3 text-indigo-500" /> {item.provider} · {item.model}
        </span>
      </div>

      {item.kind === 'question' ? (
        <>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.payload.question}</p>
          <div className="grid gap-1.5 text-xs text-gray-600 dark:text-gray-300 sm:grid-cols-2">
            {item.payload.options.map((o, i) => (
              <div
                key={i}
                className={`rounded-lg border px-2.5 py-1.5 ${
                  i === item.payload.correctIndex
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-600/40 dark:bg-emerald-500/10 dark:text-emerald-200'
                    : 'border-gray-200 dark:border-gray-800'
                }`}
              >
                {String.fromCharCode(65 + i)}. {o}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-gray-500 dark:text-gray-400">
            <span className="rounded-md bg-gray-100 px-2 py-0.5 dark:bg-gray-800">
              Topic: {item.payload.topic}
            </span>
            <span className="rounded-md bg-gray-100 px-2 py-0.5 dark:bg-gray-800">
              Difficulty: {item.payload.difficulty}
            </span>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {item.payload.studentName} → <span className="text-indigo-600 dark:text-indigo-400">{item.payload.role}</span>
            <span className="ml-2 rounded-md bg-indigo-50 px-2 py-0.5 font-mono text-[11px] text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
              {item.payload.stream}
            </span>
            <span className="ml-2 rounded-md bg-emerald-50 px-2 py-0.5 font-mono text-[11px] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
              {item.payload.confidence}% confident
            </span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{item.payload.rationale}</p>
        </>
      )}

      <div className="mt-1 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
        <button
          type="button"
          onClick={onView}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          View details
        </button>
        {item.status === 'pending' ? (
          <>
            <button
              type="button"
              onClick={onApprove}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              <CheckCircleIcon className="h-3.5 w-3.5" /> Approve
            </button>
            <button
              type="button"
              onClick={onReject}
              className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
            >
              <XCircleIcon className="h-3.5 w-3.5" /> Reject
            </button>
            <button
              type="button"
              onClick={onRegenerate}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <RefreshIcon className="h-3.5 w-3.5" /> Regenerate
            </button>
          </>
        ) : (
          <span className="text-[11px] text-gray-400 dark:text-gray-500">
            Reviewed {item.reviewedAt ? new Date(item.reviewedAt).toLocaleString() : ''}
            {item.reason ? ` · ${item.reason}` : ''}
          </span>
        )}
      </div>
    </motion.div>
  )
}

export default function AdminAIReview() {
  const { reviewQueue, approveReviewItem, rejectReviewItem, regenerateReviewItem } = useAdmin()
  const [filter, setFilter] = useState('pending')
  const [viewing, setViewing] = useState(null)
  const [rejecting, setRejecting] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const stats = useMemo(() => {
    const s = { pending: 0, approved: 0, rejected: 0 }
    for (const r of reviewQueue) s[r.status] = (s[r.status] || 0) + 1
    return s
  }, [reviewQueue])

  const filtered = useMemo(() => {
    return reviewQueue.filter((r) => {
      if (filter === 'all') return true
      if (filter === 'pending' || filter === 'approved' || filter === 'rejected') return r.status === filter
      if (filter === 'question' || filter === 'recommendation') return r.kind === filter
      return true
    })
  }, [reviewQueue, filter])

  const doReject = () => {
    if (!rejecting) return
    rejectReviewItem(rejecting.id, rejectReason.trim())
    setRejecting(null)
    setRejectReason('')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <ClipboardCheckIcon className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">AI Review Queue</h1>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-gray-500 dark:text-gray-400">
            Quiz questions and career recommendations are generated by the configured models. Admins approve, reject
            or regenerate — no manual authoring required.
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
            {stats.pending || 0} pending
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
            {stats.approved || 0} approved
          </span>
          <span className="rounded-full bg-rose-50 px-3 py-1 font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
            {stats.rejected || 0} rejected
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f.id
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
          >
            No items match this filter.
          </motion.div>
        ) : (
          <motion.div layout className="grid gap-4">
            {filtered.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onView={() => setViewing(item)}
                onApprove={() => approveReviewItem(item.id)}
                onReject={() => {
                  setRejectReason('')
                  setRejecting(item)
                }}
                onRegenerate={() => regenerateReviewItem(item.id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        open={!!viewing}
        title={viewing?.kind === 'question' ? 'Generated quiz question' : 'Generated recommendation'}
        onClose={() => setViewing(null)}
        size="lg"
      >
        {viewing && (
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
            <div className="flex flex-wrap gap-2 text-xs">
              <KindPill kind={viewing.kind} />
              <StatusPill status={viewing.status} />
              <span className="rounded-full bg-gray-100 px-2 py-0.5 font-mono text-[11px] text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {viewing.provider} · {viewing.model}
              </span>
            </div>
            <pre className="overflow-auto rounded-xl bg-gray-900 p-4 text-xs text-gray-100">
{JSON.stringify(viewing.payload, null, 2)}
            </pre>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              Generated {new Date(viewing.createdAt).toLocaleString()}
            </p>
          </div>
        )}
      </Modal>

      <Modal
        open={!!rejecting}
        title="Reject generated output"
        onClose={() => setRejecting(null)}
        footer={
          <>
            <button
              type="button"
              onClick={() => setRejecting(null)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={doReject}
              className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-rose-700"
            >
              Reject
            </button>
          </>
        }
      >
        <div className="space-y-3 text-sm">
          <p className="text-gray-600 dark:text-gray-300">
            Optionally tell the model what was wrong — this is appended to the next regeneration prompt.
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
            placeholder="e.g. correct answer is wrong, options too easy, topic mismatch"
            className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-indigo-900/40"
          />
        </div>
      </Modal>
    </div>
  )
}
