'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface OrbConfig {
  size: number;
  color: string;
  blurPx: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  animateTo: { x: number; y: number; scale: number };
  duration: number;
}

interface ParticleConfig {
  count: number;
  colors: string[];
}

interface AmbientBackgroundProps {
  orbs: OrbConfig[];
  particles?: ParticleConfig;
}

const PARTICLE_PATHS = [
  { x: [0, 7, -4, 0], y: [0, -10, -5, 0] },
  { x: [0, -5, 8, 0], y: [0, -8, -3, 0] },
  { x: [0, 4, -7, 0], y: [0, -12, -6, 0] },
  { x: [0, -8, 3, 0], y: [0, -6, -10, 0] },
  { x: [0, 6, -3, 0], y: [0, -9, -4, 0] },
  { x: [0, -4, 6, 0], y: [0, -7, -11, 0] },
];

export function AmbientBackground({ orbs, particles }: AmbientBackgroundProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          animate={
            shouldReduceMotion
              ? {}
              : { x: orb.animateTo.x, y: orb.animateTo.y, scale: orb.animateTo.scale }
          }
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: orb.color,
            filter: `blur(${orb.blurPx}px)`,
            top: orb.top,
            bottom: orb.bottom,
            left: orb.left,
            right: orb.right,
            willChange: 'transform',
          }}
        />
      ))}

      {particles &&
        !shouldReduceMotion &&
        Array.from({ length: particles.count }).map((_, i) => {
          const path = PARTICLE_PATHS[i % PARTICLE_PATHS.length];
          const color = particles.colors[i % particles.colors.length];
          return (
            <motion.div
              key={`p-${i}`}
              animate={{ x: path.x, y: path.y, opacity: [0.7, 1, 0.5, 0.7] }}
              transition={{
                duration: 4.5 + i * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.4,
              }}
              style={{
                position: 'absolute',
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: color,
                left: `${15 + (i * 17) % 70}%`,
                top: `${20 + (i * 23) % 60}%`,
                willChange: 'transform',
              }}
            />
          );
        })}
    </div>
  );
}
