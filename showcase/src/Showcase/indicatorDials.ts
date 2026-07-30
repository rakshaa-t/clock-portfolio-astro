import type { CSSProperties } from 'react';

/**
 * Selected-thumbnail indicator lab.
 *
 * Every visual treatment is a *feature* that can be switched on per tile, and
 * every number behind those features is a *dial* exposed as a CSS custom
 * property on `.showcase-shell`. Features decide the mechanism, dials decide
 * the taste — so one set of sliders tunes all six candidate treatments.
 */

export type DialFeature =
  | 'dim'
  | 'veil'
  | 'glow'
  | 'hairline'
  | 'mark'
  | 'label'
  | 'plate'
  | 'width'
  | 'motion';

export type IndicatorVariant = {
  id: string;
  label: string;
  blurb: string;
  feats: DialFeature[];
};

/** Compare mode spreads these across the strip, one per tile, in order. */
export const INDICATOR_VARIANTS: IndicatorVariant[] = [
  {
    id: 'promote',
    label: 'Promote',
    blurb: 'Idle tiles recede, selected lifts with a soft accent glow.',
    feats: ['dim', 'glow', 'hairline', 'mark'],
  },
  {
    id: 'veil',
    label: 'Veil',
    blurb: 'Idle tiles keep full colour under a tonal wash.',
    feats: ['veil', 'glow', 'hairline', 'mark'],
  },
  {
    id: 'motion',
    label: 'Motion',
    blurb: 'Only the selected (or hovered) tile plays its loop.',
    feats: ['veil', 'motion', 'glow', 'mark'],
  },
  {
    id: 'label',
    label: 'Label',
    blurb: 'Project name reveals under the current tile.',
    feats: ['veil', 'label', 'mark'],
  },
  {
    id: 'width',
    label: 'Width',
    blurb: 'Selected tile grows wider and pushes neighbours aside.',
    feats: ['dim', 'width', 'hairline'],
  },
  {
    id: 'plate',
    label: 'Backplate',
    blurb: 'Selected tile sits on an accent-tinted mat.',
    feats: ['dim', 'plate', 'glow'],
  },
];

export type DialParams = {
  // Idle tiles
  idleOpacity: number;
  idleSaturation: number;
  idleBrightness: number;
  idleBlur: number;
  idleScale: number;
  veilStrength: number;
  veilTint: 'strip' | 'ink' | 'accent' | 'canvas';

  // Hover response
  hoverOpacity: number;
  hoverLift: number;
  stateDuration: number;

  // Selected tile
  selectedLift: number;
  liftDuration: number;
  tileRadius: number;
  glowStrength: number;
  glowBlur: number;
  glowY: number;
  hairlineIdle: number;
  hairlineStrength: number;
  hairlineWidth: number;

  // Underline mark
  markWidth: number;
  markHeight: number;
  markGap: number;
  markTint: number;
  markDuration: number;
  markSpring: number;

  // Label
  labelMode: 'selected' | 'hover' | 'always';
  labelSize: number;
  labelTracking: number;
  labelOpacity: number;
  labelGap: number;
  labelCase: 'none' | 'uppercase';

  // Backplate
  platePad: number;
  plateStrength: number;
  plateRadius: number;
  plateBlur: number;
  plateTint: 'accent' | 'ink' | 'surface';

  // Physical width
  widthBoost: number;
  widthDuration: number;

  // Motion
  motionTrigger: 'always' | 'selected' | 'hover';
  posterFade: number;

  // Strip & tiles
  stripSpeed: number;
  edgeFalloff: number;
  tileWidth: number;
  tileGap: number;
  tileAspect: number;
};

