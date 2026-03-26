// Dock demo — extracted from prevue.kit/src/components/Dock.jsx
// Shows the breathing hover effect with stable hit area
import { useState, useRef, useEffect } from "react";
import { E } from "./easings.js";

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

export default function DockDemo() {
  const [dockHovered, setDockHovered] = useState(false);
  const [device, setDevice] = useState("iphone");

  const dk = false; // light mode for demo
  const d = {
    restOpacity: 0.8, hoverOpacity: 1,
    translateY: 0, restScale: 1, hoverScale: 1,
    navPadRest: 8, navPadHover: 8,
    sepMarginRest: 11, sepMarginHover: 11,
    gapRest: 6, gapHover: 6,
    secPadRest: 2, secPadHover: 2,
  };

  const dBorder = "rgba(0,0,0,0.08)";
  const dMuted = "rgba(0,0,0,0.5)";
  const dActive = "#0a0a0a";
  const dActiveFg = "#fff";

  const sep = {
    width: 1, height: 24, background: dBorder,
    margin: dockHovered ? `0 ${d.sepMarginHover}px` : `0 ${d.sepMarginRest}px`,
    transition: "margin 280ms ease-out",
  };

  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", minHeight: 160, padding: "20px 20px 0" }}>
      {/* Stable hit area — prevents edge-hover flickering */}
      <div
        onMouseEnter={() => setDockHovered(true)}
        onMouseLeave={() => setDockHovered(false)}
        style={{ padding: "20px 24px 16px", pointerEvents: "auto" }}
      >
        <nav style={{
          display: "inline-flex", alignItems: "center",
          padding: dockHovered ? d.navPadHover : d.navPadRest, borderRadius: 999,
          background: "rgba(255,255,255,0.85)",
          border: `1px solid ${dBorder}`,
          backdropFilter: "blur(28px) saturate(1.4)", WebkitBackdropFilter: "blur(28px) saturate(1.4)",
          boxShadow: dockHovered
            ? "0 16px 48px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.03)"
            : "0 12px 36px rgba(0,0,0,0.05), 0 1px 6px rgba(0,0,0,0.02)",
          transform: dockHovered ? `translateY(0) scale(${d.hoverScale})` : `translateY(${d.translateY}px) scale(${d.restScale})`,
          transformOrigin: "center center",
          opacity: dockHovered ? d.hoverOpacity : d.restOpacity,
          transition: dockHovered
            ? `transform 280ms ease-out, padding 280ms ease-out, opacity 200ms ease-out, box-shadow 280ms ease-out, background 400ms ${E.quart}, border-color 400ms ${E.quart}`
            : `transform 400ms ease-out, padding 400ms ease-out, opacity 500ms ease-out, box-shadow 400ms ease-out, background 400ms ${E.quart}, border-color 400ms ${E.quart}`,
        }}>
          {/* Import button */}
          <button style={{
            padding: dockHovered ? "10px 18px" : "9px 16px", borderRadius: 999, border: "none", cursor: "pointer",
            background: dActive, color: dActiveFg, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
            fontFamily: "'DM Mono', monospace", fontWeight: 500,
            transition: `padding 280ms ease-out`,
          }}>Import</button>

          <div style={sep} />

          {/* Chrome toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: dockHovered ? d.gapHover : d.gapRest, padding: dockHovered ? `0 ${d.secPadHover}px` : `0 ${d.secPadRest}px`, transition: "gap 280ms ease-out, padding 280ms ease-out" }}>
            <div style={{
              width: 32, height: 18, borderRadius: 999, cursor: "pointer", position: "relative",
              background: "rgba(0,0,0,0.2)",
              transition: `background 160ms ${E.quart}`,
            }}>
              <div style={{
                position: "absolute", top: 2, left: 16, width: 14, height: 14, borderRadius: 999,
                background: "#333",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)", transition: `left 200ms ${E.spring}, background 160ms ${E.quart}`,
              }} />
            </div>
            <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: dMuted, whiteSpace: "nowrap" }}>Chrome</span>
          </div>

          <div style={sep} />

          {/* Device pills */}
          <div style={{ display: "flex", gap: 2, padding: dockHovered ? `0 ${d.secPadHover}px` : `0 ${d.secPadRest}px`, transition: "padding 280ms ease-out" }}>
            {[
              { k: "iphone", l: "Phone" },
              { k: "ipad", l: "Tablet" },
              { k: "macbook", l: "Web" },
            ].map(({ k, l }) => (
              <DevicePill key={k} active={device === k} onClick={() => setDevice(k)}
                dActive={dActive} dActiveFg={dActiveFg} dMuted={dMuted} label={l} />
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
