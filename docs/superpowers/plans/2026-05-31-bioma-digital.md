# Bioma Digital Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the portfolio as a living digital ecosystem — WebGL biological shader hero, full GSAP animation system replacing Framer Motion, owned macro photography from the Colombian páramo as visual backbone, and a new Services section.

**Architecture:** 13 tasks organized in 5 phases: Foundation (tokens, fonts, photos) → GSAP architecture (plugins, remove Framer Motion) → Core sections (Hero WebGL, About, Work) → New sections (Services, Contact) → Composition and cleanup. Each task produces a working build.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, GSAP 3.15 + @gsap/react, Three.js 0.184, Lenis 1.3.23, next-intl 4.12, Tailwind CSS 4, Gloock + Archivo (Google Fonts), JetBrains Mono (existing).

**Spec:** `docs/superpowers/specs/2026-05-31-bioma-digital-design.md`

---

## Phase 1 — Foundation

---

### Task 1: Packages, Fonts & Photo Assets

**Files:**
- Modify: `package.json`
- Modify: `src/app/[locale]/layout.tsx`
- Create: `public/photos/` (directory + 6 image files)

- [ ] **Step 1.1 — Install @gsap/react, remove framer-motion**

```powershell
cd "C:\Users\jzorr\Desktop\Portafolio-julio-zorro\.claude\worktrees\quizzical-knuth-ab489d"
npm install @gsap/react
npm uninstall framer-motion
```

Expected: `package.json` no longer lists `framer-motion`, `@gsap/react` appears under `dependencies`.

- [ ] **Step 1.2 — Copy owned photos to public/photos/**

```powershell
$src = "C:\Users\jzorr\Desktop\FotosPersonal"
$dst = "C:\Users\jzorr\Desktop\Portafolio-julio-zorro\.claude\worktrees\quizzical-knuth-ab489d\public\photos"
New-Item -ItemType Directory -Force -Path $dst
Copy-Item "$src\DSC_0088.jpg" "$dst\moss-hero.jpg"
Copy-Item "$src\DSC_0444.jpg" "$dst\specimen-work.jpg"
Copy-Item "$src\DSC_0377.jpg" "$dst\forest-about.jpg"
Copy-Item "$src\DSC_0684.jpg" "$dst\frailejón-services.jpg"
Copy-Item "$src\DSC_0682.jpg" "$dst\lichen-contact.jpg"
Copy-Item "$src\DSC_0569.jpg" "$dst\sand-texture.jpg"
```

Expected: 6 `.jpg` files appear in `public/photos/`.

- [ ] **Step 1.3 — Replace Satoshi CDN with Gloock + Archivo in layout.tsx**

Replace the full content of `src/app/[locale]/layout.tsx`:

```typescript
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { JetBrains_Mono, Gloock, Archivo } from 'next/font/google';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const gloock = Gloock({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-gloock',
  display: 'swap',
});

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-archivo',
  display: 'swap',
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  return {
    title: `${t('name')} — ${t('title')}`,
    description: t('tagline'),
    alternates: { languages: { en: '/en', es: '/es' } },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'en' | 'es')) notFound();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${jetbrainsMono.variable} ${gloock.variable} ${archivo.variable}`}
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

Note: `SmoothScroll` is moved to `page.tsx` in Task 10. The layout no longer wraps children in SmoothScroll.

- [ ] **Step 1.4 — Verify build passes**

```powershell
npm run build
```

Expected: Build completes with no errors. Warnings about unused CSS are acceptable.

- [ ] **Step 1.5 — Commit**

```powershell
git add -A
git commit -m "feat: add @gsap/react, replace Satoshi with Gloock+Archivo, copy photos to public"
```

---

### Task 2: Design Tokens

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/app/globals.css`

- [ ] **Step 2.1 — Replace tokens.css with Bioma Digital system**

Replace the entire content of `src/styles/tokens.css`:

```css
/* Design Tokens — Bioma Digital
   Reference: Atlas de Colombia / IGAC
   All sections dark: data-theme="dark" only */

:root {
  /* ── Colors ── */
  --bg-deep:          #090d09;
  --bg-surface:       #111710;
  --accent-lichen:    #7aad5e;
  --accent-cork:      #c8a96e;
  --text-primary:     #f2ede6;
  --text-technical:   #5a7a5a;
  --text-muted:       #3a4a3a;

  /* Legacy aliases — used in SmoothScroll, Nav, Cursor until those are updated */
  --color-dark:       #090d09;
  --color-accent:     #7aad5e;
  --color-text-dark:  #f2ede6;
  --color-text-dark-secondary: #5a7a5a;

  /* ── Typography ── */
  --font-display: var(--font-gloock), Georgia, serif;
  --font-body:    var(--font-archivo), system-ui, sans-serif;
  --font-mono:    var(--font-jetbrains), 'JetBrains Mono', monospace;

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

  /* ── Easing ── */
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

[data-theme="dark"] {
  --section-bg:             var(--bg-deep);
  --section-bg-2:           var(--bg-surface);
  --section-text:           var(--text-primary);
  --section-text-secondary: var(--text-technical);
  --section-text-muted:     var(--text-muted);
  --section-border:         rgba(122, 173, 94, 0.1);
}
```

- [ ] **Step 2.2 — Add grain overlay and base body styles to globals.css**

Open `src/app/globals.css` and add at the end:

```css
/* Bioma Digital base */
body {
  background-color: var(--bg-deep);
  color: var(--text-primary);
  font-family: var(--font-body);
}

/* Grain overlay — applied via pseudo-element on sections */
.with-grain::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.04;
  pointer-events: none;
  z-index: 1;
}
```

- [ ] **Step 2.3 — Verify build**

```powershell
npm run build
```

Expected: Build passes. No TypeScript errors.

- [ ] **Step 2.4 — Commit**

```powershell
git add src/styles/tokens.css src/app/globals.css
git commit -m "feat: replace design tokens with Bioma Digital system — lichen palette, Gloock/Archivo vars"
```

---

## Phase 2 — GSAP Architecture

---

### Task 3: GSAP Plugin Registration & Framer Motion Removal

**Files:**
- Create: `src/lib/gsap-config.ts`
- Modify: `src/components/ui/SmoothScroll/index.tsx`

- [ ] **Step 3.1 — Create GSAP config with all plugin registrations**

Create `src/lib/gsap-config.ts`:

```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP);

// Organic growth curves — register once, use by name throughout
CustomEase.create('biome.grow',    'M0,0 C0.1,0 0.2,1 1,1');
CustomEase.create('biome.settle',  'M0,0 C0.25,0.1 0.25,1 1,1');
CustomEase.create('biome.breathe', 'M0,0 C0.45,0 0.55,1 1,1');

