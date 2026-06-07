# Hero CTA de Contacto + Teléfono Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir un botón "Hablemos" en el Hero con email y teléfono visibles, y el número 312 474 5704 en la sección Contact debajo del email.

**Architecture:** Tres cambios coordinados: primero i18n (las claves deben existir antes de usarse en componentes), luego Hero (reemplaza el bloque CTA único por un wrapper con dos píldoras + fila de contacto), luego Contact (añade `motion.a` de teléfono debajo del email). No hay test framework; la verificación es TypeScript (`npx tsc --noEmit`) + visual en dev server.

**Tech Stack:** Next.js 16, React 19, TypeScript, next-intl 4, framer-motion 12, Lenis scroll

---

## Archivos

| Acción | Ruta |
|--------|------|
| Modify | `messages/es.json` |
| Modify | `messages/en.json` |
| Modify | `src/components/sections/Hero/index.tsx` |
| Modify | `src/components/sections/Contact/index.tsx` |

---

### Task 1: i18n — añadir claves nuevas en ambos locales

**Files:**
- Modify: `messages/es.json`
- Modify: `messages/en.json`

- [ ] **Step 1: Añadir claves en es.json**

El bloque `hero` pasa de:
```json
"hero": {
  "name": "Julio Zorro",
  "title": "Software Engineer · AI",
  "tagline": "Construyo sistemas inteligentes y las interfaces que los hacen sentir humanos.",
  "cta": "Ver proyectos"
}
```
a:
```json
"hero": {
  "name": "Julio Zorro",
  "title": "Software Engineer · AI",
  "tagline": "Construyo sistemas inteligentes y las interfaces que los hacen sentir humanos.",
  "cta": "Ver proyectos",
  "cta_contact": "Hablemos",
  "phone": "312 474 5704"
}
```

El bloque `contact` pasa de:
```json
"contact": {
  "label": "Contacto",
  "heading": "Construyamos algo.",
  "email": "jzorroperez@gmail.com",
  "available": "Disponible para proyectos freelance y posiciones full-time."
}
```
a:
```json
"contact": {
  "label": "Contacto",
  "heading": "Construyamos algo.",
  "email": "jzorroperez@gmail.com",
  "phone": "312 474 5704",
  "available": "Disponible para proyectos freelance y posiciones full-time."
}
```

- [ ] **Step 2: Añadir claves en en.json**

El bloque `hero` pasa de:
```json
"hero": {
  "name": "Julio Zorro",
  "title": "Software Engineer · AI",
  "tagline": "I build intelligent systems and the interfaces that make them feel human.",
  "cta": "See my work"
}
```
a:
```json
"hero": {
  "name": "Julio Zorro",
  "title": "Software Engineer · AI",
  "tagline": "I build intelligent systems and the interfaces that make them feel human.",
  "cta": "See my work",
  "cta_contact": "Let's talk",
  "phone": "312 474 5704"
}
```

El bloque `contact` pasa de:
```json
"contact": {
  "label": "Contact",
  "heading": "Let's build something.",
  "email": "jzorroperez@gmail.com",
  "available": "Currently available for freelance and full-time opportunities."
}
```
a:
```json
"contact": {
  "label": "Contact",
  "heading": "Let's build something.",
  "email": "jzorroperez@gmail.com",
  "phone": "312 474 5704",
  "available": "Currently available for freelance and full-time opportunities."
}
```

- [ ] **Step 3: Verificar tipos**

```bash
cd C:\Users\jzorr\Desktop\Portafolio-julio-zorro\.claude\worktrees\strange-engelbart-abd1e2
npx tsc --noEmit
```

Resultado esperado: sin errores (next-intl valida las claves en tiempo de compilación).

- [ ] **Step 4: Commit**

```bash
git add messages/es.json messages/en.json
git commit -m "feat(i18n): add cta_contact and phone keys to hero and contact namespaces"
```

---

### Task 2: Hero — reemplazar CTA único por dos píldoras + fila de contacto

**Files:**
- Modify: `src/components/sections/Hero/index.tsx`

- [ ] **Step 1: Reemplazar el bloque `{/* CTA */}` completo**

Localizar el bloque que empieza en `{/* CTA */}` (línea ~139) y reemplazarlo íntegramente por:

