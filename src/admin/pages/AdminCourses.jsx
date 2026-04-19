import { useMemo, useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { PencilIcon, PlusIcon, SearchIcon, TrashIcon } from '../../components/icons'

const EMPTY = { id: '', title: '', category: '', description: '', eligibility: 'Beginner' }
const LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const CATEGORIES = ['Mathematics', 'Science', 'Programming', 'Languages', 'Humanities', 'Business']

export default function AdminCourses() {
  const { courses, upsertCourse, deleteCourse } = useAdmin()
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return courses
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(needle) ||
        (c.category || '').toLowerCase().includes(needle),
    )
  }, [courses, q])

  const openAdd = () => {
    setForm(EMPTY)
    setEditing('new')
  }
  const openEdit = (c) => {
    setForm({
      id: c.id,
      title: c.title,
      category: c.category || '',
      description: c.description || '',
      eligibility: c.eligibility || 'Beginner',
    })
    setEditing('edit')
  }
  const submit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    upsertCourse({
      id: form.id || undefined,
      title: form.title.trim(),
      category: form.category,
      description: form.description,
      eligibility: form.eligibility,
    })
    setEditing(null)
  }

  const columns = [
    {
      key: 'title',
      label: 'Course',
      render: (c) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{c.title}</p>
          <p className="line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
            {c.description || 'No description'}
          </p>
        </div>
      ),
    },
    { key: 'category', label: 'Category' },
    { key: 'eligibility', label: 'Eligibility' },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (c) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => openEdit(c)}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
          >
            <PencilIcon className="h-4 w-4" /> Edit
          </button>
          <button
            onClick={() => setConfirmDelete(c)}
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
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Course management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {filtered.length} of {courses.length} courses
          </p>
        </div>
        <button onClick={openAdd} className="eg-btn-primary px-4 py-2 text-sm">
          <PlusIcon className="mr-1.5 h-4 w-4" /> Add course
        </button>
      </div>

      <div className="relative max-w-md">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search courses"
          className="eg-input pl-9"
        />
      </div>

      <DataTable columns={columns} rows={filtered} empty="No courses yet" />

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === 'edit' ? 'Edit course' : 'Add course'}
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
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Course name
            </label>
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
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="eg-input"
              >
                <option value="">Select…</option>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Eligibility
              </label>
              <select
                value={form.eligibility}
                onChange={(e) => setForm((f) => ({ ...f, eligibility: e.target.value }))}
                className="eg-input"
              >
                {LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Description
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="eg-input"
            />
          </div>
        </form>
      </Modal>

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete course?"
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
                deleteCourse(confirmDelete.id)
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
