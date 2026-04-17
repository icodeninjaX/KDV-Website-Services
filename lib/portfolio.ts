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
    slug: "new-zion-lpg",
    client: "New Z1on LPG",
    title: "CMS dashboard with POS and SMS ordering",
    summary:
      "A custom CMS and point-of-sale dashboard wired to an SMS API. Staff now take, confirm, and dispatch orders from one screen instead of juggling phone calls and paper tickets.",
    tags: ["PHP", "JavaScript", "HTML/CSS", "SMS API"],
    outcome: "Ordering workflow streamlined by 90%",
    year: 2024,
    service: "business-dashboards",
    accent: "from-amber-500 to-rose-500",
  },
  {
    slug: "coop-tracking",
    client: "Private cooperative (PH)",
    title: "Mobile-first tracking system for a local co-op",
    summary:
      "A mobile-first tracking system that gave a small cooperative real-time visibility into member contributions, loans, and daily activity. Built for officers who mostly work from their phones.",
    tags: ["Mobile-first", "Web app", "Dashboard"],
    outcome: "Member activity visible in real time",
    year: 2024,
    service: "custom-websites",
    accent: "from-emerald-500 to-cyan-500",
  },
  {
    slug: "371admin",
    client: "X-Meta Technologies",
    title: "371admin: device monitoring and reporting dashboard",
    summary:
      "An internal admin dashboard for monitoring device status and generating reports across X-Meta's deployed fleet. Built to replace manual status checks and ad-hoc spreadsheets.",
    tags: ["Dashboard", "Reporting", "Admin panel"],
    outcome: "Fleet visibility + automated reporting",
    year: 2024,
    service: "business-dashboards",
    accent: "from-violet-500 to-cyan-500",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return portfolio.find((c) => c.slug === slug);
}
