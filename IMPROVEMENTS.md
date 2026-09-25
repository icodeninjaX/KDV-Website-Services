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
**Status:** 🟢 Done

**Why.** PH MSME owners almost always want a 15-min call before paying anything. Email-only forces a back-and-forth thread that loses momentum. Self-booking removes the bottleneck and signals "this is a real operator."

**How.** Cal.com (free tier) inline embed surfaced as a tabbed panel in `ContactPanel.tsx` ("Send a message" / "Book a 15-min call"). Form stays the default tab — some clients still prefer async.

**Steps:**
1. ✅ Sign up at cal.com, create a 15-min event type with PH timezone, set availability windows (slug: `kdvwebservices/15min`)
2. ✅ Copy the inline embed snippet from cal.com → `</> embed` → React
3. ✅ Install the Cal.com React package: `npm i @calcom/embed-react`
4. ✅ Create `components/site/CalEmbed.tsx` (client component) wrapping `<Cal />` with brand violet `#a855f7` and `theme: "dark"`
5. ✅ Wire it into `app/contact/page.tsx` via new `ContactPanel.tsx` tab switcher (form default, calendar on second tab)
6. ✅ Test: pick a slot, confirm booking lands in your calendar and an email arrives
7. ✅ Mark Status 🟢 Done

---

### 1.2 WhatsApp / Viber / Messenger contact channel
**Status:** 🟢 Done

**Why.** PH SMB owners live in WhatsApp/Viber/Messenger. Forcing them through a contact form drops conversion meaningfully. This is the single most PH-local improvement available.

**How.** Add channels to `lib/site.ts`, surface in `Footer.tsx` and the contact-page sidebar. Deep links — no SDK. Floating mobile pill scoped out: contact-page badges + footer icons + Tawk widget already cover the mobile entry points without adding a third overlay.

**Steps:**
1. ✅ Add `whatsapp`, `viber`, `messenger` fields to the `site` const in `lib/site.ts` (WhatsApp format: `https://wa.me/63XXXXXXXXXX`, Viber: `viber://chat?number=%2B63XXXXXXXXXX`, Messenger: `https://m.me/<page-handle>`)
2. ✅ Add a "Chat with me" block in the contact page sidebar (`app/contact/page.tsx`) with the three channel links above the existing email row
3. ✅ Add channel icons to `Footer.tsx` next to the existing email link
4. ✅ Test the deep links on a real phone (desktop browsers fail silently)
5. ✅ Mark Status 🟢 Done

---

### 1.3 Quick Quote / project estimator
**Status:** 🟡 In progress

**Why.** Posted prices start at ₱25k / ₱85k / "quoted" — but a prospect with a 4-page bakery site has no way to know if their job is ₱25k or ₱60k. A 3-question wizard returning a price band qualifies leads in 30 seconds and pre-warms them for the contact form.

**How.** New route `app/estimate/page.tsx`, client component, no backend. Output is a price band, recommended service slug, and a CTA into `/contact?service=...&budget=...`.

**Steps:**
1. ✅ Create `app/estimate/page.tsx` with metadata, hero, and a `<EstimatorWizard />` client component
2. ✅ Build `components/site/EstimatorWizard.tsx` with 3 questions: project type (dropdown of `services` from `lib/services.ts`), scope (small / medium / large), urgency (no rush / 1 month / ASAP)
3. ✅ Add a pricing matrix function (`lib/estimator.ts`) that maps the 3 inputs → a `{ low, high, recommendedSlug }` band
4. ✅ Render the result with a "Continue to contact" button that links to `/contact?service=<slug>&budget=<band>`
5. ✅ Update `ContactForm.tsx` to pre-select `service` and `budget` defaults from URL search params (use `useSearchParams`)
6. ✅ Add `Estimate` to the nav in `lib/site.ts` (or just CTA to it from the home Hero secondary button)
7. 🔲 Mark Status 🟢 Done

---

### 1.4 Auto-reply email on contact form submit
**Status:** 🟡 In progress

**Why.** Right now the form shows a toast and goes silent. Submitters wonder "did it send?" An auto-reply confirms receipt, restates the response window, and offers the calendar link as a parallel path.

**How.** Inside `app/actions/contact.ts`, after the existing Resend send-to-Keith call, fire a second Resend send to the submitter.

