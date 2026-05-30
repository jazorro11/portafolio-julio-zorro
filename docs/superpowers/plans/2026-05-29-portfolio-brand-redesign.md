# Portfolio Brand Identity Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar la identidad visual del portafolio de Julio Zorro para reflejar la marca "naturalista-ingeniero" — precisión al servicio de lo vivo, usando tipografía editorial (Cormorant Garamond), paleta derivada de fotografía personal (sage reemplaza electric blue), composición de eje izquierdo, movimiento orgánico-silencioso (niebla), y la foto de liquen (DSC_0682) como protagonista en About.

**Architecture:** Cada tarea modifica un sistema aislado — tokens primero, luego layout, luego animaciones, luego contenido por sección. Las tareas son independientes entre sí excepto donde se indica dependencia explícita. La foto del liquen se copia una sola vez al directorio `public/` y se usa como Next.js `<Image>`.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Framer Motion 12, Tailwind CSS v4, next/font/google (Cormorant Garamond), CSS custom properties.

**Decisions summary (from design grill):**
- Fuente de voz/display: **Cormorant Garamond** weight 300–400 (ilustración botánica)
- Fuente de sistema/body: **Satoshi** (se mantiene)
- Color secundario: **Sage `#8FA89A`** reemplaza Electric Blue `#3B82F6`
- Layout: **eje vertical izquierdo** `clamp(2rem, 15vw, 16rem)` como anchor
- Animación hero: **niebla** (opacity+blur+scale) reemplaza letter-by-letter split
- Foto protagonista: **DSC_0682.jpg** (liquen fractal) en sección About
- Ambient orbs/partículas: **eliminados**, reemplazados por grain más presente

---

## File Map

| Archivo | Acción | Responsabilidad |
|---------|--------|-----------------|
| `src/styles/tokens.css` | Modificar | Agregar `--font-heading`, `--color-accent-sage`, `--axis-left` token |
| `src/app/[locale]/layout.tsx` | Modificar | Cargar Cormorant Garamond via next/font/google |
| `src/lib/animations.ts` | **Crear** | Variants de Framer Motion: fogReveal, fogRevealStagger, unfurlReveal, growIn |
| `src/components/sections/Hero/index.tsx` | Modificar | Fog reveal, Cormorant, eje izquierdo, sage glow |
| `src/components/sections/About/index.tsx` | Modificar | Foto liquen protagonista, Cormorant heading, fog reveals, remove orbs |
| `src/components/sections/Capabilities/index.tsx` | Modificar | Cormorant heading, fog reveal en heading, sage en hover, remove blue orbs |
| `src/components/sections/Work/index.tsx` | Modificar | Cormorant heading, sage en haz project color, fog reveal |
| `src/components/sections/Contact/index.tsx` | Modificar | Cormorant heading, fog reveal, remove blue orb/particles |
| `public/photos/lichen.jpg` | **Crear** (copiar) | Foto DSC_0682 optimizada para web |

---

## Task 1: Design Tokens Foundation

**Prerequisito:** ninguno  
**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1.1: Agregar tokens de diseño en tokens.css**

Reemplazar el bloque de colores y tipografía en `src/styles/tokens.css`. Cambios exactos:

```css
/* ANTES — línea 19-21 */
  /* Accent 2: Electric Blue — depth / secondary elements */
  --color-accent-2: #3B82F6;
  --color-accent-2-dim: rgba(59, 130, 246, 0.08);

/* DESPUÉS */
  /* Accent 2: Sage / Lichen — natura meets AI, reemplaza Electric Blue */
  --color-accent-2: #8FA89A;
  --color-accent-2-dim: rgba(143, 168, 154, 0.10);
  --color-accent-2-hover: #A3BDB5;
```

```css
/* ANTES — línea 34 */
  --font-display: 'Satoshi', system-ui, -apple-system, sans-serif;

/* DESPUÉS */
  --font-display: 'Satoshi', system-ui, -apple-system, sans-serif;
  --font-heading: var(--font-cormorant), 'Cormorant Garamond', Georgia, serif;
```

