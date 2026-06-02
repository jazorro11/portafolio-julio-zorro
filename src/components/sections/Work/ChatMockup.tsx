'use client';

import { useEffect, useRef, useState } from 'react';

const conversation = [
  { role: 'user',      text: 'What tools do you have access to?' },
  { role: 'assistant', text: 'I can search the web, read files, and run Python code. What do you need?' },
  { role: 'user',      text: 'Summarize the Q3 sales report.' },
  { role: 'assistant', text: 'Analyzing the report... Revenue grew 18% YoY. Top regions: LATAM +34%, EU +12%. Flagging 3 anomalies for review.' },
  { role: 'user',      text: 'Show me the anomalies.' },
  { role: 'assistant', text: '① Week 32 dip (-22%) linked to system outage. ② Sept 14 spike: promotional campaign. ③ EU Unit 4 underperforming vs forecast.' },
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
