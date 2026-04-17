# CLAUDE.md — KDV Website Services

Project context for Claude Code. Kept short; follow conventions below and check `PROJECT_INFO.md` for real-content status before editing copy.

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
components/site/   # Page-level composition (Hero, TrustBar, FeaturedWork, …)
components/ui/     # Primitives (Button, etc. — cva-based)
lib/               # Data + config (services, portfolio, logos, site)
public/logos/      # Manual SVG payment-brand assets (awaiting sourcing)
```

## Design system
- **Theme:** editorial dark, near-black surfaces. No blue-tinted gray (avoid "generic dev portfolio" look).
- **Brand gradient:** indigo `#6366f1` → violet `#a855f7`. Used for `.text-gradient` (animated, 8s loop).
- **Tokens:** HSL CSS vars in `app/globals.css` (`--background`, `--foreground`, `--primary`, …). Use `hsl(var(--token))`.
- **`color-scheme: dark`** is set on `:root` so native form controls render dark.
- **Type scale:** Syne for headings (`font-display`), Geist Sans for body (default), Geist Mono for labels (`.label-mono`).
- **Container:** `.container-page` (`max-w-6xl` + responsive padding).

## Animation conventions
All motion respects `prefers-reduced-motion`. Primitives:
- `FadeIn` — wrapper for in-view fade-up
- `ScrollProgress` — fixed top gradient bar driven by `useScroll + useSpring`
- `CountUp` — animates 0→value when in view
- `Magnetic` — cursor-attraction wrapper for CTAs
- `grid-bg`, `glow-card`, `.text-gradient` — CSS-level effects

Keep animation restrained (Stripe/Linear tier). **No** parallax, cursor trails, 3D tilts, or Lottie.

## Trust bar logo system
`lib/logos.ts` defines a discriminated union:
- `{ iconSlug: ... }` — resolved to a `react-icons` component inside the client `LogoMark`
- `{ file, width, height }` — loaded from `/public/logos/` with text-fallback on error

**RSC rule:** never put function references (like `IconType`) into props crossing the server→client boundary. The lookup map lives inside `LogoMark.tsx` (client). Props stay serializable.

## Accessibility non-negotiables
- 4.5:1 contrast on all text
- 44×44px min touch targets (mobile nav already enforces this)
- Visible focus rings (don't strip `focus-visible:ring-*`)
- `reduced-motion` respected in every animated component
- Skip link wired in `app/layout.tsx`

## Commands
```bash
npm run dev     # local dev
npm run build   # production build — run before declaring UI work done
npm run lint    # eslint
```

## Conventions
- **Server components by default.** Add `"use client"` only where state/effects/browser APIs are needed.
- **No fabricated content.** Testimonials, stats, client names, outcomes — only real data. See `PROJECT_INFO.md` for status.
- **Pricing is locked.** Don't edit `lib/services.ts` price/timeline fields without explicit user instruction.
- **Prefer editing over creating.** Reach for new files only when the existing file set can't hold the change.
- **No emoji in UI.** Use SVG icons (`lucide-react`, `react-icons`). Emoji is fine in markdown docs.
- **PH-local specificity matters.** Mention GCash / Maya / PayMongo / BPI by name when relevant — that's the trust signal for MSME clients.

## Key files to know
- `app/layout.tsx` — fonts, global chrome (Header, Footer, ScrollProgress, GradientBackground, Toaster)
- `app/page.tsx` — home composition order: Hero → TrustBar → ServicesGrid → FeaturedWork → ProcessSteps → Testimonials → HomeFAQ → CTASection
- `lib/site.ts` — site metadata, nav config, response window
- `lib/services.ts` — 3 services (website-creation, business-dashboards, custom-websites)
- `lib/portfolio.ts` — 3 real case studies
- `components/site/LogoMark.tsx` — iconSlug/file resolution (client)

## Pending work
See `PROJECT_INFO.md` for the current list of content that still needs real input from Keith (stats, quotes, anonymization decisions, logo assets, about page, etc.).
