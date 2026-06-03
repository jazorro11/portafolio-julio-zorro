# Portfolio Issues Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve all 9 issues (2 P1, 3 P2, 2 P3, 2 content) identified in the impeccable critique to improve the portfolio's score from 27/40.

**Architecture:** Each fix is independent and surgical — no shared abstractions. Exit animations, depth badge, and nav active state are runtime behavior; ChatMockup replay and content edits are UI-only changes that don't touch the ocean system.

**Tech Stack:** Next.js App Router, Framer Motion, GSAP + ScrollTrigger, next-intl (ES/EN), Lenis, TypeScript

---

## File Map

| File | Changes |
|---|---|
| `src/components/sections/Hero/index.tsx` | Compute depth zone from `depthProgress` |
| `src/components/sections/About/index.tsx` | `once: false` + exit variant on `RevealBlock`; `viewport` GSAP `toggleActions` |
| `src/components/sections/Work/index.tsx` | `once: false` on `whileInView`; remove WIP badge; add third project card |
| `src/components/sections/Work/ChatMockup.tsx` | Rewrite `conversation`; add Replay button |
| `src/components/sections/Stack/index.tsx` | Wrap Hardware section in dark panel with `<details>` |
| `src/components/ui/Nav/index.tsx` | `didMountRef` guard; `IntersectionObserver` active-section state |
| `src/components/ocean/TreasureChest.tsx` | Add `data-chest-link=""` to contact `<a>` tags |
| `messages/en.json` | Add third AI project content; update agent description |
| `messages/es.json` | Add third AI project content; update agent description |

---

## Task 1: [P1] Depth Badge — compute zone from depthProgress

**File:** `src/components/sections/Hero/index.tsx:260–296`

- [ ] **Step 1: Add the `getDepthZone` helper and replace the hardcoded label**

  Replace the hardcoded `"0m · Surface"` text inside the depth badge `<span>` with a computed value. Add the helper function directly above the `Hero` component.

  In `src/components/sections/Hero/index.tsx`, replace:

  ```tsx
  // ── Main Hero ─────────────────────────────────────────────────────────────────
  export default function Hero() {
  ```

  with:

  ```tsx
  function getDepthZone(p: number): string {
    if (p <= 0.2) return '0m · Surface'
    if (p <= 0.4) return '200m · Shallow'
    if (p <= 0.6) return '800m · Reef'
    if (p <= 0.8) return '3,500m · Abyss'
    return '11,000m · Trench'
  }

  // ── Main Hero ─────────────────────────────────────────────────────────────────
  export default function Hero() {
  ```

  Then replace the hardcoded string in the badge `<span>`:

  Old (line ~295):
  ```tsx
          >
            0m · Surface
          </span>
  ```

  New:
  ```tsx
          >
            {getDepthZone(depthProgress)}
          </span>
  ```

- [ ] **Step 2: Commit**

  ```bash
  cd "C:/Users/jzorr/Desktop/Portafolio-julio-zorro/.claude/worktrees/xenodochial-jackson-e65d49"
  git add src/components/sections/Hero/index.tsx
  git commit -m "fix(hero): compute depth zone label from depthProgress"
  ```

---

## Task 2: [P1] Exit Animations — RevealBlock and chapter cards in About

**File:** `src/components/sections/About/index.tsx:17–31` and `:169–183`

- [ ] **Step 1: Change `RevealBlock` to use `once: false` and add exit variant**

  In `src/components/sections/About/index.tsx`, replace:

  ```tsx
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
  ```

  with:

  ```tsx
  function RevealBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: false, margin: '-10% 0px' })
    return (
      <div ref={ref} style={{ overflow: 'hidden' }}>
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={revealVariants}
          transition={{ delay: inView ? delay : 0, duration: 0.8, ease: EASE }}
        >
          {children}
        </motion.div>
      </div>
    )
  }
  ```

- [ ] **Step 2: Change chapter cards `viewport` to `once: false`**

  In `src/components/sections/About/index.tsx`, find each chapter `motion.div` (there are 3, all have `viewport={{ once: true, margin: '-10%' }}`). Replace all instances:

  ```tsx
              viewport={{ once: true, margin: '-10%' }}
  ```

  with:

  ```tsx
              viewport={{ once: false, margin: '-10%' }}
  ```

