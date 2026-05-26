import { services } from "@/lib/services";
import { ServiceCard } from "./ServiceCard";
import { FadeIn } from "./FadeIn";

export function ServicesGrid() {
  return (
    <section id="services" className="container-page py-16 sm:py-20 lg:py-24">
      <FadeIn>
        <div className="max-w-2xl">
          <div className="label-mono">What I build</div>
          <h2 className="mt-4 font-display text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Three ways I can help.
          </h2>
          <p className="mt-4 text-white/55 leading-relaxed text-[15px] sm:text-base text-justify">
            Every engagement is shaped around your business, but most projects fall into one of
            these buckets. Not sure which fits?{" "}
            <span className="text-white/80">Start a conversation.</span> I&rsquo;ll tell you honestly.
          </p>
        </div>
      </FadeIn>

      <div className="mt-10 sm:mt-12 grid gap-5 md:grid-cols-3">
        {services.map((service, i) => (
          <FadeIn key={service.slug} delay={i * 0.07}>
            <ServiceCard service={service} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
