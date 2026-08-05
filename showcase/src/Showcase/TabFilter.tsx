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
const SQUEEZE_REV = 3.625;
const SQUEEZE_FWD = 3.661;

type Ease = string | [number, number, number, number];

type Pose = { x: number; width: number; y: number; height: number };

type SettleLook = {
  height: number;
  settleY: number;
  widthScale: number;
  xOffset: number;
};

type TabLabel = (typeof TABS)[number]["label"];
type TabSettles = Record<TabLabel, SettleLook>;

const INDICATOR_SETTLE_CONFIG = {
  All: {
    height: [1.53, 0.5, 8, 0.01] as [number, number, number, number],
    settleY: [-0.43, -12, 12, 0.01] as [number, number, number, number],
    widthScale: [0.4, 0.2, 1.6, 0.01] as [number, number, number, number],
    xOffset: [0, -24, 24, 0.01] as [number, number, number, number],
  },
  Clients: {
    height: [1.53, 0.5, 8, 0.01] as [number, number, number, number],
    settleY: [-0.04, -12, 12, 0.01] as [number, number, number, number],
    widthScale: [0.4, 0.2, 1.6, 0.01] as [number, number, number, number],
    xOffset: [0, -24, 24, 0.01] as [number, number, number, number],
  },
  Experiments: {
    height: [1.53, 0.5, 8, 0.01] as [number, number, number, number],
    settleY: [-0.04, -12, 12, 0.01] as [number, number, number, number],
    widthScale: [0.4, 0.2, 1.6, 0.01] as [number, number, number, number],
    xOffset: [0, -24, 24, 0.01] as [number, number, number, number],
  },
  Live: {
    height: [1.53, 0.5, 8, 0.01] as [number, number, number, number],
    settleY: [-0.04, -12, 12, 0.01] as [number, number, number, number],
    widthScale: [0.4, 0.2, 1.6, 0.01] as [number, number, number, number],
    xOffset: [0, -24, 24, 0.01] as [number, number, number, number],
  },
  Mobile: {
    height: [1.53, 0.5, 8, 0.01] as [number, number, number, number],
    settleY: [-0.04, -12, 12, 0.01] as [number, number, number, number],
    widthScale: [0.4, 0.2, 1.6, 0.01] as [number, number, number, number],
    xOffset: [0, -24, 24, 0.01] as [number, number, number, number],
  },
};

function settleLook(tabIndex: number, settles: TabSettles): SettleLook {
  return settles[TABS[tabIndex].label];
}

type TabLayout = { left: number; width: number };

function fallbackLayout(tabIndex: number): TabLayout {
  const tab = TABS[tabIndex];
  return { left: tab.underlineX, width: tab.underlineWidth };
}

function settlePose(
  tabIndex: number,
  settles: TabSettles,
  layouts: TabLayout[] = [],
): Pose {
  const look = settleLook(tabIndex, settles);
  const allLook = settleLook(0, settles);
  const layout = layouts[tabIndex] ?? fallbackLayout(tabIndex);
  const allLayout = layouts[0] ?? fallbackLayout(0);
  const width = allLayout.width * allLook.widthScale;
  const height = allLook.height;
  const x = layout.left + (layout.width - width) / 2 + look.xOffset;
  return { x, width, y: look.settleY, height };
}

type AdjacentProfile = {
  duration: number;
  x: { values: number[]; times: number[]; ease: Ease[] };
  width: { values: number[]; times: number[]; ease: Ease[] };
  y: { values: number[]; times: number[]; ease: Ease[] };
};

function buildAdjacentForward(
  fromLeft: number,
  fromW: number,
  toLeft: number,
  toW: number,
  fromY: number,
  toY: number,
): AdjacentProfile {
  return {
    duration: 1.325 / 2 / 1.5,
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
      values: [fromY, toY],
      times: [0, 1],
      ease: ["easeOut"],
    },
  };
}

