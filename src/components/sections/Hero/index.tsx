'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { getLenis } from '@/lib/lenis-instance';
import { fogReveal, fogRevealFast, fogTransition, fogFastTransition } from '@/lib/animations';

const WebGLScene = dynamic(() => import('./WebGLScene'), { ssr: false });

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
        minHeight: '100svh',
        overflow: 'hidden',
      }}
    >
      {/* WebGL background */}
      <WebGLScene />

      {/* Amber glow — sage replaces blue */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 60% at 65% 55%, rgba(255,140,66,0.08) 0%, transparent 70%),' +
            'radial-gradient(ellipse 40% 40% at 20% 80%, rgba(143,168,154,0.05) 0%, transparent 60%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Content — left axis, no centering */}
      <div
        className="hero-content"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          paddingLeft: 'var(--axis-left)',
          paddingRight: 'var(--container-padding)',
          paddingTop: 'var(--section-padding-y)',
          paddingBottom: 'var(--section-padding-y)',
        }}
      >
        {/* Role label */}
        <motion.p
          variants={fogRevealFast}
          initial="hidden"
          animate="visible"
          transition={fogFastTransition(0.2)}
          className="section-label"
          style={{ color: 'var(--color-accent)', marginBottom: '1.5rem' }}
        >
          {t('title')}
        </motion.p>

        {/* Name — Cormorant Garamond weight 300, fog reveal */}
        <motion.h1
          variants={fogReveal}
          initial="hidden"
          animate="visible"
          transition={fogTransition(0.4)}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-hero)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            lineHeight: 0.92,
            color: 'var(--color-text-dark)',
            marginBottom: '2.5rem',
            maxWidth: '14ch',
          }}
        >
          {t('name')}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={fogRevealFast}
          initial="hidden"
          animate="visible"
          transition={fogFastTransition(1.6)}
          style={{
            fontSize: 'var(--text-lg)',
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text-dark-secondary)',
            maxWidth: '480px',
            marginBottom: '3rem',
            lineHeight: 1.55,
          }}
        >
          {t('tagline')}
        </motion.p>

        {/* CTA */}
        <motion.a
          href="#work"
          onClick={e => {
            e.preventDefault();
            const lenis = getLenis();
            if (lenis) lenis.scrollTo('#work', { offset: -72, duration: 1.2 });
            else document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
          }}
          variants={fogRevealFast}
          initial="hidden"
          animate="visible"
          transition={fogFastTransition(2.0)}
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
      </div>

      {/* Scroll indicator — left-axis aligned */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: 'var(--axis-left)',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
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
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          style={{
            width: 1,
            height: 40,
            background: 'linear-gradient(to bottom, rgba(255,140,66,0.6), transparent)',
          }}
        />
      </motion.div>

      {/* Mobile: reduce left padding */}
      <style>{`
        @media (max-width: 768px) {
          .hero-content {
            padding-left: var(--container-padding) !important;
          }
          .hero-content h1 {
            max-width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
