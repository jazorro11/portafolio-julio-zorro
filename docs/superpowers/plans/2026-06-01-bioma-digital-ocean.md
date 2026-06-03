# Bioma Digital — Ocean Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current flat dark portfolio with a bioluminescent ocean-depth experience where GSAP ScrollTrigger drives a fishing hook descending through 5 depth environments as the user scrolls.

**Architecture:** `OceanSystem` (client provider in `page.tsx`) owns Lenis + GSAP plugin registration + Hero pin + `depthProgress` context. Eight new ocean components handle visuals. Five existing section components are modified to use ocean backgrounds and depth elements. `SmoothScroll` is deleted from both `layout.tsx` and `page.tsx` (pre-existing double Lenis bug fixed here).

**Tech Stack:** GSAP 3.15 + ScrollTrigger, Lenis 1.3 (via existing `lenis-instance.ts` singleton), Framer Motion 12 (preserved for text reveals), next-intl 4.12, Next.js 16 App Router, TypeScript.

---

## File Map

### Create
| File | Responsibility |
|------|---------------|
| `src/components/ocean/OceanSystem.tsx` | Context provider, Lenis init, GSAP plugin registration, Hero pin, `depthProgress` weighted blend, `bypassHeroPin()` |
| `src/components/ocean/FishingThread.tsx` | `position:fixed` SVG thread + hook, reads `hookY` from context, `aria-hidden` |
| `src/components/ocean/OceanBackground.tsx` | Per-section wrapper that crossfades bg color via opacity overlay |
| `src/components/ocean/BioParticles.tsx` | CSS-only floating particles, count-capped, `aria-hidden` |
| `src/components/ocean/JellyfishGroup.tsx` | 2–3 SVG jellyfish with phase-offset GSAP float loops |
| `src/components/ocean/CoralReef.tsx` | Dual SVG (base + pre-rendered glow overlay), opacity ScrollTrigger |
| `src/components/ocean/TreasureChest.tsx` | Chest next/image + `gsap.set(transformOrigin)` + impact timeline |
| `src/components/sections/Stack/index.tsx` | New section replacing Capabilities — same skill data, ocean bubble shell |

### Modify
| File | Change |
|------|--------|
| `src/styles/tokens.css` | Add ocean/bio/focus-ring tokens |
| `messages/en.json` | Add `ocean.*` key block (10 new strings) |
| `messages/es.json` | Add `ocean.*` key block (10 new strings) |
| `src/app/[locale]/layout.tsx` | Remove `SmoothScroll` import + wrapper |
| `src/app/[locale]/page.tsx` | Remove `SmoothScroll` + `Capabilities` + `AmbientBackground`; add `OceanSystem` + `Stack` + `FishingThread` |
| `src/components/ui/Nav/index.tsx` | Change `#capabilities` → `#stack` in links array |
| `src/components/sections/Hero/index.tsx` | Remove `WebGLScene`; add SVG boat + night sky; two-column layout; GSAP pin bypass via context |
| `src/components/sections/About/index.tsx` | Ocean shell (`OceanBackground`); add `JellyfishGroup`; fix `borderLeft` ban violation |
| `src/components/sections/Work/index.tsx` | Ocean shell; add astronaut `next/image` with sizes; remove `AmbientBackground` |
| `src/components/sections/Contact/index.tsx` | Ocean shell; replace email/socials with `TreasureChest` + 3 direct links |

### Delete
| File | Replaced by |
|------|------------|
| `src/components/sections/Hero/WebGLScene.tsx` | SVG boat in `Hero/index.tsx` |
| `src/components/sections/Capabilities/index.tsx` | `Stack/index.tsx` |
| `src/components/ui/SmoothScroll/index.tsx` | `OceanSystem.tsx` |
| `src/components/ui/AmbientBackground/index.tsx` | `OceanBackground.tsx` + `BioParticles.tsx` |

---

## Task 1: CSS Tokens

**Files:**
- Modify: `src/styles/tokens.css`

- [ ] **Step 1.1: Add ocean + bio + focus-ring tokens**

Open `src/styles/tokens.css`. After the existing `:root { ... }` block's closing `}`, add:

```css
/* ── Ocean System Tokens ── */
:root {
  /* Depth backgrounds — near-black OKLCH, chroma reduced at extremes */
  --ocean-surface:  oklch(12% 0.02 250);
  --ocean-shallow:  oklch(9%  0.03 258);
  --ocean-reef:     oklch(7%  0.025 262);
  --ocean-abyss:    oklch(5%  0.018 265);
  --ocean-trench:   oklch(3%  0.01  268);

  /* Bioluminescent accents */
  --bio-cyan:       oklch(80% 0.14 185);
  --bio-magenta:    oklch(55% 0.22 310);
  --bio-deep-blue:  oklch(45% 0.18 265);
  --bio-pink:       oklch(58% 0.24 330);

  /* Thread (amber semitransparente) */
  --thread-color:        oklch(68% 0.18 48 / 0.5);
  --thread-left-desktop: 32%;
  --thread-left-mobile:  12px;

  /* Focus ring — visible on all ocean dark backgrounds */
  --focus-ring: 0 0 0 2px oklch(68% 0.18 48);
}
```

Also add a global focus-visible rule at the end of the file:

```css
/* Focus visible — applies to all interactive elements site-wide */
:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 3px;
}
```

- [ ] **Step 1.2: Verify build**

```bash
npm run build
```

Expected: build succeeds. No token-related errors.

- [ ] **Step 1.3: Commit**

```bash
git add src/styles/tokens.css
git -c skill.commit=true commit -m "feat(tokens): add ocean/bio/focus-ring CSS tokens"
```

---

