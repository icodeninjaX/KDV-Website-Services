import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "./FadeIn";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-page py-20 sm:py-28 lg:py-36">
        <FadeIn>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 backdrop-blur">
            <Sparkles size={14} className="text-violet-400" />
            Philippine studio &middot; Booking projects for Q2
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <h1 className="mt-6 max-w-4xl text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Websites, dashboards,{" "}
            <span className="text-gradient">and custom web apps</span> that grow your business.
          </h1>
        </FadeIn>

        <FadeIn delay={0.16}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
            Kumusta! I'm Keith. I partner with Philippine small and mid-sized businesses to ship
            fast, polished web products — from marketing sites to internal dashboards. Thoughtful
            design, modern stack, no agency overhead.
          </p>
        </FadeIn>

        <FadeIn delay={0.24}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/contact">
              <Button size="lg">
                Start a project <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button size="lg" variant="outline">
                See recent work
              </Button>
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.32}>
          <div className="mt-16 grid grid-cols-2 gap-6 border-t border-white/5 pt-10 sm:grid-cols-4">
            {[
              { label: "Projects shipped", value: "40+" },
              { label: "Avg. Lighthouse", value: "98" },
              { label: "Response time", value: "< 1 day" },
              { label: "Clients retained", value: "85%" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-semibold text-white">{stat.value}</div>
                <div className="mt-1 text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
