# Bioma Digital — Rediseño Océano Bioluminiscente

**Fecha:** 2026-06-01  
**Proyecto:** Portafolio Julio Zorro  
**Stack:** Next.js 16 · React 19 · GSAP 3.15 · Lenis · Framer Motion · TypeScript  
_(Three.js eliminado — ver sección Limpieza)_

---

## Concepto

El scroll no mueve texto — hace descender un anzuelo verticalmente a través del océano profundo. El anzuelo es el guía visual del usuario. La metáfora: el usuario es el pescador que desciende desde la superficie nocturna hasta las Trincheras de las Marianas.

**Referencia visual:** ilustración 2D estilo flat con glow bioluminiscente. Astronauta con visor oscuro sosteniendo lupa/linterna. Colores profundos: azul marino, cian, magenta, violeta. Fondos casi negros con partículas de luz.

---

## Decisiones de Diseño Aprobadas

| Decisión | Elección |
|----------|----------|
| Técnica de scroll | **Híbrido** — Hero pinned (200vh) + resto scroll normal con parallax |
| Fondos | **CSS/SVG base** + MCP magic solo para astronauta y cofre |
| Paleta | **Amber + Bioluminiscente** — amber es la identidad, cyan/magenta son el ecosistema |
| Mobile | **Hilo en borde izquierdo** (left: 12px) como línea de tiempo vertical |
| Hilo desktop | **left: 32%** — texto empieza desde 38%, máximo aire al contenido |

---

## Arquitectura del Sistema

### Árbol de Componentes

```
OceanSystem (Provider)
├── FishingThread          — SVG fixed, hilo + hook, depth-driven, aria-hidden
├── Hero                   — pinned 200vh, lanzamiento del anzuelo
├── About                  — aguas someras, medusas SVG
├── Stack                  — arrecife, corales reactivos
├── Work/Projects          — abismo, astronauta MCP magic
└── Contact                — trinchera, cofre MCP magic
```

### OceanSystem Context

```tsx
interface OceanContextValue {
  depthProgress: number        // 0 (superficie) → 1 (trinchera)
  hookY: number                // px desde top del viewport
  registerDepthZone: (id: string, start: number, end: number) => void
}
```

El Provider envuelve toda la página y expone `depthProgress` como valor ponderado:
- `0.0–0.2`: mapeado desde `heroProgress` (el pin interno del Hero, `onUpdate`)
- `0.2–1.0`: segundo ScrollTrigger post-pin sobre el resto del documento

Esto evita que `depthProgress` quede congelado durante los 200vh del pin del Hero mientras el `hookY` ya avanza.

### FishingThread

- `position: fixed`, `left: 32%`, `top: 0`, `z-index: 50`
- **`aria-hidden="true"`** (decorativo, no interactivo)
- SVG de 2px de ancho desktop / 3px mobile, altura 100vh
- Línea con `strokeDasharray="4 3"`, color `rgba(255,140,66,0.5)`
- Hook: icono SVG posicionado con `top: hookY`, animado con GSAP
- **Hidratación SSR:** renderiza con `opacity: 0` (inline style); el primer tick de `useEffect` establece `opacity: 1`. Evita el salto de posición entre SSR y post-hidratación.
- Mobile (`< 768px`): `left: 12px`, stroke-width 3px, hook 24×24px mínimo

---

## Las 5 Secciones

### 1. Hero — La Superficie Nocturna (0m)

**Fondo:** Cielo nocturno `#060c1a → #0a1832`. Luna CSS radial-gradient con glow amber. Estrellas punteadas. Bote SVG 2D.

**Scroll:** `pin: true`, `end: "+=200vh"`, `scrub: 1.2`. El hook baja 400px. El hilo SVG se estira con strokeDashoffset (calcular `getTotalLength()` en `useEffect` al montar). El cielo hace parallax 0.4×.

**Animación de carga:**
1. Bote aparece con fade-in (0.6s)
2. Caña SVG se tensa (0.4s)
3. Anzuelo cae al agua con gravedad (1.4s, `power3.out`) — sin rebote, se asienta

**Contenido:** Nombre (animación letra a letra existente), rol, tagline, CTA. Todo en zona derecha (left: 38%+).