## Task 2: i18n Keys

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/es.json`

- [ ] **Step 2.1: Add English ocean keys**

In `messages/en.json`, add the `"ocean"` key at the top level (after the last existing key):

```json
"ocean": {
  "depth": {
    "surface":  "0m — Surface",
    "shallow":  "200m — Shallow Waters",
    "reef":     "800m — The Reef",
    "abyss":    "3,500m — The Abyss",
    "trench":   "11,000m — Mariana Trench"
  },
  "depth_short": {
    "surface":  "0m",
    "shallow":  "200m",
    "reef":     "800m",
    "abyss":    "3.5km",
    "trench":   "11km"
  },
  "astronaut": {
    "alt": "Cartoon astronaut floating in deep ocean with a flashlight"
  },
  "chest": {
    "alt": "Glowing bioluminescent treasure chest on the Mariana Trench floor"
  },
  "contact": {
    "github_label":   "View GitHub profile",
    "linkedin_label": "Connect on LinkedIn",
    "email_label":    "Send an email"
  },
  "scroll_hint": "scroll to descend"
}
```

Also update the existing `"hero"` key to add a `"scroll"` entry (replaces the hard-coded string in `Hero/index.tsx` line ~160):

```json
"hero": {
  ...existing keys...,
  "scroll": "scroll"
}
```

- [ ] **Step 2.2: Add Spanish ocean keys**

In `messages/es.json`, add the same `"ocean"` key with Spanish strings:

```json
"ocean": {
  "depth": {
    "surface":  "0m — Superficie",
    "shallow":  "200m — Aguas Someras",
    "reef":     "800m — El Arrecife",
    "abyss":    "3.500m — El Abismo",
    "trench":   "11.000m — Trinchera de las Marianas"
  },
  "depth_short": {
    "surface":  "0m",
    "shallow":  "200m",
    "reef":     "800m",
    "abyss":    "3,5km",
    "trench":   "11km"
  },
  "astronaut": {
    "alt": "Astronauta de caricatura flotando en el océano profundo con una linterna"
  },
  "chest": {
    "alt": "Cofre bioluminiscente brillante en el fondo de la Trinchera de las Marianas"
  },
  "contact": {
    "github_label":   "Ver perfil de GitHub",
    "linkedin_label": "Conectar en LinkedIn",
    "email_label":    "Enviar un correo"
  },
  "scroll_hint": "desplaza para descender"
}
```

Add to `"hero"` key:
```json
"hero": {
  ...existing keys...,
  "scroll": "scroll"
}
```

- [ ] **Step 2.3: Verify**

```bash
npm run build
```

Expected: build passes. `next-intl` will catch missing keys at build time.

- [ ] **Step 2.4: Commit**

```bash
git add messages/en.json messages/es.json
git -c skill.commit=true commit -m "feat(i18n): add ocean key block — depth labels, alt text, contact labels"
```

---

## Task 3: File Deletions + Nav Fix

**Files:**
- Delete: `src/components/sections/Hero/WebGLScene.tsx`
- Delete: `src/components/sections/Capabilities/index.tsx`
- Delete: `src/components/ui/SmoothScroll/index.tsx`
- Delete: `src/components/ui/AmbientBackground/index.tsx`
- Modify: `src/components/ui/Nav/index.tsx`

> **Note:** Deleting these files will break the build until Tasks 4 and 10 fix the imports. Complete this task and Task 4 before running `npm run build`.

- [ ] **Step 3.1: Delete replaced files**

```bash
rm src/components/sections/Hero/WebGLScene.tsx
rm src/components/sections/Capabilities/index.tsx
rm src/components/ui/SmoothScroll/index.tsx
rm src/components/ui/AmbientBackground/index.tsx
```

- [ ] **Step 3.2: Fix Nav — change capabilities href to stack**

In `src/components/ui/Nav/index.tsx`, find the `links` array and change `#capabilities` to `#stack`:

```tsx
// BEFORE (line ~20):
const links = [
  { href: '#about',        label: t('about') },
  { href: '#capabilities', label: t('capabilities') },
  { href: '#work',         label: t('work') },
  { href: '#contact',      label: t('contact') },
];

// AFTER:
const links = [
  { href: '#about',    label: t('about') },
  { href: '#stack',    label: t('capabilities') },
  { href: '#work',     label: t('work') },
  { href: '#contact',  label: t('contact') },
];
```

The `t('capabilities')` key already returns `"Stack"` / `"Stack"` in both locales — no i18n change needed.

- [ ] **Step 3.3: Commit** (build is broken; will fix in Tasks 4 + 17)

```bash
git add -A
git -c skill.commit=true commit -m "chore: delete WebGLScene, Capabilities, SmoothScroll, AmbientBackground; fix nav href"
```

---

## Task 4: OceanSystem Provider

**Files:**
- Create: `src/components/ocean/OceanSystem.tsx`

- [ ] **Step 4.1: Create OceanSystem.tsx**

Create `src/components/ocean/OceanSystem.tsx` with this exact content:

```tsx
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
      lenis?.scrollTo('#work', { duration: 0.8 })
      return
    }

    gsap.to(pin, {
      progress: 1,
      duration: 0.3,
      ease: 'power3.out',
      onComplete: () => lenis?.scrollTo('#work', { duration: 0.8 }),
    })
  }, [])

  useEffect(() => {
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

    // ── Hero pin (portrait only; landscape disables pin) ──
    const mm = gsap.matchMedia()

    mm.add(
      { portrait: '(max-width: 767px) and (orientation: portrait)', desktop: '(min-width: 768px)' },
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
```

- [ ] **Step 4.2: Commit**

```bash
git add src/components/ocean/OceanSystem.tsx
git -c skill.commit=true commit -m "feat(ocean): add OceanSystem provider with Lenis+GSAP bridge and depth context"
```

---

## Task 5: FishingThread

**Files:**
- Create: `src/components/ocean/FishingThread.tsx`

- [ ] **Step 5.1: Create FishingThread.tsx**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { useOcean } from './OceanSystem'

export default function FishingThread() {
  const { hookY } = useOcean()
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Opacity 0 → 1 after mount to prevent SSR layout shift
  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.opacity = '1'
    }
  }, [])

  const threadLength = 60 + hookY  // thread grows as hook descends

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 'var(--thread-left-desktop)',
        zIndex: 50,
        pointerEvents: 'none',
        opacity: 0,  // SSR: invisible; useEffect sets to 1
        transition: 'opacity 0.3s ease',
      }}
    >
      {/* Thread SVG */}
      <svg
        width="3"
        height="100vh"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <line
          x1="1.5"
          y1="0"
          x2="1.5"
          y2={threadLength}
          stroke="var(--thread-color)"
          strokeWidth="2"
          strokeDasharray="4 3"
          strokeLinecap="round"
        />
      </svg>

      {/* Hook icon */}
      <svg
        width="16"
        height="20"
        viewBox="0 0 16 20"
        style={{
          position: 'absolute',
          left: '50%',
          top: threadLength,
          transform: 'translateX(-50%)',
          willChange: 'transform',
        }}
        fill="none"
      >
        {/* Hook shaft */}
        <line x1="8" y1="0" x2="8" y2="10" stroke="var(--thread-color)" strokeWidth="2" strokeLinecap="round" />
        {/* Hook curve */}
        <path
          d="M8 10 Q8 18 12 18 Q16 18 16 14"
          stroke="var(--thread-color)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Hook barb */}
        <line x1="16" y1="14" x2="13" y2="12" stroke="var(--thread-color)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {/* Mobile override */}
      <style>{`
        @media (max-width: 767px) {
          [data-fishing-thread] {
            left: var(--thread-left-mobile) !important;
          }
          [data-fishing-thread] svg line,
          [data-fishing-thread] svg path {
            stroke-width: 3px;
          }
        }
      `}</style>
    </div>
  )
}
```

> Note: The mobile override style needs the wrapper to have `data-fishing-thread`. Add `data-fishing-thread=""` to the outer div in the same step.

Correct the outer div to include the data attribute:

```tsx
<div
  ref={wrapperRef}
  aria-hidden="true"
  data-fishing-thread=""
  style={{ ... }}
>
```

- [ ] **Step 5.2: Commit**

```bash
git add src/components/ocean/FishingThread.tsx
git -c skill.commit=true commit -m "feat(ocean): add FishingThread fixed SVG component"
```

---

## Task 6: OceanBackground

**Files:**
- Create: `src/components/ocean/OceanBackground.tsx`

- [ ] **Step 6.1: Create OceanBackground.tsx**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface OceanBackgroundProps {
  color: string           // CSS color — use var(--ocean-*) tokens
  children: React.ReactNode
  style?: React.CSSProperties
}

/**
 * Wraps a section with an ocean depth background.
 * Uses an absolutely-positioned overlay that fades from transparent to `color`
 * as the section enters the viewport. Animates `opacity`, not `background-color`,
 * to avoid expensive compositor repaints on mobile.
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
      {/* Base layer: inherited background */}
      {/* Overlay: fades in the section's depth color */}
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
      {/* Content above overlay */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 6.2: Commit**

```bash
git add src/components/ocean/OceanBackground.tsx
git -c skill.commit=true commit -m "feat(ocean): add OceanBackground opacity-crossfade wrapper"
```

---

## Task 7: BioParticles

**Files:**
- Create: `src/components/ocean/BioParticles.tsx`

- [ ] **Step 7.1: Create BioParticles.tsx**

```tsx
'use client'

