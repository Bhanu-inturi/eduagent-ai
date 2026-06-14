// src/components/StudyPlan.jsx
import React, { useState } from 'react';
import { useStudentStore } from '../store/studentStore';
import { generateStudyPlan } from '../lib/api';

const DEFAULT_PLAN = [
  { day: 'Monday', tasks: [
    { title: 'Quadratic Functions — 20 questions', duration: 20, type: 'practice', skill: 'Quadratic Functions', priority: 'high' },
    { title: 'SAT Reading Passage: Science', duration: 15, type: 'practice', skill: 'Main Idea & Purpose', priority: 'medium' },
    { title: 'Vocab Flashcards', duration: 15, type: 'review', skill: 'Words in Context', priority: 'low' },
    { title: 'Review yesterday\'s mistakes', duration: 10, type: 'review', skill: 'General', priority: 'medium' },
  ]},
  { day: 'Tuesday', tasks: [
    { title: 'Data Interpretation — 15 questions', duration: 25, type: 'practice', skill: 'Data Interpretation', priority: 'high' },
    { title: 'Combined Study: Data + Reading', duration: 30, type: 'combined', skill: 'Cross-subject', priority: 'high' },
    { title: 'Linear Equations warmup', duration: 10, type: 'practice', skill: 'Linear Equations', priority: 'low' },
  ]},
  { day: 'Wednesday', tasks: [
    { title: 'Systems of Equations — 20 questions', duration: 25, type: 'practice', skill: 'Systems of Equations', priority: 'high' },
    { title: 'Grammar & Usage drill', duration: 20, type: 'practice', skill: 'Standard English', priority: 'medium' },
    { title: 'Combined Study: Argument + Algebra', duration: 30, type: 'combined', skill: 'Cross-subject', priority: 'medium' },
  ]},
  { day: 'Thursday', tasks: [
    { title: 'SAT Full Section: Math (37 min)', duration: 37, type: 'test', skill: 'SAT Math', priority: 'high' },
    { title: 'Reading Comprehension — 2 passages', duration: 20, type: 'practice', skill: 'Inference', priority: 'medium' },
    { title: 'Error pattern review with AI Tutor', duration: 15, type: 'review', skill: 'General', priority: 'medium' },
  ]},
  { day: 'Friday', tasks: [
    { title: 'Geometry review — 15 questions', duration: 20, type: 'practice', skill: 'Geometry', priority: 'medium' },
    { title: 'Writing & Language drill', duration: 20, type: 'practice', skill: 'Expression of Ideas', priority: 'medium' },
    { title: 'Combined Study: Science Passage + Stats', duration: 30, type: 'combined', skill: 'Cross-subject', priority: 'high' },
  ]},
  { day: 'Saturday', tasks: [
    { title: 'Full SAT Practice Test', duration: 180, type: 'test', skill: 'All', priority: 'high' },
    { title: 'Score analysis with AI Tutor', duration: 30, type: 'review', skill: 'General', priority: 'high' },
  ]},
  { day: 'Sunday', tasks: [
    { title: 'Light review: weak areas only', duration: 30, type: 'review', skill: 'Quadratic Functions', priority: 'low' },
    { title: 'Rest and prepare for next week', duration: 0, type: 'review', skill: 'General', priority: 'low' },
  ]},
];

const TYPE_COLORS = {
  practice: { bg: '#E6F1FB', text: '#0C447C' },
  combined: { bg: '#EEEDFE', text: '#3C3489' },
  test: { bg: '#FAECE7', text: '#4A1B0C' },
  review: { bg: '#EAF3DE', text: '#173404' },
};

const PRIORITY_COLORS = {
  high: { bg: '#FAECE7', text: '#993C1D' },
  medium: { bg: '#FAEEDA', text: '#633806' },
  low: { bg: '#EAF3DE', text: '#3B6D11' },
};

