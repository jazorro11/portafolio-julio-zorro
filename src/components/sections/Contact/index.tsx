'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { AmbientBackground } from '@/components/ui/AmbientBackground';

export default function Contact() {
  const t = useTranslations('contact');
  const email = t('email');

  return (
    <section
      id="contact"
      data-theme="dark"
      className="with-grain"
      style={{
        background: 'var(--color-dark)',
        padding: 'var(--section-padding-y) var(--container-padding)',
        minHeight: '60svh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 30% 60%, rgba(255,140,66,0.07) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <AmbientBackground
        orbs={[
          {
            size: 280,
            color: 'rgba(255,140,66,0.30)',
            blurPx: 50,
            top: '-80px',
            left: 'calc(50% - 140px)',
            animateTo: { x: 8, y: -12, scale: 1.06 },
            duration: 5,
          },
          {
            size: 120,
            color: 'rgba(59,130,246,0.18)',
            blurPx: 35,
            bottom: '-10px',
            left: '10px',
            animateTo: { x: -8, y: 10, scale: 0.9 },
            duration: 8,
          },
        ]}
        particles={{ count: 3, colors: ['rgba(255,140,66,0.7)', 'rgba(59,130,246,0.7)'] }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="section-label"
          style={{ color: 'var(--color-accent)', marginBottom: '1.5rem' }}
        >
          {t('label')}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-hero)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 0.9,
            color: 'var(--color-text-dark)',
            marginBottom: '1.5rem',
            hyphens: 'auto',
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
            marginBottom: '3rem',
          }}
        >
          {t('available')}
        </motion.p>

        {/* Email — clip-path reveal on hover */}
        <motion.a
          className="email-link"
          href={`mailto:${email}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          whileHover={{ color: 'var(--color-accent)' }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--color-text-dark)',
            textDecoration: 'none',
            display: 'inline-block',
            borderBottom: '1px solid rgba(255,255,255,0.12)',
            paddingBottom: '4px',
            transition: 'color 200ms ease, border-color 200ms ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,140,66,0.4)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.12)';
          }}
        >
          {email}
        </motion.a>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{
            display: 'flex',
            gap: '2rem',
            marginTop: '4rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {[
            { label: 'GitHub',   href: 'https://github.com/jazorro11' },
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/juliozorro/' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-text-dark-secondary)',
                textDecoration: 'none',
                transition: 'color 200ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-dark-secondary)')}
            >
              {label} ↗
            </a>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          #contact h2 { font-size: clamp(2.5rem, 13vw, 4rem) !important; }
          #contact .email-link { font-size: var(--text-xl) !important; word-break: break-all; }
        }
      `}</style>
    </section>
  );
}
