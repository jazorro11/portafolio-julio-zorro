# Bioma Digital — Portfolio Redesign Spec

**Date:** 2026-05-31
**Author:** Julio Zorro Pérez
**Status:** Approved — ready for implementation

---

## 1. Concept

**Bioma Digital** is a portfolio conceived as a living digital ecosystem — where code, artificial intelligence, and nature-inspired design converge to create a functional, sensory, and memorable experience.

The central proposition: Julio Zorro Pérez builds digital systems that don't just work — they evolve, connect, and respond like living organisms.

**Physical object reference:** Field identification cards from a Colombian natural history museum — bond paper, scientific catalog typography, specimen numbers in bold, scanned handwritten field notes.

**Color reference:** Atlas de Colombia (IGAC) — aged paper backgrounds with geographic color, cartographic green, field notations in sepia ink.

---

## 2. Stack Decisions

### Keep
- Next.js 16 + React 19 + TypeScript 5
- GSAP 3.15 (expand usage — see Section 6)
- Lenis 1.3.23 (smooth scroll)
- Three.js 0.184.0 (WebGL hero)
- next-intl 4.12.0 (EN/ES)
- Tailwind CSS 4 (base utilities)
- JetBrains Mono (already installed)

### Remove
- **Framer Motion** — eliminate completely; GSAP takes full control of all animations

### Add
- `@gsap/react` — `useGSAP()` hook for proper React cleanup
- **Gloock** (Google Fonts) — display serif
- **Archivo** (Google Fonts) — body sans-serif

### GSAP Plugins (all free since v3.12)
| Plugin | Use |
|--------|-----|
| `ScrollTrigger` | All scroll-based animations, parallax, scrub |
| `SplitText` | Hero name reveal (chars), section headings (lines) |
| `CustomEase` | Organic growth curves |
| `@gsap/react` | `useGSAP()` hook + cleanup |

**No paid Club plugins.** DrawSVG is replaced with native SVG `stroke-dashoffset` technique.

---

## 3. Visual System

### Color Tokens

```css
--bg-deep:         #090d09;   /* near-black with minimal green channel */
--bg-surface:      #111710;   /* panels, featured specimen background */
--accent-lichen:   #7aad5e;   /* primary accent — lichen green */
--accent-cork:     #c8a96e;   /* secondary accent — amber/cork */
--text-primary:    #f2ede6;   /* warm white */
--text-technical:  #5a7a5a;   /* muted green-grey — labels, coordinates */
--text-muted:      #3a4a3a;   /* decorative, secondary */
```

### Typography

| Role | Family | Weight | Usage |
|------|--------|--------|-------|
| Display / Serif | Gloock | 400 (regular + italic) | Hero heading, section headings only |
| Body | Archivo | 400, 500 | Paragraphs, nav, UI copy |
| Mono / Technical | JetBrains Mono | 400 | Specimen labels, coordinates, stack tags — Hero and Work sections only |

**Reflex-reject fonts eliminated:** Cormorant Garamond (was proposed), DM Sans (was proposed).
**Rule:** JetBrains Mono is NOT used in About, Services, or Contact — only Hero and Work.

### Texture
- CSS grain overlay: SVG `feTurbulence` filter, `opacity: 0.04`, applied via `::before` pseudo-element on root
- No decorative ambient orbs (AmbientBackground component removed)

### Photography Assignments

| File | Sección | Treatment |
|------|---------|-----------|
| DSC_0088 — moss macro, dark bokeh | Hero | WebGL shader texture reference |
| DSC_0444 — millipede on green moss | Work | Full-width sticky header |
| DSC_0377 — tropical forest with waterfall | About | Parallax scrub background |
| DSC_0684 — frailejón páramo plant | Services | Sticky column left |
| DSC_0682 — white Usnea lichen | Contact | Full-bleed background |
| DSC_0569 — wet sand with ripples | Transitions / texture | Section dividers |
| DSC_0478 — dandelion seed head | Lab (future) | Reserved |