```css
/* AGREGAR al final de :root, después de --ease-drawer (línea 67) */
  /* ── Layout axis ── */
  --axis-left: clamp(2rem, 15vw, 16rem);
```

El archivo completo `:root` debe quedar:

```css
/* Design Tokens — Portafolio Julio Zorro
   Palette: Naturalist Engineer
   Dark sections (#080810 + #FF8C42 + #8FA89A): Hero, Capabilities
   Light sections (#F5F1EB): About, Work, Contact */

:root {
  /* ── Colors ── */
  --color-dark: #080810;
  --color-dark-2: #0d0d1f;

  --color-light: #F5F1EB;
  --color-light-2: #EAE4D8;

  /* Accent: Burnt Amber — primary identity color */
  --color-accent: #FF8C42;
  --color-accent-dim: rgba(255, 140, 66, 0.12);
  --color-accent-hover: #FF9F5E;

  /* Accent 2: Sage / Lichen — natura meets AI, reemplaza Electric Blue */
  --color-accent-2: #8FA89A;
  --color-accent-2-dim: rgba(143, 168, 154, 0.10);
  --color-accent-2-hover: #A3BDB5;

  /* Text on dark sections */
  --color-text-dark: #FFFFFF;
  --color-text-dark-secondary: rgba(255, 255, 255, 0.5);
  --color-text-dark-muted: rgba(255, 255, 255, 0.25);

  /* Text on light sections */
  --color-text-light: #0A0A0A;
  --color-text-light-secondary: rgba(10, 10, 10, 0.5);
  --color-text-light-muted: rgba(10, 10, 10, 0.25);

  /* ── Typography ── */
  --font-display: 'Satoshi', system-ui, -apple-system, sans-serif;
  --font-heading: var(--font-cormorant), 'Cormorant Garamond', Georgia, serif;
  --font-mono: var(--font-jetbrains), 'JetBrains Mono', monospace;

  /* Fluid type scale */
  --text-xs:   clamp(0.7rem,  1.5vw, 0.8rem);
  --text-sm:   clamp(0.8rem,  1.8vw, 0.95rem);
  --text-base: clamp(1rem,    2vw,   1.1rem);
  --text-lg:   clamp(1.1rem,  2.5vw, 1.4rem);
  --text-xl:   clamp(1.4rem,  3.5vw, 2rem);
  --text-2xl:  clamp(2rem,    5vw,   3.5rem);
  --text-3xl:  clamp(3rem,    7vw,   5.5rem);
  --text-hero: clamp(3.5rem,  9vw,   8rem);

  /* ── Spacing ── */
  --space-1:  0.25rem;
  --space-2:  0.5rem;
  --space-3:  0.75rem;
  --space-4:  1rem;
  --space-6:  1.5rem;
  --space-8:  2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;
  --space-32: 8rem;

  /* ── Layout ── */
  --container-max:     1280px;
  --container-padding: clamp(1.5rem, 5vw, 4rem);
  --section-padding-y: clamp(5rem, 12vw, 10rem);
  --axis-left:         clamp(2rem, 15vw, 16rem);

  /* ── Easing (Emil Design Engineering curves) ── */
  --ease-out-strong:    cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out-strong: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-drawer:        cubic-bezier(0.32, 0.72, 0, 1);

  /* ── Z-index ── */
  --z-below:   -1;
  --z-base:     0;
  --z-content:  10;
  --z-nav:     100;
  --z-cursor: 9999;
}
```

- [ ] **Step 1.2: Cargar Cormorant Garamond en layout.tsx**

Reemplazar el bloque de font imports en `src/app/[locale]/layout.tsx`:

```typescript
/* ANTES — líneas 4, 10-14 */
import { JetBrains_Mono } from 'next/font/google';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

/* DESPUÉS */
import { Cormorant_Garamond, JetBrains_Mono } from 'next/font/google';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});
```

Luego actualizar el `<html>` tag (línea 48) para incluir la nueva variable:

