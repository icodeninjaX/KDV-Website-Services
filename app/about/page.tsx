import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/site/FadeIn";
import { site } from "@/lib/site";
import { CTASection } from "@/components/site/CTASection";

export const metadata: Metadata = {
  title: "About",
  description: `Meet ${site.founder}, the founder of ${site.name}.`,
};

const values = [
  {
    title: "Clarity over cleverness",
    body: "The best code is the boring code your future self can read. I build for the next developer, even when that's future-you.",
  },
  {
    title: "Ship the thing",
    body: "A live site in two weeks beats a perfect design in six months. Iterate with real users, not imagined ones.",
  },
  {
    title: "You own everything",
    body: "Your repo, your hosting, your domain. No lock-in, no mystery. On day one, you have the keys.",
  },
];

const stack = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Postgres",
  "Stripe",
  "Vercel",
  "Clerk / Auth.js",
  "Resend",
];

export default function AboutPage() {
  return (
    <>
      <section className="container-page pt-20 pb-12">
        <FadeIn>
          <div className="text-sm font-medium text-gradient">About</div>
          <h1 className="mt-3 max-w-3xl text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            Hi, I'm {site.founder}. I build the web for small businesses.
          </h1>
        </FadeIn>

        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          <FadeIn className="lg:col-span-2">
            <div className="space-y-5 text-white/75 leading-relaxed">
              <p>
                I started {site.shortName} after watching too many small businesses get stuck with
                bloated agencies, half-finished freelance projects, or templates that didn't fit.
                You deserve better.
              </p>
              <p>
                I work with a handful of clients at a time, intentionally. Every engagement gets my
                focus — not a junior designer, not a revolving door of subcontractors. You talk to
                me, you work with me, and I stake my name on the outcome.
              </p>
              <p>
                Before going independent, I spent years shipping production software at product
                companies, where the bar for performance, reliability, and clean code was high.
                That bar comes with me.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="text-[11px] uppercase tracking-wider text-white/40">Get in touch</div>
              <a href={`mailto:${site.email}`} className="mt-2 block text-sm text-gradient hover:underline">
                {site.email}
              </a>
              <div className="mt-6 text-[11px] uppercase tracking-wider text-white/40">
                Response time
              </div>
              <div className="mt-2 text-sm text-white/80">{site.responseWindow}</div>
              <Link href="/contact" className="mt-6 block">
                <Button className="w-full">
                  Start a project <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="container-page py-16">
        <FadeIn>
          <h2 className="text-3xl font-semibold text-white">What I care about</h2>
        </FadeIn>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {values.map((v, i) => (
            <FadeIn key={v.title} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <h3 className="text-lg font-semibold text-white">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{v.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <FadeIn>
          <h2 className="text-3xl font-semibold text-white">Tools I reach for</h2>
          <p className="mt-3 max-w-xl text-white/60">
            A modern, battle-tested stack. Boring in the best way.
          </p>
        </FadeIn>
        <FadeIn delay={0.08}>
          <div className="mt-8 flex flex-wrap gap-2">
            {stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/80"
              >
                {s}
              </span>
            ))}
          </div>
        </FadeIn>
      </section>

      <CTASection />
    </>
  );
}
