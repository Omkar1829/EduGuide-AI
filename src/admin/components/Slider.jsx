export default function Slider({ label, value, onChange, min = 0, max = 100, step = 1, hint }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
        <span className="rounded-lg bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
          {value}%
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-indigo-600 dark:bg-gray-800"
        style={{
          background: `linear-gradient(to right, rgb(99 102 241) 0%, rgb(168 85 247) ${value}%, rgb(229 231 235) ${value}%)`,
        }}
      />
      {hint && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
    </div>
  )
}
