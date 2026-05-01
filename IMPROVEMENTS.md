# IMPROVEMENTS.md — KDV Website Services

Feature roadmap for the marketing site. Scope is **what to build next**, not what copy to swap in (see `PROJECT_INFO.md` for content gaps).

Every item is filtered through one question: **does this help a PH MSME owner trust, evaluate, or contact KDV faster?** If the answer is "not really," it's not in here.

---

## Workflow rule (read first)

This file is the single source of truth for what's shipped, what's mid-flight, and what's untouched. Every item carries a status:

- 🔴 **Not started** — nothing has been done yet
- 🟡 **In progress** — partial work has shipped; some `🔲` steps still open
- 🟢 **Done** — every step is `✅` and the feature is live in production

**The rule:** the moment you start an item, flip its **Status** to 🟡 and check off (`🔲` → `✅`) the step you just finished. The moment all steps are `✅`, flip the **Status** to 🟢. Never claim 🟢 if any `🔲` remains — partial work stays 🟡.

Tell Claude *"start item X.Y"* or *"mark item X.Y done"* and it will keep this file honest.

When promoting an item from "out of scope" into a tier (or vice versa), edit both sections in the same change so the doc stays internally consistent.

---

## How to read this

- **Tier 1** — Direct lead conversion. Build first.
- **Tier 2** — Trust signals. Build after Tier 1.
- **Tier 3** — Organic growth (SEO, content surface area).
- **Tier 4** — Recurring revenue paths.
- **Tier 5** — Compliance & operations.
- **Tier 6** — Nice-to-have polish.

Each item has a **Why** (business reason), **How** (one-line implementation), and numbered **Steps** (concrete, ordered, checkable).

---

## Tier 1 — Lead conversion

### 1.1 Calendar booking embed on `/contact`
**Status:** 🔴 Not started

**Why.** PH MSME owners almost always want a 15-min call before paying anything. Email-only forces a back-and-forth thread that loses momentum. Self-booking removes the bottleneck and signals "this is a real operator."

**How.** Cal.com (free tier) inline embed next to `ContactForm.tsx`. Keep the form — some clients still prefer async.

**Steps:**
1. 🔲 Sign up at cal.com, create a 15-min "Discovery call" event type with PH timezone, set availability windows
2. 🔲 Copy the inline embed snippet from cal.com → `</> embed` → React
3. 🔲 Install the Cal.com React package: `npm i @calcom/embed-react`
4. 🔲 Create `components/site/CalEmbed.tsx` (client component) wrapping `<Cal />` with theme="dark" and the brand indigo as the primary color
5. 🔲 Add it to `app/contact/page.tsx` as a third panel ("Email · Form · Book a call") or above the form on mobile
6. 🔲 Test: pick a slot, confirm booking lands in your calendar and an email arrives
7. 🔲 Mark Status 🟢 Done

---

### 1.2 WhatsApp / Viber / Messenger contact channel
**Status:** 🟡 In progress

**Why.** PH SMB owners live in WhatsApp/Viber/Messenger. Forcing them through a contact form drops conversion meaningfully. This is the single most PH-local improvement available.

**How.** Add channels to `lib/site.ts`, surface in `Footer.tsx` and the contact-page sidebar, plus a floating "Chat on WhatsApp" pill on mobile. Use deep links — no SDK.

**Steps:**
1. ✅ Add `whatsapp`, `viber`, `messenger` fields to the `site` const in `lib/site.ts` (WhatsApp format: `https://wa.me/63XXXXXXXXXX`, Viber: `viber://chat?number=%2B63XXXXXXXXXX`, Messenger: `https://m.me/<page-handle>`)
3. ✅ Add a "Chat with me" block in the contact page sidebar (`app/contact/page.tsx`) with the three channel links above the existing email row
4. ✅ Add channel icons to `Footer.tsx` next to the existing email link
5. ✅ Create `components/site/MobileChatPill.tsx` — a floating bottom-right pill linking to WhatsApp, only visible on `<md` breakpoint, hidden on `/contact`
6. ✅ Mount the pill in `app/layout.tsx` next to `<TawkChat />`
7. 🔲 Test the deep links on a real phone (desktop browsers fail silently)
8. 🔲 Mark Status 🟢 Done

