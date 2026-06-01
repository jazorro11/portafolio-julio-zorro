# Bioma Digital — Rediseño Océano Bioluminiscente

**Fecha:** 2026-06-01  
**Proyecto:** Portafolio Julio Zorro  
**Stack:** Next.js 16 · React 19 · GSAP 3.15 · Three.js · Lenis · Framer Motion · TypeScript

---

## Concepto

El scroll no mueve texto — hace descender un anzuelo verticalmente a través del océano profundo. El anzuelo es el guía visual del usuario. La metáfora: el usuario es el pescador que desciende desde la superficie nocturna hasta las Trincheras de las Marianas.

**Referencia visual:** ilustración 2D estilo flat con glow bioluminiscente. Astronauta con visor dorado sosteniendo lupa/linterna. Colores profundos: azul marino, cian, magenta, violeta. Fondos casi negros con partículas de luz.

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
├── FishingThread          — SVG fixed, hilo + hook, depth-driven
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

El Provider envuelve toda la página y expone `depthProgress` via GSAP ScrollTrigger. Cada sección registra su zona de profundidad al montarse.

### FishingThread

- `position: fixed`, `left: 32%`, `top: 0`, `z-index: 50`
- SVG de 2px de ancho, altura 100vh
- Línea con `strokeDasharray="4 3"`, color `rgba(255,140,66,0.5)`
- Hook: icono SVG posicionado con `top: hookY`, animado con GSAP
- Mobile (`< 768px`): `left: 12px`

---

## Las 5 Secciones

### 1. Hero — La Superficie Nocturna (0m)

**Fondo:** Cielo nocturno `#060c1a → #0a1832`. Luna CSS radial-gradient con glow amber. Estrellas punteadas. Bote SVG 2D.

**Scroll:** `pin: true`, `end: "+=200vh"`, `scrub: 1.2`. El hook baja 400px. El hilo SVG se estira con strokeDashoffset. El cielo hace parallax 0.4×.

**Animación de carga:**
1. Bote aparece con fade-in (0.6s)
2. Caña SVG se tensa (0.4s)
3. Anzuelo cae al agua con bounce (1.2s, `back.out(1.2)`)

**Contenido:** Nombre (animación letra a letra existente), rol, tagline, CTA. Todo en zona derecha (left: 38%+).

**Tokens:** `--ocean-surface: #0a1628`

---

### 2. About — Aguas Someras (200m)

**Fondo:** `#071a3e → #061530`. Light shafts CSS: 3–4 `div` con `background: linear-gradient`, `transform: skewX`, opacidad 3–6%.

**Elementos SVG:**
- 2–3 medusas SVG inline (sin caras), animación GSAP `y: ±15px` loop suave (8–12s)
- Color: `rgba(180,80,255,0.25)` y `rgba(0,229,200,0.2)` 
- Aparecen con stagger 0.15s al entrar al viewport

**Layout desktop:** grid 2 columnas. Izquierda: medusas + light shafts (zona 0–32%). Derecha: bio texto + 3 chapter-cards (IoT, Universidad, Ahora) con borde bioluminiscente sutil.

**Chapter-cards restyling:** bordes `rgba(0,229,200,0.15)` en lugar de sólidos. Fondo oscuro translúcido.

**Tokens:** `--ocean-shallow: #071a3e`

---

### 3. Stack — El Arrecife (800m)

**Fondo:** `#04102a → #030c22`. Bioluminiscencia cyan empieza a despertar.

**Elementos SVG:**
- Corales izquierda y derecha de la zona 0–30%
- Colores: `rgba(255,80,50,0.4)` (coral rojo) y `rgba(200,50,180,0.4)` (coral púrpura)
- **Reacción al anzuelo:** cada coral tiene ScrollTrigger propio. Al entrar el hook en su zona Y → `filter: drop-shadow(0 0 8px #00E5C8)` en 0.4s. Al salir → fade off en 0.6s.

**Tecnologías como burbujas:** zona derecha (38%+). Cada skill es un `span` con border-radius 20px, borde bioluminiscente según categoría:
- AI/Python: cyan `rgba(0,229,200,0.3)`
- Web/TS: azul `rgba(100,180,255,0.2)`
- Tools/GSAP: ámbar `rgba(255,140,66,0.25)`
- IoT/Hardware: rojo `rgba(255,80,50,0.2)`

