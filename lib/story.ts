import { portfolio } from "./portfolio";
import { services, type Service } from "./services";

/**
 * Homepage "paper to system" sequence — single source of truth for scroll ranges,
 * chapter copy, and the project plates the 3D tiles resolve into.
 * Progress is normalized 0–1 across the pinned track.
 */

export type StoryRange = readonly [start: number, end: number];

export type StoryPlate = {
  slug: string;
  project: string;
  client: string;
  src: string;
  alt: string;
  /** What the screenshot shows, for the "On screen" line. */
  screen: string;
};

type BaseChapter = { id: string; range: StoryRange; label: string; heading: string; body: string };

export type StoryChapter =
  | (BaseChapter & { kind: "intro" | "paper" })
  | (BaseChapter & { kind: "proof"; plate: number })
  | (BaseChapter & { kind: "service"; plate: number; service: Service });

export const storyTimeline = {
  /** Height of the pinned track, in svh. */
  trackHeightSvh: 720,
  /** Loose paper swirls, then settles into a ledger grid (paper side up). */
  gather: [0.16, 0.3] as StoryRange,
  /** Each flip-wave turns the grid over onto the next plate (plate index = flip index). */
  flips: [
    [0.33, 0.41],
    [0.49, 0.57],
    [0.65, 0.73],
    [0.81, 0.89],
  ] as StoryRange[],
} as const;

function shot(slug: string, file: string, screen: string): StoryPlate {
  const project = portfolio.find((p) => p.slug === slug)!;
  const image = project.gallery!.find((g) => g.src.endsWith(`/${file}`))!;
  return { slug, project: project.title, client: project.client, src: image.src, alt: image.alt, screen };
}

/** Real project screenshots, all ≈2.07:1. Order matches the flips. */
export const storyPlates: StoryPlate[] = [
  shot("new-zion-lpg", "admin-dashboard.webp", "admin dashboard"),
  shot("ipay-international", "hero.webp", "marketing site"),
  shot("371admin", "overview-dashboard.webp", "operations dashboard"),
  shot("coop-tracking", "dashboard.webp", "co-op web app"),
];

export const plateAspect = 1900 / 917;

const service = (slug: Service["slug"]) => services.find((s) => s.slug === slug)!;

export const storyChapters: StoryChapter[] = [
  {
    id: "intro",
    kind: "intro",
    range: [0, 0.12],
    label: "Keith / KDV Website Services",
    heading: "Turn business chaos into a system that works.",
    body: "Websites, business dashboards, and custom apps for Philippine businesses. Work directly with Keith, from the first conversation to launch.",
  },
  {
    id: "paper",
    kind: "paper",
    range: [0.13, 0.33],
    label: "01 / Where it starts",
    heading: "Orders in a notebook. Payments in chat. A spreadsheet per branch.",
    body: "The information exists. It just lives in too many places for anyone to see the whole business at once.",
  },
  {
    id: "proof",
    kind: "proof",
    plate: 0,
    range: [0.37, 0.49],
    label: "02 / Paper to system",
    heading: "New Zion ran on paper logs. Now its branches share one queue.",
    body: "Phone-in, walk-in, and SMS orders land in one workflow, and the owner pulls a sales report for any date range without asking anyone.",
  },
  {
    id: "website",
    kind: "service",
    plate: 1,
    service: service("website-creation"),
    range: [0.53, 0.65],
    label: "03 / Website Creation",
    heading: "The front door.",
    body: "Customers find you, trust you, and send the inquiry. Fast on mobile, easy for your team to update.",
  },
  {
    id: "dashboards",
    kind: "service",
    plate: 2,
    service: service("business-dashboards"),
    range: [0.69, 0.81],
    label: "04 / Business Dashboards",
    heading: "The control room.",
    body: "Sales, orders, devices, and branches at a glance, so the numbers you quote in meetings are always current.",
  },
  {
    id: "custom",
    kind: "service",
    plate: 3,
    service: service("custom-websites"),
    range: [0.85, 1],
    label: "05 / Custom Web Apps",
    heading: "The engine.",
    body: "Workflows built around how your team already works. CoopTracker lets officers run a whole co-op from their phones.",
  },
];

export const paperAtlas = { src: "/cinematic/paper-atlas.webp", width: 1536, height: 1536 } as const;
