import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/site/FadeIn";
import { portfolio } from "@/lib/portfolio";
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

export default function AboutPage() {
  return (
    <>
      <section className="container-page pt-14 pb-10 sm:pt-20 sm:pb-12">
        <FadeIn mount>
          <div className="label-mono">About</div>
          <h1 className="mt-4 max-w-3xl font-display font-bold tracking-tight text-white text-balance text-4xl sm:text-5xl lg:text-5xl leading-[1.1]">
            I&rsquo;m {site.founder}. Your direct partner from idea to launch.
          </h1>
        </FadeIn>

        <div className="mt-10 sm:mt-12 grid gap-8 sm:gap-10 lg:grid-cols-3">
          <FadeIn mount className="lg:col-span-2">
            <div className="space-y-5 text-[hsl(var(--muted-foreground))] leading-relaxed text-base text-left">
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
            <div className="rounded-2xl border border-white/[0.1] bg-[hsl(var(--card))] p-6">
              <div className="label-mono">Get in touch</div>
              <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground))] text-left">
                Send the project details through the contact form or chat links.
              </p>
              <div className="mt-6 label-mono">Response time</div>
              <div className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{site.responseWindow}</div>
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
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">What working together looks like</h2>
        </FadeIn>
        <div className="mt-6 sm:mt-8 grid gap-5 md:grid-cols-3">
          {values.map((v, i) => (
            <FadeIn key={v.title} delay={i * 0.07}>
              <div className="h-full rounded-2xl border border-white/[0.1] bg-[hsl(var(--card))] p-6">
                <h3 className="font-display text-lg font-bold text-white">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))] text-left">{v.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <FadeIn>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">See the work behind the approach</h2>
          <p className="mt-3 max-w-xl text-base text-[hsl(var(--muted-foreground))]">Websites, dashboards, and custom tools built around the way each business operates.</p>
        </FadeIn>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {portfolio.map((study) => (
            <Link key={study.slug} href={`/portfolio/${study.slug}`} className="rounded-xl border border-[hsl(var(--border))] p-5 hover:bg-[hsl(var(--card))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))]">
              <div className="text-sm text-[hsl(var(--muted-foreground))]">{study.client}</div>
              <h3 className="mt-2 font-display text-xl font-bold">{study.title}</h3>
              <p className="mt-2 text-base text-[hsl(var(--muted-foreground))]">{study.outcome}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm">Read case study <ArrowRight size={16} aria-hidden /></span>
            </Link>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
