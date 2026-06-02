'use client'

import { useTranslations } from 'next-intl'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import OceanBackground from '@/components/ocean/OceanBackground'
import JellyfishGroup from '@/components/ocean/JellyfishGroup'
import BioParticles from '@/components/ocean/BioParticles'

const EASE = [0.23, 1, 0.32, 1] as [number, number, number, number]

const revealVariants = {
  hidden: { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
  visible: { clipPath: 'inset(0 0 0% 0)', opacity: 1 },
}

function RevealBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: '-10% 0px' })
  return (
    <div ref={ref} style={{ overflow: 'hidden' }}>
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={revealVariants}
        transition={{ delay, duration: 0.8, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  )
}

const chapters: Array<{
  key: 'iot' | 'university' | 'now'
  bg: string
  textColor: string
  labelColor: string
}> = [
  { key: 'iot',        bg: 'oklch(11% 0.03 260)',  textColor: 'rgba(245,241,235,0.85)', labelColor: '#FF8C42' },
  { key: 'university', bg: 'oklch(13% 0.025 255)', textColor: 'rgba(245,241,235,0.75)', labelColor: 'var(--bio-cyan)' },
  { key: 'now',        bg: 'oklch(11% 0.03 260)',  textColor: 'rgba(245,241,235,0.85)', labelColor: 'oklch(68% 0.18 48)' },
]

export default function About() {
  const t = useTranslations('about')
  const bioParagraphs = t('bio').split('\n\n')

  return (
    <OceanBackground
      color="oklch(0% 0 0 / 0.45)"
      style={{
        backgroundColor: 'oklch(9% 0.03 258)',
        padding: 'var(--section-padding-y) var(--container-padding)',
        overflow: 'hidden',
        backgroundImage: 'url(/assets/bg-shallow.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <section
        id="about"
        data-theme="dark"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(2rem, 5vw, 5rem)',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <JellyfishGroup />

        {[15, 25, 35].map((left, i) => (
          <div
            key={i}
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: `${left}%`,
              width: 40,
              height: '100%',
              background: 'linear-gradient(to bottom, rgba(0,180,255,0.04), transparent)',
              transform: 'skewX(-8deg)',
              pointerEvents: 'none',
            }}
          />
        ))}

        <BioParticles
          colors={['rgba(0,229,200,0.2)', 'rgba(180,80,255,0.15)']}
          desktopCount={16}
          mobileCount={8}
        />

        {/* Left: text */}
        <div style={{ maxWidth: '540px', position: 'relative', zIndex: 1 }}>
          <RevealBlock>
            <p className="section-label" style={{ color: 'var(--color-accent)', marginBottom: '1.5rem' }}>
              {t('label')}
            </p>
          </RevealBlock>

          <RevealBlock delay={0.08}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                lineHeight: 1.15,
                color: 'var(--color-text-dark)',
                marginBottom: '2rem',
                whiteSpace: 'pre-line',
              }}
            >
              {t('heading')}
            </h2>
          </RevealBlock>

          {bioParagraphs.map((para, i) => (
            <RevealBlock key={i} delay={0.16 + i * 0.08}>
              <p
                style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text-dark-secondary)',
                  lineHeight: 1.8,
                  marginBottom: i < bioParagraphs.length - 1 ? '1.25rem' : '2rem',
                }}
              >
                {para}
              </p>
            </RevealBlock>
          ))}

          {/* Approach — full border, no side-stripe (fixes borderLeft ban violation) */}
          <RevealBlock delay={0.35}>
            <blockquote
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-dark-secondary)',
                lineHeight: 1.75,
                fontStyle: 'italic',
                border: '1px solid oklch(55% 0.12 185 / 0.25)',
                background: 'oklch(11% 0.03 260)',
                borderRadius: '8px',
                padding: '1rem 1.25rem',
                margin: 0,
              }}
            >
              {t('approach')}
            </blockquote>
          </RevealBlock>
        </div>

        {/* Right: chapter cards */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignSelf: 'stretch',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {chapters.map(({ key, bg, textColor, labelColor }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-10%' }}
              transition={{ delay: 0.08 * i, duration: 0.4, ease: EASE }}
              style={{
                background: bg,
                border: key === 'now' ? '1px solid oklch(68% 0.18 48 / 0.5)' : '1px solid oklch(55% 0.12 185 / 0.18)',
                borderRadius: '14px',
                padding: '1.5rem 1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: labelColor,
                  }}
                >
                  {t(`chapters.${key}.label`)}
                </span>
                {key === 'iot' && (
                  <a
                    href="https://www.nature.com/articles/s41598-024-82344-4"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.62rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,140,66,0.6)',
                      textDecoration: 'none',
                      transition: 'color 150ms ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#FF8C42')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,140,66,0.6)')}
                  >
                    Nature ↗
                  </a>
                )}
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 400,
                  lineHeight: 1.65,
                  color: textColor,
                  margin: 0,
                }}
              >
                {t(`chapters.${key}.body`)}
              </p>
            </motion.div>
          ))}
        </div>

        <style>{`
          @media (max-width: 767px) {
            #about { grid-template-columns: 1fr !important; }
            #about > div { padding-left: 32px; width: 100%; }
          }
        `}</style>
      </section>
    </OceanBackground>
  )
}
