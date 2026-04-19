import { useMemo, useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { EDUCATION_LEVELS } from '../../data/admin'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { PencilIcon, PlusIcon, SearchIcon, TrashIcon } from '../../components/icons'

const EMPTY = { id: '', title: '', education: 'Undergraduate', skillsText: '', stream: 'Science', openings: 10 }
const STREAMS = ['Science', 'Commerce', 'Arts']

export default function AdminJobs() {
  const { jobs, upsertJob, deleteJob } = useAdmin()
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase()
    if (!n) return jobs
    return jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(n) ||
        j.skills.some((s) => s.toLowerCase().includes(n)),
    )
  }, [jobs, q])

  const openAdd = () => {
    setForm(EMPTY)
    setEditing('new')
  }
  const openEdit = (j) => {
    setForm({
      id: j.id,
      title: j.title,
      education: j.education,
      skillsText: (j.skills || []).join(', '),
      stream: j.stream || 'Science',
      openings: j.openings || 0,
    })
    setEditing('edit')
  }
  const submit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    upsertJob({
      id: form.id || undefined,
      title: form.title.trim(),
      education: form.education,
      stream: form.stream,
      openings: Number(form.openings) || 0,
      skills: form.skillsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    })
    setEditing(null)
  }

  const columns = [
    { key: 'title', label: 'Job' },
    { key: 'education', label: 'Required education' },
    {
      key: 'skills',
      label: 'Skills',
      render: (j) => (
        <div className="flex flex-wrap gap-1">
          {j.skills.slice(0, 4).map((s) => (
            <span
              key={s}
              className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[11px] font-medium text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
            >
              {s}
            </span>
          ))}
          {j.skills.length > 4 && (
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              +{j.skills.length - 4}
            </span>
          )}
        </div>
      ),
    },
    { key: 'stream', label: 'Stream' },
    { key: 'openings', label: 'Openings', align: 'right' },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (j) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => openEdit(j)}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
          >
            <PencilIcon className="h-4 w-4" /> Edit
          </button>
          <button
            onClick={() => setConfirmDelete(j)}
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
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Job management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {filtered.length} of {jobs.length} roles
          </p>
        </div>
        <button onClick={openAdd} className="eg-btn-primary px-4 py-2 text-sm">
          <PlusIcon className="mr-1.5 h-4 w-4" /> Add job
        </button>
      </div>

      <div className="relative max-w-md">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search jobs or skills"
          className="eg-input pl-9"
        />
      </div>

      <DataTable columns={columns} rows={filtered} empty="No jobs yet" />

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === 'edit' ? 'Edit job' : 'Add job'}
        size="md"
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
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Job title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="eg-input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Required education
              </label>
              <select
                value={form.education}
                onChange={(e) => setForm((f) => ({ ...f, education: e.target.value }))}
                className="eg-input"
              >
                {EDUCATION_LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Stream</label>
              <select
                value={form.stream}
                onChange={(e) => setForm((f) => ({ ...f, stream: e.target.value }))}
                className="eg-input"
              >
                {STREAMS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Skills (comma-separated)
            </label>
            <input
              value={form.skillsText}
              onChange={(e) => setForm((f) => ({ ...f, skillsText: e.target.value }))}
              placeholder="Python, SQL, ML"
              className="eg-input"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Openings</label>
            <input
              type="number"
              min="0"
              value={form.openings}
              onChange={(e) => setForm((f) => ({ ...f, openings: e.target.value }))}
              className="eg-input"
            />
          </div>
        </form>
      </Modal>

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete job?"
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
                deleteJob(confirmDelete.id)
                setConfirmDelete(null)
              }}
              className="eg-btn bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-500"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Remove <span className="font-medium">{confirmDelete?.title}</span>?
        </p>
      </Modal>
    </div>
  )
}
