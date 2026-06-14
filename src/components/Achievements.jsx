// src/components/Achievements.jsx
// Gamification layer — badges unlock as the student hits milestones
// Stored in Zustand + localStorage. Drives re-engagement (biggest dropout cause).
import React from 'react';
import { useStudentStore } from '../store/studentStore';

const ALL_ACHIEVEMENTS = [
  {
    id: 'first_correct',
    emoji: '🎯',
    title: 'First correct',
    desc: 'Get your first question right',
    xp: 10,
    check: (s) => s.totalQuestions >= 1,
  },
  {
    id: 'streak_3',
    emoji: '🔥',
    title: '3-day streak',
    desc: 'Study 3 days in a row',
    xp: 25,
    check: (s) => s.streakDays >= 3,
  },
  {
    id: 'streak_7',
    emoji: '🔥🔥',
    title: '7-day streak',
    desc: 'Study 7 days in a row',
    xp: 75,
    check: (s) => s.streakDays >= 7,
  },
  {
    id: 'questions_50',
    emoji: '🧮',
    title: 'Math focus',
    desc: 'Answer 50 questions',
    xp: 50,
    check: (s) => s.totalQuestions >= 50,
  },
  {
    id: 'questions_100',
    emoji: '💯',
    title: 'Century',
    desc: 'Answer 100 questions',
    xp: 100,
    check: (s) => s.totalQuestions >= 100,
  },
  {
    id: 'projection_1200',
    emoji: '📈',
    title: 'Breaking 1200',
    desc: 'SAT projection reaches 1200',
    xp: 80,
    check: (s) => s.satProjection >= 1200,
  },
  {
    id: 'projection_1300',
    emoji: '🚀',
    title: 'On track',
    desc: 'SAT projection reaches 1300',
    xp: 150,
    check: (s) => s.satProjection >= 1300,
  },
  {
    id: 'peer_room',
    emoji: '🤝',
    title: 'Study buddy',
    desc: 'Join your first peer study room',
    xp: 30,
    check: () => false, // unlocked manually via store
  },
  {
    id: 'goal_reached',
    emoji: '🏆',
    title: 'SAT ready',
    desc: 'Reach your goal score projection',
    xp: 500,
    check: (s) => s.satProjection >= s.satGoal,
  },
];

export default function Achievements() {
  const student = useStudentStore((s) => s.student);

  const achievements = ALL_ACHIEVEMENTS.map((a) => ({
    ...a,
    unlocked: a.check(student),
  }));

  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);
  const totalXP = unlocked.reduce((s, a) => s + a.xp, 0);

  return (
    <div>
      {/* XP summary */}
      <div style={{ background: 'linear-gradient(90deg, #EEEDFE, #E1F5EE)', border: '0.5px solid #AFA9EC', borderRadius: 12, padding: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ textAlign: 'center', padding: '8px 16px', background: 'rgba(255,255,255,0.5)', borderRadius: 8 }}>
          <div style={{ fontSize: 24, fontWeight: 500, color: '#26215C' }}>{totalXP}</div>
          <div style={{ fontSize: 11, color: '#534AB7' }}>Total XP</div>
        </div>
        <div style={{ textAlign: 'center', padding: '8px 16px', background: 'rgba(255,255,255,0.5)', borderRadius: 8 }}>
          <div style={{ fontSize: 24, fontWeight: 500, color: '#26215C' }}>{unlocked.length}</div>
          <div style={{ fontSize: 11, color: '#534AB7' }}>Badges earned</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: '#534AB7', marginBottom: 6 }}>Progress to next badge</div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.5)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(unlocked.length / ALL_ACHIEVEMENTS.length) * 100}%`, background: '#5340c8', borderRadius: 3 }} />
          </div>
          <div style={{ fontSize: 11, color: '#534AB7', marginTop: 4 }}>{unlocked.length}/{ALL_ACHIEVEMENTS.length} badges</div>
        </div>
      </div>

      {/* Earned */}
      {unlocked.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10, color: '#3B6D11', display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="ti ti-trophy" aria-hidden="true" /> Earned ({unlocked.length})
          </div>
          {unlocked.map((a) => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#EAF3DE', border: '0.5px solid #C0DD97', borderRadius: 10, marginBottom: 8 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#FAEEDA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                {a.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#173404' }}>{a.title}</div>
                <div style={{ fontSize: 12, color: '#3B6D11', marginTop: 2 }}>{a.desc}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#3B6D11' }}>+{a.xp} XP</div>
                <div style={{ fontSize: 10, color: '#639922', marginTop: 2 }}>Earned</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Locked */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="ti ti-lock" aria-hidden="true" /> Locked ({locked.length})
        </div>
        {locked.map((a) => (
          <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 10, marginBottom: 8, opacity: 0.55 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, filter: 'grayscale(1)' }}>
              {a.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{a.title}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>{a.desc}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>+{a.xp} XP</div>
              <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginTop: 2 }}>Locked</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