**CTA "Ver proyectos" — bypass del pin:**
```ts
// IMPORTANTE: heroPinTrigger se crea en useEffect; puede ser null en SSR/hydration window
const handleCtaClick = () => {
  if (!heroPinTrigger) {
    // Fallback si GSAP aún no montó: navegar directamente
    lenis.scrollTo('#work', { duration: 0.8 })
    return
  }
  gsap.to(heroPinTrigger, {
    progress: 1, duration: 0.3, ease: "power3.out",
    onComplete: () => lenis.scrollTo('#work', { duration: 0.8 })
  })
}
```
La animación del hook completa en 0.3s y luego Lenis navega suavemente a la sección Work. El usuario nunca queda atrapado.

**Tokens:** `--ocean-surface: oklch(12% 0.02 250)`

---

### 2. About — Aguas Someras (200m)

**Fondo:** `#071a3e → #061530`. Light shafts CSS: 3–4 `div` con `background: linear-gradient`, `transform: skewX`, opacidad 3–6%.

**Elementos SVG:**
- 2–3 medusas SVG inline (sin caras), animación GSAP `y: ±15px` loop suave (8–12s)
- **Phase offset por instancia:** `delay: i * 2.5s` por medusa (i=0,1,2), amplitud variada (±12px, ±15px, ±18px). Evita el efecto mecánico de movimiento sincronizado.
- Color: `rgba(180,80,255,0.25)` y `rgba(0,229,200,0.2)`
- Aparecen con stagger 0.15s al entrar al viewport

**Layout desktop:** grid 2 columnas. Izquierda: medusas + light shafts (zona 0–32%). Derecha: bio texto + 3 chapter-cards (IoT, Universidad, Ahora) con borde bioluminiscente sutil.

**Chapter-cards restyling:**
- ~~`rgba(0,229,200,0.15)` en fondo translúcido~~ → **INCORRECTO: glassmorphism-adjacent (bannedo)**
- **Corrección:** borde completo `border: 1px solid oklch(55% 0.12 185 / 0.25)` con fondo sólido `background: oklch(11% 0.03 260)`. Sin blur, sin transparencia tipo cristal.

**Nota MODIFICAR `About/index.tsx` línea 138:** el bloquote existente usa `borderLeft: '2px solid var(--color-accent)'` — side-stripe banneado. Reemplazar con full-border + background tint o ícono leading.

**Tokens:** `--ocean-shallow: oklch(9% 0.03 258)`

---

### 3. Stack — El Arrecife (800m)

**Fondo:** `#04102a → #030c22`. Bioluminiscencia cyan empieza a despertar.

**Elementos SVG — Coral Glow (implementación correcta):**

El `filter: drop-shadow` fuerza re-rasterización CPU en cada frame. Usar compositing por opacity:

```tsx
// CoralReef.tsx — estructura correcta
// Por cada coral: dos elementos superpuestos
// 1. El SVG del coral (estático, sin filter)
// 2. Un overlay SVG idéntico pre-renderizado con drop-shadow baked, opacity: 0

ScrollTrigger.create({
  trigger: coralRef.current,
  start: "top 60%",
  end: "bottom 40%",
  onEnter:      () => gsap.to(coralGlowRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" }),
  onLeave:      () => gsap.to(coralGlowRef.current, { opacity: 0, duration: 0.6 }),
  onEnterBack:  () => gsap.to(coralGlowRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" }),
  onLeaveBack:  () => gsap.to(coralGlowRef.current, { opacity: 0, duration: 0.6 }),
})
// El glow overlay tiene filter: drop-shadow(0 0 8px #00E5C8) baked en CSS.
// opacity es GPU-composited. filter no lo es.
```

Mobile: desactivar el ScrollTrigger de coral **completamente** en `matchMedia("(max-width: 768px)")`, no solo la animación.

**Tecnologías como burbujas:** zona derecha (38%+). Cada skill es un `span` con border-radius 20px, borde bioluminiscente según categoría:
- AI/Python: cyan `rgba(0,229,200,0.3)`
- Web/TS: azul `rgba(100,180,255,0.2)`
- Tools/GSAP: ámbar `rgba(255,140,66,0.25)`
- IoT/Hardware: rojo `rgba(255,80,50,0.2)`

Hover desktop: `scale(1.05)`, glow intensifica. **`will-change: transform`** en `.skill-bubble`.  
Touch/mobile: `@media (hover: none) { .skill-bubble { box-shadow: 0 0 6px oklch(80% 0.10 185); } }` — glow siempre activo al 50% en dispositivos sin hover.

Animación entrada: stagger 0.04s desde abajo. **Regla de salida (ver §Sistema de Animación).**

**Migra:** contenido de la sección `Capabilities` existente.

