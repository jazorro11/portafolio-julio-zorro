---
target: docs/superpowers/specs/2026-06-01-bioma-digital-ocean-design.md
total_score: 28
p0_count: 0
p1_count: 3
p2_count: 3
timestamp: 2026-06-01T20-46-57Z
slug: ers-specs-2026-06-01-bioma-digital-ocean-design-md
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | hookY / depthProgress is well-specced; coral glow gives bilateral feedback. Missing: no loading state for WebP assets, no visible scroll-depth progress indicator. |
| 2 | Match System / Real World | 4 | Fishing metaphor is coherent throughout. Depth labels reinforce real-world ocean scale. CTA bypass matches user intent directly. |
| 3 | User Control and Freedom | 3 | Hero pin CTA bypass is correctly specced. Missing: keyboard-nav escape from pin, no scroll-to-top affordance from deep sections. |
| 4 | Consistency and Standards | 3 | OKLCH token system is internally consistent. Easing family is cohesive. Gap: jellyfish use GSAP float, skill bubble hovers use CSS with no reconciliation. |
| 5 | Error Prevention | 2 | No gsap.killTweensOf() guard before chest timeline re-trigger. What happens if user reaches Contact before OceanSystem finishes mounting is unspecced. |
| 6 | Recognition Rather Than Recall | 4 | Thread plus hook is a persistent progress metaphor. Skill categories use color-coded borders for scannable recognition. |
| 7 | Flexibility and Efficiency | 2 | CTA bypass exists. No keyboard shortcut path. No skip-to-content link. Reduced-motion users get fade-only with no alternative narrative path. |
| 8 | Aesthetic and Minimalist Design | 3 | Earned complexity principle is structurally sound. Risk: jellyfish plus light shafts plus stagger reveals plus thread plus hook plus parallax in About simultaneously. Pulpo SVG in Work may be one animated element too many. |
| 9 | Error Recovery | 2 | No specced behavior when WebP assets fail to load. Chest animation is once: true; if ScrollTrigger fires before image loads, animation plays against a broken placeholder. |
| 10 | Help and Documentation | 2 | Depth labels add orientation. No scroll hint or affordance for first-time visitors. No micro-copy explaining the interactive thread metaphor. |
| **Total** | | **28/40** | **Good: address weak areas, solid foundation** |

## Anti-Patterns Verdict

The concept does not read as AI-generated. The fishing hook narrative is specific and committed. OKLCH chroma discipline and bilateral ScrollTrigger coral glow signal deliberate craft. Second-order slop risk: bioluminescent neon-on-black palette edges toward the synthwave/crypto-neon lane the brief explicitly bans. The spec guards against this through OKLCH chroma discipline, but implementation will need to hold the line in the trench section. No absolute bans triggered. CLI detector bundle absent in this worktree; scan unavailable.

## What's Working

1. Hero pin bypass: gsap.to(heroPinTrigger, { progress: 1, duration: 0.3 }) followed by lenis.scrollTo is the correct solution to the user-trapped-in-a-pin problem.
2. Lenis/GSAP bridge: three-line bridge with lagSmoothing(0) is complete and technically correct.
3. Easing family discipline: power3.out for hook entry, power2/4.out for coral/chest is an intentional gradient matching the narrative arc.

## Priority Issues

[P1] filter: drop-shadow animation on coral triggers CPU rasterization on every frame. SVG filter is not GPU-composited. Fix: replace with opacity-tweened glow overlay element.

[P1] Chest lid rotateX: -35deg has no transformOrigin or transformPerspective. Lid will rotate around element center, not from hinge. Fix: gsap.set(lid, { transformOrigin: "top center", transformPerspective: 400 }).

[P1] No exit animations for any section element except coral. On up-scroll, all reveals are in arrived state with no reverse transition. Fix: add toggleActions: "play none none reverse" as a system rule.

[P2] depthProgress body trigger will not track during hero pin. Body-based progress stays near zero during 200vh pin scroll, then snaps. Fix: blend heroProgress and post-pin ScrollTrigger.

[P2] No focus-visible ring specification anywhere. Amber/dark palette makes default rings invisible. Fix: define --focus-ring token and apply via :focus-visible.

[P2] Skill bubble hover scale unguarded by will-change. Fix: add will-change: transform to .skill-bubble.

[P3] Jellyfish float loop has no phase offset between instances; they will sync visually.

[P3] Octopus tentacle animation under-specced. Add concrete parameters or mark as cuttable.

[P3] FishingThread SVG missing aria-hidden="true" and role="presentation".

## Persona Red Flags

Jordan (Recruiter, First-Timer): No scroll hint means the interactive narrative is invisible until accidentally discovered. The hook metaphor is not self-explaining.

Casey (Mobile, Distracted): Mobile animation reduction rules only mention coral glow off and hero pin reduction. Astronaut parallax and pulpo animation are not in the reduction list. Mid-range Android frame budget at risk.

Sam (Accessibility): FishingThread still animates under prefers-reduced-motion because it is driven by ScrollTrigger, not classified as decorative. Hook SVG needs aria-hidden.

## Minor Observations

strokeDashoffset path length math unspecced. BioParticles N is unspecified (recommend max 16 mobile / 32 desktop). Contact links missing :active press feedback. OceanBackground crossfade mechanism unspecified (CSS vs GSAP). New i18n keys not listed in spec.

## Questions to Consider

What is the concrete OKLCH upper chroma bound for trench particles? Without a hard number, implementations will drift toward the synthwave lane. Is the octopus narrative-critical or decorative? What is the reduced-motion user's experience of this portfolio beyond fade-ins?