### data-theme
All sections use `data-theme="dark"`. The previous dark/light alternation (About and Work on light `#F5F1EB`) is eliminated.

---

## 4. Section Architecture

### Navigation Flow
```
Hero (Entry Point)
About (Field Notes)
Work (Digital Specimens)
Services (Collaboration Systems)  ← NEW
Contact (New Ecosystem)
```

**Capabilities section** is merged into About (Field Notes) as a condensed technical profile block after the three chapters (Act 2 end). It becomes a single-row inline list of stack categories in Archivo `var(--text-sm)`, `--text-technical`, separated by `·`. No grid, no cards. Hardware/IoT content becomes a footnote line. This removes it as a standalone section, reducing scroll fatigue and keeping the narrative tighter.

---

## 5. Section Specifications

### 5.1 Hero — Entry Point

**WebGL Layer (Three.js):**
- Replace current amber/blue particle system (1200 points) with organic biological field shader
- `ShaderMaterial` with fBm (fractal brownian motion) noise
- Colors extracted from DSC_0088: lichen green on `#090d09`
- Slow respiratory movement: amplitude `0.02`, cycle ~4s
- Mouse interaction: subtle field distortion via `uMouse` uniform
- Scroll behavior: ScrollTrigger scrub — shader zooms out and fades as user scrolls

**HTML Layer (over WebGL):**
```
[JetBrains Mono, 11px, --text-technical]
FIELD_LOG · 04°42'N 74°08'W · BIOME_001

[Gloock display, clamp(5rem, 10vw, 9rem), --text-primary]
Julio
Zorro

[Archivo, tracking 0.15em uppercase, --text-technical]
AI ENGINEER · FULL STACK DEVELOPER · SOFTWARE ENGINEER

[Archivo, --accent-lichen]
→ Enter the biome
```

**Entry Timeline (GSAP):**
```
t=0.0s  WebGL fade in (opacity 0→1, 1.2s, power2.out)
t=0.6s  Coordinates + FIELD_LOG (y: 8→0, opacity 0→1)
t=1.0s  "Julio" — SplitText chars, stagger 0.04s
t=1.4s  "Zorro" — same stagger, 80ms after
t=1.9s  Tagline opacity 0→1 (no letter-spacing animation)
t=2.3s  CTA with border-bottom growing left-to-right (scaleX on pseudo-element)
t=2.6s  Scroll indicator pulse loop (scale, sine.inOut)
```

All eases: `power3.out` or CustomEase growth curve (slow start, peak at midpoint, soft end).

**Scroll behavior (ScrollTrigger scrub):**
- 30% scroll: text `y: -60px`, `opacity: 0.6`
- 60% scroll: camera `z += 2.0`
- 80% scroll: full hero `opacity: 0`

**SpecimenLabel system:** `FIELD_LOG · 04°42'N 74°08'W · BIOME_001` is the only coordinate label in the Hero. This pattern appears once per section maximum. In Hero and Work only.

---

### 5.2 About — Field Notes

**Act 1: Photography with text (70vh)**

- DSC_0377 at `height: 120%`, `width: 100%`, `object-fit: cover`, `position: absolute`
- Parallax scrub:
  ```javascript
  gsap.to(".about-photo img", {
    yPercent: -15,
    ease: "none",           // required for scrub
    scrollTrigger: { trigger: ".about-photo-wrapper", start: "top top", end: "bottom top", scrub: true }
  });
  ```
- Overlay: `linear-gradient(to bottom, rgba(9,13,9,0) 30%, rgba(9,13,9,0.85) 80%, #090d09 100%)`
- Heading: Gloock italic, `clamp(2rem, 4vw, 3.5rem)`, positioned `bottom / left` over photo
- SplitText `type: "lines"` on heading, `stagger: 0.15s`, `power3.out`
- **No section label above the H2** — the photo provides context

