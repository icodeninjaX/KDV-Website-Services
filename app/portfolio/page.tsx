import type { Metadata } from "next";
import { portfolio } from "@/lib/portfolio";
import { FadeIn } from "@/components/site/FadeIn";
import { PortfolioGrid } from "@/components/site/PortfolioGrid";
import { CTASection } from "@/components/site/CTASection";

export const metadata: Metadata = {
  title: "Selected work",
  description: "Recent websites, dashboards, and custom web apps built for real clients.",
  alternates: {
    canonical: "/portfolio",
  },
};

export default function PortfolioPage() {
  return (
    <>
      <section className="container-page pt-14 pb-8 sm:pt-20 sm:pb-10">
        <FadeIn mount>
          <div className="label-mono">Selected work</div>
          <h1 className="mt-4 max-w-3xl font-display font-bold tracking-tight text-white text-balance text-4xl sm:text-5xl lg:text-5xl leading-[1.1]">
            A few projects I&rsquo;m proud to have{" "}
            <span className="text-gradient">shipped</span>.
          </h1>
          <p className="mt-4 max-w-xl text-[hsl(var(--muted-foreground))] text-base leading-relaxed text-left">
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
