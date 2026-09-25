import { portfolio } from "./portfolio";
import { services, type Service } from "./services";

/**
 * Homepage cinematic sequence — single source of truth for scroll ranges,
 * chapter copy, and media. Progress is normalized 0–1 across the pinned track.
 */

export type StoryRange = readonly [start: number, end: number];

export type StoryChapterId = "intro" | "connect" | "system" | "proof";

export type StoryChapter = {
  id: StoryChapterId;
  range: StoryRange;
  label: string;
  heading: string;
  body: string;
};

export type StoryStill = {
  src: string;
  width: number;
  height: number;
  /** object-position used when the still is cropped (mobile/static layouts). */
  focus: string;
};

export type StoryVideo = {
  sources: readonly { src: string; type: string }[];
  width: number;
  height: number;
};

export const storyTimeline = {
  /** Height of the pinned track on cinematic-capable viewports, in svh. */
  trackHeightSvh: 420,
  /** The one continuous clip is scrubbed across this range (office → organized → three devices). */
  videoRange: [0.08, 0.8] as StoryRange,
  /** Camera pushes into the laptop screen and the real dashboard lands on it. */
  proofRange: [0.8, 1] as StoryRange,
  /** Camera pulls back so all three devices clear the caption column, then pushes into the laptop. */
  pullBack: 0.8,
  /** Scale of the push-in, anchored on the laptop screen (`storyMedia.proofScreen`). */
  proofZoom: 1.75,
  /** Sub-ranges of the "system" chapter where each service tier is highlighted. */
  tierRanges: [
    [0.6, 0.67],
    [0.67, 0.74],
    [0.74, 0.8],
  ] as StoryRange[],
} as const;

/**
 * Narrow/portrait viewports: a shorter pinned track below the hero, media on top and
 * captions underneath. Scrubbed video + stills only — no real-time scene on phones.
 * Ranges are normalized over this track, not the desktop one.
 */
export const compactTimeline = {
  trackHeightSvh: 300,
  chapters: {
    connect: [0, 0.4],
    system: [0.4, 0.72],
    proof: [0.72, 1],
  } as Record<"connect" | "system" | "proof", StoryRange>,
  videoRange: [0.02, 0.7] as StoryRange,
  tierRanges: [
    [0.46, 0.55],
    [0.55, 0.64],
    [0.64, 0.72],
  ] as StoryRange[],
} as const;

export const storyChapters: StoryChapter[] = [
  {
    id: "intro",
    range: [0, 0.14],
    label: "Keith / KDV Website Services",
    heading: "Turn business chaos into a system that works.",
    body: "Websites, business dashboards, and custom apps for Philippine businesses. Work directly with Keith, from the first conversation to launch.",
  },
  {
    id: "connect",
    range: [0.14, 0.52],
    label: "01 / Scattered to connected",
    heading: "Inquiries, orders, stock, and reports stop living in separate places.",
    body: "Chat threads, notebooks, and a spreadsheet per branch become one connected flow your whole team can see.",
  },
  {
    id: "system",
    range: [0.52, 0.8],
    label: "02 / The system takes shape",
    heading: "One system, built in three layers.",
    body: "Start with the layer your business needs now. Each one connects to the next when you are ready.",
  },
  {
    id: "proof",
    range: [0.8, 1],
    label: "03 / Already running",
    heading: "Real systems, already running real businesses.",
    body: "New Zion's branches now share one order queue and one sales report. This is its actual admin dashboard.",
  },
];

export type SystemTier = {
  service: Service["slug"];
  title: string;
  role: string;
};

const serviceTitle = (slug: Service["slug"]) => services.find((s) => s.slug === slug)!.title;

/** Front → back, matching the three tiers of the real-time scene. */
export const systemTiers: SystemTier[] = [
  {
    service: "website-creation",
    title: serviceTitle("website-creation"),
    role: "The front door. Customers find you, ask questions, and send inquiries.",
  },
  {
    service: "business-dashboards",
    title: serviceTitle("business-dashboards"),
    role: "The control room. Sales, orders, and branches at a glance.",
  },
  {
    service: "custom-websites",
    title: serviceTitle("custom-websites"),
    role: "The engine. Workflows built around how your team already works.",
  },
];

const proofProject = portfolio.find((p) => p.slug === "new-zion-lpg")!;
const proofShot = proofProject.gallery!.find((g) => g.src.endsWith("admin-dashboard.webp"))!;

export const storyMedia = {
  /**
   * Illustrative keyframes (GPT Image 2.5 sunburst): the same PH back-office desk as
   * chaos → organized → three connected devices. Not client work — see IMPROVEMENTS 6.7.
   * `scattered` is the clip's own first frame, so poster → video is pixel-registered.
   */
  stills: {
    scattered: { src: "/cinematic/office-poster.webp", width: 1920, height: 1080, focus: "72% 50%" } as StoryStill | null,
    connected: { src: "/cinematic/office-organized.webp", width: 1920, height: 1086, focus: "72% 50%" } as StoryStill | null,
    system: { src: "/cinematic/office-devices.webp", width: 1920, height: 1086, focus: "72% 50%" } as StoryStill | null,
  },
  /** One continuous Seedance 2.0 clip scrubbed across the whole desktop sequence (H.264 first, VP9 fallback). */
  video: {
    sources: [
      { src: "/cinematic/office-1600.mp4", type: 'video/mp4; codecs="avc1.640028"' },
      { src: "/cinematic/office-1600.webm", type: 'video/webm; codecs="vp9"' },
    ],
    width: 1600,
    height: 900,
  } as StoryVideo | null,
  /** Laptop display in the clip's final frame, as fractions of the 16:9 frame; the real dashboard lands here. */
  proofScreen: { x: 0.498, y: 0.342, w: 0.25, h: 0.286 },
  /** 10:9 crop (x 720–1920 of the 1080p master) for the compact sequence; poster is its first frame. */
  compact: {
    aspect: "10 / 9",
    poster: { src: "/cinematic/office-poster-compact.webp", width: 720, height: 648, focus: "50% 50%" } as StoryStill,
    /** object-position that reproduces the same crop on the 16:9 fallback stills. */
    stillFocus: "100% 50%",
    video: {
      sources: [
        { src: "/cinematic/office-compact.mp4", type: 'video/mp4; codecs="avc1.64001f"' },
        { src: "/cinematic/office-compact.webm", type: 'video/webm; codecs="vp9"' },
      ],
      width: 720,
      height: 648,
    } as StoryVideo | null,
  },
  /** Real project screenshot used as the proof hand-off. */
  proof: {
    src: proofShot.src,
    alt: proofShot.alt,
    width: 1878,
    height: 892,
    project: proofProject.title,
    client: proofProject.client,
    slug: proofProject.slug,
  },
} as const;

export const proofClients = portfolio.map((p) => ({ slug: p.slug, client: p.client }));