---

### 1.3 Quick Quote / project estimator
**Status:** 🔴 Not started

**Why.** Posted prices start at ₱25k / ₱85k / "quoted" — but a prospect with a 4-page bakery site has no way to know if their job is ₱25k or ₱60k. A 3-question wizard returning a price band qualifies leads in 30 seconds and pre-warms them for the contact form.

**How.** New route `app/estimate/page.tsx`, client component, no backend. Output is a price band, recommended service slug, and a CTA into `/contact?service=...&budget=...`.

**Steps:**
1. 🔲 Create `app/estimate/page.tsx` with metadata, hero, and a `<EstimatorWizard />` client component
2. 🔲 Build `components/site/EstimatorWizard.tsx` with 3 questions: project type (dropdown of `services` from `lib/services.ts`), scope (small / medium / large), urgency (no rush / 1 month / ASAP)
3. 🔲 Add a pricing matrix function (`lib/estimator.ts`) that maps the 3 inputs → a `{ low, high, recommendedSlug }` band
4. 🔲 Render the result with a "Continue to contact" button that links to `/contact?service=<slug>&budget=<band>`
5. 🔲 Update `ContactForm.tsx` to pre-select `service` and `budget` defaults from URL search params (use `useSearchParams`)
6. 🔲 Add `Estimate` to the nav in `lib/site.ts` (or just CTA to it from the home Hero secondary button)
7. 🔲 Mark Status 🟢 Done

---

### 1.4 Auto-reply email on contact form submit
**Status:** 🔴 Not started

**Why.** Right now the form shows a toast and goes silent. Submitters wonder "did it send?" An auto-reply confirms receipt, restates the response window, and offers the calendar link as a parallel path.

**How.** Inside `app/actions/contact.ts`, after the existing Resend send-to-Keith call, fire a second Resend send to the submitter.

**Steps:**
1. 🔲 Create `lib/emails/auto-reply.tsx` (or `.ts` if not using react-email) with a branded HTML template — KDV header, "Thanks for reaching out", expected reply window, Cal.com link (after 1.1 ships), portfolio link
2. 🔲 In `app/actions/contact.ts`, after the existing `resend.emails.send` to Keith, add a second send: `from: CONTACT_FROM_EMAIL`, `to: parsed.email`, `subject: "Got your message — KDV Website Services"`, body from template
3. 🔲 Wrap the second send in try/catch — auto-reply failure must NOT fail the whole form (the lead notification is more important)
4. 🔲 Test with a real address; verify the auto-reply lands in Inbox not Spam (may need Resend domain verification)
5. 🔲 Mark Status 🟢 Done

---

### 1.5 Persistent CTA on long pages
**Status:** 🔴 Not started

**Why.** Case study and service pages can scroll for 4+ screens on mobile. The only CTA is at the bottom (`CTASection`). A sticky bottom CTA captures decisions made mid-scroll.

**How.** A `StickyCTA` client component on `/services/[slug]` and `/portfolio/[slug]`. Hidden on `/contact`. Respect reduced-motion.

**Steps:**
1. 🔲 Create `components/site/StickyCTA.tsx` (client) — fixed bottom-right pill with "Start a project →", appears after scrolling 50% of page height, slides in with framer-motion
2. 🔲 Use `useReducedMotion` to skip the slide animation when preferred
3. 🔲 Add `usePathname` check inside so it self-hides on `/contact`
4. 🔲 Mount in `app/portfolio/[slug]/page.tsx` and `app/services/[slug]/page.tsx`
5. 🔲 Make sure it doesn't overlap with `<MobileChatPill />` (1.2) — stack vertically or alternate corners
6. 🔲 Mark Status 🟢 Done

---

### 1.6 Live chat widget (Tawk.to)
**Status:** 🟢 Done

