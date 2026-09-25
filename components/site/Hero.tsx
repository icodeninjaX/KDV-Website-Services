import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/lib/site";
import { storyChapters } from "@/lib/story";

export function Hero() {
  const intro = storyChapters[0];

  return (
    <div className="container-page py-12 sm:py-16 md:py-20">
      <div className="max-w-xl lg:max-w-2xl">
        <p className="label-mono">{intro.label}</p>
        <h1
          id="hero-heading"
          className="mt-5 text-balance font-display text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl"
        >
          {intro.heading}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{intro.body}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/contact" className={buttonVariants({ size: "lg" })}>
            Start a project <ArrowRight size={16} aria-hidden />
          </Link>
          <Link href="/portfolio" className={buttonVariants({ size: "lg", variant: "outline" })}>
            View selected work
          </Link>
        </div>
        <p className="mt-5 text-sm text-muted-foreground">Personal reply {site.responseWindow}.</p>
        <nav aria-label="Skip the introduction" className="mt-6 flex flex-wrap items-center gap-x-5 text-sm text-muted-foreground">
          <span>Skip ahead:</span>
          <a href="#work" className="inline-flex min-h-11 items-center rounded underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Selected work
          </a>
          <a href="#services" className="inline-flex min-h-11 items-center rounded underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Services
          </a>
        </nav>
      </div>
    </div>
  );
}
