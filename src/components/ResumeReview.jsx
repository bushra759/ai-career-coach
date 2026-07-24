import { useState } from 'react'
import { askCoach } from '../lib/api'
import { Spinner } from './Roadmap'

export default function ResumeReview() {
  const [resume, setResume] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (resume.trim().length < 40) {
      setError('Paste in more of your resume — a line or two isn\u2019t enough to review.')
      return
    }
    setError('')
    setLoading(true)
    setResult('')
    try {
      const text = await askCoach('resume', { resume })
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
            Paste your resume text
          </label>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            rows={16}
            placeholder="Paste the full text of your resume here…"
            className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-amber resize-none font-mono text-sm"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-ink text-cream px-6 py-3 rounded-lg font-semibold hover:bg-dusk transition-colors disabled:opacity-50"
        >
          {loading ? 'Reviewing…' : 'Review my resume'}
        </button>
      </form>

      <div>
        {!result && !loading && (
          <div className="h-full flex items-center justify-center border border-dashed border-line rounded-xl p-10 text-center text-slate">
            Feedback on strengths, weak lines, and rewrites will appear here.
          </div>
        )}
        {loading && (
          <div className="h-full flex items-center justify-center p-10">
            <Spinner />
          </div>
        )}
        {result && (
          <div className="bg-white border border-line rounded-xl p-6 whitespace-pre-wrap leading-relaxed text-ink font-body max-h-[600px] overflow-y-auto">
            {result}
          </div>
        )}
      </div>
    </div>
  )
        }
