import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "./FadeIn";

const stats = [
  { label: "Projects shipped", value: "40+" },
  { label: "Avg. Lighthouse", value: "98" },
  { label: "Response time", value: "< 1 day" },
  { label: "Clients retained", value: "85%" },
];

export function Hero() {
  return (
    <section className="relative overflow-x-hidden">
      <div className="container-page py-20 sm:py-28 lg:py-36">
        <FadeIn mount>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 backdrop-blur">
            <MapPin size={12} className="text-indigo-400" />
            Philippine studio &middot; Booking projects for Q2 2025
          </div>
        </FadeIn>

        <FadeIn mount delay={0.06}>
          <h1 className="mt-7 max-w-4xl font-display font-extrabold tracking-tight text-white leading-[1.08]">
            <span className="block text-[2.5rem] sm:text-5xl lg:text-[5.5rem]">
              Websites,
            </span>
            <span className="block text-[2.5rem] sm:text-5xl lg:text-[5.5rem]">
              dashboards,
            </span>
            <span className="block text-[2.5rem] sm:text-5xl lg:text-[5.5rem]">
              &amp; apps that{" "}
              <span className="text-gradient">grow</span>{" "}
              your business.
            </span>
          </h1>
        </FadeIn>

        <FadeIn mount delay={0.12}>
          <p className="mt-8 max-w-xl text-base sm:text-lg leading-relaxed text-white/55">
            Kumusta! I&rsquo;m Keith. I partner with Philippine small and mid-sized
            businesses to ship fast, polished web products — from marketing sites to
            internal dashboards. Thoughtful design, modern stack, no agency overhead.
          </p>
        </FadeIn>

        <FadeIn mount delay={0.18}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/contact">
              <Button size="lg">
                Start a project <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button size="lg" variant="outline">
                See recent work
              </Button>
            </Link>
          </div>
        </FadeIn>

        <FadeIn mount delay={0.24}>
          <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/[0.07] pt-10 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-3xl font-bold text-white tabular-nums">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-white/40">{stat.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
