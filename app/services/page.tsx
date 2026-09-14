import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/site/FadeIn";
import { CTASection } from "@/components/site/CTASection";
import { services } from "@/lib/services";

const serviceProjectImages = {
  "website-creation": {
    src: "/portfolio/ipay/cover.webp",
    alt: "IPAY International marketing website shown across desktop and laptop screens.",
  },
  "business-dashboards": {
    src: "/portfolio/371admin/cover.webp",
    alt: "371admin dashboard showing ads, devices, and finance operations in one platform.",
  },
  "custom-websites": {
    src: "/portfolio/coop-tracking/cover.webp",
    alt: "CoopTracker mobile-first cooperative management web app shown on a phone.",
  },
} satisfies Record<(typeof services)[number]["slug"], { src: string; alt: string }>;

export const metadata: Metadata = {
  title: "Services",
  description:
    "Websites, business dashboards, and custom web apps. Three ways I can help your Philippine MSME grow.",
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesIndexPage() {
  return (
    <>
      <section className="container-page pt-14 pb-10 sm:pt-20 sm:pb-12">
        <FadeIn mount>
          <div className="label-mono">Services</div>
          <h1 className="mt-4 max-w-3xl font-display font-bold tracking-tight text-white text-balance text-4xl sm:text-5xl lg:text-5xl leading-[1.1]">
            Three ways I can help your business{" "}
            <span className="text-gradient">grow online</span>.
          </h1>
          <p className="mt-4 sm:mt-5 max-w-2xl text-[hsl(var(--muted-foreground))] text-base leading-relaxed">
            Clear scopes, transparent PHP pricing, and a direct line to me. No account managers in
            between. Every engagement starts with a discovery call so you know exactly what you
            get before you pay anything.
          </p>
        </FadeIn>
      </section>

      <section className="container-page pb-10" aria-label="Compare services">
        <div className="grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <Link key={service.slug} href={`#${service.slug}`} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 transition-colors hover:border-[hsl(var(--primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))]">
              <h2 className="font-display text-xl font-bold">{service.title}</h2>
              <p className="mt-2 text-base text-[hsl(var(--muted-foreground))]">{service.tagline}</p>
              <p className="mt-5 text-sm text-[hsl(var(--muted-foreground))]">Starting at</p>
              <p className="mt-1 font-display text-2xl font-bold">{service.startingAt}</p>
              <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{service.timeline}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm">Explore scope <ArrowRight size={16} aria-hidden /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page space-y-5 pb-16 sm:pb-20">
        {services.map((service, i) => {
          const Icon = service.icon;
          const image = serviceProjectImages[service.slug];
          return (
            <FadeIn key={service.slug} delay={i * 0.06}>
              <article id={service.slug} className="scroll-mt-24 relative overflow-hidden rounded-2xl border border-white/[0.1] bg-[hsl(var(--card))] transition-colors hover:border-white/[0.18]">
                <div className="relative hidden aspect-[16/10] overflow-hidden sm:block border-b border-white/[0.08] bg-[hsl(var(--background))] sm:aspect-[16/8] lg:aspect-[16/4]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 1152px, 100vw"
                    className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(0_0%_6%/0.5)] via-transparent to-transparent" />
                </div>

                <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_300px] lg:gap-10 lg:p-10">
                  <div>
                    <div className="flex items-start gap-4">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-brand-soft border border-white/[0.08] text-[hsl(var(--primary))] sm:h-12 sm:w-12">
                        <Icon size={20} aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                          {service.title}
                        </h2>
                        <p className="mt-2 text-sm sm:text-base text-[hsl(var(--foreground))] font-medium">
                          {service.tagline}
                        </p>
                      </div>
                    </div>

                    <p className="mt-5 sm:mt-6 max-w-2xl text-base leading-relaxed text-[hsl(var(--muted-foreground))] text-left">
                      {service.summary}
                    </p>

                    <div className="mt-6 sm:mt-7">
                      <div className="label-mono mb-4">What&rsquo;s included</div>
                      <ul
                        className="grid gap-2.5 sm:grid-cols-2"
                        aria-label={`${service.title} deliverables`}
                      >
                        {service.deliverables.map((d) => (
                          <li
                            key={d}
                            className="flex items-start gap-2.5 text-sm text-[hsl(var(--muted-foreground))]"
                          >
                            <span
                              className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-gradient-brand"
                              aria-hidden
                            >
                              <Check
                                size={10}
                                strokeWidth={3.5}
                                className="text-white"
                              />
                            </span>
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <aside className="border-t border-white/[0.07] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                    <dl className="space-y-5 text-sm">
                      <div>
                        <dt className="label-mono">Starting at</dt>
                        <dd className="mt-2 font-display text-3xl font-bold text-white">
                          {service.startingAt}
                        </dd>
                      </div>
                      <div>
                        <dt className="label-mono">Timeline</dt>
                        <dd className="mt-2 text-[hsl(var(--muted-foreground))]">{service.timeline}</dd>
                      </div>
                      <div>
                        <dt className="label-mono">Ideal for</dt>
                        <dd className="mt-2 leading-relaxed text-[hsl(var(--muted-foreground))]">
                          {service.idealFor}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-7 flex flex-col gap-2.5">
                      <Link href={`/services/${service.slug}`}>
                        <Button className="w-full" variant="secondary">
                          Service details <ArrowRight size={14} aria-hidden />
                        </Button>
                      </Link>
                      <Link href={`/contact?service=${service.slug}`}>
                        <Button className="w-full">Start this project</Button>
                      </Link>
                    </div>
                  </aside>
                </div>
              </article>
            </FadeIn>
          );
        })}
      </section>

      <CTASection />
    </>
  );
}
