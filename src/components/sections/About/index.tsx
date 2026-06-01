'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap-config';

export default function About() {
  const sectionRef  = useRef<HTMLElement>(null);
  const photoRef    = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const t = useTranslations('about');

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Parallax scrub on photo
    gsap.to(photoRef.current!.querySelector('img'), {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: photoRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Heading reveal
    const split = new SplitText(headingRef.current, { type: 'lines' });
    gsap.from(split.lines, {
      opacity: 0, y: 20, duration: 1.0, ease: 'power3.out', stagger: 0.15,
      scrollTrigger: {
        trigger: photoRef.current,
        start: 'top 80%',
        once: true,
      },
    });

    // Chapters batch reveal
    ScrollTrigger.batch('.field-chapter', {
      onEnter: (batch) => gsap.fromTo(batch,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.18 }
      ),
      start: 'top 88%',
      once: true,
    });

    return () => split.revert();
  }, { scope: sectionRef });

  const chapters = [
    {
      num: '01',
      label: t('chapters.iot.label'),
      body: t('chapters.iot.body'),
      align: 'left' as const,
      note: 'Published in Nature Scientific Reports, 2024 ↗',
      noteHref: 'https://www.nature.com/articles/s41598-024-00001-0',
    },
    {
      num: '02',
      label: t('chapters.university.label'),
      body: t('chapters.university.body'),
      align: 'right' as const,
    },
    {
      num: '03',
      label: t('chapters.now.label'),
      body: t('chapters.now.body'),
      align: 'center' as const,
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      data-theme="dark"
      className="with-grain"
      style={{ position: 'relative', background: 'var(--bg-deep)', overflow: 'hidden' }}
    >
      {/* Act 1: Photo with heading */}
      <div
        ref={photoRef}
        style={{
          position: 'relative',
          height: '70vh',
          minHeight: '480px',
          overflow: 'hidden',
        }}
      >
        <Image
          src="/photos/forest-about.jpg"
          alt="Tropical forest with waterfall and filtered light — field observation, Colombia"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center', height: '120%', top: '-10%' }}
          sizes="100vw"
        />
        {/* Gradient fade to section bg */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(9,13,9,0) 30%, rgba(9,13,9,0.85) 80%, #090d09 100%)',
        }} />

        {/* Heading over photo */}
        <div style={{
          position: 'absolute',
          bottom: 'clamp(2rem, 5vh, 4rem)',
          left: 'var(--container-padding)',
          zIndex: 2,
        }}>
          <h2
            ref={headingRef}
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              color: 'var(--text-primary)',
              maxWidth: '16ch',
            }}
          >
            {t('heading')}
          </h2>
        </div>
      </div>

      {/* Bisagra — single metadata line */}
      <div style={{
        padding: 'clamp(2.5rem, 5vw, 4rem) var(--container-padding) 0',
        fontFamily: 'var(--font-body)',
        fontSize: '10px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--text-technical)',
      }}>
        Notas de Campo — Julio Zorro Pérez &nbsp;/&nbsp; 2019–2025 &nbsp;·&nbsp; Bogotá, Colombia
      </div>

      {/* Act 2: Three asymmetric chapters */}
      <div style={{ padding: 'clamp(3rem, 6vw, 5rem) var(--container-padding) var(--section-padding-y)' }}>
        {chapters.map(({ num, label, body, align, note, noteHref }) => (
          <div
            key={num}
            className="field-chapter"
            style={{
              marginBottom: 'clamp(3rem, 6vw, 5rem)',
              maxWidth: align === 'center' ? '520px' : '680px',
              marginLeft: align === 'right' ? 'auto' : align === 'center' ? 'auto' : undefined,
              marginRight: align === 'center' ? 'auto' : undefined,
              textAlign: align,
            }}
          >
            <span style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: num === '03' ? 'var(--accent-lichen)' : 'var(--text-technical)',
              marginBottom: 'var(--space-3)',
            }}>
              {num}
            </span>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: num === '03'
                ? 'clamp(1.8rem, 3vw, 2.5rem)'
                : 'clamp(1.4rem, 2.5vw, 2rem)',
              fontWeight: 400,
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-4)',
              lineHeight: 1.15,
            }}>
              {label}
            </h3>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
              lineHeight: 1.8,
              color: `rgba(242,237,230,${num === '03' ? '0.8' : num === '02' ? '0.55' : '0.65'})`,
              maxWidth: '55ch',
              marginLeft: align === 'center' ? 'auto' : undefined,
              marginRight: align === 'center' ? 'auto' : undefined,
            }}>
              {body}
            </p>
            {note && noteHref && (
              <a
                href={noteHref}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: 'var(--space-3)',
                  fontFamily: 'var(--font-body)',
                  fontStyle: 'italic',
                  fontSize: '13px',
                  color: 'var(--accent-lichen)',
                  textDecoration: 'none',
                }}
              >
                {note}
              </a>
            )}
          </div>
        ))}

        {/* Condensed tech stack — merged from Capabilities */}
        <div style={{
          borderTop: '1px solid rgba(122,173,94,0.1)',
          paddingTop: 'var(--space-8)',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-technical)',
          lineHeight: 2,
        }}>
          Python · TypeScript · React · Next.js · LangGraph · FastAPI · PostgreSQL · Three.js · GSAP
          <br />
          <span style={{ fontSize: '11px', opacity: 0.7 }}>
            Hardware & IoT: C/C++ · FreeRTOS · LoRa · LEO Satellites · MQTT · Edge Computing
          </span>
        </div>
      </div>
    </section>
  );
}
