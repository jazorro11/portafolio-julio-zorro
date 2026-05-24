'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import ChatMockup from './ChatMockup';

const secondaryProjects = [
  {
    key: 'web1' as const,
    tags: ['React', 'TypeScript', 'Tailwind'],
    status: 'wip',
    color: '#FF8C42',
  },
  {
    key: 'web2' as const,
    tags: ['Next.js', 'TypeScript'],
    status: 'local',
    color: '#3B82F6',
  },
];

export default function Work() {
  const t = useTranslations('work');

  return (
    <section
      id="work"
      data-theme="light"
      style={{
        background: 'var(--color-light)',
        padding: 'var(--section-padding-y) var(--container-padding)',
        minHeight: '100svh',
      }}
    >
      <div className="container">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="section-label"
          style={{ color: 'var(--color-text-light-secondary)', marginBottom: '0.75rem' }}
        >
          {t('label')}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-3xl)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--color-text-light)',
            marginBottom: '4rem',
          }}
        >
          {t('heading')}
        </motion.h2>

        {/* Hero project: LangGraph Agent */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          style={{
            background: '#080810',
            borderRadius: '20px',
            padding: '3rem',
            marginBottom: '2rem',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '3rem',
            alignItems: 'center',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Glow */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse 60% 80% at 80% 50%, rgba(255,140,66,0.07) 0%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />

          {/* Text */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <span
                className="section-label"
                style={{ color: '#FF8C42' }}
              >
                AI · Featured
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,140,66,0.5)',
                  border: '1px solid rgba(255,140,66,0.2)',
                  borderRadius: '4px',
                  padding: '2px 6px',
                }}
              >
                {t('wip')}
              </span>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                marginBottom: '1rem',
              }}
            >
              {t('projects.agent.title')}
            </h3>

            <p style={{ fontSize: 'var(--text-base)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '420px' }}>
              {t('projects.agent.description')}
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {['LangGraph', 'Python', 'AI'].map(tag => (
                <span
                  key={tag}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.4)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    padding: '3px 10px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <a
              href="https://github.com/jzorroperez"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#FF8C42',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {t('viewCode')} ↗
            </a>
          </div>

          {/* Chat mockup — fixed central with data mutation */}
          <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
            <ChatMockup />
          </div>

          {/* Mobile: stack */}
          <style>{`
            @media (max-width: 768px) {
              #work .hero-project { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </motion.div>

        {/* Secondary projects */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {secondaryProjects.map(({ key, tags, status, color }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              style={{
                background: 'var(--color-light-2)',
                border: '1px solid var(--color-light-2)',
                borderRadius: '16px',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Color accent line */}
              <div style={{ width: 32, height: 3, background: color, borderRadius: '2px', marginBottom: '1.5rem' }} />

              <div style={{ display: 'flex', gap: '8px', marginBottom: '0.75rem' }}>
                <span
                  className="section-label"
                  style={{ color: 'var(--color-text-light-muted)' }}
                >
                  Frontend
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color,
                    border: `1px solid ${color}40`,
                    borderRadius: '4px',
                    padding: '2px 6px',
                  }}
                >
                  {status === 'wip' ? t('wip') : 'Local'}
                </span>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-xl)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-text-light)',
                  marginBottom: '0.75rem',
                }}
              >
                {t(`projects.${key}.title`)}
              </h3>

              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {t(`projects.${key}.description`)}
              </p>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--color-text-light-secondary)',
                      border: '1px solid var(--section-border)',
                      borderRadius: '6px',
                      padding: '3px 10px',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile grid */}
        <style>{`
          @media (max-width: 640px) {
            #work .secondary-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  );
}