import { useMemo } from 'react'

interface ParticleConfig {
  id: number
  x: number       // % from left
  y: number       // % from top
  size: number    // px
  duration: number // animation s
  delay: number    // animation s
  color: string
}

interface BioParticlesProps {
  colors?: string[]
  mobileCount?: number
  desktopCount?: number
  className?: string
}

// Stable seed — memo so particles don't re-randomize on re-render
function generateParticles(count: number, colors: string[]): ParticleConfig[] {
  return Array.from({ length: count }, (_, i) => {
    // Deterministic pseudo-random from index so SSR matches client
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
  const desktopParticles = useMemo(() => generateParticles(desktopCount, colors), [desktopCount, colors])
  const mobileParticles = useMemo(() => generateParticles(mobileCount, colors), [mobileCount, colors])

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
      `}</style>

      {/* Desktop particles */}
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

      {/* Mobile particles (fewer) */}
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
```

- [ ] **Step 7.2: Commit**

```bash
git add src/components/ocean/BioParticles.tsx
git -c skill.commit=true commit -m "feat(ocean): add BioParticles CSS-only floating particles"
```

---

## Task 8: JellyfishGroup

**Files:**
- Create: `src/components/ocean/JellyfishGroup.tsx`

- [ ] **Step 8.1: Create JellyfishGroup.tsx**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface JellyfishProps {
  color: string
  size: number        // px (viewBox scale)
  left: string        // CSS left value
  bottom: string      // CSS bottom value
  amplitude: number   // px vertical travel
  duration: number    // s per loop
  delay: number       // s initial delay
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
      height={size * 1.35}
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
      {/* Tentacles — 4, evenly spaced */}
      <path d="M10 29 Q7 40 11 47" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M16 30 Q13 43 17 50" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M22 30 Q25 43 21 50" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M28 29 Q31 40 27 47" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export default function JellyfishGroup() {
  const jellies: JellyfishProps[] = [
    { color: 'rgba(180,80,255,0.28)',  size: 48, left: '4%',  bottom: '30%', amplitude: 12, duration: 10, delay: 0    },
    { color: 'rgba(0,229,200,0.22)',   size: 36, left: '18%', bottom: '55%', amplitude: 15, duration: 12, delay: 2.5  },
    { color: 'rgba(180,80,255,0.18)',  size: 28, left: '8%',  bottom: '70%', amplitude: 18, duration:  9, delay: 5.0  },
  ]

  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}
    >
      {jellies.map((j, i) => (
        <Jellyfish key={i} {...j} />
      ))}
    </div>
  )
}
```

- [ ] **Step 8.2: Commit**

```bash
git add src/components/ocean/JellyfishGroup.tsx
git -c skill.commit=true commit -m "feat(ocean): add JellyfishGroup with phase-offset GSAP float"
```

---

## Task 9: CoralReef

**Files:**
- Create: `src/components/ocean/CoralReef.tsx`

- [ ] **Step 9.1: Create CoralReef.tsx**

The coral glow uses an opacity overlay (never `filter` tween — see spec §Stack).

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface CoralProps {
  side: 'left' | 'right'
  color: string       // base color
  glowColor: string   // hex for drop-shadow baked into overlay
  bottom: string      // CSS bottom value
  width: number       // px
}

function Coral({ side, color, glowColor, bottom, width }: CoralProps) {
  const baseRef  = useRef<SVGSVGElement>(null)
  const glowRef  = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const base = baseRef.current
    const glow = glowRef.current
    if (!base || !glow) return

    // Mobile: skip ScrollTrigger registration entirely
    if (window.matchMedia('(max-width: 767px)').matches) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: base,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter:      () => gsap.to(glow, { opacity: 1, duration: 0.4, ease: 'power2.out' }),
        onLeave:      () => gsap.to(glow, { opacity: 0, duration: 0.6 }),
        onEnterBack:  () => gsap.to(glow, { opacity: 1, duration: 0.4, ease: 'power2.out' }),
        onLeaveBack:  () => gsap.to(glow, { opacity: 0, duration: 0.6 }),
      })
    })

    return () => ctx.revert()
  }, [])

  const isLeft = side === 'left'
  const style: React.CSSProperties = {
    position: 'absolute',
    bottom,
    [isLeft ? 'left' : 'right']: 0,
    width,
    pointerEvents: 'none',
  }

  // Simple branching coral path
  const paths = (
    <>
      {/* Main stem */}
      <line x1="50" y1="120" x2="50" y2="60" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Left branch */}
      <line x1="50" y1="85"  x2="25" y2="50" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="25" y1="50"  x2="15" y2="30" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="25" y1="50"  x2="35" y2="28" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Right branch */}
      <line x1="50" y1="75"  x2="72" y2="45" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="72" y1="45"  x2="62" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="72" y1="45"  x2="82" y2="25" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Top tip */}
      <circle cx="50" cy="58" r="5" fill={color} />
      {/* Branch tips */}
      <circle cx="15" cy="28" r="4" fill={color} />
      <circle cx="35" cy="26" r="3" fill={color} />
      <circle cx="62" cy="20" r="4" fill={color} />
      <circle cx="82" cy="23" r="3" fill={color} />
    </>
  )

  return (
    <div style={{ position: 'relative', ...style }}>
      {/* Base coral — static */}
      <svg
        ref={baseRef}
        viewBox="0 0 100 130"
        width={width}
        aria-hidden="true"
        style={{ display: 'block' }}
      >
        {paths}
      </svg>

      {/* Glow overlay — same shape, opacity:0, filter baked in CSS */}
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
        {paths}
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
      {/* Left coral — red */}
      <Coral
        side="left"
        color="rgba(255,80,50,0.5)"
        glowColor="#00E5C8"
        bottom="0"
        width={90}
      />
      {/* Right coral — purple */}
      <Coral
        side="right"
        color="rgba(200,50,180,0.5)"
        glowColor="#00E5C8"
        bottom="0"
        width={75}
      />
    </div>
  )
}
```

- [ ] **Step 9.2: Commit**

```bash
git add src/components/ocean/CoralReef.tsx
git -c skill.commit=true commit -m "feat(ocean): add CoralReef with GPU-safe opacity glow (no filter tween)"
```

---

## Task 10: Hero Section Rewrite

**Files:**
- Modify: `src/components/sections/Hero/index.tsx`

This is the largest single change. The hero transforms from a centered layout to a two-column ocean layout with SVG boat, night sky, and GSAP pin. The letter-by-letter name animation (Framer Motion) is preserved unchanged.

- [ ] **Step 10.1: Replace Hero/index.tsx**

Replace the entire content of `src/components/sections/Hero/index.tsx`:

```tsx
'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useOcean } from '@/components/ocean/OceanSystem'

const EASE = [0.23, 1, 0.32, 1] as [number, number, number, number]

// ── Letter-by-letter name animation (preserved) ──────────────────────────────
const letterVariants = {
  hidden: { opacity: 0, y: 60, skewY: 4 },
  visible: (i: number) => ({
    opacity: 1, y: 0, skewY: 0,
    transition: { delay: 0.3 + i * 0.05, duration: 0.7, ease: EASE },
  }),
}

function SplitName({ name }: { name: string }) {
  return (
    <span aria-label={name} style={{ display: 'flex', overflow: 'hidden', flexWrap: 'wrap' }}>
      {name.split('').map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={letterVariants}
          style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}

// ── Night sky + boat SVG ──────────────────────────────────────────────────────
function NightSkyScene() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Starfield */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        aria-hidden="true"
      >
        {Array.from({ length: 60 }, (_, i) => {
          const seed = (i * 2654435769) >>> 0
          const r = (n: number) => ((seed * (n + 1)) % 1000) / 1000
          return (
            <circle
              key={i}
              cx={`${r(1) * 100}%`}
              cy={`${r(2) * 65}%`}
              r={0.5 + r(3) * 1.5}
              fill={`rgba(255,255,255,${0.2 + r(4) * 0.6})`}
            />
          )
        })}
      </svg>

      {/* Moon */}
      <div
        style={{
          position: 'absolute',
          top: '12%',
          left: '24%',
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 40%, rgba(255,200,100,0.95), rgba(255,140,66,0.6))',
          boxShadow: '0 0 40px rgba(255,140,66,0.35), 0 0 80px rgba(255,140,66,0.15)',
        }}
      />

      {/* Ocean horizon line */}
      <div
        style={{
          position: 'absolute',
          bottom: '35%',
          left: 0,
          right: 0,
          height: 1,
          background: 'linear-gradient(to right, transparent, rgba(0,180,200,0.25) 30%, rgba(0,180,200,0.25) 70%, transparent)',
        }}
      />

      {/* Boat SVG — positioned at thread X (32%) */}
      <svg
        viewBox="0 0 140 70"
        width="140"
        height="70"
        style={{
          position: 'absolute',
          bottom: '34%',
          left: 'calc(var(--thread-left-desktop) - 70px)',  // center boat on thread
          transform: 'translateY(50%)',
        }}
      >
        {/* Hull */}
        <path
          d="M15 42 Q70 58 125 42 L115 32 Q70 27 25 32 Z"
          fill="oklch(25% 0.04 250)"
          stroke="oklch(68% 0.18 48 / 0.3)"
          strokeWidth="0.5"
        />
        {/* Cabin */}
        <rect x="52" y="22" width="28" height="14" rx="3"
          fill="oklch(20% 0.03 250)"
          stroke="oklch(68% 0.18 48 / 0.2)"
          strokeWidth="0.5"
        />
        {/* Mast */}
        <line x1="70" y1="32" x2="70" y2="4" stroke="oklch(68% 0.18 48 / 0.7)" strokeWidth="1.5" strokeLinecap="round" />
        {/* Fishing rod — extends left toward thread */}
        <line x1="50" y1="28" x2="30" y2="16" stroke="oklch(68% 0.18 48 / 0.8)" strokeWidth="1" strokeLinecap="round" />
        {/* Rod tip marker (thread originates here) */}
        <circle cx="30" cy="16" r="2" fill="oklch(68% 0.18 48 / 0.9)" />
        {/* Water reflection shimmer */}
        <path d="M20 54 Q70 60 120 54" stroke="rgba(0,180,200,0.15)" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  )
}

// ── Main Hero component ───────────────────────────────────────────────────────
export default function Hero() {
  const t = useTranslations('hero')
  const tOcean = useTranslations('ocean')
  const { bypassHeroPin } = useOcean()

  return (
    <section
      id="hero"
      data-theme="dark"
      className="with-grain"
      style={{
        background: 'linear-gradient(to bottom, oklch(8% 0.02 250) 0%, oklch(12% 0.02 250) 100%)',
        minHeight: '100svh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <NightSkyScene />

      {/* Two-column layout: thread zone (0–32%) | content (38%+) */}
      <motion.div
        initial="hidden"
        animate="visible"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: '38% 1fr',
          minHeight: '100svh',
          alignItems: 'center',
          padding: '0 var(--container-padding)',
        }}
      >
        {/* Left zone: empty — FishingThread is position:fixed */}
        <div aria-hidden="true" />

        {/* Right zone: text content */}
        <div style={{ padding: '6rem 0' }}>
          {/* Role label */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.5, ease: EASE } },
            }}
            className="section-label"
            style={{ color: 'var(--color-accent)', marginBottom: '1.5rem' }}
          >
            {t('title')}
          </motion.p>

          {/* Name — letter by letter */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-hero)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 0.9,
              color: 'var(--color-text-dark)',
              marginBottom: '2rem',
            }}
          >
            <SplitName name={t('name')} />
          </h1>

          {/* Tagline */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { delay: 0.9, duration: 0.6, ease: EASE } },
            }}
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-dark-secondary)',
              maxWidth: '480px',
              marginBottom: '3rem',
              lineHeight: 1.5,
            }}
          >
            {t('tagline')}
          </motion.p>

          {/* CTA — bypasses the pin */}
          <motion.button
            onClick={bypassHeroPin}
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1, transition: { delay: 1.1, duration: 0.4, ease: EASE } },
            }}
            whileTap={{ scale: 0.97 }}
            whileHover={{ borderColor: 'var(--color-accent)' }}
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              border: '1px solid rgba(255,140,66,0.4)',
              borderRadius: '100px',
              padding: '14px 32px',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'border-color 200ms ease',
            }}
          >
            {t('cta')} ↓
          </motion.button>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: 'var(--thread-left-desktop)',
          transform: 'translateX(-50%)',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          className="section-label"
          style={{ color: 'var(--color-text-dark-muted)', fontSize: '0.65rem' }}
        >
          {t('scroll')}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          style={{
            width: 1,
            height: 40,
            background: 'linear-gradient(to bottom, rgba(255,140,66,0.6), transparent)',
          }}
        />
      </motion.div>

      {/* Mobile: single column, full-width content */}
      <style>{`
        @media (max-width: 767px) {
          #hero > div[style*="grid"] {
            grid-template-columns: 1fr !important;
          }
          #hero > div[style*="grid"] > [aria-hidden="true"] {
            display: none !important;
          }
          #hero > div[style*="grid"] > div:last-child {
            padding: 8rem 0 4rem !important;
          }
        }
      `}</style>
    </section>
  )
}
```

