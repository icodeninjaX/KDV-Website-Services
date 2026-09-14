import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "./FadeIn";
import { site } from "@/lib/site";

export function CTASection() {
  return (
    <section className="container-page py-16 sm:py-20">
      <FadeIn>
        <div className="border-y border-border py-12 sm:py-16">
          <p className="label-mono">Your next step</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">Tell me what your business needs.</h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Share your idea, the problem you want to solve, or what needs improving. I read every message and reply {site.responseWindow}.
          </p>
          <Link href="/contact" className={buttonVariants({ size: "lg", className: "mt-8" })}>
            Start a project <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}
