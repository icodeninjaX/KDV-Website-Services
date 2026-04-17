# KDV Website Services — Real Content Tracker

Living document for replacing placeholder copy with real, verifiable info.
Update in-place as new facts come in. Anything marked `⏳` is a prompt for the next conversation.

---

## Confirmed ✅

### Business identity
- **Company:** KDV Website Services
- **Founder:** Keith D. Vergara
- **Email:** keithvergara1997@gmail.com
- **Market:** Philippines MSMEs (freelance / solo operator)
- **Pricing:** Locked as-is for now (explicit user instruction — do not edit `lib/services.ts` pricing)

### Portfolio case studies (live in `lib/portfolio.ts`)
| Slug | Client | Year | Outcome |
|---|---|---|---|
| `new-zion-lpg` | New Z1on LPG | 2024 | Ordering workflow streamlined by 90% |
| `coop-tracking` | Private cooperative (PH) | 2024 | Member activity visible in real time |
| `371admin` | X-Meta Technologies | 2024 | Fleet visibility + automated reporting |

### Testimonials (live in `components/site/Testimonials.tsx`)
| Name | Role | Project |
|---|---|---|
| Toots Abella | Hiring manager, New Z1on LPG | New Z1on LPG |
| Cooperative officer (anonymized) | Private cooperative, PH | COOP-TRACKING |
| Sai Maloles | IT Head, X-Meta Technologies | 371admin |

---

## Pending / needs user input ⏳

### 1. COOP-TRACKING one-liner — **proposed**
User asked for a one-liner. Current draft used on site:

> "A mobile-first tracking system that gave a small cooperative real-time visibility into member contributions, loans, and daily activity — built for officers who mostly work from their phones."

Short version (used as `summary`):
> "Mobile-first tracking for a local co-op — real-time member, loan, and contribution visibility."

**Action:** confirm wording or supply alternative.

### 2. Anonymous coop client
Testimonial author currently shown as "Cooperative officer — Private cooperative, PH."
- Is full anonymization OK?
- If not, need a name + role + permission to publish.

### 3. Testimonial quotes (verbatim)
All three quote bodies currently live in `Testimonials.tsx` are Keith-voiced paraphrases, not actual client quotes.
**Action:** get real quotes (SMS / email screenshots) from:
- Toots Abella
- The coop officer
- Sai Maloles

### 4. Hero stats (`components/site/Hero.tsx`)
Currently placeholder values:
- "20+ PH businesses" — real count?
- "98 Lighthouse" — true across recent launches?
- "<1 day reply" — matches `site.responseWindow`, fine
- "85% retained" — real retention %?

### 5. Availability pill (`components/site/Hero.tsx`)
Hard-coded: "2 slots open · Booking May 2026"
**Action:** confirm current month/slot count, or swap to a dynamic date helper.

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
Not yet written. Needs:
- Keith's bio (1–2 paragraphs)
- Years freelancing
- Geographic focus (PH-wide? NCR only?)
- Stack preferences / specialization

### 9. Contact channels
Currently only email (`keithvergara1997@gmail.com`).
Consider adding:
- LinkedIn URL
- WhatsApp / Viber (PH-common)
- Calendar booking link (Cal.com, Google Calendar)

### 10. Logo assets
`/public/logos/` is empty. Needed for trust bar:
- `gcash.svg`
- `maya.svg`
- `paymongo.svg`
- `bpi.svg`

Without these, `LogoMark` falls back to the brand name as text — functional but less polished.

### 11. Brand voice notes
For future copy: confirm tone (technical + warm? straight-talk + PH-local? more corporate?) so future edits stay consistent.

### 12. Project screenshots
`/screenshots/` dir exists (untracked). Are these intended as portfolio mockup sources?
If yes — wire them into `FeaturedWork` card visuals instead of the gradient browser-frame placeholder.

---

## Working conventions
- Always convert "real" content to absolute facts — no invented stats, no fabricated client quotes.
- If content is uncertain, prefer anonymized or generic wording over placeholder names.
- Update this file the same turn the site copy is updated, so the two never drift.
