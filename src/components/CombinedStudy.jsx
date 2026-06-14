// src/components/CombinedStudy.jsx
import React, { useState } from 'react';

const SESSIONS = [
  { id: 'data', icon: '📊', title: 'Data + Reading', desc: 'Read a passage with an embedded chart, then answer both comprehension and math questions about the same data.', tags: ['Targets your #1 gap', '30 min'], tagColors: ['#FAECE7/#4A1B0C', '#EEEDFE/#26215C'] },
  { id: 'argument', icon: '💬', title: 'Argument + Algebra', desc: 'Analyze an argument passage, then solve related algebraic models of the same real-world scenario.', tags: ['Reinforces vocab', '25 min'], tagColors: ['#E1F5EE/#085041', '#EEEDFE/#26215C'] },
  { id: 'science', icon: '🔬', title: 'Science Passage + Stats', desc: 'SAT-style science passage with experimental data. Practice reading graphs and applying statistical reasoning.', tags: ['Data Analysis', '35 min'], tagColors: ['#FAEEDA/#633806', '#EEEDFE/#26215C'] },
  { id: 'history', icon: '🏛', title: 'History + Word Problems', desc: 'Historical documents paired with math word problems set in the same historical context.', tags: ['Cross-disciplinary', '30 min'], tagColors: ['#E6F1FB/#0C447C', '#EEEDFE/#26215C'] },
];