export default function StudyPlan() {
  const student = useStudentStore((s) => s.student);
  const skills = useStudentStore((s) => s.skills);
  const completedTasks = useStudentStore((s) => s.completedTasks);
  const toggleTask = useStudentStore((s) => s.toggleTask);

  const [plan, setPlan] = useState(DEFAULT_PLAN);
  const [generating, setGenerating] = useState(false);
  const [openDays, setOpenDays] = useState({ 0: true, 1: true });

  async function handleRegenerate() {
    setGenerating(true);
    try {
      const aiPlan = await generateStudyPlan(student, skills);
      if (aiPlan && Array.isArray(aiPlan)) setPlan(aiPlan);
    } catch (e) {
      // silently fall back to default
    } finally {
      setGenerating(false);
    }
  }

  function toggleDay(i) {
    setOpenDays((d) => ({ ...d, [i]: !d[i] }));
  }

  const totalMinutes = plan.reduce((s, d) => s + d.tasks.reduce((t, tk) => t + (tk.duration || 0), 0), 0);
  const totalTasks = plan.reduce((s, d) => s + d.tasks.length, 0);
  const doneTasks = Object.values(completedTasks).filter(Boolean).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>AI-generated plan · adapts to your performance daily</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 2 }}>
            {doneTasks}/{totalTasks} tasks done · {Math.round(totalMinutes / 60)}h {totalMinutes % 60}m total this week
          </div>
        </div>
        <button
          onClick={handleRegenerate}
          disabled={generating}
          style={{ padding: '7px 14px', background: '#5340c8', color: 'white', border: 'none', borderRadius: 8, cursor: generating ? 'default' : 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, opacity: generating ? 0.7 : 1 }}
        >
          <i className={`ti ${generating ? 'ti-loader' : 'ti-refresh'}`} aria-hidden="true" />
          {generating ? 'Generating...' : 'Regenerate with AI'}
        </button>
      </div>

      {plan.map((day, di) => {
        const dayDone = day.tasks.filter((_, ti) => completedTasks[`${di}-${ti}`]).length;
        const isOpen = openDays[di];
        return (
          <div key={day.day} style={{ border: '0.5px solid var(--color-border-tertiary)', borderRadius: 10, overflow: 'hidden', marginBottom: 8 }}>
            <div
              onClick={() => toggleDay(di)}
              style={{ padding: '10px 14px', background: 'var(--color-background-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{day.day}</span>
                {dayDone === day.tasks.length && dayDone > 0 && (
                  <span style={{ background: '#EAF3DE', color: '#3B6D11', fontSize: 10, padding: '1px 6px', borderRadius: 8, fontWeight: 500 }}>Complete ✓</span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ background: '#EEEDFE', color: '#3C3489', fontSize: 10, padding: '1px 6px', borderRadius: 8, fontWeight: 500 }}>
                  {dayDone}/{day.tasks.length} tasks
                </span>
                <i className={`ti ti-chevron-${isOpen ? 'up' : 'down'}`} style={{ fontSize: 14, color: 'var(--color-text-secondary)' }} aria-hidden="true" />
              </div>
            </div>

            {isOpen && (
              <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {day.tasks.map((task, ti) => {
                  const done = !!completedTasks[`${di}-${ti}`];
                  const typeStyle = TYPE_COLORS[task.type] || TYPE_COLORS.review;
                  const priStyle = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.low;
                  return (
                    <div key={ti} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: done ? '#f8fbf4' : 'var(--color-background-secondary)', borderRadius: 8, opacity: done ? 0.7 : 1 }}>
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => toggleTask(di, ti)}
                        style={{ accentColor: '#5340c8', cursor: 'pointer', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, textDecoration: done ? 'line-through' : 'none', color: done ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)' }}>
                          {task.title}
                        </div>
                        {task.duration > 0 && (
                          <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                            <i className="ti ti-clock" aria-hidden="true" /> {task.duration} min
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <span style={{ background: typeStyle.bg, color: typeStyle.text, fontSize: 10, padding: '1px 6px', borderRadius: 8, fontWeight: 500 }}>
                          {task.type}
                        </span>
                        <span style={{ background: priStyle.bg, color: priStyle.text, fontSize: 10, padding: '1px 6px', borderRadius: 8, fontWeight: 500 }}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
