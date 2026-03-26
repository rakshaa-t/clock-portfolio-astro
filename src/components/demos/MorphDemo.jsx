// MorphDemo — extracted from prevue.kit DeviceFrame.jsx + Dock.jsx
// Frosted blur veil morph between device shapes with real DevicePill tabs
import { useState, useRef, useEffect } from "react";
import { E, DEVICES } from "./easings.js";

const MORPH_MS = 420;
const MORPH_EASE = E.material;
const DEMO_S = 0.5;

// DevicePill — spring bounce on active state change (from Dock.jsx)
function DevicePill({ active, onClick, dActive, dActiveFg, dMuted, label }) {
  const [pressed, setPressed] = useState(false);
  const btnRef = useRef(null);
  const prevActive = useRef(active);

  useEffect(() => {
    if (active && !prevActive.current && btnRef.current) {
      const el = btnRef.current;
      el.style.transform = "scale(1.02)";
      el.style.transition = `transform 200ms ease-out, background 160ms ${E.quart}, color 160ms ${E.quart}`;
      const t = setTimeout(() => { el.style.transform = "scale(1)"; }, 280);
      return () => clearTimeout(t);
    }
    prevActive.current = active;
  }, [active]);

  return (
    <button ref={btnRef} onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        height: 28, padding: "0 10px", borderRadius: 999, border: "none", cursor: "pointer",
        fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Mono',monospace",
        background: active ? dActive : "transparent", color: active ? dActiveFg : dMuted,
        transform: pressed ? "scale(0.95)" : "scale(1)",
        transition: `transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), background 160ms ${E.quart}, color 160ms ${E.quart}`,
      }}
    >{label}</button>
  );
}

// Chrome — dynamic island, status bar, home bar (from DeviceFrame.jsx)
function Chrome({ device, s }) {
  const v = DEVICES[device];
  const t = `opacity 250ms ${E.quart}, transform 250ms ${E.quart}`;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3 }}>
      {v.island && (
        <div style={{
          position: "absolute", top: Math.round(10 * s), left: "50%", transform: "translateX(-50%)",
          width: Math.round(76 * s), height: Math.round(20 * s),
          borderRadius: 20, background: "#000", zIndex: 4, transition: t,
        }} />
      )}
      {v.status && (
        <div style={{
          position: "absolute", top: Math.round(13 * s),
          left: Math.round(18 * s), right: Math.round(18 * s),
          display: "flex", justifyContent: "space-between", alignItems: "center",
          color: "rgba(255,255,255,0.88)",
          fontSize: Math.max(7, Math.round(10 * s)),
          fontWeight: 500, fontFamily: "-apple-system, sans-serif", zIndex: 3, transition: t,
        }}>
          <span>9:41</span>
          <div style={{ display: "flex", alignItems: "center", gap: Math.round(4 * s) }}>
            <svg width={Math.round(14 * s)} height={Math.round(10 * s)} viewBox="0 0 14 10" fill="white" opacity="0.8">
              <rect y="5" width="2.5" height="5" rx="0.5" />
              <rect x="3.8" y="3" width="2.5" height="7" rx="0.5" />
              <rect x="7.6" y="1" width="2.5" height="9" rx="0.5" />
              <rect x="11.4" y="0" width="2.5" height="10" rx="0.5" />
            </svg>
            <div style={{
              width: Math.round(20 * s), height: Math.round(10 * s),
              border: "1.2px solid rgba(255,255,255,0.35)", borderRadius: 3, position: "relative",
            }}>
              <div style={{ position: "absolute", top: 2, left: 2, right: 3, bottom: 2, borderRadius: 1, background: "#fff" }} />
            </div>
          </div>
        </div>
      )}
      {v.homeBar && (
        <div style={{
          position: "absolute", bottom: Math.round(6 * s), left: "50%", transform: "translateX(-50%)",
          width: Math.round((device === "ipad" ? 110 : 96) * s),
          height: Math.max(2, Math.round(4 * s)),
          borderRadius: 2, background: "rgba(255,255,255,0.8)", zIndex: 4, transition: t,
        }} />
      )}
    </div>
  );
}

