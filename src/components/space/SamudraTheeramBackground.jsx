'use client';

import { useEffect, useRef, useState } from 'react';

// ═══════════════════════════════════════════════════════════════════
// Ocean shader — ported from the .idea/ reference (CodePen-style
// raymarched 24hr day/night ocean), wired to loop infinitely instead
// of a single dawn→storm pass.
// ═══════════════════════════════════════════════════════════════════

const VS = `
attribute vec2 a;
void main() {
  gl_Position = vec4(a, 0.0, 1.0);
}
`;

const FS = `
precision highp float;

// ── ANGLE/DIRECTX SAFETY PATCHES ──
// Raw pow()/smoothstep() with out-of-domain inputs silently outputs NaN
// (black screen) on Windows/ANGLE while working fine on macOS/OpenGL.
float safe_pow(float a, float b) { return pow(max(a, 1e-6), b); }
vec2 safe_pow(vec2 a, vec2 b) { return pow(max(a, vec2(1e-6)), b); }
vec3 safe_pow(vec3 a, vec3 b) { return pow(max(a, vec3(1e-6)), b); }
#define pow safe_pow

float safe_smoothstep(float e0, float e1, float x) {
  if (e0 > e1) return 1.0 - smoothstep(e1, e0, x);
  return smoothstep(e0, e1, x);
}
#define smoothstep safe_smoothstep
// ──────────────────────────────────

uniform vec2  uR;
uniform float uT, uS, uSc, uBl;

#define PI 3.14159265359
#define MARCH_STEPS 22
#define REFINE_STEPS 5

float sat(float x) {
  return clamp(x, 0.0, 1.0);
}

// 5 named scene stops (DAWN, MIDDAY, DUSK, NIGHT, STORM), wrapping
// STORM back into DAWN so the cycle repeats forever.
vec3 sCol(vec3 c0, vec3 c1, vec3 c2, vec3 c3, vec3 c4) {
  int si = int(uSc);
  vec3 a = c0;
  vec3 b = c1;
  if (si == 1) { a = c1; b = c2; }
  else if (si == 2) { a = c2; b = c3; }
  else if (si == 3) { a = c3; b = c4; }
  else if (si == 4) { a = c4; b = c0; }
  return mix(a, b, uBl);
}

float sF(float c0, float c1, float c2, float c3, float c4) {
  int si = int(uSc);
  float a = c0;
  float b = c1;
  if (si == 1) { a = c1; b = c2; }
  else if (si == 2) { a = c2; b = c3; }
  else if (si == 3) { a = c3; b = c4; }
  else if (si == 4) { a = c4; b = c0; }
  return mix(a, b, uBl);
}

// Same 5-stop cyclic blend as sF, but with an explicit blend factor —
// used with an eased (zero-velocity-at-each-stop) factor for the camera
// so motion doesn't kink at every scene boundary, only at the wrap.
float sF(float c0, float c1, float c2, float c3, float c4, float blv) {
  int si = int(uSc);
  float a = c0;
  float b = c1;
  if (si == 1) { a = c1; b = c2; }
  else if (si == 2) { a = c2; b = c3; }
  else if (si == 3) { a = c3; b = c4; }
  else if (si == 4) { a = c4; b = c0; }
  return mix(a, b, blv);
}

float smoother(float x) {
  x = clamp(x, 0.0, 1.0);
  return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

mat2 rot(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c);
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float waveH(vec2 p, float t, float amp, float storm) {
  float h = 0.0;

  vec2 swell1 = normalize(vec2(1.0, 0.28));
  vec2 swell2 = normalize(vec2(-0.48, 0.88));
  vec2 swell3 = normalize(vec2(0.82, -0.16));

  swell2 = rot(storm * 0.18) * swell2;
  swell3 = rot(-storm * 0.14) * swell3;

  float d1 = dot(p, swell1);
  float d2 = dot(p, swell2);
  float d3 = dot(p, swell3);

  h += amp * 0.66 * sin(d1 * 0.42 + t * 0.38);
  h += amp * 0.22 * sin(d1 * 0.94 - t * 0.62);
  h += amp * 0.14 * sin(d2 * 1.18 - t * 0.82);
  h += amp * 0.09 * sin(d3 * 1.82 + t * 1.04);

  h += amp * (0.11 + storm * 0.07) * sin(p.x * 1.45 - t * 0.76 + p.y * 0.66);
  h += amp * (0.07 + storm * 0.05) * sin(p.x * 2.85 + t * 1.06 - p.y * 0.52);
  h += amp * (0.04 + storm * 0.03) * sin(p.x * 4.60 - t * 1.50 + p.y * 1.02);

  float micro = noise(p * 14.0 + vec2(t * 0.18, t * 0.06)) - 0.5;
  h += micro * amp * (0.010 + storm * 0.008);

  return h;
}

vec3 waveNorm(vec2 p, float t, float amp, float storm) {
  float e = 0.018;
  float hL = waveH(p - vec2(e, 0.0), t, amp, storm);
  float hR = waveH(p + vec2(e, 0.0), t, amp, storm);
  float hD = waveH(p - vec2(0.0, e), t, amp, storm);
  float hU = waveH(p + vec2(0.0, e), t, amp, storm);
  return normalize(vec3(-(hR - hL) / (2.0 * e), 1.0, -(hU - hD) / (2.0 * e)));
}

float starField(vec2 uv) {
  vec2 gv = floor(uv);
  vec2 lv = fract(uv) - 0.5;

  float h = hash(gv);
  float size = mix(0.012, 0.0025, h);
  float d = length(lv + vec2(hash(gv + 3.1) - 0.5, hash(gv + 7.3) - 0.5) * 0.25);
  float star = smoothstep(size, 0.0, d);
  star *= smoothstep(0.82, 1.0, h);
  return star;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - uR * 0.5) / uR.y;

  float s = uS;

  // Per-scene stops (not a raw 0..1 mix) so these stay continuous across
  // the STORM→DAWN wrap of the infinite loop — a plain mix(a, b, s) snaps
  // back to its start value the instant s wraps from ~1 to 0, which was
  // making the horizon visibly jump at the end of every cycle. The blend
  // itself is eased (zero velocity at each scene stop) so motion doesn't
  // kink at every scene boundary either — only the position needs to
  // land on the same stop each time, not the speed of approach.
  float blEase = smoother(uBl);
  float camY = sF(1.14, 1.12, 1.09, 1.05, 1.00, blEase);
  camY += sin(s * PI * 2.0) * 0.028;
  float camZ = sF(0.08, 0.00, -0.06, -0.12, -0.18, blEase);
  float pitch = sF(-0.075, -0.065, -0.058, -0.050, -0.045, blEase);

  vec3 ro = vec3(0.0, camY, camZ);
  vec3 rd = normalize(vec3(uv.x, uv.y - pitch, -1.4));

  float storm = smoothstep(0.80, 1.0, s);
  float night = smoothstep(0.56, 0.84, s);

  vec3 skyTop = sCol(
    vec3(0.18, 0.06, 0.24),
    vec3(0.05, 0.24, 0.68),
    vec3(0.26, 0.06, 0.04),
    vec3(0.04, 0.06, 0.16),
    vec3(0.04, 0.05, 0.09)
  );

  vec3 skyHori = sCol(
    vec3(0.92, 0.48, 0.18),
    vec3(0.42, 0.62, 0.90),
    vec3(0.88, 0.32, 0.04),
    vec3(0.10, 0.14, 0.30),
    vec3(0.15, 0.17, 0.23)
  );

  vec3 sunCol = sCol(
    vec3(1.0, 0.62, 0.22),
    vec3(1.0, 0.96, 0.80),
    vec3(1.0, 0.38, 0.05),
    vec3(0.70, 0.75, 0.94),
    vec3(0.26, 0.28, 0.34)
  );

  vec3 seaDeep = sCol(
    vec3(0.08, 0.05, 0.12),
    vec3(0.03, 0.14, 0.34),
    vec3(0.10, 0.06, 0.04),
    vec3(0.03, 0.06, 0.14),
    vec3(0.03, 0.04, 0.07)
  );

  vec3 seaShlo = sCol(
    vec3(0.28, 0.17, 0.24),
    vec3(0.09, 0.38, 0.60),
    vec3(0.24, 0.13, 0.06),
    vec3(0.08, 0.15, 0.28),
    vec3(0.07, 0.10, 0.14)
  );

  vec3 fogCol = sCol(
    vec3(0.80, 0.50, 0.30),
    vec3(0.58, 0.72, 0.90),
    vec3(0.70, 0.28, 0.05),
    vec3(0.06, 0.10, 0.20),
    vec3(0.12, 0.14, 0.18)
  );

  float sunProgress = clamp(s / 0.58, 0.0, 1.0);
  float sunAngle = sunProgress * PI;
  float sunArcX = cos(sunAngle) * -0.75;
  float sunArcY = sin(sunAngle) * 0.38 - 0.08;

  vec3 sunDir = normalize(vec3(sunArcX, sunArcY, -1.0));

  float waveAmp = sF(0.082, 0.070, 0.100, 0.054, 0.30);
  waveAmp += storm * 0.020;

  float fogDen = sF(0.020, 0.010, 0.022, 0.034, 0.046);

  float sunAbove = step(0.0, sunDir.y);
  float sunGlow = smoothstep(-0.10, 0.06, sunDir.y);

  vec3 col;

  if (rd.y < 0.0) {
    float tFlat = ro.y / (-rd.y);
    float stepSize = tFlat / float(MARCH_STEPS);
    float t = stepSize;

    for (int i = 0; i < MARCH_STEPS; i++) {
      vec2 wpTest = ro.xz + rd.xz * t;
      float wy = ro.y + rd.y * t;
      if (wy < waveH(wpTest, uT, waveAmp, storm)) break;
      t += stepSize;
    }

    float ta = t - stepSize;
    float tb = t;

    for (int i = 0; i < REFINE_STEPS; i++) {
      float tm = (ta + tb) * 0.5;
      vec2 wpm = ro.xz + rd.xz * tm;
      if (ro.y + rd.y * tm < waveH(wpm, uT, waveAmp, storm)) tb = tm;
      else ta = tm;
    }

    t = (ta + tb) * 0.5;

    vec2 wp = ro.xz + rd.xz * t;
    vec3 n = waveNorm(wp, uT, waveAmp, storm);
    vec3 vDir = -rd;

    float fres = pow(1.0 - clamp(dot(n, vDir), 0.0, 1.0), 4.0);

    vec3 refl = reflect(rd, n);
    float rh = clamp(refl.y, 0.0, 1.0);

    vec3 reflSky = mix(skyHori, skyTop, pow(rh, 0.42));
    reflSky = mix(reflSky, skyHori, 0.12);

    float rSun = max(dot(refl, sunDir), 0.0);
    reflSky += sunCol * pow(rSun, 120.0) * 2.0 * sunGlow;
    reflSky += sunCol * pow(rSun, 18.0) * 0.07 * sunGlow;

    float depth = exp(-t * 0.40);
    vec3 waterC = mix(seaDeep, seaShlo, depth * 0.5);

    vec3 absorb = vec3(0.85, 0.92, 1.0);
    waterC *= mix(vec3(1.0), absorb, clamp(t * 0.25, 0.0, 1.0));

    col = mix(waterC, reflSky, 0.15 + fres * 0.34);

    float spec = pow(max(dot(reflect(-sunDir, n), vDir), 0.0), 200.0);
    col += sunCol * spec * 1.10 * sunAbove;

    float broadSpec = pow(max(dot(reflect(-sunDir, n), vDir), 0.0), 32.0);
    col += sunCol * broadSpec * 0.12 * sunGlow;

    float sunLine = pow(max(dot(reflect(rd, n), sunDir), 0.0), 8.0);
    col += sunCol * sunLine * 0.48 * smoothstep(0.0, 0.35, -rd.y) * sunGlow;

    float sparkle = noise(wp * 18.0 + vec2(uT * 0.55, uT * 0.22));
    sparkle = smoothstep(0.94, 1.0, sparkle);
    col += sunCol * sparkle * 0.08 * sunGlow * sunAbove;

    float hC = waveH(wp, uT, waveAmp, storm);
    float hL = waveH(wp - vec2(0.025, 0.0), uT, waveAmp, storm);
    float hR = waveH(wp + vec2(0.025, 0.0), uT, waveAmp, storm);
    float hD = waveH(wp - vec2(0.0, 0.025), uT, waveAmp, storm);
    float hU = waveH(wp + vec2(0.0, 0.025), uT, waveAmp, storm);

    float curvature = hR + hL + hU + hD - 4.0 * hC;
    float foam = clamp(curvature * (24.0 + storm * 10.0), 0.0, 1.0);
    col += foam * vec3(1.0) * (0.03 + storm * 0.10);

    float fog = 1.0 - exp(-t * fogDen * 1.65);
    col = mix(col, fogCol, fog);
  } else {
    float h = clamp(rd.y, 0.0, 1.0);
    col = mix(skyHori, skyTop, pow(h, 0.38));
  }

  float horizonW = 0.008;
  float skyMix = smoothstep(-horizonW, horizonW, rd.y);

  vec3 skyCol;
  {
    float h = clamp(rd.y, 0.0, 1.0);
    skyCol = mix(skyHori, skyTop, pow(h, 0.38));

    float cloudBand = noise(rd.x * 5.5 + vec2(rd.y * 3.0, uT * 0.015));
    float cloudBand2 = noise(rd.x * 8.0 - vec2(rd.y * 4.0, uT * 0.010));
    float clouds = smoothstep(0.62, 0.86, cloudBand * 0.65 + cloudBand2 * 0.35);
    clouds *= smoothstep(-0.02, 0.24, rd.y);
    clouds *= 0.08 + storm * 0.18;

    vec3 cloudCol = mix(
      vec3(1.0, 0.82, 0.65),
      vec3(0.42, 0.48, 0.56),
      storm
    );

    skyCol = mix(skyCol, mix(skyCol * 0.97, cloudCol, 0.35), clouds);

    float sd = max(dot(rd, sunDir), 0.0);
    skyCol += sunCol * pow(sd, 900.0) * 4.5 * sunGlow;
    skyCol += sunCol * pow(sd, 40.0)  * 0.14 * sunGlow;
    skyCol += sunCol * pow(sd, 8.0)   * 0.06 * sunGlow;

    float sunDisk = smoothstep(0.99975, 0.999995, dot(rd, sunDir));
    skyCol += sunCol * sunDisk * 2.0 * sunGlow;

    float horizonBand = exp(-abs(rd.y) * 24.0);
    skyCol += sunCol * horizonBand * 0.11 * sunGlow;

    float viewSun = max(dot(rd, sunDir), 0.0);
    skyCol += sunCol * pow(viewSun, 3.0) * 0.035 * sunGlow;

    if (night > 0.02) {
      vec2 starUv = rd.xy / max(0.12, rd.z + 1.6);
      starUv *= 140.0;
      float stars = starField(starUv) + starField(starUv * 0.55 + 11.7) * 0.65;
      stars *= smoothstep(0.02, 0.26, rd.y);
      stars *= (1.0 - storm * 0.85);
      skyCol += vec3(0.80, 0.88, 1.0) * stars * night * 0.82;
    }

    float horizonMist = exp(-abs(rd.y) * mix(38.0, 22.0, storm));
    skyCol += fogCol * horizonMist * (0.09 + storm * 0.10);

    skyCol = mix(skyCol, skyCol * vec3(0.91, 0.94, 0.98), storm * 0.22);
  }

  col = mix(col, skyCol, skyMix);

  float hEdge = smoothstep(-0.008, 0.018, rd.y);
  col = mix(fogCol, col, hEdge * 0.25 + 0.75);

  float grain = hash(gl_FragCoord.xy * 0.5 + floor(uT * 12.0)) - 0.5;
  col += grain * 0.006;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

// ═══════════════════════════════════════════════════════════════════
// Scene identity — used only to tint the HUD/player accent color.
// Order matches the shader's cyclic stops: DAWN → MIDDAY → DUSK →
// NIGHT → STORM → (wraps back to DAWN).
// ═══════════════════════════════════════════════════════════════════

export const SCENE_NAMES = ['DAWN', 'MIDDAY', 'DUSK', 'NIGHT', 'STORM'];

const SCENE_COLORS = [
  [255, 185, 80],   // DAWN   — warm gold
  [210, 235, 255],  // MIDDAY — cool sky white
  [255, 140, 70],   // DUSK   — amber-orange
  [110, 138, 225],  // NIGHT  — blue-indigo moonlight
  [180, 188, 205],  // STORM  — cold grey-white
];

const lerpColor = (a, b, t) => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
];

const getSceneColor = (si, bl) => {
  const a = SCENE_COLORS[si];
  const b = SCENE_COLORS[(si + 1) % SCENE_COLORS.length];
  return lerpColor(a, b, bl);
};

// Elements that own their own scroll/drag/wheel interaction
const SCROLL_EXCLUDE_SELECTOR =
  'input, textarea, select, [contenteditable="true"], .capsule-hud, .hud-toggle-btn, .hud-back-link';

export default function SamudraTheeramBackground() {
  const canvasRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    });

    if (!gl) {
      canvas.style.background = '#0a0a0f';
      return;
    }

    const mkShader = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(sh);
        console.error('Shader compilation failed:', info);
        setErrorMsg((prev) => (prev ? prev + '\n\n' : '') + 'Shader Error:\n' + info);
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vert = mkShader(gl.VERTEX_SHADER, VS);
    const frag = mkShader(gl.FRAGMENT_SHADER, FS);
    if (!vert || !frag) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(prog);
      console.error('Program linking failed:', info);
      setErrorMsg((prev) => (prev ? prev + '\n\n' : '') + 'Link Error:\n' + info);
      return;
    }

    gl.useProgram(prog);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.BLEND);
    gl.disable(gl.DITHER);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const ap = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(ap);
    gl.vertexAttribPointer(ap, 2, gl.FLOAT, false, 0, 0);

    const uR = gl.getUniformLocation(prog, 'uR');
    const uTi = gl.getUniformLocation(prog, 'uT');
    const uScroll = gl.getUniformLocation(prog, 'uS');
    const uScene = gl.getUniformLocation(prog, 'uSc');
    const uBlend = gl.getUniformLocation(prog, 'uBl');

    // ── Renderer config ──────────────────────────────────────────
    const N = SCENE_NAMES.length;
    const MAX_DPR = 1.5;
    const MIN_QUALITY = 0.82;
    const MAX_QUALITY = 1.0;

    let qualityScale = MAX_QUALITY;
    let resizeRAF = 0;

    // ── Infinite scroll driver ─────────────────────────────────────
    const PIXELS_PER_SCENE = 900;
    const scrollEase = 0.1;

    let posPx = 0;
    let smoothPx = 0;
    let velocity = 0;

    const resize = () => {
      resizeRAF = 0;

      const vp = window.visualViewport ?? {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      const cssW = Math.round(vp.width);
      const cssH = Math.round(vp.height);
      if (!cssW || !cssH) return;

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const renderScale = dpr * qualityScale;

      const pixelW = Math.max(1, Math.round(cssW * renderScale));
      const pixelH = Math.max(1, Math.round(cssH * renderScale));

      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;

      if (canvas.width !== pixelW || canvas.height !== pixelH) {
        canvas.width = pixelW;
        canvas.height = pixelH;
      }

      gl.viewport(0, 0, pixelW, pixelH);
      gl.uniform2f(uR, pixelW, pixelH);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const requestResize = () => {
      if (!resizeRAF) resizeRAF = requestAnimationFrame(resize);
    };

    resize();

    window.addEventListener('resize', requestResize, { passive: true });
    window.visualViewport?.addEventListener('resize', requestResize, { passive: true });

    const addVelocity = (delta) => {
      velocity += delta;
      velocity = Math.max(-520, Math.min(520, velocity));
    };

    const onWheel = (e) => {
      if (
        e.ctrlKey ||
        e.metaKey ||
        e.target.closest?.(SCROLL_EXCLUDE_SELECTOR)
      ) {
        return;
      }

      e.preventDefault();

      const linePx = 16;
      const pagePx = window.innerHeight * 0.9;
      const delta =
        e.deltaMode === 1 ? e.deltaY * linePx : e.deltaMode === 2 ? e.deltaY * pagePx : e.deltaY;

      addVelocity(delta);
    };

    let touchY = null;

    const onTouchStart = (e) => {
      if (e.target.closest?.(SCROLL_EXCLUDE_SELECTOR)) {
        touchY = null;
        return;
      }
      touchY = e.touches[0].clientY;
    };

    const onTouchMove = (e) => {
      if (touchY === null) return;
      const y = e.touches[0].clientY;
      const delta = touchY - y;
      touchY = y;
      e.preventDefault();
      addVelocity(delta * 2.2);
    };

    const onTouchEnd = () => {
      touchY = null;
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    // ── Performance adaptation ─────────────────────────────────────
    let fpsAccum = 0;
    let fpsFrames = 0;
    let lowFpsTime = 0;
    let highFpsTime = 0;

    const maybeAdjustQuality = (dt) => {
      fpsAccum += dt;
      fpsFrames++;
      if (fpsAccum < 0.75) return;

      const fps = fpsFrames / fpsAccum;
      fpsAccum = 0;
      fpsFrames = 0;

      if (fps < 50) {
        lowFpsTime += 0.75;
        highFpsTime = 0;
      } else if (fps > 57) {
        highFpsTime += 0.75;
        lowFpsTime = 0;
      } else {
        lowFpsTime = 0;
        highFpsTime = 0;
      }

      if (lowFpsTime >= 1.5 && qualityScale > MIN_QUALITY) {
        qualityScale = Math.max(MIN_QUALITY, +(qualityScale - 0.06).toFixed(2));
        lowFpsTime = 0;
        requestResize();
      }

      if (highFpsTime >= 3.0 && qualityScale < MAX_QUALITY) {
        qualityScale = Math.min(MAX_QUALITY, +(qualityScale + 0.04).toFixed(2));
        highFpsTime = 0;
        requestResize();
      }
    };

    // ── Scene accent color (tints HUD/player chrome) ────────────────
    let lastColorKey = '';
    const applySceneColor = (wrapped) => {
      const si = Math.floor(wrapped);
      const bl = wrapped - si;
      const [r, g, b] = getSceneColor(si, bl);
      const key = r + ',' + g + ',' + b;
      if (key === lastColorKey) return;
      lastColorKey = key;
      const root = document.documentElement;
      root.style.setProperty('--fg', `rgb(${key})`);
      root.style.setProperty('--fg-hud', `rgba(${key},0.8)`);
      root.style.setProperty('--fg-dot', `rgba(${key},0.3)`);
      root.style.setProperty('--fg-dotact', `rgba(${key},0.92)`);
    };

    // ── Render loop ──────────────────────────────────────────────
    const t0 = performance.now();
    let lastNow = t0;
    let animId = null;

    const frame = (now) => {
      try {
        animId = requestAnimationFrame(frame);
        const dt = Math.min((now - lastNow) / 1000, 0.05);
        lastNow = now;

        maybeAdjustQuality(dt);

        velocity *= Math.pow(0.86, dt * 60);
        if (Math.abs(velocity) < 0.02) velocity = 0;
        if (velocity !== 0) posPx += velocity * scrollEase;

        smoothPx += (posPx - smoothPx) * (1 - Math.exp(-dt * 8));

        const wrapped = (((smoothPx / PIXELS_PER_SCENE) % N) + N) % N;
        const si = Math.min(Math.floor(wrapped), N - 1);
        const bl = wrapped - si;
        const s = wrapped / N;

        applySceneColor(wrapped);

        gl.uniform1f(uTi, (now - t0) / 1000);
        gl.uniform1f(uScroll, s);
        gl.uniform1f(uScene, si);
        gl.uniform1f(uBlend, bl);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      } catch (err) {
        console.error('Render loop crash:', err);
        setErrorMsg('JS Runtime Error:\n' + err.message + '\n' + err.stack);
        if (animId) cancelAnimationFrame(animId);
      }
    };

    animId = requestAnimationFrame(frame);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (resizeRAF) cancelAnimationFrame(resizeRAF);
      window.removeEventListener('resize', requestResize);
      window.visualViewport?.removeEventListener('resize', requestResize);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <>
      {errorMsg && (
        <div style={{
          position: 'fixed', top: 0, left: 0, zIndex: 9999,
          background: 'rgba(255,0,0,0.9)', color: 'white',
          padding: '2rem', width: '100vw', height: '100vh',
          fontFamily: 'monospace', whiteSpace: 'pre-wrap', overflow: 'auto',
        }}>
          <h2>WebGL / JS Error</h2>
          {errorMsg}
        </div>
      )}
      <canvas
        ref={canvasRef}
        id="webgl_canvas"
        aria-hidden="true"
      />
    </>
  );
}
