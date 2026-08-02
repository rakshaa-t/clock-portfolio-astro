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
import { resolveVideoPlaybackPolicy } from "./playbackPolicy.js";

let carouselInstanceCount = 0;

export function createCarousel(mount, callbacks = {}) {
  const {
    projects = [],
    initialSourceId,
    initialSourceIds,
    caseStudyOverlayElement = null,
    onActiveChange = () => {},
    onPanelSelect = onActiveChange,
    onFocusChange = () => {},
    onEntryDone = () => {},
  } = callbacks;

  if (!projects.length) {
    throw new Error("createCarousel requires a non-empty projects array");
  }

  const engineId = ++carouselInstanceCount;

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
  const pool = [];
  const fallbackTexture = new THREE.DataTexture(
    new Uint8Array([24, 24, 24, 255]),
    1,
    1,
  );
  fallbackTexture.colorSpace = THREE.SRGBColorSpace;
  fallbackTexture.needsUpdate = true;
  let bootActiveIndex = 0;
  const sources = projects.map((img, srcIndex) => {
    let resolvePosterReady;
    const s = {
      id: img.id,
      // An opaque fallback is available synchronously, so a slow poster can
      // never leave a panel transparent while its source is still pending.
      tex: fallbackTexture,
      posterTex: fallbackTexture,
      posterState: "pending",
      posterReady: new Promise((resolve) => {
        resolvePosterReady = resolve;
      }),
      videoTex: null,
      video: null,
      videoSrc: img.video || null,
      aspect: img.aspect || 1,
      locked: img.aspect != null,
      visible: false,
      videoPreloadZone: false,
      videoPlayZone: false,
      videoViewportZone: false,
      videoPlayPending: false,
      videoRetryAt: 0,
      videoReady: false,
      videoTextureApplied: false,
      activateVideoTexture: null,
      srcIndex,
    };

    const settlePoster = (state, tex = fallbackTexture) => {
      s.posterState = state;
      s.posterTex = tex;
      if (!s.videoTextureApplied) applyTexture(tex);
      resolvePosterReady();
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
      s.posterState = "ready";
      s.posterTex = tex;
      // A poster remains the visible fallback until a played video has
      // delivered an actual frame to WebGL.
      if (!s.videoTextureApplied) applyTexture(tex);
      recomputeTotal();
      // Keep the intended start panel centered while assets settle — never
      // yank back to index 0 (that was stretching the first paint).
      if (!userInteracted) {
        scroll = centerForActiveIndex(bootActiveIndex);
        target = scroll;
      }
      resolvePosterReady();
    };

    if (img.src && img.src !== img.video) {
      loader.load(img.src, onStill, undefined, () => settlePoster("error"));
    } else {
      // A video-only source still needs an opaque fallback during a fast flick.
      settlePoster("error");
    }

    if (img.video) {
      const video = document.createElement("video");
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      // Sources are still attached only for nearby panels, but once attached
      // they need enough buffer to show their first frame before entering.
      video.preload = "metadata";
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

      const activateVideoTexture = () => {
        if (!s.videoTex || s.videoTextureApplied) return;
        s.videoTextureApplied = true;
        applyTexture(s.videoTex);
      };

      s.activateVideoTexture = activateVideoTexture;

      const promoteVideoTexture = () => {
        if (s.videoReady) return;
        if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
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
        // Video-only sources have no poster to hold while their first frame
        // reaches the GPU, so use their decoded current frame immediately.
        if (!s.posterTex) activateVideoTexture();
      };

      // A decoded first frame is enough for VideoTexture. Waiting for a later
      // timeupdate can leave a hidden video on its poster indefinitely.
      video.addEventListener("loadeddata", promoteVideoTexture);
      video.addEventListener("timeupdate", promoteVideoTexture);
      video.addEventListener("playing", promoteVideoTexture);
    }

    return s;
  });

  const sourceIndexById = new Map(
    sources.map((source, index) => [source.id, index]),
  );

  function attachVideoSource(src) {
    if (!src.video || !src.videoSrc) return;
    if (src.video.src) return;
    src.video.preload = "auto";
    src.video.src = src.videoSrc;
    src.videoRetryAt = 0;
    src.video.load();
  }

  function activateVideoTextureOnFrame(src) {
    const video = src.video;
    if (!video || !src.activateVideoTexture) return;

    const activate = () => {
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        src.activateVideoTexture();
      }
    };

    if (typeof video.requestVideoFrameCallback === "function") {
      video.requestVideoFrameCallback(activate);
    } else {
      requestAnimationFrame(activate);
    }
  }

  function showPoster(src) {
    if (!src.posterTex) return;
    src.videoTextureApplied = false;
    src.tex = src.posterTex;
    for (const p of pool) {
      if (p.srcIndex === src.srcIndex && p.bound) {
        p.mat.map = src.posterTex;
        p.mat.needsUpdate = true;
      }
    }
  }

  function requestVideoPlay(src, now) {
    const video = src.video;
    if (
      !video ||
      !video.paused ||
      src.videoPlayPending ||
      now < src.videoRetryAt ||
      video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA
    ) {
      return;
    }

    src.videoPlayPending = true;
    Promise.resolve(video.play())
      .then(() => activateVideoTextureOnFrame(src))
      .catch(() => {
        // A transient decoder/autoplay rejection should not generate a promise
        // every frame. The next viewport pass can retry shortly after.
        src.videoRetryAt = performance.now() + 750;
      })
      .finally(() => {
        src.videoPlayPending = false;
      });
  }

  function syncVideoPlayback(scrollSpeed) {
    if (document.hidden) {
      pauseAllVideos();
      return;
    }

    const now = performance.now();
    // Sources begin loading well before entry, while playback stays reserved
    // for panels close to the viewport. This avoids wasting decode work on a
    // quick flick without leaving slow movement with a cold first frame.
    const ranked = activeSourceIndices
      .map((sourceIndex) => ({
        src: sources[sourceIndex],
        i: sourceIndex,
        dist: sources[sourceIndex].viewDist ?? Infinity,
      }))
      .filter((x) => x.src.video && x.src.videoPreloadZone)
      .sort((a, b) => a.dist - b.dist);

    const playSet = new Set(
      ranked
        .filter((x) => x.src.videoPlayZone)
        .map((x) => x.i),
    );
    const preloadSet = new Set(
      ranked.slice(0, CONFIG.VIDEO_MAX_PRELOAD).map((x) => x.i),
    );
    // Every on-screen tile must be attached, even when the bounded preload
    // queue is full. It can keep its poster until the loop has a real frame.
    playSet.forEach((index) => preloadSet.add(index));
    const motionPolicy = resolveVideoPlaybackPolicy({
      speed: Math.abs(scrollSpeed),
      motionPaused: videoMotionPaused,
      hidden: false,
      active: true,
      preloadEligible: false,
      playEligible: false,
      stopSpeed: CONFIG.VIDEO_PLAY_MAX_SPEED,
      resumeSpeed: CONFIG.VIDEO_PLAY_RESUME_SPEED,
    });
    videoMotionPaused = motionPolicy.motionPaused;

    sources.forEach((src, i) => {
      if (!src.video) return;
      const policy = resolveVideoPlaybackPolicy({
        speed: Math.abs(scrollSpeed),
        motionPaused: videoMotionPaused,
        hidden: false,
        active: activeSourceIndexBySource.has(i),
        preloadEligible: preloadSet.has(i),
        playEligible: playSet.has(i),
        stopSpeed: CONFIG.VIDEO_PLAY_MAX_SPEED,
        resumeSpeed: CONFIG.VIDEO_PLAY_RESUME_SPEED,
      });
      if (policy.shouldPreload) {
        attachVideoSource(src);
      }
      if (policy.showPoster) showPoster(src);
      if (policy.shouldPlay) {
        requestVideoPlay(src, now);
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

  // Active source layout is independent from the persistent source registry.
  // This is what makes a filter change a positioning operation, not a scene
  // teardown/rebuild.
  let activeSourceIndices = [];
  let activeSourceIndexBySource = new Map();
  const sourceIds = Array.isArray(initialSourceIds)
    ? initialSourceIds
    : sources.map((source) => source.id);

  function sourceIndicesForIds(ids) {
    const seen = new Set();
    const result = [];
    for (const id of ids) {
      const index = sourceIndexById.get(id);
      if (index !== undefined && !seen.has(index)) {
        seen.add(index);
        result.push(index);
      }
    }
    return result;
  }

  function setActiveSourceIndices(nextIndices) {
    activeSourceIndices = nextIndices;
    activeSourceIndexBySource = new Map(
      activeSourceIndices.map((sourceIndex, activeIndex) => [sourceIndex, activeIndex]),
    );
  }

  // cumulative x of each active source's slot, and the total loop width
  let offsets = [];
  let totalWidth = 0;
  function recomputeTotal() {
    offsets = [];
    let acc = 0;
    for (const sourceIndex of activeSourceIndices) {
      offsets.push(acc);
      acc += slotWidth(sourceIndex);
    }
    totalWidth = acc;
  }
  const initialActiveSources = sourceIndicesForIds(sourceIds);
  setActiveSourceIndices(
    initialActiveSources.length ? initialActiveSources : [0],
  );
  recomputeTotal();
  bootActiveIndex = Math.max(
    0,
    activeSourceIndexBySource.get(sourceIndexById.get(initialSourceId)) ?? 0,
  );

  // Scroll value that puts an active layout index dead-center. idx is
  // unbounded so focus/click can aim at an exact copy in the repeated row.
  function centerForActiveIndex(idx) {
    const N = activeSourceIndices.length;
    const loop = Math.floor(idx / N);
    const activeIndex = ((idx % N) + N) % N;
    const sourceIndex = activeSourceIndices[activeIndex];
    return (
      offsets[activeIndex] +
      slotWidth(sourceIndex) / 2 -
      CONFIG.GAP / 2 +
      loop * totalWidth
    );
  }

  // Integer active-layout index (including loop) closest to `value`.
  function nearestActiveIndex(value) {
    if (!totalWidth) return 0;
    const N = activeSourceIndices.length;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < N; i++) {
      const center =
        offsets[i] + slotWidth(activeSourceIndices[i]) / 2 - CONFIG.GAP / 2;
      const k = Math.round((value - center) / totalWidth);
      const dist = Math.abs(center + k * totalWidth - value);
      if (dist < bestDist) {
        bestDist = dist;
        best = i + k * N;
      }
    }
    return best;
  }

  // Which active layout index is closest to screen center.
  function centerActiveIndex(value) {
    if (!totalWidth) return 0;
    let bestI = 0;
    let bestDist = Infinity;
    for (let i = 0; i < activeSourceIndices.length; i++) {
      const center =
        offsets[i] + slotWidth(activeSourceIndices[i]) / 2 - CONFIG.GAP / 2;
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
  let scroll = centerForActiveIndex(bootActiveIndex); // start on the selected project
  let target = scroll; // desired
  let userInteracted = false; // true once the user scrolls (stops auto-recenter)
  let prevScroll = 0;
  let scrollEnergy = 0; // smoothed 0..1 scroll activity, drives panel shrink
  let lastWheelAt = 0;
  let snapArmed = false; // wheel input arms the settle-snap; it fires once
  let snapTarget = null;
  let drag = null;
  let suppressClick = false;

  // ---- liquid-glass lens: optional FBO + fullscreen pass ----
  const dpr = renderer.getPixelRatio();
  const lensEnabled = LENS.enabled;
  // Direct rendering is intentional for colour-accurate portfolio media.
  // Keep the optional lens target at 1x1 while off rather than reserving a
  // retina-sized framebuffer for a pass that never runs.
  let rt = new THREE.WebGLRenderTarget(
    lensEnabled ? W * dpr : 1,
    lensEnabled ? H * dpr : 1,
  );
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

  function layout(videoPreloadDistance = CONFIG.VIDEO_PRELOAD_DISTANCE) {
    panelRects = [];
    centeredPanel = null;
    let centeredDist = Infinity;
    for (const src of sources) {
      src.visible = false;
      src.viewDist = Infinity;
      src.videoPreloadZone = false;
      src.videoPlayZone = false;
      src.videoViewportZone = false;
    }
    const half = W / 2;
    const buffer = CONFIG.PANEL_H; // generous horizontal buffer
    pool.forEach((p, poolIdx) => {
      const rep = Math.floor(poolIdx / sources.length);
      const i = p.srcIndex;
      const src = sources[i];
      const activeIndex = activeSourceIndexBySource.get(i);
      if (activeIndex === undefined) {
        p.mesh.visible = false;
        lastCenterX[poolIdx] = undefined;
        return;
      }

      // slot center within one loop, shifted by scroll, wrapped, then pushed
      // out by this pool entry's repetition rung
      const slotCenterInLoop =
        offsets[activeIndex] + slotWidth(i) / 2 - CONFIG.GAP / 2;
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
        const cSrc = centerActiveIndex(scroll);
        let di = activeIndex - cSrc;
        if (di > activeSourceIndices.length / 2) di -= activeSourceIndices.length;
        if (di < -activeSourceIndices.length / 2) di += activeSourceIndices.length;
        const N = activeSourceIndices.length;
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
              (sources[activeSourceIndices[sa]].aspect * slotH(sa) +
                sources[activeSourceIndices[sb]].aspect * slotH(sb)) /
                2 +
              CONFIG.GAP;
          }
        } else if (di < 0) {
          for (let k = 0; k < -di; k++) {
            const sa = (((cSrc - k) % N) + N) % N;
            const sb = (((cSrc - k - 1) % N) + N) % N;
            off -=
              (sources[activeSourceIndices[sa]].aspect * slotH(sa) +
                sources[activeSourceIndices[sb]].aspect * slotH(sb)) /
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

      const panelLeft = finalX - finalW / 2;
      const panelRight = finalX + finalW / 2;
      src.videoPreloadZone ||=
        panelRight > -half - videoPreloadDistance &&
        panelLeft < half + videoPreloadDistance;
      src.videoPlayZone ||=
        panelRight > -half - CONFIG.VIDEO_PLAY_DISTANCE &&
        panelLeft < half + CONFIG.VIDEO_PLAY_DISTANCE;
      src.videoViewportZone ||= panelRight > -half && panelLeft < half;

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
    const dominantDelta =
      Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    const normalizedDelta =
      e.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? dominantDelta * 16
        : e.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? dominantDelta * H
          : dominantDelta;
    target += normalizedDelta * CONFIG.WHEEL;
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
    target = centerForActiveIndex(nearestActiveIndex(scroll + hit.centerX));
    onPanelSelect(sources[hit.srcIndex].id);
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
    target = centerForActiveIndex(nearestActiveIndex(scroll));

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
    target = centerForActiveIndex(nearestActiveIndex(scroll));
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
    const cSrcG = centerActiveIndex(scroll);
    const poolSourceCount = sources.length;
    const Ng = activeSourceIndices.length;
    const midRepG = Math.floor(REPEATS / 2);
    const growList = [];
    let maxRank = 0;
    for (let k = 0; k < lastCenterX.length; k++) {
      if (lastCenterX[k] === undefined) continue;
      if (Math.floor(k / poolSourceCount) !== midRepG) continue;
      const sourceIndex = k % poolSourceCount;
      const activeIndex = activeSourceIndexBySource.get(sourceIndex);
      if (activeIndex === undefined) continue;
      let di = activeIndex - cSrcG;
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
  let videoMotionPaused = false;
  let previousFrameAt = performance.now();

  // Convert a 60fps follow amount to the equivalent amount for this frame.
  // Fixed per-frame interpolation settles differently on 60Hz and 120Hz
  // displays and visibly lags after a dropped frame.
  function frameAdjusted(amount, frameDuration) {
    return 1 - Math.pow(1 - amount, frameDuration / (1000 / 60));
  }

  function tick(frameAt) {
    raf = 0;
    const frameDuration = Math.min(
      100,
      Math.max(1, (frameAt ?? performance.now()) - previousFrameAt),
    );
    previousFrameAt = frameAt ?? performance.now();

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
      snapTarget = centerForActiveIndex(nearestActiveIndex(target));
      snapArmed = false;
    }

    if (snapTarget !== null && !focusState.active) {
      const settleStrength =
        CONFIG.SNAP_STRENGTH +
        (1 - scrollEnergy) * CONFIG.SNAP_IDLE_BOOST;
      target +=
        (snapTarget - target) *
        frameAdjusted(settleStrength, frameDuration);
      if (Math.abs(snapTarget - target) < 0.2) {
        target = snapTarget;
        snapTarget = null;
      }
    }

    scroll +=
      (target - scroll) * frameAdjusted(CONFIG.EASE, frameDuration);

    // tell the host which image is centered (overlay text)
    const ci = centerActiveIndex(scroll);
    if (ci !== lastCenter) {
      lastCenter = ci;
      onActiveChange(sources[activeSourceIndices[ci]].id);
    }

    // scroll speed -> energy 0..1, drives the panel shrink. Attack fast when
    // speeding up, decay slow when settling.
    const rawSpeed = scroll - prevScroll;
    prevScroll = scroll;
    const scrollSpeed = (Math.abs(rawSpeed) / frameDuration) * 1000;
    const norm = Math.min(
      1,
      Math.abs(rawSpeed) / Math.max(1, CONFIG.SHRINK_MAX),
    );
    const recovery =
      CONFIG.SHRINK_DECAY +
      (1 - scrollEnergy) * CONFIG.SHRINK_IDLE_DECAY_BOOST;
    const k = norm > scrollEnergy ? CONFIG.SHRINK_ATTACK : recovery;
    scrollEnergy +=
      (norm - scrollEnergy) * frameAdjusted(k, frameDuration);

    const videoPreloadDistance = Math.min(
      CONFIG.VIDEO_PRELOAD_MAX_DISTANCE,
      CONFIG.VIDEO_PRELOAD_DISTANCE +
        scrollSpeed * CONFIG.VIDEO_PRELOAD_LEAD_TIME,
    );
    layout(videoPreloadDistance);
    syncCaseStudyOverlay();
    syncVideoPlayback(scrollSpeed);

    if (lensEnabled) {
      // Lens uniforms + focus/entry fade of the distortion props.
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
    }

    // Portfolio media must not be post-processed: a full-screen lens pass
    // alters video colour and gamma even when all visual controls are zero.
    // Direct rendering keeps the uploaded sRGB texture intact and avoids an
    // additional full-resolution render pass on every frame.
    if (lensEnabled) {
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
    if (lensEnabled) {
      rt.setSize(W * dpr, H * dpr);
      lensUniforms.uRes.value.set(W * dpr, H * dpr);
    }
  }
  window.addEventListener("resize", onResize);

  function destroy() {
    filterGeneration += 1;
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
    if (window.__showcaseCarouselDiagnostics === getDiagnostics) {
      delete window.__showcaseCarouselDiagnostics;
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
        if (tex && tex !== fallbackTexture && !disposed.has(tex)) {
          tex.dispose();
          disposed.add(tex);
        }
      }
    });
    fallbackTexture.dispose();
    if (renderer.domElement.parentNode)
      renderer.domElement.parentNode.removeChild(renderer.domElement);
  }

  let filterGeneration = 0;

  function scrollToSourceId(sourceId, immediate = false) {
    const sourceIndex = sourceIndexById.get(sourceId);
    const activeIndex = activeSourceIndexBySource.get(sourceIndex);
    if (activeIndex === undefined) return;
    userInteracted = true;
    snapTarget = null;
    snapArmed = false;
    const goal = centerForActiveIndex(activeIndex);
    if (immediate) {
      scroll = goal;
      target = goal;
    } else {
      target = goal;
    }
  }

  function setFilter({ sourceIds: nextSourceIds, selectedSourceId } = {}) {
    const nextIndices = sourceIndicesForIds(nextSourceIds ?? []);
    if (!nextIndices.length) return Promise.resolve(false);
    userInteracted = true;
    const generation = ++filterGeneration;

    const sameLayout =
      nextIndices.length === activeSourceIndices.length &&
      nextIndices.every((sourceIndex, index) => sourceIndex === activeSourceIndices[index]);
    if (sameLayout) {
      if (selectedSourceId) scrollToSourceId(selectedSourceId, false);
      return Promise.resolve(true);
    }

    const currentSourceIndex = activeSourceIndices[centerActiveIndex(scroll)];
    return Promise.all(nextIndices.map((sourceIndex) => sources[sourceIndex].posterReady)).then(
      () => {
        if (generation !== filterGeneration) return false;

        const nextSet = new Set(nextIndices);
        sources.forEach((source, sourceIndex) => {
          if (nextSet.has(sourceIndex) || !source.video) return;
          if (!source.video.paused) source.video.pause();
          showPoster(source);
        });

        setActiveSourceIndices(nextIndices);
        recomputeTotal();
        const selectedIndex = sourceIndexById.get(selectedSourceId);
        const targetSourceIndex = activeSourceIndexBySource.has(selectedIndex)
          ? selectedIndex
          : activeSourceIndexBySource.has(currentSourceIndex)
            ? currentSourceIndex
            : activeSourceIndices[0];
        const targetActiveIndex = activeSourceIndexBySource.get(targetSourceIndex);
        scroll = centerForActiveIndex(targetActiveIndex);
        target = scroll;
        userInteracted = true;
        snapTarget = null;
        snapArmed = false;
        lastCenter = -1;
        layout();
        return true;
      },
    );
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

  function getDiagnostics() {
    return {
      engineId,
      activeSourceIds: activeSourceIndices.map((sourceIndex) => sources[sourceIndex].id),
      visiblePanels: pool
        .filter((panel) => panel.mesh.visible)
        .map((panel) => ({
          sourceId: sources[panel.srcIndex].id,
          hasTexture: Boolean(panel.mat.map),
        })),
      sources: sources.map((source) => ({
        id: source.id,
        active: activeSourceIndexBySource.has(source.srcIndex),
        visible: source.visible,
        posterState: source.posterState,
        posterRenderable: Boolean(source.posterTex),
        displayingPoster: source.tex === source.posterTex,
        hasVideo: Boolean(source.video),
        videoReady: source.videoReady,
        inViewport: source.videoViewportZone,
        playing: Boolean(source.video && !source.video.paused),
        currentTime: source.video?.currentTime ?? 0,
      })),
    };
  }

  const diagnosticsKey = "__showcaseCarouselDiagnostics";
  if (import.meta.env?.DEV) {
    window[diagnosticsKey] = getDiagnostics;
  }

  return {
    closeFocus,
    replayEntry: playEntry,
    refreshLayout,
    scrollToSourceId,
    setFilter,
    setClearColor(hex) {
      renderer.setClearColor(hex, 0);
    },
    lensUniforms, // exposed for the dev GUI
    destroy,
  };
}