export { gsap, ScrollTrigger, SplitText, CustomEase, useGSAP };
```

- [ ] **Step 3.2 — Import gsap-config in SmoothScroll to trigger registration**

Replace `src/components/ui/SmoothScroll/index.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { setLenis } from '@/lib/lenis-instance';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 3.3 — Verify TypeScript finds no remaining framer-motion imports**

```powershell
Select-String -Path "src\**\*.tsx","src\**\*.ts" -Pattern "framer-motion" -Recurse
```

Expected: No output (zero matches). If any files show up, remove their `framer-motion` imports manually before proceeding.

- [ ] **Step 3.4 — Verify build**

```powershell
npm run build
```

Expected: Build passes.

- [ ] **Step 3.5 — Commit**

```powershell
git add src/lib/gsap-config.ts src/components/ui/SmoothScroll/index.tsx
git commit -m "feat: centralize GSAP plugin registration, register CustomEase biome curves"
```

---

## Phase 3 — Core Sections

---

### Task 4: Hero WebGL Biological Shader

**Files:**
- Modify: `src/components/sections/Hero/WebGLScene.tsx`

- [ ] **Step 4.1 — Replace particle system with fBm biological field shader**

Replace the entire content of `src/components/sections/Hero/WebGLScene.tsx`:

```typescript
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2  uMouse;
  uniform vec2  uResolution;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      v += amp * noise(p);
      p  = p * 2.1 + vec2(1.7, 9.2);
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);

    // Subtle mouse distortion
    vec2 mouse = uMouse - 0.5;
    uv += mouse * 0.08 * (1.0 - length(uv));

    float t = uTime * 0.12;

    float n1 = fbm(uv * 2.8 + vec2(t, t * 0.6));
    float n2 = fbm(uv * 4.5 - vec2(t * 0.4, t * 0.25) + n1 * 0.7);
    float n3 = fbm(uv * 7.0 + n2 * 0.5 + vec2(t * 0.2));

    // Palette: #090d09 dark → #3a5a2a moss → #7aad5e lichen
    vec3 dark   = vec3(0.035, 0.051, 0.035);
    vec3 moss   = vec3(0.227, 0.353, 0.165);
    vec3 lichen = vec3(0.478, 0.678, 0.369);

    vec3 color = mix(dark, moss,   smoothstep(0.28, 0.55, n1));
    color      = mix(color, lichen, smoothstep(0.55, 0.85, n2) * 0.55);
    color      = mix(color, dark,   smoothstep(0.75, 1.0,  n3) * 0.3);

    // Radial vignette
    float vignette = 1.0 - smoothstep(0.4, 1.3, length(uv * 1.1));
    color *= vignette;

    // Breathing pulse: ±3% amplitude over ~6s
    float pulse = 1.0 + 0.03 * sin(uTime * 1.05);
    color *= pulse;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function WebGLScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const scene    = new THREE.Scene();
    const camera   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x090d09, 1);
    el.appendChild(renderer.domElement);

    const uniforms = {
      uTime:       { value: 0 },
      uMouse:      { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(el.clientWidth, el.clientHeight) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const onMouse = (e: MouseEvent) => {
      uniforms.uMouse.value.set(
        e.clientX / window.innerWidth,
        1.0 - e.clientY / window.innerHeight
      );
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    const onResize = () => {
      renderer.setSize(el.clientWidth, el.clientHeight);
      uniforms.uResolution.value.set(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', onResize);

    let raf: number;
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      material.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      aria-hidden
    />
  );
}
```

- [ ] **Step 4.2 — Verify build**

```powershell
npm run build
```

Expected: Build passes. No TypeScript errors.

- [ ] **Step 4.3 — Commit**

```powershell
git add src/components/sections/Hero/WebGLScene.tsx
git commit -m "feat(hero): replace particle system with fBm biological field shader"
```

---

### Task 5: Hero Component Redesign

**Files:**
- Modify: `src/components/sections/Hero/index.tsx`

- [ ] **Step 5.1 — Rewrite Hero with GSAP SplitText timeline, remove Framer Motion**

Replace entire `src/components/sections/Hero/index.tsx`:

```typescript
'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, SplitText, ScrollTrigger } from '@/lib/gsap-config';
import WebGLScene from './WebGLScene';

export default function Hero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const coordRef    = useRef<HTMLParagraphElement>(null);
  const firstNameRef = useRef<HTMLSpanElement>(null);
  const lastNameRef  = useRef<HTMLSpanElement>(null);
  const taglineRef  = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLAnchorElement>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      gsap.set([coordRef.current, firstNameRef.current, lastNameRef.current,
                taglineRef.current, ctaRef.current, scrollRef.current],
        { opacity: 1, y: 0 });
      return;
    }

    const splitFirst = new SplitText(firstNameRef.current, { type: 'chars' });
    const splitLast  = new SplitText(lastNameRef.current,  { type: 'chars' });

    gsap.set([...splitFirst.chars, ...splitLast.chars,
              coordRef.current, taglineRef.current, ctaRef.current, scrollRef.current],
      { opacity: 0 });

    const tl = gsap.timeline();

    // Coordinates
    tl.to(coordRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.6);

    // First name chars
    tl.to(splitFirst.chars, {
      opacity: 1, y: 0, duration: 0.7, ease: 'biome.grow', stagger: 0.04,
    }, 1.0);

    // Last name chars
    tl.to(splitLast.chars, {
      opacity: 1, y: 0, duration: 0.7, ease: 'biome.grow', stagger: 0.04,
    }, 1.4);

    // Tagline
    tl.to(taglineRef.current, { opacity: 1, duration: 0.7, ease: 'power3.out' }, 1.9);

    // CTA
    tl.to(ctaRef.current, { opacity: 1, duration: 0.5, ease: 'power3.out' }, 2.3);

    // Scroll indicator loop
    tl.to(scrollRef.current, { opacity: 0.5, duration: 0.4, ease: 'power3.out' }, 2.6);
    gsap.to(scrollRef.current, {
      scale: 1.15, opacity: 0.3, duration: 1.4, ease: 'biome.breathe',
      repeat: -1, yoyo: true, delay: 3.0,
    });

    // Scroll-out: hero fades as user scrolls
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set(sectionRef.current!.querySelector('.hero-content'), {
          opacity: 1 - p * 1.25,
          y: -p * 60,
        });
        // Camera zoom-out effect via uniform is handled in WebGLScene internally
      },
    });

    return () => {
      splitFirst.revert();
      splitLast.revert();
    };
  }, { scope: sectionRef });

  return (
    <section
      id="hero"
      ref={sectionRef}
      data-theme="dark"
      className="with-grain"
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'var(--bg-deep)',
      }}
    >
      <WebGLScene />

      <div
        className="hero-content"
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '0 var(--container-padding)',
          maxWidth: 'var(--container-max)',
          width: '100%',
        }}
      >
        {/* Field log coordinates */}
        <p
          ref={coordRef}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.18em',
            color: 'var(--text-technical)',
            marginBottom: 'var(--space-6)',
            opacity: 0,
            transform: 'translateY(8px)',
          }}
        >
          FIELD_LOG · 04°42′N 74°08′W · BIOME_001
        </p>

        {/* Name — split text target */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-hero)',
            fontWeight: 400,
            lineHeight: 0.9,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-8)',
          }}
        >
          <span
            ref={firstNameRef}
            style={{ display: 'block', overflow: 'hidden' }}
          >
            Julio
          </span>
          <span
            ref={lastNameRef}
            style={{ display: 'block', overflow: 'hidden' }}
          >
            Zorro
          </span>
        </h1>

        {/* Tagline */}
        <p
          ref={taglineRef}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-technical)',
            marginBottom: 'var(--space-12)',
            opacity: 0,
          }}
        >
          AI Engineer · Full Stack Developer · Software Engineer
        </p>

        {/* CTA */}
        <a
          ref={ctaRef}
          href="#work"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            color: 'var(--accent-lichen)',
            textDecoration: 'none',
            borderBottom: '1px solid var(--accent-lichen)',
            paddingBottom: '2px',
            opacity: 0,
            transition: 'opacity 200ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          → Enter the biome
        </a>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0,
          zIndex: 10,
        }}
        aria-hidden
      >
        <div style={{
          width: '1px',
          height: '48px',
          background: 'linear-gradient(to bottom, var(--accent-lichen), transparent)',
        }} />
      </div>
    </section>
  );
}
```