function DataSession() {
  const [phase, setPhase] = useState('reading'); // reading | math
  const [readingAns, setReadingAns] = useState(null);
  const [mathAns, setMathAns] = useState('');
  const [mathResult, setMathResult] = useState(null);

  return (
    <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12, padding: 20 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, fontSize: 11 }}>
        <span style={{ background: '#E1F5EE', color: '#085041', padding: '2px 8px', borderRadius: 10, fontWeight: 500 }}>Reading</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>→ then</span>
        <span style={{ background: '#FAECE7', color: '#4A1B0C', padding: '2px 8px', borderRadius: 10, fontWeight: 500 }}>Math</span>
      </div>

      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 10 }}>Passage: National Park Visitor Data (2019–2023)</div>
      <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--color-text-secondary)', marginBottom: 16, padding: 14, background: 'var(--color-background-secondary)', borderRadius: 8 }}>
        Yellowstone National Park recorded visitor counts of 4.0M, 3.8M, 2.9M, 4.9M, and 4.7M for the years 2019 through 2023 respectively. The 2020 decline was attributed to pandemic-related closures. Park management projects continued growth, modeling future attendance as <strong>V(t) = 4.7 + 0.3t</strong> million visitors, where t = years after 2023.
      </div>

      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Reading Question: What caused the 2020 visitor decline?</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {[
          { text: 'A) Budget cuts to park staff', correct: false, fb: 'Read again — the passage gives a specific cause.' },
          { text: 'B) Pandemic-related closures', correct: true, fb: 'Correct! The passage explicitly states pandemic-related closures caused the 2020 drop.' },
          { text: 'C) Natural disasters', correct: false, fb: 'This is not mentioned in the passage.' },
        ].map((opt, i) => {
          let bg = 'var(--color-background-primary)', border = 'var(--color-border-secondary)', color = 'var(--color-text-primary)';
          if (readingAns !== null) {
            if (opt.correct) { bg = '#EAF3DE'; border = '#3B6D11'; color = '#173404'; }
            else if (readingAns === i) { bg = '#FCEBEB'; border = '#A32D2D'; color = '#501313'; }
          }
          return (
            <button key={i} onClick={() => setReadingAns(i)} disabled={readingAns !== null} style={{ padding: '10px 14px', border: `0.5px solid ${border}`, borderRadius: 8, fontSize: 13, cursor: readingAns !== null ? 'default' : 'pointer', background: bg, color, textAlign: 'left' }}>
              {opt.text}
            </button>
          );
        })}
      </div>
      {readingAns !== null && readingAns !== 1 && (
        <div style={{ padding: 10, background: '#FCEBEB', color: '#501313', border: '0.5px solid #F09595', borderRadius: 8, fontSize: 13, marginBottom: 14 }}>
          Not quite — re-read: the passage directly states the 2020 decline was from pandemic-related closures.
        </div>
      )}
      {readingAns === 1 && (
        <div style={{ padding: 10, background: '#EAF3DE', color: '#173404', border: '0.5px solid #97C459', borderRadius: 8, fontSize: 13, marginBottom: 14 }}>
          Correct! Now let's connect this to the math.
        </div>
      )}

      <div style={{ borderTop: '0.5px solid var(--color-border-tertiary)', paddingTop: 14, marginTop: 4 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Math Question: Using the projection model, how many visitors (millions) does the park expect in 2026?</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
          <input type="number" step="0.1" value={mathAns} onChange={(e) => setMathAns(e.target.value)} placeholder="Enter answer" style={{ width: 140, padding: '8px 12px', border: '0.5px solid var(--color-border-secondary)', borderRadius: 8, fontSize: 13, background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }} />
          <button onClick={() => {
            const v = parseFloat(mathAns);
            setMathResult(Math.abs(v - 5.6) < 0.05 ? 'correct' : 'wrong');
          }} style={{ padding: '8px 14px', background: '#5340c8', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
            Check
          </button>
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Hint: t = 2026 − 2023 = 3</div>
        {mathResult && (
          <div style={{ marginTop: 10, padding: 10, background: mathResult === 'correct' ? '#EAF3DE' : '#FCEBEB', color: mathResult === 'correct' ? '#173404' : '#501313', border: `0.5px solid ${mathResult === 'correct' ? '#97C459' : '#F09595'}`, borderRadius: 8, fontSize: 13 }}>
            {mathResult === 'correct' ? '✓ Correct! V(3) = 4.7 + 0.3(3) = 5.6 million visitors. Notice how the reading passage context helps you understand what V and t represent.' : 'Not quite. Try: V(3) = 4.7 + 0.3 × 3. What does t represent here?'}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CombinedStudy() {
  const [active, setActive] = useState(null);

  return (
    <div>
      <div style={{ background: 'linear-gradient(90deg, #EEEDFE 0%, #E1F5EE 100%)', border: '0.5px solid #AFA9EC', borderRadius: 12, padding: '14px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, background: '#EEEDFE', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <i className="ti ti-stack-2" style={{ color: '#3C3489', fontSize: 18 }} aria-hidden="true" />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#26215C' }}>Combined Study Mode</div>
          <div style={{ fontSize: 12, color: '#534AB7', marginTop: 2 }}>Links math reasoning with reading comprehension — the same skill set the SAT actually tests.</div>
        </div>
      </div>

      {!active && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {SESSIONS.map((s, i) => (
            <div key={s.id} onClick={() => setActive(s.id)} style={{ background: 'var(--color-background-primary)', border: i === 0 ? '1.5px solid #AFA9EC' : '0.5px solid var(--color-border-tertiary)', borderRadius: 12, padding: 16, cursor: 'pointer' }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>{s.icon} {s.title}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>{s.desc}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {s.tags.map((t, j) => {
                  const [bg, col] = s.tagColors[j].split('/');
                  return <span key={t} style={{ background: bg, color: col, fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 500 }}>{t}</span>;
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {active === 'data' && (
        <div>
          <button onClick={() => setActive(null)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: 14 }}>
            <i className="ti ti-arrow-left" aria-hidden="true" /> Back to sessions
          </button>
          <DataSession />
        </div>
      )}

      {active && active !== 'data' && (
        <div>
          <button onClick={() => setActive(null)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: 14 }}>
            <i className="ti ti-arrow-left" aria-hidden="true" /> Back to sessions
          </button>
          <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12, padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{SESSIONS.find(s => s.id === active)?.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>{SESSIONS.find(s => s.id === active)?.title}</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 20 }}>This session is coming soon in the full app. For the demo, try the Data + Reading session!</div>
            <button onClick={() => setActive('data')} style={{ padding: '8px 20px', background: '#5340c8', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
              Try Data + Reading instead
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
