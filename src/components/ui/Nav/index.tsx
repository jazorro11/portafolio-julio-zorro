'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LanguageToggle from '../LanguageToggle';
import { getLenis } from '@/lib/lenis-instance';

export default function Nav() {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const didMountRef = useRef(false);

  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const firstDrawerLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Escape key closes drawer
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Prevent body scroll when mobile drawer is open; Lenis stop/start; focus management
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      getLenis()?.stop();
      firstDrawerLinkRef.current?.focus();
    } else {
      document.body.style.overflow = '';
      getLenis()?.start();
      hamburgerRef.current?.focus();
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Active section tracker
  useEffect(() => {
    const sectionIds = ['about', 'stack', 'work', 'contact'];
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: '-40% 0px -40% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const links = [
    { href: '#about',    label: t('about') },
    { href: '#stack',    label: t('capabilities') },
    { href: '#work',     label: t('work') },
    { href: '#contact',  label: t('contact') },
  ];

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(href, { offset: -72, duration: 1.2 });
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 'var(--z-nav)' as string,
          padding: '20px var(--container-padding)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'background 300ms ease, backdrop-filter 300ms ease',
          background: scrolled ? 'rgba(8, 8, 16, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
        }}
      >
        {/* Logo / Name */}
        <a
          href="#hero"
          onClick={e => handleNavClick(e, '#hero')}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            color: 'var(--color-text-dark)',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
          }}
        >
          JZ
        </a>

        {/* Links — hidden on mobile */}
        <ul className="nav-links" style={{ display: 'flex', gap: '2rem', listStyle: 'none', alignItems: 'center' }}>
          {links.map(({ href, label }) => {
            const sectionId = href.replace('#', '');
            const isActive = activeSection === sectionId;
            return (
              <li key={href} className="nav-link-item">
                <a
                  href={href}
                  onClick={e => handleNavClick(e, href)}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: isActive ? 'var(--color-accent)' : 'var(--color-text-dark-secondary)',
                    textDecoration: 'none',
                    transition: 'color 200ms ease',
                    padding: '12px 0',
                    display: 'inline-block',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                  onMouseLeave={e =>
                    (e.currentTarget.style.color = isActive
                      ? 'var(--color-accent)'
                      : 'var(--color-text-dark-secondary)')
                  }
                >
                  {label}
                </a>
              </li>
            );
          })}
          <li className="nav-lang-desktop">
            <LanguageToggle />
          </li>
        </ul>

        {/* Hamburger button — only visible on mobile */}
        <button
          ref={hamburgerRef}
          className="nav-hamburger"
          onClick={() => setMobileOpen(prev => !prev)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-drawer"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'none', // shown via media query
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '5px',
            color: 'var(--color-accent)',
          }}
        >
          {mobileOpen ? (
            // X icon
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <line x1="2" y1="2" x2="20" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="20" y1="2" x2="2" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            // Hamburger icon
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <line x1="2" y1="5" x2="20" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="2" y1="11" x2="20" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="2" y1="17" x2="20" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>

        <style>{`
          @media (max-width: 640px) {
            .nav-link-item { display: none !important; }
            .nav-lang-desktop { display: none !important; }
            .nav-hamburger { display: flex !important; }
          }
          @media (min-width: 641px) {
            .nav-hamburger { display: none !important; }
          }
        `}</style>
      </nav>

      {/* Mobile drawer overlay — always in DOM, visibility toggled via opacity */}
      <div
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className="nav-mobile-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 'calc(var(--z-nav) - 1)' as string,
          background: 'oklch(5% 0.02 260 / 0.95)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
          transition: 'opacity 200ms ease',
        }}
        onClick={() => setMobileOpen(false)}
      >
        {/* Inner content — stop propagation so clicking links doesn't close via backdrop handler */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2.5rem',
          }}
          onClick={e => e.stopPropagation()}
        >
          {links.map(({ href, label }, index) => (
            <a
              key={href}
              ref={index === 0 ? firstDrawerLinkRef : undefined}
              href={href}
              onClick={e => {
                handleNavClick(e, href);
                setMobileOpen(false);
              }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-text-dark-secondary)',
                textDecoration: 'none',
                transition: 'color 200ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-dark-secondary)')}
            >
              {label}
            </a>
          ))}
          <div style={{ marginTop: '0.5rem' }}>
            <LanguageToggle />
          </div>
        </div>
      </div>
    </>
  );
}
