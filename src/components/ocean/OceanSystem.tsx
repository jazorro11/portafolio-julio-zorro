'use client'

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { setLenis, getLenis } from '@/lib/lenis-instance'

// Register once at module scope — safe to call multiple times
gsap.registerPlugin(ScrollTrigger)

interface OceanContextValue {
  depthProgress: number    // 0 (surface) → 1 (trench)
  hookY: number            // px from viewport top, 0–400
  bypassHeroPin: () => void
}

const OceanContext = createContext<OceanContextValue>({
  depthProgress: 0,
  hookY: 0,
  bypassHeroPin: () => {},
})

export function useOcean() {
  return useContext(OceanContext)
}

export default function OceanSystem({ children }: { children: React.ReactNode }) {
  const [depthProgress, setDepthProgress] = useState(0)
  const [hookY, setHookY] = useState(0)

  const heroProgressRef = useRef(0)
  const postPinProgressRef = useRef(0)
  const heroPinRef = useRef<ScrollTrigger | null>(null)

  const bypassHeroPin = useCallback(() => {
    const lenis = getLenis()
    const pin = heroPinRef.current

    if (!pin) {
      // GSAP not yet mounted (SSR/hydration window) — navigate directly
      lenis?.scrollTo('#about', { duration: 0.8 })
      return
    }

    gsap.to(pin, {
      progress: 1,
      duration: 0.3,
      ease: 'power3.out',
      onComplete: () => lenis?.scrollTo('#about', { duration: 0.8 }),
    })
  }, [])

  useEffect(() => {
    // Skip all GSAP if user prefers reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    })

    setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // ── Hero pin (portrait mobile: 100vh / desktop: 200vh / landscape: disabled) ──
    const mm = gsap.matchMedia()

    mm.add(
      {
        portrait: '(max-width: 767px) and (orientation: portrait)',
        desktop: '(min-width: 768px)',
      },
      (context) => {
        const { portrait } = context.conditions as { portrait: boolean; desktop: boolean }
        const pinEnd = portrait ? '+=100vh' : '+=200vh'

        const pin = ScrollTrigger.create({
          trigger: '#hero',
          start: 'top top',
          end: pinEnd,
          pin: true,
          scrub: 1.2,
          onUpdate: (self) => {
            const px = self.progress * 400
            setHookY(px)
            heroProgressRef.current = self.progress
            const depth = heroProgressRef.current * 0.2 + postPinProgressRef.current * 0.8
            setDepthProgress(depth)
          },
        })

        heroPinRef.current = pin

        return () => {
          pin.kill()
          heroPinRef.current = null
        }
      }
    )

    // ── Post-pin depth progress (About → Contact) ──
    const postPin = ScrollTrigger.create({
      trigger: '#about',
      start: 'top bottom',
      endTrigger: '#contact',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        postPinProgressRef.current = self.progress
        const depth = heroProgressRef.current * 0.2 + self.progress * 0.8
        setDepthProgress(depth)
      },
    })

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenis(null)
      postPin.kill()
      mm.revert()
    }
  }, [])

  return (
    <OceanContext.Provider value={{ depthProgress, hookY, bypassHeroPin }}>
      {children}
    </OceanContext.Provider>
  )
}
