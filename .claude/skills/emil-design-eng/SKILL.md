---
name: emil-design-eng
description: Use when reviewing, building, or polishing UI animations, micro-interactions, and component design. Encodes Emil Kowalski's design engineering philosophy. Trigger when animating components, choosing easing curves, designing button states, building popovers/tooltips/modals, or doing a final UI review. Also use for spring animations, drag interactions, clip-path reveals, and scroll-triggered effects.
---

# Emil Design Engineering Skill

Encodes Emil Kowalski's design engineering philosophy covering UI polish, component design, animation decisions, and subtle details that elevate software experiences.

## Core Philosophical Tenets

**Taste is Trainable**: Good taste develops through exposure to excellent work, critical analysis, and consistent practice.

**Invisible Details Compound**: Users rarely notice individual micro-interactions, but their aggregate effect creates experiences people intuitively love.

**Beauty as Business Leverage**: Visual polish and thoughtful animation differentiate tools in markets where features reach parity.

## Animation Decision Framework

### 1. Frequency Analysis
- 100+ daily uses → No animation
- Tens of uses daily → Minimize or eliminate
- Occasional use → Standard animation acceptable
- Rare/first-encounter → Delight animations permitted

**Critical rule**: Never animate keyboard-triggered actions.

### 2. Purpose Validation
Every animation requires clear justification:
- Spatial consistency (directional continuity)
- State indication (visual feedback on change)
- Explanation (teaching interaction)
- Confirmation (system responsiveness)
- Jarring prevention (smooth appearance)

### 3. Easing Selection

**Decision tree**:
- Entering/exiting → `ease-out`
- On-screen movement → `ease-in-out`
- Hover/color changes → `ease`
- Constant motion → `linear`

**Custom curves (preferred over CSS built-ins)**:
- Strong exit: `cubic-bezier(0.23, 1, 0.32, 1)`
- Strong movement: `cubic-bezier(0.77, 0, 0.175, 1)`
- Drawer (iOS-style): `cubic-bezier(0.32, 0.72, 0, 1)`

**Never use `ease-in`** on UI — it delays initial movement, making interfaces feel sluggish.

### 4. Duration Targets

| Category | Duration |
|----------|----------|
| Button press | 100-160ms |
| Small popovers | 125-200ms |
| Dropdowns | 150-250ms |
| Modals/drawers | 200-500ms |

Keep UI animations under 300ms.

## Component Design Principles

### Button Responsiveness
`transform: scale(0.97)` on `:active` with 160ms `ease-out`.

### Entry Animation
Never animate from `scale(0)`. Start from `scale(0.95)` + `opacity: 0`.

### Popover Origin Awareness
Scale from trigger location, not center. Use `transform-origin: var(--radix-popover-content-transform-origin)`.

### Tooltip Sequential Behavior
Initial tooltip delayed. Subsequent tooltips appear instantly (`transition-duration: 0ms`).

### Transition vs. Keyframes
CSS transitions are interruptible. Keyframes restart from zero. Prefer transitions for dynamic UI.

### Blur as Transition Bridge
Apply `filter: blur(2px)` during crossfades when they feel unnatural. Keep under 20px.

### Modern Entry: @starting-style
```css
.element {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 400ms ease, transform 400ms ease;
  @starting-style {
    opacity: 0;
    transform: translateY(100%);
  }
}
```

## CSS Transform Mastery

- `translateY(100%)` moves element by its own height — adaptable across sizes
- `scale()` proportionally scales nested content
- `rotateX()`, `rotateY()` with `transform-style: preserve-3d` for 3D effects
- Match `transform-origin` to trigger location; keep centered for modals

## clip-path Applications

- `inset(0 100% 0 0)` → `inset(0 0 0 0)`: left-to-right reveal
- Scroll-triggered reveals: start `inset(0 0 100% 0)`, animate to `inset(0 0 0 0)` on viewport entry via IntersectionObserver
- Tab color transitions: duplicate element, clip to active tab area, animate clip on change

## Gesture and Drag Mechanics

- **Velocity-Based Dismissal**: Dismiss if velocity > ~0.11
- **Boundary Damping**: Friction as users drag past limits
- **Pointer Capture**: Once drag starts, capture all pointer events
- **Multi-Touch Protection**: Ignore additional touch points after initial drag
- **Friction Over Hard Stops**: Allow dragging past boundaries with resistance

## Spring Animations

Use for:
- Drag interactions with momentum
- Elements embodying "aliveness"
- Interruptible gestures
- Decorative mouse-tracking

**Apple Style (recommended)**: `{ type: "spring", duration: 0.5, bounce: 0.2 }`

Keep bounce between 0.1-0.3 in UI contexts.

## Performance Guidelines

- Only animate `transform` and `opacity` (GPU-accelerated)
- CSS variable changes recalculate all children — update `transform` directly for drag
- Framer Motion shorthand `x`/`y` → use `transform: "translateX(100px)"` string under load
- CSS animations run off-thread; use for predetermined animations
- Web Animations API for native JS control with CSS performance

## Accessibility

- `prefers-reduced-motion`: keep opacity/color transitions, remove movement
- Gate hover animations: `@media (hover: hover) and (pointer: fine)`

## Stagger Animation

Multiple elements entering together: cascade with 30-80ms delays. Never block interaction during stagger.

## Review Checklist

| Issue | Fix | Reasoning |
|-------|-----|-----------|
| `transition: all` | Specify properties | Prevents unintended animation |
| `scale(0)` entry | Start `scale(0.95); opacity: 0` | Maintains visible form |
| `ease-in` on UI | Switch to `ease-out` or custom | Avoids sluggish initial delay |
| `transform-origin: center` on popover | Use trigger location | Popovers scale from anchor |
| Animation on keyboard action | Remove entirely | High-frequency feels slow |
| Duration > 300ms UI | Reduce to 150-250ms | Improves perceived responsiveness |
| Hover animation unguarded | Add `@media (hover: hover)` | Prevents false touch triggers |
| Keyframes on rapid trigger | Use CSS transitions | Enables smooth interruption |
| Framer `x`/`y` under load | Use `transform: "translateX()"` | Maintains GPU acceleration |
| Symmetric enter/exit | Make exit faster | Asymmetry feels intentional |
| Simultaneous entries | Add stagger (30-80ms) | Creates natural cascading |
