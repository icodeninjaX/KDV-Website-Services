# KDV Website Services Conversion Findings

Created: 2026-05-17

This audit captures the highest-impact conversion improvements found in the current site source. The sequence favors trust, lead confirmation, pricing clarity, proof, and mobile performance.

## Priority Order

1. Privacy Policy, Terms, and contact consent
   - Why: The contact form collects personal data. A live privacy link and explicit consent reduce legal risk and increase trust for institutional PH clients.
   - Roadmap: 5.1, 5.2
   - Build first.

2. Contact auto-reply
   - Why: Submitters should receive immediate confirmation that the inquiry landed, with the response window and booking link.
   - Roadmap: 1.4

3. Quick Quote estimator
   - Why: Visitors need help understanding whether their project is likely near the website, dashboard, or custom-app price band before contacting.
   - Roadmap: 1.3

4. Contact form usability fixes
   - Why: Labels should be wired to inputs, and the anti-spam rate limiter should not accidentally group unrelated visitors as one anonymous bucket.
   - Related files: `components/site/ContactForm.tsx`, `app/actions/contact.ts`

5. Verified testimonials and proof
   - Why: Current testimonial bodies are marked as Keith-voiced paraphrases in `PROJECT_INFO.md`. Either replace them with real client quotes or frame them as summarized feedback.
   - Related files: `components/site/Testimonials.tsx`, `PROJECT_INFO.md`

6. Service-to-case-study links
   - Why: Service detail pages explain the offer but do not show matching proof before the CTA.
   - Roadmap: 3.5

7. Portfolio cover optimization
   - Why: Current PNG covers are large for mobile connections. Faster case-study pages help visitors evaluate proof without waiting.
   - Roadmap: 6.1

## Current Build Focus

Implementing item 1 now:

- Add `/privacy` and `/terms`
- Link both from the footer and sitemap
- Require privacy consent on the contact form
- Validate consent on the server action
- Fix contact field label wiring while touching the form

