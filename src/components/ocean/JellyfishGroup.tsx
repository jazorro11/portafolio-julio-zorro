'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface JellyfishProps {
  color: string
  size: number
  left: string
  bottom: string
  amplitude: number
  duration: number
  delay: number
}

function Jellyfish({ color, size, left, bottom, amplitude, duration, delay }: JellyfishProps) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: -amplitude,
        duration: duration / 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay,
      })
    })
    return () => ctx.revert()
  }, [amplitude, duration, delay])

  return (
    <svg
      ref={ref}
      viewBox="0 0 40 54"
      width={size}
      height={Math.round(size * 1.35)}
      aria-hidden="true"
      style={{
        position: 'absolute',
        left,
        bottom,
        willChange: 'transform',
        pointerEvents: 'none',
      }}
    >
      {/* Bell */}
      <ellipse cx="20" cy="16" rx="16" ry="14" fill={color} />
      {/* Inner glow ring */}
      <ellipse cx="20" cy="18" rx="10" ry="8" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
      {/* Tentacles */}
      <path d="M10 29 Q7 40 11 47" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M16 30 Q13 43 17 50" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M22 30 Q25 43 21 50" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M28 29 Q31 40 27 47" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

const JELLIES: JellyfishProps[] = [
  { color: 'rgba(180,80,255,0.28)',  size: 48, left: '4%',  bottom: '30%', amplitude: 12, duration: 10, delay: 0   },
  { color: 'rgba(0,229,200,0.22)',   size: 36, left: '18%', bottom: '55%', amplitude: 15, duration: 12, delay: 2.5 },
  { color: 'rgba(180,80,255,0.18)',  size: 28, left: '8%',  bottom: '70%', amplitude: 18, duration:  9, delay: 5.0 },
]

export default function JellyfishGroup() {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}
    >
      {JELLIES.map((j, i) => (
        <Jellyfish key={i} {...j} />
      ))}
    </div>
  )
}
