// src/App.jsx — full app with auth + all screens
import React, { useState, useEffect } from 'react';
import { LoginScreen, SignupScreen } from './components/Auth';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Tutor from './components/Tutor';
import Practice from './components/Practice';
import PeerStudyRoom from './components/PeerStudyRoom';
import CombinedStudy from './components/CombinedStudy';
import StudyPlan from './components/StudyPlan';
import ProgressReport from './components/ProgressReport';
import SkillGaps from './components/SkillGaps';
import Achievements from './components/Achievements';

const SCREENS = {
  dashboard:    { component: Dashboard,      title: 'Dashboard' },
  tutor:        { component: Tutor,          title: 'AI Tutor — Socratic Mode' },
  practice:     { component: Practice,       title: 'Adaptive Practice' },
  peer:         { component: PeerStudyRoom,  title: 'Peer Study Room' },
  combined:     { component: CombinedStudy,  title: 'Combined Study' },
  plan:         { component: StudyPlan,      title: 'Study Plan' },
  report:       { component: ProgressReport, title: 'Progress Report' },
  gaps:         { component: SkillGaps,      title: 'Skill Gap Analysis' },
  achievements: { component: Achievements,   title: 'Achievements' },
};

export default function App() {
  const [authState, setAuthState] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [activeScreen, setActiveScreen] = useState('dashboard');

  useEffect(() => {
    const saved = localStorage.getItem('eduagent_user');
    if (saved) {
      try { setCurrentUser(JSON.parse(saved)); setAuthState('app'); } catch {}
    }
  }, []);

  function handleLogin(user) { setCurrentUser(user); setAuthState('app'); }
  function handleSignup(user) { setCurrentUser(user); setAuthState('app'); }
  function handleLogout() { localStorage.removeItem('eduagent_user'); setAuthState('login'); setCurrentUser(null); }

  if (authState === 'login') return <LoginScreen onLogin={handleLogin} onSwitchToSignup={() => setAuthState('signup')} />;
  if (authState === 'signup') return <SignupScreen onSignup={handleSignup} onSwitchToLogin={() => setAuthState('login')} />;

  const { component: Screen, title } = SCREENS[activeScreen] || SCREENS.dashboard;

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'var(--font-sans, system-ui)' }}>
      <Sidebar activeScreen={activeScreen} onNavigate={setActiveScreen} onLogout={handleLogout} user={currentUser} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--color-background-tertiary)' }}>
        <header style={{ padding: '10px 22px', borderBottom: '0.5px solid var(--color-border-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-background-primary)', flexShrink: 0 }}>
          <h1 style={{ fontSize: 15, fontWeight: 500, margin: 0 }}>{title}</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setActiveScreen('peer')} style={{ padding: '5px 11px', fontSize: 12, border: '0.5px solid var(--color-border-secondary)', borderRadius: 7, cursor: 'pointer', background: 'transparent', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <i className="ti ti-users" aria-hidden="true" /> Study Room
            </button>
            <button onClick={() => setActiveScreen('practice')} style={{ padding: '5px 11px', fontSize: 12, border: '0.5px solid var(--color-border-secondary)', borderRadius: 7, cursor: 'pointer', background: 'transparent', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <i className="ti ti-target" aria-hidden="true" /> Practice
            </button>
            <button onClick={() => setActiveScreen('tutor')} style={{ padding: '5px 11px', fontSize: 12, border: '0.5px solid #5340c8', borderRadius: 7, cursor: 'pointer', background: '#5340c8', color: 'white', display: 'flex', alignItems: 'center', gap: 5 }}>
              <i className="ti ti-message-chatbot" aria-hidden="true" /> Ask Tutor
            </button>
          </div>
        </header>
        <div style={{ flex: 1, overflow: 'auto', padding: 22 }}>
          <Screen onNavigate={setActiveScreen} />
        </div>
      </main>
    </div>
  );
}
