---
timestamp: 2026-06-02T22-42-44Z
slug: ers-specs-2026-06-01-bioma-digital-ocean-design-md
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Depth badge shows hardcoded "0m · Surface" regardless of scroll position — a user at the Trench section still reads "Surface." Actively wrong, not merely absent. |
| 2 | Match System / Real World | 4 | Ocean descent metaphor is coherent and specific throughout. CTA now correctly targets #about. Amber signature consistent across all sections. Depth labels use real ocean measurements. |
| 3 | User Control and Freedom | 3 | Mobile drawer: Escape key, focus trap, backdrop-close, Lenis stop/start — thoroughly implemented. Hero pin bypass works. Missing: scroll-to-top from deep sections, keyboard path out of hero pin, skip-to-content link. |
| 4 | Consistency and Standards | 3 | "Now" chapter card correctly restored to dark bg + amber border. Mobile/desktop nav use same visual language (font-mono uppercase). Minor gap: #FF8C42 hardcoded in 4+ places vs oklch/var(--color-accent) — two parallel color languages. |
| 5 | Error Prevention | 2 | Mobile nav useEffect fires on mount (focus steal on mobile page load). No image fallbacks for 12 PNG assets — a 404 collapses a section to solid dark with no visual context. No gsap.killTweensOf() guard on chest timeline. |
| 6 | Recognition Rather Than Recall | 3 | ChatMockup correctly starts on viewport entry (threshold 0.3). Thread+hook persistent metaphor. But Capabilities presents 12 category groups (8 software + 4 hardware) + 30+ pills simultaneously with no progressive disclosure — exceeds recognition capacity. |
| 7 | Flexibility and Efficiency | 3 | Mobile nav was P0 (no navigation on mobile) — now fully implemented with drawer, escape, focus management. CTA bypass still works for expert shortcut. Still missing: skip-to-content, keyboard shortcuts, scroll-to-top from Contact. |
| 8 | Aesthetic and Minimalist Design | 3 | PNG backgrounds create distinct depth-zone atmosphere per section — earned complexity principle working as designed. Risk areas: Hero compounds bg-surface + 60 SVG stars + moon + horizon + astronaut-boat + scroll indicator + depth badge simultaneously. Depth badge adds clutter while being wrong. |
| 9 | Error Recovery | 2 | No image fallbacks for 7 creature PNGs + 5 background PNGs. ChatMockup completes 6-message sequence and then dies — no replay affordance. Contact links accessible but no :active feedback on most interactive elements. |
| 10 | Help and Documentation | 2 | Scroll indicator + "SCROLL" text present. Depth badge present but static. Bilingual ES/EN via next-intl sound. No skip-to-content link. FishingThread SVG has no aria-hidden. Ocean narrative not self-explaining for screen readers. |
| **Total** | | **27/40** | **Acceptable — solid implementation with targeted tactical gaps** |

## Anti-Patterns Verdict

**LLM assessment**: The portfolio does not read as AI-generated at the macro level. The ocean descent metaphor is specific and committed — it does not recur in any template library. OKLCH chroma discipline (semi-transparent overlays: `oklch(0% 0 0 / 0.4–0.5)`) keeps dark sections from tipping into the synthwave neon lane explicitly banned in the brief. The PNG creature assets (jellyfish, anglerfish, parrotfish, astronaut variants) add organic specificity that generic portfolios lack. Second-order risk is contained: the bioluminescent particle counts are appropriately restrained (desktopCount 12–20, mobileCount 6–10).

The one aesthetic warning sign: the depth badge always reading "0m · Surface" regardless of depth is inconsistent with the site's own internal logic. A design director would notice the dissonance immediately — the system claims to know you're at 0m while you're clearly in the abyss.

**Deterministic scan**: Bundled detector not found — same failure as previous runs. CLI scan unavailable in this worktree.

**Visual overlays**: Browser automation not available. No overlay injection. Fallback: direct source code review across all 8 component files.

## Overall Impression

The implementation is substantially better than the last spec critique suggested it would be. The P0 mobile nav is fully implemented with a quality above the minimum spec (focus trap, Escape key, Lenis integration, ARIA dialog). The ChatMockup viewport-entry trigger and the "Now" card dark-theme restoration are clean fixes. The ocean narrative is structurally present — 5 distinct section backgrounds, progressive particle density, amber signature through all CTAs.

The single biggest opportunity is the depth badge: it is the one element that bridges the abstract ocean metaphor with concrete user status, and it currently says the same thing at every depth. Fix this and H1 jumps to 4. The second opportunity is the Capabilities section cognitive load — it's the only section that breaks the cinematic scroll pacing.