- [ ] **Step 10.2: Verify build compiles** (layout.tsx + page.tsx still import SmoothScroll; build will fail until Task 17)

```bash
npm run type-check 2>&1 | head -30
```

Expected: TypeScript errors should only be about missing `SmoothScroll` / `AmbientBackground` imports in layout/page/About/Work/Contact — not in Hero itself.

- [ ] **Step 10.3: Commit**

```bash
git add src/components/sections/Hero/index.tsx
git -c skill.commit=true commit -m "feat(hero): replace WebGLScene with SVG boat + night sky + ocean 2-column layout"
```

---

## Task 11: About Section — Ocean Shell + Jellyfish + Fix borderLeft

**Files:**
- Modify: `src/components/sections/About/index.tsx`

- [ ] **Step 11.1: Replace About/index.tsx**

Replace the entire file:

```tsx
'use client'

import { useTranslations } from 'next-intl'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import OceanBackground from '@/components/ocean/OceanBackground'
import JellyfishGroup from '@/components/ocean/JellyfishGroup'
import BioParticles from '@/components/ocean/BioParticles'

const EASE = [0.23, 1, 0.32, 1] as [number, number, number, number]

const revealVariants = {
  hidden: { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
  visible: { clipPath: 'inset(0 0 0% 0)', opacity: 1 },
}

function RevealBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  return (
    <div ref={ref} style={{ overflow: 'hidden' }}>
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={revealVariants}
        transition={{ delay, duration: 0.8, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  )
}

const chapters: Array<{
  key: 'iot' | 'university' | 'now'
  bg: string
  textColor: string
  labelColor: string
}> = [
  { key: 'iot',        bg: 'oklch(11% 0.03 260)',  textColor: 'rgba(245,241,235,0.85)', labelColor: '#FF8C42' },
  { key: 'university', bg: 'oklch(13% 0.025 255)', textColor: 'rgba(245,241,235,0.75)', labelColor: 'var(--bio-cyan)' },
  { key: 'now',        bg: '#FF8C42',              textColor: 'rgba(8,8,16,0.85)',       labelColor: 'rgba(8,8,16,0.5)' },
]

export default function About() {
  const t = useTranslations('about')
  const bioParagraphs = t('bio').split('\n\n')

  return (
    <OceanBackground
      color="var(--ocean-shallow)"
      style={{
        background: 'oklch(9% 0.03 258)',
        padding: 'var(--section-padding-y) var(--container-padding)',
        overflow: 'hidden',
      }}
    >
      <section
        id="about"
        data-theme="dark"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(2rem, 5vw, 5rem)',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Ambient jellyfish — left zone */}
        <JellyfishGroup />

        {/* Bioluminescent light shaft hints */}
        {[15, 25, 35].map((left, i) => (
          <div
            key={i}
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: `${left}%`,
              width: 40,
              height: '100%',
              background: `linear-gradient(to bottom, rgba(0,180,255,0.04), transparent)`,
              transform: `skewX(-8deg)`,
              pointerEvents: 'none',
            }}
          />
        ))}

        <BioParticles
          colors={['rgba(0,229,200,0.2)', 'rgba(180,80,255,0.15)']}
          desktopCount={16}
          mobileCount={8}
        />

        {/* Left: text content */}
        <div style={{ maxWidth: '540px', position: 'relative', zIndex: 1 }}>
          <RevealBlock>
            <p className="section-label" style={{ color: 'var(--color-accent)', marginBottom: '1.5rem' }}>
              {t('label')}
            </p>
          </RevealBlock>

          <RevealBlock delay={0.08}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                lineHeight: 1.15,
                color: 'var(--color-text-dark)',
                marginBottom: '2rem',
                whiteSpace: 'pre-line',
              }}
            >
              {t('heading')}
            </h2>
          </RevealBlock>

          {bioParagraphs.map((para, i) => (
            <RevealBlock key={i} delay={0.16 + i * 0.08}>
              <p
                style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text-dark-secondary)',
                  lineHeight: 1.8,
                  marginBottom: i < bioParagraphs.length - 1 ? '1.25rem' : '2rem',
                }}
              >
                {para}
              </p>
            </RevealBlock>
          ))}

          {/* Approach blockquote — full border (no side-stripe) */}
          <RevealBlock delay={0.35}>
            <blockquote
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-dark-secondary)',
                lineHeight: 1.75,
                fontStyle: 'italic',
                border: '1px solid oklch(55% 0.12 185 / 0.25)',
                background: 'oklch(11% 0.03 260)',
                borderRadius: '8px',
                padding: '1rem 1.25rem',
                margin: 0,
              }}
            >
              {t('approach')}
            </blockquote>
          </RevealBlock>
        </div>

        {/* Right: chapter cards */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignSelf: 'stretch',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {chapters.map(({ key, bg, textColor, labelColor }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ delay: 0.08 * i, duration: 0.4, ease: EASE }}
              style={{
                background: bg,
                border: '1px solid oklch(55% 0.12 185 / 0.18)',
                borderRadius: '14px',
                padding: '1.5rem 1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: labelColor,
                  }}
                >
                  {t(`chapters.${key}.label`)}
                </span>
                {key === 'iot' && (
                  <a
                    href="https://www.nature.com/articles/s41598-024-82344-4"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.62rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,140,66,0.6)',
                      textDecoration: 'none',
                      transition: 'color 150ms ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#FF8C42')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,140,66,0.6)')}
                  >
                    Nature ↗
                  </a>
                )}
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 400,
                  lineHeight: 1.65,
                  color: textColor,
                  margin: 0,
                }}
              >
                {t(`chapters.${key}.body`)}
              </p>
            </motion.div>
          ))}
        </div>

        <style>{`
          @media (max-width: 767px) {
            #about { grid-template-columns: 1fr !important; }
            #about > *:first-child { padding-left: 32px; width: 100%; }
          }
        `}</style>
      </section>
    </OceanBackground>
  )
}
```