- [ ] **Step 5.2 — Verify build**

```powershell
npm run build
```

Expected: Build passes.

- [ ] **Step 5.3 — Commit**

```powershell
git add src/components/sections/Hero/index.tsx
git commit -m "feat(hero): GSAP SplitText timeline, biological entry sequence, remove Framer Motion"
```

---

### Task 6: About Section — Field Notes

**Files:**
- Modify: `src/components/sections/About/index.tsx`

- [ ] **Step 6.1 — Rewrite About with parallax photo and asymmetric chapters**

Replace entire `src/components/sections/About/index.tsx`:

```typescript
'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap-config';

export default function About() {
  const sectionRef  = useRef<HTMLElement>(null);
  const photoRef    = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const t = useTranslations('about');

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Parallax scrub on photo
    gsap.to(photoRef.current!.querySelector('img'), {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: photoRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Heading reveal
    const split = new SplitText(headingRef.current, { type: 'lines' });
    gsap.from(split.lines, {
      opacity: 0, y: 20, duration: 1.0, ease: 'power3.out', stagger: 0.15,
      scrollTrigger: {
        trigger: photoRef.current,
        start: 'top 80%',
        once: true,
      },
    });

    // Chapters batch reveal
    ScrollTrigger.batch('.field-chapter', {
      onEnter: (batch) => gsap.fromTo(batch,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.18 }
      ),
      start: 'top 88%',
      once: true,
    });

    return () => split.revert();
  }, { scope: sectionRef });

  const chapters = [
    {
      num: '01',
      label: t('chapters.iot.label'),
      body: t('chapters.iot.body'),
      align: 'left' as const,
      note: 'Published in Nature Scientific Reports, 2024 ↗',
      noteHref: 'https://www.nature.com/articles/s41598-024-00001-0',
    },
    {
      num: '02',
      label: t('chapters.university.label'),
      body: t('chapters.university.body'),
      align: 'right' as const,
    },
    {
      num: '03',
      label: t('chapters.now.label'),
      body: t('chapters.now.body'),
      align: 'center' as const,
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      data-theme="dark"
      className="with-grain"
      style={{ position: 'relative', background: 'var(--bg-deep)', overflow: 'hidden' }}
    >
      {/* Act 1: Photo with heading */}
      <div
        ref={photoRef}
        style={{
          position: 'relative',
          height: '70vh',
          minHeight: '480px',
          overflow: 'hidden',
        }}
      >
        <Image
          src="/photos/forest-about.jpg"
          alt="Tropical forest with waterfall and filtered light — field observation, Colombia"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center', height: '120%', top: '-10%' }}
          sizes="100vw"
        />
        {/* Gradient fade to section bg */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(9,13,9,0) 30%, rgba(9,13,9,0.85) 80%, #090d09 100%)',
        }} />

        {/* Heading over photo */}
        <div style={{
          position: 'absolute',
          bottom: 'clamp(2rem, 5vh, 4rem)',
          left: 'var(--container-padding)',
          zIndex: 2,
        }}>
          <h2
            ref={headingRef}
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              color: 'var(--text-primary)',
              maxWidth: '16ch',
            }}
          >
            {t('heading')}
          </h2>
        </div>
      </div>

      {/* Bisagra — single metadata line */}
      <div style={{
        padding: 'clamp(2.5rem, 5vw, 4rem) var(--container-padding) 0',
        fontFamily: 'var(--font-body)',
        fontSize: '10px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--text-technical)',
      }}>
        Notas de Campo — Julio Zorro Pérez &nbsp;/&nbsp; 2019–2025 &nbsp;·&nbsp; Bogotá, Colombia
      </div>

      {/* Act 2: Three asymmetric chapters */}
      <div style={{ padding: 'clamp(3rem, 6vw, 5rem) var(--container-padding) var(--section-padding-y)' }}>
        {chapters.map(({ num, label, body, align, note, noteHref }) => (
          <div
            key={num}
            className="field-chapter"
            style={{
              marginBottom: 'clamp(3rem, 6vw, 5rem)',
              maxWidth: align === 'center' ? '520px' : '680px',
              marginLeft: align === 'right' ? 'auto' : align === 'center' ? 'auto' : undefined,
              marginRight: align === 'center' ? 'auto' : undefined,
              textAlign: align,
            }}
          >
            <span style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: num === '03' ? 'var(--accent-lichen)' : 'var(--text-technical)',
              marginBottom: 'var(--space-3)',
            }}>
              {num}
            </span>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: num === '03'
                ? 'clamp(1.8rem, 3vw, 2.5rem)'
                : 'clamp(1.4rem, 2.5vw, 2rem)',
              fontWeight: 400,
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-4)',
              lineHeight: 1.15,
            }}>
              {label}
            </h3>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
              lineHeight: 1.8,
              color: `rgba(242,237,230,${num === '03' ? '0.8' : num === '02' ? '0.55' : '0.65'})`,
              maxWidth: '55ch',
              marginLeft: align === 'center' ? 'auto' : undefined,
              marginRight: align === 'center' ? 'auto' : undefined,
            }}>
              {body}
            </p>
            {note && noteHref && (
              <a
                href={noteHref}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: 'var(--space-3)',
                  fontFamily: 'var(--font-body)',
                  fontStyle: 'italic',
                  fontSize: '13px',
                  color: 'var(--accent-lichen)',
                  textDecoration: 'none',
                }}
              >
                {note}
              </a>
            )}
          </div>
        ))}

        {/* Condensed tech stack — merged from Capabilities */}
        <div style={{
          borderTop: '1px solid rgba(122,173,94,0.1)',
          paddingTop: 'var(--space-8)',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-technical)',
          lineHeight: 2,
        }}>
          Python · TypeScript · React · Next.js · LangGraph · FastAPI · PostgreSQL · Three.js · GSAP
          <br />
          <span style={{ fontSize: '11px', opacity: 0.7 }}>
            Hardware & IoT: C/C++ · FreeRTOS · LoRa · LEO Satellites · MQTT · Edge Computing
          </span>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6.2 — Verify build**

```powershell
npm run build
```

- [ ] **Step 6.3 — Commit**

```powershell
git add src/components/sections/About/index.tsx
git commit -m "feat(about): parallax photo, asymmetric field chapters, condensed tech stack, remove Framer Motion"
```

---

### Task 7: Work Section — Digital Specimens

**Files:**
- Modify: `src/components/sections/Work/index.tsx`
- Modify: `src/components/sections/Work/ChatMockup.tsx`

- [ ] **Step 7.1 — Rewrite Work with sticky photo and specimen layout**

Replace entire `src/components/sections/Work/index.tsx`:

```typescript
'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap-config';
import ChatMockup from './ChatMockup';