## What's Working

1. **Mobile nav execution quality** — the drawer implementation goes beyond the minimum: opacity fade (not a slide, which would fight Lenis), correct `aria-modal`/`role="dialog"`, `firstDrawerLinkRef` focus on open, `hamburgerRef` focus on close, `getLenis()?.stop()` integration. The hamburger icon uses amber accent — consistent with the signature color.

2. **Section background layering** — the CSS architecture (`backgroundColor` + `backgroundImage` on the OceanBackground outer div, with a semi-transparent `oklch(0% 0 0 / 0.4–0.5)` overlay div) is technically correct. The 45% black overlay gives text contrast while letting the bioluminescent PNG through. This is not the obvious implementation and it's right.

3. **ChatMockup viewport trigger + content specificity** — IntersectionObserver with `threshold: 0.3`, `observer.disconnect()` after first intersection, and a `started` state gate prevents pre-viewport firing. The conversation content ("LATAM +34%", "Week 32 dip linked to system outage", "EU Unit 4 underperforming vs forecast") is specific enough to read as real work rather than placeholder text.

## Priority Issues

**[P1] Depth badge hardcoded "0m · Surface" — wrong information at 4 of 5 depth zones**
- **What**: `Hero/index.tsx` line 293: `"0m · Surface"` is a string literal. The badge uses `depthProgress` only for opacity (shows when > 0.02). At every section from About onward, it still reads Surface.
- **Why it matters**: This is the primary system status artifact for the ocean narrative. At the Trench section (Contact), a user simultaneously sees the deepest, darkest section and a badge telling them they're at the ocean surface. It breaks suspension of disbelief and signals the badge is broken.
- **Fix**: Map `depthProgress` (0→1) to zone thresholds: `≤0.2 → "0m · Surface"`, `≤0.4 → "200m · Shallow"`, `≤0.6 → "800m · Reef"`, `≤0.8 → "3,500m · Abyss"`, `>0.8 → "11,000m · Trench"`. The badge is already `position: fixed` and reads from `useOcean()` — only the label computation needs to change.
- **Suggested command**: `$impeccable harden` (accuracy fix, not a visual refine)

**[P1] No exit animations — every section is permanently arrived**
- **What**: All `whileInView` animations use `once: true` / `viewport: { once: true }`. On up-scroll, every section is already fully revealed — no transition reversal. The descent narrative only works downward.
- **Why it matters**: A recruiter scanning for specific content will scroll up frequently. The jarring "everything already revealed" state on up-scroll breaks the depth immersion and makes the narrative feel one-dimensional.
- **Fix**: Change `viewport={{ once: true }}` to `viewport={{ once: false, amount: 0.1 }}` on the primary reveal animations. Add `exit` variants to `RevealBlock` in About for the clip-path reveals. For GSAP ScrollTrigger-based reveals, add `toggleActions: "play none none reverse"`.
- **Suggested command**: `$impeccable animate`

**[P2] Mobile nav `useEffect` focuses hamburger on page mount**
- **What**: `Nav/index.tsx` — the `useEffect([mobileOpen])` has no initial-render guard. On mount with `mobileOpen=false`, the `else` branch fires `hamburgerRef.current?.focus()`. On mobile (where the hamburger is visible), this steals focus to the nav button before any user interaction.
- **Why it matters**: Screen reader users hear "Open menu, button" as the first announced element on mobile. Keyboard users land with tab position at the nav rather than the natural start of the page content.
- **Fix**: Add `const didMountRef = useRef(false)` at the top of the component; inside the `else` branch, check `if (!didMountRef.current) { didMountRef.current = true; return; }` before calling `focus()` and `getLenis()?.start()`.
- **Suggested command**: `$impeccable harden`

**[P2] No active nav link state — 5 sections, 0 wayfinding feedback in the nav bar**
- **What**: Nav links change color on hover but have no indicator showing which section is currently in viewport. The depth badge partially compensates but is not connected to nav items.
- **Why it matters**: Users who use the nav to jump between sections have no confirmation that navigation succeeded. Power users scanning the nav to orient themselves get no feedback. This is a standard convention broken without a strong reason.
- **Fix**: `IntersectionObserver` on each section ID (`#about`, `#stack`, `#work`, `#contact`), `rootMargin: '-40% 0px -40% 0px'`. When a section is intersecting, apply `color: var(--color-accent)` to the corresponding nav link.
- **Suggested command**: `$impeccable harden`

