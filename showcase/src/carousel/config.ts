/** Scroll + layout tunables — mirrored from liquid-glass-carousel config. */
export const CONFIG = {
  PANEL_H: 450, // px height — same for every panel; width = aspect × height
  PANEL_HEIGHT_RATIO: 0.6,
  GAP: 12, // px gap between panels (reference default)
  EASE: 0.16,
  WHEEL: 1.19,
  SNAP: true,
  SNAP_DIST: 149,
  // Let the natural scroll easing finish before gently correcting to a card.
  SNAP_DELAY: 130,
  // The snap must read as the tail of the scroll, never a second movement.
  SNAP_STRENGTH: 0.04,
  SNAP_IDLE_BOOST: 0.06,
  SHRINK_MAX: 24,
  SHRINK_ATTACK: 0.14,
  SHRINK_DECAY: 0.06,
  SHRINK_IDLE_DECAY_BOOST: 0.05,
  SHRINK_BASE: 0.25,
  SHRINK_FAST_BOOST: 0.09,
  // Video decode policy. Sources are prepared before their card enters, but
  // animation only starts once the strip is readable rather than flying past.
  VIDEO_PRELOAD_DISTANCE: 720,
  VIDEO_PRELOAD_LEAD_TIME: 0.65,
  VIDEO_PRELOAD_MAX_DISTANCE: 1800,
  VIDEO_PLAY_DISTANCE: 420,
  // Pixels per second, not pixels per frame: stable across 60/120Hz displays.
  VIDEO_PLAY_MAX_SPEED: 2200,
  VIDEO_PLAY_RESUME_SPEED: 1400,
  VIDEO_MAX_PRELOAD: 5,
  // During a flick, the outward edge of panels near the viewport boundary
  // lifts into a shallow cinematic flare. The centre panel remains flat.
  EDGE_FLARE_ENABLED: true,
  EDGE_FLARE_MAX: 19,
  EDGE_FLARE_RANGE: 369,
  EDGE_FLARE_CURVE: 1.7,
  ROW_OFFSET_Y: 0.16,
};

/**
 * Lens tuned quiet for a portfolio strip. The rim is fitted to the viewport
 * edge so the glass reads as a screen surface, not an overlay on the media.
 */
export const LENS = {
  // The original full-screen glass post-process changes video colour values.
  // Keep its configuration available, but render the portfolio media directly.
  enabled: false,
  shape: 'square' as const,
  squareRound: 0.08,
  fitViewport: true,
  viewportBleed: 0.16,
  centerShade: 0,
  rotation: 0,
  spin: 0,
  sizeX: 0.72,
  sizeY: 1,
  posX: 0.5,
  posY: 0.5,
  zoom: 0,
  // Keep the glass geometry, but leave media pixels colour-accurate.
  dispersion: 0,
  blur: 0,
  glow: 0,
  whiteGlow: 0,
  novaSize: 4,
  blueRing: 0,
  ringRadius: 0.49,
  ringWidth: 0.007,
  shimmer: true,
  shimmerFreq: 8,
  shimmerSpeed: 1.4,
  shimmerDepth: 0.02,
  rimStart: 0.84,
  rimTangential: 0.05,
  rimInward: 0,
  rimFreq1: 2,
  rimFreq2: 1,
  blueColor: '#8a9eae',
  rimLine: 0,
  rimLinePos: 0.491,
  rimLineWidth: 0.002,
  vignette: 0,
  vignetteSize: 0.3,
  samples: 8,
};

export const FOCUS = {
  cardDuration: 0.7,
  focusDuration: 0.9,
  cardEase: 'power4.out',
  focusEase: 'power3.out',
  stagger: 0.06,
  dropDist: 1.4,
  centerScale: 1.18,
  lensFade: 0.85,
};

/** Disabled — showcase header is the intro. */
export const ENTRY = {
  enabled: false,
  delay: 0,
  startH: 80,
  riseDuration: 1,
  stagger: 0.07,
  riseEase: 'power3.out',
  fromBelow: 0.9,
  growDelay: 0.25,
  growDuration: 2.15,
  growEase: 'expo.inOut',
  growStagger: 0.085,
  growDir: 'inward' as const,
  lensBloom: 1.4,
  lensBloomEase: 'power2.inOut',
};

export type CarouselItem = {
  /** Stable project identity. Filtering and selection never use array indexes. */
  id: string;
  /** Still / poster shown immediately (and for image-only projects). */
  src: string;
  /** Optional looping video — plays while the panel is on screen. */
  video?: string;
  /** Width / height. Required for correct proportions before media decodes. */
  aspect: number | null;
  brand: string;
  desc: string;
  /** Optional external case study opened from a client-work panel. */
  caseStudyUrl?: string;
  /** Action label shown over an external panel. */
  caseStudyLabel?: string;
};

/**
 * Pre-measured aspects so panels never open at 1:1 and then stretch.
 * Values match the actual showcase-media / showcase-thumbs files.
 */
export const PROJECT_ASPECTS: Record<string, number> = {
  'figma-org-structure': 1.3326,
  prevue: 1.7062,
  'mobile-motion-concept': 1.25,
  'shape-morph-tool': 1,
  'toggle-demo-physics': 1.3333,
  'wavy-dropdown': 1,
  studyloop: 1.3333,
  dealdoc: 1.5015,
  tickle: 1.2503,
  'magicpath-experiments': 1.6552,
  'card-tilt': 1.1594,
  magicpath: 1.5894,
  'skeuomorphic-buttons': 1,
  'chain-landing': 1.25,
  'strava-redesign': 0.8,
  'greex-defi': 1,
  'indianoil-dashboard': 1.5009,
  'ova-app': 1.25,
};
