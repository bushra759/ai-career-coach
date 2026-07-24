const SYSTEM_INSTRUCTION = `You are an expert career coach helping students and early-career professionals. You give honest, specific, actionable advice — never generic. For resume reviews: point out exact weak lines and rewrite them. For mock interviews: ask one realistic question at a time, wait for the answer, then give brief constructive feedback before the next question. For career roadmaps: use the info given about their skills, interests, and constraints to suggest 2-3 concrete paths with next steps. Keep responses focused and not overly long.`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY. Add it in your hosting environment variables.' })
  }

  const { mode, payload } = req.body || {}

  let userPrompt = ''

  if (mode === 'roadmap') {
    const { field, skills, constraints } = payload || {}
    userPrompt = `A student/early-career person shares this:
Field/interests: ${field}
Skills they already have: ${skills}
Constraints: ${constraints || 'none given'}

Suggest 2-3 concrete career paths with clear next steps for each.`
  } else if (mode === 'resume') {
    const { resume } = payload || {}
    userPrompt = `Here is a resume to review:

"""
${resume}
"""

Give: (1) strengths, (2) specific weak lines quoted with a rewritten version, (3) three actionable improvements.`
  } else if (mode === 'interview') {
    const { jobRole, history, action } = payload || {}
    if (action === 'start') {
      userPrompt = `Start a mock interview for the role: ${jobRole}. Ask the first question only. Do not add commentary before it.`
    } else {
      const transcript = (history || [])
        .map((m) => `${m.role === 'coach' ? 'Coach' : 'Candidate'}: ${m.text}`)
        .join('\n')
      userPrompt = `This is an ongoing mock interview for the role: ${jobRole}.

Transcript so far:
${transcript}

Give brief constructive feedback on the candidate's last answer, then ask the next interview question. If this feels like a natural point to wrap up (5-6 questions in), instead give an overall summary of how they did.`
    }
  } else {
    return res.status(400).json({ error: 'Unknown mode' })
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('Gemini API error:', data)
      return res.status(502).json({ error: data.error?.message || 'The AI service failed to respond.' })
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      return res.status(502).json({ error: 'The AI returned an empty response. Try again.' })
    }

    return res.status(200).json({ text })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Unexpected server error.' })
  }
      }
