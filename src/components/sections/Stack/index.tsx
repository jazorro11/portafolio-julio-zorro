'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import OceanBackground from '@/components/ocean/OceanBackground'
import BioParticles from '@/components/ocean/BioParticles'

const EASE = [0.23, 1, 0.32, 1] as [number, number, number, number]

// Same skill data as Capabilities — migrated verbatim
const stack: Record<string, { items: string[]; glowColor: string }> = {
  'AI & Agents': {
    items: ['LangGraph', 'LangChain', 'OpenAI API', 'Anthropic API', 'Python', 'FastAPI'],
    glowColor: 'rgba(0,229,200,0.3)',
  },
  'Frontend': {
    items: ['Next.js', 'React', 'TypeScript', 'Framer Motion', 'GSAP'],
    glowColor: 'rgba(100,180,255,0.2)',
  },
  'Backend': {
    items: ['Node.js', 'Python', 'PostgreSQL', 'REST APIs', 'GraphQL'],
    glowColor: 'rgba(100,180,255,0.2)',
  },
  'Tools': {
    items: ['Git', 'Vercel', 'Supabase', 'Claude Code', 'Docker'],
    glowColor: 'rgba(255,140,66,0.25)',
  },
}

const hardwareStack = [
  { category: 'Microcontrollers', items: ['ESP32', 'STM32', 'ATmega'],                               glowColor: 'rgba(255,80,50,0.2)' },
  { category: 'Connectivity',     items: ['LoRa', 'LoRaWAN', 'MQTT', 'BLE', 'WiFi', 'I2C', 'SPI'], glowColor: 'rgba(255,80,50,0.2)' },
  { category: 'Low Power',        items: ['Deep Sleep', 'RTC Wakeup', 'Battery Mgmt', 'Solar'],      glowColor: 'rgba(255,80,50,0.2)' },
  { category: 'Languages',        items: ['C', 'C++', 'MicroPython', 'FreeRTOS'],                    glowColor: 'rgba(255,80,50,0.2)' },
]

interface BubbleProps { name: string; glowColor: string; i: number }

function SkillBubble({ name, glowColor, i }: BubbleProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ delay: i * 0.04, duration: 0.35, ease: EASE }}
      style={{
        display: 'inline-block',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        letterSpacing: '0.06em',
        color: 'var(--color-text-dark-secondary)',
        border: `1px solid ${glowColor}`,
        borderRadius: '20px',
        padding: '0.45rem 0.9rem',
        cursor: 'default',
        willChange: 'transform',
        transition: 'box-shadow 200ms ease, color 200ms ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = `0 0 12px ${glowColor}`
        el.style.color = 'var(--color-text-dark)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = 'none'
        el.style.color = 'var(--color-text-dark-secondary)'
      }}
    >
      {name}
    </motion.span>
  )
}

export default function Stack() {
  const t = useTranslations('capabilities')

  return (
    <OceanBackground
      color="oklch(0% 0 0 / 0.4)"
      style={{
        backgroundColor: 'oklch(7% 0.025 262)',
        backgroundImage: 'url(/assets/bg-reef.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 'var(--section-padding-y) var(--container-padding)',
        overflow: 'hidden',
      }}
    >
      <section
        id="stack"
        data-theme="dark"
        style={{ position: 'relative' }}
      >
        <BioParticles
          colors={['rgba(0,229,200,0.18)', 'rgba(200,50,180,0.12)']}
          desktopCount={12}
          mobileCount={6}
        />

        {/* Reef fish — decorative */}
        <img
          src="/assets/fish-parrotfish.png"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '14%',
            left: '2%',
            width: 160,
            opacity: 0.85,
            pointerEvents: 'none',
            transform: 'scaleX(1)',
            filter: 'drop-shadow(0 0 14px rgba(0,229,200,0.35))',
          }}
        />
        <img
          src="/assets/fish-angelfish.png"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '18%',
            right: '3%',
            width: 140,
            opacity: 0.8,
            pointerEvents: 'none',
            transform: 'scaleX(-1)',
            filter: 'drop-shadow(0 0 12px rgba(100,150,255,0.35))',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '4rem' }}>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              className="section-label"
              style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}
            >
              {t('label')}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, ease: EASE }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-3xl)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: 'var(--color-text-dark)',
              }}
            >
              {t('heading')}
            </motion.h2>
          </div>

          {/* Software categories */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2.5rem' }}>
            {Object.entries(stack).map(([category, { items, glowColor }], ci) => (
              <div key={category}>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ delay: ci * 0.08 }}
                  className="section-label"
                  style={{
                    color: ci === 0 ? 'var(--color-accent)' : 'var(--color-text-dark-muted)',
                    marginBottom: '1rem',
                  }}
                >
                  {category}
                </motion.p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {items.map((item, i) => (
                    <SkillBubble key={item} name={item} glowColor={glowColor} i={ci * 6 + i} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div aria-hidden style={{ borderTop: '1px solid rgba(0,229,200,0.1)', marginBlock: '3rem' }} />

          <details open style={{ background: 'oklch(5% 0.025 260)', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(255,80,50,0.15)' }}>
            <summary style={{ cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', userSelect: 'none' }}>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                className="section-label"
                style={{ color: 'rgba(255,80,50,0.8)', margin: 0, fontSize: 'var(--text-sm)' }}
              >
                {t('hardware.label')}
              </motion.p>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,80,50,0.4)', letterSpacing: '0.1em' }}>▾</span>
            </summary>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2.5rem' }}>
              {hardwareStack.map(({ category, items, glowColor }, ci) => (
                <div key={category}>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ delay: ci * 0.08 }}
                    className="section-label"
                    style={{ color: 'rgba(255,80,50,0.6)', marginBottom: '1rem' }}
                  >
                    {category}
                  </motion.p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {items.map((item, i) => (
                      <SkillBubble key={item} name={item} glowColor={glowColor} i={ci * 6 + i} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>

        {/* Touch: bubbles always have subtle glow */}
        <style>{`
          @media (hover: none) {
            #stack span[style*="border"] {
              box-shadow: 0 0 6px rgba(0,229,200,0.2);
            }
          }
          @media (max-width: 767px) {
            #stack { padding-left: 32px; }
          }
        `}</style>
      </section>
    </OceanBackground>
  )
}
