import Image from "next/image";
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
      <div className="relative -mx-1 -mt-1 aspect-[16/10] overflow-hidden rounded-xl border border-white/[0.08] bg-[hsl(0_0%_4%)]">
        <Image
          src={service.image.src}
          alt={service.image.alt}
          fill
          sizes="(min-width: 768px) 30vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(0_0%_6%/0.72)] via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.12] bg-[hsl(0_0%_4%/0.78)] text-indigo-300 shadow-2xl backdrop-blur">
          <Icon size={20} aria-hidden />
        </div>
      </div>

      <h3 className="mt-6 font-display text-xl font-bold text-white">{service.title}</h3>
      <p className="mt-1.5 text-sm font-medium text-indigo-400/80">{service.tagline}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-white/55 text-justify">{service.summary}</p>

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
