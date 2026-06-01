'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, SplitText, ScrollTrigger } from '@/lib/gsap-config';
import dynamic from 'next/dynamic';

// SSR: false — Three.js needs window
const WebGLScene = dynamic(() => import('./WebGLScene'), { ssr: false });

export default function Hero() {
  const sectionRef   = useRef<HTMLElement>(null);
  const coordRef     = useRef<HTMLParagraphElement>(null);
  const firstNameRef = useRef<HTMLSpanElement>(null);
  const lastNameRef  = useRef<HTMLSpanElement>(null);
  const taglineRef   = useRef<HTMLParagraphElement>(null);
  const ctaRef       = useRef<HTMLAnchorElement>(null);
  const scrollRef    = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      gsap.set([coordRef.current, firstNameRef.current, lastNameRef.current,
                taglineRef.current, ctaRef.current, scrollRef.current],
        { opacity: 1, y: 0 });
      return;
    }

    const splitFirst = new SplitText(firstNameRef.current, { type: 'chars' });
    const splitLast  = new SplitText(lastNameRef.current,  { type: 'chars' });

    gsap.set([...(splitFirst.chars as Element[]), ...(splitLast.chars as Element[]),
              coordRef.current, taglineRef.current, ctaRef.current, scrollRef.current],
      { opacity: 0 });

    const tl = gsap.timeline();

    // Coordinates
    tl.to(coordRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.6);

    // First name chars
    tl.to(splitFirst.chars as Element[], {
      opacity: 1, y: 0, duration: 0.7, ease: 'biome.grow', stagger: 0.04,
    }, 1.0);

    // Last name chars
    tl.to(splitLast.chars as Element[], {
      opacity: 1, y: 0, duration: 0.7, ease: 'biome.grow', stagger: 0.04,
    }, 1.4);

    // Tagline
    tl.to(taglineRef.current, { opacity: 1, duration: 0.7, ease: 'power3.out' }, 1.9);

    // CTA
    tl.to(ctaRef.current, { opacity: 1, duration: 0.5, ease: 'power3.out' }, 2.3);

    // Scroll indicator loop
    tl.to(scrollRef.current, { opacity: 0.5, duration: 0.4, ease: 'power3.out' }, 2.6);
    gsap.to(scrollRef.current, {
      scale: 1.15, opacity: 0.3, duration: 1.4, ease: 'biome.breathe',
      repeat: -1, yoyo: true, delay: 3.0,
    });

    // Scroll-out: hero fades as user scrolls
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set(sectionRef.current!.querySelector('.hero-content'), {
          opacity: 1 - p * 1.25,
          y: -p * 60,
        });
      },
    });

    return () => {
      splitFirst.revert();
      splitLast.revert();
    };
  }, { scope: sectionRef });

  return (
    <section
      id="hero"
      ref={sectionRef}
      data-theme="dark"
      className="with-grain"
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'var(--bg-deep)',
      }}
    >
      <WebGLScene />

      <div
        className="hero-content"
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '0 var(--container-padding)',
          maxWidth: 'var(--container-max)',
          width: '100%',
        }}
      >
        {/* Field log coordinates */}
        <p
          ref={coordRef}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.18em',
            color: 'var(--text-technical)',
            marginBottom: 'var(--space-6)',
            opacity: 0,
            transform: 'translateY(8px)',
          }}
        >
          FIELD_LOG · 04°42′N 74°08′W · BIOME_001
        </p>

        {/* Name — split text target */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-hero)',
            fontWeight: 400,
            lineHeight: 0.9,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-8)',
          }}
        >
          <span
            ref={firstNameRef}
            style={{ display: 'block', overflow: 'hidden' }}
          >
            Julio
          </span>
          <span
            ref={lastNameRef}
            style={{ display: 'block', overflow: 'hidden' }}
          >
            Zorro
          </span>
        </h1>

        {/* Tagline */}
        <p
          ref={taglineRef}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-technical)',
            marginBottom: 'var(--space-12)',
            opacity: 0,
          }}
        >
          AI Engineer · Full Stack Developer · Software Engineer
        </p>

        {/* CTA */}
        <a
          ref={ctaRef}
          href="#work"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            color: 'var(--accent-lichen)',
            textDecoration: 'none',
            borderBottom: '1px solid var(--accent-lichen)',
            paddingBottom: '2px',
            opacity: 0,
            transition: 'opacity 200ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          → Enter the biome
        </a>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0,
          zIndex: 10,
        }}
        aria-hidden
      >
        <div style={{
          width: '1px',
          height: '48px',
          background: 'linear-gradient(to bottom, var(--accent-lichen), transparent)',
        }} />
      </div>
    </section>
  );
}
