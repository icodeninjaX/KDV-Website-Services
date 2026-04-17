"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FadeIn } from "./FadeIn";
import { CountUp } from "./CountUp";
import { Magnetic } from "./Magnetic";

type Stat =
  | { value: number; prefix?: string; suffix?: string; label: string }
  | { static: string; label: string };

const stats: Stat[] = [
  { value: 20, suffix: "+", label: "PH businesses shipped" },
  { value: 98, label: "Avg. Lighthouse score" },
  { static: "< 1 day", label: "Reply time" },
  { value: 85, suffix: "%", label: "Clients retained" },
];

const headlineContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const headlineLine: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function Hero() {
  const reduce = useReducedMotion();
  const lineTransition = {
    duration: reduce ? 0.2 : 0.7,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <section className="relative overflow-x-hidden">
      <div className="container-page py-16 sm:py-24 lg:py-36">
        <FadeIn mount>
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-white/60 backdrop-blur">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-white/75">2 slots open</span>
            <span className="text-white/25">&middot;</span>
            <span>Booking May 2026</span>
          </div>
        </FadeIn>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={headlineContainer}
          className="mt-6 sm:mt-7 max-w-4xl font-display font-extrabold tracking-tight text-white leading-[1.05] sm:leading-[1.08]"
        >
          <motion.span
            variants={headlineLine}
            transition={lineTransition}
            className="block text-[2rem] sm:text-5xl lg:text-[5.5rem]"
          >
            Websites,
          </motion.span>
          <motion.span
            variants={headlineLine}
            transition={lineTransition}
            className="block text-[2rem] sm:text-5xl lg:text-[5.5rem]"
          >
            dashboards,
          </motion.span>
          <motion.span
            variants={headlineLine}
            transition={lineTransition}
            className="block text-[2rem] sm:text-5xl lg:text-[5.5rem]"
          >
            &amp; apps that <span className="text-gradient">grow</span> your business.
          </motion.span>
        </motion.h1>

        <FadeIn mount delay={0.45}>
          <p className="mt-6 sm:mt-8 max-w-xl text-[15px] sm:text-lg leading-relaxed text-white/55">
            Kumusta! I&rsquo;m Keith. I partner with Philippine small and mid-sized
            businesses to ship fast, polished web products — from marketing sites to
            internal dashboards. Thoughtful design, modern stack, no agency overhead.
          </p>
        </FadeIn>

        <FadeIn mount delay={0.52}>
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link href="/contact">
                <Button size="lg">
                  Start a project <ArrowRight size={16} />
                </Button>
              </Link>
            </Magnetic>
            <Magnetic strength={0.15}>
              <Link href="/portfolio">
                <Button size="lg" variant="outline">
                  See recent work
                </Button>
              </Link>
            </Magnetic>
          </div>
        </FadeIn>

        <FadeIn mount delay={0.62}>
          <div className="mt-12 sm:mt-16 grid grid-cols-2 gap-x-5 gap-y-6 border-t border-white/[0.07] pt-8 sm:gap-x-8 sm:pt-10 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-2xl sm:text-3xl font-bold text-white tabular-nums">
                  {"static" in stat ? (
                    stat.static
                  ) : (
                    <CountUp
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  )}
                </div>
                <div className="mt-1 text-xs sm:text-sm text-white/40">{stat.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
