'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import OceanBackground from '@/components/ocean/OceanBackground'
import BioParticles from '@/components/ocean/BioParticles'
import ChatMockup from './ChatMockup'

const EASE = [0.23, 1, 0.32, 1] as [number, number, number, number]
const AGENT_LIVE_URL = 'https://agent-web-web-one.vercel.app'

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
    color: '#3B82F6',
    github: null,
    live: 'https://www.haz-arquitectura.com/',
  },
]

function TagPill({ label, light = false }: { label: string; light?: boolean }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: light ? 'rgba(255,255,255,0.35)' : 'rgba(200,220,255,0.5)',
        border: `1px solid ${light ? 'rgba(255,255,255,0.1)' : 'rgba(180,80,255,0.15)'}`,
        borderRadius: '6px',
        padding: '3px 10px',
      }}
    >
      {label}
    </span>
  )
}

function LinkButton({
  href,
  children,
  light = false,
}: {
  href: string
  children: React.ReactNode
  light?: boolean
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
        color: light ? 'var(--color-accent)' : 'rgba(180,200,255,0.5)',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        transition: 'color 180ms ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
      onMouseLeave={e =>
        (e.currentTarget.style.color = light ? 'var(--color-accent)' : 'rgba(180,200,255,0.5)')
      }
    >
      {children}
    </a>
  )
}

export default function Work() {
  const t = useTranslations('work')

  return (
    <OceanBackground
      color="oklch(0% 0 0 / 0.45)"
      style={{
        backgroundColor: 'oklch(5% 0.018 265)',
        backgroundImage: 'url(/assets/bg-abyss.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 'var(--section-padding-y) var(--container-padding)',
        minHeight: '100svh',
        overflow: 'hidden',
      }}
    >
      <section
        id="work"
        data-theme="dark"
        style={{ position: 'relative' }}
      >
        {/* Astronaut — decorative, left zone */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '8%',
            left: '2%',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <img
            src="/assets/astronaut-abyss.png"
            alt=""
            aria-hidden="true"
            width={240}
            style={{
              display: 'block',
              filter: 'drop-shadow(0 0 24px rgba(0,229,200,0.3))',
            }}
          />
        </div>

        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '10%',
            right: '3%',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <img
            src="/assets/anglerfish.png"
            alt=""
            aria-hidden="true"
            width={190}
            style={{
              display: 'block',
              opacity: 0.7,
              filter: 'drop-shadow(0 0 18px rgba(255,140,66,0.25))',
              transform: 'scaleX(-1)',
            }}
          />
        </div>

        <BioParticles
          colors={['rgba(180,80,255,0.15)', 'rgba(0,229,200,0.1)', 'rgba(100,50,200,0.12)']}
          desktopCount={16}
          mobileCount={8}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Header */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-label"
            style={{ color: 'var(--color-accent)', marginBottom: '0.75rem' }}
          >
            {t('label')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-3xl)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--color-text-dark)',
              marginBottom: '4rem',
            }}
          >
            {t('heading')}
          </motion.h2>

          {/* ── Hero project: LangGraph Agent ── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{
              background: 'rgba(10,20,50,0.9)',
              border: '1px solid rgba(180,80,255,0.35)',
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
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse 60% 80% at 85% 50%, rgba(255,140,66,0.06) 0%, transparent 60%)',
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
                  color: 'var(--color-text-dark)',
                  marginBottom: '1rem',
                }}
              >
                {t('projects.agent.title')}
              </h3>

              <p
                style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text-dark-secondary)',
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

            {/* Chat mockup */}
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
                transition={{ delay: 0.08 * i, duration: 0.5, ease: EASE }}
                style={{
                  background: 'rgba(10,20,50,0.85)',
                  border: '1px solid rgba(180,80,255,0.2)',
                  borderRadius: '16px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ width: 32, height: 3, background: color, borderRadius: '2px' }} />

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-xl)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: 'var(--color-text-dark)',
                  }}
                >
                  {t(`projects.${key}.title`)}
                </h3>

                <p
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-dark-secondary)',
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

                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                  {github && <LinkButton href={github}>{t('viewCode')} ↗</LinkButton>}
                  {live && <LinkButton href={live}>{t('viewProject')} ↗</LinkButton>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            #work [style*="grid-template-columns: 1fr minmax"] {
              grid-template-columns: 1fr !important;
            }
            #work [style*="repeat(2, 1fr)"] {
              grid-template-columns: 1fr !important;
            }
            #work [aria-hidden="true"][style*="position: absolute"][style*="bottom"] {
              display: none;
            }
          }
        `}</style>
      </section>
    </OceanBackground>
  )
}