Hover: `scale(1.05)`, glow intensifica. Animación entrada: stagger 0.04s desde abajo.

**Migra:** contenido de la sección `Capabilities` existente.

**Tokens:** `--ocean-reef: #04102a`

---

### 4. Work/Projects — El Abismo (3500m)

**Fondo:** `#02071a → #010510`. Azul-índigo profundo casi negro.

**Elementos:**
- **Astronauta (MCP magic WebP):** zona izquierda (0–30%). `next/image` con `priority={false}`. Pequeña linterna/glow que ilumina zona. Parallax sutil: `y: -20px` al scroll.
- **Pulpo SVG:** debajo del astronauta, `rgba(180,50,220,0.3)`, tentáculos animados con GSAP wave.

**Project cards:** layout existente preservado, restyled:
- Fondo `rgba(10,20,50,0.9)`, borde `rgba(180,80,255,0.25)`
- Aparecen con `opacity: 0 → 1`, `y: 32 → 0`, stagger 0.12s al entrar viewport
- Featured card (LangGraph Agent): borde más brillante, badge "AI · Featured"

**Transición:** fondo darkens de `#02071a` a `#010510` al bajar hacia Contact.

**Tokens:** `--ocean-abyss: #02071a`

---

### 5. Contact — La Trinchera (11km)

**Fondo:** `#010310 → #000208`. Casi negro absoluto. Suelo marino SVG con glow magenta/pink en el piso.

**Elementos:**
- **Cofre bioluminiscente (MCP magic WebP):** centrado bajo el hilo (left: 32%). Tapa ligeramente abierta con glow interno ámbar/magenta.
- Partículas CSS en el suelo: `rgba(255,50,180,0.18)` y `rgba(180,50,255,0.12)`

**Animación de llegada** (ScrollTrigger, `once: true`, trigger `top 70%`):
1. Hook desciende hasta el cofre (GSAP `top` → posición cofre, 0.5s)
2. Cofre vibra: `y: -4px → 0` (0.3s)
3. Tapa se abre: `rotateX: -35deg` con `back.out(1.4)` (0.5s)
4. Glow interior aparece (0.4s, simultáneo con tapa)
5. Formulario/links hacen fade-in (0.3s delay)

**Formulario:** minimalista, inputs con `border: 1px solid rgba(255,50,180,0.2)`, fondo translúcido. Links: GitHub, LinkedIn, Email con iconos SVG inline.

**Tokens:** `--ocean-trench: #010310`

---

## Paleta Extendida — Nuevos Tokens CSS

Se agregan a `src/styles/tokens.css` sin romper los existentes:

```css
/* Ocean depth backgrounds */
--ocean-surface:  #0a1628;
--ocean-shallow:  #071a3e;
--ocean-reef:     #04102a;
--ocean-abyss:    #02071a;
--ocean-trench:   #010310;

/* Bioluminescent accents */
--bio-cyan:       #00E5C8;
--bio-magenta:    #B832DC;
--bio-deep-blue:  #3050FF;
--bio-pink:       #FF32B4;

/* Thread */
--thread-color:   rgba(255, 140, 66, 0.5);
--thread-left-desktop: 32%;
--thread-left-mobile:  12px;
```

---

## MCP Magic — Prompts para Assets

### Asset 1: Astronauta (sección Proyectos)

> "A cute cartoon astronaut character in illustrated 2D style, white spacesuit with gold visor reflecting bioluminescent light, floating in dark deep ocean water, holding a small flashlight/lantern. Transparent background. Style: flat illustration with soft glow effects, similar to a children's science book illustration. Color palette: white suit, gold visor, cyan and purple bioluminescent glow surrounding. No background, WebP format, facing slightly left, full body visible."

**Destino:** `public/assets/astronaut.webp`  
**Uso:** `next/image`, width 280px, posición bottom-left zona izquierda

### Asset 2: Cofre bioluminiscente (sección Contacto)

> "A glowing treasure chest resting on deep ocean floor, illustrated 2D style. Dark wooden chest with golden metal reinforcements, slightly open lid revealing intense bioluminescent magenta and pink light from inside. Small cyan and purple glowing particles floating around it. Near-black background with slight deep blue. Flat illustration style with strong glow effects. Transparent background WebP. The chest looks like it's been discovered at the bottom of the Mariana Trench."

**Destino:** `public/assets/treasure-chest.webp`  
**Uso:** `next/image`, width 180px, centrado bajo el hilo (left: 32%)

