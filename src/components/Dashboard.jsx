// src/components/Dashboard.jsx
import React from 'react';
import { useStudentStore } from '../store/studentStore';

function MetricCard({ value, label, delta, deltaUp }) {
  return (
    <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12, padding: 14 }}>
      <div style={{ fontSize: 22, fontWeight: 500 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>{label}</div>
      {delta && <div style={{ fontSize: 11, marginTop: 4, color: deltaUp ? '#3B6D11' : '#A32D2D' }}>{delta}</div>}
    </div>
  );
}

function SubjectBar({ label, pct, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
          {label}
        </span>
        <span>{pct}%</span>
      </div>
      <div style={{ height: 6, background: 'var(--color-background-secondary)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3 }} />
      </div>
    </div>
  );
}

const TODAY_TASKS = [
  { emoji: '🔢', title: 'Quadratic Practice', sub: '20 min · Adaptive', tag: 'High priority', tagColor: '#FAECE7', tagText: '#993C1D', done: false },
  { emoji: '📖', title: 'Reading Passage', sub: '15 min · SAT style', tag: 'Scheduled', tagColor: '#E1F5EE', tagText: '#085041', done: false },
  { emoji: '📊', title: 'Data Charts Review', sub: '25 min · Combined', tag: 'Combined', tagColor: '#EEEDFE', tagText: '#3C3489', done: false },
  { emoji: '✓', title: 'Vocab Review', sub: 'Completed · 18 min', tag: 'Done', tagColor: '#EAF3DE', tagText: '#173404', done: true },
];

export default function Dashboard({ onNavigate }) {
  const student = useStudentStore((s) => s.student);
  const skills = useStudentStore((s) => s.skills);
  const getWeakSkills = useStudentStore((s) => s.getWeakSkills);

  const weakSkills = getWeakSkills().slice(0, 3);
  const overallMastery = Math.round(
    Object.values(skills).reduce((s, v) => s + v.accuracy, 0) / Object.keys(skills).length * 100
  );

  return (
    <div>
      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        <MetricCard value={`${overallMastery}%`} label="Overall Mastery" delta="↑ 4% this week" deltaUp />
        <MetricCard value={student.totalQuestions} label="Questions Done" delta="↑ 18 today" deltaUp />
        <MetricCard value={student.satProjection} label="SAT Projection" delta="↑ 40 pts" deltaUp />
        <MetricCard value="2.4h" label="Study Time Today" delta="Above goal ✓" deltaUp />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        {/* Subject mastery */}
        <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-chart-bar" aria-hidden="true" />Subject Mastery
          </div>
          <SubjectBar label="SAT Math" pct={68} color="#5340c8" />
          <SubjectBar label="Reading & Writing" pct={81} color="#1D9E75" />
          <SubjectBar label="Algebra" pct={55} color="#EF9F27" />
          <SubjectBar label="Data Analysis" pct={42} color="#D85A30" />
          <SubjectBar label="Geometry" pct={71} color="#185FA5" />
        </div>

        {/* Priority gaps */}
        <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-alert-triangle" aria-hidden="true" />Priority Gaps — act now
          </div>
          {weakSkills.map((skill) => (
            <div key={skill.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: 'var(--color-background-secondary)', borderRadius: 8, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#FAECE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className="ti ti-math-function" style={{ color: '#993C1D', fontSize: 16 }} aria-hidden="true" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{skill.name}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                  {Math.round(skill.accuracy * 10)}/10 correct · SRS due
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => onNavigate('practice')}
            style={{ width: '100%', padding: '8px 0', background: '#5340c8', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 4 }}
          >
            <i className="ti ti-target" aria-hidden="true" />Start Gap Practice Session
          </button>
        </div>
      </div>

      {/* Today's plan */}
      <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="ti ti-calendar-week" aria-hidden="true" />Today's Study Plan
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {TODAY_TASKS.map((t) => (
            <div key={t.title} style={{ flex: '1 1 140px', padding: 10, background: t.done ? '#EAF3DE' : 'var(--color-background-secondary)', borderRadius: 8, fontSize: 12 }}>
              <div style={{ fontWeight: 500, marginBottom: 4, color: t.done ? '#173404' : 'var(--color-text-primary)' }}>{t.emoji} {t.title}</div>
              <div style={{ color: t.done ? '#3B6D11' : 'var(--color-text-secondary)' }}>{t.sub}</div>
              <div style={{ marginTop: 6 }}>
                <span style={{ background: t.tagColor, color: t.tagText, fontSize: 10, padding: '2px 6px', borderRadius: 8, fontWeight: 500 }}>{t.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
