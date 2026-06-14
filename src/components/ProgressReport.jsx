// src/components/ProgressReport.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useStudentStore } from '../store/studentStore';
import { generateProgressReport } from '../lib/api';

function StatCard({ value, label, color }) {
  return (
    <div style={{ textAlign: 'center', padding: 14, background: 'var(--color-background-secondary)', borderRadius: 8 }}>
      <div style={{ fontSize: 22, fontWeight: 500, color: color || 'var(--color-text-primary)' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 3 }}>{label}</div>
    </div>
  );
}

export default function ProgressReport() {
  const student = useStudentStore((s) => s.student);
  const skills = useStudentStore((s) => s.skills);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [aiReport, setAiReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const overallMastery = Math.round(
    Object.values(skills).reduce((s, v) => s + v.accuracy, 0) / Object.keys(skills).length * 100
  );
  const overallAccuracy = Math.round(
    Object.values(skills).reduce((s, v) => s + v.accuracy, 0) / Object.keys(skills).length * 100
  );

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) { chartInstance.current.destroy(); }
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'SAT Projection',
            data: [1100, 1120, 1130, 1145, 1155, 1170, student.satProjection],
            borderColor: '#5340c8',
            backgroundColor: 'rgba(83,64,200,0.07)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#5340c8',
            pointRadius: 4,
          },
          {
            label: 'Goal',
            data: [student.satGoal, student.satGoal, student.satGoal, student.satGoal, student.satGoal, student.satGoal, student.satGoal],
            borderColor: '#E24B4A',
            borderDash: [4, 4],
            pointRadius: 0,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 1050, max: student.satGoal + 50, ticks: { font: { size: 11 } } },
          x: { ticks: { font: { size: 11 } } },
        },
      },
    });
    return () => chartInstance.current?.destroy();
  }, [student]);

  async function fetchAIReport() {
    setLoadingReport(true);
    try {
      const report = await generateProgressReport(student, skills, []);
      setAiReport(report);
    } catch {
      setAiReport(null);
    } finally {
      setLoadingReport(false);
    }
  }

  const weakSkills = Object.entries(skills)
    .filter(([, s]) => s.accuracy < 0.5)
    .sort((a, b) => a[1].accuracy - b[1].accuracy);

  const strongSkills = Object.entries(skills)
    .filter(([, s]) => s.accuracy >= 0.75)
    .sort((a, b) => b[1].accuracy - a[1].accuracy);

  return (
    <div>
      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        <StatCard value={`${overallMastery}%`} label="Overall mastery" color="#5340c8" />
        <StatCard value={student.totalQuestions} label="Questions answered" />
        <StatCard value={`${overallAccuracy}%`} label="Accuracy rate" color="#3B6D11" />
        <StatCard value={`${Math.round(student.totalStudyMinutes / 60 * 10) / 10}h`} label="Total study time" />
      </div>

      {/* Score chart */}
      <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>SAT score projection — this week</div>
          <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 3, background: '#5340c8', borderRadius: 2, display: 'inline-block' }} />Projection</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 0, border: '1.5px dashed #E24B4A', display: 'inline-block' }} />Goal {student.satGoal}</span>
          </div>
        </div>
        <div style={{ position: 'relative', height: 180 }}>
          <canvas ref={chartRef} role="img" aria-label={`SAT score projection over the week, trending from 1100 to ${student.satProjection}`}>
            SAT score trend this week
          </canvas>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        {/* Skill breakdown */}
        <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Skill breakdown (all {Object.keys(skills).length} skills)</div>
          <div style={{ maxHeight: 280, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Object.entries(skills)
              .sort((a, b) => a[1].accuracy - b[1].accuracy)
              .map(([name, s]) => {
                const pct = Math.round(s.accuracy * 100);
                const color = pct >= 75 ? '#639922' : pct >= 50 ? '#EF9F27' : '#D85A30';
                return (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <span style={{ flex: 1, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
                    <div style={{ width: 80, height: 5, background: 'var(--color-background-secondary)', borderRadius: 3, overflow: 'hidden', flexShrink: 0 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 11, color, minWidth: 28, textAlign: 'right' }}>{pct}%</span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Strengths and gaps summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12, padding: 14, flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Top strengths</div>
            {strongSkills.slice(0, 3).map(([name, s]) => (
              <div key={name} style={{ padding: '8px 0', borderBottom: '0.5px solid var(--color-border-tertiary)', fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
                <span>{name}</span>
                <span style={{ color: '#3B6D11', fontWeight: 500 }}>{Math.round(s.accuracy * 100)}%</span>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12, padding: 14, flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Priority gaps</div>
            {weakSkills.slice(0, 3).map(([name, s]) => (
              <div key={name} style={{ padding: '8px 0', borderBottom: '0.5px solid var(--color-border-tertiary)', fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
                <span>{name}</span>
                <span style={{ color: '#A32D2D', fontWeight: 500 }}>{Math.round(s.accuracy * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI-generated detailed report */}
      <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>
            <i className="ti ti-brain" aria-hidden="true" /> AI-generated detailed analysis
          </div>
          {!aiReport && (
            <button
              onClick={fetchAIReport}
              disabled={loadingReport}
              style={{ padding: '6px 14px', background: '#5340c8', color: 'white', border: 'none', borderRadius: 8, cursor: loadingReport ? 'default' : 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, opacity: loadingReport ? 0.7 : 1 }}
            >
              <i className={`ti ${loadingReport ? 'ti-loader' : 'ti-sparkles'}`} aria-hidden="true" />
              {loadingReport ? 'Analyzing...' : 'Generate AI Report'}
            </button>
          )}
        </div>

        {!aiReport && !loadingReport && (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--color-text-secondary)', fontSize: 13 }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>📊</div>
            Click "Generate AI Report" to get a personalized analysis of your progress, including specific recommendations for the next week.
          </div>
        )}

        {loadingReport && (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--color-text-secondary)', fontSize: 13 }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>🤖</div>
            Analyzing your performance data...
          </div>
        )}

        {aiReport && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 8, color: '#3B6D11' }}>
                <i className="ti ti-trending-up" aria-hidden="true" /> Top improvements
              </div>
              {(aiReport.improvements || []).map((item, i) => (
                <div key={i} style={{ padding: '8px 10px', background: 'var(--color-background-secondary)', borderRadius: 6, marginBottom: 6, fontSize: 12, lineHeight: 1.5, borderLeft: '3px solid #639922', paddingLeft: 10 }}>
                  <strong>{item.skill}</strong>: {item.detail}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 8, color: '#A32D2D' }}>
                <i className="ti ti-alert-triangle" aria-hidden="true" /> Priority gaps
              </div>
              {(aiReport.gaps || []).map((item, i) => (
                <div key={i} style={{ padding: '8px 10px', background: 'var(--color-background-secondary)', borderRadius: 6, marginBottom: 6, fontSize: 12, lineHeight: 1.5, borderLeft: '3px solid #D85A30', paddingLeft: 10 }}>
                  <strong>{item.skill}</strong>: {item.impact}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 8, color: '#5340c8' }}>
                <i className="ti ti-bulb" aria-hidden="true" /> Recommendations
              </div>
              {(aiReport.recommendations || []).map((item, i) => (
                <div key={i} style={{ padding: '8px 10px', background: 'var(--color-background-secondary)', borderRadius: 6, marginBottom: 6, fontSize: 12, lineHeight: 1.5, borderLeft: '3px solid #5340c8', paddingLeft: 10 }}>
                  {item.action}
                </div>
              ))}
              {aiReport.projection && (
                <div style={{ padding: '10px', background: '#EEEDFE', borderRadius: 8, fontSize: 12, marginTop: 6, color: '#26215C' }}>
                  Projected score: <strong>{aiReport.projection.score}</strong> if {aiReport.projection.condition}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