```tsx
/* ANTES */
<html lang={locale} className={jetbrainsMono.variable} suppressHydrationWarning>

/* DESPUÉS */
<html
  lang={locale}
  className={`${jetbrainsMono.variable} ${cormorantGaramond.variable}`}
  suppressHydrationWarning
>
```

- [ ] **Step 1.3: Verificar type-check**

```bash
cd "C:\Users\jzorr\Desktop\Portafolio-julio-zorro\.claude\worktrees\practical-swanson-366e51"
npx tsc --noEmit
```

Esperado: sin errores de tipos.

- [ ] **Step 1.4: Commit**

```bash
git add src/styles/tokens.css src/app/[locale]/layout.tsx
git commit -m "feat(tokens): add Cormorant Garamond font, sage accent, left-axis token"
```

---

## Task 2: Organic Motion Library

**Prerequisito:** ninguno (independiente)  
**Files:**
- Create: `src/lib/animations.ts`

- [ ] **Step 2.1: Crear src/lib/animations.ts**

```typescript
import type { Variants } from 'framer-motion';

const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const;

// Niebla disipándose — para hero name, headings principales
export const fogReveal: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(8px)',
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: 1.4,
      ease: EASE_OUT_STRONG,
    },
  },
};

// Contenedor stagger — envuelve hijos con fogReveal
export const fogRevealStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

// Niebla rápida — para subtítulos, párrafos secundarios
export const fogRevealFast: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(5px)',
    scale: 0.99,
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: 0.9,
      ease: EASE_OUT_STRONG,
    },
  },
};

// Unfurl / clip-path — para párrafos de bio, tarjetas de capítulo
// Se usa con useInView para trigger en scroll
export const unfurlReveal: Variants = {
  hidden: {
    clipPath: 'inset(0 0 100% 0)',
    opacity: 0,
  },
  visible: {
    clipPath: 'inset(0 0 0% 0)',
    opacity: 1,
    transition: {
      duration: 1.0,
      ease: EASE_OUT_STRONG,
    },
  },
};

// Crecimiento orgánico — para tarjetas tech, items de lista
export const growIn: Variants = {
  hidden: {
    scale: 0.94,
    opacity: 0,
    filter: 'blur(4px)',
  },
  visible: {
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.85,
      ease: EASE_OUT_STRONG,
    },
  },
};

// Stagger para listas de tarjetas (TechCard, capítulos)
export const growInStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};
```

- [ ] **Step 2.2: Verificar type-check**

```bash
npx tsc --noEmit
```

Esperado: sin errores.

- [ ] **Step 2.3: Commit**

```bash
git add src/lib/animations.ts
git commit -m "feat(animations): add organic motion variants — fog, unfurl, growIn"
```

---

## Task 3: Hero Section Redesign

**Prerequisito:** Task 1 (tokens), Task 2 (animations)  
**Files:**
- Modify: `src/components/sections/Hero/index.tsx`

Cambios: (1) eliminar `SplitName` + `letterVariants`, (2) hero name con fog reveal + Cormorant weight 300, (3) layout left-axis (no centrado), (4) sage glow reemplaza blue glow, (5) delay adjustments para la secuencia orgánica.

- [ ] **Step 3.1: Reemplazar Hero/index.tsx completo**

