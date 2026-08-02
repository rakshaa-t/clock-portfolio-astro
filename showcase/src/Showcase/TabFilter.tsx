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
const MOTION_SPEED_MULTIPLIER = 1.3;
const ADJACENT_DURATION = 0.2375;
const ADJACENT_SQUEEZE_W = 3.64;
const ADJACENT_TRAVEL_AT = 0.42;
const ADJACENT_EXPAND_AT = 0.78;
const ADJACENT_FROM_COLOR_AT = 0.32;
const ADJACENT_TO_COLOR_START = 0.48;
const ADJACENT_TO_COLOR_AT = 0.62;
const ADJACENT_EASE: Ease[] = ["easeOut", "easeOut", "linear"];
const LONG_JUMP_UNDERLINE_OPACITY = 0.55;

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

function buildAdjacentProfile(
  fromIndex: number,
  toIndex: number,
  to: Pose,
  start: Pose,
): AdjacentProfile {
  const forward = toIndex > fromIndex;
  const fromLeft = start.x;
  const fromW = start.width;
  const toLeft = to.x;
  const toW = to.width;
  const toRight = toLeft + toW;
  const squeezeLeft = toRight - ADJACENT_SQUEEZE_W;
  const xValues = forward
    ? [fromLeft, toLeft, toLeft, toLeft]
    : [fromLeft, squeezeLeft, toLeft, toLeft];

  return {
    duration: ADJACENT_DURATION,
    fromColorAt: ADJACENT_FROM_COLOR_AT,
    toColorStart: ADJACENT_TO_COLOR_START,
    toColorAt: ADJACENT_TO_COLOR_AT,
    x: {
      values: xValues,
      times: [0, ADJACENT_TRAVEL_AT, ADJACENT_EXPAND_AT, 1],
      ease: ADJACENT_EASE,
    },
    width: {
      values: [fromW, ADJACENT_SQUEEZE_W, toW, toW],
      times: [0, ADJACENT_TRAVEL_AT, ADJACENT_EXPAND_AT, 1],
      ease: ADJACENT_EASE,
    },
    y: {
      values: [start.y, to.y],
      times: [0, 1],
      ease: ["linear"],
    },
  };
}

function waypointIndex(from: number, to: number) {
  return from + Math.sign(to - from);
}

type TabFilterProps = {
  onChange?: (label: (typeof TABS)[number]["label"]) => void;
  onTargetHit?: (label: (typeof TABS)[number]["label"]) => void;
  ink?: string;
};

const withOpacity = (color: string, opacity: number) => {
  const hex = color.replace('#', '');
  const value = hex.length === 3 ? hex.split('').map((part) => part + part).join('') : hex;
  const parsed = Number.parseInt(value, 16);
  return `rgba(${(parsed >> 16) & 255}, ${(parsed >> 8) & 255}, ${parsed & 255}, ${opacity})`;
};

