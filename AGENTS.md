# AGENTS.md — KDV Website Services

Project context for Codex. Kept short; follow the rules below and check `PROJECT_INFO.md` (real-content tracker) and `IMPROVEMENTS.md` (feature roadmap with status) before starting any task.

---

## AI workflow (read first)

These rules govern *every* conversation in this repo — read them before doing anything else.

1. **Three living docs, no others.** This repo has `AGENTS.md` (rules), `PROJECT_INFO.md` (content gaps), `IMPROVEMENTS.md` (feature roadmap). Don't create a fourth without asking — doc sprawl rots fast.
2. **Roadmap is source of truth.** If a task matches an `IMPROVEMENTS.md` item, flip its **Status** to 🟡 In progress, check off (`🔲` → `✅`) each step as you finish it, and flip to 🟢 Done only when every step is `✅`. Never silently skip the doc update.
3. **Reference roadmap IDs in commits.** Working on item 1.6 → `feat(1.6): add Tawk.to scaffold`. Makes the changelog readable.
4. **No fabricated content.** Stats, client names, quotes, outcomes, testimonials — only real, verifiable data. If unsure, anonymize or omit. See `PROJECT_INFO.md` for what's confirmed vs pending.
5. **No new dependencies without asking.** The stack is intentionally small. If you think you need a new package, propose it with the tradeoff first.
6. **Don't add features beyond the task.** No surrounding cleanup, no speculative abstractions, no "while I'm here" refactors. Three similar lines beats a premature abstraction.
7. **Run `npm run build` before declaring UI work done.** `tsc --noEmit` is a smoke test, not a finish line.
8. **For UI changes, test in a real browser.** Type checks verify code; they don't verify the feature works. If you can't test it, say so explicitly instead of claiming success.
9. **Confirm before destructive actions.** No force pushes, no `git reset --hard`, no deleting untracked files without asking — that file might be the user's in-progress work.

---

## Business
Marketing site for **KDV Website Services** — a Philippines-based freelance web dev studio run by Keith D. Vergara, serving PH MSMEs. Three tiered services: website creation, business dashboards, custom web apps.

## Stack
- Next.js 15.5.15 (App Router) + React 19 + TypeScript
- Tailwind 3.4 + class-variance-authority + `cn` util
- framer-motion 11 for animations
- react-hook-form + Zod for forms
- Resend for contact email
- sonner for toasts
- lucide-react + react-icons (Simple Icons) for iconography
- Fonts: Syne (display), Geist Sans, Geist Mono — all via `next/font/google`

## Directory layout
```
app/               # App Router pages (route per folder, co-located metadata)
components/site/   # Page-level composition (Hero, ServicesGrid, FeaturedWork, …)
components/ui/     # Primitives (Button, etc. — cva-based)
lib/               # Data + config (services, portfolio, site)
```

## Design system
- **Theme:** editorial dark, near-black surfaces. No blue-tinted gray (avoid "generic dev portfolio" look).
- **Brand gradient:** indigo `#6366f1` → violet `#a855f7`. Used for `.text-gradient` (animated, 8s loop).
- **Tokens:** HSL CSS vars in `app/globals.css` (`--background`, `--foreground`, `--primary`, …). Use `hsl(var(--token))`.
- **`color-scheme: dark`** is set on `:root` so native form controls render dark.
- **Type scale:** Syne for headings (`font-display`), Geist Sans for body (default), Geist Mono for labels (`.label-mono`).
- **Container:** `.container-page` (`max-w-6xl` + responsive padding). Never roll your own `max-w-* mx-auto`.

## Animation conventions
All motion respects `prefers-reduced-motion`. Primitives:
- `FadeIn` — wrapper for in-view fade-up
- `RouteProgress` — fixed top gradient bar that animates on internal navigation (not scroll); shows after 80ms to avoid flicker on instant route changes
- `CountUp` — animates 0→value when in view
- `Magnetic` — cursor-attraction wrapper for CTAs
- `grid-bg`, `glow-card`, `.text-gradient` — CSS-level effects
- `.border-spin-wrapper` — conic gradient border beam. Beam is hidden by default; add `.is-active` to show it (used for always-on beams like contact form, or toggled state like ProcessSteps)

Keep animation restrained (Stripe/Linear tier). **No** parallax, cursor trails, 3D tilts, or Lottie.

