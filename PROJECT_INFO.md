# KDV Website Services — Real Content Tracker

Living document for replacing placeholder copy with real, verifiable info.
Update in-place as new facts come in. Anything marked `⏳` is a prompt for the next conversation.

---

## Confirmed ✅

### Business identity
- **Company:** KDV Website Services
- **Founder display name:** Keith
- **Public contact:** Contact form, WhatsApp, Viber, Messenger, and Cal.com booking
- **Market:** Philippines MSMEs (freelance / solo operator)
- **Pricing:** Locked as-is for now (explicit user instruction — do not edit `lib/services.ts` pricing)

### Portfolio case studies (live in `lib/portfolio.ts`)
| Slug | Client | Year | Outcome |
|---|---|---|---|
| `new-zion-lpg` | New Z1on LPG | 2024 | One unified workflow across branches |
| `coop-tracking` | Private cooperative (PH) | 2024 | The whole co-op runs from one phone screen |
| `371admin` | X-Meta Technologies | 2024 | One platform for ads, devices, and finance |
| `ipay-international` | IPAY International | 2025 | Enterprise credibility in a single scroll |

### Project feedback sources (not published as testimonials)
| Name | Role | Project |
|---|---|---|
| Toots Abella | Hiring manager, New Z1on LPG | New Z1on LPG |
| Cooperative officer (anonymized) | Private cooperative, PH | COOP-TRACKING |
| Sai Maloles | IT Head, X-Meta Technologies | 371admin |

---

## Pending / needs user input ⏳

### 1. COOP-TRACKING one-liner — **proposed**
User asked for a one-liner. Earlier proposed wording (not the current longer case-study summary):

> "A mobile-first tracking system that gave a small cooperative real-time visibility into member contributions, loans, and daily activity — built for officers who mostly work from their phones."

Earlier short version:
> "Mobile-first tracking for a local co-op — real-time member, loan, and contribution visibility."

**Action:** confirm wording or supply alternative.

### 2. Anonymous coop client
The case study remains anonymous as "Private cooperative (PH)"; the former testimonial author attribution is no longer displayed.
- Is full anonymization OK?
- If not, need a name + role + permission to publish.

### 3. Testimonial quotes (verbatim)
The homepage testimonial section was removed on 2026-09-14. Existing summaries now appear in the matching case studies as KDV-authored project notes, without attributed endorsements. Verbatim approved quotes are still pending.
**Action:** get real quotes (SMS / email screenshots + permission to publish) from:
- Toots Abella
- The coop officer
- Sai Maloles

### 4. Hero stats
No numerical credibility stats are displayed. Earlier 20+ businesses, 98 Lighthouse, and 85% retention placeholders are not verified and must not be restored without evidence.

### 4b. Homepage headline and story copy (2026-09-25)
Hero headline is now "Turn business chaos into a system that works." with the existing service/audience/Keith sentence. The cinematic chapters (`lib/story.ts`) add the following general, non-quantified statements; confirm they match how Keith describes the work:
- "Chat threads, notebooks, and a spreadsheet per branch become one connected flow your whole team can see."
- Service tier roles: website = "the front door", dashboard = "the control room", custom app = "the engine".
- Proof chapter: "New Zion's branches now share one order queue and one sales report. This is its actual admin dashboard." Restates the existing case study; no new metrics.
- Final CTA heading (all pages using `CTASection`): "Let's build a better way to run your business."

Generated imagery for the sequence is illustrative only and must never be presented as client work (see IMPROVEMENTS 6.7). Since v2 (2026-09-25) it depicts a generic Philippine back-office desk (ledgers, receipts, an unbranded LPG cylinder); the only real project content in the sequence is the New Zion admin dashboard screenshot, labelled "On screen: …".

### 5. Availability pill
Removed stale slot/month scarcity on 2026-09-14. Hero now uses the confirmed response window from `lib/site.ts`; no availability count is claimed.