export default function TabFilter({
  onChange,
  onTargetHit,
  ink = ACTIVE_COLOR,
}: TabFilterProps) {
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
  const onTargetHitRef = useRef(onTargetHit);
  const longJumpRef = useRef<typeof longJump>(null);
  const playbackRef = useRef<AnimationPlaybackControls[]>([]);
  const generationRef = useRef(0);
  const targetHitTimerRef = useRef<number | null>(null);
  const targetHitDoneRef = useRef(false);

  const underlineWidth = useMotionValue<number>(TABS[0].underlineWidth * 0.4);
  const underlineX = useMotionValue<number>(TABS[0].underlineX);
  const underlineY = useMotionValue<number>(-0.43);
  const underlineOpacity = useMotionValue<number>(1);

  onChangeRef.current = onChange;
  onTargetHitRef.current = onTargetHit;

  const indicatorSettle = useDialKit("Indicator Settle", {
    All: {
      height: 1.53,
      settleY: -0.43,
      widthScale: 0.4,
      xOffset: 0,
    },
    Clients: {
      height: 1.53,
      settleY: -0.04,
      widthScale: 0.4,
      xOffset: 0,
    },
    Experiments: {
      height: 1.53,
      settleY: -0.04,
      widthScale: 0.4,
      xOffset: 0,
    },
    Live: {
      height: 1.53,
      settleY: -0.04,
      widthScale: 0.4,
      xOffset: 0,
    },
    Mobile: {
      height: 1.53,
      settleY: -0.04,
      widthScale: 0.4,
      xOffset: 0,
    },
  });

  const geo = useDialKit("Long Jump Geo", {
    squeezeW: [18.98, 2, 20, 0.01],
    travelW: [31.26, 4, 40, 0.01],
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

  const settledPoseForTab = (index: number): Pose => {
    const tab = TABS[index];
    const settle = indicatorSettle[tab.label];
    return {
      x: tab.underlineX + settle.xOffset,
      width: tab.underlineWidth * settle.widthScale,
      y: settle.settleY,
    };
  };

  useEffect(() => {
    return () => {
      if (targetHitTimerRef.current !== null) {
        window.clearTimeout(targetHitTimerRef.current);
      }
      for (const c of playbackRef.current) c.stop();
    };
  }, []);

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
    if (targetHitTimerRef.current !== null) {
      window.clearTimeout(targetHitTimerRef.current);
      targetHitTimerRef.current = null;
    }
    for (const c of playbackRef.current) c.stop();
    playbackRef.current = [];
  };

  const notifyTargetHit = (toIndex: number, gen: number) => {
    if (targetHitDoneRef.current) return;
    if (generationRef.current !== gen) return;
    if (activeIndexRef.current !== toIndex) return;
    targetHitDoneRef.current = true;
    onTargetHitRef.current?.(TABS[toIndex].label);
  };

  const abortDial = () => {
    if (longJumpRef.current) {
      commitPose(readDialPose(longJumpRef.current.endpoints));
    }
    underlineOpacity.set(1);
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
    underlineOpacity.set(1);
    targetHitDoneRef.current = false;

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

    targetHitTimerRef.current = window.setTimeout(() => {
      targetHitTimerRef.current = null;
      notifyTargetHit(toIndex, gen);
    }, profile.duration * ADJACENT_TRAVEL_AT * 1000);

    Promise.all(playbackRef.current.map((c) => c.finished)).then(() => {
      if (generationRef.current !== gen) return;
      if (activeIndexRef.current !== toIndex) return;
      setAdjacentTransition(null);
    });
  };

  const runLongJump = (fromIndex: number, toIndex: number, start: Pose) => {
    const to = settledPoseForTab(toIndex);
    const waypoint = settledPoseForTab(waypointIndex(fromIndex, toIndex));
    const gen = ++generationRef.current;

    stopPlayback();
    commitPose(start);
    underlineOpacity.set(LONG_JUMP_UNDERLINE_OPACITY);
    targetHitDoneRef.current = false;

    const endpoints: LongJumpEndpoints = {
      fromX: start.x,
      fromW: start.width,
      fromY: start.y,
      waypointX: waypoint.x,
      waypointW: waypoint.width,
      toX: to.x,
      toW: to.width,
      toY: to.y,
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
    if (progressOf(tl.phaseTarget) >= 1) {
      notifyTargetHit(longJump.to, generationRef.current);
    }
  }, [longJump, tl.time, tl.playing, geo.squeezeW, geo.travelW]);

  useEffect(() => {
    if (!longJump) return;
    if (tl.playing) return;
    if (tl.time < tl.duration - 0.02) return;

    commitPose({
      x: longJump.endpoints.toX,
      width: longJump.endpoints.toW,
      y: longJump.endpoints.toY,
    });
    longJumpRef.current = null;
    setLongJump(null);
    tl.seek(0);
    animate(underlineOpacity, 1, {
      duration: 0.06,
      ease: "linear",
    });
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
      const profile = buildAdjacentProfile(
        fromIndex,
        index,
        settledPoseForTab(index),
        start,
      );
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
          style={{
            scaleX: underlineWidth,
            x: underlineX,
            y: underlineY,
            opacity: underlineOpacity,
            height: indicatorSettle[TABS[activeIndex].label].height,
            backgroundColor: ink,
          }}
        />
      </div>
    </div>
  );
}