function buildAdjacentReverse(
  fromLeft: number,
  fromW: number,
  toLeft: number,
  toW: number,
  fromY: number,
  toY: number,
): AdjacentProfile {
  const toRight = toLeft + toW;
  const squeezeLeft = toRight - SQUEEZE_REV;

  return {
    duration: 0.928 / 2 / 1.5,
    x: {
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
      values: [fromY, toY],
      times: [0, 1],
      ease: ["easeOut"],
    },
  };
}

function buildAdjacentProfile(
  fromIndex: number,
  toIndex: number,
  start: Pose,
  settles: TabSettles,
  layouts: TabLayout[],
): AdjacentProfile {
  const to = settlePose(toIndex, settles, layouts);
  const forward = toIndex > fromIndex;
  return forward
    ? buildAdjacentForward(start.x, start.width, to.x, to.width, start.y, to.y)
    : buildAdjacentReverse(start.x, start.width, to.x, to.width, start.y, to.y);
}

function waypointIndex(from: number, to: number) {
  return from + Math.sign(to - from);
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

export default function TabFilter({
  onChange,
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
  const longJumpRef = useRef<typeof longJump>(null);
  const playbackRef = useRef<AnimationPlaybackControls[]>([]);
  const generationRef = useRef(0);
  const groupRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [layouts, setLayouts] = useState<TabLayout[]>(() =>
    TABS.map((_, index) => fallbackLayout(index)),
  );
  const layoutsRef = useRef(layouts);
  layoutsRef.current = layouts;

  const settles = useDialKit("Indicator Settle", INDICATOR_SETTLE_CONFIG, {
    persist: { key: "tab-filter-indicator-settle-v4" },
  }) as TabSettles;
  const initialSettle = settlePose(0, settles, layouts);

  const underlineWidth = useMotionValue<number>(initialSettle.width);
  const underlineX = useMotionValue<number>(initialSettle.x);
  const underlineY = useMotionValue<number>(initialSettle.y);
  const underlineHeight = useMotionValue<number>(initialSettle.height);

  onChangeRef.current = onChange;

  const geo = useDialKit(
    "Long Jump Geo",
    {
      squeezeW: [4.11, 2, 20, 0.01],
      travelW: [34.25, 4, 40, 0.01],
    },
    { persist: { key: "tab-filter-long-jump-geo-v2" } },
  );

  // TODO(production): DialKit's clip.current values are the scrubbable authoring preview.
  // Replace them with equivalent real Motion animations using the tuned timeline
  // timings and transitions, then remove useDialTimeline and <DialTimeline />.
  const tl = useDialTimeline("Long Jump", LONG_JUMP_TIMELINE_CONFIG, {
    autoplay: false,
    id: "tab-filter-long-jump-v7",
    persist: { key: "tab-filter-long-jump-v7" },
  });

  longJumpRef.current = longJump;

  const measureLayouts = () => {
    const group = groupRef.current;
    if (!group) return;
    const groupBox = group.getBoundingClientRect();
    const next = TABS.map((_, index) => {
      const el = labelRefs.current[index];
      if (!el) return fallbackLayout(index);
      const box = el.getBoundingClientRect();
      return { left: box.left - groupBox.left, width: box.width };
    });
    setLayouts((previous) => {
      const same = previous.every(
        (layout, index) =>
          Math.abs(layout.left - next[index].left) < 0.25 &&
          Math.abs(layout.width - next[index].width) < 0.25,
      );
      return same ? previous : next;
    });
  };

  useEffect(() => {
    measureLayouts();
    const fontsReady =
      "fonts" in document
        ? document.fonts.ready.catch(() => undefined)
        : Promise.resolve();
    void fontsReady.then(() => measureLayouts());
    const raf = requestAnimationFrame(() => measureLayouts());
    window.addEventListener("resize", measureLayouts);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measureLayouts);
    };
  }, []);

  useEffect(() => {
    return () => {
      for (const c of playbackRef.current) c.stop();
    };
  }, []);

  const readDialPose = (
    endpoints: LongJumpEndpoints,
    settleY: number,
  ): Pose => {
    const pose = resolveLongJumpPose(
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
      settleY,
    );
    return { ...pose, height: underlineHeight.get() };
  };

  const commitPose = (pose: Pose) => {
    underlineX.set(pose.x);
    underlineWidth.set(pose.width);
    underlineY.set(pose.y);
    underlineHeight.set(pose.height);
  };

  useEffect(() => {
    if (longJump || adjacentTransition) return;
    commitPose(settlePose(activeIndexRef.current, settles, layouts));
  }, [settles, layouts, activeIndex, longJump, adjacentTransition]);

  const captureVisualPose = (): Pose => {
    const jump = longJumpRef.current;
    if (jump) {
      return readDialPose(jump.endpoints, settleLook(jump.to, settles).settleY);
    }
    return {
      x: underlineX.get(),
      width: underlineWidth.get(),
      y: underlineY.get(),
      height: underlineHeight.get(),
    };
  };

  const stopPlayback = () => {
    for (const c of playbackRef.current) c.stop();
    playbackRef.current = [];
  };

  const abortDial = () => {
    if (longJumpRef.current) {
      commitPose(
        readDialPose(
          longJumpRef.current.endpoints,
          settleLook(longJumpRef.current.to, settles).settleY,
        ),
      );
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
    const to = settlePose(toIndex, settles, layoutsRef.current);

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
      animate(underlineHeight, [start.height, to.height], {
        duration: profile.duration,
        ease: "easeOut",
      }),
    ];

    Promise.all(playbackRef.current.map((c) => c.finished)).then(() => {
      if (generationRef.current !== gen) return;
      if (activeIndexRef.current !== toIndex) return;
      setAdjacentTransition(null);
    });
  };

  const runLongJump = (fromIndex: number, toIndex: number, start: Pose) => {
    const currentLayouts = layoutsRef.current;
    const to = settlePose(toIndex, settles, currentLayouts);
    const mid = waypointIndex(fromIndex, toIndex);
    const waypoint = currentLayouts[mid] ?? fallbackLayout(mid);
    const gen = ++generationRef.current;

    stopPlayback();
    commitPose(start);

    const endpoints: LongJumpEndpoints = {
      fromX: start.x,
      fromW: start.width,
      waypointX: waypoint.left,
      waypointW: waypoint.width,
      toX: to.x,
      toW: to.width,
      forward: toIndex > fromIndex,
    };

    const jump = { from: fromIndex, to: toIndex, endpoints };
    longJumpRef.current = jump;
    setLongJump(jump);
    setAdjacentTransition(null);
    tl.replay();

    animate(underlineHeight, [start.height, to.height], {
      duration: tl.duration,
      ease: "easeOut",
    });

    if (generationRef.current !== gen) return;
  };

  useEffect(() => {
    if (!longJump) return;
    commitPose(
      readDialPose(
        longJump.endpoints,
        settleLook(longJump.to, settles).settleY,
      ),
    );
  }, [longJump, tl.time, tl.playing, geo.squeezeW, geo.travelW, settles]);

  useEffect(() => {
    if (!longJump) return;
    if (tl.playing) return;
    if (tl.time < tl.duration - 0.02) return;

    commitPose(settlePose(longJump.to, settles, layoutsRef.current));
    longJumpRef.current = null;
    setLongJump(null);
    tl.seek(0);
  }, [longJump, tl.time, tl.playing, tl.duration, settles]);

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
        start,
        settles,
        layoutsRef.current,
      );
      setAdjacentTransition({ from: fromIndex, to: index, profile });
      runAdjacentTransition(index, profile, start);
      return;
    }

    setAdjacentTransition(null);
    runLongJump(fromIndex, index, start);
  };

  const getColor = (index: number) => {
    return index === activeIndex ? ink : withOpacity(ink, 0.44);
  };

  return (
    <div className="tab-filter" data-node-id="853:501">
      <div
        ref={groupRef}
        className="tab-filter__group"
        data-node-id="853:490"
      >
        <div className="tab-filter__labels" role="tablist" data-node-id="853:457">
          {TABS.map((tab, index) => (
            <motion.button
              key={tab.label}
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
              transition={{ color: { duration: 0 } }}
            >
              <span
                ref={(element) => {
                  labelRefs.current[index] = element;
                }}
                className="tab-filter__label-text"
              >
                {tab.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
