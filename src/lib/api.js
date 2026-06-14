// src/lib/api.js
// Groq API client — OpenAI-compatible endpoint
// Model: llama-3.3-70b-versatile (fast, free tier generous)
// Swap VITE_GROQ_API_KEY in your .env file

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

// ── Core fetch wrapper ──────────────────────────────────────────────────────
export async function groqChat(systemPrompt, messages, maxTokens = 1024) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-20),
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Groq API error ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// ── System prompt builder ───────────────────────────────────────────────────
export function buildSystemPrompt(student, skills) {
  const weakSkills = Object.entries(skills)
    .filter(([, s]) => s.accuracy < 0.50)
    .sort((a, b) => a[1].accuracy - b[1].accuracy)
    .slice(0, 5)
    .map(([name, s]) => `${name} (${Math.round(s.accuracy * 100)}%)`)
    .join(', ');

  const strongSkills = Object.entries(skills)
    .filter(([, s]) => s.accuracy >= 0.75)
    .sort((a, b) => b[1].accuracy - a[1].accuracy)
    .slice(0, 3)
    .map(([name, s]) => `${name} (${Math.round(s.accuracy * 100)}%)`)
    .join(', ');

  const avgAccuracy = Math.round(
    Object.values(skills).reduce((s, v) => s + v.accuracy, 0) /
    Object.keys(skills).length * 100
  );

  return `You are EduAgent, an expert AI tutor and education coach for high school students.

STUDENT PROFILE:
- Name: ${student.name}
- Grade: ${student.grade}
- SAT Goal: ${student.satGoal}/1600
- Current SAT Projection: ${student.satProjection}/1600 (${student.satGoal - student.satProjection} points to goal)
- Study Streak: ${student.streakDays} days
- Overall Accuracy: ${avgAccuracy}%
- Total Questions Completed: ${student.totalQuestions}

WEAK AREAS (prioritize these): ${weakSkills}
STRONG AREAS (briefly acknowledge, don't over-focus): ${strongSkills}

YOUR TEACHING PHILOSOPHY:
1. Socratic Method first — ask guiding questions before giving answers
2. Be specific — reference their actual scores and skill names
3. Connect everything to the SAT score impact
4. Short responses in chat — 3-5 sentences max unless asked for detail
5. Celebrate real wins but stay focused on gaps
6. When stuck, scaffold: hint → bigger hint → full explanation
7. Occasionally suggest a practice problem

VOICE: Warm, direct, knowledgeable. Like a great teacher who believes in this student.`;
}

// ── Tutor chat ──────────────────────────────────────────────────────────────
export async function sendToTutor(messages, student, skills) {
  return groqChat(buildSystemPrompt(student, skills), messages);
}

// ── Progress report ─────────────────────────────────────────────────────────
export async function generateProgressReport(student, skills) {
  const skillSummary = Object.entries(skills)
    .map(([name, s]) => `${name}: ${Math.round(s.accuracy * 100)}% (${s.questions} questions)`)
    .join('\n');

  const prompt = `Generate a personalized progress report for this SAT student. Return ONLY valid JSON, no markdown, no explanation.

Student: ${student.name}, Grade ${student.grade}
SAT Goal: ${student.satGoal} | Current Projection: ${student.satProjection}
Study Streak: ${student.streakDays} days | Total Questions: ${student.totalQuestions}

Skill Breakdown:
${skillSummary}

Return this exact JSON structure:
{
  "improvements": [{"skill": "skill name", "detail": "specific improvement detail"}],
  "gaps": [{"skill": "skill name", "impact": "why this matters for SAT score"}],
  "recommendations": [{"action": "specific action", "rationale": "why this helps"}],
  "projection": {"score": 1250, "condition": "if they follow these recommendations for 2 weeks"}
}

Include exactly 3 items in improvements, 3 in gaps, 3 in recommendations.`;

  const text = await groqChat(
    'You are an education data analyst. Always respond with valid JSON only. No markdown, no backticks, no explanation.',
    [{ role: 'user', content: prompt }],
    1024
  );

  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    return null;
  }
}

// ── Study plan generator ────────────────────────────────────────────────────
export async function generateStudyPlan(student, skills) {
  const weakSkills = Object.entries(skills)
    .filter(([, s]) => s.accuracy < 0.60)
    .sort((a, b) => a[1].accuracy - b[1].accuracy)
    .slice(0, 5)
    .map(([name]) => name)
    .join(', ');

  const prompt = `Create a 7-day SAT study plan. Return ONLY a JSON array, no markdown, no explanation.

Student: ${student.name}, Grade ${student.grade}
Goal: ${student.satGoal}/1600 | Current: ${student.satProjection}/1600
Priority weak skills: ${weakSkills}

Return this exact structure (7 days):
[
  {
    "day": "Monday",
    "tasks": [
      {"title": "task name", "duration": 20, "type": "practice", "skill": "skill name", "priority": "high"}
    ]
  }
]

Rules:
- type must be one of: practice, review, combined, test
- priority must be one of: high, medium, low
- Saturday = full practice test (180 min)
- Sunday = light review only
- Include 2 "combined" sessions (math+reading linked)
- Focus every day on the top weak skill
- Weekday total: 60-90 min. Saturday: 3 hours.`;

  const text = await groqChat(
    'You are a SAT prep curriculum designer. Always respond with valid JSON only. No markdown, no backticks.',
    [{ role: 'user', content: prompt }],
    2048
  );

  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    return null;
  }
}

// ── Peer study room ─────────────────────────────────────────────────────────
export const PEER_SYSTEM = `You are EduAgent tutoring TWO students in a shared study room: I.Bhanu sri and Alex Kim, both Grade 10, both preparing for the SAT. Topic: Quadratic Functions. Jordan's accuracy: 30%. Alex's accuracy: 45%.

RULES:
- Each message will be prefixed with the student's name (e.g. "Jordan says: ...")
- Address students by name when relevant
- When one answers correctly, ask them to explain it to the other — peer teaching reinforces learning
- When both are wrong, give a Socratic hint, not the answer directly
- Keep responses to 4-5 sentences
- Be warm and encouraging to both students`;

export async function sendToPeerTutor(messages) {
  return groqChat(PEER_SYSTEM, messages);
}