**Why.** PH MSME owners often message before they email. A live chat widget gives them a low-friction way to ask "do you do X?" or "how much for Y?" without committing to a form. Tawk.to is fully free and has a mobile app for replying on the go — fits a solo operator.

**How.** Tawk.to embed loaded via `next/script` in `components/site/TawkChat.tsx`. Hidden on `/contact` to avoid two competing CTAs. Disabled entirely when env vars are missing (silent in dev).

**Steps:**
1. ✅ Scaffold `components/site/TawkChat.tsx` with `usePathname`-based hide on `/contact`, `Tawk_API.hideWidget/showWidget` toggling, and lazy script load
2. ✅ Add `NEXT_PUBLIC_TAWK_PROPERTY_ID` and `NEXT_PUBLIC_TAWK_WIDGET_ID` to `.env.example` with inline instructions
3. ✅ Mount `<TawkChat />` in `app/layout.tsx` after `<Toaster />`
4. ✅ Sign up at https://tawk.to (free), create a property for `kdvwebsiteservices.com`
5. ✅ In Tawk dashboard → Administration → Channels → Chat Widget, copy the **Property ID** (24-char) and **Widget ID** (usually `default`) from the embed snippet
6. ✅ Add to local `.env.local`: `NEXT_PUBLIC_TAWK_PROPERTY_ID=...` and `NEXT_PUBLIC_TAWK_WIDGET_ID=default`
7. ✅ Add the same vars to Vercel project settings (Settings → Environment Variables) so production picks them up
8. ✅ Run `npm run dev`, verify the widget appears bottom-right on `/`, `/services`, `/portfolio`, `/about`, and is **hidden on `/contact`**
9. ✅ In Tawk dashboard, customize: brand color to indigo `#6366f1`, set offline message + business hours (PH timezone), upload KDV logo as the widget avatar
10. ✅ Install the Tawk.to mobile app (iOS/Android) and log in so chats reach your phone
11. ✅ Smoke-test: open the deployed site in incognito, send a chat, confirm phone notification fires
12. ✅ Mark Status 🟢 Done

---

## Tier 2 — Trust signals

### 2.1 Credentials block
**Status:** 🔴 Not started

**Why.** PH MSMEs (especially institutional — schools, co-ops, LGUs) check for DTI / BIR registration before paying a freelancer. Surfacing them upfront removes a silent objection.

**How.** Small section on `/about` and a compact strip in `Footer.tsx`: DTI Business Name, BIR TIN (if comfortable), years freelancing, NDA-ready.

**Steps:**
1. 🔲 Decide which credentials to publish (DTI cert number? BIR TIN? Or just "DTI-registered, BIR-registered" without numbers)
2. 🔲 Add a `credentials` array to `lib/site.ts` (e.g. `[{ label: "DTI Registered", icon: "shield-check" }, ...]`)
3. 🔲 Build a `<Credentials />` block in `components/site/` rendering icon + label cards
4. 🔲 Place it in `app/about/page.tsx` between the bio and the values section
5. 🔲 Add a slimmer one-line variant inside `Footer.tsx`
6. 🔲 Mark Status 🟢 Done

---

### 2.2 Quantified case study outcomes
**Status:** 🔴 Not started

**Why.** Current outcomes are qualitative ("One unified workflow across branches"). Numbers convert. "Cut order processing from 12 min to 2 min" hits harder than "streamlined ordering."

**How.** Add an optional `metrics` field to `CaseStudy` in `lib/portfolio.ts`. Render as a strip on `app/portfolio/[slug]/page.tsx` using the existing `CountUp` component.

**Steps:**
1. 🔲 Collect real numbers from each client (call Toots, the coop officer, Sai — ask for a single hard number per project)
2. 🔲 Extend the `CaseStudy` type in `lib/portfolio.ts` with `metrics?: { label: string; value: number; suffix?: string; prefix?: string }[]`
3. 🔲 Populate the field for each of the 4 case studies (skip if no real number — never invent)
4. 🔲 Build `<CaseStudyMetrics metrics={...} />` in `components/site/` rendering 2–4 stat cards using `CountUp`
5. 🔲 Mount it in `app/portfolio/[slug]/page.tsx` between the hero block and the body section
6. 🔲 Mark Status 🟢 Done

