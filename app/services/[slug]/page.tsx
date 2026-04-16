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
      <section className="container-page pt-20 pb-12">
        <FadeIn>
          <Link
            href="/"
            className="text-xs uppercase tracking-wider text-white/50 hover:text-white"
          >
            &larr; All services
          </Link>
          <div className="mt-6 flex items-start gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand-soft border border-white/10 text-violet-300">
              <Icon size={26} />
            </div>
            <div>
              <h1 className="text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                {service.title}
              </h1>
              <p className="mt-3 text-lg text-white/70">{service.tagline}</p>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="container-page grid gap-10 pb-20 lg:grid-cols-3">
        <FadeIn as="article" className="lg:col-span-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <h2 className="text-2xl font-semibold text-white">What you get</h2>
            <p className="mt-3 text-white/70">{service.summary}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {service.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-3 text-sm text-white/80">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gradient-brand text-white">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <h2 className="text-2xl font-semibold text-white">FAQ</h2>
            <div className="mt-4 divide-y divide-white/5">
              {service.faq.map((item) => (
                <details key={item.q} className="group py-4">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-white list-none">
                    <span className="font-medium">{item.q}</span>
                    <span className="text-white/40 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn as="article" delay={0.1}>
          <aside className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-white/40">Starting at</div>
              <div className="mt-1 text-3xl font-semibold text-white">{service.startingAt}</div>
            </div>
            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="text-white/40">Typical timeline</dt>
                <dd className="mt-1 text-white">{service.timeline}</dd>
              </div>
              <div>
                <dt className="text-white/40">Ideal for</dt>
                <dd className="mt-1 text-white/80">{service.idealFor}</dd>
              </div>
            </dl>
            <Link href="/contact" className="mt-6 block">
              <Button className="w-full">
                Start this project <ArrowRight size={16} />
              </Button>
            </Link>
          </aside>
        </FadeIn>
      </section>

      <CTASection />
    </>
  );
}
