import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { portfolio } from "@/lib/portfolio";
import { FadeIn } from "./FadeIn";

export function FeaturedWork() {
  const items = portfolio.slice(0, 4);

  return (
    <section className="container-page py-16 sm:py-20 lg:py-24">
      <FadeIn>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="label-mono">Selected work</div>
            <h2 className="mt-4 font-display text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Real clients. Real outcomes.
            </h2>
            <p className="mt-4 text-white/55 leading-relaxed text-[15px] sm:text-base text-justify">
              Four recent projects: an LPG ordering system, a cooperative tracker, an internal
              ad-ops dashboard, and a fintech marketing site. Same principles, different shapes.
            </p>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 rounded-md text-sm text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
          >
            See all work <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </FadeIn>

      <div className="mt-10 sm:mt-12 grid gap-5 lg:grid-cols-2">
        {items.map((item, i) => (
          <FadeIn key={item.slug} delay={Math.min(0.04 + i * 0.06, 0.22)}>
            <FeaturedCard item={item} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function FeaturedCard({ item }: { item: (typeof portfolio)[number] }) {
  return (
    <Link
      href={`/portfolio/${item.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-[hsl(0_0%_6%)] p-5 sm:p-7 transition-all duration-200 hover:border-white/[0.18] hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
    >
      {/* Mockup surface — browser frame stand-in */}
      <div
        aria-hidden
        className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/[0.08] bg-[hsl(0_0%_4%)]"
      >
        {/* Browser chrome dots — hidden on mobile to maximize image area */}
        <div className="relative z-10 hidden items-center gap-1.5 border-b border-white/[0.06] bg-[hsl(0_0%_4%/0.85)] px-3 py-2 backdrop-blur sm:flex">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
        </div>
        {item.cover ? (
          <Image
            src={item.cover.src}
            alt={item.cover.alt}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className={`${item.cover.fit === "cover" ? "object-cover" : "object-contain"} transition-transform duration-500 group-hover:scale-[1.02]`}
          />
        ) : (
          <>
            {/* Accent gradient wash */}
            <div
              className={`absolute inset-x-0 bottom-0 top-8 bg-gradient-to-br ${item.accent} opacity-20`}
            />
            {/* Subtle grid on top */}
            <div
              className="absolute inset-x-0 bottom-0 top-8 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
          </>
        )}
        {/* Pinned outcome pill */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-[hsl(0_0%_4%/0.85)] px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
            {item.outcome}
          </span>
          <ArrowUpRight
            size={16}
            className="rounded-full bg-[hsl(0_0%_4%/0.85)] p-0.5 text-white/70 backdrop-blur transition-all duration-200 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden
          />
        </div>
      </div>

      {/* Meta */}
      <div className="mt-6 flex flex-1 flex-col">
        <div className="flex items-center justify-between text-xs text-white/35">
          <span>{item.client}</span>
          <span>{item.year}</span>
        </div>
        <h3 className="mt-3 font-display font-bold text-white text-lg sm:text-xl leading-snug">
          {item.title}
        </h3>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {item.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[11px] text-white/55"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