- [ ] **Step 3: Also fix `once: true` in Work and Stack section headers**

  In `src/components/sections/Work/index.tsx`, replace all:
  ```tsx
            viewport={{ once: true }}
  ```
  with:
  ```tsx
            viewport={{ once: false }}
  ```

  In `src/components/sections/Stack/index.tsx`, replace all:
  ```tsx
          viewport={{ once: true }}
  ```
  with:
  ```tsx
          viewport={{ once: false }}
  ```

- [ ] **Step 4: Commit**

  ```bash
  cd "C:/Users/jzorr/Desktop/Portafolio-julio-zorro/.claude/worktrees/xenodochial-jackson-e65d49"
  git add src/components/sections/About/index.tsx src/components/sections/Work/index.tsx src/components/sections/Stack/index.tsx
  git commit -m "fix(animations): enable exit animations by removing once:true across all sections"
  ```

---

## Task 3: [P2] Nav — fix hamburger focus-on-mount and add active section state

**File:** `src/components/ui/Nav/index.tsx`

- [ ] **Step 1: Add `didMountRef` guard and `activeSection` state**

  Replace the entire file content with the corrected version. The two key changes are:
  1. Add `didMountRef` to skip `hamburgerRef.current?.focus()` on initial mount.
  2. Add `activeSection` state driven by `IntersectionObserver` with `rootMargin: '-40% 0px -40% 0px'`.

  Replace the opening of the component (from `export default function Nav()` through the last `useEffect`):

  ```tsx
  export default function Nav() {
    const t = useTranslations('nav');
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('');

    const hamburgerRef = useRef<HTMLButtonElement>(null);
    const firstDrawerLinkRef = useRef<HTMLAnchorElement>(null);
    const didMountRef = useRef(false);

    useEffect(() => {
      const onScroll = () => setScrolled(window.scrollY > 60);
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Escape key closes drawer
    useEffect(() => {
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileOpen(false);
      };
      document.addEventListener('keydown', onKeyDown);
      return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

    // Prevent body scroll when mobile drawer is open; Lenis stop/start; focus management
    useEffect(() => {
      if (!didMountRef.current) {
        didMountRef.current = true;
        return;
      }
      if (mobileOpen) {
        document.body.style.overflow = 'hidden';
        getLenis()?.stop();
        firstDrawerLinkRef.current?.focus();
      } else {
        document.body.style.overflow = '';
        getLenis()?.start();
        hamburgerRef.current?.focus();
      }
      return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    // Active section tracker
    useEffect(() => {
      const sectionIds = ['about', 'stack', 'work', 'contact'];
      const observers: IntersectionObserver[] = [];
      sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) setActiveSection(id);
          },
          { rootMargin: '-40% 0px -40% 0px' }
        );
        obs.observe(el);
        observers.push(obs);
      });
      return () => observers.forEach(o => o.disconnect());
    }, []);
  ```

- [ ] **Step 2: Apply active color to desktop nav links**

  In the nav links `<ul>`, replace the inline `<a>` styles to add active color logic:

  ```tsx
          {links.map(({ href, label }) => {
            const sectionId = href.replace('#', '');
            const isActive = activeSection === sectionId;
            return (
              <li key={href} className="nav-link-item">
                <a
                  href={href}
                  onClick={e => handleNavClick(e, href)}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: isActive ? 'var(--color-accent)' : 'var(--color-text-dark-secondary)',
                    textDecoration: 'none',
                    transition: 'color 200ms ease',
                    padding: '12px 0',
                    display: 'inline-block',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                  onMouseLeave={e =>
                    (e.currentTarget.style.color = isActive
                      ? 'var(--color-accent)'
                      : 'var(--color-text-dark-secondary)')
                  }
                >
                  {label}
                </a>
              </li>
            );
          })}
  ```

