'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import OceanBackground from '@/components/ocean/OceanBackground'
import BioParticles from '@/components/ocean/BioParticles'
import TreasureChest from '@/components/ocean/TreasureChest'

const EASE = [0.23, 1, 0.32, 1] as [number, number, number, number]

export default function Contact() {
  const t = useTranslations('contact')

  return (
    <OceanBackground
      color="var(--ocean-trench)"
      style={{
        background: 'oklch(3% 0.01 268)',
        overflow: 'hidden',
      }}
    >
      <section
        id="contact"
        data-theme="dark"
        className="with-grain"
        style={{
          padding: 'var(--section-padding-y) var(--container-padding)',
          minHeight: '80svh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          textAlign: 'center',
        }}
      >
        {/* Trench floor particles — pink/magenta palette */}
        <BioParticles
          colors={['rgba(255,50,180,0.18)', 'rgba(180,50,255,0.12)', 'rgba(0,229,200,0.08)']}
          desktopCount={20}
          mobileCount={10}
        />

        {/* Ocean floor glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '30%',
            background: 'linear-gradient(to top, oklch(55% 0.22 310 / 0.06), transparent)',
            pointerEvents: 'none',
          }}
        />

        {/* Header */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="section-label"
          style={{ color: 'var(--color-accent)', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}
        >
          {t('label')}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            color: 'var(--color-text-dark)',
            marginBottom: '1.5rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {t('heading')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-dark-secondary)',
            marginBottom: '4rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {t('available')}
        </motion.p>

        {/* TreasureChest — opens on scroll, reveals contact links */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <TreasureChest />
        </div>

        <style>{`
          @media (max-width: 767px) {
            #contact { padding-left: 32px; padding-right: 32px; }
          }
        `}</style>
      </section>
    </OceanBackground>
  )
}