export const DEFAULT_DIALS: DialParams = {
  idleOpacity: 0.62,
  idleSaturation: 0.79,
  idleBrightness: 0.71,
  idleBlur: 0,
  idleScale: 0.9,
  veilStrength: 70,
  veilTint: 'strip',

  hoverOpacity: 1,
  hoverLift: 1,
  stateDuration: 240,

  selectedLift: 1.2,
  liftDuration: 280,
  tileRadius: 8,
  glowStrength: 82,
  glowBlur: 23,
  glowY: 6,
  hairlineIdle: 19,
  hairlineStrength: 16,
  hairlineWidth: 1.5,

  markWidth: 62,
  markHeight: 2,
  markGap: 6,
  markTint: 72,
  markDuration: 380,
  markSpring: 1.2,

  labelMode: 'hover',
  labelSize: 9,
  labelTracking: 0.08,
  labelOpacity: 0.9,
  labelGap: 5,
  labelCase: 'none',

  platePad: 6,
  plateStrength: 16,
  plateRadius: 12,
  plateBlur: 0,
  plateTint: 'accent',

  widthBoost: 1.16,
  widthDuration: 420,

  motionTrigger: 'hover',
  posterFade: 280,

  stripSpeed: 0.32,
  edgeFalloff: 0.86,
  tileWidth: 200,
  tileGap: 16,
  tileAspect: 0.8,
};

export type DialControl =
  | {
      kind: 'number';
      id: NumberDialKey;
      label: string;
      min: number;
      max: number;
      step: number;
      unit?: string;
      hint?: string;
    }
  | {
      kind: 'select';
      id: SelectDialKey;
      label: string;
      options: { value: string; label: string }[];
      hint?: string;
    };

type NumberDialKey = {
  [K in keyof DialParams]: DialParams[K] extends number ? K : never;
}[keyof DialParams];

type SelectDialKey = {
  [K in keyof DialParams]: DialParams[K] extends string ? K : never;
}[keyof DialParams];

export type DialGroup = {
  id: string;
  label: string;
  feature?: DialFeature;
  note?: string;
  controls: DialControl[];
};