**Steps:**
1. ✅ Create `lib/emails/auto-reply.tsx` (or `.ts` if not using react-email) with a branded HTML template — KDV header, "Thanks for reaching out", expected reply window, Cal.com link (after 1.1 ships), portfolio link
2. ✅ In `app/actions/contact.ts`, after the existing `resend.emails.send` to Keith, add a second send: `from: CONTACT_FROM_EMAIL`, `to: parsed.email`, `subject: "Got your message — KDV Website Services"`, body from template
3. ✅ Wrap the second send in try/catch — auto-reply failure must NOT fail the whole form (the lead notification is more important)
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

### 2.3 "Process in their words" — short audio clip from a real client
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

### 2.4 Per-page OpenGraph images (auto-generated)
**Status:** 🟡 In progress

**Why.** Every link shared in Viber/Messenger/Slack/WhatsApp shows an OG card. A generic site-wide card hurts CTR. Per-page cards look like a real product, not a template.

**How.** Next.js `app/[route]/opengraph-image.tsx` route handler with `next/og`. Static generation, zero runtime cost.

**Steps:**
1. ✅ Create `app/opengraph-image.tsx` for the home page — KDV logo + tagline on the brand gradient background
2. ✅ Create `app/portfolio/[slug]/opengraph-image.tsx` reading `study.title`, `study.outcome`, and `study.cover.src` (use as background with overlay)
3. ✅ Create `app/services/[slug]/opengraph-image.tsx` rendering service title + tagline
4. ✅ Set the runtime to `"edge"` for fast generation
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
**Status:** 🟡 In progress

**Why.** Home already emits `ProfessionalService` JSON-LD (`app/page.tsx:13`). Adding `LocalBusiness` with a PH address (region-level OK) helps Google local pack visibility for "web developer near me" searches.

**How.** Extend the existing `jsonLd` object on `app/page.tsx`.

**Steps:**
1. ✅ Decide privacy boundary — full address, NCR-only region, or just country (`PH`). Region-only is the usual freelancer choice
2. ✅ In `app/page.tsx`, extend `jsonLd`: `"@type": ["ProfessionalService", "LocalBusiness"]`, add country-only `PostalAddress`, and set `priceRange`
3. 🔲 Validate the markup at https://validator.schema.org/
4. 🔲 Submit the homepage to Google Search Console for re-indexing
5. 🔲 Mark Status 🟢 Done

---

### 3.4 Sitemap completeness audit
**Status:** 🟡 In progress

**Why.** `app/sitemap.ts` exists but as new routes (insights, solutions, estimate) ship, they need to land in the sitemap automatically.

**How.** Refactor `sitemap.ts` to glob from `lib/portfolio.ts`, `lib/services.ts`, `lib/solutions.ts`, and `content/insights/`.

**Steps:**
1. ✅ Open `app/sitemap.ts` and audit — confirm every static route is listed
2. ✅ Extract a helper `lib/routes.ts` returning an array of all dynamic + static routes with `lastModified` and `priority`
3. ✅ Refactor `sitemap.ts` to call the helper
4. ✅ After each new feature ships (1.3 estimate, 3.1 insights, 3.2 solutions), confirm it appears in `/sitemap.xml`
5. 🔲 Mark Status 🟢 Done

---

### 3.5 Internal linking between case studies and services
**Status:** 🟡 In progress

**Why.** Case study → service link already exists (`app/portfolio/[slug]/page.tsx:52`), but services pages don't reciprocate with "see this in action" links to relevant case studies. Bidirectional linking improves dwell time and SEO.

**How.** Add a "Recent work in this service" strip on `/services/[slug]` filtering `portfolio` by matching `service`.

**Steps:**
1. ✅ In `app/services/[slug]/page.tsx`, after the deliverables block, add a section: "Recent work in this service"
2. ✅ Filter `portfolio` from `lib/portfolio.ts` by `c.service === params.slug`
3. ✅ Render up to 3 matching case studies as compact cards (reuse the `FeaturedCard` markup or a slim variant)
4. ✅ Hide the section if no matching case studies exist
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
**Status:** 🟡 In progress

**Why.** Required under the PH Data Privacy Act (RA 10173) the moment any form collects personal data. Current contact form already triggers this. Missing policy = legal exposure and credibility hit for institutional clients.

**How.** Two static pages: `/privacy` and `/terms`, linked from `Footer.tsx`.

