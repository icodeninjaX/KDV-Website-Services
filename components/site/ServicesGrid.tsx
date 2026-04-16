import { services } from "@/lib/services";
import { ServiceCard } from "./ServiceCard";
import { FadeIn } from "./FadeIn";

export function ServicesGrid() {
  return (
    <section id="services" className="container-page py-20">
      <FadeIn>
        <div className="max-w-2xl">
          <div className="text-sm font-medium text-gradient">What I build</div>
          <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Three ways I can help.
          </h2>
          <p className="mt-4 text-white/60">
            Every engagement is shaped around your business, but most projects fall into one of
            these buckets. Not sure which fits? <span className="text-white">Start a conversation</span> — I'll tell you honestly.
          </p>
        </div>
      </FadeIn>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {services.map((service, i) => (
          <FadeIn key={service.slug} delay={i * 0.08}>
            <ServiceCard service={service} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
