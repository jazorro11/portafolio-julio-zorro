'use client'

import { useMemo } from 'react'

interface ParticleConfig {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  color: string
}

interface BioParticlesProps {
  colors?: string[]
  mobileCount?: number
  desktopCount?: number
  className?: string
}

// Deterministic pseudo-random — same result on SSR and client
function generateParticles(count: number, colors: string[]): ParticleConfig[] {
  return Array.from({ length: count }, (_, i) => {
    const seed = (i * 2654435769) >>> 0
    const rand = (n: number) => ((seed * (n + 1)) % 1000) / 1000
    return {
      id: i,
      x: rand(1) * 100,
      y: rand(2) * 100,
      size: 2 + rand(3) * 4,
      duration: 3 + rand(4) * 4,
      delay: rand(5) * 3,
      color: colors[i % colors.length],
    }
  })
}

export default function BioParticles({
  colors = ['rgba(0,229,200,0.35)', 'rgba(180,50,255,0.25)', 'rgba(255,50,180,0.2)'],
  mobileCount = 12,
  desktopCount = 24,
  className,
}: BioParticlesProps) {
  const desktopParticles = useMemo(
    () => generateParticles(desktopCount, colors),
    [desktopCount, colors]
  )
  const mobileParticles = useMemo(
    () => generateParticles(mobileCount, colors),
    [mobileCount, colors]
  )

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}
    >
      <style>{`
        @keyframes bio-float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
          50%       { transform: translateY(-14px) scale(1.15); opacity: 1; }
        }
        .bio-particle-desktop { display: block; }
        .bio-particle-mobile  { display: none; }
        @media (max-width: 767px) {
          .bio-particle-desktop { display: none; }
          .bio-particle-mobile  { display: block; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bio-particle-desktop,
          .bio-particle-mobile { animation: none !important; }
        }
      `}</style>

      {desktopParticles.map((p) => (
        <div
          key={`d-${p.id}`}
          className="bio-particle-desktop"
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            willChange: 'transform',
            animation: `bio-float ${p.duration}s ${p.delay}s ease-in-out infinite`,
          }}
        />
      ))}

      {mobileParticles.map((p) => (
        <div
          key={`m-${p.id}`}
          className="bio-particle-mobile"
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            willChange: 'transform',
            animation: `bio-float ${p.duration}s ${p.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
}