**Bisagra (photo → chapters) — one metadata line:**
```
NOTAS DE CAMPO — JULIO ZORRO PÉREZ
2019–2025  /  BOGOTÁ, COLOMBIA
```
Archivo, 10px, `--text-technical`. Only occurrence of technical metadata in About.

**Act 2: Three field chapters (asymmetric)**

| Chapter | Alignment | Text opacity | Notes |
|---------|-----------|-------------|-------|
| 01 — Hardware & IoT | Left, `max-width: 680px` | 0.65 | Nature Scientific Reports link as italic footnote |
| 02 — Universidad Santo Tomás | Right (`margin-left: auto`, `max-width: 580px`) | 0.55 | Parenthetical chapter — slightly dimmer |
| 03 — Now | Center (`margin: 0 auto`, `max-width: 520px`) | 0.8 | Larger heading, lichen `#7aad5e` on number `03` |

**No card containers.** Background: transparent on `#090d09`. Separation: whitespace only.

**Chapter number style:** Archivo (not JetBrains Mono), 10px, `--text-technical`, above each chapter title.

**ScrollTrigger.batch() for chapters:**
```javascript
ScrollTrigger.batch(".field-chapter", {
  onEnter: (batch) => gsap.fromTo(batch,
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", stagger: 0.18 }
  ),
  start: "top 88%", once: true
});
```

**What to remove from current code:**
- `border-left` on quote callout block
- `clipPath: inset(0 0 100% 0)` reveal on chapter cards
- `AmbientBackground` component with amber orbs
- Data-theme light (`#F5F1EB`) background

---

### 5.3 Work — Digital Specimens

**Section Header (sticky):**
- DSC_0444 full-width, `height: clamp(40vh, 50vh, 55vh)`, `position: sticky`, `top: 0`, `z-index: 0`
- Overlay: `linear-gradient(to bottom, transparent 0%, rgba(9,13,9,0.3) 60%, #090d09 100%)`
- SpecimenLabel (only one, positioned `absolute bottom-left` over image):
  ```
  ESPECÍMENES DIGITALES — CAMPO 2019–2025
  9°01'N 79°31'W  /  3 REGISTROS CATALOGADOS
  ```
  JetBrains Mono, 11px, `--text-technical`
- Alt text: `"Millipede coiled on green moss — field specimen, Bioma Digital collection"`
- **No JavaScript parallax** — sticky CSS is sufficient and more performant

**Intro block (below image):**
- Grid `1fr 2fr`, left: "Work" in Gloock italic `clamp(3.5rem, 7vw, 6rem)`, right: brief positioning sentence in Archivo `rgba(242,237,230,0.65)`, `max-width: 52ch`

**Specimen 01 — LangGraph Agent (featured):**
- `background: #0d120d`, `border: 1px solid rgba(122,173,94,0.12)`, `border-radius: 3px`
- Grid `1fr 1fr`, gap `clamp(2rem, 4vw, 4rem)`
- Left column — ficha:
  - `ESP-001` (JetBrains Mono 11px, `--text-technical`)
  - Title: Gloock `clamp(2rem, 3.5vw, 3rem)` (SplitText `type: "lines"` on scroll enter)
  - Type / Status in Archivo
  - Description in Archivo `max-width: 45ch`, `rgba(242,237,230,0.7)`
  - Stack in Archivo (not mono)
  - Links in JetBrains Mono 11px, `--accent-lichen`
- Right column: ChatMockup component (redesigned colors — dark bg, lichen borders)
- Counter animation on `ESP-001`: `gsap.to(counter, { innerText: 1, snap: { innerText: 1 }, duration: 0.6 })`

**Specimen 02 — Sinergia:**
- No container background, `border-top: 1px solid rgba(122,173,94,0.1)` only
- `display: flex`, `justify-content: space-between` — number + title left, data right
- Accent: `--accent-lichen`

