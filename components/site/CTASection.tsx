import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "./FadeIn";
import { site } from "@/lib/site";

export function CTASection() {
  return (
    <section className="container-page py-16 sm:py-20">
      <FadeIn>
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-[hsl(0_0%_6%)] p-6 sm:p-10 lg:p-16">
          {/* Single elegant indigo glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-500/15 blur-3xl"
          />

          <div className="relative">
            <div className="label-mono mb-6">Ready to build?</div>
            <h2 className="max-w-2xl font-display text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Let&rsquo;s build something{" "}
              <span className="text-gradient">that works</span> for your business.
            </h2>
            <p className="mt-4 sm:mt-5 max-w-lg text-[15px] sm:text-base text-white/55 leading-relaxed">
              Tell me a bit about your business. I read every message and reply{" "}
              {site.responseWindow}.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/contact">
                <Button size="lg">
                  Start a project <ArrowRight size={16} />
                </Button>
              </Link>
              <a
                href={`mailto:${site.email}`}
                className="text-sm text-white/50 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 rounded"
              >
                Or email me directly
              </a>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
