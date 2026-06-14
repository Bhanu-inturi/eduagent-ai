// src/store/studentStore.js
// Central state management for EduAgent AI
// Uses Zustand with localStorage persistence

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Item Response Theory (IRT) ──────────────────────────────────────────────
// Estimates student ability per skill using a simplified 1-parameter logistic model.
// After each answer, updates the skill's theta (ability estimate).
function updateTheta(theta, correct, difficulty = 0) {
  const k = 0.5; // learning rate
  const p = 1 / (1 + Math.exp(-(theta - difficulty))); // predicted probability
  return theta + k * (correct ? 1 - p : 0 - p);
}

// ── Spaced Repetition System (SRS) ──────────────────────────────────────────
// Uses SM-2 algorithm intervals (days): 1, 3, 7, 14, 30
const SRS_INTERVALS = [1, 3, 7, 14, 30];
function getNextReviewDate(currentInterval, correct) {
  const idx = SRS_INTERVALS.indexOf(currentInterval);
  if (correct) {
    const nextIdx = Math.min(idx + 1, SRS_INTERVALS.length - 1);
    return { interval: SRS_INTERVALS[nextIdx], date: daysFromNow(SRS_INTERVALS[nextIdx]) };
  } else {
    return { interval: 1, date: daysFromNow(1) };
  }
}
function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

// ── Initial Skill State ──────────────────────────────────────────────────────
const INITIAL_SKILLS = {
  'Linear Equations':       { theta: 1.2, accuracy: 0.82, questions: 24, srsInterval: 7, nextReview: daysFromNow(6), category: 'math' },
  'Quadratic Functions':    { theta: -0.8, accuracy: 0.30, questions: 10, srsInterval: 1, nextReview: daysFromNow(0), category: 'math' },
  'Systems of Equations':   { theta: 0.0, accuracy: 0.50, questions: 14, srsInterval: 3, nextReview: daysFromNow(2), category: 'math' },
  'Functions & Models':     { theta: 0.3, accuracy: 0.60, questions: 12, srsInterval: 3, nextReview: daysFromNow(1), category: 'math' },
  'Geometry':               { theta: 0.8, accuracy: 0.71, questions: 18, srsInterval: 7, nextReview: daysFromNow(4), category: 'math' },
  'Statistics & Probability': { theta: 0.2, accuracy: 0.55, questions: 11, srsInterval: 3, nextReview: daysFromNow(2), category: 'math' },
  'Data Interpretation':    { theta: -1.2, accuracy: 0.40, questions: 10, srsInterval: 1, nextReview: daysFromNow(0), category: 'math' },
  'Ratios & Proportions':   { theta: 1.0, accuracy: 0.78, questions: 20, srsInterval: 7, nextReview: daysFromNow(5), category: 'math' },
  'Main Idea & Purpose':    { theta: 1.5, accuracy: 0.85, questions: 22, srsInterval: 14, nextReview: daysFromNow(10), category: 'reading' },
  'Inference':              { theta: 0.4, accuracy: 0.63, questions: 16, srsInterval: 3, nextReview: daysFromNow(2), category: 'reading' },
  'Vocab in Context':       { theta: 1.1, accuracy: 0.80, questions: 18, srsInterval: 7, nextReview: daysFromNow(6), category: 'reading' },
  'Command of Evidence':    { theta: 0.2, accuracy: 0.58, questions: 14, srsInterval: 3, nextReview: daysFromNow(1), category: 'reading' },
  'Words in Context':       { theta: 1.3, accuracy: 0.83, questions: 20, srsInterval: 14, nextReview: daysFromNow(9), category: 'reading' },
  'Expression of Ideas':    { theta: 0.1, accuracy: 0.54, questions: 12, srsInterval: 3, nextReview: daysFromNow(1), category: 'writing' },
  'Standard English':       { theta: -0.5, accuracy: 0.45, questions: 10, srsInterval: 1, nextReview: daysFromNow(0), category: 'writing' },
  'Rhetorical Skills':      { theta: 0.6, accuracy: 0.67, questions: 15, srsInterval: 7, nextReview: daysFromNow(3), category: 'writing' },
};

