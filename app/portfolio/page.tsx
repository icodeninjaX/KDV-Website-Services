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
      <section className="container-page pt-20 pb-10">
        <FadeIn>
          <div className="text-sm font-medium text-gradient">Selected work</div>
          <h1 className="mt-3 max-w-3xl text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            A few projects I'm proud to have shipped.
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Details are anonymized where clients have asked. Happy to walk through any of these in a
            call.
          </p>
        </FadeIn>
      </section>

      <section className="container-page grid gap-6 pb-20 md:grid-cols-2">
        {portfolio.map((item, i) => (
          <FadeIn key={item.slug} delay={i * 0.06}>
            <Link
              href={`/portfolio/${item.slug}`}
              className="group relative block h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-all hover:border-white/20 hover:-translate-y-1"
            >
              <div
                aria-hidden
                className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-br ${item.accent} opacity-20 blur-2xl`}
              />
              <div className="relative">
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>{item.client}</span>
                  <span>{item.year}</span>
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-white">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{item.summary}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-5">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-white/40">
                      Outcome
                    </div>
                    <div className="mt-1 text-sm font-medium text-white">{item.outcome}</div>
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="text-white/60 transition-all group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
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
