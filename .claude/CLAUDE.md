# Clock Portfolio — Project Instructions

## Architecture

- **Framework:** Astro (static site)
- **Entry:** `src/pages/index.astro`
- **Styles:** `src/styles/global.css` (single CSS file, no preprocessor)
- **Scripts:** `src/scripts/clock-engine.js` (vanilla JS, no framework)
- **Fonts:** GeistPixel (local .ttf), Geist + Geist Mono (Google Fonts)

## Design Language

Skeuomorphic — every element should feel like a real physical object on a desk.

### Core Principles
1. **Contact shadows** — tight dark shadow where object meets surface
2. **Visible thickness** — objects have edges you can see from the side
3. **Surface noise** — felt (coarse), plastic (medium), paper (fine), cardstock (very fine)
4. **Specular highlights** — radial-gradient bright spots, not broad linear gradients
5. **Imperfection** — slight rotations, askew placement
6. **State-shadow coupling** — press = shadow tightens, lift = shadow softens
7. **Consistent light source** — top-left overhead

### Texture Tokens (CSS custom properties)
- `--noise-matte` — device shells (baseFreq 0.9)
- `--noise-paper` — paper surfaces (baseFreq 1.2)
- `--noise-felt` — desk surface (baseFreq 0.65)
- `--noise-cardstock` — thick paper (baseFreq 1.8)

### Shadow System
- Contact shadow: tight, dark, close to object
- Cast shadow: directional from top-left light
- Diffuse shadow: soft ambient

### Material Types
- **Felt desk pad** — body background
- **Glass dome** — clock face overlay
- **Matte plastic** — device shells (Kindle)
- **Cardstock** — puzzle cards
- **Metal** — clock hand, buttons

### App Mockups (NOT physical objects)
Apple Notes and Mymind are **digital app mockups** — they should match the look and feel of the original apps, not be forced into physical object metaphors. No paper textures, no cardstock noise. Keep them clean and faithful to the real apps.

## Sections

| Position | Section | Style |
|----------|---------|-------|
| 12 o'clock | Work | Puzzle grid of project cards |
| 3 o'clock | Notes | Apple Notes window mockup |
| 6 o'clock | Mymind + Kindle | Masonry grid + e-reader device |
| 9 o'clock | About | Bio + CTAs |

## Key Interactions

- Clock hand rotates via scroll/touch, snaps to positions
- Full 360° rotation triggers "push" transition to browse mode
- Thumbnail clicks open modal with carousel
- Puzzle cards open modal
- Kindle has tap zones for page turning
- Mini clock bar appears in browse mode for returning

## Dev Commands

```bash
npm run dev    # localhost:4321
npm run build  # production build
```

## Rules

- **Minimum font-size: 12px** — no text smaller than 12px on any breakpoint (desktop or mobile)
- Single CSS file — no CSS modules or preprocessor
- Vanilla JS only — no React, no build-time JS frameworks
- Respect `prefers-reduced-motion` for all animations
- Minimalism as core principle — uncommon taste and care, not excess
- No text effects (no embossing, debossing, or letterpress on any text)
- Don't implement plan phases without explicit user approval

## Animation Rules (Emil Kowalski principles)

