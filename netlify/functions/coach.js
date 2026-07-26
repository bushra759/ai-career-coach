const SYSTEM_INSTRUCTION = `You are an expert career coach helping students and early-career professionals. You give honest, specific, actionable advice — never generic. For resume reviews: point out exact weak lines and rewrite them. For mock interviews: ask one realistic question at a time, wait for the answer, then give brief constructive feedback before the next question. For career roadmaps: use the info given about their skills, interests, and constraints to suggest 2-3 concrete paths with next steps. Keep responses focused and not overly long.`

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server is missing GROQ_API_KEY.' }) }
  }

  const { mode, payload } = JSON.parse(event.body || '{}')

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
    return { statusCode: 400, body: JSON.stringify({ error: 'Unknown mode' }) }
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_INSTRUCTION },
          { role: 'user', content: userPrompt },
        ],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { statusCode: 502, body: JSON.stringify({ error: data.error?.message || 'The AI service failed to respond.' }) }
    }

    const text = data.choices?.[0]?.message?.content
    if (!text) {
      return { statusCode: 502, body: JSON.stringify({ error: 'The AI returned an empty response.' }) }
    }

    return { statusCode: 200, body: JSON.stringify({ text }) }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Unexpected server error.' }) }
  }
          }