export const DIAL_GROUPS: DialGroup[] = [
  {
    id: 'idle',
    label: 'Idle tiles',
    feature: 'dim',
    note: 'How far the unselected tiles step back. Keep opacity high enough that they still invite a click.',
    controls: [
      { kind: 'number', id: 'idleOpacity', label: 'Opacity', min: 0.2, max: 1, step: 0.01 },
      { kind: 'number', id: 'idleSaturation', label: 'Saturation', min: 0, max: 1.2, step: 0.01 },
      { kind: 'number', id: 'idleBrightness', label: 'Brightness', min: 0.6, max: 1.1, step: 0.01 },
      { kind: 'number', id: 'idleBlur', label: 'Blur', min: 0, max: 3, step: 0.1, unit: 'px' },
      { kind: 'number', id: 'idleScale', label: 'Scale', min: 0.9, max: 1, step: 0.005 },
    ],
  },
  {
    id: 'veil',
    label: 'Tonal veil',
    feature: 'veil',
    note: 'A wash in the strip colour instead of transparency — artwork keeps its colour.',
    controls: [
      { kind: 'number', id: 'veilStrength', label: 'Strength', min: 0, max: 70, step: 1, unit: '%' },
      {
        kind: 'select',
        id: 'veilTint',
        label: 'Tint',
        options: [
          { value: 'strip', label: 'Strip' },
          { value: 'canvas', label: 'Canvas' },
          { value: 'ink', label: 'Ink' },
          { value: 'accent', label: 'Accent' },
        ],
      },
    ],
  },
  {
    id: 'hover',
    label: 'Hover response',
    note: 'The payoff for exploring. Without one, a calm strip reads as a dead strip.',
    controls: [
      { kind: 'number', id: 'hoverOpacity', label: 'Opacity', min: 0.3, max: 1, step: 0.01 },
      { kind: 'number', id: 'hoverLift', label: 'Lift', min: 1, max: 1.08, step: 0.005 },
      { kind: 'number', id: 'stateDuration', label: 'Duration', min: 60, max: 600, step: 10, unit: 'ms' },
    ],
  },
  {
    id: 'selected',
    label: 'Selected tile',
    note: 'Depth instead of a stroke: scale, an accent-tinted glow, and a radius-matched inner hairline.',
    controls: [
      { kind: 'number', id: 'selectedLift', label: 'Lift', min: 1, max: 1.2, step: 0.005 },
      { kind: 'number', id: 'liftDuration', label: 'Lift time', min: 120, max: 800, step: 10, unit: 'ms' },
      { kind: 'number', id: 'tileRadius', label: 'Radius', min: 0, max: 22, step: 1, unit: 'px' },
    ],
  },
  {
    id: 'glow',
    label: 'Accent glow',
    feature: 'glow',
    controls: [
      { kind: 'number', id: 'glowStrength', label: 'Strength', min: 0, max: 100, step: 1, unit: '%' },
      { kind: 'number', id: 'glowBlur', label: 'Blur', min: 0, max: 48, step: 1, unit: 'px' },
      { kind: 'number', id: 'glowY', label: 'Drop', min: 0, max: 24, step: 1, unit: 'px' },
    ],
  },
  {
    id: 'hairline',
    label: 'Inner hairline',
    feature: 'hairline',
    note: 'Inset so it always follows the thumbnail radius — never a hard outer ring.',
    controls: [
      { kind: 'number', id: 'hairlineIdle', label: 'Idle alpha', min: 0, max: 40, step: 1, unit: '%' },
      { kind: 'number', id: 'hairlineStrength', label: 'Selected alpha', min: 0, max: 60, step: 1, unit: '%' },
      { kind: 'number', id: 'hairlineWidth', label: 'Width', min: 0.5, max: 3, step: 0.5, unit: 'px' },
    ],
  },
  {
    id: 'mark',
    label: 'Underline mark',
    feature: 'mark',
    controls: [
      { kind: 'number', id: 'markWidth', label: 'Width', min: 10, max: 100, step: 1, unit: '%' },
      { kind: 'number', id: 'markHeight', label: 'Thickness', min: 1, max: 8, step: 0.5, unit: 'px' },
      { kind: 'number', id: 'markGap', label: 'Gap', min: 0, max: 18, step: 1, unit: 'px' },
      { kind: 'number', id: 'markTint', label: 'Accent mix', min: 0, max: 100, step: 1, unit: '%' },
      { kind: 'number', id: 'markDuration', label: 'Duration', min: 120, max: 700, step: 10, unit: 'ms' },
      { kind: 'number', id: 'markSpring', label: 'Overshoot', min: 1, max: 1.8, step: 0.05 },
    ],
  },
  {
    id: 'label',
    label: 'Title reveal',
    feature: 'label',
    note: 'A name gives people a reason to click that pure imagery does not.',
    controls: [
      {
        kind: 'select',
        id: 'labelMode',
        label: 'Show for',
        options: [
          { value: 'selected', label: 'Selected' },
          { value: 'hover', label: 'Selected + hover' },
          { value: 'always', label: 'Always' },
        ],
      },
      { kind: 'number', id: 'labelSize', label: 'Size', min: 7, max: 15, step: 0.5, unit: 'px' },
      { kind: 'number', id: 'labelTracking', label: 'Tracking', min: 0, max: 0.24, step: 0.01, unit: 'em' },
      { kind: 'number', id: 'labelOpacity', label: 'Opacity', min: 0.3, max: 1, step: 0.01 },
      { kind: 'number', id: 'labelGap', label: 'Gap', min: 0, max: 16, step: 1, unit: 'px' },
      {
        kind: 'select',
        id: 'labelCase',
        label: 'Case',
        options: [
          { value: 'uppercase', label: 'Uppercase' },
          { value: 'none', label: 'As written' },
        ],
      },
    ],
  },
  {
    id: 'plate',
    label: 'Backplate',
    feature: 'plate',
    note: 'Seats the tile on a mat rather than outlining it.',
    controls: [
      { kind: 'number', id: 'platePad', label: 'Inset', min: 2, max: 18, step: 1, unit: 'px' },
      { kind: 'number', id: 'plateStrength', label: 'Strength', min: 0, max: 45, step: 1, unit: '%' },
      { kind: 'number', id: 'plateRadius', label: 'Radius', min: 4, max: 26, step: 1, unit: 'px' },
      { kind: 'number', id: 'plateBlur', label: 'Softness', min: 0, max: 14, step: 1, unit: 'px' },
      {
        kind: 'select',
        id: 'plateTint',
        label: 'Tint',
        options: [
          { value: 'accent', label: 'Accent' },
          { value: 'ink', label: 'Ink' },
          { value: 'surface', label: 'Surface' },
        ],
      },
    ],
  },
  {
    id: 'width',
    label: 'Physical width',
    feature: 'width',
    note: 'Real layout shift. The strip re-centres for ~400ms after selection so the growth cannot drift off-axis.',
    controls: [
      { kind: 'number', id: 'widthBoost', label: 'Boost', min: 1, max: 1.45, step: 0.01 },
      { kind: 'number', id: 'widthDuration', label: 'Duration', min: 120, max: 800, step: 10, unit: 'ms' },
    ],
  },
  {
    id: 'motion',
    label: 'Motion',
    feature: 'motion',
    note: 'Loop thumbs only. Gating playback is both the clearest cue and the cheapest for the GPU.',
    controls: [
      {
        kind: 'select',
        id: 'motionTrigger',
        label: 'Plays when',
        options: [
          { value: 'selected', label: 'Selected only' },
          { value: 'hover', label: 'Selected + hover' },
          { value: 'always', label: 'Always' },
        ],
      },
      { kind: 'number', id: 'posterFade', label: 'Poster fade', min: 60, max: 700, step: 10, unit: 'ms' },
    ],
  },
  {
    id: 'strip',
    label: 'Strip & tiles',
    note: 'Context knobs — the indicator reads differently at another size or speed.',
    controls: [
      { kind: 'number', id: 'tileWidth', label: 'Tile width', min: 90, max: 260, step: 2, unit: 'px' },
      { kind: 'number', id: 'tileAspect', label: 'Aspect', min: 0.5, max: 1.15, step: 0.01 },
      { kind: 'number', id: 'tileGap', label: 'Gap', min: 4, max: 40, step: 1, unit: 'px' },
      { kind: 'number', id: 'stripSpeed', label: 'Marquee', min: 0, max: 1.4, step: 0.02, unit: 'px/f' },
      { kind: 'number', id: 'edgeFalloff', label: 'Edge scale', min: 0.6, max: 1, step: 0.01 },
    ],
  },
];

