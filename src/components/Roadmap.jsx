import { useState } from 'react'
import { askCoach } from '../lib/api'

export default function Roadmap() {
  const [field, setField] = useState('')
  const [skills, setSkills] = useState('')
  const [constraints, setConstraints] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!field.trim() || !skills.trim()) {
      setError('Tell me your field and skills first — I need something to work with.')
      return
    }
    setError('')
    setLoading(true)
    setResult('')
    try {
      const text = await askCoach('roadmap', { field, skills, constraints })
      setResult(text)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-10">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">
            Field or subject you're studying / interested in
          </label>
          <input
            value={field}
            onChange={(e) => setField(e.target.value)}
            placeholder="e.g. Computer Science, Graphic Design, Biology"
            className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-amber"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">
            Skills you already have
          </label>
          <textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            rows={3}
            placeholder="e.g. Python basics, good at writing, comfortable presenting"
            className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-amber resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">
            Constraints (budget, location, time available)
          </label>
          <textarea
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            rows={2}
            placeholder="e.g. Can't relocate, limited budget for courses, 6 months to decide"
            className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-amber resize-none"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-ink text-cream px-6 py-3 rounded-lg font-semibold hover:bg-dusk transition-colors disabled:opacity-50"
        >
          {loading ? 'Mapping your paths…' : 'Suggest my paths'}
        </button>
      </form>

      <div>
        {!result && !loading && (
          <div className="h-full flex items-center justify-center border border-dashed border-line rounded-xl p-10 text-center text-slate">
            Your suggested career paths will appear here.
          </div>
        )}
        {loading && (
          <div className="h-full flex items-center justify-center p-10">
            <Spinner />
          </div>
        )}
        {result && (
          <div className="bg-white border border-line rounded-xl p-6 whitespace-pre-wrap leading-relaxed text-ink font-body">
            {result}
          </div>
        )}
      </div>
    </div>
  )
}

export function Spinner() {
  return (
    <div className="flex flex-col items-center gap-3 text-slate">
      <div className="w-8 h-8 border-2 border-line border-t-amber rounded-full animate-spin" />
      <span className="text-sm">Thinking this through…</span>
    </div>
  )
}
