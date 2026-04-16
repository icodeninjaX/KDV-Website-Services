import { Globe, LayoutDashboard, Wand2, type LucideIcon } from "lucide-react";

export type Service = {
  slug: "website-creation" | "business-dashboards" | "custom-websites";
  title: string;
  tagline: string;
  summary: string;
  icon: LucideIcon;
  deliverables: string[];
  idealFor: string;
  timeline: string;
  startingAt: string;
  faq: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: "website-creation",
    title: "Website Creation",
    tagline: "A polished, high-converting site your business deserves.",
    summary:
      "Marketing sites, landing pages, and multi-page business sites designed to turn visitors into leads. SEO-ready, fast on mobile, easy for you to update.",
    icon: Globe,
    deliverables: [
      "Custom design tuned to your brand",
      "Up to 7 pages (Home, Services, About, Contact, etc.)",
      "On-page SEO and Open Graph setup",
      "Contact form with email notifications",
      "Google Analytics + Search Console wired up",
      "One round of copy polish",
    ],
    idealFor: "Service businesses, freelancers, and small teams that need a real web presence, fast.",
    timeline: "2 – 3 weeks",
    startingAt: "₱25,000",
    faq: [
      {
        q: "Do you write the copy?",
        a: "I'll polish what you provide and draft sections you get stuck on. Full copywriting is available as an add-on — English or Taglish, your call.",
      },
      {
        q: "Can I edit the site myself later?",
        a: "Yes. I hand you a clean repo and a short Loom walking through how to update content, images, and sections.",
      },
      {
        q: "What about hosting?",
        a: "Sites ship on Vercel on your account. Production-grade, global CDN, and the free tier covers most Philippine SMBs.",
      },
      {
        q: "Do you accept GCash or bank transfer?",
        a: "Yes — GCash, Maya, BPI, BDO, or Wise for international clients. 50% to start, 50% on launch.",
      },
    ],
  },
  {
    slug: "business-dashboards",
    title: "Business Dashboards",
    tagline: "See what's happening in your business, at a glance.",
    summary:
      "Custom internal dashboards that pull from your tools — Stripe, Shopify, Google Sheets, your database — and give your team the numbers they actually need.",
    icon: LayoutDashboard,
    deliverables: [
      "Discovery session to map the metrics that matter",
      "Secure auth + role-based access",
      "Live integrations with your data sources",
      "Charts, tables, and exportable reports",
      "Mobile-friendly layout for on-the-go checks",
      "30 days of post-launch support",
    ],
    idealFor: "Owners and ops leads drowning in spreadsheets who need one source of truth.",
    timeline: "3 – 6 weeks",
    startingAt: "₱85,000",
    faq: [
      {
        q: "Which data sources can you connect?",
        a: "Anything with an API or CSV export. Common ones in PH: Xendit, PayMongo, Shopify, Lazada / Shopee seller APIs, QuickBooks, Google Sheets, Postgres, Airtable.",
      },
      {
        q: "Is the data secure?",
        a: "Yes. Auth, role-based access, encrypted credentials, and hosting in your own Vercel + database accounts. You own the infrastructure.",
      },
      {
        q: "Can my team log in?",
        a: "Yes. Email/password or SSO via Clerk or Auth.js — your pick.",
      },
    ],
  },
  {
    slug: "custom-websites",
    title: "Custom Websites & Web Apps",
    tagline: "Something bespoke? Let's build it right.",
    summary:
      "Booking systems, member portals, marketplaces, internal tools — the web applications that don't fit into a template. Engineered to be fast, scalable, and maintainable.",
    icon: Wand2,
    deliverables: [
      "Deep discovery + written scope",
      "Design mockups before a line of code",
      "Modern stack: Next.js, TypeScript, Postgres",
      "Staging environment + review cycles",
      "Automated deploys and rollbacks",
      "Knowledge-transfer docs on handoff",
    ],
    idealFor: "Businesses with a workflow no off-the-shelf product fits.",
    timeline: "From 6 weeks",
    startingAt: "Quoted per project",
    faq: [
      {
        q: "How do we know the scope?",
        a: "We run a paid 1-week discovery that produces a written scope, mockups, and a fixed quote. If you don't move forward, the scope is yours to keep.",
      },
      {
        q: "Who owns the code?",
        a: "You do. The repo lives in your GitHub org on day one.",
      },
      {
        q: "What if requirements change?",
        a: "We work in 2-week sprints. After each sprint we re-prioritize. You're never locked in.",
      },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
