import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/lib/services";
import { cn } from "@/lib/utils";

export function ServiceCard({ service, className }: { service: Service; className?: string }) {
  const Icon = service.icon;
  return (
    <Link href={`/services/${service.slug}`} className={cn("group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary", className)}>
      <Icon size={24} aria-hidden className="text-accent" />
      <h3 className="mt-5 font-display text-2xl font-bold">{service.title}</h3>
      <p className="mt-3 flex-1 text-base leading-relaxed text-muted-foreground">{service.summary}</p>
      <div className="mt-6 border-t border-border pt-5">
        <p className="text-sm text-muted-foreground">Starting at</p>
        <p className="mt-1 text-2xl font-semibold">{service.startingAt}</p>
        <p className="mt-2 text-sm text-muted-foreground">{service.timeline}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-base font-medium">View service details <ArrowRight size={16} aria-hidden /></span>
      </div>
    </Link>
  );
}
