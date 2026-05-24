'use client';

import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE = [0.23, 1, 0.32, 1] as [number, number, number, number];

const revealVariants = {
  hidden: { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
  visible: {
    clipPath: 'inset(0 0 0% 0)',
    opacity: 1,
    transition: { duration: 0.8, ease: EASE },
  },
};

function RevealBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <div ref={ref} style={{ overflow: 'hidden' }}>
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={revealVariants}
        transition={{ delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function About() {
  const t = useTranslations('about');

  return (
    <section
      id="about"
      data-theme="light"
      style={{
        background: 'var(--color-light)',
        padding: 'var(--section-padding-y) var(--container-padding)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
      }}
    >
      {/* Left: text */}
      <div style={{ maxWidth: '520px' }}>
        <RevealBlock>
          <p className="section-label" style={{ color: 'var(--color-text-light-secondary)', marginBottom: '1.5rem' }}>
            {t('label')}
          </p>
        </RevealBlock>

        <RevealBlock delay={0.1}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-3xl)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: 'var(--color-text-light)',
              marginBottom: '2rem',
              whiteSpace: 'pre-line',
            }}
          >
            {t('heading')}
          </h2>
        </RevealBlock>

        <RevealBlock delay={0.2}>
          <p
            style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-light-secondary)',
              lineHeight: 1.75,
              marginBottom: '1.25rem',
            }}
          >
            {t('bio')}
          </p>
        </RevealBlock>

        <RevealBlock delay={0.3}>
          <p
            style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-light-secondary)',
              lineHeight: 1.75,
            }}
          >
            {t('approach')}
          </p>
        </RevealBlock>
      </div>

      {/* Right: visual accent — vertical color push blocks (Cleo-style) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignSelf: 'stretch',
          justifyContent: 'center',
        }}
      >
        {[
          { bg: '#080810', accent: '#FF8C42', label: 'Engineering' },
          { bg: '#F5F1EB', accent: '#0A0A0A', label: 'AI & Agents', border: '1px solid #EAE4D8' },
          { bg: '#FF8C42', accent: '#080810', label: 'Interfaces' },
        ].map(({ bg, accent, label, border }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ delay: 0.15 * i, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            style={{
              background: bg,
              border: border || 'none',
              borderRadius: '12px',
              padding: '1.5rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-xl)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: accent,
              }}
            >
              {label}
            </span>
            <span style={{ color: accent, opacity: 0.4, fontSize: '1.5rem' }}>→</span>
          </motion.div>
        ))}
      </div>

      {/* Mobile: stack vertically */}
      <style>{`
        @media (max-width: 768px) {
          #about { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