**Steps:**
1. ✅ Draft Privacy Policy with: data controller (KDV / Keith Vergara, contact email), data collected (name, email, company, message, IP via analytics), purpose (responding to inquiries), retention (e.g. 24 months), sharing (none / processors only — Resend, Vercel, analytics provider), data subject rights, contact for requests
2. ✅ Draft Terms of Service with: scope, payment terms (50/50, GCash/Maya/bank), IP ownership (client owns deliverables on full payment), warranties / limitations, governing law (PH)
3. 🔲 Have both reviewed by a PH-qualified lawyer before publishing (worth the one-time cost)
4. ✅ Create `app/privacy/page.tsx` and `app/terms/page.tsx` — plain prose, container-page layout
5. ✅ Add both links to `Footer.tsx`
6. 🔲 Mark Status 🟢 Done

---

### 5.2 Privacy consent on the contact form
**Status:** 🟡 In progress

**Why.** Same regulation. Submission must require explicit consent: "I agree to KDV processing my information to respond to this inquiry."

**How.** Required checkbox in `ContactForm.tsx`, validated in the Zod schema in `app/actions/contact.ts`.

**Steps:**
1. ✅ Add a required `consent` checkbox to `ContactForm.tsx` above the submit button — label links to `/privacy`
2. ✅ Extend the Zod schema in `app/actions/contact.ts` to require `consent: z.literal("on")` (or boolean true)
3. ✅ Surface a clear field error if unchecked
4. ✅ Verify the form refuses to submit without the checkbox via real browser test
5. ✅ Depends on 5.1 (the link must point at a live `/privacy`)
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
**Status:** 🟡 In progress

**Why.** `public/portfolio/new-zion-lpg/cover.png` is ~1.4 MB. Other case study covers likely similar. Mobile PH connections feel that on first paint.

**How.** Convert PNG covers to WebP/AVIF (quality 80). Target <250 KB per cover.

**Steps:**
1. ✅ List every `.png` in `public/portfolio/` over 300 KB (`find public/portfolio -name "*.png" -size +300k`)
2. ✅ For each, convert to WebP at quality 80+ using the existing `sharp` dependency
3. ✅ Replace the file in place (keep `.png` extension or update `cover.src` references in `lib/portfolio.ts` to the new path)
4. ✅ Re-run Lighthouse on `/portfolio/<slug>` to confirm LCP improvement
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
**Status:** 🟡 In progress

**Why.** Default 404 ends the visitor's journey. A custom one with "Back to work · Browse services · Contact" recovers a non-trivial slice.

**How.** `app/not-found.tsx` with the same chrome and three CTAs.

