# Spec: Ambient Animations — CSS Orbs + Framer Motion

**Date:** 2026-05-23
**Status:** Approved
**Scope:** 4 sections (About, Work, Capabilities, Contact) + shared component

---

## Context

The Hero section already features a WebGL particle field (Three.js, ~1200 particles) plus Framer Motion character-stagger text animations. The rest of the portfolio feels comparatively static. The goal is to bring an "immersive and alive" feel to all remaining sections without adding additional WebGL contexts, which would dilute the Hero's impact and increase GPU load on mobile.

**Decision:** CSS radial gradient orbs animated with Framer Motion + micro floating particles (divs) for dark sections. No new dependencies.

---

## Shared Component: `AmbientBackground`

**File:** `src/components/ui/AmbientBackground/index.tsx`

### Props

```ts
interface OrbConfig {
  size: number           // diameter in px
  color: string          // CSS color (rgba)
  blurPx: number         // filter: blur(Xpx)
  top?: string           // CSS top value
  bottom?: string
  left?: string
  right?: string
  animateTo: {           // Framer Motion animate target
    x: number
    y: number
    scale: number
  }
  duration: number       // loop duration in seconds
}

interface ParticleConfig {
  count: number          // number of floating dots
  colors: string[]       // dot colors (rgba)
}

interface AmbientBackgroundProps {
  orbs: OrbConfig[]
  particles?: ParticleConfig
  className?: string
}
```

### Behavior

- Renders `position: absolute; inset: 0; overflow: hidden; pointer-events: none; aria-hidden="true"` container
- Each orb: `motion.div` with `animate` loop (`repeat: Infinity`, `repeatType: 'mirror'`, `ease: 'easeInOut'`)
- Particles (optional): N `motion.div` 3×3px dots with randomized float paths and staggered delays
- Respects `prefers-reduced-motion`: if `window.matchMedia('(prefers-reduced-motion: reduce)').matches`, renders static (no animation)
- The parent section must have `position: relative` (all sections already do)

### Animation pattern for orbs

```tsx
<motion.div
  animate={{ x: orb.animateTo.x, y: orb.animateTo.y, scale: orb.animateTo.scale }}
  transition={{ duration: orb.duration, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
  style={{
    position: 'absolute',
    width: orb.size, height: orb.size,
    borderRadius: '50%',
    background: orb.color,
    filter: `blur(${orb.blurPx}px)`,
    top: orb.top, bottom: orb.bottom, left: orb.left, right: orb.right,
    willChange: 'transform',
  }}
/>
```

---

## Section Configurations

### Capabilities (Dark — `#0a0a1a`)

The section already has a `radial-gradient` blue tint at top-right. The ambient layer complements it.

| Element | Config |
|---------|--------|
| Orb 1 | Amber `rgba(255,140,66,0.25)`, 200px, blur 40px, top-right, animateTo `{x:12,y:-16,scale:1.08}`, 6s |
| Orb 2 | Blue `rgba(59,130,246,0.20)`, 160px, blur 45px, bottom-left, animateTo `{x:-10,y:12,scale:0.92}`, 7s |
| Particles | 4 dots: 2 amber `rgba(255,140,66,0.7)` + 2 blue `rgba(59,130,246,0.7)` |

### Contact (Dark — `#080810`)

More prominent than Capabilities — it's the CTA section. The large centered amber orb creates a halo effect over the heading.

| Element | Config |
|---------|--------|
| Orb 1 | Amber `rgba(255,140,66,0.30)`, 280px, blur 50px, `top: '-80px', left: 'calc(50% - 140px)'` (centered — use calc to avoid transform conflict with Framer Motion), animateTo `{x:8,y:-12,scale:1.06}`, 5s |
| Orb 2 | Blue `rgba(59,130,246,0.18)`, 120px, blur 35px, bottom-left, animateTo `{x:-8,y:10,scale:0.9}`, 8s |
| Particles | 3 dots: 2 amber + 1 blue |

### About (Light — `#F5F1EB`)

No micro-particles on light background. Higher blur for softness. Orbs use warm, low-opacity tones.

| Element | Config |
|---------|--------|
| Orb 1 | Amber `rgba(255,140,66,0.12)`, 220px, blur 60px, top-left, animateTo `{x:10,y:-14,scale:1.05}`, 7s |
| Orb 2 | Warm `rgba(160,120,80,0.10)`, 180px, blur 55px, bottom-right, animateTo `{x:-8,y:10,scale:0.93}`, 9s |
| Particles | none |

### Work (Light — `#F5F1EB`)

The hero project card already has `radial-gradient(circle at 80% 50%, rgba(255,140,66,0.08), transparent)`. The section-level orb complements without doubling up.

| Element | Config |
|---------|--------|
| Orb 1 | Amber `rgba(255,140,66,0.10)`, 200px, blur 60px, top-right, animateTo `{x:10,y:-10,scale:1.04}`, 6s |
| Orb 2 | Warm `rgba(160,120,80,0.08)`, 150px, blur 50px, bottom-left, animateTo `{x:-6,y:8,scale:0.94}`, 8s |
| Particles | none |

---

## File Changes

| File | Change |
|------|--------|
| `src/components/ui/AmbientBackground/index.tsx` | **Create** — shared component |
| `src/components/sections/Capabilities/index.tsx` | Add `<AmbientBackground>` as first child |
| `src/components/sections/Contact/index.tsx` | Add `<AmbientBackground>` as first child |
| `src/components/sections/About/index.tsx` | Add `<AmbientBackground>` as first child |
| `src/components/sections/Work/index.tsx` | Add `<AmbientBackground>` as first child |

No new dependencies. No changes to `package.json`.

---

## Accessibility & Performance

- `aria-hidden="true"` + `pointer-events: none` on the root container — pure decorative
- `will-change: transform` only on animating orbs
- `prefers-reduced-motion`: detect via `useReducedMotion()` hook from Framer Motion (already available), skip animation if true
- All animations use only `transform` and `opacity` — no layout recalc

---

## Verification

1. Run `npm run dev` and open the portfolio locally
2. Scroll through each section — verify ambient orbs are visible and animating
3. Resize to mobile (375px) — verify orbs don't overflow or create scrollbars (`overflow: hidden` on container)
4. Open DevTools → Performance tab → record scroll — verify no layout/paint during animations (only composite)
5. In DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce" → verify all orbs render static
6. Verify no regression in existing Hero WebGL animation
