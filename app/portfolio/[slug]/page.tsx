import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getCaseStudy, portfolio } from "@/lib/portfolio";
import { getService } from "@/lib/services";
import { FadeIn } from "@/components/site/FadeIn";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/site/CTASection";

export function generateStaticParams() {
  return portfolio.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return { title: study.title, description: study.summary };
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
      <section className="container-page pt-20 pb-10">
        <FadeIn mount>
          <Link
            href="/portfolio"
            className="label-mono hover:text-white/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 rounded"
          >
            &larr; All work
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/40">
            <span>{study.client}</span>
            <span className="text-white/15">&middot;</span>
            <span>{study.year}</span>
            {related && (
              <>
                <span className="text-white/15">&middot;</span>
                <Link
                  href={`/services/${related.slug}`}
                  className="text-indigo-400 hover:text-indigo-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 rounded transition-colors"
                >
                  {related.title}
                </Link>
              </>
            )}
          </div>
          <h1 className="mt-4 max-w-4xl font-display font-bold tracking-tight text-white text-balance text-5xl sm:text-6xl leading-tight">
            {study.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] text-white/55 leading-relaxed">{study.summary}</p>
        </FadeIn>
      </section>

      <section className="container-page pb-16">
        <FadeIn>
          <div
            className={`relative h-64 overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-br ${study.accent}`}
          >
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative flex h-full flex-col justify-end p-8">
              <div className="label-mono text-white/50">Outcome</div>
              <div className="mt-2 font-display text-3xl font-bold text-white">{study.outcome}</div>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="container-page grid gap-10 pb-20 lg:grid-cols-3">
        <FadeIn className="lg:col-span-2">
          <div className="space-y-5 text-white/60 leading-relaxed text-[15px]">
            <p>
              <strong className="font-semibold text-white">The challenge.</strong>{" "}
              {study.client} came to me with a familiar problem — the existing system worked, but
              it couldn&rsquo;t keep up with the team, and every small change required a developer.
            </p>
            <p>
              <strong className="font-semibold text-white">What we built.</strong>{" "}
              After a discovery session, we scoped a focused rebuild: a modern, maintainable
              foundation with just the features the team would actually use. No kitchen sink.
            </p>
            <p>
              <strong className="font-semibold text-white">Result.</strong>{" "}
              {study.outcome}. The team now maintains most of the content themselves; I handle
              quarterly improvements based on what they learn from customers.
            </p>
            <p className="text-white/35 italic">
              Want a deeper walkthrough? I&rsquo;m happy to share more on a call — including
              screens, the stack decisions, and what we&rsquo;d do differently.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <aside className="sticky top-24 rounded-2xl border border-white/[0.1] bg-[hsl(0_0%_6%)] p-6">
            <div className="label-mono">Tech used</div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {study.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs text-white/70"
                >
                  {t}
                </span>
              ))}
            </div>
            <Link href="/contact" className="mt-6 block">
              <Button className="w-full">
                Start something similar <ArrowRight size={15} />
              </Button>
            </Link>
          </aside>
        </FadeIn>
      </section>

      <CTASection />
    </>
  );
}
