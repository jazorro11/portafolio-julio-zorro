'use client';

import { useEffect, useRef, useState } from 'react';

const conversation = [
  { role: 'user',      text: 'Search for recent papers on multi-agent LLM coordination.' },
  { role: 'assistant', text: 'On it — calling web_search and arxiv_fetch tools in parallel.' },
  { role: 'user',      text: 'Summarize the top 3 findings.' },
  { role: 'assistant', text: 'Done. ① LLM-Modulo (2024): planner + critic loop. ② AutoGen: async message-passing between specialized agents. ③ LangGraph: stateful graph with conditional edges.' },
  { role: 'user',      text: 'Which pattern fits a RAG pipeline best?' },
  { role: 'assistant', text: 'LangGraph wins for production RAG — deterministic routing, observable state, and built-in memory. My recommendation.' },
];

export default function ChatMockup() {
  const [visible, setVisible] = useState(0);
  const [started, setStarted] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Start animation only when component enters viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-advance messages — "data mutation" effect
  useEffect(() => {
    if (!started) return;
    if (visible >= conversation.length) return;
    const delay = visible === 0 ? 600 : 1800;
    const t = setTimeout(() => setVisible(v => v + 1), delay);
    return () => clearTimeout(t);
  }, [visible, started]);

  return (
    <div
      ref={containerRef}
      style={{
        background: '#0E0E1A',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.07)',
        overflow: 'hidden',
        fontFamily: 'var(--font-mono)',
        fontSize: '13px',
        width: '100%',
        maxWidth: '460px',
        position: 'relative',
      }}
    >
      {/* Title bar */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255,255,255,0.03)',
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF8C42' }} />
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.08em' }}>
          LangGraph Agent · v0.2
        </span>
      </div>

      {/* Messages */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '220px' }}>
        {conversation.slice(0, visible).map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'fadeUp 0.3s ease forwards',
            }}
          >
            <div
              style={{
                maxWidth: '85%',
                padding: '8px 12px',
                borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                background: msg.role === 'user'
                  ? 'rgba(255,140,66,0.15)'
                  : 'rgba(255,255,255,0.05)',
                color: msg.role === 'user'
                  ? '#FF8C42'
                  : 'rgba(255,255,255,0.75)',
                lineHeight: 1.5,
                border: '1px solid',
                borderColor: msg.role === 'user'
                  ? 'rgba(255,140,66,0.2)'
                  : 'rgba(255,255,255,0.06)',
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {visible < conversation.length && visible % 2 === 1 && (
          <div style={{ display: 'flex', gap: '4px', paddingLeft: '4px' }}>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.3)',
                  animation: `pulse 1s ${i * 0.15}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Replay button — visible only after animation completes */}
      {visible >= conversation.length && (
        <button
          onClick={() => { setVisible(0); setStarted(false); setTimeout(() => setStarted(true), 50); }}
          aria-label="Replay conversation"
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            background: 'none',
            border: '1px solid rgba(255,140,66,0.3)',
            borderRadius: '100px',
            padding: '4px 10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.1em',
            color: 'rgba(255,140,66,0.4)',
            cursor: 'pointer',
            transition: 'color 150ms ease, border-color 150ms ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.color = '#FF8C42';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,140,66,0.7)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,140,66,0.4)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,140,66,0.3)';
          }}
        >
          ↺ Replay
        </button>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
