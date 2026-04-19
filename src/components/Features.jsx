import { motion } from 'framer-motion'

const FEATURES = [
  {
    icon: '🧠',
    title: 'Adaptive study plans',
    desc: 'EduGuide learns how you learn and reshapes your roadmap every week.',
  },
  {
    icon: '💬',
    title: '24/7 AI tutor',
    desc: 'Ask anything. Get clear, step-by-step explanations and follow-up questions.',
  },
  {
    icon: '📝',
    title: 'Smart quizzes',
    desc: 'Auto-generated quizzes from your notes, textbooks and past mistakes.',
  },
  {
    icon: '📊',
    title: 'Progress insights',
    desc: 'Track mastery by topic and see exactly where to focus next.',
  },
  {
    icon: '📚',
    title: 'All your subjects',
    desc: 'Math, science, languages, humanities — from middle school to college.',
  },
  {
    icon: '⚡',
    title: 'Lightning fast',
    desc: 'Instant answers, streaming explanations and offline-friendly notes.',
  },
]

export default function Features() {
  return (
    <section id="features" className="container-page py-20 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
          Everything you need to actually learn.
        </h2>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          A focused toolkit — no gimmicks. Designed with students and teachers.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ scale: 1.03, y: -4 }}
            className="eg-card group cursor-default hover:shadow-lg"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-xl ring-1 ring-inset ring-indigo-500/10 transition-transform group-hover:scale-110 dark:ring-indigo-400/20">
              <span aria-hidden>{f.icon}</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              {f.title}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
