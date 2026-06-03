'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface CoralProps {
  side: 'left' | 'right'
  color: string
  glowColor: string
  bottom: string
  width: number
}

function CoralPaths({ color }: { color: string }) {
  return (
    <>
      <line x1="50" y1="120" x2="50" y2="60" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <line x1="50" y1="85"  x2="25" y2="50" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="25" y1="50"  x2="15" y2="30" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="25" y1="50"  x2="35" y2="28" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="75"  x2="72" y2="45" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="72" y1="45"  x2="62" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="72" y1="45"  x2="82" y2="25" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="50" cy="58" r="5" fill={color} />
      <circle cx="15" cy="28" r="4" fill={color} />
      <circle cx="35" cy="26" r="3" fill={color} />
      <circle cx="62" cy="20" r="4" fill={color} />
      <circle cx="82" cy="23" r="3" fill={color} />
    </>
  )
}

function Coral({ side, color, glowColor, bottom, width }: CoralProps) {
  const baseRef = useRef<SVGSVGElement>(null)
  const glowRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const base = baseRef.current
    const glow = glowRef.current
    if (!base || !glow) return

    // Skip on mobile entirely
    if (window.matchMedia('(max-width: 767px)').matches) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: base,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter:     () => gsap.to(glow, { opacity: 1, duration: 0.4, ease: 'power2.out' }),
        onLeave:     () => gsap.to(glow, { opacity: 0, duration: 0.6 }),
        onEnterBack: () => gsap.to(glow, { opacity: 1, duration: 0.4, ease: 'power2.out' }),
        onLeaveBack: () => gsap.to(glow, { opacity: 0, duration: 0.6 }),
      })
    })

    return () => ctx.revert()
  }, [])

  const isLeft = side === 'left'
  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    bottom,
    [isLeft ? 'left' : 'right']: 0,
    width,
    pointerEvents: 'none',
  }

  return (
    <div style={{ position: 'relative', ...positionStyle }}>
      {/* Base coral — static */}
      <svg
        ref={baseRef}
        viewBox="0 0 100 130"
        width={width}
        aria-hidden="true"
        style={{ display: 'block' }}
      >
        <CoralPaths color={color} />
      </svg>
      {/* Glow overlay — opacity tween (never filter tween) */}
      <svg
        ref={glowRef}
        viewBox="0 0 100 130"
        width={width}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0,
          filter: `drop-shadow(0 0 8px ${glowColor})`,
          pointerEvents: 'none',
        }}
      >
        <CoralPaths color={color} />
      </svg>
    </div>
  )
}

export default function CoralReef() {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <Coral side="left"  color="rgba(255,80,50,0.5)"   glowColor="#00E5C8" bottom="0" width={90} />
      <Coral side="right" color="rgba(200,50,180,0.5)"  glowColor="#00E5C8" bottom="0" width={75} />
    </div>
  )
}
