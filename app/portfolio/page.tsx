import type { Metadata } from "next";
import { portfolio } from "@/lib/portfolio";
import { FadeIn } from "@/components/site/FadeIn";
import { PortfolioGrid } from "@/components/site/PortfolioGrid";
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
          <p className="mt-4 max-w-xl text-white/55 text-[15px] leading-relaxed text-justify">
            Details are anonymized where clients have asked. Happy to walk through any of these on
            a call.
          </p>
        </FadeIn>
      </section>

      <section className="container-page pb-16 sm:pb-20">
        <PortfolioGrid items={portfolio} />
      </section>

      <CTASection />
    </>
  );
}