---

### 2.3 Trust bar logo assets
**Status:** 🔴 Not started

**Why.** Already flagged in `PROJECT_INFO.md` (item 10). The trust bar text-falls-back, which reads as unfinished. Lowest-effort credibility bump on the site.

**How.** Source SVGs into `/public/logos/`. `LogoMark` already handles the swap.

**Steps:**
1. 🔲 Download official brand SVGs: GCash, Maya, PayMongo, BPI (use brand-press kits or Simple Icons where available — confirm permission for each)
2. 🔲 Save into `/public/logos/` with the exact filenames referenced in `lib/logos.ts`: `gcash.svg`, `maya.svg`, `paymongo.svg`, `bpi.svg`
3. 🔲 Verify each SVG renders monochrome white (override `fill` in CSS if not)
4. 🔲 Confirm `LogoMark` no longer falls back to text on the home page trust bar
5. 🔲 Mark Status 🟢 Done

---

### 2.4 "Process in their words" — short audio clip from a real client
**Status:** 🔴 Not started

**Why.** A 30-second voice clip is more persuasive than any paragraph. PH B2B buying is heavily relationship-driven; hearing another business owner closes faster than written copy.

**How.** Optional `audio` field on each testimonial, rendered as a small inline `<audio>` element.

**Steps:**
1. 🔲 Ask one client (Toots is the easiest ask) for a 20–30s voice memo answering "what changed after we shipped X?"
2. 🔲 Get explicit written permission to publish the clip
3. 🔲 Compress to ~64 kbps mono mp3 (target <500 KB), save as `/public/audio/<client>.mp3`
4. 🔲 Add `audio?: string` field to the Testimonial type in `Testimonials.tsx`
5. 🔲 Render `<audio controls preload="none" />` next to the quote when present
6. 🔲 Mark Status 🟢 Done

---

### 2.5 Per-page OpenGraph images (auto-generated)
**Status:** 🔴 Not started

**Why.** Every link shared in Viber/Messenger/Slack/WhatsApp shows an OG card. A generic site-wide card hurts CTR. Per-page cards look like a real product, not a template.

**How.** Next.js `app/[route]/opengraph-image.tsx` route handler with `next/og`. Static generation, zero runtime cost.

**Steps:**
1. 🔲 Create `app/opengraph-image.tsx` for the home page — KDV logo + tagline on the brand gradient background
2. 🔲 Create `app/portfolio/[slug]/opengraph-image.tsx` reading `study.title`, `study.outcome`, and `study.cover.src` (use as background with overlay)
3. 🔲 Create `app/services/[slug]/opengraph-image.tsx` rendering service title + tagline
4. 🔲 Set the runtime to `"edge"` for fast generation
5. 🔲 Test cards via the LinkedIn Post Inspector and Twitter Card Validator (or Open Graph debugger)
6. 🔲 Mark Status 🟢 Done

---

## Tier 3 — Organic growth (SEO + content surface)

### 3.1 Blog / Insights section
**Status:** 🔴 Not started

**Why.** Right now KDV ranks only for branded searches. "POS system Philippines", "small business dashboard PH", "GCash integration small business", "website cost Philippines" are searches MSME owners do *while* deciding. Capturing those at top of funnel feeds Tier 1 conversion.

**How.** New `app/insights/[slug]/page.tsx` reading from MDX in `content/insights/`.

**Steps:**
1. 🔲 Install MDX dependencies: `npm i @next/mdx @mdx-js/loader @mdx-js/react gray-matter`
2. 🔲 Configure MDX in `next.config.ts`
3. 🔲 Create `content/insights/` directory and one starter post: `content/insights/website-cost-philippines.mdx` with frontmatter (`title`, `description`, `date`, `cover`)
4. 🔲 Build `lib/insights.ts` — utility to glob all MDX files, parse frontmatter, return sorted list
5. 🔲 Build `app/insights/page.tsx` — list of all posts (cards, similar style to `PortfolioGrid`)
6. 🔲 Build `app/insights/[slug]/page.tsx` — full post renderer with prose styling, table of contents, related-services CTA at bottom
7. 🔲 Add "Insights" to nav in `lib/site.ts` (after first 3 posts published)
8. 🔲 Add JSON-LD `Article` schema per post
9. 🔲 Add to `app/sitemap.ts`
10. 🔲 Mark Status 🟢 Done

