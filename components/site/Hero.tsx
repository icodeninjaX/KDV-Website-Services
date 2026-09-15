import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { portfolio } from "@/lib/portfolio";
import { site } from "@/lib/site";
import { FadeIn } from "./FadeIn";

export function Hero() {
  const project = portfolio.find((item) => item.slug === "new-zion-lpg")!;
  const preview = project.gallery![0];

  return (
    <section className="container-page py-14 sm:py-20 lg:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <FadeIn mount>
          <p className="label-mono">Keith / KDV Website Services</p>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            A better way to run your business online.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Websites, business dashboards, and custom apps for Philippine MSMEs. Work directly with Keith, from the first conversation to launch.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className={buttonVariants({ size: "lg" })}>
              Start a project <ArrowRight size={16} aria-hidden />
            </Link>
            <Link href="/portfolio" className={buttonVariants({ size: "lg", variant: "outline" })}>
              View selected work
            </Link>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">Personal reply {site.responseWindow}.</p>
        </FadeIn>
        <FadeIn mount delay={0.1} className="hidden md:block">
          <Link href={`/portfolio/${project.slug}`} className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-card">
              <Image src={preview.src} alt={preview.alt} fill priority sizes="(min-width: 1024px) 520px, 100vw" className="object-contain" />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Selected project / {project.client}</p>
                <p className="mt-1 text-base leading-relaxed">{project.outcome}</p>
              </div>
              <ArrowRight size={20} aria-hidden className="shrink-0 text-muted-foreground" />
            </div>
          </Link>
        </FadeIn>
      </div>
      <div className="mt-12 hidden flex-wrap items-center gap-x-8 gap-y-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex">
        <span className="font-medium text-foreground">Built for real businesses</span>
        {portfolio.map((item) => (
          <Link key={item.slug} href={`/portfolio/${item.slug}`} className="inline-flex min-h-11 items-center rounded hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{item.client}</Link>
        ))}
      </div>
    </section>
  );
}
