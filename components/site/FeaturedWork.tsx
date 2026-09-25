import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { portfolio } from "@/lib/portfolio";
import { services } from "@/lib/services";
import { FadeIn } from "./FadeIn";

export function FeaturedWork() {
  return (
    <section id="work" className="container-page scroll-mt-16 py-16 sm:py-20">
      <FadeIn>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label-mono">Selected work</p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">See what changed for the business.</h2>
          </div>
          <Link href="/portfolio" className="inline-flex min-h-11 items-center gap-2 rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">See all work <ArrowRight size={16} aria-hidden /></Link>
        </div>
      </FadeIn>
      <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2">
        {portfolio.map((item) => (
          <FadeIn key={item.slug}>
            <Link href={`/portfolio/${item.slug}`} className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background">
              {item.cover && <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-card"><Image src={item.cover.src} alt={item.cover.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className={item.cover.fit === "cover" ? "object-cover" : "object-contain"} /></div>}
              <p className="mt-5 text-sm text-muted-foreground">{item.client} / {services.find((service) => service.slug === item.service)?.title}</p>
              <div className="mt-2 flex items-center justify-between gap-4"><h3 className="font-display text-2xl font-bold">{item.title}</h3><ArrowRight size={20} aria-hidden /></div>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{item.outcome}</p>
            </Link>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
