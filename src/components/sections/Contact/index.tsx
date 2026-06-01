'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap-config';

const FILAMENTS = [
  'M 15% 20% Q 35% 8%  60% 35%',
  'M 80% 15% Q 70% 30% 55% 45%',
  'M 5%  50% Q 20% 40% 40% 55%',
  'M 90% 40% Q 75% 50% 58% 48%',
  'M 25% 10% Q 40% 25% 50% 40%',
  'M 70% 70% Q 60% 55% 52% 47%',
  'M 10% 75% Q 25% 60% 45% 55%',
  'M 85% 80% Q 72% 65% 58% 52%',
  'M 40% 5%  Q 48% 20% 50% 38%',
  'M 60% 90% Q 58% 70% 53% 55%',
];

export default function Contact() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const bodyRef     = useRef<HTMLDivElement>(null);
  const svgRef      = useRef<SVGSVGElement>(null);
  const t = useTranslations('contact');

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      gsap.set([headingRef.current, bodyRef.current], { opacity: 1 });
      return;
    }

    // Heading line reveal
    const split = new SplitText(headingRef.current, { type: 'lines', linesClass: 'line-wrap' });
    split.lines.forEach(line => {
      (line as HTMLElement).style.overflow = 'hidden';
    });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
    });

    tl.from(split.lines, {
      y: '100%', opacity: 0, stagger: 0.08, duration: 1, ease: 'power4.out', delay: 0.3,
    });
    tl.from(bodyRef.current!.children, {
      opacity: 0, y: 16, stagger: 0.15, duration: 0.7, ease: 'power3.out',
    }, '-=0.4');

    // SVG filaments — stroke-dashoffset technique (no Club plugins)
    const paths = svgRef.current ? Array.from(svgRef.current.querySelectorAll('path')) : [];
    paths.forEach(path => {
      const len = (path as SVGPathElement).getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    });
    gsap.to(paths, {
      strokeDashoffset: 0,
      duration: 2.5,
      ease: 'power2.inOut',
      stagger: { each: 0.3, from: 'end' },
      delay: 0.5,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', once: true },
    });

    return () => split.revert();
  }, { scope: sectionRef });

  return (
    <section
      id="contact"
      ref={sectionRef}
      data-theme="dark"
      className="with-grain"
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
      }}
    >
      {/* Background photo */}
      <Image
        src="/photos/lichen-contact.jpg"
        alt="Usnea lichen hanging, white filaments against dark bokeh"
        fill
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        sizes="100vw"
        priority={false}
      />
      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(9,13,9,0.92) 0%, rgba(9,13,9,0.6) 50%, rgba(9,13,9,0.4) 100%)',
        zIndex: 1,
      }} />

      {/* SVG filaments */}
      <svg
        ref={svgRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none' }}
        aria-hidden
      >
        {FILAMENTS.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke={`rgba(122,173,94,${i < 3 ? '0.35' : i < 6 ? '0.18' : '0.08'})`}
            strokeWidth="0.8"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        padding: 'var(--section-padding-y) var(--container-padding) clamp(4rem, 8vw, 7rem)',
        maxWidth: 'var(--container-max)',
      }}>
        <h2
          ref={headingRef}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-hero)',
            fontWeight: 400,
            lineHeight: 0.88,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-12)',
          }}
        >
          {t('heading')}
        </h2>

        <div ref={bodyRef}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-technical)',
            marginBottom: 'var(--space-4)',
          }}>
            {t('available')}
          </p>

          <a
            href={`mailto:${t('email')}`}
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
              fontWeight: 400,
              color: 'var(--text-primary)',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(242,237,230,0.25)',
              paddingBottom: '3px',
              marginBottom: 'var(--space-8)',
              transition: 'border-color 250ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(122,173,94,0.6)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(242,237,230,0.25)')}
          >
            {t('email')}
          </a>

          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            color: 'rgba(242,237,230,0.55)',
          }}>
            <a href="https://github.com/jazorro11" target="_blank" rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'none', transition: 'opacity 200ms ease' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.55')}
            >
              GitHub
            </a>
            {' · '}
            <a href="https://linkedin.com/in/julio-zorro" target="_blank" rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'none', transition: 'opacity 200ms ease' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.55')}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Language info — bottom right */}
      <p style={{
        position: 'absolute',
        bottom: '2rem',
        right: 'var(--container-padding)',
        zIndex: 3,
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-xs)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--text-technical)',
      }}>
        {t('languageInfo')}
      </p>
    </section>
  );
}