**Tokens:** `--ocean-reef: oklch(7% 0.025 262)`

---

### 4. Work/Projects — El Abismo (3500m)

**Fondo:** `#02071a → #010510`. Azul-índigo profundo casi negro.

**Elementos:**
- **Astronauta (MCP magic WebP):** zona izquierda (0–30%). `next/image` con `priority={false}`.
  - `sizes="(max-width: 768px) 180px, 280px"` — obligatorio para Lighthouse mobile.
  - CSS max-width mobile: `min(180px, 40vw)`
  - Pequeña linterna/glow que ilumina zona. Parallax sutil: `y: -20px` al scroll.
- **Pulpo SVG:** debajo del astronauta, `rgba(180,50,220,0.3)`. Tentáculos: 8 elementos, `y: ±8px`, `rotation: ±6deg`, `duration: 3–4s`, `stagger: 0.4s`, `ease: "sine.inOut"`, `yoyo: true`, `repeat: -1`. Si el presupuesto de frames lo requiere, cortar en mobile.

**Project cards:** layout existente preservado, restyled:
- Fondo `rgba(10,20,50,0.9)`, borde `rgba(180,80,255,0.25)`
- Entrada: `opacity: 0 → 1`, `y: 32 → 0`, stagger 0.12s al entrar viewport — `toggleActions: "play none none reverse"`
- Featured card (LangGraph Agent): borde más brillante, badge "AI · Featured"

**Transición:** fondo darkens de `#02071a` a `#010510` al bajar hacia Contact.

**Tokens:** `--ocean-abyss: oklch(5% 0.018 265)`

---

### 5. Contact — La Trinchera (11km)

**Fondo:** `#010310 → #000208`. Casi negro absoluto. Suelo marino SVG con glow magenta/pink en el piso.

**Partículas trench:** `rgba(255,50,180,0.18)` y `rgba(180,50,255,0.12)`. Chroma máxima permitida: `oklch(58% 0.24 330)` — no superar este valor para no cruzar al lane synthwave banneado.

**Elementos:**
- **Cofre bioluminiscente (MCP magic WebP):** centrado bajo el hilo (left: 32%).
  - `sizes="(max-width: 768px) 140px, 180px"`
  - CSS mobile: `min(140px, 35vw)`, centrado al hilo con `transform: translateX(-50%)`
  - **Fallback:** si la imagen 404, renderizar SVG placeholder de cofre cerrado (sin glow).

**Animación de llegada** (ScrollTrigger, `once: true`, trigger `top 70%`):

```ts
// TreasureChest.tsx
// IMPORTANTE: aplicar transformOrigin antes del timeline
gsap.set(lidRef.current, {
  transformOrigin: "top center",
  transformPerspective: 400
})

const tl = gsap.timeline({
  scrollTrigger: { trigger: "#contact", start: "top 70%", once: true }
})
tl
  .to(chestRef.current, { y: -4, duration: 0.1 })
  .to(chestRef.current, { y: 0,  duration: 0.2 })
  .to(lidRef.current,   { rotateX: -35, duration: 0.6, ease: "power4.out" })
  .to(glowRef.current,  { opacity: 1, duration: 0.4 }, "-=0.2")
  .to(linksRef.current, { opacity: 1, y: 0, stagger: 0.08, duration: 0.3 }, "-=0.1")
```

La tapa rota desde su bisagra superior (`transformOrigin: "top center"`) con perspectiva real. Sin resorte, resistida.

**Contenido del cofre:** tres enlaces directos — GitHub, LinkedIn, Email — como anchor elements estilizados con iconos SVG inline.
- `rel="noopener noreferrer"` en todos los anchors externos
- Glow on-hover desktop + `:active` glow para touch
- `aria-label` en cada link (ver §i18n)

**Tokens:** `--ocean-trench: oklch(3% 0.01 268)`

---

## Paleta Extendida — Nuevos Tokens CSS

Se agregan a `src/styles/tokens.css` sin romper los existentes. **Usar OKLCH** para evitar colores garish en extremos de luminosidad.