```tsx
'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { getLenis } from '@/lib/lenis-instance';
import { fogReveal, fogRevealFast } from '@/lib/animations';

const WebGLScene = dynamic(() => import('./WebGLScene'), { ssr: false });

const EASE = [0.23, 1, 0.32, 1] as [number, number, number, number];

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section
      id="hero"
      data-theme="dark"
      className="with-grain"
      style={{
        background: 'var(--color-dark)',
        display: 'flex',
        alignItems: 'center',
        minHeight: '100svh',
        overflow: 'hidden',
      }}
    >
      {/* WebGL background */}
      <WebGLScene />

      {/* Amber glow — sage reemplaza blue */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 60% at 65% 55%, rgba(255,140,66,0.08) 0%, transparent 70%),' +
            'radial-gradient(ellipse 40% 40% at 20% 80%, rgba(143,168,154,0.05) 0%, transparent 60%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Content — left axis, no centering */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          paddingLeft: 'var(--axis-left)',
          paddingRight: 'var(--container-padding)',
          paddingTop: 'var(--section-padding-y)',
          paddingBottom: 'var(--section-padding-y)',
        }}
      >
        {/* Role label */}
        <motion.p
          variants={fogRevealFast}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="section-label"
          style={{ color: 'var(--color-accent)', marginBottom: '1.5rem' }}
        >
          {t('title')}
        </motion.p>

        {/* Name — Cormorant Garamond, fog reveal */}
        <motion.h1
          variants={fogReveal}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-hero)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            lineHeight: 0.92,
            color: 'var(--color-text-dark)',
            marginBottom: '2.5rem',
            maxWidth: '14ch',
          }}
        >
          {t('name')}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={fogRevealFast}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.0 }}
          style={{
            fontSize: 'var(--text-lg)',
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text-dark-secondary)',
            maxWidth: '480px',
            marginBottom: '3rem',
            lineHeight: 1.55,
          }}
        >
          {t('tagline')}
        </motion.p>

        {/* CTA */}
        <motion.a
          href="#work"
          onClick={e => {
            e.preventDefault();
            const lenis = getLenis();
            if (lenis) lenis.scrollTo('#work', { offset: -72, duration: 1.2 });
            else document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
          }}
          variants={fogRevealFast}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.2 }}
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
            textDecoration: 'none',
            transition: 'border-color 200ms ease',
          }}
        >
          {t('cta')} ↓
        </motion.a>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: 'var(--axis-left)',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '8px',
        }}
      >
        <span
          className="section-label"
          style={{ color: 'var(--color-text-dark-muted)', fontSize: '0.65rem' }}
        >
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          style={{
            width: 1,
            height: 40,
            background: 'linear-gradient(to bottom, rgba(255,140,66,0.6), transparent)',
          }}
        />
      </motion.div>

      {/* Mobile: reduce left padding */}
      <style>{`
        @media (max-width: 768px) {
          #hero > div[style*="paddingLeft"] {
            padding-left: var(--container-padding) !important;
          }
          #hero > div[style*="paddingLeft"] h1 {
            max-width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
```

- [ ] **Step 3.2: Verificar type-check**

```bash
npx tsc --noEmit
```

Esperado: sin errores.

- [ ] **Step 3.3: Commit**

```bash
git add src/components/sections/Hero/index.tsx
git commit -m "feat(hero): fog reveal animation, Cormorant Garamond, left-axis composition"
```

---

## Task 4: Copiar foto del liquen al proyecto

**Prerequisito:** ninguno (independiente)  
**Files:**
- Create: `public/photos/lichen.jpg`

- [ ] **Step 4.1: Copiar DSC_0682.jpg a public/photos/**

```powershell
New-Item -ItemType Directory -Force "public\photos"
Copy-Item "C:\Users\jzorr\Desktop\FotosPersonal\DSC_0682.jpg" "public\photos\lichen.jpg"
```

- [ ] **Step 4.2: Verificar que el archivo existe**

```powershell
Test-Path "public\photos\lichen.jpg"
```

Esperado: `True`

- [ ] **Step 4.3: Commit**

```bash
git add public/photos/lichen.jpg
git commit -m "assets: add lichen fractal photo for About section protagonist"
```

---

## Task 5: About Section — Lichen Protagonist + Fog Reveals

**Prerequisito:** Task 1 (tokens), Task 2 (animations), Task 4 (foto)  
**Files:**
- Modify: `src/components/sections/About/index.tsx`

Cambios: (1) columna derecha → foto liquen a full height, (2) Cormorant Garamond en h2, (3) unfurlReveal reemplaza RevealBlock clip-path para bio paragraphs, (4) fog reveal para heading, (5) eliminar AmbientBackground orbs.

- [ ] **Step 5.1: Reemplazar About/index.tsx completo**

```tsx
'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fogReveal, fogRevealFast, unfurlReveal, growIn, growInStagger } from '@/lib/animations';