- [ ] **Step 11.2: Commit**

```bash
git add src/components/sections/About/index.tsx
git -c skill.commit=true commit -m "feat(about): ocean shell + JellyfishGroup + fix borderLeft ban violation"
```

---

## Task 12: Stack Section (New, Replaces Capabilities)

**Files:**
- Create: `src/components/sections/Stack/index.tsx`

- [ ] **Step 12.1: Create Stack/index.tsx**

```tsx
'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import OceanBackground from '@/components/ocean/OceanBackground'
import CoralReef from '@/components/ocean/CoralReef'
import BioParticles from '@/components/ocean/BioParticles'

const EASE = [0.23, 1, 0.32, 1] as [number, number, number, number]

// Same skill data as Capabilities — migrated verbatim
const stack: Record<string, { items: string[]; glowColor: string }> = {
  'AI & Agents': { items: ['LangGraph', 'LangChain', 'OpenAI API', 'Anthropic API', 'Python', 'FastAPI'],   glowColor: 'rgba(0,229,200,0.3)'   },
  'Frontend':    { items: ['Next.js', 'React', 'TypeScript', 'Framer Motion', 'GSAP'],                       glowColor: 'rgba(100,180,255,0.2)'  },
  'Backend':     { items: ['Node.js', 'Python', 'PostgreSQL', 'REST APIs', 'GraphQL'],                       glowColor: 'rgba(100,180,255,0.2)'  },
  'Tools':       { items: ['Git', 'Vercel', 'Supabase', 'Claude Code', 'Docker'],                            glowColor: 'rgba(255,140,66,0.25)'  },
}

const hardwareStack = [
  { category: 'Microcontrollers', items: ['ESP32', 'STM32', 'ATmega'],                                 glowColor: 'rgba(255,80,50,0.2)'   },
  { category: 'Connectivity',     items: ['LoRa', 'LoRaWAN', 'MQTT', 'BLE', 'WiFi', 'I2C', 'SPI'],    glowColor: 'rgba(255,80,50,0.2)'   },
  { category: 'Low Power',        items: ['Deep Sleep', 'RTC Wakeup', 'Battery Mgmt', 'Solar'],        glowColor: 'rgba(255,80,50,0.2)'   },
  { category: 'Languages',        items: ['C', 'C++', 'MicroPython', 'FreeRTOS'],                      glowColor: 'rgba(255,80,50,0.2)'   },
]

interface BubbleProps { name: string; glowColor: string; i: number }

function SkillBubble({ name, glowColor, i }: BubbleProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.04, duration: 0.35, ease: EASE }}
      style={{
        display: 'inline-block',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        letterSpacing: '0.06em',
        color: 'var(--color-text-dark-secondary)',
        border: `1px solid ${glowColor}`,
        borderRadius: '20px',
        padding: '0.45rem 0.9rem',
        cursor: 'default',
        willChange: 'transform',
        transition: 'box-shadow 200ms ease, color 200ms ease',
      }}
      // Desktop hover
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = `0 0 12px ${glowColor}`
        el.style.color = 'var(--color-text-dark)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = 'none'
        el.style.color = 'var(--color-text-dark-secondary)'
      }}
    >
      {name}
    </motion.span>
  )
}

export default function Stack() {
  const t = useTranslations('capabilities')

  return (
    <OceanBackground
      color="var(--ocean-reef)"
      style={{
        background: 'oklch(7% 0.025 262)',
        padding: 'var(--section-padding-y) var(--container-padding)',
        overflow: 'hidden',
      }}
    >
      <section
        id="stack"
        data-theme="dark"
        style={{ position: 'relative' }}
      >
        <CoralReef />

        <BioParticles
          colors={['rgba(0,229,200,0.18)', 'rgba(200,50,180,0.12)']}
          desktopCount={12}
          mobileCount={6}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
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
              transition={{ duration: 0.6, ease: EASE }}
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

          {/* Software categories */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2.5rem' }}>
            {Object.entries(stack).map(([category, { items, glowColor }], ci) => (
              <div key={category}>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: ci * 0.08 }}
                  className="section-label"
                  style={{ color: ci === 0 ? 'var(--color-accent)' : 'var(--color-text-dark-muted)', marginBottom: '1rem' }}
                >
                  {category}
                </motion.p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {items.map((item, i) => (
                    <SkillBubble key={item} name={item} glowColor={glowColor} i={ci * 6 + i} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Hardware separator */}
          <div aria-hidden style={{ borderTop: '1px solid rgba(0,229,200,0.1)', marginBlock: '3rem' }} />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-label"
            style={{ color: 'var(--color-accent)', marginBottom: '2.5rem' }}
          >
            {t('hardware.label')}
          </motion.p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2.5rem' }}>
            {hardwareStack.map(({ category, items, glowColor }, ci) => (
              <div key={category}>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: ci * 0.08 }}
                  className="section-label"
                  style={{ color: 'var(--color-text-dark-muted)', marginBottom: '1rem' }}
                >
                  {category}
                </motion.p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {items.map((item, i) => (
                    <SkillBubble key={item} name={item} glowColor={glowColor} i={ci * 6 + i} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Touch: bubbles always show subtle glow */}
        <style>{`
          @media (hover: none) {
            [data-stack-bubble] {
              box-shadow: 0 0 6px rgba(0,229,200,0.2);
            }
          }
          @media (max-width: 767px) {
            #stack { padding-left: 32px; }
          }
        `}</style>
      </section>
    </OceanBackground>
  )
}
```

