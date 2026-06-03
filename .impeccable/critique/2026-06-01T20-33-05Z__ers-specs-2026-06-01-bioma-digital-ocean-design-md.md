---
target: docs/superpowers/specs/2026-06-01-bioma-digital-ocean-design.md
total_score: 28
p0_count: 0
p1_count: 3
timestamp: 2026-06-01T20-33-05Z
slug: ers-specs-2026-06-01-bioma-digital-ocean-design-md
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Hook position is the only depth signal. Slow initial pin risks loading confusion. |
| 2 | Match System / Real World | 4 | Fishing hook = discovery, depth = expertise, treasure = contact. Metaphor holds. |
| 3 | User Control and Freedom | 2 | 200vh Hero pin traps scroll. No skip mechanism. No section-jump nav. |
| 4 | Consistency and Standards | 3 | 32%/38% rule consistent. Section-label uppercase risks AI scaffolding look. |
| 5 | Error Prevention | 3 | Contact form validation mentioned but unspecified. |
| 6 | Recognition Rather Than Recall | 4 | Hook always visible as position anchor. Section environments visually distinct. |
| 7 | Flexibility and Efficiency | 2 | No keyboard section jumps. No direct-to-Projects nav. Pin penalizes fast scrollers. |
| 8 | Aesthetic and Minimalist Design | 3 | Earned complexity principle sound. Stack bubbles and kickers could add noise. |
| 9 | Error Recovery | 2 | Contact form error path completely unspecified. |
| 10 | Help and Documentation | 3 | Self-explaining metaphor covers the gap. |
| **Total** | | **28/40** | **Good — solid foundation, clear issues to resolve** |

## Priority Issues

[P1] Motion violations: back.out on hook and chest — replace with power3.out/power4.out
[P1] Raw hex tokens — convert to OKLCH, reduce chroma at extremes
[P1] Contact payoff unspecified — decide: links only (recommended) vs form
[P2] 200vh pin with no escape — add sessionStorage skip or CTA acceleration
[P2] Repeated section kickers — integrate depth indicator into SVG thread, not text labels

## Persona Red Flags

Jordan: 2.2s animation before name appears. No loading signal.
Casey: 200vh mobile pin feels broken. Needs mobile reduction to 80-100vh.
Technical Evaluator: No nav to skip to Projects. CTA must bypass or accelerate pin.

## Minor Observations

- Remove Three.js deps after WebGL scene replacement
- AmbientBackground component fate unspecified
- Confirm will-change: stroke-dashoffset on thread SVG
- aria-hidden on all decorative SVGs
