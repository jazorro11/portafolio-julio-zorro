'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { fogReveal } from '@/lib/animations';
import ChatMockup from './ChatMockup';

const AGENT_LIVE_URL = 'https://agent-web-web-one.vercel.app';

const secondaryProjects = [
  {
    key: 'sinergia' as const,
    tags: ['Astro', 'TypeScript', 'Tailwind'],
    status: 'live' as const,
    color: '#FF8C42',
    github: null,
    live: 'https://es-sinergia-web.vercel.app/',
  },
  {
    key: 'haz' as const,
    tags: ['Next.js', 'TypeScript'],
    status: 'live' as const,
    color: 'var(--color-accent-2)',
    github: null,
    live: 'https://www.haz-arquitectura.com/',
  },
];

function TagPill({ label, light = false }: { label: string; light?: boolean }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: light ? 'rgba(255,255,255,0.35)' : 'var(--color-text-light-secondary)',
        border: `1px solid ${light ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: '6px',
        padding: '3px 10px',
      }}
    >
      {label}
    </span>
  );
}

function LinkButton({
  href,
  children,
  light = false,
}: {
  href: string;
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: light ? 'var(--color-accent)' : 'var(--color-text-light-secondary)',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        transition: 'color 180ms ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
      onMouseLeave={e =>
        (e.currentTarget.style.color = light ? 'var(--color-accent)' : 'var(--color-text-light-secondary)')
      }
    >
      {children}
    </a>
  );
}

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
          variants={fogReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10% 0px' }}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-3xl)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            color: 'var(--color-text-light)',
            marginBottom: 'clamp(2rem, 5vw, 4rem)',
          }}
        >
          {t('heading')}
        </motion.h2>

        {/* ── Hero project: LangGraph Agent ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          style={{
            background: '#080810',
            borderRadius: '20px',
            padding: 'clamp(2rem, 5vw, 3rem)',
            marginBottom: '1.5rem',
            display: 'grid',
            gridTemplateColumns: '1fr minmax(0, 460px)',
            gap: 'clamp(2rem, 4vw, 3rem)',
            alignItems: 'center',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Amber glow */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse 60% 80% at 85% 50%, rgba(255,140,66,0.08) 0%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />

          {/* Text */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <span className="section-label" style={{ color: '#FF8C42' }}>
                AI · Featured
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,140,66,0.55)',
                  border: '1px solid rgba(255,140,66,0.2)',
                  borderRadius: '4px',
                  padding: '2px 7px',
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

            <p
              style={{
                fontSize: 'var(--text-base)',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.7,
                marginBottom: '1.5rem',
                maxWidth: '400px',
              }}
            >
              {t('projects.agent.description')}
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {['LangGraph', 'Python', 'AI'].map(tag => (
                <TagPill key={tag} label={tag} light />
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <LinkButton href="https://github.com/jazorro11/agent-web" light>
                {t('viewCode')} ↗
              </LinkButton>
              {AGENT_LIVE_URL && (
                <LinkButton href={AGENT_LIVE_URL} light>
                  {t('liveDemo')} ↗
                </LinkButton>
              )}
            </div>
          </div>

          {/* Live chat mockup */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <ChatMockup />
          </div>
        </motion.div>

        {/* ── Secondary projects grid ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.5rem',
          }}
        >
          {secondaryProjects.map(({ key, tags, color, github, live }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              style={{
                background: 'var(--color-light-2)',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '16px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {/* Accent line */}
              <div
                style={{ width: 32, height: 3, background: color, borderRadius: '2px' }}
              />

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-xl)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-text-light)',
                }}
              >
                {t(`projects.${key}.title`)}
              </h3>

              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-light-secondary)',
                  lineHeight: 1.65,
                  flex: 1,
                }}
              >
                {t(`projects.${key}.description`)}
              </p>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                {tags.map(tag => (
                  <TagPill key={tag} label={tag} />
                ))}
              </div>

              {/* Links */}
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                {github && (
                  <LinkButton href={github}>
                    {t('viewCode')} ↗
                  </LinkButton>
                )}
                {live && (
                  <LinkButton href={live}>
                    {t('viewProject')} ↗
                  </LinkButton>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile: stack columns */}
      <style>{`
        @media (max-width: 768px) {
          #work [style*="grid-template-columns: 1fr minmax"] {
            grid-template-columns: 1fr !important;
          }
          #work [style*="repeat(2, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