Source: emilkowal.ski — all 11 articles (Toast, Drawer, 7 Tips, Good vs Great, Great Animations, You Don't Need Animations, Clip Path, CSS Transforms, Hold to Delete, Developing Taste, Animating in Public)

### Easing

- **Primary easing: `cubic-bezier(0.32, 0.72, 0, 1)`** — custom ease-out, more energetic than built-in `ease-out`
- **iOS sheet / drawer: same curve at 500ms** — matches Apple's native sheet animation feel
- **Never use `ease-in`** for UI animations — it speeds up at the end, feels sluggish
- **Never use `ease` or `ease-out` (built-in)** for polished work — they're too weak. Only acceptable for trivial hover background-color changes
- **Use `ease-in-out` only** for natural physical motion (something starting and stopping, like a car)
- **CSS custom properties for project-wide consistency:**
  ```css
  --ease-out: cubic-bezier(0.32, 0.72, 0, 1);       /* enters/exits, most UI */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);    /* snappy feedback */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);  /* overshoot, playful */
  ```

### Timing

- **UI animations: under 300ms** — anything longer feels sluggish
- **Responsiveness sweet spot: 180ms** — feels noticeably snappier than 300ms
- **Tooltips: 125ms** (`0.125s`) with slight delay on first appearance (prevents accidental triggers)
- **Subsequent tooltips: instant** — if user is already hovering in a toolbar, show next tooltip with `transition-duration: 0ms`
- **Toasts: 400ms** entry with ease (exception to 300ms rule — toasts are passive, not blocking user action)
- **Frequent actions: remove animation entirely** — if the user does it tens/hundreds of times a day, animation becomes annoying
- **Press/release asymmetry:** slow confirmation (e.g. 2s linear hold-to-delete), fast dismissal (200ms ease-out on release)

### Scale

- **Button press: `scale(0.97)`** — instant feedback, 160ms ease-out
- **Never animate from `scale(0)`** — minimum entry scale is `0.9`. Objects don't appear from nothing
- **Tooltip/popover entry: `scale(0.97)`**
- **Modal entry: `scale(0.93)`**
- **Combine scale with opacity** for subtle, polished enter/exit (e.g. `scale(0.5)` + `opacity:0`)

### Origin

- **All animations must be origin-aware** — animate FROM the trigger element, not from center/edge of screen
- **Set `transform-origin`** to match the anchor point (e.g. a dropdown from a button should scale from the button's position)
- **Toasts originate from their trigger** — if the trigger is bottom-left, the toast scales in from bottom-left
- **Use `%`-based translateY** for variable-height elements (Sonner pattern: toasts of unknown height use `translateY(100%)` not fixed px)
- In the aggregate, unseen details compound into perceived polish

### Scrolling

- **Never use native `behavior:'smooth'`** — browser ease-in-out feels mechanical and is not interruptible
- **Custom scroll easing:** use `smoothScrollTo()` from shared.js with ease-out cubic (≈ cubic-bezier(0.32,0.72,0,1))
- **Scale duration with distance:** min 300ms, max 600ms — short scrolls are snappy, long scrolls stay controlled
- **Always interruptible:** cancel programmatic scroll on user wheel/touch/key
- **Damping on over-scroll:** the more you drag past a boundary, the less it moves (diminishing returns, not hard stop)
- **Scroll momentum protection:** after scrolling past a boundary at high velocity, add a ~100ms timeout before allowing drag-to-dismiss (prevents accidental dismissal)

### Transitions vs Keyframes

- **Prefer CSS transitions over keyframes** — transitions can be interrupted and retargeted mid-animation. Keyframes lock end positions
- **Use keyframes only** for infinite/decorative loops (spinners, ambient motion)

### Techniques

- **Only animate `transform` and `opacity`** — GPU-composited, no layout/paint cost
- **`clip-path` is hardware-accelerated** — use `inset()` for reveals instead of height/overflow transitions. No layout shift since element already occupies space
- **Use `filter: blur(2px)` as a bridge** when no easing/duration combination feels right — it blends old and new states so the eye perceives smooth motion
- **Swipe-to-dismiss: use velocity, not just distance** — a fast short swipe should dismiss (threshold: velocity > 0.11)
- **Snap points with momentum:** users should be able to skip snap points or close completely with sufficient force
- **Pause timers when tab is hidden** — `document.visibilitychange`
- **Test in slow motion** — play animations at 0.25x to catch timing mismatches invisible at full speed
- **Don't animate multiple unrelated properties simultaneously** (e.g. position + color) without testing in slow-mo
- **Reverse-engineer great UI** — inspect animations you admire, study their curves and timing

### Gestures & Drag

- **CSS variables cause style recalc for all children** — when dragging, apply transforms directly to elements instead of updating CSS vars
- **Multi-touch: ignore subsequent touches** after initial one until release (prevents position jumps when switching fingers)
- **Virtual keyboard: use Visual Viewport API** to detect keyboard, not browser scroll heuristics

### When NOT to Animate

- **Never animate keyboard-initiated actions** — repeated hundreds of times daily, animation becomes friction
- **Every animation must serve a purpose:** explain functionality, provide feedback, create spatial consistency, or delight (rarely)
- **No animation on hyper-frequent actions** — if it happens tens/hundreds of times a day, skip it
- **The best animation is sometimes no animation at all**

### Don'ts

- No `transition: all` — always specify exact properties
- No `ease-in` — ever
- No `scale(0)` entry — minimum `0.9`
- No native `scrollIntoView({behavior:'smooth'})` or `window.scrollTo({behavior:'smooth'})` — use custom scroll
- No `requestAnimationFrame`-based animations when CSS transitions or WAAPI can do the job (rAF is OK for scroll since CSS can't drive scroll position)
- No animating `padding`, `margin`, `height`, `width` — triggers layout. Use `transform` and `clip-path` instead

## Performance Guardrails

The push transition (clock → browse) transforms `.browse-content` as one compositor layer. Everything inside it contributes to paint cost. Follow these rules strictly:

- **Shadows:** 2 layers max per element, blur radius under 16px
- **No blend modes inside browse-content** — `mix-blend-mode` and `background-blend-mode` on scrolling surfaces force repaint every frame
- **No `filter` on containers with children** — `filter: drop-shadow()` etc. repaints the entire subtree every frame
- **No SVG feTurbulence noise textures** on browse-content or its children — extremely expensive to rasterize
- **No `transition: all`** — always specify exact properties (e.g. `transition: transform 0.2s ease-out, opacity 0.2s ease-out`)
- **No `backdrop-filter: blur()`** on large surfaces — OK on small elements (< 100px)
- **`will-change` only where needed** — don't add it speculatively
- **In `applyDockProgress()`** — only write compositor properties (transform, opacity) every frame; gate non-compositor writes (pointer-events, classList) behind threshold checks to avoid style recalc thrashing