**Specimen 03 — HAZ:**
- Same separator. Layout inverted: description left, catalog number + title right
- Accent: `--accent-cork` `#c8a96e` (terra tones, differentiates from Sinergia)

**ScrollTrigger.batch() for specimens:**
```javascript
ScrollTrigger.batch(".specimen-item", {
  onEnter: (batch) => gsap.fromTo(batch,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.9, ease: "power4.out", stagger: 0.12 }
  ),
  start: "top 85%", once: true
});
```

**What to remove from current code:**
- Framer Motion variants on Work cards
- `data-theme="light"` / `#F5F1EB` background
- `AmbientBackground` component with orbs

---

### 5.4 Services — Collaboration Systems (NEW SECTION)

**Layout: 2-column with sticky photo**
- Left column (42%): DSC_0684 (`position: sticky`, `top: var(--section-padding-y)`, `height: fit-content`)
  - Parallax: `gsap.to(photo, { y: -40, ease: "none", scrollTrigger: { scrub: 1 } })`
  - Hover caption (Archivo `var(--text-xs)`, `--text-technical`): *"Frailejón — endémica del páramo. Crece 1cm por año."*
- Right column (58%): four expand rows

**Expand rows (no identical cards):**
Each row is a full-width element. Default state: number + title visible. Expanded: + description + availability.

Expansion mechanism: `grid-template-rows: 0fr → 1fr` in CSS (transition, not GSAP for the expand itself).

```
[Archivo 14px, --text-technical]    01
[Gloock 400, clamp(1.4rem–2rem)]    AI Engineering
[Archivo body, expanded]            Description (max 65ch)
[Archivo sm, --accent-lichen]       Compromiso mínimo: 3 semanas
```

**Services content:**
| # | Title | Scope |
|---|-------|-------|
| 01 | AI Engineering | LangGraph, LangChain agents, pipelines, API to production |
| 02 | Full Stack Development | Next.js, React, TypeScript, Node.js, Python, PostgreSQL |
| 03 | Interactive Interfaces | GSAP, Three.js, WebGL, motion that justifies its presence |
| 04 | Technical Consulting & Prototypes | Architecture, stack review, rapid POCs |

**CTA:**
- `border-top: 1px solid rgba(122,173,94,0.2)` separator
- Heading: Gloock `var(--text-lg)`: *"¿Tienes un sistema en mente?"* / *"Have a system in mind?"*
- Anchor to `#contact`: Archivo, uppercase, `letter-spacing: 0.12em`, `--accent-lichen`, `border-bottom: 1px solid currentColor` only (no background, no pill)

**GSAP animations:**
```javascript
// Photo entrance
gsap.from(photoCol, { opacity: 0, x: -30, duration: 1, ease: "power3.out",
  scrollTrigger: { trigger: section, start: "top 80%", once: true }
});

// Rows stagger
gsap.from(rows, { opacity: 0, y: 24, stagger: 0.1, duration: 0.7, ease: "power3.out",
  scrollTrigger: { trigger: rowsContainer, start: "top 75%", once: true }
});

// Expand indicator
gsap.from(indicator, { opacity: 0, x: -8, duration: 0.4, ease: "power2.out", delay: 0.1 });

// Row hover
row.addEventListener("mouseenter", contextSafe(() =>
  gsap.to(number, { x: 4, duration: 0.2, ease: "power2.out" })
));
```

**No JetBrains Mono** in this section. Numbers in Archivo.

---

### 5.5 Contact — New Ecosystem

**Background:**
- DSC_0682 full-bleed: `position: absolute; inset: 0; object-fit: cover; z-index: 0`
- Overlay: `linear-gradient(to top, rgba(9,13,9,0.92) 0%, rgba(9,13,9,0.6) 50%, rgba(9,13,9,0.4) 100%)`
- Content: `position: relative; display: flex; flex-direction: column; justify-content: flex-end; padding-bottom: clamp(4rem, 8vw, 7rem)`
- Content aligned **bottom-left** (not centered — avoids competing with lichen focal point in upper-right)

