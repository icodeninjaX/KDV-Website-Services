import {
  ACESFilmicToneMapping,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  EdgesGeometry,
  Euler,
  Fog,
  Group,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Points,
  PointsMaterial,
  Quaternion,
  Scene,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
  WebGLRenderer,
  type Texture,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * The "business system" object: 18 interface modules in three tiers
 * (website / dashboard / app) that travel scattered → connected → exploded
 * layers → hand-off to a real project screenshot, driven by scroll progress.
 */

export type SystemSceneOptions = {
  canvas: HTMLCanvasElement;
  proofSrc: string;
  proofAspect: number;
  /** Ranges from lib/story.ts, passed in so the scene has no copy/data imports. */
  tierRanges: readonly (readonly [number, number])[];
  onContextLost: () => void;
};

export type SystemScene = {
  setProgress: (p: number) => void;
  setActive: (active: boolean) => void;
  resize: (width: number, height: number) => void;
  dispose: () => void;
};

type Category = "inquiries" | "orders" | "inventory" | "customers" | "reports";

const TIERS = 3;
const COLS = 3;
const ROWS = 2;
const W = 1.5;
const H = 0.94;
const D = 0.05;
const GAP = 0.14;
const MAX_PIXELS = 2_600_000;
const ACCENT = new Color("#7376f3");
const WHITE = new Color("#ffffff");

const TIER_CATEGORIES: Category[][] = [
  ["inquiries", "customers", "inquiries", "customers", "orders", "inquiries"],
  ["reports", "reports", "customers", "inventory", "reports", "orders"],
  ["orders", "inventory", "orders", "inventory", "orders", "reports"],
];

type Pose = { pos: Vector3; rot: Quaternion };

type Module = {
  group: Group;
  tier: number;
  scattered: Pose;
  connected: Pose;
  exploded: Pose;
  wall: Pose;
  delay: number;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};
const span = (p: number, a: number, b: number) => smooth((p - a) / (b - a));

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pose(x: number, y: number, z: number, rx = 0, ry = 0, rz = 0): Pose {
  return {
    pos: new Vector3(x, y, z),
    rot: new Quaternion().setFromEuler(new Euler(rx, ry, rz)),
  };
}

/** Abstract interface glyphs — no text, no numbers, nothing that reads as real data. */
function drawFace(category: Category): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 320;
  const g = c.getContext("2d")!;
  const line = "rgba(255,255,255,0.55)";
  const soft = "rgba(255,255,255,0.14)";
  const accent = "rgba(115,118,243,0.9)";
  g.lineWidth = 3;
  const rr = (x: number, y: number, w: number, h: number, r: number, fill?: string, stroke?: string) => {
    g.beginPath();
    g.roundRect(x, y, w, h, r);
    if (fill) {
      g.fillStyle = fill;
      g.fill();
    }
    if (stroke) {
      g.strokeStyle = stroke;
      g.stroke();
    }
  };
  rr(24, 22, 200, 14, 7, soft);
  rr(440, 20, 48, 18, 9, undefined, soft);

  switch (category) {
    case "inquiries":
      rr(24, 70, 280, 58, 18, soft);
      rr(208, 146, 280, 58, 18, "rgba(115,118,243,0.35)");
      rr(24, 222, 230, 58, 18, soft);
      g.fillStyle = accent;
      g.beginPath();
      g.arc(470, 250, 10, 0, Math.PI * 2);
      g.fill();
      break;
    case "orders":
      for (let i = 0; i < 5; i++) {
        const y = 66 + i * 48;
        rr(24, y, 26, 26, 6, i === 1 ? accent : undefined, line);
        rr(66, y + 6, 250, 14, 7, soft);
        rr(380, y + 6, 108, 14, 7, i === 1 ? "rgba(115,118,243,0.5)" : soft);
      }
      break;
    case "inventory":
      for (let r = 0; r < 3; r++) {
        for (let col = 0; col < 5; col++) {
          const x = 24 + col * 94;
          const y = 64 + r * 82;
          rr(x, y, 76, 50, 8, undefined, r === 0 && col === 3 ? accent : soft);
          rr(x, y + 58, 50 - col * 6, 8, 4, soft);
        }
      }
      break;
    case "customers":
      for (let i = 0; i < 4; i++) {
        const y = 78 + i * 58;
        g.strokeStyle = i === 2 ? accent : line;
        g.beginPath();
        g.arc(46, y + 12, 18, 0, Math.PI * 2);
        g.stroke();
        rr(84, y, 220, 12, 6, soft);
        rr(84, y + 20, 140, 10, 5, soft);
      }
      break;
    case "reports": {
      const heights = [70, 120, 96, 160, 132, 190];
      heights.forEach((h, i) => rr(34 + i * 72, 290 - h, 44, h, 6, i === 5 ? "rgba(115,118,243,0.55)" : soft));
      g.strokeStyle = line;
      g.beginPath();
      heights.forEach((h, i) => {
        const x = 56 + i * 72;
        const y = 270 - h;
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      });
      g.stroke();
      break;
    }
  }
  return c;
}

