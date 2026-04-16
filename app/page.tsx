import Script from "next/script";
import { Hero } from "@/components/site/Hero";
import { ServicesGrid } from "@/components/site/ServicesGrid";
import { ProcessSteps } from "@/components/site/ProcessSteps";
import { Testimonials } from "@/components/site/Testimonials";
import { CTASection } from "@/components/site/CTASection";
import { site } from "@/lib/site";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    description: site.description,
    url: site.url,
    email: site.email,
    founder: { "@type": "Person", name: site.founder },
    areaServed: "Worldwide",
    serviceType: [
      "Website design",
      "Business dashboards",
      "Custom web applications",
    ],
  };

  return (
    <>
      <Script
        id="jsonld-home"
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {JSON.stringify(jsonLd)}
      </Script>
      <Hero />
      <ServicesGrid />
      <ProcessSteps />
      <Testimonials />
      <CTASection />
    </>
  );
}