```css
/* Ocean depth backgrounds — near-black con tint azul, chroma mínima */
--ocean-surface:  oklch(12% 0.02 250);
--ocean-shallow:  oklch(9%  0.03 258);
--ocean-reef:     oklch(7%  0.025 262);
--ocean-abyss:    oklch(5%  0.018 265);
--ocean-trench:   oklch(3%  0.01  268);

/* Bioluminescent accents — chroma controlada, nunca a tope */
--bio-cyan:       oklch(80% 0.14 185);
--bio-magenta:    oklch(55% 0.22 310);
--bio-deep-blue:  oklch(45% 0.18 265);
--bio-pink:       oklch(58% 0.24 330);  /* chroma máx para partículas trench */

/* Thread */
--thread-color:        oklch(68% 0.18 48 / 0.5);  /* amber semitransparente */
--thread-left-desktop: 32%;
--thread-left-mobile:  12px;

/* Focus ring — visible sobre fondos oscuros */
--focus-ring: 0 0 0 2px oklch(68% 0.18 48);  /* amber, matches thread-color */
/* Aplicar: outline: var(--focus-ring) en :focus-visible de todos los interactivos */
```

---

## MCP Magic — Prompts para Assets

### Asset 1: Astronauta (sección Proyectos)

> "A cute cartoon astronaut character in illustrated 2D style, white spacesuit with dark tinted visor (deep black/dark navy, slightly reflective), floating in dark deep ocean water, holding a small flashlight/lantern. Transparent background. Style: flat illustration with soft glow effects, similar to a children's science book illustration. Color palette: white suit, dark visor with subtle cyan bioluminescent reflection, cyan and purple bioluminescent glow surrounding. No background, WebP format, facing slightly left, full body visible."

**Destino:** `public/assets/astronaut.webp`  
**Uso:** `next/image`, `width={280}`, `sizes="(max-width: 768px) 180px, 280px"`, posición bottom-left zona izquierda  
**Fallback:** SVG placeholder astronauta silhouette si 404

### Asset 2: Cofre bioluminiscente (sección Contacto)

> "A glowing treasure chest resting on deep ocean floor, illustrated 2D style. Dark wooden chest with golden metal reinforcements, slightly open lid revealing intense bioluminescent magenta and pink light from inside. Small cyan and purple glowing particles floating around it. Near-black background with slight deep blue. Flat illustration style with strong glow effects. Transparent background WebP. The chest looks like it's been discovered at the bottom of the Mariana Trench."

**Destino:** `public/assets/treasure-chest.webp`  
**Uso:** `next/image`, `width={180}`, `sizes="(max-width: 768px) 140px, 180px"`, centrado bajo el hilo  
**Fallback:** SVG placeholder cofre cerrado (sin glow) si 404

---

## Sistema de Animación — Resumen Técnico

### Registro de Plugin (OBLIGATORIO en OceanSystem.tsx)

```ts
// OceanSystem.tsx — scope de módulo (fuera del componente)
// Debe ejecutarse antes de cualquier ScrollTrigger.create() en componentes hijos
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger)
```

`SmoothScroll/index.tsx` es eliminado (ver §Limpieza). `OceanSystem` es el único proveedor de scroll.

### GSAP ScrollTrigger — Hero Pin

```ts
ScrollTrigger.create({
  trigger: "#hero",
  start: "top top",
  end: "+=200vh",
  pin: true,
  scrub: 1.2,
  onUpdate: (self) => {
    hookY = self.progress * 400   // px
    threadLength = 60 + hookY
    // Actualizar heroProgress para depthProgress ponderado
    setHeroProgress(self.progress)
  }
})
```

### DepthProgress global — ponderado (evita freeze durante pin)

```ts
// heroProgress viene del onUpdate del pin (0→1 durante los 200vh)
// postPinProgress viene de un ScrollTrigger que empieza después del pin
const depthProgress = heroProgress * 0.2 + postPinProgress * 0.8

// postPinProgress ScrollTrigger:
ScrollTrigger.create({
  trigger: "#about",          // empieza al salir del Hero
  start: "top bottom",
  endTrigger: "#contact",
  end: "bottom bottom",
  scrub: true,
  onUpdate: (self) => setPostPinProgress(self.progress)
})
```

### Coral Glow on-pass (implementación GPU-safe)

Ver sección §Stack — El Arrecife para el snippet completo con overlay de opacity.

### Regla de Salida — Todos los reveals con ScrollTrigger

```ts
// REGLA SISTEMA: toda animación de entrada debe tener reverse en up-scroll
// Opción A (simple): usar toggleActions
ScrollTrigger.create({
  trigger: element,
  toggleActions: "play none none reverse",  // play en enter, reverse en enterBack
  // ...
})

// Opción B (control fino, igual que coral):
onEnter:     () => gsap.to(el, { opacity: 1, y: 0, ... }),
onLeaveBack: () => gsap.to(el, { opacity: 0, y: 32, ... }),
```

