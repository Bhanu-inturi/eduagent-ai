// src/components/Tutor.jsx
// Socratic AI Tutor powered by Groq (llama-3.3-70b-versatile)
import React, { useState, useRef, useEffect } from 'react';
import { useStudentStore } from '../store/studentStore';
import { sendToTutor, groqChat } from '../lib/api';

const SUGGESTION_CHIPS = [
  'Help me with quadratic functions',
  'What should I study today?',
  'Give me a practice problem',
  'Explain data interpretation',
  'How do I improve my SAT score fast?',
  'Walk me through systems of equations',
];

const LANG_SYSTEM_ES = `Eres EduAgent, un tutor experto de SAT usando el método socrático. 
Estudiante: I.Bhanu sri, Grado 10. Meta: 1400/1600. Proyección actual: 1180/1600.
Áreas débiles: Funciones Cuadráticas (30%), Interpretación de Datos (40%).
REGLAS: Respuestas cortas (3-5 oraciones). Haz preguntas guía antes de dar respuestas. Responde SIEMPRE en español.`;

export default function Tutor() {
  const student = useStudentStore((s) => s.student);
  const skills  = useStudentStore((s) => s.skills);
  const addChatMessage = useStudentStore((s) => s.addChatMessage);

  const [lang, setLang] = useState('en');
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: `Hey ${student.name}! I've looked at your recent sessions. You're doing great on Reading (81%!), but Quadratic Functions and Data Interpretation are your biggest gaps right now. Want to tackle one of those, or is there something else on your mind?`,
  }]);
  const [input, setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const recognitionRef = useRef(null);
  const messagesEndRef  = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  // ── Voice input ──────────────────────────────────────────────────────────
  function toggleVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setVoiceStatus('Voice input needs Chrome or Edge.'); return; }

    if (voiceActive) {
      recognitionRef.current?.stop();
      setVoiceActive(false);
      setVoiceStatus('');
      return;
    }

    const r = new SR();
    r.lang = lang === 'es' ? 'es-ES' : 'en-US';
    r.interimResults = true;
    r.onstart  = () => { setVoiceActive(true); setVoiceStatus('Listening… speak now'); };
    r.onresult = (e) => {
      const transcript = Array.from(e.results).map((x) => x[0].transcript).join('');
      setInput(transcript);
      if (e.results[e.results.length - 1].isFinal) {
        setVoiceActive(false);
        setVoiceStatus('');
        handleSend(transcript);
      }
    };
    r.onerror = () => { setVoiceActive(false); setVoiceStatus('Could not hear you — try again.'); };
    recognitionRef.current = r;
    r.start();
  }

  // ── Send message ─────────────────────────────────────────────────────────
  async function handleSend(text) {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: msg };
    const updated = [...messages, userMsg];
    setMessages(updated);
    addChatMessage('user', msg);
    setLoading(true);

    try {
      // For Spanish, override the system prompt inside sendToTutor
      const apiMessages = updated.map((m) => ({ role: m.role, content: m.content }));
      let reply;
      if (lang === 'es') {
        reply = await groqChat(LANG_SYSTEM_ES, apiMessages);
      } else {
        reply = await sendToTutor(apiMessages, student, skills);
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      addChatMessage('assistant', reply);
    } catch (err) {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: `Connection error: ${err.message}. Check your VITE_GROQ_API_KEY in the .env file.`,
      }]);
    } finally {
      setLoading(false);
    }
  }

  const showChips = messages.length <= 1 && !loading;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', background: 'var(--color-background-primary)', borderRadius: 12, border: '0.5px solid var(--color-border-tertiary)', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '10px 14px', borderBottom: '0.5px solid var(--color-border-tertiary)', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--color-background-secondary)' }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#EEEDFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="ti ti-robot" style={{ color: '#3C3489', fontSize: 15 }} aria-hidden="true" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>EduAgent Tutor</div>
          <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Socratic mode · Groq LLaMA 3.3 · Knows your gaps</div>
        </div>

        {/* Language toggle */}
        <div style={{ display: 'flex', gap: 5 }}>
          {[['en', '🇺🇸 EN'], ['es', '🇪🇸 ES']].map(([code, label]) => (
            <button key={code} onClick={() => setLang(code)} style={{ padding: '3px 9px', fontSize: 11, border: '0.5px solid var(--color-border-secondary)', borderRadius: 6, cursor: 'pointer', background: lang === code ? '#5340c8' : 'transparent', color: lang === code ? 'white' : 'var(--color-text-secondary)', fontWeight: lang === code ? 500 : 400 }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#3B6D11' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#639922', display: 'inline-block' }} /> Online
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', maxWidth: '88%', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: msg.role === 'assistant' ? '#EEEDFE' : '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, color: msg.role === 'assistant' ? '#3C3489' : '#085041', flexShrink: 0, marginTop: 2 }}>
              {msg.role === 'assistant' ? <i className="ti ti-robot" style={{ fontSize: 13 }} aria-hidden="true" /> : 'JD'}
            </div>
            <div style={{ padding: '9px 13px', borderRadius: 10, fontSize: 13, lineHeight: 1.6, background: msg.role === 'assistant' ? 'var(--color-background-secondary)' : '#5340c8', color: msg.role === 'assistant' ? 'var(--color-text-primary)' : 'white', border: msg.role === 'assistant' ? '0.5px solid var(--color-border-tertiary)' : 'none', whiteSpace: 'pre-wrap' }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 8, maxWidth: '88%' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#EEEDFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="ti ti-robot" style={{ fontSize: 13, color: '#3C3489' }} aria-hidden="true" />
            </div>
            <div style={{ padding: '9px 13px', borderRadius: 10, background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)', display: 'flex', gap: 4, alignItems: 'center' }}>
              {[0, 1, 2].map((j) => (
                <span key={j} style={{ width: 5, height: 5, borderRadius: '50%', background: '#5340c8', display: 'inline-block', animation: `bounce 1.2s ${j * 0.2}s ease-in-out infinite` }} />
              ))}
            </div>
          </div>
        )}

        {showChips && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
            {SUGGESTION_CHIPS.map((chip) => (
              <button key={chip} onClick={() => handleSend(chip)} style={{ padding: '5px 11px', border: '0.5px solid var(--color-border-secondary)', borderRadius: 10, fontSize: 12, cursor: 'pointer', color: 'var(--color-text-secondary)', background: 'transparent', whiteSpace: 'nowrap' }}>
                {chip}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input row */}
      <div style={{ padding: '10px 14px', borderTop: '0.5px solid var(--color-border-tertiary)', display: 'flex', gap: 7, flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          {/* Voice button */}
          <button
            onClick={toggleVoice}
            title={voiceActive ? 'Stop listening' : 'Voice input (Chrome/Edge only)'}
            style={{ width: 32, height: 32, borderRadius: '50%', border: '0.5px solid var(--color-border-secondary)', background: voiceActive ? '#FCEBEB' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: voiceActive ? '#A32D2D' : 'var(--color-text-secondary)', flexShrink: 0, animation: voiceActive ? 'pulse 1s ease-in-out infinite' : 'none' }}
          >
            <i className={`ti ti-microphone${voiceActive ? '-off' : ''}`} style={{ fontSize: 14 }} aria-hidden="true" />
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={lang === 'es' ? 'Escribe tu pregunta…' : 'Ask anything — I know your gaps and goals…'}
            disabled={loading}
            style={{ flex: 1, padding: '8px 12px', border: '0.5px solid var(--color-border-secondary)', borderRadius: 8, fontSize: 13, background: 'var(--color-background-primary)', color: 'var(--color-text-primary)', outline: 'none' }}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            style={{ padding: '8px 14px', background: '#5340c8', color: 'white', border: 'none', borderRadius: 8, cursor: loading || !input.trim() ? 'default' : 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5, opacity: loading || !input.trim() ? 0.5 : 1 }}
          >
            <i className="ti ti-send" aria-hidden="true" />
          </button>
        </div>
        {voiceStatus && <div style={{ fontSize: 11, color: voiceActive ? '#A32D2D' : 'var(--color-text-secondary)', textAlign: 'center' }}>{voiceStatus}</div>}
      </div>

      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-4px)} }
        @keyframes pulse  { 0%,100%{transform:scale(1)}50%{transform:scale(1.1)} }
      `}</style>
    </div>
  );
}