---

### 3.2 Service-specific landing pages (PH-niche)
**Status:** 🔴 Not started

**Why.** Generic "Website Creation" ranks against thousands. "POS for PH LPG distributors", "Restaurant ordering PH", "Cooperative management web app PH" are long-tail terms with low competition and high intent — exactly KDV's case study sweet spots.

**How.** New routes under `app/solutions/<niche>/page.tsx`, each reusing an existing case study as proof.

**Steps:**
1. 🔲 List 3 niches based on real case studies: `lpg-pos`, `coop-management`, `ad-ops-dashboard`
2. 🔲 Add `lib/solutions.ts` defining each niche: `slug`, `title`, `pain points`, `solution`, `proofCaseSlug`
3. 🔲 Build `app/solutions/[slug]/page.tsx` — hero with the niche, pain bullets, "what we built last time" pulling from `getCaseStudy(proofCaseSlug)`, CTA to `/contact?service=...`
4. 🔲 Add metadata + JSON-LD `Service` schema per page
5. 🔲 Add all 3 routes to `app/sitemap.ts`
6. 🔲 Mark Status 🟢 Done

---

### 3.3 LocalBusiness JSON-LD with PH address
**Status:** 🔴 Not started

**Why.** Home already emits `ProfessionalService` JSON-LD (`app/page.tsx:13`). Adding `LocalBusiness` with a PH address (region-level OK) helps Google local pack visibility for "web developer near me" searches.

**How.** Extend the existing `jsonLd` object on `app/page.tsx`.

**Steps:**
1. 🔲 Decide privacy boundary — full address, NCR-only region, or just country (`PH`). Region-only is the usual freelancer choice
2. 🔲 In `app/page.tsx`, extend `jsonLd`: `"@type": ["ProfessionalService", "LocalBusiness"]`, add `address: { "@type": "PostalAddress", addressCountry: "PH", addressRegion: "<region>" }`, `priceRange: "₱₱"`, `telephone` (use WhatsApp number from 1.2 if comfortable)
3. 🔲 Validate the markup at https://validator.schema.org/
4. 🔲 Submit the homepage to Google Search Console for re-indexing
5. 🔲 Mark Status 🟢 Done

---

### 3.4 Sitemap completeness audit
**Status:** 🔴 Not started

**Why.** `app/sitemap.ts` exists but as new routes (insights, solutions, estimate) ship, they need to land in the sitemap automatically.

**How.** Refactor `sitemap.ts` to glob from `lib/portfolio.ts`, `lib/services.ts`, `lib/solutions.ts`, and `content/insights/`.

**Steps:**
1. 🔲 Open `app/sitemap.ts` and audit — confirm every static route is listed
2. 🔲 Extract a helper `lib/routes.ts` returning an array of all dynamic + static routes with `lastModified` and `priority`
3. 🔲 Refactor `sitemap.ts` to call the helper
4. 🔲 After each new feature ships (1.3 estimate, 3.1 insights, 3.2 solutions), confirm it appears in `/sitemap.xml`
5. 🔲 Mark Status 🟢 Done

---

### 3.5 Internal linking between case studies and services
**Status:** 🔴 Not started

**Why.** Case study → service link already exists (`app/portfolio/[slug]/page.tsx:52`), but services pages don't reciprocate with "see this in action" links to relevant case studies. Bidirectional linking improves dwell time and SEO.

**How.** Add a "Recent work in this service" strip on `/services/[slug]` filtering `portfolio` by matching `service`.