## Accessibility non-negotiables
- 4.5:1 contrast on all text
- 44×44px min touch targets (mobile nav already enforces this)
- Visible focus rings (don't strip `focus-visible:ring-*`)
- `prefers-reduced-motion` respected in every animated component
- Skip link wired in `app/layout.tsx`
- Honor `lang="en"` on `<html>`; if a section needs another language attribute, set `lang` locally

## Commands
```bash
npm run dev     # local dev
npm run build   # production build — run before declaring UI work done
npm run lint    # eslint
```

---

## Code conventions

- **Server components by default.** Adding `"use client"` is a deliberate decision; only do it for state, effects, browser APIs, or framer-motion. Server components ship zero JS — guard them.
- **Edit, don't recreate.** Reach for new files only when the existing set can't hold the change.
- **No fabricated content.** Repeating from the AI workflow because it's load-bearing.
- **Pricing locked.** Don't edit `lib/services.ts` price/timeline fields without explicit user instruction.
- **No emoji in UI.** Use SVG icons (`lucide-react`, `react-icons`). Emoji is fine in markdown docs only.
- **PH-local specificity matters.** Mention GCash / Maya / PayMongo / BPI / BSP / DTI / BIR by name when relevant — that's the trust signal for MSME clients.
- **Date format `YYYY-MM-DD`** in any doc, comment, or content with dates. No "Thursday" without a date next to it.
- **Default to no comments.** Only write a comment when the *why* is non-obvious.

## Component & primitive rules

- **Buttons:** always `<Button />` from `components/ui/button`. Never raw `<button className="...">` for interactive elements.
- **Icons:** `lucide-react` for UI; `react-icons` (Simple Icons) for brand logos only.
- **Images:** always `next/image` with explicit `sizes`. Never raw `<img>`. Cover photos > 300 KB → WebP/AVIF.
- **Links:** `next/link` for internal, raw `<a target="_blank" rel="noopener noreferrer">` for external.
- **Animations:** use `<FadeIn />` for in-view fades, `<CountUp />` for number reveals, `<Magnetic />` for magnetic CTAs. Don't roll one-off framer-motion variants per page.
- **Container:** always `.container-page`.
- **Color tokens:** always `hsl(var(--token))`. No hex/rgb literals except gradient stops in `globals.css`.
- **Third-party scripts:** always `next/script` with `strategy="lazyOnload"` (chat, analytics, non-critical) or `"afterInteractive"` (critical). Never raw `<script>`.

## Forms & server actions

- **Validation:** Zod schema at the server boundary in `app/actions/*.ts`. Never trust client validation alone.
- **State:** `react-hook-form` or `useActionState` (current pattern in `ContactForm.tsx`). No bare `useState` for form fields.
- **Honeypot:** every public form has a hidden honeypot input (see `ContactForm.tsx` line 34).
- **Auto-reply:** lead forms should send a confirmation email to the submitter — wrap the second send in its own try/catch so the lead notification can't be blocked by the auto-reply failing.
- **PH Data Privacy Act (RA 10173):** every form collecting personal data needs a required Privacy Policy consent checkbox.

## Adding a new page or route

Checklist for any new `app/<route>/page.tsx`:

- Export `metadata: Metadata` with `title` and `description`
- If dynamic, export `generateStaticParams`
- Add the route (or its source data) to `app/sitemap.ts`
- Add JSON-LD schema if the page represents a real entity (Service / Article / CaseStudy)
- Colocate `opengraph-image.tsx` if the page is meant to be shared
- If unfinished/staging, set `robots: { index: false }` in metadata until ready
- If it should appear in nav, update `nav` in `lib/site.ts`
- Add a `loading.tsx` sibling if any data fetch could block first paint

## Performance & infrastructure

- **Bundle:** server components by default; client components are an opt-in cost.
- **Images:** WebP/AVIF for any cover > 300 KB; `priority` only on above-the-fold images (Hero, case study cover).
- **Fonts:** `next/font/google` only — no remote `<link rel="stylesheet">` to font CDNs.
- **Env vars:** server-only vars live in `lib/env.ts`; public ones use the `NEXT_PUBLIC_*` prefix and are read at the call site.
- **Every env var added must also land in `.env.example` with an inline comment explaining where to get it.**
- **Hosting:** Vercel. Preview deploys per PR. Production is `main`.

## Git & commits

- **Atomic commits.** One logical change per commit.
- **Conventional Commits.** `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`, `perf:` prefixes.
- **Roadmap reference in scope.** `feat(1.6): ...` when working on `IMPROVEMENTS.md` item 1.6.
- **Never push to `main` without `npm run build && npm run lint` passing locally.**
- **Never bypass hooks** (`--no-verify`, `--no-gpg-sign`). Fix the failure instead.
- **Never commit** `.env`, `.env.local`, `node_modules/`, or build artifacts.

---

## Anti-patterns (never do this)

- **Inventing client names, stats, quotes, outcomes.** If real data isn't available, anonymize or omit.
- **Editing `lib/services.ts` pricing** without explicit instruction. Pricing is locked.
- **Emoji in UI.** Markdown docs only.
- **Parallax, cursor trails, 3D tilts, Lottie.** Stripe/Linear restraint only.
- **Stripping `focus-visible:ring-*` classes.** Always-visible focus indicators are non-negotiable.
- **Function references in RSC props.** Anything crossing server→client must be serializable.
- **Bypassing pre-commit hooks** (`--no-verify`). Fix the underlying failure.
- **Force-pushing to `main`.** Ever.
- **Adding `dark:` Tailwind variants.** This site is dark-only by design — there's no light theme to switch to.
- **Hardcoded PHP amounts in components.** Pricing lives in `lib/services.ts`. Single source.
- **Using `any` to silence TS.** Narrow the type or refactor; don't bypass.
- **Mass renames in one commit.** One rename per commit so review is tractable.

---

## Key files to know
- `app/layout.tsx` — fonts, global chrome (Header, Footer, RouteProgress, GradientBackground, Toaster, TawkChat)
- `app/page.tsx` — home composition: Hero → ServicesGrid → FeaturedWork → ProcessSteps → Testimonials → HomeFAQ → CTASection
- `app/actions/contact.ts` — Resend send + Zod validation for the contact form
- `lib/site.ts` — site metadata, nav config, response window
- `lib/services.ts` — 3 services (website-creation, business-dashboards, custom-websites)
- `lib/portfolio.ts` — case studies (real, verified)
- `lib/env.ts` — server env access (typed)
- `components/site/TawkChat.tsx` — live chat widget (env-gated, hidden on `/contact`)
- `components/ui/button.tsx` — the only button primitive

## Pending work
See `PROJECT_INFO.md` for content gaps (real input still needed from Keith).
See `IMPROVEMENTS.md` for the feature roadmap with status indicators.
