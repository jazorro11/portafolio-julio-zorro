'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fogReveal, unfurlReveal, growIn, growInStagger } from '@/lib/animations';

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

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <div ref={ref} style={{ overflow: 'hidden' }}>
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={unfurlReveal}
        transition={{ delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function ChapterList() {
  const t = useTranslations('about');
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={growInStagger}
      style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
    >
      {chapters.map(({ key, bg, textColor, labelColor, border }) => (
        <motion.div
          key={key}
          variants={growIn}
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
    </motion.div>
  );
}

export default function About() {
  const t = useTranslations('about');
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: '-10% 0px' });

  const bioParagraphs = t('bio').split('\n\n');

  return (
    <section
      id="about"
      data-theme="light"
      style={{
        background: 'var(--color-light)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100svh',
        overflow: 'hidden',
      }}
    >
      {/* Left: text — anchored to left axis within its column */}
      <div
        style={{
          padding: 'var(--section-padding-y) clamp(2rem, 5vw, 4rem) var(--section-padding-y) var(--axis-left)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <ScrollReveal>
          <p
            className="section-label"
            style={{ color: 'var(--color-text-light-secondary)', marginBottom: '1.5rem' }}
          >
            {t('label')}
          </p>
        </ScrollReveal>

        {/* Heading — Cormorant Garamond weight 300, fog reveal */}
        <div ref={headingRef}>
          <motion.h2
            initial="hidden"
            animate={headingInView ? 'visible' : 'hidden'}
            variants={fogReveal}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              fontWeight: 300,
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
              color: 'var(--color-text-light)',
              marginBottom: '2rem',
              whiteSpace: 'pre-line',
            }}
          >
            {t('heading')}
          </motion.h2>
        </div>

        {bioParagraphs.map((para, i) => (
          <ScrollReveal key={i} delay={0.1 + i * 0.08}>
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
          </ScrollReveal>
        ))}

        <ScrollReveal delay={0.35}>
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-light-muted)',
              lineHeight: 1.75,
              fontStyle: 'italic',
              borderLeft: '2px solid var(--color-accent)',
              paddingLeft: '1rem',
              marginBottom: '3rem',
            }}
          >
            {t('approach')}
          </p>
        </ScrollReveal>

        {/* Chapter cards */}
        <ChapterList />
      </div>

      {/* Right: lichen photo — full height, bleeds to right edge */}
      <div style={{ position: 'relative', minHeight: '600px' }}>
        <Image
          src="/photos/lichen.jpg"
          alt="Lichen with fractal branching structure — inspires complex systems design"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          sizes="50vw"
        />
        {/* Left-edge gradient fade to blend with text column */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, var(--color-light) 0%, transparent 18%)',
            zIndex: 1,
          }}
        />
      </div>

      {/* Mobile: stack vertically, photo below text */}
      <style>{`
        @media (max-width: 768px) {
          #about {
            grid-template-columns: 1fr !important;
          }
          #about > div:first-child {
            padding-left: var(--container-padding) !important;
          }
          #about > div:last-child {
            min-height: 360px !important;
          }
        }
      `}</style>
    </section>
  );
}