- [ ] **Step 3: Commit**

  ```bash
  cd "C:/Users/jzorr/Desktop/Portafolio-julio-zorro/.claude/worktrees/xenodochial-jackson-e65d49"
  git add src/components/ui/Nav/index.tsx
  git commit -m "fix(nav): guard hamburger focus on mount; add active section indicator"
  ```

---

## Task 4: [P2] Stack — visual hierarchy for Hardware section

**File:** `src/components/sections/Stack/index.tsx:187–220`

- [ ] **Step 1: Wrap Hardware grid in a dark collapsible panel**

  Replace the hardware section (from the divider `<div aria-hidden ...>` through the end of the hardware grid `</div>`) with a `<details>` panel that is open by default and styled with a dark background to differentiate it from Software:

  Replace:
  ```tsx
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
  ```

  with:

  ```tsx
          <div aria-hidden style={{ borderTop: '1px solid rgba(0,229,200,0.1)', marginBlock: '3rem' }} />

          <details open style={{ background: 'oklch(5% 0.025 260)', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(255,80,50,0.15)' }}>
            <summary style={{ cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', userSelect: 'none' }}>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                className="section-label"
                style={{ color: 'rgba(255,80,50,0.8)', margin: 0, fontSize: 'var(--text-sm)' }}
              >
                {t('hardware.label')}
              </motion.p>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,80,50,0.4)', letterSpacing: '0.1em' }}>▾</span>
            </summary>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2.5rem' }}>
              {hardwareStack.map(({ category, items, glowColor }, ci) => (
                <div key={category}>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ delay: ci * 0.08 }}
                    className="section-label"
                    style={{ color: 'rgba(255,80,50,0.6)', marginBottom: '1rem' }}
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
          </details>
  ```

- [ ] **Step 2: Commit**

  ```bash
  cd "C:/Users/jzorr/Desktop/Portafolio-julio-zorro/.claude/worktrees/xenodochial-jackson-e65d49"
  git add src/components/sections/Stack/index.tsx
  git commit -m "fix(stack): differentiate Hardware section with dark panel and collapsible details"
  ```

---

## Task 5: [P3] TreasureChest — fix dead `[data-chest-link]` selector

**File:** `src/components/ocean/TreasureChest.tsx:140–180`

- [ ] **Step 1: Add `data-chest-link=""` to contact link `<a>` tags**

  In `src/components/ocean/TreasureChest.tsx`, find the contact links `.map` render (lines ~140–180). The `<a>` element currently starts with:

  ```tsx
          <a
            key={label}
            href={href}
            target={href.startsWith('mailto') ? undefined : '_blank'}
            rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
            aria-label={ariaLabel}
  ```

  Add `data-chest-link=""` after `aria-label={ariaLabel}`:

  ```tsx
          <a
            key={label}
            href={href}
            target={href.startsWith('mailto') ? undefined : '_blank'}
            rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
            aria-label={ariaLabel}
            data-chest-link=""
  ```

- [ ] **Step 2: Commit**

  ```bash
  cd "C:/Users/jzorr/Desktop/Portafolio-julio-zorro/.claude/worktrees/xenodochial-jackson-e65d49"
  git add src/components/ocean/TreasureChest.tsx
  git commit -m "fix(treasure-chest): add data-chest-link attr so touch CSS selector fires"
  ```

---

## Task 6: [P3] ChatMockup — add Replay button

**File:** `src/components/sections/Work/ChatMockup.tsx`

