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
        <FadeIn>
          <Link href="/portfolio" className="text-xs uppercase tracking-wider text-white/50 hover:text-white">
            &larr; All work
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/60">
            <span>{study.client}</span>
            <span className="text-white/20">&middot;</span>
            <span>{study.year}</span>
            {related && (
              <>
                <span className="text-white/20">&middot;</span>
                <Link href={`/services/${related.slug}`} className="text-gradient hover:underline">
                  {related.title}
                </Link>
              </>
            )}
          </div>
          <h1 className="mt-4 max-w-4xl text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            {study.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">{study.summary}</p>
        </FadeIn>
      </section>

      <section className="container-page pb-16">
        <FadeIn>
          <div
            className={`relative h-72 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${study.accent}`}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative flex h-full flex-col justify-end p-8">
              <div className="text-xs uppercase tracking-wider text-white/70">Outcome</div>
              <div className="mt-1 text-3xl font-semibold text-white">{study.outcome}</div>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="container-page grid gap-10 pb-20 lg:grid-cols-3">
        <FadeIn className="lg:col-span-2">
          <div className="prose-invert space-y-5 text-white/75 leading-relaxed">
            <p>
              <strong className="text-white">The challenge.</strong> {study.client} came to me with
              a familiar problem — the existing system worked, but it couldn't keep up with the
              team, and every small change required a developer.
            </p>
            <p>
              <strong className="text-white">What we built.</strong> After a discovery session, we
              scoped a focused rebuild: a modern, maintainable foundation with just the features the
              team would actually use. No kitchen sink.
            </p>
            <p>
              <strong className="text-white">Result.</strong> {study.outcome}. The team now
              maintains most of the content themselves; I handle quarterly improvements based on
              what they learn from customers.
            </p>
            <p className="text-white/50 italic">
              Want a deeper walkthrough? I'm happy to share more on a call — including screens, the
              stack decisions, and what we'd do differently.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <aside className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="text-[11px] uppercase tracking-wider text-white/40">Tech</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {study.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/80"
                >
                  {t}
                </span>
              ))}
            </div>
            <Link href="/contact" className="mt-6 block">
              <Button className="w-full">
                Start something similar <ArrowRight size={16} />
              </Button>
            </Link>
          </aside>
        </FadeIn>
      </section>

      <CTASection />
    </>
  );
}
