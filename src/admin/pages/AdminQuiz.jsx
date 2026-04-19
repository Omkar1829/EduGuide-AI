import { useMemo, useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { DIFFICULTIES } from '../../data/admin'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { PencilIcon, PlusIcon, SearchIcon, TrashIcon } from '../../components/icons'

const EMPTY = {
  id: '',
  question: '',
  options: ['', '', '', ''],
  correctIndex: 0,
  difficulty: 'Easy',
  topic: '',
}

export default function AdminQuiz() {
  const { quiz, upsertQuestion, deleteQuestion } = useAdmin()
  const [q, setQ] = useState('')
  const [diff, setDiff] = useState('All')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase()
    return quiz.filter((x) => {
      if (diff !== 'All' && x.difficulty !== diff) return false
      if (!n) return true
      return x.question.toLowerCase().includes(n) || x.topic.toLowerCase().includes(n)
    })
  }, [quiz, q, diff])

  const openAdd = () => {
    setForm(EMPTY)
    setEditing('new')
  }
  const openEdit = (x) => {
    setForm({
      id: x.id,
      question: x.question,
      options: [...x.options],
      correctIndex: x.correctIndex,
      difficulty: x.difficulty,
      topic: x.topic,
    })
    setEditing('edit')
  }
  const submit = (e) => {
    e.preventDefault()
    if (!form.question.trim()) return
    if (form.options.some((o) => !o.trim())) return
    upsertQuestion({
      id: form.id || undefined,
      question: form.question.trim(),
      options: form.options.map((o) => o.trim()),
      correctIndex: form.correctIndex,
      difficulty: form.difficulty,
      topic: form.topic.trim(),
    })
    setEditing(null)
  }

  const diffTint = (d) =>
    d === 'Easy'
      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
      : d === 'Medium'
      ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
      : 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'

  const columns = [
    {
      key: 'question',
      label: 'Question',
      render: (x) => (
        <div>
          <p className="line-clamp-1 font-medium text-gray-900 dark:text-white">{x.question}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Answer: {x.options[x.correctIndex]}
          </p>
        </div>
      ),
    },
    { key: 'topic', label: 'Topic' },
    {
      key: 'difficulty',
      label: 'Difficulty',
      render: (x) => (
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${diffTint(x.difficulty)}`}>
          {x.difficulty}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (x) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => openEdit(x)}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
          >
            <PencilIcon className="h-4 w-4" /> Edit
          </button>
          <button
            onClick={() => setConfirmDelete(x)}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
          >
            <TrashIcon className="h-4 w-4" /> Delete
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Quiz management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {filtered.length} of {quiz.length} questions
          </p>
        </div>
        <button onClick={openAdd} className="eg-btn-primary px-4 py-2 text-sm">
          <PlusIcon className="mr-1.5 h-4 w-4" /> Add question
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search question or topic"
            className="eg-input pl-9"
          />
        </div>
        <select value={diff} onChange={(e) => setDiff(e.target.value)} className="eg-input w-auto">
          <option>All</option>
          {DIFFICULTIES.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      <DataTable columns={columns} rows={filtered} empty="No questions yet" />

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === 'edit' ? 'Edit question' : 'Add question'}
        size="lg"
        footer={
          <>
            <button onClick={() => setEditing(null)} className="eg-btn-ghost px-4 py-2 text-sm">
              Cancel
            </button>
            <button onClick={submit} className="eg-btn-primary px-4 py-2 text-sm">
              Save
            </button>
          </>
        }
      >
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Question</label>
            <textarea
              rows={2}
              required
              value={form.question}
              onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
              className="eg-input"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Options</label>
            {form.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct"
                  checked={form.correctIndex === i}
                  onChange={() => setForm((f) => ({ ...f, correctIndex: i }))}
                  className="h-4 w-4 accent-indigo-600"
                />
                <input
                  value={opt}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      options: f.options.map((o, j) => (j === i ? e.target.value : o)),
                    }))
                  }
                  placeholder={`Option ${i + 1}`}
                  className="eg-input flex-1"
                  required
                />
              </div>
            ))}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Select the radio next to the correct answer.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Topic</label>
              <input
                value={form.topic}
                onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                placeholder="Data Structures"
                className="eg-input"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}
                className="eg-input"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete question?"
        size="sm"
        footer={
          <>
            <button
              onClick={() => setConfirmDelete(null)}
              className="eg-btn-ghost px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                deleteQuestion(confirmDelete.id)
                setConfirmDelete(null)
              }}
              className="eg-btn bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-500"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
          Remove &ldquo;{confirmDelete?.question}&rdquo;?
        </p>
      </Modal>
    </div>
  )
}
