'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap-config';

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !containerRef.current) return;

    const container = containerRef.current;
    const orbEls = container.querySelectorAll<HTMLElement>('[data-orb]');
    const particleEls = container.querySelectorAll<HTMLElement>('[data-particle]');

    const tweens: gsap.core.Tween[] = [];

    orbEls.forEach((el, i) => {
      const orb = orbs[i];
      if (!orb) return;
      tweens.push(
        gsap.to(el, {
          x: orb.animateTo.x,
          y: orb.animateTo.y,
          scale: orb.animateTo.scale,
          duration: orb.duration,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      );
    });

    particleEls.forEach((el, i) => {
      const path = PARTICLE_PATHS[i % PARTICLE_PATHS.length];
      tweens.push(
        gsap.to(el, {
          keyframes: path.x.map((xVal, ki) => ({
            x: xVal,
            y: path.y[ki],
            opacity: [0.7, 1, 0.5, 0.7][ki],
            duration: (4.5 + i * 0.3) / path.x.length,
          })),
          repeat: -1,
          ease: 'sine.inOut',
          delay: i * 0.4,
        })
      );
    });

    return () => {
      tweens.forEach(t => t.kill());
    };
  }, [orbs, particles]);

  return (
    <div
      ref={containerRef}
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
        <div
          key={`orb-${orb.color}-${orb.top ?? ''}-${orb.left ?? ''}-${orb.right ?? ''}`}
          data-orb
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
        Array.from({ length: particles.count }).map((_, i) => {
          const color = particles.colors[i % particles.colors.length];
          return (
            <div
              key={`p-${i}`}
              data-particle
              style={{
                position: 'absolute',
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: color,
                left: `${15 + (i * 17) % 70}%`,
                top: `${20 + (i * 23) % 60}%`,
                willChange: 'transform',
                opacity: 0.7,
              }}
            />
          );
        })}
    </div>
  );
}