### 6. Home FAQ content (`components/site/HomeFAQ.tsx`)
5 objection-handling questions drafted by Claude. Need Keith to confirm wording matches how he actually answers on calls:
- Agency vs freelancer
- GCash/Maya/PayMongo acceptance
- Copywriting help
- Can staff edit after launch?
- Post-launch support model

### 7. Process steps (`components/site/ProcessSteps.tsx`)
Verify step titles + durations reflect Keith's actual engagement flow.

### 8. About page
Initial page uses only confirmed solo-founder positioning. Still needs:
- Keith's bio (1–2 paragraphs)
- Years freelancing
- Geographic focus (currently phrased broadly as "local businesses in the Philippines"; confirm PH-wide vs NCR only)
- Stack preferences / specialization

### 9. Contact channels
Email, WhatsApp, Viber, Messenger, and Cal.com booking are now wired in the site.
Still consider adding:
- LinkedIn URL
- A public business phone display format, if Keith wants it shown beyond chat links

### 10. Brand voice notes
For future copy: confirm tone (technical + warm? straight-talk + PH-local? more corporate?) so future edits stay consistent.

### 11. Project screenshots
`/screenshots/` dir exists (untracked). Are these intended as portfolio mockup sources?
The site already uses four project covers and screenshot galleries from `public/portfolio/`. The 2026-09-14 refinement also uses the actual New Zion POS dashboard in the hero. The separate `/screenshots/` source folder still needs clarification before using additional assets.

### 12. Brand video "Still counting" (IMPROVEMENTS 2.5, 2026-09-30)
Files: `public/video/still-counting.*`. Please confirm:
- The general statements match how Keith describes the work. They restate existing site copy; no new metrics are claimed. The statements: "KDV Website Services builds the system your business runs on." / "A website that brings customers to you." / "A dashboard that shows today's sales, any time." / "Custom web apps, built around how your team already works." / "See the whole business without asking anyone… and go home on time."
- The Taglish on-screen lines read naturally: "Ate, 2 sacks dinorado po. Deliver bukas?", "Sent na po sa GCash.", "May stock pa po ba ng malagkit?", "Pa-reserve po 1 sack. Kukunin ko mamaya.", "Wait lang po, boss. Bibilangin pa po namin."
- The narrator is a stock TTS preset voice picked by Keith. It speaks about Keith in the third person and never claims to be him.
- The rice-store owner and the shopper are generated, fictional people. The video says "Scenes are dramatized" on the end card. The only real content is the three project screenshots (IPAY International, 371admin / X-Meta Technologies, New Zion POS / New Z1on LPG), each labelled "On screen: …".

### 13. Tagalog brand video "HM po?" (IMPROVEMENTS 2.5, 2026-10-01)
This one is delivered as a file for Facebook and isn't on the site. Please confirm:
- The Tagalog claims match how Keith describes Website Creation. They restate the site's deliverables: "Isang website na sumasagot sa mga tanong, kahit tulog ka" / "Mukhang legit, kasi legit ka" / "Bawat inquiry, diretso sa email mo" (contact form with email notifications) / "SEO-ready, mabilis sa mobile".
- The proof line "Tulad ng ginawa ni Keith para sa IPAY International" and the subtitle "BSP-registered payments company · 2025" come from `lib/portfolio.ts`.
- The Tagalog VO pronunciation is acceptable. It uses an ElevenLabs preset voice ("Elena"), and a speech-to-text check read every line back correctly in Tagalog. Possible soft spots: "ngayong araw" and "tanong". Keith should listen once.
- The caterer, the HR officer, the chat messages, the email, and the "Bagong inquiry" card (80 pax, Makati) are all dramatized. The end card says "Dramatized ang mga eksena."

---

## Working conventions
- Always convert "real" content to absolute facts — no invented stats, no fabricated client quotes.
- If content is uncertain, prefer anonymized or generic wording over placeholder names.
- Update this file the same turn the site copy is updated, so the two never drift.
