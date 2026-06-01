'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { getLenis } from '@/lib/lenis-instance';

// SSR: false — Three.js needs window
const WebGLScene = dynamic(() => import('./WebGLScene'), { ssr: false });

function SplitName({ name }: { name: string }) {
  return (
    <span aria-label={name} style={{ display: 'flex', overflow: 'hidden', flexWrap: 'wrap' }}>
      {name.split('').map((char, i) => (
        <span
          key={i}
          style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </span>
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
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: '0 var(--container-padding)',
          maxWidth: '1000px',
        }}
      >
        {/* Role label */}
        <p
          className="section-label"
          style={{ color: 'var(--color-accent)', marginBottom: '1.5rem' }}
        >
          {t('title')}
        </p>

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
        <p
          style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--color-text-dark-secondary)',
            maxWidth: '560px',
            margin: '0 auto 3rem',
            lineHeight: 1.5,
          }}
        >
          {t('tagline')}
        </p>

        {/* CTA */}
        <a
          href="#work"
          onClick={e => {
            e.preventDefault();
            const lenis = getLenis();
            if (lenis) lenis.scrollTo('#work', { offset: -72, duration: 1.2 });
            else document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
          }}
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
          onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-accent)')}
          onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,140,66,0.4)')}
        >
          {t('cta')} ↓
        </a>
      </div>

      {/* Scroll indicator */}
      <div
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
        <div
          style={{
            width: 1,
            height: 40,
            background: 'linear-gradient(to bottom, rgba(255,140,66,0.6), transparent)',
          }}
        />
      </div>
    </section>
  );
}
