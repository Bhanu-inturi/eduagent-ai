// src/components/Auth.jsx
import React, { useState } from 'react';

const DEMO_EMAIL = 'demo@eduagent.ai';
const DEMO_PASSWORD = 'demo123';

function AuthLeft({ bg, tagline, stats }) {
  return (
    <div style={{ width: 240, background: bg, padding: '32px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0 }}>
      <div>
        <div style={{ color: 'white', fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.6)', display: 'inline-block' }} />
          EduAgent AI
        </div>
        <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, lineHeight: 1.7, marginTop: 12 }}>{tagline}</div>
      </div>
      <div>
        {stats.map((s) => (
          <div key={s} style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="ti ti-check" aria-hidden="true" /> {s}
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoginScreen({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState('demo@eduagent.ai');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');

  function handleLogin() {
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const isDemo = email.toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
    const name = isDemo ? 'Demo Student' : email.split('@')[0];

    const user = { email, name, grade: 10, satGoal: 1400, isDemo };
    localStorage.setItem('eduagent_user', JSON.stringify(user));
    onLogin(user);
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AuthLeft
        bg="#5340c8"
        tagline="Every student deserves a tutor who knows their gaps, builds their plan, and never gives up on them."
        stats={['Free for all students', 'Adaptive · Socratic · Personal', 'English and Spanish support']}
      />
      <div style={{ flex: 1, padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--color-background-primary)' }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>Welcome back</h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 28 }}>Sign in to continue your SAT prep</p>

        <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 5 }}>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="your@email.com"
          style={{ width: '100%', padding: '9px 12px', border: '0.5px solid var(--color-border-secondary)', borderRadius: 8, fontSize: 13, marginBottom: 14, background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}
        />

        <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 5 }}>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="••••••••"
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          style={{ width: '100%', padding: '9px 12px', border: '0.5px solid var(--color-border-secondary)', borderRadius: 8, fontSize: 13, marginBottom: error ? 8 : 20, background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}
        />

        {error && <p style={{ fontSize: 12, color: '#A32D2D', marginBottom: 14 }}>{error}</p>}

        <button
          onClick={handleLogin}
          style={{ width: '100%', padding: 10, background: '#5340c8', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
        >
          Sign in
        </button>

        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: 16 }}>
          New student?{' '}
          <span onClick={onSwitchToSignup} style={{ color: '#5340c8', cursor: 'pointer', fontWeight: 500 }}>
            Create a free account →
          </span>
        </p>

        {/* Demo hint for judges */}
        <div style={{ marginTop: 20, padding: '10px 12px', background: 'var(--color-background-secondary)', borderRadius: 8, fontSize: 11, color: 'var(--color-text-secondary)', textAlign: 'center' }}>
          <strong>Demo:</strong> demo@eduagent.ai / demo123
          <br />or sign up with any email for a fresh start
        </div>
      </div>
    </div>
  );
}

export function SignupScreen({ onSignup, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState('10');
  const [goal, setGoal] = useState('1400');
  const [error, setError] = useState('');

  function handleSignup() {
    if (!name.trim() || !email.trim()) { setError('Please fill in your name and email.'); return; }
    if (!email.includes('@')) { setError('Please enter a valid email address.'); return; }
    const user = { email, name, grade: parseInt(grade), satGoal: parseInt(goal), isDemo: false };
    localStorage.setItem('eduagent_user', JSON.stringify(user));
    onSignup(user);
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AuthLeft
        bg="#1D9E75"
        tagline="Join thousands of students using AI-powered tutoring to close the gap and reach their SAT goals."
        stats={['Average 80-point improvement', 'Study at your own pace', 'Works on any device, free']}
      />
      <div style={{ flex: 1, padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--color-background-primary)' }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>Create your account</h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 28 }}>It's free — always.</p>

        {[
          { label: 'Full name', value: name, set: setName, type: 'text', placeholder: 'Your full name' },
          { label: 'Email', value: email, set: setEmail, type: 'email', placeholder: 'your@email.com' },
        ].map((f) => (
          <div key={f.label} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 5 }}>{f.label}</label>
            <input
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              type={f.type}
              placeholder={f.placeholder}
              style={{ width: '100%', padding: '9px 12px', border: '0.5px solid var(--color-border-secondary)', borderRadius: 8, fontSize: 13, background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}
            />
          </div>
        ))}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 5 }}>Grade</label>
            <select value={grade} onChange={(e) => setGrade(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '0.5px solid var(--color-border-secondary)', borderRadius: 8, fontSize: 13, background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}>
              {[9, 10, 11, 12].map((g) => <option key={g} value={g}>Grade {g}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 5 }}>SAT goal score</label>
            <select value={goal} onChange={(e) => setGoal(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '0.5px solid var(--color-border-secondary)', borderRadius: 8, fontSize: 13, background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}>
              {[1200, 1300, 1400, 1500, 1600].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {error && <p style={{ fontSize: 12, color: '#A32D2D', marginBottom: 10 }}>{error}</p>}

        <button
          onClick={handleSignup}
          style={{ width: '100%', padding: 10, background: '#1D9E75', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', marginBottom: 14 }}
        >
          Create free account
        </button>

        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', textAlign: 'center' }}>
          Already have an account?{' '}
          <span onClick={onSwitchToLogin} style={{ color: '#5340c8', cursor: 'pointer', fontWeight: 500 }}>Sign in →</span>
        </p>
      </div>
    </div>
  );
}