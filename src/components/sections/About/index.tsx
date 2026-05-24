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
    transition: { duration: 0.7, ease: EASE },
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

const chapters: Array<{
  key: 'iot' | 'university' | 'now';
  bg: string;
  textColor: string;
  labelColor: string;
  border?: string;
}> = [
  { key: 'iot',        bg: '#080810', textColor: 'rgba(245,241,235,0.85)', labelColor: '#FF8C42' },
  { key: 'university', bg: '#F5F1EB', textColor: 'rgba(10,10,10,0.75)',    labelColor: '#FF8C42', border: '1px solid #EAE4D8' },
  { key: 'now',        bg: '#FF8C42', textColor: 'rgba(8,8,16,0.85)',      labelColor: 'rgba(8,8,16,0.5)' },
];

export default function About() {
  const t = useTranslations('about');

  // Split bio on double newline for two-paragraph rendering
  const bioParagraphs = t('bio').split('\n\n');

  return (
    <section
      id="about"
      data-theme="light"
      style={{
        background: 'var(--color-light)',
        padding: 'var(--section-padding-y) var(--container-padding)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(2rem, 5vw, 5rem)',
        alignItems: 'center',
      }}
    >
      {/* Left: text */}
      <div style={{ maxWidth: '540px' }}>
        <RevealBlock>
          <p
            className="section-label"
            style={{ color: 'var(--color-text-light-secondary)', marginBottom: '1.5rem' }}
          >
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
              color: 'var(--color-text-light)',
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
                color: 'var(--color-text-light-secondary)',
                lineHeight: 1.8,
                marginBottom: i < bioParagraphs.length - 1 ? '1.25rem' : '2rem',
              }}
            >
              {para}
            </p>
          </RevealBlock>
        ))}

        <RevealBlock delay={0.35}>
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-light-muted)',
              lineHeight: 1.75,
              fontStyle: 'italic',
              borderLeft: '2px solid var(--color-accent)',
              paddingLeft: '1rem',
            }}
          >
            {t('approach')}
          </p>
        </RevealBlock>
      </div>

      {/* Right: story chapters — three blocks with real content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignSelf: 'stretch',
          justifyContent: 'center',
        }}
      >
        {chapters.map(({ key, bg, textColor, labelColor, border }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ delay: 0.08 * i, duration: 0.4, ease: EASE }}
            style={{
              background: bg,
              border: border ?? 'none',
              borderRadius: '14px',
              padding: '1.5rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
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

      {/* Mobile: stack vertically */}
      <style>{`
        @media (max-width: 768px) {
          #about { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
