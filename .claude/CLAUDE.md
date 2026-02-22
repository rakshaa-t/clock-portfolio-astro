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

Source: emilkowal.ski — "Building a Toast Component", "7 Practical Animation Tips", "Good vs Great Animations"

### Easing

- **Primary easing: `cubic-bezier(0.32, 0.72, 0, 1)`** — custom ease-out, more energetic than built-in `ease-out`
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
- **Tooltips: 125ms** (`0.125s`)
- **Toasts: 400ms** entry with ease (exception to 300ms rule — toasts are passive, not blocking user action)
- **Frequent actions: remove animation entirely** — if the user does it tens/hundreds of times a day, animation becomes annoying

### Scale

- **Button press: `scale(0.97)`**
- **Never animate from `scale(0)`** — minimum entry scale is `0.9`. Objects don't appear from nothing
- **Tooltip/popover entry: `scale(0.97)`**
- **Modal entry: `scale(0.93)`**

### Origin

- **All animations must be origin-aware** — animate FROM the trigger element, not from center/edge of screen
- **Set `transform-origin`** to match the anchor point (e.g. a dropdown from a button should scale from the button's position)
- **Toasts originate from their trigger** — if the trigger is bottom-left, the toast scales in from bottom-left
- In the aggregate, unseen details compound into perceived polish

### Transitions vs Keyframes

- **Prefer CSS transitions over keyframes** — transitions can be interrupted and retargeted mid-animation. Keyframes lock end positions
- **Use keyframes only** for infinite/decorative loops (spinners, ambient motion)

### Techniques

- **Only animate `transform` and `opacity`** — GPU-composited, no layout/paint cost
- **Use `filter: blur(2px)` as a bridge** when no easing/duration combination feels right — it blends old and new states so the eye perceives smooth motion
- **Swipe-to-dismiss: use velocity, not just distance** — a fast short swipe should dismiss (threshold: velocity > 0.11)
- **Pause timers when tab is hidden** — `document.visibilitychange`
- **Test in slow motion** — play animations at 0.25x to catch timing mismatches invisible at full speed
- **Don't animate multiple unrelated properties simultaneously** (e.g. position + color) without testing in slow-mo

### Don'ts

- No `transition: all` — always specify exact properties
- No `ease-in` — ever
- No `scale(0)` entry — minimum `0.9`
- No delayed subsequent tooltips — if user is already hovering in a toolbar, show next tooltip instantly with `transition-duration: 0ms`
- No animation on hyper-frequent actions

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
