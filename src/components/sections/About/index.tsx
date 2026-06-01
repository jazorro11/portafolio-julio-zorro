'use client';

import { useTranslations } from 'next-intl';
import { AmbientBackground } from '@/components/ui/AmbientBackground';

const chapters: Array<{
  key: 'iot' | 'university' | 'now';
  bg: string;
  textColor: string;
  labelColor: string;
  border?: string;
}> = [
  { key: 'iot',        bg: '#080810', textColor: 'rgba(245,241,235,0.85)', labelColor: '#FF8C42' },
  { key: 'university', bg: '#F5F1EB', textColor: 'rgba(10,10,10,0.75)',    labelColor: '#FF8C42', border: '1px solid #EAE4D8' },
  { key: 'now',        bg: '#FF8C42', textColor: 'rgba(8,8,16,0.85)',      labelColor: 'rgba(8,8,16,0.5)' },
];

export default function About() {
  const t = useTranslations('about');

  // Split bio on double newline for two-paragraph rendering
  const bioParagraphs = t('bio').split('\n\n');

  return (
    <section
      id="about"
      data-theme="light"
      style={{
        background: 'var(--color-light)',
        padding: 'var(--section-padding-y) var(--container-padding)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(2rem, 5vw, 5rem)',
        alignItems: 'center',
      }}
    >
      <AmbientBackground
        orbs={[
          {
            size: 220,
            color: 'rgba(255,140,66,0.12)',
            blurPx: 60,
            top: '-40px',
            left: '-20px',
            animateTo: { x: 10, y: -14, scale: 1.05 },
            duration: 7,
          },
          {
            size: 180,
            color: 'rgba(160,120,80,0.10)',
            blurPx: 55,
            bottom: '-30px',
            right: '-10px',
            animateTo: { x: -8, y: 10, scale: 0.93 },
            duration: 9,
          },
        ]}
      />

      {/* Left: text */}
      <div style={{ maxWidth: '540px' }}>
        <p
          className="section-label"
          style={{ color: 'var(--color-text-light-secondary)', marginBottom: '1.5rem' }}
        >
          {t('label')}
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            lineHeight: 1.15,
            color: 'var(--color-text-light)',
            marginBottom: '2rem',
            whiteSpace: 'pre-line',
          }}
        >
          {t('heading')}
        </h2>

        {bioParagraphs.map((para, i) => (
          <p
            key={i}
            style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-light-secondary)',
              lineHeight: 1.8,
              marginBottom: i < bioParagraphs.length - 1 ? '1.25rem' : '2rem',
            }}
          >
            {para}
          </p>
        ))}

        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-light-muted)',
            lineHeight: 1.75,
            fontStyle: 'italic',
            borderLeft: '2px solid var(--color-accent)',
            paddingLeft: '1rem',
          }}
        >
          {t('approach')}
        </p>
      </div>

      {/* Right: story chapters — three blocks with real content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignSelf: 'stretch',
          justifyContent: 'center',
        }}
      >
        {chapters.map(({ key, bg, textColor, labelColor, border }) => (
          <div
            key={key}
            style={{
              background: bg,
              border: border ?? 'none',
              borderRadius: '14px',
              padding: '1.5rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: labelColor,
                }}
              >
                {t(`chapters.${key}.label`)}
              </span>
              {key === 'iot' && (
                <a
                  href="https://www.nature.com/articles/s41598-024-82344-4"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.62rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,140,66,0.6)',
                    textDecoration: 'none',
                    transition: 'color 150ms ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#FF8C42')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,140,66,0.6)')}
                >
                  Nature ↗
                </a>
              )}
            </div>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-sm)',
                fontWeight: 400,
                lineHeight: 1.65,
                color: textColor,
                margin: 0,
              }}
            >
              {t(`chapters.${key}.body`)}
            </p>
          </div>
        ))}
      </div>

      {/* Mobile: stack vertically */}
      <style>{`
        @media (max-width: 768px) {
          #about { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
