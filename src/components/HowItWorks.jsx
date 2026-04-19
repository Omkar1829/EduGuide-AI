import { motion } from 'framer-motion'

const STEPS = [
  {
    step: '01',
    title: 'Tell us your goal',
    desc: 'Exam prep, a new skill, catching up on a class — pick a target.',
  },
  {
    step: '02',
    title: 'Get your plan',
    desc: 'EduGuide builds a week-by-week plan tuned to your level.',
  },
  {
    step: '03',
    title: 'Learn &amp; practice',
    desc: 'Lessons, quizzes, and an AI tutor that adapts as you grow.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="bg-gray-100/60 py-20 dark:bg-gray-800/40">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
            How EduGuide works
          </h2>
          <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
            Three simple steps to a smarter study routine.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ scale: 1.02 }}
              className="eg-card"
            >
              <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                {s.step}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                {s.title}
              </h3>
              <p
                className="mt-2 text-sm text-gray-500 dark:text-gray-400"
                dangerouslySetInnerHTML={{ __html: s.desc }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