export type DialPreset = {
  id: string;
  label: string;
  blurb: string;
  feats: DialFeature[];
  params: Partial<DialParams>;
};

export const DIAL_PRESETS: DialPreset[] = [
  {
    id: 'shipped',
    label: 'Shipped',
    blurb: 'What is on the route today — hard dim plus underline.',
    feats: ['dim', 'glow', 'hairline', 'mark'],
    params: {
      idleOpacity: 0.34,
      idleSaturation: 0.75,
      idleBrightness: 0.88,
      idleScale: 1,
      hoverOpacity: 0.7,
      selectedLift: 1.045,
      markWidth: 62,
      markHeight: 2,
    },
  },
  {
    id: 'motion-label',
    label: 'Motion + label',
    blurb: 'The two you picked: only the live tile moves, and it names itself.',
    feats: ['veil', 'motion', 'label', 'glow', 'mark'],
    params: {
      idleOpacity: 0.94,
      idleSaturation: 1,
      idleBrightness: 1,
      idleScale: 0.985,
      veilStrength: 26,
      hoverOpacity: 1,
      hoverLift: 1.025,
      selectedLift: 1.06,
      glowStrength: 48,
      markWidth: 46,
      markHeight: 2,
      labelMode: 'hover',
      motionTrigger: 'hover',
    },
  },
  {
    id: 'editorial',
    label: 'Editorial',
    blurb: 'Full-colour shelf, quiet veil, name and a wide hairline underline.',
    feats: ['veil', 'label', 'hairline', 'mark'],
    params: {
      idleOpacity: 1,
      idleSaturation: 1,
      idleBrightness: 1,
      idleScale: 1,
      veilStrength: 18,
      veilTint: 'canvas',
      selectedLift: 1.03,
      markWidth: 100,
      markHeight: 1.5,
      markGap: 8,
      markTint: 100,
      labelMode: 'always',
      labelOpacity: 0.95,
    },
  },
  {
    id: 'spotlight',
    label: 'Spotlight',
    blurb: 'Backplate and a wide glow — the tile looks mounted, not outlined.',
    feats: ['dim', 'plate', 'glow'],
    params: {
      idleOpacity: 0.8,
      idleSaturation: 0.9,
      idleBrightness: 0.94,
      idleScale: 0.97,
      selectedLift: 1.05,
      glowStrength: 70,
      glowBlur: 34,
      glowY: 10,
      platePad: 8,
      plateStrength: 22,
      plateRadius: 14,
      plateBlur: 2,
    },
  },
  {
    id: 'antitype',
    label: 'Antitype',
    blurb: 'Ticker feel: real width growth, no chrome, name underneath.',
    feats: ['dim', 'width', 'label', 'hairline'],
    params: {
      idleOpacity: 0.9,
      idleSaturation: 0.95,
      idleBrightness: 0.98,
      idleScale: 1,
      selectedLift: 1,
      widthBoost: 1.2,
      widthDuration: 460,
      tileRadius: 4,
      labelMode: 'always',
      labelSize: 8,
      stripSpeed: 0.24,
      edgeFalloff: 0.92,
    },
  },
  {
    id: 'whisper',
    label: 'Whisper',
    blurb: 'Almost nothing: a hairline, a hair of lift, and a thread of accent.',
    feats: ['hairline', 'mark'],
    params: {
      idleOpacity: 1,
      idleSaturation: 1,
      idleBrightness: 1,
      idleScale: 1,
      hoverLift: 1.015,
      selectedLift: 1.02,
      hairlineIdle: 6,
      hairlineStrength: 34,
      markWidth: 28,
      markHeight: 1.5,
      markTint: 100,
    },
  },
];

