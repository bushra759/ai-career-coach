import { useState } from 'react'
import Compass from './components/Compass'
import Roadmap from './components/Roadmap'
import ResumeReview from './components/ResumeReview'
import MockInterview from './components/MockInterview'

const TOOLS = [
  { id: 'roadmap', label: 'Career Roadmap', desc: 'Get 2-3 concrete paths based on your skills and constraints.' },
  { id: 'resume', label: 'Resume Review', desc: 'Line-by-line feedback and rewrites, not generic tips.' },
  { id: 'interview', label: 'Mock Interview', desc: 'Practice real questions for your target role, one at a time.' },
]

export default function App() {
  const [view, setView] = useState('home')

  return (
    <div className="min-h-screen flex flex-col font-body">
      <header className="border-b border-line">
        <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => setView('home')} className="flex items-center gap-3">
            <Compass active={view} size={36} />
            <span className="font-display text-xl font-semibold text-ink">AI Career Coach</span>
          </button>
          <div className="hidden sm:flex gap-6">
            {TOOLS.map((t) => (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                className={`text-sm font-medium transition-colors ${
                  view === t.id ? 'text-ink' : 'text-slate hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {view === 'home' && <Home onSelect={setView} />}
        {view === 'roadmap' && <ToolShell title="Career Roadmap" subtitle="Tell me where you stand — I'll suggest where you could go."><Roadmap /></ToolShell>}
        {view === 'resume' && <ToolShell title="Resume Review" subtitle="Paste your resume for honest, specific feedback."><ResumeReview /></ToolShell>}
        {view === 'interview' && <ToolShell title="Mock Interview" subtitle="One question at a time. Real feedback after every answer."><MockInterview /></ToolShell>}
      </main>

      <footer className="border-t border-line py-6 text-center text-sm text-slate">
        Built as a final project — AI Career Coach.
      </footer>
    </div>
  )
}

function Home({ onSelect }) {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <div className="max-w-2xl">
        <Compass active="home" size={64} />
        <h1 className="font-display text-5xl font-semibold text-ink mt-6 leading-tight">
          Find your next step, not just advice.
        </h1>
        <p className="text-lg text-slate mt-5 leading-relaxed">
          Three tools, one honest coach: map a realistic career path, get your
          resume rewritten line by line, and practice interview questions
          until your answers actually land.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mt-14">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className="text-left bg-white border border-line rounded-xl p-6 hover:border-amber hover:-translate-y-0.5 transition-all"
          >
            <h3 className="font-display text-xl font-semibold text-ink mb-2">{t.label}</h3>
            <p className="text-sm text-slate leading-relaxed">{t.desc}</p>
            <span className="inline-block mt-4 text-sm font-semibold text-amberDark">Open →</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function ToolShell({ title, subtitle, children }) {
  return (
    <section className="max-w-5xl mx-auto px-6 py-14">
      <h2 className="font-display text-3xl font-semibold text-ink">{title}</h2>
      <p className="text-slate mt-2 mb-10">{subtitle}</p>
      {children}
    </section>
  )
        }