---

## Sistema de Animación — Resumen Técnico

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
  }
})
```

### DepthProgress global

```ts
ScrollTrigger.create({
  trigger: "body",
  start: "top top",
  end: "bottom bottom",
  scrub: true,
  onUpdate: (self) => setDepthProgress(self.progress)
})
```

### Coral Glow on-pass

```ts
ScrollTrigger.create({
  trigger: coralRef.current,
  start: "top 60%",
  end: "bottom 40%",
  onEnter:      () => gsap.to(coral, { filter: "drop-shadow(0 0 8px #00E5C8)", duration: 0.4, ease: "power2.out" }),
  onLeave:      () => gsap.to(coral, { filter: "none", duration: 0.6 }),
  onEnterBack:  () => gsap.to(coral, { filter: "drop-shadow(0 0 8px #00E5C8)", duration: 0.4, ease: "power2.out" }),
  onLeaveBack:  () => gsap.to(coral, { filter: "none", duration: 0.6 }),
})
```

### Lenis + GSAP ScrollTrigger

El proyecto usa Lenis para smooth scroll. GSAP ScrollTrigger necesita ser informado de este scroll personalizado para funcionar correctamente. En `OceanSystem.tsx`:

```ts
// Conectar Lenis con ScrollTrigger
lenis.on("scroll", ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

Sin esta integración el pin del Hero y el scrub se desincronizarán del scroll suave de Lenis.

### Performance

- `will-change: transform` en hook y capas paralácticas
- `gsap.context()` en cada componente, `kill()` en cleanup
- `matchMedia("(max-width: 768px)")` para reducir animaciones mobile
- `prefers-reduced-motion`: desactiva todo GSAP excepto fade-ins
- Coral glow desactivado en mobile
- WebP con `next/image` lazy loading

---

## Estructura de Archivos Nueva/Modificada

```
src/
├── components/
│   ├── ocean/
│   │   ├── OceanSystem.tsx        — Provider + depthProgress context + Lenis↔GSAP bridge
│   │   ├── FishingThread.tsx      — SVG fixed, hilo + hook animado por depthProgress
│   │   ├── OceanBackground.tsx    — wrapper por sección: aplica el color de fondo del token
│   │   │                            correcto y hace crossfade de profundidad al entrar viewport
│   │   ├── BioParticles.tsx       — N partículas CSS absolutas con glow y animación float
│   │   ├── CoralReef.tsx          — SVG corales inline + ScrollTrigger glow bilateral
│   │   ├── JellyfishGroup.tsx     — 2-3 medusas SVG con GSAP float loop
│   │   └── TreasureChest.tsx      — cofre (next/image WebP) + timeline GSAP de impacto
│   └── sections/
│       ├── Hero/index.tsx         — MODIFICAR: reemplazar WebGLScene por bote SVG + pin GSAP
│       ├── About/index.tsx        — MODIFICAR: ocean shell + JellyfishGroup
│       ├── Stack/index.tsx        — NUEVO: reemplaza Capabilities (mismos datos, nuevo shell)
│       ├── Work/index.tsx         — MODIFICAR: ocean shell + AstronautAsset (next/image)
│       └── Contact/index.tsx      — MODIFICAR: ocean shell + TreasureChest
├── styles/
│   └── tokens.css                 — MODIFICAR: añadir tokens ocean/bio
└── app/[locale]/page.tsx          — MODIFICAR: OceanSystem wrapper
```

**Archivos a eliminar:**
- `src/components/sections/Hero/WebGLScene.tsx` — reemplazado por bote SVG 2D
- `src/components/sections/Capabilities/index.tsx` — reemplazado por Stack

---

## i18n

- Todos los textos preservan `useTranslations()` existente
- Los nuevos labels de profundidad ("0m — Superficie", etc.) se añaden a `messages/en.json` y `messages/es.json`
- No se eliminan keys existentes

---

## Criterios de Éxito

- [ ] Lighthouse Performance ≥ 90 en mobile
- [ ] El anzuelo desciende suavemente sin jank en scrub
- [ ] Los corales reaccionan al paso del hook
- [ ] La animación del cofre se dispara correctamente
- [ ] Mobile: hilo en borde izquierdo, experiencia legible
- [ ] `prefers-reduced-motion` desactiva animaciones decorativas
- [ ] i18n EN/ES funciona sin regresiones
