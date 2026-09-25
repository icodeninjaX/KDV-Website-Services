import * as THREE from "three";

type Range = readonly [number, number];

export type PaperSceneOptions = {
  canvas: HTMLCanvasElement;
  atlasSrc: string;
  plateSrcs: string[];
  plateAspect: number;
  gather: Range;
  flips: readonly Range[];
  /** Fewer tiles on phones; fixed for the scene's lifetime. */
  dense: boolean;
  onContextLost?: () => void;
};

export type Layout = "wide" | "narrow";

export type PaperScene = {
  /** Resolves once the paper atlas is on the GPU (plates keep streaming in). */
  ready: Promise<void>;
  setProgress(p: number): void;
  setLayout(layout: Layout): void;
  resize(width: number, height: number): void;
  setActive(active: boolean): void;
  dispose(): void;
};

/** Aspect (w/h) of each paper in the 4×4 atlas, row-major, so slips are cut to believable shapes. */
const SLIP_ASPECT = [0.42, 0.78, 1, 0.72, 0.74, 0.8, 0.78, 1.45, 0.76, 0.86, 0.78, 0.8, 0.46, 1, 0.74, 0.8];
/** Mosaic yaw/pitch per state (paper grid, then each plate), so every reveal lands at a new angle. */
const YAW = [0, -0.2, 0.17, -0.15, 0.13];
const PITCH = [0, 0.06, -0.05, 0.05, -0.04];
const MOSAIC_W = 4;
const FOV = 30;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const vertexShader = /* glsl */ `
  attribute vec2 aCell;
  attribute float aPaper;
  attribute float aContent;
  attribute float aCurl;
  varying vec2 vUv;
  varying vec3 vN;
  varying float vFace;
  varying float vContent;
  varying float vPaper;
  varying vec2 vCell;
  varying vec2 vCrop;
  varying vec3 vWorld;
  varying float vDepth;

  void main() {
    vec3 p = position;
    // Paper curl: bow the slip along its width; flattens to 0 once it joins the grid.
    p.z += aCurl * (p.x * p.x * 4.0 - 0.5);
    #ifdef USE_INSTANCING
      mat4 inst = instanceMatrix;
    #else
      mat4 inst = mat4(1.0);
    #endif
    float sx = length(inst[0].xyz);
    float sy = length(inst[1].xyz);
    vCrop = sx < sy ? vec2(sx / sy, 1.0) : vec2(1.0, sy / sx);
    vec4 world = modelMatrix * inst * vec4(p, 1.0);
    vWorld = world.xyz;
    vN = normalize(mat3(modelMatrix) * mat3(inst) * normal);
    vFace = normal.z;
    vUv = uv;
    vContent = aContent;
    vPaper = aPaper;
    vCell = aCell;
    vec4 mv = viewMatrix * world;
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uPaper;
  uniform sampler2D uPlate0;
  uniform sampler2D uPlate1;
  uniform sampler2D uPlate2;
  uniform sampler2D uPlate3;
  uniform vec2 uGrid;
  uniform vec3 uLight;
  uniform vec3 uFog;
  uniform vec2 uFogRange;
  uniform float uSheen;
  varying vec2 vUv;
  varying vec3 vN;
  varying float vFace;
  varying float vContent;
  varying float vPaper;
  varying vec2 vCell;
  varying vec2 vCrop;
  varying vec3 vWorld;
  varying float vDepth;

  vec3 plate(float i, vec2 uv) {
    if (i < 1.5) return texture2D(uPlate0, uv).rgb;
    if (i < 2.5) return texture2D(uPlate1, uv).rgb;
    if (i < 3.5) return texture2D(uPlate2, uv).rgb;
    return texture2D(uPlate3, uv).rgb;
  }

  void main() {
    vec3 n = normalize(vN);
    float diff = max(dot(n, uLight), 0.0);
    float content = floor(vContent + 0.5);
    vec3 warm = vec3(1.0, 0.9, 0.76);
    vec3 col;

    if (abs(vFace) < 0.5) {
      // Slip edges: paper stock while loose; once it's part of a screen, the screen's own local colour.
      vec2 mid = vec2((vCell.x + 0.5) / uGrid.x, 1.0 - (vCell.y + 0.5) / uGrid.y);
      col = (content < 0.5 ? vec3(0.62, 0.6, 0.56) : plate(content, mid) * 0.7) * (0.35 + 0.65 * diff);
    } else if (content < 0.5) {
      vec2 uv = (vUv - 0.5) * vCrop + 0.5;
      vec2 cell = vec2(mod(vPaper, 4.0), floor(vPaper / 4.0));
      vec2 auv = vec2((cell.x + uv.x) / 4.0, 1.0 - (cell.y + 1.0 - uv.y) / 4.0);
      vec3 paper = texture2D(uPaper, auv).rgb;
      float spec = pow(max(dot(reflect(-uLight, n), vec3(0.0, 0.0, 1.0)), 0.0), 24.0) * 0.08;
      col = paper * (0.16 + 0.9 * diff * warm) + spec;
    } else {
      vec2 suv = vec2((vCell.x + vUv.x) / uGrid.x, 1.0 - (vCell.y + 1.0 - vUv.y) / uGrid.y);
      col = plate(content, suv) * (0.86 + 0.14 * diff);
      // A single glint sweeps across the glass after each reveal.
      float band = (vWorld.x * 0.8 + vWorld.y * 0.6) - uSheen;
      col += exp(-band * band * 6.0) * 0.1;
    }

    float fog = smoothstep(uFogRange.x, uFogRange.y, vDepth);
    col = mix(col, uFog, fog);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

const backdropFragment = /* glsl */ `
  uniform float uPhase;
  uniform vec3 uBase;
  uniform vec2 uCenter;
  uniform float uAspect;
  varying vec2 vUv;
  void main() {
    vec2 d = (vUv - uCenter) * vec2(uAspect, 1.0) * 0.9;
    float glow = exp(-dot(d, d) * 9.0);
    // Warm desk-lamp pool while it's paper; the brand indigo once it's a system.
    vec3 lamp = vec3(0.09, 0.05, 0.018);
    vec3 indigo = vec3(0.045, 0.04, 0.2);
    vec3 col = uBase + mix(lamp, indigo, uPhase) * glow;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

export function createPaperScene(opts: PaperSceneOptions): PaperScene {
  const { canvas, dense, gather, flips } = opts;
  const COLS = dense ? 30 : 18;
  const ROWS = dense ? 14 : 9;
  const COUNT = COLS * ROWS;
  const mosaicH = MOSAIC_W / opts.plateAspect;
  const tileW = MOSAIC_W / COLS;
  const tileH = mosaicH / ROWS;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setClearColor(0x080808, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 60);
  const group = new THREE.Group();
  scene.add(group);

  const baseLinear = new THREE.Color(0x080808);
  const placeholder = new THREE.DataTexture(new Uint8Array([14, 14, 18, 255]), 1, 1);
  placeholder.needsUpdate = true;

  const uniforms = {
    uPaper: { value: placeholder as THREE.Texture },
    uPlate0: { value: placeholder as THREE.Texture },
    uPlate1: { value: placeholder as THREE.Texture },
    uPlate2: { value: placeholder as THREE.Texture },
    uPlate3: { value: placeholder as THREE.Texture },
    uGrid: { value: new THREE.Vector2(COLS, ROWS) },
    uLight: { value: new THREE.Vector3(-0.45, 0.62, 0.64).normalize() },
    uFog: { value: new THREE.Vector3(baseLinear.r, baseLinear.g, baseLinear.b) },
    uFogRange: { value: new THREE.Vector2(9, 16) },
    uSheen: { value: 99 },
  };

  const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
  const geometry = new THREE.BoxGeometry(1, 1, 0.012, 8, 1, 1);
  const mesh = new THREE.InstancedMesh(geometry, material, COUNT);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  group.add(mesh);

  const aCell = new Float32Array(COUNT * 2);
  const aPaper = new Float32Array(COUNT);
  const aContent = new Float32Array(COUNT);
  const aCurl = new Float32Array(COUNT);
  const contentAttr = new THREE.InstancedBufferAttribute(aContent, 1).setUsage(THREE.DynamicDrawUsage);
  const curlAttr = new THREE.InstancedBufferAttribute(aCurl, 1).setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("aCell", new THREE.InstancedBufferAttribute(aCell, 2));
  geometry.setAttribute("aPaper", new THREE.InstancedBufferAttribute(aPaper, 1));
  geometry.setAttribute("aContent", contentAttr);
  geometry.setAttribute("aCurl", curlAttr);

  // Static per-slip data.
  const rand = mulberry32(371);
  const gridX = new Float32Array(COUNT);
  const gridY = new Float32Array(COUNT);
  const orbitR = new Float32Array(COUNT);
  const orbitA = new Float32Array(COUNT);
  const orbitW = new Float32Array(COUNT);
  const orbitY = new Float32Array(COUNT);
  const bob = new Float32Array(COUNT);
  const rot = new Float32Array(COUNT * 3);
  const spin = new Float32Array(COUNT * 3);
  const slipW = new Float32Array(COUNT);
  const slipH = new Float32Array(COUNT);
  const curl = new Float32Array(COUNT);
  const gatherDelay = new Float32Array(COUNT);
  const arc = new Float32Array(COUNT);
  const flipDelay = new Float32Array(COUNT);
  const push = new Float32Array(COUNT * 3);
  const lift = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    aCell[i * 2] = col;
    aCell[i * 2 + 1] = row;
    gridX[i] = -MOSAIC_W / 2 + (col + 0.5) * tileW;
    gridY[i] = mosaicH / 2 - (row + 0.5) * tileH;

    const paper = Math.floor(rand() * 16);
    aPaper[i] = paper;
    const h = 0.26 + Math.pow(rand(), 1.6) * 0.42;
    slipH[i] = h;
    slipW[i] = h * SLIP_ASPECT[paper];

    // A slow, flattened vortex of paper: denser toward the middle, never quite still.
    orbitR[i] = 0.35 + Math.pow(rand(), 0.8) * 2.9;
    orbitA[i] = rand() * Math.PI * 2;
    orbitW[i] = (0.05 + rand() * 0.07) * (1.25 - orbitR[i] / 4);
    orbitY[i] = (rand() - 0.5) * 3.1 * (0.55 + 0.45 * (1 - orbitR[i] / 3.3));
    bob[i] = rand() * Math.PI * 2;
    for (let k = 0; k < 3; k++) {
      rot[i * 3 + k] = (rand() - 0.5) * Math.PI * (k === 2 ? 2 : 1.4);
      spin[i * 3 + k] = (rand() - 0.5) * 0.35;
    }
    curl[i] = (rand() - 0.5) * 0.16;
    gatherDelay[i] = rand();
    arc[i] = 0.4 + rand() * 0.8;
    // Flip wave travels corner to corner, with a little jitter so it reads as paper, not a shader.
    flipDelay[i] = (col / COLS) * 0.72 + (row / ROWS) * 0.28 + (rand() - 0.5) * 0.06;
  }

  // Ledger hairlines that show through the gaps while the paper sits in its grid.
  const linePts: number[] = [];
  for (let c = 0; c <= COLS; c++) {
    const x = -MOSAIC_W / 2 + c * tileW;
    linePts.push(x, -mosaicH / 2 - 0.12, 0, x, mosaicH / 2 + 0.12, 0);
  }
  for (let r = 0; r <= ROWS; r++) {
    const y = mosaicH / 2 - r * tileH;
    linePts.push(-MOSAIC_W / 2 - 0.12, y, 0, MOSAIC_W / 2 + 0.12, y, 0);
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePts, 3));
  const lineMat = new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0, depthWrite: false });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  lines.position.z = -0.03;
  group.add(lines);

  const backdropUniforms = {
    uPhase: { value: 0 },
    uCenter: { value: new THREE.Vector2(0.5, 0.5) },
    uAspect: { value: 1 },
    uBase: { value: new THREE.Vector3(baseLinear.r, baseLinear.g, baseLinear.b) },
  };
  const backdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.ShaderMaterial({
      uniforms: backdropUniforms,
      vertexShader: /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy * 2.0, 0.0, 1.0); }`,
      fragmentShader: backdropFragment,
      depthWrite: false,
      depthTest: false,
    }),
  );
  backdrop.frustumCulled = false;
  backdrop.renderOrder = -1;
  scene.add(backdrop);

  // --- Textures -----------------------------------------------------------
  const loader = new THREE.TextureLoader();
  const prep = (t: THREE.Texture) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = maxAniso;
    t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    return t;
  };
  const owned: THREE.Texture[] = [placeholder];
  let disposed = false;
  const load = (src: string) =>
    loader.loadAsync(src).then((t) => {
      if (disposed) {
        t.dispose();
        throw new Error("disposed");
      }
      owned.push(t);
      return prep(t);
    });

  const ready = load(opts.atlasSrc).then((t) => {
    uniforms.uPaper.value = t;
    renderer.initTexture(t);
  });
  const plateKeys = ["uPlate0", "uPlate1", "uPlate2", "uPlate3"] as const;
  opts.plateSrcs.slice(0, 4).forEach((src, i) => {
    load(src)
      .then((t) => {
        t.generateMipmaps = true;
        uniforms[plateKeys[i]].value = t;
      })
      .catch(() => {});
  });

  // --- State ---------------------------------------------------------------
  let progress = 0;
  let layout: Layout = "wide";
  let width = 1;
  let height = 1;
  let active = false;
  let raf = 0;
  let last = 0;
  let time = 0;
  const pointer = new THREE.Vector2(0, 0);
  const pointerSmooth = new THREE.Vector2(0, 0);
  let pointerIn = false;
  const pointerLocal = new THREE.Vector3(99, 99, 0);
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();
  const inv = new THREE.Matrix4();

  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const qa = new THREE.Quaternion();
  const qb = new THREE.Quaternion();
  const e = new THREE.Euler();
  const pos = new THREE.Vector3();
  const scl = new THREE.Vector3();

  let baseDist = 10;
  let centerX = 0.5;
  let centerY = 0.5;

  function frame() {
    const aspect = width / height;
    const tan = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    if (layout === "wide") {
      // Mosaic lives in the right-hand column, clear of the captions.
      const fitW = MOSAIC_W / (0.48 * 2 * tan * aspect);
      const fitH = mosaicH / (0.62 * 2 * tan);
      baseDist = Math.max(fitW, fitH);
      centerX = 0.71;
      centerY = 0.5;
    } else {
      // Phones and portrait tablets: mosaic across the top, captions underneath.
      const fitW = MOSAIC_W / (0.92 * 2 * tan * aspect);
      // Short phones need the room below for captions.
      const short = height < 700;
      const fitH = mosaicH / ((short ? 0.3 : 0.36) * 2 * tan);
      baseDist = Math.max(fitW, fitH);
      centerX = 0.5;
      centerY = short ? 0.22 : 0.33;
    }
    camera.aspect = aspect;
    camera.setViewOffset(width, height, -(centerX - 0.5) * width, (0.5 - centerY) * height, width, height);
    camera.updateProjectionMatrix();
    uniforms.uFogRange.value.set(baseDist + 2.2, baseDist + 7);
    backdropUniforms.uCenter.value.set(centerX, 1 - centerY);
    backdropUniforms.uAspect.value = aspect;
  }

  function update(dt: number) {
    time += dt;
    const p = progress;
    const gT = clamp01((p - gather[0]) / (gather[1] - gather[0]));
    const gatherDone = gT >= 1;

    // Global flip state, used for camera, lines, and the backdrop.
    let fGlobal = 0;
    let sheen = 99;
    for (const [a, b] of flips) {
      fGlobal += ease(clamp01((p - a) / (b - a)));
      const s = (p - a) / (b - a + 0.08);
      if (s > 0 && s < 1) sheen = lerp(-5, 5, s);
    }
    const idx = Math.min(Math.floor(fGlobal), YAW.length - 2);
    const fr = fGlobal - idx;
    const breathe = gatherDone ? Math.sin(time * 0.35) * 0.012 : 0;
    // Narrow screens get half the angle so the near edge of the screen stays in frame.
    const tilt = layout === "wide" ? 1 : 0.5;
    group.rotation.y = lerp(YAW[idx], YAW[idx + 1], fr) * tilt + breathe;
    group.rotation.x = lerp(PITCH[idx], PITCH[idx + 1], fr) * tilt;
    uniforms.uSheen.value = sheen;
    backdropUniforms.uPhase.value = clamp01(fGlobal);
    lineMat.opacity = 0.55 * clamp01((gT - 0.7) / 0.3) * (1 - clamp01(fGlobal * 1.6));

    // Camera: drifts in through the hero, settles for the grid, eases closer on the plates.
    const approach = ease(clamp01(p / gather[1]));
    const dist = baseDist * lerp(1.22, 1, approach) * lerp(1, 0.94, clamp01(fGlobal));
    pointerSmooth.lerp(pointer, 1 - Math.exp(-dt * 3));
    camera.position.set(pointerSmooth.x * 0.35, pointerSmooth.y * 0.2, dist);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    group.updateMatrixWorld();

    // Pointer on the mosaic plane, in group space.
    let hasPointer = false;
    if (pointerIn) {
      raycaster.setFromCamera(pointer, camera);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        inv.copy(group.matrixWorld).invert();
        pointerLocal.copy(hit).applyMatrix4(inv);
        hasPointer = true;
      }
    }

    const k = 1 - Math.exp(-dt * 6);
    for (let i = 0; i < COUNT; i++) {
      // Per-slip gather timing: staggered, eased, with an arc toward the camera.
      const t = ease(clamp01((gT - gatherDelay[i] * 0.45) / 0.55));

      // Scatter pose.
      const a = orbitA[i] + time * orbitW[i];
      const r = orbitR[i];
      const sx = Math.cos(a) * r * 1.15;
      const sz = Math.sin(a) * r * 0.55 - 0.3;
      const sy = orbitY[i] + Math.sin(time * 0.6 + bob[i]) * 0.06;

      // Flip count for this slip.
      let f = 0;
      for (let j = 0; j < flips.length; j++) {
        const [fa, fb] = flips[j];
        const span = fb - fa;
        const lt = clamp01(((p - fa) / span - flipDelay[i] * 0.5) / 0.5);
        f += ease(lt);
      }
      const fl = f - Math.floor(f);
      const flipping = fl > 0.001 && fl < 0.999;
      const wave = flipping ? Math.sin(Math.PI * fl) : 0;

      // Pointer response: loose paper gets nudged away; a finished screen ripples up a touch.
      let tx = 0;
      let ty = 0;
      let tz = 0;
      let tl = 0;
      if (hasPointer) {
        const bx = lerp(sx, gridX[i], t);
        const by = lerp(sy, gridY[i], t);
        const dx = bx - pointerLocal.x;
        const dy = by - pointerLocal.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (t < 1) {
          const R = 1.1;
          if (d < R) {
            const s = (1 - d / R) ** 2 * 0.55 * (1 - t);
            tx = (dx / (d || 1)) * s;
            ty = (dy / (d || 1)) * s;
            tz = s * 0.6;
          }
        } else {
          const R = 0.55;
          if (d < R) tl = (1 - d / R) ** 2 * 0.07;
        }
      }
      push[i * 3] += (tx - push[i * 3]) * k;
      push[i * 3 + 1] += (ty - push[i * 3 + 1]) * k;
      push[i * 3 + 2] += (tz - push[i * 3 + 2]) * k;
      lift[i] += (tl - lift[i]) * k;

      pos.set(
        lerp(sx, gridX[i], t) + push[i * 3],
        lerp(sy, gridY[i], t) + push[i * 3 + 1],
        lerp(sz, 0, t) + Math.sin(Math.PI * t) * arc[i] + push[i * 3 + 2] + wave * 0.2 + lift[i],
      );

      e.set(
        rot[i * 3] + time * spin[i * 3],
        rot[i * 3 + 1] + time * spin[i * 3 + 1],
        rot[i * 3 + 2] + time * spin[i * 3 + 2],
      );
      qa.setFromEuler(e);
      e.set(wave * 0.22, f * Math.PI, 0);
      qb.setFromEuler(e);
      q.slerpQuaternions(qa, qb, t);

      // Gaps: a paper quilt in the ledger, closing to a seamless screen, breathing open on each flip.
      const settle = Math.min(f, 1);
      const gap = lerp(0.84, 1.004, settle) - (f > 1 ? 0.12 * wave : 0);
      // Settled tiles go paper-thin so their edges can't show as seams on an angled screen.
      const depth = t < 1 ? 1 : Math.max(0.08, wave);
      scl.set(lerp(slipW[i], tileW * gap, t), lerp(slipH[i], tileH * gap, t), depth);

      m.compose(pos, q, scl);
      mesh.setMatrixAt(i, m);
      aContent[i] = Math.floor(f + 0.5);
      aCurl[i] = curl[i] * (1 - t);
    }
    mesh.instanceMatrix.needsUpdate = true;
    contentAttr.needsUpdate = true;
    curlAttr.needsUpdate = true;
  }

  function render(now: number) {
    raf = requestAnimationFrame(render);
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
    last = now;
    update(dt);
    renderer.render(scene, camera);
  }

  const onPointerMove = (ev: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    const x = (ev.clientX - rect.left) / rect.width;
    const y = (ev.clientY - rect.top) / rect.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) {
      pointerIn = false;
      pointer.set(0, 0);
      return;
    }
    pointerIn = true;
    pointer.set(x * 2 - 1, -(y * 2 - 1));
  };
  const onPointerOut = () => {
    pointerIn = false;
    pointer.set(0, 0);
  };
  const onContextLost = (ev: Event) => {
    ev.preventDefault();
    opts.onContextLost?.();
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  function setActive(next: boolean) {
    if (next === active || disposed) return;
    active = next;
    if (active) {
      last = 0;
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerOut);
      raf = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerOut);
    }
  }

  return {
    ready,
    setProgress(p) {
      progress = p;
    },
    setLayout(next) {
      if (next === layout) return;
      layout = next;
      frame();
    },
    resize(w, h) {
      width = Math.max(1, w);
      height = Math.max(1, h);
      const dpr = Math.min(window.devicePixelRatio || 1, dense ? 1.75 : 1.5);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      frame();
      if (!active) {
        update(0);
        renderer.render(scene, camera);
      }
    },
    setActive,
    dispose() {
      disposed = true;
      setActive(false);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      geometry.dispose();
      material.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      backdrop.geometry.dispose();
      (backdrop.material as THREE.Material).dispose();
      owned.forEach((t) => t.dispose());
      renderer.dispose();
    },
  };
}