const chapters: Array<{
  key: 'iot' | 'university' | 'now';
  bg: string;
  textColor: string;
  labelColor: string;
  border?: string;
}> = [
  { key: 'iot',        bg: '#080810', textColor: 'rgba(245,241,235,0.85)', labelColor: '#FF8C42' },
  { key: 'university', bg: '#F5F1EB', textColor: 'rgba(10,10,10,0.75)',    labelColor: '#FF8C42', border: '1px solid #EAE4D8' },
  { key: 'now',        bg: '#FF8C42', textColor: 'rgba(8,8,16,0.85)',      labelColor: 'rgba(8,8,16,0.5)' },
];

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <div ref={ref} style={{ overflow: 'hidden' }}>
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={unfurlReveal}
        transition={{ delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function ChapterList() {
  const t = useTranslations('about');
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={growInStagger}
      style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
    >
      {chapters.map(({ key, bg, textColor, labelColor, border }) => (
        <motion.div
          key={key}
          variants={growIn}
          style={{
            background: bg,
            border: border ?? 'none',
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
    </motion.div>
  );
}

export default function About() {
  const t = useTranslations('about');
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: '-10% 0px' });

  const bioParagraphs = t('bio').split('\n\n');

  return (
    <section
      id="about"
      data-theme="light"
      style={{
        background: 'var(--color-light)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100svh',
        overflow: 'hidden',
      }}
    >
      {/* Left: text — anchored to left axis within its column */}
      <div
        style={{
          padding: 'var(--section-padding-y) clamp(2rem, 5vw, 4rem) var(--section-padding-y) var(--axis-left)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <ScrollReveal>
          <p
            className="section-label"
            style={{ color: 'var(--color-text-light-secondary)', marginBottom: '1.5rem' }}
          >
            {t('label')}
          </p>
        </ScrollReveal>

        {/* Heading — Cormorant Garamond, fog reveal */}
        <div ref={headingRef}>
          <motion.h2
            initial="hidden"
            animate={headingInView ? 'visible' : 'hidden'}
            variants={fogReveal}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              fontWeight: 300,
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
              color: 'var(--color-text-light)',
              marginBottom: '2rem',
              whiteSpace: 'pre-line',
            }}
          >
            {t('heading')}
          </motion.h2>
        </div>

        {bioParagraphs.map((para, i) => (
          <ScrollReveal key={i} delay={0.1 + i * 0.08}>
            <p
              style={{
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-light-secondary)',
                lineHeight: 1.8,
                marginBottom: i < bioParagraphs.length - 1 ? '1.25rem' : '2rem',
              }}
            >
              {para}
            </p>
          </ScrollReveal>
        ))}

        <ScrollReveal delay={0.35}>
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-light-muted)',
              lineHeight: 1.75,
              fontStyle: 'italic',
              borderLeft: '2px solid var(--color-accent)',
              paddingLeft: '1rem',
              marginBottom: '3rem',
            }}
          >
            {t('approach')}
          </p>
        </ScrollReveal>

        {/* Chapter cards */}
        <ChapterList />
      </div>

      {/* Right: lichen photo — full height, bleeds to right edge */}
      <div style={{ position: 'relative', minHeight: '600px' }}>
        <Image
          src="/photos/lichen.jpg"
          alt="Liquen fractal — estructura ramificada que inspira sistemas complejos"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          sizes="50vw"
          priority={false}
        />
        {/* Subtle left gradient fade para blend con la columna de texto */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, var(--color-light) 0%, transparent 18%)',
            zIndex: 1,
          }}
        />
      </div>

      {/* Mobile: stack vertically, photo below text */}
      <style>{`
        @media (max-width: 768px) {
          #about {
            grid-template-columns: 1fr !important;
          }
          #about > div:first-child {
            padding-left: var(--container-padding) !important;
          }
          #about > div:last-child {
            min-height: 360px !important;
          }
        }
      `}</style>
    </section>
  );
}
```

- [ ] **Step 5.2: Verificar type-check**

```bash
npx tsc --noEmit
```

Esperado: sin errores.

- [ ] **Step 5.3: Commit**

```bash
git add src/components/sections/About/index.tsx
git commit -m "feat(about): lichen photo protagonist, Cormorant heading, organic fog reveals"
```

---

## Task 6: Capabilities — Cormorant Heading + Fog Reveal + Sage + Remove Blue Orbs

**Prerequisito:** Task 1, Task 2  
**Files:**
- Modify: `src/components/sections/Capabilities/index.tsx`

- [ ] **Step 6.1: Leer el archivo completo**

```bash
cat src/components/sections/Capabilities/index.tsx
```

- [ ] **Step 6.2: Aplicar cambios en Capabilities/index.tsx**

Localizar y aplicar los siguientes cambios puntuales:

**a) Agregar imports de animations:**
```tsx
/* AÑADIR al bloque de imports, después de framer-motion */
import { fogReveal, growIn, growInStagger } from '@/lib/animations';
```

**b) Actualizar TechCard para usar growIn:**
```tsx
/* REEMPLAZAR la función TechCard completa */
function TechCard({ name, i }: { name: string; i: number }) {
  return (
    <motion.div
      variants={growIn}
      whileHover={{ scale: 1.04, borderColor: 'rgba(143,168,154,0.4)' }}
      whileTap={{ scale: 0.97 }}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '10px',
        padding: '0.6rem 1rem',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        letterSpacing: '0.06em',
        color: 'var(--color-text-dark-secondary)',
        cursor: 'default',
        transition: 'border-color 200ms ease, color 200ms ease',
      }}
    >
      {name}
    </motion.div>
  );
}
```

Nota: se eliminó el prop `i` pero el componente sigue recibiendo `i` para compatibilidad. Actualizar la firma a `{ name }: { name: string }` es opcional.

**c) Localizar el `<h2>` del heading principal de la sección y agregar Cormorant + fog reveal:**

Encontrar el elemento `<h2>` (o `<motion.h2>`) del título de la sección Capabilities. Reemplazarlo con:
```tsx
<motion.h2
  variants={fogReveal}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-10% 0px' }}
  style={{
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-3xl)',
    fontWeight: 300,
    letterSpacing: '-0.02em',
    lineHeight: 1.05,
    color: 'var(--color-text-dark)',
    marginBottom: 'clamp(2rem, 5vw, 4rem)',
  }}