function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.35, "rgba(190,192,255,0.8)");
  grad.addColorStop(1, "rgba(115,118,243,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new CanvasTexture(c);
}

type CameraKey = { p: number; pos: Vector3; target: Vector3 };

const CAMERA_KEYS: CameraKey[] = [
  { p: 0.16, pos: new Vector3(0, 0.2, 15), target: new Vector3(0, 0, -1) },
  // Registered to the last frame of the scrubbed clip so the video → scene handoff doesn't jump.
  { p: 0.48, pos: new Vector3(-0.9, 0.5, 8.6), target: new Vector3(-0.9, 0, -0.4) },
  { p: 0.62, pos: new Vector3(2.2, 1.8, 13), target: new Vector3(0, 0, -1.4) },
  { p: 0.8, pos: new Vector3(-0.8, 1.0, 12.6), target: new Vector3(0, 0, -1.4) },
  { p: 0.92, pos: new Vector3(0, 0.1, 10.8), target: new Vector3(0, 0, -0.4) },
  { p: 1, pos: new Vector3(0, 0, 10.4), target: new Vector3(0, 0, -0.4) },
];

export function createSystemScene(opts: SystemSceneOptions): SystemScene {
  const { canvas } = opts;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new Scene();
  scene.fog = new Fog(0x080808, 11, 24);

  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envTarget = pmrem.fromScene(room, 0.04);
  scene.environment = envTarget.texture;
  room.dispose();
  pmrem.dispose();

  const key = new DirectionalLight(0xffffff, 1.6);
  key.position.set(-4, 6, 8);
  const rim = new DirectionalLight(0x8b8cf6, 0.9);
  rim.position.set(6, -2, -6);
  scene.add(key, rim);

  const camera = new PerspectiveCamera(35, 16 / 9, 0.1, 60);

  const root = new Group();
  scene.add(root);

  // Shared resources
  const bodyGeo = new BoxGeometry(W, H, D);
  const edgeGeo = new EdgesGeometry(bodyGeo);
  const faceGeo = new PlaneGeometry(W * 0.92, H * 0.88);
  const bodyMat = new MeshPhysicalMaterial({
    color: 0x101014,
    metalness: 0.6,
    roughness: 0.24,
    clearcoat: 1,
    clearcoatRoughness: 0.18,
    envMapIntensity: 1.1,
  });
  const tierEdgeMats = Array.from({ length: TIERS }, () => new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22 }));
  const categories: Category[] = ["inquiries", "orders", "inventory", "customers", "reports"];
  const faceTextures = new Map<Category, Texture>();
  for (const cat of categories) {
    const t = new CanvasTexture(drawFace(cat));
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 4;
    faceTextures.set(cat, t);
  }
  const tierFaceMats = Array.from({ length: TIERS }, () =>
    categories.map(
      (cat) =>
        new MeshBasicMaterial({ map: faceTextures.get(cat)!, transparent: true, opacity: 0.85, depthWrite: false, toneMapped: false }),
    ),
  );

  const rand = mulberry32(20260925);
  const modules: Module[] = [];
  const cellX = (col: number) => (col - (COLS - 1) / 2) * (W + GAP);
  const cellY = (row: number) => ((ROWS - 1) / 2 - row) * (H + GAP);

  for (let t = 0; t < TIERS; t++) {
    for (let i = 0; i < COLS * ROWS; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const group = new Group();
      const body = new Mesh(bodyGeo, bodyMat);
      const edges = new LineSegments(edgeGeo, tierEdgeMats[t]);
      const cat = TIER_CATEGORIES[t][i];
      const face = new Mesh(faceGeo, tierFaceMats[t][categories.indexOf(cat)]);
      face.position.z = D / 2 + 0.003;
      group.add(body, edges, face);
      root.add(group);

      const x = cellX(col);
      const y = cellY(row);
      modules.push({
        group,
        tier: t,
        scattered: pose(
          (rand() - 0.5) * 15,
          (rand() - 0.5) * 7.5,
          -1 - rand() * 7,
          (rand() - 0.5) * 1.4,
          (rand() - 0.5) * 1.8,
          (rand() - 0.5) * 0.9,
        ),
        connected: pose(x, y, -t * 0.34),
        exploded: pose(x - t * 0.3, y + t * 0.3, 1.5 - t * 1.7),
        wall: pose(x * 1.55, y * 1.6 + t * 0.04, -3.4 - t * 0.5),
        delay: rand() * 0.35,
      });
    }
  }

  // Connectors between edge midpoints; cross-tier struts between face centers.
  type Link = { a: number; b: number; la: Vector3; lb: Vector3; seed: number };
  const links: Link[] = [];
  const idx = (t: number, col: number, row: number) => t * COLS * ROWS + row * COLS + col;
  for (let t = 0; t < TIERS; t++) {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS - 1; col++) {
        links.push({ a: idx(t, col, row), b: idx(t, col + 1, row), la: new Vector3(W / 2, 0, 0), lb: new Vector3(-W / 2, 0, 0), seed: rand() });
      }
    }
    for (let col = 0; col < COLS; col++) {
      links.push({ a: idx(t, col, 0), b: idx(t, col, 1), la: new Vector3(0, -H / 2, 0), lb: new Vector3(0, H / 2, 0), seed: rand() });
    }
    if (t < TIERS - 1) {
      for (let cell = 0; cell < COLS * ROWS; cell += 2) {
        const col = cell % COLS;
        const row = Math.floor(cell / COLS);
        links.push({ a: idx(t, col, row), b: idx(t + 1, col, row), la: new Vector3(0, 0, -D / 2), lb: new Vector3(0, 0, D / 2), seed: rand() });
      }
    }
  }
  const linkPositions = new Float32Array(links.length * 6);
  const linkGeo = new BufferGeometry();
  linkGeo.setAttribute("position", new BufferAttribute(linkPositions, 3));
  const linkMat = new LineBasicMaterial({ color: 0xa5a7ff, transparent: true, opacity: 0, depthWrite: false });
  const linkLines = new LineSegments(linkGeo, linkMat);
  linkLines.frustumCulled = false;
  scene.add(linkLines);

  const pulsePositions = new Float32Array(links.length * 3);
  const pulseGeo = new BufferGeometry();
  pulseGeo.setAttribute("position", new BufferAttribute(pulsePositions, 3));
  const pulseTex = dotTexture();
  const pulseMat = new PointsMaterial({ size: 0.16, map: pulseTex, transparent: true, opacity: 0, depthWrite: false, toneMapped: false });
  const pulses = new Points(pulseGeo, pulseMat);
  pulses.frustumCulled = false;
  scene.add(pulses);

  // Proof screen: a real project screenshot that emerges from the dashboard tier.
  const screenW = 4.4;
  const screenH = screenW / opts.proofAspect;
  const screenGroup = new Group();
  const screenGeo = new PlaneGeometry(screenW, screenH);
  const screenMat = new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, toneMapped: false });
  const screen = new Mesh(screenGeo, screenMat);
  const bezelGeo = new BoxGeometry(screenW + 0.12, screenH + 0.12, 0.06);
  const bezel = new Mesh(bezelGeo, bodyMat);
  bezel.position.z = -0.04;
  const bezelEdgeGeo = new EdgesGeometry(bezelGeo);
  const bezelEdgeMat = new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
  const bezelEdges = new LineSegments(bezelEdgeGeo, bezelEdgeMat);
  bezelEdges.position.z = -0.04;
  screenGroup.add(bezel, bezelEdges, screen);
  screenGroup.visible = false;
  scene.add(screenGroup);

  let proofTexture: Texture | null = null;
  let disposed = false;
  new TextureLoader().load(opts.proofSrc, (tex) => {
    if (disposed) {
      tex.dispose();
      return;
    }
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    proofTexture = tex;
    screenMat.map = tex;
    screenMat.needsUpdate = true;
    requestFrame();
  });

  // Group orientation per state
  const rootRot = {
    scattered: new Quaternion(),
    connected: new Quaternion().setFromEuler(new Euler(0.14, -0.5, 0.02)),
    exploded: new Quaternion().setFromEuler(new Euler(0.2, -0.62, 0.03)),
    wall: new Quaternion(),
  };

  let width = 1;
  let height = 1;
  let distScale = 1;
  let target = 0;
  let current = 0;
  let active = false;
  let raf = 0;
  let last = 0;

  const tmpPos = new Vector3();
  const tmpQ = new Quaternion();
  const tmpA = new Vector3();
  const tmpB = new Vector3();
  const camPos = new Vector3();
  const camTarget = new Vector3();
  const screenStart = new Vector3();
  const screenEnd = new Vector3(0, 0, 0.9);
  const tmpColor = new Color();

  function cameraAt(p: number) {
    const keys = CAMERA_KEYS;
    if (p <= keys[0].p) {
      camPos.copy(keys[0].pos);
      camTarget.copy(keys[0].target);
      return;
    }
    for (let i = 0; i < keys.length - 1; i++) {
      const k0 = keys[i];
      const k1 = keys[i + 1];
      if (p <= k1.p) {
        const t = smooth((p - k0.p) / (k1.p - k0.p));
        camPos.lerpVectors(k0.pos, k1.pos, t);
        camTarget.lerpVectors(k0.target, k1.target, t);
        return;
      }
    }
    const k = keys[keys.length - 1];
    camPos.copy(k.pos);
    camTarget.copy(k.target);
  }

  function placeCamera(p: number) {
    cameraAt(p);
    // Narrower stages pull the camera back so the subject clears the copy column.
    camPos.sub(camTarget).multiplyScalar(distScale).add(camTarget);
    camera.position.copy(camPos);
    camera.lookAt(camTarget);
  }

  function apply(p: number) {
    const u = clamp01((p - 0.22) / 0.26); // scattered → connected
    const e = span(p, 0.5, 0.6); // connected → exploded
    const w = span(p, 0.8, 0.9); // exploded → wall (hand-off)
    const drift = span(p, 0.12, 0.3);

    for (const m of modules) {
      const local = smooth((u - m.delay) / 0.65);
      tmpPos.copy(m.scattered.pos);
      tmpPos.x *= 1 - drift * 0.08;
      tmpPos.lerp(m.connected.pos, local);
      tmpQ.copy(m.scattered.rot).slerp(m.connected.rot, local);
      if (e > 0) {
        tmpPos.lerp(m.exploded.pos, e);
        tmpQ.slerp(m.exploded.rot, e);
      }
      if (w > 0) {
        tmpPos.lerp(m.wall.pos, w);
        tmpQ.slerp(m.wall.rot, w);
      }
      m.group.position.copy(tmpPos);
      m.group.quaternion.copy(tmpQ);
    }

    root.quaternion.copy(rootRot.scattered).slerp(rootRot.connected, smooth(u));
    if (e > 0) root.quaternion.slerp(rootRot.exploded, e);
    if (w > 0) root.quaternion.slerp(rootRot.wall, w);

    // Tier emphasis during the "system" chapter
    const inSystem = span(p, 0.54, 0.58) * (1 - span(p, 0.78, 0.82));
    opts.tierRanges.forEach(([a, b], t) => {
      const on = inSystem * span(p, a - 0.015, a + 0.015) * (1 - span(p, b - 0.015, b + 0.015));
      const edgeMat = tierEdgeMats[t];
      tmpColor.copy(WHITE).lerp(ACCENT, on);
      edgeMat.color.copy(tmpColor);
      const dim = inSystem * (1 - on) * 0.45;
      edgeMat.opacity = 0.2 + on * 0.75 - dim * 0.2 - w * 0.1;
      for (const mat of tierFaceMats[t]) mat.opacity = (0.85 - dim - w * 0.55) * (0.35 + 0.65 * smooth(u));
    });

    linkMat.opacity = smooth(u) * 0.55 * (1 - w * 0.8);
    pulseMat.opacity = span(p, 0.36, 0.48) * (1 - w);

    root.updateMatrixWorld(true);
    for (let i = 0; i < links.length; i++) {
      const l = links[i];
      tmpA.copy(l.la).applyMatrix4(modules[l.a].group.matrixWorld);
      tmpB.copy(l.lb).applyMatrix4(modules[l.b].group.matrixWorld);
      tmpA.toArray(linkPositions, i * 6);
      tmpB.toArray(linkPositions, i * 6 + 3);
      const f = (p * 7 + l.seed) % 1;
      tmpA.lerp(tmpB, f).toArray(pulsePositions, i * 3);
    }
    linkGeo.attributes.position.needsUpdate = true;
    pulseGeo.attributes.position.needsUpdate = true;

    // Proof screen grows out of the centre dashboard module
    screenGroup.visible = w > 0.001;
    if (screenGroup.visible) {
      const anchor = modules[idx(1, 1, 0)].group;
      anchor.getWorldPosition(screenStart);
      const s = MathUtils.lerp(0.26, 1, w);
      screenGroup.position.lerpVectors(screenStart, screenEnd, w);
      screenGroup.scale.setScalar(s);
      screenMat.opacity = proofTexture ? span(w, 0.15, 0.7) : 0;
      bezelEdgeMat.opacity = w * 0.35;
    }

    placeCamera(p);
  }

  function frame(now: number) {
    raf = 0;
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
    last = now;
    const k = 1 - Math.exp(-dt * 9);
    current += (target - current) * k;
    if (Math.abs(target - current) < 0.0004) current = target;
    apply(current);
    renderer.render(scene, camera);
    if (current !== target) requestFrame();
    else last = 0;
  }

  function requestFrame() {
    if (!active || raf || disposed) return;
    raf = requestAnimationFrame(frame);
  }

  function resize(w: number, h: number) {
    width = Math.max(1, Math.round(w));
    height = Math.max(1, Math.round(h));
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(MAX_PIXELS / (width * height)));
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Shift the subject right so the left column stays clear for HTML copy.
    const shift = camera.aspect > 1.2 ? 0.17 : 0;
    distScale = MathUtils.clamp(1.75 / camera.aspect, 1, 1.35);
    camera.filmOffset = -shift * 35 * 2 * Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
    camera.updateProjectionMatrix();
    if (active) {
      apply(current);
      renderer.render(scene, camera);
    }
  }

  function onLost(event: Event) {
    event.preventDefault();
    active = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    opts.onContextLost();
  }
  canvas.addEventListener("webglcontextlost", onLost);

  return {
    setProgress(p) {
      target = clamp01(p);
      requestFrame();
    },
    setActive(next) {
      if (next === active) return;
      active = next;
      if (active) {
        // Snap on resume so a long jump (anchor link, fast scroll) doesn't replay slowly.
        current = target;
        last = 0;
        requestFrame();
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    resize,
    dispose() {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      canvas.removeEventListener("webglcontextlost", onLost);
      bodyGeo.dispose();
      edgeGeo.dispose();
      faceGeo.dispose();
      bodyMat.dispose();
      tierEdgeMats.forEach((m) => m.dispose());
      tierFaceMats.flat().forEach((m) => m.dispose());
      faceTextures.forEach((t) => t.dispose());
      linkGeo.dispose();
      linkMat.dispose();
      pulseGeo.dispose();
      pulseMat.dispose();
      pulseTex.dispose();
      screenGeo.dispose();
      screenMat.dispose();
      bezelGeo.dispose();
      bezelEdgeGeo.dispose();
      bezelEdgeMat.dispose();
      proofTexture?.dispose();
      envTarget.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
