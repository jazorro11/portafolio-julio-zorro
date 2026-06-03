# Product

## Register

brand

## Users

Recruiters, hiring managers, technical leads, and potential clients evaluating Julio Zorro as a hire or collaborator. They open the site on a laptop or phone, typically during a review session. They are scanning for signal fast: capability, taste, originality. A recruiter spends 30 seconds deciding if this person is worth a call; a CTO spends 2 minutes deciding if this person thinks differently. Both need to feel something memorable.

## Product Purpose

Personal portfolio for Julio Zorro, AI Engineer and Full Stack Developer from Colombia. The portfolio must do three things: demonstrate technical depth (AI systems, full-stack, IoT research published in Nature), prove exceptional design taste (the site itself is the evidence), and be impossible to forget. Success means a visitor closes the tab thinking "I've never seen a portfolio like that."

## Brand Personality

Explorador · Vivo · Técnico

Voice is confident without being loud. The site speaks through the experience, not through adjectives. Copy is sparse and precise; the animation does the talking. Tone: a scientist who is also an artist — curious, deliberate, unhurried.

## Anti-references

- **Generic Tailwind portfolios**: hero photo + skills grid + identical project cards. The default template every junior dev ships. Zero recall.
- **All-white minimalism**: pure white backgrounds, oversized typography, no visual identity beyond fonts. Feels safe, forgotten immediately.
- **Aggressive Three.js showcase**: WebGL particles on every surface, heavy canvas, the tech is the point rather than the story. Performance penalty with no narrative payoff.
- **Synthwave/neon aesthetic**: purple + pink neon + retro grid. Saturated "dev cool" aesthetic that peaked in 2020.

## Design Principles

1. **The scroll is the story.** Every pixel of vertical movement has meaning. The hook descending is not decoration — it is the user's progress through Julio's depth.
2. **Earned complexity.** Bioluminescent glow is sparse at the surface, overwhelming at the trench. Complexity must be earned by depth, not distributed evenly.
3. **Amber is the signature.** Amber (#FF8C42) is the one non-negotiable color. It appears on the hook, the moon, the CTAs. Everything else in the ocean serves it.
4. **Show, don't name.** Never write "creative developer." Let the site prove it. Copy is functional: name, role, project descriptions. The design does the rest.
5. **Performance is respect.** A sluggish portfolio signals poor judgment. CSS and SVG carry the visual weight; GSAP is surgical; MCP-generated assets are the exception, not the rule.

## Accessibility & Inclusion

- WCAG AA contrast minimum on all text (especially text over dark ocean backgrounds)
- `prefers-reduced-motion`: disables all GSAP decorative animations, retains fade-ins only
- Bilingual: ES/EN via next-intl, all new strings added to both locales
- No text embedded in images or SVGs without accessible alternatives
