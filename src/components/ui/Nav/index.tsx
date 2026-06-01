'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import LanguageToggle from '../LanguageToggle';
import { getLenis } from '@/lib/lenis-instance';

export default function Nav() {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#about',    label: t('about') },
    { href: '#work',     label: t('work') },
    { href: '#services', label: t('services') },
    { href: '#contact',  label: t('contact') },
  ];

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(href, { offset: -72, duration: 1.2 });
    else document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 'var(--z-nav)' as string,
        padding: '20px var(--container-padding)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'background 300ms ease, backdrop-filter 300ms ease',
        background: scrolled ? 'rgba(9,13,9,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <a
        href="#hero"
        onClick={e => handleNavClick(e, '#hero')}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-sm)',
          fontWeight: 400,
          color: 'var(--text-primary)',
          textDecoration: 'none',
          letterSpacing: '-0.02em',
        }}
      >
        JZ
      </a>

      <ul className="nav-links" style={{ display: 'flex', gap: '2rem', listStyle: 'none', alignItems: 'center', margin: 0, padding: 0 }}>
        {links.map(({ href, label }) => (
          <li key={href} className="nav-link-item">
            <a
              href={href}
              onClick={e => handleNavClick(e, href)}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-technical)',
                textDecoration: 'none',
                transition: 'color 200ms ease',
                padding: '12px 0',
                display: 'inline-block',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-technical)')}
            >
              {label}
            </a>
          </li>
        ))}
        <li><LanguageToggle /></li>
      </ul>

      <style>{`
        @media (max-width: 640px) { .nav-link-item { display: none !important; } }
      `}</style>
    </nav>
  );
}
