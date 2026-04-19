import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const SEED_MESSAGES = [
  {
    id: 1,
    role: 'bot',
    text: "Hi! I'm EduGuide — your AI study buddy. Ask me anything, from algebra to essay feedback.",
  },
]

const SUGGESTIONS = [
  'Explain photosynthesis simply',
  'Quiz me on World War II',
  'Help me plan a study week',
]

function BotReply(prompt) {
  const p = prompt.toLowerCase()
  if (p.includes('photosynthesis')) {
    return 'Plants turn sunlight, water, and CO₂ into glucose and oxygen. Think of leaves as tiny solar panels: sunlight powers a chemical reaction in chloroplasts that builds sugar for the plant and releases O₂ as a byproduct.'
  }
  if (p.includes('quiz')) {
    return "Let's do it! Question 1: In what year did World War II end? (a) 1943  (b) 1945  (c) 1947"
  }
  if (p.includes('plan') || p.includes('study')) {
    return "Here's a simple week: Mon/Wed/Fri — 45 min focused study + 15 min review. Tue/Thu — practice problems. Sat — mock quiz. Sun — rest. Want me to tailor it to a subject?"
  }
  return "Great question! Here's a starting point: break it into smaller parts, tackle one at a time, and ask me to explain anything that's fuzzy. What subject is this for?"
}

function SendIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m22 2-7 20-4-9-9-4 20-7z" />
    </svg>
  )
}

function ChatIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(SEED_MESSAGES)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, typing, open])

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 250)
      return () => clearTimeout(t)
    }
  }, [open])

  const handleSend = (textArg) => {
    const text = (textArg ?? input).trim()
    if (!text) return
    const userMsg = { id: Date.now(), role: 'user', text }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: BotReply(text),
      }
      setMessages((m) => [...m, botMsg])
      setTyping(false)
    }, 650)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating launcher */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg ring-4 ring-white/60 transition-shadow hover:shadow-xl dark:ring-gray-900/60"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute"
            >
              <ChatIcon className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 flex h-[540px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
          >
            {/* Gradient header */}
            <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/30">
                  <ChatIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">EduGuide AI</p>
                  <p className="truncate text-xs text-indigo-100">
                    Online • typically replies instantly
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="ml-auto rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="eg-scroll flex-1 space-y-3 overflow-y-auto bg-gray-50 px-4 py-4 dark:bg-gray-900"
            >
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${
                      m.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${
                        m.role === 'user'
                          ? 'rounded-br-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                          : 'rounded-bl-md border border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'
                      }`}
                    >
                      {m.text}
                    </div>
                  </motion.div>
                ))}
                {typing && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start"
                  >
                    <div className="rounded-2xl rounded-bl-md border border-gray-200 bg-white px-3.5 py-2.5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.2s] dark:bg-gray-500" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.1s] dark:bg-gray-500" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500" />
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && !typing && (
              <div className="flex flex-wrap gap-2 border-t border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSend(s)}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-brand-400 hover:text-brand-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Ask EduGuide anything…"
                  className="eg-input max-h-32 resize-none py-2"
                />
                <motion.button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  whileHover={{ scale: input.trim() ? 1.05 : 1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Send message"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <SendIcon className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
