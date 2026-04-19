import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BrainIcon, SendIcon, SparkleIcon } from '../components/icons'

const PROMPTS = [
  'Explain photosynthesis like I’m 10',
  'Quiz me on derivatives (5 questions)',
  'Summarize Chapter 3 of algebra basics',
  'Give me a 7-day plan for calc I',
  'Why is SN1 faster than SN2 here?',
]

function reply(input) {
  const t = input.toLowerCase()
  if (t.includes('plan')) {
    return 'Here is a 7-day plan:\n• Day 1 — Review limits and definitions\n• Day 2 — Derivative rules drill\n• Day 3 — Chain rule + implicit diff\n• Day 4 — Applications: motion & rates\n• Day 5 — Integrals intro\n• Day 6 — Area & volume problems\n• Day 7 — Mixed-practice mock exam.'
  }
  if (t.includes('quiz')) {
    return 'Pop quiz ✏️\n1. d/dx (x^3) = ?\n2. Derivative of sin(x)?\n3. ∫ 2x dx = ?\n4. Chain rule: d/dx (cos(x^2))?\n5. Limit as x→0 of sin(x)/x?'
  }
  if (t.includes('photosynthesis')) {
    return 'Plants are tiny solar-powered kitchens. Leaves catch sunlight and breathe in CO₂ from the air. Inside the leaves, water from the roots and CO₂ are cooked together using sunlight — the result is sugar (food) and a bonus: oxygen that the plant exhales into the air for us.'
  }
  if (t.includes('sn1') || t.includes('sn2')) {
    return 'SN1 vs SN2 comes down to stability and crowding. Tertiary carbons form stable carbocations → SN1 wins. Primary carbons are open for attack and can’t stabilize cations → SN2 wins. Polar protic solvents favor SN1; polar aprotic solvents favor SN2.'
  }
  if (t.includes('summar')) {
    return 'Chapter 3 in a nutshell: you meet linear equations, see why they graph as straight lines, practice moving the same thing to both sides, and finish by modeling word problems (distance-rate-time, mixture, money) as equations.'
  }
  return 'Great question. Here is how I would think about it: break the problem into the smallest step you already know, solve that step, then use the result to attack the next piece. Want me to walk through a specific example?'
}

export default function AITutor() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: 'Hey! I’m your AI tutor. Ask me anything — concepts, worked examples, study plans, or quizzes.',
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const listRef = useRef(null)
  const [params, setParams] = useSearchParams()

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  const send = (override) => {
    const text = (override ?? input).trim()
    if (!text) return
    const userMsg = { id: Date.now(), role: 'user', text }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const botMsg = { id: Date.now() + 1, role: 'bot', text: reply(text) }
      setMessages((m) => [...m, botMsg])
      setTyping(false)
    }, 650)
  }

  useEffect(() => {
    const initial = params.get('q')
    if (!initial) return
    setParams({}, { replace: true })
    send(initial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_280px]">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md">
            <BrainIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              AI Tutor
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ask anything. Short, clear, human answers.
            </p>
          </div>
        </div>

        <div className="eg-card flex h-[70vh] flex-col p-0">
          <div
            ref={listRef}
            className="eg-scroll flex-1 space-y-3 overflow-y-auto p-5"
          >
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
            className="border-t border-gray-200 p-4 dark:border-gray-800"
          >
            <div className="flex items-end gap-2">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
                placeholder="Ask anything — press Enter to send, Shift+Enter for newline."
                className="eg-input resize-none"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={!input.trim()}
                className="eg-btn-primary h-11 w-11 shrink-0 p-0 disabled:opacity-50"
                aria-label="Send"
              >
                <SendIcon className="h-4 w-4" />
              </motion.button>
            </div>
          </form>
        </div>
      </div>

      <aside className="space-y-4">
        <section className="eg-card">
          <div className="mb-2 flex items-center gap-2">
            <SparkleIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Try asking
            </h3>
          </div>
          <div className="flex flex-col gap-2">
            {PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => send(p)}
                className="rounded-xl border border-gray-200 px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:border-brand-400 hover:bg-brand-50 dark:border-gray-700 dark:text-gray-200 dark:hover:border-brand-400 dark:hover:bg-brand-900/20"
              >
                {p}
              </button>
            ))}
          </div>
        </section>

        <section className="eg-card">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Tutor tips
          </h3>
          <ul className="mt-2 space-y-2 text-xs text-gray-500 dark:text-gray-400">
            <li>• Be specific — paste the exact question you’re stuck on.</li>
            <li>• Ask for an example, then ask to try one yourself.</li>
            <li>• Use “Quiz me” to turn any topic into a mini test.</li>
          </ul>
        </section>
      </aside>
    </div>
  )
}
