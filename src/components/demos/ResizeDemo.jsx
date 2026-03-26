// ResizeDemo — extracted from prevue.kit/src/components/DeviceFrame.jsx
// Corner bracket handles with rubber band resize + spring snap-back
import { useState, useRef, useCallback, useEffect } from "react";
import { E, DEVICES } from "./easings.js";

const DEMO_S = 0.5;
const SNAP_SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

function CornerBracket({ corner, color, hoverColor, onPointerDown, isResizing, deviceHovered, br }) {
  const [hovered, setHovered] = useState(false);
  const { size, thickness, offset, opacityRest, opacityDevice, opacityActive } = br;

  const posStyle = {
    tl: { top: offset, left: offset },
    tr: { top: offset, right: offset },
    bl: { bottom: offset, left: offset },
    br: { bottom: offset, right: offset },
  }[corner];

  const rotation = { tl: 0, tr: 90, bl: 270, br: 180 }[corner];
  const active = hovered || isResizing;
  const elevated = deviceHovered || active;
  const activeColor = active ? hoverColor : color;

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      style={{
        position: "absolute", ...posStyle,
        width: size + 16, height: size + 16,
        display: "grid", placeItems: "center",
        cursor: corner === "tl" || corner === "br" ? "nwse-resize" : "nesw-resize",
        zIndex: 5, touchAction: "none",
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: "opacity 200ms ease-out",
          opacity: active ? opacityActive : elevated ? opacityDevice : opacityRest,
          pointerEvents: "none",
        }}
      >
        <path
          d={`M${thickness / 2} ${size} L${thickness / 2} ${6} Q${thickness / 2} ${thickness / 2} ${6} ${thickness / 2} L${size} ${thickness / 2}`}
          stroke={activeColor}
          strokeWidth={thickness}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function ResizeDemo() {
  const [sizeScale, setSizeScale] = useState(1);
  const [isResizing, setIsResizing] = useState(false);
  const [snappingBack, setSnappingBack] = useState(false);
  const [deviceHovered, setDeviceHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const dragging = useRef(null);
  const scaleRef = useRef(sizeScale);
  scaleRef.current = sizeScale;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const h = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const v = DEVICES.iphone;
  const w = Math.round(v.w * sizeScale * DEMO_S);
  const h = Math.round(v.h * sizeScale * DEMO_S);
  const radius = Math.round(v.radius * sizeScale * DEMO_S);
  const bezelR = Math.round(v.bezelR * sizeScale * DEMO_S);
  const pad = Math.round(v.pad * sizeScale * DEMO_S);

  const br = {
    size: 13, thickness: 2.5, offset: -20,
    opacityRest: 0.15, opacityDevice: 1, opacityActive: 0.45,
  };
  const bracketColor = "rgba(0,0,0,0.35)";
  const bracketHover = "rgba(0,0,0,0.7)";

  const snapT = reducedMotion ? "none"
    : `width 400ms ${SNAP_SPRING}, height 400ms ${SNAP_SPRING}, border-radius 400ms ${SNAP_SPRING}, padding 400ms ${SNAP_SPRING}`;

  // Pointer down — only event on the bracket element itself
  const handlePointerDown = useCallback((e, corner) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    dragging.current = {
      startX: e.clientX,
      startY: e.clientY,
      startScale: scaleRef.current,
      corner,
    };
    setIsResizing(true);
  }, []);

  // Move + up use refs so window listeners always see latest values
  const moveRef = useRef(null);
  const upRef = useRef(null);

  moveRef.current = (e) => {
    if (!dragging.current) return;
    const { startX, startY, startScale, corner } = dragging.current;
    let dx = e.clientX - startX;
    let dy = e.clientY - startY;
    if (corner === "tl") { dx = -dx; dy = -dy; }
    else if (corner === "tr") { dy = -dy; }
    else if (corner === "bl") { dx = -dx; }

    // Project onto diagonal — prevents sign-flip jump when dominant axis switches
    const delta = (dx + dy) / Math.SQRT2;
    const scaleDelta = delta / (v.h * DEMO_S);
    const raw = startScale + scaleDelta;

    // Rubber banding past limits — logarithmic resistance
    let newScale;
    if (raw < v.minScale) {
      const over = v.minScale - raw;
      newScale = v.minScale - over * 0.15 / (1 + over * 3);
    } else if (raw > v.maxScale) {
      const over = raw - v.maxScale;
      newScale = v.maxScale + over * 0.15 / (1 + over * 3);
    } else {
      newScale = raw;
    }
    setSizeScale(newScale);
  };

  upRef.current = () => {
    if (!dragging.current) return;
    dragging.current = null;
    const s = scaleRef.current;
    const needsSnap = s < v.minScale || s > v.maxScale;
    if (needsSnap) {
      setSnappingBack(true);
      setSizeScale(Math.max(v.minScale, Math.min(v.maxScale, s)));
      setTimeout(() => setSnappingBack(false), 400);
    }
    setIsResizing(false);
  };

  // Window-level listeners for move/up — matches prevue.kit pattern
  useEffect(() => {
    if (!isResizing) return;
    const move = (e) => moveRef.current(e);
    const up = () => upRef.current();
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [isResizing]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 420, padding: "40px 30px", userSelect: "none" }}>
      <div
        onMouseEnter={() => setDeviceHovered(true)}
        onMouseLeave={() => setDeviceHovered(false)}
        style={{ position: "relative" }}
      >
        {["tl", "tr", "bl", "br"].map(c => (
          <CornerBracket key={c} corner={c} color={bracketColor} hoverColor={bracketHover}
            onPointerDown={(e) => handlePointerDown(e, c)}
            isResizing={isResizing} deviceHovered={deviceHovered} br={br} />
        ))}

        {/* Device shell */}
        <div style={{
          width: w, height: h,
          borderRadius: radius, padding: pad,
          background: "#111",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 24px 72px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.14)",
          position: "relative",
          transition: isResizing ? "none" : snappingBack ? snapT : reducedMotion ? "none" : "width 300ms ease-out, height 300ms ease-out, border-radius 300ms ease-out, padding 300ms ease-out",
        }}>
          <div style={{
            width: "100%", height: h - pad * 2,
            borderRadius: bezelR, overflow: "hidden",
            position: "relative", background: "#0b0c10",
            transition: isResizing ? "none" : snappingBack
              ? (reducedMotion ? "none" : `height 400ms ${SNAP_SPRING}, border-radius 400ms ${SNAP_SPRING}`)
              : reducedMotion ? "none" : "height 300ms ease-out, border-radius 300ms ease-out",
          }}>
            {/* Dynamic island */}
            <div style={{
              position: "absolute", top: Math.round(10 * sizeScale * DEMO_S),
              left: "50%", transform: "translateX(-50%)",
              width: Math.round(76 * sizeScale * DEMO_S),
              height: Math.round(20 * sizeScale * DEMO_S),
              borderRadius: 20, background: "#000", zIndex: 4,
            }} />
            {/* Status bar */}
            <div style={{
              position: "absolute", top: Math.round(13 * sizeScale * DEMO_S),
              left: Math.round(18 * sizeScale * DEMO_S),
              right: Math.round(18 * sizeScale * DEMO_S),
              display: "flex", justifyContent: "space-between", alignItems: "center",
              color: "rgba(255,255,255,0.88)",
              fontSize: Math.max(7, Math.round(10 * sizeScale * DEMO_S)),
              fontWeight: 500, fontFamily: "-apple-system, sans-serif", zIndex: 3,
            }}>
              <span>9:41</span>
            </div>
            {/* Home bar */}
            <div style={{
              position: "absolute", bottom: Math.round(6 * sizeScale * DEMO_S),
              left: "50%", transform: "translateX(-50%)",
              width: Math.round(96 * sizeScale * DEMO_S),
              height: Math.max(2, Math.round(4 * sizeScale * DEMO_S)),
              borderRadius: 2, background: "rgba(255,255,255,0.8)", zIndex: 4,
            }} />
            {/* Placeholder content */}
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <div style={{ width: 60, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)" }} />
              <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.03)" }} />
            </div>
          </div>
        </div>

        {/* Scale indicator */}
        {isResizing && (
          <div style={{
            position: "absolute", bottom: -28, left: "50%", transform: "translateX(-50%)",
            padding: "3px 10px", borderRadius: 6,
            background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.45)",
            fontSize: 9, fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.08em", whiteSpace: "nowrap", pointerEvents: "none",
          }}>
            {Math.round(sizeScale * 100)}%
          </div>
        )}
      </div>
    </div>
  );
}
