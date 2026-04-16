export type CaseStudy = {
  slug: string;
  client: string;
  title: string;
  summary: string;
  tags: string[];
  outcome: string;
  year: number;
  service: "website-creation" | "business-dashboards" | "custom-websites";
  accent: string;
};

export const portfolio: CaseStudy[] = [
  {
    slug: "kamayan-bakeshop",
    client: "Kamayan Bakeshop (Makati)",
    title: "A bakeshop site that sells out the morning rush",
    summary:
      "Rebuilt an aging WordPress site as a fast, mobile-first Next.js site with GCash-powered pre-orders. Pickup volume grew steadily once customers could order the night before.",
    tags: ["Next.js", "GCash", "Tailwind"],
    outcome: "+38% pre-orders in 60 days",
    year: 2025,
    service: "website-creation",
    accent: "from-amber-500 to-rose-500",
  },
  {
    slug: "pasig-logistics",
    client: "Pasig Logistics Corp.",
    title: "Ops dashboard that replaced 6 spreadsheets",
    summary:
      "A role-based dashboard pulling from their TMS, QuickBooks, and fuel card API. Dispatchers and finance in Metro Manila now see the same numbers in real time.",
    tags: ["Dashboard", "Postgres", "Auth.js"],
    outcome: "4 hours / week saved per dispatcher",
    year: 2025,
    service: "business-dashboards",
    accent: "from-violet-500 to-cyan-500",
  },
  {
    slug: "cebu-smile-dental",
    client: "Cebu Smile Dental Group",
    title: "Patient portal with secure messaging",
    summary:
      "Custom patient portal for a 3-location dental group in Cebu. DPA-aware architecture, document uploads, and two-way messaging with providers.",
    tags: ["Custom app", "Clerk", "Postgres"],
    outcome: "72% patient sign-up rate in month 1",
    year: 2024,
    service: "custom-websites",
    accent: "from-emerald-500 to-cyan-500",
  },
  {
    slug: "davao-fit-club",
    client: "Davao Fit Club",
    title: "Class booking that members actually use",
    summary:
      "Replaced a clunky third-party booking tool with a branded booking flow integrated into the gym's existing marketing site. Paymaya + GCash checkout.",
    tags: ["Next.js", "PayMongo", "Cron jobs"],
    outcome: "2× mobile bookings vs. prior tool",
    year: 2024,
    service: "custom-websites",
    accent: "from-sky-500 to-indigo-500",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return portfolio.find((c) => c.slug === slug);
}