Aplicar a: medusas, project cards, skill bubbles, links del cofre. El up-scroll debe ser tan coreografiado como el down-scroll.

### Lenis + GSAP ScrollTrigger

El proyecto usa Lenis para smooth scroll. En `OceanSystem.tsx`:

```ts
// Conectar Lenis con ScrollTrigger (los tres son necesarios)
lenis.on("scroll", ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)  // crítico: sin esto hay desync en pantallas a 120Hz
```

### Performance

- `will-change: transform` **solo** en: hook SVG, astronaut parallax layer, skill bubbles (`:hover` state). **No** en medusas, corales, ni partículas — compositor layer excess en mobile.
- `gsap.context()` en cada componente, `kill()` en cleanup de `useEffect`
- `matchMedia("(max-width: 768px)")` — en mobile deshabilitar: coral ScrollTrigger registration completa, octopus animation, astronaut parallax. Hero pin: `end: "+=100vh"`.
- Landscape mobile (`max-width: 767px) and (orientation: landscape)`): deshabilitar pin completamente. Hero como frame estático, hook entry como animación one-shot (no scrub).
- `prefers-reduced-motion`: desactiva todo GSAP excepto fade-ins
- WebP con `next/image` lazy loading + atributo `sizes` correcto

### BioParticles

- Máximo **12 partículas** en mobile, **24** en desktop
- Animación CSS pura (no GSAP — ahorra ticker ticks)
- `will-change: transform` (no `filter`)
- `pointer-events: none`, `aria-hidden="true"`

### OceanBackground crossfade

Implementar como overlay absolutamente posicionado con `opacity: 0 → 1` via GSAP o CSS transition. **No** animar `background-color` directamente en el elemento sección — es costoso en compositing mobile.

---

## Breakpoints Responsive

```css
/* Mobile portrait (existente, reforzado) */
@media (max-width: 767px) {
  --thread-left: 12px;
  /* Contenido: padding-left: 32px; width: 100% (full-width, no porcentaje) */
  /* Thread actúa como guía visual marginal, no exclusion zone */
}

/* Landscape mobile (NUEVO) */
@media (max-width: 767px) and (orientation: landscape) {
  /* Hero pin desactivado — frame estático */
  /* Bote/luna: aspect-ratio safe, recorte vertical aceptable */
}

/* Tablet (NUEVO) */
@media (min-width: 768px) and (max-width: 1023px) {
  --thread-left: 20%;
  --content-left: 26%;
}

/* Desktop (existente) */
@media (min-width: 1024px) {
  --thread-left: 32%;
  --content-left: 38%;
}

/* Wide / 4K (NUEVO) */
@media (min-width: 1600px) {
  .ocean-content-zone {
    max-width: min(900px, 58vw);  /* evita líneas > 75ch */
  }
}
```

**Mobile text start:** en mobile (`< 768px`), todos los bloques de contenido usan `padding-left: 32px; width: 100%`. El hilo en `left: 12px` es guía visual, no crea exclusion zone.

**Touch interactions:** todos los estados `:hover` deben tener equivalente `:active` o `@media (hover: none)`. Ver §Stack para ejemplo de skill bubbles.

---

## i18n — Nuevas Keys Requeridas

Agregar a `messages/en.json` y `messages/es.json`:

```json
{
  "ocean": {
    "depth": {
      "surface": "0m — Surface",
      "shallow": "200m — Shallow Waters",
      "reef": "800m — The Reef",
      "abyss": "3,500m — The Abyss",
      "trench": "11,000m — Mariana Trench"
    },
    "depth_short": {
      "surface": "0m",
      "shallow": "200m",
      "reef": "800m",
      "abyss": "3.5km",
      "trench": "11km"
    },
    "astronaut": {
      "alt": "Cartoon astronaut floating in deep ocean with a flashlight"
    },
    "chest": {
      "alt": "Glowing bioluminescent treasure chest on the ocean floor"
    },
    "contact": {
      "github_label": "View GitHub profile",
      "linkedin_label": "Connect on LinkedIn",
      "email_label": "Send an email"
    }
  }
}
```

ES equivalentes: `"0m — Superficie"`, `"200m — Aguas Someras"`, `"800m — El Arrecife"`, `"3.500m — El Abismo"`, `"11.000m — Trinchera de las Marianas"`.

`ocean.depth_short.*` se usa en mobile (etiquetas abreviadas junto al hilo). Marcar como `aria-hidden="true"` — son decorativas, no navegan.

