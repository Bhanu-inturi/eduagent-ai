# 🚀 Run, Deploy & Submit — EduAgent AI

## Quick start (5 minutes)

### 1. Get your free Groq API key
Go to https://console.groq.com/keys → Sign up free → Create API key
Copy the key — it starts with `gsk_`

### 2. Install dependencies
```bash
cd eduagent-ai
npm install
```

### 3. Add your API key
Create a `.env` file in the project root:
```env
VITE_GROQ_API_KEY=gsk_your_key_here
```

### 4. Run locally
```bash
npm run dev
```
Open http://localhost:5173

**Demo login:** `jordan@student.edu` / `demo123`

---

## Why Groq?
- **Free tier** — generous limits, no credit card needed
- **Blazing fast** — LLaMA 3.3 70B responses in ~0.5s vs 2–3s for other providers
- **OpenAI-compatible** — standard `/v1/chat/completions` endpoint
- **Model used:** `llama-3.3-70b-versatile`

---

## Deploy to the web (free, 3 minutes)

### Option A — Netlify (recommended)

```bash
npm run build
```
1. Go to https://app.netlify.com/drop
2. Drag the `dist/` folder onto the page
3. Site settings → Environment variables → Add:
   - Key: `VITE_GROQ_API_KEY`
   - Value: `gsk_your_key_here`
4. Deploys → Trigger deploy

Your URL: `https://eduagent-ai.netlify.app`

---

### Option B — Vercel

```bash
npm install -g vercel
vercel --prod
```
When prompted for env vars, add `VITE_GROQ_API_KEY`.

---

## Push to GitHub

```bash
# Make sure .env is in .gitignore (it is already)
git init
git add .
git commit -m "EduAgent AI — hackathon submission"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/eduagent-ai.git
git push -u origin main
```

---

## Hackathon submission checklist

- [ ] Live demo URL (Netlify or Vercel)
- [ ] GitHub repo with README.md, WRITEUP.md, DEPLOY.md
- [ ] 3-minute video walkthrough

---

## Video script (3 minutes)

**0:00–0:20 — The problem**
"Students in underfunded schools don't have access to personal tutors. EduAgent gives every student an AI tutor that knows them personally — free."

**0:20–0:45 — Login + Dashboard**
Sign in as Jordan → show SAT projection, priority gaps, today's plan.
"The agent has already decided what Jordan should work on — Quadratic Functions at 30% accuracy."

**0:45–1:15 — AI Tutor + Voice**
Ask "help me with quadratic functions" → show Socratic response.
Click the microphone, speak a question → shows voice input.
Switch to Spanish → "One toggle. Now it tutors in Spanish — critical for ELL students."

**1:15–1:45 — Peer Study Room**
Open Study Room → start Quadratic Functions room.
Type as Jordan → toggle to Alex → show AI coaching both by name.
"Two students, one AI tutor. When Jordan gets it right, the AI asks Jordan to explain it to Alex. That's peer teaching — the most effective learning method we know."

**1:45–2:15 — Adaptive Practice**
Answer a question → show right/wrong feedback with explanation.
"Every answer updates Jordan's ability score using Item Response Theory. The next question is automatically chosen to target the weakest gap."

**2:15–2:45 — Progress Report**
Click Generate AI Report → show improvements, gaps, recommendations.
Show the score trend chart.

**2:45–3:00 — Close**
"This is what a $100/hour tutor does. EduAgent does it free, in English and Spanish, 24/7, for every student who needs it."

---

## Troubleshooting

**"401 Unauthorized"**
→ Check your Groq key starts with `gsk_` and is in `.env` as `VITE_GROQ_API_KEY`
→ Restart `npm run dev` after editing `.env`

**"Voice input not working"**
→ Requires Chrome or Edge (Web Speech API)
→ Must be on HTTPS or localhost (not plain http)
→ Grant microphone permission when prompted

**"Blank page after deploy"**
→ Add `base: './'` to `vite.config.js` for GitHub Pages
→ For Netlify/Vercel, leave base as default

**"Chart not rendering"**
→ Chart.js loads from CDN — needs internet connection
→ Renders on first visit to the Progress Report tab

---

## Project structure

```
eduagent-ai/
├── src/
│   ├── components/
│   │   ├── Auth.jsx            ← Login + Signup
│   │   ├── Sidebar.jsx         ← Navigation + score tracker
│   │   ├── Dashboard.jsx       ← Overview, metrics, today's plan
│   │   ├── Tutor.jsx           ← Socratic AI chat + voice + Spanish
│   │   ├── Practice.jsx        ← Adaptive question engine (IRT)
│   │   ├── PeerStudyRoom.jsx   ← Collaborative study (NEW)
│   │   ├── CombinedStudy.jsx   ← Cross-subject sessions
│   │   ├── StudyPlan.jsx       ← AI-generated weekly plan
│   │   ├── ProgressReport.jsx  ← Charts + AI analysis
│   │   ├── SkillGaps.jsx       ← Skill matrix + SRS
│   │   └── Achievements.jsx    ← Badge system
│   ├── store/studentStore.js   ← IRT + SRS state (Zustand)
│   ├── lib/api.js              ← Groq API client
│   ├── lib/questions.js        ← SAT question bank
│   ├── App.jsx                 ← Root + auth flow
│   └── main.jsx
├── index.html
├── vite.config.js
├── package.json
├── .env                        ← VITE_GROQ_API_KEY (never commit)
├── .env.example                ← Template to share
├── .gitignore
├── README.md
├── WRITEUP.md
└── DEPLOY.md                   ← This file
```