**Steps:**
1. 🔲 In `app/services/[slug]/page.tsx`, after the deliverables block, add a section: "Recent work in this service"
2. 🔲 Filter `portfolio` from `lib/portfolio.ts` by `c.service === params.slug`
3. 🔲 Render up to 3 matching case studies as compact cards (reuse the `FeaturedCard` markup or a slim variant)
4. 🔲 Hide the section if no matching case studies exist
5. 🔲 Mark Status 🟢 Done

---

## Tier 4 — Recurring revenue

### 4.1 Care plans / maintenance retainer page
**Status:** 🔴 Not started

**Why.** Solo operators live or die on retainers. After a website ships, the client needs hosting checks, copy edits, security patches, content additions. Most won't proactively ask — but they'll opt in to a monthly plan if it's offered upfront.

**How.** New `app/care/page.tsx` with three tiers (Essentials / Growth / Priority).

**Steps:**
1. 🔲 Decide pricing for 3 tiers (e.g. Essentials ₱4,500/mo, Growth ₱9,500/mo, Priority ₱18,000/mo) and what each includes (hours/month, response SLA, scope)
2. 🔲 Add `lib/care-plans.ts` exporting the 3 tiers with type `CarePlan`
3. 🔲 Build `app/care/page.tsx` — hero, 3-tier pricing grid, FAQ specific to retainers, CTA to `/contact?service=care&plan=<tier>`
4. 🔲 Add metadata + JSON-LD `Offer` schema
5. 🔲 Add a "Care plans" callout strip at the bottom of `/services/[slug]` and `/portfolio/[slug]` pages
6. 🔲 Add `Care` to the nav in `lib/site.ts` (or surface via Footer only — your call)
7. 🔲 Mark Status 🟢 Done

---

### 4.2 Add-ons grid on each service page
**Status:** 🔴 Not started

**Why.** Add-ons (copywriting, GA4 setup, additional pages, monthly SEO) increase average project value with zero new lead cost. Currently they exist informally in conversations but aren't surfaced.

**How.** Add `addOns` to the `Service` type in `lib/services.ts`, render as a grid on `/services/[slug]`.

**Steps:**
1. 🔲 List 4–6 typical add-ons with PHP prices (e.g. Copywriting +₱8k, Logo polish +₱5k, GA4 setup +₱3k, Additional page +₱4k each)
2. 🔲 Extend `Service` type in `lib/services.ts` with `addOns?: { title, price, description }[]`
3. 🔲 Populate the field for all 3 services
4. 🔲 Build `<ServiceAddOns />` component rendering as a 2-column grid
5. 🔲 Mount it in `app/services/[slug]/page.tsx` between the deliverables and the FAQ
6. 🔲 Mark Status 🟢 Done

---

## Tier 5 — Compliance & operations

### 5.1 Privacy Policy & Terms pages
**Status:** 🔴 Not started

**Why.** Required under the PH Data Privacy Act (RA 10173) the moment any form collects personal data. Current contact form already triggers this. Missing policy = legal exposure and credibility hit for institutional clients.

**How.** Two static pages: `/privacy` and `/terms`, linked from `Footer.tsx`.

**Steps:**
1. 🔲 Draft Privacy Policy with: data controller (KDV / Keith Vergara, contact email), data collected (name, email, company, message, IP via analytics), purpose (responding to inquiries), retention (e.g. 24 months), sharing (none / processors only — Resend, Vercel, analytics provider), data subject rights, contact for requests
2. 🔲 Draft Terms of Service with: scope, payment terms (50/50, GCash/Maya/bank), IP ownership (client owns deliverables on full payment), warranties / limitations, governing law (PH)
3. 🔲 Have both reviewed by a PH-qualified lawyer before publishing (worth the one-time cost)
4. 🔲 Create `app/privacy/page.tsx` and `app/terms/page.tsx` — plain prose, container-page layout
5. 🔲 Add both links to `Footer.tsx`
6. 🔲 Mark Status 🟢 Done

---

### 5.2 Privacy consent on the contact form
**Status:** 🔴 Not started

**Why.** Same regulation. Submission must require explicit consent: "I agree to KDV processing my information to respond to this inquiry."

