/**
 * A logo item comes from one of two sources:
 *  - `iconSlug`: resolved to a react-icons component inside the client LogoMark.
 *               Zero files to manage.
 *  - `file`: a user-supplied SVG/PNG in /public/logos/. Needed for regional PH
 *            brands that Simple Icons doesn't cover.
 *
 * This structure stays RSC-serializable — no function references cross the
 * server/client boundary; the resolution happens inside LogoMark.
 */
export type LogoItem =
  | { name: string; iconSlug: "nextjs" | "vercel" | "postgres" | "xendit" }
  | { name: string; file: string; width: number; height: number };

export const trustLogos: LogoItem[] = [
  // Regional PH payments — manual assets required in /public/logos/
  { name: "GCash",    file: "gcash.svg",    width: 92, height: 28 },
  { name: "Maya",     file: "maya.svg",     width: 80, height: 28 },
  { name: "PayMongo", file: "paymongo.svg", width: 120, height: 24 },
  { name: "BPI",      file: "bpi.svg",      width: 56, height: 28 },

  // Library-provided marks (react-icons / Simple Icons)
  { name: "Xendit",   iconSlug: "xendit" },
  { name: "Next.js",  iconSlug: "nextjs" },
  { name: "Vercel",   iconSlug: "vercel" },
  { name: "Postgres", iconSlug: "postgres" },
];