export default function Work() {
  const sectionRef  = useRef<HTMLElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const counterRef  = useRef<HTMLSpanElement>(null);
  const t = useTranslations('work');

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Featured title reveal
    const split = new SplitText(featuredRef.current!.querySelector('.specimen-title'), {
      type: 'lines',
    });
    gsap.from(split.lines, {
      opacity: 0, y: 30, duration: 0.8, ease: 'power4.out', stagger: 0.1,
      scrollTrigger: {
        trigger: featuredRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          // Counter animation ESP-001
          const obj = { val: 0 };
          gsap.to(obj, {
            val: 1, duration: 0.6, ease: 'power2.out',
            onUpdate: () => {
              if (counterRef.current)
                counterRef.current.textContent = `ESP-00${Math.round(obj.val)}`;
            },
          });
        },
      },
    });

    // Batch reveal for all specimen items
    ScrollTrigger.batch('.specimen-item', {
      onEnter: (batch) => gsap.fromTo(batch,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power4.out', stagger: 0.12 }
      ),
      start: 'top 85%',
      once: true,
    });

    return () => split.revert();
  }, { scope: sectionRef });

  return (
    <section
      id="work"
      ref={sectionRef}
      data-theme="dark"
      className="with-grain"
      style={{ position: 'relative', background: 'var(--bg-deep)' }}
    >
      {/* Sticky photo header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 0, height: 'clamp(40vh, 50vh, 55vh)', overflow: 'hidden' }}>
        <Image
          src="/photos/specimen-work.jpg"
          alt="Millipede coiled on green moss — field specimen, Bioma Digital collection"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center 60%' }}
          sizes="100vw"
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 0%, rgba(9,13,9,0.3) 60%, #090d09 100%)',
        }} />
        {/* SpecimenLabel */}
        <p style={{
          position: 'absolute', bottom: '2rem', left: 'var(--container-padding)',
          fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.18em',
          color: 'var(--text-technical)', zIndex: 2,
        }}>
          ESPECÍMENES DIGITALES — CAMPO 2019–2025
          <br />
          9°01′N 79°31′W &nbsp;/&nbsp; 3 REGISTROS CATALOGADOS
        </p>
      </div>

      {/* Content over sticky */}
      <div style={{ position: 'relative', zIndex: 1, background: 'var(--bg-deep)' }}>

        {/* Intro */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: 'clamp(2rem, 5vw, 6rem)',
          padding: 'clamp(3rem, 6vw, 5rem) var(--container-padding)',
          maxWidth: 'var(--container-max)',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(3.5rem, 7vw, 6rem)',
            fontWeight: 400,
            lineHeight: 0.9,
            color: 'var(--text-primary)',
          }}>
            {t('label')}
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            color: 'rgba(242,237,230,0.65)',
            maxWidth: '52ch',
            alignSelf: 'end',
          }}>
            Three projects. Each one a field record: what was observed, what was built, what shipped.
          </p>
        </div>

        {/* Specimen 01 — Featured */}
        <div
          ref={featuredRef}
          className="specimen-item"
          style={{
            margin: '0 var(--container-padding)',
            padding: 'clamp(2rem, 4vw, 3rem)',
            background: 'var(--bg-surface)',
            border: '1px solid rgba(122,173,94,0.12)',
            borderRadius: '3px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(2rem, 4vw, 4rem)',
            marginBottom: 'var(--space-4)',
          }}
        >
          <div>
            <span
              ref={counterRef}
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.18em',
                color: 'var(--text-technical)',
                marginBottom: 'var(--space-3)',
              }}
            >
              ESP-000
            </span>
            <h3
              className="specimen-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                fontWeight: 400,
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-4)',
                lineHeight: 1.1,
              }}
            >
              {t('projects.agent.title')}
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-technical)', marginBottom: 'var(--space-3)' }}>
              Type: Conversational AI System &nbsp;·&nbsp; Status: Beta
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
              lineHeight: 1.7,
              color: 'rgba(242,237,230,0.7)',
              maxWidth: '45ch',
              marginBottom: 'var(--space-6)',
            }}>
              {t('projects.agent.description')}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-technical)', marginBottom: 'var(--space-6)' }}>
              {t('projects.agent.tags').join(' · ')}
            </p>
            <a
              href="#"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--accent-lichen)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--accent-lichen)',
                paddingBottom: '1px',
              }}
            >
              {t('viewCode')} ↗
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ChatMockup />
          </div>
        </div>

        {/* Specimen 02 — Sinergia */}
        <div
          className="specimen-item"
          style={{
            margin: '0 var(--container-padding)',
            padding: 'clamp(2rem, 4vw, 3rem) 0',
            borderTop: '1px solid rgba(122,173,94,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 'clamp(2rem, 4vw, 4rem)',
          }}
        >
          <div>
            <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.18em', color: 'var(--text-technical)', marginBottom: 'var(--space-3)' }}>ESP-002</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 400, color: 'var(--text-primary)', marginBottom: 'var(--space-3)', lineHeight: 1.15 }}>
              {t('projects.sinergia.title')}
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', lineHeight: 1.7, color: 'rgba(242,237,230,0.65)', maxWidth: '40ch' }}>
              {t('projects.sinergia.description')}
            </p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-technical)', marginBottom: 'var(--space-4)' }}>
              {t('projects.sinergia.tags').join(' · ')}
            </p>
            <a href="https://estudio-sinergia.vercel.app" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-lichen)', textDecoration: 'none', borderBottom: '1px solid var(--accent-lichen)' }}>
              {t('liveDemo')} ↗
            </a>
          </div>
        </div>

        {/* Specimen 03 — HAZ */}
        <div
          className="specimen-item"
          style={{
            margin: '0 var(--container-padding)',
            padding: 'clamp(2rem, 4vw, 3rem) 0',
            borderTop: '1px solid rgba(122,173,94,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 'clamp(2rem, 4vw, 4rem)',
            flexDirection: 'row-reverse',
            paddingBottom: 'var(--section-padding-y)',
          }}
        >
          <div>
            <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.18em', color: 'var(--text-technical)', marginBottom: 'var(--space-3)' }}>ESP-003</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 400, color: 'var(--text-primary)', marginBottom: 'var(--space-3)', lineHeight: 1.15 }}>
              {t('projects.haz.title')}
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', lineHeight: 1.7, color: 'rgba(242,237,230,0.65)', maxWidth: '40ch' }}>
              {t('projects.haz.description')}
            </p>
          </div>
          <div style={{ textAlign: 'left', flexShrink: 0 }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--accent-cork)', marginBottom: 'var(--space-4)' }}>
              {t('projects.haz.tags').join(' · ')}
            </p>
            <a href="#" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-cork)', textDecoration: 'none', borderBottom: '1px solid var(--accent-cork)' }}>
              {t('viewProject')} ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 7.2 — Restyle ChatMockup to Bioma Digital palette**

