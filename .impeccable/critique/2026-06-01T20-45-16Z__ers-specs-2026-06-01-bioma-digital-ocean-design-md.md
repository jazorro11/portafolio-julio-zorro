---
target: docs/superpowers/specs/2026-06-01-bioma-digital-ocean-design.md
total_score: 29
p0_count: 0
p1_count: 4
timestamp: 2026-06-01T20-45-16Z
slug: ers-specs-2026-06-01-bioma-digital-ocean-design-md
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Hook position is the only depth signal. No progress indicator visible to screen readers. No loading state for pin sequence. |
| 2 | Match System / Real World | 4 | Fishing hook = discovery, depth = expertise, treasure = contact. Metaphor coherent end-to-end. |
| 3 | User Control and Freedom | 2 | 200vh Hero pin traps scroll. CTA bypass specced but gsap.to(heroPinTrigger) is unsafe on null ref. No section-jump nav. |
| 4 | Consistency and Standards | 3 | 32/38 rule consistent. nav.capabilities key name diverges from new Stack section id. Repeated uppercase kickers risk AI scaffolding look. |
| 5 | Error Prevention | 3 | Contact is links-only so form validation is eliminated. MCP asset 404 fallback not specced. |
| 6 | Recognition Rather Than Recall | 4 | Hook always visible. Section environments visually distinct enough to orient. |
| 7 | Flexibility and Efficiency | 2 | No keyboard section jumps. Nav not updated to #stack. Pin penalizes fast scrollers on slow devices. |
| 8 | Aesthetic and Minimalist Design | 3 | Earned-complexity principle sound. Stack bubble count unspecified. |
| 9 | Error Recovery | 3 | Links-only contact removes main error surface. New TreasureChest anchor elements need rel=noopener. |
| 10 | Help and Documentation | 3 | Self-explaining metaphor covers the gap. Title/meta handled by locale layout. |
| **Total** | | **29/40** | **Good — solid foundation, five ship-blocking gaps** |

## Priority Issues

[P1] SSR hydration: heroPinTrigger null-ref in CTA bypass
[P1] gsap.registerPlugin(ScrollTrigger) location ambiguous after SmoothScroll/OceanSystem migration
[P1] Three.js: @types/three in dependencies (not devDependencies), both must be removed
[P1] i18n: depth labels, alt text for astronaut + chest, and scroll indicator not enumerated in spec
[P2] position: fixed FishingThread layout shift on first hydration — needs opacity-0 initial render
[P2] borderLeft side-stripe in About/index.tsx line 138 not flagged for removal in spec
[P2] OceanSystem + SmoothScroll coexistence: two Lenis instances if SmoothScroll not deleted from layout.tsx
