import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { getCaseStudy, portfolio } from "@/lib/portfolio";
import { getService } from "@/lib/services";
import { FadeIn } from "@/components/site/FadeIn";
import { Gallery } from "@/components/site/Lightbox";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/site/CTASection";

const briefs: Record<string, { problem: string; delivered: string }> = {
  "new-zion-lpg": {
    problem: "Branch orders and sales were scattered across phone calls, paper logs, and spreadsheets.",
    delivered: "A shared point-of-sale system with order management, SMS intake, and sales reports.",
  },
  "coop-tracking": {
    problem: "Cooperative officers had to rebuild member equity and loan totals from notebooks and a shared spreadsheet.",
    delivered: "A mobile app for members, contributions, loans, shares, and the cooperative ledger.",
  },
  "371admin": {
    problem: "Advertising operations needed bookings, device monitoring, and finance in one place.",
    delivered: "An admin platform for campaigns, connected devices, programs, and financial reporting.",
  },
  "ipay-international": {
    problem: "A complex enterprise payments offer needed a clearer explanation for prospective buyers.",
    delivered: "A marketing website with audience-specific service information and a proposal-request flow.",
  },
};

const projectNotes: Record<string, string> = {
  "new-zion-lpg": "The New Z1on LPG team moved phone and walk-in orders into one cleaner workflow, giving staff one screen for orders instead of scattered notes.",
  "coop-tracking": "The cooperative officer needed a simple mobile way to see members, contributions, loans, and shares. The delivered app became the daily operating view.",
  "371admin": "The X-Meta team replaced spreadsheet-heavy reporting with one admin panel for bookings, finance, devices, programs, and operational monitoring.",
};

export function generateStaticParams() {
  return portfolio.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: study.title,
    description: study.summary,
    alternates: {
      canonical: `/portfolio/${study.slug}`,
    },
  };
}

