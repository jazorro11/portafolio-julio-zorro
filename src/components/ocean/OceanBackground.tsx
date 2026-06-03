'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface OceanBackgroundProps {
  color: string
  children: React.ReactNode
  style?: React.CSSProperties
}

/**
 * Wraps a section with an ocean depth background.
 * Fades an absolutely-positioned overlay from transparent to `color`
 * as the section enters the viewport. Uses opacity (GPU-composited),
 * never background-color transition.
 */
export default function OceanBackground({ color, children, style }: OceanBackgroundProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const overlay = overlayRef.current
    if (!section || !overlay) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        scrub: true,
        onUpdate: (self) => {
          gsap.set(overlay, { opacity: self.progress })
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} style={{ position: 'relative', ...style }}>
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: color,
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