Replace `src/components/sections/Work/ChatMockup.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';

const conversation = [
  { role: 'user',  text: 'What's the irrigation forecast for plot A3?' },
  { role: 'agent', text: 'Based on current evapotranspiration data and the last 48h satellite readings, plot A3 needs irrigation in approximately 36 hours. Soil moisture is at 62%.' },
  { role: 'user',  text: 'Send an alert to the field team.' },
  { role: 'agent', text: 'Alert sent to 3 field operators. I\'ve also updated the irrigation schedule in the dashboard.' },
];

export default function ChatMockup() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= conversation.length) return;
    const timer = setTimeout(() => setVisible(v => v + 1), visible === 0 ? 800 : 1600);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <div style={{
      width: '100%',
      background: 'var(--bg-deep)',
      border: '1px solid rgba(122,173,94,0.15)',
      borderRadius: '3px',
      padding: 'var(--space-6)',
      boxShadow: '0 0 60px rgba(122,173,94,0.06)',
      minHeight: '280px',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
        paddingBottom: 'var(--space-4)',
        borderBottom: '1px solid rgba(122,173,94,0.1)',
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-lichen)', opacity: 0.8 }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--text-technical)' }}>
          AGENT · ACTIVE
        </span>
      </div>

      {/* Messages */}
      {conversation.slice(0, visible).map((msg, i) => (
        <div
          key={i}
          style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '80%',
            padding: 'var(--space-3) var(--space-4)',
            background: msg.role === 'user'
              ? 'rgba(122,173,94,0.1)'
              : 'rgba(242,237,230,0.04)',
            borderRadius: '2px',
            border: msg.role === 'user'
              ? '1px solid rgba(122,173,94,0.2)'
              : '1px solid rgba(242,237,230,0.07)',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            lineHeight: 1.6,
            color: msg.role === 'user' ? 'var(--accent-lichen)' : 'rgba(242,237,230,0.8)',
            margin: 0,
          }}>
            {msg.text}
          </p>
        </div>
      ))}

      {/* Typing indicator */}
      {visible < conversation.length && (
        <div style={{ display: 'flex', gap: 4, padding: 'var(--space-2) var(--space-3)', alignSelf: 'flex-start' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 4, height: 4, borderRadius: '50%',
              background: 'var(--text-technical)',
              animation: `pulse 1.2s ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 7.3 — Verify build**

```powershell
npm run build
```

- [ ] **Step 7.4 — Commit**

```powershell
git add src/components/sections/Work/index.tsx src/components/sections/Work/ChatMockup.tsx
git commit -m "feat(work): digital specimens layout, sticky photo header, ScrollTrigger batch, lichen palette"
```

---

## Phase 4 — New + Remaining Sections

---

### Task 8: Services Section (New)

**Files:**
- Create: `src/components/sections/Services/index.tsx`

- [ ] **Step 8.1 — Create Services component with expand rows and sticky photo**

Create `src/components/sections/Services/index.tsx`:

