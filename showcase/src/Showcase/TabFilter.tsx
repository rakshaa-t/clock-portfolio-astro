import { useEffect, useRef, useState } from "react";
import { useDialKit, useDialTimeline } from "dialkit";
import {
  animate,
  motion,
  useMotionValue,
  type AnimationPlaybackControls,
} from "motion/react";
import {
  LONG_JUMP_TIMELINE_CONFIG,
  mixColor,
  progressOf,
  resolveLongJumpPose,
  type LongJumpEndpoints,
} from "./longJumpTimeline";

const TABS = [
  { id: "853:454", label: "All", x: 0, underlineX: 0, underlineWidth: 21.714 },
  { id: "853:455", label: "Clients", x: 42.25, underlineX: 41.834, underlineWidth: 50 },
  { id: "853:459", label: "Experiments", x: 115.5, underlineX: 115.5, underlineWidth: 87 },
  { id: "853:461", label: "Live", x: 226.75, underlineX: 226.75, underlineWidth: 29 },
  { id: "853:463", label: "Mobile", x: 280, underlineX: 280, underlineWidth: 47 },
] as const;

const ACTIVE_COLOR = "#000000";
const INACTIVE_COLOR = "rgba(0, 0, 0, 0.44)";
const UNDERLINE_Y_ACTIVE = -0.037;

const SQUEEZE_REV = 3.625;
const SQUEEZE_FWD = 3.661;

type Ease = string | [number, number, number, number];

type AdjacentProfile = {
  duration: number;
  fromColorAt: number;
  toColorStart: number;
  toColorAt: number;
  x: { values: number[]; times: number[]; ease: Ease[] };
  width: { values: number[]; times: number[]; ease: Ease[] };
  y: { values: number[]; times: number[]; ease: Ease[] };
};

type Pose = { x: number; width: number; y: number };

/**
 * L→R adjacent (Figma Live→Mobile timing).
 * Left edge rides to the target's LEFT, bar squeezes, then grows right.
 */
function buildAdjacentForward(
  fromLeft: number,
  fromW: number,
  toLeft: number,
  toW: number,
): AdjacentProfile {
  return {
    duration: 1.325 / 2 / 1.5,
    fromColorAt: (0.7736 - 0.6389) / 0.3611,
    toColorStart: (0.8509 - 0.6389) / 0.3611,
    toColorAt: (0.851 - 0.6389) / 0.3611,
    x: {
      values: [fromLeft, toLeft, toLeft],
      times: [0, (0.7722 - 0.6389) / 0.3611, 1],
      ease: ["easeOut", "linear"],
    },
    width: {
      values: [fromW, SQUEEZE_FWD, toW, toW],
      times: [0, (0.7722 - 0.6389) / 0.3611, (0.8719 - 0.6389) / 0.3611, 1],
      ease: ["easeOut", "easeOut", "linear"],
    },
    y: {
      values: [UNDERLINE_Y_ACTIVE, UNDERLINE_Y_ACTIVE],
      times: [0, 1],
      ease: ["linear"],
    },
  };
}

/**
 * R→L adjacent (Figma Mobile→Live timing, right-edge anchored).
 * Right edge rides to the target's RIGHT, bar squeezes there, then grows left.
 * left = right - width at every keyframe so shortening/growing happens on the left.
 */
function buildAdjacentReverse(
  fromLeft: number,
  fromW: number,
  toLeft: number,
  toW: number,
): AdjacentProfile {
  const fromRight = fromLeft + fromW;
  const toRight = toLeft + toW;
  const squeezeLeft = toRight - SQUEEZE_REV;

  return {
    duration: 0.928 / 2 / 1.5,
    fromColorAt: (0.4575 - 0.3861) / 0.2528,
    toColorStart: (0.5208 - 0.3861) / 0.2528,
    toColorAt: (0.5209 - 0.3861) / 0.2528,
    x: {
      // left edges: start → (toRight - squeeze) → toLeft
      // right edge path: fromRight → toRight → toRight
      values: [fromLeft, squeezeLeft, toLeft, toLeft],
      times: [0, (0.4637 - 0.3861) / 0.2528, (0.5618 - 0.3861) / 0.2528, 1],
      ease: ["easeIn", "easeOut", "linear"],
    },
    width: {
      values: [fromW, SQUEEZE_REV, toW, toW],
      times: [0, (0.4637 - 0.3861) / 0.2528, (0.5618 - 0.3861) / 0.2528, 1],
      ease: ["easeIn", "easeOut", "linear"],
    },
    y: {
      values: [UNDERLINE_Y_ACTIVE, UNDERLINE_Y_ACTIVE],
      times: [0, 1],
      ease: ["linear"],
    },
  };
}

