'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useOcean } from '@/components/ocean/OceanSystem'

const EASE = [0.23, 1, 0.32, 1] as [number, number, number, number]

// ── Letter-by-letter name animation (preserved) ──────────────────────────────
const letterVariants = {
  hidden: { opacity: 0, y: 60, skewY: 4 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: { delay: 0.3 + i * 0.05, duration: 0.7, ease: EASE },
  }),
}

function SplitName({ name }: { name: string }) {
  return (
    <span aria-label={name} style={{ display: 'flex', overflow: 'hidden', flexWrap: 'wrap' }}>
      {name.split('').map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={letterVariants}
          style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}

// ── Night sky + boat scene ────────────────────────────────────────────────────
function NightSkyScene() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Starfield */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        aria-hidden="true"
      >
        {Array.from({ length: 60 }, (_, i) => {
          const seed = (i * 2654435769) >>> 0
          const r = (n: number) => ((seed * (n + 1)) % 1000) / 1000
          return (
            <circle
              key={i}
              cx={`${r(1) * 100}%`}
              cy={`${r(2) * 65}%`}
              r={0.5 + r(3) * 1.5}
              fill={`rgba(255,255,255,${0.2 + r(4) * 0.6})`}
            />
          )
        })}
      </svg>

      {/* Moon */}
      <div
        style={{
          position: 'absolute',
          top: '12%',
          left: '24%',
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 40%, rgba(255,200,100,0.95), rgba(255,140,66,0.6))',
          boxShadow: '0 0 40px rgba(255,140,66,0.35), 0 0 80px rgba(255,140,66,0.15)',
        }}
      />

      {/* Ocean horizon line */}
      <div
        style={{
          position: 'absolute',
          bottom: '35%',
          left: 0,
          right: 0,
          height: 1,
          background:
            'linear-gradient(to right, transparent, rgba(0,180,200,0.25) 30%, rgba(0,180,200,0.25) 70%, transparent)',
        }}
      />

      {/* Boat SVG — centered on thread (left: 32%) */}
      <svg
        viewBox="0 0 140 70"
        width="140"
        height="70"
        style={{
          position: 'absolute',
          bottom: '34%',
          left: 'calc(var(--thread-left-desktop) - 70px)',
          transform: 'translateY(50%)',
        }}
      >
        <path
          d="M15 42 Q70 58 125 42 L115 32 Q70 27 25 32 Z"
          fill="oklch(25% 0.04 250)"
          stroke="oklch(68% 0.18 48 / 0.3)"
          strokeWidth="0.5"
        />
        <rect
          x="52" y="22" width="28" height="14" rx="3"
          fill="oklch(20% 0.03 250)"
          stroke="oklch(68% 0.18 48 / 0.2)"
          strokeWidth="0.5"
        />
        <line x1="70" y1="32" x2="70" y2="4" stroke="oklch(68% 0.18 48 / 0.7)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="50" y1="28" x2="30" y2="16" stroke="oklch(68% 0.18 48 / 0.8)" strokeWidth="1" strokeLinecap="round" />
        <circle cx="30" cy="16" r="2" fill="oklch(68% 0.18 48 / 0.9)" />
        <path d="M20 54 Q70 60 120 54" stroke="rgba(0,180,200,0.15)" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  )
}

// ── Main Hero ─────────────────────────────────────────────────────────────────
export default function Hero() {
  const t = useTranslations('hero')
  const { bypassHeroPin } = useOcean()

  return (
    <section
      id="hero"
      data-theme="dark"
      className="with-grain"
      style={{
        background: 'linear-gradient(to bottom, oklch(8% 0.02 250) 0%, oklch(12% 0.02 250) 100%)',
        minHeight: '100svh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <NightSkyScene />

      {/* Two-column: thread zone (0–38%) | content (38%+) */}
      <motion.div
        className="hero-grid"
        initial="hidden"
        animate="visible"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: '38% 1fr',
          minHeight: '100svh',
          alignItems: 'center',
          padding: '0 var(--container-padding)',
        }}
      >
        {/* Left zone: decorative — FishingThread is position:fixed */}
        <div aria-hidden="true" />

        {/* Right zone: text content */}
        <div style={{ padding: '6rem 0' }}>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.5, ease: EASE } },
            }}
            className="section-label"
            style={{ color: 'var(--color-accent)', marginBottom: '1.5rem' }}
          >
            {t('title')}
          </motion.p>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-hero)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 0.9,
              color: 'var(--color-text-dark)',
              marginBottom: '2rem',
            }}
          >
            <SplitName name={t('name')} />
          </h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { delay: 0.9, duration: 0.6, ease: EASE } },
            }}
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-dark-secondary)',
              maxWidth: '480px',
              marginBottom: '3rem',
              lineHeight: 1.5,
            }}
          >
            {t('tagline')}
          </motion.p>

          {/* CTA — uses OceanSystem context to bypass pin */}
          <motion.button
            onClick={bypassHeroPin}
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1, transition: { delay: 1.1, duration: 0.4, ease: EASE } },
            }}
            whileTap={{ scale: 0.97 }}
            whileHover={{ borderColor: 'var(--color-accent)' }}
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              border: '1px solid rgba(255,140,66,0.4)',
              borderRadius: '100px',
              padding: '14px 32px',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'border-color 200ms ease',
            }}
          >
            {t('cta')} ↓
          </motion.button>
        </div>
      </motion.div>

      {/* Scroll indicator — on thread axis */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: 'var(--thread-left-desktop)',
          transform: 'translateX(-50%)',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          className="section-label"
          style={{ color: 'var(--color-text-dark-muted)', fontSize: '0.65rem' }}
        >
          {t('scroll')}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          style={{
            width: 1,
            height: 40,
            background: 'linear-gradient(to bottom, rgba(255,140,66,0.6), transparent)',
          }}
        />
      </motion.div>

      <style>{`
        @media (max-width: 767px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-grid > [aria-hidden="true"]:first-child {
            display: none !important;
          }
          .hero-grid > div:last-child {
            padding: 8rem 0 4rem !important;
            padding-left: 32px !important;
          }
        }
      `}</style>
    </section>
  )
}
