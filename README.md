# KDV Website Services

Marketing site for KDV Website Services — built with Next.js 15 (App Router), TypeScript, Tailwind CSS, and Resend.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in RESEND_API_KEY
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Key | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | For email delivery | Sign up at https://resend.com. If missing, the contact form logs the payload server-side and still returns success (useful in dev). |
| `CONTACT_TO_EMAIL` | Defaults provided | Inbox that receives new lead notifications. |
| `CONTACT_FROM_EMAIL` | Defaults provided | Verified sending address on your Resend account. Use `onboarding@resend.dev` until your domain is verified. |

## Scripts

- `npm run dev` — dev server (Turbopack)
- `npm run build` — production build
- `npm start` — serve the production build
- `npm run lint` — ESLint

## Structure

```
app/                # Routes (App Router)
  actions/contact.ts  # Server action: Zod validation + Resend send
  services/[slug]/    # Dynamic per-service pages
  portfolio/[slug]/   # Dynamic case study pages
components/
  site/             # Page-level sections
  ui/               # Primitives (Button, Input, etc.)
lib/
  services.ts       # Service offering data
  portfolio.ts      # Case study data
  site.ts           # Site-wide metadata (name, nav, email, etc.)
```

## Deployment

Push to GitHub, connect to Vercel, set the env vars above, deploy. Zero config needed.