**How.** Required checkbox in `ContactForm.tsx`, validated in the Zod schema in `app/actions/contact.ts`.

**Steps:**
1. 🔲 Add a required `consent` checkbox to `ContactForm.tsx` above the submit button — label links to `/privacy`
2. 🔲 Extend the Zod schema in `app/actions/contact.ts` to require `consent: z.literal("on")` (or boolean true)
3. 🔲 Surface a clear field error if unchecked
4. 🔲 Verify the form refuses to submit without the checkbox via real browser test
5. 🔲 Depends on 5.1 (the link must point at a live `/privacy`)
6. 🔲 Mark Status 🟢 Done

---

### 5.3 Analytics (privacy-friendly)
**Status:** 🔴 Not started

**Why.** Without analytics, there's no way to know which pages convert, which case studies hold attention, or where visitors drop. Tier 1–4 work blind otherwise.

**How.** Plausible (paid, no cookie banner needed) — better fit than GA4 for a small marketing site.

**Steps:**
1. 🔲 Sign up at https://plausible.io, add `kdvwebsiteservices.com`
2. 🔲 Copy the script tag from Plausible → Site Settings
3. 🔲 Add `<Script src="https://plausible.io/js/script.js" data-domain="kdvwebsiteservices.com" strategy="afterInteractive" />` to `app/layout.tsx`
4. 🔲 Set up custom events: contact form submit, estimator complete, calendar booking — call `plausible('event-name')` from the relevant client components
5. 🔲 Mark Status 🟢 Done

---

### 5.4 Error monitoring
**Status:** 🔴 Not started

**Why.** A silently broken contact form = lost leads. Sentry catches the next Resend outage before a client tells Keith.

**How.** Sentry free tier is plenty.

**Steps:**
1. 🔲 Sign up at https://sentry.io, create a Next.js project
2. 🔲 Run `npx @sentry/wizard@latest -i nextjs` and follow prompts
3. 🔲 Confirm `instrumentation.ts`, `sentry.client.config.ts`, `sentry.server.config.ts` are created
4. 🔲 Add `SENTRY_DSN` to Vercel env vars
5. 🔲 Trigger a test error from `app/actions/contact.ts` (temporarily) — verify it lands in Sentry
6. 🔲 Set up Slack/email alert for new issues
7. 🔲 Mark Status 🟢 Done

---

## Tier 6 — Polish

### 6.1 Image optimization audit
**Status:** 🔴 Not started

**Why.** `public/portfolio/new-zion-lpg/cover.png` is ~1.4 MB. Other case study covers likely similar. Mobile PH connections feel that on first paint.

**How.** Convert PNG covers to WebP/AVIF (quality 80). Target <250 KB per cover.

**Steps:**
1. 🔲 List every `.png` in `public/portfolio/` over 300 KB (`find public/portfolio -name "*.png" -size +300k`)
2. 🔲 For each, run `npx @squoosh/cli --webp '{quality:80}' <file>` (or use an online converter)
3. 🔲 Replace the file in place (keep `.png` extension or update `cover.src` references in `lib/portfolio.ts` to the new path)
4. 🔲 Re-run Lighthouse on `/portfolio/<slug>` to confirm LCP improvement
5. 🔲 Mark Status 🟢 Done

---

### 6.2 Skeleton states on dynamic routes
**Status:** 🔴 Not started

**Why.** Case study and service slug pages are statically generated, but if any data ever moves to a CMS, having `loading.tsx` files in place avoids layout shift.

**How.** Add `loading.tsx` files mirroring the page skeleton.

**Steps:**
1. 🔲 Create `app/portfolio/[slug]/loading.tsx` — matches the case study page structure with pulsing placeholders for hero, cover, body, gallery
2. 🔲 Create `app/services/[slug]/loading.tsx` — matches the service detail layout
3. 🔲 Create `app/insights/[slug]/loading.tsx` (if 3.1 has shipped)
4. 🔲 Verify they show during slow-network throttle in DevTools
5. 🔲 Mark Status 🟢 Done

---

### 6.3 Anchor links on long case studies
**Status:** 🔴 Not started