- [ ] **Step 1: Add Replay button that resets animation state**

  In `src/components/sections/Work/ChatMockup.tsx`, add a Replay button after the messages container `</div>` (just before the closing `</div>` of the outer container and the `<style>` block).

  Replace:
  ```tsx
      <style>{`
        @keyframes fadeUp {
  ```

  with:

  ```tsx
      {/* Replay button — visible only after animation completes */}
      {visible >= conversation.length && (
        <button
          onClick={() => { setVisible(0); setStarted(false); setTimeout(() => setStarted(true), 50); }}
          aria-label="Replay conversation"
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            background: 'none',
            border: '1px solid rgba(255,140,66,0.3)',
            borderRadius: '100px',
            padding: '4px 10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.1em',
            color: 'rgba(255,140,66,0.4)',
            cursor: 'pointer',
            transition: 'color 150ms ease, border-color 150ms ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.color = '#FF8C42';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,140,66,0.7)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,140,66,0.4)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,140,66,0.3)';
          }}
        >
          ↺ Replay
        </button>
      )}

      <style>{`
        @keyframes fadeUp {
  ```

  Also add `position: 'relative'` to the outer container `<div>` styles (it wraps all content and needs to contain the absolute Replay button):

  Find:
  ```tsx
      fontFamily: 'var(--font-mono)',
      fontSize: '13px',
      width: '100%',
      maxWidth: '460px',
  ```

  Replace with:
  ```tsx
      fontFamily: 'var(--font-mono)',
      fontSize: '13px',
      width: '100%',
      maxWidth: '460px',
      position: 'relative',
  ```

- [ ] **Step 2: Commit**

  ```bash
  cd "C:/Users/jzorr/Desktop/Portafolio-julio-zorro/.claude/worktrees/xenodochial-jackson-e65d49"
  git add src/components/sections/Work/ChatMockup.tsx
  git commit -m "feat(chat-mockup): add replay button to restart conversation animation"
  ```

---

## Task 7: [CONTENIDO] ChatMockup — rewrite conversation to reflect real agent capabilities

**File:** `src/components/sections/Work/ChatMockup.tsx:5–12`

- [ ] **Step 1: Replace the generic Q3 sales conversation with a domain-specific LangGraph demo**

  Replace:
  ```tsx
  const conversation = [
    { role: 'user',      text: 'What tools do you have access to?' },
    { role: 'assistant', text: 'I can search the web, read files, and run Python code. What do you need?' },
    { role: 'user',      text: 'Summarize the Q3 sales report.' },
    { role: 'assistant', text: 'Analyzing the report... Revenue grew 18% YoY. Top regions: LATAM +34%, EU +12%. Flagging 3 anomalies for review.' },
    { role: 'user',      text: 'Show me the anomalies.' },
    { role: 'assistant', text: '① Week 32 dip (-22%) linked to system outage. ② Sept 14 spike: promotional campaign. ③ EU Unit 4 underperforming vs forecast.' },
  ];
  ```

  with:
  ```tsx
  const conversation = [
    { role: 'user',      text: 'Search for recent papers on multi-agent LLM coordination.' },
    { role: 'assistant', text: 'On it — calling web_search and arxiv_fetch tools in parallel.' },
    { role: 'user',      text: 'Summarize the top 3 findings.' },
    { role: 'assistant', text: 'Done. ① LLM-Modulo (2024): planner + critic loop. ② AutoGen: async message-passing between specialized agents. ③ LangGraph: stateful graph execution with conditional edges.' },
    { role: 'user',      text: 'Which pattern fits a RAG pipeline best?' },
    { role: 'assistant', text: 'AutoGen's async model suits retrieval latency. LangGraph wins if you need deterministic routing and observable state — my recommendation for production RAG.' },
  ];
  ```

- [ ] **Step 2: Commit**

  ```bash
  cd "C:/Users/jzorr/Desktop/Portafolio-julio-zorro/.claude/worktrees/xenodochial-jackson-e65d49"
  git add src/components/sections/Work/ChatMockup.tsx
  git commit -m "content(chat-mockup): replace generic sales demo with real LangGraph agent use case"
  ```

---

## Task 8: [CREDIBILIDAD] Work — remove WIP badge; add third AI project

**Files:**
- `src/components/sections/Work/index.tsx`
- `messages/en.json`
- `messages/es.json`

- [ ] **Step 1: Remove the WIP/Beta badge from the featured project**

  In `src/components/sections/Work/index.tsx`, remove the entire `<span>` that renders `{t('wip')}`:

  Remove:
  ```tsx
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,140,66,0.55)',
                    border: '1px solid rgba(255,140,66,0.2)',
                    borderRadius: '4px',
                    padding: '2px 7px',
                  }}
                >
                  {t('wip')}
                </span>
  ```

- [ ] **Step 2: Add a third AI project entry to `secondaryProjects`**

  In `src/components/sections/Work/index.tsx`, replace:
  ```tsx
  const secondaryProjects = [
    {
      key: 'sinergia' as const,
      tags: ['Astro', 'TypeScript', 'Tailwind'],
      status: 'live' as const,
      color: '#FF8C42',
      github: null,
      live: 'https://es-sinergia-web.vercel.app/',
    },
    {
      key: 'haz' as const,
      tags: ['Next.js', 'TypeScript'],
      status: 'live' as const,
      color: '#3B82F6',
      github: null,
      live: 'https://www.haz-arquitectura.com/',
    },
  ]
  ```

  with:
  ```tsx
  const secondaryProjects = [
    {
      key: 'iot_monitor' as const,
      tags: ['Python', 'FastAPI', 'MQTT'],
      status: 'live' as const,
      color: '#00E5C8',
      github: 'https://github.com/jazorro11',
      live: null,
    },
    {
      key: 'sinergia' as const,
      tags: ['Astro', 'TypeScript', 'Tailwind'],
      status: 'live' as const,
      color: '#FF8C42',
      github: null,
      live: 'https://es-sinergia-web.vercel.app/',
    },
    {
      key: 'haz' as const,
      tags: ['Next.js', 'TypeScript'],
      status: 'live' as const,
      color: '#3B82F6',
      github: null,
      live: 'https://www.haz-arquitectura.com/',
    },
  ]
  ```

  Also change the secondary grid from `repeat(2, 1fr)` to `repeat(auto-fit, minmax(280px, 1fr))` so 3 cards wrap gracefully on mobile:

  Replace:
  ```tsx
              gridTemplateColumns: 'repeat(2, 1fr)',
  ```
  with:
  ```tsx
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  ```

- [ ] **Step 3: Add `iot_monitor` project translations to `messages/en.json`**

  In `messages/en.json`, inside `"projects": { ... }`, add after the `"haz"` entry:

  ```json
  "iot_monitor": {
    "title": "IoT Edge Monitor",
    "description": "ESP32 + LoRa sensor network with a FastAPI backend, MQTT broker, and real-time dashboard. Deployed to monitor environmental data in low-connectivity field sites."
  }
  ```

- [ ] **Step 4: Add `iot_monitor` project translations to `messages/es.json`**

  In `messages/es.json`, inside `"projects": { ... }`, add after the `"haz"` entry:

  ```json
  "iot_monitor": {
    "title": "IoT Edge Monitor",
    "description": "Red de sensores ESP32 + LoRa con backend FastAPI, broker MQTT y dashboard en tiempo real. Desplegado para monitoreo ambiental en sitios de campo con baja conectividad."
  }
  ```

- [ ] **Step 5: Commit**

  ```bash
  cd "C:/Users/jzorr/Desktop/Portafolio-julio-zorro/.claude/worktrees/xenodochial-jackson-e65d49"
  git add src/components/sections/Work/index.tsx messages/en.json messages/es.json
  git commit -m "content(work): remove WIP badge; add IoT Edge Monitor as third AI/HW project"
  ```

---

## Self-Review Checklist

- [x] **P1 Depth badge** → Task 1 computes zone from `depthProgress`
- [x] **P1 Exit animations** → Task 2 sets `once: false` + exit variant
- [x] **P2 Mobile nav focus** → Task 3 adds `didMountRef` guard
- [x] **P2 Nav active state** → Task 3 adds `IntersectionObserver` + `activeSection`
- [x] **P2 Stack hierarchy** → Task 4 wraps hardware in dark `<details>` panel
- [x] **P3 Dead CSS selector** → Task 5 adds `data-chest-link=""` attribute
- [x] **P3 ChatMockup replay** → Task 6 adds Replay button
- [x] **Content — generic demo** → Task 7 rewrites conversation
- [x] **Credibility — WIP badge + no AI projects** → Task 8 removes badge, adds IoT project
- [x] **No placeholder steps** — all steps include exact code
- [x] **Both `en.json` and `es.json` updated** in Task 8
