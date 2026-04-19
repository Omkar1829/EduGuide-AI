import { useMemo, useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { EDUCATION_LEVELS } from '../../data/admin'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { EyeIcon, SearchIcon, TrashIcon } from '../../components/icons'

function StatusPill({ status }) {
  const isActive = status === 'active'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
        isActive
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-gray-400'}`}
      />
      {status}
    </span>
  )
}

export default function AdminUsers() {
  const { users, toggleUserStatus, deleteUser } = useAdmin()
  const [q, setQ] = useState('')
  const [level, setLevel] = useState('All')
  const [status, setStatus] = useState('All')
  const [profile, setProfile] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return users.filter((u) => {
      if (level !== 'All' && u.education !== level) return false
      if (status !== 'All' && u.status !== status) return false
      if (!needle) return true
      return (
        u.name.toLowerCase().includes(needle) || u.email.toLowerCase().includes(needle)
      )
    })
  }, [users, q, level, status])

  const columns = [
    {
      key: 'name',
      label: 'User',
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-semibold text-white">
            {u.name
              .split(' ')
              .map((s) => s[0])
              .join('')
              .slice(0, 2)}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{u.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'education', label: 'Education' },
    { key: 'documents', label: 'Docs' },
    {
      key: 'status',
      label: 'Status',
      render: (u) => <StatusPill status={u.status} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (u) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setProfile(u)}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
          >
            <EyeIcon className="h-4 w-4" /> View
          </button>
          <button
            onClick={() => toggleUserStatus(u.id)}
            className="rounded-lg px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {u.status === 'active' ? 'Disable' : 'Enable'}
          </button>
          <button
            onClick={() => setConfirmDelete(u)}
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
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">User management</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {filtered.length} of {users.length} users
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or email"
            className="eg-input pl-9"
          />
        </div>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="eg-input w-auto">
          <option>All</option>
          {EDUCATION_LEVELS.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="eg-input w-auto"
        >
          <option>All</option>
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>
      </div>

      <DataTable columns={columns} rows={filtered} empty="No users match your filters" />

      <Modal open={!!profile} onClose={() => setProfile(null)} title="User profile" size="md">
        {profile && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-lg font-semibold text-white">
                {profile.name
                  .split(' ')
                  .map((s) => s[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{profile.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
              </div>
              <StatusPill status={profile.status} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400">Education</p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{profile.education}</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400">Documents</p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{profile.documents}</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400">Joined</p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(profile.joinedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400">Last active</p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(profile.lastActive).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete user?"
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
                deleteUser(confirmDelete.id)
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
          This will permanently remove <span className="font-medium">{confirmDelete?.name}</span> and
          all their uploaded documents. This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
