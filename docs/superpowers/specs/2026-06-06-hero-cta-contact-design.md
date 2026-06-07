# Hero CTA de Contacto + Teléfono en Contact

**Fecha:** 2026-06-06
**Estado:** Aprobado

## Contexto

El Hero actual tiene un solo CTA ("Ver proyectos ↓") que hace scroll a `#work`. No existe ninguna vía de contacto directo visible arriba del fold. La sección Contact tiene email pero no teléfono. El usuario quiere añadir un CTA de contacto en el Hero y exponer el número 3124745704 tanto en el Hero como en Contact.

## Cambios

### 1. Hero — `src/components/sections/Hero/index.tsx`

**Bloque CTA (reemplaza el `motion.a` único):**

Dos píldoras en `flex-row`, centradas, `gap: 0.75rem`:

- **"Ver proyectos ↓"** — pill outline amber (igual al actual, sin cambios de estilo).
- **"Hablemos →" / "Let's talk →"** — pill filled amber:
  - `background: var(--color-accent)`, `color: var(--color-dark)`, `border: 1px solid var(--color-accent)`
  - Enlaza a `#contact` con smooth scroll via `getLenis().scrollTo('#contact', { offset: -72, duration: 1.2 })`
  - Animación: misma variante `hidden/visible`, `delay: 1.1`, `scale 0.95→1`

**Fila de datos de contacto** (debajo de las píldoras, `margin-top: 1rem`):
- Layout: `flex-row`, `gap: 1.25rem`, `align-items: center`, centrado
- Email: icono SVG envelope + `jzorroperez@gmail.com` como `<a href="mailto:...">` (sin estilos de link, solo texto muted)
- Separador: `div` de 1px × 14px, `rgba(255,255,255,0.1)`
- Teléfono: icono SVG phone + `312 474 5704` como `<a href="tel:+573124745704">`
- Tipografía: `font-family: var(--font-mono)`, `font-size: var(--text-xs)`, `color: rgba(var(--color-text-dark-secondary-raw), 0.35)` (muy muted)
- Animación: `motion.div`, `delay: 1.3`, fade in puro (`opacity: 0 → 1`), sin movimiento Y

### 2. Contact — `src/components/sections/Contact/index.tsx`

Añadir el teléfono **debajo** del email existente, en su propio bloque `motion.a`:
- `href="tel:+573124745704"`
- Mismo estilo que el email link: `font-family: var(--font-display)`, `font-size: var(--text-2xl)`, `fontWeight: 700`, hover → `var(--color-accent)`
- `borderBottom: '1px solid rgba(255,255,255,0.12)'`, mismos handlers `onMouseEnter/Leave`
- Animación: `delay: 0.4`, `duration: 0.6`, igual al email

### 3. i18n — `messages/es.json` y `messages/en.json`

Nuevas claves en `hero`:
```json
"cta_contact": "Hablemos",   // es
"cta_contact": "Let's talk", // en
"phone": "312 474 5704"      // mismo en ambos
```

Nueva clave en `contact`:
```json
"phone": "312 474 5704"      // mismo en ambos
```

## Lo que NO cambia

- Estilo, animación y comportamiento del CTA "Ver proyectos" existente.
- Resto de la sección Hero (WebGLScene, glow, scroll indicator).
- Social links, heading, tagline y estructura del Contact.

## Criterios de aceptación

- El botón "Hablemos" hace scroll suave a `#contact` con Lenis.
- En móvil, las dos píldoras se apilan o se ajustan sin overflow.
- Email y teléfono en el Hero son clicables (`mailto:` y `tel:`).
- El teléfono en Contact tiene el mismo tratamiento visual que el email.
- Ambos idiomas (ES/EN) reflejan las nuevas claves sin errores de i18n.