**Why.** Case study pages are long. A small in-page nav helps prospects skim to what they care about — usually the result.

**How.** Sticky sub-nav inside `app/portfolio/[slug]/page.tsx`, lg+ only, with scroll-spy.

**Steps:**
1. 🔲 Add `id` attributes to the section headings in `app/portfolio/[slug]/page.tsx`: `#challenge`, `#built`, `#result`, `#gallery`
2. 🔲 Build `components/site/CaseStudyNav.tsx` (client) — sticky sub-nav using `IntersectionObserver` to track active section
3. 🔲 Mount it inside the case study page, hidden below `lg:` breakpoint
4. 🔲 Smooth-scroll on click
5. 🔲 Mark Status 🟢 Done

---

### 6.4 404 with useful next steps
**Status:** 🔴 Not started

**Why.** Default 404 ends the visitor's journey. A custom one with "Back to work · Browse services · Contact" recovers a non-trivial slice.

**How.** `app/not-found.tsx` with the same chrome and three CTAs.

**Steps:**
1. 🔲 Create `app/not-found.tsx` with hero ("This page doesn't exist") and three buttons: Portfolio, Services, Contact
2. 🔲 Optionally include a search box (only if 3.1 insights has shipped and there's content to search)
3. 🔲 Verify the 404 status code is sent (check Network tab)
4. 🔲 Mark Status 🟢 Done

---

### 6.5 Reduced-motion stress test
**Status:** 🔴 Not started

**Why.** CLAUDE.md mandates `prefers-reduced-motion` respect. Worth a one-time audit pass with the OS setting enabled.

**How.** Manual pass on each route with `Settings → Accessibility → Reduce motion` enabled (macOS) or equivalent.

**Steps:**
1. 🔲 Enable reduce-motion at the OS level
2. 🔲 Visit every route — `/`, `/services`, each `/services/[slug]`, `/portfolio`, each `/portfolio/[slug]`, `/about`, `/contact`
3. 🔲 Note any animations still firing (Hero stagger, Magnetic, RouteProgress, Lightbox transitions)
4. 🔲 Wrap the offending animations in `useReducedMotion()` checks (pattern already used in `Hero.tsx`)
5. 🔲 Mark Status 🟢 Done

---

## Out of scope

These came up while drafting and were rejected — listed so they don't get re-proposed.

- **Client portal (file uploads, milestone tracking).** Useful, but it's product work — not marketing-site work. Belongs in a separate engagement-tooling repo, not here.
- **Tagalog / Taglish i18n.** PH MSME owners doing B2B buying read English fluently. Adds maintenance burden; payoff is small. Reconsider only if analytics show non-English traffic.
- **Light theme toggle.** The dark editorial look is a deliberate brand decision per `CLAUDE.md`. Toggling dilutes it.
- **Newsletter / lead magnet ebook.** Premature until Tier 3.1 (blog) is producing organic traffic to capture.
- **A/B testing infrastructure.** Traffic is too low for statistical significance. Revisit at >5k monthly visitors.

> **Promoted out of this list:** *Live chat widget* was originally listed here; it has been promoted to **Tier 1.6** at the user's direction (2026-04-28).

---

## Suggested execution order

If picking one item per week:

1. **1.6 Live chat widget** — already 🟡; finish steps 4–12 as soon as you create the Tawk account
2. **2.3 Trust bar logo assets** — half a day, unblocks a flagged item
3. **1.2 WhatsApp/Viber link** — half a day, biggest PH-local lift
4. **5.1 + 5.2 Privacy Policy + form consent** — one day; unblocks compliance
5. **1.1 Calendar booking** — one day
6. **1.4 Auto-reply email** — one day
7. **5.3 Analytics** — one day; needed to evaluate everything else
8. **2.5 Per-page OG images** — one day
9. **2.2 Quantified case study metrics** — gated on real numbers from clients
10. **4.1 Care plans page** — needs pricing decision first
11. **3.1 First two blog posts + `/insights` route** — start the SEO compounding

Tier 6 polish items can interleave whenever there's a 30-min gap.
