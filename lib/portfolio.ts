export type CaseStudyImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type CaseStudyBody = {
  challenge: string;
  built: string[];
  result: string;
};

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
  cover?: CaseStudyImage;
  gallery?: CaseStudyImage[];
  body?: CaseStudyBody;
};

export const portfolio: CaseStudy[] = [
  {
    slug: "new-zion-lpg",
    client: "New Z1on LPG",
    title: "New Zion POS — multi-branch LPG retail & ordering platform",
    summary:
      "A full retail operations platform for an LPG distributor: a cashier-friendly POS, an admin panel for orders, customers, products, branches, and users, plus date-ranged sales reports with PDF export. SMS-based order intake feeds the same queue, so phone-in and walk-in orders share one workflow across every branch.",
    tags: ["PHP", "JavaScript", "HTML/CSS", "SMS API", "Multi-branch", "POS", "Reporting"],
    outcome: "One unified workflow across branches",
    year: 2024,
    service: "business-dashboards",
    accent: "from-amber-500 to-rose-500",
    body: {
      challenge:
        "New Zion ran on phone calls, paper logs, and a separate spreadsheet per branch. Cashiers couldn't see another branch's stock or a customer's prior orders, sales totals had to be reconciled by hand at the end of each day, and the SMS-based ordering line wasn't connected to anything.",
      built: [
        "A cashier-friendly POS with a single 'Create Order' flow that pulls existing customer info, lets staff pick products, branch, and cashier, and writes the sale straight to the database.",
        "An admin panel covering customers, products with pricing history, branches, and role-based users (superadmin, admin, user).",
        "An order management view with status filters (Pending, Delivered, Cancelled) so phone-in, walk-in, and SMS orders all live in one queue.",
        "A sales report with a date-range filter, totals, average order value, and one-click PDF export for the owners.",
        "An SMS intake bridge so orders that come in over text appear in the same queue as everything else.",
      ],
      result:
        "Three branches now share one workflow and one source of truth. Cashiers onboard in minutes instead of days, daily reconciliation is a button click, and the owner can pull a sales report for any date range without asking anyone.",
    },
    cover: {
      src: "/portfolio/new-zion-lpg/pos-dashboard.webp",
      alt: "New Zion POS dashboard showing customer and order metrics",
    },
    gallery: [
      {
        src: "/portfolio/new-zion-lpg/pos-dashboard.webp",
        alt: "POS dashboard with quick actions and recent customers",
        caption: "POS dashboard — at-a-glance metrics and quick actions",
      },
      {
        src: "/portfolio/new-zion-lpg/admin-dashboard.webp",
        alt: "Admin main dashboard with totals and recent activity",
        caption: "Admin overview — totals, top product, recent activity",
      },
      {
        src: "/portfolio/new-zion-lpg/create-order.webp",
        alt: "Create new order screen with customer info and order cart",
        caption: "Create order — customer info, products, branch & cashier",
      },
      {
        src: "/portfolio/new-zion-lpg/order-management.webp",
        alt: "Order management table with statuses and filters",
        caption: "Order management — filter, search, and track every order",
      },
      {
        src: "/portfolio/new-zion-lpg/add-customer.webp",
        alt: "Add customer form with address and tank type fields",
        caption: "Customer onboarding with full address and tank type",
      },
      {
        src: "/portfolio/new-zion-lpg/search-customers.webp",
        alt: "Search customers screen with empty state",
        caption: "Find customers by name or phone, view order history",
      },
      {
        src: "/portfolio/new-zion-lpg/registered-customers.webp",
        alt: "Registered customers list with contact and address",
        caption: "Registered customers list with quick edit actions",
      },
      {
        src: "/portfolio/new-zion-lpg/product-management.webp",
        alt: "Product management screen with product list",
        caption: "Product management — pricing and update history",
      },
      {
        src: "/portfolio/new-zion-lpg/registered-branches.webp",
        alt: "Registered branches list with contact numbers",
        caption: "Multi-branch support",
      },
      {
        src: "/portfolio/new-zion-lpg/sales-report.webp",
        alt: "Sales report with date range filter and transactions table",
        caption: "Sales reports with date range filters and PDF export",
      },
      {
        src: "/portfolio/new-zion-lpg/user-management.webp",
        alt: "User management table with roles and last login",
        caption: "Role-based user management",
      },
    ],
  },
  {
    slug: "coop-tracking",
    client: "Private cooperative (PH)",
    title: "CoopTracker — member, loan, and shares management for a local co-op",
    summary:
      "A mobile-first cooperative management web app: members, contributions, loans with interest and balances, share holdings with per-share pricing, a running ledger of collections and disbursements, period archives, and per-member equity and payment-compliance views. Officers run the whole co-op from their phones — no spreadsheets.",
    tags: [
      "Mobile-first",
      "Web app",
      "Dashboard",
      "Loans & shares",
      "Ledger",
    ],
    outcome: "The whole co-op runs from one phone screen",
    year: 2024,
    service: "custom-websites",
    accent: "from-emerald-500 to-cyan-500",
    body: {
      challenge:
        "A small private cooperative was running 15 members, monthly contributions, share holdings, and active loans across a stack of notebooks and a single shared Excel file. Officers couldn't answer 'how much equity does this member have right now?' without rebuilding totals by hand.",
      built: [
        "A mobile-first dashboard with the numbers officers actually quote at meetings: total balance, member count, active loans, and outstanding shares.",
        "A members module with search, paid-status indicators, and a per-member detail view showing total contributed, possible dividends, total equity, and payment compliance.",
        "Loans with status (active / pending), interest rate, term, monthly progress bar, and outstanding balance — all visible at a glance.",
        "Shares with auto-calculated per-share price from the interest pool and total shares, plus per-member holdings.",
        "A running ledger of collections vs disbursements with a beginning, current, and net balance, and yearly archives for audit.",
      ],
      result:
        "Officers now run the entire co-op from their phones during meetings. Contributions, loans, and share equity are always live, audit-ready, and visible to every officer at the same time.",
    },
    cover: {
      src: "/portfolio/coop-tracking/dashboard.webp",
      alt: "CoopTracker dashboard with total balance, members, loans, and shares",
    },
    gallery: [
      {
        src: "/portfolio/coop-tracking/dashboard.webp",
        alt: "Dashboard with totals and collection periods",
        caption: "Dashboard — balance, members, loans, shares, collection periods",
      },
      {
        src: "/portfolio/coop-tracking/members.webp",
        alt: "Members list with search, paid status, and total collected",
        caption: "Members — search, paid status, total collected",
      },
      {
        src: "/portfolio/coop-tracking/loans.webp",
        alt: "Loans list with status, outstanding balance, and interest earned",
        caption: "Loans — outstanding balance, interest earned, term progress",
      },
      {
        src: "/portfolio/coop-tracking/shares.webp",
        alt: "Shares overview with total shares, interest pool, and per-share price",
        caption: "Shares — interest pool, per-share price, holdings per member",
      },
      {
        src: "/portfolio/coop-tracking/ledger.webp",
        alt: "Ledger with collections, disbursements, and running balance",
        caption: "Ledger — collections, disbursements, and a running balance",
      },
      {
        src: "/portfolio/coop-tracking/archives.webp",
        alt: "Archives list grouping past years and periods",
        caption: "Archives — past years and periods, kept for audit",
      },
      {
        src: "/portfolio/coop-tracking/member-detail.webp",
        alt: "Member detail with contributions, dividends, equity, and compliance",
        caption: "Member detail — equity, dividends, payment compliance, history",
      },
    ],
  },
  {
    slug: "371admin",
    client: "X-Meta Technologies",
    title: "371admin — out-of-home ads operations & device fleet platform",
    summary:
      "An internal operations platform for an out-of-home advertising network: campaign and booking management with full VAT/WHT financials, a play-plan builder that links charge playplans to connected screens, real-time e-jeep device and SIM monitoring with expiry alerts, a program library with video previews and schedules, and take-away order management — all in one admin panel.",
    tags: [
      "Admin panel",
      "Dashboard",
      "Reporting",
      "Device monitoring",
      "Campaign management",
      "Play plan",
    ],
    outcome: "One platform for ads, devices, and finance",
    year: 2024,
    service: "business-dashboards",
    accent: "from-violet-500 to-cyan-500",
    body: {
      challenge:
        "X-Meta operates an out-of-home advertising network on transit screens — hundreds of e-jeep devices in the field, SIMs that expire on different dates, ad campaigns with VAT and withholding tax, and a content team pushing video playlists to specific screens. The pieces lived in five different tools and three spreadsheets.",
      built: [
        "An overview dashboard surfacing the metrics nobody had in one place before: order volume, online devices, SIM expiry alerts within 30/60/90 days, and a 30-day trend chart.",
        "Campaign and booking management with a 'Create Booking' form that captures the ad details on one side and the full financial side (VATABLE Sales, VAT 12%, WHT %, settlement type, payment status) on the other — calculated as you type.",
        "Live device monitoring grouped by transport service corporation, showing online/offline status, vehicle details, and per-device data usage.",
        "A program library with searchable video previews, durations, play limits, and active schedules — so the content team can audit what's deployed without calling ops.",
        "A 'Play Plan MVP' that imports a charge playplan and links it directly to connected screens, removing a manual mapping step that used to take hours.",
        "Take-away order management as a board view, plus recruitment and sales documents under the same roof.",
      ],
      result:
        "Ads ops, finance, and field operations now share one source of truth. SIM cards stop being forgotten until they fail, bookings land with their numbers already reconciled, and the playplan-to-screen handoff is a single click.",
    },
    cover: {
      src: "/portfolio/371admin/overview-dashboard.webp",
      alt: "X-Meta 371admin overview dashboard with device, SIM, and ad metrics",
    },
    gallery: [
      {
        src: "/portfolio/371admin/overview-dashboard.webp",
        alt: "Overview dashboard with order volume, devices, SIM expiry, and trend chart",
        caption: "Overview — order volume, devices, SIM expiry alerts, trends",
      },
      {
        src: "/portfolio/371admin/campaign-list.webp",
        alt: "Campaign list with clients, partners, screen types, and statuses",
        caption: "Campaign list — clients, partners, screens, status at a glance",
      },
      {
        src: "/portfolio/371admin/create-booking.webp",
        alt: "Create new advertisement booking with booking and financial information",
        caption: "Create booking — booking details paired with VAT/WHT financials",
      },
      {
        src: "/portfolio/371admin/device-monitoring.webp",
        alt: "Online E-Jeep devices monitoring with status, vehicle, and data usage",
        caption: "E-Jeep device monitoring — live status, vehicle info, data usage",
      },
      {
        src: "/portfolio/371admin/play-plan.webp",
        alt: "Play Plan MVP linking charge playplan to connected screens",
        caption: "Play Plan — link a charge playplan to live connected screens",
      },
      {
        src: "/portfolio/371admin/program-details.webp",
        alt: "Program details modal with video preview and schedule info",
        caption: "Program library — video previews, durations, active schedules",
      },
      {
        src: "/portfolio/371admin/takeaway-orders.webp",
        alt: "Take away orders board with customer cards and ordered items",
        caption: "Take-away orders board — every active order at a glance",
      },
    ],
  },
  {
    slug: "ipay-international",
    client: "IPAY International",
    title: "IPAY International — corporate site for a BSP-registered payments operator",
    summary:
      "A polished marketing site for a BSP-registered, OPSCOR-licensed payments infrastructure company. Communicates a complex enterprise offering — payment acceptance, billing & invoicing, disbursement, reconciliation, and APIs — through a clean, segmented narrative for SMEs, institutions, and platform partners, with a focused proposal-request flow at the end.",
    tags: [
      "Marketing site",
      "Next.js",
      "Tailwind CSS",
      "Fintech",
      "Lead capture",
    ],
    outcome: "Enterprise credibility in a single scroll",
    year: 2025,
    service: "website-creation",
    accent: "from-orange-500 to-amber-500",
    body: {
      challenge:
        "IPAY International is a BSP-registered, OPSCOR-licensed payments operator selling enterprise infrastructure — payment acceptance, billing, disbursement, reconciliation, APIs. Their old site read like a brochure; CFOs and ops leads couldn't tell within five seconds whether IPAY was a serious option or a startup wrapper.",
      built: [
        "A hero that leads with the trust signals the audience actually filters on (BSP-Registered, OPSCOR-licensed, Enterprise Grade) and a dual CTA — 'Request Proposal' for buyers, 'Explore Services' for evaluators.",
        "A 'Who We Serve' section that segments the offering for SMEs, institutions, and platforms / systems integrators — each with photography that mirrors the audience.",
        "A 'Core Capabilities' section breaking the platform into four named pillars (Payment Acceptance, Billing & Invoicing, Disbursement, Reconciliation & APIs) so prospects can self-route.",
        "A 'How It Works' module that names the operational pains it replaces (manual reconciliation, fragmented infrastructure, compliance gaps) instead of pitching features in the abstract.",
        "A 'Unified Controls' value prop with three pillars (Integration / Role-based Governance / Real-time Monitoring) — the language enterprise IT and finance leaders use.",
        "A trusted-ecosystem strip showing GCash, Maya, Grab, instaPay, and Shopee partnerships, plus a low-friction 'Request a Proposal' form scoped to start a sales conversation, not collect everything.",
      ],
      result:
        "A site that does the qualifying for sales. Prospects arrive, find the trust signals, route themselves to the right capability, and either book a proposal or self-serve from the app store badges in the footer. The marketing team can update copy without a developer.",
    },
    cover: {
      src: "/portfolio/ipay/hero.webp",
      alt: "IPAY International homepage hero with the headline Powering Seamless Business Payments Across the Philippines",
    },
    gallery: [
      {
        src: "/portfolio/ipay/hero.webp",
        alt: "Hero section with headline, compliance badges, and dual CTAs",
        caption: "Hero — compliance badges (BSP / OPSCOR) and dual CTAs",
      },
      {
        src: "/portfolio/ipay/who-we-serve.webp",
        alt: "Who We Serve section with three audience cards",
        caption: "Who We Serve — SMEs, institutions, platforms & systems",
      },
      {
        src: "/portfolio/ipay/services.webp",
        alt: "Core capabilities section with payment acceptance, billing, and disbursement cards",
        caption: "Core capabilities — acceptance, billing & invoicing, disbursement",
      },
      {
        src: "/portfolio/ipay/how-it-works.webp",
        alt: "How It Works section explaining the move from fragmented manual processes to one infrastructure",
        caption: "How It Works — fragmented manual ops replaced with one infra",
      },
      {
        src: "/portfolio/ipay/unified-controls.webp",
        alt: "Unified controls section highlighting integration, governance, and monitoring",
        caption: "Unified controls — integration, role-based access, real-time monitoring",
      },
      {
        src: "/portfolio/ipay/partners.webp",
        alt: "Partners section with GCash, Maya, Grab, instaPay, and Shopee logos",
        caption: "Partners — GCash, Maya, Grab, instaPay, Shopee",
      },
      {
        src: "/portfolio/ipay/request-proposal.webp",
        alt: "Request a Proposal form with full name, company, email, contact and message fields",
        caption: "Proposal request — focused, low-friction lead capture",
      },
      {
        src: "/portfolio/ipay/footer.webp",
        alt: "Footer with navigation, app store badges, and compliance credentials",
        caption: "Footer — app store badges and compliance credentials",
      },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return portfolio.find((c) => c.slug === slug);
}
