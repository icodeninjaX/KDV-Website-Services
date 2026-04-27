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
      <section className="container-page pt-14 pb-8 sm:pt-20 sm:pb-10">
        <FadeIn mount>
          <Link
            href="/portfolio"
            className="label-mono hover:text-white/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 rounded"
          >
            &larr; All work
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/40">
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
          <h1 className="mt-4 max-w-4xl font-display font-bold tracking-tight text-white text-balance text-3xl sm:text-5xl lg:text-6xl leading-[1.15] sm:leading-[1.1]">
            {study.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] text-white/55 leading-relaxed text-justify">{study.summary}</p>
        </FadeIn>
      </section>

      <section className="container-page pb-12 sm:pb-16">
        <FadeIn>
          {study.cover ? (
            <>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/[0.1] bg-[hsl(0_0%_4%)] sm:aspect-[16/8]">
                <Image
                  src={study.cover.src}
                  alt={study.cover.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 1024px, 100vw"
                  className="object-cover object-top"
                />
                {/* Outcome overlay — only on >= sm so the screenshot stays unobscured on mobile */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-32 bg-gradient-to-t from-black/85 via-black/40 to-transparent sm:block" />
                <div className="absolute inset-x-0 bottom-0 hidden flex-col justify-end p-6 sm:flex sm:p-8">
                  <div className="label-mono text-white/60">Outcome</div>
                  <div className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white drop-shadow">
                    {study.outcome}
                  </div>
                </div>
              </div>
              {/* Mobile-only outcome card below the image */}
              <div className="mt-4 rounded-xl border border-white/[0.1] bg-[hsl(0_0%_6%)] p-4 sm:hidden">
                <div className="label-mono text-white/55">Outcome</div>
                <div className="mt-1.5 font-display text-xl font-bold text-white leading-snug">
                  {study.outcome}
                </div>
              </div>
            </>
          ) : (
            <div
              className={`relative h-40 overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-br sm:h-64 ${study.accent}`}
            >
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative flex h-full flex-col justify-end p-5 sm:p-8">
                <div className="label-mono text-white/50">Outcome</div>
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
                <div className="label-mono">The challenge</div>
                <p className="mt-3 text-white/65 leading-relaxed text-[15px] sm:text-base text-justify">
                  {study.body.challenge}
                </p>
              </div>
              <div>
                <div className="label-mono">What we built</div>
                <ul className="mt-4 space-y-3">
                  {study.body.built.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-white/65 leading-relaxed text-[15px]"
                    >
                      <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/80">
                        <Check size={12} aria-hidden />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="label-mono">Result</div>
                <p className="mt-3 text-white/65 leading-relaxed text-[15px] sm:text-base text-justify">
                  {study.body.result}
                </p>
              </div>
              <p className="text-sm text-white/35 italic">
                Want a deeper walkthrough? I&rsquo;m happy to share more on a call, including
                screens, the stack decisions, and what we&rsquo;d do differently.
              </p>
            </div>
          ) : (
            <div className="space-y-5 text-white/60 leading-relaxed text-[15px] text-justify">
              <p>
                <strong className="font-semibold text-white">The challenge.</strong>{" "}
                {study.client} came to me with a familiar problem: the existing system worked,
                but it couldn&rsquo;t keep up with the team, and every small change required a
                developer.
              </p>
              <p>
                <strong className="font-semibold text-white">What we built.</strong> After a
                discovery session, we scoped a focused rebuild: a modern, maintainable foundation
                with just the features the team would actually use. No kitchen sink.
              </p>
              <p>
                <strong className="font-semibold text-white">Result.</strong> {study.outcome}.
                The team now maintains most of the content themselves; I handle quarterly
                improvements based on what they learn from customers.
              </p>
            </div>
          )}
        </FadeIn>

        <FadeIn delay={0.08}>
          <aside className="rounded-2xl border border-white/[0.1] bg-[hsl(0_0%_6%)] p-6 lg:sticky lg:top-24">
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

      {study.gallery && study.gallery.length > 0 && (
        <section className="container-page pb-16 sm:pb-20">
          <FadeIn>
            <div className="label-mono">Inside the build</div>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
              <h2 className="max-w-2xl font-display text-xl font-bold tracking-tight text-white sm:text-3xl">
                A walkthrough of the screens that ship every day.
              </h2>
              <span className="text-xs text-white/40">
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
