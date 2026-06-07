'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { getLenis } from '@/lib/lenis-instance';

// SSR: false — Three.js needs window
const WebGLScene = dynamic(() => import('./WebGLScene'), { ssr: false });

const EASE = [0.23, 1, 0.32, 1] as [number, number, number, number]; // --ease-out-strong

// Stagger each character — Emil rule: 30-80ms between items
const letterVariants = {
  hidden: { opacity: 0, y: 60, skewY: 4 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: {
      delay: 0.3 + i * 0.05,
      duration: 0.7,
      ease: EASE,
    },
  }),
};

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
  );
}

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section
      id="hero"
      data-theme="dark"
      className="with-grain"
      style={{
        background: 'var(--color-dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100svh',
        overflow: 'hidden',
      }}
    >
      {/* WebGL background */}
      <WebGLScene />

      {/* Amber glow — radial gradient accent */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 60% at 65% 55%, rgba(255,140,66,0.08) 0%, transparent 70%),' +
            'radial-gradient(ellipse 40% 40% at 20% 80%, rgba(59,130,246,0.06) 0%, transparent 60%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: '0 var(--container-padding)',
          maxWidth: '1000px',
        }}
      >
        {/* Role label */}
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

        {/* Name — letter by letter */}
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

        {/* Tagline */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { delay: 0.9, duration: 0.6, ease: EASE },
            },
          }}
          style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--color-text-dark-secondary)',
            maxWidth: '560px',
            margin: '0 auto 3rem',
            lineHeight: 1.5,
          }}
        >
          {t('tagline')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { delay: 1.1, duration: 0.4, ease: EASE },
            },
          }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
        >
          {/* Pills row */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Primary: scroll to work */}
            <motion.a
              href="#work"
              onClick={e => {
                e.preventDefault();
                const lenis = getLenis();
                if (lenis) lenis.scrollTo('#work', { offset: -72, duration: 1.2 });
                else document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
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
                textDecoration: 'none',
                transition: 'border-color 200ms ease',
              }}
            >
              {t('cta')} ↓
            </motion.a>

            {/* Contact: scroll to contact */}
            <motion.a
              href="#contact"
              onClick={e => {
                e.preventDefault();
                const lenis = getLenis();
                if (lenis) lenis.scrollTo('#contact', { offset: -72, duration: 1.2 });
                else document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              whileTap={{ scale: 0.97 }}
              whileHover={{ opacity: 0.85 }}
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-dark)',
                background: 'var(--color-accent)',
                border: '1px solid var(--color-accent)',
                borderRadius: '100px',
                padding: '14px 32px',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'opacity 200ms ease',
              }}
            >
              {t('cta_contact')} →
            </motion.a>
          </div>

          {/* Contact data row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <a
              href="mailto:jzorroperez@gmail.com"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.06em',
                color: 'rgba(232,224,212,0.35)',
                textDecoration: 'none',
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              jzorroperez@gmail.com
            </a>
            <div aria-hidden style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)' }} />
            <a
              href="tel:+573124745704"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.06em',
                color: 'rgba(232,224,212,0.35)',
                textDecoration: 'none',
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.22 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.29 6.29l1.28-1.28a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              {t('phone')}
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
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
          scroll
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
    </section>
  );
}
