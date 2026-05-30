'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { fogReveal, growIn, growInStagger } from '@/lib/animations';
import { useHasHover } from '@/hooks/useHasHover';

const stack = {
  'AI & Agents': ['LangGraph', 'LangChain', 'OpenAI API', 'Anthropic API', 'Python', 'FastAPI'],
  'Frontend':    ['Next.js', 'React', 'TypeScript', 'Framer Motion', 'GSAP', 'Three.js'],
  'Backend':     ['Node.js', 'Python', 'PostgreSQL', 'REST APIs', 'GraphQL'],
  'Tools':       ['Git', 'Vercel', 'Supabase', 'Claude Code', 'Docker'],
};

const hardwareStack = [
  { category: 'Microcontrollers', items: ['ESP32', 'STM32', 'ATmega'] },
  { category: 'Connectivity',     items: ['LoRa', 'LoRaWAN', 'MQTT', 'BLE', 'WiFi', 'I2C', 'SPI', 'UART'] },
  { category: 'Low Power',        items: ['Deep Sleep', 'RTC Wakeup', 'Battery Mgmt', 'Solar'] },
  { category: 'Languages',        items: ['C', 'C++', 'MicroPython', 'FreeRTOS'] },
];

function TechCard({ name }: { name: string }) {
  const hasHover = useHasHover();

  return (
    <motion.div
      variants={growIn}
      whileHover={hasHover ? { scale: 1.04, borderColor: 'rgba(143,168,154,0.4)' } : undefined}
      whileTap={{ scale: 0.97 }}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '10px',
        padding: '0.6rem 1rem',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        letterSpacing: '0.06em',
        color: 'var(--color-text-dark-secondary)',
        cursor: 'default',
        transition: 'border-color 200ms ease, color 200ms ease',
      }}
    >
      {name}
    </motion.div>
  );
}

export default function Capabilities() {
  const t = useTranslations('capabilities');

  return (
    <section
      id="capabilities"
      data-theme="dark"
      className="with-grain"
      style={{
        background: 'var(--color-dark)',
        padding: 'var(--section-padding-y) var(--container-padding)',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 50% at 80% 30%, rgba(143,168,154,0.07) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: '4rem' }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-label"
            style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}
          >
            {t('label')}
          </motion.p>
          <motion.h2
            variants={fogReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10% 0px' }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-3xl)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              color: 'var(--color-text-dark)',
              marginBottom: 'clamp(2rem, 5vw, 4rem)',
            }}
          >
            {t('heading')}
          </motion.h2>
        </div>

        {/* Categories grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2.5rem',
          }}
        >
          {Object.entries(stack).map(([category, items], ci) => (
            <div key={category}>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: ci * 0.08 }}
                className="section-label"
                style={{
                  color: ci === 0 ? 'var(--color-accent)' : 'var(--color-text-dark-muted)',
                  marginBottom: '1rem',
                }}
              >
                {category}
              </motion.p>
              <motion.div
                variants={growInStagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
              >
                {items.map((item) => (
                  <TechCard key={item} name={item} />
                ))}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Hardware · IoT separator */}
        <div
          aria-hidden
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginBlock: '3rem' }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="section-label"
          style={{ color: 'var(--color-accent)', marginBottom: '2.5rem' }}
        >
          {t('hardware.label')}
        </motion.p>

        {/* Hardware categories grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2.5rem',
          }}
        >
          {hardwareStack.map(({ category, items }, ci) => (
            <div key={category}>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: ci * 0.08 }}
                className="section-label"
                style={{
                  color: 'var(--color-text-dark-muted)',
                  marginBottom: '1rem',
                }}
              >
                {category}
              </motion.p>
              <motion.div
                variants={growInStagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
              >
                {items.map((item) => (
                  <TechCard key={item} name={item} />
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
