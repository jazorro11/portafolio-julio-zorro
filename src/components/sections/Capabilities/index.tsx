'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { AmbientBackground } from '@/components/ui/AmbientBackground';

const stack = {
  'AI & Agents': ['LangGraph', 'LangChain', 'OpenAI API', 'Anthropic API', 'Python', 'FastAPI'],
  'Frontend':    ['Next.js', 'React', 'TypeScript', 'Framer Motion', 'GSAP', 'Three.js'],
  'Backend':     ['Node.js', 'Python', 'PostgreSQL', 'REST APIs', 'GraphQL'],
  'Tools':       ['Git', 'Vercel', 'Supabase', 'Claude Code', 'Docker'],
};

function TechCard({ name, i }: { name: string; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.04, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ scale: 1.04, borderColor: 'rgba(255,140,66,0.4)' }}
      whileTap={{ scale: 0.97 }} // Emil: scale(0.97) on press
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
          background: 'radial-gradient(ellipse 60% 50% at 80% 30%, rgba(59,130,246,0.07) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <AmbientBackground
        orbs={[
          {
            size: 200,
            color: 'rgba(255,140,66,0.25)',
            blurPx: 40,
            top: '-30px',
            right: '-20px',
            animateTo: { x: 12, y: -16, scale: 1.08 },
            duration: 6,
          },
          {
            size: 160,
            color: 'rgba(59,130,246,0.20)',
            blurPx: 45,
            bottom: '-20px',
            left: '-10px',
            animateTo: { x: -10, y: 12, scale: 0.92 },
            duration: 7,
          },
        ]}
        particles={{ count: 4, colors: ['rgba(255,140,66,0.7)', 'rgba(59,130,246,0.7)'] }}
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {items.map((item, i) => (
                  <TechCard key={item} name={item} i={ci * 6 + i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
