"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy } from "@/lib/portfolio";
import { FadeIn } from "./FadeIn";

type ServiceFilter = "all" | CaseStudy["service"];

const FILTERS: { value: ServiceFilter; label: string }[] = [
  { value: "all", label: "All work" },
  { value: "website-creation", label: "Websites" },
  { value: "business-dashboards", label: "Dashboards" },
  { value: "custom-websites", label: "Custom apps" },
];

export function PortfolioGrid({ items }: { items: CaseStudy[] }) {
  const [filter, setFilter] = useState<ServiceFilter>("all");

  const counts = useMemo(() => {
    const map = new Map<ServiceFilter, number>();
    map.set("all", items.length);
    for (const item of items) {
      map.set(item.service, (map.get(item.service) ?? 0) + 1);
    }
    return map;
  }, [items]);

  const filtered = filter === "all" ? items : items.filter((c) => c.service === filter);

  return (
    <>
      <div
        role="tablist"
        aria-label="Filter projects by service"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        {FILTERS.map(({ value, label }) => {
          const active = filter === value;
          const count = counts.get(value) ?? 0;
          if (count === 0 && value !== "all") return null;
          return (
            <button
              key={value}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => setFilter(value)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 sm:px-3.5 sm:py-1.5 ${
                active
                  ? "border-white/30 bg-white/[0.08] text-white"
                  : "border-white/[0.1] bg-[hsl(0_0%_6%)] text-white/60 hover:border-white/20 hover:text-white/90"
              }`}
            >
              <span>{label}</span>
              <span
                className={`rounded-full px-1.5 text-[11px] font-medium ${
                  active ? "bg-white/15 text-white/90" : "bg-white/[0.05] text-white/45"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {filtered.map((item, i) => (
          <FadeIn key={item.slug} delay={Math.min(i * 0.06, 0.18)}>
            <Link
              href={`/portfolio/${item.slug}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-[hsl(0_0%_6%)] transition-all duration-200 hover:border-white/[0.18] hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
            >
              {item.cover ? (
                <div className="relative aspect-[4/3] overflow-hidden border-b border-white/[0.08] bg-[hsl(0_0%_4%)] sm:aspect-[16/10]">
                  <Image
                    src={item.cover.src}
                    alt={item.cover.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
              ) : (
                <div
                  aria-hidden
                  className={`relative aspect-[4/3] overflow-hidden border-b border-white/[0.08] bg-gradient-to-br sm:aspect-[16/10] ${item.accent} opacity-30`}
                />
              )}
              <div className="relative p-5 sm:p-8">
                <div className="flex items-center justify-between text-xs text-white/35">
                  <span>{item.client}</span>
                  <span>{item.year}</span>
                </div>
                <h2 className="mt-3 font-display text-lg sm:text-2xl font-bold text-white leading-snug sm:mt-4">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/55 sm:mt-3 text-justify">
                  {item.summary}
                </p>

                <div className="mt-6 flex flex-wrap gap-1.5">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/55"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-5">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-white/30">
                      Outcome
                    </div>
                    <div className="mt-1 text-sm font-semibold text-white/80">{item.outcome}</div>
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="text-white/30 transition-all duration-200 group-hover:text-indigo-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </div>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-sm text-white/45">No projects in this category yet.</p>
      )}
    </>
  );
}