**[P2] Capabilities section: 12 group headers + 30+ pills with no hierarchy**
- **What**: Software (4 categories, ~20 pills) and Hardware (4 categories, ~14 pills) are separated only by a 1px `rgba(0,229,200,0.1)` hairline. The eye has no resting point. The `auto-fit minmax(260px, 1fr)` grid collapses everything to the same visual weight.
- **Why it matters**: This is the section that justifies the "AI Engineer + Full Stack Developer + IoT researcher" headline. But presented as an undifferentiated grid, it reads as comprehensive without communicating depth. Recruiters scanning fast will read the count, not the content.
- **Fix**: Give the Hardware subsection a distinct visual container (subtle dark panel or a `<details>` disclosure) to allow users to focus on the software stack first. Apply size differentiation: AI & Agents category label at accent color (already done), but increase the section heading size for "Software" and "Hardware" labels above their respective grids.
- **Suggested command**: `$impeccable layout`

**[P3] `[data-chest-link]` CSS dead selector in TreasureChest**
- **What**: `TreasureChest.tsx` has a style rule `@media (hover: none) { [data-chest-link] { box-shadow: ... } }` but no element in the component has a `data-chest-link` attribute. The touch-target glow enhancement never fires.
- **Fix**: Add `data-chest-link=""` to each contact `<a>` tag in the `contactLinks.map`, or remove the style rule.
- **Suggested command**: `$impeccable harden`

## Persona Red Flags

**Jordan (Recruiter, 30-second eval)**: Opens on mobile. No navigation issue (mobile nav P0 is resolved). Scrolls to Work — sees only one AI project, marked "WIP." The two secondary projects (architecture firm, a web agency) don't demonstrate AI engineering, which is the headline claim. Jordan exits without a completed AI artifact to point at in a team meeting. The Nature paper link in the IoT card is the only high-signal credibility moment — it's small and may be skipped.

**Casey (Senior Engineer evaluating technical depth)**: Reaches Capabilities and sees LangGraph + LangChain + OpenAI API + Anthropic API + Python simultaneously — breadth signal with no depth signal. The ChatMockup conversation ("Q3 sales report analysis") is a generic demo scenario that doesn't reference the actual agent's specific capabilities (tools used, real domain, real outputs). Casey wonders if this is a wrapper around a tutorial rather than original AI engineering work. The provocative question Assessment A raised is valid: could a live, embedded toy agent — even a 3-tool demo — outperform all the visual craft in conversion impact?

**Sam (Accessibility, keyboard navigation)**: The `useEffect` mount issue means on mobile, the hamburger gets focused immediately — unexpected but benign (display:none would block this on desktop). No visible `focus-visible` ring defined globally — amber palette makes default browser outlines functional but inconsistent. FishingThread SVG is decorative but missing `aria-hidden="true"` — screen readers may encounter it. The depth badge is `aria-hidden="true"` and `pointerEvents: 'none'` — correctly decorative.

## Minor Observations

- Contact section uses `minHeight: '80svh'` vs `100svh` for Hero and about — creates a rhythm break that makes the finale feel abbreviated. The ocean floor should feel expansive, not cramped.
- The "JZ" logo link uses `handleNavClick(e, '#hero')` — on initial page load before any scroll this would be a silent no-op scroll to position 0, which is fine, but unexpected if the user is already at the top.
- `[data-hover=""]` on the CustomCursor ring initializes the attribute as empty string. The CSS selector `[data-hover="true"]` won't match until JS sets it — brittle if hydration is slow.
- `getLenis()?.start()` in the Nav `useEffect` on mount runs before OceanSystem initializes Lenis — `getLenis()` returns null and the call is a no-op. Safe but implies mount ordering is undocumented.
- ChatMockup completes the 6-message sequence and becomes a static dead end. A single "Replay ↺" icon button (bottom-right, `opacity: 0.4`) that resets `visible` to 0 and `started` to false would extend the interactive quality of the portfolio's best feature.
- The `hardwareStack` array is defined outside the component but uses the same `glowColor: 'rgba(255,80,50,0.2)'` for all 4 hardware categories — missed opportunity to differentiate Microcontrollers (amber?) from Connectivity (cyan?) from Low Power (green?).

## Questions to Consider

- The depth badge is the clearest opportunity to make the ocean metaphor feel real-time and alive — 20 lines of code to compute the zone label. Why is the most narrative-critical UI element left as a proof-of-concept stub?
- The featured AI project being "WIP" is the portfolio's largest credibility gap. Does the portfolio need a completed AI artifact more than it needs another section of visual polish?
- What if the ChatMockup were replaced with an embedded API call to the real LangGraph agent — even with a single pre-scripted query? A real response from a real tool would be more memorable than any SVG background.
