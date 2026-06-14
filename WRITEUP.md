# EduAgent AI — One-Page Write-Up

## The Problem

In the United States, a student's SAT score correlates more strongly with family income than with academic ability. The reason is simple: wealthy students get private tutors ($50–100/hour), personalized prep courses ($1,500+), and years of individualized coaching. Students at Title I schools get a prep book if they're lucky.

This isn't a content gap — the curriculum is the same. It's an *access* gap. Every student deserves a tutor who knows their specific weaknesses, remembers what they've struggled with, and builds a targeted plan for them personally.

## The Solution: EduAgent AI

EduAgent is a true education **agent** — not a chatbot. The distinction matters:

| Chatbot | Agent |
|---------|-------|
| Answers questions when asked | Proactively identifies what the student should work on |
| Treats every student the same | Builds a model of each student's specific skill gaps |
| Passive | Makes decisions: what to study, how hard, how long |
| Forgets between sessions | Tracks progress over weeks and adjusts the plan |

### How the Agent Works

EduAgent maintains a persistent model of the student that includes:
- **Skill mastery scores** for every SAT topic area (16 skills tracked via Item Response Theory)
- **Spaced repetition schedule** — topics due for review surface automatically at the optimal interval
- **Error pattern log** — not just wrong answers, but *which sub-type* of question they miss
- **Performance timing** — tracking when the student learns best and how long sessions last
- **SAT score projection** — updated in real-time based on practice performance

When a student opens EduAgent, the agent has already decided:
1. Which skill has the highest impact gap right now
2. What difficulty level is optimal for that student today
3. How long the session should be based on their schedule
4. Whether today is a good day for new material or review

This is what a human tutor does in their head. EduAgent does it computationally, for free, for every student simultaneously.

### Standout Features

**Socratic Tutoring Mode**: Rather than just explaining answers, the AI asks guiding questions that lead the student to their own understanding. "What do you know about the sum of roots in a quadratic?" develops metacognitive skills a simple answer never would.

**Combined Study Sessions**: The SAT doesn't test math and reading in isolation — it tests reasoning about evidence across both domains. EduAgent's Combined Study mode links a reading passage with a math question about the same scenario. This is a pedagogically novel approach that transfers skills across subjects.

**Adaptive Question Selection**: Every question is selected based on the student's current estimated ability level for that specific skill. Too easy = no learning. Too hard = discouragement. The system targets the "zone of proximal development" automatically.

**AI-Generated Weekly Plans**: The agent builds a full 7-day study plan that changes as the student's performance changes. Miss a session? The plan adapts. Improve faster than expected in Geometry? The plan shifts focus to the next bottleneck.

## Impact

**Primary users**: Students at Title I public schools, grades 9–12, preparing for college admissions tests.

**Key metrics this changes**:
- Access to personalized tutoring: 0% → 100% for any student with internet
- Cost: $50–100/hr → $0 (API cost is cents per session)
- Availability: office hours → 24/7

**SAT score impact**: Research on adaptive tutoring systems consistently shows 30–100 point improvements over generic test prep. EduAgent's IRT-based gap targeting + Socratic dialogue is designed to replicate the conditions of human one-on-one tutoring.

**Downstream effects**: An 80-point SAT improvement can be the difference between waitlisted and admitted, between paying full tuition and receiving a merit scholarship. For a student from a low-income family, that scholarship can be the difference between attending college at all.

EduAgent doesn't just prep students for a test. It gives underserved students the same fighting chance that wealthier students have always had.
