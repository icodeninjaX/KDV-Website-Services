import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/site/FadeIn";
import { getService, services } from "@/lib/services";
import { CTASection } from "@/components/site/CTASection";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.summary,
  };
}

export default async function ServicePage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const Icon = service.icon;

  return (
    <>
      <section className="container-page pt-14 pb-10 sm:pt-20 sm:pb-12">
        <FadeIn mount>
          <Link
            href="/services"
            className="label-mono hover:text-white/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 rounded"
          >
            &larr; All services
          </Link>
          <div className="mt-6 sm:mt-7 flex flex-col items-start gap-4 sm:flex-row">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-brand-soft border border-white/[0.08] text-indigo-400 sm:h-14 sm:w-14">
              <Icon size={22} aria-hidden />
            </div>
            <div>
              <h1 className="font-display font-bold tracking-tight text-white text-balance text-4xl sm:text-5xl lg:text-6xl leading-[1.1]">
                {service.title}
              </h1>
              <p className="mt-3 text-base sm:text-lg text-indigo-400/80 font-medium">{service.tagline}</p>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="container-page grid gap-6 pb-16 sm:pb-20 lg:grid-cols-3 lg:gap-10">
        <FadeIn as="article" className="lg:col-span-2">
          <div className="rounded-2xl border border-white/[0.1] bg-[hsl(0_0%_6%)] p-6 sm:p-8">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">What you get</h2>
            <p className="mt-3 text-white/55 leading-relaxed text-[15px]">{service.summary}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2" aria-label="Deliverables">
              {service.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-3 text-sm text-white/70">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gradient-brand" aria-hidden>
                    <Check size={11} strokeWidth={3} className="text-white" />
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 rounded-2xl border border-white/[0.1] bg-[hsl(0_0%_6%)] p-6 sm:p-8">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">FAQ</h2>
            <div className="mt-4 divide-y divide-white/[0.06]">
              {service.faq.map((item) => (
                <details key={item.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 rounded sm:items-center">
                    <span className="font-medium text-[15px]">{item.q}</span>
                    <span className="shrink-0 text-white/30 leading-none transition-transform duration-200 group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn as="article" delay={0.08}>
          <aside className="rounded-2xl border border-white/[0.1] bg-[hsl(0_0%_6%)] p-6 lg:sticky lg:top-24">
            <div>
              <div className="label-mono">Starting at</div>
              <div className="mt-2 font-display text-3xl font-bold text-white">{service.startingAt}</div>
            </div>
            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="text-white/35">Typical timeline</dt>
                <dd className="mt-1 text-white/80">{service.timeline}</dd>
              </div>
              <div>
                <dt className="text-white/35">Ideal for</dt>
                <dd className="mt-1 text-white/70">{service.idealFor}</dd>
              </div>
            </dl>
            <Link href="/contact" className="mt-6 block">
              <Button className="w-full">
                Start this project <ArrowRight size={15} />
              </Button>
            </Link>
          </aside>
        </FadeIn>
      </section>

      <CTASection />
    </>
  );
}