```typescript
'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';

const services = [
  {
    key: 'ai' as const,
    num: '01',
    availability: 'Min. commitment: 3 weeks',
  },
  {
    key: 'fullstack' as const,
    num: '02',
    availability: 'Full project: 4–10 weeks',
  },
  {
    key: 'interfaces' as const,
    num: '03',
    availability: 'Animation sprint: 1–3 weeks',
  },
  {
    key: 'consulting' as const,
    num: '04',
    availability: 'Initial session: 1 week',
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef   = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const t = useTranslations('services');

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Photo entrance
    gsap.from(photoRef.current, {
      opacity: 0, x: -30, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
    });

    // Photo parallax
    gsap.to(photoRef.current!.querySelector('img'), {
      y: -40, ease: 'none',
      scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
    });

    // Rows stagger
    gsap.from('.service-row', {
      opacity: 0, y: 24, stagger: 0.1, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.service-rows', start: 'top 75%', once: true },
    });
  }, { scope: sectionRef });

  function handleExpand(key: string, indicatorEl: HTMLElement | null) {
    setExpanded(prev => {
      const next = prev === key ? null : key;
      if (next && indicatorEl) {
        gsap.fromTo(indicatorEl,
          { opacity: 0, x: -8 },
          { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', delay: 0.1 }
        );
      }
      return next;
    });
  }

  return (
    <section
      id="services"
      ref={sectionRef}
      data-theme="dark"
      className="with-grain"
      style={{ position: 'relative', background: 'var(--bg-deep)', overflow: 'hidden' }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: '42% 58%',
        minHeight: '100svh',
        maxWidth: 'var(--container-max)',
        padding: 'var(--section-padding-y) var(--container-padding)',
        gap: 'clamp(2rem, 5vw, 5rem)',
        margin: '0 auto',
      }}>

        {/* Left: sticky photo */}
        <div
          ref={photoRef}
          style={{
            position: 'sticky',
            top: 'var(--section-padding-y)',
            height: 'fit-content',
            overflow: 'hidden',
            borderRadius: '2px',
          }}
        >
          <Image
            src="/photos/frailejón-services.jpg"
            alt="Frailejón — endemic to the Colombian páramo. Grows 1cm per year."
            width={600}
            height={720}
            style={{ objectFit: 'cover', width: '100%', height: 'clamp(400px, 60vh, 700px)', display: 'block' }}
          />
          <p style={{
            marginTop: 'var(--space-3)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-technical)',
            fontStyle: 'italic',
          }}>
            Frailejón — endémica del páramo. Crece 1cm por año.
          </p>
        </div>

        {/* Right: expand rows */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 400,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-12)',
            lineHeight: 1.1,
          }}>
            {t('label')}
          </h2>

          <div className="service-rows">
            {services.map(({ key, num, availability }) => {
              const isOpen = expanded === key;
              const indicatorRef = useRef<HTMLSpanElement>(null);

              return (
                <div
                  key={key}
                  className="service-row"
                  style={{ borderTop: '1px solid rgba(122,173,94,0.12)' }}
                >
                  <button
                    onClick={() => handleExpand(key, indicatorRef.current)}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 'clamp(1.2rem, 2.5vw, 1.8rem) 0',
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 'var(--space-4)',
                      textAlign: 'left',
                    }}
                    onMouseEnter={e => {
                      const numEl = e.currentTarget.querySelector('.svc-num') as HTMLElement;
                      if (numEl) gsap.to(numEl, { x: 4, duration: 0.2, ease: 'power2.out' });
                    }}
                    onMouseLeave={e => {
                      const numEl = e.currentTarget.querySelector('.svc-num') as HTMLElement;
                      if (numEl) gsap.to(numEl, { x: 0, duration: 0.2, ease: 'power2.out' });
                    }}
                  >
                    <span className="svc-num" style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-technical)',
                      minWidth: '2rem',
                      display: 'inline-block',
                    }}>
                      {num}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.4rem, 2vw, 2rem)',
                      fontWeight: 400,
                      color: 'var(--text-primary)',
                    }}>
                      {t(`items.${key}.title`)}
                    </span>
                  </button>

                  {/* Expandable content */}
                  <div style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows 350ms ease',
                    overflow: 'hidden',
                  }}>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ paddingBottom: 'clamp(1.2rem, 2.5vw, 1.8rem)', paddingLeft: 'calc(2rem + var(--space-4))' }}>
                        <p style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--text-base)',
                          lineHeight: 1.7,
                          color: 'rgba(242,237,230,0.7)',
                          maxWidth: '50ch',
                          marginBottom: 'var(--space-3)',
                        }}>
                          {t(`items.${key}.description`)}
                        </p>
                        <span ref={indicatorRef} style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--accent-lichen)',
                          display: 'inline-block',
                        }}>
                          {availability}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div style={{
            borderTop: '1px solid rgba(122,173,94,0.2)',
            paddingTop: 'var(--space-8)',
            marginTop: 'var(--space-8)',
          }}>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-lg)',
              fontWeight: 400,
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-4)',
            }}>
              {t('heading')}
            </p>
            <a
              href="#contact"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--accent-lichen)',
                textDecoration: 'none',
                borderBottom: '1px solid currentColor',
                paddingBottom: '2px',
              }}
            >
              {t('cta')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 8.2 — Verify build**

```powershell
npm run build
```

- [ ] **Step 8.3 — Commit**

```powershell
git add src/components/sections/Services/index.tsx
git commit -m "feat(services): new collaboration systems section — expand rows, sticky photo, GSAP stagger"
```

---

### Task 9: Contact Section — New Ecosystem

**Files:**
- Modify: `src/components/sections/Contact/index.tsx`

- [ ] **Step 9.1 — Rewrite Contact with full-bleed photo, SVG filaments and SplitText**

Replace entire `src/components/sections/Contact/index.tsx`:

```typescript
'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap-config';

const FILAMENTS = [
  'M 15% 20% Q 35% 8%  60% 35%',
  'M 80% 15% Q 70% 30% 55% 45%',
  'M 5%  50% Q 20% 40% 40% 55%',
  'M 90% 40% Q 75% 50% 58% 48%',
  'M 25% 10% Q 40% 25% 50% 40%',
  'M 70% 70% Q 60% 55% 52% 47%',
  'M 10% 75% Q 25% 60% 45% 55%',
  'M 85% 80% Q 72% 65% 58% 52%',
  'M 40% 5%  Q 48% 20% 50% 38%',
  'M 60% 90% Q 58% 70% 53% 55%',
];

