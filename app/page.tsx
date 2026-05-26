import type { Metadata } from "next";
import { Hero } from "@/components/site/Hero";
import { ServicesGrid } from "@/components/site/ServicesGrid";
import { FeaturedWork } from "@/components/site/FeaturedWork";
import { ProcessSteps } from "@/components/site/ProcessSteps";
import { Testimonials } from "@/components/site/Testimonials";
import { HomeFAQ } from "@/components/site/HomeFAQ";
import { CTASection } from "@/components/site/CTASection";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    name: site.name,
    description: site.description,
    url: site.url,
    founder: { "@type": "Person", name: site.founder },
    areaServed: {
      "@type": "Country",
      name: "Philippines",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: site.country,
    },
    priceRange: "PHP",
    serviceType: [
      "Website design",
      "Business dashboards",
      "Custom web applications",
    ],
  };

  return (
    <>
      <script
        id="jsonld-home"
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <ServicesGrid />
      <FeaturedWork />
      <ProcessSteps />
      <Testimonials />
      <HomeFAQ />
      <CTASection />
    </>
  );
}
