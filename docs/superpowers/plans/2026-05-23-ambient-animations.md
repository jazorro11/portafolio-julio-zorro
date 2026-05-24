# Ambient Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add CSS gradient orb ambient backgrounds + floating micro-particle dots to About, Work, Capabilities, and Contact sections — purely decorative, zero content changes.

**Architecture:** A single shared `AmbientBackground` component renders absolutely-positioned gradient orbs (Framer Motion loop animations) and optional floating micro-particle dots. It is inserted as the first child of each `<section>` element. All sections already have `position: relative` from `globals.css`, so no layout changes are needed. Content layers keep their existing `position: relative; zIndex: 1` and are unaffected.

**Tech Stack:** React 19, Framer Motion 12 (`motion.div`, `useReducedMotion`), TypeScript, Next.js App Router. No new dependencies.

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Create | `src/components/ui/AmbientBackground/index.tsx` | Shared animated background layer |
| Modify | `src/components/sections/Capabilities/index.tsx` | Add `<AmbientBackground>` after existing glow div |
| Modify | `src/components/sections/Contact/index.tsx` | Add `<AmbientBackground>` after existing glow div |
| Modify | `src/components/sections/About/index.tsx` | Add `<AmbientBackground>` as first child |
| Modify | `src/components/sections/Work/index.tsx` | Add `<AmbientBackground>` as first child |

---

## Task 1: Create `AmbientBackground` component

**Files:**
- Create: `src/components/ui/AmbientBackground/index.tsx`

- [ ] **Step 1: Create the file with the full implementation**

```tsx
// src/components/ui/AmbientBackground/index.tsx
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run from project root:
```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/AmbientBackground/index.tsx
git commit -m "feat(ui): add AmbientBackground component — CSS orbs + Framer Motion particles"
```

---

## Task 2: Capabilities section

**Files:**
- Modify: `src/components/sections/Capabilities/index.tsx`

The section already has a static glow div (`{/* Glow */}`). Insert `<AmbientBackground>` immediately after it, before the `.container` div. The content container already has `position: relative; zIndex: 1` — no changes needed there.

- [ ] **Step 1: Add import**

In `src/components/sections/Capabilities/index.tsx`, add the import after the existing imports:

```tsx
// existing imports (lines 1-4):
'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
```

- [ ] **Step 2: Insert `<AmbientBackground>` after the existing glow div**

Locate this block in the JSX (around line 56):
```tsx
      {/* Glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 50% at 80% 30%, rgba(59,130,246,0.07) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
```

Replace it with:
```tsx
      {/* Glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 50% at 80% 30%, rgba(59,130,246,0.07) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <AmbientBackground
        orbs={[
          {
            size: 200,
            color: 'rgba(255,140,66,0.25)',
            blurPx: 40,
            top: '-30px',
            right: '-20px',
            animateTo: { x: 12, y: -16, scale: 1.08 },
            duration: 6,
          },
          {
            size: 160,
            color: 'rgba(59,130,246,0.20)',
            blurPx: 45,
            bottom: '-20px',
            left: '-10px',
            animateTo: { x: -10, y: 12, scale: 0.92 },
            duration: 7,
          },
        ]}
        particles={{ count: 4, colors: ['rgba(255,140,66,0.7)', 'rgba(59,130,246,0.7)'] }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
```

- [ ] **Step 3: Run TypeScript check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Capabilities/index.tsx
git commit -m "feat(capabilities): add ambient background orbs"
```

---

## Task 3: Contact section

**Files:**
- Modify: `src/components/sections/Contact/index.tsx`

Same pattern as Capabilities — insert after the existing glow div.

- [ ] **Step 1: Add import**

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
```

- [ ] **Step 2: Insert `<AmbientBackground>` after the existing glow div**

Locate this block (around line 25):
```tsx
      {/* Glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 30% 60%, rgba(255,140,66,0.07) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
```

Replace with:
```tsx
      {/* Glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 30% 60%, rgba(255,140,66,0.07) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <AmbientBackground
        orbs={[
          {
            size: 280,
            color: 'rgba(255,140,66,0.30)',
            blurPx: 50,
            top: '-80px',
            left: 'calc(50% - 140px)',
            animateTo: { x: 8, y: -12, scale: 1.06 },
            duration: 5,
          },
          {
            size: 120,
            color: 'rgba(59,130,246,0.18)',
            blurPx: 35,
            bottom: '-10px',
            left: '10px',
            animateTo: { x: -8, y: 10, scale: 0.9 },
            duration: 8,
          },
        ]}
        particles={{ count: 3, colors: ['rgba(255,140,66,0.7)', 'rgba(59,130,246,0.7)'] }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
```

- [ ] **Step 3: Run TypeScript check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Contact/index.tsx
git commit -m "feat(contact): add ambient background orbs with centered halo"
```

---

## Task 4: About section

**Files:**
- Modify: `src/components/sections/About/index.tsx`

About uses `display: grid` on the `<section>` element. An absolutely positioned child is removed from grid flow — safe to add. No existing glow div. Insert as first child.

- [ ] **Step 1: Add import**

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
```

- [ ] **Step 2: Insert `<AmbientBackground>` as first child of `<section>`**

Locate the opening of the section JSX (around line 51):
```tsx
  return (
    <section
      id="about"
      data-theme="light"
      style={{
        background: 'var(--color-light)',
        padding: 'var(--section-padding-y) var(--container-padding)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(2rem, 5vw, 5rem)',
        alignItems: 'center',
      }}
    >
      {/* Left: text */}