function waypointIndex(from: number, to: number) {
  return from + Math.sign(to - from);
}

function buildAdjacentProfile(
  fromIndex: number,
  toIndex: number,
  start: Pose,
): AdjacentProfile {
  const to = TABS[toIndex];
  const forward = toIndex > fromIndex;
  return forward
    ? buildAdjacentForward(start.x, start.width, to.underlineX, to.underlineWidth)
    : buildAdjacentReverse(start.x, start.width, to.underlineX, to.underlineWidth);
}

type TabFilterProps = {
  onChange?: (label: (typeof TABS)[number]["label"]) => void;
  ink?: string;
};

const withOpacity = (color: string, opacity: number) => {
  const hex = color.replace('#', '');
  const value = hex.length === 3 ? hex.split('').map((part) => part + part).join('') : hex;
  const parsed = Number.parseInt(value, 16);
  return `rgba(${(parsed >> 16) & 255}, ${(parsed >> 8) & 255}, ${parsed & 255}, ${opacity})`;
};

export default function TabFilter({ onChange, ink = ACTIVE_COLOR }: TabFilterProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [adjacentTransition, setAdjacentTransition] = useState<{
    from: number;
    to: number;
    profile: AdjacentProfile;
  } | null>(null);
  const [longJump, setLongJump] = useState<{
    from: number;
    to: number;
    endpoints: LongJumpEndpoints;
  } | null>(null);

  const activeIndexRef = useRef(0);
  const onChangeRef = useRef(onChange);
  const longJumpRef = useRef<typeof longJump>(null);
  const playbackRef = useRef<AnimationPlaybackControls[]>([]);
  const generationRef = useRef(0);

  const underlineWidth = useMotionValue<number>(TABS[0].underlineWidth);
  const underlineX = useMotionValue<number>(TABS[0].underlineX);
  const underlineY = useMotionValue<number>(0);

  onChangeRef.current = onChange;

  const geo = useDialKit("Long Jump Geo", {
    squeezeW: [6.69, 2, 20, 0.01],
    travelW: [12, 4, 40, 0.01],
  });

  // TODO(production): DialKit's clip.current values are the scrubbable authoring preview.
  // Replace them with equivalent real Motion animations using the tuned timeline
  // timings and transitions, then remove useDialTimeline and <DialTimeline />.
  const tl = useDialTimeline("Long Jump", LONG_JUMP_TIMELINE_CONFIG, {
    autoplay: false,
    id: "tab-filter-long-jump-v7",
    persist: { key: "tab-filter-long-jump-v7" },
  });

  longJumpRef.current = longJump;

  const readDialPose = (endpoints: LongJumpEndpoints): Pose =>
    resolveLongJumpPose(
      {
        waypoint: progressOf(tl.phaseWaypoint),
        target: progressOf(tl.phaseTarget),
        squeeze: progressOf(tl.phaseSqueeze),
        travel: progressOf(tl.phaseTravel),
        expand: progressOf(tl.phaseExpand),
        y: progressOf(tl.phaseY),
      },
      endpoints,
      geo.squeezeW,
      geo.travelW,
    );

  const commitPose = (pose: Pose) => {
    underlineX.set(pose.x);
    underlineWidth.set(pose.width);
    underlineY.set(pose.y);
  };

  const captureVisualPose = (): Pose => {
    const jump = longJumpRef.current;
    if (jump) return readDialPose(jump.endpoints);
    return {
      x: underlineX.get(),
      width: underlineWidth.get(),
      y: underlineY.get(),
    };
  };

  const stopPlayback = () => {
    for (const c of playbackRef.current) c.stop();
    playbackRef.current = [];
  };

  const abortDial = () => {
    if (longJumpRef.current) {
      commitPose(readDialPose(longJumpRef.current.endpoints));
    }
    longJumpRef.current = null;
    setLongJump(null);
    tl.pause();
    tl.seek(0);
  };

  const runAdjacentTransition = (
    toIndex: number,
    profile: AdjacentProfile,
    start: Pose,
  ) => {
    const gen = ++generationRef.current;

    stopPlayback();
    commitPose(start);

    playbackRef.current = [
      animate(underlineX, profile.x.values, {
        duration: profile.duration,
        times: profile.x.times,
        ease: profile.x.ease,
      } as never),
      animate(underlineWidth, profile.width.values, {
        duration: profile.duration,
        times: profile.width.times,
        ease: profile.width.ease,
      } as never),
      animate(underlineY, profile.y.values, {
        duration: profile.duration,
        times: profile.y.times,
        ease: profile.y.ease,
      } as never),
    ];

    Promise.all(playbackRef.current.map((c) => c.finished)).then(() => {
      if (generationRef.current !== gen) return;
      if (activeIndexRef.current !== toIndex) return;
      setAdjacentTransition(null);
    });
  };

  const runLongJump = (fromIndex: number, toIndex: number, start: Pose) => {
    const to = TABS[toIndex];
    const waypoint = TABS[waypointIndex(fromIndex, toIndex)];
    const gen = ++generationRef.current;

    stopPlayback();
    commitPose(start);

    const endpoints: LongJumpEndpoints = {
      fromX: start.x,
      fromW: start.width,
      waypointX: waypoint.underlineX,
      waypointW: waypoint.underlineWidth,
      toX: to.underlineX,
      toW: to.underlineWidth,
      forward: toIndex > fromIndex,
    };

    const jump = { from: fromIndex, to: toIndex, endpoints };
    longJumpRef.current = jump;
    setLongJump(jump);
    setAdjacentTransition(null);
    tl.replay();

    if (generationRef.current !== gen) return;
  };

  useEffect(() => {
    if (!longJump) return;
    commitPose(readDialPose(longJump.endpoints));
  }, [longJump, tl.time, tl.playing, geo.squeezeW, geo.travelW]);

  useEffect(() => {
    if (!longJump) return;
    if (tl.playing) return;
    if (tl.time < tl.duration - 0.02) return;

    commitPose({
      x: longJump.endpoints.toX,
      width: longJump.endpoints.toW,
      y: UNDERLINE_Y_ACTIVE,
    });
    longJumpRef.current = null;
    setLongJump(null);
    tl.seek(0);
  }, [longJump, tl.time, tl.playing, tl.duration]);

  const handleSelect = (index: number) => {
    if (index === activeIndexRef.current) return;

    const fromIndex = activeIndexRef.current;
    const hops = Math.abs(index - fromIndex);

    const start = captureVisualPose();
    abortDial();
    stopPlayback();

    activeIndexRef.current = index;
    setActiveIndex(index);
    onChangeRef.current?.(TABS[index].label);

    if (hops === 1) {
      const profile = buildAdjacentProfile(fromIndex, index, start);
      setAdjacentTransition({ from: fromIndex, to: index, profile });
      runAdjacentTransition(index, profile, start);
      return;
    }

    setAdjacentTransition(null);
    runLongJump(fromIndex, index, start);
  };

  const getColor = (index: number) => {
    if (longJump) {
      const { from, to } = longJump;
      if (index === from) {
        return mixColor(Number(tl.fromLabel?.current?.mix ?? 1), ink);
      }
      if (index === to) {
        return mixColor(Number(tl.toLabel?.current?.mix ?? 0), ink);
      }
      return withOpacity(ink, 0.44);
    }

    if (!adjacentTransition) {
      return index === activeIndex ? ink : withOpacity(ink, 0.44);
    }

    const { from, to } = adjacentTransition;
    if (index === from) return withOpacity(ink, 0.44);
    if (index === to) return ink;
    return withOpacity(ink, 0.44);
  };

  const getColorTransition = (index: number) => {
    if (longJump || !adjacentTransition) return { duration: 0 };

    const { from, to, profile } = adjacentTransition;
    if (index === from) {
      return { duration: profile.duration * profile.fromColorAt, ease: "linear" as const };
    }
    if (index === to) {
      return {
        duration: profile.duration,
        times: [0, profile.toColorStart - 0.0001, profile.toColorStart, profile.toColorAt],
        ease: ["linear", "linear", "linear"],
      };
    }
    return { duration: 0 };
  };

  return (
    <div className="tab-filter" data-node-id="853:501">
      <div className="tab-filter__group" data-node-id="853:490">
        <div className="tab-filter__labels" role="tablist" data-node-id="853:457">
          {TABS.map((tab, index) => (
            <motion.button
              key={`${tab.label}-${ink}`}
              type="button"
              role="tab"
              aria-selected={
                (!longJump && !adjacentTransition && index === activeIndex) ||
                longJump?.to === index ||
                adjacentTransition?.to === index
              }
              className="tab-filter__label"
              style={{ left: tab.x }}
              data-node-id={tab.id}
              onClick={() => handleSelect(index)}
              animate={{ color: getColor(index) }}
              whileTap={{ scale: 0.95 }}
              transition={{
                color: getColorTransition(index) as never,
                scale: { duration: 0.1, ease: "easeOut" },
              }}
            >
              <span className="tab-filter__label-text">{tab.label}</span>
            </motion.button>
          ))}
        </div>

        <motion.div
          className="tab-filter__underline"
          data-node-id="853:465"
          style={{ scaleX: underlineWidth, x: underlineX, y: underlineY, backgroundColor: ink }}
        />
      </div>
    </div>
  );
}
