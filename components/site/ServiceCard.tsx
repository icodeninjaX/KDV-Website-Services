import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/lib/services";
import { cn } from "@/lib/utils";

export function ServiceCard({ service, className }: { service: Service; className?: string }) {
  const Icon = service.icon;
  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "glow-card group relative flex h-full flex-col rounded-2xl border border-white/[0.1] bg-[hsl(0_0%_6%)] p-6 sm:p-7 transition-all duration-200 hover:border-white/[0.18] hover:-translate-y-1",
        className,
      )}
    >
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand-soft border border-white/[0.08] text-indigo-400">
        <Icon size={20} aria-hidden />
      </div>

      <h3 className="mt-6 font-display text-xl font-bold text-white">{service.title}</h3>
      <p className="mt-1.5 text-sm font-medium text-indigo-400/80">{service.tagline}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-white/55">{service.summary}</p>

      <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-5">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-white/30">Starting at</div>
          <div className="mt-0.5 text-sm font-semibold text-white/90">{service.startingAt}</div>
        </div>
        <span
          aria-hidden
          className="inline-flex items-center gap-1 text-sm font-medium text-white/40 transition-all duration-200 group-hover:text-indigo-400 group-hover:translate-x-0.5"
        >
          Learn more <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
