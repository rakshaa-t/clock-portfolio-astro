import type { TimelineConfig } from "dialkit";

/**
 * DialKit Long Jump — tuned authoring defaults.
 * Phase progress only (0 → 1); geometry comes from clicked tabs at runtime.
 */
export const LONG_JUMP_TIMELINE_CONFIG = {
  duration: 0.46,

  phaseWaypoint: {
    at: 0,
    from: { progress: 0 },
    to: { progress: 1 },
    duration: 0.08,
    transition: {
      type: "easing" as const,
      ease: [0.42, 1.09, 1, 1] as [number, number, number, number],
      duration: 0.08,
    },
  },

  phaseTarget: {
    at: 0.08,
    from: { progress: 0 },
    to: { progress: 1 },
    duration: 0.11,
    transition: {
      type: "easing" as const,
      ease: [0, 0, 0.58, 1] as [number, number, number, number],
      duration: 0.11,
    },
  },

  phaseSqueeze: {
    at: 0,
    from: { progress: 0 },
    to: { progress: 1 },
    duration: 0.07,
    transition: {
      type: "easing" as const,
      ease: [1, 0, 0.58, 1] as [number, number, number, number],
      duration: 0.07,
    },
  },

  phaseTravel: {
    at: 0.19,
    from: { progress: 0 },
    to: { progress: 1 },
    duration: 0.11,
    transition: {
      type: "easing" as const,
      ease: [0, 0, 1, 1] as [number, number, number, number],
      duration: 0.11,
    },
  },

  phaseExpand: {
    at: 0.29,
    from: { progress: 0 },
    to: { progress: 1 },
    duration: 0.17,
    transition: {
      type: "easing" as const,
      ease: [0, 0, 0.58, 1] as [number, number, number, number],
      duration: 0.17,
    },
  },

  phaseY: {
    at: 0,
    from: { progress: 0 },
    to: { progress: 1 },
    duration: 0.21,
    transition: {
      type: "easing" as const,
      ease: [0.42, 0, 1, 1] as [number, number, number, number],
      duration: 0.21,
    },
  },

  fromLabel: {
    at: 0,
    from: { mix: 1 },
    to: { mix: 0 },
    duration: 0.21,
    transition: {
      type: "easing" as const,
      ease: [0, 0, 1, 1] as [number, number, number, number],
      duration: 0.21,
    },
  },

  toLabel: {
    at: 0.21,
    from: { mix: 0 },
    to: { mix: 1 },
    duration: 0.24,
    transition: {
      type: "easing" as const,
      ease: [0.5, 0, 0.5, 1] as [number, number, number, number],
      duration: 0.24,
    },
  },
} satisfies TimelineConfig;

export type LongJumpEndpoints = {
  fromX: number;
  fromW: number;
  fromY: number;
  waypointX: number;
  waypointW: number;
  toX: number;
  toW: number;
  toY: number;
  /** true = left→right (anchor left, grow right); false = right→left (anchor right, grow left) */
  forward: boolean;
};

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

export function mixColor(mix: number, color = '#000000') {
  const hex = color.replace('#', '');
  const value = hex.length === 3 ? hex.split('').map((part) => part + part).join('') : hex;
  const parsed = Number.parseInt(value, 16);
  return `rgba(${(parsed >> 16) & 255}, ${(parsed >> 8) & 255}, ${parsed & 255}, ${0.44 + mix * 0.56})`;
}

export function progressOf(
  clip: { current?: { progress?: number }; started?: boolean } | undefined,
): number {
  if (!clip?.started) return 0;
  return Number(clip.current?.progress ?? 0);
}

/**
 * Resolve underline pose from DialKit phase progress + click geometry.
 *
 * L→R: left edge travels; on land, short bar sits on target's LEFT then grows right.
 * R→L: right edge travels; on land, short bar sits on target's RIGHT then grows left.
 */
export function resolveLongJumpPose(
  phases: {
    waypoint: number;
    target: number;
    squeeze: number;
    travel: number;
    expand: number;
    y: number;
  },
  ep: LongJumpEndpoints,
  squeezeW: number,
  travelW: number,
) {
  let width: number;
  if (phases.expand > 0) {
    width = lerp(travelW, ep.toW, phases.expand);
  } else if (phases.travel > 0) {
    width = lerp(squeezeW, travelW, phases.travel);
  } else {
    width = lerp(ep.fromW, squeezeW, phases.squeeze);
  }

  const y = lerp(ep.fromY, ep.toY, phases.y);

  if (ep.forward) {
    const x =
      phases.target > 0
        ? lerp(ep.waypointX, ep.toX, phases.target)
        : lerp(ep.fromX, ep.waypointX, phases.waypoint);
    return { x, width, y };
  }

  // Reverse: drive the RIGHT edge, derive left = right - width
  const fromRight = ep.fromX + ep.fromW;
  const waypointRight = ep.waypointX + ep.waypointW;
  const toRight = ep.toX + ep.toW;

  const right =
    phases.target > 0
      ? lerp(waypointRight, toRight, phases.target)
      : lerp(fromRight, waypointRight, phases.waypoint);

  return { x: right - width, width, y };
}
