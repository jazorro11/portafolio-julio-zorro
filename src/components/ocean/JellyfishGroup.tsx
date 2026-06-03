'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface JellyfishProps {
  size: number
  left: string
  bottom: string
  amplitude: number
  duration: number
  delay: number
  opacity: number
}

function Jellyfish({ size, left, bottom, amplitude, duration, delay, opacity }: JellyfishProps) {
  const ref = useRef<HTMLImageElement>(null)

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
    <img
      ref={ref}
      src="/assets/jellyfish.png"
      width={size}
      height={Math.round(size * 1.35)}
      aria-hidden="true"
      alt=""
      style={{
        position: 'absolute',
        left,
        bottom,
        opacity,
        willChange: 'transform',
        pointerEvents: 'none',
        filter: 'drop-shadow(0 0 12px rgba(0,229,200,0.4))',
      }}
    />
  )
}

const JELLIES: JellyfishProps[] = [
  { size: 90,  left: '3%',  bottom: '28%', amplitude: 12, duration: 10, delay: 0,   opacity: 0.75 },
  { size: 65,  left: '17%', bottom: '54%', amplitude: 15, duration: 12, delay: 2.5, opacity: 0.55 },
  { size: 50,  left: '7%',  bottom: '68%', amplitude: 18, duration:  9, delay: 5.0, opacity: 0.4  },
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