export default function MorphDemo() {
  const [device, setDevice] = useState("iphone");
  const veilRef = useRef(null);
  const prevDevice = useRef(device);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const h = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // Blur preview during device switch morph — driven via DOM ref
  useEffect(() => {
    if (prevDevice.current === device) return;
    prevDevice.current = device;
    const el = veilRef.current;
    if (!el || reducedMotion) return;
    el.style.transition = "none";
    el.style.opacity = "1";
    el.getBoundingClientRect(); // force repaint so opacity:1 is committed
    const t = setTimeout(() => {
      el.style.transition = "opacity 300ms ease-out";
      el.style.opacity = "0";
    }, MORPH_MS + 60);
    return () => clearTimeout(t);
  }, [device, reducedMotion]);

  const v = DEVICES[device];
  const s = DEMO_S;
  const w = Math.round(v.w * s);
  const h = Math.round(v.h * s);
  const radius = 20; // fixed — stays rounded on all device shapes
  const bezelR = 18;
  const pad = Math.round(v.pad * s);
  const ms = reducedMotion ? "150ms" : `${MORPH_MS}ms`;
  // Fixed height = tallest device (iPhone) so pills never shift vertically
  const deviceAreaH = Math.round(DEVICES.iphone.h * s);

  const morphT = `width ${ms} ${MORPH_EASE}, height ${ms} ${MORPH_EASE}`;

  const dMuted = "rgba(0,0,0,0.5)";
  const dActive = "#0a0a0a";
  const dActiveFg = "#fff";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 420, padding: "30px 20px", gap: 24 }}>
      {/* Fixed-height device area — prevents pills from shifting on device switch */}
      <div style={{ height: deviceAreaH, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* drop-shadow wrapper — shadow follows clip-path shape */}
      <div style={{
        position: "relative",
        filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.18)) drop-shadow(0 4px 12px rgba(0,0,0,0.1))",
      }}>
        {/* Device shell — clip-path enforces rounded corners throughout transition */}
        <div style={{
          width: w, height: h,
          clipPath: `inset(0 round ${radius}px)`,
          padding: pad, background: "#111",
          position: "relative", transition: morphT,
        }}>
          <div style={{
            width: "100%", height: h - pad * 2,
            borderRadius: bezelR, overflow: "hidden",
            position: "relative", background: "#0b0c10",
            transition: `height ${ms} ${MORPH_EASE}`,
          }}>
            <Chrome device={device} s={s} />

            {/* Placeholder content */}
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <div style={{
                width: device === "macbook" ? 120 : device === "ipad" ? 80 : 60,
                height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)",
                transition: `width ${ms} ${MORPH_EASE}`,
              }} />
              <div style={{
                width: device === "macbook" ? 80 : device === "ipad" ? 55 : 40,
                height: 4, borderRadius: 2, background: "rgba(255,255,255,0.03)",
                transition: `width ${ms} ${MORPH_EASE}`,
              }} />
            </div>

            {/* Frosted veil — covers content during device switch morph */}
            <div ref={veilRef} style={{
              position: "absolute", inset: 0, zIndex: 2,
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(28px) saturate(1.4)",
              WebkitBackdropFilter: "blur(28px) saturate(1.4)",
              opacity: 0, pointerEvents: "none",
            }} />
          </div>
        </div>
      </div>
      </div>

      {/* Device pills — matches Dock.jsx */}
      <div style={{ display: "flex", gap: 2 }}>
        {[
          { k: "iphone", l: "Phone" },
          { k: "ipad", l: "Tablet" },
          { k: "macbook", l: "Web" },
        ].map(({ k, l }) => (
          <DevicePill key={k} active={device === k} onClick={() => setDevice(k)}
            dActive={dActive} dActiveFg={dActiveFg} dMuted={dMuted} label={l} />
        ))}
      </div>
    </div>
  );
}
