// The carousel itself — three.js + GSAP, no React. An infinite flat row of
// image panels rendered into an offscreen buffer, then drawn to screen
// through the liquid-glass lens shader. The React component just mounts this
// and listens to the callbacks.
//
//   const carousel = createCarousel(mountEl, {
//     caseStudyOverlayElement, // optional case-study layer positioned over a panel
//     onActiveChange(i) {},    // centered image changed
//     onFocusChange(open) {},  // focus mode opened / closed
//     onEntryDone(done) {},    // entry animation settled
//   });
//   carousel.closeFocus(); carousel.replayEntry(); carousel.destroy();

import * as THREE from "three";
import { gsap } from "gsap";
import { CONFIG, LENS, FOCUS, ENTRY } from "./config";

export function createCarousel(mount, callbacks = {}) {
  const {
    projects = [],
    initialIndex = 0,
    caseStudyOverlayElement = null,
    onActiveChange = () => {},
    onPanelSelect = onActiveChange,
    onFocusChange = () => {},
    onEntryDone = () => {},
  } = callbacks;

  if (!projects.length) {
    throw new Error("createCarousel requires a non-empty projects array");
  }

  const bootIndex =
    ((initialIndex % projects.length) + projects.length) % projects.length;

  let W = mount.clientWidth;
  let H = mount.clientHeight;

  // ---- renderer / scene / camera (orthographic, 1 unit = 1 px) ----
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  // Match the page/shell bg so FBO gaps blend with the theme (not a cream strip).
  let clearHex = 0x141218;
  try {
    const bg = getComputedStyle(mount).backgroundColor;
    const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (m) {
      clearHex = (Number(m[1]) << 16) | (Number(m[2]) << 8) | Number(m[3]);
    }
  } catch {
    // keep dark fallback
  }
  // Let the selected project's CSS stage show through between media panels.
  // An opaque WebGL clear was creating a subtly different band below the title.
  renderer.setClearColor(clearHex, 0);
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(
    -W / 2,
    W / 2,
    H / 2,
    -H / 2,
    -100,
    100,
  );
  camera.position.z = 10;

  // ---- load stills (+ optional looping videos) ----
  const loader = new THREE.TextureLoader();
  const sources = projects.map((img, srcIndex) => {
    const s = {
      tex: null,
      posterTex: null,
      videoTex: null,
      video: null,
      videoSrc: img.video || null,
      aspect: img.aspect || 1,
      locked: img.aspect != null,
      visible: false,
      videoReady: false,
      srcIndex,
    };

    const applyTexture = (tex) => {
      s.tex = tex;
      // Re-bind any pool mats already attached to this source.
      for (const p of pool) {
        if (p.srcIndex === srcIndex && p.bound) {
          p.mat.map = tex;
          p.mat.needsUpdate = true;
        }
      }
    };

    const onStill = (tex) => {
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.generateMipmaps = true;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      tex.colorSpace = THREE.SRGBColorSpace;
      if (!s.locked && tex.image) s.aspect = tex.image.width / tex.image.height;
      s.posterTex = tex;
      if (!s.videoReady) applyTexture(tex);
      recomputeTotal();
      // Keep the intended start panel centered while assets settle — never
      // yank back to index 0 (that was stretching the first paint).
      if (!userInteracted) {
        scroll = centerForIndex(bootIndex);
        target = scroll;
      }
    };

    if (img.src && img.src !== img.video) {
      loader.load(img.src, onStill);
    }

    if (img.video) {
      const video = document.createElement("video");
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      // Eager metadata for video-only items (no poster to show meanwhile).
      video.preload = img.src && img.src !== img.video ? "none" : "metadata";
      video.setAttribute("playsinline", "");
      video.setAttribute("muted", "");
      s.video = video;

      // No poster — attach immediately so the first frame can paint.
      if (!img.src || img.src === img.video) {
        video.src = img.video;
        video.load();
      }

      video.addEventListener("loadedmetadata", () => {
        if (!s.locked && video.videoWidth > 0 && video.videoHeight > 0) {
          s.aspect = video.videoWidth / video.videoHeight;
          recomputeTotal();
        }
      });

      const promoteVideoTexture = () => {
        if (s.videoReady) return;
        if (
          video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
          video.currentTime < 0.05
        ) {
          return;
        }
        const vtex = new THREE.VideoTexture(video);
        vtex.minFilter = THREE.LinearFilter;
        vtex.magFilter = THREE.LinearFilter;
        vtex.generateMipmaps = false;
        vtex.colorSpace = THREE.SRGBColorSpace;
        vtex.flipY = true;
        s.videoTex = vtex;
        s.videoReady = true;
        applyTexture(vtex);
        video.removeEventListener("timeupdate", promoteVideoTexture);
      };

      video.addEventListener("timeupdate", promoteVideoTexture);
      video.addEventListener("playing", promoteVideoTexture);
    }

    return s;
  });

  function attachVideoSource(src) {
    if (!src.video || !src.videoSrc) return;
    if (src.video.src) return;
    src.video.src = src.videoSrc;
    src.video.load();
  }

  function syncVideoPlayback() {
    if (document.hidden) {
      pauseAllVideos();
      return;
    }

    // Play only near-center panels (max 3) — keeps decode cost off the strip.
    const ranked = sources
      .map((src, i) => ({ src, i, dist: src.viewDist ?? Infinity }))
      .filter((x) => x.src.video && x.src.visible)
      .sort((a, b) => a.dist - b.dist);

    const playSet = new Set(ranked.slice(0, 3).map((x) => x.i));

    sources.forEach((src, i) => {
      if (!src.video) return;
      if (playSet.has(i)) {
        attachVideoSource(src);
        if (src.video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          void src.video.play().catch(() => {});
        }
        if (src.videoTex) src.videoTex.needsUpdate = true;
      } else if (!src.video.paused) {
        src.video.pause();
      }
    });
  }

  function pauseAllVideos() {
    sources.forEach((src) => {
      if (src.video && !src.video.paused) src.video.pause();
    });
  }

  // width of one slot: height is fixed (PANEL_H), so width = aspect * PANEL_H + gap
  function slotWidth(srcIndex) {
    return sources[srcIndex].aspect * CONFIG.PANEL_H + CONFIG.GAP;
  }

  // cumulative x of each source's slot, and the total loop width
  let offsets = [];
  let totalWidth = 0;
  function recomputeTotal() {
    offsets = [];
    let acc = 0;
    for (let i = 0; i < sources.length; i++) {
      offsets.push(acc);
      acc += slotWidth(i);
    }
    totalWidth = acc;
  }
  recomputeTotal();

  // scroll value that puts panel `idx` dead-center. idx is an unbounded
  // integer (loop k, source = idx mod N) so focus / click / entry can aim
  // at an exact panel copy.
  function centerForIndex(idx) {
    const N = sources.length;
    const loop = Math.floor(idx / N);
    const s = ((idx % N) + N) % N;
    return offsets[s] + slotWidth(s) / 2 - CONFIG.GAP / 2 + loop * totalWidth;
  }

  // integer index (including loop) whose center is closest to `value`
  function nearestIndex(value) {
    if (!totalWidth) return 0;
    const N = sources.length;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < N; i++) {
      const center = offsets[i] + slotWidth(i) / 2 - CONFIG.GAP / 2;
      const k = Math.round((value - center) / totalWidth);
      const dist = Math.abs(center + k * totalWidth - value);
      if (dist < bestDist) {
        bestDist = dist;
        best = i + k * N;
      }
    }
    return best;
  }

  // which source index is closest to screen center (for the overlay text)
  function centerIndex(value) {
    if (!totalWidth) return 0;
    let bestI = 0;
    let bestDist = Infinity;
    for (let i = 0; i < sources.length; i++) {
      const center = offsets[i] + slotWidth(i) / 2 - CONFIG.GAP / 2;
      const k = Math.round((value - center) / totalWidth);
      const dist = Math.abs(center + k * totalWidth - value);
      if (dist < bestDist) {
        bestDist = dist;
        bestI = i;
      }
    }
    return bestI;
  }
  let lastCenter = -1;

  // ---- mesh pool ----
  // REPEATS copies of the whole image set so wide screens never run dry.
  const REPEATS = 4;
  const pool = [];
  for (let r = 0; r < REPEATS; r++) {
    for (let i = 0; i < sources.length; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xdddddd,
        transparent: true,
        opacity: 0,
      });
      // Extra horizontal vertices let an outer card edge flare without
      // changing the panel's layout, UV mapping, or centre-edge height.
      const geometry = new THREE.PlaneGeometry(1, 1, 12, 1);
      const mesh = new THREE.Mesh(geometry, mat);
      mesh.visible = false;
      scene.add(mesh);
      pool.push({
        mesh,
        mat,
        srcIndex: i,
        basePositions: Float32Array.from(geometry.attributes.position.array),
        flare: 0,
        flareSide: 0,
      });
    }
  }

  // ---- scroll state ----
  let scroll = centerForIndex(bootIndex); // start on the selected project
  let target = scroll; // desired
  let userInteracted = false; // true once the user scrolls (stops auto-recenter)
  let prevScroll = 0;
  let scrollEnergy = 0; // smoothed 0..1 scroll activity, drives panel shrink
  let lastWheelAt = 0;
  let snapArmed = false; // wheel input arms the settle-snap; it fires once
  let snapTarget = null;
  let drag = null;
  let suppressClick = false;

  // ---- liquid-glass lens: FBO + fullscreen pass ----
  // The carousel renders into rt at device resolution (CSS-sized would render
  // at 1x and upscale — blurry on retina); a fullscreen quad then samples it
  // through the lens shader.
  const dpr = renderer.getPixelRatio();
  let rt = new THREE.WebGLRenderTarget(W * dpr, H * dpr);
  const lensScene = new THREE.Scene();
  const lensCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const lensUniforms = {
    uTex: { value: rt.texture },
    uRes: { value: new THREE.Vector2(W * dpr, H * dpr) },
    uCenter: { value: new THREE.Vector2(0.5, 0.5) },
    uSizeX: { value: LENS.sizeX },
    uSizeY: { value: LENS.sizeY },
    uShape: { value: LENS.shape === "square" ? 1.0 : 0.0 },
    uSquareRound: { value: LENS.squareRound },
    uRotation: { value: 0.0 },
    uAspect: { value: W / H },
    uZoom: { value: LENS.zoom },
    uDispersion: { value: LENS.dispersion },
    uBlur: { value: LENS.blur },
    uGlow: { value: LENS.glow },
    uCenterShade: { value: LENS.centerShade ?? 0.09 },
    uWhiteGlow: { value: LENS.whiteGlow },
    uNovaSize: { value: LENS.novaSize },
    uBlueRing: { value: LENS.blueRing },
    uRingRadius: { value: LENS.ringRadius },
    uRingWidth: { value: LENS.ringWidth },
    uShimmer: { value: LENS.shimmer ? 1.0 : 0.0 },
    uShimmerFreq: { value: LENS.shimmerFreq },
    uShimmerSpeed: { value: LENS.shimmerSpeed },
    uShimmerDepth: { value: LENS.shimmerDepth },
    uTime: { value: 0.0 },
    uRimStart: { value: LENS.rimStart },
    uRimTangential: { value: LENS.rimTangential },
    uRimInward: { value: LENS.rimInward },
    uRimFreq1: { value: LENS.rimFreq1 },
    uRimFreq2: { value: LENS.rimFreq2 },
    uBlueColor: { value: new THREE.Color(LENS.blueColor) },
    uRimLine: { value: LENS.rimLine },
    uRimLinePos: { value: LENS.rimLinePos },
    uRimLineWidth: { value: LENS.rimLineWidth },
    uVignette: { value: LENS.vignette },
    uVignetteSize: { value: LENS.vignetteSize },
    uSamples: { value: LENS.samples },
  };
  const lensMat = new THREE.ShaderMaterial({
    uniforms: lensUniforms,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
    `,
    fragmentShader: /* glsl */ `
      #define PI 3.14159265
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTex;
      uniform vec2  uRes;
      uniform vec2  uCenter;
      uniform float uSizeX;         // half-width (height-fraction units)
      uniform float uSizeY;         // half-height (height-fraction units)
      uniform float uAspect;        // W/H
      uniform float uZoom;
      uniform float uDispersion;
      uniform float uBlur;
      uniform float uGlow;
      uniform float uCenterShade;
      uniform float uWhiteGlow;
      uniform float uNovaSize;
      uniform float uBlueRing;
      uniform float uRingRadius;
      uniform float uRingWidth;
      uniform float uShimmer;
      uniform float uShimmerFreq;
      uniform float uShimmerSpeed;
      uniform float uShimmerDepth;
      uniform float uTime;
      uniform float uRimStart;
      uniform float uRimTangential;
      uniform float uRimInward;
      uniform float uRimFreq1;
      uniform float uRimFreq2;
      uniform vec3  uBlueColor;
      uniform float uRimLine;
      uniform float uRimLinePos;
      uniform float uRimLineWidth;
      uniform float uVignette;     // overall vignette strength (0 = off)
      uniform float uVignetteSize; // radius where vignette begins
      uniform float uShape;        // 0 = circle, 1 = square
      uniform float uSquareRound;  // corner rounding for square (0..1)
      uniform float uRotation;     // lens rotation in radians
      uniform int   uSamples;

      const int MAX_SAMPLES = 16;

      // rounded-box signed distance (negative inside)
      float sdRoundBox(vec2 p, vec2 b, float r){
        vec2 q = abs(p) - b + r;
        return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
      }

      // Evaluate the disc lens centered at 'center' (screen-UV). Returns the
      // lensed color; 'outA' = how opaque this lens is here (0 outside disc).
      vec3 discLens(vec2 center, float aspectCorrect, out float outA) {
        // local coords, aspect-corrected so x/y are in the same screen units
        vec2 p = (vUv - center);
        p.x *= aspectCorrect;
        // rotate local space so the rect + all internals spin together
        float ca = cos(uRotation), sa = sin(uRotation);
        p = mat2(ca, -sa, sa, ca) * p;
        vec2 halfSize = vec2(uSizeX, uSizeY);
        // elliptical distance: 0 center .. 1 boundary
        float dist = length(p / halfSize);
        outA = 0.0;

        // mask shape: ellipse OR rounded rect, drives the cutoff.
        // maskND: 0 inside .. 1 at the shape boundary (>1 outside).
        float maskND;
        if (uShape > 0.5) {
          float corner = min(uSizeX, uSizeY) * clamp(uSquareRound, 0.0, 1.0);
          float sd = sdRoundBox(p, halfSize, corner);
          maskND = 1.0 + sd / min(uSizeX, uSizeY);
        } else {
          maskND = dist;
        }
        if (maskND > 1.0) return vec3(0.0);

        // shapeND: 0 center .. 1 boundary, following the chosen shape. Used by
        // nova / ring / border so they take the SAME shape.
        float shapeND = clamp(maskND, 0.0, 1.0);

        // deflection uses the elliptical radial nd so it bends smoothly from
        // the center even when the boundary is rectangular
        float nd = clamp(dist, 0.0, 1.0);
        vec2  offset = vUv - center;
        vec2  radialDir = normalize(offset + 1e-6);
        vec2  tangentDir = vec2(-radialDir.y, radialDir.x);
        // angle measured in ROTATED local space so the rim wave/shimmer spin too
        float angle = atan(p.y, p.x);

        // inward pull + fluid rim waves
        float pull = uZoom * 0.30 * (nd * nd);
        float rimStrength = smoothstep(uRimStart, 1.0, nd);
        float fluidWave = sin(angle * uRimFreq1) * 0.55 + sin(angle * uRimFreq2) * 0.25;
        float rScreen = (uSizeX + uSizeY) * 0.5;
        vec2  rimOff = tangentDir * fluidWave * rimStrength * rScreen * uRimTangential;
        vec2  rimPull = -radialDir * rimStrength * rScreen * uRimInward;

        vec2 baseUV = center + offset * (1.0 - pull) + rimOff + rimPull;

        // Skip the multi-sample pass unless chromatic dispersion is enabled.
        // Sampling once preserves the source media's RGB values exactly.
        float rimMask = smoothstep(0.55, 1.0, nd);
        vec3 col = texture2D(uTex, baseUV).rgb;
        if (uDispersion > 0.0001) {
          vec2 dispDir = offset * uDispersion * 0.004 * rimMask;
          int N = uSamples;
          if (N < 2) N = 2;
          if (N > MAX_SAMPLES) N = MAX_SAMPLES;
          col = vec3(0.0);
          vec3 caW = vec3(0.0);
          for (int i = 0; i < MAX_SAMPLES; i++) {
            if (i >= N) break;
            float t = float(i) / float(N - 1);
            vec2 sUV = baseUV + dispDir * (t - 0.5);
            vec3 s = texture2D(uTex, sUV).rgb;
            vec3 w = vec3(
              exp(-pow((t - 0.00) / 0.38, 2.0)),
              exp(-pow((t - 0.50) / 0.38, 2.0)),
              exp(-pow((t - 1.00) / 0.38, 2.0))
            );
            col += s * w;
            caW += w;
          }
          col /= max(caW, vec3(0.001));
        }

        // optional blur near the rim
        float blurFade = 1.0 - smoothstep(0.72, 0.98, nd);
        if (uBlur > 0.01 && blurFade > 0.01) {
          vec2 blurRad = vec2(uBlur) / uRes * blurFade;
          vec3 bcol = vec3(0.0);
          float btw = 0.0;
          for (float a = 0.0; a < PI * 2.0; a += PI * 2.0 / 6.0) {
            for (float rr = 0.4; rr <= 1.001; rr += 0.3) {
              vec2 o = vec2(cos(a), sin(a)) * blurRad * rr;
              float w = 1.0 - rr * 0.38;
              bcol += texture2D(uTex, baseUV + o).rgb * w;
              btw += w;
            }
          }
          col = mix(bcol / btw, col, rimMask);
        }

        // glassy darkening toward center
        col *= mix(1.0 - uCenterShade, 1.0, smoothstep(0.0, 0.38, shapeND));

        // white nova glow at center
        float r2 = shapeND * shapeND * 0.25;
        float gs = max(uNovaSize * uGlow * 0.003, 0.004);
        float nova = exp(-r2 / gs) + exp(-r2 / (gs * 7.0)) * 0.18;
        nova *= uWhiteGlow * (uGlow / 17.0) * 1.15;
        col += vec3(nova);

        // blue ring + aura
        float dC = shapeND * 0.5;
        float tR = clamp(uRingRadius, 0.1, 0.49);
        float rW = max(uRingWidth, 0.003);
        float ring = exp(-pow((dC - tR) / rW, 2.0));
        ring *= uBlueRing * (uGlow / 17.0) * 1.8;
        if (uShimmer > 0.5) ring *= sin(angle * uShimmerFreq + uTime * uShimmerSpeed) * uShimmerDepth + (1.0 - uShimmerDepth);
        float ringAura = exp(-pow((dC - tR) / (rW * 6.0), 2.0)) * 0.28 * uBlueRing * (uGlow / 17.0);
        col += uBlueColor * (ring + ringAura);
        // bright border line
        col += vec3(exp(-pow((dC - uRimLinePos) / max(uRimLineWidth, 0.0001), 2.0)) * uRimLine);

        // lens alpha: solid inside, soft falloff at the very edge
        outA = smoothstep(1.0, 0.93, maskND);
        return col;
      }

      void main(){
        vec3 base = texture2D(uTex, vUv).rgb;  // carousel, untouched
        vec3 outc = base;

        float a = 0.0;
        vec3 c = discLens(uCenter, uAspect, a);
        outc = mix(outc, c, a);

        // overall vignette: darken toward screen corners (aspect-correct)
        if (uVignette > 0.001) {
          vec2 vc = vUv - 0.5;
          vc.x *= uAspect;
          float d = length(vc) / max(uVignetteSize, 0.0001);
          float vig = 1.0 - uVignette * smoothstep(0.5, 1.0, d);
          outc *= clamp(vig, 0.0, 1.0);
        }

        gl_FragColor = vec4(outc, 1.0);
      }
    `,
  });
  const lensQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), lensMat);
  lensScene.add(lensQuad);

  // ---- focus state ----
  // When focused, the lens props fade out (lensFx 1->0) and every panel
  // except the focused one slides down off-screen, staggered center-out.
  const focusState = {
    active: false,
    srcIndex: -1,
    poolIdx: -1,
    lensFx: ENTRY.enabled ? 0 : 1, // 0 during entry; blooms in later
    anim: null,
  };
  const drop = new Array(REPEATS * sources.length).fill(0); // per-panel drop 0..1
  let focusScale = 1; // eased scale-up applied to the focused panel
  const lastCenterX = new Array(REPEATS * sources.length); // per-pool x, undefined if hidden

  // ---- entry state ----
  // pEntry[poolIdx]: 0 = below screen at startH, 1 = settled in the real row.
  const pEntry = new Array(REPEATS * sources.length).fill(ENTRY.enabled ? 0 : 1);
  let entryActive = ENTRY.enabled;
  let entrySettled = false; // rise finished but panels held at small size
  const growArr = new Array(REPEATS * sources.length).fill(
    ENTRY.enabled ? 0 : 1,
  );
  let entryAnim = null;

  // lens props that fade out for focus/entry, with their full values
  const LENS_FX_KEYS = [
    "uDispersion",
    "uBlueRing",
    "uRimLine",
    "uVignette",
    "uZoom",
    "uRimTangential",
    "uRimInward",
  ];
  const lensFxFull = {};
  LENS_FX_KEYS.forEach((k) => (lensFxFull[k] = lensUniforms[k].value));

  // ---- layout: place pooled meshes for the current scroll (every frame) ----
  let panelRects = []; // visible panel screen rects for hit-testing
  let centeredPanel = null; // panel nearest screen center

  function updateEdgeFlare(p, width, height, centerX) {
    const edgeSide = centerX < 0 ? -1 : 1;
    const outwardEdge =
      edgeSide < 0 ? centerX - width / 2 : centerX + width / 2;
    const edgeDistance =
      edgeSide < 0 ? outwardEdge + W / 2 : W / 2 - outwardEdge;
    const edgeProximity = Math.max(
      0,
      1 - Math.abs(edgeDistance) / CONFIG.EDGE_FLARE_RANGE,
    );
    const flare =
      CONFIG.EDGE_FLARE_ENABLED &&
      !focusState.active && !entryActive && !entrySettled
        ? CONFIG.EDGE_FLARE_MAX * scrollEnergy * edgeProximity * edgeProximity
        : 0;

    if (
      Math.abs(p.flare - flare) < 0.15 &&
      p.flareSide === (flare > 0 ? edgeSide : 0)
    ) {
      return flare;
    }

    const positions = p.mesh.geometry.attributes.position;
    const base = p.basePositions;
    const lift = flare / Math.max(height, 1);
    for (let vertex = 0; vertex < positions.count; vertex++) {
      const index = vertex * 3;
      const x = base[index];
      const edgeWeight =
        edgeSide < 0
          ? Math.pow(0.5 - x, CONFIG.EDGE_FLARE_CURVE)
          : Math.pow(x + 0.5, CONFIG.EDGE_FLARE_CURVE);
      positions.array[index + 1] = base[index + 1] * (1 + lift * 2 * edgeWeight);
    }
    positions.needsUpdate = true;
    p.flare = flare;
    p.flareSide = flare > 0 ? edgeSide : 0;
    return flare;
  }

  function layout() {
    panelRects = [];
    centeredPanel = null;
    let centeredDist = Infinity;
    for (const src of sources) {
      src.visible = false;
      src.viewDist = Infinity;
    }
    const half = W / 2;
    const buffer = CONFIG.PANEL_H; // generous horizontal buffer
    pool.forEach((p, poolIdx) => {
      const rep = Math.floor(poolIdx / sources.length);
      const i = p.srcIndex;
      const src = sources[i];

      // slot center within one loop, shifted by scroll, wrapped, then pushed
      // out by this pool entry's repetition rung
      const slotCenterInLoop = offsets[i] + slotWidth(i) / 2 - CONFIG.GAP / 2;
      let x = slotCenterInLoop - scroll;
      x = ((x % totalWidth) + totalWidth) % totalWidth;
      x += (rep - Math.floor(REPEATS / 2)) * totalWidth;
      if (x > half + totalWidth) x -= totalWidth * REPEATS;

      const centerX = x;
      const inEntry = entryActive || entrySettled;
      if (!inEntry && (centerX < -half - buffer || centerX > half + buffer)) {
        p.mesh.visible = false;
        lastCenterX[poolIdx] = undefined;
        return;
      }
      lastCenterX[poolIdx] = centerX;
      src.visible = true;
      src.viewDist = Math.min(src.viewDist ?? Infinity, Math.abs(centerX));

      // Height fixed; width follows natural aspect — never crop or stretch.
      // Preserve the existing response during normal scrolling, then make a
      // deliberate fast flick feel more elastic without changing layout.
      const shrinkAmount =
        CONFIG.SHRINK_BASE +
        CONFIG.SHRINK_FAST_BOOST * scrollEnergy * scrollEnergy;
      const shrink = 1 - shrinkAmount * scrollEnergy;
      const h = CONFIG.PANEL_H * shrink;
      const wPx = src.aspect * CONFIG.PANEL_H * shrink;

      // bind texture once available
      if (src.tex && !p.bound) {
        p.mat.map = src.tex;
        p.mat.color.set(0xffffff);
        p.mat.opacity = 1;
        p.mat.needsUpdate = true;
        p.bound = true;
      }

      let y = -H * (CONFIG.ROW_OFFSET_Y || 0);

      // focus: the focused panel grows and stays put, others slide down
      const isFocused = focusState.active && focusState.poolIdx === poolIdx;
      const d = drop[poolIdx] || 0;
      let drawW = wPx;
      let drawH = h;
      if (isFocused) {
        drawW = wPx * focusScale;
        drawH = h * focusScale;
      } else if (d > 0) {
        y = -d * H * FOCUS.dropDist;
      }

      p.mesh.visible = true;

      // entry: interpolate from (below screen, startH) up to the real state
      let finalX = centerX;
      let finalY = y;
      let finalW = drawW;
      let finalH = drawH;
      if (entryActive || entrySettled) {
        const pe = pEntry[poolIdx] || 0;
        const g = growArr[poolIdx] || 0;

        const curH = ENTRY.startH + (drawH - ENTRY.startH) * g;
        finalH = curH;
        finalW = curH * src.aspect;

        // constant-gap walk from the centered source, one copy per source.
        // Each slot uses ITS OWN current grow height, so a grown panel takes
        // more space and pushes neighbours outward.
        const cSrc = centerIndex(scroll);
        let di = i - cSrc;
        if (di > sources.length / 2) di -= sources.length;
        if (di < -sources.length / 2) di += sources.length;
        const N = sources.length;
        const midRep = Math.floor(REPEATS / 2);
        if (rep !== midRep) {
          p.mesh.visible = false;
          lastCenterX[poolIdx] = undefined;
          return;
        }
        const slotH = (s) => {
          const gg = growArr[midRep * N + s] || 0;
          return ENTRY.startH + (CONFIG.PANEL_H - ENTRY.startH) * gg;
        };
        let off = 0;
        if (di > 0) {
          for (let k = 0; k < di; k++) {
            const sa = (((cSrc + k) % N) + N) % N;
            const sb = (((cSrc + k + 1) % N) + N) % N;
            off +=
              (sources[sa].aspect * slotH(sa) +
                sources[sb].aspect * slotH(sb)) /
                2 +
              CONFIG.GAP;
          }
        } else if (di < 0) {
          for (let k = 0; k < -di; k++) {
            const sa = (((cSrc - k) % N) + N) % N;
            const sb = (((cSrc - k - 1) % N) + N) % N;
            off -=
              (sources[sa].aspect * slotH(sa) +
                sources[sb].aspect * slotH(sb)) /
                2 +
              CONFIG.GAP;
          }
        }
        finalX = off;
        if (finalX < -half - buffer || finalX > half + buffer) {
          p.mesh.visible = false;
          lastCenterX[poolIdx] = undefined;
          return;
        }

        // vertical: rise from below the screen up to real y
        const below = -H * ENTRY.fromBelow;
        finalY = below + (y - below) * pe;
      }

      const edgeFlare = updateEdgeFlare(p, finalW, finalH, finalX);
      p.mesh.position.set(finalX, finalY, 0);
      p.mesh.scale.set(finalW, finalH, 1);

      // screen rect (px, top-left origin) for pointer hit-testing
      const sx = centerX + W / 2;
      const sy = H / 2 - finalY;
      panelRects.push({
        left: sx - finalW / 2,
        right: sx + finalW / 2,
        top: sy - finalH / 2 - edgeFlare,
        bottom: sy + finalH / 2 + edgeFlare,
        poolIdx,
        srcIndex: i,
        centerX,
      });

      if (Math.abs(centerX) < centeredDist) {
        centeredDist = Math.abs(centerX);
        centeredPanel = { srcIndex: i, centerX, wPx, h, poolIdx };
      }
    });
  }

  // which visible panel (if any) is under a viewport point?
  function panelAtPointer(px, py) {
    for (let i = 0; i < panelRects.length; i++) {
      const r = panelRects[i];
      if (px >= r.left && px <= r.right && py >= r.top && py <= r.bottom)
        return r;
    }
    return null;
  }

  const el = renderer.domElement;

  // ---- case-study overlay ----
  // This independent DOM layer sits above the WebGL canvas but never takes
  // pointer events, so it cannot interfere with carousel drag/click handling.
  const caseStudyOverlayEnabled =
    Boolean(caseStudyOverlayElement) &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  let overlayProject = -1;
  let overlayPoint = null;
  let overlayRect = null;
  let lastPointer = null;

  function updateCaseStudyOverlay(rect) {
    if (!caseStudyOverlayEnabled || !rect) return;
    const next = {
      x: rect.left,
      y: rect.top,
      width: rect.right - rect.left,
      height: rect.bottom - rect.top,
    };
    const changed =
      !overlayRect ||
      Math.abs(overlayRect.x - next.x) > 0.2 ||
      Math.abs(overlayRect.y - next.y) > 0.2 ||
      Math.abs(overlayRect.width - next.width) > 0.2 ||
      Math.abs(overlayRect.height - next.height) > 0.2;
    if (!changed) return;
    overlayRect = next;
    caseStudyOverlayElement.style.width = `${next.width}px`;
    caseStudyOverlayElement.style.height = `${next.height}px`;
    caseStudyOverlayElement.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`;
  }

  function setCaseStudyOverlay(hit) {
    const hasCaseStudy =
      !entryActive &&
      !entrySettled &&
      Boolean(hit) &&
      Boolean(projects[hit.srcIndex]?.caseStudyUrl);
    const nextProject = hasCaseStudy ? hit.srcIndex : -1;
    el.style.cursor = hasCaseStudy && caseStudyOverlayEnabled ? "pointer" : "";
    if (!caseStudyOverlayEnabled) return;
    if (nextProject === overlayProject) {
      if (hasCaseStudy) updateCaseStudyOverlay(hit);
      return;
    }
    overlayProject = nextProject;
    if (!hasCaseStudy) {
      overlayPoint = null;
      overlayRect = null;
      caseStudyOverlayElement.dataset.active = "false";
      return;
    }
    overlayPoint = lastPointer;
    const overlayLabel =
      projects[nextProject]?.caseStudyLabel || "View case study";
    const overlayText = caseStudyOverlayElement.querySelector("span");
    if (overlayText) overlayText.textContent = overlayLabel;
    updateCaseStudyOverlay(hit);
    caseStudyOverlayElement.dataset.active = "true";
  }

  function syncCaseStudyOverlay() {
    if (!caseStudyOverlayEnabled || !overlayPoint) return;
    const hit = panelAtPointer(overlayPoint.x, overlayPoint.y);
    if (!hit || hit.srcIndex !== overlayProject) {
      setCaseStudyOverlay(hit);
      return;
    }
    updateCaseStudyOverlay(hit);
  }

  // ---- input ----
  function onWheel(e) {
    e.preventDefault();
    if (focusState.active || entryActive || entrySettled) return;
    userInteracted = true;
    snapTarget = null;
    target += (e.deltaY || e.deltaX) * CONFIG.WHEEL;
    lastWheelAt = performance.now();
    snapArmed = true;
  }

  function onPointerDown(e) {
    if (e.button !== 0 || focusState.active || entryActive || entrySettled)
      return;
    drag = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startTarget: target,
      moved: false,
    };
    snapTarget = null;
    setCaseStudyOverlay(null);
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      // Pointer capture can fail if the event has already been cancelled.
    }
  }

  function onPointerMove(e) {
    lastPointer = { x: e.clientX, y: e.clientY };

    if (drag && drag.pointerId === e.pointerId) {
      const dx = e.clientX - drag.startX;
      if (!drag.moved && Math.abs(dx) > CONFIG.DRAG_THRESHOLD) {
        drag.moved = true;
        suppressClick = true;
        userInteracted = true;
      }
      if (drag.moved) {
        e.preventDefault();
        target = drag.startTarget - dx;
        snapArmed = true;
        lastWheelAt = performance.now();
      }
      setCaseStudyOverlay(null);
      return;
    }

    if (focusState.active) {
      setCaseStudyOverlay(null);
      return;
    }
    const hit = panelAtPointer(e.clientX, e.clientY);
    setCaseStudyOverlay(hit);
  }
  function onLeave() {
    setCaseStudyOverlay(null);
  }

  function onPointerUp(e) {
    if (!drag || drag.pointerId !== e.pointerId) return;
    const moved = drag.moved;
    drag = null;
    if (moved) {
      lastWheelAt = performance.now();
      snapArmed = true;
      window.setTimeout(() => {
        suppressClick = false;
      }, 0);
    }
    try {
      el.releasePointerCapture(e.pointerId);
    } catch {
      // Already released.
    }
  }

  function onClick(e) {
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    if (focusState.active || entryActive || entrySettled) return;
    const hit = panelAtPointer(e.clientX, e.clientY);
    if (!hit) return;

    userInteracted = true;
    const caseStudyUrl = projects[hit.srcIndex]?.caseStudyUrl;
    if (caseStudyUrl) {
      window.open(caseStudyUrl, "_blank", "noopener,noreferrer");
      setCaseStudyOverlay(null);
      return;
    }
    target = centerForIndex(nearestIndex(scroll + hit.centerX));
    onPanelSelect(hit.srcIndex);
    setCaseStudyOverlay(null);

    // Showcase uses the strip as navigation; focus mode remains available
    // through the engine API but normal panel clicks do not enter it.
  }

  // ---- focus open / close ----
  function openFocus() {
    if (focusState.active || !centeredPanel) return;
    const src = sources[centeredPanel.srcIndex];
    if (!src || !src.tex) return;

    focusState.active = true;
    snapTarget = null;
    snapArmed = false;
    focusState.srcIndex = centeredPanel.srcIndex;
    const focusPoolIdx = centeredPanel.poolIdx;
    focusState.poolIdx = focusPoolIdx;

    // pull scroll precisely to center so the focused panel is dead-centre
    target = centerForIndex(nearestIndex(scroll));

    // order the OTHER panels by distance from the focused card and group
    // near-equal distances, so left/right pairs leave together — a real
    // center-out wave radiating from the clicked card
    const focusX = lastCenterX[focusPoolIdx] || 0;
    const others = pool
      .map((p, idx) => ({ idx, x: lastCenterX[idx] }))
      .filter((o) => o.idx !== focusPoolIdx && o.x !== undefined)
      .map((o) => ({ idx: o.idx, dist: Math.abs(o.x - focusX) }))
      .sort((a, b) => a.dist - b.dist);

    let rank = 0;
    let prevDist = -1;
    const ranked = others.map((o) => {
      if (prevDist >= 0 && o.dist - prevDist > 1) rank++;
      prevDist = o.dist;
      return { idx: o.idx, rank };
    });

    // re-snapshot lens values so the fade/restore tracks live GUI sliders
    LENS_FX_KEYS.forEach((k) => (lensFxFull[k] = lensUniforms[k].value));

    if (focusState.anim) focusState.anim.kill();
    const tl = gsap.timeline();
    tl.to(
      focusState,
      { lensFx: 0, duration: FOCUS.lensFade, ease: "power3.out" },
      0,
    );
    tl.to(
      { v: focusScale },
      {
        v: FOCUS.centerScale,
        duration: FOCUS.focusDuration,
        ease: FOCUS.focusEase,
        onUpdate() {
          focusScale = this.targets()[0].v;
        },
      },
      0,
    );
    ranked.forEach((o) => {
      tl.to(
        drop,
        { [o.idx]: 1, duration: FOCUS.cardDuration, ease: FOCUS.cardEase },
        o.rank * FOCUS.stagger,
      );
    });
    focusState.anim = tl;

    setCaseStudyOverlay(null);
    el.style.cursor = "";
    onFocusChange(true);
  }

  function closeFocus() {
    if (!focusState.active) return;
    if (focusState.anim) focusState.anim.kill();

    // return wave: farthest cards first (edges-in), symmetric pairs together
    const focusX = lastCenterX[focusState.poolIdx] || 0;
    const others = pool
      .map((p, idx) => ({ idx, x: lastCenterX[idx] }))
      .filter((o) => o.x !== undefined && (drop[o.idx] || 0) > 0)
      .map((o) => ({ idx: o.idx, dist: Math.abs(o.x - focusX) }))
      .sort((a, b) => b.dist - a.dist);

    let rank = 0;
    let prevDist = -1;
    const ranked = others.map((o) => {
      if (prevDist >= 0 && prevDist - o.dist > 1) rank++;
      prevDist = o.dist;
      return { idx: o.idx, rank };
    });

    // notify the host NOW so its UI animates in sync with the cards
    // returning; focusState.active stays true until the timeline finishes
    // (it still gates scroll input)
    onFocusChange(false);

    const tl = gsap.timeline({
      onComplete: () => {
        focusState.active = false;
        focusState.srcIndex = -1;
      },
    });
    tl.to(
      focusState,
      { lensFx: 1, duration: FOCUS.lensFade * 0.8, ease: "power3.inOut" },
      0,
    );
    tl.to(
      { v: focusScale },
      {
        v: 1,
        duration: FOCUS.focusDuration * 0.85,
        ease: FOCUS.focusEase,
        onUpdate() {
          focusScale = this.targets()[0].v;
        },
      },
      0,
    );
    ranked.forEach((o) => {
      tl.to(
        drop,
        {
          [o.idx]: 0,
          duration: FOCUS.cardDuration * 0.85,
          ease: FOCUS.cardEase,
        },
        o.rank * FOCUS.stagger * 0.7,
      );
    });
    focusState.anim = tl;
  }

  // ---- entry animation: rise from below, hold small, grow to full ----
  function playEntry() {
    if (entryAnim) entryAnim.kill();
    for (let k = 0; k < pEntry.length; k++) pEntry[k] = 0;
    entryActive = true;
    entrySettled = false;
    onEntryDone(false);
    for (let k = 0; k < growArr.length; k++) growArr[k] = 0;
    focusState.lensFx = 0; // no lens distortion during entry

    // center a panel cleanly; that panel rises first
    target = centerForIndex(nearestIndex(scroll));
    scroll = target;

    layout(); // populate lastCenterX
    const visible = [];
    for (let k = 0; k < lastCenterX.length; k++) {
      if (lastCenterX[k] !== undefined) visible.push(k);
    }

    const tl = gsap.timeline({ delay: ENTRY.delay });
    // each card rises after its own random delay
    const spread = ENTRY.stagger * Math.max(visible.length - 1, 1);
    let lastRiseEnd = 0;
    visible.forEach((idx) => {
      const at = Math.random() * spread;
      lastRiseEnd = Math.max(lastRiseEnd, at + ENTRY.riseDuration);
      tl.to(
        pEntry,
        { [idx]: 1, duration: ENTRY.riseDuration, ease: ENTRY.riseEase },
        at,
      );
    });

    // rise done -> hold at small size, then grow to full (staggered)
    tl.call(
      () => {
        entryActive = false;
        entrySettled = true;
      },
      null,
      lastRiseEnd,
    );

    // grow stagger ranked by slot distance from the centered source, so
    // symmetric left/right pairs grow together. outward = center first,
    // inward = edges first.
    const cSrcG = centerIndex(scroll);
    const Ng = sources.length;
    const midRepG = Math.floor(REPEATS / 2);
    const growList = [];
    let maxRank = 0;
    for (let k = 0; k < lastCenterX.length; k++) {
      if (lastCenterX[k] === undefined) continue;
      if (Math.floor(k / Ng) !== midRepG) continue;
      let di = (k % Ng) - cSrcG;
      if (di > Ng / 2) di -= Ng;
      if (di < -Ng / 2) di += Ng;
      const r = Math.abs(di);
      maxRank = Math.max(maxRank, r);
      growList.push({ idx: k, rank: r });
    }
    const growRanked = growList.map((v) => ({
      idx: v.idx,
      rank: ENTRY.growDir === "outward" ? v.rank : maxRank - v.rank,
    }));

    const growStart = lastRiseEnd + ENTRY.growDelay;
    let growEnd = growStart;

    // lens blooms back in the moment the grow begins
    tl.to(
      focusState,
      { lensFx: 1, duration: ENTRY.lensBloom, ease: ENTRY.lensBloomEase },
      growStart,
    );

    growRanked.forEach((o) => {
      const at = growStart + o.rank * ENTRY.growStagger;
      growEnd = Math.max(growEnd, at + ENTRY.growDuration);
      tl.to(
        growArr,
        { [o.idx]: 1, duration: ENTRY.growDuration, ease: ENTRY.growEase },
        at,
      );
    });
    // hand off to the normal full-size carousel
    tl.call(
      () => {
        entrySettled = false;
        for (let k = 0; k < growArr.length; k++) growArr[k] = 1;
        onEntryDone(true);
      },
      null,
      growEnd,
    );
    entryAnim = tl;
  }

  el.addEventListener("wheel", onWheel, { passive: false });
  el.addEventListener("pointerdown", onPointerDown);
  el.addEventListener("pointermove", onPointerMove);
  el.addEventListener("pointerup", onPointerUp);
  el.addEventListener("pointercancel", onPointerUp);
  el.addEventListener("pointerleave", onLeave);
  el.addEventListener("click", onClick);

  // ---- animation loop ----
  let raf = 0;
  function tick() {
    raf = 0;

    // Settle-snap: once input goes quiet, guide the existing target toward the
    // closest card centre. This avoids replacing the target in one visible jump.
    if (
      CONFIG.SNAP &&
      snapArmed &&
      !focusState.active &&
      Math.abs(target - scroll) < CONFIG.SNAP_DIST &&
      performance.now() - lastWheelAt >
        CONFIG.SNAP_DELAY * (0.45 + 0.55 * scrollEnergy)
    ) {
      snapTarget = centerForIndex(nearestIndex(target));
      snapArmed = false;
    }

    if (snapTarget !== null && !focusState.active) {
      const settleStrength =
        CONFIG.SNAP_STRENGTH +
        (1 - scrollEnergy) * CONFIG.SNAP_IDLE_BOOST;
      target += (snapTarget - target) * settleStrength;
      if (Math.abs(snapTarget - target) < 0.2) {
        target = snapTarget;
        snapTarget = null;
      }
    }

    scroll += (target - scroll) * CONFIG.EASE;

    // tell the host which image is centered (overlay text)
    const ci = centerIndex(scroll);
    if (ci !== lastCenter) {
      lastCenter = ci;
      onActiveChange(ci);
    }

    // scroll speed -> energy 0..1, drives the panel shrink. Attack fast when
    // speeding up, decay slow when settling.
    const rawSpeed = scroll - prevScroll;
    prevScroll = scroll;
    const norm = Math.min(
      1,
      Math.abs(rawSpeed) / Math.max(1, CONFIG.SHRINK_MAX),
    );
    const recovery =
      CONFIG.SHRINK_DECAY +
      (1 - scrollEnergy) * CONFIG.SHRINK_IDLE_DECAY_BOOST;
    const k = norm > scrollEnergy ? CONFIG.SHRINK_ATTACK : recovery;
    scrollEnergy += (norm - scrollEnergy) * k;

    layout();
    syncCaseStudyOverlay();
    syncVideoPlayback();

    // lens uniforms + focus/entry fade of the distortion props
    lensUniforms.uCenter.value.set(LENS.posX, LENS.posY);
    lensUniforms.uAspect.value = W / H;
    if (LENS.fitViewport) {
      const bleed = LENS.viewportBleed ?? 0;
      lensUniforms.uSizeX.value = (W / H) * (0.5 + bleed);
      lensUniforms.uSizeY.value = 0.5 + bleed;
    } else {
      lensUniforms.uSizeX.value = LENS.sizeX;
      lensUniforms.uSizeY.value = LENS.sizeY;
    }
    lensUniforms.uShape.value = LENS.shape === "square" ? 1.0 : 0.0;
    lensUniforms.uSquareRound.value = LENS.squareRound;
    lensUniforms.uCenterShade.value = LENS.centerShade ?? 0.09;
    lensUniforms.uTime.value = performance.now() * 0.001;
    const rad = (a) => (a * Math.PI) / 180;
    lensUniforms.uRotation.value =
      rad(LENS.rotation) + rad(LENS.spin) * (performance.now() * 0.001);
    const fx = focusState.lensFx;
    LENS_FX_KEYS.forEach((key) => {
      lensUniforms[key].value = lensFxFull[key] * fx;
    });

    // Portfolio media must not be post-processed: a full-screen lens pass
    // alters video colour and gamma even when all visual controls are zero.
    // Direct rendering keeps the uploaded sRGB texture intact and avoids an
    // additional full-resolution render pass on every frame.
    if (LENS.enabled) {
      renderer.setRenderTarget(rt);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      renderer.render(lensScene, lensCam);
    } else {
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
    }

    if (!document.hidden) raf = requestAnimationFrame(tick);
  }

  function startTick() {
    if (!raf && !document.hidden) raf = requestAnimationFrame(tick);
  }

  function stopTick() {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    pauseAllVideos();
  }

  function onVisibilityChange() {
    if (document.hidden) stopTick();
    else startTick();
  }
  document.addEventListener("visibilitychange", onVisibilityChange);
  startTick();

  if (ENTRY.enabled) {
    playEntry();
  } else {
    onEntryDone(true);
  }

  // ---- resize / teardown ----
  function onResize() {
    W = mount.clientWidth;
    H = mount.clientHeight;
    renderer.setSize(W, H);
    camera.left = -W / 2;
    camera.right = W / 2;
    camera.top = H / 2;
    camera.bottom = -H / 2;
    camera.updateProjectionMatrix();
    rt.setSize(W * dpr, H * dpr);
    lensUniforms.uRes.value.set(W * dpr, H * dpr);
  }
  window.addEventListener("resize", onResize);

  function destroy() {
    stopTick();
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    el.removeEventListener("wheel", onWheel);
    el.removeEventListener("pointerdown", onPointerDown);
    el.removeEventListener("pointermove", onPointerMove);
    el.removeEventListener("pointerup", onPointerUp);
    el.removeEventListener("pointercancel", onPointerUp);
    el.removeEventListener("pointerleave", onLeave);
    el.removeEventListener("click", onClick);
    if (focusState.anim) focusState.anim.kill();
    if (entryAnim) entryAnim.kill();
    if (caseStudyOverlayEnabled) {
      caseStudyOverlayElement.dataset.active = "false";
    }
    el.style.cursor = "";
    renderer.dispose();
    rt.dispose();
    lensQuad.geometry.dispose();
    lensMat.dispose();
    pool.forEach((p) => {
      p.mesh.geometry.dispose();
      p.mat.dispose();
    });
    sources.forEach((s) => {
      if (s.video) {
        s.video.pause();
        s.video.removeAttribute("src");
        s.video.load();
      }
      const disposed = new Set();
      for (const tex of [s.videoTex, s.posterTex, s.tex]) {
        if (tex && !disposed.has(tex)) {
          tex.dispose();
          disposed.add(tex);
        }
      }
    });
    if (renderer.domElement.parentNode)
      renderer.domElement.parentNode.removeChild(renderer.domElement);
  }

  function scrollToSourceIndex(srcIndex, immediate = false) {
    userInteracted = true;
    snapTarget = null;
    snapArmed = false;
    const goal = centerForIndex(srcIndex);
    if (immediate) {
      scroll = goal;
      target = goal;
    } else {
      target = goal;
    }
  }

  function refreshLayout() {
    const old = totalWidth;
    recomputeTotal();
    if (old > 0 && totalWidth > 0 && Math.abs(old - totalWidth) > 1) {
      const ratio = totalWidth / old;
      scroll *= ratio;
      target *= ratio;
      if (snapTarget !== null) snapTarget *= ratio;
    }
  }

  return {
    closeFocus,
    replayEntry: playEntry,
    refreshLayout,
    scrollToSourceIndex,
    setClearColor(hex) {
      renderer.setClearColor(hex, 0);
    },
    lensUniforms, // exposed for the dev GUI
    destroy,
  };
}
