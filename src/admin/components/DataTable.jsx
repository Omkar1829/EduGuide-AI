import { motion } from 'framer-motion'

export default function DataTable({ columns, rows, empty = 'No records' }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900/60">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${
                    c.align === 'right' ? 'text-right' : ''
                  }`}
                  style={c.width ? { width: c.width } : undefined}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  {empty}
                </td>
              </tr>
            )}
            {rows.map((row, i) => (
              <motion.tr
                key={row.id || i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02, duration: 0.2 }}
                className="transition-colors hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5"
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`px-4 py-3 text-sm text-gray-700 dark:text-gray-200 ${
                      c.align === 'right' ? 'text-right' : ''
                    }`}
                  >
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