**Steps:**
1. ✅ Create `app/not-found.tsx` with hero ("This page doesn't exist") and three buttons: Portfolio, Services, Contact
2. ✅ Optionally include a search box (only if 3.1 insights has shipped and there's content to search)
3. ✅ Verify the 404 status code is sent (check Network tab)
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

### 6.6 Conversion-focused design audit and refinement

**Mobile hero follow-up (2026-09-15):** ✅ Implemented and verified locally; release remains covered by step 8 below. Hide the hero project preview and client-name row below 768px; retain the existing Selected work section and tablet/desktop presentation.
- ✅ Apply mobile-only visibility rules.
- ✅ Real-browser checks at 360/390/767/768/1440px confirmed mobile hiding, tablet/desktop visibility, and retained Selected work. Production build and lint passed; production-build mobile and desktop layouts visually inspected.
**Status:** 🟡 In progress — design implementation and reduced-motion fixes verified locally; third-party checks and release of follow-up fixes pending

**Why.** Make it easier for a Philippine MSME owner to understand the offer, evaluate actual work, and send a project inquiry.

**Direction confirmed on 2026-09-14:** Major refinement of the existing dark KDV identity; project inquiry is the primary conversion; websites, dashboards, and custom apps retain equal prominence. Pricing and timelines remain locked. No new dependencies or fabricated proof.

**Audit coverage:** Live desktop inspection at 1440×1000 of the homepage, services overview, all three service pages, portfolio listing, all four case-study entry screens, About, Estimate, Contact, calendar, Privacy, Terms, and the missing-page experience. Mobile spot checks at 390×844 covered the homepage, menu, website-service page, and contact form. Case-study reading flow and gallery interaction were exercised on IPAY; this was not an exhaustive check of every gallery image or responsive state.

**Evidence:** 29 screenshots captured during this audit, stored outside the repository at `C:/Users/kdv06/.codex/visualizations/2026/09/14/01a09dcc-a1d5-7521-9751-7805f0bf2d92/`. File numbers below refer to this capture set. Findings describe observed design risks, not measured conversion losses.

#### Section-by-section findings

| Step / surface | Health and evidence | Recommended refinement |
|---|---|---|
| 1. Header and navigation | Needs work. The numbered floating index hides inactive route names; it resembles section progress but navigates between pages. Closed mobile-menu links still receive keyboard focus: closing the menu then pressing Tab focused its hidden Home link. Screens 01, 03, 21. | Keep one clearly labelled primary navigation and inquiry CTA. Remove the decorative floating route index. Make closed-menu contents inert/unmounted, support Escape, and preserve visible focus. Verify header visibility while scrolling. |
| 2. Hero | High priority. Five large desktop headline lines consume most of the first screen; generic dashboard decoration supplies little real proof. The availability pill still says Booking May 2026. Mobile body text has conspicuous gaps from justification. Screens 01, 20. | Shorten the headline and use a calmer two-column desktop composition with an actual project preview. Keep all three service categories explicit. Replace unverified availability with the confirmed response window. Primary: Start a project; secondary: View selected work; retain Estimate in navigation and service contexts. |
| 3. Homepage services | High priority. Similar dark mockups make the three offers look interchangeable. Long justified paragraphs and small low-emphasis prices slow comparison. Screen 02. | Use three equal cards with a clear buyer goal, concise scope, existing starting price, and a labelled details link. Left-align text. Keep pricing visible without hover and place the service name before decorative imagery on mobile. |
| 4. Featured work | High priority. Actual work exists, but outcomes are tiny overlays inside images, while technology tags occupy the readable text area. Screen 03. | Move the outcome into normal 16px body text below the project title; show business type and delivered capability before stack details. Use consistent image treatment and avoid making image-embedded text carry the explanation. |
| 5. Process | Needs refinement. Four steps are understandable, but rotating highlights and almost invisible inactive numbers compete with reading. Justification stretches short paragraphs. Screen 04. | Use a static ordered sequence: horizontal on desktop, vertical on mobile. Give every step a readable number and a tangible existing deliverable: scope, approved design, preview, handoff/support. Do not add new duration or support promises. |
| 6. Client feedback | High priority. Verified projects, careful framing and the note about future permission read like internal editorial instructions. Testimonial-style author cards imply endorsement despite summarized content. Screen 04. | Fold these summaries into the corresponding case studies as KDV-authored project notes. Remove the separate testimonial-style section until approved verbatim quotes exist; do not disguise summaries as quotations. |
| 7. Homepage FAQ | Sound structure. Payment accordion expanded correctly. Relevant objections are present, but the section is visually repetitive and the tiny controls are subdued. Screen 05. | Retain the existing questions and accessible disclosure behavior; improve answer contrast and left alignment, use clear icons, and make each full question row a generous target. Keep unconfirmed business-policy wording tracked in PROJECT_INFO.md. |
| 8. Final CTA and footer | Needs refinement. The CTA is clear but repeats a generic promise. Footer copy is justified; small dim links and technology credits dilute useful contact information. Screen 06. | State the next step and the confirmed response window beside one strong inquiry CTA. Keep service, work, contact, and policy links readable. De-emphasize implementation credits and label chat channels clearly. |
| 9. Services overview | High priority. Oversized artwork pushes service buying information below the initial viewport. The first service dominates the page before alternatives can be compared. Screen 07. | Add a compact three-service comparison at the top using existing price/timeline data, linking to the existing service sections. Reduce image height and place each service goal, scope, price, timeline, and CTA together. |
| 10. Service detail pages | Desktop buying panel is useful. On mobile, source order puts price and inquiry CTA after deliverables, related work, and FAQ. Single related-work cards leave an empty second grid column. Screens 08, 19, 22, 23. | Move the buying summary directly below the heading on mobile and retain a desktop side panel. Use a full-width compact related-work row when only one project matches. Reduce all-gradient headings and technical wording. |
| 11. Portfolio listing | Filtering works. Cards contain dense feature inventories, many tags, and relatively buried outcomes. Screen 09. | Lead each card with the business problem and delivered outcome; restrict the summary to two short sentences. Keep category filters and move technical detail into the case study. |
| 12. Four case studies | Strong underlying material; weak skim hierarchy. Large covers and long introductory paragraphs delay the result and contact action. IPAY body labels are much less prominent than the page title. Screens 10, 11, 24–26. | Use a compact brief with client/sector, problem, delivered capability, qualitative outcome, and Start something similar near the top. Promote Challenge, Solution, and Result to readable semantic headings. Integrate selected actual screens beside their explanations; retain the full gallery below. |
| 13. Gallery | Useful interaction. IPAY image zoom opened, Escape closed it, and focus returned to the trigger. The chat launcher remained visible over the image viewer. Screen 12. | Retain zoom and focus restoration. Hide competing chat UI while the viewer is open and check captions, controls, and screenshots at mobile size. |
| 14. About | Needs refinement. Solo-founder positioning is credible, but the page is mostly generic paragraphs and technology badges with no personal visual. Screen 13. | Lead with Keith and the direct working relationship; connect values to concrete deliverables and link to actual projects. Add a real portrait and fuller biography only when supplied. Keep the layout complete without a placeholder portrait or unverified credentials. |
| 15. Estimate | Functional. Changing Website Creation to Business Dashboards updated PHP 25,000–45,000 to PHP 85,000–140,000, and the next screen selected Business dashboard and ₱50k–₱150k. Scope choices remain abstract. Screen 14. | Keep the pricing logic. Shorten the introduction, explain scope using examples appropriate to the selected service, show a concise selection summary, and use Discuss this estimate as the next action. Announce changing results accessibly. |
| 16. Contact and booking | Highest priority. Form is clear on desktop, but mobile chat/location content comes before the first field. Switching form → booking → form erased a typed draft; reproduced with a non-submitted message and a DOM value check. Calendar loads, but its narrow panel creates a long stacked view. Screens 15–18. | Put the form immediately after a short introduction/response promise on mobile. Mark optional fields explicitly. Preserve draft state across tabs by retaining the form while hidden. Add persistent success/error feedback, retain privacy consent, and keep booking/channels secondary. Give booking a direct fallback link and adequate width. |
| 17. Privacy, Terms, and 404 | Generally sound structure. Policies have section headings and readable grouping; 404 offers recovery routes. Shared subdued text styling still applies. Screens 27–29. | Apply global text and focus improvements; keep policy prose restrained. Use a contextual Contact KDV label for questions about terms. Legal adequacy and HTTP-status validation were not assessed in this design pass. |

#### Cross-site priorities

1. **P1 — Reading and interaction barriers:** Remove justified alignment from marketing copy. Use body text around 16px with comfortable leading; reserve 12–14px for secondary metadata. Replace opacity-based low-contrast labels with tested tokens. One observed 12px label uses white at 40% over an 8/8/8 background: approximately 3.75:1, below the project's 4.5:1 text requirement. Recheck each actual surface, gradient, hover, and focus state rather than assuming one token fixes all cases. Fix closed-menu focus and inquiry draft loss.
2. **P1 — Mobile buying sequence:** Put price, timeline, fit, and an inquiry action before lengthy service details. Put inquiry fields ahead of alternative contact channels. Keep a clear path to contact without adding another overlay by default; item 1.5 should be reconsidered only after navigation/layout changes are verified.
3. **P1 — Credibility:** Remove stale scarcity, editorial permission notes, and testimonial-like presentation of summaries. Promote existing project outcomes without creating new statistics. PROJECT_INFO.md trails the live four-project portfolio and still mentions removed hero stats; reconcile only with verified facts before promoting additional claims.
4. **P2 — Visual composition:** Keep near-black surfaces, Syne/Geist typography, and restrained indigo/violet accents. Use whitespace, type scale, and actual project imagery to create hierarchy. Reduce repeated card-within-card framing, oversized promotional artwork, full-gradient headings, and decorative motion. Favor a homepage sequence of concise hero → compact real-project proof → three equal services → selected work → process → FAQ → inquiry CTA.
5. **P2 — Chat:** Keep a compact launcher, but disable unsolicited attention grabbers, suggested-reply panels, and title flashing. These covered service cards, feedback, and gallery content during the audit. Widget configuration is partly in Tawk administration; do not claim it is fixed by a code-only change. Keep chat hidden on Contact and while the image viewer is open.

**Research grounding:** Nielsen Norman Group's [visual-design guidance](https://www.nngroup.com/articles/good-visual-design/) supports consistent grids, purposeful images, and readable type hierarchy; its [company-information research](https://www.nngroup.com/articles/about-us-information-on-websites/) supports clear identity and authentic evidence. GOV.UK's [question-page guidance](https://design-system.service.gov.uk/patterns/question-pages/) supports asking only necessary questions and avoiding repeated entry. These sources inform design principles; they do not establish a conversion uplift for KDV or PH MSMEs.

**Steps:**
1. ✅ Capture the live journey, inspect source/layout rules, test key interactions, and record prioritized findings (2026-09-14).
2. ✅ Select a concrete visual treatment: calm two-column hero with a real project screen, equal text-led service cards, open project rows, static process, readable neutral text, and a primary inquiry action (2026-09-14).
3. ✅ Fix justified copy, low-contrast text, hidden mobile-menu focus, and form draft preservation. Closed menu unmounts; Escape restores focus; draft retained across contact tabs. Shared labels, body copy, and placeholders use readable tokens (2026-09-15).
4. ✅ Refine hero, service comparison, featured work, process, feedback presentation, CTA, and footer using the direction above. Real project imagery replaces hero decoration; project notes replace the testimonial presentation; static process and labelled chat links implemented (2026-09-15).
5. ✅ Refine all service pages, case-study summaries, portfolio cards, About, Estimate, and Contact; preserve existing prices, routes, and estimate-to-contact prefill. Buying summary precedes detail on mobile; all portfolio filters are visible without horizontal scrolling (2026-09-15).
6. 🔲 Adjust Tawk presentation and verify it never obscures key content or gallery controls. Gallery-open/close and Contact route suppression implemented; actual widget and administration settings remain unverified. The production widget URL was identified on 2026-09-15, but Edge blocked its response with CORS/ORB errors; removing the cross-origin attribute in a browser-only experiment did not restore it, so the integration was left unchanged. Disable attention grabbers, suggested replies, and title flashing in Tawk administration, then verify with the real widget.
7. 🔲 Run `npm run build` and `npm run lint`; verify desktop, tablet, and mobile layouts at 360/390/768/1024/1440px, 200% zoom, keyboard navigation, focus restoration, reduced motion, FAQ/filter behavior, and draft preservation. Test form success/failure only in an appropriate test setup; no live lead or booking was submitted during the audit.
   - ✅ Fresh production build and lint pass after the follow-up motion fixes (2026-09-15).
   - ✅ All 16 routes, including a real HTTP 404, checked at 360/390/768/1024/1440px: 80 layout checks without page-wide horizontal overflow.
   - ✅ Actual 200% browser zoom verified on all 16 routes using browser zoom, with the resulting 2× pixel ratio confirmed; Contact visually inspected at 200%.
   - ✅ Reduced-motion runtime checks: route progress is suppressed, the normal-preference bar remains available, and service imagery does not zoom. RouteProgress now subscribes to the browser preference with a server-safe initial value.
   - ✅ Keyboard menu Escape/focus return, FAQ opening/closing, portfolio filters, gallery Tab loop/Escape/focus return, contact draft retention, and contact prefill rechecked.
   - ✅ Local server-side validation, no-email success, and rate-limit failure feedback checked with synthetic input. No live inquiry or booking submitted.
   - ✅ Default solid-surface text contrast scanned across 16 routes: lowest measured ratio 5.11:1. Primary button text remains 6.26:1.
   - ✅ 168 representative hover/focus text states passed across six page types. Lightened the heading gradient indigo stop after finding an intermediate contrast below 4.5:1; the revised gradient minimum is 4.83:1 against the card surface.
   - 🔲 Confirm stable third-party calendar rendering and real-widget presentation/contrast.
8. 🔲 Check a preview against the selected design, deploy through the normal workflow, and verify production before marking 🟢 Done. Use item 5.3 separately for eventual inquiry/funnel measurement; do not add analytics dependencies as part of visual work without approval.

**Local implementation verification (2026-09-15):** Production build and lint passed. Browser geometry checks covered 16 routes (including 404) at 360/390/768/1024/1440px with no page-wide horizontal overflow. Visual checks covered desktop home/services, tablet navigation, mobile home/contact/service buying panel, and mobile gallery. Menu Escape/focus return, contact draft retention, portfolio filtering, FAQ disclosure, gallery Tab loop/Escape/focus restoration, and estimate-to-contact prefill passed. Dashboard/small/no-rush remains PHP 85,000–140,000 and prefills Business dashboard / ₱50k–₱150k. Local invalid-form feedback and the no-email success path passed; no email was sent. Measured primary-button contrast is 6.26:1; shared muted labels against the card surface are 9.14:1. Pricing data, estimate calculations, dependencies, and routes are unchanged.

**Follow-up verification (2026-09-15):** Fixed the route-progress animation for reduced-motion visitors, including server/client rendering consistency and subscription cleanup. Restricted the service-image hover zoom to motion-safe preferences and lightened the heading gradient indigo stop to meet text contrast requirements. Fresh build and lint passed, and the final interaction checks reported no browser exceptions. Browser test helpers and screenshots are outside the repository; no dependencies, pricing, or routes changed.

**Remaining verification:** Step 7 remains open for third-party rendering and its state/surface contrast coverage. Cal.com loaded with Asia/Manila availability in local and production checks; one production capture showed a collapsed inner column, while subsequent local desktop and mobile captures rendered at the full panel width (mobile iframe/body 316px with no horizontal overflow). This inconsistent provider-rendered state is not claimed as fixed. Tawk failed to load in the test browser with CORS/ORB errors, preventing real-widget overlap checks or validation of attention grabbers, suggested replies, and title flashing. Dashboard settings still need an authenticated administration session. Email delivery/provider-error handling, an actual calendar booking, physical-phone deep links, and a full screen-reader audit were not exercised.

**Release state:** The prior design commit `afa43e0` has a successful Vercel status and the refined homepage is visible on production. The follow-up motion fixes from this session are local; step 8 remains open until their preview is reviewed and they are released and verified through the normal workflow. No production changes were made in this session. Conversion benefit remains a hypothesis until measured with actual visitors.


### 6.7 Cinematic homepage sequence
**Status:** 🟡 In progress — code, fallbacks, and browser verification done locally; generated media blocked; not released

**Why.** Make the homepage say "KDV turns scattered business processes into clear, useful digital systems" in the first scroll, then hand off straight to real project proof, without delaying the offer or the contact path.

**How.** One pinned, scroll-driven stage (`components/site/CinematicStory.tsx`) with all copy as real HTML. Chapter ranges, copy, and media slots are typed in `lib/story.ts`; a single Framer `useScroll` value drives everything. A small three.js scene (`components/site/system-scene.ts`, dynamically imported) renders the "business system": 18 interface modules that go scattered (0.20) → connected (0.50) → three service tiers (0.50–0.80, synced with HTML captions) → hand-off to the real New Zion admin dashboard screenshot (0.80–1.00). Optional slots for GPT Image keyframes (poster + static stills) and one scroll-scrubbed Seedance clip (0.20–0.50) are wired but empty until the assets land. Scoped motion exception recorded in `CLAUDE.md` / `AGENTS.md`. Dependency added with approval in the task brief: `three` + `@types/three` 0.186.

**Layers, honestly labelled.** Real-time mesh 3D: the module system, connectors, camera, and proof screen (WebGL). Generated video: none shipped yet. Generated stills: none shipped yet. The mobile / reduced-motion / no-WebGL illustration is a hand-built inline SVG schematic, not a render.

**Modes.** Cinematic: ≥1024×600, no `prefers-reduced-motion`, no Save-Data / `prefers-reduced-data`. Everyone else, including no-JS: the server-rendered static chapters (`StoryChapters.tsx`), with no three.js or video download. WebGL unavailable or context lost → pinned stage keeps working with the SVG schematic and an HTML proof screenshot.

**Steps:**
1. ✅ Baseline build + lint clean before changes (2026-09-25). Home First Load JS 147 kB.
2. ✅ Typed story data, pinned stage, hero copy, captions, chapter index, skip links (`#work`, `#services`), page order Story → Work → Services → Process → FAQ → CTA.
3. ✅ three.js scene: render-on-demand with damping, DPR ≤ 1.5 and ≤ 2.6 MP drawing buffer, paused offscreen / hidden tab / under video, context-loss fallback, full disposal.
4. ✅ Scroll-scrubbed video component: metadata-gated, clamped, coalesced seeks, never plays. Verified with a stand-in test clip (removed afterwards): forward, reverse, and fast jumps map deterministically; 9 seeks for 30+ wheel events.
5. ✅ Removed `overflow-x: hidden` from `html, body`. It turned `body` into a scroll container and broke `position: sticky` (the header did not stick). No page-wide horizontal overflow at 320/360/390/430/768/1024/1440 afterwards.
6. ✅ Browser verification (headless Chromium, SwiftShader GL): 7 widths; 25/50/75/100% sequence frames; slow, wheel-reverse, and fast-jump scrolling; resize 1440→800→1440; back/forward; reload mid-sequence; keyboard order (header → hero CTAs → skip links → content; faded hero is `inert`); reduced motion; WebGL disabled; mobile menu; 16 routes (15×200, `/nope` 404). No console errors apart from the expected 404.
7. 🔲 Generate keyframes (GPT Image 2) and the Seedance 2.0 clip within the approved 170-credit cap, inspect each, download, optimize, and fill `storyMedia` in `lib/story.ts`. **Blocked:** this cloud environment's network policy rejects `d8j0ntlcm91z4.cloudfront.net` (Higgsfield's result CDN), so outputs cannot be inspected or committed from here. Generation paused after one image.
8. 🔲 Real-GPU performance pass (frame time during scroll, memory) on a physical desktop and a mid-range laptop; Safari/WebKit check. Not done: only software GL was available.
9. 🔲 Preview deploy review, then release through the normal workflow.

**Measured (2026-09-25, local production build, headless Chromium, cold cache, no throttling):**
- Home First Load JS: 147 kB → 171 kB (Next build report).
- Deferred scene JS (cinematic visitors only): three.js ≈ 138 KB transferred (two chunks, 55 + 83 KB) + scene module 5 KB.
- Initial transfer incl. Next.js link prefetches: 390px ≈ 388 KB (196 KB JS), 1440px ≈ 679 KB (348 KB JS, incl. three.js).
- Textures: 5 procedural face canvases 512×320 and the real proof screenshot 1878×892. Estimated decoded GPU memory ≈ 15 MB for textures + drawing buffer ≤ 2.6 MP. This is an estimate, not a measurement.
- Scroll rendering cost on real hardware: **not measured**.

**Asset log:**
| Asset | Model | Job ID | Size / duration | Credits | Local path | Status |
|---|---|---|---|---|---|---|
| Keyframe A: scattered modules, 16:9, left 40% negative space | `gpt_image_2` (2k, high) | `ab657d54-0071-4d86-a855-ce99e8c30814` | 16:9, 2k | ≈ 6.5 | none | Generated; not inspected or downloaded (CDN blocked) |
| Keyframe B: connected stack | `gpt_image_2` | — | — | — | — | Not generated |
| Keyframe C: three tiers | `gpt_image_2` | — | — | — | — | Not generated |
| Sequence clip A → B, 8 s, no audio | `seedance_2_0` (std, 1080p) | — | — | quoted 72 | — | Not generated |

Keyframe A prompt: "Premium editorial technology still life … About eighteen thin rectangular interface panels made of dark smoked glass with satin-metal edges float separately in a near-black studio … grouped loosely in the RIGHT 60% of the frame; the LEFT 40% … empty, near-black negative space … no readable text, no numbers, no letters, no logos … restrained accent … muted indigo (#6366f1) shifting toward violet (#a855f7) … No people … no watermark, no text." The KDV logo was not uploaded or referenced.

**To finish step 7:** allow `d8j0ntlcm91z4.cloudfront.net` in the environment's network settings (or run the generation from a machine that can reach it), inspect keyframe A, then generate B and C using A as the reference image, and generate the Seedance clip with A as `start_image` and B as `end_image`. Encode for scrubbing (H.264, ~1280 px wide, short GOP, `+faststart`, audio stripped). Then set `storyMedia.stills.*` and `storyMedia.video`. No component changes are needed.

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
2. **1.2 WhatsApp/Viber link** — half a day, biggest PH-local lift
3. **5.1 + 5.2 Privacy Policy + form consent** — one day; unblocks compliance
4. **1.1 Calendar booking** — one day
5. **1.4 Auto-reply email** — one day
6. **5.3 Analytics** — one day; needed to evaluate everything else
7. **2.4 Per-page OG images** — one day
8. **2.2 Quantified case study metrics** — gated on real numbers from clients
9. **4.1 Care plans page** — needs pricing decision first
10. **3.1 First two blog posts + `/insights` route** — start the SEO compounding

Tier 6 polish items can interleave whenever there's a 30-min gap.
