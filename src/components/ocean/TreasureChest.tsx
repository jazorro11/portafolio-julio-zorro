'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}

export default function TreasureChest() {
  const t = useTranslations('ocean')
  const wrapperRef = useRef<HTMLDivElement>(null)
  const glowRef    = useRef<HTMLDivElement>(null)
  const linksRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const glow    = glowRef.current
    const links   = linksRef.current
    if (!wrapper || !glow || !links) return

    // Initial states
    gsap.set([glow, links], { opacity: 0 })
    gsap.set(links, { y: 16 })

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'top 70%',
          once: true,
        },
      })

      tl
        // Chest impact shake
        .to(wrapper, { y: -6, duration: 0.1, ease: 'none' })
        .to(wrapper, { y: 0,  duration: 0.2, ease: 'power2.out' })
        // Glow bursts open
        .to(glow,   { opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.1')
        // Links fade in staggered
        .to(links,  { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '-=0.2')
    })

    return () => ctx.revert()
  }, [])

  const contactLinks = [
    {
      href:      'https://github.com/jazorro11',
      label:     'GitHub',
      ariaLabel: t('contact.github_label'),
      icon:      <GitHubIcon />,
    },
    {
      href:      'https://www.linkedin.com/in/juliozorro/',
      label:     'LinkedIn',
      ariaLabel: t('contact.linkedin_label'),
      icon:      <LinkedInIcon />,
    },
    {
      href:      'mailto:jzorroperez@gmail.com',
      label:     'Email',
      ariaLabel: t('contact.email_label'),
      icon:      <EmailIcon />,
    },
  ]

  return (
    <div
      ref={wrapperRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
      }}
    >
      {/* SVG chest illustration with glow overlay */}
      <div style={{ position: 'relative' }}>
        <img
          src="/assets/treasure-chest.png"
          alt=""
          aria-hidden="true"
          width={220}
          style={{
            display: 'block',
            filter: 'drop-shadow(0 0 20px rgba(255,50,180,0.35))',
          }}
        />
        {/* Bioluminescent glow burst */}
        <div
          ref={glowRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-30px',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at 50% 60%, rgba(255,50,180,0.4), rgba(180,50,255,0.2) 40%, transparent 70%)',
            pointerEvents: 'none',
            filter: 'blur(8px)',
          }}
        />
      </div>

      {/* Contact links — revealed after chest animation */}
      <div
        ref={linksRef}
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {contactLinks.map(({ href, label, ariaLabel, icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('mailto') ? undefined : '_blank'}
            rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
            aria-label={ariaLabel}
            data-chest-link=""
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-text-dark-secondary)',
              textDecoration: 'none',
              border: '1px solid oklch(55% 0.22 310 / 0.3)',
              borderRadius: '100px',
              padding: '10px 20px',
              transition: 'color 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.color = 'var(--color-text-dark)'
              el.style.borderColor = 'oklch(55% 0.22 310 / 0.7)'
              el.style.boxShadow = '0 0 16px oklch(55% 0.22 310 / 0.3)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.color = 'var(--color-text-dark-secondary)'
              el.style.borderColor = 'oklch(55% 0.22 310 / 0.3)'
              el.style.boxShadow = 'none'
            }}
            onMouseDown={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(0.97)' }}
            onMouseUp={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)' }}
          >
            {icon}
            {label}
          </a>
        ))}
      </div>

      {/* Touch: always show subtle glow on links */}
      <style>{`
        @media (hover: none) {
          [data-chest-link] {
            box-shadow: 0 0 8px oklch(55% 0.22 310 / 0.2);
          }
        }
      `}</style>
    </div>
  )
}
