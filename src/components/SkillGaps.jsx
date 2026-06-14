// src/components/SkillGaps.jsx
import React, { useState } from 'react';
import { useStudentStore } from '../store/studentStore';

function SkillDetail({ skill, data, onClose }) {
  return (
    <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12, padding: 20, marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 500 }}>{skill}</div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: 18 }}>
          <i className="ti ti-x" aria-hidden="true" />
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
        <div style={{ textAlign: 'center', padding: 12, background: 'var(--color-background-secondary)', borderRadius: 8 }}>
          <div style={{ fontSize: 20, fontWeight: 500, color: data.accuracy >= 0.75 ? '#3B6D11' : data.accuracy >= 0.5 ? '#854F0B' : '#A32D2D' }}>{Math.round(data.accuracy * 100)}%</div>
          <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>Accuracy</div>
        </div>
        <div style={{ textAlign: 'center', padding: 12, background: 'var(--color-background-secondary)', borderRadius: 8 }}>
          <div style={{ fontSize: 20, fontWeight: 500 }}>{data.questions}</div>
          <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>Questions done</div>
        </div>
        <div style={{ textAlign: 'center', padding: 12, background: 'var(--color-background-secondary)', borderRadius: 8 }}>
          <div style={{ fontSize: 20, fontWeight: 500, color: data.theta >= 0.5 ? '#3B6D11' : data.theta >= -0.3 ? '#854F0B' : '#A32D2D' }}>
            {data.theta > 0 ? '+' : ''}{data.theta.toFixed(1)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>IRT ability (θ)</div>
        </div>
      </div>
      <div style={{ fontSize: 12, lineHeight: 1.6, padding: '10px 12px', background: 'var(--color-background-secondary)', borderRadius: 8, color: 'var(--color-text-secondary)' }}>
        <strong>Next review:</strong> {new Date(data.nextReview) <= new Date() ? 'Due now' : `${Math.ceil((new Date(data.nextReview) - new Date()) / 86400000)} days`}
        {' · '}<strong>SRS interval:</strong> every {data.srsInterval} day{data.srsInterval !== 1 ? 's' : ''}
        {' · '}<strong>Category:</strong> {data.category}
      </div>
      <div style={{ marginTop: 12, fontSize: 13, padding: '10px 12px', background: data.accuracy < 0.5 ? '#FCEBEB' : data.accuracy < 0.75 ? '#FAEEDA' : '#EAF3DE', borderRadius: 8, color: data.accuracy < 0.5 ? '#501313' : data.accuracy < 0.75 ? '#412402' : '#173404' }}>
        {data.accuracy < 0.5
          ? `⚠️ This skill is weak. The agent has flagged it for daily review. Focus: attempt 10 questions per session until accuracy reaches 65%.`
          : data.accuracy < 0.75
          ? `📈 Improving. You're in the learning zone. Try harder difficulty questions to push toward mastery.`
          : `✓ Strong skill. Maintain with weekly review. The agent will free up this time slot for weaker areas.`}
      </div>
    </div>
  );
}

