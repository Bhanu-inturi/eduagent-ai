# EduAgent AI — Adaptive Learning Companion

> A true AI-powered education agent that diagnoses skill gaps, builds personalized study plans, and actively guides underserved students toward measurable improvement.

---

## 🏆 Hackathon Submission

**Problem**: Students in underfunded schools lack access to personalized tutoring. A human tutor costs $50–100/hour. Most students get zero.

**Solution**: EduAgent is an always-on AI agent that acts like a tireless personal tutor — it doesn't just answer questions, it *knows* each student, tracks their weaknesses in real-time, and builds an adaptive learning path toward their goals (SAT, ACT, college readiness).

---

## ✨ Features That Stand Out

### 1. Socratic AI Tutor (not a chatbot)
- Powered by LLaMA 3.3 70B (Groq) with a detailed student profile system prompt
- Uses **Socratic questioning**: guides students to answers rather than giving them outright
- References the student's actual performance history in every response
- Remembers full conversation context

### 2. Adaptive Practice Engine
- Questions dynamically selected based on **Item Response Theory (IRT)** scoring
- Three modes: Adaptive (targets weak spots), Weak Area Drill, SAT Full Drill
- Real-time feedback explains *why* each answer is right or wrong
- Performance tracked per skill, per session

### 3. Combined Study Mode (Unique Feature)
- Links **math + reading** in the same session — exactly what the SAT tests
- 4 session types: Data + Reading, Argument + Algebra, Science + Stats, History + Word Problems
- Cross-subject transfer accelerates learning faster than siloed practice
- Students practice the same cognitive skill (reasoning about evidence) in multiple contexts

### 4. Skill Gap Matrix
- Visual 4×4 matrix of all SAT skill areas
- Color-coded: Strong / Average / Weak
- Powered by **Spaced Repetition System (SRS)**: overdue topics surface automatically
- Error pattern detection: flags specific misconceptions, not just wrong answers

### 5. AI-Generated Weekly Study Plans
- Personalized 7-day schedule based on current mastery levels and SAT date
- Each task is assigned an estimated time, difficulty, and priority score
- Regenerates dynamically as student performance changes
- Checkable tasks with completion tracking

### 6. Detailed Progress Reports
- Line chart tracking SAT score projection over time
- Subject-by-subject mastery bars
- Top improvements + agent-generated recommendations
- Study time analytics (including time-of-day performance patterns)
- Streak tracking for motivation

---

## 🧠 How the Agent Works

```
Student answers question
        ↓
Performance logged per skill (IRT scoring)
        ↓
Gap analysis updated
        ↓
Next question selected (hardest weak skill due for review)
        ↓
Tutor chat references actual performance data
        ↓
Weekly plan regenerated overnight
        ↓
Student wakes up to a fresh, targeted plan
```

The agent makes decisions students don't have to:
- *Which topic should I study next?* → Agent decides (highest impact gap)
- *How hard should this question be?* → Adaptive difficulty
- *Am I improving?* → Visual report with projections
- *What should I do this week?* → AI-generated plan

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- An Groq API key ([get one here](https://console.groq.com/keys))

### Installation

```bash
git clone https://github.com/yourusername/eduagent-ai
cd eduagent-ai
npm install
```

### Configuration

Create a `.env` file:
```
VITE_GROQ_API_KEY=gsk_your_key_here
```

> ⚠️ For production, proxy API calls through your backend to protect the key.

### Run

```bash
npm run dev
```

Open `http://localhost:5173`

---

## 🗂 Project Structure

```
eduagent/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx       # Overview, metrics, today's plan
│   │   ├── Tutor.jsx           # Socratic AI chat interface
│   │   ├── Practice.jsx        # Adaptive question engine
│   │   ├── CombinedStudy.jsx   # Cross-subject sessions
│   │   ├── StudyPlan.jsx       # Weekly plan generator
│   │   ├── ProgressReport.jsx  # Charts, analytics, recommendations
│   │   └── SkillGaps.jsx       # Skill matrix + SRS
│   ├── lib/
│   │   ├── api.js              # Anthropic API client
│   │   ├── irt.js              # Item Response Theory scoring
│   │   ├── srs.js              # Spaced Repetition System
│   │   └── questions.js        # Question bank (SAT-aligned)
│   ├── store/
│   │   └── studentStore.js     # Student state management (Zustand)
│   └── App.jsx
├── public/
├── index.html
├── package.json
└── README.md
```

---

## 📊 Impact

**Who this serves**: Students at Title I schools who cannot afford tutoring — disproportionately Black, Latino, and low-income students.

**SAT score gap by income**: Students from families earning <$20K average 896; >$200K average 1150. That 254-point gap is entirely about access to preparation resources.

**What EduAgent changes**:
- Replaces $50/hr tutoring with always-available AI guidance
- Works on any device with a browser (no install required)
- Adapts to each student's unique gap profile — not a generic curriculum
- Builds study habits (streaks, plans, reminders) alongside skills

**Conservative estimate**: If a student uses EduAgent for 8 weeks before the SAT, the adaptive practice and Socratic tutoring target the highest-leverage gaps. Historical tutoring data suggests 40–80 point improvements are achievable. The difference between 1180 and 1260 is the difference between community college acceptance and university scholarship eligibility.

---

## 🛠 Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | React + Vite | Fast iteration, component reuse |
| AI | LLaMA 3.3 70B (Groq) (Anthropic) | Best reasoning + Socratic tutoring capability |
| State | Zustand | Lightweight, persists to localStorage |
| Charts | Chart.js | SAT score trend visualization |
| Styling | CSS variables (claude.ai design system) | Accessible, dark-mode ready |

---

## 📝 One-Page Write-Up

See [WRITEUP.md](./WRITEUP.md) for the full problem statement, agent architecture, and impact analysis.

---

## 🎬 Demo

[Watch the 3-minute demo →](https://youtu.be/your-demo-link)

The demo shows:
1. Jordan (a 10th grader) opens the dashboard and sees their score projection
2. The AI tutor identifies Quadratic Functions as the #1 gap
3. An adaptive practice session with real-time feedback
4. A Combined Study session linking data reading with math
5. The weekly plan regenerating after the session
6. The progress report showing improvement over 7 days

---

## License

MIT — use freely for educational purposes.