**Heading:**
- Text EN: *"New Ecosystem"* / ES: *"Nuevo Ecosistema"*
- Gloock 400, `clamp(3.5rem, 8vw, 8rem)`, `line-height: 0.88`, `letter-spacing: -0.02em`
- SplitText `type: "lines"` with `overflow: hidden` on parent
- Reveal: `gsap.from(lines, { y: "100%", opacity: 0, stagger: 0.08, duration: 1, ease: "power4.out", delay: 0.3 })`

**Email:**
- `<a href="mailto:jzorroperez@gmail.com">`
- Gloock 400, `var(--text-2xl)` to `var(--text-3xl)`, `--text-primary`
- Style: no underline, `border-bottom: 1px solid rgba(242,237,230,0.25)` default
- Hover: border color → `rgba(122,173,94,0.6)`, transition 250ms (border only, text color stays)
- Above email in Archivo `var(--text-sm)`, `--text-technical`: *"Abierto a colaboración · Disponible desde julio 2026"*

**Social links:**
- Archivo regular `var(--text-sm)`, `rgba(242,237,230,0.55)`, separated by `·`
- *"GitHub · LinkedIn"* — full names, no icons, no arrows
- Hover: opacity 1, transition 200ms

**Organic network (SVG filaments):**
- 10-12 curved `<path>` elements, `stroke: rgba(122,173,94,0.18)`, `strokeWidth: 0.8`, no fill
- Converge loosely toward heading area from scattered positions
- Animated with `stroke-dashoffset` (no DrawSVG plugin needed):
  ```javascript
  paths.forEach(path => {
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
  });
  gsap.to(paths, {
    strokeDashoffset: 0, duration: 2.5, ease: "power2.inOut",
    stagger: { each: 0.3, from: "end" },
    scrollTrigger: { trigger: "#contact", start: "top 60%", once: true }
  });
  ```
- Filaments grow once, stay static — no idle loop

**Language metadata (informational only):**
- Absolute positioned `bottom: 2rem; right: var(--container-padding)`
- Archivo `var(--text-xs)`, `--text-technical`: *"Disponible en · ES / EN"*
- Not a functional button — toggle lives in nav only

**Language toggle nav update:**
- Archivo regular, no pill border-radius
- `border-bottom: 1px solid rgba(122,173,94,0.4)`, color `--accent-lichen`
- Replaces current amber pill

**Full entrance sequence:**
```
t=0.0s  Overlay fade in (opacity 0→1, 1.5s, power2.out)
t=0.3s  Heading lines y: "100%" → 0, stagger 0.08s
t=0.9s  Availability text + email (opacity 0→1, y: 16→0, stagger 0.15s)
t=1.2s  Social links (opacity 0→1)
t=0.5s  SVG filaments strokeDashoffset → 0, stagger 0.3s (parallel track)
```

---

## 6. Animation Architecture

### Core Pattern (all sections)

```typescript
// Each section component
const sectionRef = useRef<HTMLElement>(null);

useGSAP(() => {
  // All GSAP code here — auto-cleaned up on unmount
}, { scope: sectionRef });
```

### Lenis + ScrollTrigger Proxy (keep existing)

