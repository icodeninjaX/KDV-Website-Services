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
        "glow-card group relative flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm transition-all hover:border-white/20 hover:-translate-y-1",
        className,
      )}
    >
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand-soft border border-white/10 text-violet-300">
        <Icon size={22} />
      </div>

      <h3 className="mt-6 text-xl font-semibold text-white">{service.title}</h3>
      <p className="mt-2 text-sm text-white/60">{service.tagline}</p>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-white/70">{service.summary}</p>

      <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-5">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-white/40">Starting at</div>
          <div className="text-sm font-medium text-white">{service.startingAt}</div>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-gradient transition-transform group-hover:translate-x-0.5">
          Learn more <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
