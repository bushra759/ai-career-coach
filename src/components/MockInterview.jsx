import { useState, useRef, useEffect } from 'react'
import { askCoach } from '../lib/api'

const ROLES = [
  'Software Engineer',
  'Marketing',
  'Data Analyst',
  'Customer Support',
  'Other (type below)',
]

export default function MockInterview() {
  const [role, setRole] = useState(ROLES[0])
  const [customRole, setCustomRole] = useState('')
  const [started, setStarted] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const effectiveRole = role === 'Other (type below)' ? customRole : role

  async function beginInterview() {
    if (role === 'Other (type below)' && !customRole.trim()) {
      setError('Type the role you want to practice for.')
      return
    }
    setError('')
    setStarted(true)
    setLoading(true)
    try {
      const text = await askCoach('interview', {
        jobRole: effectiveRole,
        history: [],
        action: 'start',
      })
      setMessages([{ role: 'coach', text }])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function sendAnswer(e) {
    e.preventDefault()
    if (!input.trim() || loading) return
    const newMessages = [...messages, { role: 'user', text: input }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setError('')
    try {
      const text = await askCoach('interview', {
        jobRole: effectiveRole,
        history: newMessages,
        action: 'continue',
      })
      setMessages([...newMessages, { role: 'coach', text }])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!started) {
    return (
      <div className="max-w-md mx-auto text-center space-y-6">
        <p className="text-slate">Pick a role to practice for. One question at a time, real feedback after each answer.</p>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-amber"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        {role === 'Other (type below)' && (
          <input
            value={customRole}
            onChange={(e) => setCustomRole(e.target.value)}
            placeholder="e.g. Product Manager"
            className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-amber"
          />
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          onClick={beginInterview}
          className="bg-ink text-cream px-6 py-3 rounded-lg font-semibold hover:bg-dusk transition-colors"
        >
          Start mock interview
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[600px] bg-white border border-line rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-line flex items-center justify-between">
        <span className="font-semibold text-ink">Practicing: {effectiveRole}</span>
        <button
          onClick={() => { setStarted(false); setMessages([]) }}
          className="text-sm text-slate hover:text-ink underline"
        >
          Restart
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'coach' ? 'flex justify-start' : 'flex justify-end'}>
            <div
              className={
                m.role === 'coach'
                  ? 'bg-cream border border-line rounded-xl rounded-tl-sm px-4 py-3 max-w-[85%] whitespace-pre-wrap text-ink'
                  : 'bg-ink text-cream rounded-xl rounded-tr-sm px-4 py-3 max-w-[85%] whitespace-pre-wrap'
              }
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-cream border border-line rounded-xl px-4 py-3 text-slate text-sm">
              Coach is typing…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      {error && <p className="text-sm text-red-600 px-5 pb-2">{error}</p>}
      <form onSubmit={sendAnswer} className="border-t border-line p-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer…"
          disabled={loading}
          className="flex-1 rounded-lg border border-line px-4 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-amber disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-amber text-ink px-5 py-2.5 rounded-lg font-semibold hover:bg-amberDark hover:text-cream transition-colors disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
      }