// ── Store ───────────────────────────────────────────────────────────────────
export const useStudentStore = create(
  persist(
    (set, get) => ({
      // Student profile
      student: {
        name: 'I.Bhanu sri',
        grade: 10,
        satGoal: 1400,
        satProjection: 1180,
        streakDays: 7,
        totalQuestions: 142,
        totalStudyMinutes: 744, // 12.4 hours
      },

      // Skill mastery (IRT-powered)
      skills: INITIAL_SKILLS,

      // Session history
      sessions: [],

      // Chat history for tutor
      chatHistory: [],

      // Plan task completion
      completedTasks: {},

      // ── Actions ──────────────────────────────────────────────────────────

      // Record a practice answer
      recordAnswer: (skillName, correct, difficulty = 0) => {
        const { skills, student } = get();
        const skill = skills[skillName];
        if (!skill) return;

        const newTheta = updateTheta(skill.theta, correct, difficulty);
        const { interval, date } = getNextReviewDate(skill.srsInterval, correct);
        const newQuestions = skill.questions + 1;
        const newAccuracy = (skill.accuracy * skill.questions + (correct ? 1 : 0)) / newQuestions;

        // Update SAT projection based on overall theta
        const allSkills = { ...skills, [skillName]: { ...skill, theta: newTheta } };
        const avgTheta = Object.values(allSkills).reduce((s, v) => s + v.theta, 0) / Object.keys(allSkills).length;
        const newProjection = Math.round(1000 + avgTheta * 80 + 180);

        set({
          skills: {
            ...skills,
            [skillName]: {
              ...skill,
              theta: newTheta,
              accuracy: newAccuracy,
              questions: newQuestions,
              srsInterval: interval,
              nextReview: date,
            },
          },
          student: {
            ...student,
            satProjection: Math.min(1600, Math.max(400, newProjection)),
            totalQuestions: student.totalQuestions + 1,
          },
        });
      },

      // Get the highest-priority skill to practice
      getNextSkill: () => {
        const { skills } = get();
        const now = new Date();
        const due = Object.entries(skills).filter(([, s]) => new Date(s.nextReview) <= now);
        if (due.length > 0) {
          // Sort by lowest theta (most need)
          due.sort((a, b) => a[1].theta - b[1].theta);
          return due[0][0];
        }
        // No reviews due — pick weakest skill
        return Object.entries(skills).sort((a, b) => a[1].theta - b[1].theta)[0][0];
      },

      // Get weak skills (theta < -0.3)
      getWeakSkills: () => {
        const { skills } = get();
        return Object.entries(skills)
          .filter(([, s]) => s.theta < -0.3)
          .sort((a, b) => a[1].theta - b[1].theta)
          .map(([name, data]) => ({ name, ...data }));
      },

      // Get skill level label
      getSkillLevel: (skillName) => {
        const { skills } = get();
        const skill = skills[skillName];
        if (!skill) return 'unset';
        if (skill.accuracy >= 0.75) return 'strong';
        if (skill.accuracy >= 0.50) return 'avg';
        return 'weak';
      },

      // Add chat message
      addChatMessage: (role, content) => {
        set((state) => ({
          chatHistory: [...state.chatHistory.slice(-20), { role, content }],
        }));
      },

      // Clear chat
      clearChat: () => set({ chatHistory: [] }),

      // Toggle plan task
      toggleTask: (dayIdx, taskIdx) => {
        const key = `${dayIdx}-${taskIdx}`;
        const { completedTasks } = get();
        set({ completedTasks: { ...completedTasks, [key]: !completedTasks[key] } });
      },
    }),
    {
      name: 'eduagent-student',
      partialize: (state) => ({
        student: state.student,
        skills: state.skills,
        sessions: state.sessions,
        completedTasks: state.completedTasks,
      }),
    }
  )
);

export default useStudentStore;
