// src/components/PeerStudyRoom.jsx
// Collaborative study room — two students, one Groq-powered AI tutor
import React, { useState, useRef, useEffect } from 'react';
import { sendToPeerTutor, PEER_SYSTEM } from '../lib/api';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL    = 'llama-3.3-70b-versatile';

const STUDY_TOPICS = [
  {
    id: 'quadratic',
    icon: 'ti-math-function',
    label: 'Quadratic Functions',
    opening: "Welcome to your study room! Today we're tackling Quadratic Functions together. Here's your first challenge: What are the two roots of f(x) = x² − 5x + 6? Both of you try it and share your answers — see if you agree!",
  },
  {
    id: 'systems',
    icon: 'ti-calculator',
    label: 'Systems of Equations',
    opening: "Study room is live! Topic: Systems of Equations. Solve this together: 2x + y = 10 and x − y = 2. Both share your approach — sometimes two methods are better than one.",
  },
  {
    id: 'data',
    icon: 'ti-chart-scatter',
    label: 'Data Interpretation',
    opening: "Room open! Today: Data Interpretation. A scatterplot has the line y = 1.5x + 20. What does the slope mean in real-world terms, and what is y when x = 10? Think first, then share.",
  },
];

const CHIPS = [
  { label: "Jordan: I think roots are 2 and 3",    persona: 'jordan', text: "I think the roots are 2 and 3" },
  { label: "Alex: Can you give us a hint?",         persona: 'alex',   text: "Can you give us a hint?" },
  { label: "Jordan: I got −2 and −3, right?",       persona: 'jordan', text: "I got −2 and −3, is that right?" },
  { label: "Alex: Wait — is it (x−2)(x−3)?",       persona: 'alex',   text: "Oh wait, is it factored as (x−2)(x−3)?" },
];