```tsx
{/* CTAs */}
<motion.div
  variants={{
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delay: 1.1, duration: 0.4, ease: EASE },
    },
  }}
  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
>
  {/* Pills row */}
  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
    {/* Primary: scroll to work */}
    <motion.a
      href="#work"
      onClick={e => {
        e.preventDefault();
        const lenis = getLenis();
        if (lenis) lenis.scrollTo('#work', { offset: -72, duration: 1.2 });
        else document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
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
        textDecoration: 'none',
        transition: 'border-color 200ms ease',
      }}
    >
      {t('cta')} ↓
    </motion.a>

    {/* Contact: scroll to contact */}
    <motion.a
      href="#contact"
      onClick={e => {
        e.preventDefault();
        const lenis = getLenis();
        if (lenis) lenis.scrollTo('#contact', { offset: -72, duration: 1.2 });
        else document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
      }}
      whileTap={{ scale: 0.97 }}
      whileHover={{ opacity: 0.85 }}
      style={{
        display: 'inline-block',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--color-dark)',
        background: 'var(--color-accent)',
        border: '1px solid var(--color-accent)',
        borderRadius: '100px',
        padding: '14px 32px',
        textDecoration: 'none',
        fontWeight: 600,
        transition: 'opacity 200ms ease',
      }}
    >
      {t('cta_contact')} →
    </motion.a>
  </div>

  {/* Contact data row */}
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1.25rem',
      flexWrap: 'wrap',
      justifyContent: 'center',
    }}
  >
    <a
      href="mailto:jzorroperez@gmail.com"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        letterSpacing: '0.06em',
        color: 'rgba(232,224,212,0.35)',
        textDecoration: 'none',
      }}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
      jzorroperez@gmail.com
    </a>
    <div aria-hidden style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)' }} />
    <a
      href="tel:+573124745704"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        letterSpacing: '0.06em',
        color: 'rgba(232,224,212,0.35)',
        textDecoration: 'none',
      }}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.22 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.29 6.29l1.28-1.28a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
      {t('phone')}
    </a>
  </div>
</motion.div>
```

- [ ] **Step 2: Verificar tipos**

```bash
npx tsc --noEmit
```

Resultado esperado: sin errores. Si `t('cta_contact')` o `t('phone')` reportan "key not found", el Task 1 no se completó correctamente.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Hero/index.tsx
git commit -m "feat(hero): add contact CTA pill and email/phone data row"
```

---

### Task 3: Contact — añadir teléfono debajo del email

**Files:**
- Modify: `src/components/sections/Contact/index.tsx`

- [ ] **Step 1: Añadir `phone` a las variables del componente**

En la línea donde se hace `const email = t('email');`, añadir debajo:

```tsx
const phone = t('phone');
```

- [ ] **Step 2: Insertar el bloque de teléfono después del email link**

Localizar el cierre `</motion.a>` del bloque de email (el que tiene `className="email-link"`) e insertar inmediatamente después:

```tsx
{/* Phone */}
<motion.a
  className="phone-link"
  href={`tel:+57${phone.replace(/\s/g, '')}`}
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: 0.4, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
  whileHover={{ color: 'var(--color-accent)' }}
  style={{
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--text-2xl)',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: 'var(--color-text-dark)',
    textDecoration: 'none',
    display: 'inline-block',
    borderBottom: '1px solid rgba(255,255,255,0.12)',
    paddingBottom: '4px',
    marginTop: '1rem',
    transition: 'color 200ms ease, border-color 200ms ease',
  }}
  onMouseEnter={e => {
    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,140,66,0.4)';
  }}
  onMouseLeave={e => {
    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.12)';
  }}
>
  {phone}
</motion.a>
```

- [ ] **Step 3: Añadir responsive CSS para el teléfono**

Dentro del bloque `<style>` al final del componente, añadir:
```css
@media (max-width: 480px) {
  #contact .phone-link { font-size: var(--text-xl) !important; word-break: break-all; }
}
```

El bloque `<style>` completo queda así:
```tsx
<style>{`
  @media (max-width: 480px) {
    #contact h2 { font-size: clamp(2.5rem, 13vw, 4rem) !important; }
    #contact .email-link { font-size: var(--text-xl) !important; word-break: break-all; }
    #contact .phone-link { font-size: var(--text-xl) !important; word-break: break-all; }
  }
`}</style>
```

- [ ] **Step 4: Verificar tipos**

```bash
npx tsc --noEmit
```

Resultado esperado: sin errores.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Contact/index.tsx
git commit -m "feat(contact): add phone number below email link"
```

---

### Task 4: Verificación visual

**Files:** ninguno (solo verificación)

- [ ] **Step 1: Arrancar dev server**

```bash
npm run dev
```

Abrir `http://localhost:3000` (o `http://localhost:3000/es`).

- [ ] **Step 2: Verificar Hero**

Comprobar:
- Aparecen dos píldoras lado a lado: "Ver proyectos ↓" (amber outline) y "Hablemos →" (amber filled, texto oscuro).
- Debajo de las píldoras: email y teléfono en texto muy tenue con iconos SVG.
- Clic en "Hablemos →" hace scroll suave a la sección Contact.
- En móvil (≤480px): las píldoras se apilan correctamente (`flex-wrap: wrap`).

- [ ] **Step 3: Verificar Contact**

Comprobar:
- Debajo del email aparece `312 474 5704` con el mismo tamaño y estilo.
- Hover en el teléfono: texto y borde viran a amber.
- Clic en el teléfono abre el marcador telefónico (`tel:+573124745704`).
- En móvil: font-size reduce a `var(--text-xl)`.

- [ ] **Step 4: Verificar idioma EN**

Cambiar a inglés: `http://localhost:3000/en`.
- Píldora contacto muestra "Let's talk →".
- Teléfono en Hero y Contact muestra "312 474 5704".