const VEIL_TINTS: Record<DialParams['veilTint'], string> = {
  strip: 'var(--showcase-strip)',
  canvas: 'var(--showcase-canvas)',
  ink: 'var(--showcase-ink)',
  accent: 'var(--showcase-accent)',
};

const PLATE_TINTS: Record<DialParams['plateTint'], string> = {
  accent: 'var(--showcase-accent)',
  ink: 'var(--showcase-ink)',
  surface: 'var(--showcase-surface)',
};

/** Dials → CSS custom properties on `.showcase-shell`. */
export function dialsToCssVars(d: DialParams): CSSProperties {
  return {
    '--tile-idle-opacity': d.idleOpacity,
    '--tile-idle-sat': d.idleSaturation,
    '--tile-idle-bright': d.idleBrightness,
    '--tile-idle-blur': `${d.idleBlur}px`,
    '--tile-idle-scale': d.idleScale,
    '--tile-veil': `color-mix(in srgb, ${VEIL_TINTS[d.veilTint]} ${d.veilStrength}%, transparent)`,

    '--tile-hover-opacity': d.hoverOpacity,
    '--tile-hover-lift': d.hoverLift,
    '--tile-state-dur': `${d.stateDuration}ms`,

    '--tile-selected-lift': d.selectedLift,
    '--tile-lift-dur': `${d.liftDuration}ms`,
    '--tile-radius': `${d.tileRadius}px`,

    '--tile-glow': `${d.glowStrength}%`,
    '--tile-glow-blur': `${d.glowBlur}px`,
    '--tile-glow-y': `${d.glowY}px`,

    '--tile-hairline-idle': `${d.hairlineIdle}%`,
    '--tile-hairline-on': `${d.hairlineStrength}%`,
    '--tile-hairline-w': `${d.hairlineWidth}px`,

    '--mark-w': `${d.markWidth}%`,
    '--mark-h': `${d.markHeight}px`,
    '--mark-gap': `${d.markGap}px`,
    '--mark-tint': `${d.markTint}%`,
    '--mark-dur': `${d.markDuration}ms`,
    '--mark-spring': d.markSpring,

    '--label-size': `${d.labelSize}px`,
    '--label-tracking': `${d.labelTracking}em`,
    '--label-opacity': d.labelOpacity,
    '--label-gap': `${d.labelGap}px`,
    '--label-case': d.labelCase,

    '--plate-pad': `${d.platePad}px`,
    '--plate-tint': `color-mix(in srgb, ${PLATE_TINTS[d.plateTint]} ${d.plateStrength}%, transparent)`,
    '--plate-radius': `${d.plateRadius}px`,
    '--plate-blur': `${d.plateBlur}px`,

    '--width-boost': d.widthBoost,
    '--width-dur': `${d.widthDuration}ms`,

    '--poster-fade': `${d.posterFade}ms`,

    '--tile-w': `${d.tileWidth}px`,
    '--tile-gap': `${d.tileGap}px`,
    '--tile-aspect': d.tileAspect,
  } as CSSProperties;
}

