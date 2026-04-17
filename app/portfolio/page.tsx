import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { portfolio } from "@/lib/portfolio";
import { FadeIn } from "@/components/site/FadeIn";
import { CTASection } from "@/components/site/CTASection";

export const metadata: Metadata = {
  title: "Selected work",
  description: "Recent websites, dashboards, and custom web apps built for real clients.",
};

export default function PortfolioPage() {
  return (
    <>
      <section className="container-page pt-14 pb-8 sm:pt-20 sm:pb-10">
        <FadeIn mount>
          <div className="label-mono">Selected work</div>
          <h1 className="mt-4 max-w-3xl font-display font-bold tracking-tight text-white text-balance text-4xl sm:text-5xl lg:text-6xl leading-[1.1]">
            A few projects I&rsquo;m proud to have shipped.
          </h1>
          <p className="mt-4 max-w-xl text-white/55 text-[15px] leading-relaxed">
            Details are anonymized where clients have asked. Happy to walk through any of these on
            a call.
          </p>
        </FadeIn>
      </section>

      <section className="container-page grid gap-5 pb-16 sm:pb-20 md:grid-cols-2">
        {portfolio.map((item, i) => (
          <FadeIn key={item.slug} delay={i * 0.06}>
            <Link
              href={`/portfolio/${item.slug}`}
              className="group relative block h-full overflow-hidden rounded-2xl border border-white/[0.1] bg-[hsl(0_0%_6%)] p-6 transition-all duration-200 hover:border-white/[0.18] hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 sm:p-8"
            >
              <div
                aria-hidden
                className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${item.accent} opacity-15 blur-2xl`}
              />
              <div className="relative">
                <div className="flex items-center justify-between text-xs text-white/35">
                  <span>{item.client}</span>
                  <span>{item.year}</span>
                </div>
                <h2 className="mt-4 font-display text-xl sm:text-2xl font-bold text-white leading-snug">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{item.summary}</p>

                <div className="mt-6 flex flex-wrap gap-1.5">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/55"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-5">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-white/30">
                      Outcome
                    </div>
                    <div className="mt-1 text-sm font-semibold text-white/80">{item.outcome}</div>
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="text-white/30 transition-all duration-200 group-hover:text-indigo-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </div>
              </div>
            </Link>
          </FadeIn>
        ))}
      </section>

      <CTASection />
    </>
  );
}