export default function Contact() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const bodyRef     = useRef<HTMLDivElement>(null);
  const svgRef      = useRef<SVGSVGElement>(null);
  const t = useTranslations('contact');

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      gsap.set([headingRef.current, bodyRef.current], { opacity: 1 });
      return;
    }

    // Heading line reveal
    const split = new SplitText(headingRef.current, { type: 'lines', linesClass: 'line-wrap' });
    split.lines.forEach(line => {
      (line as HTMLElement).style.overflow = 'hidden';
    });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
    });

    tl.from(split.lines, {
      y: '100%', opacity: 0, stagger: 0.08, duration: 1, ease: 'power4.out', delay: 0.3,
    });
    tl.from(bodyRef.current!.children, {
      opacity: 0, y: 16, stagger: 0.15, duration: 0.7, ease: 'power3.out',
    }, '-=0.4');

    // SVG filaments — stroke-dashoffset technique
    const paths = svgRef.current ? Array.from(svgRef.current.querySelectorAll('path')) : [];
    paths.forEach(path => {
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    });
    gsap.to(paths, {
      strokeDashoffset: 0,
      duration: 2.5,
      ease: 'power2.inOut',
      stagger: { each: 0.3, from: 'end' },
      delay: 0.5,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', once: true },
    });

    return () => split.revert();
  }, { scope: sectionRef });

  return (
    <section
      id="contact"
      ref={sectionRef}
      data-theme="dark"
      className="with-grain"
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
      }}
    >
      {/* Background photo */}
      <Image
        src="/photos/lichen-contact.jpg"
        alt="Usnea lichen hanging, white filaments against dark bokeh"
        fill
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        sizes="100vw"
        priority={false}
      />
      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(9,13,9,0.92) 0%, rgba(9,13,9,0.6) 50%, rgba(9,13,9,0.4) 100%)',
        zIndex: 1,
      }} />

      {/* SVG filaments */}
      <svg
        ref={svgRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none' }}
        aria-hidden
      >
        {FILAMENTS.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke={`rgba(122,173,94,${i < 3 ? '0.35' : i < 6 ? '0.18' : '0.08'})`}
            strokeWidth="0.8"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        padding: 'var(--section-padding-y) var(--container-padding) clamp(4rem, 8vw, 7rem)',
        maxWidth: 'var(--container-max)',
      }}>
        <h2
          ref={headingRef}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-hero)',
            fontWeight: 400,
            lineHeight: 0.88,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-12)',
          }}
        >
          {t('heading')}
        </h2>

        <div ref={bodyRef}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-technical)',
            marginBottom: 'var(--space-4)',
          }}>
            {t('available')}
          </p>

          <a
            href={`mailto:${t('email')}`}
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
              fontWeight: 400,
              color: 'var(--text-primary)',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(242,237,230,0.25)',
              paddingBottom: '3px',
              marginBottom: 'var(--space-8)',
              transition: 'border-color 250ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(122,173,94,0.6)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(242,237,230,0.25)')}
          >
            {t('email')}
          </a>

          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            color: 'rgba(242,237,230,0.55)',
          }}>
            <a href="https://github.com/jazorro11" target="_blank" rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'none', transition: 'opacity 200ms ease' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.55')}
            >
              GitHub
            </a>
            {' · '}
            <a href="https://linkedin.com/in/julio-zorro" target="_blank" rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'none', transition: 'opacity 200ms ease' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.55')}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Language info — bottom right */}
      <p style={{
        position: 'absolute',
        bottom: '2rem',
        right: 'var(--container-padding)',
        zIndex: 3,
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-xs)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--text-technical)',
      }}>
        {t('languageInfo')}
      </p>
    </section>
  );
}
```

- [ ] **Step 9.2 — Verify build**

```powershell
npm run build
```

- [ ] **Step 9.3 — Commit**

```powershell
git add src/components/sections/Contact/index.tsx
git commit -m "feat(contact): full-bleed lichen photo, SVG filaments with stroke-dashoffset, SplitText heading"
```

---

## Phase 5 — Composition & Cleanup

---

### Task 10: Navigation Update

**Files:**
- Modify: `src/components/ui/Nav/index.tsx`

- [ ] **Step 10.1 — Update Nav: Archivo font, lichen toggle, remove amber references**

Replace `src/components/ui/Nav/index.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import LanguageToggle from '../LanguageToggle';
import { getLenis } from '@/lib/lenis-instance';

export default function Nav() {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#about',    label: t('about') },
    { href: '#work',     label: t('work') },
    { href: '#services', label: t('services') },
    { href: '#contact',  label: t('contact') },
  ];

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(href, { offset: -72, duration: 1.2 });
    else document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 'var(--z-nav)' as string,
        padding: '20px var(--container-padding)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'background 300ms ease, backdrop-filter 300ms ease',
        background: scrolled ? 'rgba(9,13,9,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <a
        href="#hero"
        onClick={e => handleNavClick(e, '#hero')}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-sm)',
          fontWeight: 400,
          color: 'var(--text-primary)',
          textDecoration: 'none',
          letterSpacing: '-0.02em',
        }}
      >
        JZ
      </a>

      <ul className="nav-links" style={{ display: 'flex', gap: '2rem', listStyle: 'none', alignItems: 'center', margin: 0, padding: 0 }}>
        {links.map(({ href, label }) => (
          <li key={href} className="nav-link-item">
            <a
              href={href}
              onClick={e => handleNavClick(e, href)}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-technical)',
                textDecoration: 'none',
                transition: 'color 200ms ease',
                padding: '12px 0',
                display: 'inline-block',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-technical)')}
            >
              {label}
            </a>
          </li>
        ))}
        <li><LanguageToggle /></li>
      </ul>

      <style>{`
        @media (max-width: 640px) { .nav-link-item { display: none !important; } }
      `}</style>
    </nav>
  );
}
```

- [ ] **Step 10.2 — Update LanguageToggle to lichen styling**

Open `src/components/ui/LanguageToggle/index.tsx`. Find the button's style and replace any amber/pill styling with:

```typescript
// Replace existing button style with:
style={{
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-xs)',
  color: 'var(--accent-lichen)',
  background: 'none',
  border: 'none',
  borderBottom: '1px solid rgba(122,173,94,0.4)',
  paddingBottom: '1px',
  cursor: 'pointer',
  transition: 'opacity 200ms ease',
}}
```

- [ ] **Step 10.3 — Verify build**

```powershell
npm run build
```

- [ ] **Step 10.4 — Commit**

```powershell
git add src/components/ui/Nav/index.tsx src/components/ui/LanguageToggle/index.tsx
git commit -m "feat(nav): Archivo font, lichen language toggle, add services link, remove Capabilities link"
```

---

### Task 11: Page Composition & i18n

**Files:**
- Modify: `src/app/[locale]/page.tsx`
- Modify: `messages/en.json`
- Modify: `messages/es.json`

- [ ] **Step 11.1 — Update page.tsx: add Services, remove Capabilities**

Replace `src/app/[locale]/page.tsx`:

```typescript
'use client';

import Hero     from '@/components/sections/Hero';
import About    from '@/components/sections/About';
import Work     from '@/components/sections/Work';
import Services from '@/components/sections/Services';
import Contact  from '@/components/sections/Contact';
import Nav      from '@/components/ui/Nav';
import CustomCursor  from '@/components/ui/CustomCursor';
import SmoothScroll  from '@/components/ui/SmoothScroll';

export default function HomePage() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <Nav />
      <main>
        <Hero />
        <About />
        <Work />
        <Services />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
