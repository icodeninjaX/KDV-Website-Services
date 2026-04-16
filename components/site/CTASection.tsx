import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "./FadeIn";
import { site } from "@/lib/site";

export function CTASection() {
  return (
    <section className="container-page py-20">
      <FadeIn>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-white/[0.02] to-cyan-500/10 p-10 sm:p-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/30 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl"
          />
          <div className="relative">
            <h2 className="max-w-2xl text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Ready to build something <span className="text-gradient">that works</span>?
            </h2>
            <p className="mt-4 max-w-xl text-white/70">
              Tell me a bit about your business. I read every message and reply {site.responseWindow}.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/contact">
                <Button size="lg">
                  Start a project <ArrowRight size={18} />
                </Button>
              </Link>
              <a
                href={`mailto:${site.email}`}
                className="text-sm text-white/70 underline-offset-4 hover:text-white hover:underline"
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
