import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { ZapIcon } from '../icons'

const SIZE = 260
const CENTER = SIZE / 2
const RADIUS = SIZE / 2 - 36

function pointFor(angle, value) {
  const r = (RADIUS * value) / 100
  return [
    CENTER + r * Math.sin(angle),
    CENTER - r * Math.cos(angle),
  ]
}

export default function SkillRadar({ data }) {
  const angles = useMemo(
    () => data.map((_, i) => (i * 2 * Math.PI) / data.length),
    [data],
  )

  const polygonPoints = useMemo(
    () =>
      angles
        .map((a, i) => pointFor(a, data[i].value).join(','))
        .join(' '),
    [angles, data],
  )

  const grid = [25, 50, 75, 100]

  return (
    <section className="eg-card">
      <div className="mb-3 flex items-center gap-2">
        <ZapIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Skill radar
        </h2>
      </div>
      <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
        Six dimensions of your learning balance. Updates as you play and learn.
      </p>

      <div className="grid items-center gap-4 md:grid-cols-[260px_1fr]">
        <div className="mx-auto">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE}>
            {grid.map((g) => (
              <polygon
                key={g}
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.15"
                strokeWidth="1"
                points={angles
                  .map((a) => pointFor(a, g).join(','))
                  .join(' ')}
              />
            ))}
            {angles.map((a, i) => {
              const [x, y] = pointFor(a, 100)
              return (
                <line
                  key={i}
                  x1={CENTER}
                  y1={CENTER}
                  x2={x}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.12"
                />
              )
            })}
            <motion.polygon
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              points={polygonPoints}
              fill="url(#radarFill)"
              stroke="#8470c8"
              strokeWidth="2"
              fillOpacity="0.55"
              style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
            />
            <defs>
              <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#bcb1e7" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#94d4af" stopOpacity="0.65" />
              </linearGradient>
            </defs>
            {angles.map((a, i) => {
              const [x, y] = pointFor(a, 118)
              return (
                <text
                  key={data[i].axis}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dy="0.35em"
                  className="fill-gray-600 text-[10px] font-medium dark:fill-gray-300"
                >
                  {data[i].axis}
                </text>
              )
            })}
          </svg>
        </div>

        <ul className="space-y-1.5">
          {data.map((d) => (
            <li
              key={d.axis}
              className="flex items-center justify-between rounded-lg bg-brand-50/40 px-3 py-1.5 text-sm dark:bg-brand-900/20"
            >
              <span className="text-gray-700 dark:text-gray-200">{d.axis}</span>
              <span className="font-semibold text-brand-700 dark:text-brand-300">
                {d.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
