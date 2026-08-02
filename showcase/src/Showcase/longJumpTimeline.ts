import type { TimelineConfig } from "dialkit";

/**
 * DialKit Long Jump — tuned defaults from the authored tab-filter component.
 * Phase progress only (0 → 1); geometry comes from clicked tabs at runtime.
 */
export const LONG_JUMP_TIMELINE_CONFIG = {
  duration: 0.91 / 2 / 1.5,

  phaseWaypoint: {
    at: 0,
    from: { progress: 0 },
    to: { progress: 1 },
    duration: 0.41 / 2 / 1.5,
    transition: {
      type: "easing" as const,
      ease: [0.42, 0, 1, 1] as [number, number, number, number],
      duration: 0.41 / 2 / 1.5,
    },
  },

  phaseTarget: {
    at: 0.38 / 2 / 1.5,
    from: { progress: 0 },
    to: { progress: 1 },
    duration: 0.21 / 2 / 1.5,
    transition: {
      type: "easing" as const,
      ease: [0, 0, 0.58, 1] as [number, number, number, number],
      duration: 0.21 / 2 / 1.5,
    },
  },

  phaseSqueeze: {
    at: 0,
    from: { progress: 0 },
    to: { progress: 1 },
    duration: 0.42 / 2 / 1.5,
    transition: {
      type: "easing" as const,
      ease: [0, 0, 0.58, 1] as [number, number, number, number],
      duration: 0.42 / 2 / 1.5,
    },
  },

  phaseTravel: {
    at: 0.38 / 2 / 1.5,
    from: { progress: 0 },
    to: { progress: 1 },
    duration: 0.21 / 2 / 1.5,
    transition: {
      type: "easing" as const,
      ease: [0, 0, 1, 1] as [number, number, number, number],
      duration: 0.21 / 2 / 1.5,
    },
  },

  phaseExpand: {
    at: 0.58 / 2 / 1.5,
    from: { progress: 0 },
    to: { progress: 1 },
    duration: 0.33 / 2 / 1.5,
    transition: {
      type: "easing" as const,
      ease: [0, 0, 0.58, 1] as [number, number, number, number],
      duration: 0.33 / 2 / 1.5,
    },
  },

  phaseY: {
    at: 0,
    from: { progress: 0 },
    to: { progress: 1 },
    duration: 0.42 / 2 / 1.5,
    transition: {
      type: "easing" as const,
      ease: [0.42, 0, 1, 1] as [number, number, number, number],
      duration: 0.42 / 2 / 1.5,
    },
  },

  fromLabel: {
    at: 0,
    from: { mix: 1 },
    to: { mix: 0 },
    duration: 0.42 / 2 / 1.5,
    transition: {
      type: "easing" as const,
      ease: [0, 0, 1, 1] as [number, number, number, number],
      duration: 0.42 / 2 / 1.5,
    },
  },

  toLabel: {
    at: 0.42 / 2 / 1.5,
    from: { mix: 0 },
    to: { mix: 1 },
    duration: 0.48 / 2 / 1.5,
    transition: {
      type: "easing" as const,
      ease: [0.5, 0, 0.5, 1] as [number, number, number, number],
      duration: 0.48 / 2 / 1.5,
    },
  },
} satisfies TimelineConfig;

export type LongJumpEndpoints = {
  fromX: number;
  fromW: number;
  waypointX: number;
  waypointW: number;
  toX: number;
  toW: number;
  /** true = left→right (anchor left, grow right); false = right→left (anchor right, grow left) */
  forward: boolean;
};

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

export function mixColor(mix: number, color = "#000000") {
  const hex = color.replace("#", "");
  const value =
    hex.length === 3
      ? hex
          .split("")
          .map((part) => part + part)
          .join("")
      : hex;
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
  settleY = -0.037,
) {
  let width: number;
  if (phases.expand > 0) {
    width = lerp(travelW, ep.toW, phases.expand);
  } else if (phases.travel > 0) {
    width = lerp(squeezeW, travelW, phases.travel);
  } else {
    width = lerp(ep.fromW, squeezeW, phases.squeeze);
  }

  const y = lerp(0, settleY, phases.y);

  if (ep.forward) {
    const x =
      phases.target > 0
        ? lerp(ep.waypointX, ep.toX, phases.target)
        : lerp(ep.fromX, ep.waypointX, phases.waypoint);
    return { x, width, y };
  }

  const fromRight = ep.fromX + ep.fromW;
  const waypointRight = ep.waypointX + ep.waypointW;
  const toRight = ep.toX + ep.toW;

  const right =
    phases.target > 0
      ? lerp(waypointRight, toRight, phases.target)
      : lerp(fromRight, waypointRight, phases.waypoint);

  return { x: right - width, width, y };
}