```typescript
// SmoothScroll/index.tsx — keep as-is
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

### Ease Catalog

```javascript
// Register once at app root
CustomEase.create("biome.grow",   "M0,0 C0.1,0 0.2,1 1,1");        // slow start, fast peak
CustomEase.create("biome.settle", "M0,0 C0.25,0.1 0.25,1 1,1");    // power3.out equivalent
CustomEase.create("biome.breathe","M0,0 C0.45,0 0.55,1 1,1");      // symmetric, for loops
```

### GSAP Registration (app root)

```typescript
// src/app/[locale]/layout.tsx or a client-side init file
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP);
```

### prefers-reduced-motion

```typescript
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!prefersReduced) {
  // run GSAP animations
} else {
  // set final states immediately with gsap.set()
}
```

---

## 7. New Design Tokens (tokens.css updates)

```css
:root {
  /* Replace existing accent colors */
  --color-accent-primary:   #7aad5e;   /* was #FF8C42 amber */
  --color-accent-secondary: #c8a96e;   /* was #3B82F6 blue */
  --color-bg-deep:          #090d09;   /* new */
  --color-bg-surface:       #111710;   /* new */
  --color-text-technical:   #5a7a5a;   /* new */

  /* Font families — add to existing */
  --font-display: 'Gloock', Georgia, serif;    /* replaces Satoshi for display */
  --font-body:    'Archivo', system-ui, sans-serif; /* replaces Satoshi for body */
  --font-mono:    'JetBrains Mono', monospace; /* unchanged */
}
```

---

## 8. Sections Removed / Consolidated

| Original | Action |
|----------|--------|
| Capabilities | Merged into About as condensed technical profile |
| AmbientBackground component | Removed entirely |
| Framer Motion | Package removed from dependencies |
| data-theme="light" sections | Eliminated — all dark |

---

## 9. i18n Keys to Add

Services section requires new i18n entries in `messages/en.json` and `messages/es.json`:

```json
"services": {
  "label": "Collaboration Systems",
  "heading": "Have a system in mind?",
  "cta": "Start a conversation",
  "items": {
    "ai": { "title": "AI Engineering", "description": "AUTHOR: write 2–3 sentences about LangGraph, LangChain agents, pipelines, API to production", "availability": "Min. commitment: 3 weeks" },
    "fullstack": { "title": "Full Stack Development", "description": "AUTHOR: write 2–3 sentences about Next.js, React, TypeScript, Node.js, Python, PostgreSQL", "availability": "Full project: 4–10 weeks" },
    "interfaces": { "title": "Interactive Interfaces", "description": "AUTHOR: write 2–3 sentences about GSAP, Three.js, WebGL, animated portfolios and product experiences", "availability": "Animation sprint: 1–3 weeks" },
    "consulting": { "title": "Technical Consulting & Prototypes", "description": "AUTHOR: write 2–3 sentences about architecture reviews, stack decisions, rapid POCs", "availability": "Initial session: 1 week" }
  }
}
```

Contact section requires update:
```json
"contact": {
  "heading": "New Ecosystem",
  "availability": "Open to collaboration · Available from July 2026",
  "languageInfo": "Available in · ES / EN"
}
```

---

## 10. Implementation Notes

1. **Framer Motion removal:** Delete from `package.json`, remove all imports. Audit every `motion.div` and replace with `<div ref>` + `useGSAP`.
2. **Photos in `public/`:** Copy DSC_0088, DSC_0444, DSC_0377, DSC_0684, DSC_0682, DSC_0569 from `C:\Users\jzorr\Desktop\FotosPersonal\` into `public/photos/`. Use `next/image` with appropriate `sizes` and `priority` props.
3. **WebGL shader:** Rewrite `Hero/WebGLScene.tsx` — replace particle system with `ShaderMaterial` + fBm noise. Extract green palette from DSC_0088 as uniform colors.
4. **ChatMockup redesign:** Keep component logic, restyle to match `--bg-surface #0d120d` + lichen borders.
5. **Services component:** New file `src/components/sections/Services/index.tsx` with expand row pattern.
6. **Capabilities component:** Delete file. Move tech skills data into About component.
7. **SplitText cleanup:** Always revert in `useGSAP` cleanup or `ScrollTrigger.once: true`. Avoid re-splitting on resize unless necessary.
8. **Font loading:** Add Gloock and Archivo to `src/app/layout.tsx` via `next/font/google`.