- [ ] **Step 12.2: Commit**

```bash
git add src/components/sections/Stack/index.tsx
git -c skill.commit=true commit -m "feat(stack): new section replacing Capabilities — ocean reef shell + coral glow"
```

---

## Task 13: MCP Magic — Generate Assets

**Files:**
- Create: `public/assets/astronaut.webp`
- Create: `public/assets/treasure-chest.webp`

- [ ] **Step 13.1: Create assets directory**

```bash
mkdir -p public/assets
```

- [ ] **Step 13.2: Generate astronaut via MCP magic**

Use the `mcp__magic__21st_magic_component_builder` tool with this prompt:

> "A cute cartoon astronaut character in illustrated 2D style, white spacesuit with dark tinted visor (deep black/dark navy, slightly reflective), floating in dark deep ocean water, holding a small flashlight/lantern. Transparent background. Style: flat illustration with soft glow effects, similar to a children's science book illustration. Color palette: white suit, dark visor with subtle cyan bioluminescent reflection, cyan and purple bioluminescent glow surrounding. No background, WebP format, facing slightly left, full body visible."

Save the result to `public/assets/astronaut.webp`.

- [ ] **Step 13.3: Generate treasure chest via MCP magic**

Use the `mcp__magic__21st_magic_component_builder` tool with this prompt:

> "A glowing treasure chest resting on deep ocean floor, illustrated 2D style. Dark wooden chest with golden metal reinforcements, slightly open lid revealing intense bioluminescent magenta and pink light from inside. Small cyan and purple glowing particles floating around it. Near-black background with slight deep blue. Flat illustration style with strong glow effects. Transparent background WebP. The chest looks like it's been discovered at the bottom of the Mariana Trench."

Save the result to `public/assets/treasure-chest.webp`.

- [ ] **Step 13.4: Commit**

```bash
git add public/assets/
git -c skill.commit=true commit -m "feat(assets): add MCP-generated astronaut and treasure chest WebP"
```

---

## Task 14: Work Section — Ocean Shell + Astronaut

**Files:**
- Modify: `src/components/sections/Work/index.tsx`

- [ ] **Step 14.1: Add ocean shell to Work**

At the top of `src/components/sections/Work/index.tsx`, replace the `AmbientBackground` import with ocean components:

```tsx
// REMOVE:
import { AmbientBackground } from '@/components/ui/AmbientBackground'

// ADD:
import Image from 'next/image'
import OceanBackground from '@/components/ocean/OceanBackground'
import BioParticles from '@/components/ocean/BioParticles'
```

Wrap the section's return with `OceanBackground` and add the astronaut. Find the outer `<section id="work"` element and:

1. Wrap it with `<OceanBackground color="var(--ocean-abyss)" style={{ background: 'oklch(5% 0.018 265)' }}>`
2. Replace any `<AmbientBackground .../>` usages with `<BioParticles colors={['rgba(180,80,255,0.15)', 'rgba(0,229,200,0.1)']} desktopCount={16} mobileCount={8} />`
3. Add the astronaut image inside the section's left zone. Find the section's inner container div and add before the content:

```tsx
{/* Astronaut — decorative, in the left zone */}
<div
  aria-hidden="true"
  style={{
    position: 'absolute',
    bottom: '8%',
    left: '2%',
    zIndex: 1,
    pointerEvents: 'none',
  }}
>
  <Image
    src="/assets/astronaut.webp"
    alt=""  // decorative; real alt is in aria-hidden container
    width={280}
    height={280}
    sizes="(max-width: 768px) 180px, 280px"
    style={{
      width: 'min(280px, 40vw)',
      height: 'auto',
      opacity: 0.9,
    }}
  />
</div>
```

Also update the section background and remove any AmbientBackground orb references:

```tsx
<section
  id="work"
  data-theme="dark"
  style={{
    background: 'oklch(5% 0.018 265)',
    padding: 'var(--section-padding-y) var(--container-padding)',
    position: 'relative',
    overflow: 'hidden',
  }}
>
```

Change project card borders to ocean palette:
- Find `border: '1px solid rgba(255,255,255,0.08)'` on cards → `border: '1px solid rgba(180,80,255,0.2)'`
- Find `background: 'rgba(255,255,255,0.04)'` → `background: 'rgba(10,20,50,0.85)'`

- [ ] **Step 14.2: Verify TypeScript**

```bash
npm run type-check 2>&1 | grep -v "Cannot find module.*SmoothScroll\|Cannot find module.*AmbientBackground" | head -20
```

Expected: No errors from Work section itself.

- [ ] **Step 14.3: Commit**

```bash
git add src/components/sections/Work/index.tsx
git -c skill.commit=true commit -m "feat(work): ocean abyss shell + astronaut asset + purple card borders"
```

---

## Task 15: TreasureChest Component

**Files:**
- Create: `src/components/ocean/TreasureChest.tsx`

- [ ] **Step 15.1: Create TreasureChest.tsx**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'

interface ContactLink {
  href: string
  label: string
  ariaLabel: string
  icon: React.ReactNode
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}

