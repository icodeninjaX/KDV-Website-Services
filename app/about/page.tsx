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
  alternates: {
    canonical: "/about",
  },
};

const values = [
  {
    title: "Clarity over cleverness",
    body: "The work should be easy to understand after launch: clear scope, clear handoff, and code that another developer can read.",
  },
  {
    title: "Ship the thing",
    body: "A useful first version beats months of vague planning. I keep scope tight enough to ship, then improve from real feedback.",
  },
  {
    title: "You own everything",
    body: "Your repo, hosting, domain, and business accounts stay with you. No lock-in and no mystery handoff.",
  },
];

const stack = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Postgres",
  "Vercel",
  "Resend",
  "PayMongo / Xendit APIs",
];

export default function AboutPage() {
  return (
    <>
      <section className="container-page pt-14 pb-10 sm:pt-20 sm:pb-12">
        <FadeIn mount>
          <div className="label-mono">About</div>
          <h1 className="mt-4 max-w-3xl font-display font-bold tracking-tight text-white text-balance text-4xl sm:text-5xl lg:text-6xl leading-[1.1]">
            {site.name}. I build the web for{" "}
            <span className="text-gradient">small businesses</span>.
          </h1>
        </FadeIn>

        <div className="mt-10 sm:mt-12 grid gap-8 sm:gap-10 lg:grid-cols-3">
          <FadeIn mount className="lg:col-span-2">
            <div className="space-y-5 text-white/60 leading-relaxed text-[15px] text-justify">
              <p>
                I&rsquo;m {site.founder}, the developer behind {site.name}. I work
                with local businesses in the Philippines that need practical
                websites, dashboards, and custom tools without agency layers in
                the middle.
              </p>
              <p>
                The offer is intentionally direct: you talk to the person scoping,
                designing, and building the work. That makes decisions faster and
                keeps the budget focused on the product, not handoffs.
              </p>
              <p>
                I focus on systems that owners and staff can actually operate:
                lead-generating websites, business dashboards, internal admin
                panels, reports, and PH-local integrations such as GCash, Maya,
                PayMongo, BPI, and other tools your team already uses.
              </p>
            </div>
          </FadeIn>

          <FadeIn mount delay={0.08}>
            <div className="rounded-2xl border border-white/[0.1] bg-[hsl(0_0%_6%)] p-6">
              <div className="label-mono">Get in touch</div>
              <p className="mt-3 text-sm leading-relaxed text-white/60 text-justify">
                Send the project details through the contact form or chat links.
              </p>
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
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">What I care about</h2>
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
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">Tools I use</h2>
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
