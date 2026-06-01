'use client';

import { useEffect, useState } from 'react';

const conversation = [
  { role: 'user',  text: "What's the irrigation forecast for plot A3?" },
  { role: 'agent', text: 'Based on current evapotranspiration data and the last 48h satellite readings, plot A3 needs irrigation in approximately 36 hours. Soil moisture is at 62%.' },
  { role: 'user',  text: 'Send an alert to the field team.' },
  { role: 'agent', text: "Alert sent to 3 field operators. I've also updated the irrigation schedule in the dashboard." },
];

export default function ChatMockup() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= conversation.length) return;
    const timer = setTimeout(() => setVisible(v => v + 1), visible === 0 ? 800 : 1600);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <div style={{
      width: '100%',
      background: 'var(--bg-deep)',
      border: '1px solid rgba(122,173,94,0.15)',
      borderRadius: '3px',
      padding: 'var(--space-6)',
      boxShadow: '0 0 60px rgba(122,173,94,0.06)',
      minHeight: '280px',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
        paddingBottom: 'var(--space-4)',
        borderBottom: '1px solid rgba(122,173,94,0.1)',
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-lichen)', opacity: 0.8 }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--text-technical)' }}>
          AGENT · ACTIVE
        </span>
      </div>

      {/* Messages */}
      {conversation.slice(0, visible).map((msg, i) => (
        <div
          key={i}
          style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '80%',
            padding: 'var(--space-3) var(--space-4)',
            background: msg.role === 'user'
              ? 'rgba(122,173,94,0.1)'
              : 'rgba(242,237,230,0.04)',
            borderRadius: '2px',
            border: msg.role === 'user'
              ? '1px solid rgba(122,173,94,0.2)'
              : '1px solid rgba(242,237,230,0.07)',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            lineHeight: 1.6,
            color: msg.role === 'user' ? 'var(--accent-lichen)' : 'rgba(242,237,230,0.8)',
            margin: 0,
          }}>
            {msg.text}
          </p>
        </div>
      ))}

      {/* Typing indicator */}
      {visible < conversation.length && (
        <div style={{ display: 'flex', gap: 4, padding: 'var(--space-2) var(--space-3)', alignSelf: 'flex-start' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 4, height: 4, borderRadius: '50%',
              background: 'var(--text-technical)',
              animation: `pulse 1.2s ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