export default async function CaseStudyPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  const related = getService(study.service);

  return (
    <>
      <section className="container-page pt-14 pb-8 sm:pt-20 sm:pb-10">
        <FadeIn mount>
          <Link
            href="/portfolio"
            className="label-mono hover:text-[hsl(var(--muted-foreground))] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 rounded"
          >
            &larr; All work
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[hsl(var(--muted-foreground))]">
            <span>{study.client}</span>
            <span className="text-[hsl(var(--muted-foreground))]">&middot;</span>
            <span>{study.year}</span>
            {related && (
              <>
                <span className="text-[hsl(var(--muted-foreground))]">&middot;</span>
                <Link
                  href={`/services/${related.slug}`}
                  className="text-[hsl(var(--accent-foreground))] hover:text-[hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 rounded transition-colors"
                >
                  {related.title}
                </Link>
              </>
            )}
          </div>
          <h1 className="mt-4 max-w-4xl font-display font-bold tracking-tight text-white text-balance text-3xl sm:text-5xl lg:text-5xl leading-[1.15] sm:leading-[1.1]">
            {study.title}
          </h1>
          <div className="mt-6 grid gap-6 border-t border-[hsl(var(--border))] pt-6 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <h2 className="font-display text-xl font-bold">Project brief</h2>
              <p className="mt-3 text-base leading-relaxed text-[hsl(var(--muted-foreground))]">{briefs[study.slug]?.problem ?? study.summary}</p>
              <p className="mt-3 text-base leading-relaxed text-[hsl(var(--muted-foreground))]">{briefs[study.slug]?.delivered}</p>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Outcome</h2>
              <p className="mt-3 text-base leading-relaxed">{study.outcome}</p>
              <Link href={`/contact?service=${study.service}`} className="mt-5 inline-block">
                <Button>Start something similar <ArrowRight size={15} aria-hidden /></Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="container-page pb-12 sm:pb-16">
        <FadeIn>
          {study.cover ? (
            <>
              <div className="relative aspect-[16/10] sm:aspect-[16/7] overflow-hidden rounded-2xl border border-white/[0.1] bg-[hsl(var(--background))]">
                <Image
                  src={study.cover.src}
                  alt={study.cover.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 1024px, 100vw"
                  className={study.cover.fit === "cover" ? "object-cover" : "object-contain"}
                />
              </div>
            </>
          ) : (
            <div
              className={`relative h-40 overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-br sm:h-64 ${study.accent}`}
            >
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative flex h-full flex-col justify-end p-5 sm:p-8">
                <div className="label-mono text-[hsl(var(--muted-foreground))]">Outcome</div>
                <div className="mt-2 font-display text-xl sm:text-3xl font-bold text-white">
                  {study.outcome}
                </div>
              </div>
            </div>
          )}
        </FadeIn>
      </section>

      <section className="container-page grid gap-8 pb-16 sm:pb-20 lg:grid-cols-3 lg:gap-10">
        <FadeIn className="lg:col-span-2">
          {study.body ? (
            <div className="space-y-8 sm:space-y-10">
              <div>
                <h2 className="font-display text-2xl font-bold">Challenge</h2>
                <p className="mt-3 text-[hsl(var(--muted-foreground))] leading-relaxed text-base sm:text-base text-left">
                  {study.body.challenge}
                </p>
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold">Solution</h2>
                <ul className="mt-4 space-y-3">
                  {study.body.built.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[hsl(var(--muted-foreground))] leading-relaxed text-base"
                    >
                      <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-[hsl(var(--muted-foreground))]">
                        <Check size={12} aria-hidden />
                      </span>
                      <span className="flex-1 text-left">{item}</span>
                    </li>
                  ))}
                </ul>
                {study.gallery?.[0] && (
                  <figure className="mt-6">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                      <Image src={study.gallery[0].src} alt={study.gallery[0].alt} fill sizes="(min-width: 1024px) 720px, 100vw" className="object-contain" />
                    </div>
                    <figcaption className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">{study.gallery[0].caption ?? study.gallery[0].alt}</figcaption>
                  </figure>
                )}
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold">Result</h2>
                <p className="mt-3 text-[hsl(var(--muted-foreground))] leading-relaxed text-base sm:text-base text-left">
                  {study.body.result}
                </p>
              </div>
              {projectNotes[study.slug] && (
                <div className="border-l-2 border-[hsl(var(--primary))] pl-5">
                  <h2 className="font-display text-xl font-bold">KDV project note</h2>
                  <p className="mt-3 text-base leading-relaxed text-[hsl(var(--muted-foreground))]">{projectNotes[study.slug]}</p>
                </div>
              )}
              <p className="text-sm text-[hsl(var(--muted-foreground))] italic">
                Want a deeper walkthrough? I&rsquo;m happy to share more on a call, including
                screens, the stack decisions, and what we&rsquo;d do differently.
              </p>
            </div>
          ) : (
            <p className="text-base leading-relaxed text-[hsl(var(--muted-foreground))]">{study.summary}</p>
          )}
        </FadeIn>

        <FadeIn delay={0.08}>
          <aside className="rounded-2xl border border-white/[0.1] bg-[hsl(var(--card))] p-6 lg:sticky lg:top-24">
            <div className="label-mono">Tech used</div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {study.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs text-[hsl(var(--muted-foreground))]"
                >
                  {t}
                </span>
              ))}
            </div>
            <Link href={`/contact?service=${study.service}`} className="mt-6 block">
              <Button className="w-full">
                Start something similar <ArrowRight size={15} />
              </Button>
            </Link>
          </aside>
        </FadeIn>
      </section>

      {study.gallery && study.gallery.length > 0 && (
        <section className="container-page pb-16 sm:pb-20">
          <FadeIn>
            <div className="label-mono">Inside the build</div>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
              <h2 className="max-w-2xl font-display text-xl font-bold tracking-tight text-white sm:text-3xl">
                A walkthrough of the screens that ship every day.
              </h2>
              <span className="text-xs text-[hsl(var(--muted-foreground))]">
                Tap any screen to zoom
              </span>
            </div>
          </FadeIn>
          <Gallery images={study.gallery} />
        </section>
      )}

      <CTASection />
    </>
  );
}