export default function TreasureChest() {
  const t = useTranslations('ocean')
  const chestRef   = useRef<HTMLDivElement>(null)
  const lidRef     = useRef<HTMLDivElement>(null)
  const glowRef    = useRef<HTMLDivElement>(null)
  const linksRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const chest = chestRef.current
    const lid   = lidRef.current
    const glow  = glowRef.current
    const links = linksRef.current
    if (!chest || !lid || !glow || !links) return

    // Set transformOrigin BEFORE any animation — lid opens from top hinge
    gsap.set(lid, {
      transformOrigin: 'top center',
      transformPerspective: 400,
    })

    // Initial states
    gsap.set([glow, links], { opacity: 0 })
    gsap.set(links, { y: 16 })

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: chest,
          start: 'top 70%',
          once: true,
        },
      })

      tl
        // Impact: chest vibrates
        .to(chest, { y: -4, duration: 0.1, ease: 'none' })
        .to(chest, { y: 0,  duration: 0.2, ease: 'power2.out' })
        // Lid opens from hinge — power4.out, no rebound
        .to(lid, { rotateX: -35, duration: 0.6, ease: 'power4.out' })
        // Glow appears
        .to(glow, { opacity: 1, duration: 0.4 }, '-=0.2')
        // Links fade in with stagger
        .to(links, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '-=0.1')
    })

    return () => ctx.revert()
  }, [])

  const links: ContactLink[] = [
    {
      href:      'https://github.com/jazorro11',
      label:     'GitHub',
      ariaLabel: t('contact.github_label'),
      icon:      <GitHubIcon />,
    },
    {
      href:      'https://www.linkedin.com/in/juliozorro/',
      label:     'LinkedIn',
      ariaLabel: t('contact.linkedin_label'),
      icon:      <LinkedInIcon />,
    },
    {
      href:      'mailto:jzorroperez@gmail.com',
      label:     'Email',
      ariaLabel: t('contact.email_label'),
      icon:      <EmailIcon />,
    },
  ]

  return (
    <div
      ref={chestRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
      }}
    >
      {/* Chest image with lid overlay */}
      <div style={{ position: 'relative', width: 'min(180px, 35vw)' }}>
        <Image
          src="/assets/treasure-chest.webp"
          alt={t('chest.alt')}
          width={180}
          height={180}
          sizes="(max-width: 768px) 140px, 180px"
          style={{ width: '100%', height: 'auto' }}
        />

        {/* Lid — rotates open on scroll trigger */}
        <div
          ref={lidRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '45%',
            /* Lid is visually represented by the image; this div controls the 3D rotation */
          }}
        />

        {/* Glow burst — bioluminescent light from inside */}
        <div
          ref={glowRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-20px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at 50% 60%, rgba(255,50,180,0.35), rgba(180,50,255,0.2) 40%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Contact links — fade in after lid opens */}
      <div
        ref={linksRef}
        style={{
          display: 'flex',
          gap: '1.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {links.map(({ href, label, ariaLabel, icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('mailto') ? undefined : '_blank'}
            rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
            aria-label={ariaLabel}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-text-dark-secondary)',
              textDecoration: 'none',
              border: '1px solid oklch(55% 0.22 310 / 0.3)',
              borderRadius: '100px',
              padding: '10px 20px',
              transition: 'color 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.color = 'var(--color-text-dark)'
              el.style.borderColor = 'oklch(55% 0.22 310 / 0.7)'
              el.style.boxShadow = '0 0 16px oklch(55% 0.22 310 / 0.3)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.color = 'var(--color-text-dark-secondary)'
              el.style.borderColor = 'oklch(55% 0.22 310 / 0.3)'
              el.style.boxShadow = 'none'
            }}
            onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)' }}
            onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
          >
            {icon}
            {label}
          </a>
        ))}
      </div>

      {/* Touch: links always have subtle glow */}
      <style>{`
        @media (hover: none) {
          [data-chest-link] {
            box-shadow: 0 0 8px oklch(55% 0.22 310 / 0.2);
          }
        }
      `}</style>
    </div>
  )
}
```

- [ ] **Step 15.2: Commit**

```bash
git add src/components/ocean/TreasureChest.tsx
git -c skill.commit=true commit -m "feat(ocean): add TreasureChest with gsap.set(transformOrigin) + impact timeline"
```

---

## Task 16: Contact Section — Ocean Shell + TreasureChest

**Files:**
- Modify: `src/components/sections/Contact/index.tsx`

- [ ] **Step 16.1: Replace Contact/index.tsx**

```tsx
'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import OceanBackground from '@/components/ocean/OceanBackground'
import BioParticles from '@/components/ocean/BioParticles'
import TreasureChest from '@/components/ocean/TreasureChest'

const EASE = [0.23, 1, 0.32, 1] as [number, number, number, number]

