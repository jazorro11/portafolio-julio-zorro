'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap-config';
import ChatMockup from './ChatMockup';

export default function Work() {
  const sectionRef  = useRef<HTMLElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const counterRef  = useRef<HTMLSpanElement>(null);
  const t = useTranslations('work');

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Featured title reveal
    const split = new SplitText(featuredRef.current!.querySelector('.specimen-title'), {
      type: 'lines',
    });
    gsap.from(split.lines, {
      opacity: 0, y: 30, duration: 0.8, ease: 'power4.out', stagger: 0.1,
      scrollTrigger: {
        trigger: featuredRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          // Counter animation ESP-001
          const obj = { val: 0 };
          gsap.to(obj, {
            val: 1, duration: 0.6, ease: 'power2.out',
            onUpdate: () => {
              if (counterRef.current)
                counterRef.current.textContent = `ESP-00${Math.round(obj.val)}`;
            },
          });
        },
      },
    });

    // Batch reveal for all specimen items
    ScrollTrigger.batch('.specimen-item', {
      onEnter: (batch) => gsap.fromTo(batch,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power4.out', stagger: 0.12 }
      ),
      start: 'top 85%',
      once: true,
    });

    return () => split.revert();
  }, { scope: sectionRef });

  return (
    <section
      id="work"
      ref={sectionRef}
      data-theme="dark"
      className="with-grain"
      style={{ position: 'relative', background: 'var(--bg-deep)' }}
    >
      {/* Sticky photo header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 0, height: 'clamp(40vh, 50vh, 55vh)', overflow: 'hidden' }}>
        <Image
          src="/photos/specimen-work.jpg"
          alt="Millipede coiled on green moss — field specimen, Bioma Digital collection"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center 60%' }}
          sizes="100vw"
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 0%, rgba(9,13,9,0.3) 60%, #090d09 100%)',
        }} />
        {/* SpecimenLabel */}
        <p style={{
          position: 'absolute', bottom: '2rem', left: 'var(--container-padding)',
          fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.18em',
          color: 'var(--text-technical)', zIndex: 2,
        }}>
          ESPECÍMENES DIGITALES — CAMPO 2019–2025
          <br />
          9°01′N 79°31′W &nbsp;/&nbsp; 3 REGISTROS CATALOGADOS
        </p>
      </div>

      {/* Content over sticky */}
      <div style={{ position: 'relative', zIndex: 1, background: 'var(--bg-deep)' }}>

        {/* Intro */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: 'clamp(2rem, 5vw, 6rem)',
          padding: 'clamp(3rem, 6vw, 5rem) var(--container-padding)',
          maxWidth: 'var(--container-max)',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(3.5rem, 7vw, 6rem)',
            fontWeight: 400,
            lineHeight: 0.9,
            color: 'var(--text-primary)',
          }}>
            {t('label')}
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            color: 'rgba(242,237,230,0.65)',
            maxWidth: '52ch',
            alignSelf: 'end',
          }}>
            Three projects. Each one a field record: what was observed, what was built, what shipped.
          </p>
        </div>

        {/* Specimen 01 — Featured */}
        <div
          ref={featuredRef}
          className="specimen-item"
          style={{
            margin: '0 var(--container-padding)',
            padding: 'clamp(2rem, 4vw, 3rem)',
            background: 'var(--bg-surface)',
            border: '1px solid rgba(122,173,94,0.12)',
            borderRadius: '3px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(2rem, 4vw, 4rem)',
            marginBottom: 'var(--space-4)',
          }}
        >
          <div>
            <span
              ref={counterRef}
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.18em',
                color: 'var(--text-technical)',
                marginBottom: 'var(--space-3)',
              }}
            >
              ESP-000
            </span>
            <h3
              className="specimen-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                fontWeight: 400,
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-4)',
                lineHeight: 1.1,
              }}
            >
              {t('projects.agent.title')}
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-technical)', marginBottom: 'var(--space-3)' }}>
              Type: Conversational AI System &nbsp;·&nbsp; Status: Beta
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
              lineHeight: 1.7,
              color: 'rgba(242,237,230,0.7)',
              maxWidth: '45ch',
              marginBottom: 'var(--space-6)',
            }}>
              {t('projects.agent.description')}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-technical)', marginBottom: 'var(--space-6)' }}>
              {t('projects.agent.tags')}
            </p>
            <a
              href="#"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--accent-lichen)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--accent-lichen)',
                paddingBottom: '1px',
              }}
            >
              {t('viewCode')} ↗
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ChatMockup />
          </div>
        </div>

        {/* Specimen 02 — Sinergia */}
        <div
          className="specimen-item"
          style={{
            margin: '0 var(--container-padding)',
            padding: 'clamp(2rem, 4vw, 3rem) 0',
            borderTop: '1px solid rgba(122,173,94,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 'clamp(2rem, 4vw, 4rem)',
          }}
        >
          <div>
            <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.18em', color: 'var(--text-technical)', marginBottom: 'var(--space-3)' }}>ESP-002</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 400, color: 'var(--text-primary)', marginBottom: 'var(--space-3)', lineHeight: 1.15 }}>
              {t('projects.sinergia.title')}
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', lineHeight: 1.7, color: 'rgba(242,237,230,0.65)', maxWidth: '40ch' }}>
              {t('projects.sinergia.description')}
            </p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-technical)', marginBottom: 'var(--space-4)' }}>
              {t('projects.sinergia.tags')}
            </p>
            <a href="https://estudio-sinergia.vercel.app" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-lichen)', textDecoration: 'none', borderBottom: '1px solid var(--accent-lichen)' }}>
              {t('liveDemo')} ↗
            </a>
          </div>
        </div>

        {/* Specimen 03 — HAZ */}
        <div
          className="specimen-item"
          style={{
            margin: '0 var(--container-padding)',
            padding: 'clamp(2rem, 4vw, 3rem) 0',
            borderTop: '1px solid rgba(122,173,94,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 'clamp(2rem, 4vw, 4rem)',
            flexDirection: 'row-reverse',
            paddingBottom: 'var(--section-padding-y)',
          }}
        >
          <div>
            <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.18em', color: 'var(--text-technical)', marginBottom: 'var(--space-3)' }}>ESP-003</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 400, color: 'var(--text-primary)', marginBottom: 'var(--space-3)', lineHeight: 1.15 }}>
              {t('projects.haz.title')}
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', lineHeight: 1.7, color: 'rgba(242,237,230,0.65)', maxWidth: '40ch' }}>
              {t('projects.haz.description')}
            </p>
          </div>
          <div style={{ textAlign: 'left', flexShrink: 0 }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--accent-cork)', marginBottom: 'var(--space-4)' }}>
              {t('projects.haz.tags')}
            </p>
            <a href="#" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-cork)', textDecoration: 'none', borderBottom: '1px solid var(--accent-cork)' }}>
              {t('viewProject')} ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