export default function SkillGaps() {
  const skills = useStudentStore((s) => s.skills);
  const [selected, setSelected] = useState(null);

  const getLevel = (accuracy) => accuracy >= 0.75 ? 'strong' : accuracy >= 0.5 ? 'avg' : 'weak';
  const levelStyles = {
    strong: { bg: '#EAF3DE', color: '#173404', label: 'Strong' },
    avg: { bg: '#FAEEDA', color: '#412402', label: 'Average' },
    weak: { bg: '#FCEBEB', color: '#501313', label: 'Weak' },
  };

  const byCategory = {};
  Object.entries(skills).forEach(([name, data]) => {
    const cat = data.category || 'general';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push([name, data]);
  });

  const overallWeak = Object.entries(skills).filter(([, s]) => s.accuracy < 0.5).length;
  const overallStrong = Object.entries(skills).filter(([, s]) => s.accuracy >= 0.75).length;
  const dueForReview = Object.entries(skills).filter(([, s]) => new Date(s.nextReview) <= new Date()).length;

  return (
    <div>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        <div style={{ textAlign: 'center', padding: 14, background: '#EAF3DE', borderRadius: 10 }}>
          <div style={{ fontSize: 22, fontWeight: 500, color: '#173404' }}>{overallStrong}</div>
          <div style={{ fontSize: 12, color: '#3B6D11', marginTop: 2 }}>Strong skills (≥75%)</div>
        </div>
        <div style={{ textAlign: 'center', padding: 14, background: '#FCEBEB', borderRadius: 10 }}>
          <div style={{ fontSize: 22, fontWeight: 500, color: '#501313' }}>{overallWeak}</div>
          <div style={{ fontSize: 12, color: '#A32D2D', marginTop: 2 }}>Weak skills (&lt;50%)</div>
        </div>
        <div style={{ textAlign: 'center', padding: 14, background: '#FAEEDA', borderRadius: 10 }}>
          <div style={{ fontSize: 22, fontWeight: 500, color: '#412402' }}>{dueForReview}</div>
          <div style={{ fontSize: 12, color: '#854F0B', marginTop: 2 }}>Due for review today</div>
        </div>
      </div>

      {selected && (
        <SkillDetail skill={selected} data={skills[selected]} onClose={() => setSelected(null)} />
      )}

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 12, fontSize: 12, color: 'var(--color-text-secondary)' }}>
        {Object.entries(levelStyles).map(([level, style]) => (
          <span key={level} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, background: style.bg, borderRadius: 2, display: 'inline-block' }} />
            {style.label}
          </span>
        ))}
        <span style={{ marginLeft: 'auto' }}>Click any cell for details</span>
      </div>

      {/* Matrix by category */}
      {Object.entries(byCategory).map(([cat, catSkills]) => (
        <div key={cat} style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10, textTransform: 'capitalize' }}>
            {cat === 'math' ? '🔢 Math' : cat === 'reading' ? '📖 Reading' : '✍️ Writing'} — {catSkills.length} skills
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {catSkills.map(([name, data]) => {
              const level = getLevel(data.accuracy);
              const style = levelStyles[level];
              const isDue = new Date(data.nextReview) <= new Date();
              return (
                <button
                  key={name}
                  onClick={() => setSelected(name)}
                  style={{ padding: '8px 6px', borderRadius: 8, background: style.bg, color: style.color, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: isDue ? `2px solid ${level === 'weak' ? '#D85A30' : level === 'avg' ? '#EF9F27' : '#639922'}` : '2px solid transparent', textAlign: 'center', position: 'relative', lineHeight: 1.3 }}
                  title={`${name}: ${Math.round(data.accuracy * 100)}%`}
                >
                  {isDue && (
                    <span style={{ position: 'absolute', top: 2, right: 4, fontSize: 8, color: '#A32D2D' }}>●</span>
                  )}
                  {name}
                  <div style={{ fontSize: 10, marginTop: 2, opacity: 0.8 }}>{Math.round(data.accuracy * 100)}%</div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* How it works */}
      <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>How the agent detects and targets your gaps</div>
        {[
          { icon: 'ti-math', title: 'Item Response Theory (IRT)', desc: 'Estimates your ability level (θ) per skill using a logistic model — not just counting right/wrong. A correct answer on a hard question improves your θ more than a correct answer on an easy one.' },
          { icon: 'ti-clock-repeat', title: 'Spaced Repetition (SRS)', desc: 'Topics are scheduled for review at increasing intervals: 1 → 3 → 7 → 14 → 30 days. Correct answers extend the interval; wrong answers reset it. Cells with a red dot are due today.' },
          { icon: 'ti-chart-scatter', title: 'Error Pattern Detection', desc: 'The agent tracks which sub-type of questions you miss. If you consistently struggle with the discriminant in quadratics, it flags that specific misconception — not just "quadratics are weak."' },
        ].map((item) => (
          <div key={item.title} style={{ padding: '10px 12px', borderLeft: '3px solid #5340c8', borderRadius: '0 8px 8px 0', background: 'var(--color-background-secondary)', marginBottom: 8, fontSize: 12, lineHeight: 1.6 }}>
            <div style={{ fontWeight: 500, marginBottom: 3 }}>
              <i className={`ti ${item.icon}`} aria-hidden="true" /> {item.title}
            </div>
            <div style={{ color: 'var(--color-text-secondary)' }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