const CSS_VAR_ORDER: { group: string; keys: string[] }[] = [
  {
    group: 'idle tiles',
    keys: [
      '--tile-idle-opacity',
      '--tile-idle-sat',
      '--tile-idle-bright',
      '--tile-idle-blur',
      '--tile-idle-scale',
      '--tile-veil',
    ],
  },
  {
    group: 'hover',
    keys: ['--tile-hover-opacity', '--tile-hover-lift', '--tile-state-dur'],
  },
  {
    group: 'selected',
    keys: [
      '--tile-selected-lift',
      '--tile-lift-dur',
      '--tile-radius',
      '--tile-glow',
      '--tile-glow-blur',
      '--tile-glow-y',
      '--tile-hairline-idle',
      '--tile-hairline-on',
      '--tile-hairline-w',
    ],
  },
  {
    group: 'mark',
    keys: ['--mark-w', '--mark-h', '--mark-gap', '--mark-tint', '--mark-dur', '--mark-spring'],
  },
  {
    group: 'label',
    keys: ['--label-size', '--label-tracking', '--label-opacity', '--label-gap', '--label-case'],
  },
  {
    group: 'backplate',
    keys: ['--plate-pad', '--plate-tint', '--plate-radius', '--plate-blur'],
  },
  {
    group: 'width + motion',
    keys: ['--width-boost', '--width-dur', '--poster-fade'],
  },
  {
    group: 'strip — drop --tile-w/--tile-gap to keep the responsive breakpoints',
    keys: ['--tile-w', '--tile-gap', '--tile-aspect'],
  },
];

/** A pasteable CSS block for `showcase.css`, plus the JS constants. */
export function dialsToCss(d: DialParams, feats: DialFeature[]): string {
  const vars = dialsToCssVars(d) as Record<string, string | number>;
  const lines: string[] = [
    '/* Showcase selected-thumbnail indicator */',
    `/* features: ${feats.join(' ') || 'none'} */`,
    `/* strip JS: STRIP_SPEED = ${d.stripSpeed}; MIN_TILE_SCALE = ${d.edgeFalloff}; */`,
    '',
    '.showcase-shell {',
  ];

  for (const { group, keys } of CSS_VAR_ORDER) {
    lines.push(`  /* ${group} */`);
    for (const key of keys) {
      const value = vars[key];
      if (value === undefined) continue;
      lines.push(`  ${key}: ${value};`);
    }
    lines.push('');
  }

  if (lines[lines.length - 1] === '') lines.pop();
  lines.push('}', '', `/* tile markup: data-feats="${feats.join(' ')}" */`);
  return lines.join('\n');
}

export const DIALS_STORAGE_KEY = 'showcase-indicator-dials-v2';

export type DialSnapshot = {
  id: string;
  label: string;
  feats: DialFeature[];
  params: DialParams;
};

export function mergeParams(
  base: DialParams,
  patch: Partial<DialParams>,
): DialParams {
  return { ...base, ...patch };
}
