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
- Scale buttons on press: `scale(0.97)`
- Keep animations under 300ms
- Only animate `transform` and `opacity` (GPU-accelerated)
- Use `ease-out` for enter/exit transitions
- Minimalism as core principle — uncommon taste and care, not excess
- No text effects (no embossing, debossing, or letterpress on any text)
- Don't implement plan phases without explicit user approval

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
