'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';

const SERVICE_KEYS = ['ai', 'fullstack', 'interfaces', 'consulting'] as const;
type ServiceKey = typeof SERVICE_KEYS[number];

const SERVICE_META: Record<ServiceKey, { num: string; availability: string }> = {
  ai:         { num: '01', availability: 'Min. commitment: 3 weeks' },
  fullstack:  { num: '02', availability: 'Full project: 4–10 weeks' },
  interfaces: { num: '03', availability: 'Animation sprint: 1–3 weeks' },
  consulting: { num: '04', availability: 'Initial session: 1 week' },
};

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef   = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<ServiceKey | null>(null);
  const t = useTranslations('services');

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Photo entrance
    gsap.from(photoRef.current, {
      opacity: 0, x: -30, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
    });

    // Photo parallax
    gsap.to(photoRef.current!.querySelector('img'), {
      y: -40, ease: 'none',
      scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
    });

    // Rows stagger
    gsap.from('.service-row', {
      opacity: 0, y: 24, stagger: 0.1, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.service-rows', start: 'top 75%', once: true },
    });
  }, { scope: sectionRef });

  return (
    <section
      id="services"
      ref={sectionRef}
      data-theme="dark"
      className="with-grain"
      style={{ position: 'relative', background: 'var(--bg-deep)', overflow: 'hidden' }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: '42% 58%',
        minHeight: '100svh',
        maxWidth: 'var(--container-max)',
        padding: 'var(--section-padding-y) var(--container-padding)',
        gap: 'clamp(2rem, 5vw, 5rem)',
        margin: '0 auto',
      }}>

        {/* Left: sticky photo */}
        <div
          ref={photoRef}
          style={{
            position: 'sticky',
            top: 'var(--section-padding-y)',
            height: 'fit-content',
            overflow: 'hidden',
            borderRadius: '2px',
          }}
        >
          <Image
            src="/photos/frailejón-services.jpg"
            alt="Frailejón — endemic to the Colombian páramo. Grows 1cm per year."
            width={600}
            height={720}
            style={{ objectFit: 'cover', width: '100%', height: 'clamp(400px, 60vh, 700px)', display: 'block' }}
          />
          <p style={{
            marginTop: 'var(--space-3)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-technical)',
            fontStyle: 'italic',
          }}>
            Frailejón — endémica del páramo. Crece 1cm por año.
          </p>
        </div>

        {/* Right: expand rows */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 400,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-12)',
            lineHeight: 1.1,
          }}>
            {t('label')}
          </h2>

          <div className="service-rows">
            {SERVICE_KEYS.map((key) => {
              const { num, availability } = SERVICE_META[key];
              const isOpen = expanded === key;

              return (
                <div
                  key={key}
                  className="service-row"
                  style={{ borderTop: '1px solid rgba(122,173,94,0.12)' }}
                >
                  <button
                    onClick={() => setExpanded(prev => prev === key ? null : key)}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 'clamp(1.2rem, 2.5vw, 1.8rem) 0',
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 'var(--space-4)',
                      textAlign: 'left',
                    }}
                    onMouseEnter={e => {
                      const numEl = e.currentTarget.querySelector('.svc-num') as HTMLElement;
                      if (numEl) gsap.to(numEl, { x: 4, duration: 0.2, ease: 'power2.out' });
                    }}
                    onMouseLeave={e => {
                      const numEl = e.currentTarget.querySelector('.svc-num') as HTMLElement;
                      if (numEl) gsap.to(numEl, { x: 0, duration: 0.2, ease: 'power2.out' });
                    }}
                  >
                    <span className="svc-num" style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-technical)',
                      minWidth: '2rem',
                      display: 'inline-block',
                    }}>
                      {num}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.4rem, 2vw, 2rem)',
                      fontWeight: 400,
                      color: 'var(--text-primary)',
                    }}>
                      {t(`items.${key}.title`)}
                    </span>
                  </button>

                  {/* Expandable content — CSS grid-template-rows trick */}
                  <div style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows 350ms ease',
                    overflow: 'hidden',
                  }}>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ paddingBottom: 'clamp(1.2rem, 2.5vw, 1.8rem)', paddingLeft: 'calc(2rem + var(--space-4))' }}>
                        <p style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--text-base)',
                          lineHeight: 1.7,
                          color: 'rgba(242,237,230,0.7)',
                          maxWidth: '50ch',
                          marginBottom: 'var(--space-3)',
                        }}>
                          {t(`items.${key}.description`)}
                        </p>
                        <span style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--accent-lichen)',
                          display: 'inline-block',
                        }}>
                          {availability}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div style={{
            borderTop: '1px solid rgba(122,173,94,0.2)',
            paddingTop: 'var(--space-8)',
            marginTop: 'var(--space-8)',
          }}>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-lg)',
              fontWeight: 400,
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-4)',
            }}>
              {t('heading')}
            </p>
            <a
              href="#contact"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--accent-lichen)',
                textDecoration: 'none',
                borderBottom: '1px solid currentColor',
                paddingBottom: '2px',
              }}
            >
              {t('cta')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
