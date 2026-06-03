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

      <img
        src="/assets/astronaut-boat.png"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '34%',
          left: 'calc(var(--thread-left-desktop) - 110px)',
          transform: 'translateY(50%)',
          width: 220,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

// ── Depth zone helper ─────────────────────────────────────────────────────────
function getDepthZone(p: number): string {
  if (p <= 0.2) return '0m · Surface'
  if (p <= 0.4) return '200m · Shallow'
  if (p <= 0.6) return '800m · Reef'
  if (p <= 0.8) return '3,500m · Abyss'
  return '11,000m · Trench'
}

// ── Main Hero ─────────────────────────────────────────────────────────────────
export default function Hero() {
  const t = useTranslations('hero')
  const { bypassHeroPin, depthProgress } = useOcean()

  return (
    <section
      id="hero"
      data-theme="dark"
      className="with-grain"
      style={{
        backgroundColor: 'oklch(8% 0.02 250)',
        backgroundImage: 'url(/assets/bg-surface.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
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

      {/* Depth indicator badge — right side, fades in once scrolling begins */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: '2.5rem',
          right: 'var(--container-padding)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          opacity: depthProgress > 0.02 ? 1 : 0,
          transition: 'opacity 400ms ease',
          pointerEvents: 'none',
        }}
      >
        {/* Amber accent dot */}
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: 'var(--color-accent)',
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-text-dark-muted)',
          }}
        >
          {getDepthZone(depthProgress)}
        </span>
      </div>

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
