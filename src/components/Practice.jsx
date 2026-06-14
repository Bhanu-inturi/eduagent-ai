// src/components/Practice.jsx
import React, { useState } from 'react';
import { useStudentStore } from '../store/studentStore';
import { getAdaptiveQuestions } from '../lib/questions';

export default function Practice() {
  const skills = useStudentStore((s) => s.skills);
  const recordAnswer = useStudentStore((s) => s.recordAnswer);
  const [questions] = useState(() => getAdaptiveQuestions(skills, 10));
  const [qIdx, setQIdx] = useState(0);
  const [answered, setAnswered] = useState(null); // null | 'correct' | 'wrong'
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0 });
  const [tab, setTab] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[qIdx];

  function handleAnswer(option) {
    if (answered) return;
    const result = option.correct ? 'correct' : 'wrong';
    setAnswered({ result, feedback: option.feedback });
    recordAnswer(q.skill, option.correct, q.difficulty);
    setSessionStats((s) => ({ ...s, [result]: s[result] + 1 }));
  }

  function handleNext() {
    if (qIdx >= questions.length - 1) { setFinished(true); return; }
    setQIdx((i) => i + 1);
    setAnswered(null);
  }

  if (finished) {
    const acc = Math.round((sessionStats.correct / (sessionStats.correct + sessionStats.wrong)) * 100);
    return (
      <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12, padding: 32, textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>{acc >= 80 ? '🎉' : acc >= 60 ? '💪' : '📚'}</div>
        <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>Session Complete!</div>
        <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 24 }}>
          {sessionStats.correct} correct, {sessionStats.wrong} wrong — {acc}% accuracy
        </div>
        <div style={{ background: 'var(--color-background-secondary)', borderRadius: 8, padding: 14, fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 20, textAlign: 'left' }}>
          {acc >= 80
            ? '✓ Great session! Your IRT ability score has been updated. Keep this up.'
            : acc >= 60
            ? 'Solid effort. Review the questions you missed — the agent has updated your spaced repetition schedule.'
            : 'These gaps are now top priority in your study plan. The agent will focus here tomorrow.'}
        </div>
        <button onClick={() => { setQIdx(0); setAnswered(null); setFinished(false); setSessionStats({ correct: 0, wrong: 0 }); }} style={{ padding: '8px 20px', background: '#5340c8', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
          Practice Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 0, borderBottom: '0.5px solid var(--color-border-tertiary)', marginBottom: 16 }}>
        {['Adaptive', 'Weak Areas', 'SAT Drill'].map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{ padding: '8px 16px', fontSize: 13, cursor: 'pointer', border: 'none', background: 'transparent', color: tab === i ? '#5340c8' : 'var(--color-text-secondary)', fontWeight: tab === i ? 500 : 400, borderBottom: tab === i ? '2px solid #5340c8' : '2px solid transparent' }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12, padding: 20, marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ background: '#FAECE7', color: '#4A1B0C', fontSize: 11, padding: '2px 8px', borderRadius: 10, fontWeight: 500 }}>{q.skill}</span>
            <span style={{ background: '#FAEEDA', color: '#633806', fontSize: 11, padding: '2px 8px', borderRadius: 10, fontWeight: 500 }}>
              {q.difficulty < -0.3 ? 'Easy' : q.difficulty < 0.5 ? 'Medium' : 'Hard'}
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Q {qIdx + 1} of {questions.length}</div>
        </div>

        <div style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{q.text}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {q.options.map((opt, i) => {
            let bg = 'var(--color-background-primary)';
            let border = 'var(--color-border-secondary)';
            let color = 'var(--color-text-primary)';
            if (answered) {
              if (opt.correct) { bg = '#EAF3DE'; border = '#3B6D11'; color = '#173404'; }
              else if (!opt.correct && answered.feedback === opt.feedback) { bg = '#FCEBEB'; border = '#A32D2D'; color = '#501313'; }
            }
            return (
              <button key={i} onClick={() => handleAnswer(opt)} disabled={!!answered} style={{ padding: '10px 14px', border: `0.5px solid ${border}`, borderRadius: 8, fontSize: 13, cursor: answered ? 'default' : 'pointer', background: bg, color, textAlign: 'left', transition: 'all 0.15s' }}>
                {opt.text}
              </button>
            );
          })}
        </div>

        {answered && (
          <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: answered.result === 'correct' ? '#EAF3DE' : '#FCEBEB', color: answered.result === 'correct' ? '#173404' : '#501313', border: `0.5px solid ${answered.result === 'correct' ? '#97C459' : '#F09595'}`, fontSize: 13, lineHeight: 1.6 }}>
            {answered.feedback}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
          <i className="ti ti-brain" aria-hidden="true" /> {sessionStats.correct} correct, {sessionStats.wrong} wrong this session
        </div>
        <button onClick={handleNext} disabled={!answered} style={{ padding: '7px 16px', background: '#5340c8', color: 'white', border: 'none', borderRadius: 8, cursor: answered ? 'pointer' : 'default', fontSize: 13, opacity: answered ? 1 : 0.4, display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="ti ti-arrow-right" aria-hidden="true" />{qIdx >= questions.length - 1 ? 'Finish' : 'Next Question'}
        </button>
      </div>
    </div>
  );
}
