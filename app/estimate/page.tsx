import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/site/FadeIn";
import { EstimatorWizard } from "@/components/site/EstimatorWizard";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Quick Quote",
  description:
    "Estimate a realistic planning range for a KDV website, dashboard, or custom web app project.",
  alternates: {
    canonical: "/estimate",
  },
};

export default function EstimatePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "KDV Quick Quote",
    url: `${site.url}/estimate`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    provider: {
      "@type": "ProfessionalService",
      name: site.name,
      url: site.url,
    },
  };

  return (
    <>
      <script
        id="jsonld-estimate"
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="container-page pt-14 pb-10 sm:pt-20 sm:pb-12">
        <FadeIn mount>
          <div className="label-mono">Quick quote</div>
          <h1 className="mt-4 max-w-3xl font-display font-bold tracking-tight text-white text-balance text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
            Get a realistic project range before the first{" "}
            <span className="text-gradient">call</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/60 sm:mt-5">
            Answer three questions and get a planning range for a website,
            dashboard, or custom web app. The final quote still depends on scope,
            content, integrations, and timeline.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/portfolio">
              <Button variant="outline">
                See proof first <ArrowRight size={15} aria-hidden />
              </Button>
            </Link>
          </div>
        </FadeIn>
      </section>

      <section className="container-page pb-16 sm:pb-20">
        <FadeIn mount delay={0.08}>
          <EstimatorWizard />
        </FadeIn>
      </section>
    </>
  );
}