```

- [ ] **Step 11.2 — Add services and updated contact keys to messages/en.json**

In `messages/en.json`, add after the `"work"` block and update `"contact"`:

```json
"services": {
  "label": "Collaboration Systems",
  "heading": "Have a system in mind?",
  "cta": "Start a conversation",
  "items": {
    "ai": {
      "title": "AI Engineering",
      "description": "LangGraph and LangChain agents with memory, tool use, and structured reasoning. From prototype to production API."
    },
    "fullstack": {
      "title": "Full Stack Development",
      "description": "Complete web applications with Next.js, React, and TypeScript. Backend with Node.js, Python, and PostgreSQL. Clean architecture, real performance."
    },
    "interfaces": {
      "title": "Interactive Interfaces",
      "description": "Animated interfaces with GSAP, Three.js, and WebGL. Motion that earns its presence. Portfolios, landing pages, product experiences."
    },
    "consulting": {
      "title": "Technical Consulting & Prototypes",
      "description": "AI system architecture, stack review, and rapid proof of concepts. For teams that need to validate before they build."
    }
  }
}
```

Update `"contact"` in `messages/en.json`:

```json
"contact": {
  "label": "Contact",
  "heading": "New Ecosystem",
  "email": "jzorroperez@gmail.com",
  "available": "Open to collaboration · Available from July 2026",
  "languageInfo": "Available in · ES / EN"
}
```

Also update `"nav"` to add services and remove capabilities:

```json
"nav": {
  "about": "About",
  "work": "Work",
  "services": "Services",
  "contact": "Contact"
}
```

- [ ] **Step 11.3 — Add Spanish translations to messages/es.json**

In `messages/es.json`, apply the same structure changes:

```json
"nav": {
  "about": "Sobre mí",
  "work": "Trabajo",
  "services": "Servicios",
  "contact": "Contacto"
},
"services": {
  "label": "Sistemas de Colaboración",
  "heading": "¿Tienes un sistema en mente?",
  "cta": "Iniciar conversación",
  "items": {
    "ai": {
      "title": "AI Engineering",
      "description": "Agentes con LangGraph y LangChain: memoria, herramientas y razonamiento estructurado. Del prototipo a la API en producción."
    },
    "fullstack": {
      "title": "Full Stack Development",
      "description": "Aplicaciones web completas con Next.js, React y TypeScript. Backend con Node.js, Python y PostgreSQL. Arquitectura limpia, performance real."
    },
    "interfaces": {
      "title": "Interfaces Interactivas",
      "description": "Interfaces animadas con GSAP, Three.js y WebGL. Movimiento con propósito. Portafolios, landing pages, experiencias de producto."
    },
    "consulting": {
      "title": "Consultoría Técnica y Prototipos",
      "description": "Arquitectura de sistemas AI, revisión de stack y pruebas de concepto rápidas. Para equipos que necesitan validar antes de construir."
    }
  }
},
"contact": {
  "label": "Contacto",
  "heading": "Nuevo Ecosistema",
  "email": "jzorroperez@gmail.com",
  "available": "Abierto a colaboración · Disponible desde julio 2026",
  "languageInfo": "Disponible en · ES / EN"
}
```

- [ ] **Step 11.4 — Verify build**

```powershell
npm run build
```

Expected: Build passes. No TypeScript errors about missing i18n keys.

- [ ] **Step 11.5 — Commit**

```powershell
git add src/app/[locale]/page.tsx messages/en.json messages/es.json
git commit -m "feat: compose page with Services, update nav links, add services+contact i18n keys"
```

---

### Task 12: Cleanup

**Files:**
- Delete: `src/components/sections/Capabilities/index.tsx`
- Delete: `src/components/ui/AmbientBackground/index.tsx`
- Verify: no remaining Framer Motion or amber token references

- [ ] **Step 12.1 — Delete removed components**

```powershell
Remove-Item "src\components\sections\Capabilities\index.tsx"
Remove-Item "src\components\ui\AmbientBackground\index.tsx" -ErrorAction SilentlyContinue
```

- [ ] **Step 12.2 — Verify no Framer Motion imports remain**

```powershell
Select-String -Path "src\**\*.tsx","src\**\*.ts" -Pattern "framer-motion|motion\." -Recurse
```

Expected: Zero matches. If any appear, open the file and remove the import + replace with GSAP equivalent.

- [ ] **Step 12.3 — Verify no amber/old color token references remain**

```powershell
Select-String -Path "src\**\*.tsx","src\**\*.ts","src\**\*.css" -Pattern "FF8C42|3B82F6|color-dark-2|color-light|color-accent-2|F5F1EB|0d0d1f|080810" -Recurse
```

Expected: Zero matches or only comments. Fix any active references to old palette tokens.

- [ ] **Step 12.4 — Final build**

```powershell
npm run build
```

Expected: Clean build, zero errors.

- [ ] **Step 12.5 — Final commit**

```powershell
git add -A
git commit -m "chore: remove Capabilities and AmbientBackground components, confirm no legacy tokens"
```

---

## Self-Review

### Spec coverage check

| Spec requirement | Task |
|-----------------|------|
| Replace Framer Motion with GSAP | Task 3, Task 12 |
| Gloock + Archivo fonts | Task 1 |
| Bioma Digital tokens | Task 2 |
| WebGL fBm biological shader | Task 4 |
| Hero GSAP SplitText timeline | Task 5 |
| About parallax + chapters | Task 6 |
| Work sticky photo + specimens | Task 7 |
| ChatMockup restyle | Task 7 |
| Services new section | Task 8 |
| Contact full-bleed + filaments | Task 9 |
| Nav lichen toggle | Task 10 |
| i18n services keys | Task 11 |
| Capabilities merged into About | Task 6 (inline tech list) |
| AmbientBackground removed | Task 12 |
| Photos in public/photos/ | Task 1 |
| grain overlay | Task 2 |
| prefers-reduced-motion | Tasks 5, 6, 7, 8, 9 |
| CustomEase biome curves | Task 3 |

All spec requirements covered.

### Type consistency check

- `gsap-config.ts` exports: `gsap`, `ScrollTrigger`, `SplitText`, `CustomEase`, `useGSAP` — all imported with the same names across Hero, About, Work, Services, Contact.
- CustomEase names: `'biome.grow'`, `'biome.settle'`, `'biome.breathe'` — registered in Task 3, used in Task 5.
- Photo paths: `'/photos/moss-hero.jpg'`, `'/photos/specimen-work.jpg'`, `'/photos/forest-about.jpg'`, `'/photos/frailejón-services.jpg'`, `'/photos/lichen-contact.jpg'` — consistent with Task 1 copy commands.
- i18n namespace `'services'` with keys `items.ai`, `items.fullstack`, `items.interfaces`, `items.consulting` — consistent between Services component and messages/en.json.
