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
  trackHeightSvh: 400,
  /** Scrubbed video covers this range when the clip is available. */
  videoRange: [0.2, 0.5] as StoryRange,
  /** Real-time scene becomes visible from here (below it the poster owns the frame). */
  sceneStart: 0.16,
  /** Sub-ranges of the "system" chapter where each service tier is highlighted. */
  tierRanges: [
    [0.56, 0.64],
    [0.64, 0.72],
    [0.72, 0.8],
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
  videoRange: [0.02, 0.36] as StoryRange,
  tierRanges: [
    [0.46, 0.55],
    [0.55, 0.64],
    [0.64, 0.72],
  ] as StoryRange[],
} as const;

export const storyChapters: StoryChapter[] = [
  {
    id: "intro",
    range: [0, 0.2],
    label: "Keith / KDV Website Services",
    heading: "Turn business chaos into a system that works.",
    body: "Websites, business dashboards, and custom apps for Philippine businesses. Work directly with Keith, from the first conversation to launch.",
  },
  {
    id: "connect",
    range: [0.2, 0.5],
    label: "01 / Scattered to connected",
    heading: "Inquiries, orders, stock, and reports stop living in separate places.",
    body: "Chat threads, notebooks, and a spreadsheet per branch become one connected flow your whole team can see.",
  },
  {
    id: "system",
    range: [0.5, 0.8],
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
  /** Generated keyframes (GPT Image). null until produced; layouts fall back to CSS. */
  stills: {
    scattered: { src: "/cinematic/keyframe-scattered.webp", width: 1920, height: 1080, focus: "72% 50%" } as StoryStill | null,
    connected: { src: "/cinematic/keyframe-connected.webp", width: 1920, height: 1086, focus: "70% 50%" } as StoryStill | null,
    system: { src: "/cinematic/keyframe-system.webp", width: 1920, height: 1086, focus: "70% 50%" } as StoryStill | null,
  },
  /** Scroll-scrubbed Seedance clip, in source-preference order (H.264 first, VP9 for builds without it). */
  video: {
    sources: [
      { src: "/cinematic/sequence-1600.mp4", type: 'video/mp4; codecs="avc1.640028"' },
      { src: "/cinematic/sequence-1600.webm", type: 'video/webm; codecs="vp9"' },
    ],
    width: 1600,
    height: 900,
  } as StoryVideo | null,
  /** Square crop of the same clip for the compact (mobile) sequence; poster is its first frame. */
  compact: {
    poster: { src: "/cinematic/keyframe-scattered-sq.webp", width: 720, height: 720, focus: "50% 50%" } as StoryStill,
    video: {
      sources: [
        { src: "/cinematic/sequence-720sq.mp4", type: 'video/mp4; codecs="avc1.64001f"' },
        { src: "/cinematic/sequence-720sq.webm", type: 'video/webm; codecs="vp9"' },
      ],
      width: 720,
      height: 720,
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