---

## Estructura de Archivos Nueva/Modificada

```
src/
├── components/
│   ├── ocean/
│   │   ├── OceanSystem.tsx        — Provider + depthProgress context + Lenis↔GSAP bridge
│   │   │                            + gsap.registerPlugin(ScrollTrigger) al top del módulo
│   │   ├── FishingThread.tsx      — SVG fixed, hilo + hook, aria-hidden, opacity:0 en mount
│   │   ├── OceanBackground.tsx    — overlay opacity crossfade (no background-color transition)
│   │   ├── BioParticles.tsx       — max 24 desktop / 12 mobile, CSS animation, aria-hidden
│   │   ├── CoralReef.tsx          — dual SVG (coral + glow overlay), opacity tween (no filter)
│   │   ├── JellyfishGroup.tsx     — 2-3 medusas, phase offset delay: i*2.5s por instancia
│   │   └── TreasureChest.tsx      — cofre + gsap.set(transformOrigin) + timeline de impacto
│   └── sections/
│       ├── Hero/index.tsx         — MODIFICAR: reemplazar WebGLScene, pin GSAP, CTA null-guard
│       ├── About/index.tsx        — MODIFICAR: ocean shell + JellyfishGroup + fix borderLeft L138
│       ├── Stack/index.tsx        — NUEVO: reemplaza Capabilities (mismos datos, nuevo shell)
│       ├── Work/index.tsx         — MODIFICAR: ocean shell + AstronautAsset (next/image + sizes)
│       └── Contact/index.tsx      — MODIFICAR: ocean shell + TreasureChest + rel noopener
├── styles/
│   └── tokens.css                 — MODIFICAR: añadir tokens ocean/bio + --focus-ring
└── app/[locale]/
    ├── layout.tsx                 — MODIFICAR: eliminar <SmoothScroll> import/uso
    └── page.tsx                   — MODIFICAR: OceanSystem wrapper, eliminar <Capabilities>
```

---

## Limpieza — Lista Completa de Archivos a Eliminar

```bash
# Componentes reemplazados
src/components/sections/Hero/WebGLScene.tsx        # → bote SVG 2D
src/components/sections/Capabilities/index.tsx     # → Stack
src/components/SmoothScroll/index.tsx              # → OceanSystem (evita dual Lenis)
src/components/AmbientBackground/index.tsx         # → OceanBackground (conflicto paleta)

# Dependencias (ejecutar DESPUÉS de eliminar todos los imports)
npm uninstall three @types/three
```

**Imports a eliminar en `page.tsx`:**
- `import Capabilities from '@/components/sections/Capabilities'`
- `<Capabilities />` JSX
- `import AmbientBackground from '@/components/AmbientBackground'`
- `<AmbientBackground />` JSX

**Imports a eliminar en `layout.tsx`:**
- `import SmoothScroll from '@/components/SmoothScroll'`
- `<SmoothScroll>...</SmoothScroll>` wrapper

**Nav update requerido (`Nav/index.tsx` o equivalente):**
- `href="#capabilities"` → `href="#stack"`
- Mensaje i18n `nav.capabilities` puede reutilizarse o renombrarse a `nav.stack`

---

## Criterios de Éxito

- [ ] **Lighthouse Performance ≥ 90 en mobile** — sub-targets: LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms
- [ ] El anzuelo desciende suavemente sin jank en scrub (60fps en mid-range Android)
- [ ] Los corales reaccionan al paso del hook (opacity overlay, no filter)
- [ ] La animación del cofre se dispara con tapa abierta desde bisagra superior (transformOrigin correcto)
- [ ] Up-scroll coreografiado: las secciones reversan su entrada limpiamente
- [ ] Mobile: hilo en borde izquierdo, contenido full-width desde padding-left 32px
- [ ] Landscape mobile: hero sin pin, frame estático
- [ ] `prefers-reduced-motion` desactiva animaciones decorativas, fade-ins se mantienen
- [ ] i18n EN/ES funciona sin regresiones, todas las 10 nuevas keys presentes en ambos locales
- [ ] WCAG AA: contraste ≥ 4.5:1 en todo texto sobre fondos ocean, `:focus-visible` visible en todos los interactivos
- [ ] Zero console errors de GSAP: plugin registrado, null-checks en todos los refs
- [ ] `npm run build` limpio sin Three.js en el bundle (verificar con `next/bundle-analyzer`)