>
  {t('heading')}
</motion.h2>
```

**d) Envolver los stacks de tech cards con growInStagger:**
Cada grupo de `TechCard` components debe estar dentro de un contenedor con `variants={growInStagger}`, `initial="hidden"`, `whileInView="visible"`, `viewport={{ once: true }}`.

**e) Eliminar AmbientBackground de Capabilities:**
Remover el `import { AmbientBackground }` y el `<AmbientBackground ... />` con sus orbs. El grain (`with-grain`) y el background dark son suficientes.

- [ ] **Step 6.3: Verificar type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 6.4: Commit**

```bash
git add src/components/sections/Capabilities/index.tsx
git commit -m "feat(capabilities): Cormorant heading, growIn tech cards, remove blue orbs"
```

---

## Task 7: Work Section — Sage en Haz Project + Cormorant Heading + Fog

**Prerequisito:** Task 1, Task 2  
**Files:**
- Modify: `src/components/sections/Work/index.tsx`

- [ ] **Step 7.1: Leer el archivo completo**

```bash
cat src/components/sections/Work/index.tsx
```

- [ ] **Step 7.2: Aplicar cambios en Work/index.tsx**

**a) Agregar imports de animations:**
```tsx
import { fogReveal, fogRevealFast } from '@/lib/animations';
```

**b) Reemplazar blue en secondaryProjects:**
```tsx
/* ANTES — línea ~25 */
color: '#3B82F6',

/* DESPUÉS */
color: 'var(--color-accent-2)',
```

**c) Localizar el heading principal de la sección Work y aplicar Cormorant + fog:**
```tsx
<motion.h2
  variants={fogReveal}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-10% 0px' }}
  style={{
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-3xl)',
    fontWeight: 300,
    letterSpacing: '-0.02em',
    lineHeight: 1.05,
    color: 'var(--color-text-light)',
    marginBottom: 'clamp(2rem, 5vw, 4rem)',
  }}
