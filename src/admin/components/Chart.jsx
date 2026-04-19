import { motion } from 'framer-motion'

// ---------- BarChart ----------
export function BarChart({ data = [], height = 180, tint = 'indigo' }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  const palette = {
    indigo: 'from-indigo-500 to-purple-500',
    emerald: 'from-emerald-500 to-teal-500',
    rose: 'from-rose-500 to-orange-500',
    sky: 'from-sky-500 to-indigo-500',
  }
  const grad = palette[tint] || palette.indigo
  return (
    <div className="w-full" style={{ height }}>
      <div className="flex h-full items-end gap-3">
        {data.map((d, i) => {
          const pct = (d.value / max) * 100
          return (
            <div key={d.label + i} className="group flex flex-1 flex-col items-center gap-1.5">
              <div className="relative flex h-full w-full items-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${pct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.04, ease: 'easeOut' }}
                  className={`w-full rounded-t-lg bg-gradient-to-t ${grad}`}
                />
                <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 rounded-md bg-gray-900 px-1.5 py-0.5 text-[10px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-gray-700">
                  {d.value}
                </span>
              </div>
              <span className="truncate text-[11px] text-gray-500 dark:text-gray-400" title={d.label}>
                {d.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------- LineChart ----------
export function LineChart({ data = [], height = 180, tint = 'indigo' }) {
  if (data.length === 0) return null
  const w = 600
  const h = height
  const pad = 24
  const max = Math.max(...data.map((d) => d.value))
  const min = Math.min(...data.map((d) => d.value))
  const range = Math.max(1, max - min)
  const step = (w - pad * 2) / Math.max(1, data.length - 1)

  const points = data.map((d, i) => {
    const x = pad + i * step
    const y = pad + (1 - (d.value - min) / range) * (h - pad * 2)
    return [x, y]
  })
  const path = points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ')
  const area =
    path + ` L${points[points.length - 1][0]},${h - pad} L${points[0][0]},${h - pad} Z`

  const stroke = tint === 'emerald' ? '#10b981' : tint === 'rose' ? '#f43f5e' : '#6366f1'
  const fill = tint === 'emerald' ? '#10b981' : tint === 'rose' ? '#f43f5e' : '#6366f1'

  return (
    <div className="w-full" style={{ height }}>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`line-fill-${tint}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={fill} stopOpacity="0.35" />
            <stop offset="100%" stopColor={fill} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={area}
          fill={`url(#line-fill-${tint})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p[0]}
            cy={p[1]}
            r="3.5"
            fill={stroke}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.03 }}
          />
        ))}
        {data.map((d, i) => (
          <text
            key={`lbl-${i}`}
            x={pad + i * step}
            y={h - 4}
            fontSize="11"
            textAnchor="middle"
            className="fill-gray-500 dark:fill-gray-400"
          >
            {d.label}
          </text>
        ))}
      </svg>
    </div>
  )
}

// ---------- DonutChart ----------
export function DonutChart({ data = [], size = 180 }) {
  const total = Math.max(
    1,
    data.reduce((s, d) => s + d.value, 0),
  )
  const radius = size / 2 - 12
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * radius

  const colors = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#f43f5e', '#0ea5e9']

  const segments = []
  let cursor = 0
  for (let i = 0; i < data.length; i += 1) {
    const len = (data[i].value / total) * circumference
    segments.push({ ...data[i], len, offset: cursor })
    cursor += len
  }

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-gray-200 dark:text-gray-800"
          strokeWidth="18"
        />
        {segments.map((seg, i) => (
          <motion.circle
            key={seg.label + i}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={colors[i % colors.length]}
            strokeWidth="18"
            strokeLinecap="butt"
            strokeDasharray={`${seg.len} ${circumference - seg.len}`}
            strokeDashoffset={-seg.offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          />
        ))}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          className="fill-gray-900 dark:fill-white"
          fontSize="20"
          fontWeight="600"
        >
          {total}
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          className="fill-gray-500 dark:fill-gray-400"
          fontSize="11"
        >
          Total
        </text>
      </svg>
      <ul className="space-y-2 text-sm">
        {data.map((d, i) => (
          <li key={d.label + i} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: colors[i % colors.length] }}
            />
            <span className="text-gray-700 dark:text-gray-200">{d.label}</span>
            <span className="text-gray-400 dark:text-gray-500">
              {Math.round((d.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