export default function PeerStudyRoom() {
  const [topic,    setTopic]    = useState(null);
  const [persona,  setPersona]  = useState('jordan');
  const [messages, setMessages] = useState([]);
  const [history,  setHistory]  = useState([]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  function startRoom(t) {
    setTopic(t);
    setMessages([{ role: 'ai', content: t.opening }]);
    setHistory([{ role: 'assistant', content: t.opening }]);
  }

  async function handleSend(overridePersona, overrideText) {
    const activePersona = overridePersona || persona;
    const text = overrideText || input.trim();
    if (!text || loading) return;
    setInput('');

    const name      = activePersona === 'jordan' ? 'Jordan' : 'Alex';
    const attributed = `${name} says: "${text}"`;

    setMessages((prev) => [...prev, { role: activePersona, content: text, name }]);

    const newHistory = [...history, { role: 'user', content: attributed }];
    setHistory(newHistory);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 512,
          messages: [
            { role: 'system', content: PEER_SYSTEM },
            ...newHistory.slice(-20),
          ],
        }),
      });
      const data  = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'Sorry, something went wrong.';
      setHistory((h) => [...h, { role: 'assistant', content: reply }]);
      setMessages((prev) => [...prev, { role: 'ai', content: reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'ai', content: `Error: ${err.message} — check VITE_GROQ_API_KEY in .env` }]);
    } finally {
      setLoading(false);
    }
  }

  // ── Topic picker ────────────────────────────────────────────────────────
  if (!topic) return (
    <div>
      <div style={{ background: 'linear-gradient(90deg,#EEEDFE,#E1F5EE)', border: '0.5px solid #AFA9EC', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#26215C', marginBottom: 4 }}>
          <i className="ti ti-users" style={{ color: '#3C3489' }} aria-hidden="true" /> Peer Study Rooms
        </div>
        <div style={{ fontSize: 13, color: '#534AB7', lineHeight: 1.6 }}>
          Two students, one AI tutor in the same room. The AI sees both your messages, facilitates discussion, and asks the student who gets it right to explain it to the one who doesn't. Peer teaching is one of the strongest learning strategies in education research.
        </div>
        <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.5)', borderRadius: 8, fontSize: 12, color: '#3C3489' }}>
          <strong>Demo mode:</strong> Try it: Toggle between students to see the AI tutor both simultaneously. In a real session, each student joins from their own device.
        </div>
      </div>

      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Choose a topic to study together:</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {STUDY_TOPICS.map((t) => (
          <div key={t.id} onClick={() => startRoom(t)} style={{ padding: 16, background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'border-color 0.15s' }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: '#EEEDFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className={`ti ${t.icon}`} style={{ color: '#3C3489', fontSize: 20 }} aria-hidden="true" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{t.label}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>2 students · AI tutor · Collaborative</div>
            </div>
            <span style={{ background: '#EEEDFE', color: '#3C3489', fontSize: 11, padding: '3px 10px', borderRadius: 8, fontWeight: 500 }}>Start room →</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Active room ─────────────────────────────────────────────────────────
  return (
    <div>
      {/* Room header */}
      <div style={{ background: '#EEEDFE', border: '0.5px solid #AFA9EC', borderRadius: 10, padding: '11px 14px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex' }}>
          {[{ bg:'#EEEDFE', color:'#3C3489', label:'JD' }, { bg:'#E1F5EE', color:'#085041', label:'AL', ml:'-8px' }, { bg:'#EEEDFE', color:'#3C3489', icon:true, ml:'-8px' }].map((p, i) => (
            <div key={i} style={{ width:28, height:28, borderRadius:'50%', background:p.bg, color:p.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:500, border:'2px solid #EEEDFE', marginLeft:p.ml||0, zIndex:3-i, flexShrink:0 }}>
              {p.icon ? <i className="ti ti-robot" style={{ fontSize:12 }} aria-hidden="true" /> : p.label}
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#26215C' }}>{topic.label} — Study Room</div>
          <div style={{ fontSize: 11, color: '#534AB7', marginTop: 1 }}>I.Bhanu sri + Alex Kim + AI Tutor (Groq)</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#3B6D11', background: '#EAF3DE', padding: '3px 8px', borderRadius: 6, fontWeight: 500 }}>
          <span style={{ width:5, height:5, background:'#639922', borderRadius:'50%', display:'inline-block' }} /> Live
        </div>
        <button onClick={() => { setTopic(null); setMessages([]); setHistory([]); }} style={{ padding:'4px 10px', border:'0.5px solid var(--color-border-secondary)', borderRadius:6, fontSize:11, cursor:'pointer', background:'transparent', color:'var(--color-text-secondary)' }}>
          Leave room
        </button>
      </div>

      {/* Persona toggle */}
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', background:'var(--color-background-secondary)', borderRadius:8, marginBottom:12 }}>
        <span style={{ fontSize:11, color:'var(--color-text-secondary)', marginRight:4 }}>Sending as:</span>
        {[
          { id:'jordan', label:'Jordan (you)',       activeBg:'#EEEDFE', activeColor:'#3C3489', activeBorder:'#AFA9EC' },
          { id:'alex',   label:'Alex (your friend)', activeBg:'#E1F5EE', activeColor:'#085041', activeBorder:'#9FE1CB' },
        ].map((p) => (
          <button key={p.id} onClick={() => setPersona(p.id)} style={{ padding:'5px 12px', borderRadius:6, fontSize:12, cursor:'pointer', fontWeight:500, border:`0.5px solid ${persona===p.id ? p.activeBorder : 'var(--color-border-secondary)'}`, background:persona===p.id ? p.activeBg : 'transparent', color:persona===p.id ? p.activeColor : 'var(--color-text-secondary)' }}>
            {p.label}
          </button>
        ))}
        <span style={{ marginLeft:'auto', fontSize:10, color:'var(--color-text-tertiary)' }}>Demo: toggle to simulate both students</span>
      </div>

      {/* Chat */}
      <div style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)', borderRadius:12, overflow:'hidden' }}>
        <div style={{ height:360, overflowY:'auto', padding:14, display:'flex', flexDirection:'column', gap:10 }}>

          {messages.map((msg, i) => {
            if (msg.role === 'ai') return (
              <div key={i}>
                <div style={{ fontSize:10, color:'var(--color-text-tertiary)', marginBottom:3 }}>EduAgent Tutor</div>
                <div style={{ display:'flex', gap:8, maxWidth:'86%' }}>
                  <div style={{ width:26, height:26, borderRadius:'50%', background:'#EEEDFE', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <i className="ti ti-robot" style={{ fontSize:12, color:'#3C3489' }} aria-hidden="true" />
                  </div>
                  <div style={{ padding:'9px 13px', borderRadius:10, fontSize:13, lineHeight:1.6, background:'var(--color-background-secondary)', border:'0.5px solid var(--color-border-tertiary)' }}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );

            if (msg.role === 'jordan') return (
              <div key={i} style={{ alignSelf:'flex-end', maxWidth:'86%' }}>
                <div style={{ fontSize:10, color:'var(--color-text-tertiary)', marginBottom:3, textAlign:'right', paddingRight:34 }}>Jordan</div>
                <div style={{ display:'flex', gap:8, flexDirection:'row-reverse' }}>
                  <div style={{ width:26, height:26, borderRadius:'50%', background:'#EEEDFE', color:'#3C3489', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:500, flexShrink:0 }}>JD</div>
                  <div style={{ padding:'9px 13px', borderRadius:10, fontSize:13, lineHeight:1.6, background:'#5340c8', color:'white' }}>{msg.content}</div>
                </div>
              </div>
            );

            if (msg.role === 'alex') return (
              <div key={i} style={{ maxWidth:'86%' }}>
                <div style={{ fontSize:10, color:'var(--color-text-tertiary)', marginBottom:3 }}>Alex Kim</div>
                <div style={{ display:'flex', gap:8 }}>
                  <div style={{ width:26, height:26, borderRadius:'50%', background:'#E1F5EE', color:'#085041', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:500, flexShrink:0 }}>AL</div>
                  <div style={{ padding:'9px 13px', borderRadius:10, fontSize:13, lineHeight:1.6, background:'#E1F5EE', border:'0.5px solid #9FE1CB', color:'#04342C' }}>{msg.content}</div>
                </div>
              </div>
            );

            return null;
          })}

          {loading && (
            <div style={{ display:'flex', gap:8 }}>
              <div style={{ width:26, height:26, borderRadius:'50%', background:'#EEEDFE', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <i className="ti ti-robot" style={{ fontSize:12, color:'#3C3489' }} aria-hidden="true" />
              </div>
              <div style={{ padding:'9px 13px', background:'var(--color-background-secondary)', border:'0.5px solid var(--color-border-tertiary)', borderRadius:10, display:'flex', gap:4, alignItems:'center' }}>
                {[0,1,2].map((j) => (
                  <span key={j} style={{ width:5, height:5, borderRadius:'50%', background:'#5340c8', display:'inline-block', animation:`bounce 1.2s ${j*0.2}s ease-in-out infinite` }} />
                ))}
              </div>
            </div>
          )}

          {/* Quick-start chips */}
          {messages.length <= 1 && !loading && (
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:4 }}>
              {CHIPS.map((chip) => (
                <button key={chip.label} onClick={() => { setPersona(chip.persona); handleSend(chip.persona, chip.text); }} style={{ padding:'5px 10px', border:'0.5px solid var(--color-border-secondary)', borderRadius:10, fontSize:11, cursor:'pointer', color:'var(--color-text-secondary)', background:'transparent', whiteSpace:'nowrap' }}>
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Input */}
        <div style={{ padding:'10px 14px', borderTop:'0.5px solid var(--color-border-tertiary)', display:'flex', gap:8, alignItems:'center' }}>
          <div style={{ width:26, height:26, borderRadius:'50%', background:persona==='jordan'?'#EEEDFE':'#E1F5EE', color:persona==='jordan'?'#3C3489':'#085041', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:500, flexShrink:0 }}>
            {persona === 'jordan' ? 'JD' : 'AL'}
          </div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={`Type as ${persona === 'jordan' ? 'Jordan' : 'Alex'}…`}
            disabled={loading}
            style={{ flex:1, padding:'7px 11px', border:'0.5px solid var(--color-border-secondary)', borderRadius:7, fontSize:13, background:'var(--color-background-primary)', color:'var(--color-text-primary)', outline:'none' }}
          />
          <button onClick={() => handleSend()} disabled={loading || !input.trim()} style={{ padding:'7px 13px', background:'#5340c8', color:'white', border:'none', borderRadius:7, cursor:loading||!input.trim()?'default':'pointer', opacity:loading||!input.trim()?0.5:1, fontSize:13, display:'flex', alignItems:'center', gap:5 }}>
            <i className="ti ti-send" aria-hidden="true" />
          </button>
        </div>
      </div>

      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-4px)}}`}</style>
    </div>
  );
}