```

Replace with:
```tsx
  return (
    <section
      id="about"
      data-theme="light"
      style={{
        background: 'var(--color-light)',
        padding: 'var(--section-padding-y) var(--container-padding)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(2rem, 5vw, 5rem)',
        alignItems: 'center',
      }}
    >
      <AmbientBackground
        orbs={[
          {
            size: 220,
            color: 'rgba(255,140,66,0.12)',
            blurPx: 60,
            top: '-40px',
            left: '-20px',
            animateTo: { x: 10, y: -14, scale: 1.05 },
            duration: 7,
          },
          {
            size: 180,
            color: 'rgba(160,120,80,0.10)',
            blurPx: 55,
            bottom: '-30px',
            right: '-10px',
            animateTo: { x: -8, y: 10, scale: 0.93 },
            duration: 9,
          },
        ]}
      />

      {/* Left: text */}
```

- [ ] **Step 3: Run TypeScript check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/About/index.tsx
git commit -m "feat(about): add soft warm ambient orbs"
```

---

## Task 5: Work section

**Files:**
- Modify: `src/components/sections/Work/index.tsx`

No existing glow div. Insert as first child of `<section>`.

- [ ] **Step 1: Add import**

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import ChatMockup from './ChatMockup';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
```

- [ ] **Step 2: Insert `<AmbientBackground>` as first child of `<section>`**

Locate (around line 83):
```tsx
  return (
    <section
      id="work"
      data-theme="light"
      style={{
        background: 'var(--color-light)',
        padding: 'var(--section-padding-y) var(--container-padding)',
        minHeight: '100svh',
      }}
    >
      <div className="container">
```

Replace with:
```tsx
  return (
    <section
      id="work"
      data-theme="light"
      style={{
        background: 'var(--color-light)',
        padding: 'var(--section-padding-y) var(--container-padding)',
        minHeight: '100svh',
      }}
    >
      <AmbientBackground
        orbs={[
          {
            size: 200,
            color: 'rgba(255,140,66,0.10)',
            blurPx: 60,
            top: '-30px',
            right: '-10px',
            animateTo: { x: 10, y: -10, scale: 1.04 },
            duration: 6,
          },
          {
            size: 150,
            color: 'rgba(160,120,80,0.08)',
            blurPx: 50,
            bottom: '-20px',
            left: '20px',
            animateTo: { x: -6, y: 8, scale: 0.94 },
            duration: 8,
          },
        ]}
      />

      <div className="container">
```

- [ ] **Step 3: Run TypeScript check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Work/index.tsx
git commit -m "feat(work): add subtle ambient warm orbs"
```

---

## Task 6: Visual verification + PR

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```
Open http://localhost:3000 in browser.

- [ ] **Step 2: Verify each section visually**

Scroll through the entire portfolio and confirm:
- [ ] **Hero**: WebGL particles unchanged — no regression
- [ ] **About**: Soft warm amber glow visible top-left and bottom-right, very subtle on light background
- [ ] **Work**: Faint amber glow top-right, does not compete with the project card's existing amber gradient
- [ ] **Capabilities**: Amber orb top-right + blue orb bottom-left + 4 micro-particles floating. Complements existing blue tint.
- [ ] **Contact**: Large amber halo centered above "Let's build." heading + blue orb bottom-left + 3 micro-particles

- [ ] **Step 3: Check mobile (375px)**

Open DevTools → toggle device toolbar → iPhone SE (375px).
Confirm: no horizontal scroll, orbs don't break layout, `overflow: hidden` on AmbientBackground clips correctly.

- [ ] **Step 4: Check reduced motion**

DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce".
Confirm: all orbs render static (no movement). Content is fully readable.

- [ ] **Step 5: Check no content regression**

Confirm that clicking GitHub and LinkedIn links in Contact still works. Confirm all text content in every section is identical to before.

- [ ] **Step 6: Push and open PR**

```bash
git push origin claude/magical-torvalds-2f631d
gh pr create --title "feat: ambient CSS orb animations across all sections" --body "$(cat <<'EOF'
## Summary
- Adds `AmbientBackground` shared component (CSS gradient orbs + Framer Motion floating particles)
- Applied to About, Work, Capabilities, Contact sections
- Zero content changes — purely decorative layer
- `aria-hidden` + `pointer-events: none` on all ambient elements
- Respects `prefers-reduced-motion`

## Test plan
- [ ] Scroll all sections — verify orbs animate smoothly
- [ ] Mobile 375px — no horizontal scroll or layout break
- [ ] Reduced motion emulation — orbs render static
- [ ] All links and content work as before

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)" --base main
```
