// src/components/Sidebar.jsx
import React from 'react';
import { useStudentStore } from '../store/studentStore';

const NAV = [
  { id: 'dashboard',    icon: 'ti-layout-dashboard', label: 'Dashboard',       section: 'Learn' },
  { id: 'tutor',        icon: 'ti-message-chatbot',  label: 'AI Tutor' },
  { id: 'practice',     icon: 'ti-target',           label: 'Practice' },
  { id: 'peer',         icon: 'ti-users',            label: 'Study Room',      badge: 'Live', badgeColor: '#EAF3DE', badgeText: '#3B6D11' },
  { id: 'combined',     icon: 'ti-stack-2',          label: 'Combined Study',  badge: 'New',  badgeColor: '#EEEDFE', badgeText: '#3C3489' },
  { id: 'plan',         icon: 'ti-calendar-week',    label: 'Study Plan',      section: 'Track' },
  { id: 'report',       icon: 'ti-chart-bar',        label: 'Progress Report' },
  { id: 'gaps',         icon: 'ti-brain',            label: 'Skill Gaps' },
  { id: 'achievements', icon: 'ti-trophy',           label: 'Achievements' },
];

export default function Sidebar({ activeScreen, onNavigate, onLogout, user }) {
  const student = useStudentStore((s) => s.student);
  const pct = Math.min(100, Math.round((student.satProjection / student.satGoal) * 100));
  const name = user?.name || student.name;
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <aside style={{ width: 218, borderRight: '0.5px solid var(--color-border-tertiary)', display: 'flex', flexDirection: 'column', background: 'var(--color-background-secondary)', flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: '14px 16px', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#5340c8', display: 'inline-block' }} />
          EduAgent AI
        </div>
      </div>

      {/* Student info */}
      <div style={{ padding: '10px 16px', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#EEEDFE', color: '#3C3489', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, flexShrink: 0 }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500 }}>{name}</div>
            <div style={{ fontSize: 10, color: 'var(--color-text-secondary)' }}>Grade {user?.grade || student.grade} · SAT Track</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#FAEEDA', borderRadius: 10, padding: '2px 7px', width: 'fit-content', fontSize: 10, color: '#633806', marginTop: 6 }}>
          <i className="ti ti-flame" aria-hidden="true" /> {student.streakDays}-day streak
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '6px 0', overflowY: 'auto' }}>
        {NAV.map((item) => (
          <React.Fragment key={item.id}>
            {item.section && (
              <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', padding: '10px 16px 3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {item.section}
              </div>
            )}
            <button
              onClick={() => onNavigate(item.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 16px', fontSize: 12, cursor: 'pointer', width: '100%', textAlign: 'left', border: 'none', background: activeScreen === item.id ? 'var(--color-background-primary)' : 'transparent', color: activeScreen === item.id ? '#5340c8' : 'var(--color-text-secondary)', fontWeight: activeScreen === item.id ? 500 : 400 }}
            >
              <i className={`ti ${item.icon}`} style={{ fontSize: 15, width: 16 }} aria-hidden="true" />
              {item.label}
              {item.badge && (
                <span style={{ marginLeft: 'auto', background: item.badgeColor, color: item.badgeText, fontSize: 9, padding: '1px 5px', borderRadius: 6, fontWeight: 500 }}>
                  {item.badge}
                </span>
              )}
            </button>
          </React.Fragment>
        ))}
      </nav>

      {/* Score progress */}
      <div style={{ padding: '10px 16px', borderTop: '0.5px solid var(--color-border-tertiary)' }}>
        <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginBottom: 5 }}>SAT Goal Score</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
          <span style={{ fontWeight: 500 }}>Current: {student.satProjection}</span>
          <span style={{ color: '#5340c8' }}>Goal: {student.satGoal}</span>
        </div>
        <div style={{ height: 5, background: 'var(--color-background-primary)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: '#5340c8', borderRadius: 3, transition: 'width 0.6s ease' }} />
        </div>
        <div style={{ fontSize: 9, color: 'var(--color-text-tertiary)', marginTop: 3 }}>{pct}% of the way there</div>
      </div>

      {/* Logout */}
      <button onClick={onLogout} style={{ padding: '10px 16px', fontSize: 11, color: 'var(--color-text-tertiary)', background: 'transparent', border: 'none', borderTop: '0.5px solid var(--color-border-tertiary)', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 6 }}>
        <i className="ti ti-logout" aria-hidden="true" /> Sign out
      </button>
    </aside>
  );
}