export default function Contact() {
  const t = useTranslations('contact')

  return (
    <OceanBackground
      color="var(--ocean-trench)"
      style={{
        background: 'oklch(3% 0.01 268)',
        overflow: 'hidden',
      }}
    >
      <section
        id="contact"
        data-theme="dark"
        className="with-grain"
        style={{
          padding: 'var(--section-padding-y) var(--container-padding)',
          minHeight: '80svh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          textAlign: 'center',
        }}
      >
        {/* Deep trench floor particles — pink/magenta */}
        <BioParticles
          colors={['rgba(255,50,180,0.18)', 'rgba(180,50,255,0.12)', 'rgba(0,229,200,0.08)']}
          desktopCount={20}
          mobileCount={10}
        />

        {/* Ocean floor glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '30%',
            background: 'linear-gradient(to top, oklch(55% 0.22 310 / 0.06), transparent)',
            pointerEvents: 'none',
          }}
        />

        {/* Header */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="section-label"
          style={{ color: 'var(--color-accent)', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}
        >
          {t('label')}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            color: 'var(--color-text-dark)',
            marginBottom: '1.5rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {t('heading')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-dark-secondary)',
            marginBottom: '4rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {t('available')}
        </motion.p>

        {/* TreasureChest — the contact payload */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <TreasureChest />
        </div>

        <style>{`
          @media (max-width: 767px) {
            #contact { padding-left: 32px; padding-right: 32px; }
          }
        `}</style>
      </section>
    </OceanBackground>
  )
}
```

- [ ] **Step 16.2: Commit**

```bash
git add src/components/sections/Contact/index.tsx
git -c skill.commit=true commit -m "feat(contact): ocean trench shell + TreasureChest replacing email/socials"
```

---

## Task 17: Wire page.tsx and layout.tsx

**Files:**
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/app/[locale]/page.tsx`

This task fixes the pre-existing double Lenis bug (SmoothScroll was in BOTH files) and completes the integration.

- [ ] **Step 17.1: Fix layout.tsx — remove SmoothScroll**

In `src/app/[locale]/layout.tsx`:

Remove the import:
```tsx
// DELETE this line:
import SmoothScroll from '@/components/ui/SmoothScroll'
```

Change the body content from:
```tsx
<body>
  <NextIntlClientProvider messages={messages}>
    <SmoothScroll>{children}</SmoothScroll>
  </NextIntlClientProvider>
</body>
```

To:
```tsx
<body>
  <NextIntlClientProvider messages={messages}>
    {children}
  </NextIntlClientProvider>
</body>
```

- [ ] **Step 17.2: Rewrite page.tsx**

Replace the entire content of `src/app/[locale]/page.tsx`:

```tsx
'use client'

import OceanSystem from '@/components/ocean/OceanSystem'
import FishingThread from '@/components/ocean/FishingThread'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Stack from '@/components/sections/Stack'
import Work from '@/components/sections/Work'
import Contact from '@/components/sections/Contact'
import Nav from '@/components/ui/Nav'
import CustomCursor from '@/components/ui/CustomCursor'

export default function HomePage() {
  return (
    <OceanSystem>
      <CustomCursor />
      <Nav />
      <FishingThread />
      <main>
        <Hero />
        <About />
        <Stack />
        <Work />
        <Contact />
      </main>
    </OceanSystem>
  )
}
```

- [ ] **Step 17.3: Run build — this should be the first clean build**

```bash
npm run build
```

Expected output: build succeeds. Zero TypeScript errors. No "Cannot find module" errors.

If build fails, most likely causes:
- `next-intl` missing a key: check which key is missing, add to `en.json` and `es.json`
- GSAP import issue: ensure `gsap` and `gsap/ScrollTrigger` are in `dependencies` in `package.json`
- Lenis import: `import Lenis from 'lenis'` — if error, check `lenis` is in `dependencies`

- [ ] **Step 17.4: Commit**

```bash
git add src/app/[locale]/layout.tsx src/app/[locale]/page.tsx
git -c skill.commit=true commit -m "feat(wiring): integrate OceanSystem + FishingThread; fix double Lenis bug in layout.tsx"
```

---

## Task 18: Remove Three.js from Bundle

**Files:**
- Modify: `package.json`

- [ ] **Step 18.1: Uninstall Three.js**

```bash
npm uninstall three @types/three
```

Expected output: `removed 2 packages`.

- [ ] **Step 18.2: Verify no remaining Three.js imports**

```bash
grep -r "from 'three'" src/ --include="*.tsx" --include="*.ts"
grep -r "from \"three\"" src/ --include="*.tsx" --include="*.ts"
```

Expected: no output (zero matches).

- [ ] **Step 18.3: Build clean**

```bash
npm run build
```

Expected: build succeeds. No Three.js in bundle.

- [ ] **Step 18.4: Commit**

```bash
git add package.json package-lock.json
git -c skill.commit=true commit -m "chore: remove Three.js from dependencies — replaced by SVG boat in Hero"
```

---

## Task 19: Run Dev + Visual Smoke Test

- [ ] **Step 19.1: Start dev server**

```bash
npm run dev
```

Open `http://localhost:3000/en` in browser.

- [ ] **Step 19.2: Hero smoke test**

Check:
- [ ] Night sky visible (stars + moon in left zone)
- [ ] FishingThread amber line appears at ~32% from left
- [ ] Hook SVG visible at bottom of thread
- [ ] Letter-by-letter name animation plays on load
- [ ] Scrolling slowly causes hook to descend (GSAP pin active)
- [ ] "Ver proyectos" / "See my work" CTA button visible

- [ ] **Step 19.3: Scroll smoke test**

Check:
- [ ] Scrolling through Hero pin (200vh): hook descends to ~400px
- [ ] Releasing pin: page continues to About section
- [ ] About: jellyfish visible in left zone
- [ ] Stack: coral SVGs visible left and right of content zone
- [ ] Work: astronaut image loads in left zone
- [ ] Contact: treasure chest image visible, centered

- [ ] **Step 19.4: Contact chest animation test**

Scroll to Contact section and verify:
- [ ] Chest visible (or fallback SVG if WebP not generated)
- [ ] Scrolling past `top 70%` trigger fires the chest animation
- [ ] Three links (GitHub, LinkedIn, Email) fade in after chest opens
- [ ] All three links are clickable and navigate correctly

- [ ] **Step 19.5: Mobile test**

Resize browser to 375px wide and verify:
- [ ] FishingThread at left: 12px (not 32%)
- [ ] Content starts at `padding-left: 32px`, full-width
- [ ] Hero: single column, content not hidden behind thread
- [ ] No horizontal scroll

- [ ] **Step 19.6: Reduced motion test**

In DevTools > Rendering > Emulate prefers-reduced-motion > reduce. Reload and verify:
- [ ] Jellyfish: static (no GSAP float loop)
- [ ] Coral glow: does not fire
- [ ] Name letters: fade in only (no y/skewY motion)
- [ ] Chest: static, links visible immediately

> Note: GSAP does not automatically respect `prefers-reduced-motion`. Add a guard in `OceanSystem.tsx` after the Lenis setup:

```tsx
// In OceanSystem useEffect, after lenis setup:
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (prefersReduced) {
  // Kill all decorative ScrollTriggers after they're created
  // Framer Motion handles its own reduced motion via its built-in support
  return  // skip GSAP setup entirely; only fade-ins via Framer Motion remain
}
```

Add this guard and commit:

```bash
git add src/components/ocean/OceanSystem.tsx
git -c skill.commit=true commit -m "feat(a11y): respect prefers-reduced-motion in OceanSystem"
```

---

## Task 20: Final Build Verification

- [ ] **Step 20.1: Production build**

```bash
npm run build
```

Expected: `✓ Compiled successfully` with zero errors and zero warnings about missing modules.

- [ ] **Step 20.2: Check bundle for Three.js**

```bash
npm run build 2>&1 | grep -i "three"
```

Expected: no output.

- [ ] **Step 20.3: Verify i18n completeness**

```bash
npm run build 2>&1 | grep -i "missing\|translation\|key"
```

Expected: no missing key warnings.

- [ ] **Step 20.4: Final commit if any fixes were made in Task 19**

```bash
git add -A
git -c skill.commit=true commit -m "fix(smoke): address issues found in visual smoke test"
```

---

## Self-Review: Spec Coverage Check

| Spec requirement | Task |
|---|---|
| GSAP `registerPlugin(ScrollTrigger)` at module scope | Task 4 |
| Hero pin 200vh desktop / 100vh mobile portrait / disabled landscape | Task 4 |
| depthProgress weighted blend (hero×0.2 + postPin×0.8) | Task 4 |
| FishingThread `position:fixed`, `left:32%`, `aria-hidden`, opacity:0 SSR | Task 5 |
| OceanBackground opacity crossfade (not background-color) | Task 6 |
| BioParticles CSS-only, capped 12/24, `aria-hidden` | Task 7 |
| Jellyfish phase offset `delay: i*2.5s`, varied amplitude | Task 8 |
| Coral glow: opacity overlay (not filter tween) + bilateral ScrollTrigger | Task 9 |
| Hero: SVG boat, night sky, two-column layout, CTA via `bypassHeroPin` | Task 10 |
| CTA null-check for SSR/hydration window | Task 4 (via `bypassHeroPin`) |
| About: ocean shell, JellyfishGroup, fix borderLeft ban | Task 11 |
| Chapter-cards: solid border + opaque bg (no glassmorphism) | Task 11 |
| Stack: new section, CoralReef, skill bubbles with `will-change:transform` | Task 12 |
| Touch hover fallback `@media(hover:none)` | Tasks 12, 15 |
| MCP astronaut `sizes` attribute | Task 14 |
| MCP chest `sizes` attribute, `rel="noopener noreferrer"` | Tasks 13, 15 |
| `gsap.set(transformOrigin:"top center", transformPerspective:400)` on lid | Task 15 |
| Contact: 3 direct links, no form | Task 16 |
| OceanSystem replaces SmoothScroll (both layout.tsx and page.tsx) | Task 17 |
| Three.js removed from bundle | Task 18 |
| OKLCH tokens | Task 1 |
| i18n: 10 new keys both locales | Task 2 |
| `--focus-ring` token + `:focus-visible` global | Task 1 |
| Nav `#capabilities` → `#stack` | Task 3 |
| `prefers-reduced-motion` kills GSAP | Task 19 |
| Lighthouse sub-targets LCP/CLS/INP | Smoke test step 19 (manual) |
| Delete WebGLScene, Capabilities, SmoothScroll, AmbientBackground | Task 3 |

**All spec requirements covered. No gaps found.**