>
  {t('heading')}
</motion.h2>
```

**d) Eliminar o simplificar AmbientBackground** si está presente en Work (revisar en Step 7.1).

- [ ] **Step 7.3: Verificar type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 7.4: Commit**

```bash
git add src/components/sections/Work/index.tsx
git commit -m "feat(work): Cormorant heading, sage on haz project, fog reveal"
```

---

## Task 8: Contact Section — Cormorant + Fog + Remove Blue Orb

**Prerequisito:** Task 1, Task 2  
**Files:**
- Modify: `src/components/sections/Contact/index.tsx`

- [ ] **Step 8.1: Leer el archivo completo**

```bash
cat src/components/sections/Contact/index.tsx
```

- [ ] **Step 8.2: Aplicar cambios en Contact/index.tsx**

**a) Agregar imports:**
```tsx
import { fogReveal, fogRevealFast } from '@/lib/animations';
```

**b) Eliminar AmbientBackground** — remover el import y el `<AmbientBackground>` con todos sus orbs y particles.

**c) Localizar el heading de Contact (probablemente `<h2>` o `<motion.h2>`) y aplicar Cormorant:**
```tsx
<motion.h2
  variants={fogReveal}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-10% 0px' }}
  style={{
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-3xl)',
    fontWeight: 300,
    letterSpacing: '-0.02em',
    lineHeight: 1.05,
    color: 'var(--color-text-dark)',
    marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
  }}
>
  {t('heading')}
</motion.h2>
```

**d) Aplicar fogRevealFast al email link y redes sociales** envolviendo en motion.div con variants.

- [ ] **Step 8.3: Verificar type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 8.4: Commit**

```bash
git add src/components/sections/Contact/index.tsx
git commit -m "feat(contact): Cormorant heading, fog reveal, remove blue ambient orbs"
```

---

## Task 9: Build Final Verification

**Prerequisito:** Todas las tareas anteriores completas  

- [ ] **Step 9.1: Full type-check**

```bash
npx tsc --noEmit
```

Esperado: 0 errores.

- [ ] **Step 9.2: Build de producción**

```bash
npm run build
```

Esperado: build exitoso sin errores. Warnings sobre imágenes sin alt o similar son aceptables.

- [ ] **Step 9.3: Dev server para verificación visual**

```bash
npm run dev
```

Abrir `http://localhost:3000/es` y verificar:
- [ ] Hero: nombre aparece con fog reveal (niebla, no letras cayendo), tipografía Cormorant visible (serifs delgados), composición left-axis
- [ ] About: foto del liquen visible en columna derecha, heading en Cormorant, chapter cards con growIn al scroll
- [ ] Capabilities: heading en Cormorant, tech cards con growIn stagger, sin orbs azules
- [ ] Work: heading en Cormorant, sin color azul visible
- [ ] Contact: heading en Cormorant, sin orbs azules/partículas
- [ ] Toda la página: no hay `#3B82F6` electric blue visible en ninguna sección

- [ ] **Step 9.4: Commit final si hay ajustes**

```bash
git add -A
git commit -m "chore: final adjustments from visual verification"
```

---

## Notas de implementación

- **Cormorant weight 300** es el correcto para display grande — no usar 700+ con esta fuente, pierde su carácter editorial.
- **`filter: blur()` en Framer Motion** requiere que el elemento no tenga `overflow: hidden` en el padre directo, o el blur se recortará. Si hay clipPath en padres, quitar el overflow.
- **La foto del liquen** puede necesitar ajuste de `objectPosition` según cómo se vea en el browser. Valores sugeridos: `'center top'` o `'40% 50%'`.
- **Mobile**: todos los cambios de left-axis incluyen media query de reset. Verificar en 375px y 768px.
- **AmbientBackground**: al eliminarlo, verificar que `position: relative` sigue presente en las secciones que lo necesitan para que los gradientes radiales funcionen correctamente.
