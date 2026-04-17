import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/site/FadeIn";
import { site } from "@/lib/site";
import { CTASection } from "@/components/site/CTASection";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${site.name} — a Philippines-based web development studio for SMBs.`,
};

const values = [
  {
    title: "Clarity over cleverness",
    body: "The best code is the boring code your future self can read. We build for the next developer, even when that's future-you.",
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
      <section className="container-page pt-14 pb-10 sm:pt-20 sm:pb-12">
        <FadeIn mount>
          <div className="label-mono">About</div>
          <h1 className="mt-4 max-w-3xl font-display font-bold tracking-tight text-white text-balance text-4xl sm:text-5xl lg:text-6xl leading-[1.1]">
            {site.name}. We build the web for small businesses.
          </h1>
        </FadeIn>

        <div className="mt-10 sm:mt-12 grid gap-8 sm:gap-10 lg:grid-cols-3">
          <FadeIn mount className="lg:col-span-2">
            <div className="space-y-5 text-white/60 leading-relaxed text-[15px] text-justify">
              <p>
                {site.shortName} was built after watching too many small businesses get stuck with
                bloated agencies, half-finished freelance projects, or templates that didn&rsquo;t fit.
                You deserve better.
              </p>
              <p>
                {site.shortName} works with a handful of clients at a time, intentionally. Every
                engagement gets full focus. Not a junior designer, not a revolving door of
                subcontractors. You work directly with us, and we stake our name on the outcome.
              </p>
              <p>
                The team behind {site.shortName} has years of experience shipping production software
                at product companies, where the bar for performance, reliability, and clean code was
                high. That bar comes with every project.
              </p>
            </div>
          </FadeIn>

          <FadeIn mount delay={0.08}>
            <div className="rounded-2xl border border-white/[0.1] bg-[hsl(0_0%_6%)] p-6">
              <div className="label-mono">Get in touch</div>
              <a
                href={`mailto:${site.email}`}
                className="mt-3 block text-sm text-white/70 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 rounded"
              >
                {site.email}
              </a>
              <div className="mt-6 label-mono">Response time</div>
              <div className="mt-2 text-sm text-white/70">{site.responseWindow}</div>
              <Link href="/contact" className="mt-6 block">
                <Button className="w-full">
                  Start a project <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <FadeIn>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">What we care about</h2>
        </FadeIn>
        <div className="mt-6 sm:mt-8 grid gap-5 md:grid-cols-3">
          {values.map((v, i) => (
            <FadeIn key={v.title} delay={i * 0.07}>
              <div className="h-full rounded-2xl border border-white/[0.1] bg-[hsl(0_0%_6%)] p-6">
                <h3 className="font-display text-lg font-bold text-white">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55 text-justify">{v.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <FadeIn>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">Tools we use</h2>
          <p className="mt-3 max-w-xl text-white/55 text-[15px] text-justify">
            A modern, battle-tested stack. Boring in the best way.
          </p>
        </FadeIn>
        <FadeIn delay={0.07}>
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-2">
            {stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/[0.1] bg-white/[0.03] px-4 py-2 text-sm text-white/70"
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
